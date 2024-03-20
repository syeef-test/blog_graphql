export const typeDefs = `#graphql
type User{
    id:ID!
    name:String!
    email:String!
    posts:[Post!]
}
type Post{
    id:ID!
    content:String!
    user:User!
}
type Query{
    users:[User]
    user(id:ID!):User
    posts:[Post]
    post(id:ID!):Post
}
type Mutation{
    addUser(user:AddUserInput):User
    addPost(post:AddPostInput):Post
    deletePost(id:ID!):[Post]
}
input AddUserInput{
    name:String!,
    email:String!,
    password:String!
}
input AddPostInput{
    content:String!
}
`;
