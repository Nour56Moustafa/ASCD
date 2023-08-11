const {StatusCodes} = require('http-status-codes')
const User = require('../models/user');

const searchUser = async (req, res) => {
  try {
    const { username } = req.query;

    // Perform basic validation to ensure username is provided in the query
    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Username is required for search' });
    }

    // Find users in the database matching the provided username (case-insensitive search)
    const users = await User.find({ username: { $regex: new RegExp(username, 'i') } }).select('_id firstName lastName username phoneNumber');

    // Return the search results
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Access the user's ID from the authentication token (it is set in the req.user field by the authenticateUser middleware)
    const userId = req.user.id;
    // console.log(req.user);

    // Fetch the user's profile from the database using their ID
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      // console.log(error);
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }

    // Return the user's profile data (excluding the password)
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
  }
};


const updateUserProfile = async (req, res) => {
    try {
      // Access the user's ID from the authentication token (it is set in the req.user field by the authenticateUser middleware)
      const userId = req.user.id;

      // Extract the updated user profile data from the request body
      const { firstName, lastName, phoneNumber, password, email, username, region, title } = req.body;

      // Find the user in the database by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }

      // Update the user's profile data
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      // user.password = password;
      user.username = username;
      user.region = region;
      user.title = title;
      user.email = email;

      // Save the updated user data to the database
      await user.save();

      // Return the updated user's profile data (excluding the password)
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteUser = async (req, res) => {
  try {
    // Access the user's ID from the authenticated user object (req.user)
    const userId = req.user.id;

    // Find the user in the database by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
    
    // Delete the user from the database
    await user.remove();

    // Return a success message
    res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
  }
};

module.exports = {
    searchUser,
    updateUserProfile,
    deleteUser,
    getUserProfile,
}