const express = require('express');
const { Prisma } = require('prisma-binding');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require("./db");
require('dotenv').config();

const typeDefs = importSchema('./src/schema.graphql');
const Query = require('../src/resolvers/Query');
const Mutation = require('../src/resolvers/Mutation');

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Mutation,
    Query
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({ ...req, db }),
});

const app = express();

var whitelist = ["http://prisma-development.apps-crc.testing", "prisma-development.apps-crc.testing", "http://172.30.241.100:4466", "172.30.52.150", "apollo-backend-development.apps-crc.testing", "http://apollo-backend-development.apps-crc.testing", "172.30.90.125", "frontend-development.apps-crc.testing", "http://frontend-development.apps-crc.testing", "http://checkout.stripe.com/", "http://192.168.64.2:4466"]


var corsOptions = {
  origin: function (origin, callback) {
    //if (process.env.$WHITELIST.indexOf(origin) !== -1) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true // <-- REQUIRED backend setting
}




// var corsOptions = {
//   origin: process.env.FRONTEND_URL, 
//   credentials: true // <-- REQUIRED backend setting
// };
// //console.log(process.env.APP_SECRET)

app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req, res, next) => { // checks for user in cookies and adds userId to the requests
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
})
  
app.use(async (req, res, next) => {
 
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{id, permissions, email, name}' //the graphql query to pass to the user query
  );
  req.user = user;
  next();
})

server.applyMiddleware({
  app,
  path: '/',
  cors: false, // disables the apollo-server-express cors to allow the cors middleware use
})

app.listen({ port: 4444 }, () => {
  console.log(`🚀 Server ready at http://localhost:4444${server.graphqlPath}`)
  let whitelist2 = process.env.WHITELIST.split(', ')
  console.log(whitelist2)
} 
);