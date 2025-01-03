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

/**
 * 绘制 SVG 徽章
 * @param params 参数
 * @returns {Promise<string>}
 */
async function drawSvg(params) {
    let {
        label,
        labelColor = '#555',
        description,
        descriptionColor = '#4c1',
        platform = undefined,
        logo = undefined,
    } = params;
    if (logo) {
        platform = logo;
    }

    const logoWidth = 14;
    const verticalCenter = 11;
    const hasPlatform = platform !== undefined;

    const labelContentWidth = Math.ceil(measureText(label));
    let labelWidth = labelContentWidth + (PADDING * 2) + (hasPlatform ? logoWidth + PADDING : 0);

    const descriptionWidth = Math.ceil(measureText(description)) + (PADDING * 2);
    const totalWidth = labelWidth + descriptionWidth;

    const platformLogos = {
        github: `
            <path transform="translate(${PADDING},${verticalCenter - 8})" 
                fill="white"
                width="${logoWidth}"
                height="${logoWidth}"
                d="M7 0C3.13 0 0 3.13 0 7c0 3.09 2 5.71 4.77 6.63.35.06.48-.15.48-.33v-1.15c-1.94.42-2.35-.94-2.35-.94-.32-.8-.78-1.01-.78-1.01-.63-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.06 1.63.75 2.03.58.06-.45.24-.76.44-.94-1.55-.18-3.18-.78-3.18-3.46 0-.76.27-1.39.72-1.88-.07-.18-.31-.88.07-1.83 0 0 .59-.19 1.93.72a6.7 6.7 0 0 1 1.75-.24c.59 0 1.19.08 1.75.24 1.34-.91 1.93-.72 1.93-.72.38.95.14 1.65.07 1.83.45.49.72 1.12.72 1.88 0 2.69-1.64 3.28-3.2 3.46.25.22.48.64.48 1.3v1.92c0 .18.13.4.48.33C12 12.71 14 10.09 14 7c0-3.87-3.13-7-7-7z">
            </path>
        `,
        gitee: `
            <path transform="translate(${PADDING},${verticalCenter - 8})" 
                fill="white"
                width="${logoWidth}"
                height="${logoWidth}"
                d="M7 0A7 7 0 0 0 0 7a7 7 0 0 0 7 7 7 7 0 0 0 7-7A7 7 0 0 0 7 0a7 7 0 0 0-.009 0zm3.552 3.111c.191 0 .346.155.345.346v.865a.347.347 0 0 1-.346.346H5.704c-.573 0-1.038.464-1.038 1.038v3.284c0 .191.155.346.346.346h3.284c.573 0 1.038-.464 1.038-1.038v-.173a.346.346 0 0 0-.346-.346H6.667a.346.346 0 0 1-.346-.346v-.865c0-.191.155-.346.346-.346h3.976c.191 0 .346.155.346.346v1.988a2.333 2.333 0 0 1-2.333 2.333H3.457a.346.346 0 0 1-.346-.346V5.704a2.593 2.593 0 0 1 2.593-2.593h4.848z">
            </path>
        `
    };

    if (logo !== undefined && platformLogos[logo] === undefined) {
        platform = undefined;
    }

    return `
       <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
           <rect width="${labelWidth}" 
               height="20"
               fill="${decodeColor(labelColor)}">
           </rect>
       
           <rect x="${labelWidth}" 
               width="${descriptionWidth}" 
               height="20" 
               fill="${decodeColor(descriptionColor)}">
           </rect>
           
           ${hasPlatform ? platformLogos[platform] : ''}
         
           <text x="${hasPlatform ? PADDING * 2 + logoWidth + labelContentWidth / 2 : labelWidth / 2}" 
               y="${verticalCenter}" 
               font-family="${FONT_FAMILY}" 
               font-size="${FONT_SIZE}" 
               fill="white" 
               text-anchor="middle" 
               dominant-baseline="middle">
               ${label}
           </text>
        
           <text x="${labelWidth + descriptionWidth / 2}" 
               y="${verticalCenter}" 
               font-family="${FONT_FAMILY}" 
               font-size="${FONT_SIZE}" 
               fill="white" 
               text-anchor="middle" 
               dominant-baseline="middle">
               ${description}
           </text>
       </svg>
   `;
}

module.exports = drawSvg;