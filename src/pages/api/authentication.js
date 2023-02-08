const jwt = require('jsonwebtoken')
import User from "../../../Models/User"

const Authenticate = async (token) => {
    try {
        const verifyToken = jwt.verify(token, process.env.KEY)
        let rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token })
        if (!rootUser) {
            return ("User Not Found")
        }
        else {
            return rootUser
        }
    } catch (error) {
        
        return ("User Not Found")
    }
}
module.exports = Authenticate