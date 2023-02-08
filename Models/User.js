const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
const UsersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    passing_year: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    semister: {
        type: String,
        required: true,
    },
    tests: {
        type: Array,
        default: []
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    messages:
        [
            {
                name: {
                    type: String,
                    required: true,
                    minLength: 3,
                },
                email: {
                    type: String,
                    required: true,
                },
         
                message: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now
                },
            }
        ]

}, { timestamp: true })

UsersSchema.methods.generateAuthToken = async function () {
    try {

        let userToken = jwt.sign(
            { _id: this._id }
            , process.env.KEY);
        this.tokens = { token: userToken, _id: this._id };
        await this.save()
        
        return userToken;
    } catch (error) {
        
        return new Error(error.message)
    }
};

UsersSchema.methods.addMessage = async function (name, email, message) {
    try {
        this.messages = this.messages.concat({ name, email, message })
        await this.save()
        return this.messages
    } catch (error) {
        
    }
}

mongoose.models = {}
export default mongoose.model("User", UsersSchema)