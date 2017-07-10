import chalk from 'chalk';
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

const sendActivateEmail = async (email) => {
  try {
    const targetUser = await User.findOne({email});
    if (targetUser.activated) {
      return {
        success: false,
        error: 'user already activated'
      }
    }
    const response = await targetUser.sendActivateEmail();
    return {
      success: true,
      response: JSON.stringify(response)
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e
    }
  }
}

const activiteUser = async (token, cb) => {
  try {
    const tokenUser = await verifyToken(token);
    const { _id, email } = tokenUser;
    const targetUser = await User.findOne({_id});
    if (targetUser.email === email) {
      await User.findOneAndUpdate({_id}, {
        activated: true
      });
      const newUser = await User.findOne({_id});
      cb({
        success: true,
        user: newUser,
      });
    }
  } catch (e) {
    cb({
      success: false,
      error: e
    });
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
  const fieldsEnum = ['password', 'email', 'mobile', 'avatar', 'activated'];
  if (fieldsEnum.indexOf(field) < 0 ) {
    return {
      success: false,
      error: 'the field provided is not illgeal'
    }
  }
  try {
    const res = await getUserInfoByToken(token);
    if (res.success) {
      if (value === "true") value = true;
      if (value === "false") value = false;
      let obj = {};
      obj[field] = value;
      await User.findOneAndUpdate({'_id': res.user._id}, obj);
      const newUser = User.findOne({'_id': res.user._id});
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
  sendActivateEmail,
  activiteUser,
};
