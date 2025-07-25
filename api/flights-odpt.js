// 公共交通オープンデータセンター (ODPT) APIを使用したフライトデータ取得
// https://www.odpt.org/

// ODPTのAPIキーが必要（無料で取得可能）
const ODPT_API_KEY = process.env.ODPT_API_KEY || '';

// 福岡空港のコード
const FUKUOKA_AIRPORT_CODE = 'FUK';

async function getODPTFlights(type = 'departure') {
  if (!ODPT_API_KEY) {
    console.log('ODPT APIキーが設定されていません');
    return null;
  }
  
  try {
    // JALの出発/到着情報を取得
    const jalEndpoint = type === 'departure' 
      ? 'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformation'
      : 'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformation';
    
    const response = await fetch(`${jalEndpoint}?odpt:operator=odpt.Operator:JAL&acl:consumerKey=${ODPT_API_KEY}`);
    
    if (!response.ok) {
      throw new Error('ODPT API request failed');
    }
    
    const data = await response.json();
    
    // 福岡空港関連のフライトをフィルタ
    const fukuokaFlights = data.filter(flight => {
      if (type === 'departure') {
        return flight['odpt:departureAirport']?.includes(FUKUOKA_AIRPORT_CODE);
      } else {
        return flight['odpt:arrivalAirport']?.includes(FUKUOKA_AIRPORT_CODE);
      }
    });
    
    return fukuokaFlights.map(flight => ({
      airline: 'JAL',
      flightNo: flight['odpt:flightNumber'],
      destination: flight['odpt:destinationAirport'],
      origin: flight['odpt:originAirport'],
      scheduledTime: flight['odpt:scheduledDepartureTime'] || flight['odpt:scheduledArrivalTime'],
      actualTime: flight['odpt:actualDepartureTime'] || flight['odpt:actualArrivalTime'],
      status: flight['odpt:flightStatus'],
      gate: flight['odpt:gate'],
      terminal: flight['odpt:terminal']
    }));
  } catch (error) {
    console.error('ODPT API error:', error);
    return null;
  }
}

// FlightAware Community API（無料枠あり）
async function getFlightAwareData() {
  // FlightAware Community APIは無料で1日あたり500クエリまで
  const FLIGHTAWARE_API_KEY = process.env.FLIGHTAWARE_API_KEY || '';
  
  if (!FLIGHTAWARE_API_KEY) {
    return null;
  }
  
  try {
    const response = await fetch('https://aeroapi.flightaware.com/aeroapi/airports/RJFF/flights', {
      headers: {
        'x-apikey': FLIGHTAWARE_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error('FlightAware API request failed');
    }
    
    const data = await response.json();
    return data.flights;
  } catch (error) {
    console.error('FlightAware API error:', error);
    return null;
  }
}

// 航空会社の公式APIを直接呼び出す
async function getAirlineAPIs() {
  const flights = [];
  
  // Korean Air API（比較的オープン）
  try {
    const keResponse = await fetch('https://api.koreanair.com/flights/status/FUK');
    if (keResponse.ok) {
      const keData = await keResponse.json();
      flights.push(...keData);
    }
  } catch (error) {
    console.log('Korean Air API not available');
  }
  
  // Asiana Airlines
  try {
    const ozResponse = await fetch('https://flyasiana.com/api/booking/flight/status');
    if (ozResponse.ok) {
      const ozData = await ozResponse.json();
      flights.push(...ozData);
    }
  } catch (error) {
    console.log('Asiana API not available');
  }
  
  return flights;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate');
  
  const type = req.query.type || 'departure';
  
  // 複数のソースから取得を試みる
  const odpData = await getODPTFlights(type);
  const flightAwareData = await getFlightAwareData();
  const airlineData = await getAirlineAPIs();
  
  // データを統合
  let allFlights = [];
  
  if (odpData) {
    allFlights.push(...odpData);
  }
  
  if (flightAwareData) {
    allFlights.push(...flightAwareData);
  }
  
  if (airlineData) {
    allFlights.push(...airlineData);
  }
  
  if (allFlights.length > 0) {
    res.json({
      flights: allFlights.slice(0, 15),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'multiple-apis'
    });
  } else {
    // APIが利用できない場合はシミュレーションデータを返す
    const { generateRealtimeFlights } = require('./flights-realtime');
    res.json({
      flights: generateRealtimeFlights(type),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'simulation-fallback'
    });
  }
};