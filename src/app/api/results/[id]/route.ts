import result from "@/Database/Models/result";
import topic from "@/Database/Models/topic";
import connectDb from "@/Database/connection";
import { Result } from "@/types/exam";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const { id } = await params;
    const resultDoc = await result.findById(id);

    if (!resultDoc) {
      return Response.json({ error: "Result not found" }, { status: 404 });
    }

    const exam = await topic.findById(resultDoc.examId);
    const examTitle = exam?.title || "Untitled Exam";

    const singleResult: Result = {
      id: resultDoc._id,
      questionList: resultDoc.questionList,
      examId: resultDoc.examId.toString(),
      score: resultDoc.score,
      startTime: resultDoc.startTime,
      submissionTime: resultDoc.submissionTime,
      selectedAnswers: resultDoc.selectedAnswers,
      userId: resultDoc.userId.toString(),
      examTitle,
    };

    return Response.json({ result: singleResult, status: 200 });
  } catch (error) {
    console.error("Error fetching single result:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
