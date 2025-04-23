import { Exam, GetExamResponse } from "@/types/exam";
import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";

export async function getTopics() {
  const res = await handleApiFetch("/api/topics");

  return handleApiResponse<GetExamResponse>(res);
}
