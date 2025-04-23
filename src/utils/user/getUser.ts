import { User } from "@/types/user";
import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function getUser() {
  const res = await handleApiFetch("/api/user");

  return handleApiResponse(res);
}
