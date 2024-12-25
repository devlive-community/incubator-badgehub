const defaultConfig = {
    // 基础样式配置
    badgeStyles: [
        {value: 'default', label: 'Default'},
        {value: '3d', label: '3D'},
        {value: '3dimensional', label: '3Dimensional'},
        {value: 'flat', label: 'Flat'},
        {value: 'glass', label: 'Glass'},
        {value: 'gradient', label: 'Gradient'},
        {value: 'metallic', label: 'Metallic'},
        {value: 'minimal', label: 'Minimal'},
        {value: 'neno', label: 'Neno'},
        {value: 'rounded', label: 'Rounded'},
        {value: 'textured', label: 'Textured'}
    ],

    // 平台相关配置
    platforms: {
        github: {
            name: 'GitHub',
            badgeTypes: [
                {value: 'stars', label: 'Star'},
                {value: 'forks', label: 'Fork'},
                {value: 'watches', label: 'Watch'},
                {value: 'commits', label: 'Commit'},
                {value: 'contributors', label: 'Contributors'},
                {value: 'branches', label: 'Branches'},
                {value: 'tags', label: 'Tags'},
                {value: 'licenses', label: 'Licenses'},
                {value: 'latest_version', label: 'Latest Version'},
                {value: 'latest_release_time', label: 'Latest Release Time'},
                {value: 'latest_commit_time', label: 'Latest Commit Time'},
                {value: 'open_issues', label: 'Open Issues'},
                {value: 'closed_issues', label: 'Closed Issues'},
                {value: 'opened_pull_requests', label: 'Open Pull Requests'},
                {value: 'closed_pull_requests', label: 'Closed Pull Requests'}
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
                {value: 'watches', label: 'Watch'}
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