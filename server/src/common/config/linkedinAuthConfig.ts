import { IsString } from 'class-validator';

export class LinkedinAuthConfig {
  @IsString()
  clientId: string = process.env.PROZA_AUTH_LINKEDIN_CLIENT_ID!;

  @IsString()
  clientSecret: string = process.env.PROZA_AUTH_LINKEDIN_CLIENT_SECRET!;

  scopes = ['r_liteprofile', 'r_emailaddress'];
}
