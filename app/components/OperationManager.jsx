'use client';

/**
 * 操作记录管理组件
 * 完全独立，不依赖 page.jsx 的状态
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllOperations,
  addOperation,
  updateOperation,
  deleteOperation,
  exportOperations,
  importOperations
} from '../lib/operationStore';
import { downloadExport } from '../lib/exportAnalysis';

// 图标组件
function CloseIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileTextIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

// 操作编辑表单
function OperationForm({ operation, onSave, onCancel, fundList = [] }) {
  const [form, setForm] = useState({
    date: operation?.date || new Date().toISOString().slice(0, 10),
    type: operation?.type || 'buy',
    fundCode: operation?.fundCode || '',
    fundName: operation?.fundName || '',
    amount: operation?.amount || '',
    shares: operation?.shares || '',
    price: operation?.price || '',
    note: operation?.note || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.fundCode || !form.date) {
      alert('请填写基金代码和日期');
      return;
    }
    
    onSave({
      ...form,
      amount: parseFloat(form.amount) || 0,
      shares: parseFloat(form.shares) || 0,
      price: parseFloat(form.price) || 0
    });
  };

  // 自动填充基金名称
  const handleCodeChange = (code) => {
    setForm(prev => {
      const fund = fundList.find(f => f.code === code);
      return {
        ...prev,
        fundCode: code,
        fundName: fund?.name || prev.fundName
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="operation-form">
      <div className="form-row">
        <div className="form-group">
          <label>日期</label>
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label>类型</label>
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="buy">买入</option>
            <option value="sell">卖出</option>
            <option value="convert_out">转出</option>
            <option value="convert_in">转入</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>基金代码</label>
          <input
            type="text"
            className="input"
            placeholder="如 012327"
            value={form.fundCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            list="fund-list"
            required
          />
          <datalist id="fund-list">
            {fundList.map(f => (
              <option key={f.code} value={f.code}>{f.name}</option>
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label>基金名称</label>
          <input
            type="text"
            className="input"
            placeholder="可选"
            value={form.fundName}
            onChange={(e) => setForm(prev => ({ ...prev, fundName: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>金额</label>
          <input
            type="number"
            className="input"
            placeholder="买入/卖出金额"
            value={form.amount}
            onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>份额</label>
          <input
            type="number"
            className="input"
            placeholder="确认份额"
            value={form.shares}
            onChange={(e) => setForm(prev => ({ ...prev, shares: e.target.value }))}
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>净值</label>
          <input
            type="number"
            className="input"
            placeholder="确认净值"
            value={form.price}
            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
            step="0.0001"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>备注</label>
        <input
          type="text"
          className="input"
          placeholder="操作原因/想法（可选）"
          value={form.note}
          onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="button">
          保存
        </button>
      </div>
    </form>
  );
}

// 主组件
export default function OperationManager({ isOpen, onClose, fundList = [], holdings = {} }) {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOp, setEditingOp] = useState(null); // null: 关闭, {}: 新增, {id: ...}: 编辑
  const [exporting, setExporting] = useState(false);
  const importFileRef = useRef(null);

  // 加载操作记录
  useEffect(() => {
    if (isOpen) {
      loadOperations();
    }
  }, [isOpen]);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const ops = await getAllOperations();
      setOperations(ops);
    } catch (e) {
      console.error('加载操作记录失败', e);
    }
    setLoading(false);
  };

  // 保存操作
  const handleSave = async (data) => {
    try {
      if (editingOp?.id) {
        await updateOperation(editingOp.id, data);
      } else {
        await addOperation(data);
      }
      setEditingOp(null);
      loadOperations();
    } catch (e) {
      console.error('保存失败', e);
      alert('保存失败');
    }
  };

  // 删除操作
  const handleDelete = async (id) => {
    if (!confirm('确定删除这条记录？')) return;
    
    try {
      await deleteOperation(id);
      loadOperations();
    } catch (e) {
      console.error('删除失败', e);
    }
  };

  // 导出操作记录
  const handleExportOps = async () => {
    try {
      const data = await exportOperations();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `operations-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('导出失败', e);
      alert('导出失败');
    }
  };

  // 导入操作记录
  const handleImportOps = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const count = await importOperations(data, true);
      alert(`成功导入 ${count} 条记录`);
      loadOperations();
    } catch (e) {
      console.error('导入失败', e);
      alert('导入失败：' + e.message);
    }
    
    e.target.value = '';
  };

  // 导出 AI 分析数据
  const handleExportAI = async (format) => {
    setExporting(true);
    try {
      // 构建持仓数据
      const holdingsList = fundList.map(f => ({
        code: f.code,
        name: f.name,
        shares: holdings[f.code]?.shares || 0,
        costPrice: holdings[f.code]?.costPrice || 0
      })).filter(h => h.shares > 0);
      
      const filename = await downloadExport(holdingsList, format, { includeDays: 90 });
      alert(`已导出: ${filename}`);
    } catch (e) {
      console.error('导出失败', e);
      alert('导出失败：' + e.message);
    }
    setExporting(false);
  };

  if (!isOpen) return null;

  const typeLabels = {
    buy: '买入',
    sell: '卖出',
    convert_out: '转出',
    convert_in: '转入'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass card modal operation-manager-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题栏 */}
          <div className="modal-header">
            <div className="modal-title">
              <FileTextIcon width="20" height="20" />
              <span>操作记录</span>
            </div>
            <button className="icon-button" onClick={onClose}>
              <CloseIcon width="20" height="20" />
            </button>
          </div>

          {/* 工具栏 */}
          <div className="operation-toolbar">
            <button className="button" onClick={() => setEditingOp({})}>
              <PlusIcon width="16" height="16" />
              添加记录
            </button>
            <div className="toolbar-spacer" />
            <button className="button button-secondary" onClick={handleExportOps} title="导出操作记录">
              <DownloadIcon width="16" height="16" />
              导出
            </button>
            <button className="button button-secondary" onClick={() => importFileRef.current?.click()} title="导入操作记录">
              <UploadIcon width="16" height="16" />
              导入
            </button>
            <input
              ref={importFileRef}
              type="file"
              accept=".json"
              onChange={handleImportOps}
              style={{ display: 'none' }}
            />
            <div className="toolbar-divider" />
            <button 
              className="button button-primary" 
              onClick={() => handleExportAI('markdown')}
              disabled={exporting}
              title="导出 Markdown 格式，方便粘贴给 AI"
            >
              {exporting ? '导出中...' : 'AI 分析导出'}
            </button>
          </div>

          {/* 编辑表单 */}
          <AnimatePresence>
            {editingOp !== null && (
              <motion.div
                className="operation-form-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <OperationForm
                  operation={editingOp}
                  onSave={handleSave}
                  onCancel={() => setEditingOp(null)}
                  fundList={fundList}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 操作列表 */}
          <div className="operation-list">
            {loading ? (
              <div className="operation-empty">加载中...</div>
            ) : operations.length === 0 ? (
              <div className="operation-empty">
                暂无操作记录
                <br />
                <span className="muted">点击「添加记录」开始记录你的操作</span>
              </div>
            ) : (
              operations.map(op => (
                <div key={op.id} className="operation-item">
                  <div className="operation-date">{op.date}</div>
                  <div className={`operation-type ${op.type}`}>
                    {typeLabels[op.type] || op.type}
                  </div>
                  <div className="operation-fund">
                    <span className="fund-name">{op.fundName || op.fundCode}</span>
                    {op.fundName && <span className="fund-code">#{op.fundCode}</span>}
                  </div>
                  <div className="operation-details">
                    {op.amount > 0 && <span>¥{op.amount.toFixed(2)}</span>}
                    {op.shares > 0 && <span>{op.shares.toFixed(2)}份</span>}
                    {op.price > 0 && <span>@{op.price.toFixed(4)}</span>}
                  </div>
                  {op.note && <div className="operation-note">{op.note}</div>}
                  <div className="operation-actions">
                    <button className="icon-button" onClick={() => setEditingOp(op)} title="编辑">
                      <EditIcon width="14" height="14" />
                    </button>
                    <button className="icon-button danger" onClick={() => handleDelete(op.id)} title="删除">
                      <TrashIcon width="14" height="14" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
