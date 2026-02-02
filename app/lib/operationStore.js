/**
 * 操作记录存储模块 - 使用 IndexedDB
 * 完全独立，不依赖现有代码
 */

const DB_NAME = 'FundOperationsDB';
const DB_VERSION = 1;
const STORE_NAME = 'operations';

let dbInstance = null;

/**
 * 初始化数据库
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB 打开失败');
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('fundCode', 'fundCode', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
};

/**
 * 生成唯一 ID
 */
const generateId = () => {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * 添加操作记录
 * @param {Object} operation - 操作记录
 * @param {string} operation.date - 日期 YYYY-MM-DD
 * @param {string} operation.type - 类型: buy, sell, convert
 * @param {string} operation.fundCode - 基金代码
 * @param {string} operation.fundName - 基金名称
 * @param {number} operation.amount - 金额
 * @param {number} operation.shares - 份额
 * @param {number} operation.price - 净值
 * @param {string} [operation.note] - 备注
 */
export const addOperation = async (operation) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const record = {
      id: generateId(),
      ...operation,
      createdAt: new Date().toISOString()
    };
    
    const request = store.add(record);
    
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
};

/**
 * 更新操作记录
 */
export const updateOperation = async (id, updates) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) {
        reject(new Error('记录不存在'));
        return;
      }
      
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve(updated);
      putRequest.onerror = () => reject(putRequest.error);
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * 删除操作记录
 */
export const deleteOperation = async (id) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * 获取所有操作记录
 */
export const getAllOperations = async () => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.getAll();
    
    request.onsuccess = () => {
      // 按日期降序排序
      const operations = request.result.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      resolve(operations);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * 按基金代码获取操作记录
 */
export const getOperationsByFund = async (fundCode) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('fundCode');
    
    const request = index.getAll(fundCode);
    
    request.onsuccess = () => {
      const operations = request.result.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      resolve(operations);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * 导出所有操作记录（用于同步）
 */
export const exportOperations = async () => {
  const operations = await getAllOperations();
  return {
    version: 1,
    exportTime: new Date().toISOString(),
    operations
  };
};

/**
 * 导入操作记录（用于同步）
 * @param {Object} data - 导入数据
 * @param {boolean} merge - 是否合并（true）或覆盖（false）
 */
export const importOperations = async (data, merge = true) => {
  if (!data || !data.operations || !Array.isArray(data.operations)) {
    throw new Error('无效的导入数据');
  }
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // 如果不是合并模式，先清空
    if (!merge) {
      store.clear();
    }
    
    let imported = 0;
    
    data.operations.forEach(op => {
      // 确保有 ID
      const record = {
        ...op,
        id: op.id || generateId(),
        importedAt: new Date().toISOString()
      };
      
      const request = store.put(record);
      request.onsuccess = () => imported++;
    });
    
    tx.oncomplete = () => resolve(imported);
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * 清空所有操作记录
 */
export const clearAllOperations = async () => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.clear();
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};
