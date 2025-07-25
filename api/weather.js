// 天気情報取得（無料API使用）
async function getWeather() {
  try {
    // Open-Meteo API（無料、APIキー不要）を使用
    const lat = 33.5859;  // 福岡空港の緯度
    const lon = 130.4509; // 福岡空港の経度
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia/Tokyo`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    
    // Weather codes to Japanese descriptions
    const weatherDescriptions = {
      0: { weather: '快晴', emoji: '☀️' },
      1: { weather: '晴れ', emoji: '☀️' },
      2: { weather: '一部曇り', emoji: '⛅' },
      3: { weather: '曇り', emoji: '☁️' },
      45: { weather: '霧', emoji: '🌫️' },
      48: { weather: '霧', emoji: '🌫️' },
      51: { weather: '小雨', emoji: '🌦️' },
      53: { weather: '小雨', emoji: '🌦️' },
      55: { weather: '小雨', emoji: '🌦️' },
      61: { weather: '雨', emoji: '🌧️' },
      63: { weather: '雨', emoji: '🌧️' },
      65: { weather: '大雨', emoji: '🌧️' },
      71: { weather: '雪', emoji: '🌨️' },
      73: { weather: '雪', emoji: '🌨️' },
      75: { weather: '大雪', emoji: '❄️' },
      80: { weather: 'にわか雨', emoji: '🌦️' },
      81: { weather: 'にわか雨', emoji: '🌦️' },
      82: { weather: '激しい雨', emoji: '⛈️' },
      95: { weather: '雷雨', emoji: '⛈️' },
      96: { weather: '雷雨', emoji: '⛈️' },
      99: { weather: '雷雨', emoji: '⛈️' }
    };
    
    const weatherInfo = weatherDescriptions[weatherCode] || { weather: '不明', emoji: '🌤️' };
    
    return {
      temp,
      weather: weatherInfo.weather,
      display: `${weatherInfo.emoji} ${temp}℃`,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Weather API error:', error);
    // エラー時は日本の平均的な気温を返す
    const now = new Date();
    const month = now.getMonth();
    const defaultTemps = [10, 11, 14, 20, 24, 27, 31, 32, 28, 22, 17, 12];
    const temp = defaultTemps[month];
    
    return {
      temp,
      weather: '晴れ',
      display: '☀️ ' + temp + '℃',
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate'); // 10分間キャッシュ
  
  const weather = await getWeather();
  res.json(weather);
};