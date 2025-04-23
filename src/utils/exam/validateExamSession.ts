"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const validateExamSession = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user.verified) {
    return true;
  }
  return false;
};
