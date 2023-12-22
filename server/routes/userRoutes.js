const { Router } = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const router = Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

//uPDATE

router.patch("/:id/friendId", verifyToken, addRemoveFriend);

module.exports = router;
