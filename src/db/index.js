import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstanse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMONGODB connected !! DB HOST: ${connectionInstanse.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection failed->", error);
        process.exit(1)
    }
}


export default connectDB