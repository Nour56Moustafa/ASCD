const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const {
  searchUser,
  updateUserProfile,
  deleteUser,
  getUserProfile,
} = require('../controllers/users');

// Search users route (No authentication required)
router.get('/search', searchUser);

// Routes requiring authentication
router.use(authenticateUser); // Use the middleware for all routes below

// Protected routes
router.route('/')
  .get(getUserProfile)   // Requires authentication
  .delete(deleteUser)   // Requires authentication
  .patch(updateUserProfile);   // Requires authentication

module.exports = router;
