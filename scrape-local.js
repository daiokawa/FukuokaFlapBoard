const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeFukuokaFlights() {
  console.log('Starting Fukuoka Airport flight scraper...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to Fukuoka Airport flight page...');
    await page.goto('https://www.fukuoka-airport.jp/flight/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for flight data to load
    await page.waitForSelector('.flight-table, .flight-list, table, [class*="flight"]', { 
      timeout: 30000 
    });

    // Try to find and scrape flight data
    const flightData = await page.evaluate(() => {
      const results = {
        departure: [],
        arrival: [],
        scrapedAt: new Date().toISOString()
      };

      // Helper function to extract text
      const getText = (element) => element?.textContent?.trim() || '';

      // Try different selectors for departure flights
      const departureSelectors = [
        '.departure-table tbody tr',
        '.international-departure tr',
        '[class*="departure"] tbody tr',
        '#departure-list tr'
      ];

      for (const selector of departureSelectors) {
        const rows = document.querySelectorAll(selector);
        if (rows.length > 0) {
          rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
              const destination = getText(cells[0]);
              const airline = getText(cells[1]);
              const flightNo = getText(cells[2]);
              const time = getText(cells[3]);
              const status = getText(cells[4]);
              const gate = getText(cells[5]);

              if (destination && destination !== '') {
                results.departure.push({
                  destination,
                  airline,
                  flightNo,
                  time,
                  status,
                  gate
                });
              }
            }
          });
          break;
        }
      }

      // Try different selectors for arrival flights
      const arrivalSelectors = [
        '.arrival-table tbody tr',
        '.international-arrival tr',
        '[class*="arrival"] tbody tr',
        '#arrival-list tr'
      ];

      for (const selector of arrivalSelectors) {
        const rows = document.querySelectorAll(selector);
        if (rows.length > 0) {
          rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
              const origin = getText(cells[0]);
              const airline = getText(cells[1]);
              const flightNo = getText(cells[2]);
              const time = getText(cells[3]);
              const status = getText(cells[4]);
              const baggage = getText(cells[5]);

              if (origin && origin !== '') {
                results.arrival.push({
                  origin,
                  airline,
                  flightNo,
                  time,
                  status,
                  baggage
                });
              }
            }
          });
          break;
        }
      }

      return results;
    });

    console.log(`Found ${flightData.departure.length} departures and ${flightData.arrival.length} arrivals`);

    // Save to JSON file
    await fs.writeFile(
      'flight-data.json',
      JSON.stringify(flightData, null, 2),
      'utf-8'
    );

    console.log('Flight data saved to flight-data.json');
    return flightData;

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeFukuokaFlights()
  .then(() => console.log('Scraping completed successfully'))
  .catch(error => console.error('Fatal error:', error));