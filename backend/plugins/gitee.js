const axios = require('axios');
const BadgePlugin = require('./base');

class GiteePlugin extends BadgePlugin {
    constructor(token) {
        super(token);
        this.client = axios.create({
            baseURL: 'https://gitee.com/api/v5',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': 'BadgeHub'
            },
            params: {
                // Gitee requires access_token as a query parameter
                access_token: token
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
            return data.watchers_count;
        });
    }

    getName() {
        return 'gitee';
    }

    getBaseUrl() {
        return 'https://gitee.com';
    }
}

module.exports = GiteePlugin;