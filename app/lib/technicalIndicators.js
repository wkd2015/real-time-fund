/**
 * 技术指标计算模块
 * 纯 JavaScript 实现，无外部依赖
 */

/**
 * 计算简单移动平均 SMA
 * @param {number[]} data - 价格数组
 * @param {number} period - 周期
 * @returns {number|null} - 均线值
 */
export function SMA(data, period) {
  if (!data || data.length < period) return null;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/**
 * 计算指数移动平均 EMA
 * @param {number[]} data - 价格数组
 * @param {number} period - 周期
 * @returns {number|null} - EMA值
 */
export function EMA(data, period) {
  if (!data || data.length < period) return null;
  
  const k = 2 / (period + 1);
  let ema = SMA(data.slice(0, period), period);
  
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  
  return ema;
}

/**
 * 计算 RSI 相对强弱指数
 * @param {number[]} prices - 价格数组（收盘价）
 * @param {number} period - 周期，默认14
 * @returns {number|null} - RSI 值 (0-100)
 */
export function RSI(prices, period = 14) {
  if (!prices || prices.length < period + 1) return null;
  
  // 计算涨跌幅
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  // 取最近 period 个变化
  const recentChanges = changes.slice(-period);
  
  // 分离涨跌
  let gains = 0;
  let losses = 0;
  
  recentChanges.forEach(change => {
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  });
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

/**
 * 计算 MACD
 * @param {number[]} prices - 价格数组
 * @returns {object} - { dif, dea, hist, trend }
 */
export function MACD(prices) {
  if (!prices || prices.length < 35) {
    return { dif: null, dea: null, hist: null, trend: null };
  }
  
  const ema12 = EMA(prices, 12);
  const ema26 = EMA(prices, 26);
  
  if (ema12 === null || ema26 === null) {
    return { dif: null, dea: null, hist: null, trend: null };
  }
  
  const dif = ema12 - ema26;
  
  // 计算 DEA (DIF 的 9 日 EMA)
  // 需要计算历史 DIF 序列
  const difHistory = [];
  for (let i = 26; i <= prices.length; i++) {
    const e12 = EMA(prices.slice(0, i), 12);
    const e26 = EMA(prices.slice(0, i), 26);
    if (e12 !== null && e26 !== null) {
      difHistory.push(e12 - e26);
    }
  }
  
  const dea = difHistory.length >= 9 ? EMA(difHistory, 9) : null;
  const hist = (dif !== null && dea !== null) ? (dif - dea) * 2 : null;
  
  // 计算趋势（与前一天的柱状图比较）
  let trend = null;
  if (difHistory.length >= 10) {
    const prevDifHistory = difHistory.slice(0, -1);
    const prevDea = EMA(prevDifHistory, 9);
    const prevHist = prevDea !== null ? (difHistory[difHistory.length - 2] - prevDea) * 2 : null;
    
    if (hist !== null && prevHist !== null) {
      if (hist > prevHist) trend = 'improving';
      else if (hist < prevHist) trend = 'deteriorating';
      else trend = 'flat';
    }
  }
  
  return { dif, dea, hist, trend };
}

/**
 * 计算布林带 BOLL
 * @param {number[]} prices - 价格数组
 * @param {number} period - 周期，默认20
 * @param {number} multiplier - 标准差倍数，默认2
 * @returns {object} - { upper, mid, lower, position }
 */
export function BOLL(prices, period = 20, multiplier = 2) {
  if (!prices || prices.length < period) {
    return { upper: null, mid: null, lower: null, position: null };
  }
  
  const slice = prices.slice(-period);
  const mid = slice.reduce((a, b) => a + b, 0) / period;
  
  // 计算标准差
  const squaredDiffs = slice.map(p => Math.pow(p - mid, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
  const stdDev = Math.sqrt(variance);
  
  const upper = mid + multiplier * stdDev;
  const lower = mid - multiplier * stdDev;
  
  // 判断当前价格位置
  const currentPrice = prices[prices.length - 1];
  let position = 'mid';
  if (currentPrice >= upper) position = 'upper';
  else if (currentPrice <= lower) position = 'lower';
  else if (currentPrice > mid) position = 'upper_mid';
  else if (currentPrice < mid) position = 'lower_mid';
  
  return { upper, mid, lower, position };
}

/**
 * 计算乖离率 BIAS
 * @param {number} price - 当前价格
 * @param {number} ma - 移动平均值
 * @returns {number|null} - 乖离率百分比
 */
export function BIAS(price, ma) {
  if (ma === null || ma === 0) return null;
  return ((price - ma) / ma) * 100;
}

/**
 * 判断均线位置和斜率
 * @param {number} currentPrice - 当前价格
 * @param {number[]} maHistory - 均线历史值（至少3天）
 * @returns {object} - { position, slope }
 */
export function analyzeMA(currentPrice, maHistory) {
  if (!maHistory || maHistory.length < 3) {
    return { position: null, slope: null };
  }
  
  const currentMA = maHistory[maHistory.length - 1];
  const position = currentPrice > currentMA ? 'above' : 'below';
  
  // 计算斜率（过去3天）
  const recent = maHistory.slice(-3);
  const avgChange = (recent[2] - recent[0]) / 2;
  
  let slope = 'flat';
  const threshold = currentMA * 0.001; // 0.1% 阈值
  if (avgChange > threshold) slope = 'up';
  else if (avgChange < -threshold) slope = 'down';
  
  return { position, slope, value: currentMA };
}

/**
 * 检测金叉/死叉
 * @param {number[]} ma5History - MA5 历史
 * @param {number[]} ma10History - MA10 历史
 * @param {number} days - 检查天数，默认5
 * @returns {string} - 'golden' | 'dead' | 'none'
 */
export function detectCross(ma5History, ma10History, days = 5) {
  if (!ma5History || !ma10History || 
      ma5History.length < days || ma10History.length < days) {
    return 'none';
  }
  
  const len = Math.min(ma5History.length, ma10History.length, days);
  
  for (let i = 1; i < len; i++) {
    const prevDiff = ma5History[ma5History.length - i - 1] - ma10History[ma10History.length - i - 1];
    const currDiff = ma5History[ma5History.length - i] - ma10History[ma10History.length - i];
    
    // 金叉：MA5 从下向上穿过 MA10
    if (prevDiff < 0 && currDiff > 0) {
      return 'golden';
    }
    // 死叉：MA5 从上向下穿过 MA10
    if (prevDiff > 0 && currDiff < 0) {
      return 'dead';
    }
  }
  
  return 'none';
}

/**
 * 计算区间百分位
 * @param {number} price - 当前价格
 * @param {number[]} prices - 历史价格数组
 * @returns {number} - 0-100 百分位
 */
export function percentile(price, prices) {
  if (!prices || prices.length === 0) return null;
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  if (max === min) return 50;
  
  return ((price - min) / (max - min)) * 100;
}

/**
 * 一次性计算所有技术指标
 * @param {object[]} historyData - 历史数据 [{ date, price }]
 * @param {number} currentPrice - 当前价格（实时估值）
 * @returns {object} - 所有技术指标
 */
export function calculateAllIndicators(historyData, currentPrice) {
  if (!historyData || historyData.length === 0) {
    return null;
  }
  
  // 提取价格数组，加上当前价格
  const prices = historyData.map(d => d.price);
  const allPrices = [...prices, currentPrice];
  
  // 计算各周期均线
  const ma5 = SMA(allPrices, 5);
  const ma10 = SMA(allPrices, 10);
  const ma20 = SMA(allPrices, 20);
  const ma60 = SMA(allPrices, 60);
  
  // 计算均线历史（用于斜率和交叉检测）
  const ma5History = [];
  const ma10History = [];
  for (let i = Math.max(10, allPrices.length - 5); i <= allPrices.length; i++) {
    ma5History.push(SMA(allPrices.slice(0, i), 5));
    ma10History.push(SMA(allPrices.slice(0, i), 10));
  }
  
  // 均线分析
  const ma5Analysis = analyzeMA(currentPrice, ma5History);
  const ma10Analysis = analyzeMA(currentPrice, ma10History);
  
  // 金叉/死叉检测
  const cross = detectCross(ma5History, ma10History, 5);
  
  // RSI
  const rsi = RSI(allPrices, 14);
  
  // MACD
  const macd = MACD(allPrices);
  
  // 布林带
  const boll = BOLL(allPrices, 20, 2);
  
  // 乖离率
  const bias20 = BIAS(currentPrice, ma20);
  const bias60 = BIAS(currentPrice, ma60);
  
  // 20日高低点百分位
  const recent20 = allPrices.slice(-20);
  const pricePercentile = percentile(currentPrice, recent20);
  
  return {
    ma: {
      ma5: ma5 ? parseFloat(ma5.toFixed(4)) : null,
      ma10: ma10 ? parseFloat(ma10.toFixed(4)) : null,
      ma20: ma20 ? parseFloat(ma20.toFixed(4)) : null,
      ma60: ma60 ? parseFloat(ma60.toFixed(4)) : null
    },
    maAnalysis: {
      ma5: ma5Analysis,
      ma10: ma10Analysis,
      ma60: ma60 ? { position: currentPrice > ma60 ? 'above' : 'below', value: parseFloat(ma60.toFixed(4)) } : null
    },
    cross,
    rsi: rsi ? parseFloat(rsi.toFixed(2)) : null,
    macd: {
      dif: macd.dif ? parseFloat(macd.dif.toFixed(4)) : null,
      dea: macd.dea ? parseFloat(macd.dea.toFixed(4)) : null,
      hist: macd.hist ? parseFloat(macd.hist.toFixed(4)) : null,
      trend: macd.trend
    },
    boll: {
      upper: boll.upper ? parseFloat(boll.upper.toFixed(4)) : null,
      mid: boll.mid ? parseFloat(boll.mid.toFixed(4)) : null,
      lower: boll.lower ? parseFloat(boll.lower.toFixed(4)) : null,
      position: boll.position
    },
    bias: {
      bias20: bias20 ? parseFloat(bias20.toFixed(2)) : null,
      bias60: bias60 ? parseFloat(bias60.toFixed(2)) : null
    },
    pricePercentile: pricePercentile ? parseFloat(pricePercentile.toFixed(2)) : null
  };
}
