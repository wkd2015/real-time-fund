/**
 * AI 分析导出模块
 * 完全独立，不依赖现有代码
 */

import { getAllOperations, getOperationsByFund } from './operationStore';
import { getFundHistory, getIndexHistory, INDEX_CODES } from './historyApi';

/**
 * 计算持仓分析数据
 */
const calculateAnalysis = (operations, history) => {
  if (!operations.length || !history.length) {
    return null;
  }
  
  // 按时间排序
  const sortedOps = [...operations].sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 计算总投入和当前份额
  let totalInvested = 0;
  let totalShares = 0;
  
  sortedOps.forEach(op => {
    if (op.type === 'buy') {
      totalInvested += op.amount || 0;
      totalShares += op.shares || 0;
    } else if (op.type === 'sell') {
      // 卖出时按比例减少成本
      const ratio = (op.shares || 0) / totalShares;
      totalInvested -= totalInvested * ratio;
      totalShares -= op.shares || 0;
    }
  });
  
  // 获取当前价格（最新历史数据）
  const currentPrice = sortedHistory[sortedHistory.length - 1]?.price || 0;
  const currentValue = totalShares * currentPrice;
  
  // 计算最高点和最低点
  let maxPrice = 0;
  let maxDate = '';
  let minPrice = Infinity;
  let minDate = '';
  
  // 只看第一次买入之后的数据
  const firstBuyDate = sortedOps.find(op => op.type === 'buy')?.date;
  
  sortedHistory.forEach(h => {
    if (firstBuyDate && h.date >= firstBuyDate) {
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
  
  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalShares: Math.round(totalShares * 100) / 100,
    currentPrice,
    profit: Math.round((currentValue - totalInvested) * 100) / 100,
    profitRate: totalInvested > 0 ? Math.round((currentValue - totalInvested) / totalInvested * 10000) / 100 : 0,
    maxPrice,
    maxDate,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    minDate: minDate || '',
    drawdown: Math.round(drawdown * 100) / 100,
    missedProfit: Math.round(missedProfit * 100) / 100
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
    const analysis = calculateAnalysis(ops, history);
    
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
  
  // 计算总体统计
  const summary = {
    totalFunds: fundsData.length,
    totalOperations: allOperations.length,
    totalInvested: fundsData.reduce((sum, f) => sum + (f.analysis?.totalInvested || 0), 0),
    currentValue: fundsData.reduce((sum, f) => sum + (f.analysis?.currentValue || 0), 0)
  };
  summary.totalProfit = summary.currentValue - summary.totalInvested;
  summary.totalProfitRate = summary.totalInvested > 0 
    ? Math.round(summary.totalProfit / summary.totalInvested * 10000) / 100 
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
    
    if (fund.analysis) {
      md += `**持仓分析**\n`;
      md += `- 总投入: ¥${fund.analysis.totalInvested}\n`;
      md += `- 当前市值: ¥${fund.analysis.currentValue}\n`;
      md += `- 收益: ¥${fund.analysis.profit} (${fund.analysis.profitRate}%)\n`;
      md += `- 持有份额: ${fund.analysis.totalShares}\n`;
      md += `- 当前净值: ${fund.analysis.currentPrice}\n`;
      
      if (fund.analysis.maxDate) {
        md += `- 期间最高: ${fund.analysis.maxPrice} (${fund.analysis.maxDate})\n`;
        md += `- 从最高回撤: ${fund.analysis.drawdown}%\n`;
        if (fund.analysis.missedProfit > 0) {
          md += `- 错过的止盈收益: ¥${fund.analysis.missedProfit}\n`;
        }
      }
      md += `\n`;
    }
    
    if (fund.operations.length > 0) {
      md += `**操作记录**\n\n`;
      md += `| 日期 | 类型 | 金额 | 份额 | 净值 | 备注 |\n`;
      md += `|------|------|------|------|------|------|\n`;
      
      fund.operations.forEach(op => {
        const typeLabel = op.type === 'buy' ? '买入' : op.type === 'sell' ? '卖出' : op.type;
        md += `| ${op.date} | ${typeLabel} | ¥${op.amount || '-'} | ${op.shares || '-'} | ${op.price || '-'} | ${op.note || ''} |\n`;
      });
      md += `\n`;
    }
    
    // 简化的历史走势（只显示关键点）
    if (fund.history.length > 0) {
      const h = fund.history;
      md += `**近期走势** (${h.length}天)\n`;
      md += `- 起点: ${h[0].date} 净值 ${h[0].price}\n`;
      md += `- 终点: ${h[h.length-1].date} 净值 ${h[h.length-1].price}\n`;
      md += `- 区间涨幅: ${((h[h.length-1].price - h[0].price) / h[0].price * 100).toFixed(2)}%\n\n`;
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
