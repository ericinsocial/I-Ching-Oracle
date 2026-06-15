/* ==========================================
   Oracle of Change
   Page Controller
========================================== */

let selectedCategory = null;

/* ==========================================
   Demo 卦象資料
   之後再換成完整64卦
========================================== */

const oracleData = [

{
    number:1,
    name:"乾卦",
    symbol:"☰",
    image:"天行健，君子以自強不息。",
    oracle:"此刻正是主動出擊的時候。相信自己的能力，不要因為害怕失敗而停下腳步。",
    advice:"勇敢前進，但不要過度急躁。"
},

{
    number:2,
    name:"坤卦",
    symbol:"☷",
    image:"地勢坤，君子以厚德載物。",
    oracle:"現在更適合傾聽與接納。當你願意順勢而為，答案自然會慢慢浮現。",
    advice:"柔軟有時比強硬更有力量。"
},

{
    number:29,
    name:"坎卦",
    symbol:"☵",
    image:"水流險地，仍持續向前。",
    oracle:"眼前的困難只是過程，不是結局。保持冷靜，事情會找到出口。",
    advice:"不要被暫時的阻礙影響判斷。"
},

{
    number:30,
    name:"離卦",
    symbol:"☲",
    image:"光明正在照亮真相。",
    oracle:"你已經看見事情的核心，只是還沒有完全相信自己的直覺。",
    advice:"誠實面對自己。"
},

{
    number:51,
    name:"震卦",
    symbol:"☳",
    image:"雷動萬物，變化即將開始。",
    oracle:"新的機會或改變即將到來，不必害怕未知。",
    advice:"行動比等待更重要。"
},

{
    number:57,
    name:"巽卦",
    symbol:"☴",
    image:"風行天下，無聲而入。",
    oracle:"用柔和的方式推動事情，往往比正面衝撞更有效。",
    advice:"保持彈性與耐心。"
},

{
    number:52,
    name:"艮卦",
    symbol:"☶",
    image:"山止於前，靜中見智。",
    oracle:"先停下來，不急著做決定。答案就在你忽略的細節裡。",
    advice:"觀察比行動更重要。"
},

{
    number:58,
    name:"兌卦",
    symbol:"☱",
    image:"喜悅與交流帶來新的可能。",
    oracle:"透過分享與溝通，你會獲得意想不到的收穫。",
    advice:"把想法說出來。"
}

];

/* ==========================================
   頁面元素
========================================== */

const homePage =
document.getElementById("homePage");

const animationPage =
document.getElementById("animationPage");

const resultPage =
document.getElementById("resultPage");

const animationMessage =
document.getElementById("animationMessage");

const revealedHexagram =
document.getElementById("revealedHexagram");

const revealedNumber =
document.getElementById("revealedNumber");

const revealedName =
document.getElementById("revealedName");

/* ==========================================
   問題按鈕
========================================== */

document
.querySelectorAll(".question-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        selectedCategory =
        btn.dataset.category;

        startAnimation();

    });

});

/* ==========================================
   開始動畫
========================================== */

function startAnimation(){
if(window.resetOracleAnimation){
    window.resetOracleAnimation();
}
    homePage.classList.remove("active");
    animationPage.classList.add("active");

    animationMessage.innerHTML =
    "靜心感受你的問題";

    revealedHexagram.classList.add("hidden");

    setTimeout(()=>{

        animationMessage.innerHTML =
        "天地有道<br>萬物有時";

    },2000);

    setTimeout(()=>{

        animationMessage.innerHTML =
        "卦象正在形成...";

    },4500);

    setTimeout(()=>{

        revealHexagram();

    },7000);

}

/* ==========================================
   揭曉卦象
========================================== */

function revealHexagram(){

    const random =
    Math.floor(
        Math.random() *
        oracleData.length
    );

    const hex =
    oracleData[random];

    animationMessage.innerHTML =
    "正在解讀卦象...";

    revealedNumber.innerHTML =
    `第 ${hex.number} 卦`;

    revealedName.innerHTML =
    hex.name;

    revealedHexagram.classList.remove("hidden");

    setTimeout(()=>{

        showResult(hex);

    },1800);

}

/* ==========================================
   結果頁
========================================== */

function showResult(hex){

    animationPage.classList.remove("active");
    resultPage.classList.add("active");

    document.getElementById(
        "resultCategory"
    ).innerHTML =
    getCategoryText();

    document.getElementById(
        "resultName"
    ).innerHTML =
    `${hex.name}`;

    document.getElementById(
        "resultSymbol"
    ).innerHTML =
    hex.symbol;

    document.getElementById(
        "resultImage"
    ).innerHTML =
    hex.image;

    document.getElementById(
        "resultOracle"
    ).innerHTML =
    hex.oracle;

    document.getElementById(
        "resultAdvice"
    ).innerHTML =
    hex.advice;

}

/* ==========================================
   分類文字
========================================== */

function getCategoryText(){

    switch(selectedCategory){

        case "love":
            return "❤️ 感情指引";

        case "career":
            return "💼 工作指引";

        case "wealth":
            return "💰 財運指引";

        default:
            return "☯ 綜合指引";
    }

}

/* ==========================================
   再抽一次
========================================== */

document
.getElementById("drawAgainBtn")
.addEventListener("click",()=>{

    resultPage.classList.remove(
        "active"
    );

    startAnimation();

});

/* ==========================================
   回首頁
========================================== */

document
.getElementById("backHomeBtn")
.addEventListener("click",()=>{

    resultPage.classList.remove(
        "active"
    );

    animationPage.classList.remove(
        "active"
    );

    homePage.classList.add(
        "active"
    );

});
