const path = require('path');
const drawSvg = require("../utils/canvas");
const drawStarsHistoryChart = require("../utils/canvas-history");

class ChartService {
    static plugins = new Map();

    static registerPlugin(plugin) {
        this.plugins.set(plugin.getName(), plugin);
    }

    static getPlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`未找到 ${name} 插件，请联系管理员支持`);
        }
        return plugin;
    }

    /**
     * 获取指标数据
     * @param platform 要查询数据的平台，可以是 'github' 或 'gitee'
     * @param owner 仓库归属者
     * @param repo 仓库名称
     * @param type 查询的类型
     * @returns {Promise<{value}|{contributors: *}|{closed_pull_requests: *}|{latest_version: *}|{closed_issues: *}|{tags: *}|{commits: *}|{latest_commit_time: *}|{latest_release_time: *}|{open_issues: *}|{opened_pull_requests: *}|{licenses: *}|{branches: *}|{stars: *, forks: *, watches: *}>}
     */
    static async getMetric(platform, owner, repo, type = null) {
        const plugin = this.getPlugin(platform);

        switch (type) {
            case 'star-history':
                const response = await plugin.getHistoryForStars(owner, repo);
                return {
                    value: response
                };
            default:
                throw new Error(`未支持的类型 ${type}`);
        }
    }

    static async createChart(platform, data, params) {
        try {
            return drawStarsHistoryChart({
                data: data,
                title: params?.title || `${params?.owner}/${params?.repo} Stars History`,
                style: params?.style
            });
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ChartService;