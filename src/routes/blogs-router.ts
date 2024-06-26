import {Router} from "express";
import {authBasicMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../middlewares/validators/blogs-validator";
import {objectIdValidation} from "../middlewares/validators/objectId-validator";
import {postForBlogValidation} from "../middlewares/validators/posts-validator";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogs-controller";
import {accessTokenVerification} from "../middlewares/auth/accessToken-verificator";

const blogsController = container.resolve(BlogsController)
export const blogsRouter = Router({})

blogsRouter
    .post('/',
        authBasicMiddleware,
        blogValidation(),
        blogsController.createBlog.bind(blogsController))

    .post('/:id/posts',
        authBasicMiddleware,
        objectIdValidation,
        postForBlogValidation(),
        blogsController.createPostForBlog.bind(blogsController))

    .put('/:id',
        authBasicMiddleware,
        objectIdValidation,
        blogValidation(),
        blogsController.updateBlog.bind(blogsController))

    .delete('/:id',
        authBasicMiddleware,
        objectIdValidation,
        blogsController.deleteBlog.bind(blogsController))

    .get('/',
        blogsController.getAllBlogs.bind(blogsController))

    .get('/:id',
        objectIdValidation,
        blogsController.getBlog.bind(blogsController))

    .get('/:id/posts',
        objectIdValidation,
        accessTokenVerification,
        blogsController.getPostsForBlog.bind(blogsController))