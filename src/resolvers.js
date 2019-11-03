const { forwardTo } = require('prisma-binding');
const resolvers = {
  Query: {
    items: forwardTo('db'),
  },

  Mutation: {
    createItem: async (parent, args, ctx, info) => {
      // TODO: check if they are logged in

      const item = await ctx.db.mutation.createItem({
        data: {
          ...args
        }
      }, info);
      console.log(item)
      return item
    }
}
}
module.exports = resolvers