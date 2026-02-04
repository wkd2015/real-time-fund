/**
 * AI 分析导出模块
 * 完全独立，不依赖现有代码
 */

import { getAllOperations, getOperationsByFund } from './operationStore';
import { getFundHistory, getIndexHistory, INDEX_CODES } from './historyApi';

/**
 * 计算持仓分析数据
 * @param {Array} operations - 操作记录
 * @param {Array} history - 历史净值
 * @param {Object} holding - 当前实际持仓 { shares, costPrice }
 */
const calculateAnalysis = (operations, history, holding = null) => {
  if (!history.length) {
    return null;
  }
  
  // 按时间排序
  const sortedOps = operations.length > 0 
    ? [...operations].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];
  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 优先使用实际持仓数据
  let totalShares = holding?.shares || 0;
  let costPrice = holding?.costPrice || 0;
  let totalInvested = totalShares * costPrice;
  
  // 如果没有实际持仓数据，才从操作记录计算
  if (!holding || totalShares <= 0) {
    totalInvested = 0;
    totalShares = 0;
    
    sortedOps.forEach(op => {
      if (op.type === 'buy' || op.type === 'convert_in') {
        totalInvested += op.amount || 0;
        totalShares += op.shares || 0;
      } else if (op.type === 'sell' || op.type === 'convert_out') {
        // 卖出时按比例减少成本（避免除以 0）
        if (totalShares > 0) {
          const ratio = Math.min((op.shares || 0) / totalShares, 1);
          totalInvested -= totalInvested * ratio;
        }
        totalShares -= op.shares || 0;
      }
    });
    
    // 确保不出现负值
    totalShares = Math.max(0, totalShares);
    totalInvested = Math.max(0, totalInvested);
  }
  
  // 获取当前价格（最新历史数据）
  const currentPrice = sortedHistory[sortedHistory.length - 1]?.price || 0;
  const currentValue = totalShares * currentPrice;
  
  // 计算最高点和最低点
  let maxPrice = 0;
  let maxDate = '';
  let minPrice = Infinity;
  let minDate = '';
  
  // 只看第一次买入之后的数据，或者全部数据
  const firstBuyDate = sortedOps.find(op => op.type === 'buy' || op.type === 'convert_in')?.date;
  const startDate = firstBuyDate || sortedHistory[0]?.date;
  
  sortedHistory.forEach(h => {
    if (startDate && h.date >= startDate) {
      if (h.price > maxPrice) {
        maxPrice = h.price;
        maxDate = h.date;
      }
      if (h.price < minPrice) {
        minPrice = h.price;
        minDate = h.date;
      }
    }
  });
  
  // 计算最大回撤
  const maxValue = totalShares * maxPrice;
  const drawdown = maxValue > 0 ? ((currentValue - maxValue) / maxValue * 100) : 0;
  
  // 计算如果最高点卖出的收益
  const missedProfit = maxValue - currentValue;
  
  // 计算收益
  const profit = currentValue - totalInvested;
  const profitRate = totalInvested > 0 ? (profit / totalInvested * 100) : 0;
  
  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalShares: Math.round(totalShares * 100) / 100,
    currentPrice,
    profit: Math.round(profit * 100) / 100,
    profitRate: Math.round(profitRate * 100) / 100,
    maxPrice,
    maxDate,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    minDate: minDate || '',
    drawdown: Math.round(drawdown * 100) / 100,
    missedProfit: Math.round(Math.max(0, missedProfit) * 100) / 100
  };
};

/**
 * 导出 AI 分析用的 JSON 数据
 * @param {Array} holdings - 当前持仓列表 [{ code, name, shares, costPrice }]
 */
export const exportForAI = async (holdings = [], options = {}) => {
  const { includeDays = 90, includeIndex = true } = options;
  
  // 获取所有操作记录
  const allOperations = await getAllOperations();
  
  // 按基金分组
  const fundCodes = [...new Set([
    ...allOperations.map(op => op.fundCode),
    ...holdings.map(h => h.code)
  ])].filter(Boolean);
  
  // 获取各基金的历史和分析
  const fundsData = [];
  
  for (const code of fundCodes) {
    const ops = allOperations.filter(op => op.fundCode === code);
    const history = await getFundHistory(code, includeDays);
    const holding = holdings.find(h => h.code === code);
    
    // 传入实际持仓数据
    const analysis = calculateAnalysis(ops, history, holding);
    
    fundsData.push({
      code,
      name: ops[0]?.fundName || holding?.name || code,
      operations: ops.map(op => ({
        date: op.date,
        type: op.type,
        amount: op.amount,
        shares: op.shares,
        price: op.price,
        note: op.note
      })),
      history: history.slice(-includeDays), // 最近 N 天
      currentHolding: holding ? {
        shares: holding.shares,
        costPrice: holding.costPrice
      } : null,
      analysis
    });
    
    // 间隔请求
    await new Promise(r => setTimeout(r, 200));
  }
  
  // 获取大盘指数（可选）
  let marketIndex = null;
  if (includeIndex) {
    marketIndex = {
      sh000001: await getIndexHistory(INDEX_CODES.SH, includeDays),
      hs300: await getIndexHistory(INDEX_CODES.HS300, includeDays)
    };
  }
  
  // 计算总体统计（只统计有持仓的基金）
  const fundsWithHoldings = fundsData.filter(f => f.analysis && f.analysis.totalShares > 0);
  const summary = {
    totalFunds: fundsWithHoldings.length,
    totalOperations: allOperations.length,
    totalInvested: fundsWithHoldings.reduce((sum, f) => sum + (f.analysis?.totalInvested || 0), 0),
    currentValue: fundsWithHoldings.reduce((sum, f) => sum + (f.analysis?.currentValue || 0), 0)
  };
  summary.totalProfit = summary.currentValue - summary.totalInvested;
  summary.totalProfitRate = summary.totalInvested > 0 
    ? Math.round(summary.totalProfit / summary.totalInvested * 100) / 100 
    : 0;
  
  return {
    version: 1,
    exportTime: new Date().toISOString(),
    exportDays: includeDays,
    summary,
    funds: fundsData,
    marketIndex
  };
};

/**
 * 导出为 Markdown 格式（方便直接粘贴给 AI）
 */
export const exportAsMarkdown = async (holdings = [], options = {}) => {
  const data = await exportForAI(holdings, options);
  
  let md = `# 基金持仓分析报告\n\n`;
  md += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  
  // 总体概况
  md += `## 总体概况\n\n`;
  md += `| 指标 | 数值 |\n|------|------|\n`;
  md += `| 持仓基金数 | ${data.summary.totalFunds} |\n`;
  md += `| 操作记录数 | ${data.summary.totalOperations} |\n`;
  md += `| 总投入 | ¥${data.summary.totalInvested.toFixed(2)} |\n`;
  md += `| 当前市值 | ¥${data.summary.currentValue.toFixed(2)} |\n`;
  md += `| 总收益 | ¥${data.summary.totalProfit.toFixed(2)} (${data.summary.totalProfitRate}%) |\n\n`;
  
  // 各基金详情
  md += `## 持仓明细\n\n`;
  
  for (const fund of data.funds) {
    md += `### ${fund.name} (${fund.code})\n\n`;
    
    // 只显示有持仓的基金的分析
    if (fund.analysis && fund.analysis.totalShares > 0) {
      md += `**持仓分析**\n`;
      md += `- 总投入: ¥${fund.analysis.totalInvested.toFixed(2)}\n`;
      md += `- 当前市值: ¥${fund.analysis.currentValue.toFixed(2)}\n`;
      md += `- 收益: ¥${fund.analysis.profit.toFixed(2)} (${fund.analysis.profitRate.toFixed(2)}%)\n`;
      md += `- 持有份额: ${fund.analysis.totalShares.toFixed(2)}\n`;
      md += `- 当前净值: ${fund.analysis.currentPrice.toFixed(4)}\n`;
      
      if (fund.analysis.maxDate) {
        md += `- 期间最高: ${fund.analysis.maxPrice.toFixed(4)} (${fund.analysis.maxDate})\n`;
        md += `- 从最高回撤: ${fund.analysis.drawdown.toFixed(2)}%\n`;
        if (fund.analysis.missedProfit > 0) {
          md += `- 错过的止盈收益: ¥${fund.analysis.missedProfit.toFixed(2)}\n`;
        }
      }
      md += `\n`;
    }
    
    if (fund.operations.length > 0) {
      md += `**操作记录**\n\n`;
      md += `| 日期 | 类型 | 金额 | 份额 | 净值 | 备注 |\n`;
      md += `|------|------|------|------|------|------|\n`;
      
      fund.operations.forEach(op => {
        const typeLabels = { buy: '买入', sell: '卖出', convert_in: '转入', convert_out: '转出' };
        const typeLabel = typeLabels[op.type] || op.type;
        const amount = op.amount > 0 ? `¥${op.amount.toFixed(2)}` : '-';
        const shares = op.shares > 0 ? op.shares.toFixed(2) : '-';
        const price = op.price > 0 ? op.price.toFixed(4) : '-';
        md += `| ${op.date} | ${typeLabel} | ${amount} | ${shares} | ${price} | ${op.note || ''} |\n`;
      });
      md += `\n`;
    }
    
    // 简化的历史走势（只显示关键点）
    if (fund.history.length > 0) {
      const h = fund.history;
      const startPrice = h[0].price;
      const endPrice = h[h.length - 1].price;
      const change = startPrice > 0 ? ((endPrice - startPrice) / startPrice * 100).toFixed(2) : 0;
      
      md += `**近期走势** (${h.length}天)\n`;
      md += `- 起点: ${h[0].date} 净值 ${startPrice.toFixed(4)}\n`;
      md += `- 终点: ${h[h.length - 1].date} 净值 ${endPrice.toFixed(4)}\n`;
      md += `- 区间涨幅: ${change}%\n\n`;
    }
  }
  
  // AI 分析提示
  md += `## 请帮我分析\n\n`;
  md += `1. 我的操作时机是否合理？有哪些可以改进的地方？\n`;
  md += `2. 是否有错过明显的止盈或加仓机会？\n`;
  md += `3. 当前持仓结构是否合理？风险如何？\n`;
  md += `4. 基于近期走势，有什么建议？\n`;
  
  return md;
};

/**
 * 下载导出文件
 */
export const downloadExport = async (holdings = [], format = 'json', options = {}) => {
  let content, filename, mimeType;
  
  if (format === 'markdown' || format === 'md') {
    content = await exportAsMarkdown(holdings, options);
    filename = `fund-analysis-${new Date().toISOString().slice(0, 10)}.md`;
    mimeType = 'text/markdown';
  } else {
    const data = await exportForAI(holdings, options);
    content = JSON.stringify(data, null, 2);
    filename = `fund-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    mimeType = 'application/json';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return filename;
};
