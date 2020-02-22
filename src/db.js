//This file connect to the remote prisma server and give us the possibility to query it with JavaScript
const { Prisma } = require('prisma-binding');
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  //endpoint: "http://172.30.113.53:4466",
  //endpoint: "172.30.28.167:4466",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false,
});

module.exports = db