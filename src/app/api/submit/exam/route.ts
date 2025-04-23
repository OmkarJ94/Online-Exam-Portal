import connectDb from "@/Database/connection";
import { NextResponse } from "next/server";
import amqp from "amqplib";
import result from "@/Database/Models/result";
import { sendToQueue } from "@/rabbitmq/producer";
import { Question } from "@/types/exam";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const questionListRaw = formData.get("questionList") as string;
    const selectedAnswersRaw = formData.get("selectedAnswers") as string;
    const examId = formData.get("examId");
    const startTime = formData.get("startTime");
    const submissionTime = formData.get("submissionTime");
    const video = formData.get("video") as File | null;
    await connectDb();

    let questionList = [];
    let selectedAnswers = [];
    let userInfo;
    try {
      const cookieStore = await cookies();
    cookieStore.toString();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) {
      return Response.json({ message: "Unauthorized", status: 401 });
    }

    const userInfoRes = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    userInfo = await userInfoRes.json();
      questionList = JSON.parse(questionListRaw || "[]");
      selectedAnswers = JSON.parse(selectedAnswersRaw || "[]");
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid JSON in fields" },
        { status: 400 }
      );
    }

    let score = 0;
    questionList.forEach((q: Question, i: number) => {
      const key = `${selectedAnswers[i]}_correct`;
      if (selectedAnswers[i] !== "-1" && q.correct_answers?.[key] === "true") {
        score++;
      }
    });

    const createdResult = await result.create({
      questionList,
      examId,
      score,
      startTime,
      submissionTime,
      selectedAnswers,
      userId: userInfo.sub,
      videoUrl: "_",
    });
    if (video) {
      const bytes = await video.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const videoPath = video.name;

      const connection = await amqp.connect(
        process.env.RABBITMQ_URL!
      );
      const channel = await connection.createChannel();
      const queue = "video_upload_queue";
      await channel.assertQueue(queue, { durable: true });

      const message = {
        buffer: buffer.toString("base64"),
        resultId: createdResult._id,
      };

      await sendToQueue(queue, message);
      console.log("Video upload task sent to queue:", message);

      await channel.close();
      await connection.close();
    }

    return NextResponse.json({
      message: "Exam submitted",
      score,
      total: questionList.length,
      examId,
      startTime,
      submissionTime,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
