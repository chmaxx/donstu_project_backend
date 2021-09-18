const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    nickname: {
        type: String,
        default: "Новый пользователь"
    },

    email: {
        type: String, 
        unique: true, 
        required: true
    },

    passwordHashed: {
        type: String, 
        required: true
    },

    isActivated: {
        type: Boolean, 
        default: false
    },

    activationUUID: {
        type: String,
        required: true
    },

    usergroup: {
        type: String, 
        default: "user"
    }
});

module.exports = model('User', UserSchema);
