import connectDb from "@/Database/connection";
import Otp from "@/Database/Models/otp";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

const mailer = async (email: string, code: number) => {
  const body = `
  We are sending you this code for your test on the Online Exam Portal.<br/>
  Please keep it secure and do not share it with anyone.<br/><br/>
    <h1>Code for the Test: <b>${code}</b></h1>
    <h3>This code is valid only for 5 minutes</h3>
    <h1>Best of luck for your test!</h1>
  `;

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Exam Paper Code",
    html: body,
  };

  await mailTransporter.sendMail(mailDetails);
};

export async function POST(req: Request, res: Response) {
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
    const userEmail = userInfo.email;

    if (!userEmail) {
      return new Response(
        JSON.stringify({ message: "Email not found in Keycloak profile" }),
        { status: 404 }
      );
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    await Otp.deleteMany({ email: userEmail });

    const expireIn = Date.now() + 5 * 60 * 1000;

    const Code = new Otp({ email: userEmail, Otp: code, expireIn });
    await Code.save();

    await mailer(userEmail, code);

    return new Response(JSON.stringify({ code, expireIn }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
