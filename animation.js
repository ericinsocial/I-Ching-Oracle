const canvas = document.getElementById("oracleCanvas");
const ctx = canvas.getContext("2d");

let w, h, cx, cy, dpr;
const isMobile = () => window.innerWidth < 768;

function resizeCanvas(){
  dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
  w = window.innerWidth;
  h = window.innerHeight;
  cx = w / 2;
  cy = h / 2;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  ctx.setTransform(dpr,0,0,dpr,0,0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const hexagrams = [
  "乾","坤","屯","蒙","需","訟","師","比",
  "小畜","履","泰","否","同人","大有","謙","豫",
  "隨","蠱","臨","觀","噬嗑","賁","剝","復",
  "無妄","大畜","頤","大過","坎","離","咸","恆",
  "遯","大壯","晉","明夷","家人","睽","蹇","解",
  "損","益","夬","姤","萃","升","困","井",
  "革","鼎","震","艮","漸","歸妹","豐","旅",
  "巽","兌","渙","節","中孚","小過","既濟","未濟"
];

const runes = ["☰","☱","☲","☳","☴","☵","☶","☷"];

const particles = [];
const sparks = [];
const mist = [];
const runeObjects = runes.map((rune,i)=>({
  rune,
  phase: i * 1.7,
  radiusWave: i,
  alphaBase: 0.22 + (i % 3) * 0.035,
  alphaAmp: 0.42 + (i % 2) * 0.08
}));

let startTime = performance.now();

function resetAnimationClock(){
  startTime = performance.now();
  exploded = false;
  sparks.length = 0;
}

window.resetOracleAnimation = resetAnimationClock;

function rand(min,max){
  return Math.random() * (max - min) + min;
}

function makeParticles(){
  particles.length = 0;
  sparks.length = 0;
  mist.length = 0;

  const count = isMobile() ? 110 : 180;

  for(let i=0;i<count;i++){
    particles.push({
      angle: rand(0, Math.PI * 2),
      dist: rand(80, Math.max(w,h) * 0.75),
      size: rand(0.7, 2.3),
      speed: rand(0.0004, 0.0018),
      alpha: rand(0.25, 0.9),
      drift: rand(-0.4, 0.4),
      suckDist: rand(8,34)
    });
  }

  const mistCount = isMobile() ? 18 : 34;

  for(let i=0;i<mistCount;i++){
    mist.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(90,220),
      alpha: rand(0.01,0.035),
      vx: rand(-0.15,0.15),
      vy: rand(-0.12,0.12)
    });
  }
}

makeParticles();
window.addEventListener("resize", makeParticles);

function phase(t){
  if(t < 2) return 1;
  if(t < 4.6) return 2;
  if(t < 6.3) return 3;
  if(t < 7.1) return 4;
  return 5;
}

function easeOutCubic(x){
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x){
  return x * x * x;
}

function drawBackground(t){
  const g = ctx.createRadialGradient(
    cx, cy, 10,
    cx, cy, Math.max(w,h)
  );

  const pulse = (Math.sin(t * 1.6) + 1) / 2;

  g.addColorStop(0, `rgba(245,199,109,${0.16 + pulse * 0.04})`);
  g.addColorStop(0.18, `rgba(208,39,83,${0.22 + pulse * 0.07})`);
  g.addColorStop(0.48, "rgba(60,5,20,0.55)");
  g.addColorStop(1, "#020202");

  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  mist.forEach(m=>{
    m.x += m.vx;
    m.y += m.vy;

    if(m.x < -m.r) m.x = w + m.r;
    if(m.x > w + m.r) m.x = -m.r;
    if(m.y < -m.r) m.y = h + m.r;
    if(m.y > h + m.r) m.y = -m.r;

    const mg = ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r);
    mg.addColorStop(0, `rgba(208,39,83,${m.alpha})`);
    mg.addColorStop(1, "rgba(208,39,83,0)");
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(m.x,m.y,m.r,0,Math.PI*2);
    ctx.fill();
  });
}

function drawParticles(t){
  const ph = phase(t);
  let suck = 0;

  if(ph === 4){
    suck = easeInCubic((t - 6.3) / 0.8);
  }else if(ph === 5){
    suck = 1;
  }

  particles.forEach(p=>{
    p.angle += p.speed * (ph >= 3 ? 4.5 : 1.5);

    let dist = p.dist;

    if(ph === 3){
      dist -= Math.sin(t * 4 + p.angle) * 8;
    }

    if(ph >= 4){
      dist = p.dist * (1 - suck) + p.suckDist * suck;
    }

    const x = cx + Math.cos(p.angle) * dist + Math.sin(t+p.angle) * p.drift * 18;
    const y = cy + Math.sin(p.angle) * dist + Math.cos(t+p.angle) * p.drift * 18;

    ctx.beginPath();
    ctx.arc(x,y,p.size,0,Math.PI*2);
    ctx.fillStyle = `rgba(245,199,109,${p.alpha})`;
    ctx.fill();
  });
}

function drawRing(t, radiusRatio, reverse, alpha, fontSize){
  const ph = phase(t);

  let radius = Math.min(w,h) * radiusRatio;
  let speed = reverse ? -0.16 : 0.12;

  if(ph === 3) speed *= 4.2;
  if(ph === 4) speed *= 7;

  let collapse = 0;
  if(ph === 4){
    collapse = easeInCubic((t - 6.3) / 0.8);
  }else if(ph === 5){
    collapse = 1;
  }

  radius = radius * (1 - collapse) + 35 * collapse;

  const rotation = t * speed;

  hexagrams.forEach((name,i)=>{
    const angle = (Math.PI * 2 / hexagrams.length) * i + rotation;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    const fade = alpha * (1 - collapse * 0.85);

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle + Math.PI/2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px "Noto Sans TC", serif`;
    ctx.fillStyle = `rgba(245,199,109,${fade})`;
    ctx.fillText(name,0,0);
    ctx.restore();
  });
}

function drawRunes(t){
  const ph = phase(t);
  const baseRadius = Math.min(w,h) * 0.20;

  runeObjects.forEach((item,i)=>{
    const blink = (Math.sin(t * 4 + item.phase) + 1) / 2;
    const angle = t * (ph >= 3 ? 1.2 : 0.45) + i * Math.PI * 2 / runeObjects.length;
    const radius = baseRadius + Math.sin(t * 2 + item.radiusWave) * 14;

    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(-angle);
    ctx.font = `${isMobile() ? 26 : 34}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(255,232,160,${item.alphaBase + blink * item.alphaAmp})`;
    ctx.shadowColor = "rgba(245,199,109,0.8)";
    ctx.shadowBlur = isMobile() ? 8 : 12;
    ctx.fillText(item.rune,0,0);
    ctx.restore();
  });

  ctx.shadowBlur = 0;
}

function drawOrb(t){
  const ph = phase(t);

  let base = isMobile() ? 56 : 78;
  const pulse = Math.sin(t * 4) * 10;

  if(ph === 3) base += 10;
  if(ph === 4) base += easeOutCubic((t - 6.3) / 0.8) * 45;
  if(ph === 5) base = 92 + Math.sin(t*5)*8;

  const r = base + pulse;

  const g = ctx.createRadialGradient(cx,cy,2,cx,cy,r);
  g.addColorStop(0,"rgba(255,255,240,1)");
  g.addColorStop(0.28,"rgba(245,199,109,1)");
  g.addColorStop(0.62,"rgba(208,39,83,0.95)");
  g.addColorStop(1,"rgba(208,39,83,0)");

  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.fillStyle = g;
  ctx.shadowColor = "rgba(245,199,109,1)";
  ctx.shadowBlur = ph >= 4 ? (isMobile() ? 36 : 52) : (isMobile() ? 18 : 28);
  ctx.fill();
  ctx.shadowBlur = 0;

  const haloCount = isMobile() ? 2 : 3;
  for(let i=0;i<haloCount;i++){
    const rr = r + 26 + i * 22 + Math.sin(t*2+i)*8;
    ctx.beginPath();
    ctx.arc(cx,cy,rr,0,Math.PI*2);
    ctx.strokeStyle = `rgba(245,199,109,${0.14 - i*0.035})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawSigilLines(t){
  const ph = phase(t);
  if(ph < 2) return;

  const radius = Math.min(w,h) * 0.28;
  const points = 8;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(t * 0.12);

  for(let i=0;i<points;i++){
    const a1 = Math.PI*2/points*i;
    const a2 = Math.PI*2/points*((i+3)%points);

    ctx.beginPath();
    ctx.moveTo(Math.cos(a1)*radius, Math.sin(a1)*radius);
    ctx.lineTo(Math.cos(a2)*radius, Math.sin(a2)*radius);
    ctx.strokeStyle = `rgba(245,199,109,${ph >= 3 ? 0.16 : 0.07})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function createExplosion(){
  sparks.length = 0;

  const sparkCount = isMobile() ? 70 : 110;

  for(let i=0;i<sparkCount;i++){
    const a = rand(0,Math.PI*2);
    sparks.push({
      x: cx,
      y: cy,
      vx: Math.cos(a) * rand(2,9),
      vy: Math.sin(a) * rand(2,9),
      life: rand(40,80),
      maxLife: 0,
      size: rand(1,3)
    });
    sparks[sparks.length - 1].maxLife = sparks[sparks.length - 1].life;
  }
}

let exploded = false;

function drawExplosion(t){
  if(phase(t) === 5 && !exploded){
    createExplosion();
    exploded = true;
  }

  sparks.forEach(s=>{
    s.x += s.vx;
    s.y += s.vy;
    s.vx *= 0.96;
    s.vy *= 0.96;
    s.life--;

    const alpha = Math.max(s.life / s.maxLife, 0);

    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fillStyle = `rgba(245,199,109,${alpha})`;
    ctx.fill();
  });
}

function drawShockwave(t){
  if(t < 7.1) return;

  const progress = Math.min((t - 7.1) / 1.2, 1);
  const r = easeOutCubic(progress) * Math.min(w,h) * 0.55;

  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle = `rgba(245,199,109,${0.55 * (1-progress)})`;
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawVignette(){
  const g = ctx.createRadialGradient(cx,cy,Math.min(w,h)*0.18,cx,cy,Math.max(w,h)*0.75);
  g.addColorStop(0,"rgba(0,0,0,0)");
  g.addColorStop(1,"rgba(0,0,0,0.62)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);
}

function animate(){
  const t = (performance.now() - startTime) / 1000;

  ctx.clearRect(0,0,w,h);

  drawBackground(t);
  drawSigilLines(t);
  drawParticles(t);
  drawRing(t,0.34,false,0.58, isMobile() ? 10 : 14);
  drawRunes(t);
  drawOrb(t);
  drawExplosion(t);
  drawShockwave(t);
  drawVignette();

  requestAnimationFrame(animate);
}

animate();
