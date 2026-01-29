import { TypeOptions } from "@/auth/provider/provider.constants";
import { FacebookProvider } from "@/auth/provider/services/facebook.provider";
import { GoogleProvider } from "@/auth/provider/services/google.provider";
import { ConfigService } from "@nestjs/config";

export const getProvidersConfig = async (
    configService: ConfigService
): Promise<TypeOptions> => ({
    baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
    services: [
        new GoogleProvider({
            client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            scopes: ['email', 'profile']
        }),
        new FacebookProvider({
            client_id: configService.getOrThrow<string>('FACEBOOK_CLIENT_ID'),
            client_secret: configService.getOrThrow<string>('FACEBOOK_CLIENT_SECRET'),
            scopes: ['email', 'public_profile']
        })
    ]
})