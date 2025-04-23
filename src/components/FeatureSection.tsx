
import React from "react";
import { Shield, Camera, Clock, LockKeyhole } from "lucide-react";

const features = [
  {
    name: "Camera Proctoring",
    description:
      "Our system uses your webcam to ensure exam integrity with AI-powered monitoring.",
    icon: Camera,
  },
  {
    name: "Secure Authentication",
    description:
      "One-time passwords (OTP) provide additional security to verify your identity.",
    icon: LockKeyhole,
  },
  {
    name: "Time Management",
    description:
      "Built-in timer helps you manage your time effectively during exams.",
    icon: Clock,
  },
  {
    name: "Cheat Prevention",
    description:
      "Multiple security layers including tab detection and screen monitoring.",
    icon: Shield,
  },
];

const FeatureSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Advanced Exam Security Features
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our platform combines multiple technologies to ensure exam integrity
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
