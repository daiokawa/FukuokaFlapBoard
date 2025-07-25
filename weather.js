const axios = require('axios');

async function getWeather() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || '';
    const lat = 33.5859;
    const lon = 130.4509;
    
    if (!apiKey) {
      return { temp: 25, weather: '晴れ' };
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`
    );
    
    const data = response.data;
    const temp = Math.round(data.main.temp);
    const weather = data.weather[0].description;
    
    const weatherEmoji = {
      '晴天': '☀️',
      '晴れ': '☀️',
      '曇り': '☁️',
      '小雨': '🌦️',
      '雨': '🌧️',
      '雪': '❄️',
      '霧': '🌫️'
    };
    
    const emoji = Object.entries(weatherEmoji).find(([key]) => 
      weather.includes(key)
    )?.[1] || '🌤️';
    
    return {
      temp,
      weather,
      display: `${emoji} ${temp}℃`
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      temp: 25,
      weather: '晴れ',
      display: '☀️ 25℃'
    };
  }
}

module.exports = { getWeather };