import { IsString } from 'class-validator';

export class GoogleAuthConfig {
  @IsString()
  clientId: string = process.env.PROZA_AUTH_GOOGLE_CLIENT_ID!;

  @IsString()
  clientSecret: string = process.env.PROZA_AUTH_GOOGLE_CLIENT_SECRET!;

  scopes = ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'email'];
}
