import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';


@Injectable()
export class MailService {
    constructor(
        @Inject('RESEND_CLIENT') 
        private readonly resendConfig: {client: Resend, from: string}
    ) {}

    // async sendEmail(to: string) {
    //     return await this.resend.emails.send({
    //         from: 
    //     })
    // }

    async sendTestEmail(to: string) {
        return await this.resendConfig.client.emails.send({
            from: this.resendConfig.from,
            to,
            subject: 'hello!',
            html: '<div>Everything is okay</div>'
        })
    }

}
