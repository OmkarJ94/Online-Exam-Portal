
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var authenticate = require('./authentication')

export default async function handler(req, res) {

    try {
        const { token } = req.body

        const status = await authenticate(token)
        if (status === "User Not Found") {
            res.status(500).json({ "status": "error" })
            return
        }
        if (req.method === "POST") {
            const { _id } = jwt.verify(token, process.env.KEY)
            const user = await User.findById(_id)
            user.tokens = [];
            user.save()
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