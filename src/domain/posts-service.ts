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

        if (likeStatus === currentMyStatus) {
            return true
        }

        const newLike = {
            commentIdOrPostId: post.id,
            userId: userId,
            status: likeStatus,
            addedAt: new Date().toISOString()
        }

        if (currentMyStatus === likesStatuses.none) {
            await this.likesRepository
                .createLike(newLike)
        } else if (likeStatus === likesStatuses.none) {
            await this.likesRepository
                .deleteLike(post.id, userId)
        } else {
            await this.likesRepository
                .updateLike(newLike)
        }

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

        return await this.postsRepository
            .changeLikeStatusPostForUser(post.id, likesCount, dislikesCount)
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository
            .deletePost(id)
    }
}