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
    return hexagram || {};
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

function showResult(hex) {
    const categoryData = hex[selectedCategory] || hex.general || {};

    animationPage.classList.remove("active");
    resultPage.classList.add("active");

    document.getElementById("resultTitle").innerHTML = hex.title || hex.name || "";
    document.getElementById("resultTrigram").innerHTML = hex.upper && hex.lower ? `上${hex.upper}下${hex.lower}` : "";
    document.getElementById("resultCategory").innerHTML = getCategoryText();
    document.getElementById("resultAdvice").innerHTML = categoryData.advice || "";
    document.getElementById("resultOracle").innerHTML = categoryData.oracle || "";
}

/* ==========================================
   分類文字
========================================== */

function getCategoryText() {
    switch (getSafeCategory()) {
        case "love":
            return "今感情提醒";
        case "career":
            return "今工作提醒";
        case "wealth":
            return "今財運提醒";
        case "general":
            return "今人生提醒";
        default:
            return "今人生提醒";
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

/* ==========================================
   分享結果圖片
========================================== */

const shareResultBtn = document.getElementById("shareResultBtn");

function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "oracle-result.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function canvasToBlob(canvas) {
    return new Promise(resolve => {
        canvas.toBlob(resolve, "image/png");
    });
}

async function shareResultImage() {
    const resultCard = document.querySelector(".result-card");

    if (!resultCard || typeof html2canvas !== "function") {
        alert("分享功能尚未載入完成，請稍後再試。");
        return;
    }

    shareResultBtn.disabled = true;
    shareResultBtn.classList.add("is-sharing");

    try {
        const canvas = await html2canvas(resultCard, {
            backgroundColor: null,
            scale: Math.min(window.devicePixelRatio || 1, 2),
            useCORS: true
        });
        const blob = await canvasToBlob(canvas);

        if (!blob) {
            throw new Error("Result image could not be generated.");
        }

        const file = new File([blob], "oracle-result.png", { type: "image/png" });
        const shareData = {
            title: "詠真堂占卜結果",
            text: "我的占卜結果",
            files: [file]
        };

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share(shareData);
        } else {
            downloadImage(blob);
        }
    } catch (error) {
        console.error("Result sharing failed:", error);
        alert("分享圖片產生失敗，請稍後再試。");
    } finally {
        shareResultBtn.disabled = false;
        shareResultBtn.classList.remove("is-sharing");
    }
}

shareResultBtn.addEventListener("click", shareResultImage);
