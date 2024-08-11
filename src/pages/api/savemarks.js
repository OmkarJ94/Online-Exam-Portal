import User from "../../../Models/User"
require("../../../database/connection")
var jwt = require('jsonwebtoken');
import Authenticate from './authentication'

export default async function handler(req, res) {

    const { score, token, exam, time, start } = req.body

    const ms = new Date().getTime() - start

    const min = Math.floor((ms / 1000 / 60) << 0);
    const sec = Math.floor((ms / 1000) % 60);

    const status = await Authenticate(token)

    if (status === "User Not Found") {
        res.status(500).json({ "status": "error" })
        return
    }
    if (req.method === "POST") {

        try {
            const { _id } = jwt.verify(token, process.env.KEY)
            const user = await User.findById(_id)
            if (user) {
                (user.tests).push({ score, exam, start: new Date(start).toLocaleString(), submissiontime: time, timetaken: min + "." + sec })
                user.save()
                res.status(200).json({ "status": "true", message: "Marks Added Successfully" })
            }
            else {
                res.status(500).json({ "status": "error" })
            }
        }
        catch (error) {
            res.status(500).json({ "status": "error" })
        }

    }
    else {
        res.status(500).json({ "status": "error" })
    }
}