const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) // decode the token with the JWT_SECRET used to sign it
        
        // const user = User.findById(payload.id).select('-password')
        // req.user = user

        // adding this {user} object in the request, because we will need it in
        // the next middleware to create a job by this user, and we need the id
        // for the reference
        req.user = {userId: payload.userId, name: payload.name, role: payload.role}
        next()
    } catch (error) {
        throw new UnauthenticatedError('User Unauthenticated')
    }
}


module.exports = auth