import express from "express";
import { createReviews, getAllReviews } from "../controllers/reviews.controller.js";

// instance of the express Router
const router = express.Router();

router.route("/").get(getAllReviews);
router.route("/").post(createReviews);
// router.route("/:id").get(getUserInfoByID);

export default router;
