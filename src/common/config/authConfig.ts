import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';

export enum AuthType {
  oauth2 = 'OAuth2',
}

export class OAuth2Config {
  @IsString()
  clientId: string = process.env.PROZA_OAUTH2_CLIENT_ID!;

  @IsString()
  clientSecret: string = process.env.PROZA_OAUTH2_CLIENT_SECRET!;

  @IsString()
  accessTokenUri: string = process.env.PROZA_OAUTH2_ACCESS_TOKEN_URI!;

  @IsString()
  authorizationUri: string = process.env.PROZA_OAUTH2_AUTHORIZATION_URI!;

  @IsString()
  redirectUri: string = process.env.PROZA_OAUTH2_REDIRECT_URI!;

  scopes = ['openid', 'profile', 'email'];

  @IsString()
  userIdentityUri: string = process.env.PROZA_OAUTH2_USER_IDENTITY_URI!;
}

export class AuthConfig {
  @IsEnum(AuthType)
  type: AuthType | string = process.env.PROZA_AUTH_TYPE || AuthType.oauth2;

  @ValidateNested()
  @ValidateIf((o) => o.type === AuthType.oauth2)
  oauth2: OAuth2Config = new OAuth2Config();

  @IsString()
  sessionSecret: string = process.env.PROZA_AUTH_SESSION_SECRET || 'secret';

  isOAuth2Enabled = this.type === AuthType.oauth2;
}
