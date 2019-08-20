import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    unique: true,
    trim: true,
    lowercase: true
  },
  noOfPlayers: {
    type: Number,
    min: 11,
    max: 100,
    default: 11,
  },
  coach: {
    type: String,
    minlength: 3,
    maxlength: 255,
    lowercase: true,
    trim: true
  },
});

const Teams = mongoose.model('Teams', teamSchema);

export default Teams;
