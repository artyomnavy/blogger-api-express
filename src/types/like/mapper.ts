import {WithId} from "mongodb";
import {LikeType} from "./output";
import {UsersQueryRepository} from "../../repositories/users-db-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class LikeMapper {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
    }

    async getMapLike(like: WithId<LikeType>) {
        const userId = like.userId

        const user = await this.usersQueryRepository
            .getUserById(userId)

        const login = user!.login

        return {
            addedAt: like.addedAt,
            userId: userId,
            login: login
        }
    }
}