const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  login: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  avatar: {
    type: Schema.Types.ObjectId,
    refs: 'Upload',
  },

  passwordHashed: {
    type: String,
    required: true,
  },

  isActivated: {
    type: Boolean,
    default: false,
  },

  activationUUID: {
    type: String,
    required: true,
  },

  usergroup: {
    type: String,
    default: 'user',
  },
});

module.exports = model('User', UserSchema);
