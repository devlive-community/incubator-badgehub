const {createCanvas} = require('canvas');

const PADDING = 8;
const FONT_SIZE = 11;
const FONT_FAMILY = 'Verdana';

/**
 * 绘制文本内容
 * @param text 文本内容
 * @returns {number}
 */
function measureText(text) {
    const canvas = createCanvas(200, 20);
    const ctx = canvas.getContext('2d');
    ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
    return ctx.measureText(text).width;
}

function decodeColor(color) {
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

// 预定义的颜色主题
const THEMES = {
    default: {
        labelColor: '#555',
        descriptionColor: '#4c1'
    },
    success: {
        labelColor: '#2ea44f',
        descriptionColor: '#3fb950'
    },
    error: {
        labelColor: '#d73a49',
        descriptionColor: '#cb2431'
    },
    warning: {
        labelColor: '#d29922',
        descriptionColor: '#e3b341'
    },
    info: {
        labelColor: '#0366d6',
        descriptionColor: '#1f6feb'
    }
};

const platformLogos = {
    github: `
        <path transform="translate(PADDING,VERTICAL_CENTER)" 
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M7 0C3.13 0 0 3.13 0 7c0 3.09 2 5.71 4.77 6.63.35.06.48-.15.48-.33v-1.15c-1.94.42-2.35-.94-2.35-.94-.32-.8-.78-1.01-.78-1.01-.63-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.06 1.63.75 2.03.58.06-.45.24-.76.44-.94-1.55-.18-3.18-.78-3.18-3.46 0-.76.27-1.39.72-1.88-.07-.18-.31-.88.07-1.83 0 0 .59-.19 1.93.72a6.7 6.7 0 0 1 1.75-.24c.59 0 1.19.08 1.75.24 1.34-.91 1.93-.72 1.93-.72.38.95.14 1.65.07 1.83.45.49.72 1.12.72 1.88 0 2.69-1.64 3.28-3.2 3.46.25.22.48.64.48 1.3v1.92c0 .18.13.4.48.33C12 12.71 14 10.09 14 7c0-3.87-3.13-7-7-7z">
        </path>
    `,
    gitee: `
        <path transform="translate(PADDING,VERTICAL_CENTER)" 
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M7 0A7 7 0 0 0 0 7a7 7 0 0 0 7 7 7 7 0 0 0 7-7A7 7 0 0 0 7 0a7 7 0 0 0-.009 0zm3.552 3.111c.191 0 .346.155.345.346v.865a.347.347 0 0 1-.346.346H5.704c-.573 0-1.038.464-1.038 1.038v3.284c0 .191.155.346.346.346h3.284c.573 0 1.038-.464 1.038-1.038v-.173a.346.346 0 0 0-.346-.346H6.667a.346.346 0 0 1-.346-.346v-.865c0-.191.155-.346.346-.346h3.976c.191 0 .346.155.346.346v1.988a2.333 2.333 0 0 1-2.333 2.333H3.457a.346.346 0 0 1-.346-.346V5.704a2.593 2.593 0 0 1 2.593-2.593h4.848z">
        </path>
    `,
    npm: `
        <path transform="translate(PADDING,VERTICAL_CENTER)"
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M0 0v14h14V0H0zm11.67 11.67H7V4.33H2.33v7.34H0V2.33h14v9.34h-2.33z">
        </path>
    `,
    docker: `
        <path transform="translate(PADDING,VERTICAL_CENTER)"
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M14 5.05c-.23-.32-.57-.56-.99-.72-.02-.01-.02-.01-.05-.02-.05-.93-.34-1.75-.99-2.36l-.19-.18-.18.19a3.05 3.05 0 0 0-.41 2.89c.06.15.13.29.22.43-.1.06-.22.11-.31.16-.21.09-.42.14-.65.18l-.06.01H0c-.11.5-.12 1.02.01 1.53.17.7.56 1.31 1.11 1.77.61.51 1.39.78 2.21.78.42 0 .83-.06 1.22-.17a5.33 5.33 0 0 0 3.84-3.99c.42.02.83-.02 1.21-.14.01 0 .02-.01.03-.01.05.37.11.74.21 1.09.29.99.88 1.86 1.85 2.39l.23.12.17-.19c.37-.4.57-.93.6-1.48.02-.37-.05-.76-.23-1.12">
        </path>
    `,
    vue: `
        <path transform="translate(PADDING,VERTICAL_CENTER)"
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M11.2 0H14L7 12 0 0h5.4L7 2.8 8.6 0h2.6z">
        </path>
    `,
    react: `
        <path transform="translate(PADDING,VERTICAL_CENTER)"
            fill="white"
            width="LOGO_WIDTH"
            height="LOGO_WIDTH"
            d="M14 7c0-.9-1.1-1.7-2.9-2.2.4-1.8.2-3.2-.5-3.7-.2-.1-.4-.2-.6-.2v.8c.1 0 .2 0 .3.1.4.2.5 1 .4 2.1 0 .3-.1.5-.1.8-1-.2-2.1-.4-3.2-.4-1.1 0-2.2.2-3.2.4 0-.3-.1-.5-.1-.8-.1-1.1 0-1.9.4-2.1.1-.1.2-.1.3-.1v-.8c-.2 0-.4.1-.6.2-.7.5-.9 1.9-.5 3.7C1.1 5.3 0 6.1 0 7s1.1 1.7 2.9 2.2c-.4 1.8-.2 3.2.5 3.7.2.1.4.2.6.2.7 0 1.6-.6 2.5-1.6.9 1 1.8 1.6 2.5 1.6.2 0 .4-.1.6-.2.7-.5.9-1.9.5-3.7 1.8-.5 2.9-1.3 2.9-2.2zm-3.5-1.8c-.1.3-.2.6-.3.9-.1-.2-.2-.4-.3-.6-.1-.2-.2-.4-.3-.6.3 0 .6.1.9.3zm-1.1 2.4c-.2.3-.4.6-.5.9-.3 0-.6.1-.9.1-.3 0-.6 0-.9-.1-.2-.3-.4-.6-.5-.9-.2-.3-.3-.6-.4-.9.1-.3.2-.6.4-.9.2-.3.4-.6.5-.9.3 0 .6-.1.9-.1.3 0 .6 0 .9.1.2.3.4.6.5.9.2.3.3.6.4.9-.1.3-.2.6-.4.9zm.8-1c.1.3.2.6.3.9-.3.1-.6.2-.9.3.1-.2.2-.4.3-.6.1-.2.2-.4.3-.6zM7 11.3c-.2-.2-.4-.5-.6-.7.2 0 .4.1.6.1.2 0 .4 0 .6-.1-.2.2-.4.5-.6.7zM4.8 8.7c-.3-.1-.6-.2-.9-.3.1-.3.2-.6.3-.9.1.2.2.4.3.6.1.2.2.4.3.6zm2.2-6.6c.2.2.4.5.6.7-.2 0-.4-.1-.6-.1-.2 0-.4 0-.6.1.2-.2.4-.4.6-.7zM4.8 5.3c-.1.2-.2.4-.3.6-.1-.3-.2-.6-.3-.9.3-.1.6-.2.9-.3-.1.2-.2.4-.3.6zm-2.1 3c-1-.4-1.7-.9-1.7-1.3s.7-.9 1.7-1.3c.2-.1.5-.2.8-.2.2.3.3.6.5.9.2.3.3.6.5.9-.2.3-.3.6-.5.9-.2.3-.3.6-.5.9-.3-.1-.6-.2-.8-.2zm1 4.2c-.4-.2-.5-1-.4-2.1 0-.3.1-.5.1-.8 1 .2 2.1.4 3.2.4 1.1 0 2.2-.2 3.2-.4 0 .3.1.5.1.8.1 1.1 0 1.9-.4 2.1-.1.1-.2.1-.3.1-.7 0-1.6-.6-2.5-1.6-.9 1-1.8 1.6-2.5 1.6-.1-.1-.2-.1-.3-.1h-.2zm6.5-2.9c-.2-.1-.5-.2-.8-.2-.2-.3-.3-.6-.5-.9-.2-.3-.3-.6-.5-.9.2-.3.3-.6.5-.9.2-.3.3-.6.5-.9.3.1.5.2.8.3 1 .4 1.7.9 1.7 1.3 0 .4-.7.9-1.7 1.2z">
        </path>
    `
};

/**
 * 绘制 SVG 徽章
 * @param params 参数对象
 * @param {string} params.label - 标签文本
 * @param {string} params.labelColor - 标签背景颜色
 * @param {string} params.description - 描述文本
 * @param {string} params.descriptionColor - 描述背景颜色
 * @param {string} params.platform - 平台图标
 * @param {string} params.logo - 平台图标(与platform相同)
 * @param {string} params.theme - 预定义主题名称
 * @param {boolean} params.flat - 是否使用扁平风格
 * @param {number} params.radius - 圆角半径
 * @returns {Promise<string>}
 */
async function drawSvg(params) {
    let {
        label,
        labelColor,
        description,
        descriptionColor,
        platform = undefined,
        logo = undefined,
        theme = 'default',
        flat = false,
        radius = 0
    } = params;

    // 应用主题颜色
    if (THEMES[theme]) {
        labelColor = labelColor || THEMES[theme].labelColor;
        descriptionColor = descriptionColor || THEMES[theme].descriptionColor;
    } else {
        labelColor = labelColor || THEMES.default.labelColor;
        descriptionColor = descriptionColor || THEMES.default.descriptionColor;
    }

    if (logo) {
        platform = logo;
    }

    const logoWidth = 14;
    const verticalCenter = 11;
    const hasPlatform = platform !== undefined && platformLogos[platform] !== undefined;

    const labelContentWidth = Math.ceil(measureText(label));
    let labelWidth = labelContentWidth + (PADDING * 2) + (hasPlatform ? logoWidth + PADDING : 0);

    const descriptionWidth = Math.ceil(measureText(description)) + (PADDING * 2);
    const totalWidth = labelWidth + descriptionWidth;

    // 处理图标模板中的占位符
    const processLogoTemplate = (template) => {
        return template
            .replace(/PADDING/g, PADDING)
            .replace(/VERTICAL_CENTER/g, verticalCenter - 8)
            .replace(/LOGO_WIDTH/g, logoWidth);
    };

    // 生成圆角矩形路径
    const getRoundedRectPath = (x, width, radius) => {
        if (!radius || flat) {
            return `M${x},0 h${width} v20 h-${width} z`;
        }
        return `
            M${x + radius},0
            h${width - radius * 2}
            q${radius},0 ${radius},${radius}
            v${20 - radius * 2}
            q0,${radius} -${radius},${radius}
            h-${width - radius * 2}
            q-${radius},0 -${radius},-${radius}
            v-${20 - radius * 2}
            q0,-${radius} ${radius},-${radius}
        `;
    }

    // 生成渐变效果
    const gradient = flat ? '' : `
        <defs>
            <linearGradient id="gradient-label" x2="0" y2="100%">
                <stop offset="0" stop-color="#fff" stop-opacity=".1"/>
                <stop offset="1" stop-opacity=".1"/>
            </linearGradient>
        </defs>
    `;

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
            ${gradient}
            
            <g shape-rendering="crispEdges">
                <path fill="${decodeColor(labelColor)}"
                    d="${getRoundedRectPath(0, labelWidth, radius)}"/>
                <path fill="${decodeColor(descriptionColor)}"
                    d="${getRoundedRectPath(labelWidth, descriptionWidth, radius)}"/>
            </g>
            
            ${hasPlatform ? processLogoTemplate(platformLogos[platform]) : ''}
            
            <g fill="white" text-anchor="middle" 
               font-family="${FONT_FAMILY}" font-size="${FONT_SIZE}">
                <text x="${hasPlatform ? PADDING * 2 + logoWidth + labelContentWidth / 2 : labelWidth / 2}"
                    y="${verticalCenter}"
                    dominant-baseline="middle">
                    ${label}
                </text>
                <text x="${labelWidth + descriptionWidth / 2}"
                    y="${verticalCenter}"
                    dominant-baseline="middle">
                    ${description}
                </text>
            </g>
            
            ${!flat ? `
                <path fill="url(#gradient-label)"
                    d="${getRoundedRectPath(0, totalWidth, radius)}"/>
            ` : ''}
        </svg>
    `;
}

// 导出一些预定义的样式
drawSvg.THEMES = THEMES;

// 导出一些辅助函数
drawSvg.utils = {
    measureText,
    decodeColor
};

module.exports = drawSvg;