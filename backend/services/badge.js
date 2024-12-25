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
            console.log(`Getting ${type} data for ${owner}/${repo}`);
            let value;
            switch (type) {
                case 'stars':
                    value = await plugin.getStarCount(owner, repo);
                    return {stars: value};
                case 'forks':
                    value = await plugin.getForkCount(owner, repo);
                    return {forks: value};
                case 'watches':
                    value = await plugin.getWatchCount(owner, repo);
                    return {watches: value};
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

    static async generateBadge(params) {
        const {
            leftText,
            rightText,
            leftColor = '#555',
            rightColor = '#4c1',
            style = 'default'
        } = params;

        try {
            const leftTextWidth = Math.ceil(this.measureText(leftText));
            const rightTextWidth = Math.ceil(this.measureText(rightText));

            const leftWidth = leftTextWidth + (this.PADDING * 2);
            const rightWidth = rightTextWidth + (this.PADDING * 2);
            const totalWidth = leftWidth + rightWidth;
            const rightTextX = leftWidth + this.PADDING;

            const template = await this.templateLoader.getTemplate(style);
            return template
                .replace(/\{leftColor\}/g, leftColor)
                .replace(/\{rightColor\}/g, rightColor)
                .replace(/\{leftText\}/g, leftText)
                .replace(/\{rightText\}/g, rightText)
                .replace(/\{leftWidth\}/g, leftWidth)
                .replace(/\{rightWidth\}/g, rightWidth)
                .replace(/\{totalWidth\}/g, totalWidth)
                .replace(/\{leftPadding\}/g, this.PADDING)
                .replace(/\{rightTextX\}/g, rightTextX);
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