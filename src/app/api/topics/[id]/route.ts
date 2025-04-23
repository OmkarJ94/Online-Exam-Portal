import { NextRequest } from "next/server";
import Exam from "@/Database/Models/topic";
import connectDb from "@/Database/connection";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    await connectDb();
    const exam = await Exam.findById(id);

    if (!exam) {
      return Response.json({ error: "Exam not found", status: 404 });
    }

    return Response.json({
      exam,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return Response.json({
      error: "Server error",
      status: 500,
    });
  }
}
