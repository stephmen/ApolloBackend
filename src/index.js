const express = require('express');
var router = express.Router()
const { Prisma } = require('prisma-binding');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require("./db");
//require('dotenv').config();

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



//let WHITELIST = 'http://prisma-development.apps-crc.testing,prisma-development.apps-crc.testing, http://172.25.168.170:4466, 172.25.255.158, apollo-backend-development.apps-crc.testing, http://apollo-backend-development.apps-crc.testing, 172.25.132.200, frontend-development.apps-crc.testing, http://frontend-development.apps-crc.testing, http://frontend-development.apps-crc.testing/graphql, http://checkout.stripe.com'
console.log(process.env.WHITELIST)
const whitelist = process.env.WHITELIST2.split(', ')
const whitelist1=["http://prisma-development.apps-crc.testing",  "prisma-development.apps-crc.testing", "http://172.25.16.144:4466", "http://172.25.58.47", "apollo-backend-development.apps-crc.testing", "http://apollo-backend-development.apps-crc.testing", "http://172.25.58.47", "frontend-development.apps-crc.testing", "http://frontend-development.apps-crc.testing", "http://checkout.stripe.com/"]


console.log("Whitelise 1")
console.log(whitelist1)
console.log("Whitelise")
console.log(whitelist)
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
      console.log(origin)
    } else {
      callback(new Error('Not allowed by CORS'))
      
    }
  },
  credentials: true // <-- REQUIRED backend setting
}
//Temporary Disabled CORS
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
  console.log(`🚀 Server ready at ${process.env.BACKEND_URL}`)
} 
);