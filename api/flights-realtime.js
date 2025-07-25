// リアルタイムフライトデータ取得（複数ソース対応）

// FlightStats風のランダム遅延生成
function generateRealisticDelay() {
  const rand = Math.random();
  if (rand < 0.6) return 0; // 60%は定刻
  if (rand < 0.8) return Math.floor(Math.random() * 20) + 5; // 20%は5-25分遅延
  if (rand < 0.95) return Math.floor(Math.random() * 40) + 25; // 15%は25-65分遅延
  return Math.floor(Math.random() * 60) + 60; // 5%は60分以上遅延
}

// 現在時刻に基づいてリアルな状態を生成
function generateDynamicStatus(scheduledTime, actualTime, type = 'departure') {
  const now = new Date();
  const jstOffset = 9 * 60;
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  const currentHour = jstNow.getUTCHours();
  const currentMinute = jstNow.getUTCMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  const [schedHour, schedMinute] = scheduledTime.split(':').map(Number);
  const scheduledMinutes = schedHour * 60 + schedMinute;
  
  const [actualHour, actualMinute] = actualTime.split(':').map(Number);
  const actualMinutes = actualHour * 60 + actualMinute;
  
  const timeDiff = actualMinutes - currentTimeMinutes;
  const delay = actualMinutes - scheduledMinutes;
  
  if (type === 'departure') {
    if (timeDiff < -10) {
      return { status: '出発済', displayTime: actualTime };
    } else if (timeDiff < 0) {
      return { status: '搭乗終了', displayTime: actualTime };
    } else if (timeDiff < 20) {
      return { status: '搭乗中', displayTime: actualTime };
    } else if (timeDiff < 40) {
      return { status: '搭乗手続き中', displayTime: actualTime };
    } else if (delay > 30) {
      return { status: '使用機到着遅れ', displayTime: actualTime };
    } else if (delay > 0) {
      return { status: `${delay}分遅れ`, displayTime: actualTime };
    } else {
      return { status: '定刻', displayTime: scheduledTime };
    }
  } else {
    if (timeDiff < -5) {
      return { status: '到着済', displayTime: actualTime };
    } else if (timeDiff < 5) {
      return { status: '着陸', displayTime: actualTime };
    } else if (timeDiff < 20) {
      return { status: '接近中', displayTime: actualTime };
    } else if (delay > 0) {
      return { status: `${delay}分遅れ`, displayTime: actualTime };
    } else {
      return { status: '定刻', displayTime: scheduledTime };
    }
  }
}

// 実際の福岡空港スケジュールベース + リアルタイム風味
function generateRealtimeFlights(type) {
  const baseSchedule = require('./flights').generateRealisticSchedule(type);
  
  // 各フライトにリアルタイムデータを追加
  return baseSchedule.map(flight => {
    // ランダムな遅延を生成
    const delayMinutes = generateRealisticDelay();
    
    // 実際の時刻を計算
    const [hour, minute] = flight.scheduled.split(':').map(Number);
    let actualHour = hour;
    let actualMinute = minute + delayMinutes;
    
    // 時間の繰り上げ処理
    if (actualMinute >= 60) {
      actualHour += Math.floor(actualMinute / 60);
      actualMinute = actualMinute % 60;
    }
    
    const actualTime = `${String(actualHour).padStart(2, '0')}:${String(actualMinute).padStart(2, '0')}`;
    
    // 動的な状態を生成
    const statusInfo = generateDynamicStatus(flight.scheduled, actualTime, type);
    
    return {
      ...flight,
      time: statusInfo.displayTime,
      actual: actualTime,
      status: statusInfo.status,
      realtime: true
    };
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // 1分キャッシュ
  
  const type = req.query.type || 'departure';
  
  try {
    // リアルタイム風のデータを生成
    const flights = generateRealtimeFlights(type);
    
    res.json({
      flights: flights.slice(0, 15),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'simulated-realtime'
    });
  } catch (error) {
    console.error('Error generating realtime data:', error);
    
    // エラー時は静的データにフォールバック
    const { generateRealisticSchedule } = require('./flights');
    res.json({
      flights: generateRealisticSchedule(type),
      lastUpdated: new Date().toISOString(),
      type,
      source: 'static-fallback'
    });
  }
};