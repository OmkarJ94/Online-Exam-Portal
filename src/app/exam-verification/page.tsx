"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CameraVerification from "@/components/CameraVerification";
import { sendOtp } from "@/utils/email/send-otp";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { verifyOtp } from "@/utils/email/verify-otp";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

const ExamVerification = () => {
  const [step, setStep] = useState<"camera" | "otp">("camera");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams()
  const topic = searchParams?.get("topic");
  const examId = searchParams?.get("examId");

  const handleCameraVerificationComplete = async () => {
    setStep("otp");
    await sendOtp();
    toast({
      title: "Verification Code Sent",
      description: "Enter the OTP sent to your registered email",
    });
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    elem.requestFullscreen();
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    const verifyOtpRes = await verifyOtp(values.otp)
    if (verifyOtpRes.success) {
      toast({
        title: "OTP Verified",
        description: "You can now start your exam",
      });
      router.push(`/exam?examId=${examId}&topic=${topic}`);
      enterFullscreen()
    }
    else {
      toast({
        title: "Invalid or Expired Code",
        description:
          "The code you entered is incorrect or has expired. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md mx-4">
          {step === "camera" ? (
            <CameraVerification onVerificationComplete={handleCameraVerificationComplete} />
          ) : (
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Exam Access Code</CardTitle>
                <CardDescription>
                  Enter the verification code sent to your email to start the exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={otpSchema}
                  onSubmit={handleVerifyOtp}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div className="space-y-2">
                        <Field
                          as={Input}
                          type="text"
                          name="otp"
                          maxLength={6}
                          placeholder="Enter 4-digit verification code"
                        />
                        {errors.otp && touched.otp && (
                          <p className="text-sm text-red-500">{errors.otp}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Verify & Start Exam
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="text-sm text-gray-500">
                  <button
                    onClick={() => setStep("camera")}
                    className="text-primary hover:underline"
                  >
                    Go back to camera verification
                  </button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamVerification;
