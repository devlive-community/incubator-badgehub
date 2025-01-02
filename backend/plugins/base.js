const fs = require('fs');
const path = require('path');
const os = require('os');
const {getInstance} = require("../utils/logger");
const getFnName = require("../utils/fn");

class BadgePlugin {
    constructor(token, options = {}) {
        if (this.constructor === BadgePlugin) {
            throw new Error('无法实例化 BadgePlugin 类');
        }

        this.token = token;

        this.cacheDir = options.cache?.dir ||
            process.env.BADGE_CACHE_DIR ||
            path.join(os.tmpdir(), '.cache');
        // 默认 5 分钟
        this.cacheTime = options.cache?.time || 5 * 60 * 1000;
        this._cacheInitialized = false;

        this.logger = options.logger || getInstance();
    }

    async ensureCacheDir() {
        if (!this._cacheInitialized) {
            try {
                this.logger.info(`初始化缓冲目录 ${this.cacheDir}`);
                if (!fs.existsSync(this.cacheDir)) {
                    fs.mkdirSync(this.cacheDir, {recursive: true});
                }
                this._cacheInitialized = true;
            }
            catch (error) {
                this.logger.error({err: error}, '缓冲目录创建失败');
            }
        }
    }

    /**
     * 自动重试函数
     * @param fn 执行的函数
     * @param retries 重试次数
     * @returns {Promise<*>}
     */
    async withRetry(fn, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                this.logger.info(`当前执行第 ${i + 1} / ${retries} 次执行函数 ${getFnName(fn)}`);
                return await fn();
            }
            catch (error) {
                this.logger.error({err: error}, `执行函数 ${getFnName(fn)} 失败，尝试重试`);
                if (i === retries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }

    /**
     * 自动缓冲查询到的数据
     * @param owner 仓库所有者
     * @param repo 仓库名称
     * @param type 数据类型
     * @param fn 执行的具体函数
     * @returns {Promise<*>}
     */
    async withCache(owner, repo, type, fn) {
        await this.ensureCacheDir();

        const timestamp = Date.now();
        const cacheKey = `${owner}-${repo}-${type}`;

        const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);

        // 尝试读取缓存
        try {
            const data = fs.readFileSync(cacheFile, 'utf8');
            const cache = JSON.parse(data);
            if (Date.now() - cache.timestamp <= this.cacheTime) {
                return cache.data;
            }
        }
        catch (error) {
            // 缓存不存在或已过期
        }

        // 执行实际函数获取数据
        const result = await fn();
        console.log('获取数据:', result);

        // 写入缓存
        try {
            fs.writeFileSync(cacheFile, JSON.stringify({
                timestamp: timestamp,
                data: result
            }));
        }
        catch (error) {
            console.error('Failed to write cache:', error);
        }

        return result;
    }

    async request(path) { throw new Error('Not implemented'); }

    async getStarCount(owner, repo) { throw new Error('Not implemented'); }

    async getForkCount(owner, repo) { throw new Error('Not implemented'); }

    async getWatchCount(owner, repo) { throw new Error('Not implemented'); }

    async getCommitsCount(owner, repo) { throw new Error('Not implemented'); }

    async getLatestVersion(owner, repo) { throw new Error('Not implemented'); }

    async getLatestReleaseTime(owner, repo) { throw new Error('Not implemented'); }

    async getLatestCommitTime(owner, repo) { throw new Error('Not implemented'); }

    async getOpenIssuesCount(owner, repo) { throw new Error('Not implemented'); }

    async getClosedIssuesCount(owner, repo) { throw new Error('Not implemented'); }

    async getOpenPullRequestsCount(owner, repo) { throw new Error('Not implemented'); }

    async getClosedPullRequestsCount(owner, repo) { throw new Error('Not implemented'); }

    async getContributorsCount(owner, repo) { throw new Error('Not implemented'); }

    async getLicense(owner, repo) { throw new Error('Not implemented'); }

    async getBranchesCount(owner, repo) { throw new Error('Not implemented'); }

    async getTagsCount(owner, repo) { throw new Error('Not implemented'); }

    getName() { throw new Error('Not implemented'); }

    getBaseUrl() { throw new Error('Not implemented'); }
}

module.exports = BadgePlugin;