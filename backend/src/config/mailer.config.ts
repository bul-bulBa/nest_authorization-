import { ConfigService } from "@nestjs/config";

export const getMailerConfig = ( configService: ConfigService ) => ({   
    apiKey: configService.getOrThrow<string>('MAIL_API_KEY'),
    from: configService.getOrThrow<string>('MAIL_HOST')
})