const BadgeService = require('../services/badge');
const {getInstance} = require("../utils/logger");

class GitController {
    constructor() {
        this.logger = getInstance();
    }

    generateBadge = async (req, res) => {
        try {
            const params = {
                ...req.params,
                ...req.query
            }
            this.logger.info(`生成徽章，请求参数 ${JSON.stringify(params)}`);

            const {
                platform,
                owner,
                repo
            } = req.params;

            const {type = 'stars'} = req.query;

            // 获取指标数据
            const response = await BadgeService.getMetric(platform, owner, repo, type);

            // 生成徽章
            const svg = await BadgeService.generateBadge({
                ...response,
                ...req.params,
                ...req.query
            });

            res.send(svg);
        }
        catch (error) {
            this.logger.error({err: error}, '生成徽章失败，构建错误徽章');

            const svg = await BadgeService.generateBadge({
                label: '构建失败',
                description: error.message,
                ...req.params,
                ...req.query
            });

            res.send(svg);
        }
    }
}

module.exports = GitController;