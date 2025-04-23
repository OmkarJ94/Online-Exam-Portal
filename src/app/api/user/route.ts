import connectDb from "@/Database/connection";
import { cookies } from "next/headers";

export async function GET(req: Request, res: Response) {
  try {
    await connectDb();
    const cookieStore = await cookies();
    cookieStore.toString();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
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
    return new Response(JSON.stringify({ user: userInfo }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
