export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // чтобы большие фото не резались
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const TOKEN = process.env.TG_BOT_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;
    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "Missing Telegram credentials" });
    }

    const { images = [], caption = "" } = await req.json?.() || req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    // Node 18+ имеет FormData/Blob в рантайме
    for (const img of images) {
      const { name = "photo.jpg", dataUrl = "" } = img;
      const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
      if (!match) continue;

      const mime = match[1];
      const b64 = match[2];
      const buffer = Buffer.from(b64, "base64");
      const blob = new Blob([buffer], { type: mime });

      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
      // sendDocument более терпим к форматам/размерам
      form.append("document", blob, name);

      const resp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, {
        method: "POST",
        body: form,
      });
      const data = await resp.json();
      if (!data.ok) {
        console.error("Telegram error:", data);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}