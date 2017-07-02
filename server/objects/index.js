import chalk from 'chalk';
import { UserFactory } from '../faker';
import User from '../model/user';
import { verifyToken } from '../util/token';

const getUserInfoByToken = async (token) => {
  try {
    const tokenUser = await verifyToken(token);
    const user = await User.findOne({"_id": tokenUser._id});
    return {
      success: true,
      user
    }
  } catch (e) {
    return {
      success: false,
      err: 'token cannot be recoginzed'
    }
  }
}

const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return {
      success: true,
      user: savedUser
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

const updateUser = async (field, value, token) => {
  const fieldsEnum = ['password', 'email', 'mobile', 'avatar'];
  if (fieldsEnum.indexOf(field) < 0 ) {
    return {
      success: false,
      error: 'the field provided is not illgeal'
    }
  }
  try {
    const res = await getUserInfoByToken(token);
    if (res.success) {
      let obj = {};
      obj[field] = value;
      const newUser = await User.findOneAndUpdate({'_id': res.user._id}, obj);
      return {
        success: true,
        user: newUser
      }
    }
    return res;
  } catch (error) {
    return {
      success: false,
      error
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
    const success = await targetUser.authenticate(user.password);
    if (success) {
      const token = targetUser.generateToken();
      return {
        success: true,
        token,
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
  getUserInfoByToken,
  createUser,
  validateUser,
  updateUser,
};
