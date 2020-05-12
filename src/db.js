//This file connect to the remote prisma server and give us the possibility to query it with JavaScript
const { Prisma } = require('prisma-binding');
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  //endpoint: "http://localhost:4466",  
  //endpoint: "http://172.30.241.100:4466",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false,
});

module.exports = db