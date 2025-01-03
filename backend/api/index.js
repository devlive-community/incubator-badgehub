const express = require('express');
const router = express.Router();
const StaticController = require("../controllers/static");

const staticController = new StaticController()
router.use('/badge/:content.svg', staticController.createBadge);

module.exports = router;
