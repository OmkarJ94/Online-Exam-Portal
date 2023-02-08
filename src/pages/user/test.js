import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import Link from 'next/link'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function test({ subjectCode }) {

    const router = useRouter()
    const [data, setdata] = useState({
        subject: "Linux",
        code: "",
        difficulty: "Easy"
    })
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState({ code: subjectCode.code, expireIn: 0 })
    const sendEmail = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sendemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: router.query.token
                }),
            })
            if (response.status === 200) {
                const temp = await response.json()
                setCode({ code: temp.code, expireIn: temp.expireIn - new Date().getTime() })
                toast.success('Code sent your email id', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            else {
                toast.error('Something Went Wrong', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
        catch (e) {
            toast.error('Something Went Wrong', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }
    }


    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setdata({ ...data, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!data.code || !data.difficulty || !data.subject) {

            toast.error('Enter Valid Credentials', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false)
            return;
        }
        try {

            if ((code.code === Number(data?.code)) && (code.expireIn >= 0)) {
                localStorage.setItem("actualcode", JSON.stringify(code))


                router.push(`questionlist?category=${data.subject}&difficulty=${data.difficulty}&code=${data.code}`)


            }
            else {
                toast.error('Check Code Again', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }


        } catch (error) {
            
            toast.error('Enter Valid Credentials', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        setLoading(false)
    }
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

            setTimeout(() => {
                router.push(`${process.env.NEXT_PUBLIC_HOST}login`)
            }, 500)

        }


    }, [])
    return (
        <div>
            <div><section className="text-gray-600 body-font relative">
                <ToastContainer />

                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Please Enter the Details</h1>
                        {loading && <div className="flex flex-wrap justify-center mb-5">
                            <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>}
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label htmlFor="subject" className="leading-7 text-sm text-gray-600">Select a Subject</label>
                                    <select id="subject" name="subject" value={data.subject} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out" >
                                        <option value="Linux">Linux</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="bash">Bash</option>
                                        <option value="docker">Docker</option>
                                        <option value="sql">SQL</option>
                                        <option value="cms">Content Management System</option>
                                        <option value="code">Code</option>

                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap -m-2">
                                <div className="p-2 w-full">
                                    <div className="relative">
                                        <label htmlFor="difficulty" className="leading-7 text-sm text-gray-600">Select a Difficulty</label>
                                        <select id="difficulty" name="difficulty" value={data.difficulty} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out" >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-2 w-full">
                                    <div className="relative">
                                        <label htmlFor="code" className="leading-7 text-sm text-gray-600">Paper Code</label>
                                        <input type="password" id="code" name="code" value={data.code} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        <p>Paper Code is sent to your mail id. For Resending <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => { sendEmail() }}>Click Here</span></p>
                                    </div>
                                </div>

                                <div className="p-2 w-full">

                                    <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleSubmit}>Start Exam</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section></div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.query


    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sendemail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token
        }),
    })

    let code;
    code = await response.json()

    
    return {
        props: { subjectCode: code }
    }
}

export default test