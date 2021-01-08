import { InternalError } from '../../common/errors/errors';
import { Router } from 'express';

export const createAuthRouter = () => {
  const router = Router();

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalError(err);
      }
      res.clearCookie('connect.sid');

      const { redirectTo } = req.query;

      if (redirectTo && redirectTo !== '') {
        return res.redirect(redirectTo.toString());
      }
      return res.send();
    });
  });

  return router;
};
