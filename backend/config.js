const path = require('path');
const os = require('os');

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    plugins: {
        github: {
            token: '' || process.env.GITHUB_TOKEN
        },
        gitee: {
            token: '' || process.env.GITEE_TOKEN
        }
    },

    cache: {
        dir: path.join(os.tmpdir(), '.cache') || process.env.BADGE_CACHE_DIR,
        time: 5 * 60 * 1000
    }
};