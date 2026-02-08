const User = require("../models/User");

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const users = await User.find()
      .select("username scores")
      .limit(100);
    
    const leaderboard = users.map((user) => {
      const totalScore = (user.scores.tictactoe || 0) + 
                        (user.scores.game2048 || 0) + 
                        (user.scores.dino || 0) + 
                        (user.scores.tanks || 0) + 
                        (user.scores.sudoku || 0);
      return {
        username: user.username,
        totalScore,
        tictactoe: user.scores.tictactoe || 0,
        game2048: user.scores.game2048 || 0,
        dino: user.scores.dino || 0,
        tanks: user.scores.tanks || 0,
        sudoku: user.scores.sudoku || 0
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
    .map((user, index) => ({ ...user, rank: index + 1 }));

    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

async function getGameLeaderboard(req, res, next) {
  try {
    const { game } = req.params;
    const validGames = ['tictactoe', 'game2048', 'dino', 'tanks', 'sudoku'];
    
    if (!validGames.includes(game)) {
      return res.status(400).json({ message: "Invalid game name" });
    }

    const users = await User.find().select("username scores").limit(100);
    const leaderboard = users
      .filter(u => (u.scores[game] || 0) > 0)
      .map(user => ({ username: user.username, score: user.scores[game] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

async function updateScore(req, res, next) {
  try {
    const { game } = req.params;
    const { score } = req.body;
    const validGames = ['tictactoe', 'game2048', 'dino', 'tanks', 'sudoku'];

    if (!validGames.includes(game)) {
      return res.status(400).json({ message: "Invalid game name" });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ message: "Invalid score" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.scores) user.scores = {};
    if (!user.scores[game]) user.scores[game] = 0;

    user.scores[game] += score;

    await user.save();

    res.json({ message: "Score updated", scores: user.scores });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getLeaderboard, getGameLeaderboard, updateScore };
