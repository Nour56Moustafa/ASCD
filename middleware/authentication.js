const User = require('../models/user')
const Company = require('../models/company')
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
        const user = await User.findById(payload.id).select('-password')
        
        if (!user) {
            const company = await Company.findById(payload.id).select('-password')
            if (!company){
                throw new UnauthenticatedError('account not found');
            }
            req.company = company
        }
        else{
            req.user = user
        }

        // adding this {user} object in the request, because we will need it in
        // the next middleware
        next()
    } catch (error) {
        throw new UnauthenticatedError('User Unauthenticated')
    }
}


module.exports = auth