
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var authenticate = require('./authentication')

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { id } = req.body

            const user = await User.findById(id)

            if (!user) {
                res.status(500).json({ "status": "error" })
                return
            }
            res.status(200).json(user)
        }
        catch (e) {
            res.status(500).json({ "status": "error" })
        }
    }
}