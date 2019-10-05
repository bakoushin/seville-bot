const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
require('dotenv').config();

main();

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  while (true) {
    try {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();

      console.log('Starting bot...');
      await page.goto(
        'https://articketing.vocces.com/catedral-de-sevilla-ingles/'
      );
      await page.waitFor(10 * 1000);

      const visitBtn = 'a.btnvisit[data-visit="1"]';
      await page.waitForSelector(visitBtn);
      await page.click(visitBtn);
      await page.waitFor(10 * 1000);

      const freeVisitBtn = 'div[data-roomid="48"';
      await page.waitForSelector(freeVisitBtn);
      await page.click(freeVisitBtn);
      await page.waitFor(10 * 1000);

      await page.waitForSelector('#dateCalendar');
      await page.waitForSelector('#dateCalendar > div:nth-child(25)');
      const isOpen = await page.$eval(
        // '#dateCalendar > div:nth-child(25)',
        '#dateCalendar > div:nth-child(18)',
        el => !el.classList.contains('noday')
      );

      if (isOpen) {
        const msg = 'Monday is open now! Hurry up!';
        console.log(msg);
        await sendMessage(msg);

        await browser.close();
        process.exit(0);
      }

      context.close();
      console.log('Not open yet. Waiting for ~10 min');
      await page.waitFor(Math.random() * 10 * 60 * 1000);
    } catch (err) {
      console.error(err);
    }
  }
}

function sendMessage(message) {
  const { TELEGRAM_CHAT_ID } = process.env;
  const { TELEGRAM_TOKEN } = process.env;
  const text = encodeURIComponent(message);
  return fetch(
    `https://api.telegram.org/${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${text}`
  );
}
