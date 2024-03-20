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
  Mutation: {
    addUser(_, args) {
      //console.log(args);
      let user = {
        ...args.user,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      _db.users.push(user);

      //console.log(user);
      return user;
    },
    addPost(_, args) {
      let post = {
        ...args.post,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      _db.posts.push(post);

      return post;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("Server is runing on port", 4000);
