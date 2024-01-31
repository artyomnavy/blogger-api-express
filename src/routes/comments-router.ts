import {Router} from "express";
import {objectIdValidation} from "../middlewares/validators/objectId-validator";
import {commentValidation} from "../middlewares/validators/comments-validator";
import {authBearerMiddleware} from "../middlewares/auth/auth-middleware";
import {accessTokenVerification} from "../middlewares/auth/accessToken-verificator";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comments-controller";
import {likeStatusValidation} from "../middlewares/validators/likes-validator";

const commentsController = container.resolve(CommentsController)
export const commentsRouter = Router({})

commentsRouter
    .put('/:id',
        authBearerMiddleware,
        objectIdValidation,
        commentValidation(),
        commentsController.updateComment.bind(commentsController))

    .put('/:id/like-status',
        authBearerMiddleware,
        objectIdValidation,
        likeStatusValidation(),
        commentsController.changeLikeStatusForComment.bind(commentsController))

    .delete('/:id',
        authBearerMiddleware,
        objectIdValidation,
        commentsController.deleteComment.bind(commentsController))

    .get('/:id',
        objectIdValidation,
        accessTokenVerification,
        commentsController.getComment.bind(commentsController))