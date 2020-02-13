const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    
    
    me(parent, args, ctx, info) {
    // check if there is a current user ID
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
    
    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.req.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure they are logged in
    if (!ctx.req.userId) {
      throw new Error('You arent logged in!');
    }
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );
    // 3. Check if the have the permissions to see this order
    const ownsOrder = order.user.id === ctx.req.userId;
    const hasPermissionToSeeOrder = ctx.req.user.permissions.includes('ADMIN');
    if (!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error('You cant see this buddd');
    }
    // 4. Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.req;
    if (!userId) {
      throw new Error('you must be signed in!');
    }
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId },
        },
      },
      info
    );
  },
  }
module.exports = Query