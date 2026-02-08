const router = require("express").Router();
const {
	getProfile,
	updateProfile,
	getLeaderboard,
	getGameLeaderboard,
	updateScore,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { updateProfileSchema } = require("../validators/userValidators");

// Leaderboard routes
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/:game", getGameLeaderboard);
router.put("/score/:game", auth, updateScore);

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, validate(updateProfileSchema), updateProfile);

module.exports = router;
