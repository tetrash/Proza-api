import { IsString } from 'class-validator';

export class GoogleAuthConfig {
  @IsString({ message: 'missing variable PROZA_AUTH_GOOGLE_CLIENT_ID' })
  clientId: string = process.env.PROZA_AUTH_GOOGLE_CLIENT_ID!;

  @IsString({ message: 'missing variable PROZA_AUTH_GOOGLE_CLIENT_SECRET' })
  clientSecret: string = process.env.PROZA_AUTH_GOOGLE_CLIENT_SECRET!;

  scopes = ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'email'];
}
