import express from 'express'

import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf'
import axios from 'axios';

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hello. I changed this text again')
})

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))

console.log('Все переменные окружения:', process.env);
console.log('API ключ:', process.env.OWEATHER_APIKEY);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('send me ur geolocation'));

bot.on('message', async (ctx) => {
  console.log(ctx.message);

  if (ctx.message.location) {
    try {
      console.log('API ключ:', process.env.OWEATHER_APIKEY);
      const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.OWEATHER_APIKEY}&units=metric`;
      const response = await axios.get(weatherAPIUrl);

    // Обработка ответа от OpenWeather API
      const cityName = response.data.name;
      const weatherDescription = response.data.weather[0].main;
      const temperature = response.data.main.temp;

      ctx.reply(`${cityName}: ${weatherDescription} ${temperature} °C`);
    //ctx.reply(`${response.data.name}: ${response.data.weather[0].main} ${response.data.main.temp} °C`);
  } catch (error) {
    console.error('Ошибка при запросе к OpenWeather API:', error.message);
    ctx.reply('Произошла ошибка при получении данных o погоде. Пожалуйста, попробуйте позже.');
  }
  }
});

bot.launch();

/*bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();*/

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));