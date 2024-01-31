import {CreateAndUpdateCommentModel} from "../types/comment/input";
import {OutputCommentType, Comment} from "../types/comment/output";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-db-repository";
import {likesStatuses} from "../utils";
import {LikesRepository} from "../repositories/likes-db-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                @inject(LikesRepository) protected likesRepository: LikesRepository) {
    }
    async updateComment(id: string, updateData: CreateAndUpdateCommentModel): Promise<boolean> {
        return await this.commentsRepository
            .updateComment(id, updateData)
    }
    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepository
            .deleteComment(id)
    }
    async createComment(postId: string, userId: string, userLogin: string, createData: CreateAndUpdateCommentModel): Promise<OutputCommentType>{

        const newComment = new Comment (
            new ObjectId(),
            createData.content,
            {
                userId: userId,
                userLogin: userLogin
            },
            new Date().toISOString(),
            postId,
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: likesStatuses.none
            }
        )

        const createdComment = await this.commentsRepository
            .createComment(newComment)

        return createdComment
    }
    async changeLikeStatusCommentForUser(
        userId: string,
        comment: OutputCommentType,
        likeStatus: string): Promise<boolean> {

        const currentMyStatus = comment.likesInfo.myStatus
        let likesCount = comment.likesInfo.likesCount
        let dislikesCount = comment.likesInfo.dislikesCount

        if (likeStatus === currentMyStatus) {
            return true
        }

        if (currentMyStatus === likesStatuses.none) {
            await this.likesRepository
                .createLikeStatus({
                    commentIdOrPostId: comment.id,
                    userId: userId,
                    status: likeStatus,
                    addedAt: new Date().toISOString()
                })
        }

        if (likeStatus === likesStatuses.none) {
            await this.likesRepository
                .deleteLikeStatus(comment.id, userId)
        }

        await this.likesRepository
            .updateLikeStatus({
                commentIdOrPostId: comment.id,
                userId: userId,
                status: likeStatus,
                addedAt: new Date().toISOString()
            })

        if (likeStatus === likesStatuses.none && currentMyStatus === likesStatuses.like) {
            likesCount--
        }

        if (likeStatus === likesStatuses.like && currentMyStatus === likesStatuses.none) {
            likesCount++
        }

        if (likeStatus === likesStatuses.none && currentMyStatus === likesStatuses.dislike) {
            dislikesCount--
        }

        if (likeStatus === likesStatuses.dislike && currentMyStatus === likesStatuses.none) {
            dislikesCount++
        }

        if (likeStatus === likesStatuses.like && currentMyStatus === likesStatuses.dislike) {
            likesCount++
            dislikesCount--
        }

        if (likeStatus === likesStatuses.dislike && currentMyStatus === likesStatuses.like) {
            likesCount--
            dislikesCount++
        }

        return await this.commentsRepository
            .changeLikeStatusCommentForUser(comment.id, likeStatus, likesCount, dislikesCount)
    }
}