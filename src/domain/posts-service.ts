import {OutputPostType, Post} from "../types/post/output";
import {CreateAndUpdatePostModel} from "../types/post/input";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-db-repository";
import {BlogsQueryRepository} from "../repositories/blogs-db-query-repository";
import {inject, injectable} from "inversify";
import {likesStatuses} from "../utils";
import {LikesRepository} from "../repositories/likes-db-repository";
import {UsersQueryRepository} from "../repositories/users-db-query-repository";
import {LikesQueryRepository} from "../repositories/likes-db-query-repository";
import {PostsQueryRepository} from "../repositories/posts-db-query-repository";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(LikesRepository) protected likesRepository: LikesRepository,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(LikesQueryRepository) protected likesQueryRepository: LikesQueryRepository) {
    }
    async createPost(createData: CreateAndUpdatePostModel): Promise<OutputPostType> {
        const blog = await this.blogsQueryRepository
            .getBlogById(createData.blogId)

        const newPost = new Post(
            new ObjectId(),
            createData.title,
            createData.shortDescription,
            createData.content,
            createData.blogId,
            blog!.name,
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: likesStatuses.none,
                newestLikes: []
            })

        const createdPost = await this.postsRepository
            .createPost(newPost)

        return createdPost
    }
    async updatePost(id: string, updateData: CreateAndUpdatePostModel): Promise<boolean> {
        return await this.postsRepository
            .updatePost(id, updateData)
    }
    async changeLikeStatusPostForUser(userId: string, post: OutputPostType, likeStatus: string): Promise<boolean> {
        const currentMyStatus = post.extendedLikesInfo.myStatus
        let likesCount = post.extendedLikesInfo.likesCount
        let dislikesCount = post.extendedLikesInfo.dislikesCount
        const newestLikes = post.extendedLikesInfo.newestLikes
        const amountNewestLikes = post.extendedLikesInfo.newestLikes.length

        const addedAts = newestLikes.map(like => like.addedAt)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

        const oldAddedAt = addedAts[0]

        const user = await this.usersQueryRepository
            .getUserById(userId)

        const login = user!.login

        const isUserNewestLike = await this.postsQueryRepository
            .checkUserNewestLikeForPost(post.id, userId)

        if (likeStatus === currentMyStatus) {
            return true
        }

        if (currentMyStatus === likesStatuses.none) {
            await this.likesRepository
                .createLikeStatus({
                    commentIdOrPostId: post.id,
                    userId: userId,
                    status: likeStatus,
                    addedAt: new Date().toISOString()
                })
        }

        if (likeStatus === likesStatuses.none) {
            await this.likesRepository
                .deleteLikeStatus(post.id, userId)
        }

        await this.likesRepository
            .updateLikeStatus({
                commentIdOrPostId: post.id,
                userId: userId,
                status: likeStatus,
                addedAt: new Date().toISOString()
            })

        const like = await this.likesQueryRepository
            .getLikeCommentOrPostForUser(post.id, userId)

        const newAddedAt = like?.addedAt

        if (likeStatus === likesStatuses.none && currentMyStatus === likesStatuses.like) {
            likesCount--

            if (isUserNewestLike) {
                await this.postsRepository
                    .removeNewestLikeForPost(post.id, userId)
            }
        }

        if (likeStatus === likesStatuses.like && currentMyStatus === likesStatuses.none) {
            likesCount++

            if (!isUserNewestLike) {
                if (amountNewestLikes < 3) {
                    await this.postsRepository
                        .addNewestLikeForPost(post.id, newAddedAt!, userId, login)
                }

                if (oldAddedAt) {
                    await this.postsRepository
                        .replaceNewestLikeForPost(post.id, oldAddedAt, newAddedAt!, userId, login)
                }
            }
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

            if (!isUserNewestLike) {
                if (amountNewestLikes < 3) {
                    await this.postsRepository
                        .addNewestLikeForPost(post.id, newAddedAt!, userId, login)
                }

                if (oldAddedAt) {
                    await this.postsRepository
                        .replaceNewestLikeForPost(post.id, oldAddedAt, newAddedAt!, userId, login)
                }
            }
        }

        if (likeStatus === likesStatuses.dislike && currentMyStatus === likesStatuses.like) {
            likesCount--
            dislikesCount++

            if (isUserNewestLike) {
                await this.postsRepository
                    .removeNewestLikeForPost(post.id, userId)
            }
        }

        return await this.postsRepository
            .changeLikeStatusPostForUser(post.id, likeStatus, likesCount, dislikesCount)
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository
            .deletePost(id)
    }
}