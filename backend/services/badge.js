const TemplateLoader = require('../loader/template');
const path = require('path');
const drawSvg = require("../utils/canvas");

class BadgeService {
    static templateLoader = new TemplateLoader(
        path.join(__dirname, '..', 'templates')
    );

    static plugins = new Map();

    static registerPlugin(plugin) {
        this.plugins.set(plugin.getName(), plugin);
    }

    static getPlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin ${name} not found`);
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

        let response;
        switch (type) {
            case 'stars':
                response = await plugin.getCountForStar(owner, repo);
                return {
                    label: 'Stars',
                    description: response.value
                };
            case 'forks':
                response = await plugin.getCountForFork(owner, repo);
                return {
                    label: 'Forks',
                    description: response.value
                };
            case 'watchers':
                response = await plugin.getCountForWatch(owner, repo);
                return {
                    label: 'Watchers',
                    description: response.value
                };
            case 'commits':
                response = await plugin.getCountForCommit(owner, repo);
                return {
                    label: 'Commits',
                    description: response.value
                };
            case 'open_issues':
                response = await plugin.getCountForOpenIssues(owner, repo);
                return {
                    label: 'Open Issues',
                    description: response.value
                };
            case 'closed_issues':
                response = await plugin.getCountForClosedIssues(owner, repo);
                return {
                    label: 'Closed Issues',
                    description: response.value
                };
            case 'opened_pull_requests':
                response = await plugin.getCountForOpenPullRequests(owner, repo);
                return {
                    label: 'Open Pull Requests',
                    description: response.value
                };
            case 'closed_pull_requests':
                response = await plugin.getCountForClosedPullRequests(owner, repo);
                return {
                    label: 'Closed Pull Requests',
                    description: response.value
                };
            case 'contributors':
                response = await plugin.getCountForContributors(owner, repo);
                return {
                    label: 'Contributors',
                    description: response.value
                };
            case 'branches':
                response = await plugin.getCountForBranches(owner, repo);
                return {
                    label: 'Branches',
                    description: response.value
                };
            case 'tags':
                response = await plugin.getCountForTags(owner, repo);
                return {
                    label: 'Tags',
                    description: response.value
                };
            case 'licenses':
                response = await plugin.getTextForLicense(owner, repo);
                return {
                    label: 'Licenses',
                    description: response.value
                };
            case 'latest_version':
                response = await plugin.getLatestVersion(owner, repo);
                return {
                    label: 'Latest Version',
                    description: response.value
                };
            case 'latest_release_time':
                response = await plugin.getLatestReleaseTime(owner, repo);
                return {
                    label: 'Latest Release Time',
                    description: response.value
                };
            case 'latest_commit_time':
                value = await plugin.getLatestCommitTime(owner, repo);
                return {latest_commit_time: value};
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }

    static async generateBadge(params) {
        try {
            return await drawSvg(params);
        }
        catch (error) {
            console.error(`Error generating badge: ${error.message}`);
            throw error;
        }
    }
}

module.exports = BadgeService;