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
type Follower{
    id:ID!
    follower:User!
    followed:[User!]!
}
type Query{
    users:[User]
    user(id:ID!):User
    posts:[Post]
    post(id:ID!):Post
    followers:[Follower]
    follower(id:ID!):Follower
}
`;
