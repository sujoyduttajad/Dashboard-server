import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    avatar: { type: String, required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const reviewsModel = mongoose.model("Reviews", ReviewsSchema);

export default reviewsModel;
