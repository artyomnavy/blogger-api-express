import {CommentType, OutputCommentType} from "../types/comment/output";
import {ObjectId, WithId} from "mongodb";
import {CommentModelClass} from "../db/db";
import {CommentMapper} from "../types/comment/mapper";
import {CreateAndUpdateCommentModel} from "../types/comment/input";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsRepository {
    constructor(@inject(CommentMapper) protected commentMapper: CommentMapper) {
    }
    async deleteComment(id: string): Promise<boolean>{
        const resultDeleteComment = await CommentModelClass
            .deleteOne({_id: new ObjectId(id)})
        return resultDeleteComment.deletedCount === 1
    }
    async createComment(newComment: WithId<CommentType>): Promise<OutputCommentType> {
        const resultCreateComment = await CommentModelClass
            .create(newComment)
        return await this.commentMapper.getMapComment(newComment)
    }
    async updateComment(id: string, updateData: CreateAndUpdateCommentModel): Promise<boolean>{
        const resultUpdateComment = await CommentModelClass
            .updateOne({_id: new ObjectId(id)}, {
                $set: {
                    content: updateData.content
                }
            })
        return resultUpdateComment.matchedCount === 1
    }
    async changeLikeStatusCommentForUser(
        commentId: string,
        likesCount: number,
        dislikesCount: number): Promise<boolean> {

        const resultUpdateLikeStatus = await CommentModelClass
            .updateOne({
                _id: new ObjectId(commentId)
            }, {
                $set: {
                    'likesInfo.likesCount': likesCount,
                    'likesInfo.dislikesCount': dislikesCount,
                }
            })
        return resultUpdateLikeStatus.matchedCount === 1
    }
}