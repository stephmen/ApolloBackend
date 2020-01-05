//This file connect to the remote prisma server and give us the possibility to query it with JavaScript
const { Prisma } = require('prisma-binding');
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  //endpoint: "http://172.30.113.53:4466",
  endpoint: "http://localhost:4466",
  secret: process.env.PRISMA_SECRET,
  debug: true,
});

module.exports = db