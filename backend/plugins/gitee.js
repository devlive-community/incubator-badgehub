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

    async apiRequest(owner, repo, query) {
        this.logger.info(`Gitee Restful API 请求仓库 ${owner}/${repo} 参数 ${query}`);
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'User-Agent': 'BadgeHub-Restful-API-Client'
        };

        const params = {}
        if (this.token) {
            params.access_token = this.token
        }

        return this.withRetry(async () => {
            let path = `${this.getBaseUrl()}/api/v5/repos/${owner}/${repo}`
            if (query) {
                path += `/${query}`
            }

            this.logger.info(`Gitee Restful API 请求路径 ${path}`);
            const response = await fetch(path, {
                method: 'GET',
                headers,
                params
            });

            const data = await response.json();

            if (response.status >= 400) {
                this.logger.error({
                    status: response.status,
                    statusText: response.statusText,
                    data
                }, 'Gitee Restful API 请求失败');

                return {
                    isRetry: data.message.indexOf('rate limit exceeded') === -1,
                    data: response.statusText === 'rate limit exceeded' ? '请求次数已达到限制, 建议切换 Gitee Token 或者等待一段时间后重试' : response.statusText,
                    error: new Error(`Gitee Restful API 请求失败: ${response.status} ${response.statusText}`)
                };
            }

            return {
                isRetry: false,
                data: Array.isArray(data) ? data.length : data
            };
        });
    }

    async extractGiteeData(owner, repo, query, type, extractPath) {
        return this.withCache(owner, repo, type, async () => {
            const response = await this.apiRequest(owner, repo, query);

            let value;
            if (extractPath === undefined) {
                value = response;
            }
            else if (Array.isArray(extractPath) && extractPath.length === 1) {
                // 直接从根级别获取属性
                value = response[extractPath[0]];
            }
            else {
                // 保持原有的深层解析逻辑
                value = extractPath.reduce((obj, key) => obj?.[key], response);
            }

            return {value: value ?? '解析结果失败'};
        });
    }

    async getCountForStar(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'stars',
            ['stargazers_count']
        );
    }

    async getCountForFork(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'forks',
            ['forks_count']
        )
    }

    async getCountForWatch(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'watchers',
            ['watchers_count']
        )
    }

    async getCountForOpenIssues(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'issues',
            ['open_issues_count']
        )
    }

    async getCountForClosedIssues(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            'issues?state=closed',
            'closed_issues',
            undefined
        )
    }

    async getCountForContributors(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            'contributors',
            'commits',
            undefined
        )
    }

    async getTextForDefaultBranch(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'default_branch',
            ['default_branch']
        )
    }

    async getTextForLicense(owner, repo) {
        return await this.extractGiteeData(
            owner,
            repo,
            undefined,
            'license',
            ['license']
        )
    }

    getName() {
        return 'gitee';
    }

    getBaseUrl() {
        return 'https://gitee.com';
    }
}

module.exports = GiteePlugin;