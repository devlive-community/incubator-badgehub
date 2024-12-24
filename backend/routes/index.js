const express = require('express');
const badgeRoutes = require('./badge');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/badge', badgeRoutes);
router.use('/admin', adminRoutes);

module.exports = router;