const defaultConfig = {
    // 基础样式配置
    badgeStyles: [
        {value: 'default', label: 'Default'},
    ],

    // 平台相关配置
    platforms: {
        gitee: {
            name: 'Gitee',
            badgeTypes: [
                {value: 'stars', label: 'Star'},
                {value: 'forks', label: 'Fork'},
                {value: 'watchers', label: 'Watch'},
                {value: 'contributors', label: 'Contributors'},
                {value: 'open_issues', label: 'Opened Issues'},
                {value: 'closed_issues', label: 'Closed Issues'},
                {value: 'licenses', label: 'Licenses'},
                {value: 'default_branch', label: 'Default Branch'}
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