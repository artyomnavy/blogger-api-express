import {WithId} from "mongodb";
import {CommentType} from "./output";
import {likesStatuses} from "../../utils";
import {LikesQueryRepository} from "../../repositories/likes-db-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentMapper {
    constructor(@inject(LikesQueryRepository) protected likesQueryRepository: LikesQueryRepository) {
    }
    async getMapComment(comment: WithId<CommentType>, userId?: string | null) {
        let likeStatus = null

        if (userId) {
            const like = await this.likesQueryRepository.getLikeCommentOrPostForUser(
                comment._id.toString(), userId
            )
            likeStatus = like?.status
        }

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: likeStatus || likesStatuses.none
            }
        }

    }
}