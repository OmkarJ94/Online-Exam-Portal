
import Image from "next/image"
import { useEffect, useState } from "react"
import image from "./images/21426.jpg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [user, setUser] = useState();

  const fetchData = async (token) => {
    try {
      const response = await fetch("/api/getuser", {
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

        setUser(user)


      }
    }
    catch (e) {
      
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token")
    setToken(token)

    if (token != null) {
      fetchData(token)
    }
  }, [])
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <Image className="object-cover object-center rounded" alt="hero" src={image} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900"> {token && user?.name !== undefined ? `Welcome, ${user?.name}` : "Welcome"}</h1>

            <p className="mb-8 leading-relaxed">This is online EXAM portal saves paper and time.Thank you for using Eco-Friendly Quiz portal.</p>
            {!token && <div className="flex w-full md:justify-start justify-center items-end">

              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={() => { router.push("signup") }}>Resgister</button>
            </div>}


          </div>

        </div>
      </section>
    </>
  )
}

