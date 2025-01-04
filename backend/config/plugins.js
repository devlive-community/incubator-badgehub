const config = require('../config');
const BadgeService = require('../services/badge');
const ChartService = require('../services/chart');
const GitHubPlugin = require('../plugins/github');
const GiteePlugin = require('../plugins/gitee');

const setupPlugins = () => {
    const githubToken = config.plugins.github.token;
    const giteeToken = config.plugins.gitee.token;

    const githubPlugin = new GitHubPlugin(githubToken, config);
    BadgeService.registerPlugin(githubPlugin);
    ChartService.registerPlugin(githubPlugin);

    const giteePlugin = new GiteePlugin(giteeToken);
    BadgeService.registerPlugin(giteePlugin);
    ChartService.registerPlugin(giteePlugin);
};

module.exports = setupPlugins;