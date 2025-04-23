
import React from "react";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">ExamEyeVerify</span>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Secure online examination platform with advanced proctoring features.
              Take and administer tests with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </a>
              </li>

              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </li>

            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2025 ExamEyeVerify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
