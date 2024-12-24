const BadgeService = require('../services/badge');

class BadgeController {
    static async generateBadge(req, res) {
        try {
            const {user, project} = req.params;
            const {style, leftColor, rightColor} = req.query;

            const badge = await BadgeService.generateBadge({
                leftText: user,
                rightText: project,
                leftColor,
                rightColor,
                style
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(badge);
        }
        catch (error) {
            res.status(500).send(`Error generating badge: ${error.message}`);
        }
    }

    static async reloadTemplates(req, res) {
        try {
            await BadgeService.reloadTemplates();
            res.json({
                success: true,
                message: 'Templates reloaded successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: `Error reloading templates: ${error.message}`
            });
        }
    }
}

module.exports = BadgeController;