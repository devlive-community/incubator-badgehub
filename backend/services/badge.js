const TemplateLoader = require('../loader/template');
const path = require('path');

class BadgeService {
    static templateLoader = new TemplateLoader(
        path.join(__dirname, '..', 'templates')
    );

    static PADDING = 8;

    static async generateBadge(params) {
        const {
            leftText,
            rightText,
            leftColor = '#555',
            rightColor = '#4c1',
            style = 'default'
        } = params;

        try {
            const template = await this.templateLoader.getTemplate(style);
            return template
                .replace(/\{leftColor\}/g, leftColor)
                .replace(/\{rightColor\}/g, rightColor)
                .replace(/\{leftText\}/g, leftText)
                .replace(/\{rightText\}/g, rightText);
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