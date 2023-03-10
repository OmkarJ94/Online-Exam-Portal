
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
var authenticate = require('./authentication')

var CryptoJS = require("crypto-js");

export default async function handler(req, res) {

    try {
        const { token } = req.body
        const status = await authenticate(token)
        
        if (status === "User Not Found") {
            res.status(500).json({ results: "Something Went Wrong" })
        }
        else {
            if (req.method === "POST") {
                const { _id } = jwt.verify(token, process.env.KEY)
                const user = await User.findById(_id)
                let results = user.tests
                res.status(200).send( results )
            }
            else {
                res.status(500).json({ results: "Something Went Wrong" })
            }
        }

    }
    catch (e) {

        res.status(500).json({ results: "Something Went Wrong" })
    }
}