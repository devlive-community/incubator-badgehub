const express = require('express');
const router = express.Router();
const StaticController = require("../controllers/static");
const GitController = require('../controllers/git');

const staticController = new StaticController()
router.use('/badge/:content.svg', staticController.createBadge);

const gitController = new GitController();
router.get('/:platform/:owner/:repo.svg', gitController.generateBadge);

module.exports = router;
