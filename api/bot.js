export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = process.env.TG_BOT_TOKEN;
    const admin = process.env.TG_CHAT_ID; // твой админ-чат
    const API = `https://api.telegram.org/bot${token}`;

    const update = req.body;

    // Утилиты
    const send = (chat_id, payload) =>
      fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, parse_mode: "HTML", ...payload }),
      });

    const sendPhoto = (chat_id, file_id, caption) =>
      fetch(`${API}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, photo: file_id, caption, parse_mode: "HTML" }),
      });

    const answerCB = (cb_id, text) =>
      fetch(`${API}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb_id, text }),
      });

    const editMarkup = (chat_id, message_id, reply_markup) =>
      fetch(`${API}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, message_id, reply_markup }),
      });

    // 1) /start c deeplinkом
    if (update.message && update.message.text) {
      const msg = update.message;
      const chat_id = msg.chat.id;
      const text = msg.text;

      if (text.startsWith("/start")) {
        const param = text.split(" ")[1] || "";
        let tier = "basic";
        if (param === "pay_premium") tier = "premium";

        await send(chat_id, {
          text:
            `<b>Привет!</b> Готов продолжить нашу историю?\n\n` +
            `Вы выбрали тариф: <b>${tier === "premium" ? "Premium — 6990 ₽" : "Basic — 2490 ₽"}</b>\n\n` +
            `1) Оплатите по реквизитам:\n<b>Т-Банк: 2200 7017 4877 2404</b>\n\n` +
            `2) Отправьте сюда скриншот чека (фото).`,
        });

        // Уведомим админа
        await send(admin, {
          text: `👤 <b>@${msg.from.username || msg.from.id}</b> открыл оплату (${tier}). Ждём чек.`,
        });

        return res.json({ ok: true });
      }

      // Любой текст: дружелюбный ответ
      await send(chat_id, { text: "Пришлите, пожалуйста, <b>скрин чека</b> в виде фото 📸", });
      return res.json({ ok: true });
    }

    // 2) Пришло фото — это чек
    if (update.message && update.message.photo) {
      const msg = update.message;
      const chat_id = msg.chat.id;
      const photos = msg.photo;
      const best = photos[photos.length - 1]; // самое большое
      const file_id = best.file_id;
      const user = msg.from;

      // спасибо пользователю
      await send(chat_id, { text: "Спасибо! Проверяю оплату. Дам ответ в ближайшее время ✅" });

      // отправим админу с кнопками
      const inline_keyboard = [[
        { text: "✅ Подтвердить оплату", callback_data: `confirm:${chat_id}` },
        { text: "❌ Отклонить", callback_data: `reject:${chat_id}` }
      ]];

      await sendPhoto(admin, file_id,
        `💸 Чек от @${user.username || user.id}\nID: <code>${chat_id}</code>`);
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: admin,
          text: `Оплата от @${user.username || user.id}. Подтвердить доступ?`,
          reply_markup: { inline_keyboard }
        }),
      });

      return res.json({ ok: true });
    }

    // 3) Кнопки админа
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data || "";
      const fromAdmin = cb.from.id == admin;

      if (!fromAdmin) {
        await answerCB(cb.id, "Недостаточно прав.");
        return res.json({ ok: true });
      }

      const [action, uid] = data.split(":");
      if (action === "confirm") {
        // Отправим пользователю доступ
        await send(uid, {
          text:
            "🎉 Оплата подтверждена! Доступ к полной версии открыт.\n\n" +
            "→ Перейдите по ссылке и продолжайте отвечать на 100 вопросов:\n" +
            "<a href=\"https://love-story-book-six.vercel.app/full.html\">Открыть все вопросы</a>",
        });
        await answerCB(cb.id, "Доступ открыт ✅");
        await editMarkup(cb.message.chat.id, cb.message.message_id, { inline_keyboard: [] });
        return res.json({ ok: true });
      }
      if (action === "reject") {
        await send(uid, { text: "Оплата не подтверждена. Проверьте реквизиты и пришлите корректный чек 🙏" });
        await answerCB(cb.id, "Отменено ❌");
        await editMarkup(cb.message.chat.id, cb.message.message_id, { inline_keyboard: [] });
        return res.json({ ok: true });
      }
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ ok: true }); // чтобы Telegram не ретрайл
  }
}