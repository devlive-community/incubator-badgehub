const axios = require('axios');
const {getInstance} = require("../utils/logger");
const BadgePlugin = require("./base");

class GitHubPlugin extends BadgePlugin {
    constructor(token) {
        super(token)

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'BadgeHub'
        }

        if (token) {
            headers['Authorization'] = `token ${token}`
        }

        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: headers
        });

        this.logger = getInstance();
    }

    async request(path) {
        const {data} = await this.client.get(path);
        return data;
    }

    async graphqlRequest({query, variables = {}}) {
        this.logger.info(`GitHub GraphQL 请求参数 ${query}`);
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'BadgeHub-GraphQL-Client'
        };

        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }

        return this.withRetry(async () => {
            const response = await fetch(`${this.getBaseUrl()}/graphql`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            const data = await response.json();

            if (response.status >= 400) {
                this.logger.error({
                    status: response.status,
                    statusText: response.statusText,
                    data
                }, 'GitHub GraphQL HTTP 请求失败');

                return {
                    isRetry: data.message.indexOf('rate limit exceeded') === -1,
                    data: response.statusText === 'rate limit exceeded' ? '请求次数已达到限制, 建议切换 GitHub Token 或者等待一段时间后重试' : response.statusText,
                    error: new Error(`GitHub GraphQL HTTP 请求失败: ${response.status} ${response.statusText}`)
                };
            }

            // 截取 GraphQL 错误信息
            if (data?.errors?.length > 0) {
                this.logger.error({
                    errors: data.errors
                }, 'GitHub GraphQL 参数异常');
                return {
                    isRetry: false,
                    data: data.errors[0].message
                };

                return {
                    isRetry: false,
                    data: data.errors[0].message,
                    error: new Error(`GitHub GraphQL 参数异常: ${response.status} ${response.statusText}`)
                };
            }

            return {
                isRetry: false,
                data: data.data
            };
        });
    }

    async extractGitHubData(owner, repo, type, query, extractPath) {
        return this.withCache(owner, repo, type, async () => {
            const response = await this.graphqlRequest({query});

            const value = extractPath.reduce((obj, key) => obj?.[key], response);
            return {value: value ?? '解析结果失败'};
        });
    }

    async getCountForStar(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    stargazerCount
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'stars',
            query,
            ['repository', 'stargazerCount']
        );
    }

    async getCountForFork(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    forkCount
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'forks',
            query,
            ['repository', 'forkCount']
        );
    }

    async getCountForWatch(owner, repo) {
        const query = `
                query {
                    repository(owner: "${owner}", name: "${repo}") {
                        watchers {
                            totalCount
                        }
                    }
                }
            `

        return await this.extractGitHubData(
            owner,
            repo,
            'watchers',
            query,
            ['repository', 'watchers', 'totalCount']
        );
    }

    async getCountForCommit(owner, repo) {
        const query = `
            query {
              repository(owner: "${owner}", name: "${repo}") {
                defaultBranchRef {
                  name
                  target {
                    ... on Commit {
                      history(first: 1) {
                        totalCount
                      }
                    }
                  }
                }
              }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'commits',
            query,
            ['repository', 'defaultBranchRef', 'target', 'history', 'totalCount']
        );
    }

    async getCountForOpenIssues(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    openIssues: issues(states: OPEN) {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'issues',
            query,
            ['repository', 'openIssues', 'totalCount']
        )
    }

    async getCountForClosedIssues(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    closedIssues: issues(states: CLOSED) {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'closed_issues',
            query,
            ['repository', 'closedIssues', 'totalCount']
        )
    }

    async getCountForOpenPullRequests(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    openPullRequests: pullRequests(states: OPEN) {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'pull_requests',
            query,
            ['repository', 'openPullRequests', 'totalCount']
        )
    }

    async getCountForClosedPullRequests(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    closedPullRequests: pullRequests(states: CLOSED) {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'closed_pull_requests',
            query,
            ['repository', 'closedPullRequests', 'totalCount']
        )
    }

    async getCountForContributors(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    mentionableUsers {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'contributors',
            query,
            ['repository', 'mentionableUsers', 'totalCount']
        )
    }

    async getCountForBranches(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    refs(refPrefix: "refs/heads/") {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'branches',
            query,
            ['repository', 'refs', 'totalCount']
        )
    }

    async getCountForTags(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    refs(refPrefix: "refs/tags/") {
                        totalCount
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'tags',
            query,
            ['repository', 'refs', 'totalCount']
        )
    }

    async getTextForLicense(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    licenseInfo {
                        name
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'licenses',
            query,
            ['repository', 'licenseInfo', 'name']
        )
    }

    async getLatestVersion(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    latestRelease {
                        tagName
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'latest_version',
            query,
            ['repository', 'latestRelease', 'tagName']
        )
    }

    async getLatestReleaseTime(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    latestRelease {
                        createdAt
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'latest_release_time',
            query,
            ['repository', 'latestRelease', 'createdAt']
        )
    }

    async getLatestCommitTime(owner, repo) {
        const query = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                committedDate
                            }
                        }
                    }
                }
            }
        `

        return await this.extractGitHubData(
            owner,
            repo,
            'latest_commit_time',
            query,
            ['repository', 'defaultBranchRef', 'target', 'committedDate']
        )
    }

    getName() {
        return 'github';
    }

    getBaseUrl() {
        return 'https://api.github.com';
    }
}

module.exports = GitHubPlugin;