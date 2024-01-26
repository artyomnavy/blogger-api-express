import {Router} from "express";
import {authRefreshTokenMiddleware} from "../middlewares/auth/auth-middleware";
import {deviceSessionMiddleware} from "../middlewares/device-middleware";
import {container} from "../composition-root";
import {DevicesController} from "../controllers/devices-controller";

const devicesController = container.resolve(DevicesController)
export const securityRouter = Router({})

securityRouter
    .delete('/devices',
        authRefreshTokenMiddleware,
        devicesController.terminateSessionsForAllOthersDevices.bind(devicesController))

    .delete('/devices/:id',
        authRefreshTokenMiddleware,
        deviceSessionMiddleware,
        devicesController.terminateSessionForDevice.bind(devicesController))

    .get('/devices',
        authRefreshTokenMiddleware,
        devicesController.getAllDevicesSessionsForUser.bind(devicesController))