const axios = require('axios');
const BadgePlugin = require('./base');

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

    getName() {
        return 'github';
    }

    getBaseUrl() {
        return 'https://github.com';
    }
}

module.exports = GitHubPlugin;