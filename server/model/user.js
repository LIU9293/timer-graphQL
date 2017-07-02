import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SESSION_SECRET = "SESSION_SECRET";
const SALT = 12;
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: {
      validator(email) {
        const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
        return emailRegex.test(email);
      },
      message: '{VALUE} is not a valid email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  role: {
    type: String,
    default: 'user',
  },
  activated: {
    type: Boolean,
    default: false
  },
  mobile: {
    type: Number,
    unique: true,
    validate: {
      validator(mobile) {
        const mobileRegex = /^1[34578]\d{9}$/;
        return mobileRegex.test(mobile);
      },
      message: '{VALUE} is not a valid mobile phone number.',
    },
  },
  avatar: {
    type: String
  },
  wx_id: {
    type: String
  }
}, {
  timestamps: true,
});

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj.__v;
    delete obj.password;
    return obj;
  },
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Ensure email has not been taken
UserSchema
  .path('email')
  .validate((email, respond) => {
    UserModel.findOne({ email })
      .then((user) => {
        respond(user ? false : true);
      })
      .catch(() => {
        respond(false);
      });
  }, 'Email already in use.');

// Validate username is not taken
UserSchema
  .path('username')
  .validate((username, respond) => {
    UserModel.findOne({ username })
      .then((user) => {
        respond(user ? false : true);
      })
      .catch(() => {
        respond(false);
      });
  }, 'Username already taken.');

// Validate mobile is not taken
UserSchema
  .path('mobile')
  .validate((mobile, respond) => {
    UserModel.findOne({ mobile })
      .then((user) => {
        respond(user ? false : true);
      })
      .catch(() => {
        respond(false);
      });
  }, 'Mobile already taken.');

// Validate password field
UserSchema
  .path('password')
  .validate((password) => {
    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password be at least 6 characters long and contain 1 number.');

UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   * @public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  authenticate(password) {
    return bcrypt.compare(password, this.password);
  },

  /**
   * Generates a JSON Web token used for route authentication
   * @public
   * @return {String} signed JSON web token
   */
  generateToken() {
    return jwt.sign({ _id: this._id }, SESSION_SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  },

  /**
   * Create password hash
   * @private
   * @param {String} password
   * @param {Number} saltRounds
   * @param {Function} callback
   * @return {Boolean} passwords match
   */
  createHash(password, saltRounds = SALT, callback) {
    return bcrypt.hash(password, saltRounds, callback);
  },
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
