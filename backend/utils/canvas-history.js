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
    // 处理范围为0的情况
    if (range === 0) return 1;

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

    // 处理空数据的情况
    if (!data || !Array.isArray(data) || data.length === 0) {
        return createEmptyChart(width, height, title, style);
    }

    // 处理数据格式，确保数据中有合适的结构
    const processedData = data.filter(item =>
        item && item.date && (item.total !== undefined || item.stars !== undefined)
    );

    if (processedData.length === 0) {
        return createEmptyChart(width, height, title, style);
    }

    // 标准化数据格式，确保每个数据点都有total属性
    const normalizedData = processedData.map(item => ({
        date: item.date,
        total: item.total !== undefined ? item.total : (item.stars || 0)
    }));

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
    let dates = [];
    try {
        dates = normalizedData.map(d => new Date(d.date));
        // 验证日期是否有效
        if (dates.some(d => isNaN(d.getTime()))) {
            // 如果有无效日期，生成默认日期
            const now = new Date();
            dates = normalizedData.map((_, i) => {
                const date = new Date(now);
                date.setMonth(now.getMonth() - (normalizedData.length - i - 1));
                return date;
            });
        }
    } catch (e) {
        // 处理日期解析错误
        const now = new Date();
        dates = normalizedData.map((_, i) => {
            const date = new Date(now);
            date.setMonth(now.getMonth() - (normalizedData.length - i - 1));
            return date;
        });
    }

    const stars = normalizedData.map(d => d.total);

    // 计算数据范围
    // 确保xMin和xMax是Date对象
    let xMin, xMax;
    if (dates.length > 0) {
        // 找出最小和最大日期
        const timestamps = dates.map(d => d.getTime());
        xMin = new Date(Math.min(...timestamps));
        xMax = new Date(Math.max(...timestamps));
    } else {
        // 如果没有日期，使用当前日期
        xMin = new Date();
        xMax = new Date();
        // 确保最小和最大不同，避免除以零错误
        xMax.setMonth(xMax.getMonth() + 1);
    }
    const yMin = 0;
    // 处理所有stars都是0的情况
    const maxStar = Math.max(...stars);
    const yMax = maxStar > 0 ? maxStar * 1.1 : 10; // 如果都是0，则最大值设为10

    // 计算刻度
    const yTickInterval = calculateTickInterval(yMin, yMax);
    const yTicks = [];
    for (let i = 0; i <= Math.ceil(yMax / yTickInterval); i++) {
        yTicks.push(i * yTickInterval);
    }

    // 坐标转换函数
    const xScale = (date) => {
        // 确保date是Date对象
        const dateObj = date instanceof Date ? date : new Date(date);

        // 处理日期范围相同的情况
        if (xMax.getTime() === xMin.getTime()) {
            return margin.left + chartWidth / 2; // 居中显示一个点
        }

        // 将日期转换为时间戳进行计算，避免直接相减
        const dateTime = dateObj.getTime();
        const xMinTime = xMin.getTime();
        const xMaxTime = xMax.getTime();

        return margin.left + (dateTime - xMinTime) / (xMaxTime - xMinTime) * chartWidth;
    };

    const yScale = (value) => {
        return height - margin.bottom - (value - yMin) / (yMax - yMin) * chartHeight;
    };

    // 生成折线路径
    let linePath = '';
    if (normalizedData.length > 0) {
        linePath = normalizedData.map((point, i) => {
            const x = xScale(dates[i]);
            const y = yScale(point.total);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    }

    // 生成渐变区域路径
    let areaPath = '';
    if (normalizedData.length > 0) {
        areaPath = `
            ${linePath}
            L ${xScale(dates[dates.length - 1])},${height - margin.bottom}
            L ${xScale(dates[0])},${height - margin.bottom}
            Z
        `;
    }

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
            ${dates.length > 0 ? dates.filter((_, i) => {
        const interval = Math.max(1, Math.ceil(dates.length / 6));
        return i % interval === 0;
    }).map(date => `
                <text x="${xScale(date)}" y="${height - margin.bottom + 20}"
                    text-anchor="middle" font-size="12" fill="${theme.text}">
                    ${formatDate(date)}
                </text>
            `).join('') : ''}

            ${areaPath ? `<!-- 数据区域 --><path d="${areaPath}" fill="url(#areaGradient)"/>` : ''}
            
            ${linePath ? `<!-- 折线 --><path d="${linePath}" fill="none" stroke="${theme.line}" stroke-width="2"/>` : ''}

            <!-- 数据点 -->
            ${normalizedData.length > 0 ? normalizedData.map((point, i) => `
                <circle cx="${xScale(dates[i])}" 
                    cy="${yScale(point.total)}"
                    r="4" fill="${theme.background}" 
                    stroke="${theme.line}" stroke-width="2"/>
            `).join('') : ''}
            
            ${normalizedData.length === 0 || (maxStar === 0 && normalizedData.length === 1) ?
        `<!-- 无数据图标和提示 -->
                <g transform="translate(${width / 2}, ${height / 2 - 25})">
                    <!-- 数据图标 - 简化折线图象征 -->
                    <rect x="-30" y="-20" width="60" height="40" rx="4" ry="4" 
                          fill="${theme.background}" stroke="${theme.grid}" stroke-width="1" stroke-dasharray="3,2"/>
                          
                    <polyline points="-25,-5 -15,5 -5,-10 5,0 15,-8 25,5" 
                              fill="none" stroke="${theme.line}" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
                              
                    <circle cx="-25" cy="-5" r="3" fill="${theme.background}" stroke="${theme.line}" stroke-width="1.5"/>
                    <circle cx="25" cy="5" r="3" fill="${theme.background}" stroke="${theme.line}" stroke-width="1.5"/>
                </g>
                
                <!-- 无数据文字提示 -->
                <text x="${width / 2}" y="${height / 2 + 35}" 
                      text-anchor="middle" font-size="15" fill="${theme.text}" font-weight="500"
                      font-family="system-ui, -apple-system, Arial, sans-serif">
                    暂无数据
                </text>
                <text x="${width / 2}" y="${height / 2 + 55}" 
                      text-anchor="middle" font-size="13" fill="${theme.text}" opacity="0.7"
                      font-family="system-ui, -apple-system, Arial, sans-serif">
                    当有新的 Star 数据时会自动更新
                </text>` : ''}
        </svg>
    `;
}

/**
 * 创建空数据图表
 * @param {number} width 图表宽度
 * @param {number} height 图表高度
 * @param {string} title 图表标题
 * @param {Object} style 样式配置
 * @returns {string} SVG字符串
 */
function createEmptyChart(width, height, title, style = {}) {
    const theme = {
        background: style.background || '#ffffff',
        text: style.text || '#24292e',
        grid: style.grid || '#e1e4e8',
        accent: style.line || '#2188ff',
        lightAccent: style.gradient ? style.gradient[0] : 'rgba(33, 136, 255, 0.2)'
    };

    const margin = {
        top: 40,
        right: 30,
        bottom: 40,
        left: 60
    };

    // 计算图表中心点
    const centerX = width / 2;
    const centerY = height / 2;

    // 创建Y轴刻度
    const yTickPositions = [0.2, 0.4, 0.6, 0.8];
    const yTicks = yTickPositions.map(pos => {
        const y = margin.top + (height - margin.top - margin.bottom) * pos;
        return `
            <line x1="${margin.left - 5}" y1="${y}" 
                  x2="${margin.left}" y2="${y}" 
                  stroke="${theme.grid}" stroke-width="1"/>
        `;
    }).join('');

    // 创建X轴刻度
    const xTickPositions = [0.2, 0.4, 0.6, 0.8];
    const xTicks = xTickPositions.map(pos => {
        const x = margin.left + (width - margin.left - margin.right) * pos;
        return `
            <line x1="${x}" y1="${height - margin.bottom}" 
                  x2="${x}" y2="${height - margin.bottom + 5}" 
                  stroke="${theme.grid}" stroke-width="1"/>
        `;
    }).join('');

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <defs>
                <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${theme.lightAccent}" stop-opacity="0.1"/>
                    <stop offset="100%" stop-color="${theme.background}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            
            <!-- 背景 -->
            <rect width="${width}" height="${height}" fill="${theme.background}"/>
            
            <!-- 图表区域背景 -->
            <rect x="${margin.left}" y="${margin.top}" 
                  width="${width - margin.left - margin.right}" 
                  height="${height - margin.top - margin.bottom}" 
                  fill="url(#bgGradient)" rx="2" ry="2"/>
            
            <!-- 标题 -->
            <text x="${width / 2}" y="${margin.top / 2}" 
                text-anchor="middle" font-size="16" font-weight="bold" fill="${theme.text}"
                font-family="system-ui, -apple-system, Arial, sans-serif">
                ${title}
            </text>
            
            <!-- Y轴 -->
            <line x1="${margin.left}" y1="${margin.top}" 
                x2="${margin.left}" y2="${height - margin.bottom}" 
                stroke="${theme.grid}" stroke-width="1.5"/>
            ${yTicks}
                
            <!-- X轴 -->
            <line x1="${margin.left}" y1="${height - margin.bottom}" 
                x2="${width - margin.right}" y2="${height - margin.bottom}" 
                stroke="${theme.grid}" stroke-width="1.5"/>
            ${xTicks}
            
            <!-- 无数据图标和提示 -->
            <g transform="translate(${centerX}, ${centerY - 25})">
                <!-- 数据图标 - 简化折线图象征 -->
                <rect x="-30" y="-20" width="60" height="40" rx="4" ry="4" 
                      fill="${theme.background}" stroke="${theme.grid}" stroke-width="1" stroke-dasharray="3,2"/>
                      
                <polyline points="-25,-5 -15,5 -5,-10 5,0 15,-8 25,5" 
                          fill="none" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
                          
                <circle cx="-25" cy="-5" r="3" fill="${theme.background}" stroke="${theme.accent}" stroke-width="1.5"/>
                <circle cx="25" cy="5" r="3" fill="${theme.background}" stroke="${theme.accent}" stroke-width="1.5"/>
            </g>
            
            <!-- 无数据文字提示 -->
            <text x="${centerX}" y="${centerY + 35}" 
                  text-anchor="middle" font-size="15" fill="${theme.text}" font-weight="500"
                  font-family="system-ui, -apple-system, Arial, sans-serif">
                暂无数据
            </text>
            <text x="${centerX}" y="${centerY + 55}" 
                  text-anchor="middle" font-size="13" fill="${theme.text}" opacity="0.7"
                  font-family="system-ui, -apple-system, Arial, sans-serif">
                当有新的 Star 数据时会自动更新
            </text>
        </svg>
    `;
}

module.exports = drawStarsHistoryChart;