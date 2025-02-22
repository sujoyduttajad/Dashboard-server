import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true  },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    property : { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const reviewsModel = mongoose.model("Reviews", ReviewsSchema);

export default reviewsModel;