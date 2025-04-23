import { LoginCredentials } from "@/types/auth";

export async function login(
  values: LoginCredentials
): Promise<{ success?: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.email,
        password: values.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data?.error_description || data?.error || "Login failed",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      error: error.message || "Unexpected error occurred",
    };
  }
}
