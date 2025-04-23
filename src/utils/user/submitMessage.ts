import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function submitMessage(userId: string, message: string) {
  const res = await handleApiFetch("/api/submit/message", {
    method: "POST",
    body: {
      userId,
      message,
    },
  });

  return handleApiResponse(res);
}
