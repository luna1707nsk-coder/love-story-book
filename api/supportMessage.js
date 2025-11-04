// /api/supportMessage.js
export default async function handler(req, res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const { text, session, username } = req.body || {};
    const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const SUPPORT_CHAT_ID  = process.env.SUPPORT_CHAT_ID  || process.env.ADMIN_CHAT_ID;
    if(!SUPPORT_BOT_TOKEN || !SUPPORT_CHAT_ID) return res.status(500).json({error:'Missing support env'});

    const msg = `🧰 Поддержка\n@${username||'-'} · session: ${session}\n\n${text}`;
    const r = await fetch(`https://api.telegram.org/bot${SUPPORT_BOT_TOKEN}/sendMessage`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:SUPPORT_CHAT_ID, text: msg})
    });
    const j = await r.json();
    if(!j.ok) return res.status(500).json({error:'TG error', detail:j});
    res.status(200).json({ok:true});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Server error'});
  }
}
