const UserSchema = `
  type User {
    id: String
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
  }

  input UserInput {
    username: String
    email: String
    mobile: String
    password: String
  }

  type Query {
    getUser(id: String!): User
  }

  type Mutation {
    validateUser(UserInput: UserInput): UserMessage
    createUser(UserInput: UserInput): UserMessage
  }
`;

export default UserSchema;
