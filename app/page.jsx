'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import Announcement from "./components/Announcement";
import OperationManager from "./components/OperationManager";
import { getFundHistory, getFundIntraday } from './lib/historyApi';

function PlusIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6l1-2h6l1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15a7.97 7.97 0 0 0 .1-2l2-1.5-2-3.5-2.3.5a8.02 8.02 0 0 0-1.7-1l-.4-2.3h-4l-.4 2.3a8.02 8.02 0 0 0-1.7 1l-2.3-.5-2 3.5 2 1.5a7.97 7.97 0 0 0 .1 2l-2 1.5 2 3.5 2.3-.5a8.02 8.02 0 0 0 1.7 1l.4 2.3h4l.4-2.3a8.02 8.02 0 0 0 1.7-1l2.3.5 2-3.5-2-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 12.5-6.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5h3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-12.5 6.9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 19H5v-3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ChevronIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M3 7h18M6 12h12M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ filled, ...props }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 10h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="15" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
      <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stat({ label, value, delta, small }) {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : '';
  return (
    <div className={`stat ${small ? 'stat-small' : ''}`}>
      <span className="label">{label}</span>
      <span className={`value ${dir}`}>{value}</span>
    </div>
  );
}

// 持仓编辑弹窗
function EditHoldingModal({ fund, holding, onSave, onClose }) {
  const [shares, setShares] = useState(holding?.shares || '');
  const [costPrice, setCostPrice] = useState(holding?.costPrice || '');

  const handleSave = () => {
    const sharesNum = parseFloat(shares) || 0;
    const costPriceNum = parseFloat(costPrice) || 0;
    onSave({
      shares: sharesNum,
      costPrice: costPriceNum
    });
  };

  const handleClear = () => {
    onSave({ shares: 0, costPrice: 0 });
  };

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="编辑持仓"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal holding-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <EditIcon width="20" height="20" />
            <span>编辑持仓</span>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        <div className="holding-fund-info" style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{fund.name}</div>
          <div className="muted" style={{ fontSize: 13 }}>#{fund.code}</div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label htmlFor="shares" className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
            持有份额
          </label>
          <input
            id="shares"
            type="number"
            className="input"
            placeholder="请输入持有份额"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            min="0"
            step="0.01"
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label htmlFor="costPrice" className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
            成本价（可选）
          </label>
          <input
            id="costPrice"
            type="number"
            className="input"
            placeholder="请输入成本单价"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            min="0"
            step="0.0001"
            style={{ width: '100%' }}
          />
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            填写成本价后可计算持仓盈亏
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
          {(holding?.shares > 0) && (
            <button 
              className="button" 
              onClick={handleClear}
              style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', flex: 1 }}
            >
              清空持仓
            </button>
          )}
          <button className="button" onClick={handleSave} style={{ flex: holding?.shares > 0 ? 1 : 'none', width: holding?.shares > 0 ? 'auto' : '100%' }}>
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 资产汇总组件
function PortfolioSummary({ funds, holdings, onOpenChart }) {
  // 计算汇总数据
  const summary = funds.reduce((acc, f) => {
    const h = holdings[f.code];
    if (!h || h.shares <= 0) return acc;
    
    const gsz = parseFloat(f.gsz) || 0;
    const gszzl = typeof f.gszzl === 'number' ? f.gszzl : (parseFloat(f.gszzl) || 0);
    const marketValue = h.shares * gsz;
    const costValue = h.costPrice > 0 ? h.shares * h.costPrice : 0;
    const profit = costValue > 0 ? marketValue - costValue : 0;
    const yesterdayValue = gszzl !== 0 ? marketValue / (1 + gszzl / 100) : marketValue;
    const dayProfit = marketValue - yesterdayValue;
    
    return {
      totalMarketValue: acc.totalMarketValue + marketValue,
      totalCostValue: acc.totalCostValue + costValue,
      totalProfit: acc.totalProfit + profit,
      totalDayProfit: acc.totalDayProfit + dayProfit,
      holdingCount: acc.holdingCount + 1
    };
  }, { totalMarketValue: 0, totalCostValue: 0, totalProfit: 0, totalDayProfit: 0, holdingCount: 0 });

  const profitRate = summary.totalCostValue > 0 
    ? (summary.totalProfit / summary.totalCostValue * 100) 
    : 0;

  if (summary.holdingCount === 0) return null;

  return (
    <div className="col-12 glass card portfolio-summary">
      <div className="title" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <WalletIcon width="20" height="20" />
          <span>持仓汇总</span>
          <span className="muted">共 {summary.holdingCount} 只持仓基金</span>
        </div>
        <button 
          className="icon-button" 
          onClick={onOpenChart}
          title="查看走势"
          style={{ width: '32px', height: '32px' }}
        >
          <ChartIcon width="16" height="16" />
        </button>
      </div>
      
      <div className="summary-grid">
        <div className="summary-item main">
          <span className="label">总市值</span>
          <span className="value">{summary.totalMarketValue.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">今日盈亏</span>
          <span className={`value ${summary.totalDayProfit > 0 ? 'up' : summary.totalDayProfit < 0 ? 'down' : ''}`}>
            {summary.totalDayProfit > 0 ? '+' : ''}{summary.totalDayProfit.toFixed(2)}
          </span>
        </div>
        {summary.totalCostValue > 0 && (
          <>
            <div className="summary-item">
              <span className="label">持仓成本</span>
              <span className="value">{summary.totalCostValue.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="label">累计盈亏</span>
              <span className={`value ${summary.totalProfit > 0 ? 'up' : summary.totalProfit < 0 ? 'down' : ''}`}>
                {summary.totalProfit > 0 ? '+' : ''}{summary.totalProfit.toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">收益率</span>
              <span className={`value ${profitRate > 0 ? 'up' : profitRate < 0 ? 'down' : ''}`}>
                {profitRate > 0 ? '+' : ''}{profitRate.toFixed(2)}%
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 基金名称搜索函数 - 返回多个候选结果
const searchFundByName = (name, maxResults = 5) => {
  return new Promise((resolve) => {
    const callbackName = `fundSearch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const script = document.createElement('script');
    // 清理名称：移除常见后缀以提高搜索命中率
    const cleanName = name.replace(/[股票混合债券LOF]$/g, '').replace(/联接[CA]?$/g, '').replace(/ETF$/g, '').trim();
    
    window[callbackName] = (data) => {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      
      if (data && data.Datas && data.Datas.length > 0) {
        // 返回前 maxResults 个匹配结果
        const candidates = data.Datas.slice(0, maxResults).map(fund => ({
          code: fund.CODE,
          name: fund.NAME,
          type: fund.FundBaseInfo?.FTYPE || ''
        }));
        resolve(candidates);
      } else {
        resolve([]);
      }
    };
    
    script.src = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?callback=${callbackName}&m=1&key=${encodeURIComponent(cleanName)}&_=${Date.now()}`;
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
    }, 5000);
  });
};

// 解析蚂蚁财富截图文本
const parseAntFortunText = (text) => {
  const results = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  // OCR 识别的蚂蚁财富格式：
  // 基金名称（带空格）+ 金额 + 收益 在同一行
  // 例如：国泰 半导体 设备 ETF 联 133,148.21 -0,606.55
  // 注意：基金名称后缀可能在下一行，如 "主题 ETF 联接 C"
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 匹配包含金额的行：允许金额前有任意非数字字符（引号、特殊符号等）
    // 格式：基金名称 [任意非数字字符]金额 收益
    const amountPattern = /^(.+?)\s+\D?([\d,]+\.\d{2})\s+([+-]?[\d,]+\.\d{2})$/;
    const match = line.match(amountPattern);
    
    if (match) {
      let name = match[1];
      const amount = parseFloat(match[2].replace(/,/g, '')) || 0;
      const profit = parseFloat(match[3].replace(/,/g, '')) || 0;
      
      // 金额太小的跳过（可能是误识别）
      if (amount < 100) continue;
      
      // 清理基金名称：移除空格
      name = name.replace(/\s+/g, '');
      
      // 移除可能的干扰字符（各种引号、括号等）
      name = name.replace(/^[《\[【"'""''「」]/, '').replace(/[》\]】"'""''」』]$/, '');
      
      // 基金名称关键词检查（更宽松）
      const fundKeywords = /[基金股票混合债券指数ETF主题联接证光伏创业科创半导体化工电池保险医药新药互联网科技恒生沪深港天弘华夏易方达南方国泰汇添富永赢方正富邦有色金属创业板]/;
      if (!fundKeywords.test(name)) continue;
      
      // 排除明显不是基金名的行（如标题、说明等）
      if (/^[名称金额收益排序]/.test(name)) continue;
      if (name.length < 4) continue;
      
      // 方案2：尝试从下一行合并基金名称后缀
      // 检查下一行是否以 ETF/联接/主题/指数/C/A 等开头
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].replace(/\s+/g, '');
        // 匹配常见的基金后缀格式：ETF联接C、联接A、主题ETF、指数C 等
        const suffixPattern = /^(ETF|联接|主题|指数|[CA])[\(（]?(QDII|LOF)?[\)）]?[CA]?$/i;
        const suffixMatch = nextLine.match(suffixPattern);
        if (suffixMatch) {
          // 提取后缀（去除 0.00 等数字部分）
          const suffix = nextLine.replace(/[\d.%+-]+/g, '').trim();
          if (suffix && suffix.length <= 15) {
            name = name + suffix;
            console.log(`合并后缀: ${match[1]} + ${suffix} = ${name}`);
          }
        } else {
          // 更宽松的匹配：如果下一行包含 ETF/联接/C/A 但不是完整的基金行
          const looseMatch = nextLine.match(/^([主题ETF联接指数CA（）\(QDII\)]+)/i);
          if (looseMatch && looseMatch[1].length <= 12 && !/^\d/.test(nextLine)) {
            const suffix = looseMatch[1].replace(/[\d.%+-]+/g, '');
            if (suffix) {
              name = name + suffix;
              console.log(`宽松合并后缀: ${match[1]} + ${suffix} = ${name}`);
            }
          }
        }
      }
      
      results.push({ name, amount, profit });
    }
  }
  
  // 去重：根据基金名称去重，保留金额较大的
  const uniqueMap = new Map();
  for (const fund of results) {
    const existing = uniqueMap.get(fund.name);
    if (!existing || fund.amount > existing.amount) {
      uniqueMap.set(fund.name, fund);
    }
  }
  
  const uniqueResults = Array.from(uniqueMap.values());
  console.log('=== 最终解析结果（去重后） ===', uniqueResults);
  return uniqueResults;
};

// 截图导入弹窗
function ImportScreenshotModal({ onImport, onClose, existingFunds }) {
  const [step, setStep] = useState('upload'); // upload, recognizing, preview
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [parsedFunds, setParsedFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState(new Set());
  const [searchingCodes, setSearchingCodes] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setStep('recognizing');
    
    // 动态导入 tesseract.js
    try {
      const Tesseract = (await import('tesseract.js')).default;
      
      const result = await Tesseract.recognize(file, 'chi_sim', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      setOcrText(result.data.text);
      
      // 调试日志：输出 OCR 原始识别结果
      console.log('=== OCR 识别原始文本 ===');
      console.log(result.data.text);
      console.log('=== 文本行分割 ===');
      const lines = result.data.text.split('\n').map(l => l.trim()).filter(l => l);
      lines.forEach((line, i) => console.log(`[${i}] ${line}`));
      
      // 解析识别结果
      const parsed = parseAntFortunText(result.data.text);
      
      // 调试日志：输出解析结果
      console.log('=== 解析结果 ===');
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.length === 0) {
        setError('未能识别到基金信息，请确保截图清晰且包含基金持仓');
        setStep('upload');
        return;
      }
      
      // 搜索基金代码（返回多个候选）
      setSearchingCodes(true);
      const fundsWithCodes = [];
      
      for (const fund of parsed) {
        const candidates = await searchFundByName(fund.name, 5);
        const firstCandidate = candidates[0] || null;
        fundsWithCodes.push({
          ...fund,
          code: firstCandidate?.code || '',
          matchedName: firstCandidate?.name || fund.name,
          candidates: candidates, // 存储所有候选
          isExisting: firstCandidate?.code ? existingFunds.some(f => f.code === firstCandidate.code) : false
        });
      }
      
      setParsedFunds(fundsWithCodes);
      // 默认选中所有非重复的基金
      setSelectedFunds(new Set(fundsWithCodes.filter(f => f.code && !f.isExisting).map((_, i) => i)));
      setSearchingCodes(false);
      setStep('preview');
      
    } catch (err) {
      console.error('OCR 识别失败', err);
      setError('识别失败：' + (err.message || '未知错误'));
      setStep('upload');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileChange({ target: input });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleSelect = (index) => {
    setSelectedFunds(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleImport = () => {
    const toImport = parsedFunds
      .filter((_, i) => selectedFunds.has(i))
      .filter(f => f.code && !f.isExisting)
      .map(f => ({
        code: f.code,
        amount: f.amount,
        profit: f.profit
      }));
    
    if (toImport.length === 0) {
      setError('没有可导入的基金');
      return;
    }
    
    onImport(toImport);
  };

  const updateFundCode = (index, newCode, switchToManual = false) => {
    setParsedFunds(prev => {
      const next = [...prev];
      if (switchToManual) {
        // 切换到手动输入模式
        next[index] = {
          ...next[index],
          code: '',
          candidates: [], // 清空候选，显示手动输入框
          manualInput: true,
          isExisting: false
        };
      } else {
        next[index] = {
          ...next[index],
          code: newCode,
          isExisting: newCode ? existingFunds.some(f => f.code === newCode) : false
        };
      }
      return next;
    });
  };

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="截图导入"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal import-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ImageIcon width="20" height="20" />
            <span>截图导入持仓</span>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        {step === 'upload' && (
          <>
            <div 
              className="upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon width="48" height="48" style={{ color: 'var(--muted)', marginBottom: 16 }} />
              <div style={{ fontWeight: 600, marginBottom: 8 }}>点击或拖拽上传截图</div>
              <div className="muted" style={{ fontSize: 13 }}>支持蚂蚁财富基金持仓截图</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            {error && (
              <div style={{ marginTop: 12, color: 'var(--danger)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertIcon width="16" height="16" />
                {error}
              </div>
            )}
            <div className="muted" style={{ marginTop: 16, fontSize: 12, lineHeight: 1.6 }}>
              <p style={{ marginBottom: 8 }}>使用说明：</p>
              <p>1. 打开蚂蚁财富 App，进入基金持仓页面</p>
              <p>2. 截图并上传到此处</p>
              <p>3. 系统将自动识别基金名称和持仓金额</p>
            </div>
          </>
        )}

        {step === 'recognizing' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="截图预览" 
                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginBottom: 20, opacity: 0.6 }}
              />
            )}
            <div style={{ marginBottom: 16 }}>
              <RefreshIcon width="24" height="24" className="spin" style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {searchingCodes ? '正在搜索基金代码...' : '正在识别截图...'}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              {searchingCodes ? '请稍候' : `识别进度: ${ocrProgress}%`}
            </div>
            <div style={{ marginTop: 16, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ 
                width: `${searchingCodes ? 100 : ocrProgress}%`, 
                height: '100%', 
                background: 'var(--primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {step === 'preview' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                识别到 {parsedFunds.length} 只基金，请确认并选择要导入的基金：
              </div>
            </div>
            
            <div className="import-list">
              {parsedFunds.map((fund, index) => (
                <div 
                  key={index} 
                  className={`import-item ${selectedFunds.has(index) ? 'selected' : ''} ${fund.isExisting ? 'existing' : ''} ${!fund.code ? 'no-code' : ''}`}
                  onClick={() => fund.code && !fund.isExisting && toggleSelect(index)}
                >
                  <div className="import-item-checkbox">
                    {fund.code && !fund.isExisting ? (
                      <div className={`checkbox ${selectedFunds.has(index) ? 'checked' : ''}`}>
                        {selectedFunds.has(index) && <CheckIcon width="14" height="14" />}
                      </div>
                    ) : (
                      <div className="checkbox disabled">
                        {fund.isExisting ? '已' : '?'}
                      </div>
                    )}
                  </div>
                  <div className="import-item-info">
                    <div className="import-item-name">{fund.name}</div>
                    <div className="import-item-code" onClick={(e) => e.stopPropagation()}>
                      {fund.candidates && fund.candidates.length > 0 ? (
                        // 有候选：显示下拉选择框
                        <select
                          className="input"
                          value={fund.code}
                          style={{ height: 28, fontSize: 12, padding: '0 4px', minWidth: 140, maxWidth: 200 }}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            if (newCode === '__manual__') {
                              // 切换到手动输入模式
                              updateFundCode(index, '', true);
                            } else {
                              updateFundCode(index, newCode);
                            }
                          }}
                        >
                          {fund.candidates.map((c, ci) => (
                            <option key={ci} value={c.code}>
                              {c.code} - {c.name.length > 12 ? c.name.slice(0, 12) + '...' : c.name}
                            </option>
                          ))}
                          <option value="__manual__">手动输入代码...</option>
                        </select>
                      ) : fund.manualInput !== undefined ? (
                        // 手动输入模式
                        <input
                          type="text"
                          className="input"
                          placeholder="输入6位基金代码"
                          defaultValue={fund.code}
                          style={{ height: 28, fontSize: 12, padding: '0 8px', width: 110 }}
                          onChange={(e) => updateFundCode(index, e.target.value.trim())}
                        />
                      ) : (
                        // 无候选：直接显示手动输入
                        <input
                          type="text"
                          className="input"
                          placeholder="输入6位基金代码"
                          style={{ height: 28, fontSize: 12, padding: '0 8px', width: 110 }}
                          onChange={(e) => updateFundCode(index, e.target.value.trim())}
                        />
                      )}
                      {fund.isExisting && <span className="muted" style={{ marginLeft: 8 }}>已添加</span>}
                    </div>
                  </div>
                  <div className="import-item-amount">
                    <div style={{ fontWeight: 600 }}>{fund.amount.toFixed(2)}</div>
                    <div className={`${fund.profit >= 0 ? 'up' : 'down'}`} style={{ fontSize: 12 }}>
                      {fund.profit >= 0 ? '+' : ''}{fund.profit.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: 12, color: 'var(--danger)', fontSize: 13 }}>{error}</div>
            )}

            <div className="row" style={{ justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
              <button 
                className="button" 
                onClick={() => { setStep('upload'); setImage(null); setImagePreview(null); setParsedFunds([]); setError(''); }}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', flex: 1 }}
              >
                重新上传
              </button>
              <button 
                className="button" 
                onClick={handleImport}
                disabled={selectedFunds.size === 0}
                style={{ flex: 1 }}
              >
                导入 ({selectedFunds.size})
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// 自定义 Tooltip 组件
function CustomChartTooltip({ active, payload, label, isIntraday }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-date">{isIntraday ? data.time : data.date}</div>
        <div className="chart-tooltip-value">净值: {data.price.toFixed(4)}</div>
        {(data.changeRate !== undefined || data.change !== undefined) && (
          <div className={`chart-tooltip-change ${(data.changeRate || data.change) >= 0 ? 'up' : 'down'}`}>
            涨跌: {(data.changeRate || data.change) >= 0 ? '+' : ''}{(data.changeRate || data.change).toFixed(2)}%
          </div>
        )}
      </div>
    );
  }
  return null;
}

// 基金走势图弹窗
function FundChartModal({ fund, holding, intradayData: passedIntradayData = [], onClose }) {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [period, setPeriod] = useState(passedIntradayData.length > 0 ? 'today' : '30'); // 'today', '7', '30', '60', '90'
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (period === 'today') {
        // 使用传入的盘中数据
        setLoading(false);
        if (passedIntradayData.length === 0) {
          setError('暂无今日盘中数据（需要在交易时间段打开页面记录）');
        } else {
          setError('');
        }
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        // 获取历史数据
        const days = parseInt(period);
        const data = await getFundHistory(fund.code, days);
        if (data && data.length > 0) {
          // 按日期排序（升序）
          const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
          setHistoryData(sorted);
        } else {
          setError('暂无历史数据');
        }
      } catch (e) {
        console.error('获取数据失败', e);
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fund.code, period, passedIntradayData.length]);

  // 当前显示的数据
  const chartData = period === 'today' 
    ? passedIntradayData.map(r => ({ time: r.time, price: r.gsz, change: r.gszzl }))
    : historyData;

  // 计算统计数据
  const stats = chartData.length > 0 ? (() => {
    const prices = chartData.map(d => d.price).filter(p => p > 0);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const change = first > 0 ? ((last - first) / first * 100) : 0;
    return { min, max, change, first, last };
  })() : null;

  // 计算持仓走势（如果有持仓且不是今日分时）
  const holdingChartData = (holding && holding.shares > 0 && period !== 'today') ? historyData.map(d => ({
    ...d,
    marketValue: d.price * holding.shares,
    costValue: holding.costPrice > 0 ? holding.costPrice * holding.shares : null,
    profit: holding.costPrice > 0 ? (d.price - holding.costPrice) * holding.shares : null
  })) : null;

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="基金走势"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal chart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ChartIcon width="20" height="20" />
            <div>
              <span>{fund.name}</span>
              <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>#{fund.code}</span>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        {/* 时间段选择 */}
        <div className="chart-period-selector">
          {[
            { value: 'today', label: `今日${passedIntradayData.length > 0 ? `(${passedIntradayData.length})` : ''}` },
            { value: '7', label: '7天' },
            { value: '30', label: '30天' },
            { value: '60', label: '60天' },
            { value: '90', label: '90天' }
          ].map(p => (
            <button
              key={p.value}
              className={`chip ${period === p.value ? 'active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">
              <RefreshIcon width="24" height="24" className="spin" />
              <span>加载中...</span>
            </div>
          ) : error ? (
            <div className="chart-error">
              <AlertIcon width="24" height="24" />
              <span>{error}</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="chart-error">
              <AlertIcon width="24" height="24" />
              <span>暂无数据</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey={period === 'today' ? 'time' : 'date'} 
                  tickFormatter={(v) => period === 'today' ? v : (v ? v.slice(5) : '')}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toFixed(2)}
                  width={50}
                />
                <Tooltip content={<CustomChartTooltip isIntraday={period === 'today'} />} />
                {stats && (
                  <ReferenceLine y={stats.first} stroke="var(--muted)" strokeDasharray="3 3" />
                )}
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 统计信息 */}
        {stats && !loading && !error && (
          <div className="chart-stats">
            <div className="chart-stat">
              <span className="label">期间涨跌</span>
              <span className={`value ${stats.change >= 0 ? 'up' : 'down'}`}>
                {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
              </span>
            </div>
            <div className="chart-stat">
              <span className="label">最高净值</span>
              <span className="value">{stats.max.toFixed(4)}</span>
            </div>
            <div className="chart-stat">
              <span className="label">最低净值</span>
              <span className="value">{stats.min.toFixed(4)}</span>
            </div>
            <div className="chart-stat">
              <span className="label">当前净值</span>
              <span className="value">{stats.last.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* 持仓走势（如果有持仓） */}
        {holdingChartData && !loading && !error && (
          <>
            <div className="chart-section-title">
              <WalletIcon width="16" height="16" />
              <span>持仓市值走势</span>
            </div>
            <div className="chart-container" style={{ marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={holdingChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(v) => v.slice(5)}
                    tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v.toFixed(0)}
                    width={45}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="chart-tooltip">
                            <div className="chart-tooltip-date">{d.date}</div>
                            <div className="chart-tooltip-value">市值: {d.marketValue.toFixed(2)}</div>
                            {d.profit !== null && (
                              <div className={`chart-tooltip-change ${d.profit >= 0 ? 'up' : 'down'}`}>
                                盈亏: {d.profit >= 0 ? '+' : ''}{d.profit.toFixed(2)}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {holding.costPrice > 0 && (
                    <ReferenceLine 
                      y={holding.costPrice * holding.shares} 
                      stroke="var(--danger)" 
                      strokeDasharray="3 3"
                      label={{ value: '成本', fill: 'var(--danger)', fontSize: 10 }}
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="marketValue" 
                    stroke="var(--accent)" 
                    strokeWidth={2}
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// 总持仓走势图弹窗
function PortfolioChartModal({ funds, holdings, onClose }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(30);
  const [error, setError] = useState('');

  // 获取有持仓的基金列表
  const holdingFunds = funds.filter(f => holdings[f.code]?.shares > 0);

  useEffect(() => {
    const fetchAllHistory = async () => {
      if (holdingFunds.length === 0) {
        setError('暂无持仓');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // 获取所有持仓基金的历史数据
        const allHistories = {};
        for (const fund of holdingFunds) {
          const history = await getFundHistory(fund.code, days);
          if (history && history.length > 0) {
            allHistories[fund.code] = history;
          }
        }

        // 合并所有日期
        const allDates = new Set();
        Object.values(allHistories).forEach(history => {
          history.forEach(d => allDates.add(d.date));
        });
        
        const sortedDates = Array.from(allDates).sort();
        
        // 计算每天的总市值
        const dailyData = sortedDates.map(date => {
          let totalValue = 0;
          let totalCost = 0;
          
          holdingFunds.forEach(fund => {
            const h = holdings[fund.code];
            const history = allHistories[fund.code];
            if (history) {
              // 找到该日期或最近的数据
              const dayData = history.find(d => d.date === date) || 
                history.filter(d => d.date <= date).pop();
              if (dayData) {
                totalValue += dayData.price * h.shares;
                if (h.costPrice > 0) {
                  totalCost += h.costPrice * h.shares;
                }
              }
            }
          });
          
          return {
            date,
            totalValue,
            totalCost: totalCost > 0 ? totalCost : null,
            profit: totalCost > 0 ? totalValue - totalCost : null
          };
        });

        setChartData(dailyData);
      } catch (e) {
        console.error('获取历史数据失败', e);
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchAllHistory();
  }, [days, holdingFunds.length]);

  // 计算统计数据
  const stats = chartData.length > 0 ? (() => {
    const values = chartData.map(d => d.totalValue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const first = values[0];
    const last = values[values.length - 1];
    const change = first > 0 ? ((last - first) / first * 100) : 0;
    const lastData = chartData[chartData.length - 1];
    return { min, max, change, first, last, profit: lastData.profit, cost: lastData.totalCost };
  })() : null;

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="总持仓走势"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal chart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WalletIcon width="20" height="20" />
            <div>
              <span>总持仓走势</span>
              <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>共 {holdingFunds.length} 只基金</span>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        {/* 时间段选择 */}
        <div className="chart-period-selector">
          {[
            { value: 7, label: '7天' },
            { value: 30, label: '30天' },
            { value: 60, label: '60天' },
            { value: 90, label: '90天' }
          ].map(p => (
            <button
              key={p.value}
              className={`chip ${days === p.value ? 'active' : ''}`}
              onClick={() => setDays(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">
              <RefreshIcon width="24" height="24" className="spin" />
              <span>加载中（{holdingFunds.length} 只基金）...</span>
            </div>
          ) : error ? (
            <div className="chart-error">
              <AlertIcon width="24" height="24" />
              <span>{error}</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(v) => v.slice(5)}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 10000 ? `${(v/10000).toFixed(1)}万` : v >= 1000 ? `${(v/1000).toFixed(1)}k` : v.toFixed(0)}
                  width={50}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="chart-tooltip">
                          <div className="chart-tooltip-date">{d.date}</div>
                          <div className="chart-tooltip-value">总市值: {d.totalValue.toFixed(2)}</div>
                          {d.profit !== null && (
                            <div className={`chart-tooltip-change ${d.profit >= 0 ? 'up' : 'down'}`}>
                              累计盈亏: {d.profit >= 0 ? '+' : ''}{d.profit.toFixed(2)}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {stats && stats.cost && (
                  <ReferenceLine 
                    y={stats.cost} 
                    stroke="var(--danger)" 
                    strokeDasharray="3 3"
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="totalValue" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fill="url(#colorPortfolio)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 统计信息 */}
        {stats && !loading && !error && (
          <div className="chart-stats">
            <div className="chart-stat">
              <span className="label">期间涨跌</span>
              <span className={`value ${stats.change >= 0 ? 'up' : 'down'}`}>
                {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
              </span>
            </div>
            <div className="chart-stat">
              <span className="label">最高市值</span>
              <span className="value">{stats.max.toFixed(0)}</span>
            </div>
            <div className="chart-stat">
              <span className="label">最低市值</span>
              <span className="value">{stats.min.toFixed(0)}</span>
            </div>
            <div className="chart-stat">
              <span className="label">当前市值</span>
              <span className="value">{stats.last.toFixed(0)}</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const [funds, setFunds] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const refreshingRef = useRef(false);

  // 刷新频率状态
  const [refreshMs, setRefreshMs] = useState(30000);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempSeconds, setTempSeconds] = useState(30);
  
  // 操作记录弹窗状态（独立模块）
  const [operationManagerOpen, setOperationManagerOpen] = useState(false);

  // 全局刷新状态
  const [refreshing, setRefreshing] = useState(false);

  // 收起/展开状态
  const [collapsedCodes, setCollapsedCodes] = useState(new Set());

  // 自选状态
  const [favorites, setFavorites] = useState(new Set());
  const [currentTab, setCurrentTab] = useState('all');

  // 排序状态
  const [sortBy, setSortBy] = useState('default'); // default, name, yield, code
  const [sortOrder, setSortOrder] = useState('desc'); // desc: 降序, asc: 升序

  // 视图模式
  const [viewMode, setViewMode] = useState('card'); // card, list


  // 持仓信息状态 { [code]: { shares: number, costPrice: number } }
  const [holdings, setHoldings] = useState({});
  const [editingFund, setEditingFund] = useState(null);

  // 截图导入弹窗状态
  const [importModalOpen, setImportModalOpen] = useState(false);

  // 图表弹窗状态
  const [chartFund, setChartFund] = useState(null);
  const [portfolioChartOpen, setPortfolioChartOpen] = useState(false);

  // 盘中估值记录 { [code]: { date: string, records: [{time, gsz, gszzl}] } }
  const [intradayRecords, setIntradayRecords] = useState({});
  const intradayTimerRef = useRef(null);

  // 检查是否在交易时间内（9:30-15:00，周一至周五）
  const isTradeTime = () => {
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) return false; // 周末
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes;
    
    // 上午 9:30 - 11:30，下午 13:00 - 15:00
    return (time >= 570 && time <= 690) || (time >= 780 && time <= 900);
  };

  // 获取今天的日期字符串
  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // 记录当前估值数据
  const recordIntradayData = () => {
    if (!isTradeTime() || funds.length === 0) return;
    
    const today = getTodayStr();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setIntradayRecords(prev => {
      const next = { ...prev };
      
      funds.forEach(f => {
        const gsz = parseFloat(f.gsz) || 0;
        const gszzl = typeof f.gszzl === 'number' ? f.gszzl : (parseFloat(f.gszzl) || 0);
        
        if (gsz <= 0) return; // 无有效估值数据
        
        if (!next[f.code] || next[f.code].date !== today) {
          // 新的一天，重置记录
          next[f.code] = { date: today, records: [] };
        }
        
        // 检查是否已经有相同时间的记录（避免重复）
        const lastRecord = next[f.code].records[next[f.code].records.length - 1];
        if (lastRecord && lastRecord.time === timeStr) return;
        
        next[f.code].records.push({
          time: timeStr,
          gsz,
          gszzl
        });
      });
      
      // 保存到 localStorage
      localStorage.setItem('intradayRecords', JSON.stringify(next));
      return next;
    });
  };

  // 加载盘中记录
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('intradayRecords') || '{}');
      const today = getTodayStr();
      
      // 只保留今天的记录
      const filtered = {};
      Object.keys(saved).forEach(code => {
        if (saved[code].date === today) {
          filtered[code] = saved[code];
        }
      });
      
      setIntradayRecords(filtered);
      localStorage.setItem('intradayRecords', JSON.stringify(filtered));
    } catch (e) {
      console.error('加载盘中记录失败', e);
    }
  }, []);

  // 定时记录盘中数据（每分钟记录一次）
  useEffect(() => {
    // 立即记录一次
    if (funds.length > 0) {
      recordIntradayData();
    }
    
    // 设置定时器，每分钟记录一次
    intradayTimerRef.current = setInterval(() => {
      recordIntradayData();
    }, 60000); // 1分钟
    
    return () => {
      if (intradayTimerRef.current) {
        clearInterval(intradayTimerRef.current);
      }
    };
  }, [funds]);

  const toggleFavorite = (code) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(next)));
      if (next.size === 0) setCurrentTab('all');
      return next;
    });
  };

  const toggleCollapse = (code) => {
    setCollapsedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      // 同步到本地存储
      localStorage.setItem('collapsedCodes', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // 按 code 去重，保留第一次出现的项，避免列表重复
  const dedupeByCode = (list) => {
    const seen = new Set();
    return list.filter((f) => {
      const c = f?.code;
      if (!c || seen.has(c)) return false;
      seen.add(c);
      return true;
    });
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('funds') || '[]');
      if (Array.isArray(saved) && saved.length) {
        const deduped = dedupeByCode(saved);
        setFunds(deduped);
        localStorage.setItem('funds', JSON.stringify(deduped));
        const codes = Array.from(new Set(deduped.map((f) => f.code)));
        if (codes.length) refreshAll(codes);
      }
      const savedMs = parseInt(localStorage.getItem('refreshMs') || '30000', 10);
      if (Number.isFinite(savedMs) && savedMs >= 5000) {
        setRefreshMs(savedMs);
        setTempSeconds(Math.round(savedMs / 1000));
      }
      // 加载收起状态
      const savedCollapsed = JSON.parse(localStorage.getItem('collapsedCodes') || '[]');
      if (Array.isArray(savedCollapsed)) {
        setCollapsedCodes(new Set(savedCollapsed));
      }
      // 加载自选状态
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (Array.isArray(savedFavorites)) {
        setFavorites(new Set(savedFavorites));
      }
      // 加载视图模式
      const savedViewMode = localStorage.getItem('viewMode');
      if (savedViewMode === 'card' || savedViewMode === 'list') {
        setViewMode(savedViewMode);
      }
      // 加载持仓信息
      const savedHoldings = JSON.parse(localStorage.getItem('holdings') || '{}');
      if (savedHoldings && typeof savedHoldings === 'object') {
        setHoldings(savedHoldings);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const codes = Array.from(new Set(funds.map((f) => f.code)));
      if (codes.length) refreshAll(codes);
    }, refreshMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [funds, refreshMs]);

  // --- 辅助：JSONP 数据抓取逻辑 ---
  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        document.body.removeChild(script);
        resolve();
      };
      script.onerror = () => {
        document.body.removeChild(script);
        reject(new Error('数据加载失败'));
      };
      document.body.appendChild(script);
    });
  };

  const fetchFundData = async (c) => {
    return new Promise(async (resolve, reject) => {
      // 腾讯接口识别逻辑优化
      const getTencentPrefix = (code) => {
        if (code.startsWith('6') || code.startsWith('9')) return 'sh';
        if (code.startsWith('0') || code.startsWith('3')) return 'sz';
        if (code.startsWith('4') || code.startsWith('8')) return 'bj';
        return 'sz';
      };

      const gzUrl = `https://fundgz.1234567.com.cn/js/${c}.js?rt=${Date.now()}`;

      // 使用更安全的方式处理全局回调，避免并发覆盖
      const currentCallback = `jsonpgz_${c}_${Math.random().toString(36).slice(2, 7)}`;

      // 动态拦截并处理 jsonpgz 回调
      const scriptGz = document.createElement('script');
      // 东方财富接口固定调用 jsonpgz，我们通过修改全局变量临时捕获它
      scriptGz.src = gzUrl;

      const originalJsonpgz = window.jsonpgz;
      window.jsonpgz = (json) => {
        window.jsonpgz = originalJsonpgz; // 立即恢复
        if (!json || typeof json !== 'object') {
          reject(new Error('未获取到基金估值数据'));
          return;
        }
        const gszzlNum = Number(json.gszzl);
        const gzData = {
          code: json.fundcode,
          name: json.name,
          dwjz: json.dwjz,
          gsz: json.gsz,
          gztime: json.gztime,
          gszzl: Number.isFinite(gszzlNum) ? gszzlNum : json.gszzl
        };

        // 获取重仓股票列表
        const holdingsUrl = `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${c}&topline=10&year=&month=&rt=${Date.now()}`;
        loadScript(holdingsUrl).then(async () => {
          let holdings = [];
          const html = window.apidata?.content || '';
          const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
          for (const r of rows) {
            const cells = (r.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) || []).map(td => td.replace(/<[^>]*>/g, '').trim());
            const codeIdx = cells.findIndex(txt => /^\d{6}$/.test(txt));
            const weightIdx = cells.findIndex(txt => /\d+(?:\.\d+)?\s*%/.test(txt));
            if (codeIdx >= 0 && weightIdx >= 0) {
              holdings.push({
                code: cells[codeIdx],
                name: cells[codeIdx + 1] || '',
                weight: cells[weightIdx],
                change: null
              });
            }
          }

          holdings = holdings.slice(0, 10);

          if (holdings.length) {
            try {
              const tencentCodes = holdings.map(h => `s_${getTencentPrefix(h.code)}${h.code}`).join(',');
              const quoteUrl = `https://qt.gtimg.cn/q=${tencentCodes}`;

              await new Promise((resQuote) => {
                const scriptQuote = document.createElement('script');
                scriptQuote.src = quoteUrl;
                scriptQuote.onload = () => {
                  holdings.forEach(h => {
                    const varName = `v_s_${getTencentPrefix(h.code)}${h.code}`;
                    const dataStr = window[varName];
                    if (dataStr) {
                      const parts = dataStr.split('~');
                      // parts[5] 是涨跌幅
                      if (parts.length > 5) {
                        h.change = parseFloat(parts[5]);
                      }
                    }
                  });
                  if (document.body.contains(scriptQuote)) document.body.removeChild(scriptQuote);
                  resQuote();
                };
                scriptQuote.onerror = () => {
                  if (document.body.contains(scriptQuote)) document.body.removeChild(scriptQuote);
                  resQuote();
                };
                document.body.appendChild(scriptQuote);
              });
            } catch (e) {
              console.error('获取股票涨跌幅失败', e);
            }
          }

          resolve({ ...gzData, holdings });
        }).catch(() => resolve({ ...gzData, holdings: [] }));
      };

      scriptGz.onerror = () => {
        window.jsonpgz = originalJsonpgz;
        if (document.body.contains(scriptGz)) document.body.removeChild(scriptGz);
        reject(new Error('基金数据加载失败'));
      };

      document.body.appendChild(scriptGz);
      // 加载完立即移除脚本
      setTimeout(() => {
        if (document.body.contains(scriptGz)) document.body.removeChild(scriptGz);
      }, 5000);
    });
  };

  const refreshAll = async (codes) => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    const uniqueCodes = Array.from(new Set(codes));
    try {
      const updated = [];
      for (const c of uniqueCodes) {
        try {
          const data = await fetchFundData(c);
          updated.push(data);
        } catch (e) {
          console.error(`刷新基金 ${c} 失败`, e);
          const old = funds.find((f) => f.code === c);
          if (old) updated.push(old);
        }
      }
      const deduped = dedupeByCode(updated);
      if (deduped.length) {
        setFunds(deduped);
        localStorage.setItem('funds', JSON.stringify(deduped));
      }
    } catch (e) {
      console.error(e);
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  };

  const toggleViewMode = () => {
    const nextMode = viewMode === 'card' ? 'list' : 'card';
    setViewMode(nextMode);
    localStorage.setItem('viewMode', nextMode);
  };

  const addFund = async (e) => {
    e.preventDefault();
    setError('');
    const clean = code.trim();
    if (!clean) {
      setError('请输入基金编号');
      return;
    }
    if (funds.some((f) => f.code === clean)) {
      setError('该基金已添加');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchFundData(clean);
      const next = [data, ...funds];
      setFunds(next);
      localStorage.setItem('funds', JSON.stringify(next));
      setCode('');
    } catch (e) {
      setError(e.message || '添加失败');
    } finally {
      setLoading(false);
    }
  };

  const removeFund = (removeCode) => {
    const next = funds.filter((f) => f.code !== removeCode);
    setFunds(next);
    localStorage.setItem('funds', JSON.stringify(next));

    // 同步删除展开收起状态
    setCollapsedCodes(prev => {
      if (!prev.has(removeCode)) return prev;
      const nextSet = new Set(prev);
      nextSet.delete(removeCode);
      localStorage.setItem('collapsedCodes', JSON.stringify(Array.from(nextSet)));
      return nextSet;
    });

    // 同步删除自选状态
    setFavorites(prev => {
      if (!prev.has(removeCode)) return prev;
      const nextSet = new Set(prev);
      nextSet.delete(removeCode);
      localStorage.setItem('favorites', JSON.stringify(Array.from(nextSet)));
      if (nextSet.size === 0) setCurrentTab('all');
      return nextSet;
    });

    // 同步删除持仓信息
    setHoldings(prev => {
      if (!prev[removeCode]) return prev;
      const next = { ...prev };
      delete next[removeCode];
      localStorage.setItem('holdings', JSON.stringify(next));
      return next;
    });
  };

  // 保存持仓信息
  const saveHolding = (code, data) => {
    setHoldings(prev => {
      let next;
      if (data.shares <= 0 && data.costPrice <= 0) {
        // 清空持仓
        next = { ...prev };
        delete next[code];
      } else {
        next = { ...prev, [code]: data };
      }
      localStorage.setItem('holdings', JSON.stringify(next));
      return next;
    });
    setEditingFund(null);
  };

  // 计算单只基金的持仓数据
  const calcHoldingData = (fund) => {
    const h = holdings[fund.code];
    if (!h || h.shares <= 0) return null;
    
    const gsz = parseFloat(fund.gsz) || 0;
    const gszzl = typeof fund.gszzl === 'number' ? fund.gszzl : (parseFloat(fund.gszzl) || 0);
    const marketValue = h.shares * gsz;
    const costValue = h.costPrice > 0 ? h.shares * h.costPrice : 0;
    const profit = costValue > 0 ? marketValue - costValue : 0;
    const profitRate = costValue > 0 ? (profit / costValue * 100) : 0;
    const yesterdayValue = gszzl !== 0 ? marketValue / (1 + gszzl / 100) : marketValue;
    const dayProfit = marketValue - yesterdayValue;
    
    return {
      shares: h.shares,
      costPrice: h.costPrice,
      marketValue,
      costValue,
      profit,
      profitRate,
      dayProfit
    };
  };

  const manualRefresh = async () => {
    if (refreshingRef.current) return;
    const codes = Array.from(new Set(funds.map((f) => f.code)));
    if (!codes.length) return;
    await refreshAll(codes);
  };

  const saveSettings = (e) => {
    e?.preventDefault?.();
    const ms = Math.max(5, Number(tempSeconds)) * 1000;
    setRefreshMs(ms);
    localStorage.setItem('refreshMs', String(ms));
    setSettingsOpen(false);
  };

  // 处理截图导入
  const handleImportFromScreenshot = async (importedFunds) => {
    setImportModalOpen(false);
    setLoading(true);
    
    try {
      const newFunds = [];
      const newHoldings = { ...holdings };
      
      for (const item of importedFunds) {
        // 检查是否已存在
        if (funds.some(f => f.code === item.code)) {
          continue;
        }
        
        try {
          const data = await fetchFundData(item.code);
          newFunds.push(data);
          
          // 根据导入的金额计算份额
          const gsz = parseFloat(data.gsz) || 1;
          const shares = item.amount / gsz;
          
          // 计算成本价（基于当前市值和收益）
          const costValue = item.amount - item.profit;
          const costPrice = costValue > 0 ? costValue / shares : 0;
          
          newHoldings[item.code] = {
            shares: shares,
            costPrice: costPrice
          };
        } catch (e) {
          console.error(`导入基金 ${item.code} 失败`, e);
        }
      }
      
      if (newFunds.length > 0) {
        const next = [...newFunds, ...funds];
        setFunds(next);
        localStorage.setItem('funds', JSON.stringify(next));
        
        setHoldings(newHoldings);
        localStorage.setItem('holdings', JSON.stringify(newHoldings));
      }
    } catch (e) {
      console.error('导入失败', e);
      setError('导入失败：' + (e.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape' && settingsOpen) setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

  // 导出数据到 JSON 文件
  const exportData = () => {
    const data = {
      version: 1,
      exportTime: new Date().toISOString(),
      funds: funds,
      holdings: holdings,
      favorites: Array.from(favorites),
      collapsedCodes: Array.from(collapsedCodes),
      refreshMs: refreshMs,
      viewMode: viewMode
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fund-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 从 JSON 文件导入数据
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // 验证数据格式
        if (!data.funds || !Array.isArray(data.funds)) {
          alert('无效的数据文件');
          return;
        }
        
        // 恢复数据
        if (data.funds) {
          setFunds(data.funds);
          localStorage.setItem('funds', JSON.stringify(data.funds));
        }
        if (data.holdings) {
          setHoldings(data.holdings);
          localStorage.setItem('holdings', JSON.stringify(data.holdings));
        }
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(new Set(data.favorites));
          localStorage.setItem('favorites', JSON.stringify(data.favorites));
        }
        if (data.collapsedCodes && Array.isArray(data.collapsedCodes)) {
          setCollapsedCodes(new Set(data.collapsedCodes));
          localStorage.setItem('collapsedCodes', JSON.stringify(data.collapsedCodes));
        }
        if (data.refreshMs) {
          setRefreshMs(data.refreshMs);
          setTempSeconds(Math.round(data.refreshMs / 1000));
          localStorage.setItem('refreshMs', String(data.refreshMs));
        }
        if (data.viewMode) {
          setViewMode(data.viewMode);
          localStorage.setItem('viewMode', data.viewMode);
        }
        
        alert('数据导入成功！');
        setSettingsOpen(false);
        
        // 刷新基金数据
        const codes = data.funds.map(f => f.code);
        if (codes.length) refreshAll(codes);
        
      } catch (err) {
        console.error('导入失败', err);
        alert('导入失败：文件格式错误');
      }
    };
    reader.readAsText(file);
    
    // 清空 input 以便重复选择同一文件
    e.target.value = '';
  };

  const importFileRef = useRef(null);

  return (
    <div className="container content">
      <Announcement />
      <div className="navbar glass">
        {refreshing && <div className="loading-bar"></div>}
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" />
            <path d="M5 14c2-4 7-6 14-5" stroke="var(--primary)" strokeWidth="2" />
          </svg>
          <span>实时基金估值</span>
        </div>
        <div className="actions">
          <div className="badge" title="当前刷新频率">
            <span>刷新</span>
            <strong>{Math.round(refreshMs / 1000)}秒</strong>
          </div>
          <button
            className="icon-button"
            aria-label="立即刷新"
            onClick={manualRefresh}
            disabled={refreshing || funds.length === 0}
            aria-busy={refreshing}
            title="立即刷新"
          >
            <RefreshIcon className={refreshing ? 'spin' : ''} width="18" height="18" />
          </button>
          <button
            className="icon-button"
            aria-label="操作记录"
            onClick={() => setOperationManagerOpen(true)}
            title="操作记录"
          >
            <ClipboardIcon width="18" height="18" />
          </button>
          <button
            className="icon-button"
            aria-label="打开设置"
            onClick={() => setSettingsOpen(true)}
            title="设置"
          >
            <SettingsIcon width="18" height="18" />
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 glass card add-fund-section" role="region" aria-label="添加基金">
          <div className="title" style={{ marginBottom: 12 }}>
            <PlusIcon width="20" height="20" />
            <span>添加基金</span>
            <span className="muted">输入基金编号（例如：110022）</span>
          </div>
          <form className="form" onSubmit={addFund}>
            <input
              className="input"
              placeholder="基金编号"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
            />
            <button className="button" type="submit" disabled={loading}>
              {loading ? '添加中…' : '添加'}
            </button>
            <button 
              type="button"
              className="button import-button" 
              onClick={() => setImportModalOpen(true)}
              disabled={loading}
              title="从蚂蚁财富截图导入"
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <ImageIcon width="18" height="18" />
              <span className="import-button-text">截图导入</span>
            </button>
          </form>
          {error && <div className="muted" style={{ marginTop: 8, color: 'var(--danger)' }}>{error}</div>}
        </div>

        {/* 持仓汇总 */}
        <PortfolioSummary funds={funds} holdings={holdings} onOpenChart={() => setPortfolioChartOpen(true)} />

        <div className="col-12">
          {funds.length > 0 && (
            <div className="filter-bar" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              {favorites.size > 0 ? (
                <div className="tabs">
                  <button
                    className={`tab ${currentTab === 'all' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('all')}
                  >
                    全部 ({funds.length})
                  </button>
                  <button
                    className={`tab ${currentTab === 'fav' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('fav')}
                  >
                    自选 ({favorites.size})
                  </button>
                </div>
              ) : <div />}

              <div className="sort-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="view-toggle" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
                  <button
                    className={`icon-button ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => { setViewMode('card'); localStorage.setItem('viewMode', 'card'); }}
                    style={{ border: 'none', width: '32px', height: '32px', background: viewMode === 'card' ? 'var(--primary)' : 'transparent', color: viewMode === 'card' ? '#05263b' : 'var(--muted)' }}
                    title="卡片视图"
                  >
                    <GridIcon width="16" height="16" />
                  </button>
                  <button
                      className={`icon-button ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => { setViewMode('list'); localStorage.setItem('viewMode', 'list'); }}
                      style={{ border: 'none', width: '32px', height: '32px', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? '#05263b' : 'var(--muted)' }}
                      title="表格视图"
                    >
                      <ListIcon width="16" height="16" />
                    </button>
                </div>

                <div className="divider" style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

                <div className="sort-items" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="muted" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SortIcon width="14" height="14" />
                    排序
                  </span>
                  <div className="chips">
                    {[
                      { id: 'default', label: '默认' },
                      { id: 'yield', label: '涨跌幅' },
                      { id: 'yesterdayValue', label: '昨日金额' },
                      { id: 'estimateValue', label: '预估金额' },
                      { id: 'dayProfit', label: '今日盈亏' },
                      { id: 'profit', label: '累计盈亏' },
                      { id: 'name', label: '名称' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        className={`chip ${sortBy === s.id ? 'active' : ''}`}
                        onClick={() => setSortBy(s.id)}
                        style={{ height: '28px', fontSize: '12px', padding: '0 10px' }}
                      >
                        {s.label}
                      </button>
                    ))}
                    {sortBy !== 'default' && (
                      <button
                        className="chip sort-order-btn"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        style={{ height: '28px', fontSize: '12px', padding: '0 10px', marginLeft: 4 }}
                        title={sortOrder === 'desc' ? '当前：降序，点击切换升序' : '当前：升序，点击切换降序'}
                      >
                        {sortOrder === 'desc' ? '↓ 降序' : '↑ 升序'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {funds.length === 0 ? (
            <div className="glass card empty">尚未添加基金</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={viewMode === 'card' ? 'grid' : 'table-container glass'}
              >
                {/* 列表模式表头 */}
                {viewMode === 'list' && (
                  <div className="table-header-row">
                    <div className="table-cell">名称</div>
                    <div className="table-cell text-right">涨跌</div>
                    <div className="table-cell text-right">净值</div>
                    <div className="table-cell text-right">成本</div>
                    <div className="table-cell text-right">昨日金额</div>
                    <div className="table-cell text-right">预估金额</div>
                    <div className="table-cell text-right">今日盈亏</div>
                    <div className="table-cell text-right">累计盈亏</div>
                    <div className="table-cell text-right">收益率</div>
                    <div className="table-cell text-center">操作</div>
                  </div>
                )}
                <div className={viewMode === 'card' ? 'grid col-12' : ''} style={viewMode === 'card' ? { gridColumn: 'span 12', gap: 16 } : {}}>
                  <AnimatePresence mode="popLayout">
                    {funds
                      .filter(f => currentTab === 'all' || favorites.has(f.code))
                      .sort((a, b) => {
                        const dir = sortOrder === 'asc' ? 1 : -1;
                        if (sortBy === 'yield') {
                          const valA = typeof a.estGszzl === 'number' ? a.estGszzl : (Number(a.gszzl) || 0);
                          const valB = typeof b.estGszzl === 'number' ? b.estGszzl : (Number(b.gszzl) || 0);
                          return (valB - valA) * dir;
                        }
                        if (sortBy === 'yesterdayValue') {
                          const hA = holdings[a.code];
                          const hB = holdings[b.code];
                          const yvA = hA?.shares > 0 ? hA.shares * (parseFloat(a.dwjz) || 0) : 0;
                          const yvB = hB?.shares > 0 ? hB.shares * (parseFloat(b.dwjz) || 0) : 0;
                          return (yvB - yvA) * dir;
                        }
                        if (sortBy === 'estimateValue') {
                          const hA = calcHoldingData(a);
                          const hB = calcHoldingData(b);
                          const evA = hA?.marketValue || 0;
                          const evB = hB?.marketValue || 0;
                          return (evB - evA) * dir;
                        }
                        if (sortBy === 'dayProfit') {
                          const hA = calcHoldingData(a);
                          const hB = calcHoldingData(b);
                          const dpA = hA?.dayProfit || 0;
                          const dpB = hB?.dayProfit || 0;
                          return (dpB - dpA) * dir;
                        }
                        if (sortBy === 'profit') {
                          const hA = calcHoldingData(a);
                          const hB = calcHoldingData(b);
                          const pA = hA?.profit || 0;
                          const pB = hB?.profit || 0;
                          return (pB - pA) * dir;
                        }
                        if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-CN') * dir;
                        return 0; // default order is the order in the array
                      })
                      .map((f) => (
                      <motion.div
                        layout="position"
                        key={f.code}
                        className={viewMode === 'card' ? 'col-6' : 'table-row-wrapper'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                      <div className={viewMode === 'card' ? 'glass card' : 'table-row'}>
                        {viewMode === 'list' ? (
                          (() => {
                            const holdingData = calcHoldingData(f);
                            return (
                              <>
                                <div className="table-cell name-cell">
                                  <button
                                    className={`icon-button fav-button ${favorites.has(f.code) ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(f.code);
                                    }}
                                    title={favorites.has(f.code) ? "取消自选" : "添加自选"}
                                  >
                                    <StarIcon width="16" height="16" filled={favorites.has(f.code)} />
                                  </button>
                                  <span className="list-name-text" title={f.name}>{f.name}</span>
                                </div>
                                <div className="table-cell text-right change-cell">
                                  <span className={f.estPricedCoverage > 0.05 ? (f.estGszzl > 0 ? 'up' : f.estGszzl < 0 ? 'down' : '') : (Number(f.gszzl) > 0 ? 'up' : Number(f.gszzl) < 0 ? 'down' : '')} style={{ fontWeight: 700 }}>
                                    {f.estPricedCoverage > 0.05 ? `${f.estGszzl > 0 ? '+' : ''}${f.estGszzl.toFixed(2)}%` : (typeof f.gszzl === 'number' ? `${f.gszzl > 0 ? '+' : ''}${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—')}
                                  </span>
                                </div>
                                {/* 净值列 */}
                                <div className="table-cell text-right nav-cell">
                                  <span style={{ fontWeight: 600 }}>
                                    {f.dwjz ? parseFloat(f.dwjz).toFixed(4) : '—'}
                                  </span>
                                </div>
                                {/* 成本净值列 */}
                                <div className="table-cell text-right cost-nav-cell">
                                  {holdingData && holdingData.costPrice > 0 ? (
                                    <span style={{ fontWeight: 600 }}>
                                      {holdingData.costPrice.toFixed(4)}
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                {/* 昨日金额列 */}
                                <div className="table-cell text-right yesterday-value-cell">
                                  {holdingData ? (
                                    <span style={{ fontWeight: 600 }}>
                                      {(holdingData.shares * parseFloat(f.dwjz || 0)).toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                {/* 预估金额列 */}
                                <div className="table-cell text-right estimate-value-cell">
                                  {holdingData ? (
                                    <span className={holdingData.dayProfit > 0 ? 'up' : holdingData.dayProfit < 0 ? 'down' : ''} style={{ fontWeight: 600 }}>
                                      {holdingData.marketValue.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                {/* 今日盈亏列 */}
                                <div className="table-cell text-right holding-profit-cell">
                                  {holdingData ? (
                                    <span className={holdingData.dayProfit > 0 ? 'up' : holdingData.dayProfit < 0 ? 'down' : ''} style={{ fontWeight: 600 }}>
                                      {holdingData.dayProfit > 0 ? '+' : ''}{holdingData.dayProfit.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                {/* 累计盈亏列 */}
                                <div className="table-cell text-right total-profit-cell">
                                  {holdingData && holdingData.costValue > 0 ? (
                                    <span className={holdingData.profit > 0 ? 'up' : holdingData.profit < 0 ? 'down' : ''} style={{ fontWeight: 600 }}>
                                      {holdingData.profit > 0 ? '+' : ''}{holdingData.profit.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                {/* 收益率列 */}
                                <div className="table-cell text-right profit-rate-cell">
                                  {holdingData && holdingData.costValue > 0 ? (
                                    <span className={holdingData.profitRate > 0 ? 'up' : holdingData.profitRate < 0 ? 'down' : ''} style={{ fontWeight: 600 }}>
                                      {holdingData.profitRate > 0 ? '+' : ''}{holdingData.profitRate.toFixed(2)}%
                                    </span>
                                  ) : (
                                    <span className="muted">—</span>
                                  )}
                                </div>
                                <div className="table-cell text-center action-cell">
                                  <button
                                    className="icon-button"
                                    onClick={() => setChartFund(f)}
                                    title="查看走势"
                                    style={{ width: '28px', height: '28px' }}
                                  >
                                    <ChartIcon width="14" height="14" />
                                  </button>
                                  <button
                                    className="icon-button"
                                    onClick={() => setEditingFund(f)}
                                    title="编辑持仓"
                                    style={{ width: '28px', height: '28px' }}
                                  >
                                    <EditIcon width="14" height="14" />
                                  </button>
                                  <button
                                    className="icon-button danger"
                                    onClick={() => removeFund(f.code)}
                                    title="删除"
                                    style={{ width: '28px', height: '28px' }}
                                  >
                                    <TrashIcon width="14" height="14" />
                                  </button>
                                </div>
                              </>
                            );
                          })()
                        ) : (
                          <>
                          <div className="row" style={{ marginBottom: 10 }}>
                            <div className="title">
                              <button
                                className={`icon-button fav-button ${favorites.has(f.code) ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(f.code);
                                }}
                                title={favorites.has(f.code) ? "取消自选" : "添加自选"}
                              >
                                <StarIcon width="18" height="18" filled={favorites.has(f.code)} />
                              </button>
                              <div className="title-text">
                                <span>{f.name}</span>
                                <span className="muted">#{f.code}</span>
                              </div>
                            </div>

                            <div className="actions">
                              <div className="badge-v">
                                <span>估值时间</span>
                                <strong>{f.gztime || f.time || '-'}</strong>
                              </div>
                              <button
                                className="icon-button"
                                onClick={() => setChartFund(f)}
                                title="查看走势"
                              >
                                <ChartIcon width="18" height="18" />
                              </button>
                              <button
                                className="icon-button"
                                onClick={() => setEditingFund(f)}
                                title="编辑持仓"
                              >
                                <EditIcon width="18" height="18" />
                              </button>
                              <button
                                className="icon-button danger"
                                onClick={() => removeFund(f.code)}
                                title="删除"
                              >
                                <TrashIcon width="18" height="18" />
                              </button>
                            </div>
                          </div>

                          <div className="row" style={{ marginBottom: 12 }}>
                            <Stat label="单位净值" value={f.dwjz ?? '—'} />
                            <Stat label="估值净值" value={f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—')} />
                            <Stat
                              label="涨跌幅"
                              value={f.estPricedCoverage > 0.05 ? `${f.estGszzl > 0 ? '+' : ''}${f.estGszzl.toFixed(2)}%` : (typeof f.gszzl === 'number' ? `${f.gszzl > 0 ? '+' : ''}${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—')}
                              delta={f.estPricedCoverage > 0.05 ? f.estGszzl : (Number(f.gszzl) || 0)}
                            />
                          </div>

                          {/* 持仓信息 */}
                          {(() => {
                            const holdingData = calcHoldingData(f);
                            if (!holdingData) return null;
                            return (
                              <div className="holding-section">
                                <div className="holding-header">
                                  <WalletIcon width="14" height="14" />
                                  <span>我的持仓</span>
                                  <span className="muted" style={{ marginLeft: 'auto', fontSize: 11 }}>
                                    {holdingData.shares.toFixed(2)} 份
                                  </span>
                                </div>
                                <div className="holding-stats">
                                  <div className="holding-stat">
                                    <span className="label">市值</span>
                                    <span className="value">{holdingData.marketValue.toFixed(2)}</span>
                                  </div>
                                  <div className="holding-stat">
                                    <span className="label">今日盈亏</span>
                                    <span className={`value ${holdingData.dayProfit > 0 ? 'up' : holdingData.dayProfit < 0 ? 'down' : ''}`}>
                                      {holdingData.dayProfit > 0 ? '+' : ''}{holdingData.dayProfit.toFixed(2)}
                                    </span>
                                  </div>
                                  {holdingData.costValue > 0 && (
                                    <>
                                      <div className="holding-stat">
                                        <span className="label">累计盈亏</span>
                                        <span className={`value ${holdingData.profit > 0 ? 'up' : holdingData.profit < 0 ? 'down' : ''}`}>
                                          {holdingData.profit > 0 ? '+' : ''}{holdingData.profit.toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="holding-stat">
                                        <span className="label">收益率</span>
                                        <span className={`value ${holdingData.profitRate > 0 ? 'up' : holdingData.profitRate < 0 ? 'down' : ''}`}>
                                          {holdingData.profitRate > 0 ? '+' : ''}{holdingData.profitRate.toFixed(2)}%
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                          {f.estPricedCoverage > 0.05 && (
                            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: -8, marginBottom: 10, textAlign: 'right' }}>
                              基于 {Math.round(f.estPricedCoverage * 100)}% 持仓估算
                            </div>
                          )}
                          <div
                            style={{ marginBottom: 8, cursor: 'pointer', userSelect: 'none' }}
                            className="title"
                            onClick={() => toggleCollapse(f.code)}
                          >
                            <div className="row" style={{ width: '100%', flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>前10重仓股票</span>
                                <ChevronIcon
                                  width="16"
                                  height="16"
                                  className="muted"
                                  style={{
                                    transform: collapsedCodes.has(f.code) ? 'rotate(-90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                  }}
                                />
                              </div>
                              <span className="muted">涨跌幅 / 占比</span>
                            </div>
                          </div>
                          <AnimatePresence>
                            {!collapsedCodes.has(f.code) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                              >
                                {Array.isArray(f.holdings) && f.holdings.length ? (
                                  <div className="list">
                                    {f.holdings.map((h, idx) => (
                                      <div className="item" key={idx}>
                                        <span className="name">{h.name}</span>
                                        <div className="values">
                                          {typeof h.change === 'number' && (
                                            <span className={`badge ${h.change > 0 ? 'up' : h.change < 0 ? 'down' : ''}`} style={{ marginRight: 8 }}>
                                              {h.change > 0 ? '+' : ''}{h.change.toFixed(2)}%
                                            </span>
                                          )}
                                          <span className="weight">{h.weight}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="muted" style={{ padding: '8px 0' }}>暂无重仓数据</div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="footer">
        <p>数据源：实时估值与重仓直连东方财富，仅供个人学习及参考使用。数据可能存在延迟，不作为任何投资建议
        </p>
        <p>注：估算数据与真实结算数据会有1%左右误差</p>
      </div>

      <AnimatePresence>
        {editingFund && (
          <EditHoldingModal
            key={editingFund.code}
            fund={editingFund}
            holding={holdings[editingFund.code]}
            onSave={(data) => saveHolding(editingFund.code, data)}
            onClose={() => setEditingFund(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {importModalOpen && (
          <ImportScreenshotModal
            existingFunds={funds}
            onImport={handleImportFromScreenshot}
            onClose={() => setImportModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chartFund && (
          <FundChartModal
            fund={chartFund}
            holding={holdings[chartFund.code]}
            intradayData={intradayRecords[chartFund.code]?.records || []}
            onClose={() => setChartFund(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {portfolioChartOpen && (
          <PortfolioChartModal
            funds={funds}
            holdings={holdings}
            onClose={() => setPortfolioChartOpen(false)}
          />
        )}
      </AnimatePresence>

      {settingsOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="设置" onClick={() => setSettingsOpen(false)}>
          <div className="glass card modal" onClick={(e) => e.stopPropagation()}>
            <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SettingsIcon width="20" height="20" />
                <span>设置</span>
              </div>
              <button className="icon-button" onClick={() => setSettingsOpen(false)} style={{ border: 'none', background: 'transparent' }}>
                <CloseIcon width="20" height="20" />
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <div className="muted" style={{ marginBottom: 8, fontSize: '0.8rem' }}>刷新频率</div>
              <div className="chips" style={{ marginBottom: 12 }}>
                {[10, 30, 60, 120, 300].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${tempSeconds === s ? 'active' : ''}`}
                    onClick={() => setTempSeconds(s)}
                    aria-pressed={tempSeconds === s}
                  >
                    {s} 秒
                  </button>
                ))}
              </div>
              <input
                className="input"
                type="number"
                min="5"
                step="5"
                value={tempSeconds}
                onChange={(e) => setTempSeconds(Number(e.target.value))}
                placeholder="自定义秒数"
              />
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

            <div className="form-group" style={{ marginBottom: 16 }}>
              <div className="muted" style={{ marginBottom: 12, fontSize: '0.8rem' }}>数据管理</div>
              <div className="muted" style={{ marginBottom: 12, fontSize: '12px', lineHeight: 1.5 }}>
                导出数据可保存到 iCloud Drive，在其他设备导入即可同步
              </div>
              <div className="row" style={{ gap: 12 }}>
                <button 
                  className="button data-button" 
                  onClick={exportData}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <DownloadIcon width="18" height="18" />
                  <span>导出数据</span>
                </button>
                <button 
                  className="button data-button" 
                  onClick={() => importFileRef.current?.click()}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  <FolderIcon width="18" height="18" />
                  <span>导入数据</span>
                </button>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="muted" style={{ marginTop: 8, fontSize: '11px' }}>
                当前共 {funds.length} 只基金，{Object.keys(holdings).filter(k => holdings[k]?.shares > 0).length} 只有持仓
              </div>
            </div>

            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="button" onClick={saveSettings}>保存并关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 操作记录管理（独立模块） */}
      <OperationManager
        isOpen={operationManagerOpen}
        onClose={() => setOperationManagerOpen(false)}
        fundList={funds}
        holdings={holdings}
        onUpdateHolding={(code, newShares) => {
          setHoldings(prev => {
            const current = prev[code] || {};
            const next = {
              ...prev,
              [code]: {
                ...current,
                shares: newShares
              }
            };
            localStorage.setItem('holdings', JSON.stringify(next));
            return next;
          });
        }}
      />
    </div>
  );
}
