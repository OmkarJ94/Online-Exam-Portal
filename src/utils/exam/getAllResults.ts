import { GetAllResultResponse, Result } from "@/types/exam";
import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function getResults() {
  const res = await handleApiFetch("/api/results");

  return handleApiResponse<GetAllResultResponse>(res);
}
