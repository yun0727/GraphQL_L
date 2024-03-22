import { ApolloServer, gql } from "apollo-server"

let tweets = [
  {
    id: "1",
    text:"first one!",
    userId :"2"
  },
  {
    id:"2",
    text:"seconde one",
    userId:"1"
  }
]

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las"
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask"
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!  
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(
      id:ID!
      ): Tweet
  }
  type Mutation{
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
  `

const resolvers = {
  Query: {
    allTweets(){
      return tweets;
    },
    tweet(root, {id}){
      return tweets.find((tweet)=>tweet.id === id)
    },
    allUsers(){
      console.log("allUsers called!")
      return users
    }
  },
  Mutation:{
    postTweet(_,{text, userId}){
      const newTweet = {
        id: tweets.length+1,
        text,
        userId
      };
      tweets.push(newTweet);
      return newTweet
    },
    deleteTweet(_,{id}){
      const Tweet = tweets.find((tweet)=>tweet.id === id)
      if (!tweet) return false;
      tweets = tweets.filter((tweet)=>tweet.id !== id)
      return true
    }
  },
  User:{
    fullName({firstName, lastName}){
      return `${firstName} ${lastName}`
    }
  },
  Tweet:{
    author ({userId}){
      const result = users.find((user)=> user.id ===userId)
      if (!result){
        console.log("해당 자료가 없습니다.");
        return null
      }
      return result
    }
  }
}

const server = new ApolloServer({typeDefs, resolvers
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    });