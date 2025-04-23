"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, BarChart, FileText, CheckCircle, LockKeyhole } from "lucide-react";
import { Exam, Result } from "@/types/exam";
import { intervalToDuration } from "date-fns"

export const ResultCard = ({ examId, questionList, score, selectedAnswers, startTime, submissionTime, userId, examTitle, id }: Result) => {
    const router = useRouter();
    const statusColors = {
        available: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        upcoming: "bg-yellow-100 text-yellow-800",
    };
    const end = new Date(submissionTime);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{examTitle}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                        <LockKeyhole className="mr-2 h-4 w-4" />
                        <span>{end.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Score: {score}</span>
                    </div>

                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => {
                        router.push(`/result/${id}`)
                    }}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};