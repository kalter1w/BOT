const TelegramBot = require ('node-telegram-bot-api');
const request = require('request');
require ('dotenv').config()
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot (token, {polling: true});



bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выберите нужную валюту', {
    reply_markup: {
      inline_keyboard: [
        [
          {
          text: 'EUR',
          callback_data: 'EUR'
        },  {
          text: 'USD',
          callback_data: 'USD'
        },{
          text: 'RUB',
          callback_data: 'RUB'
        },{
          text:'BTC',
          callback_data: 'BTC'
        }
        ]
      ]



    }
  });
});


bot.on('callback_query', query => {
  const id = query.message.chat.id;
  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
    const data = JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    let md = `
    *${result.ccy} => ${result.base_ccy}*
    Buy: _${result.buy}_
    Sale: _${result.sale}_
    `;
    bot.sendMessage(id,md, {parse_mode:'Markdown'});
  })
})
