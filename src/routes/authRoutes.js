import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({ message: "You are authenticated.", user: req.user });
});

router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome, admin." });
});

export default router;
