import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt  from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch {
        throw new ApiError(500, `Something went wrong while generating refresh and access token`)

    }
}

export const signup = asyncHandler( async (req, res, next) => {
    // get details from frontend
    const {userName, email, password} = req.body
    console.log(hi);
    // validation
    if (
        [userName, email, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, `userName, Email and password required`);
    }

    // check if user already exist: email only
    const existedUser = await User.findOne({
        $or : [{email}, {userName}]
    })
    if (existedUser) {
        throw new ApiError(409, `User exist already`)
    }

    // create user object - create entry in db
    const user = await User.create({
        userName,
        email,
        password
    })

    // check for user creation
    if (!user) {
        throw new ApiError(500, `Server side error`)
    }

    // remove password and refresh token field and send the response
    user.password = undefined;

    //return response
    ApiResponse.send(res, `User registered`, 201, user)
})

export const login = asyncHandler( async (req, res, next) => {
    // get details from frontend
    const {email, password} = req.body

    // validate the details
    if (
        [email, password].some((field) => 
        field?.trim === "")
    ) {
        throw new ApiError(400, `Email and password required`);
    }

    // find the user
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })
    if (!user) {
        throw new ApiError(404, `User does not exist`)
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404, `Invalid password`)
    }

    // access and refresh token 
    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")
    
    //send the token in cokiee
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )
    





})

export const logout = asyncHandler( async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, `User logged out`))
    

    
})

export const refresh_AccessToken = asyncHandler( async (req, res, next) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

try {
        const decodedToken = await jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid RefreshToken")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "RefreshToken is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newrefreshToken
                },
                "Access token refreshed"
            )
        )
    
} catch (error) {
    
    throw new ApiError(401, error?.message)
}
})