import {WithId} from "mongodb";
import {LikeType} from "./output";

export const likeMapper = (like: WithId<LikeType>): LikeType => {
    return {
        commentIdOrPostId: like.commentIdOrPostId,
        userId: like.userId,
        status: like.status,
        addedAt: like.addedAt
    }
}