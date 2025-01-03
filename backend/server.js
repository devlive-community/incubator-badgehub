const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const setupPlugins = require("./config/plugins");
const path = require('path');

const app = express();

setupPlugins();

// 中间件
app.use(cors());
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
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '服务器启动失败'
    });
});

// 启动服务器
const PORT = config.server.port || 3000;
app.listen(PORT, () => {
    console.log(`服务器启动成功，监听端口 ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});