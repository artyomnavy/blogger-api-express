import {EmailsAdapter} from "../adapters/EmailsAdapter";
import {inject, injectable} from "inversify";

@injectable()
export class EmailsManager {
    constructor(@inject(EmailsAdapter) protected emailsAdapter: EmailsAdapter) {
    }
    async sendEmailConfirmationMessage(email: string, code: string) {
        return await this.emailsAdapter
            .sendEmailWithCode(email, code)
    }
    async sendEmailWithRecoveryCode(email: string, recoveryCode: string) {
        return await this.emailsAdapter
            .sendEmailWithRecoveryCode(email, recoveryCode)
    }
}