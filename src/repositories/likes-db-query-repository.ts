import {LikeModelClass} from "../db/db";
import {injectable} from "inversify";
import {LikeType} from "../types/like/output";
import {likeMapper} from "../types/like/mapper";

@injectable()
export class LikesQueryRepository {
    async getLikeCommentOrPostForUser(commentIdOrPostId: string, userId: string): Promise<LikeType | null> {
        const like = await LikeModelClass
            .findOne({commentIdOrPostId: commentIdOrPostId, userId: userId})
        if (!like) {
            return null
        } else {
            return likeMapper(like)
        }
    }
}