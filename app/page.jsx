'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import Announcement from "./components/Announcement";

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
function PortfolioSummary({ funds, holdings }) {
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
      <div className="title" style={{ marginBottom: 16 }}>
        <WalletIcon width="20" height="20" />
        <span>持仓汇总</span>
        <span className="muted">共 {summary.holdingCount} 只持仓基金</span>
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

function FeedbackModal({ onClose }) {
  const [state, handleSubmit] = useForm("xdadgvjd");

  const onSubmit = (e) => {
    const form = e?.target;
    const nicknameInput = form?.elements?.namedItem?.('nickname');
    if (nicknameInput && typeof nicknameInput.value === 'string') {
      const v = nicknameInput.value.trim();
      if (!v) nicknameInput.value = '匿名';
    }
    return handleSubmit(e);
  };

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="意见反馈"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal feedback-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SettingsIcon width="20" height="20" />
            <span>意见反馈</span>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        {state.succeeded ? (
          <div className="success-message" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>🎉</div>
            <h3 style={{ marginBottom: 8 }}>感谢您的反馈！</h3>
            <p className="muted">我们已收到您的建议，会尽快查看。</p>
            <button className="button" onClick={onClose} style={{ marginTop: 24, width: '100%' }}>
              关闭
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="feedback-form">
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label htmlFor="nickname" className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
                您的昵称（可选）
              </label>
              <input
                id="nickname"
                type="text"
                name="nickname"
                className="input"
                placeholder="匿名"
                style={{ width: '100%' }}
              />
              <ValidationError prefix="Nickname" field="nickname" errors={state.errors} className="error-text" />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label htmlFor="message" className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
                反馈内容
              </label>
              <textarea
                id="message"
                name="message"
                className="input"
                required
                placeholder="请描述您遇到的问题或建议..."
                style={{ width: '100%', minHeight: '120px', padding: '12px', resize: 'vertical' }}
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="error-text" />
            </div>

            <button className="button" type="submit" disabled={state.submitting} style={{ width: '100%' }}>
              {state.submitting ? '发送中...' : '提交反馈'}
            </button>
          </form>
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

  // 全局刷新状态
  const [refreshing, setRefreshing] = useState(false);

  // 收起/展开状态
  const [collapsedCodes, setCollapsedCodes] = useState(new Set());

  // 自选状态
  const [favorites, setFavorites] = useState(new Set());
  const [currentTab, setCurrentTab] = useState('all');

  // 排序状态
  const [sortBy, setSortBy] = useState('default'); // default, name, yield, code

  // 视图模式
  const [viewMode, setViewMode] = useState('card'); // card, list

  // 反馈弹窗状态
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackNonce, setFeedbackNonce] = useState(0);

  // 持仓信息状态 { [code]: { shares: number, costPrice: number } }
  const [holdings, setHoldings] = useState({});
  const [editingFund, setEditingFund] = useState(null);

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

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape' && settingsOpen) setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

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
          </form>
          {error && <div className="muted" style={{ marginTop: 8, color: 'var(--danger)' }}>{error}</div>}
        </div>

        {/* 持仓汇总 */}
        <PortfolioSummary funds={funds} holdings={holdings} />

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
                      { id: 'marketValue', label: '市值' },
                      { id: 'profit', label: '盈亏' },
                      { id: 'name', label: '名称' },
                      { id: 'code', label: '代码' }
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
                <div className={viewMode === 'card' ? 'grid col-12' : ''} style={viewMode === 'card' ? { gridColumn: 'span 12', gap: 16 } : {}}>
                  <AnimatePresence mode="popLayout">
                    {funds
                      .filter(f => currentTab === 'all' || favorites.has(f.code))
                      .sort((a, b) => {
                        if (sortBy === 'yield') {
                          const valA = typeof a.estGszzl === 'number' ? a.estGszzl : (Number(a.gszzl) || 0);
                          const valB = typeof b.estGszzl === 'number' ? b.estGszzl : (Number(b.gszzl) || 0);
                          return valB - valA;
                        }
                        if (sortBy === 'marketValue') {
                          const hA = calcHoldingData(a);
                          const hB = calcHoldingData(b);
                          const mvA = hA?.marketValue || 0;
                          const mvB = hB?.marketValue || 0;
                          return mvB - mvA;
                        }
                        if (sortBy === 'profit') {
                          const hA = calcHoldingData(a);
                          const hB = calcHoldingData(b);
                          const pA = hA?.profit || 0;
                          const pB = hB?.profit || 0;
                          return pB - pA;
                        }
                        if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-CN');
                        if (sortBy === 'code') return a.code.localeCompare(b.code);
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
                                <StarIcon width="18" height="18" filled={favorites.has(f.code)} />
                              </button>
                              <div className="title-text">
                                <span className="name-text">{f.name}</span>
                                <span className="muted code-text">#{f.code}</span>
                              </div>
                              {holdings[f.code]?.shares > 0 && (
                                <span className="holding-badge" title={`持有 ${holdings[f.code].shares.toFixed(2)} 份`}>
                                  <WalletIcon width="12" height="12" />
                                </span>
                              )}
                            </div>
                            <div className="table-cell text-right value-cell">
                              <span style={{ fontWeight: 700 }}>{f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—')}</span>
                            </div>
                            <div className="table-cell text-right change-cell">
                              <span className={f.estPricedCoverage > 0.05 ? (f.estGszzl > 0 ? 'up' : f.estGszzl < 0 ? 'down' : '') : (Number(f.gszzl) > 0 ? 'up' : Number(f.gszzl) < 0 ? 'down' : '')} style={{ fontWeight: 700 }}>
                                {f.estPricedCoverage > 0.05 ? `${f.estGszzl > 0 ? '+' : ''}${f.estGszzl.toFixed(2)}%` : (typeof f.gszzl === 'number' ? `${f.gszzl > 0 ? '+' : ''}${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—')}
                              </span>
                            </div>
                            <div className="table-cell text-right time-cell">
                              <span className="muted" style={{ fontSize: '12px' }}>{f.gztime || f.time || '-'}</span>
                            </div>
                            <div className="table-cell text-center action-cell">
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
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          <p>
            遇到任何问题或需求建议可
            <button
              className="link-button"
              onClick={() => {
                setFeedbackNonce((n) => n + 1);
                setFeedbackOpen(true);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0 4px', textDecoration: 'underline', fontSize: 'inherit', fontWeight: 600 }}
            >
              点此提交反馈
            </button>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {feedbackOpen && (
          <FeedbackModal
            key={feedbackNonce}
            onClose={() => setFeedbackOpen(false)}
          />
        )}
      </AnimatePresence>

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

      {settingsOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="设置" onClick={() => setSettingsOpen(false)}>
          <div className="glass card modal" onClick={(e) => e.stopPropagation()}>
            <div className="title" style={{ marginBottom: 12 }}>
              <SettingsIcon width="20" height="20" />
              <span>设置</span>
              <span className="muted">配置刷新频率</span>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
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

            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="button" onClick={saveSettings}>保存并关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
