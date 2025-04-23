import { GetResultByIdResponse } from "@/types/exam";
import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function getResultById(id: string) {
  const res = await handleApiFetch(`/api/results/${id}`);

  return handleApiResponse<GetResultByIdResponse>(res);
}
