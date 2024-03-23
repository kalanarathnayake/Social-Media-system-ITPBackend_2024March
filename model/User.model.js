const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    location: { type: String },
    jobTitle: { type: String },
    role: { type: String },
    imgURL: { type: String },

    authToken: { type: String, required: false },
    id: { type: Number },
});

UserSchema.pre('save', async function (next) {
    const user = this;
    const password = user.password;

    if (!user.isModified('password')) {
        return next();
    }

    // Number of rounds hash function will execute
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hashSync(password, salt);
    user.password = hash;
    return next();
});

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const secret = 'testuser';

    const token = jwt.sign({ _id: user._id }, secret);
    user.authToken = token;
    await user.save();

    return { _id: user._id, token };
};

module.exports = Admin = mongoose.model('Admin', UserSchema);