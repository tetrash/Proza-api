import { IsString } from 'class-validator';

export class GithubOAuth2Config {
  @IsString({ message: 'missing variable PROZA_AUTH_GITHUB_CLIENT_ID' })
  clientId: string = process.env.PROZA_AUTH_GITHUB_CLIENT_ID!;

  @IsString({ message: 'missing variable PROZA_AUTH_GITHUB_CLIENT_SECRET' })
  clientSecret: string = process.env.PROZA_AUTH_GITHUB_CLIENT_SECRET!;

  scopes = ['openid', 'profile', 'user:email'];
}
