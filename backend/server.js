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

app.use('/static', express.static(path.resolve(__dirname, '../frontend/static')));
app.use('/', routes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

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