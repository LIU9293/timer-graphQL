import chalk from 'chalk';
import { UserFactory } from '../faker';
import User from '../model/user';

const getUser = (uid) => {
  return UserFactory.Basic.build();
}

const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return {
      success: true,
      user: User.findOne({email: user.email})
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

const validateUser = async (user) => {
  if (!user.password) {
    return {
      success: false,
      error: 'No password provided!'
    }
  }
  try {
    let targetUser;
    if (user.username) {
      targetUser = await User.findOne({username: user.username});
    } else if (user.email) {
      targetUser = await User.findOne({email: user.email});
    } else if (user.mobile) {
      targetUser = await User.findOne({mobile: user.mobile});
    } else {
      return {
        success: false,
        error: 'No username/email/mobile provided'
      }
    }
    if (!targetUser) {
      return {
        success: false,
        error: 'No user found'
      }
    }
    const success = targetUser.authenticate(user.password);
    if (success) {
      return {
        success: true,
        user: targetUser
      };
    }
    return {
      success: false,
      error: 'the password is not correct'
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export {
  getUser,
  createUser,
  validateUser
};
