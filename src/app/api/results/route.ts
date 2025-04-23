import result from "@/Database/Models/result";
import topic from "@/Database/Models/topic";
import connectDb from "@/Database/connection";
import { Result } from "@/types/exam";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDb();
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
    const userInfo = await userInfoRes.json();
    const results = await result.find({userId:userInfo.sub}).sort({submissionTime:-1});

    if (!results) {
      return Response.json({ error: "No results found" }, { status: 404 });
    }
    const examCache: Record<string, string> = {};
    const updatedResults: Result[] = [];
    for (let result of results) {
      const examId = result.examId.toString();

      if (!examCache[examId]) {
        const exam = await topic.findById(examId);
        examCache[examId] = exam?.title || "Untitled Exam";
      }

      updatedResults.push({
        id: result._id,
        questionList: result.questionList,
        examId: result.examId.toString(),
        score: result.score,
        startTime: result.startTime,
        submissionTime: result.submissionTime,
        selectedAnswers: result.selectedAnswers,
        userId: result.userId.toString(),
        examTitle: examCache[examId],
      });
    }

    return Response.json({ results: updatedResults, status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
