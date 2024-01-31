import {ObjectId} from "mongodb";

export type OutputCommentType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}

export type CommentType = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}

export type PaginatorCommentsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputCommentType[]
}

export class Comment {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
        public createdAt: string,
        public postId: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }
    ) {
    }
}