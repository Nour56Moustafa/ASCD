const {StatusCodes} = require('http-status-codes')
const Comment = require('../models/comment')
const Blog = require('../models/blog');
const { now } = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const createComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Check if the blog exists in the database
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }

        // Create a new comment in the database
        const newComment = await Comment.create({
            content,
            userID: userId,
            blogID: blogId,
        });

        res.status(StatusCodes.CREATED).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find all comments for the specified blog
        const comments = await Comment.find({ blogID: blogId }).sort({ date: -1 });

        // If no comments are found, return an empty array
        if (!comments || comments.length === 0) {
            return res.status(StatusCodes.OK).json({ comments: [] });
        }

        // Return the comments
        res.status(StatusCodes.OK).json({ comments });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(commentId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid comment ID' });
    }

    // Find the comment by ID in the database
    const comment = await Comment.findById(commentId);

    // If the comment is not found, return a 404 not found error
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Comment not found' });
    }

    // Check if the user ID from the token matches the comment's userID
    const tokenUserId = req.user.id;
    if (comment.userID.toString() !== tokenUserId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to update this comment' });
    }

    // Update the comment content
    comment.content = req.body.content;
    comment.date = new Date();
    comment.time = new Date().toLocaleTimeString();

    // Save the updated comment in the database
    await comment.save();

    res.status(StatusCodes.OK).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
  }
}

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(commentId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid comment ID' });
    }

    // Find the comment by ID in the database
    const comment = await Comment.findById(commentId);

    // If the comment is not found, return a 404 not found error
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Comment not found' });
    }

    // Check if the user ID from the token matches the comment's userID
    const tokenUserId = req.user.id;
    if (comment.userID.toString() === tokenUserId || req.user.role == 'admin') {
      // Delete the comment from the database
      await comment.remove();
      res.status(StatusCodes.OK).json({ message: 'Comment deleted successfully' });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to delete this comment' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
  }
}

module.exports = {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}