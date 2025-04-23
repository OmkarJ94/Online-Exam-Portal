"use client";

import React, { useEffect, useState } from "react";
import { Exam, Result } from "@/types/exam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTopics } from "@/utils/exam/getAllTopics";
import { getResults } from "@/utils/exam/getAllResults";
import { ExamCard } from "@/components/ExamCard";
import { BarChart, FileText } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";

const Dashboard = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResult] = useState<Result[]>([]);

  const fetchData = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    try {
      const [getAllExamsRes, getAllResults] = await Promise.all([
        getTopics(),
        getResults()
      ]);

      if (getAllExamsRes.data) {
        setExams(getAllExamsRes.data.exams);
      }

      if (getAllResults.data) {
        setResult(getAllResults.data.results);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (exams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="exams" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <TabsList>
                <TabsTrigger value="exams" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Available Exams</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center cursor-pointer">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>My Results</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="exams" className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Exams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.map((exam, index) => (
                    <ExamCard key={index} {...exam} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Exams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {results.map((result, index) => (
                    <ResultCard key={index} {...result} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
