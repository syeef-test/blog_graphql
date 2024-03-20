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
    user(_, args) {
      return _db.users.find((user) => user.id === args.id);
    },
    posts() {
      return _db.posts;
    },
    post(_, args) {
      return _db.posts.find((post) => post.id === args.id);
    },
    followers() {
      return _db.followers;
    },
    follower(_, args) {
      return _db.followers.find((f) => f.id === args.id);
    },
  },
  User: {
    posts(parent) {
      return _db.posts.filter((post) => post.user_id === parent.id);
    },
  },
  Post: {
    user(parent) {
      return _db.users.find((user) => user.id === parent.user_id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("Server is runing on port", 4000);
