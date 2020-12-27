import { IsString } from 'class-validator';

export class GithubOAuth2Config {
  @IsString()
  clientId: string = process.env.PROZA_OAUTH2_CLIENT_ID!;

  @IsString()
  clientSecret: string = process.env.PROZA_OAUTH2_CLIENT_SECRET!;

  @IsString()
  accessTokenUri: string = process.env.PROZA_OAUTH2_ACCESS_TOKEN_URI!;

  scopes = ['openid', 'profile', 'user:email'];
}
