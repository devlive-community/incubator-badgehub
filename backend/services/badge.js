const TemplateLoader = require('../loader/template');
const path = require('path');
const {createCanvas} = require('canvas');

class BadgeService {
    static templateLoader = new TemplateLoader(
        path.join(__dirname, '..', 'templates')
    );

    static plugins = new Map();

    static PADDING = 8;
    static FONT_SIZE = 11;
    static FONT_FAMILY = 'DejaVu Sans,Verdana,Geneva,sans-serif';

    // 添加颜色解码方法
    static decodeColor(color) {
        if (!color) {
            return color;
        }
        // 处理 URL 编码的颜色值（%23）
        if (color.startsWith('%23')) {
            return '#' + color.slice(3);
        }
        // 处理已经是 # 开头的颜色值
        if (color.startsWith('#')) {
            return color;
        }
        // 如果是普通的颜色值，直接返回
        return color;
    }

    static registerPlugin(plugin) {
        this.plugins.set(plugin.getName(), plugin);
    }

    static getPlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin ${name} not found`);
        }
        return plugin;
    }

    static async getMetrics(platform, owner, repo, type = null) {
        const plugin = this.getPlugin(platform);

        // 如果type有效且是单个类型，只获取指定类型的数据
        if (type) {
            // console.log(`Getting ${type} data for ${owner}/${repo}`);
            let value;
            switch (type) {
                case 'stars':
                    value = await plugin.getCountForStar(owner, repo);
                    return {stars: value};
                case 'forks':
                    value = await plugin.getForkCount(owner, repo);
                    return {forks: value};
                case 'watches':
                    value = await plugin.getWatchCount(owner, repo);
                    return {watches: value};
                case 'commits':
                    value = await plugin.getCommitsCount(owner, repo);
                    return {commits: value};
                case 'contributors':
                    value = await plugin.getContributorsCount(owner, repo);
                    return {contributors: value};
                case 'licenses':
                    value = await plugin.getLicense(owner, repo);
                    return {licenses: value};
                case 'branches':
                    value = await plugin.getBranchesCount(owner, repo);
                    return {branches: value};
                case 'tags':
                    value = await plugin.getTagsCount(owner, repo);
                    return {tags: value};
                case 'latest_version':
                    value = await plugin.getLatestVersion(owner, repo);
                    return {latest_version: value};
                case 'latest_release_time':
                    value = await plugin.getLatestReleaseTime(owner, repo);
                    return {latest_release_time: value};
                case 'latest_commit_time':
                    value = await plugin.getLatestCommitTime(owner, repo);
                    return {latest_commit_time: value};
                case 'open_issues':
                    value = await plugin.getOpenIssuesCount(owner, repo);
                    return {open_issues: value};
                case 'closed_issues':
                    value = await plugin.getClosedIssuesCount(owner, repo);
                    return {closed_issues: value};
                case 'opened_pull_requests':
                    value = await plugin.getOpenPullRequestsCount(owner, repo);
                    return {opened_pull_requests: value};
                case 'closed_pull_requests':
                    value = await plugin.getClosedPullRequestsCount(owner, repo);
                    return {closed_pull_requests: value};
                default:
                    throw new Error(`Invalid type: ${type}`);
            }
        }

        // 如果type无效或未指定，获取所有数据
        const [stars, forks, watches] = await Promise.all([
            plugin.getStarCount(owner, repo),
            plugin.getForkCount(owner, repo),
            plugin.getWatchCount(owner, repo)
        ]);

        return {stars, forks, watches};
    }

    static measureText(text) {
        const canvas = createCanvas(100, 20);
        const ctx = canvas.getContext('2d');
        ctx.font = `${this.FONT_SIZE}px ${this.FONT_FAMILY}`;
        return ctx.measureText(text).width;
    }

    static async fetchAndEncodeImage(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            const mimeType = response.headers.get('content-type') || 'image/png';
            return `data:${mimeType};base64,${base64}`;
        }
        catch (error) {
            console.error('Error fetching logo:', error);
            return null;
        }
    }

    static async generateBadge(params) {
        // console.log('Original params:', params);
        const {
            leftText,
            rightText,
            leftColor: rawLeftColor = '#555',
            rightColor: rawRightColor = '#4c1',
            leftColorDark: rawLeftColorDark = '#333',
            rightColorDark: rawRightColorDark = '#069',
            style = 'default',
            logo
        } = params;

        let logoData = logo;
        if (logo) {
            logoData = await this.fetchAndEncodeImage(logo);
        }

        // 解码所有颜色值
        const leftColor = this.decodeColor(rawLeftColor);
        const rightColor = this.decodeColor(rawRightColor);
        const leftColorDark = this.decodeColor(rawLeftColorDark);
        const rightColorDark = this.decodeColor(rawRightColorDark);

        // console.log('Decoded colors:', {leftColor, rightColor, leftColorDark, rightColorDark});

        try {
            const leftTextWidth = Math.ceil(this.measureText(leftText));
            const rightTextWidth = Math.ceil(this.measureText(rightText));

            // 如果有logo，添加logo的宽度(14px)和间距(4px)
            const logoWidth = logo ? 14 : 0;

            // 修改leftWidth计算，包含logo空间
            const leftWidth = leftTextWidth + (this.PADDING * 2) + logoWidth;
            const rightWidth = rightTextWidth + (this.PADDING * 2);
            const totalWidth = leftWidth + rightWidth;

            // 如果有logo，文字需要往后偏移
            const leftPadding = this.PADDING + (logo ? logoWidth : 0);
            const rightTextX = leftWidth + this.PADDING;

            let imageY = style === 'flat' ? 5 : 3;
            imageY = style.startsWith('3d') ? 3 : imageY;
            imageY = style === 'glass' ? 4 : imageY;

            const imageX = style === 'glass' || style === 'rounded' ? 6 : 4;

            const imageTag = logoData ? `<image width="14" height="14" y="${imageY}" x="${imageX}" href="${logoData}" />` : '';

            const template = await this.templateLoader.getTemplate(style);
            return template
                .replace(/\{leftColor\}/g, leftColor)
                .replace(/\{rightColor\}/g, rightColor)
                .replace(/\{leftText\}/g, leftText)
                .replace(/\{rightText\}/g, rightText)
                .replace(/\{leftWidth\}/g, leftWidth)
                .replace(/\{rightWidth\}/g, rightWidth)
                .replace(/\{totalWidth\}/g, totalWidth)
                .replace(/\{leftPadding\}/g, leftPadding)
                .replace(/\{rightTextX\}/g, rightTextX)
                .replace(/\{leftColorDark\}/g, leftColorDark)
                .replace(/\{imageTag\}/g, imageTag || '')
                .replace(/\{rightColorDark\}/g, rightColorDark);
        }
        catch (error) {
            console.error(`Error generating badge: ${error.message}`);
            throw error;
        }
    }

    static async reloadTemplates() {
        await this.templateLoader.reloadTemplates();
    }
}

module.exports = BadgeService;