class BadgePlugin {
    constructor(token) {
        if (this.constructor === BadgePlugin) {
            throw new Error('Cannot instantiate abstract class');
        }
        this.token = token;
    }

    async request(path) { throw new Error('Not implemented'); }

    async getStarCount(owner, repo) { throw new Error('Not implemented'); }

    async getForkCount(owner, repo) { throw new Error('Not implemented'); }

    async getWatchCount(owner, repo) { throw new Error('Not implemented'); }

    getName() { throw new Error('Not implemented'); }

    getBaseUrl() { throw new Error('Not implemented'); }

    async withRetry(fn, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            }
            catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }
}

module.exports = BadgePlugin;