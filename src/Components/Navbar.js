import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Navbar() {
    const router = useRouter()
    const [token, setToken] = useState("")
    useEffect(() => {
        const token = localStorage.getItem("token")
        setToken(token)

        if (token) {
            setToken(token)
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
    if (token) {


        return (
            <div>
                <ToastContainer />
                <header className="text-gray-600 body-font">
                    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                        <Link className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href="">
                            <span className="ml-3 text-xl">Online Exam Portal</span>
                        </Link>
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">

                            <Link className="mr-5 hover:text-gray-900" href={`/user/test?token=${token}`}>Check Test</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/profile?token=${token}`}>View Profile</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/result?token=${token}`}>View Result</Link>
                            <Link className="mr-5 hover:text-gray-900" href="/about">About Us</Link>
                            <Link className="mr-5 hover:text-gray-900" href={`/user/contact?token=${token}`}>Contact Us</Link>
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