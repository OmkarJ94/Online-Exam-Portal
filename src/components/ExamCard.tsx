"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, BarChart, FileText } from "lucide-react";
import { Exam } from "@/types/exam";


export const ExamCard = ({ title, description, duration, questions, status, _id, category }: Exam) => {
    const router = useRouter();
    const statusColors = {
        available: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        upcoming: "bg-yellow-100 text-yellow-800",
    };

    const handleAction = () => {
        router.push(`/exam-verification?examId=${_id}&topic=${category}`);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{questions} questions</span>
                    </div>

                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleAction}
                    disabled={status != "available"}
                    className="w-full cursor-pointer"
                >
                    {status === "available"
                        ? "Start Exam"
                        : status === "completed"
                            ? "View Results"
                            : "Coming Soon"}
                </Button>
            </CardFooter>
        </Card>
    );
};