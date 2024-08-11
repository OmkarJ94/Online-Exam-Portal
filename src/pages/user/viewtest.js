import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router"

function Viewtest({ test }) {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token === null) {
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
                router.push("/login")
            }, 500)

        }


    }, [])
    return (
        <div>
            {(test.exam)?.length > 0 ? Object.keys(test.exam)?.map((question) => {
                return (
                    <section className="text-gray-600 body-font" key={test.exam[question].id}>
                        <div className="container px-5 py-24 mx-auto">
                            <div className="text-center mb-20">
                                <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">{test.exam[question]?.question}</h1>

                            </div>
                            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                                {Object.keys(test.exam[question]?.answers)?.map((answer, index) => {

                                    if (test.exam[question].answers[answer]) {

                                        return (
                                            <div div className="p-2 sm:w-1/2 w-full" key={index}>
                                                {/* <div className="bg-red-700 rounded flex p-4 h-full items-center"  >
                                                    <span span className="title-font font-medium text-white">{test.exam[question].answers[answer]}</span>

                                                </div> */}
                                                {((test.exam[question].correctAnswer[answer + "_correct"] === "true") && (test.exam[question].correctAnswer[test.exam[question].youranswer + "_correct"] === "true")) ?

                                                    <div className="bg-green-700 rounded flex p-4 h-full items-center"  >
                                                        <span className="title-font font-medium text-white">{test.exam[question].answers[answer]}</span>

                                                    </div> :
                                                    test.exam[question].correctAnswer[answer + "_correct"] === "true" ?
                                                        <div className="bg-green-700 rounded flex p-4 h-full items-center"  >
                                                            <span span className="title-font font-medium text-white">{test.exam[question].answers[answer]}</span>

                                                        </div> :
                                                        ((test.exam[question]?.answers[answer]) === (test.exam[question]?.answers[test.exam[question].youranswer])) ?
                                                            <div className="bg-red-700 rounded flex p-4 h-full items-center"  >
                                                                <span span className="title-font font-medium text-white">{test.exam[question].answers[answer]}</span>

                                                            </div>

                                                            :
                                                            <div className="bg-gray-100 rounded flex p-4 h-full items-center"  >

                                                                <span span className="title-font font-medium">{test.exam[question].answers[answer]}</span>
                                                            </div>

                                                }

                                            </div>
                                        )
                                    }

                                })
                                }
                                <div div className="p-2 w-full">
                                    <div className="rounded flex p-4 h-full items-center"  >
                                        <h1>Your Answer is&nbsp;</h1>
                                        {test.exam[question].isCorrect === "true" ?
                                            <h1 style={{ textDecoration: "underline" }}>Correct</h1>
                                            :
                                            <h1 style={{ textDecoration: "underline" }}>Wrong</h1>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            })
                :
                <>
                    <h1 className="text-center mt-52 text-4xl">You Have Not Solved Any Question</h1>
                    <div className="p-2 w-full">
                        <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={() => { router.push(`/user/result?token=${router.query.token}`) }}>Go Back</button>
                    </div>
                </>
            }

        </div>
    )
}

export async function getServerSideProps(context) {
    const { index, id } = context.query

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
        props: { test: data[index] }, // will be passed to the page component as props
    }
}

export default Viewtest