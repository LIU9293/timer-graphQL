import { UserFactory } from '../faker';
import User from '../model/user';

const getUser = (uid) => {
  return UserFactory.Basic.build();
}

const createUser = async (user) => {
  console.log('--------- create user function ---------')
  console.log(user);
  console.log('--------- create user function ---------')
  const newUser = new User(user);
  try {
    const savedUser = newUser.save();
    console.log(savedUser);
    return {
      success: true,
      user: User.findOne({email: user.email})
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e
    }
  }
}

export {
  getUser,
  createUser
};
