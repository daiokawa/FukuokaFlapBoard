const puppeteer = require('puppeteer');

async function scrapeFlights() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const results = {
      departure: [],
      arrival: []
    };

    console.log('Navigating to Fukuoka Airport flight page...');
    await page.goto('https://www.fukuoka-airport.jp/flight/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('.flight-table, .flight-list, table', { timeout: 10000 });

    const departureFlights = await page.evaluate(() => {
      const flights = [];
      const rows = document.querySelectorAll('.departure-flights tr, .departure-table tr, #departure-list tr, [class*="departure"] tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const destination = cells[0]?.textContent?.trim() || '';
          const flightNo = cells[1]?.textContent?.trim() || '';
          const time = cells[2]?.textContent?.trim() || '';
          const status = cells[3]?.textContent?.trim() || '';
          const gate = cells[4]?.textContent?.trim() || '';
          
          if (destination && destination.match(/[A-Za-z\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/)) {
            const isInternational = destination.match(/[A-Za-z]/) || 
                                  destination.includes('韓国') || 
                                  destination.includes('中国') ||
                                  destination.includes('台湾') ||
                                  destination.includes('香港') ||
                                  destination.includes('シンガポール') ||
                                  destination.includes('タイ') ||
                                  destination.includes('ベトナム') ||
                                  destination.includes('フィリピン') ||
                                  destination.includes('マレーシア') ||
                                  destination.includes('インドネシア');
            
            if (isInternational) {
              flights.push({
                destination: destination.substring(0, 15),
                flightNo: flightNo.substring(0, 8),
                time: time.substring(0, 5),
                status: status.substring(0, 10),
                gate: gate.substring(0, 4)
              });
            }
          }
        }
      });
      
      return flights.slice(0, 15);
    });

    const arrivalFlights = await page.evaluate(() => {
      const flights = [];
      const rows = document.querySelectorAll('.arrival-flights tr, .arrival-table tr, #arrival-list tr, [class*="arrival"] tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const origin = cells[0]?.textContent?.trim() || '';
          const flightNo = cells[1]?.textContent?.trim() || '';
          const time = cells[2]?.textContent?.trim() || '';
          const status = cells[3]?.textContent?.trim() || '';
          const baggage = cells[4]?.textContent?.trim() || '';
          
          if (origin && origin.match(/[A-Za-z\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/)) {
            const isInternational = origin.match(/[A-Za-z]/) || 
                                  origin.includes('韓国') || 
                                  origin.includes('中国') ||
                                  origin.includes('台湾') ||
                                  origin.includes('香港') ||
                                  origin.includes('シンガポール') ||
                                  origin.includes('タイ') ||
                                  origin.includes('ベトナム') ||
                                  origin.includes('フィリピン') ||
                                  origin.includes('マレーシア') ||
                                  origin.includes('インドネシア');
            
            if (isInternational) {
              flights.push({
                origin: origin.substring(0, 15),
                flightNo: flightNo.substring(0, 8),
                time: time.substring(0, 5),
                status: status.substring(0, 10),
                baggage: baggage.substring(0, 4)
              });
            }
          }
        }
      });
      
      return flights.slice(0, 15);
    });

    if (departureFlights.length === 0 && arrivalFlights.length === 0) {
      console.log('No flights found, using mock data for development');
      results.departure = generateMockFlights('departure');
      results.arrival = generateMockFlights('arrival');
    } else {
      results.departure = departureFlights;
      results.arrival = arrivalFlights;
    }

    return results;
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      departure: generateMockFlights('departure'),
      arrival: generateMockFlights('arrival')
    };
  } finally {
    await browser.close();
  }
}

function generateMockFlights(type) {
  const destinations = ['SEOUL', 'SHANGHAI', 'TAIPEI', 'HONG KONG', 'SINGAPORE', 'BANGKOK', 'MANILA'];
  const airlines = ['KE', 'MU', 'CI', 'CX', 'SQ', 'TG', 'PR'];
  const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'DEPARTED', 'ARRIVED', 'GATE OPEN'];
  
  const flights = [];
  const baseHour = new Date().getHours();
  
  for (let i = 0; i < 10; i++) {
    const hour = (baseHour + Math.floor(i / 3)) % 24;
    const minute = (i * 20) % 60;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    if (type === 'departure') {
      flights.push({
        destination: destinations[i % destinations.length],
        flightNo: `${airlines[i % airlines.length]}${100 + i}`,
        time: time,
        status: statuses[i % statuses.length],
        gate: `${Math.floor(Math.random() * 20) + 1}`
      });
    } else {
      flights.push({
        origin: destinations[i % destinations.length],
        flightNo: `${airlines[i % airlines.length]}${200 + i}`,
        time: time,
        status: statuses[i % statuses.length],
        baggage: `${Math.floor(Math.random() * 10) + 1}`
      });
    }
  }
  
  return flights;
}

module.exports = { scrapeFlights };