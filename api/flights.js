// 実際の福岡空港国際線データ（2025年7月25日）

// 航空会社マッピング（拡張版）
const airlineMap = {
  // 韓国系
  'KE': { name: '大韓航空', logo: '🇰🇷', image: 'https://logo.clearbit.com/koreanair.com' },
  'OZ': { name: 'アシアナ航空', logo: '🇰🇷', image: 'https://logo.clearbit.com/flyasiana.com' },
  'TW': { name: 'ティーウェイ航空', logo: '🇰🇷', image: 'https://logo.clearbit.com/twayair.com' },
  'LJ': { name: 'ジンエアー', logo: '🇰🇷', image: 'https://logo.clearbit.com/jinair.com' },
  '7C': { name: 'チェジュ航空', logo: '🇰🇷', image: 'https://logo.clearbit.com/jejuair.net' },
  'BX': { name: 'エアプサン', logo: '🇰🇷', image: 'https://logo.clearbit.com/airbusan.com' },
  'ZE': { name: 'イースター航空', logo: '🇰🇷', image: 'https://logo.clearbit.com/eastarjet.com' },
  'RS': { name: 'エアソウル', logo: '🇰🇷', image: 'https://logo.clearbit.com/flyairseoul.com' },
  
  // 中国系
  'MU': { name: '中国東方航空', logo: '🇨🇳', image: 'https://logo.clearbit.com/ceair.com' },
  'CA': { name: '中国国際航空', logo: '🇨🇳', image: 'https://logo.clearbit.com/airchina.com' },
  '9C': { name: '春秋航空', logo: '🇨🇳', image: 'https://logo.clearbit.com/ch.com' },
  'FM': { name: '上海航空', logo: '🇨🇳', image: 'https://logo.clearbit.com/ceair.com' },
  'HO': { name: '吉祥航空', logo: '🇨🇳', image: 'https://logo.clearbit.com/juneyaoair.com' },
  
  // 台湾系
  'CI': { name: 'チャイナエアライン', logo: '🇹🇼', image: 'https://logo.clearbit.com/china-airlines.com' },
  'BR': { name: 'エバー航空', logo: '🇹🇼', image: 'https://logo.clearbit.com/evaair.com' },
  'IT': { name: 'タイガーエア台湾', logo: '🇹🇼', image: 'https://logo.clearbit.com/tigerair.com' },
  'JX': { name: 'スターラックス航空', logo: '🇹🇼', image: 'https://logo.clearbit.com/starlux-airlines.com' },
  
  // 香港
  'CX': { name: 'キャセイパシフィック', logo: '🇭🇰', image: 'https://logo.clearbit.com/cathaypacific.com' },
  'UO': { name: '香港エクスプレス', logo: '🇭🇰', image: 'https://logo.clearbit.com/hkexpress.com' },
  'HX': { name: '香港航空', logo: '🇭🇰', image: 'https://logo.clearbit.com/hongkongairlines.com' },
  
  // 東南アジア
  'SQ': { name: 'シンガポール航空', logo: '🇸🇬', image: 'https://logo.clearbit.com/singaporeair.com' },
  'TG': { name: 'タイ国際航空', logo: '🇹🇭', image: 'https://logo.clearbit.com/thaiairways.com' },
  'PR': { name: 'フィリピン航空', logo: '🇵🇭', image: 'https://logo.clearbit.com/philippineairlines.com' },
  '5J': { name: 'セブパシフィック', logo: '🇵🇭', image: 'https://logo.clearbit.com/cebupacificair.com' },
  'VN': { name: 'ベトナム航空', logo: '🇻🇳', image: 'https://logo.clearbit.com/vietnamairlines.com' },
  
  // 日本
  'JL': { name: '日本航空', logo: '🇯🇵', image: 'https://logo.clearbit.com/jal.com' },
  'NH': { name: '全日空', logo: '🇯🇵', image: 'https://logo.clearbit.com/ana.co.jp' }
};

// 実際の福岡空港フライトスケジュール
function generateRealisticSchedule(type) {
  // 日本時間（JST）で現在時刻を取得
  const now = new Date();
  const jstOffset = 9 * 60; // 日本時間はUTC+9
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  const currentHour = jstNow.getUTCHours(); // UTCメソッドを使って日本時間を取得
  const currentMinute = jstNow.getUTCMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  console.log('Current JST time:', currentHour + ':' + currentMinute, 'Total minutes:', currentTimeMinutes);
  console.log('Sample flight with delay: KE790 scheduled 16:25, actual 17:25');
  
  if (type === 'departure') {
    const departures = [
      { time: '11:00', airline: 'CI', dest: '台北/桃園', flightNo: 'CI111', gate: '58', scheduled: '11:00', actual: '11:06' },
      { time: '11:05', airline: 'KE', dest: 'プサン', flightNo: 'KE2136', gate: '56', scheduled: '11:05', actual: '10:58' },
      { time: '11:30', airline: 'OZ', dest: 'ソウル/仁川', flightNo: 'OZ131', gate: '53', scheduled: '11:30', actual: '11:23' },
      { time: '11:35', airline: 'TG', dest: 'バンコク', flightNo: 'TG649', gate: '503', scheduled: '11:35', actual: '12:14' },
      { time: '11:50', airline: 'BX', dest: 'プサン', flightNo: 'BX141', gate: '57', scheduled: '11:50', actual: '11:46' },
      { time: '11:50', airline: 'CI', dest: '高雄', flightNo: 'CI139', gate: '51A', scheduled: '11:50', actual: '12:26' },
      { time: '11:55', airline: '9C', dest: '上海/浦東', flightNo: '9C6610', gate: '51B', scheduled: '11:55', actual: '11:46' },
      { time: '12:00', airline: '7C', dest: 'ソウル/仁川', flightNo: '7C1404', gate: '54', scheduled: '12:00', actual: '11:52' },
      { time: '12:05', airline: 'LJ', dest: 'ソウル/仁川', flightNo: 'LJ270', gate: '50B', scheduled: '12:05', actual: '12:02' },
      { time: '12:20', airline: 'BR', dest: '台北/桃園', flightNo: 'BR105', gate: '58', scheduled: '12:20', actual: '13:08' },
      { time: '12:30', airline: 'TW', dest: 'ソウル/仁川', flightNo: 'TW202', gate: '53', scheduled: '12:30', actual: '13:27' },
      { time: '12:55', airline: '9C', dest: '大連', flightNo: '9C6110', gate: '50A', scheduled: '12:55', actual: '12:40' },
      { time: '12:55', airline: 'UO', dest: '香港', flightNo: 'UO601', gate: '52A', scheduled: '12:55', actual: '12:45' },
      { time: '13:55', airline: 'MU', dest: '上海/浦東', flightNo: 'MU518', gate: '51B', scheduled: '13:55', actual: '13:39' },
      { time: '13:55', airline: 'JX', dest: '台北/桃園', flightNo: 'JX841', gate: '54', scheduled: '13:55', actual: '13:53' },
      { time: '14:00', airline: 'BX', dest: 'ソウル/仁川', flightNo: 'BX157', gate: '50B', scheduled: '14:00', actual: '14:04' },
      { time: '14:00', airline: 'UO', dest: '香港', flightNo: 'UO613', gate: '52B', scheduled: '14:00', actual: '13:40' },
      { time: '14:35', airline: 'LJ', dest: 'ソウル/仁川', flightNo: 'LJ264', gate: '56', scheduled: '14:35', actual: '14:43' },
      { time: '14:40', airline: 'MU', dest: '青島', flightNo: 'MU536', gate: '50A', scheduled: '14:40', actual: '14:30' },
      { time: '14:55', airline: '7C', dest: 'プサン', flightNo: '7C1454', gate: '52A', scheduled: '14:55', actual: '14:52' },
      { time: '15:00', airline: 'OZ', dest: 'ソウル/仁川', flightNo: 'OZ133', gate: '57', scheduled: '15:00', actual: '15:03' },
      { time: '15:10', airline: 'CA', dest: '北京首都', flightNo: 'CA954', gate: '53', scheduled: '15:10', actual: '15:34' },
      { time: '15:10', airline: 'FM', dest: '上海/浦東', flightNo: 'FM838', gate: '51A', scheduled: '15:10', actual: '15:41' },
      { time: '15:35', airline: 'PR', dest: 'マニラ', flightNo: 'PR425', gate: '52B', scheduled: '15:35', actual: '15:41' },
      { time: '15:55', airline: 'CA', dest: '上海/浦東', flightNo: 'CA916', gate: '50B', scheduled: '15:55', actual: '16:30' },
      { time: '16:00', airline: 'BX', dest: 'プサン', flightNo: 'BX145', gate: '51B', scheduled: '16:00', actual: '15:57' },
      { time: '16:00', airline: 'HX', dest: '香港', flightNo: 'HX641', gate: '54', scheduled: '16:00', actual: '15:57' },
      { time: '16:15', airline: 'UO', dest: '香港', flightNo: 'UO669', gate: '52A', scheduled: '16:15', actual: '16:02' },
      { time: '16:25', airline: 'KE', dest: 'ソウル/仁川', flightNo: 'KE790', gate: '56', scheduled: '16:25', actual: '17:34' },
      { time: '16:40', airline: 'CX', dest: '香港', flightNo: 'CX589', gate: '58', scheduled: '16:40', actual: '16:32' },
      { time: '16:55', airline: 'ZE', dest: 'ソウル/仁川', flightNo: 'ZE644', gate: '58', scheduled: '16:55', actual: '17:24' },
      { time: '17:00', airline: 'RS', dest: 'ソウル/仁川', flightNo: 'RS724', gate: '52B', scheduled: '17:00', actual: '16:56' },
      { time: '17:00', airline: '7C', dest: 'プサン', flightNo: '7C1456', gate: '50A', scheduled: '17:00', actual: '16:52' },
      { time: '17:30', airline: 'TW', dest: 'ソウル/仁川', flightNo: 'TW206', gate: '54', scheduled: '17:30', actual: '18:02' },
      { time: '17:35', airline: '7C', dest: 'ソウル/仁川', flightNo: '7C1406', gate: '50B', scheduled: '17:35', actual: '18:35' },
      { time: '18:00', airline: '9C', dest: '上海/浦東', flightNo: '9C6538', gate: '53', scheduled: '18:00', actual: null },
      { time: '18:00', airline: 'UO', dest: '香港', flightNo: 'UO639', gate: '52A', scheduled: '18:00', actual: null },
      { time: '18:05', airline: 'IT', dest: '高雄', flightNo: 'IT271', gate: '57', scheduled: '18:05', actual: null },
      { time: '18:15', airline: 'MU', dest: '上海/浦東', flightNo: 'MU5088', gate: '51A', scheduled: '18:15', actual: null },
      { time: '18:25', airline: 'LJ', dest: 'ソウル/仁川', flightNo: 'LJ266', gate: '50A', scheduled: '18:25', actual: null },
      { time: '19:10', airline: 'CI', dest: '台北/桃園', flightNo: 'CI129', gate: '56', scheduled: '19:10', actual: null },
      { time: '19:20', airline: 'BR', dest: '台北/桃園', flightNo: 'BR101', gate: '51B', scheduled: '19:20', actual: null },
      { time: '19:20', airline: 'TW', dest: '大邱', flightNo: 'TW216', gate: '50B', scheduled: '19:20', actual: null },
      { time: '19:20', airline: 'TW', dest: '清州', flightNo: 'TW226', gate: '52B', scheduled: '19:20', actual: null },
      { time: '19:35', airline: 'LJ', dest: 'ソウル/仁川', flightNo: 'LJ272', gate: '58', scheduled: '19:35', actual: null },
      { time: '19:55', airline: 'BX', dest: 'プサン', flightNo: 'BX143', gate: '50A', scheduled: '19:55', actual: null },
      { time: '20:00', airline: '5J', dest: 'マニラ', flightNo: '5J923', gate: '503', scheduled: '20:00', actual: null },
      { time: '20:00', airline: 'HO', dest: '上海/浦東', flightNo: 'HO1394', gate: '53', scheduled: '20:00', actual: null },
      { time: '20:00', airline: '7C', dest: 'ソウル/仁川', flightNo: '7C1408', gate: '53', scheduled: '20:00', actual: '20:40' },
      { time: '20:15', airline: '7C', dest: 'プサン', flightNo: '7C1458', gate: '54', scheduled: '20:15', actual: null },
      { time: '20:20', airline: 'BR', dest: '高雄', flightNo: 'BR119', gate: '51A', scheduled: '20:20', actual: null },
      { time: '20:20', airline: 'UO', dest: '香港', flightNo: 'UO695', gate: '52A', scheduled: '20:20', actual: null },
      { time: '20:30', airline: 'TW', dest: 'ソウル/仁川', flightNo: 'TW208', gate: '56', scheduled: '20:30', actual: null },
      { time: '20:40', airline: 'OZ', dest: 'ソウル/仁川', flightNo: 'OZ135', gate: '51B', scheduled: '20:40', actual: null },
      { time: '21:00', airline: 'CI', dest: '台北/桃園', flightNo: 'CI117', gate: '50B', scheduled: '21:00', actual: null },
      { time: '21:05', airline: 'KE', dest: 'ソウル/仁川', flightNo: 'KE782', gate: '58', scheduled: '21:05', actual: null }
    ];
    
    return departures.map(flight => {
      const [hour, minute] = flight.scheduled.split(':').map(Number);
      const scheduledTimeMinutes = hour * 60 + minute;
      const diff = scheduledTimeMinutes - currentTimeMinutes;
      
      let status = '定刻';
      let displayTime = flight.time; // 表示する時刻（デフォルトは予定時刻）
      
      if (flight.actual) {
        // 実際の出発時刻がある場合
        const [actualHour, actualMinute] = flight.actual.split(':').map(Number);
        const actualTimeMinutes = actualHour * 60 + actualMinute;
        const delay = actualTimeMinutes - scheduledTimeMinutes;
        
        displayTime = flight.actual; // 実際の時刻を表示
        
        if (delay > 0) {
          status = `${delay}分遅れ`;
        } else if (delay < 0) {
          status = `${-delay}分早発`;
        }
        
        // 現在時刻との比較で出発済みかチェック
        if (actualTimeMinutes < currentTimeMinutes) {
          status = '出発済';
        }
      } else if (diff < -30) {
        status = '出発済';
      } else if (diff < 0) {
        status = '搭乗終了';
      } else if (diff < 30) {
        status = '搭乗中';
      } else if (diff < 60) {
        status = '搭乗手続き終了';
      } else if (diff < 120) {
        status = '出国手続き中';
      } else {
        status = '定刻';
      }
      
      // 特定の便の状態を設定（実際の時刻がない場合のみ）
      if (!flight.actual) {
        if (flight.flightNo === 'KE790' && diff > 0) status = '使用機到着遅れ';
        if (flight.flightNo === 'CX589' && diff > -30 && diff < 30) status = '搭乗終了';
        if (flight.flightNo === 'ZE644' && diff > -30 && diff < 60) status = '搭乗手続き終了';
        if (flight.flightNo === 'TW206' && diff > 0) status = '使用機到着遅れ';
        if (flight.flightNo === '7C1406' && diff > -30 && diff < 60) status = '搭乗手続き終了';
        if (flight.flightNo === 'LJ266' && diff > 0) status = '使用機到着遅れ';
        if (flight.flightNo === 'TW216' && diff > 0) status = '使用機到着遅れ';
        if (flight.flightNo === '7C1408' && diff > 0) status = '使用機到着遅れ';
      }
      
      const airline = airlineMap[flight.airline] || { name: flight.airline, logo: '✈️' };
      
      return {
        destination: flight.dest,
        destinationEn: flight.dest,
        airline: airline.name,
        airlineLogo: airline.logo,
        airlineImage: airline.image || null,
        flightNo: flight.flightNo,
        time: displayTime,
        scheduled: flight.time,
        actual: flight.actual || null,
        status: status,
        statusEn: status,
        gate: flight.gate
      };
    }).filter(flight => {
      // 現在時刻の2時間前から未来のフライトを表示
      const [hour, minute] = flight.time.split(':').map(Number);
      const flightTimeMinutes = hour * 60 + minute;
      let timeDiff = flightTimeMinutes - currentTimeMinutes;
      
      // 日付をまたぐ場合の処理（深夜便対応）
      if (timeDiff < -720) { // 12時間以上前の場合は翌日の便として扱う
        timeDiff += 1440; // 24時間を追加
      }
      
      return timeDiff > -80; // 80分前から未来のフライトのみ
    }).sort((a, b) => {
      // 時刻順でソート
      const [aHour, aMinute] = a.time.split(':').map(Number);
      const [bHour, bMinute] = b.time.split(':').map(Number);
      const aTime = aHour * 60 + aMinute;
      const bTime = bHour * 60 + bMinute;
      
      // 現在時刻との差を計算
      let aDiff = aTime - currentTimeMinutes;
      let bDiff = bTime - currentTimeMinutes;
      
      // 日付をまたぐ場合の処理
      if (aDiff < -720) aDiff += 1440;
      if (bDiff < -720) bDiff += 1440;
      
      return aDiff - bDiff;
    }).slice(0, 15);
  } else {
    // 到着便のデータ（実際の福岡空港到着便）
    const arrivals = [
      { time: '08:25', airline: 'UO', origin: '香港', flightNo: 'UO600', gate: '5' },
      { time: '08:30', airline: 'MU', origin: '上海/浦東', flightNo: 'MU517', gate: '6' },
      { time: '09:00', airline: 'CI', origin: '台北/桃園', flightNo: 'CI110', gate: '5' },
      { time: '09:20', airline: 'KE', origin: 'ソウル/仁川', flightNo: 'KE787', gate: '3' },
      { time: '09:30', airline: '9C', origin: '上海/浦東', flightNo: '9C6609', gate: '7' },
      { time: '09:35', airline: 'UO', origin: '香港', flightNo: 'UO638', gate: '5' },
      { time: '09:40', airline: '7C', origin: 'ソウル/仁川', flightNo: '7C1403', gate: '6' },
      { time: '09:45', airline: 'OZ', origin: 'ソウル/仁川', flightNo: 'OZ130', gate: '3' },
      { time: '10:05', airline: 'TW', origin: 'ソウル/仁川', flightNo: 'TW201', gate: '5' },
      { time: '10:10', airline: 'LJ', origin: 'ソウル/仁川', flightNo: 'LJ269', gate: '4' },
      { time: '10:20', airline: 'BX', origin: 'プサン', flightNo: 'BX140', gate: '7' },
      { time: '10:20', airline: 'CX', origin: '香港', flightNo: 'CX588', gate: '8' },
      { time: '10:30', airline: 'CI', origin: '高雄', flightNo: 'CI138', gate: '5' },
      { time: '10:35', airline: 'KE', origin: 'プサン', flightNo: 'KE2135', gate: '6' },
      { time: '10:45', airline: 'BR', origin: '台北/桃園', flightNo: 'BR104', gate: '8' },
      { time: '10:55', airline: '7C', origin: 'プサン', flightNo: '7C1453', gate: '7' },
      { time: '11:05', airline: 'JX', origin: '台北/桃園', flightNo: 'JX840', gate: '9' },
      { time: '11:20', airline: 'PR', origin: 'マニラ', flightNo: 'PR424', gate: '5' },
      { time: '11:30', airline: 'UO', origin: '香港', flightNo: 'UO612', gate: '6' },
      { time: '11:55', airline: '9C', origin: '大連', flightNo: '9C6109', gate: '7' },
      { time: '12:30', airline: 'MU', origin: '青島', flightNo: 'MU535', gate: '8' },
      { time: '12:50', airline: 'BX', origin: 'ソウル/仁川', flightNo: 'BX156', gate: '5' },
      { time: '13:10', airline: 'LJ', origin: 'ソウル/仁川', flightNo: 'LJ263', gate: '6' },
      { time: '13:40', airline: 'FM', origin: '上海/浦東', flightNo: 'FM837', gate: '7' },
      { time: '14:00', airline: 'OZ', origin: 'ソウル/仁川', flightNo: 'OZ132', gate: '8' },
      { time: '14:20', airline: 'CA', origin: '北京首都', flightNo: 'CA953', gate: '9' },
      { time: '14:35', airline: 'CA', origin: '上海/浦東', flightNo: 'CA915', gate: '5' },
      { time: '14:40', airline: 'UO', origin: '香港', flightNo: 'UO668', gate: '6' },
      { time: '14:55', airline: 'HX', origin: '香港', flightNo: 'HX640', gate: '7' },
      { time: '15:00', airline: '7C', origin: 'プサン', flightNo: '7C1455', gate: '8' },
      { time: '15:05', airline: 'BX', origin: 'プサン', flightNo: 'BX144', gate: '9' },
      { time: '15:10', airline: 'RS', origin: 'ソウル/仁川', flightNo: 'RS723', gate: '5' },
      { time: '15:20', airline: 'ZE', origin: 'ソウル/仁川', flightNo: 'ZE643', gate: '6' },
      { time: '15:40', airline: 'KE', origin: 'ソウル/仁川', flightNo: 'KE789', gate: '7' },
      { time: '16:05', airline: '7C', origin: 'ソウル/仁川', flightNo: '7C1405', gate: '8' },
      { time: '16:10', airline: 'TW', origin: 'ソウル/仁川', flightNo: 'TW205', gate: '9' },
      { time: '16:20', airline: 'TG', origin: 'バンコク', flightNo: 'TG648', gate: '5' },
      { time: '17:00', airline: '5J', origin: 'マニラ', flightNo: '5J922', gate: '6' },
      { time: '17:10', airline: 'VN', origin: 'ハノイ', flightNo: 'VN356', gate: '7' },
      { time: '17:25', airline: 'HO', origin: '上海/浦東', flightNo: 'HO1393', gate: '8' },
      { time: '17:35', airline: 'BR', origin: '高雄', flightNo: 'BR118', gate: '9' },
      { time: '17:45', airline: 'IT', origin: '高雄', flightNo: 'IT270', gate: '5' },
      { time: '17:55', airline: 'MU', origin: '上海/浦東', flightNo: 'MU5087', gate: '6' },
      { time: '18:05', airline: '9C', origin: '上海/浦東', flightNo: '9C6537', gate: '7' },
      { time: '18:15', airline: 'TW', origin: '大邱', flightNo: 'TW215', gate: '8' },
      { time: '18:25', airline: 'TW', origin: '清州', flightNo: 'TW225', gate: '9' },
      { time: '18:35', airline: 'CI', origin: '台北/桃園', flightNo: 'CI128', gate: '5' },
      { time: '18:45', airline: 'BR', origin: '台北/桃園', flightNo: 'BR100', gate: '6' },
      { time: '18:55', airline: 'CI', origin: '台北/桃園', flightNo: 'CI116', gate: '7' },
      { time: '19:05', airline: 'OZ', origin: 'ソウル/仁川', flightNo: 'OZ134', gate: '8' },
      { time: '19:15', airline: 'BX', origin: 'プサン', flightNo: 'BX142', gate: '9' },
      { time: '19:25', airline: 'KE', origin: 'ソウル/仁川', flightNo: 'KE781', gate: '5' },
      { time: '19:35', airline: '7C', origin: 'プサン', flightNo: '7C1457', gate: '6' },
      { time: '19:45', airline: 'UO', origin: '香港', flightNo: 'UO694', gate: '7' },
      { time: '19:55', airline: 'LJ', origin: 'ソウル/仁川', flightNo: 'LJ271', gate: '8' },
      { time: '20:05', airline: 'TW', origin: 'ソウル/仁川', flightNo: 'TW207', gate: '9' },
      { time: '20:15', airline: '7C', origin: 'ソウル/仁川', flightNo: '7C1407', gate: '5' },
      { time: '20:25', airline: 'ZE', origin: 'ソウル/仁川', flightNo: 'ZE645', gate: '6' },
      { time: '20:35', airline: 'RS', origin: 'ソウル/仁川', flightNo: 'RS725', gate: '7' },
      { time: '20:45', airline: 'LJ', origin: 'ソウル/仁川', flightNo: 'LJ265', gate: '8' }
    ];
    
    return arrivals.map(flight => {
      const [hour, minute] = flight.time.split(':').map(Number);
      const flightTimeMinutes = hour * 60 + minute;
      const diff = flightTimeMinutes - currentTimeMinutes;
      
      let status = '定刻';
      if (diff < -30) {
        status = '到着済';
      } else if (diff < 0) {
        status = '着陸';
      } else if (diff < 30) {
        status = '接近中';
      }
      
      const airline = airlineMap[flight.airline] || { name: flight.airline, logo: '✈️' };
      
      return {
        origin: flight.origin,
        originEn: flight.origin,
        airline: airline.name,
        airlineLogo: airline.logo,
        airlineImage: airline.image || null,
        flightNo: flight.flightNo,
        time: displayTime,
        scheduled: flight.time,
        actual: flight.actual || null,
        status: status,
        statusEn: status,
        baggage: flight.gate
      };
    }).filter(flight => {
      // 現在時刻の2時間前から未来のフライトを表示
      const [hour, minute] = flight.time.split(':').map(Number);
      const flightTimeMinutes = hour * 60 + minute;
      let timeDiff = flightTimeMinutes - currentTimeMinutes;
      
      // 日付をまたぐ場合の処理（深夜便対応）
      if (timeDiff < -720) { // 12時間以上前の場合は翌日の便として扱う
        timeDiff += 1440; // 24時間を追加
      }
      
      return timeDiff > -80; // 80分前から未来のフライトのみ
    }).sort((a, b) => {
      // 時刻順でソート
      const [aHour, aMinute] = a.time.split(':').map(Number);
      const [bHour, bMinute] = b.time.split(':').map(Number);
      const aTime = aHour * 60 + aMinute;
      const bTime = bHour * 60 + bMinute;
      
      // 現在時刻との差を計算
      let aDiff = aTime - currentTimeMinutes;
      let bDiff = bTime - currentTimeMinutes;
      
      // 日付をまたぐ場合の処理
      if (aDiff < -720) aDiff += 1440;
      if (bDiff < -720) bDiff += 1440;
      
      return aDiff - bDiff;
    }).slice(0, 15);
  }
}

let cachedData = null;
let lastFetch = null;
const CACHE_DURATION = 180000; // 3分

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  const type = req.query.type || 'departure';
  
  // キャッシュチェック
  if (cachedData && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
    return res.json({
      flights: cachedData[type] || [],
      lastUpdated: new Date(lastFetch).toISOString(),
      type,
      cached: true
    });
  }
  
  // リアルなスケジュールデータ
  const scheduleData = {
    departure: generateRealisticSchedule('departure'),
    arrival: generateRealisticSchedule('arrival')
  };
  
  cachedData = scheduleData;
  lastFetch = Date.now();
  
  res.json({
    flights: scheduleData[type] || [],
    lastUpdated: new Date().toISOString(),
    type,
    source: 'fukuoka-airport-actual'
  });
};