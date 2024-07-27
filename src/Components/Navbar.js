import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Navbar() {
    const router = useRouter()
    const [userId, setUserId] = useState("")
    const getUser = async (token) => {
        try {
            const response = await fetch("/api/getuserbytoken", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token
                }),
            })
            const user = await response.json()
            if (response.status === 200) {
                return user
            }
        }
        catch (e) {

        }
    }
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const user = getUser(token)
            .then((response)=>{
                setUserId(response._id)
            })
            .catch((error) => {
                toast.error("Something Went Wrong", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        }
    }, [router.query])

    const handleLogOut = async () => {

        try {
            localStorage.removeItem("token")
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token
                })
            })
            if (response.status === 200) {
                toast.success('Logout Successfully', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {

                    router.push("/login")
                }, 500)
            }
        }
        catch (err) {

        }
    }
    if (userId != "") {
        return (
            <div>
                <ToastContainer />
                <header className="text-gray-600 body-font">
                    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                        <Link className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href="">
                            <span className="ml-3 text-xl">Online Exam Portal</span>
                        </Link>
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">

                            <Link className="mr-5 hover:text-gray-900" href={`/user/test?id=${userId}`}>Check Test</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/profile?id=${userId}`}>View Profile</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/result?id=${userId}`}>View Result</Link>
                            <Link className="mr-5 hover:text-gray-900" href="/about">About Us</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/contact?id=${userId}`}>Contact Us</Link>
                        </nav>
                        <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleLogOut}>Log Out</button>
                    </div>
                </header >
            </div >
        )
    }
    else {
        return (
            <div>
                <ToastContainer />
                <header className="text-gray-600 body-font">
                    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                        <Link className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href="">

                            <span className="ml-3 text-xl">Online Exam Portal</span>
                        </Link>
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                            <Link className="mr-5 hover:text-gray-900" href="/login">Log In</Link>
                            <Link className="mr-5 hover:text-gray-900" href="/signup">SignUp</Link>
                            <Link className="mr-5 hover:text-gray-900" href="/about">About Us</Link>
                        </nav>

                    </div>
                </header >
            </div >
        )
    }
}

export default Navbar