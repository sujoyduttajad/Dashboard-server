import User from "../mongodb/models/user.js";
import Property from "../mongodb/models/property.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* 
  The code defines an async function getAllProperties that fetches 
  properties from a database based on query parameters 
  such as _end, _order, _start, _sort, title_like, and propertyType. 
  It retrieves the count of matching documents and the properties data 
  from the database, sets response headers, and sends a JSON response 
  with the fetched properties data. If an error occurs, it sends an error response.
*/
const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};

  if (propertyType !== "") {
    query.propertyType = propertyType;
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: "i" };
  }

  try {
    const count = await Property.countDocuments({ query });
    const properties = await Property.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
  This code block fetches the Property details of the given property
*/
const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate(
    "creator"
  );

  if (propertyExists) res.status(200).json(propertyExists);
  else {
    res.status(404).json({ message: "Property not found" });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      title,
      // detailType,
      description,
      propertyType,
      location,
      price,
      photo,
      email,
    } = req.body;

    // Start a new session
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not Found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await Property.create({
      title,
      // detailType,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
  This code block edits the given property
*/
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        // detailType,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );
    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
  This code block deletes a given property
*/
const deleteProperty = async (req, res) => {
  let propertyToDelete;
  try {
    const { id } = req.params;
    // propertyToDelete = await Property.findById({ _id: id }).populate(
    //   "creator"
    // );
    propertyToDelete = await Property.findById({ _id: id });

    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //   await propertyToDelete.remove({ session });

    //   propertyToDelete.creator.allProperties.pull(propertyToDelete);
    //   await propertyToDelete.creator.save({ session });

    //   await session.commitTransaction();
    // } catch (error) {
    //   await session.abortTransaction();
    //   throw error;
    // } finally {
    //   session.endSession();
    // }

    propertyToDelete.deleteOne();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
