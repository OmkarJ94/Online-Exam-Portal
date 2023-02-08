import User from "../../../Models/User"
require("../../../database/connection")
import Otp from "../../../Models/Otp"
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const mailer = (mail, body) => {

    try {

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
            to: mail,
            subject: 'Email For Forgot Password',
            html: body
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {

            if (err) {

                return false;
            } else {

                return true
            }
        })
    } catch (error) {


    }
}


export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            let { email } = req.body;

            if (!email) {
                return res.status(404).json({ error: "User Not Found" });
            }
            const code = Math.floor(Math.random() * 10000 + 1);
            let body = ` We sending you this email in response to your request to reset your password on our Online Exam Portal
            <br/><br/>
            We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by going to your My Account Page and chnage your password.
            <br/><br/>
            <h1>Otp to change the password : <b>${code}</b></h1>
            <h3>This otp valid only for 5 minutes</h3>
            
        `;
            const result = await User.findOne({ email: email });

            if (result) {
                let Code = new Otp({
                    email,
                    Otp: code,
                    expireIn: new Date().getTime() + 300 * 1000,
                });
                const response = await Code.save();
                mailer(email, body);


                res.status(200).json({ message: "OTP Send Your Mail Id" });

            } else {
                res.status(404).json({ message: "User Not Found" });
            }
        } catch (error) {


            res.status(404).json({ message: "Something Went Wrong" });
        }
    } else {
        res.status(404).json({ message: "Something Went Wrong" });
    }
}

