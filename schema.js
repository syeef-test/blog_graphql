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
}
input AddUserInput{
    name:String!,
    email:String!,
}
input AddPostInput{
    content:String!
}
`;
