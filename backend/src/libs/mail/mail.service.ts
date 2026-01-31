import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ConfirmationTemplate } from './templates/confirmation.email';


@Injectable()
export class MailService {
    constructor(
        @Inject('RESEND_CLIENT')
        private readonly resendConfig: { client: Resend, from: string },
        private readonly configService: ConfigService
    ) { }

    async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ConfirmationTemplate({domain, token}))

        return this.sendMail(email, 'Email confirmation', html)
    }

    private sendMail(email: string, subject: string, html: string) {
        console.log('EMAIL', email)
        return this.resendConfig.client.emails.send({
            from: this.resendConfig.from,
            to: email,
            subject,
            html
        })
    }

    async sendTestEmail(to: string) {
    return await this.resendConfig.client.emails.send({
        from: this.resendConfig.from,
        to,
        subject: 'hello!',
        html: '<div>Everything is okay</div>'
    })
}

}
