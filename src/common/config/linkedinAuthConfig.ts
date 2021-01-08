import { IsString } from 'class-validator';

export class LinkedinAuthConfig {
  @IsString({ message: 'missing variable PROZA_AUTH_LINKEDIN_CLIENT_ID' })
  clientId: string = process.env.PROZA_AUTH_LINKEDIN_CLIENT_ID!;

  @IsString({ message: 'missing variable PROZA_AUTH_LINKEDIN_CLIENT_SECRET' })
  clientSecret: string = process.env.PROZA_AUTH_LINKEDIN_CLIENT_SECRET!;

  scopes = ['r_liteprofile', 'r_emailaddress'];
}
