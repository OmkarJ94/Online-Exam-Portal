
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");

export default async function handler(req, res) {
    const { name, email, password, cpassword, batch, branch, phone, semister } = req.body


    if (req.method === "POST") {

        try {
            if (password != cpassword) {

                res.status(500).json({ "status": "error" })
                return;
            }
            let user = await User.findOne({ email })

            // const data = new User({
            //     name, email, password: CryptoJS.AES.encrypt(password, process.env.KEY).toString(), cpassword: CryptoJS.AES.encrypt(cpassword, process.env.KEY).toString(), passing_year: batch, branch, phone, semister
            // })
            if (user) {

                user.name = name
                user.email = email
                user.password = CryptoJS.AES.encrypt(password, process.env.KEY).toString()
                user.cpassword = CryptoJS.AES.encrypt(cpassword, process.env.KEY).toString()
                user.passing_year = batch
                user.branch = branch
                user.phone = phone
                user.semister = semister


                await user.save();
                res.status(200).json({ "status": "add" })
            }
            else {
                res.status(500).json({ "status": "error" })

            }
        }
        catch (error) {

            res.status(500).json({ "status": "error" })
        }

    }
    // const { email } = req.body
    // const user = await User.findOne({ email })
    // user.messages = [];
    // user.save()


}