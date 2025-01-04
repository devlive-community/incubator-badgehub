const ChartService = require('../services/chart');
const {getInstance} = require("../utils/logger");
const drawStarsHistoryChart = require("../utils/canvas-history");

this.logger = getInstance();

const createChart = async (req, res) => {
    try {
        const params = {
            ...req.params,
            ...req.query
        }
        this.logger.info(`生成图表，请求参数 ${JSON.stringify(params)}`);

        const {
            platform,
            owner,
            repo
        } = req.params;

        const response = await ChartService.getMetric(platform, owner, repo, 'star-history');

        const svg = await ChartService.createChart(platform, response.value.stars, req.params)

        res.send(svg);
    }
    catch (error) {
        this.logger.error({err: error}, '生成图表失败，构建错误图表');

        const svg = await ChartService.createChart({
            label: '构建失败',
            description: error.message,
            ...req.params,
            ...req.query
        });

        res.send(svg);
    }
}

module.exports = createChart