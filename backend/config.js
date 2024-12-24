module.exports = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    plugins: {
        github: {
            token: '' || process.env.GITHUB_TOKEN
        }
    },

    cache: {
        maxAge: 6
    }
};