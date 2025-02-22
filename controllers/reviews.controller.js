import Reviews from "../mongodb/models/reviews.js";
import mongoose from "mongoose";


/* 
  Fetches all the reviews details 
*/
const getAllReviews = async (req, res) => {
  const { _end, _order = 'asc', _start = 0, _sort = 'createdAt', rating_gte = 0 } = req.query;

  const query = {
    rating: { $gte: Number(rating_gte) },
  };

  try {
    const count = await Reviews.countDocuments(query);

    const reviews = await Reviews.find(query)
      .sort({ [_sort]: _order === 'asc' ? 1 : -1 })
      .limit(Number(_end) - Number(_start))
      .skip(Number(_start));

    res.header('x-total-count', count);
    res.header('Access-Control-Expose-Headers', 'x-total-count');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  

/* 
  this block of code creates a new review
*/
const createReviews = async (req, res) => {
  try {
    const { title, rating, description, property, reviewer } = req.body;

    const newReview = new Reviews({ title, rating, description, property, reviewer });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'A review with this title already exists.' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};


// const getUserInfoByID = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findOne({ _id: id }).populate("allProperties");

//     if (user) res.status(200).json(user);

//     if (!user) res.status(404).json({ message: "User not found" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export { getAllReviews, createReviews };
