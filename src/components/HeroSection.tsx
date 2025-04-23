
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

const HeroSection = async () => {
  const cookie = await cookies()
  return (
    <div className="py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Secure Onlinget-se</span>
              <span className="block text-primary">Exam Platform</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Take exams securely from anywhere with our advanced camera proctoring and OTP verification system.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="ml-2 text-gray-700">AI-powered proctoring</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="ml-2 text-gray-700">Secure OTP verification</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="ml-2 text-gray-700">Real-time monitoring</span>
              </div>
            </div>
            <div className="mt-8">
              {cookie.get("access_token") ?
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="cursor-pointer">
                    Go to Dashboard
                  </Button>
                </Link>
                :
                <Link href="/register">
                  <Button size="lg" className="mr-4 cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              }

              {/* <Link href="/learn-more">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link> */}
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Student taking online exam"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
