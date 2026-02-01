import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ConfirmationTemplate } from './templates/confirmation.email';
import { ResetPasswordTemplate } from './templates/reset.password';
import { TwoFactorAuthTemplate } from './templates/two-factor';


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

    async sendPasswordReset(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ResetPasswordTemplate({domain, token}))

        return this.sendMail(email, 'Reset password', html)
    }

    async sendTwoFactorToken(email: string, code: string) {
        const html = await render(TwoFactorAuthTemplate({code}))

        return this.sendMail(email, 'Сonfirmation of your identity', html)
    }

    private sendMail(email: string, subject: string, html: string) {
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
