const express = require('express');
const router = express.Router();

// 页面路由
const routes = [
    {path: '/', page: 'home', title: '首页'},
    {path: '/generator', page: 'generator', title: '徽章生成'},
    {path: '/templates', page: 'templates', title: '模板管理'},
    {path: '/history', page: 'history', title: '生成历史'},
    {path: '/admin', page: 'admin', title: '管理后台'}
];

routes.forEach(({path, page, title}) => {
    router.get(path, (req, res) => {
        res.render('layout/base', {
            page,
            title,
            currentPath: req.path
        });
    });
});

module.exports = router;