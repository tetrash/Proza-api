import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { GithubOAuth2Config } from './githubOAuth2Config';
import { OidcAuthConfig } from './oidcAuthConfig';
import { GoogleAuthConfig } from './googleAuthConfig';

export enum AuthType {
  github = 'github',
  oidc = 'oidc',
  google = 'google',
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

  @ValidateNested()
  @ValidateIf((obj: AuthConfig) => obj.isGoogleAuth)
  googleAuth: GoogleAuthConfig = new GoogleAuthConfig();

  isGoogleAuth = this.type.includes(AuthType.google);

  @IsString()
  sessionSecret: string = process.env.PROZA_AUTH_SESSION_SECRET || 'secret';

  @IsString()
  authPrefixPath: string = process.env.PROZA_AUTH_PREFIX || '/auth';
}
