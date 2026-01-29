import { BaseOAuthService } from "./base-oauth.service";
import { TypeProviderOptions } from "./types/provider-options.type";
import { TypeUserInfo } from "./types/user-info.type";


export class FacebookProvider extends BaseOAuthService {
    constructor(options: TypeProviderOptions) {
        super({
            name: 'facebook',
            // Використовуємо Graph API v19.0 (або актуальну версію)
            authorize_url: 'https://www.facebook.com/v19.0/dialog/oauth',
            access_url: 'https://graph.facebook.com/v19.0/oauth/access_token',
            // Важливо: Facebook вимагає явно вказати поля (fields)
            profile_url: 'https://graph.facebook.com/me?fields=name,email,picture.type(large)',
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret
        })
    }

    async extractUserInfo(data: FacebookProfile): Promise<TypeUserInfo> {
        return super.extractUserInfo({
            email: data.email,
            name: data.name,
            // У Facebook URL картинки знаходиться глибоко в об'єкті
            picture: data.picture?.data?.url
        })
    }
}

interface FacebookProfile extends Record<string, any> {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}