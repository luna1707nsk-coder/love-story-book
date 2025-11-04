<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Вопросы — История</title>

<link href="https://fonts.googleapis.com/css2?family=Spectral+SC:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">

<style>
:root{
  --cream:#FBF7F2; --ink:#4A3A39;
  --card:rgba(255,255,255,.78);
  --veil:rgba(255,255,255,.92);
  --gold2:#9b7f64; --gold3:#d7c29c; --gold4:#b99673;
  --shadow:0 14px 38px rgba(0,0,0,.14);
  --radius:26px;
}
*{box-sizing:border-box;margin:0;padding:0}

body{
  background:url("assets/background3.jpg") center/cover fixed no-repeat;
  color:var(--ink);
  font-family:"Playfair Display",serif;
  overflow-x:hidden;
  min-height:100vh;
}

/* Glitter */
#glitter{position:fixed; inset:0; pointer-events:none; z-index:1}

/* Container */
.container{max-width:760px; margin:110px auto 60px; padding:20px}
.card{
  background:var(--card);
  backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.92);
  border-radius:var(--radius);
  padding:32px;
  box-shadow:var(--shadow);
  animation:fade .7s ease;
}
@keyframes fade{from{opacity:0; transform:translateY(18px)} to{opacity:1; transform:none}}

h1{
  font-family:"Spectral SC",serif;
  text-align:center;
  margin-bottom:8px;
  background:linear-gradient(90deg,#6a5447,#9b7f64,#d7c29c,#b99673,#7a5f4e);
  -webkit-background-clip:text;
  color:transparent;
  text-shadow:0 2px 10px rgba(215,194,156,.18);
}

/* Progress */
.progress-wrap{margin:12px 0 18px}
.progress-top{display:flex; justify-content:space-between; font-weight:600}
.progress{
  width:100%; height:8px;
  background:rgba(255,255,255,.55);
  border-radius:999px; overflow:hidden; margin-top:8px;
}
.bar{
  height:100%; width:0%;
  background:linear-gradient(90deg,var(--gold2),var(--gold3),var(--gold4));
  transition:width .4s ease;
}

/* Question */
h2.q{font-family:"Spectral SC",serif; font-size:28px; margin:12px 0}
textarea{
  width:100%; height:170px; padding:18px;
  border:none; border-radius:20px;
  background:var(--veil);
  font-size:20px; font-family:inherit;
  box-shadow:inset 0 2px 8px rgba(0,0,0,.06);
}

/* Button */
.btn{
  border:none; cursor:pointer; color:#fff; font-weight:700;
  background:linear-gradient(130deg,var(--gold2),var(--gold4));
  padding:14px 30px; border-radius:999px;
  font-size:20px;
  box-shadow:0 12px 32px rgba(0,0,0,.18);
  transition:.25s; margin-top:18px;
}
.btn:hover{transform:translateY(-3px);opacity:.96}

/* Final */
.final{text-align:center}
.final h2{font-family:"Spectral SC",serif; font-size:30px; margin-bottom:8px}
.final p{opacity:.9; font-size:20px}

@media(max-width:640px){
  .card{padding:24px}
  h2.q{font-size:24px}
  textarea{height:150px}
  .btn{width:100%}
}
</style>
</head>

<body>

<canvas id="glitter"></canvas>

<div class="container">
  <div id="card" class="card">
    <h1>Пробная часть</h1>

    <div class="progress-wrap">
      <div class="progress-top">
        <span id="label">Вопрос 1 из 5</span><span id="perc">0%</span>
      </div>
      <div class="progress"><div id="bar" class="bar"></div></div>
    </div>

    <h2 id="q" class="q">Где вы впервые встретились?</h2>
    <textarea id="a" placeholder="Ваш ответ..."></textarea>

    <button class="btn" id="next">Далее</button>
  </div>
</div>

<script>
/* Glitter */
const cvs=document.getElementById('glitter'), ctx=cvs.getContext('2d');
let W,H,parts=[];
function resize(){W=cvs.width=innerWidth;H=cvs.height=innerHeight}
addEventListener('resize',resize);resize();
function spawn(n=60){
  for(let i=0;i<n;i++){
    parts.push({x:Math.random()*W,y:Math.random()*-H*.2,r:Math.random()<.18?2.4+Math.random()*1.8:.9+Math.random()*1.3,v:1.2+Math.random()*1.2,g:Math.random()<.2})
  }
}
function step(){
  ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
  for(const p of parts){
    p.y+=p.v;p.x+=Math.sin((p.y+p.r)*.01)*.3;
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2.3);
    g.addColorStop(0,p.g?'rgba(255,240,210,.9)':'rgba(255,255,255,.8)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();
  }
  parts=parts.filter(p=>p.y<H+20);requestAnimationFrame(step);
}
spawn(70);setInterval(()=>spawn(8),600);step();

/* Bot Sender */
async function sendAnswerToBot(question, answer) {
  try {
    await fetch("/api/sendMessage", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        text:`❤️ <b>Ответ пользователя</b>\n\n❓ <b>${question}</b>\n✏️ ${answer}`
      }),
    });
  } catch (e){ console.log("Ошибка:",e); }
}

/* Questions */
const qs=[
"Где вы впервые встретились?",
"Что вы почувствовали при встрече?",
"Кто сделал первый шаг?",
"Какая эмоция сильнее всего вспоминается?",
"Что стало началом любви?"
];

let i=0;
const label=document.getElementById('label'),
q=document.getElementById('q'),
a=document.getElementById('a'),
bar=document.getElementById('bar'),
perc=document.getElementById('perc'),
card=document.getElementById('card');

function render(){
  label.textContent=`Вопрос ${i+1} из 5`;
  q.textContent=qs[i];
  bar.style.width=(i/5)*100+'%';
  perc.textContent=Math.round((i/5)*100)+'%';
  a.value='';
}

document.getElementById('next').onclick=async()=>{
  if(!a.value.trim())return;
  await sendAnswerToBot(q.textContent,a.value.trim());
  i++;
  if(i<5)render();
  else{
    bar.style.width='100%';perc.textContent='100%';
    card.innerHTML=`
    <div class="final">
      <h2>✨ Пробная часть завершена</h2>
      <p>Спасибо! Вы прошли 5 вопросов.</p>
      <button class="btn" onclick="location.href='index.html'">Вернуться</button>
    </div>`;
  }
}
render();
</script>
</body>
</html>