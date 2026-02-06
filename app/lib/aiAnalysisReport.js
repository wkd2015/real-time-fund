/**
 * AI 分析报告生成模块
 * 为 Gemini Pro 生成结构化的分析数据
 */

import { calculateAllIndicators } from './technicalIndicators';
import { getMarketEnvironment, inferBenchmarkIndex } from './marketData';

/**
 * 通过 API Route 批量获取基金历史数据
 * @param {string[]} fundCodes - 基金代码数组
 * @param {number} days - 获取天数
 * @returns {object} - { [code]: historyData[] }
 */
async function fetchFundsHistoryViaAPI(fundCodes, days = 90) {
  try {
    const res = await fetch(`/api/market-data?type=funds-history&codes=${fundCodes.join(',')}&days=${days}`);
    if (!res.ok) {
      console.error('批量获取历史数据失败', res.status);
      return {};
    }
    return await res.json();
  } catch (e) {
    console.error('批量获取历史数据异常', e);
    return {};
  }
}

/**
 * 计算持仓天数
 * @param {object[]} operations - 操作记录
 * @returns {number|null} - 持仓天数
 */
function calculateDaysHeld(operations) {
  if (!operations || operations.length === 0) return null;
  
  // 找到最早的买入记录
  const buyOps = operations.filter(op => 
    op.type === 'buy' || op.type === 'dividend_reinvest' || op.type === 'convert_in'
  );
  
  if (buyOps.length === 0) return null;
  
  // 按日期排序找最早
  buyOps.sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstBuyDate = new Date(buyOps[0].date);
  const today = new Date();
  
  return Math.floor((today - firstBuyDate) / (1000 * 60 * 60 * 24));
}

/**
 * 计算收益率
 * @param {number} currentValue - 当前市值
 * @param {number} totalInvested - 总投入
 * @returns {number|null} - 收益率百分比
 */
function calculateProfitRate(currentValue, totalInvested) {
  if (!totalInvested || totalInvested === 0) return null;
  return ((currentValue - totalInvested) / totalInvested) * 100;
}

/**
 * 获取单个基金的完整分析数据
 * @param {object} fund - 基金数据
 * @param {object} holding - 持仓数据
 * @param {object[]} operations - 操作记录
 * @param {object[]} historyData - 历史净值数据（由外部传入）
 * @returns {object} - 基金分析数据
 */
function getFundAnalysis(fund, holding, operations, historyData = []) {
  const { code, name, gsz, dwjz } = fund;
  
  // 当前估值/净值
  const currentPrice = parseFloat(gsz) || parseFloat(dwjz) || 0;
  
  // 计算技术指标
  const indicators = historyData.length > 0 
    ? calculateAllIndicators(historyData, currentPrice)
    : null;
  
  // 持仓相关
  const shares = holding?.shares || 0;
  const costPrice = holding?.costPrice || 0;
  const currentValue = shares * currentPrice;
  const totalInvested = shares * costPrice;
  const daysHeld = calculateDaysHeld(operations);
  const profitRate = calculateProfitRate(currentValue, totalInvested);
  
  // 推断基准指数
  const benchmarkIndex = inferBenchmarkIndex(name, code);
  
  return {
    basic: {
      code,
      name,
      currentPrice: parseFloat(currentPrice.toFixed(4)),
      shares: parseFloat(shares.toFixed(2)),
      costPrice: costPrice ? parseFloat(costPrice.toFixed(4)) : null,
      currentValue: parseFloat(currentValue.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      profitRate: profitRate ? parseFloat(profitRate.toFixed(2)) : null,
      daysHeld,
      benchmarkIndex
    },
    indicators,
    dataQuality: {
      historyDays: historyData.length,
      hasIndicators: indicators !== null
    }
  };
}

/**
 * 生成完整的 AI 分析报告
 * @param {object[]} funds - 基金列表
 * @param {object} holdings - 持仓数据 { code: { shares, costPrice } }
 * @param {object} operationsMap - 操作记录 { code: [...operations] }
 * @param {object} options - 选项
 * @returns {object} - 完整报告数据
 */
export async function generateAIReport(funds, holdings = {}, operationsMap = {}, options = {}) {
  const {
    includeMarket = true,
    onlyWithHoldings = true
  } = options;
  
  // 过滤要分析的基金
  let targetFunds = funds;
  if (onlyWithHoldings) {
    targetFunds = funds.filter(f => {
      const holding = holdings[f.code];
      return holding && holding.shares > 0;
    });
  }
  
  if (targetFunds.length === 0) {
    return {
      success: false,
      error: '没有找到持仓基金',
      timestamp: new Date().toISOString()
    };
  }
  
  // 并行获取市场环境数据和基金历史数据
  const fundCodes = targetFunds.map(f => f.code);
  
  const [marketEnv, historyDataMap] = await Promise.all([
    includeMarket ? getMarketEnvironment().catch(e => {
      console.error('获取市场环境失败', e);
      return null;
    }) : Promise.resolve(null),
    fetchFundsHistoryViaAPI(fundCodes, 90)
  ]);
  
  // 同步处理各基金分析数据（历史数据已预先获取）
  const fundsAnalysis = targetFunds.map(fund => {
    const historyData = historyDataMap[fund.code] || [];
    return getFundAnalysis(
      fund, 
      holdings[fund.code], 
      operationsMap[fund.code] || [],
      historyData
    );
  });
  
  // 汇总统计
  const summary = {
    totalFunds: fundsAnalysis.length,
    totalValue: 0,
    totalInvested: 0,
    totalProfit: 0,
    avgProfitRate: 0,
    bullishCount: 0,
    bearishCount: 0,
    neutralCount: 0
  };
  
  fundsAnalysis.forEach(fa => {
    summary.totalValue += fa.basic.currentValue || 0;
    summary.totalInvested += fa.basic.totalInvested || 0;
    
    // 根据技术指标判断多空
    if (fa.indicators) {
      const { rsi, maAnalysis, boll } = fa.indicators;
      const ma5Above = maAnalysis?.ma5?.position === 'above';
      const ma10Above = maAnalysis?.ma10?.position === 'above';
      
      if (rsi && rsi > 60 && ma5Above && ma10Above) {
        summary.bullishCount++;
      } else if (rsi && rsi < 40 && !ma5Above && !ma10Above) {
        summary.bearishCount++;
      } else {
        summary.neutralCount++;
      }
    }
  });
  
  summary.totalProfit = summary.totalValue - summary.totalInvested;
  summary.avgProfitRate = summary.totalInvested > 0 
    ? parseFloat(((summary.totalProfit / summary.totalInvested) * 100).toFixed(2))
    : 0;
  
  summary.totalValue = parseFloat(summary.totalValue.toFixed(2));
  summary.totalInvested = parseFloat(summary.totalInvested.toFixed(2));
  summary.totalProfit = parseFloat(summary.totalProfit.toFixed(2));
  
  return {
    success: true,
    timestamp: new Date().toISOString(),
    market: marketEnv,
    summary,
    funds: fundsAnalysis
  };
}

/**
 * 导出为 AI 可读的 JSON 格式
 * @param {object} report - 报告数据
 * @returns {string} - JSON 字符串
 */
export function exportReportAsJSON(report) {
  return JSON.stringify(report, null, 2);
}

/**
 * 导出为紧凑 JSON（适合直接粘贴给 AI）
 * @param {object} report - 报告数据
 * @returns {string} - 紧凑 JSON 字符串
 */
export function exportReportCompact(report) {
  return JSON.stringify(report);
}

/**
 * 生成 AI 提示词模板
 * @param {object} report - 报告数据
 * @returns {string} - 提示词
 */
export function generateAIPrompt(report) {
  if (!report.success) {
    return `分析失败：${report.error}`;
  }
  
  const prompt = `请分析以下基金持仓数据，给出买入/卖出/持有建议：

## 数据说明
- timestamp: 数据生成时间
- market: 市场环境（情绪、指数量能）
- summary: 持仓汇总
- funds: 各基金详细技术指标

## 技术指标说明
- ma: 均线值（5/10/20/60日）
- maAnalysis: 均线位置和斜率
- cross: 金叉(golden)/死叉(dead)/无(none)
- rsi: RSI(14)，>70超买，<30超卖
- macd: MACD指标及趋势
- boll: 布林带位置
- bias: 乖离率
- pricePercentile: 20日高低点百分位

## 分析数据
\`\`\`json
${exportReportCompact(report)}
\`\`\`

请基于以上数据，对每个基金给出：
1. 当前技术形态判断
2. 买入/卖出/持有建议
3. 建议操作价位（如有）
4. 风险提示`;

  return prompt;
}
