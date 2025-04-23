import connectDb from "@/Database/connection";
import MessageModel from "@/Database/Models/message";

export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();
    const { userId, message } = body;

    await MessageModel.create({ userId, message });

    return Response.json({ message: "Message saved", status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ message: "Internal Server Error", status: 500 });
  }
}
