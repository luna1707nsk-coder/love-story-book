export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  if (!BOT_TOKEN) {
    return res.status(500).json({ error: "Bot token missing" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const text =
      `📖 Новая заявка с сайта\n\n` +
      `Имя: ${data.name || "-"}\n` +
      `Email: ${data.email || "-"}\n` +
      `Ответы:\n${(data.answers || []).map((a, i) => `${i + 1}. ${a}`).join("\n")}`;

    let telegramUrl;

    // STEP 1: If CHAT_ID unknown — get it first
    if (!CHAT_ID) {
      telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
      const updates = await fetch(telegramUrl).then(r => r.json());
      const newChatId = updates?.result?.[0]?.message?.chat?.id;

      if (!newChatId) {
        return res.status(200).json({
          status: "waiting_for_chat",
          message: "Напиши что-нибудь в бота, потом повтори запрос ✅"
        });
      }

      return res.status(200).json({
        status: "need_to_save_chat",
        chat_id: newChatId,
        message: "Скопируй chat_id и добавь в переменные Vercel"
      });
    }

    // STEP 2: Send message if chat exists
    telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Telegram error", details: err });
  }
}