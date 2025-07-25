let currentType = 'departure';
let flightDisplays = [];

function initializeClock() {
    const canvas = document.getElementById('clock');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    let startTime = Date.now();
    
    function drawClock() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(radius, radius);
        
        // White clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius - 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        // Remove outer ring for cleaner look
        
        // Hour markers (mid-century style)
        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 6);
            
            if (i % 3 === 0) {
                // Major markers (12, 3, 6, 9) - streamlined shape
                ctx.beginPath();
                ctx.moveTo(0, -radius + 8);
                ctx.quadraticCurveTo(-3, -radius + 14, 0, -radius + 20);
                ctx.quadraticCurveTo(3, -radius + 14, 0, -radius + 8);
                ctx.fillStyle = '#444';
                ctx.fill();
            } else {
                // Minor markers - small dots
                ctx.beginPath();
                ctx.arc(0, -radius + 12, 2, 0, 2 * Math.PI);
                ctx.fillStyle = '#666';
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Get time with milliseconds for smooth movement
        const now = new Date();
        const millis = now.getMilliseconds();
        const second = now.getSeconds() + millis / 1000;
        const minute = now.getMinutes() + second / 60;
        const hour = (now.getHours() % 12) + minute / 60;
        
        // Hour hand (streamlined)
        ctx.save();
        ctx.rotate((hour * Math.PI / 6));
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.quadraticCurveTo(-2, 0, -3, -radius + 40);
        ctx.quadraticCurveTo(0, -radius + 32, 0, -radius + 30);
        ctx.quadraticCurveTo(0, -radius + 32, 3, -radius + 40);
        ctx.quadraticCurveTo(2, 0, 0, 10);
        ctx.fillStyle = '#666';
        ctx.fill();
        ctx.restore();
        
        // Minute hand (streamlined)
        ctx.save();
        ctx.rotate((minute * Math.PI / 30));
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.quadraticCurveTo(-1.5, 0, -2, -radius + 20);
        ctx.quadraticCurveTo(0, -radius + 17, 0, -radius + 15);
        ctx.quadraticCurveTo(0, -radius + 17, 2, -radius + 20);
        ctx.quadraticCurveTo(1.5, 0, 0, 10);
        ctx.fillStyle = '#666';
        ctx.fill();
        ctx.restore();
        
        // Second hand (thin diamond shape, smooth movement)
        ctx.save();
        ctx.rotate((second * Math.PI / 30));
        ctx.beginPath();
        // Diamond shape
        ctx.moveTo(0, 20);
        ctx.lineTo(-1.5, 0);
        ctx.lineTo(0, -radius + 10);
        ctx.lineTo(1.5, 0);
        ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.restore();
        
        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        ctx.restore();
        
        requestAnimationFrame(drawClock);
    }
    
    drawClock();
}

function updateDateTime() {
    const now = new Date();
    const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`;
    document.getElementById('date').textContent = dateStr;
}

function createFlapDisplay(text, container) {
    try {
        const display = new FlapDisplay(container, {
            chars: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-/',
            length: text.length,
            timing: 300
        });
        display.setValue(text);
        return display;
    } catch (error) {
        console.error('Flap display error:', error);
        container.textContent = text;
        return null;
    }
}

async function loadFlights() {
    try {
        console.log('Loading flights...', currentType);
        // リアルタイムAPIを使用（シミュレーション版）
        const response = await fetch(`/api/flights-realtime?type=${currentType}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Flight data:', data);
        
        const container = document.getElementById('flap-container');
        container.innerHTML = '';
        
        flightDisplays.forEach(display => {
            if (display && display.destroy) {
                try {
                    display.destroy();
                } catch (e) {
                    console.error('Destroy error:', e);
                }
            }
        });
        flightDisplays = [];
        
        const flights = data.flights.slice(0, 15);
        
        if (flights.length === 0) {
            container.innerHTML = '<div class="loading">フライト情報がありません</div>';
            return;
        }
        
        // Add header row
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        headerRow.innerHTML = currentType === 'departure' 
            ? '<span></span><span>航空会社</span><span>目的地</span><span>便名</span><span>出発時刻</span><span>状況</span><span>搭乗口</span>'
            : '<span></span><span>航空会社</span><span>出発地</span><span>便名</span><span>到着時刻</span><span>状況</span><span>手荷物</span>';
        container.appendChild(headerRow);
        
        flights.forEach((flight, index) => {
            const row = document.createElement('div');
            row.className = 'flight-row';
            
            // Add airline logo
            const logoDiv = document.createElement('div');
            logoDiv.className = 'airline-logo';
            
            if (flight.airlineImage) {
                const img = document.createElement('img');
                img.src = flight.airlineImage;
                img.alt = flight.airline;
                img.onerror = function() {
                    this.style.display = 'none';
                    logoDiv.textContent = flight.airlineLogo || '✈️';
                };
                logoDiv.appendChild(img);
            } else {
                logoDiv.textContent = flight.airlineLogo || '✈️';
            }
            row.appendChild(logoDiv);
            
            // Add airline name
            const nameDiv = document.createElement('div');
            nameDiv.className = 'airline-name';
            nameDiv.textContent = flight.airline || '不明';
            row.appendChild(nameDiv);
            
            const fields = currentType === 'departure' 
                ? [
                    { text: flight.destination || '不明', width: 10 },
                    { text: flight.flightNo || 'XX000', width: 7 },
                    { text: flight.time || '00:00', width: 5 },
                    { text: flight.status || '不明', width: 10 },
                    { text: flight.gate || '-', width: 3 }
                  ]
                : [
                    { text: flight.origin || '不明', width: 10 },
                    { text: flight.flightNo || 'XX000', width: 7 },
                    { text: flight.time || '00:00', width: 5 },
                    { text: flight.status || '不明', width: 10 },
                    { text: flight.baggage || '-', width: 1 }
                  ];
            
            fields.forEach(field => {
                const displayContainer = document.createElement('div');
                displayContainer.className = 'flap-display';
                row.appendChild(displayContainer);
                
                const text = field.text.toUpperCase().padEnd(field.width, ' ').substring(0, field.width);
                
                setTimeout(() => {
                    const display = createFlapDisplay(text, displayContainer);
                    if (display) {
                        flightDisplays.push(display);
                    }
                }, index * 100);
            });
            
            container.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading flights:', error);
        document.getElementById('flap-container').innerHTML = 
            '<div class="loading">フライト情報の取得に失敗しました</div>';
    }
}

document.getElementById('toggle-btn').addEventListener('click', () => {
    currentType = currentType === 'departure' ? 'arrival' : 'departure';
    document.getElementById('toggle-btn').textContent = 
        currentType === 'departure' ? '到着便' : '出発便';
    loadFlights();
});

initializeClock();
updateDateTime();
setInterval(updateDateTime, 60000);

async function updateWeather() {
    try {
        const response = await fetch('/api/weather');
        const weather = await response.json();
        document.getElementById('temp').textContent = `${weather.temp || 25}℃`;
        document.getElementById('weather').textContent = `${weather.display?.split(' ')[0] || '☀️'} ${weather.weather || '晴れ'}`;
    } catch (error) {
        console.error('Weather update error:', error);
        document.getElementById('temp').textContent = '25℃';
        document.getElementById('weather').textContent = '☀️ 晴れ';
    }
}

loadFlights();
setInterval(loadFlights, 180000);
updateWeather();
setInterval(updateWeather, 600000);