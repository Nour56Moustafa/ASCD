const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/is-admin')
const authentication = require('../middleware/authentication')
const {
    createStatistic,
    updateStatistic,
    deleteStatistic,
    deleteAllStatistics,
    getAllStatistics
} = require('../controllers/statistics');


router.route('/').get(getAllStatistics)

// routes below this line require admin previliges
router.use(authentication, isAdmin)

router.route('/').post(createStatistic).delete(deleteAllStatistics)
router.route('/:statisticID').delete(deleteStatistic).patch(updateStatistic)

module.exports = router;
