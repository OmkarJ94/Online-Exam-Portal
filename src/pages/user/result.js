import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
function Result({ data }) {
    const router = useRouter()
    const { token } = router.query
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token === null || !(Array.isArray(data))) {
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
    }, [router.query])

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-19 mx-auto">
                <div className="flex flex-wrap -m-4" >

                    {
                        (!(Array.isArray(data)) || (data?.length === 0)) ?
                            <div className="container px-5 py-19 mx-auto">
                                <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 text-center mt-9">You Have Not Given Any Test</h2>
                                <div className="p-2 w-full">
                                    <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={() => { router.push(`/user/test?token=${token}`) }}>Check Test</button>
                                </div>
                            </div>
                            :
                            Array.isArray(data) && data?.map((item, index) => {

                                return (
                                    <div className="p-4 lg:w-1/3" key={index}>
                                        <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                                            {/* <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Subject : {data[index]?.exam[0].subject}</h2> */}
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Score : {item?.score} / 10</h2>
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Time Duration : 10 Minutes</h2>
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Taken time duration : {item.timetaken} Minutes</h2>
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Start time : {item.start}</h2>
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Submission Time/Date : {item.submissiontime}</h2>
                                            <h2 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">No Of Question Solved : {item.exam.length}</h2>

                                            <Link href={`viewtest?index=${index}&id=${router.query.id}`} className="text-indigo-500 inline-flex items-center">View Test
                                                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M5 12h14"></path>
                                                    <path d="M12 5l7 7-7 7"></path>
                                                </svg>
                                            </Link>

                                        </div>
                                    </div>



                                )
                            })
                    }
                </div>
            </div>
        </section>

    )
}
export async function getServerSideProps(context) {
    const { id } = context.query
    let host = process.env.NODE_ENV === "development" ? "http" : "https"

    const response = await fetch(`${host}://${context.req.headers.host}/api/getmarks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id
        }),
    })

    const data = await response.json()
    return {
        props: { data }, // will be passed to the page component as props
    }
}

export default Result