import { Router } from 'express';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';
import { GithubOAuth2Config } from '../../common/config/githubOAuth2Config';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

export const createUserGithubAuthRouter = (oauth2Config: GithubOAuth2Config): Router => {
  const router = Router();
  const client = new ClientOAuth2({
    clientId: oauth2Config.clientId,
    clientSecret: oauth2Config.clientSecret,
    scopes: oauth2Config.scopes,
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
  });

  router.get('/', (req, res) => {
    const { redirectTo } = req.query;
    const uri = client.code.getUri({ state: redirectTo ? redirectTo.toString() : undefined });
    return res.redirect(uri);
  });

  router.get('/callback', async (req, res) => {
    const token = await client.code.getToken(req.originalUrl);
    const userRequest: { method: 'get'; url: string } = {
      method: 'get',
      url: 'https://api.github.com/user',
    };

    const { data } = await axios.request(token.sign(userRequest));

    let email = data.email;

    if (!email) {
      const emailRequest: { method: 'get'; url: string } = {
        method: 'get',
        url: 'https://api.github.com/user/emails',
      };

      const emails = await axios.request(token.sign(emailRequest));

      if (Array.isArray(emails.data)) {
        const foundEmails = emails.data.find((e) => e.primary === true);
        if (foundEmails.email) {
          email = foundEmails.email;
        }
      }
    }

    const user = await userService.createOrGetUser({
      fullName: data.name,
      email,
      username: data.login,
      avatarUrl: data.avatar_url,
      openid: data.id.toString(),
      openidSource: 'github',
    });

    req.session.accessToken = token.accessToken;
    req.session.user = user;

    const { state } = req.query;
    if (state && state !== '') {
      return res.redirect(state.toString());
    }
    return res.send();
  });

  return router;
};
