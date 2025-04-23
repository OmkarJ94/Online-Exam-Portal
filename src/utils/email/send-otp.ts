import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function sendOtp() {
  const res = await handleApiFetch("/api/otp/send", {
    method: "POST",
  });

  return handleApiResponse(res);
}
