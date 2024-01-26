import {WithId} from "mongodb";
import {CommentType} from "./output";
import {likesStatuses} from "../../utils";
import {container} from "../../composition-root";
import {LikesQueryRepository} from "../../repositories/likes-db-query-repository";

const likesQueryRepository = container.resolve(LikesQueryRepository)

export const commentMapper = async (comment: WithId<CommentType>, userId?: string) => {
    let likeStatus = null

    if (userId) {
        likeStatus = await likesQueryRepository
            .getLikeStatusCommentForUser(comment._id.toString(), userId)
    }

    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt.toISOString(),
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: likeStatus || likesStatuses.none
        }
    }
}