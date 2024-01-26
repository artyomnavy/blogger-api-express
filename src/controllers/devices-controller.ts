import {Request, Response} from "express";
import {DevicesQueryRepository} from "../repositories/devices-db-query-repository";
import {DevicesService} from "../domain/devices-service";
import {HTTP_STATUSES} from "../utils";
import {Params, RequestWithParams} from "../types/common";
import {injectable} from "inversify";

@injectable()
export class DevicesController {
    constructor(@inject(DevicesService) protected devicesService: DevicesService,
                @inject(DevicesQueryRepository) protected devicesQueryRepository: DevicesQueryRepository) {
    }
    async getAllDevicesSessionsForUser(req: Request, res: Response) {
        const userId = req.userId!

        const devicesSessions = await this.devicesQueryRepository
            .getAllDevicesSessionsForUser(userId)

        res.send(devicesSessions)
    }
    async terminateSessionsForAllOthersDevices(req: Request, res: Response) {
        const userId = req.userId!
        const deviceId = req.deviceId!

        const isTerminateDevicesSessions = await this.devicesService
            .terminateAllOthersDevicesSessions(userId, deviceId)

        if (isTerminateDevicesSessions) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    async terminateSessionForDevice(req: RequestWithParams<Params>, res: Response) {
        const deviceId = req.params.id

        const isTerminateDeviceSessionById = await this.devicesService
            .terminateDeviceSessionById(deviceId)

        if (isTerminateDeviceSessionById) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
}