const TemplateLoader = require('../loader/template');
const path = require('path');
const {createCanvas} = require('canvas');

class BadgeService {
    static templateLoader = new TemplateLoader(
        path.join(__dirname, '..', 'templates')
    );

    static PADDING = 8;
    static FONT_SIZE = 11;
    static FONT_FAMILY = 'DejaVu Sans,Verdana,Geneva,sans-serif';

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
            // 测量文本宽度
            const leftTextWidth = Math.ceil(this.measureText(leftText));
            const rightTextWidth = Math.ceil(this.measureText(rightText));

            // 计算各个部分的尺寸
            const leftWidth = leftTextWidth + (this.PADDING * 2);
            const rightWidth = rightTextWidth + (this.PADDING * 2);
            const totalWidth = leftWidth + rightWidth;
            const rightTextX = leftWidth + this.PADDING;

            // 获取并填充模板
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