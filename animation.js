const canvas = document.getElementById("oracleCanvas");
const ctx = canvas.getContext("2d");

let w;
let h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

/* =========================
   粒子系統
========================= */

const particles = [];

for (let i = 0; i < 180; i++) {

    particles.push({

        x: Math.random() * w,
        y: Math.random() * h,

        size: Math.random() * 2 + 1,

        speed: Math.random() * 0.4 + 0.05,

        alpha: Math.random()

    });

}

/* =========================
   64卦名稱
========================= */

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

/* =========================
   閃爍符文
========================= */

const symbols = [

"☰",
"☱",
"☲",
"☳",
"☴",
"☵",
"☶",
"☷"

];

/* =========================
   主動畫
========================= */

function animate() {

    ctx.clearRect(0, 0, w, h);

    drawBackground();

    drawParticles();

    drawOuterRing();

    drawInnerRing();

    drawRunes();

    drawEnergyOrb();

    requestAnimationFrame(animate);

}

/* =========================
   背景
========================= */

function drawBackground() {

    const gradient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        100,
        w / 2,
        h / 2,
        Math.max(w, h)
    );

    gradient.addColorStop(0, "rgba(208,39,83,0.12)");
    gradient.addColorStop(1, "#030303");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

}

/* =========================
   粒子
========================= */

function drawParticles() {

    particles.forEach(p => {

        p.y += p.speed;

        if (p.y > h) {

            p.y = -10;
            p.x = Math.random() * w;

        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(245,199,109,${p.alpha})`;

        ctx.fill();

    });

}

/* =========================
   外圈64卦
========================= */

function drawOuterRing() {

    const radius =
        Math.min(w, h) * 0.33;

    const rotation =
        Date.now() * 0.00008;

    hexagrams.forEach((hex, i) => {

        const angle =
            (Math.PI * 2 / hexagrams.length) * i +
            rotation;

        const x =
            w / 2 +
            Math.cos(angle) * radius;

        const y =
            h / 2 +
            Math.sin(angle) * radius;

        ctx.save();

        ctx.translate(x, y);

        ctx.fillStyle =
            "rgba(245,199,109,0.75)";

        ctx.font =
            "14px Noto Sans TC";

        ctx.textAlign = "center";

        ctx.fillText(hex, 0, 0);

        ctx.restore();

    });

}

/* =========================
   內圈64卦
========================= */

function drawInnerRing() {

    const radius =
        Math.min(w, h) * 0.24;

    const rotation =
        -Date.now() * 0.00012;

    hexagrams.forEach((hex, i) => {

        const angle =
            (Math.PI * 2 / hexagrams.length) * i +
            rotation;

        const x =
            w / 2 +
            Math.cos(angle) * radius;

        const y =
            h / 2 +
            Math.sin(angle) * radius;

        ctx.save();

        ctx.translate(x, y);

        ctx.fillStyle =
            "rgba(255,255,255,0.3)";

        ctx.font =
            "12px Noto Sans TC";

        ctx.textAlign = "center";

        ctx.fillText(hex, 0, 0);

        ctx.restore();

    });

}

/* =========================
   符文閃爍
========================= */

function drawRunes() {

    for (let i = 0; i < 8; i++) {

        const angle =
            Date.now() * 0.0003 + i;

        const radius =
            140 +
            Math.sin(
                Date.now() * 0.002 + i
            ) * 15;

        const x =
            w / 2 +
            Math.cos(angle) * radius;

        const y =
            h / 2 +
            Math.sin(angle) * radius;

        ctx.fillStyle =
            `rgba(245,199,109,${
                0.3 + Math.random() * 0.4
            })`;

        ctx.font =
            "26px serif";

        ctx.fillText(
            symbols[i],
            x,
            y
        );

    }

}

/* =========================
   中央能量球
========================= */

function drawEnergyOrb() {

    const pulse =
        Math.sin(Date.now() * 0.002) * 15;

    const radius =
        80 + pulse;

    const gradient =
        ctx.createRadialGradient(
            w / 2,
            h / 2,
            10,
            w / 2,
            h / 2,
            radius
        );

    gradient.addColorStop(
        0,
        "#fff8dc"
    );

    gradient.addColorStop(
        0.4,
        "#f5c76d"
    );

    gradient.addColorStop(
        1,
        "#D02753"
    );

    ctx.beginPath();

    ctx.arc(
        w / 2,
        h / 2,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = gradient;

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        w / 2,
        h / 2,
        radius + 25,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(245,199,109,0.12)";

    ctx.lineWidth = 3;

    ctx.stroke();

}

animate();
