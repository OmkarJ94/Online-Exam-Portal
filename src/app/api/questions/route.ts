import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty") || "easy";
  const limit = "20";

  if (!category) {
    return NextResponse.json(
      { error: "Missing required query parameters." },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.QUESTIONS_API_KEY;
    const baseUrl = process.env.QUESTIONSAPI_URL;

    if (!apiKey || !baseUrl) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const apiUrl = `${baseUrl}/questions?apiKey=${apiKey}&category=${category}&difficulty=${difficulty}&limit=${limit}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || "Failed to fetch questions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error fetching questions:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
