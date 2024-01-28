import dotenv from 'dotenv'
import mongoose from "mongoose";
import {
    attemptSchema,
    blogSchema,
    commentSchema,
    deviceSessionSchema, likeSchema,
    postSchema, userModelFullType,
    userSchema
} from "./schemas/schemas";
import {UserAccountType} from "../types/user/output";
dotenv.config()

const dbName = 'BloggerPlatform'
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

if (!mongoURI) {
    throw new Error('Url dosen\'t found')
}

export const BlogModelClass = mongoose.model('blogs', blogSchema)
export const PostModelClass = mongoose.model('posts', postSchema)
export const UserModelClass = mongoose.model<UserAccountType, userModelFullType>('users', userSchema)
export const CommentModelClass = mongoose.model('comments', commentSchema)
export const DeviceModelClass = mongoose.model('devices', deviceSessionSchema)
export const AttemptModelClass = mongoose.model('attempts', attemptSchema)
export const LikeModelClass = mongoose.model('likes', likeSchema)

export const runDb = async() => {
    try {
        await mongoose.connect(mongoURI, {dbName: dbName})
        console.log('Client connected to db')
    } catch (e) {
        console.log(`${e}`)
        await mongoose.disconnect()
    }
}