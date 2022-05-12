//This file connect to the remote prisma server and give us the possibility to query it with JavaScript
const { Prisma } = require('prisma-binding');
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  //endpoint: "http://prisma.myeccom.com",
  // secret: process.env.PRISMA_SECRET,
  secret: "prisma",
  debug: false,
});

module.exports = db