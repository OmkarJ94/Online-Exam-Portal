"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Camera, Clock } from "lucide-react";
import { getQuestions } from "@/utils/exam/getQuestions";
import { Question, SubmitExamPayload } from "@/types/exam";
import { submitExam } from "@/utils/exam/submit-exam";
import { validateExamSession } from "@/utils/exam/validateExamSession";

const Exam = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(20).fill("-1")
  );
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"submit" | "timeout" | "leave">(
    "submit"
  );
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [startTime, setStartTime] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const topic = searchParams?.get("topic");
  const examId = searchParams?.get("examId");
  const videoRef = useRef<HTMLVideoElement>(null);

  const fullScreenExitTimeRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const tabTimeoutRef = useRef<number | null>(null);
  const fullscreenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const stopRecordingAndGetBlob = () => {
    return new Promise<Blob>((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        return reject("No active media recorder.");
      }

      if (mediaRecorderRef.current.state === "inactive") {
        return reject("Recording already stopped.");
      }

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunks.current, {
          type: "video/webm",
        });
        resolve(videoBlob);
      };

      mediaRecorderRef.current.onerror = (e) => {
        console.error("Recorder error:", e);
        reject(e);
      };

      mediaRecorderRef.current.stop();
    });
  };

  const stopCamera = () => {

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    recordedChunks.current = [];
  };

  const setupCamera = async () => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            recordedChunks.current.push(event.data);
          };
          mediaRecorderRef.current.start();
        })
        .catch(() => {
          toast({
            title:
              "Camera access is required to monitor your exam. Please allow access to your camera to continue the test.",
            description: "Unable to access camera. Exam may be affected.",
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Proctoring Error",
        description: "Unable to access camera. Exam may be affected.",
        variant: "destructive",
      });
    }
  };

  const clearFullScreenExitInterval = () => {
    if (tabTimeoutRef.current !== null) {
      clearInterval(tabTimeoutRef.current);
      tabTimeoutRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const confirmSubmit = async () => {
    let videoBlob;
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        videoBlob = await stopRecordingAndGetBlob();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.remove();
      }

      const payload: SubmitExamPayload = {
        questionList: questions,
        selectedAnswers,
        startTime,
        submissionTime: new Date().toISOString(),
        examId: examId ?? "",
        videoBlob,
      };

      const res = await submitExam(payload);

      if (res.success) {
        toast({
          title: "Exam Submitted",
          description: "Your results will be available in the dashboard.",
        });
      }

      await new Promise((res) => setTimeout(res, 100));
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => stream.getTracks().forEach((track) => track.stop()))
        .catch(() => { });

      router.push("/dashboard");
    } catch (e) {
      console.error("Error during submission:", e);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      fullScreenExitTimeRef.current = Date.now();
      toast({
        title: "Fullscreen Exited",
        description:
          "Return to fullscreen within 30 seconds or the exam will auto-submit.",
        variant: "destructive",
      });

      if (fullscreenTimeoutRef.current)
        clearTimeout(fullscreenTimeoutRef.current);

      fullscreenTimeoutRef.current = setTimeout(() => {
        confirmSubmit();
      }, 30000);
    } else {
      fullScreenExitTimeRef.current = null;
      if (fullscreenTimeoutRef.current) {
        clearTimeout(fullscreenTimeoutRef.current);
        fullscreenTimeoutRef.current = null;
      }
      toast({
        title: "Fullscreen Restored",
        description: "You are back in fullscreen mode.",
      });
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      const tabSwitchStartTime = Date.now();
      setTabSwitchCount((prev) => prev + 1);

      tabTimeoutRef.current = window.setInterval(() => {
        if (document.hidden && Date.now() - tabSwitchStartTime > 15000) {
          toast({
            title: "Tab Switch Timeout",
            description:
              "You’ve been on another tab too long. Auto-submitting.",
            variant: "destructive",
          });
          confirmSubmit();
          clearFullScreenExitInterval();
        }
      }, 1000);
    } else {
      clearFullScreenExitInterval();
    }
  };

  const initializeExam = async () => {
    const session = await validateExamSession();
    if (!topic || !examId || session) {
      toast({
        title: "Access Denied",
        description: "Start your exam from the dashboard.",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    const res = await getQuestions(topic);
    if (res.success) {
      setQuestions(res.data);
    } else {
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive",
      });
    }

    setStartTime(new Date().toISOString());
    await setupCamera();
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAlertType("timeout");
          setIsAlertOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return timer;
  };

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    const message =
      "Are you sure you want to leave? Exam progress will be lost.";
    e.returnValue = message;
    return message;
  };

  useEffect(() => {
    initializeExam();
    const timerId = startTimer();

    window.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    const confirmExamTimeoutId = setTimeout(() => {
      confirmSubmit();
    }, 20 * 60 * 1000);

    return () => {
      clearInterval(timerId);
      stopCamera();
      clearFullScreenExitInterval();
      if (fullscreenTimeoutRef.current)
        clearTimeout(fullscreenTimeoutRef.current);
      window.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(confirmExamTimeoutId);
    };
  }, []);

  useEffect(() => {
    if (tabSwitchCount === 0) return;
    toast({
      title: "Tab Switch Detected",
      description: `Switched ${tabSwitchCount} time(s). Max allowed is 3.`,
      variant: "destructive",
    });

    if (tabSwitchCount >= 3) confirmSubmit();
  }, [tabSwitchCount]);

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = value;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setAlertType("submit");
    setIsAlertOpen(true);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading questions...</p>
      </div>
    );
  }

  return (
    <>
      {!document.fullscreenElement ? (
        <div className="flex h-screen w-full justify-center items-center">
          <Button
            onClick={() => {
              document.documentElement.requestFullscreen();
            }}
          >
            Back to full screen
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {alertType === "submit"
                    ? "Submit Exam"
                    : alertType === "timeout"
                      ? "Time's Up!"
                      : "Leaving Exam?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {alertType === "submit"
                    ? "Are you sure you want to submit? You cannot change answers after."
                    : alertType === "timeout"
                      ? "Time has expired. Your exam will be submitted now."
                      : "Leaving the page may count as cheating. Do you want to proceed?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {alertType !== "timeout" && (
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                )}
                <AlertDialogAction onClick={confirmSubmit}>
                  {alertType === "timeout"
                    ? "OK"
                    : alertType === "submit"
                      ? "Submit Exam"
                      : "Leave Anyway"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="fixed top-0 right-0 w-1 h-1 opacity-0 pointer-events-none"
          />
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Proctoring Active</span>
              </div>
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="font-mono font-medium">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h1 className="text-xl font-bold mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </h1>
              <div className="mb-4 h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100
                      }%`,
                  }}
                />
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">
                    {questions[currentQuestion].question}
                  </h2>

                  <RadioGroup
                    value={selectedAnswers[currentQuestion]}
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {Object.entries(questions[currentQuestion].answers)
                      .filter(([_, val]) => val !== null)
                      .map(([key, val], idx) => (
                        <Label
                          key={idx}
                          htmlFor={`option-${key}`}
                          className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <RadioGroupItem value={key} id={`option-${key}`} />
                          <span>{val}</span>
                        </Label>
                      ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={handleNext}>Next</Button>
                ) : (
                  <Button onClick={handleSubmit}>Submit Exam</Button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Question Navigator</h2>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => (
                  <Button
                    key={idx}
                    variant={
                      idx === currentQuestion
                        ? "default"
                        : selectedAnswers[idx] !== "-1"
                          ? "outline"
                          : "secondary"
                    }
                    className={`h-10 w-10 p-0 ${selectedAnswers[idx] !== "-1" ? "bg-green-400" : ""
                      }`}
                    onClick={() => setCurrentQuestion(idx)}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {alertType === "submit"
                    ? "Submit Exam"
                    : alertType === "timeout"
                      ? "Time's Up!"
                      : "Leaving Exam?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {alertType === "submit"
                    ? "Are you sure you want to submit? You cannot change answers after."
                    : alertType === "timeout"
                      ? "Time has expired. Your exam will be submitted now."
                      : "Leaving the page may count as cheating. Do you want to proceed?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {alertType !== "timeout" && (
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                )}
                <AlertDialogAction onClick={confirmSubmit}>
                  {alertType === "timeout"
                    ? "OK"
                    : alertType === "submit"
                      ? "Submit Exam"
                      : "Leave Anyway"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
};

export default Exam;
