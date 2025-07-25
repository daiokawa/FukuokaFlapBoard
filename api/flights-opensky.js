// OpenSky Network APIを使用したリアルタイムフライトデータ取得
// 無料で利用可能、制限: 10秒に1リクエスト（匿名ユーザー）

const airlineMap = {
  // 韓国系
  'KAL': { name: '大韓航空', logo: '🇰🇷', iata: 'KE' },
  'AAR': { name: 'アシアナ航空', logo: '🇰🇷', iata: 'OZ' },
  'TWB': { name: 'ティーウェイ航空', logo: '🇰🇷', iata: 'TW' },
  'JJA': { name: 'チェジュ航空', logo: '🇰🇷', iata: '7C' },
  'JNA': { name: 'ジンエアー', logo: '🇰🇷', iata: 'LJ' },
  'ABL': { name: 'エアプサン', logo: '🇰🇷', iata: 'BX' },
  'ESR': { name: 'イースター航空', logo: '🇰🇷', iata: 'ZE' },
  'RSQ': { name: 'エアソウル', logo: '🇰🇷', iata: 'RS' },
  // 中国系
  'CES': { name: '中国東方航空', logo: '🇨🇳', iata: 'MU' },
  'CCA': { name: '中国国際航空', logo: '🇨🇳', iata: 'CA' },
  'CSC': { name: '四川航空', logo: '🇨🇳', iata: '3U' },
  'CSN': { name: '中国南方航空', logo: '🇨🇳', iata: 'CZ' },
  'CQH': { name: '春秋航空', logo: '🇨🇳', iata: '9C' },
  'CSH': { name: '上海航空', logo: '🇨🇳', iata: 'FM' },
  'CDG': { name: '山東航空', logo: '🇨🇳', iata: 'SC' },
  'CXA': { name: '厦門航空', logo: '🇨🇳', iata: 'MF' },
  'CHH': { name: '海南航空', logo: '🇨🇳', iata: 'HU' },
  'DKH': { name: '吉祥航空', logo: '🇨🇳', iata: 'HO' },
  // 台湾系
  'CAL': { name: 'チャイナエアライン', logo: '🇹🇼', iata: 'CI' },
  'EVA': { name: 'エバー航空', logo: '🇹🇼', iata: 'BR' },
  'TTW': { name: 'タイガーエア台湾', logo: '🇹🇼', iata: 'IT' },
  'SJX': { name: 'スターラックス航空', logo: '🇹🇼', iata: 'JX' },
  // 香港系
  'CPA': { name: 'キャセイパシフィック', logo: '🇭🇰', iata: 'CX' },
  'HDA': { name: '香港エクスプレス', logo: '🇭🇰', iata: 'UO' },
  'CRK': { name: '香港航空', logo: '🇭🇰', iata: 'HX' },
  // 東南アジア系
  'THA': { name: 'タイ国際航空', logo: '🇹🇭', iata: 'TG' },
  'PAL': { name: 'フィリピン航空', logo: '🇵🇭', iata: 'PR' },
  'CEB': { name: 'セブパシフィック', logo: '🇵🇭', iata: '5J' },
  'VJC': { name: 'ベトジェット', logo: '🇻🇳', iata: 'VJ' },
  'HVN': { name: 'ベトナム航空', logo: '🇻🇳', iata: 'VN' },
  'SIA': { name: 'シンガポール航空', logo: '🇸🇬', iata: 'SQ' },
  'SJY': { name: 'スクート', logo: '🇸🇬', iata: 'TR' },
  'MAS': { name: 'マレーシア航空', logo: '🇲🇾', iata: 'MH' },
  'AXM': { name: 'エアアジア', logo: '🇲🇾', iata: 'AK' },
  // 日本系
  'JAL': { name: '日本航空', logo: '🇯🇵', iata: 'JL' },
  'ANA': { name: '全日空', logo: '🇯🇵', iata: 'NH' },
  'JJP': { name: 'ジェットスター・ジャパン', logo: '🇯🇵', iata: 'GK' },
  'APJ': { name: 'ピーチ', logo: '🇯🇵', iata: 'MM' },
  // その他
  'UAE': { name: 'エミレーツ航空', logo: '🇦🇪', iata: 'EK' },
  'QTR': { name: 'カタール航空', logo: '🇶🇦', iata: 'QR' },
  'FDX': { name: 'フェデックス', logo: '📦', iata: 'FX' },
  'UPS': { name: 'UPS', logo: '📦', iata: '5X' }
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
      const airlineCode = callsign ? callsign.trim().substring(0, 3) : '';
      const airline = airlineMap[airlineCode] || { name: airlineCode, logo: '✈️', iata: airlineCode };
      
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