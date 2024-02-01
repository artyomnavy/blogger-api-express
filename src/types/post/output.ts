import {ObjectId} from "mongodb";

export type NewestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}

export type OutputPostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: NewestLikesType[]
    }
}

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: {
            addedAt: string,
            userId: string,
            login: string
        }[]
    }
}

export type PaginatorPostsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputPostType[]
}

export class Post {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: {
                addedAt: string,
                userId: string,
                login: string
            }[]
        }
    ) {
    }
}