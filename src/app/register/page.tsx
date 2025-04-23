"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/auth/register";
const Register = () => {
  const { toast } = useToast();
  const router = useRouter();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    institution: Yup.string().optional(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const payload = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      password: values.password,
      institution: values.institution,
    };

    const { data, error } = await registerUser(payload);

    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Registration Successful",
      description: "You have successfully registered. Please login to continue.",
    });

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription>
              Create an account to start taking exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Field as={Input} name="firstName" placeholder="First Name" />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field as={Input} name="lastName" placeholder="Last Name" />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field as={Input} type="email" name="email" placeholder="Email" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field as={Input} type="password" name="password" placeholder="Password" />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field as={Input} type="password" name="confirmPassword" placeholder="Confirm Password" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field as={Input} name="institution" placeholder="Institution / College (optional)" />
                    <ErrorMessage name="institution" component="div" className="text-red-500 text-sm" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </div>
          </CardFooter>
        </Card>
      </main>

    </div>
  );
};

export default Register;
