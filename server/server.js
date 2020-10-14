const express = require('express');
const { authMiddleware } = require('./utils/auth');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas/index');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
// create new apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

//integrate apollo server with express appilcation as middleware
server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
