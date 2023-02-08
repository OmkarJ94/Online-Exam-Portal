import React, { useState,useEffect } from 'react'
var CryptoJS = require("crypto-js");
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function edit({ user }) {
    const router = useRouter()
    const [data, setdata] = useState({
        name: user.name,
        email: user.email,
        password: user.password,
        cpassword: user.cpassword,
        batch: user.passing_year,
        branch: user.branch,
        phone: user.phone,
        semister: user.semister

    })
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
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setdata({ ...data, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((data.password != data.cpassword) || (!data.email || !data.cpassword || !data.name || !data.password)) {

            toast.error('Information is not valid', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })


            if (response.status === 200) {
                toast.success('Data Updated Successfully', {
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

                    router.push(`${process.env.NEXT_PUBLIC_HOST}`)
                }, 1000)
                setLoading(false)

            }
            else {

                toast.error('Information is not valid', {
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
            }
        }
        catch (error) {

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
        }
    }

    const [loading, setLoading] = useState(false)
    return (
        <div>
            <section className="text-gray-600 body-font relative">
                <div className="container px-5 py-20 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Edit Data</h1>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                                    <input type="text" id="name" name="name" value={data.name} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                                    <input type="email" id="email" name="email" value={data.email} disabled className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Password</label>
                                    <input type="Password" id="Password" name="password" value={data.password} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Confirm Password</label>
                                    <input type="Password" id="Cpassword" name="cpassword" value={data.cpassword} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>

                            <div className="p-2 w-1/2">
                                <div className="relative">

                                    <label htmlFor="batch" className="leading-7 text-sm text-gray-600">Passing Year</label>

                                    <input type="month" id="batch" name="batch" value={data.batch} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />

                                </div>

                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="branch" className="leading-7 text-sm text-gray-600">Branch</label>
                                    <select id="branch" name="branch" value={data.branch} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out" >
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Computer Engineering">Computer Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>

                                    </select>
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Mobile No</label>
                                    <input type="number" id="phone" name="phone" value={data.phone} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="Semister" className="leading-7 text-sm text-gray-600">Semister</label>
                                    <input type="text" id="Semister" name="semister" value={data.semister} onChange={handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleSubmit}>Update</button>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.query
    if (!token) {
        return
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
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

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.KEY);
        var originalpassword = bytes.toString(CryptoJS.enc.Utf8);
        user.password = originalpassword
        user.cpassword = originalpassword
    }
    return {
        props: { user }, // will be passed to the page component as props
    }

}

export default edit