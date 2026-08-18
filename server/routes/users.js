import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { getMe, updateMe } from "../controllers/userController.js";
const router = Router();
router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("avatar"), updateMe);
export default router;
