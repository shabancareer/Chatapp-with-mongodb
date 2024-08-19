import express from "express";
import {
  registerUser,
  allUsers,
  authUser,
} from "../controllers/userController.js";
import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(protect, allUsers);

export default router;

// module.exports = router;
