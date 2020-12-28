import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { GithubOAuth2Config } from './githubOAuth2Config';
import { OidcAuthConfig } from './oidcAuthConfig';

export enum AuthType {
  github = 'github',
  oidc = 'oidc',
}

export class AuthConfig {
  @IsEnum(AuthType, { each: true })
  type: AuthType[] | string[] = (process.env.PROZA_AUTH_TYPE || '').split(' ');

  @ValidateNested()
  @ValidateIf((obj: AuthConfig) => obj.isGithubAuth)
  githubAuth: GithubOAuth2Config = new GithubOAuth2Config();

  isGithubAuth = this.type.includes(AuthType.github);

  @ValidateNested()
  @ValidateIf((obj: AuthConfig) => obj.isOidcAuth)
  oidcAuth: OidcAuthConfig = new OidcAuthConfig();

  isOidcAuth = this.type.includes(AuthType.oidc);

  @IsString()
  sessionSecret: string = process.env.PROZA_AUTH_SESSION_SECRET || 'secret';

  @IsString()
  authPrefixPath: string = process.env.PROZA_AUTH_PREFIX || '/auth';
}
