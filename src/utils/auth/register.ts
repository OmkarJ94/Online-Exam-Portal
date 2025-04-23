// services/registerUser.ts

import { RegisterUserRequestBody } from "@/types/auth";
import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function registerUser(payload: RegisterUserRequestBody) {
  const res = await handleApiFetch("/api/register", {
    method: "POST",
    body: payload,
  });

  return handleApiResponse(res);
}
