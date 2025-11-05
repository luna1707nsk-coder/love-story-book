import crypto from "crypto";

// Имитация БД (позже заменим на реальную)
let usersDB = {};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { telegramId } = req.body;
  if (!telegramId) {
    return res.status(400).json({ error: "No telegramId" });
  }

  // Генерируем токен
  const token = crypto.randomBytes(24).toString("hex");

  // Сохраняем пользователя
  usersDB[telegramId] = {
    token,
    createdAt: Date.now(),
  };

  return res.status(200).json({
    ok: true,
    token,
    link: `/account.html?token=${token}`,
  });
}