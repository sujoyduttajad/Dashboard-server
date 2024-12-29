import Reviews from "../mongodb/models/reviews.js";

/* 
  Fetches all the reviews details 
*/
const getAllReviews = async (req, res) => {
    const {
      _end,
      _order,
      _start,
      _sort,
      reviewer_like = "",
      rating_gte = 0,
    } = req.query;
  
    const query = {};
  
    // Filter by reviewer name (case-insensitive)
    if (reviewer_like) {
      query.reviewer = { $regex: reviewer_like, $options: "i" };
    }
  
    // Filter by minimum rating
    if (rating_gte) {
      query.rating = { $gte: Number(rating_gte) };
    }
  
    try {
      // Count total reviews that match the query
      const count = await Review.countDocuments(query);
  
      // Fetch reviews based on query, pagination, and sorting
      const reviews = await Review.find(query)
        .limit(Number(_end) - Number(_start))
        .skip(Number(_start))
        .sort({ [_sort]: _order });
  
      // Set custom headers for total count
      res.header("x-total-count", count);
      res.header("Access-Control-Expose-Headers", "x-total-count");
  
      // Send response
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
      property,
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
