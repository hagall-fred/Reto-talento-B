import mongoose from "mongoose";
import { User } from "./UserTypes";

const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
    },
    genero: {
        type: String,
    },
    logo: {
        type: String
    }
},{timestamps: true});


export default mongoose.model<User>('User', UserSchema)