import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { GithubOAuth2Config } from './githubOAuth2Config';

export enum AuthType {
  github = 'github',
}

export class AuthConfig {
  @IsEnum(AuthType, { each: true })
  type: AuthType[] | string[] = (process.env.PROZA_AUTH_TYPE || '').split(' ');

  @ValidateNested()
  @ValidateIf((o) => o.type === AuthType.github)
  githubAuth: GithubOAuth2Config = new GithubOAuth2Config();

  isGithubAuth = this.type.includes(AuthType.github);

  @IsString()
  sessionSecret: string = process.env.PROZA_AUTH_SESSION_SECRET || 'secret';

  @IsString()
  authPrefixPath: string = process.env.PROZA_AUTH_PREFIX || '/auth';
}
