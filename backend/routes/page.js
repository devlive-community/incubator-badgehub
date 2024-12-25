const express = require('express');
const router = express.Router();

const routes = [
    {path: '/', page: 'home', title: '首页'},
    {path: '/generator/basic', page: 'generator/basic', title: '基础徽章'},
    {path: '/templates', page: 'templates', title: '模板管理'},
    {path: '/history', page: 'history', title: '生成历史'},
    {path: '/admin', page: 'admin', title: '管理后台'}
];

// 📌 普通页面路由
routes.forEach(({path, page, title}) => {
    router.get(path, (req, res, next) => {
        try {
            res.render('layout/base', {
                page,
                title,
                currentPath: req.path
            });
        }
        catch (err) {
            next(err);
        }
    });
});

// 📌 API 路由占位符（可单独放到一个 /api 路由模块中进行管理）
router.use('/api', (req, res, next) => {
    // 如果请求没有匹配到具体的 API 路由，返回 JSON 格式的 404 响应
    res.status(404).json({
        success: false,
        message: 'API 路由未找到'
    });
});

// 📌 404 页面处理（非 API 请求）
router.use((req, res) => {
    if (req.path.startsWith('/api')) {
        // 避免 API 请求走到这里，直接跳过
        return;
    }
    res.status(404).render('layout/blank', {
        page: '404',
        title: '404',
        currentPath: req.path
    });
});

// 📌 错误处理中间件
router.use((err, req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: err.message
        });
    }

    res.status(500).render('layout/blank', {
        page: '500',
        title: '服务器错误',
        currentPath: req.path,
        err: err
    });
});

module.exports = router;