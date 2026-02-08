const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    gameKey: { type: String, required: true, trim: true }, 
    title: { type: String, required: true, trim: true, maxlength: 80 }, 
    notes: { type: String, default: "", maxlength: 1000 },
    score: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["planned", "playing", "completed"], default: "playing" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
