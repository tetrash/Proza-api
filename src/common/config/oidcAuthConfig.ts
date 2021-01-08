import { IsBoolean, IsString, ValidateIf } from 'class-validator';

export class OidcAuthConfig {
  @IsString({ message: 'missing variable PROZA_OIDC_CLIENT_ID' })
  clientId: string = process.env.PROZA_OIDC_CLIENT_ID!;

  @IsString({ message: 'missing variable PROZA_OIDC_CLIENT_SECRET' })
  clientSecret: string = process.env.PROZA_OIDC_CLIENT_SECRET!;

  @IsString({ message: 'missing variable PROZA_OIDC_AUTODISCOVER_ENDPOINT' })
  @ValidateIf((object: OidcAuthConfig): boolean => object.autoDiscover)
  autoDiscoverEndpoint: string = process.env.PROZA_OIDC_AUTODISCOVER_ENDPOINT!;

  @IsBoolean({ message: 'missing variable PROZA_OIDC_AUTODISCOVER' })
  autoDiscover: boolean = process.env.PROZA_OIDC_AUTODISCOVER === 'true' || process.env.PROZA_OIDC_AUTODISCOVER === '1';

  @IsString({ message: 'missing variable PROZA_OIDC_AUTHORIZATION_ENDPOINT' })
  @ValidateIf((object: OidcAuthConfig): boolean => !object.autoDiscover)
  authorizationEndpoint: string = process.env.PROZA_OIDC_AUTHORIZATION_ENDPOINT!;

  @IsString({ message: 'missing variable PROZA_OIDC_TOKEN_ENDPOINT' })
  @ValidateIf((object: OidcAuthConfig): boolean => !object.autoDiscover)
  tokenEndpoint: string = process.env.PROZA_OIDC_TOKEN_ENDPOINT!;

  @IsString({ message: 'missing variable PROZA_OIDC_USER_INFO_ENDPOINT' })
  @ValidateIf((object: OidcAuthConfig): boolean => !object.autoDiscover)
  userInfoEndpoint: string = process.env.PROZA_OIDC_USER_INFO_ENDPOINT!;

  scopes = ['openid', 'profile', 'email'];
}
