import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password, institution } = await req.json();

  try {
    const tokenRes = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("Admin token error:", tokenData);
      return NextResponse.json(
        { error: "Failed to authenticate admin" },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    const createUserRes = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email,
          enabled: true,
          firstName: name,
          attributes: {
            institution: [institution || ""],
          },
          credentials: [
            {
              type: "password",
              value: password,
              temporary: false,
            },
          ],
        }),
      }
    );

    if (createUserRes.status !== 201) {
      const error = await createUserRes.text();
      console.error("User creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
