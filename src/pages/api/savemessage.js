
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
import Authenticate from './authentication'

export default async function handler(req, res) {
    try {
        const { token, email, name, message } = req.body

        const status = await Authenticate(token)

        if (status === "User Not Found") {
            res.status(500).json({ "status": "error" })
            return
        }
        else if (req.method === "POST") {
            if (!name || !email || !message) {
                return res.status(500).send("Please fill all the field")
            }
            else {
            const userContact = await User.findOne({ email })

                if (userContact) {
                    const userMessage = await userContact.addMessage(name, email, message)
                    await userContact.save()
                    res.status(200).json({ message: "meassage added successfully" })
                }
            }
        }
        else {
            res.status(500).json({ "status": "error" })
        }
    }
    catch (e) {
        res.status(500).json({ "status": "error" })
    }
}