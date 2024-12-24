const express = require('express');
const path = require('path');
const router = express.Router();

const badgeRoutes = require('./badge');
const adminRoutes = require('./admin');

router.use('/badge', badgeRoutes);
router.use('/admin', adminRoutes);

router.use(express.static(path.join(__dirname, '../../frontend')));
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = router;