const express = require('express');
const router = express.Router();
const StaticController = require("../controllers/static");
const GitController = require('../controllers/git');
const createChart = require('../controllers/chart');

// 1. 静态徽章路由
const staticController = new StaticController()
router.use('/badge/:content.svg', staticController.createBadge);

// 2. Star历史图表路由
router.get('/chart/:platform/:owner/:repo.svg', createChart);

// 3. 平台徽章路由
const gitController = new GitController();
router.get('/:platform/:owner/:repo.svg', gitController.generateBadge);

module.exports = router;
