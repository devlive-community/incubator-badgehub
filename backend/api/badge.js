const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badge');

router.get('/:owner/:repo.svg', BadgeController.generateBadge);
router.get('/:platform/:owner/:repo.svg', BadgeController.generateBadge);

module.exports = router;