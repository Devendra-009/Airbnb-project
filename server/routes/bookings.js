import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { cancelBooking, createBooking, getMyBookings } from "../controllers/bookingController.js";
const router = Router();
router.use(protect);
router.get("/", getMyBookings);
router.post("/", createBooking);
router.delete("/:id", cancelBooking);
export default router;
