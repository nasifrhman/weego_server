const Feedback = require("./feedback.model");


const addFeedback = async (data) => {
  return Feedback.create(data)
}



const getFeedbackService = async (options) => {
  const { page = 1, limit = 10, rating, date } = options;

  const totalResults = await Feedback.countDocuments();
  const totalPages = Math.ceil(totalResults / limit);

  // Build sort object dynamically
  const sortOption = {};
  if (rating) sortOption.rating = rating === 'asc' ? 1 : -1;
  if (date) sortOption.createdAt = date === 'asc' ? 1 : -1;

  const feedback = await Feedback.find()
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'fullName email image');

  return {
    feedback,
    pagination: { page, limit, totalPages, totalResults, currentPage: page }
  };
};



module.exports = { addFeedback, getFeedbackService };