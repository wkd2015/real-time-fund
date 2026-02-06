/**
 * 市场数据代理 API
 * 解决浏览器端跨域请求问题
 */

import { NextResponse } from 'next/server';

// GBK 解码函数
function decodeGBK(buffer) {
  try {
    const decoder = new TextDecoder('gbk');
    return decoder.decode(buffer);
  } catch (e) {
    // 如果不支持 gbk，尝试 gb2312
    try {
      const decoder = new TextDecoder('gb2312');
      return decoder.decode(buffer);
    } catch (e2) {
      // 最后回退到 utf-8
      return new TextDecoder('utf-8').decode(buffer);
    }
  }
}

// A股涨跌家数（使用东方财富接口）
async function fetchMarketStats() {
  try {
    // 东方财富大盘统计接口
    const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&ut=267f9ad526dbe6b0262ab19316f5246f&secids=1.000001,0.399001,0.399006&_=' + Date.now();
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://quote.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await res.json();
    
    // 尝试获取涨跌统计
    // 备用方案：使用东方财富行情统计
    const statsUrl = 'https://push2ex.eastmoney.com/getTopicZDFenBu?ut=7eea3edcaed734bea9cbfc24409ed989&dession=1&_=' + Date.now();
    const statsRes = await fetch(statsUrl, {
      headers: {
        'Referer': 'https://quote.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const statsData = await statsRes.json();
    
    if (statsData && statsData.data) {
      const fenbu = statsData.data.fenbu || [];
      let up = 0, down = 0, equal = 0;
      
      fenbu.forEach(item => {
        const range = item.x; // 涨跌幅区间
        const count = item.y; // 数量
        if (range > 0) up += count;
        else if (range < 0) down += count;
        else equal += count;
      });
      
      return {
        total: up + down + equal,
        up,
        down,
        equal
      };
    }
    
    // 如果统计接口失败，返回默认值
    return { total: 0, up: 0, down: 0, equal: 0 };
  } catch (e) {
    console.error('获取涨跌家数失败', e);
    // 返回空数据而不是 null，避免整体失败
    return { total: 0, up: 0, down: 0, equal: 0 };
  }
}

// 获取指数实时行情（腾讯接口，修复编码）
async function fetchIndexQuote(indexCode) {
  try {
    // 转换代码格式：000300.SH -> sh000300
    let code = indexCode.toLowerCase();
    if (code.endsWith('.sh')) {
      code = 'sh' + code.slice(0, -3);
    } else if (code.endsWith('.sz')) {
      code = 'sz' + code.slice(0, -3);
    }
    
    const url = `http://qt.gtimg.cn/q=${code}`;
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://gu.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // 腾讯接口返回 GBK 编码，需要正确解码
    const buffer = await res.arrayBuffer();
    const text = decodeGBK(buffer);
    
    // 解析腾讯行情数据
    // 格式: v_sh000300="1~沪深300~000300~3945.12~3950.23~...~成交额~..."
    const match = text.match(/="([^"]+)"/);
    if (!match) return null;
    
    const parts = match[1].split('~');
    if (parts.length < 40) return null;
    
    return {
      code: indexCode,
      name: parts[1],
      price: parseFloat(parts[3]) || 0,
      change: parseFloat(parts[31]) || 0,
      changePct: parseFloat(parts[32]) || 0,
      volume: parseFloat(parts[6]) || 0,      // 成交量（手）
      amount: parseFloat(parts[37]) || 0,     // 成交额（万元）
      high: parseFloat(parts[33]) || 0,
      low: parseFloat(parts[34]) || 0,
      open: parseFloat(parts[5]) || 0,
      prevClose: parseFloat(parts[4]) || 0
    };
  } catch (e) {
    console.error('获取指数行情失败', e);
    return null;
  }
}

// 获取指数历史K线（用于计算5日均量）
async function fetchIndexHistory(indexCode, days = 10) {
  try {
    // 转换代码格式
    let code = indexCode.toLowerCase();
    if (code.endsWith('.sh')) {
      code = 'sh' + code.slice(0, -3);
    } else if (code.endsWith('.sz')) {
      code = 'sz' + code.slice(0, -3);
    }
    
    const url = `http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,,,${days},qfq`;
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://gu.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await res.json();
    
    // 解析K线数据
    const klines = data?.data?.[code]?.day || data?.data?.[code]?.qfqday || [];
    
    return klines.map(k => ({
      date: k[0],
      open: parseFloat(k[1]) || 0,
      close: parseFloat(k[2]) || 0,
      high: parseFloat(k[3]) || 0,
      low: parseFloat(k[4]) || 0,
      volume: parseFloat(k[5]) || 0  // 成交量
    }));
  } catch (e) {
    console.error('获取指数历史失败', e);
    return [];
  }
}

// 获取基金历史净值（天天基金接口）
async function fetchFundHistory(fundCode, days = 90) {
  try {
    const perPage = Math.min(days, 49);
    const url = `https://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=${fundCode}&page=1&per=${perPage}&rt=${Date.now()}`;
    
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://fund.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const text = await res.text();
    
    // 解析返回的 JavaScript 变量赋值
    // 格式: var apidata={ content:"<table>...</table>", ... }
    const contentMatch = text.match(/content:"([^"]+)"/);
    if (!contentMatch) {
      return [];
    }
    
    const html = contentMatch[1];
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
  } catch (e) {
    console.error('获取基金历史失败', e);
    return [];
  }
}

// 批量获取多个基金的历史数据
async function fetchMultipleFundHistory(fundCodes, days = 90) {
  const results = {};
  
  // 串行获取，避免请求过快被限流
  for (const code of fundCodes) {
    try {
      const history = await fetchFundHistory(code, days);
      results[code] = history;
      // 间隔 200ms
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`获取基金 ${code} 历史失败`, e);
      results[code] = [];
    }
  }
  
  return results;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const codes = searchParams.get('codes'); // 逗号分隔的多个代码
  const days = parseInt(searchParams.get('days')) || 10;
  
  try {
    let result = null;
    
    switch (type) {
      case 'market-stats':
        result = await fetchMarketStats();
        break;
      case 'index-quote':
        if (!code) {
          return NextResponse.json({ error: '缺少 code 参数' }, { status: 400 });
        }
        result = await fetchIndexQuote(code);
        break;
      case 'index-history':
        if (!code) {
          return NextResponse.json({ error: '缺少 code 参数' }, { status: 400 });
        }
        result = await fetchIndexHistory(code, days);
        break;
      case 'fund-history':
        if (!code) {
          return NextResponse.json({ error: '缺少 code 参数' }, { status: 400 });
        }
        result = await fetchFundHistory(code, days);
        break;
      case 'funds-history':
        if (!codes) {
          return NextResponse.json({ error: '缺少 codes 参数' }, { status: 400 });
        }
        const fundCodes = codes.split(',').map(c => c.trim()).filter(Boolean);
        if (fundCodes.length === 0) {
          return NextResponse.json({ error: 'codes 参数无效' }, { status: 400 });
        }
        result = await fetchMultipleFundHistory(fundCodes, days);
        break;
      default:
        return NextResponse.json({ error: '未知的 type 参数' }, { status: 400 });
    }
    
    if (result === null) {
      return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
    }
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('API 错误', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
