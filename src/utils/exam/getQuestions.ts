import { FetchQuestionsParams, Question } from "@/types/exam";
import { handleApiFetch, handleApiResponse } from "../handleApiRequest";

export async function getQuestions(category: string) {
  const res = await handleApiFetch(`/api/questions?category=${category}`);

  return handleApiResponse(res);
}
