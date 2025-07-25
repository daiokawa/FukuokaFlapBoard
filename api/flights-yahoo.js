// Yahoo!運行情報を使用したフライトデータ取得
// APIキー不要で無料

async function getYahooFlightStatus() {
  try {
    // Yahoo!運行情報のフライト情報ページ
    // 福岡空港のページをフェッチ
    const response = await fetch('https://transit.yahoo.co.jp/airport/domestic/FUK/');
    
    if (!response.ok) {
      throw new Error('Yahoo API request failed');
    }
    
    // HTMLをパース（サーバーサイドでは動作しない）
    // 代替案：RSS フィードを使用
    const rssResponse = await fetch('https://transit.yahoo.co.jp/traininfo/rss/airplane.xml');
    
    if (rssResponse.ok) {
      const rssText = await rssResponse.text();
      // RSSをパースして遅延情報を抽出
      const delays = parseRSS(rssText);
      return delays;
    }
  } catch (error) {
    console.error('Yahoo API error:', error);
    return null;
  }
}

// NavitimeのAPIを使用
async function getNavitimeFlights() {
  try {
    // Navitimeの空港運航状況API（公開されている）
    const response = await fetch('https://www.navitime.co.jp/airstate/airway/FUK/jp/');
    
    if (!response.ok) {
      throw new Error('Navitime API request failed');
    }
    
    // データを返す
    return response.json();
  } catch (error) {
    console.error('Navitime API error:', error);
    return null;
  }
}

// 実は最も確実な方法：各航空会社の運航状況ページを直接チェック
const airlineStatusPages = {
  'JAL': 'https://www.jal.co.jp/cms/other/ja/weather_info_dom.html',
  'ANA': 'https://www.ana.co.jp/fs/dom/jp/',
  'KE': 'https://www.koreanair.com/flights/status',
  'OZ': 'https://flyasiana.com/C/JP/JA/contents/flight-status',
  'CI': 'https://www.china-airlines.com/jp/jp/fly/flight-status',
  'BR': 'https://www.evaair.com/ja-jp/flight-status/',
  'CX': 'https://www.cathaypacific.com/cx/ja_JP/manage-booking/flight-status.html'
};

// Google Flights API（非公式）
async function getGoogleFlightsData() {
  try {
    // Google Flightsの内部APIエンドポイント
    const params = new URLSearchParams({
      'hl': 'ja',
      'gl': 'jp',
      'departure_airport': 'FUK',
      'arrival_airport': 'all',
      'departure_date': new Date().toISOString().split('T')[0]
    });
    
    const response = await fetch(`https://www.google.com/flights/api/search?${params}`);
    
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Google Flights API error:', error);
    return null;
  }
}

// FlightRadar24の非公式API
async function getFlightRadar24Data() {
  try {
    // FlightRadar24のAPIエンドポイント（リバースエンジニアリング）
    const response = await fetch('https://api.flightradar24.com/common/v1/airport.json?code=FUK&plugin[]=schedule&plugin[]=details&page=1&limit=100&token=');
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.result && data.result.response && data.result.response.airport) {
        const schedule = data.result.response.airport.pluginData.schedule;
        
        // 出発便と到着便を処理
        const departures = schedule.departures.data || [];
        const arrivals = schedule.arrivals.data || [];
        
        return { departures, arrivals };
      }
    }
  } catch (error) {
    console.error('FlightRadar24 API error:', error);
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  const type = req.query.type || 'departure';
  
  // FlightRadar24から取得を試みる（最も信頼性が高い）
  const fr24Data = await getFlightRadar24Data();
  
  if (fr24Data) {
    const flights = type === 'departure' ? fr24Data.departures : fr24Data.arrivals;
    
    // FlightRadar24のデータをアプリのフォーマットに変換
    const formattedFlights = flights.map(flight => ({
      time: new Date(flight.flight.time.scheduled.departure * 1000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
      airline: flight.flight.airline.name,
      airlineCode: flight.flight.airline.code.iata,
      flightNo: flight.flight.identification.number.default,
      destination: flight.flight.airport.destination.name,
      gate: flight.flight.airport.destination.info.gate || '-',
      status: flight.flight.status.generic.status.text,
      scheduled: new Date(flight.flight.time.scheduled.departure * 1000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
      actual: flight.flight.time.real?.departure ? new Date(flight.flight.time.real.departure * 1000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }) : null
    }));
    
    res.json({
      flights: formattedFlights.slice(0, 15),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'flightradar24-live'
    });
  } else {
    // フォールバック
    const { generateRealtimeFlights } = require('./flights-realtime');
    res.json({
      flights: generateRealtimeFlights(type),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'simulation'
    });
  }
};