const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, username, phoneNumber } = req.body;
        
        //Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
                return res.status(StatusCodes.CONFLICT).json({ error: 'Email already exists' });
        }

        // Check if the username is already taken
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
                return res.status(StatusCodes.CONFLICT).json({ error: 'Username unavailable' });
        }
        
        // Create a new user in the database
        const newUser = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            username,
        });

        // Generate a JWT token for the user
        const token = newUser.createJWT();
        
        res.status(StatusCodes.CREATED).json({ user: { firstName, lastName, email, username, phoneNumber }, token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email and password required' });
        }
        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
        }
        const firstName = user.firstName
        const lastName = user.lastName
        const username = user.username
        const phoneNumber = user.phoneNumber
        // Generate a JWT token for the user
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({ user: { firstName, lastName, email, username, phoneNumber }, token });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
};

module.exports = { register, login };
