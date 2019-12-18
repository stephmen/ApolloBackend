//This file connect to the remote prisma server and give us the possibility to query it with JavaScript
const { Prisma } =require('prisma-binding');
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: '172.30.205.22:4466',
  secret: process.env.PRISMA_SECRET,
  debug: true,
});

module.exports = db