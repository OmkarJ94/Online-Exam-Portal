import { NextRequest } from "next/server";
import topic from "@/Database/Models/topic";
import connectDb from "@/Database/connection";
import { topicsData } from "@/constants/test";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await topic.deleteMany();
    await topic.insertMany(topicsData);

    return new Response(JSON.stringify({ message: "Seeded successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to seed exams" }), {
      status: 500,
    });
  }
}
