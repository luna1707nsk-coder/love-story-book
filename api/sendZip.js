// /api/sendZip.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
    if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
      return res.status(500).json({ error: 'Missing TELEGRAM env' });
    }
    const chunks = [];
    req.on('data', c => chunks.push(c));
    await new Promise(r => req.on('end', r));
    const raw = Buffer.concat(chunks);

    const ct = req.headers['content-type'] || '';
    const boundary = ct.split('boundary=')[1];
    if (!boundary) return res.status(400).json({ error: 'No boundary' });

    const parts = raw.toString('binary').split(`--${boundary}`);
    let zipBuffer=null, filename='order.zip', caption='';

    for (const p of parts) {
      if (p.includes('name="zip"')) {
        const m = p.match(/filename="([^"]+)"/);
        if (m) filename = m[1];
        const idx = p.indexOf('\r\n\r\n');
        const fileBin = p.slice(idx+4, p.lastIndexOf('\r\n'));
        zipBuffer = Buffer.from(fileBin, 'binary');
      }
      if (p.includes('name="caption"')) {
        const idx = p.indexOf('\r\n\r\n');
        caption = p.slice(idx+4, p.lastIndexOf('\r\n'));
      }
    }
    if (!zipBuffer) return res.status(400).json({ error: 'No zip' });

    const form = new FormData();
    form.append('chat_id', ADMIN_CHAT_ID);
    form.append('caption', caption || 'Новый заказ');
    form.append('document', new Blob([zipBuffer], { type: 'application/zip' }), filename);

    const tg = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, { method:'POST', body:form });
    const j = await tg.json();
    if (!j.ok) return res.status(500).json({ error:'TG fail', detail:j });

    res.status(200).json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error:'Server error' });
  }
}
