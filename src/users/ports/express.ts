import { Router } from 'express';
import { OAuth2Config } from '../../common/config/authConfig';
import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';
import { InternalError } from '../../common/errors/errors';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

export const createUserRouter = (oauth2Config: OAuth2Config): Router => {
  const router = Router();
  const client = new ClientOAuth2(oauth2Config);

  router.get('/oauth2', (req, res) => {
    const uri = client.code.getUri();
    return res.redirect(uri);
  });

  router.get('/oauth2/callback', async (req, res) => {
    const token = await client.code.getToken(req.originalUrl);
    const request: { method: 'get'; url: string } = {
      method: 'get',
      url: oauth2Config.userIdentityUri,
    };

    const { data } = await axios.request(token.sign(request));
    const user = await userService.createOrGetUser({
      fullName: data.name,
      email: data.email,
      username: data.login,
      avatarUrl: data.avatar_url,
      openid: data.id.toString(),
    });

    req.session.accessToken = token.accessToken;
    req.session.user = user;

    return res.send();
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalError(err);
      }
      res.clearCookie('connect.sid');
      return res.send();
    });
  });

  return router;
};
