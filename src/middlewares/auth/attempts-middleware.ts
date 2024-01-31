import {NextFunction, Request, Response} from "express";
import {sub} from "date-fns";
import {HTTP_STATUSES} from "../../utils";
import {AttemptType} from "../../types/auth/output";
import {AuthQueryRepository} from "../../repositories/auth-db-query-repository";
import {AuthService} from "../../domain/auth-service";
import {container} from "../../composition-root";

const authQueryRepository = container.resolve(AuthQueryRepository)
const authService = container.resolve(AuthService)

export const attemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const limitDate = sub(new Date(), {
        seconds: 10
    })
    const ip = req.ip! || 'unknown'
    const url = req.originalUrl

    const amount = await authQueryRepository
        .getAmountOfAttempts({ip, url, date: limitDate.toISOString()})

    if (amount >= 5) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        return
    }

    const attempt: AttemptType = {
        ip: ip,
        url: url,
        date: new Date().toISOString()
    }

    await authService
        .addAttempt(attempt)

    next()
}