import {LikeModelClass} from "../db/db";
import {inject, injectable} from "inversify";
import {LikeType} from "../types/like/output";
import {LikeMapper} from "../types/like/mapper";
import {likesStatuses} from "../utils";
import {WithId} from "mongodb";
import {NewestLikesType} from "../types/post/output";

@injectable()
export class LikesQueryRepository {
    constructor(@inject(LikeMapper) protected likeMapper: LikeMapper) {
        }

    async getLikeCommentOrPostForUser(commentIdOrPostId: string, userId: string): Promise<WithId<LikeType> | null> {
        const like = await LikeModelClass
            .findOne({commentIdOrPostId: commentIdOrPostId, userId: userId})

        if (!like) {
            return null
        } else {
            return like
        }
    }
    async getNewestLikesForPost(postId: string): Promise<NewestLikesType[]> {
        const newestLikes = await LikeModelClass
            .find({commentIdOrPostId: postId, status: likesStatuses.like})
            .sort({addedAt: 'desc'})
            .limit(3)
            .lean()

        return await Promise.all(newestLikes.map(like => this.likeMapper.getMapLike(like)))
    }
}