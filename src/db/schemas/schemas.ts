import * as mongoose from "mongoose";
import {BlogType} from "../../types/blog/output";
import {PostType} from "../../types/post/output";
import {User, UserAccountType} from "../../types/user/output";
import {CommentType} from "../../types/comment/output";
import {DeviceSessionType} from "../../types/device/output";
import {AttemptType} from "../../types/auth/output";
import {HydratedDocument, Model} from "mongoose";
import {UserModelClass} from "../db";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {LikeType} from "../../types/like/output";

// Blog schema
export const blogSchema = new mongoose.Schema<BlogType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})

// Post schema
export const postSchema = new mongoose.Schema<PostType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: String, required: true},
        newestLikes: [{
            addedAt: {type: String, required: true},
            userId: {type: String, required: true},
            login: {type: String, required: true}
        }]
    }
})

// User schema
export type UserAccountMethodsType = {
    canBeConfirmed: (code: string) => boolean
    confirm: (code: string) => void
}

export type UserModelType = Model<UserAccountType, {}, UserAccountMethodsType>
export type UserModelStaticType = Model<UserAccountType> & {
    createUser(login: string, email: string, passwordHash: string): HydratedDocument<UserAccountType, UserAccountMethodsType>
}

export type userModelFullType = UserModelType & UserModelStaticType

export const userSchema = new mongoose.Schema<
    UserAccountType,
    userModelFullType,
    UserAccountMethodsType
    >({
    accountData: {
        login: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: String,
        isConfirmed: {type: Boolean, required: true}
    }
})

userSchema.static('createUser', function createUser(login: string, email: string, passwordHash: string) {
    return new UserModelClass(new User(
        new ObjectId(),
        {
            login: login,
            password: passwordHash,
            email: email,
            createdAt: new Date().toISOString()
        },
        {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                minutes: 10
            }).toISOString(),
            isConfirmed: false
        }
    ))
})

userSchema.method('canBeConfirmed', function canBeConfirmed(code: string) {
    return this.emailConfirmation.confirmationCode === code &&
        (this.emailConfirmation.expirationDate !== null &&
            new Date(this.emailConfirmation.expirationDate) > new Date())
})

userSchema.method('confirm', function confirm(code: string) {
    if (!this.canBeConfirmed(code)) {
        throw new Error('Account can\'t be confirmed')
    }

    if (this.emailConfirmation.isConfirmed) {
        throw new Error('Already confirmed account can\'t be confirmed again')
    }

    this.emailConfirmation.isConfirmed = true
})

// Comment schema
export const commentSchema = new mongoose.Schema<CommentType>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: String, required: true}
    }
})

// DeviceSession schema
export const deviceSessionSchema = new mongoose.Schema<DeviceSessionType>({
    iat: {type: String, required: true},
    exp: {type: String, required: true},
    ip: {type: String, required: true},
    deviceId: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String, required: true}
})

// Attempt schema
export const attemptSchema = new mongoose.Schema<AttemptType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: String, required: true}
})

// Like schema
export const likeSchema = new mongoose.Schema<LikeType>({
    commentIdOrPostId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, required: true},
    addedAt: {type: String, required: true}
})