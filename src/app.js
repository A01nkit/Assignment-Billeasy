import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

// configuring, what type of date we can get and other configurations.

app.use(express.json())//json data from frontend
//app.use(express.urlencoded())//data from url
app.use(express.static("public"))//to store resources on server 
app.use(cookieParser())

//Routes import 
import  userRoute  from "./routes/user.route.js"
import bookandreviewRoute from "./routes/book&review.route.js"
//Routes declarration 
app.use("/user", userRoute);
app.use("/books", bookandreviewRoute)
app.use("/review", bookandreviewRoute)



//Error handling middleware
import { handleError } from "./utils/errorHandler.js"

app.use(handleError);



export { app } 