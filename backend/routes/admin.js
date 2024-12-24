const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badge');

if (process.env.NODE_ENV === 'development') {
    router.post('/reload-templates', BadgeController.reloadTemplates);
}

module.exports = router;