const BadgeService = require('../services/badge');

class BadgeController {
    static async generateBadge(req, res) {
        res.setHeader('Content-Type', 'image/svg+xml');
        try {
            const {platform, owner, repo} = req.params;

            if (!platform) {
                const svg = await BadgeService.generateBadge({
                    leftText: owner,
                    rightText: repo
                });

                return res.send(svg);
            }

            const {type = 'stars'} = req.query;

            const supportedTypes = ['stars', 'forks', 'watches'];
            if (!supportedTypes.includes(type)) {
                const svg = await BadgeService.generateBadge({
                    leftText: 'type',
                    rightText: 'unsupported'
                });
                return res.send(svg);
            }

            const metrics = await BadgeService.getMetrics(platform, owner, repo);
            const badgeConfig = {
                stars: {left: 'stars', right: metrics.stars},
                forks: {left: 'forks', right: metrics.forks},
                watches: {left: 'watchers', right: metrics.watches}
            };

            const {left: leftText, right: rightText} = badgeConfig[type];
            const svg = await BadgeService.generateBadge({
                leftText,
                rightText: String(rightText)
            });

            res.send(svg);
        }
        catch (error) {
            console.error(`Error handling badge request:`, error);
            const svg = await BadgeService.generateBadge({
                leftText: 'error',
                rightText: error.message
            });
            res.send(svg);
        }
    }

    static async reloadTemplates(req, res) {
        try {
            await BadgeService.reloadTemplates();
            res.json({success: true, message: 'Templates reloaded successfully'});
        }
        catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }
}

module.exports = BadgeController;