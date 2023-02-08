import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react'
const jwt = require('jsonwebtoken')
import User from "../../../Models/User"
var authenticate = require('../../pages/api/authentication')
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile({ user }) {
    
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        
        if (token === null || token != router.query.token) {
            toast.error('You Must be login', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            localStorage.removeItem("token")
            setTimeout(() => {
                router.push("/login")
            }, 500)

        }



    }, [])

    const send = () => {
        toast.error('You Must be login', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        router.push("/login")
    }
    return (
        <>


            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Your Profile</h1>

                    </div>
                    <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">

                                Name : {user?.name}
                            </div>
                        </div>
                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">

                                Email : {user?.email}
                            </div>
                        </div>
                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                                Passing Year : {user?.passing_year}
                            </div>
                        </div>
                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                                Branch : {user?.branch}
                            </div>
                        </div>
                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                                Mobile Number : {user?.phone}
                            </div>
                        </div>

                        <div className="p-2 sm:w-1/2 w-full">
                            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                                Semister : {user?.semister}
                            </div>


                        </div>
                    </div>



                </div>
            </section>
            <section className="text-gray-600 body-font relative">
                <div className="container px-5 py-0 mx-auto">

                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <button
                                        className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                                        type="button"
                                        onClick={() => router.push(`/user/edit?token=${router.query.token}`)}
                                    >
                                        Edit
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.query

    let host = process.env.NODE_ENV === "development" ? "http" : "https"
    const response = await fetch(`${host}://${context.req.headers.host}/api/getuser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token
        }),
    })
    let user = "";
    if (response.status === 200) {
        user = await response.json()
    }

    return {
        props: { user }
    }
}
export default Profile