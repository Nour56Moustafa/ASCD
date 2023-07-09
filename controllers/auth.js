const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token: user.createJWT()})
}

const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // Passing in the password from the request, 
    // the other password is coming from the caller (user)
    // from the database according to the email provided above
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login
}