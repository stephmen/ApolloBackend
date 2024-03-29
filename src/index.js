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



console.log(process.env.WHITELIST)
const whitelist = process.env.WHITELIST.split(', ')

console.log("Whiteliste")
console.log(whitelist)
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
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
  console.log(`Bakend server is ${process.env.PRISMA_ENDPOINT}`)
  console.log(`🚀 Server ready at ${process.env.BACKEND_URL}`)
} 
);