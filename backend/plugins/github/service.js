class StarHistoryService {
    constructor(githubToken) {
        this.token = githubToken;
        this.baseUrl = 'https://api.github.com/graphql';
    }

    /**
     * 发起 GraphQL 请求
     * @private
     */
    async graphqlRequest(query, variables) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query, variables})
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result.data;
    }

    /**
     * 获取所有 star 历史
     * @param {string} owner 仓库所有者
     * @param {string} repo 仓库名称
     * @returns {Promise<Object>} star 历史数据
     */
    async getAllStars(owner, repo) {
        try {
            let hasNextPage = true;
            let cursor = null;
            const monthlyStats = {};
            let totalCount = 0;

            while (hasNextPage) {
                const query = `
                    query($owner: String!, $repo: String!, $cursor: String) {
                        repository(owner: $owner, name: $repo) {
                            stargazers(first: 100, after: $cursor) {
                                totalCount
                                pageInfo {
                                    endCursor
                                    hasNextPage
                                }
                                edges {
                                    starredAt
                                    cursor
                                }
                            }
                        }
                    }
                `;

                const data = await this.graphqlRequest(query, {owner, repo, cursor});
                const stargazers = data.repository.stargazers;
                totalCount = stargazers.totalCount;

                // 处理本页数据
                stargazers.edges.forEach(({starredAt}) => {
                    const date = new Date(starredAt);
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                    if (!monthlyStats[monthKey]) {
                        monthlyStats[monthKey] = {
                            date: monthKey,
                            increment: 0,
                            total: 0
                        };
                    }

                    monthlyStats[monthKey].increment++;
                });

                // 更新分页信息
                hasNextPage = stargazers.pageInfo.hasNextPage;
                cursor = stargazers.pageInfo.endCursor;

                // 添加短暂延迟以避免触发限制
                if (hasNextPage) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // 计算每个月的累计总数
            let runningTotal = 0;
            const result = Object.values(monthlyStats)
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(stat => {
                    runningTotal += stat.increment;
                    return {
                        ...stat,
                        total: runningTotal
                    };
                });

            return {
                total: totalCount,
                stars: result
            };
        }
        catch (error) {
            console.error('获取 star 历史失败', {error, owner, repo});
            return {error: error.message};
        }
    }

    /**
     * 获取指定月份的 star 数据
     * @param {string} owner 仓库所有者
     * @param {string} repo 仓库名称
     * @param {string} month 月份，格式：YYYY-MM
     * @returns {Promise<Object>} star 数据
     */
    async getMonthlyStars(owner, repo, month) {
        try {
            const query = `
                query($owner: String!, $repo: String!) {
                    repository(owner: $owner, name: $repo) {
                        stargazers(first: 100) {
                            totalCount
                            edges {
                                starredAt
                            }
                        }
                    }
                }
            `;

            const data = await this.graphqlRequest(query, {owner, repo});
            const totalCount = data.repository.stargazers.totalCount;

            // 构造时间范围
            const startDate = new Date(`${month}-01T00:00:00Z`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            // 过滤出指定月份的 star
            const monthlyCount = data.repository.stargazers.edges
                .filter(({starredAt}) => {
                    const date = new Date(starredAt);
                    return date >= startDate && date < endDate;
                })
                .length;

            return {
                stars: monthlyCount,
                totalCount,
                month
            };
        }
        catch (error) {
            console.error('获取月度 star 数据失败', {error, owner, repo, month});
            return {error: error.message};
        }
    }
}

module.exports = StarHistoryService;