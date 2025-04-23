
import { aboutDdata } from '@/constants/aboutData'
import React from 'react'

function About() {
    return (
        <div>
            <section className="text-gray-600 body-font">

                <div className="container px-2 mt-10 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">

                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Online exam software developed by Omkar Jadhav, which is a
                            robust online exam platform. Our online examination system provides innovative and impeccable solutions for exams
                            throughout various colleges, universities, educational institutions, and many leading corporate entities. Conduct
                            Exam is developed by a highly qualified team and specialized in creating high impact online exam software which
                            is highly efficient in terms of reliability and speed.</p><p className="lg:w-2/3 mx-auto leading-relaxed text-base">With our online examination system, anyone can conduct
                                online exams or tests easily, and a team of innovators constantly research on making the procedure of exam
                                simple & easy. Conduct Exam aims to help the students and the clients, such as companies and universities,
                                to transcend the time constraints and geographical boundaries with a highly skilled administrator and monitor
                                . Complete and precise information on the exam is available on the portal.</p>
                    </div>
                    <hr />
                </div>
            </section>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-20 mx-auto">
                    <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
                        {aboutDdata.map((item, index) => {
                            return (

                                <div key={index} className="p-4 md:w-1/3 flex flex-col text-center items-center shadow-md" style={{ marginTop: "20px" }}>
                                    <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10" viewBox="0 0 24 24">
                                            <path d={item.svg}></path>
                                        </svg>
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-gray-900 text-lg title-font font-medium mb-3">{item.title}</h2>
                                        <p className="leading-relaxed text-base">{item.information}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section >
        </div >
    )
}

export default About