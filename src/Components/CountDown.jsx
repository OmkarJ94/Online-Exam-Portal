import React from "react";
import Countdown from "react-countdown";
import {toast } from 'react-toastify';
import { useRouter } from "next/router"


const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        return <span>Time's up!</span>;
    } else {
        return (
            <span>
                {hours > 0 && `${hours} :`}{minutes}:{seconds}
            </span>
        );
    }
};

const CountDown = React.memo((exam,score,startTime) => {
    const router=useRouter()
    const onSubmit=async(exam,score,startTime)=>{
        try {
            const response = await fetch("/api/savemarks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    score, token: localStorage.getItem("token"), exam, time: new Date().toLocaleString(), start: startTime
    
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
                    router.push("/")
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
    }
    const countdownEndTime = Date.now() + 60*1000*10;

    return (
        <Countdown date={countdownEndTime} renderer={renderer} onComplete={()=>{
            onSubmit(exam,score,startTime)
        }}/>
    );
});

export default CountDown;
