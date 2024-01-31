export type DeviceSessionType = {
    iat: string,
    exp: string,
    ip: string,
    deviceId: string,
    deviceName: string,
    userId: string
}

export type OutputDeviceSessionType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

export class DeviceSession {
    constructor(
        public iat: string,
        public exp: string,
        public ip: string,
        public deviceId: string,
        public deviceName: string,
        public userId: string
    ) {
    }
}