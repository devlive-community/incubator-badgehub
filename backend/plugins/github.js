const axios = require('axios');
const BadgePlugin = require("./base");

class GitHubPlugin extends BadgePlugin {
    constructor(token) {
        super(token);
        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'BadgeHub'
            }
        });
    }

    async request(path) {
        const {data} = await this.client.get(path);
        return data;
    }

    async getStarCount(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}`);
            return data.stargazers_count;
        });
    }

    async getForkCount(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}`);
            return data.forks_count;
        });
    }

    async getWatchCount(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}`);
            return data.subscribers_count;
        });
    }

    async getCommitsCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/repos/${owner}/${repo}/commits?per_page=1`);
            // 从 Link header 中获取最后一页的数据
            const link = response.headers.link;
            if (!link) {
                return response.data.length; // 如果没有分页，直接返回当前数量
            }

            // 解析 Link header 获取总数
            const match = link.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1]) : response.data.length;
        });
    }

    async getLatestVersion(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}/releases/latest`);
            return data.tag_name.replace(/^v/, '');
        });
    }

    async getLatestReleaseTime(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}/releases/latest`);
            return new Date(data.published_at).toISOString();
        });
    }

    async getLatestCommitTime(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}/commits?per_page=1`);
            if (data && data[0]) {
                return new Date(data[0].commit.committer.date).toISOString();
            }
            return null;
        });
    }

    async getOpenIssuesCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/search/issues?q=repo:${owner}/${repo}+is:issue+is:open`);
            return response.data.total_count;
        });
    }

    async getClosedIssuesCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/search/issues?q=repo:${owner}/${repo}+is:issue+is:closed`);
            return response.data.total_count;
        });
    }

    async getOpenPullRequestsCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/search/issues?q=repo:${owner}/${repo}+is:pr+is:open`);
            return response.data.total_count;
        });
    }

    async getClosedPullRequestsCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/search/issues?q=repo:${owner}/${repo}+is:pr+is:closed`);
            return response.data.total_count;
        });
    }

    async getContributorsCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/repos/${owner}/${repo}/contributors?per_page=1`);
            const link = response.headers.link;
            if (!link) {
                return response.data.length;
            }
            const match = link.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1]) : response.data.length;
        });
    }

    async getLicense(owner, repo) {
        return this.withRetry(async () => {
            const data = await this.request(`/repos/${owner}/${repo}/license`);
            if (data && data.license) {
                return data.license.spdx_id;
            }
            return null;
        });
    }

    async getBranchesCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/repos/${owner}/${repo}/branches?per_page=1`);
            const link = response.headers.link;
            if (!link) {
                return response.data.length;
            }
            const match = link.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1]) : response.data.length;
        });
    }

    async getTagsCount(owner, repo) {
        return this.withRetry(async () => {
            const response = await this.client.get(`/repos/${owner}/${repo}/tags?per_page=1`);
            const link = response.headers.link;
            if (!link) {
                return response.data.length;
            }
            const match = link.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1]) : response.data.length;
        });
    }

    getName() {
        return 'github';
    }

    getBaseUrl() {
        return 'https://github.com';
    }
}

module.exports = GitHubPlugin;