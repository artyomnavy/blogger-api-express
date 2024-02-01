import {LikeModelClass} from "../db/db";
import {injectable} from "inversify";
import {LikeType} from "../types/like/output";
import {WithId} from "mongodb";

@injectable()
export class LikesRepository {
    async createLike(inputData: LikeType): Promise<WithId<LikeType>> {

        const like = await LikeModelClass.create({
                commentIdOrPostId: inputData.commentIdOrPostId,
                userId: inputData.userId,
                status: inputData.status,
                addedAt: inputData.addedAt})

        return like
    }
    async deleteLike(commentIdOrPostId: string, userId: string): Promise<boolean> {
        const resultDeleteLikeStatus = await LikeModelClass
            .deleteOne({commentIdOrPostId: commentIdOrPostId, userId: userId})
        return resultDeleteLikeStatus.deletedCount === 1
    }
    async updateLike(updateData: LikeType): Promise<boolean> {
        const resultUpdateLikeStatus = await LikeModelClass
            .updateOne({
                commentIdOrPostId: updateData.commentIdOrPostId,
                userId: updateData.userId
            }, {
                $set: {
                    status: updateData.status,
                    addedAt: updateData.addedAt
                },
            })
        return resultUpdateLikeStatus.matchedCount === 1
    }
}