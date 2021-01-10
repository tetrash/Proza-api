export enum AuthType {
  github = 'github',
  oidc = 'oidc',
  google = 'google',
  linkedin = 'linkedin',
  test = 'test',
}

export interface ServerMetadata {
  apiVersion: string;
  enabledUserAuthMethods: AuthType[] | string[];
}
