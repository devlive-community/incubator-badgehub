const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badge');

const badge = new BadgeController();

router.get('/:owner/:repo.svg', badge.generateBadge);
router.get('/:platform/:owner/:repo.svg', badge.generateBadge);

module.exports = router;