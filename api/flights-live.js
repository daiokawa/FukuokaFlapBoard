// リアルタイムフライトデータ取得（スクレイピング版）
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function scrapeFlights() {
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.goto('https://www.fukuoka-airport.jp/flight/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // 国際線タブをクリック
    await page.click('[data-tab="international"]');
    await page.waitForTimeout(2000);
    
    // フライトデータを取得
    const flights = await page.evaluate(() => {
      const departureFlights = [];
      const arrivalFlights = [];
      
      // 出発便を取得
      document.querySelectorAll('.departure-table tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 5) {
          departureFlights.push({
            time: cells[0]?.textContent?.trim() || '',
            airline: cells[1]?.querySelector('img')?.alt || '',
            flightNo: cells[2]?.textContent?.trim() || '',
            destination: cells[3]?.textContent?.trim() || '',
            gate: cells[4]?.textContent?.trim() || '',
            status: cells[5]?.textContent?.trim() || '',
            actualTime: cells[6]?.textContent?.trim() || null
          });
        }
      });
      
      // 到着便を取得
      document.querySelectorAll('.arrival-table tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 5) {
          arrivalFlights.push({
            time: cells[0]?.textContent?.trim() || '',
            airline: cells[1]?.querySelector('img')?.alt || '',
            flightNo: cells[2]?.textContent?.trim() || '',
            origin: cells[3]?.textContent?.trim() || '',
            baggage: cells[4]?.textContent?.trim() || '',
            status: cells[5]?.textContent?.trim() || '',
            actualTime: cells[6]?.textContent?.trim() || null
          });
        }
      });
      
      return { departureFlights, arrivalFlights };
    });
    
    return flights;
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 航空会社コードマッピング
const airlineCodeMap = {
  '大韓航空': 'KE',
  'アシアナ航空': 'OZ',
  'ティーウェイ航空': 'TW',
  'ジンエアー': 'LJ',
  'チェジュ航空': '7C',
  'エアプサン': 'BX',
  'イースター航空': 'ZE',
  'エアソウル': 'RS',
  '中国東方航空': 'MU',
  '中国国際航空': 'CA',
  '春秋航空': '9C',
  '上海航空': 'FM',
  '吉祥航空': 'HO',
  'チャイナエアライン': 'CI',
  'エバー航空': 'BR',
  'タイガーエア台湾': 'IT',
  'スターラックス航空': 'JX',
  'キャセイパシフィック': 'CX',
  '香港エクスプレス': 'UO',
  '香港航空': 'HX',
  'シンガポール航空': 'SQ',
  'タイ国際航空': 'TG',
  'フィリピン航空': 'PR',
  'セブパシフィック': '5J',
  'ベトナム航空': 'VN'
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate'); // 3分キャッシュ
  
  const type = req.query.type || 'departure';
  
  // スクレイピングを試みる
  const liveData = await scrapeFlights();
  
  if (liveData) {
    // リアルタイムデータが取得できた場合
    const flights = type === 'departure' ? liveData.departureFlights : liveData.arrivalFlights;
    
    res.json({
      flights: flights.slice(0, 15),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'live-scraping'
    });
  } else {
    // スクレイピングが失敗した場合は既存のモックデータを使用
    const { generateRealisticSchedule } = require('./flights');
    res.json({
      flights: generateRealisticSchedule(type),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'mock-fallback'
    });
  }
};