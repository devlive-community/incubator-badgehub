const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badge');

router.get('/:format/:owner/:repo.svg', BadgeController.generateBadge);
router.get('/:format/:platform/:owner/:repo.svg', BadgeController.generateBadge);

module.exports = router;