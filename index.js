import { ApolloServer } from "@apollo/server";

import { startStandaloneServer } from "@apollo/server/standalone";

//dummy db
import _db from "./_db.js";

//types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    users() {
      return _db.users;
    },
    posts() {
      return _db.posts;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("Server is runing on port", 4000);
