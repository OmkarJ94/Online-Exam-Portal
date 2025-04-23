
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Camera, CameraOff } from "lucide-react";
import { CameraVerificationProps } from "@/types/exam";



const CameraVerification = ({ onVerificationComplete }: CameraVerificationProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]); const [cameraEnabled, setCameraEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (cameraEnabled && videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);


  const startCamera = async () => {
    try {
      setLoading(true);
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => {
              setVideoReady(true);
            };
          }

          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = event => {
            recordedChunks.current.push(event.data);
          };
          mediaRecorderRef.current.start();
        })
        .catch(() => {
          toast({
            title: "Camera Access is required",
            description: "Camera access is required to monitor your exam. Please allow access to your camera to continue the test.",
            variant: "destructive",
          });
        });


      setCameraEnabled(true);
      toast({
        title: "Camera Access Granted",
        description: "We can now verify your identity",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Denied",
        description: "You must allow camera access to take the exam",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    recordedChunks.current = [];
    setCameraEnabled(false);
    setVideoReady(false)

    toast({
      title: "Camera Disabled",
      description: "Camera has been successfully turned off",
    });
  };


  const verifyIdentity = () => {
    setLoading(true);
    // In a real app, we would take a snapshot and verify identity
    // For demo purposes, we'll simulate a successful verification after 2 seconds
    setTimeout(() => {
      toast({
        title: "Identity Verified",
        description: "You can now proceed to the exam",
      });
      setLoading(false);
      onVerificationComplete();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Camera Verification</CardTitle>
        <CardDescription>
          We need to verify your identity with your camera before you can take the exam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full overflow-hidden rounded-lg bg-gray-100" style={{ minHeight: "240px" }}>
          {cameraEnabled ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <CameraOff className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Camera is not enabled</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {cameraEnabled ? (
          <>
            <Button variant="outline" onClick={stopCamera} disabled={loading}>
              <CameraOff className="mr-2 h-4 w-4" />
              Disable Camera
            </Button>
            <Button onClick={verifyIdentity} disabled={loading || !videoReady}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={startCamera} disabled={loading}>
            <Camera className="mr-2 h-4 w-4" />
            {loading ? "Requesting Camera..." : "Enable Camera"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CameraVerification;
