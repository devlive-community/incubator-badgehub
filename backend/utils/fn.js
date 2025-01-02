const getFnName = (fn) => {
    try {
        if (typeof fn !== 'function') {
            return '非函数';
        }

        if (fn.name) {
            return fn.name;
        }

        if (fn.displayName) {
            return fn.displayName;
        }

        const fnStr = Function.prototype.toString.call(fn);
        // 修改正则表达式，排除 async 关键字
        const match = fnStr.match(/^async\s+function\s*([^\s(]+)|^function\s*([^\s(]+)|^(?:async\s+)?([^\s(]+)/);

        // 返回第一个匹配的组
        return match?.[1] || match?.[2] || match?.[3] || '匿名函数';
    }
    catch (err) {
        return '未知函数';
    }
};

module.exports = getFnName;