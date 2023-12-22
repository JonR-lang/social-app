const { Router } = require("express");
const {
  getUserPosts,
  getFeedPosts,
  likePost,
} = require("../controllers/postController");
const { verifyToken } = require("../middleware/auth");
const router = Router();

//READ

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//UPDATE

router.patch("/:id/like", verifyToken, likePost);

module.exports = router;
