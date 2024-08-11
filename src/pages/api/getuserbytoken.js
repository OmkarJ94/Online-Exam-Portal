
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
import Authenticate from'./authentication'

export default async function handler(req, res) {

    try {
        const { token } = req.body

        const status = await Authenticate(token)
        if (status === "User Not Found") {
            res.status(500).json({ "status": "error" })
            return
        }
        if (req.method === "POST") {
            const { _id } = jwt.verify(token, process.env.KEY)
            const user = await User.findById(_id)
            res.status(200).json(user)
        }
        else {
            res.status(500).json({ "status": "error" })
        }
    }
    catch (e) {
        res.status(500).json({ "status": "error" })
    }
}