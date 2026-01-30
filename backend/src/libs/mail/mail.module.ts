import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '@/config/mailer.config';
import { Resend } from 'resend'

@Global()
@Module({
  providers: [ 
    {
      provide: 'RESEND_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getMailerConfig(configService)
        return {
          client: new Resend(config.apiKey),
          from: config.from
        }
      }
    },
    MailService
  ],
  exports: [MailService]
})
export class MailModule {}
