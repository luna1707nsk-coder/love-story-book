export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { answers, userId } = req.body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_ADMIN_ID; // твой Telegram ID

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, message: "Bot env vars missing" });
    }

    const text = `
📖 *Новый пользователь начал книгу*

👤 User ID: ${userId}
✍️ Ответы:
${answers.map((a, i) => `${i+1}. ${a}`).join("\n")}
    `;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown"
      })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
}