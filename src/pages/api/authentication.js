const jwt = require('jsonwebtoken')
import User from "../../../Models/User"

const Authenticate = async (token) => {
    try {
        const verifyToken = jwt.verify(token, process.env.KEY)
        let rootUser = await User.findOne({ _id: verifyToken._id })
        if ((rootUser) && (rootUser.tokens[0].token === token)) {
            return rootUser
        }
        else {
            return ("User Not Found")
        }

    } catch (error) {
        
        return ("User Not Found")
    }
}
module.exports = Authenticate