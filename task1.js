const MAX_HP = 100;
const HERO_MIN_ATTACK = 8;
const HERO_MAX_ATTACK = 15;
const ENEMY_MIN_ATTACK = 5;
const ENEMY_MAX_ATTACK = 14;
const HEAL_AMOUNT = 20;
const MAX_HEALS = 3;
const CRIT_CHANCE = 0.1;
const CRIT_MULTIPLIER = 1.5;

let heroHp = MAX_HP;
let enemyHp = MAX_HP;
let healsLeft = MAX_HEALS;
let isDefending = false;
let gameOver = false;
let actionLog = [];

const heroHpEl = document.getElementById("hero-hp");
const enemyHpEl = document.getElementById("enemy-hp");
const heroHpBar = document.getElementById("hero-hp-bar");
const enemyHpBar = document.getElementById("enemy-hp-bar");
const healCountEl = document.getElementById("heal-count");
const messageBox = document.getElementById("message-box");
const attackBtn = document.getElementById("attack-btn");
const defendBtn = document.getElementById("defend-btn");
const healBtn = document.getElementById("heal-btn");
const restartBtn = document.getElementById("restart-btn");
const actionLogEl = document.getElementById("action-log");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateView() {
    heroHpEl.textContent = heroHp;
    enemyHpEl.textContent = enemyHp;
    healCountEl.textContent = healsLeft;

    const heroPercent = Math.max(0, (heroHp / MAX_HP) * 100);
    const enemyPercent = Math.max(0, (enemyHp / MAX_HP) * 100);

    heroHpBar.style.width = heroPercent + "%";
    enemyHpBar.style.width = enemyPercent + "%";

    actionLogEl.innerHTML = "";
    for (let i = 0; i < actionLog.length; i++) {
        const li = document.createElement("li");
        li.textContent = actionLog[i];
        actionLogEl.appendChild(li);
    }
}

function addLog(text) {
    actionLog.unshift(text);
    if (actionLog.length > 5) {
        actionLog.pop();
    }
}

function checkWinLoss() {
    if (heroHp <= 0 && enemyHp <= 0) {
        heroHp = 0;
        enemyHp = 0;
        messageBox.textContent = "It's a draw!";
        endGame();
        return true;
    } else if (enemyHp <= 0) {
        enemyHp = 0;
        messageBox.textContent = "You Win!";
        endGame();
        return true;
    } else if (heroHp <= 0) {
        heroHp = 0;
        messageBox.textContent = "You Lose!";
        endGame();
        return true;
    }
    return false;
}

function endGame() {
    gameOver = true;
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    healBtn.disabled = true;
    restartBtn.classList.remove("hidden");
}

function enemyTurn() {
    if (gameOver) return;

    let enemyDamage = getRandomInt(ENEMY_MIN_ATTACK, ENEMY_MAX_ATTACK);
    let isCrit = Math.random() < CRIT_CHANCE;

    if (isCrit) {
        enemyDamage = Math.floor(enemyDamage * CRIT_MULTIPLIER);
    }

    if (isDefending) {
        enemyDamage = Math.floor(enemyDamage / 2);
        isDefending = false;
        addLog("Enemy attacked, but you defended! Damage halved to " + enemyDamage + ".");
    } else {
        if (isCrit) {
            addLog("Critical hit! Enemy deals " + enemyDamage + " damage.");
        } else {
            addLog("Enemy deals " + enemyDamage + " damage.");
        }
    }

    heroHp -= enemyDamage;
    if (heroHp < 0) heroHp = 0;
}

function handleAttack() {
    if (gameOver) return;

    let damage = getRandomInt(HERO_MIN_ATTACK, HERO_MAX_ATTACK);
    enemyHp -= damage;
    if (enemyHp < 0) enemyHp = 0;

    addLog("You attack for " + damage + " damage.");
    
    if (!checkWinLoss()) {
        enemyTurn();
        checkWinLoss();
    }
    updateView();
}

function handleDefend() {
    if (gameOver) return;

    isDefending = true;
    addLog("You take a defensive stance.");

    if (!checkWinLoss()) {
        enemyTurn();
        checkWinLoss();
    }
    updateView();
}

function handleHeal() {
    if (gameOver) return;

    if (healsLeft <= 0 || heroHp >= MAX_HP) {
        messageBox.textContent = "Cannot heal right now!";
        return;
    }

    messageBox.textContent = "Choose your action!";
    heroHp += HEAL_AMOUNT;
    if (heroHp > MAX_HP) heroHp = MAX_HP;
    healsLeft--;

    addLog("You healed for " + HEAL_AMOUNT + " HP.");

    if (!checkWinLoss()) {
        enemyTurn();
        checkWinLoss();
    }
    updateView();
}

function handleRestart() {
    heroHp = MAX_HP;
    enemyHp = MAX_HP;
    healsLeft = MAX_HEALS;
    isDefending = false;
    gameOver = false;
    actionLog = [];
    messageBox.textContent = "Choose your action!";

    attackBtn.disabled = false;
    defendBtn.disabled = false;
    healBtn.disabled = false;
    restartBtn.classList.add("hidden");

    updateView();
}

attackBtn.addEventListener("click", handleAttack);
defendBtn.addEventListener("click", handleDefend);
healBtn.addEventListener("click", handleHeal);
restartBtn.addEventListener("click", handleRestart);

updateView();