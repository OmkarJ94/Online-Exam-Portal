"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/utils/user/getUser";
import { submitMessage } from "@/utils/user/submitMessage";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface AppUser {
    name: string;
    email: string;
}

const ContactSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
});

const ContactForm = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter()
    const handleSubmit = async (values: { message: string }) => {
        setLoading(true);
        try {
            const submitMessageRes = await submitMessage(user!.sub, values.message)
            if (submitMessageRes.success) {
                toast({
                    title: "Message Sent",
                    description: "We’ll get back to you soon.",
                });
                router.push("/")
            } else {
                toast({
                    title: "Failed to send",
                    description: "Something went wrong",
                    variant: "destructive",
                });
            }
        } catch (err) {
            toast({
                title: "Failed to send",
                description: "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser();
                if (res.success) {
                    setUser(res.data.user);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to fetch user details",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong while fetching user data",
                    variant: "destructive",
                });
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Loading user info...
            </div>
        );
    }

    return (
        <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
            <Card className="w-full max-w-xl mx-4">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Contact Us</CardTitle>
                    <CardDescription className="text-center">
                        We'd love to hear from you!
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {loading && (
                        <div className="flex justify-center mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-gray-200 animate-spin fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                            >
                                <path
                                    d="M100 50.6C100 78.2 77.6 100.6 50 100.6C22.4 100.6 0 78.2 0 50.6C0 23 22.4 0.6 50 0.6C77.6 0.6 100 23 100 50.6Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.97 39.04C96.39 38.4 97.86 35.91 97.01 33.55C95.29 28.82 92.87 24.37 89.82 20.35..."
                                    fill="currentFill"
                                />
                            </svg>
                        </div>
                    )}

                    <Formik
                        initialValues={{ message: "" }}
                        validationSchema={ContactSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <Input id="name" name="name" value={user.name} disabled />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Input id="email" name="email" value={user.email} disabled />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="message"
                                        name="message"
                                        placeholder="Type your message"
                                        className="w-full h-32 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="message"
                                        component="div"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                                    {isSubmitting || loading ? "Sending..." : "Submit"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <div className="text-sm text-gray-500 text-center">
                        You can also reach us at{" "}
                        <a href="mailto:ojadhav512@email.com" className="text-primary hover:underline">
                            ojadhav512@email.com
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
};

export default ContactForm;
