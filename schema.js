export const typeDefs = `#graphql
type User{
    id:ID!
    name:String!
    email:String!
    password:String!

}
type Post{
    id:ID!
    content:String!
}
type Query{
    users:[User]
    user(id:ID!):User
    posts:[Post]
    post(id:ID!):Post
}
`;
