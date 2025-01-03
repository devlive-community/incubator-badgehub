const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const setupPlugins = require("./config/plugins");
const path = require('path');
const {getInstance} = require("./utils/logger");

const app = express();
const logger = getInstance();

setupPlugins();

// 中间件
app.use(cors());

app.use((req, res, next) => {
    if (req.path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
    }
    next();
});

app.use((req, res, next) => {
    res.header('Cache-Control', `public, max-age=${config.cache.maxAge}`);
    next();
});

// API 路由 - 所有 API 请求添加 /api 前缀
app.use('/api', routes);

// 设置静态文件目录 - 指向 Vue 构建后的文件
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// 所有其他请求返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    logger.error('Error:', err.message, {
        url: req.url,
        stack: err.stack
    });

    res.status(500).json({
        success: false,
        message: '服务器处理请求失败',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
const PORT = config.server.port || 3000;
app.listen(PORT, () => {
    console.log(`服务器启动成功，监听端口 ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});