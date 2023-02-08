import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCountdownTimer } from 'use-countdown-timer';

function questionlist({ test }) {
    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 0.5 * 60 * 1000,
    });
    const router = useRouter()
    const [starttime, setStartTime] = useState()
    const [loading, setLoading] = useState(false)

    const [score, setScore] = useState(0)
    const [exam, setExam] = useState([])

    useEffect(() => {
        setStartTime(new Date().toLocaleString())
        start()
        const code = JSON.parse(localStorage.getItem("actualcode"))
        const token = localStorage.getItem("token")
        if (!code?.code || code.code != router.query.code || token === null || !router.query.code) {
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

                router.push(`${process.env.NEXT_PUBLIC_HOST}login`)
            }, 500)
            localStorage.removeItem("actualcode")
        }
    }, [])
    const handleChange = (answer, question) => {
        
        if (isRunning) {
            var isPresent = false
            if (question.correct_answers[answer + "_correct"] === "true") {
                setScore(score + 1)
            }
            for (let ele of exam) {
                
                if (ele.id === question.id) {
                    isPresent = true
                }
            }
            
            if (!isPresent) {
                setExam([...exam, {
                    id: question.id,
                    question: question.question,
                    answers: question.answers,
                    youranswer: answer,
                    correctAnswer: question.correct_answers,
                    isCorrect: question.correct_answers[answer + "_correct"],
                    subject: question.category
                }])
            }
            

        }
        else {
            toast.error('Your Time Is Over', {
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)



        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/savemarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    score, token: localStorage.getItem("token"), exam, time: new Date().toLocaleString(), start: starttime

                }),
            })

            if (response.status === 200) {
                toast.success('Test Submitted Successfully!...Your score avialble in "View Result" Section ', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                localStorage.removeItem("actualcode")

                setTimeout(() => {
                    router.push(`${process.env.NEXT_PUBLIC_HOST}`)
                }, 500)
            }
            else {
                toast.error('Something Went Wrong', {
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

        } catch (e) {
            toast.error('Something Went Wrong', {
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
    return (
        <div>
            <div className="w-full mr-10  fixed">
                <h1 className="sm:text-3xl text-2xl  mr-10  text-right font-medium title-font  text-gray-900 mb-4 underline">
                    {
                        Math.floor((countdown / 1000 / 60) % 60) + ":" + Math.floor((countdown / 1000) % 60)
                    }
                </h1>

            </div>
            {test?.map((question) => {
                return (
                    <section className="text-gray-600 body-font" key={question.id}>
                        <div className="container px-5 py-24 mx-auto">
                            <div className="text-center mb-20">
                                <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">{question?.question}</h1>

                            </div>
                            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                                {Object.keys(question?.answers)?.map((answer, index) => {
                                    if (question.answers[answer]) {

                                        return (
                                            <div div className="p-2 sm:w-1/2 w-full" key={index}>
                                                <div className="bg-gray-100 rounded flex p-4 h-full items-center"  >
                                                    {/* <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                                <path d="M22 4L12 14.01l-3-3"></path>
                                            </svg> */}
                                                    <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name={question.id} value={question.answers[answer]} id="flexRadioDefault10" onChange={(e) => { handleChange(answer, question) }}></input>
                                                    <span span className="title-font font-medium">{question.answers[answer]}</span>
                                                </div>

                                            </div>
                                        )
                                    }

                                })
                                }





                            </div>
                        </div>
                    </section>
                )
            })

            }

            {loading && <div className="flex flex-wrap justify-center mb-5">
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>}
            <button className="flex mx-auto mb-9 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleSubmit}>Submit Test</button>
        </div >
    )
}

export async function getServerSideProps(context) {
    const { category, difficulty } = context.query

    const result = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${process.env.NEXT_PUBLIC_APIKEY}&category=${category}&difficulty=${difficulty}&limit=10&ta`)

    const questions = await result.json()

    return {
        props: { test: questions }, // will be passed to the page component as props
    }
}
export default questionlist