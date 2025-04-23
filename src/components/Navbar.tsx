
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/utils/get-session";
import { logout } from "@/utils/auth/logOut";
import { useToast } from "@/hooks/use-toast";
import { allowedRoutes } from "@/constants/auth";

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast();

  const fetchSession = async () => {
    const session = await getSession()
    if (session && !isLoggedIn) {
      setIsLoggedIn(true);
    } else if (!session && isLoggedIn) {
      setIsLoggedIn(false);
    }

  }

  const handleLogout = async () => {
    try {
      const logOutRes = await logout();
      if (logOutRes.success) {
        router.push("/login");
      } else {
        toast({
          title: "Logout Failed!",
          description: "An error occurred while logging out. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      toast({
        title: "Error!",
        description: "Something went wrong while logging you out. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSession()
  }, [pathname])
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary" />
            <Link href="/" className="ml-2 text-xl font-bold text-primary">
              ExamEyeVerify
            </Link>
          </div>
          <div className="flex items-center space-x-4">

            {isLoggedIn ?
              <Button variant="outline" onClick={handleLogout} className="cursor-pointer">Logout</Button>
              : <>
                <Button variant="outline" onClick={() => {
                  router.push("/login")
                }} className="cursor-pointer">Login</Button>


                <Button onClick={() => {
                  router.push("/register")
                }} className="cursor-pointer">Register</Button>
              </>
            }

          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
