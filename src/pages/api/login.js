
import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');

var CryptoJS = require("crypto-js");

export default async function handler(req, res) {
    let token
    try {
        const { email, password } = req.body

        if (req.method === "POST") {
            const response = await User.findOne({ email: email });

            if (response) {
                const bytes = CryptoJS.AES.decrypt(response.password, process.env.KEY);
                var originalpassword = bytes.toString(CryptoJS.enc.Utf8);


                if (email === response.email && password === originalpassword) {
                    response.tokens = []
                    await response.save()
                    token = await response.generateAuthToken();

                    res.status(200).json(token)
                }
                else {
                    res.status(500).json({ "status": "error" })
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