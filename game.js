const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const speed = 120; // 移動速度(ms)

let snake;
let direction;
let food;
let lastMoveTime = 0;
let changingDirection = false;
let gameOver = false;

function init() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = randomFood();
    gameOver = false;
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// 🎮 鍵盤控制（穩定版）
document.addEventListener("keydown", (event) => {
    const key = event.keyCode;

    if (changingDirection) return;
    changingDirection = true;

    if ([37, 38, 39, 40].includes(key)) event.preventDefault();

    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
});

// 撞自己
function collision(head, array) {
    return array.some(p => p.x === head.x && p.y === head.y);
}

// 🧠 更新邏輯（核心穩定點）
function update() {
    if (gameOver) return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    const newHead = { x: headX, y: headY };

    // ⭐ 真正邊界判定（不會誤判）
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        gameOver = true;
        alert("Game Over!");
        return;
    }

    // 吃食物
    if (headX === food.x && headY === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// 🎨 畫面
function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 蛇
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(s.x, s.y, box, box);
    });

    // 食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// 🔁 遊戲主迴圈（穩定版本）
function loop(timestamp) {
    if (!lastMoveTime) lastMoveTime = timestamp;

    if (timestamp - lastMoveTime > speed) {
        update();
        changingDirection = false; // ⭐ 每格只允許改一次方向
        lastMoveTime = timestamp;
    }

    draw();
    requestAnimationFrame(loop);
}

function startGame() {
    init();
    requestAnimationFrame(loop);
}

function restartGame() {
    init();
}

let started = false;

document.getElementById("startBtn").addEventListener("click", () => {
    if (!started) {
        startGame();
        started = true;
    }
});

/*✔ 不會提前死

→ 因為只更新「固定 tick」

✔ 不會亂跳格

→ 因為 requestAnimationFrame + speed 控制

✔ 不會連按方向爆炸

→ changingDirection 限制

✔ 撞牆完全準

→ canvas.width / height 直接判定
*/

