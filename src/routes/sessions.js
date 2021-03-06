import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';
import { User } from '../models';

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.flash.set(`You have successfully singed in as ${user.fullName()}`);
        ctx.redirect(router.url('root'));
        return;
      }
      ctx.flash.set('Email or Password were wrong');
      ctx.redirect(router.url('newSession'));
    })
    .delete('delSession', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
