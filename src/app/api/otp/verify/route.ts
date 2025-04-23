import connectDb from "@/Database/connection";
import Otp from "@/Database/Models/otp";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { otp } = await req.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const session = await getServerSession(authOptions);
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
    const userEmail = userInfo.email;

    if (!userEmail) {
      return new Response(
        JSON.stringify({ message: "Email not found in Keycloak profile" }),
        { status: 404 }
      );
    }

    const otpEntry = await Otp.findOne({ email: userEmail });

    if (!otpEntry || otpEntry.Otp !== Number(otp)) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired OTP" }),
        { status: 400 }
      );
    }

    if (otpEntry.expireIn < Date.now()) {
      return new Response(JSON.stringify({ message: "OTP has expired" }), {
        status: 400,
      });
    }

    if (session) {
      session.user.verified = true;
    }
    await Otp.deleteMany({ email: userEmail });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
