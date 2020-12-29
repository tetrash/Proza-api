import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { GithubOAuth2Config } from './githubOAuth2Config';
import { OidcAuthConfig } from './oidcAuthConfig';
import { GoogleAuthConfig } from './googleAuthConfig';
import { LinkedinAuthConfig } from './linkedinAuthConfig';

export enum AuthType {
  github = 'github',
  oidc = 'oidc',
  google = 'google',
  linkedin = 'linkedin',
}

export class AuthConfig {
  @IsEnum(AuthType, {
    each: true,
    message: `incorrect PROZA_AUTH_TYPE variable, available ${Object.values(AuthType).join(', ')}`,
  })
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

  @ValidateNested()
  @ValidateIf((obj: AuthConfig) => obj.isLinkedinAuth)
  linkedinAuth: LinkedinAuthConfig = new LinkedinAuthConfig();

  isLinkedinAuth = this.type.includes(AuthType.google);

  @IsString({ message: 'missing variable PROZA_AUTH_SESSION_SECRET' })
  sessionSecret: string = process.env.PROZA_AUTH_SESSION_SECRET || 'secret';

  @IsString({ message: 'missing variable PROZA_AUTH_PREFIX' })
  authPrefixPath: string = process.env.PROZA_AUTH_PREFIX || '/auth';
}
