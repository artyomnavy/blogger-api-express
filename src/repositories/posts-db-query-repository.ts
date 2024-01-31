import {PostModelClass} from "../db/db";
import {OutputPostType, PaginatorPostsType} from "../types/post/output";
import {PostMapper} from "../types/post/mapper";
import {ObjectId} from "mongodb";
import {PaginatorPostModel} from "../types/post/input";
import {PaginatorPostWithBlogIdModel} from "../types/blog/input";
import {PaginatorPostsWithBlogIdType} from "../types/blog/output";
import {inject, injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
    constructor(@inject(PostMapper) protected postMapper: PostMapper) {
    }
    async getAllPosts(QueryData: PaginatorPostModel & {userId?: string | null}): Promise<PaginatorPostsType> {
        const pageNumber = QueryData.pageNumber ?
            QueryData.pageNumber :
            1
        const pageSize = QueryData.pageSize ?
            QueryData.pageSize :
            10
        const sortBy = QueryData.sortBy ?
            QueryData.sortBy :
            'createdAt'
        const sortDirection = QueryData.sortDirection ?
            QueryData.sortDirection :
            'desc'

        const userId = QueryData.userId

        const posts = await PostModelClass
            .find({})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await PostModelClass.countDocuments({})
        const pagesCount = Math.ceil(+totalCount / +pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: await Promise.all(posts.map(post => this.postMapper.getMapPost(post, userId)))
        }
    }
    async getPostById(postId: string, userId?: string | null): Promise<OutputPostType | null> {
        const post = await PostModelClass
            .findOne({_id: new ObjectId(postId)}).lean()

        if (!post) {
            return null
        } else {
            return await this.postMapper.getMapPost(post, userId)
        }
    }
    async getPostsByBlogId(QueryData: PaginatorPostWithBlogIdModel & {blogId: string} & {userId?: string | null} ): Promise<PaginatorPostsWithBlogIdType> {
        const pageNumber = QueryData.pageNumber ?
            QueryData.pageNumber :
            1
        const pageSize = QueryData.pageSize ?
            QueryData.pageSize :
            10
        const sortBy = QueryData.sortBy ?
            QueryData.sortBy :
            'createdAt'
        const sortDirection = QueryData.sortDirection ?
            QueryData.sortDirection :
            'desc'
        const blogId = QueryData.blogId
        const userId = QueryData.userId

        let filter = {
            blogId: {
                $regex: blogId
            }
        }

        const posts = await PostModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await PostModelClass.countDocuments(filter)
        const pagesCount = Math.ceil(+totalCount / +pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: await Promise.all(posts.map(post => this.postMapper.getMapPost(post, userId)))
        }
    }
    async checkUserNewestLikeForPost(postId: string, userId: string): Promise<boolean> {
        const post = await PostModelClass
            .findOne({
                _id: new ObjectId(postId),
                'extendedLikesInfo.newestLikes.userId': userId
            }).lean()

        if (!post) {
            return false
        } else {
            return true
        }
    }
}