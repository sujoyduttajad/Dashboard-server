import Reviews from "../mongodb/models/reviews.js";

/* 
  Fetches all the reviews details 
*/
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find({});
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
    const { title, rating, description, propertyType, avatar, reviewer } =
      req.body;
    const reviewsExists = await Reviews.findOne({ title });

    if (reviewsExists) return res.status(200).json(reviewsExists);

    const newReview = await Reviews.create({
      title,
      rating,
      description,
      propertyType,
      avatar,
      reviewer,
    });

    res.status(200).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
