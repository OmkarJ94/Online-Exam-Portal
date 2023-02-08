import User from "../../../Models/User"
require("../../../database/connection")
var CryptoJS = require("crypto-js");
export default async function handler(req, res) {

    const { name, email, password, cpassword, batch, branch, phone, semister } = req.body


    if (req.method === "POST") {
        let user = await User.findOne({ email })
        if (user) {
            res.status(203).json({ "status": "false", message: "Something Went Wrong" })
            return;
        }


        try {
            if (password != cpassword) {

                res.status(500).json({ "status": "error" })
                return;
            }

            const data = new User({
                name, email, password: CryptoJS.AES.encrypt(password, process.env.KEY).toString(), cpassword: CryptoJS.AES.encrypt(cpassword, process.env.KEY).toString(), passing_year: batch, branch, phone, semister
            })

            await data.save();
            res.status(200).json({ "status": "add" })
        }
        catch (error) {

            res.status(500).json({ "status": "error" })
        }

    }

    else {

        res.status(500).json({ "status": "error" })
    }
}