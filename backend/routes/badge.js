const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badge');

router.get('/:user-:project.svg', BadgeController.generateBadge);

module.exports = router;