import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function logout() {
  const res = await handleApiFetch("/api/auth/log-out", {
    method: "POST",
  });

  console.log(res, "resss");

  return handleApiResponse(res);
}
