export const rootSchema = `
  type User {
    uid: String,
    name: String,
    avatar: String,
    email: String,
    username: String,
    activated: Bool,
    mobile: String,
    wx_id: String
  }
  type Query {
    getUser(UserID: Int): User
  }
`;
