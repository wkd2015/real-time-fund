/**
 * 历史净值 API 模块
 * 完全独立，不依赖现有代码
 */

/**
 * 获取基金历史净值
 * @param {string} fundCode - 基金代码
 * @param {number} days - 获取天数，默认 90 天
 * @returns {Promise<Array>} 历史净值数组
 */
export const getFundHistory = async (fundCode, days = 90) => {
  return new Promise((resolve) => {
    const callbackName = `fundHistory_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const script = document.createElement('script');
    
    // 计算每页数量（天天基金最大支持 49 条/页）
    const perPage = Math.min(days, 49);
    const pages = Math.ceil(days / perPage);
    
    window[callbackName] = (data) => {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      
      try {
        // 解析 HTML 表格数据
        const history = parseHistoryHtml(data.content);
        resolve(history);
      } catch (e) {
        console.error('解析历史净值失败', e);
        resolve([]);
      }
    };
    
    // 使用天天基金的历史净值接口
    script.src = `https://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=${fundCode}&page=1&per=${perPage}&callback=${callbackName}`;
    
    script.onerror = () => {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      resolve([]);
    };
    
    document.body.appendChild(script);
    
    // 超时处理
    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (document.body.contains(script)) document.body.removeChild(script);
        resolve([]);
      }
    }, 10000);
  });
};

/**
 * 解析天天基金返回的 HTML 表格
 */
const parseHistoryHtml = (html) => {
  const results = [];
  
  // 匹配表格行
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  
  let rowMatch;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells = [];
    
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      // 清理 HTML 标签和空白
      const value = cellMatch[1].replace(/<[^>]+>/g, '').trim();
      cells.push(value);
    }
    
    // 表格格式: 日期, 单位净值, 累计净值, 日增长率, 申购状态, 赎回状态, 分红
    if (cells.length >= 4 && /^\d{4}-\d{2}-\d{2}$/.test(cells[0])) {
      results.push({
        date: cells[0],
        price: parseFloat(cells[1]) || 0,
        accPrice: parseFloat(cells[2]) || 0,
        changeRate: parseFloat(cells[3]?.replace('%', '')) || 0
      });
    }
  }
  
  return results;
};

/**
 * 获取指数历史数据（上证、沪深300等）
 * @param {string} indexCode - 指数代码
 * @param {number} days - 获取天数
 */
export const getIndexHistory = async (indexCode, days = 90) => {
  // 使用腾讯财经的接口
  return new Promise((resolve) => {
    const script = document.createElement('script');
    const callbackName = `indexHistory_${Date.now()}`;
    
    window[callbackName] = (data) => {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      
      try {
        const history = parseIndexData(data);
        resolve(history);
      } catch (e) {
        console.error('解析指数数据失败', e);
        resolve([]);
      }
    };
    
    // 腾讯财经日K线接口
    script.src = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${indexCode},day,,,${days}&_var=${callbackName}`;
    
    script.onerror = () => {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      resolve([]);
    };
    
    document.body.appendChild(script);
    
    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (document.body.contains(script)) document.body.removeChild(script);
        resolve([]);
      }
    }, 10000);
  });
};

/**
 * 解析腾讯指数数据
 */
const parseIndexData = (data) => {
  const results = [];
  
  if (!data || !data.data) return results;
  
  const code = Object.keys(data.data)[0];
  const klines = data.data[code]?.day || data.data[code]?.qfqday || [];
  
  klines.forEach(item => {
    // 格式: [日期, 开盘, 收盘, 最高, 最低, 成交量]
    if (Array.isArray(item) && item.length >= 3) {
      results.push({
        date: item[0],
        open: parseFloat(item[1]) || 0,
        close: parseFloat(item[2]) || 0,
        high: parseFloat(item[3]) || 0,
        low: parseFloat(item[4]) || 0
      });
    }
  });
  
  return results;
};

/**
 * 常用指数代码
 */
export const INDEX_CODES = {
  SH: 'sh000001',    // 上证指数
  SZ: 'sz399001',    // 深证成指
  HS300: 'sh000300', // 沪深300
  CYB: 'sz399006',   // 创业板指
  KC50: 'sh000688'   // 科创50
};

/**
 * 获取多个基金的历史净值
 */
export const getBatchFundHistory = async (fundCodes, days = 90) => {
  const results = {};
  
  for (const code of fundCodes) {
    results[code] = await getFundHistory(code, days);
    // 间隔 200ms 避免请求过快
    await new Promise(r => setTimeout(r, 200));
  }
  
  return results;
};
