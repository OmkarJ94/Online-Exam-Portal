export interface FetchQuestionsParams {
  category: string;
  difficulty: string;
  limit?: number;
}

export interface CameraVerificationProps {
  onVerificationComplete: () => void;
}

export interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: number;
  status: string;
  category: string;
}

export interface GetExamResponse {
  exams: Exam[];
}

export interface AnswerOptions {
  answer_a: string | null;
  answer_b: string | null;
  answer_c: string | null;
  answer_d: string | null;
  answer_e: string | null;
  answer_f: string | null;
}
interface CorrectAnswers {
  [key: string]: "true" | "false";
}
export interface Question {
  id: number;
  question: string;
  description: string;
  answers: AnswerOptions;
  multiple_correct_answers: "true" | "false";
  correct_answers: CorrectAnswers;
  explanation: string;
  tip: string | null;
  tags: string[];
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  correct_answer: string;
}

export interface SubmitExamPayload {
  questionList: Question[];
  selectedAnswers: string[];
  examId: string;
  startTime: string;
  submissionTime: string;
  videoBlob: Blob | undefined;
}

export interface Result {
  id: string;
  questionList: Question[];
  examId: string;
  score: number;
  startTime: string;
  submissionTime: string;
  selectedAnswers: string[];
  userId: string;
  examTitle: string;
}

export interface GetAllResultResponse {
  results: Result[];
}
export interface GetResultByIdResponse {
  result: Result;
}
