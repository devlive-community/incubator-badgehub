const express = require('express');
const router = express.Router();

const routes = [
    {path: '/', page: 'home', title: '首页'},
    {path: '/generator', page: 'generator', title: '徽章生成'},
    {path: '/templates', page: 'templates', title: '模板管理'},
    {path: '/history', page: 'history', title: '生成历史'},
    {path: '/admin', page: 'admin', title: '管理后台'}
];

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

// 404处理
router.use((req, res) => {
    res.status(404).render('layout/blank', {
        page: '404',
        title: '404',
        currentPath: req.path
    });
});

// 错误处理
router.use((err, req, res, next) => {
    res.status(500).render('layout/blank', {
        page: '500',
        title: '服务器错误',
        currentPath: req.path,
        err: err
    });
});

module.exports = router;