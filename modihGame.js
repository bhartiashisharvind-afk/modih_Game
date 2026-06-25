const game = document.getElementById("game");
const player = document.getElementById("player");

const scoreEl = document.getElementById("score");
const seasonEl = document.getElementById("season");

const gameOverScreen = document.getElementById("gameOver");
const countdownEl = document.getElementById("countdown");

const nightBtn = document.getElementById("nightBtn");
const isMobile = window.innerWidth < 789;

const groundLevel = isMobile ? 90 : 60;
const obstacleSpeed = isMobile ? 4 : 7;
const coinSpeed = isMobile ? 4 : 6;

const cloudContainer =
document.getElementById("cloudContainer");

const starsContainer =
document.getElementById("starsContainer");

/* =========================
   SETTINGS
========================= */
const EndGame = new Audio("./jump.mp3.mpeg")
const JUMP_VOICE_TEXT = new Audio("./modih.mp3.mpeg");

const coinSound = new Audio(
    "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
);

let score = 0;
let alive = true;
let jumping = false;
let velocityY = 0;
let countdown = 10;
let nightMode = false;
let gamePaused = false;

/* =========================
   MOBILE SIZE
========================= */

if (window.innerWidth < 789) {

    player.style.width = "40px";
    player.style.height = "40px";

    player.style.position = "absolute";

    /* Left side push */
    player.style.left = "40px";
}
/* =========================
   TAB VISIBILITY PAUSE
========================= */

document.addEventListener(
    "visibilitychange",
    () => {
        gamePaused = document.hidden;
    }
);

/* =========================
   VOICE
========================= */

function speakJump() {
    JUMP_VOICE_TEXT.play();
}

/* =========================
   JUMP
========================= */

function jump() {
    if (!jumping && alive) {
        jumping = true;
        velocityY = 23;
        
    }
}

document.addEventListener("keydown", e => {
    if (
        e.code === "Space" ||
        e.code === "ArrowUp"
    ) {
        jump();
    }
});

document.addEventListener(
    "touchstart",
    () => {
        jump();
        speakJump();
    },
    { passive: true }
);

/* =========================
   SEASONS
========================= */

function setSeason(name, cls) {

    document.body.classList.remove(
        "summer",
        "rain",
        "winter"
    );

    document.body.classList.add(cls);

    seasonEl.textContent = name;
}

setSeason("Summer", "summer");

setTimeout(() => {
    setSeason("Rain", "rain");
}, 120000);

/* =========================
   NIGHT MODE
========================= */

nightBtn.addEventListener(
    "click",
    () => {

        nightMode = !nightMode;

        if (nightMode) {

            document.body.classList.add(
                "night"
            );

            createStars();

            nightBtn.innerText =
            "☀️ Day Mode";

        } else {

            document.body.classList.remove(
                "night"
            );

            starsContainer.innerHTML = "";

            nightBtn.innerText =
            "🌙 Night Mode";
        }
    }
);

/* =========================
   STARS
========================= */

function createStars() {

    starsContainer.innerHTML = "";

    const starCount =
    window.innerWidth < 789
        ? 80
        : 250;

    for (
        let i = 0;
        i < starCount;
        i++
    ) {

        const star =
        document.createElement("div");

        star.className = "star";

        const size =
        Math.random() * 3 + 1;

        star.style.width =
        size + "px";

        star.style.height =
        size + "px";

        star.style.left =
        Math.random() *
        window.innerWidth +
        "px";

        star.style.top =
        Math.random() *
        window.innerHeight +
        "px";

        star.style.animationDelay =
        Math.random() * 2 + "s";

        starsContainer.appendChild(
            star
        );
    }
}

/* =========================
   CLOUDS
========================= */

function spawnCloud() {

    if (gamePaused) return;

    const cloud =
    document.createElement("div");

    cloud.className = "cloud";

    cloud.style.top =
    Math.random() * 250 + "px";

    cloud.style.left =
    window.innerWidth + "px";

    cloudContainer.appendChild(
        cloud
    );

    const move =
    setInterval(() => {

        if (gamePaused) return;

        cloud.style.left =
        (
            parseFloat(
                cloud.style.left
            ) - 1
        ) + "px";

        if (
            parseFloat(
                cloud.style.left
            ) < -200
        ) {

            clearInterval(move);

            cloud.remove();
        }

    }, 20);
}

setInterval(
    spawnCloud,
    2500
);

/* =========================
   OBSTACLES
========================= */

function spawnObstacle() {

    if (!alive || gamePaused)
        return;

    const obstacle =
    document.createElement("div");

    obstacle.className =
    "obstacle";

    if (
        window.innerWidth < 789
    ) {

        obstacle.style.width =
        "25px";

        obstacle.style.height =
        "40px";
        obstacle.style.marginBottom = "30px";

    } else {

        obstacle.style.width =
        (
            25 +
            Math.random() * 40
        ) + "px";

        obstacle.style.height =
        (
            40 +
            Math.random() * 90
        ) + "px";
    }

    obstacle.style.left =
    window.innerWidth + "px";

    game.appendChild(
        obstacle
    );
}

setInterval(
    spawnObstacle,
    1800
);

/* =========================
   COINS
========================= */

function spawnCoin() {

    if (!alive || gamePaused)
        return;

    const coin =
    document.createElement("div");

    coin.className = "coin";

    coin.style.left =
    window.innerWidth + "px";

    coin.style.bottom =
    (
        130 +
        Math.random() * 100
    ) + "px";

    game.appendChild(
        coin
    );
}

setInterval(
    spawnCoin,
    2500
);


/* =========================
   COLLISION
========================= */

function collision(a, b) {

    const r1 =
    a.getBoundingClientRect();

    const r2 =
    b.getBoundingClientRect();

    return (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
    );
}

/* =========================
   GAME OVER
========================= */

function gameOver() {

    if (!alive) return;

    alive = false;

    gameOverScreen.classList.remove(
        "hidden"
    );

    countdown = 10;
    EndGame.play();
    countdownEl.innerText =
    countdown;

    const timer =
    setInterval(() => {

        countdown--;

        countdownEl.innerText =
        countdown;

        if (
            countdown <= 0
        ) {

            clearInterval(
                timer
            );

            restartGame();
        }

    }, 1000);
}

function restartGame() {
    location.reload();
}

function leaveGame() {
    window.location.href =
    "about:blank";
}

/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (gamePaused) {

        requestAnimationFrame(
            gameLoop
        );

        return;
    }

    if (alive) {

        if (jumping) {

            player.style.bottom =
            (
                parseInt(
                    player.style.bottom ||
                    60
                ) + velocityY
            ) + "px";

            velocityY -= 1;

            if (
    parseInt(player.style.bottom)
    <= groundLevel
) {

    player.style.bottom =
    groundLevel + "px";

    jumping = false;
}
        }

        document
        .querySelectorAll(
            ".obstacle"
        )
        .forEach(obstacle => {

            obstacle.style.left =
            (
                parseInt(
                    obstacle.style.left
                ) - obstacleSpeed
            ) + "px";

            if (
                collision(
                    player,
                    obstacle
                )
            ) {
                gameOver();
            }

            if (
                parseInt(
                    obstacle.style.left
                ) < -100
            ) {
                obstacle.remove();
            }
        });

        document
        .querySelectorAll(
            ".coin"
        )
        .forEach(coin => {

            coin.style.left =
(
    parseInt(
        coin.style.left
    ) - coinSpeed
) + "px";

            if (
                collision(
                    player,
                    coin
                )
            ) {

                score++;

                scoreEl.innerText =
                score;

                coinSound.currentTime =
                0;

                coinSound.play();

                coin.remove();
            }

            if (
                parseInt(
                    coin.style.left
                ) < -50
            ) {
                coin.remove();
            }
        });
    }

    requestAnimationFrame(
        gameLoop
    );
}

/* =========================
   START
========================= */

player.style.bottom = groundLevel + "px";

gameLoop();