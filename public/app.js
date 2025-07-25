let currentType = 'departure';
let flightDisplays = [];

// 空港名の日本語変換マップ
const destinationMap = {
  // 日本国内
  'TOKYO HANEDA': '東京/羽田',
  'TOKYO NARITA': '東京/成田',
  'TOKYO HANE': '東京/羽田',
  'TOKYO': '東京',
  'OSAKA INTE': '大阪/伊丹',
  'OSAKA': '大阪',
  'OSAKA KANSAI': '大阪/関西',
  'NAGOYA CHU': '名古屋/中部',
  'OKINAWA NA': '沖縄/那覇',
  'NEW CHITOSE': '札幌/新千歳',
  'SENDAI': '仙台',
  'NIIGATA AI': '新潟',
  'HIROSHIMA': '広島',
  'KOMATSU AI': '小松',
  'IZUMO AIRP': '出雲',
  'MIYAZAKI A': '宮崎',
  'KAGOSHIMA': '鹿児島',
  'KUMAMOTO': '熊本',
  'NAGASAKI': '長崎',
  'AMAMI AIRP': '奄美',
  
  // 韓国
  'SEOUL INCH': 'ソウル/仁川',
  'SEOUL GIMP': 'ソウル/金浦',
  'BUSAN': 'プサン',
  'JEJU': 'チェジュ',
  'DAEGU': 'テグ',
  
  // 中国
  'SHANGHAI P': '上海/浦東',
  'SHANGHAI H': '上海/虹橋',
  'BEIJING CA': '北京/首都',
  'BEIJING DA': '北京/大興',
  'GUANGZHOU': '廣州',
  'SHENZHEN': '深セン',
  'CHENGDU': '成都',
  'XIAMEN': '厦門',
  'DALIAN': '大連',
  'QINGDAO': '青島',
  'HANGZHOU': '杭州',
  'NANJING': '南京',
  'WUHAN': '武漢',
  'XIAN': '西安',
  
  // 台湾
  'TAIPEI TAO': '台北/桃園',
  'TAIPEI SON': '台北/松山',
  'KAOHSIUNG': '高雄',
  'TAICHUNG': '台中',
  
  // 香港・マカオ
  'HONG KONG': '香港',
  'MACAU': 'マカオ',
  
  // 東南アジア
  'SINGAPORE': 'シンガポール',
  'BANGKOK SU': 'バンコク',
  'BANGKOK DO': 'バンコク/ドンムアン',
  'BANGKOK': 'バンコク',
  'MANILA': 'マニラ',
  'CEBU': 'セブ',
  'HANOI': 'ハノイ',
  'HO CHI MIN': 'ホーチミン',
  'DA NANG': 'ダナン',
  'KUALA LUMP': 'クアラルンプール',
  'JAKARTA': 'ジャカルタ',
  'BALI': 'バリ'
};

// 航空会社名の日本語変換マップ
const airlineNameMap = {
  'Skymark Airlines': 'スカイマーク',
  'Jet Linx Aviation': 'ジェットリンクス',
  'All Nippon Airways': '全日空',
  'Starflyer': 'スターフライヤー',
  'Japan Transocean Air': '日本トランスオーシャン航空',
  'Ibex Airlines': 'アイベックスエアラインズ',
  'Oriental Air Bridge': 'オリエンタルエアブリッジ'
};

// 状態の日本語変換マップ
const statusMap = {
  'estimated': '定刻',
  'on time': '定刻',
  'delayed': '遅延',
  'boarding': '搭乗中',
  'departed': '出発済',
  'arrived': '到着済',
  'cancelled': '欠航',
  'gate closed': '搭乗終了',
  'check-in': '手続き中',
  'final call': '最終搭乗案内',
  'ESTIMATED': '定刻',
  'ON TIME': '定刻',
  'DELAYED': '遅延',
  'BOARDING': '搭乗中',
  'DEPARTED': '出発済',
  'ARRIVED': '到着済',
  'CANCELLED': '欠航'
};

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
        // 複数のAPIを試す（OpenSky → Yahoo → シミュレーション）
        let response = await fetch(`/api/flights-opensky?type=${currentType}`);
        
        // OpenSky APIが失敗したらYahoo APIを試す
        if (!response.ok) {
            console.log('OpenSky API failed, trying Yahoo API...');
            response = await fetch(`/api/flights-yahoo?type=${currentType}`);
        }
        
        // Yahoo APIも失敗したらシミュレーション版にフォールバック
        if (!response.ok) {
            console.log('Yahoo API failed, falling back to simulation...');
            response = await fetch(`/api/flights-realtime?type=${currentType}`);
        }
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
        
        // モバイル判定
        const isMobile = window.innerWidth <= 480;
        
        // Add header row
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        if (isMobile) {
            headerRow.innerHTML = currentType === 'departure' 
                ? '<span>航空会社</span><span>便名</span><span>目的地</span><span>出発時刻</span><span>状況</span>'
                : '<span>航空会社</span><span>便名</span><span>出発地</span><span>到着時刻</span><span>状況</span>';
        } else {
            headerRow.innerHTML = currentType === 'departure' 
                ? '<span></span><span>航空会社</span><span>目的地</span><span>便名</span><span>出発時刻</span><span>状況</span><span>搭乗口</span>'
                : '<span></span><span>航空会社</span><span>出発地</span><span>便名</span><span>到着時刻</span><span>状況</span><span>手荷物</span>';
        }
        container.appendChild(headerRow);
        
        flights.forEach((flight, index) => {
            // 日本語変換
            if (flight.destination) {
                const upperDest = flight.destination.toUpperCase();
                flight.destination = destinationMap[upperDest] || flight.destination;
            }
            if (flight.origin) {
                const upperOrigin = flight.origin.toUpperCase();
                flight.origin = destinationMap[upperOrigin] || flight.origin;
            }
            if (flight.airline) {
                flight.airline = airlineNameMap[flight.airline] || flight.airline;
            }
            if (flight.status) {
                flight.status = statusMap[flight.status] || statusMap[flight.status.toUpperCase()] || flight.status;
            }
            
            const row = document.createElement('div');
            row.className = 'flight-row';
            
            // Add airline logo
            const logoDiv = document.createElement('div');
            logoDiv.className = 'airline-logo';
            
            if (flight.airlineImage) {
                const img = document.createElement('img');
                img.src = flight.airlineImage;
                img.alt = flight.airline;
                img.crossOrigin = 'anonymous';
                img.loading = 'lazy';
                img.onerror = function() {
                    console.log('Image load failed:', flight.airlineImage);
                    this.style.display = 'none';
                    const emoji = document.createElement('span');
                    emoji.className = 'airline-emoji';
                    emoji.textContent = flight.airlineLogo || '✈️';
                    logoDiv.appendChild(emoji);
                };
                logoDiv.appendChild(img);
            } else {
                const emoji = document.createElement('span');
                emoji.className = 'airline-emoji';
                emoji.textContent = flight.airlineLogo || '✈️';
                logoDiv.appendChild(emoji);
            }
            row.appendChild(logoDiv);
            
            if (!isMobile) {
                // Add airline name
                const nameDiv = document.createElement('div');
                nameDiv.className = 'airline-name';
                nameDiv.textContent = flight.airline || '不明';
                row.appendChild(nameDiv);
            }
            
            if (isMobile) {
                // モバイル用のシンプルな表示
                row.innerHTML = `
                    <div class="flight-info-mobile">
                        <div class="flight-main">
                            <span class="flight-number">${flight.flightNo}</span>
                            <span class="flight-dest">${currentType === 'departure' ? flight.destination : flight.origin}</span>
                        </div>
                        <div class="flight-time">${flight.time}</div>
                    </div>
                    <div class="flight-info-mobile">
                        <div class="flight-airline">${flight.airlineLogo} ${flight.airline}</div>
                        <div class="flight-status ${flight.status.includes('遅れ') ? 'delayed' : flight.status.includes('搭乗') ? 'boarding' : ''}">${flight.status}</div>
                    </div>
                `;
            } else {
                // デスクトップ用の日本語表示
                const fields = currentType === 'departure' 
                    ? [
                        { text: flight.destination || '不明', className: 'flight-destination' },
                        { text: flight.flightNo || 'XX000', className: 'flight-number' },
                        { text: flight.time || '00:00', className: 'flight-time' },
                        { text: flight.status || '不明', className: 'flight-status' },
                        { text: flight.gate || '-', className: 'flight-gate' }
                      ]
                    : [
                        { text: flight.origin || '不明', className: 'flight-origin' },
                        { text: flight.flightNo || 'XX000', className: 'flight-number' },
                        { text: flight.time || '00:00', className: 'flight-time' },
                        { text: flight.status || '不明', className: 'flight-status' },
                        { text: flight.baggage || '-', className: 'flight-baggage' }
                      ];
                
                fields.forEach(field => {
                    const textDiv = document.createElement('div');
                    textDiv.className = field.className;
                    textDiv.textContent = field.text;
                    
                    // 状態に応じたクラスを追加
                    if (field.className === 'flight-status') {
                        if (field.text.includes('遅れ') || field.text.includes('遅延')) {
                            textDiv.classList.add('delayed');
                        } else if (field.text.includes('搭乗')) {
                            textDiv.classList.add('boarding');
                        } else if (field.text === '定刻') {
                            textDiv.classList.add('ontime');
                        }
                    }
                    
                    row.appendChild(textDiv);
                });
            }
            
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

// モバイルでのタッチ操作対応
if ('ontouchstart' in window) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('flap-container').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.getElementById('flap-container').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // 左スワイプ - 切り替え
            document.getElementById('toggle-btn').click();
        }
        if (touchEndX > touchStartX + 50) {
            // 右スワイプ - 切り替え
            document.getElementById('toggle-btn').click();
        }
    }
}

// デバイスの向き変更を検知
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        loadFlights();
    }, 500);
});

loadFlights();
setInterval(loadFlights, 180000);
updateWeather();
setInterval(updateWeather, 600000);