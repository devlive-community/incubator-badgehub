const express = require('express');
const router = express.Router();

router.get('/preview', (req, res) => {
    const {platform, owner, repo} = req.query;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    let badgeUrl = `${baseUrl}/api/badge/${platform}/${owner}/${repo}.svg`;
    let markdownUrl = `![${platform}-${owner}-${repo}](${baseUrl}/api/badge/${platform}/${owner}/${repo}.svg)`;
    let imageUrl = `<img src='${baseUrl}/api/badge/${platform}/${owner}/${repo}.svg' alt='${platform}-${owner}-${repo}' />`;

    if (!repo) {
        badgeUrl = `${baseUrl}/api/badge/${platform}/${owner}.svg`;
        markdownUrl = `![${platform}-${owner}](${baseUrl}/api/badge/${platform}/${owner}.svg)`;
        imageUrl = `<img src='${baseUrl}/api/badge/${platform}/${owner}.svg' alt='${platform}-${owner}' />`;
    }

    res.render('components/badge', {
        badgeUrl,
        markdownUrl,
        imageUrl
    });
});

module.exports = router;