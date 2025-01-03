const express = require('express');
const path = require('path');
const router = express.Router();

const apiRoutes = require('../api');

// API 路由
router.use('/', apiRoutes);

module.exports = router;