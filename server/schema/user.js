const UserSchema = `
  type User {
    _id: String
    username: String
    avatar: String
    email: String
    username: String
    activated: Boolean
    mobile: String
    wx_id: String
  }

  type UserMessage {
    success: Boolean!
    error: String
    user: User
    token: String
  }

  input UserInput {
    username: String
    email: String
    mobile: String
    password: String
  }

  type Query {
    getUserInfoByToken(token: String!): UserMessage
  }

  type Mutation {
    validateUser(UserInput: UserInput!): UserMessage
    createUser(UserInput: UserInput!): UserMessage
    updateUser(field: String!, value: String!, token: String!): UserMessage
  }
`;

export default UserSchema;
