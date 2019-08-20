import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { Auth } from '../utils';

config();

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 360,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.SECRET);
  return token;
};

userSchema.pre('save', async function (next) {
  const hashedPassword = Auth.hash(this.password);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
