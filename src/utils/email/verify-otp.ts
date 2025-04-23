import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function verifyOtp(otp: string, shouldDelete = false) {
  const res = await handleApiFetch(
    `/api/otp/verify?shouldDelete=${shouldDelete}`,
    {
      method: "POST",
      body: { otp },
    }
  );

  return handleApiResponse(res);
}
