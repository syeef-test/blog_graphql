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
    async login(_, args) {
      try {
        console.log(args);
        const existingUser = await UserModel.findOne({
          email: args.user.email,
        });

        if (!existingUser) {
          throw new Error("user does not exist by this email");
        }

        const match = bcrypt.compareSync(
          args.user.password,
          existingUser.password
        );

        let token = existingUser.token;

        if (!token) {
          token = jwt.sign(
            {
              userId: existingUser._id,
              name: existingUser.name,
              email: args.user.email,
            },
            process.env.TOKEN_SECRET
          );

          await UserModel.findOneAndUpdate(
            { _id: existingUser._id },
            { $set: { jwt_token: token } }
          );
        }

        //return { user: existingUser, token };
        return existingUser;
      } catch (error) {
        console.error(error);
      }
    },
    async addPost(_, args) {
      try {
        //console.log(args);
        const token = args.post.jwt_token;
        const content = args.post.content;

        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!user) {
          throw new Error("jwt token not exist");
        }

        const existingUser = await UserModel.findById(user.userId);
        if (existingUser) {
          console.log("existing user", existingUser._id);
          const newPost = await PostModel.create({
            content: args.post.content,
            user_id: existingUser._id,
          });
          //console.log(newPost);
          return newPost;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPost(_, args) {
      try {
        const token = args.user.jwt_token;

        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!user) {
          throw new Error("jwt token not exist");
        }

        const existingUser = await UserModel.findById(user.userId);
        if (existingUser) {
          //console.log("existing user", existingUser._id);
          const allPostByUser = await PostModel.find({
            user_id: existingUser._id,
          });
          console.log(allPostByUser);
          return allPostByUser;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("Server is runing on port", 4000);
