import Exam from "@/Database/Models/topic";
import connectDb from "@/Database/connection";

export async function GET() {
  try {
    await connectDb();
    const exams = await Exam.find();

    if (!exams || exams.length === 0) {
      return Response.json({ error: "No exams found" }, { status: 404 });
    }

    return Response.json({ exams, status: 200 });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
