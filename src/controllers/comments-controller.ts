import {Params, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {CreateAndUpdateCommentModel} from "../types/comment/input";
import {Response} from "express";
import {CommentsQueryRepository} from "../repositories/comments-db-query-repository";
import {HTTP_STATUSES} from "../utils";
import {CommentsService} from "../domain/comments-service";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(JwtService) protected jwtService: JwtService) {
    }
    async updateComment(req: RequestWithParamsAndBody<Params, CreateAndUpdateCommentModel>, res: Response) {
        const userId = req.userId!
        const commentId = req.params.id
        const content = req.body

        const comment = await this.commentsQueryRepository
            .getCommentById(commentId, userId)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        } else if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        const isUpdated = await this.commentsService
            .updateComment(commentId, content)

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    async deleteComment(req: RequestWithParams<Params>, res: Response) {
        const userId = req.userId!
        const commentId = req.params.id

        const comment = await this.commentsQueryRepository
            .getCommentById(commentId, userId)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        } else if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        const isDeleted = await this.commentsService
            .deleteComment(commentId)

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
    }
    async getComment(req: RequestWithParams<Params>, res: Response) {
        const commentId = req.params.id
        const userId = req.userId

        const comment = await this.commentsQueryRepository
            .getCommentById(commentId, userId)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        } else {
            res.send(comment)
        }
    }
    async changeLikeStatusForComment(req: RequestWithParamsAndBody<Params, {likeStatus: string}>, res: Response) {
        const userId = req.userId!
        const commentId = req.params.id
        const likeStatus = req.body.likeStatus

        const comment = await this.commentsQueryRepository
            .getCommentById(commentId, userId)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const isUpdated = await this.commentsService
            .changeLikeStatusCommentForUser(userId, comment, likeStatus)

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
}