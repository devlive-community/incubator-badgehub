// server/server.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();

// 中间件
app.use(cors());
app.use((req, res, next) => {
    res.header('Cache-Control', `public, max-age=${config.cache.maxAge}`);
    next();
});

// 使用路由
app.use('/', routes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// 启动服务器
const PORT = config.server.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});