const BadgeService = require('../services/badge');
const {getInstance} = require("../utils/logger");

class StaticController {
    constructor() {
        this.logger = getInstance();
    }

    createBadge = async (req, res) => {
        try {
            const params = {
                ...req.params,
                ...req.query
            }
            this.logger.info(`生成徽章，请求参数 ${JSON.stringify(params)}`);

            const {content} = req.params;
            const [label, description] = content.split('-');

            const svg = await BadgeService.generateBadge({
                label: label,
                description: description,
                ...req.params,
                ...req.query
            });

            return res.send(svg);
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

module.exports = StaticController;