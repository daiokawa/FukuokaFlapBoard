// Vercel環境で実データを使用するための更新版サーバー実装
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { getWeather } = require('./weather');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// 航空会社コードから名前とロゴをマッピング
const airlineMap = {
  'JL': { name: '日本航空', logo: '🇯🇵' },
  'NH': { name: '全日空', logo: '🇯🇵' },
  'KE': { name: '大韓航空', logo: '🇰🇷' },
  'OZ': { name: 'アシアナ航空', logo: '🇰🇷' },
  'MU': { name: '中国東方航空', logo: '🇨🇳' },
  'CA': { name: '中国国際航空', logo: '🇨🇳' },
  'CI': { name: 'チャイナエアライン', logo: '🇹🇼' },
  'BR': { name: 'エバー航空', logo: '🇹🇼' },
  'CX': { name: 'キャセイパシフィック', logo: '🇭🇰' },
  'SQ': { name: 'シンガポール航空', logo: '🇸🇬' },
  'TG': { name: 'タイ国際航空', logo: '🇹🇭' },
  'PR': { name: 'フィリピン航空', logo: '🇵🇭' },
  'MH': { name: 'マレーシア航空', logo: '🇲🇾' },
  'GA': { name: 'ガルーダ・インドネシア', logo: '🇮🇩' },
  'VN': { name: 'ベトナム航空', logo: '🇻🇳' },
  'QR': { name: 'カタール航空', logo: '🇶🇦' },
  'EK': { name: 'エミレーツ航空', logo: '🇦🇪' },
  'DL': { name: 'デルタ航空', logo: '🇺🇸' },
  'UA': { name: 'ユナイテッド航空', logo: '🇺🇸' }
};

// 状態の日本語マッピング
const statusMap = {
  'ON TIME': '定刻',
  'BOARDING': '搭乗中',
  'DELAYED': '遅延',
  'DEPARTED': '出発済',
  'ARRIVED': '到着済',
  'GATE OPEN': 'ゲート開',
  'CHECK IN': 'チェックイン中',
  'CANCELLED': '欠航',
  'GATE CLOSED': 'ゲート閉'
};

function processFlightData(flights, type) {
  return flights.map(flight => {
    // 航空会社コードを抽出
    const airlineCode = flight.flightNo?.substring(0, 2) || '';
    const airlineInfo = airlineMap[airlineCode] || { name: flight.airline || '', logo: '✈️' };
    
    // 状態を日本語に変換
    const statusEn = flight.status || '';
    const statusJa = statusMap[statusEn] || statusEn;
    
    if (type === 'departure') {
      return {
        destination: flight.destination || '不明',
        destinationEn: flight.destination || 'UNKNOWN',
        airline: airlineInfo.name,
        airlineLogo: airlineInfo.logo,
        flightNo: flight.flightNo || '',
        time: flight.time || '',
        status: statusJa,
        statusEn: statusEn,
        gate: flight.gate || '-'
      };
    } else {
      return {
        origin: flight.origin || '不明',
        originEn: flight.origin || 'UNKNOWN',
        airline: airlineInfo.name,
        airlineLogo: airlineInfo.logo,
        flightNo: flight.flightNo || '',
        time: flight.time || '',
        status: statusJa,
        statusEn: statusEn,
        baggage: flight.baggage || '-'
      };
    }
  });
}

app.get('/api/flights', async (req, res) => {
  const type = req.query.type || 'departure';
  
  try {
    // flight-data.jsonファイルを読み込む
    const data = await fs.readFile('flight-data.json', 'utf-8');
    const flightData = JSON.parse(data);
    
    // 国際線のみフィルタリング
    const internationalFlights = flightData[type].filter(flight => {
      const dest = type === 'departure' ? flight.destination : flight.origin;
      return !dest.match(/東京|大阪|名古屋|札幌|沖縄|成田|羽田|関西|中部|新千歳|那覇/);
    });
    
    const processedFlights = processFlightData(internationalFlights.slice(0, 15), type);
    
    res.json({
      flights: processedFlights,
      lastUpdated: flightData.scrapedAt || new Date().toISOString(),
      type
    });
  } catch (error) {
    console.error('Error reading flight data:', error);
    
    // フォールバック用のモックデータ
    const { generateMockFlights } = require('./api/flights');
    res.json({
      flights: generateMockFlights(type),
      lastUpdated: new Date().toISOString(),
      type,
      error: true
    });
  }
});

app.get('/api/weather', async (req, res) => {
  const weather = await getWeather();
  res.json(weather);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to run scrape-local.js to get real flight data');
});