import {AttemptType} from "../types/auth/output";
import {AttemptModelClass} from "../db/db";
import {injectable} from "inversify";

@injectable()
export class AuthRepository {
    async addAttempt(attempt: AttemptType): Promise<AttemptType> {
        await AttemptModelClass
            .create(attempt)

        return attempt
    }
}