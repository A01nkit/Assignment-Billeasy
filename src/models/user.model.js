import mongoose, {Schema} from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

});

// pre middleware in mongoose
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Custom methods 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}

export const User = mongoose.model('User', userSchema);