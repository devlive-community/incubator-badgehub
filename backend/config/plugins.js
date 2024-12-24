const config = require('../config');
const GitHubPlugin = require('../plugins/github');
const BadgeService = require('../services/badge');

const setupPlugins = () => {
    const githubToken = config.plugins.github.token;
    if (!githubToken) {
        throw new Error('GITHUB_TOKEN environment variable is required');
    }

    const githubPlugin = new GitHubPlugin(githubToken);
    BadgeService.registerPlugin(githubPlugin);
};

module.exports = setupPlugins;