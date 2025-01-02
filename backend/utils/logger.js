const pino = require('pino');

class Logger {
    static instance;

    static createLogger(options = {}) {
        const transport = pino.transport({
            target: 'pino-pretty',
            options: {
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                messageFormat: '{msg}',
                colorize: true
            }
        });

        return pino({
            level: options.level || process.env.LOG_LEVEL || 'info',
            formatters: {
                level: (label) => {
                    return {level: label.toUpperCase()};
                }
            }
        }, transport);
    }

    static getInstance(options = {}) {
        if (!Logger.instance) {
            Logger.instance = Logger.createLogger(options);
        }
        return Logger.instance;
    }
}

module.exports = Logger;