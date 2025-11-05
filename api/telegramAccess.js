import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Временная база в памяти (потом сделаем постоянную)
let usersDB = global.usersDB || {};
global.usersDB = usersDB;

// Генерация токена
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Команда для выдачи доступа вручную
bot.command("giveaccess", async ctx => {
  try {
    const msg = ctx.message.text.split(" "); 
    const username = msg[1]?.replace("@", "");
    const tariff = msg[2] || "basic";

    if (!username) return ctx.reply("❗️ Укажи username. Пример:\n/giveaccess @user basic");

    const token = generateToken();

    usersDB[username] = { token, tariff };

    const link = `https://love-story-book-six.vercel.app/account.html?token=${token}`;

    await ctx.reply(
      `✅ Доступ выдан пользователю @${username}\n\n` +
      `💼 Тариф: ${tariff}\n🔗 Личный кабинет:\n${link}`
    );

  } catch (e) {
    console.error(e);
    ctx.reply("⚠️ Ошибка выдачи доступа");
  }
});

bot.launch();