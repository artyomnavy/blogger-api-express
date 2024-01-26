import {Request, Response, NextFunction} from "express";
import {Buffer} from 'node:buffer'
import {HTTP_STATUSES} from "../../utils";
import {container} from "../../composition-root";
import {DevicesQueryRepository} from "../../repositories/devices-db-query-repository";
import {JwtService} from "../../application/jwt-service";
import {UsersQueryRepository} from "../../repositories/users-db-query-repository";

const devicesQueryRepository = container.resolve(DevicesQueryRepository)
const jwtService = container.resolve(JwtService)
const usersQueryRepository = container.resolve(UsersQueryRepository)

const login = process.env.BASIC_AUTH_LOGIN || 'admin'
const password = process.env.BASIC_AUTH_PASSWORD || 'qwerty'

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(':')

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    return next()
}

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const accessToken = auth.split(' ')[1]

    const payloadToken = await jwtService
        .checkToken(accessToken)

    if (payloadToken) {
        req.userId = payloadToken.userId
        return next()
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const payloadToken = await jwtService
        .checkToken(refreshToken)

    if (!payloadToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    req.userId = payloadToken.userId
    req.deviceId = payloadToken.deviceId

    const user = await usersQueryRepository
        .getUserById(payloadToken.userId)

    if (!user) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const deviceSession = await devicesQueryRepository
        .checkDeviceSession(payloadToken.userId, payloadToken.deviceId)

    if (!deviceSession) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const iatRefreshToken = new Date(payloadToken.iat * 1000)

    if (iatRefreshToken < deviceSession.iat) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    next()
}