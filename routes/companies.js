const express = require('express')
const router = express.Router()
const authenticateCompany = require('../middleware/authentication');

const {
    createCompany,
    getAllCompanies,
    getCompany,
    updateCompany,
    deleteCompany
} = require('../controllers/companies')

router.route('/').post(createCompany).get(getAllCompanies).delete(authenticateCompany, deleteCompany).patch(authenticateCompany, updateCompany)
router.route('/:companyID').get(getCompany)

module.exports = router
