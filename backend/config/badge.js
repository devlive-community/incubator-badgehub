const defaultConfig = {
    // 基础样式配置
    badgeStyles: [
        {value: 'default', label: 'Default'},
    ],

    // 平台相关配置
    platforms: {
        github: {
            name: 'GitHub',
            badgeTypes: [
                {value: 'stars', label: 'Star'},
                {value: 'forks', label: 'Fork'},
                {value: 'watchers', label: 'Watch'},
                {value: 'commits', label: 'Commit'},
                {value: 'open_issues', label: 'Open Issues'},
                {value: 'closed_issues', label: 'Closed Issues'},
                {value: 'opened_pull_requests', label: 'Open Pull Requests'},
                {value: 'closed_pull_requests', label: 'Closed Pull Requests'},
                {value: 'contributors', label: 'Contributors'},
                {value: 'branches', label: 'Branches'},
                {value: 'tags', label: 'Tags'},
                {value: 'licenses', label: 'Licenses'},
                {value: 'latest_version', label: 'Latest Version'},
                {value: 'latest_release_time', label: 'Latest Release Time'},
                {value: 'latest_commit_time', label: 'Latest Commit Time'}
            ],
            previewUrl: '/badge/preview',
            urlParams: {
                platform: 'github'
            }
        },
        gitee: {
            name: 'Gitee',
            badgeTypes: [
                {value: 'stars', label: 'Star'},
                {value: 'forks', label: 'Fork'},
                {value: 'watchers', label: 'Watch'}
            ],
            previewUrl: '/badge/preview',
            urlParams: {
                platform: 'gitee'
            }
        },
        // 通用配置
        custom: {
            name: '自定义',
            previewUrl: '/badge/preview',
            urlParams: {}
        }
    }
};

module.exports = defaultConfig;