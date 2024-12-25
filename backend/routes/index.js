const express = require('express');
const path = require('path');
const router = express.Router();

const apiRoutes = require('../api');
const pageRoutes = require('./page');
const adminRoutes = require('./admin');
const badgeRoutes = require('./badge');

// API 路由
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);
router.use('/badge', badgeRoutes);
router.use('/', pageRoutes);

router.use(express.static(path.join(__dirname, '../../frontend')));

module.exports = router;