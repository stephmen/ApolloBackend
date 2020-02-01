const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
    // check if there is a current user ID
    //console.log("*****QUERY*ME*******CTX.REQ.userID*************")
    //console.log(ctx.req.userId)
    if (!ctx.req.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.req.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.req.userId) {
      throw new Error('You must be logged in!');
    }
    //console.log(ctx.req.userId);
    // 2. Check if the user has the permissions to query all the users
    //hasPermission(ctx.req.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  }
module.exports = Query