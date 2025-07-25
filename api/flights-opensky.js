// OpenSky Network APIを使用したリアルタイムフライトデータ取得
// 無料で利用可能、制限: 10秒に1リクエスト（匿名ユーザー）

const airlineMap = {
  // ICAOコードとIATAコードの両方でマッピング
  // 韓国系
  'KAL': { name: '大韓航空', logo: 'KE', iata: 'KE' },
  'KE': { name: '大韓航空', logo: 'KE', iata: 'KE' },
  'AAR': { name: 'アシアナ航空', logo: 'OZ', iata: 'OZ' },
  'OZ': { name: 'アシアナ航空', logo: 'OZ', iata: 'OZ' },
  'TWB': { name: 'ティーウェイ航空', logo: 'TW', iata: 'TW' },
  'JJA': { name: 'チェジュ航空', logo: '7C', iata: '7C' },
  'JNA': { name: 'ジンエアー', logo: 'LJ', iata: 'LJ' },
  'ABL': { name: 'エアプサン', logo: 'BX', iata: 'BX' },
  'ESR': { name: 'イースター航空', logo: 'ZE', iata: 'ZE' },
  'RSQ': { name: 'エアソウル', logo: 'RS', iata: 'RS' },
  // 中国系
  'CES': { name: '中国東方航空', logo: 'MU', iata: 'MU' },
  'CCA': { name: '中国国際航空', logo: 'CA', iata: 'CA' },
  'CSC': { name: '四川航空', logo: '3U', iata: '3U' },
  'CSN': { name: '中国南方航空', logo: 'CZ', iata: 'CZ' },
  'CQH': { name: '春秋航空', logo: '9C', iata: '9C' },
  'CSH': { name: '上海航空', logo: 'FM', iata: 'FM' },
  'CDG': { name: '山東航空', logo: 'SC', iata: 'SC' },
  'CXA': { name: '厦門航空', logo: 'MF', iata: 'MF' },
  'CHH': { name: '海南航空', logo: 'HU', iata: 'HU' },
  'DKH': { name: '吉祥航空', logo: 'HO', iata: 'HO' },
  // 台湾系
  'CAL': { name: 'チャイナエアライン', logo: 'CI', iata: 'CI' },
  'EVA': { name: 'エバー航空', logo: 'BR', iata: 'BR' },
  'TTW': { name: 'タイガーエア台湾', logo: 'IT', iata: 'IT' },
  'SJX': { name: 'スターラックス航空', logo: 'JX', iata: 'JX' },
  // 香港系
  'CPA': { name: 'キャセイパシフィック', logo: 'CX', iata: 'CX' },
  'HDA': { name: '香港エクスプレス', logo: 'UO', iata: 'UO' },
  'CRK': { name: '香港航空', logo: 'HX', iata: 'HX' },
  // 東南アジア系
  'THA': { name: 'タイ国際航空', logo: 'TG', iata: 'TG' },
  'PAL': { name: 'フィリピン航空', logo: 'PR', iata: 'PR' },
  'CEB': { name: 'セブパシフィック', logo: '5J', iata: '5J' },
  'VJC': { name: 'ベトジェット', logo: 'VJ', iata: 'VJ' },
  'HVN': { name: 'ベトナム航空', logo: 'VN', iata: 'VN' },
  'SIA': { name: 'シンガポール航空', logo: 'SQ', iata: 'SQ' },
  'SJY': { name: 'スクート', logo: 'TR', iata: 'TR' },
  'MAS': { name: 'マレーシア航空', logo: 'MH', iata: 'MH' },
  'AXM': { name: 'エアアジア', logo: 'AK', iata: 'AK' },
  // 日本系
  'JAL': { name: '日本航空', logo: 'JL', iata: 'JL' },
  'ANA': { name: '全日空', logo: 'NH', iata: 'NH' },
  'JJP': { name: 'ジェットスター・ジャパン', logo: 'GK', iata: 'GK' },
  'APJ': { name: 'ピーチ', logo: 'MM', iata: 'MM' },
  // その他
  'UAE': { name: 'エミレーツ航空', logo: 'EK', iata: 'EK' },
  'QTR': { name: 'カタール航空', logo: 'QR', iata: 'QR' },
  'FDX': { name: 'フェデックス', logo: 'FX', iata: 'FX' },
  'UPS': { name: 'UPS', logo: '5X', iata: '5X' }
};

// 福岡空港のバウンディングボックス（緯度経度）
const FUK_BOUNDS = {
  latMin: 33.5,
  latMax: 33.7,
  lonMin: 130.3,
  lonMax: 130.5
};

async function getOpenSkyFlights() {
  try {
    // OpenSky Network API - 福岡空港周辺のフライトを取得
    const url = `https://opensky-network.org/api/states/all?lamin=${FUK_BOUNDS.latMin}&lomin=${FUK_BOUNDS.lonMin}&lamax=${FUK_BOUNDS.latMax}&lomax=${FUK_BOUNDS.lonMax}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FukuokaAirportDisplay/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.states || data.states.length === 0) {
      return null;
    }
    
    // データをフォーマット
    const flights = data.states.map(state => {
      const [
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source
      ] = state;
      
      // コールサインから航空会社を識別
      const trimmedCallsign = callsign ? callsign.trim() : '';
      const airlineCode = trimmedCallsign.substring(0, 3).toUpperCase();
      
      // デバッグ用ログ
      if (trimmedCallsign) {
        console.log(`Callsign: ${trimmedCallsign}, Airline Code: ${airlineCode}`);
      }
      
      // IATAコードでのマッピングも試す
      const airline = airlineMap[airlineCode] || 
                     Object.values(airlineMap).find(a => a.iata === trimmedCallsign.substring(0, 2)) ||
                     { name: airlineCode, logo: '✈️', iata: airlineCode };
      
      // フライト番号を抽出
      const flightNumber = callsign ? callsign.trim() : 'N/A';
      
      // 地上にいるかどうかで出発/到着を判定
      const status = on_ground ? '到着' : '飛行中';
      
      return {
        icao24,
        callsign: flightNumber,
        airline: airline.name,
        airlineCode: airline.iata,
        airlineLogo: airline.logo,
        origin_country,
        latitude,
        longitude,
        altitude: baro_altitude || geo_altitude || 0,
        velocity: velocity || 0,
        on_ground,
        status,
        last_contact: new Date(last_contact * 1000)
      };
    });
    
    return flights;
  } catch (error) {
    console.error('OpenSky API error:', error);
    return null;
  }
}

// 実際の福岡空港のスケジュールと組み合わせる
function mergeWithSchedule(openSkyData, type) {
  // ここで実際のスケジュールデータと組み合わせる
  // 現在は OpenSky のデータのみを使用
  
  const now = new Date();
  const jstOffset = 9 * 60;
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  
  if (!openSkyData || openSkyData.length === 0) {
    return [];
  }
  
  // フライトを出発/到着で分類
  const flights = openSkyData
    .filter(flight => {
      if (type === 'departure') {
        return flight.on_ground && flight.velocity > 10; // 地上で移動中（出発準備）
      } else {
        return !flight.on_ground && flight.altitude < 3000; // 低高度で飛行中（着陸接近）
      }
    })
    .map(flight => ({
      time: new Date(flight.last_contact).toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false,
        timeZone: 'Asia/Tokyo'
      }),
      airline: flight.airline,
      airlineCode: flight.airlineCode,
      airlineLogo: flight.airlineLogo,
      flightNo: flight.callsign,
      destination: type === 'departure' ? '確認中' : flight.origin_country,
      origin: type === 'arrival' ? flight.origin_country : '福岡',
      gate: '-',
      status: flight.status,
      altitude: Math.round(flight.altitude * 3.28084), // メートルをフィートに変換
      velocity: Math.round(flight.velocity * 3.6) // m/sをkm/hに変換
    }))
    .slice(0, 15);
  
  return flights;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  
  const type = req.query.type || 'departure';
  
  // OpenSky Network APIからデータ取得
  const openSkyData = await getOpenSkyFlights();
  
  if (openSkyData && openSkyData.length > 0) {
    const flights = mergeWithSchedule(openSkyData, type);
    
    res.json({
      flights,
      lastUpdated: new Date().toISOString(),
      type,
      source: 'opensky-live',
      debug: {
        totalAircraft: openSkyData.length,
        filtered: flights.length
      }
    });
  } else {
    // フォールバック: 既存のシミュレーションデータ
    const { generateRealtimeFlights } = require('./flights-realtime');
    res.json({
      flights: generateRealtimeFlights(type),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'simulation-fallback'
    });
  }
};