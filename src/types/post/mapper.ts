import {WithId} from "mongodb";
import {PostType} from "./output";
import {inject, injectable} from "inversify";
import {LikesQueryRepository} from "../../repositories/likes-db-query-repository";
import {likesStatuses} from "../../utils";

@injectable()
export class PostMapper {
    constructor(@inject(LikesQueryRepository) protected likesQueryRepository: LikesQueryRepository) {
    }

    async getMapPost(post: WithId<PostType>, userId?: string | null) {
        let likeStatus = null

        if (userId) {
            const like = await this.likesQueryRepository.getLikeCommentOrPostForUser(
                post._id.toString(), userId
            )
            likeStatus = like?.status
        }

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: likeStatus || likesStatuses.none,
                newestLikes: post.extendedLikesInfo.newestLikes
                    .map(item => {
                        return {
                            addedAt: item.addedAt,
                            userId: item.userId,
                            login: item.login
                        }
                    })
            }
        }
    }
}