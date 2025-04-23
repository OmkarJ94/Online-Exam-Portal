import { handleApiFetch, handleApiResponse } from "@/utils/handleApiRequest";
import { SubmitExamPayload } from "@/types/exam";

export async function submitExam({
  questionList,
  selectedAnswers,
  examId,
  startTime,
  submissionTime,
  videoBlob,
}: SubmitExamPayload & { videoBlob?: Blob }) {
  const formData = new FormData();

  formData.append("questionList", JSON.stringify(questionList));
  formData.append("selectedAnswers", JSON.stringify(selectedAnswers));
  formData.append("examId", examId);
  formData.append("startTime", startTime);
  formData.append("submissionTime", submissionTime);

  if (videoBlob) {
    const videoFile = new File([videoBlob], `${examId}.webm`, {
      type: "video/webm",
    });
    formData.append("video", videoFile);
  }

  const res = await handleApiFetch("/api/submit/exam", {
    method: "POST",
    body: formData,
  });

  return handleApiResponse(res);
}
