import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createReview, deleteReview, getReviews } from "../controllers/reviewController.js";
const router = Router();
router.get("/listing/:listingId", getReviews);
router.post("/listing/:listingId", protect, createReview);
router.delete("/:id", protect, deleteReview);
export default router;
