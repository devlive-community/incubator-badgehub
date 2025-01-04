const {createCanvas} = require('canvas');

/**
 * 处理日期格式
 * @param {Date} date 日期对象
 * @returns {string} 格式化的日期字符串
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

/**
 * 计算合适的刻度间隔
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 合适的刻度间隔
 */
function calculateTickInterval(min, max) {
    const range = max - min;
    const pow10 = Math.floor(Math.log10(range));
    const step = Math.pow(10, pow10);

    if (range / step < 3) {
        return step / 2;
    }
    if (range / step < 5) {
        return step;
    }
    return step * 2;
}

/**
 * 绘制GitHub Star历史图表
 * @param {Object} params 参数对象
 * @param {Array} params.data Star历史数据 [{date: string, stars: number}]
 * @param {number} params.width 图表宽度
 * @param {number} params.height 图表高度
 * @param {string} params.title 图表标题
 * @param {Object} params.style 样式配置
 * @returns {string} SVG字符串
 */
function drawStarsHistoryChart(params) {
    const {
        data,
        width = 800,
        height = 400,
        title = 'GitHub Stars History',
        style = {}
    } = params;
    if (!data || data.length === 0) {
        return '';
    }

    // 样式配置
    const theme = {
        background: style.background || '#ffffff',
        text: style.text || '#24292e',
        grid: style.grid || '#e1e4e8',
        line: style.line || '#2188ff',
        gradient: style.gradient || ['rgba(33, 136, 255, 0.2)', 'rgba(33, 136, 255, 0)']
    };

    // 图表边距
    const margin = {
        top: 40,
        right: 30,
        bottom: 40,
        left: 60
    };

    // 计算实际绘图区域
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 数据处理
    const dates = data.map(d => new Date(d.date));
    const stars = data.map(d => d.total);

    // 计算数据范围
    const xMin = Math.min(...dates);
    const xMax = Math.max(...dates);
    const yMin = 0;
    const yMax = Math.max(...stars) * 1.1; // 留出10%空间

    // 计算刻度
    const yTickInterval = calculateTickInterval(yMin, yMax);
    const yTicks = [];
    for (let i = 0; i <= Math.ceil(yMax / yTickInterval); i++) {
        yTicks.push(i * yTickInterval);
    }

    // 坐标转换函数
    const xScale = (date) => {
        return margin.left + (date - xMin) / (xMax - xMin) * chartWidth;
    };

    const yScale = (value) => {
        return height - margin.bottom - (value - yMin) / (yMax - yMin) * chartHeight;
    };

    // 生成折线路径
    const linePath = data.map((point, i) => {
        const x = xScale(new Date(point.date));
        const y = yScale(point.total);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    // 生成渐变区域路径
    const areaPath = `
        ${linePath}
        L ${xScale(new Date(data[data.length - 1].date))},${height - margin.bottom}
        L ${xScale(new Date(data[0].date))},${height - margin.bottom}
        Z
    `;

    // 生成SVG
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="${theme.gradient[0]}"/>
                    <stop offset="100%" stop-color="${theme.gradient[1]}"/>
                </linearGradient>
            </defs>

            <!-- 背景 -->
            <rect width="${width}" height="${height}" fill="${theme.background}"/>

            <!-- 标题 -->
            <text x="${width / 2}" y="${margin.top / 2}" 
                text-anchor="middle" font-size="16" fill="${theme.text}"
                font-family="system-ui, -apple-system, Arial, sans-serif">
                ${title}
            </text>

            <!-- Y轴网格线和刻度 -->
            ${yTicks.map(tick => `
                <line x1="${margin.left}" y1="${yScale(tick)}"
                    x2="${width - margin.right}" y2="${yScale(tick)}"
                    stroke="${theme.grid}" stroke-width="1" stroke-dasharray="4,4"/>
                <text x="${margin.left - 10}" y="${yScale(tick)}"
                    text-anchor="end" dominant-baseline="middle"
                    font-size="12" fill="${theme.text}">
                    ${tick.toLocaleString()}
                </text>
            `).join('')}

            <!-- X轴刻度 -->
            ${dates.filter((_, i) => i % Math.ceil(dates.length / 6) === 0).map(date => `
                <text x="${xScale(date)}" y="${height - margin.bottom + 20}"
                    text-anchor="middle" font-size="12" fill="${theme.text}">
                    ${formatDate(date)}
                </text>
            `).join('')}

            <!-- 数据区域 -->
            <path d="${areaPath}" fill="url(#areaGradient)"/>
            
            <!-- 折线 -->
            <path d="${linePath}" fill="none" 
                stroke="${theme.line}" stroke-width="2"/>

            <!-- 数据点 -->
            ${data.map(point => `
                <circle cx="${xScale(new Date(point.date))}" 
                    cy="${yScale(point.total)}"
                    r="4" fill="${theme.background}" 
                    stroke="${theme.line}" stroke-width="2"/>
            `).join('')}
        </svg>
    `;
}

module.exports = drawStarsHistoryChart;