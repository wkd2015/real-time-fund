/**
 * 市场数据获取模块
 * 通过 API Route 代理获取外部市场数据
 */

// 常用指数代码映射
const INDEX_MAP = {
  '沪深300': '000300.SH',
  '上证指数': '000001.SH',
  '创业板指': '399006.SZ',
  '中证500': '000905.SH',
  '科创50': '000688.SH'
};

/**
 * 获取A股涨跌家数统计
 * @returns {object|null} - { total, up, down, equal }
 */
export async function getMarketStats() {
  try {
    const res = await fetch('/api/market-data?type=market-stats');
    if (!res.ok) throw new Error('请求失败');
    return await res.json();
  } catch (e) {
    console.error('获取涨跌家数失败', e);
    return null;
  }
}

/**
 * 获取指数实时行情
 * @param {string} indexCode - 指数代码（如 '000300.SH'）
 * @returns {object|null} - 指数行情数据
 */
export async function getIndexQuote(indexCode) {
  try {
    const res = await fetch(`/api/market-data?type=index-quote&code=${encodeURIComponent(indexCode)}`);
    if (!res.ok) throw new Error('请求失败');
    return await res.json();
  } catch (e) {
    console.error('获取指数行情失败', e);
    return null;
  }
}

/**
 * 获取指数历史K线
 * @param {string} indexCode - 指数代码
 * @param {number} days - 天数，默认10
 * @returns {object[]} - K线数据数组
 */
export async function getIndexHistory(indexCode, days = 10) {
  try {
    const res = await fetch(`/api/market-data?type=index-history&code=${encodeURIComponent(indexCode)}&days=${days}`);
    if (!res.ok) throw new Error('请求失败');
    return await res.json();
  } catch (e) {
    console.error('获取指数历史失败', e);
    return [];
  }
}

/**
 * 计算市场情绪
 * @param {object} stats - 涨跌家数 { up, down, total }
 * @returns {object} - 市场情绪评估
 */
export function calculateSentiment(stats) {
  if (!stats || !stats.total) {
    return { level: 'unknown', score: null, description: '数据不可用' };
  }
  
  const { up, down, total } = stats;
  const ratio = up / total;
  
  let level, description;
  if (ratio >= 0.7) {
    level = 'very_bullish';
    description = '市场极度乐观，普涨行情';
  } else if (ratio >= 0.55) {
    level = 'bullish';
    description = '市场偏多，上涨家数占优';
  } else if (ratio >= 0.45) {
    level = 'neutral';
    description = '市场震荡，多空平衡';
  } else if (ratio >= 0.3) {
    level = 'bearish';
    description = '市场偏空，下跌家数占优';
  } else {
    level = 'very_bearish';
    description = '市场极度悲观，普跌行情';
  }
  
  return {
    level,
    score: parseFloat((ratio * 100).toFixed(2)),
    upCount: up,
    downCount: down,
    totalCount: total,
    description
  };
}

/**
 * 计算指数量能比
 * @param {object} quote - 当前行情
 * @param {object[]} history - 历史K线
 * @returns {object} - 量能分析
 */
export function calculateVolumeRatio(quote, history) {
  if (!quote || !history || history.length < 5) {
    return { ratio: null, level: 'unknown' };
  }
  
  // 取最近5日成交量
  const volumes = history.slice(-5).map(h => h.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  
  if (avgVolume === 0) {
    return { ratio: null, level: 'unknown' };
  }
  
  // 估算当日成交量（如果盘中，按时间比例放大）
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // 交易时间：9:30-11:30, 13:00-15:00，共4小时 = 240分钟
  let tradingMinutes = 0;
  if (hour >= 9 && hour < 12) {
    if (hour === 9 && minute < 30) tradingMinutes = 0;
    else if (hour === 9) tradingMinutes = minute - 30;
    else if (hour === 10) tradingMinutes = 30 + minute;
    else if (hour === 11) tradingMinutes = 90 + minute;
  } else if (hour >= 13 && hour < 15) {
    tradingMinutes = 120 + (hour - 13) * 60 + minute;
  } else if (hour >= 15) {
    tradingMinutes = 240;
  }
  
  // 放大当日成交量
  const currentVolume = tradingMinutes > 0 ? (quote.volume / tradingMinutes) * 240 : quote.volume;
  const ratio = currentVolume / avgVolume;
  
  let level;
  if (ratio >= 1.5) level = 'high';
  else if (ratio >= 1.0) level = 'normal';
  else if (ratio >= 0.7) level = 'low';
  else level = 'very_low';
  
  return {
    ratio: parseFloat(ratio.toFixed(2)),
    level,
    currentVolume: Math.round(currentVolume),
    avgVolume: Math.round(avgVolume)
  };
}

/**
 * 获取完整的市场环境数据
 * @param {string} benchmarkIndex - 基准指数，默认沪深300
 * @returns {object} - 市场环境数据
 */
export async function getMarketEnvironment(benchmarkIndex = '000300.SH') {
  // 并行获取数据
  const [stats, quote, history] = await Promise.all([
    getMarketStats(),
    getIndexQuote(benchmarkIndex),
    getIndexHistory(benchmarkIndex, 10)
  ]);
  
  const sentiment = calculateSentiment(stats);
  const volumeRatio = calculateVolumeRatio(quote, history);
  
  return {
    timestamp: new Date().toISOString(),
    sentiment,
    benchmark: {
      code: benchmarkIndex,
      name: quote?.name || '沪深300',
      price: quote?.price || null,
      changePct: quote?.changePct || null,
      volume: volumeRatio
    },
    raw: {
      marketStats: stats,
      indexQuote: quote
    }
  };
}

/**
 * 根据基金类型推断基准指数
 * @param {string} fundName - 基金名称
 * @param {string} fundCode - 基金代码
 * @returns {string} - 基准指数代码
 */
export function inferBenchmarkIndex(fundName, fundCode) {
  // 简单的名称匹配规则
  const nameUpper = (fundName || '').toUpperCase();
  
  if (nameUpper.includes('创业板') || nameUpper.includes('成长')) {
    return INDEX_MAP['创业板指'];
  }
  if (nameUpper.includes('科创') || nameUpper.includes('科技')) {
    return INDEX_MAP['科创50'];
  }
  if (nameUpper.includes('中证500') || nameUpper.includes('中小盘')) {
    return INDEX_MAP['中证500'];
  }
  if (nameUpper.includes('上证') || nameUpper.includes('大盘')) {
    return INDEX_MAP['上证指数'];
  }
  
  // 默认沪深300
  return INDEX_MAP['沪深300'];
}

export { INDEX_MAP };
