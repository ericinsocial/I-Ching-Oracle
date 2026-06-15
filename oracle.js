/* ==========================================
   Oracle of Change
   Page Controller
========================================== */

let selectedCategory = null;
let oracleData = null;

const DATA_PATH = "oracle-data.json";
const VALID_CATEGORIES = ["love", "career", "wealth", "general"];

/* ==========================================
   載入卦象資料
========================================== */

fetch(DATA_PATH)
    .then(response => response.json())
    .then(data => {
        oracleData = data;
    })
    .catch(error => {
        console.error("Oracle data failed to load:", error);
        oracleData = null;
    });

/* ==========================================
   頁面元素
========================================== */

const homePage = document.getElementById("homePage");
const animationPage = document.getElementById("animationPage");
const resultPage = document.getElementById("resultPage");
const animationMessage = document.getElementById("animationMessage");
const revealedHexagram = document.getElementById("revealedHexagram");
const revealedNumber = document.getElementById("revealedNumber");
const revealedName = document.getElementById("revealedName");

/* ==========================================
   問題按鈕
========================================== */

document.querySelectorAll(".question-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        startAnimation();
    });
});

/* ==========================================
   開始動畫
========================================== */

function startAnimation() {
    if (!Array.isArray(oracleData) || oracleData.length === 0) {
        alert("資料載入中，請稍後再試。");
        return;
    }

    if (window.resetOracleAnimation) {
        window.resetOracleAnimation();
    }

    homePage.classList.remove("active");
    animationPage.classList.add("active");
    animationMessage.innerHTML = "靜心感受你的問題";
    revealedHexagram.classList.add("hidden");

    setTimeout(() => {
        animationMessage.innerHTML = "天地有道<br>萬物有時";
    }, 2000);

    setTimeout(() => {
        animationMessage.innerHTML = "卦象正在形成...";
    }, 4500);

    setTimeout(() => {
        revealHexagram();
    }, 7000);
}

/* ==========================================
   揭曉卦象
========================================== */

function revealHexagram() {
    const randomIndex = Math.floor(Math.random() * oracleData.length);
    const hexagram = createHexagramResult(oracleData[randomIndex]);

    animationMessage.innerHTML = "正在解讀卦象...";
    revealedNumber.innerHTML = `第 ${hexagram.number} 卦`;
    revealedName.innerHTML = hexagram.name;
    revealedHexagram.classList.remove("hidden");

    setTimeout(() => {
        showResult(hexagram);
    }, 1800);
}

/* ==========================================
   依分類整理結果
========================================== */

function createHexagramResult(hexagram) {
    const category = getSafeCategory();
    const categoryData = hexagram[category] || hexagram.general || {};

    return {
        number: hexagram.number || "",
        name: hexagram.name || "",
        symbol: hexagram.symbol || "",
        image: hexagram.image || "",
        oracle: categoryData.oracle || "",
        advice: categoryData.advice || ""
    };
}

function getSafeCategory() {
    if (VALID_CATEGORIES.includes(selectedCategory)) {
        return selectedCategory;
    }

    return "general";
}

/* ==========================================
   結果頁
========================================== */

function showResult(hexagram) {
    animationPage.classList.remove("active");
    resultPage.classList.add("active");

    document.getElementById("resultCategory").innerHTML = getCategoryText();
    document.getElementById("resultName").innerHTML = hexagram.name;
    document.getElementById("resultSymbol").innerHTML = hexagram.symbol;
    document.getElementById("resultImage").innerHTML = hexagram.image;
    document.getElementById("resultOracle").innerHTML = hexagram.oracle;
    document.getElementById("resultAdvice").innerHTML = hexagram.advice || "";
}

/* ==========================================
   分類文字
========================================== */

function getCategoryText() {
    switch (getSafeCategory()) {
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

document.getElementById("drawAgainBtn").addEventListener("click", () => {
    resultPage.classList.remove("active");
    startAnimation();
});

/* ==========================================
   回首頁
========================================== */

document.getElementById("backHomeBtn").addEventListener("click", () => {
    resultPage.classList.remove("active");
    animationPage.classList.remove("active");
    homePage.classList.add("active");
});
