const BadgeService = require('../services/badge');

class BadgeController {
    static async generateBadge(req, res) {
        res.setHeader('Content-Type', 'image/svg+xml');
        try {
            const {
                platform,
                owner,
                repo,
                style = 'default'
            } = req.params;

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
            else if (platform) {
                const {type = 'stars'} = req.query;

                // 验证类型是否支持
                const supportedTypes = [
                    'stars',
                    'forks',
                    'watchers', 'commits', 'contributors', 'licenses', 'branches', 'tags',
                    'latest_version', 'latest_release_time', 'latest_commit_time',
                    'open_issues', 'closed_issues',
                    'opened_pull_requests', 'closed_pull_requests',];
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
                const response = await BadgeService.getMetrics(platform, owner, repo, type);

                console.log('只表示指标数据:', response);

                // 根据type构建徽章配置
                const leftText = type === 'watches' ? 'watchers' : type;
                const rightText = response.value;

                // 生成徽章
                const svg = await BadgeService.generateBadge({
                    leftText,
                    rightText,
                    ...req.params,
                    ...req.query
                });

                res.send(svg);
            }
            else {
                const svg = await BadgeService.generateBadge({
                    leftText: 'platform',
                    rightText: 'unsupported',
                    ...req.params,
                    ...req.query
                });
                res.send(svg);
            }
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