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

    async ensureCacheDir(owner, repo) {
        if (!this._cacheInitialized) {
            try {
                // 拼接缓冲目录，格式为：<plugin>/<owner>/<repo>
                this.cacheDir = path.join(this.cacheDir, this.getName(), owner, repo);

                if (!fs.existsSync(this.cacheDir)) {
                    this.logger.info(`初始化缓冲目录 ${this.cacheDir}`);
                    fs.mkdirSync(this.cacheDir, {recursive: true});
                }
                this._cacheInitialized = true;
                this.logger.info(`缓冲目录 ${this.cacheDir} 初始化成功`);
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
                this.logger.info(`当前执行函数 ${getFnName(fn)}`);
                const result = await fn();

                // 如果函数返回了 isRetry 字段，根据它决定是否重试
                if (result && typeof result === 'object' && 'isRetry' in result) {
                    if (result.isRetry) {
                        if (i === retries - 1) {
                            this.logger.error({err: result}, `执行函数 ${getFnName(fn)} 失败，达到最大重试次数`);
                            throw new Error('达到最大重试次数');
                        }
                        this.logger.info(`当前执行第 ${i + 1} / ${retries} 次执行函数 ${getFnName(fn)}`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
                        continue;
                    }

                    this.logger.info(`执行函数 ${getFnName(fn)} 已设置为不重试，跳过重试`);
                    return result.data;
                }

                return result;
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
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @param type 数据类型
     * @param fn 执行的具体函数
     * @returns {Promise<*>}
     */
    async withCache(owner, repo, type, fn) {
        await this.ensureCacheDir(owner, repo);

        const timestamp = Date.now();
        const cacheKey = `${type}`;
        const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);

        // 尝试读取缓存
        try {
            this.logger.info(`正在尝试读取缓存 ${cacheKey}`);
            if (!fs.existsSync(cacheFile)) {
                throw new Error(`缓存 ${cacheKey} 不存在，跳过缓存`);
            }

            const data = fs.readFileSync(cacheFile, 'utf8');
            const cache = JSON.parse(data);
            if (Date.now() - cache.timestamp <= this.cacheTime) {
                this.logger.info(`缓冲 ${cacheKey} 已被命中，返回缓存数据`);
                return cache.data;
            }
        }
        catch (error) {
            this.logger.warn({err: error}, `读取缓存 ${cacheKey} 失败`);
        }

        this.logger.info(`缓存 ${cacheKey} 不存在，开始执行函数 ${getFnName(fn)}`);
        const result = await fn();

        try {
            this.logger.info(`正在写入缓存 ${cacheKey}`);
            fs.writeFileSync(cacheFile, JSON.stringify({
                timestamp: timestamp,
                data: result
            }));
            this.logger.info(`写入缓存 ${cacheKey} 成功`);
        }
        catch (error) {
            this.logger.warn({err: error}, `写入缓存 ${cacheKey} 失败`);
        }

        return result;
    }

    /**
     * 标记插件名字，每个插件都有自己唯一的标记
     */
    getName() { throw new Error('Not implemented'); }

    /**
     * 获取插件的基础 URL
     */
    getBaseUrl() { throw new Error('Not implemented'); }

    /**
     * 发送请求获取数据
     * @param path 请求路径
     * @returns {Promise<void>}
     */
    async request(path) { throw new Error('Not implemented'); }

    /**
     * 获取 star 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForStar(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 fork 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForFork(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 watch 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForWatch(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 commit 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForCommit(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 open issue 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForOpenIssues(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 closed issue 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForClosedIssues(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 open pull request 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForOpenPullRequests(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 closed pull request 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForClosedPullRequests(owner, repo) { throw new Error('Not implemented'); }

    /**
     * 获取 commit author 数
     * @param owner 仓库归属用户
     * @param repo 仓库名称
     * @returns {Promise<void>}
     */
    async getCountForContributors(owner, repo) { throw new Error('Not implemented'); }





    async getLatestVersion(owner, repo) { throw new Error('Not implemented'); }

    async getLatestReleaseTime(owner, repo) { throw new Error('Not implemented'); }

    async getLatestCommitTime(owner, repo) { throw new Error('Not implemented'); }


    async getLicense(owner, repo) { throw new Error('Not implemented'); }

    async getBranchesCount(owner, repo) { throw new Error('Not implemented'); }

    async getTagsCount(owner, repo) { throw new Error('Not implemented'); }


}

module.exports = BadgePlugin;