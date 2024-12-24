const express = require('express');
const path = require('path');
const router = express.Router();

const pageRoutes = require('./page');
const badgeRoutes = require('./badge');
const adminRoutes = require('./admin');

// API 路由
router.use('/', pageRoutes);
router.use('/badge', badgeRoutes);
router.use('/admin', adminRoutes);

router.use(express.static(path.join(__dirname, '../../frontend')));

module.exports = router;