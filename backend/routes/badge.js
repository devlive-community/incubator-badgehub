const express = require('express');
const router = express.Router();

// URL 生成器函数
function generateBadgeUrls(baseUrl, params) {
    const {
        platform,
        owner,
        repo,
        type,
        style,
        leftColor,
        rightColor,
        leftText,
        rightText,
        logo,
        logoColor,
        labelColor,
        color,
        ...otherParams  // 捕获其他可能的参数
    } = params;

    let urlParams = new URLSearchParams();

    // 处理所有可能的参数
    const paramsList = {
        type,
        style,
        leftColor,
        rightColor,
        leftText,
        rightText,
        logo,
        logoColor,
        labelColor,
        color,
        ...otherParams
    };

    // 添加非空参数
    Object.entries(paramsList).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            // 特殊处理颜色值，确保 # 号被正确编码
            if (value.toString().startsWith('#')) {
                urlParams.append(key, encodeURIComponent(value));
            }
            else {
                urlParams.append(key, value);
            }
        }
    });

    // 构建基础路径
    let basePath;
    const pathParts = [];

    // 只有在提供了 platform 时才添加到路径中
    if (platform) {
        pathParts.push(platform);
    }

    // owner 是必需的
    pathParts.push(owner);

    // 可选的 repo
    if (repo) {
        pathParts.push(repo);
    }

    basePath = `/api/badge/${pathParts.join('/')}.svg`;

    // 添加查询参数（如果有的话）
    const queryString = urlParams.toString();
    const finalPath = queryString ? `${basePath}?${queryString}` : basePath;
    const fullUrl = `${baseUrl}${finalPath}`;

    // 生成不同格式的 URL
    // 修改 altText 生成逻辑，只包含非空值
    const altText = [platform, owner, repo]
        .filter(Boolean)  // 移除所有假值（undefined, null, empty string）
        .join('-');

    return {
        badgeUrl: fullUrl,
        markdownUrl: `![${altText}](${fullUrl})`,
        imageUrl: `<img src='${fullUrl}' alt='${altText}' />`
    };
}

router.get('/preview', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // 获取所有查询参数
    const urlParams = {
        ...req.query,  // 获取所有查询参数
        platform: req.query.platform || null,  // platform 可以为空
        owner: req.query.owner,
        repo: req.query.repo
    };

    // 只验证 owner 参数
    if (!urlParams.owner) {
        return res.status(400).json({
            error: 'Missing required parameter: owner'
        });
    }

    // 生成所有格式的 URL
    const urls = generateBadgeUrls(baseUrl, urlParams);

    // 渲染徽章组件
    res.render('components/badge', {
        ...urls,
        ...urlParams  // 传递所有参数到视图
    });
});

module.exports = router;