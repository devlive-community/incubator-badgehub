const fs = require('fs').promises;
const path = require('path');

class Template {
    constructor(templateDir) {
        this.templateDir = templateDir;
        this.templates = new Map();
        this.loadTemplates();
    }

    async loadTemplates() {
        try {
            const files = await fs.readdir(this.templateDir);
            for (const file of files) {
                if (file.endsWith('.svg')) {
                    const templateName = path.basename(file, '.svg');
                    const templateContent = await fs.readFile(
                        path.join(this.templateDir, file),
                        'utf-8'
                    );
                    this.templates.set(templateName, templateContent);
                }
            }
            console.log('Templates loaded:', Array.from(this.templates.keys()));
        }
        catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    async getTemplate(name) {
        if (!this.templates.has(name)) {
            await this.loadTemplates();
            if (!this.templates.has(name)) {
                return this.templates.get('default');
            }
        }
        return this.templates.get(name);
    }

    async reloadTemplates() {
        this.templates.clear();
        await this.loadTemplates();
    }
}

module.exports = Template;