const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    scores: {
      tictactoe: { type: Number, default: 0 },
      game2048: { type: Number, default: 0 },
      dino: { type: Number, default: 0 },
      tanks: { type: Number, default: 0 },
      sudoku: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
