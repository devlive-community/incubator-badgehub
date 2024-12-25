const express = require('express');
const router = express.Router();

const badgeRoutes = require('./badge');

router.use('/badge', badgeRoutes);

module.exports = router;
