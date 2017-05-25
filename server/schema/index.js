export const rootSchema = `
  type User {
    uid: String
    username: String
    avatar: String
    email: String
    username: String
    activated: Boolean
    mobile: String
    wx_id: String
  }

  type UpdateUserMessage {
    success: Boolean!
    user: User
  }

  input UserInput {
    username: String
    email: String
    mobile: String
    password: String
  }

  type Query {
    getUser(UserID: Int!): User
  }

  type Mutation {
    createUser(UserInput: UserInput): UpdateUserMessage
  }
`;
