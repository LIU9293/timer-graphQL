import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SESSION_SECRET = "SESSION_SECRET";
const SALT = 12;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.'],
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
  }
}, {
  timestamps: true,
});

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
  },
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

// Validate password field
UserSchema
  .path('password')
  .validate((password) => {
    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password be at least 6 characters long and contain 1 number.');

UserSchema
  .pre('save', (done) => {
    // Encrypt password before saving the document
    if (this.isModified('password')) {
      this.createHash(this.password, SALT, (err, hash) => {
        this.password = hash;
        done();
      });
    } else {
      done();
    }
    // eslint-enable no-invalid-this
  });

UserSchema.methods = {
  getPosts() {
    return Post.find({ _user: this._id });
  },

  /**
   * Authenticate - check if the passwords are the same
   * @public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
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
