import { Router } from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';
import { LinkedinAuthConfig } from '../../common/config/linkedinAuthConfig';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

// TODO: find more robust way to get linkedin profile image
function extractLinkedinPhoto(data: any) {
  try {
    return data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;
  } catch (e) {
    return undefined;
  }
}

export const createUserLinkedinAuthRouter = async (
  config: LinkedinAuthConfig,
  redirectUri: string,
): Promise<Router> => {
  const router = Router();

  const clientConfig: ClientOAuth2.Options = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    scopes: config.scopes,
    authorizationUri: 'https://www.linkedin.com/oauth/v2/authorization',
    accessTokenUri: 'https://www.linkedin.com/oauth/v2/accessToken',
  };

  const userInfoEndpoint =
    'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))';
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
      token.tokenType = 'bearer';
      const userRequest: { method: 'get'; url: string } = {
        method: 'get',
        url: userInfoEndpoint,
      };

      const { data } = await axios.request(token.sign(userRequest));

      const user = await userService.createOrGetUser({
        fullName: `${data.localizedFirstName} ${data.localizedLastName}`,
        email: data.email,
        username: `${data.localizedFirstName} ${data.localizedLastName}`,
        avatarUrl: extractLinkedinPhoto(data),
        openid: data.id,
        openidSource: 'linkedin',
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
