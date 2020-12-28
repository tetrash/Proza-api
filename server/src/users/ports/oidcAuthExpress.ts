import { Router } from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';
import { OidcAuthConfig } from '../../common/config/oidcAuthConfig';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

export const createUserOidcAuthRouter = async (config: OidcAuthConfig, redirectUri: string): Promise<Router> => {
  const router = Router();

  const clientConfig: ClientOAuth2.Options = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    scopes: config.scopes,
    accessTokenUri: config.tokenEndpoint,
    authorizationUri: config.authorizationEndpoint,
  };

  let userInfoEndpoint = config.userInfoEndpoint;

  if (config.autoDiscover) {
    const autoDiscover = await axios.get(config.autoDiscoverEndpoint);

    clientConfig.authorizationUri = autoDiscover.data.authorization_endpoint;
    clientConfig.accessTokenUri = autoDiscover.data.token_endpoint;
    userInfoEndpoint = autoDiscover.data.userinfo_endpoint;
  }

  const client = new ClientOAuth2(clientConfig);

  router.get('/', (req, res, next) => {
    try {
      const { redirectTo } = req.query;
      const uri = client.code.getUri({
        state: redirectTo ? redirectTo.toString() : undefined,
        redirectUri,
      });
      return res.redirect(uri);
    } catch (e) {
      next(e);
    }
  });

  router.get('/callback', async (req, res, next) => {
    try {
      const token = await client.code.getToken(req.originalUrl, { redirectUri });
      const userRequest: { method: 'get'; url: string } = {
        method: 'get',
        url: userInfoEndpoint,
      };

      const { data } = await axios.request(token.sign(userRequest));

      const user = await userService.createOrGetUser({
        fullName: data.name,
        email: data.email,
        username: data.preferred_username || data.username || data.name,
        avatarUrl: data.avatar_url,
        openid: (data.id && data.toString()) || data.sub,
        openidSource: 'oidc',
      });

      req.session.accessToken = token.accessToken;
      req.session.user = user;

      const { state } = req.query;
      if (state && state !== '') {
        return res.redirect(state.toString());
      }
      return res.send();
    } catch (e) {
      next(e);
    }
  });

  return router;
};
