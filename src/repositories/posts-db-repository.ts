import {PostModelClass} from "../db/db";
import {OutputPostType, PostType} from "../types/post/output";
import {CreateAndUpdatePostModel} from "../types/post/input";
import {ObjectId, WithId} from "mongodb";
import {inject, injectable} from "inversify";
import {PostMapper} from "../types/post/mapper";

@injectable()
export class PostsRepository {
    constructor(@inject(PostMapper) protected postMapper: PostMapper) {
    }
    async createPost(newPost: WithId<PostType>): Promise<OutputPostType> {
        const resultCreatePost = await PostModelClass
            .create(newPost)
        return await this.postMapper.getMapPost(newPost)
    }
    async updatePost(id: string, updateData: CreateAndUpdatePostModel): Promise<boolean> {
        const resultUpdatePost = await PostModelClass
            .updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: updateData.title,
                    shortDescription: updateData.shortDescription,
                    content: updateData.content,
                    blogId: updateData.blogId
                }
            })
        return resultUpdatePost.matchedCount === 1
    }
    async changeLikeStatusPostForUser(
        postId: string,
        likesCount: number,
        dislikesCount: number): Promise<boolean> {

        const resultUpdateLikeStatus = await PostModelClass
            .updateOne({
                _id: new ObjectId(postId)
            }, {
                $set: {
                    'extendedLikesInfo.likesCount': likesCount,
                    'extendedLikesInfo.dislikesCount': dislikesCount,
                }
            })
        return resultUpdateLikeStatus.matchedCount === 1
    }
    async deletePost(id: string): Promise<boolean> {
        const resultDeletePost = await PostModelClass
            .deleteOne({_id: new ObjectId(id)})
        return resultDeletePost.deletedCount === 1
    }
}