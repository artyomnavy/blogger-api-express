import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-db-repository";
import {CreateAndUpdateBlogModel} from "../types/blog/input";
import {Blog, OutputBlogType} from "../types/blog/output";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }
    async createBlog(createData: CreateAndUpdateBlogModel): Promise<OutputBlogType> {

        const newBlog = new Blog(
            new ObjectId(),
            createData.name,
            createData.description,
            createData.websiteUrl,
            new Date().toISOString(),
            false
        )

        const createdBlog = await this.blogsRepository
            .createBlog(newBlog)

        return createdBlog
    }
    async updateBlog(id: string, updateData: CreateAndUpdateBlogModel): Promise<boolean> {
        return await this.blogsRepository
            .updateBlog(id, updateData)
    }
    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository
            .deleteBlog(id)
    }
}