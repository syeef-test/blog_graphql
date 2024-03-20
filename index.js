import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "./models/userSchema.js";
import PostModel from "./models/postSchema.js";

//dummy db
import _db from "./_db.js";

//mongodb
async function connectMongoDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    await mongoose.connect(MONGODB_URI);
    console.log("Mongodb connected succesfully");
  } catch (error) {
    console.log("error connecting to mongodb");
  }
}
connectMongoDB();

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
    async addUser(_, args) {
      try {
        console.log(args);

        const existingUser = await UserModel.findOne({
          email: args.user.email,
        });
        if (existingUser) {
          throw new Error("user allready exist");
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(args.user.password, saltRounds);
        const newUser = await UserModel.create({
          name: args.user.name,
          email: args.user.email,
          password: hash,
        });

        return newUser;

        // console.log(newUser);
      } catch (error) {
        console.error(error);
      }
    },
    addPost(_, args) {
      let post = {
        ...args.post,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      _db.posts.push(post);

      return post;
    },

    deletePost(_, args) {
      _db.posts = _db.posts.filter((post) => post.id !== args.id);
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
