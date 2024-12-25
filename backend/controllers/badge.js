const BadgeService = require('../services/badge');

class BadgeController {
    static async generateBadge(req, res) {
        res.setHeader('Content-Type', 'image/svg+xml');
        try {
            const {platform, owner, repo} = req.params;

            // 处理无平台的情况
            if (!platform) {
                const svg = await BadgeService.generateBadge({
                    leftText: owner,
                    rightText: repo,
                    ...req.params,
                    ...req.query
                });
                return res.send(svg);
            }

            const {type = 'stars'} = req.query;

            // 验证类型是否支持
            const supportedTypes = ['stars', 'forks', 'watches'];
            if (!supportedTypes.includes(type)) {
                const svg = await BadgeService.generateBadge({
                    leftText: 'type',
                    rightText: 'unsupported',
                    ...req.params,
                    ...req.query
                });
                return res.send(svg);
            }

            // 获取指标数据
            const metrics = await BadgeService.getMetrics(platform, owner, repo, type);

            // 根据type构建徽章配置
            const leftText = type === 'watches' ? 'watchers' : type;
            const rightText = String(metrics[type]);

            // 生成徽章
            const svg = await BadgeService.generateBadge({
                leftText,
                rightText,
                ...req.params,
                ...req.query
            });

            res.send(svg);
        }
        catch (error) {
            console.error(`Error handling badge request:`, error);
            const svg = await BadgeService.generateBadge({
                leftText: 'error',
                rightText: error.message,
                ...req.params,
                ...req.query
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