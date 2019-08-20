import mongoose from 'mongoose';
import crypto from 'crypto';

const fixtureSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  awayTeam: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  fixtureDate: {
    type: Date,
    required: true,
  },
  fixtureLink: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
});

fixtureSchema.pre('save', async function (next) {
  const uniqueLink = crypto.randomBytes(16).toString('hex');
  this.fixtureLink = uniqueLink;
  next();
});

const Fixtures = mongoose.model('Fixtures', fixtureSchema);

export default Fixtures;
