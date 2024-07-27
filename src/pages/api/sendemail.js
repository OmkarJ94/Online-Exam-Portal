import User from "../../../Models/User"
require("../../../database/connection")
import Otp from "../../../Models/Otp"
var jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");

var CryptoJS = require("crypto-js");

const mailer = async (email, code) => {


    let body = ` We sending you the code in this email for your test on our Online Exam Portal
        We recommend that you keep your code secure and not share it with anyone
        <br/><br/>
        <h1>Code for the Test : <b>${code}</b></h1>
        <h3>This code valid only for 5 minutes</h3>
        <h1>Best Luck for your test</h1>

    `;



    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,

        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailDetails = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email For Exam Paper Code',
        html: body
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {

        if (err) {

            return false;
        } else {

            return true
        }
    })
}
export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { id } = req.body
            const user = await User.findById(id)
            if (!user) {
                return res.status(500).json({ results: "Something Went Wrong" });
            }
            const code = Math.floor(Math.random() * 10000 + 1);
            await Otp.remove({ email: user.email })
            const expireIn = new Date().getTime() + 1000
            let Code = new Otp({
                email: user.email,
                Otp: code,
                expireIn
            });


            const response = await Code.save();

            mailer(user.email, code)
            res.status(200).json({ code, expireIn })
        }
        catch (error) {
            res.status(500).json({ "status": "error" })
        }

    }
}