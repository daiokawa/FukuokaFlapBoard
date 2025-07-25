// OpenSky Network APIを使用したリアルタイムフライトデータ
// 福岡空港: RJFF, 緯度33.5859, 経度130.4509

async function getOpenSkyFlights() {
  try {
    // 福岡空港の周辺エリア（半径約50km）
    const lat_min = 33.0;
    const lat_max = 34.2;
    const lon_min = 129.8;
    const lon_max = 131.1;
    
    const response = await fetch(
      `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`
    );
    
    if (!response.ok) {
      throw new Error('OpenSky API request failed');
    }
    
    const data = await response.json();
    const flights = [];
    
    // 福岡空港に近い航空機を抽出
    if (data.states) {
      data.states.forEach(state => {
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
        
        // 地上にいる、または低高度の航空機のみ
        if (on_ground || (baro_altitude && baro_altitude < 3000)) {
          // 福岡空港により近い航空機をフィルタ
          const distance = Math.sqrt(
            Math.pow(latitude - 33.5859, 2) + 
            Math.pow(longitude - 130.4509, 2)
          );
          
          if (distance < 0.1) { // 約10km以内
            flights.push({
              callsign: callsign?.trim() || 'Unknown',
              altitude: baro_altitude || 0,
              on_ground,
              origin_country,
              latitude,
              longitude,
              velocity: velocity || 0,
              vertical_rate: vertical_rate || 0
            });
          }
        }
      });
    }
    
    return flights;
  } catch (error) {
    console.error('OpenSky API error:', error);
    return null;
  }
}

// コールサインから航空会社と便名を抽出
function parseCallsign(callsign) {
  const airlineMap = {
    'KAL': { code: 'KE', name: '大韓航空' },
    'AAR': { code: 'OZ', name: 'アシアナ航空' },
    'TWB': { code: 'TW', name: 'ティーウェイ航空' },
    'JNA': { code: 'LJ', name: 'ジンエアー' },
    'JJA': { code: '7C', name: 'チェジュ航空' },
    'ABL': { code: 'BX', name: 'エアプサン' },
    'ESR': { code: 'ZE', name: 'イースター航空' },
    'ASV': { code: 'RS', name: 'エアソウル' },
    'CES': { code: 'MU', name: '中国東方航空' },
    'CCA': { code: 'CA', name: '中国国際航空' },
    'CQH': { code: '9C', name: '春秋航空' },
    'CSH': { code: 'FM', name: '上海航空' },
    'DKH': { code: 'HO', name: '吉祥航空' },
    'CAL': { code: 'CI', name: 'チャイナエアライン' },
    'EVA': { code: 'BR', name: 'エバー航空' },
    'TTW': { code: 'IT', name: 'タイガーエア台湾' },
    'SJX': { code: 'JX', name: 'スターラックス航空' },
    'CPA': { code: 'CX', name: 'キャセイパシフィック' },
    'HKE': { code: 'UO', name: '香港エクスプレス' },
    'CRK': { code: 'HX', name: '香港航空' },
    'SIA': { code: 'SQ', name: 'シンガポール航空' },
    'THA': { code: 'TG', name: 'タイ国際航空' },
    'PAL': { code: 'PR', name: 'フィリピン航空' },
    'CEB': { code: '5J', name: 'セブパシフィック' },
    'HVN': { code: 'VN', name: 'ベトナム航空' }
  };
  
  const prefix = callsign.substring(0, 3);
  const airline = airlineMap[prefix];
  
  if (airline) {
    const flightNumber = callsign.substring(3);
    return {
      airline: airline.name,
      airlineCode: airline.code,
      flightNo: airline.code + flightNumber
    };
  }
  
  return {
    airline: 'Unknown',
    airlineCode: '',
    flightNo: callsign
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  const flights = await getOpenSkyFlights();
  
  if (flights && flights.length > 0) {
    const processedFlights = flights.map(flight => {
      const parsed = parseCallsign(flight.callsign);
      return {
        ...parsed,
        status: flight.on_ground ? '着陸' : '接近中',
        altitude: `${Math.round(flight.altitude)}m`,
        speed: `${Math.round(flight.velocity)}km/h`
      };
    });
    
    res.json({
      flights: processedFlights,
      lastUpdated: new Date().toISOString(),
      source: 'opensky-live'
    });
  } else {
    res.json({
      flights: [],
      lastUpdated: new Date().toISOString(),
      source: 'opensky-no-data'
    });
  }
};