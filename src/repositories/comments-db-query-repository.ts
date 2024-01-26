import {PaginatorCommentModel} from "../types/comment/input";
import {OutputCommentType, PaginatorCommentsType} from "../types/comment/output";
import {CommentModelClass} from "../db/db";
import {CommentMapper} from "../types/comment/mapper";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsQueryRepository {
    constructor(@inject(CommentMapper) protected commentMapper: CommentMapper) {
    }
    async getCommentById(commentId: string, userId?: string): Promise<OutputCommentType | null> {
        const comment = await CommentModelClass
            .findOne({_id: new ObjectId(commentId)}).lean()

        if (!comment) {
            return null
        } else {
            return await this.commentMapper.getMapComment(comment, userId)
        }
    }
    async getCommentsByPostId(QueryData: PaginatorCommentModel & {postId: string} & {userId?: string}): Promise<PaginatorCommentsType> {
        const pageNumber = QueryData.pageNumber ?
            QueryData.pageNumber :
            1
        const pageSize = QueryData.pageSize ?
            QueryData.pageSize :
            10
        const sortBy = QueryData.sortBy ?
            QueryData.sortBy :
            'createdAt'
        const sortDirection = QueryData.sortDirection ?
            QueryData.sortDirection :
            'desc'
        const postId = QueryData.postId
        const userId = QueryData.userId

        let filter = {
            postId:  postId
        }

        const comments = await CommentModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await CommentModelClass
            .countDocuments(filter)
        const pagesCount = Math.ceil(+totalCount / +pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: await Promise.all(comments.map(comment => this.commentMapper.getMapComment(comment, userId)))
        }
    }
}