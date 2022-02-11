class Character {
    constructor(sprite, x, y, width, height, frameX, frameY, speed) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
    }
}

class Enemy extends Character {
    constructor(sprite, x, y, width, height, frameX, frameY, speed) {
        super(sprite, x, y, width, height, frameX, frameY, speed);
    }

    updatePosition(player) {
        if (this.x < player.x) {
            this.x += this.speed;
        }
        if (this.y < player.y) {
            this.y += this.speed;
        }
        if (this.x > player.x) {
            this.x -= this.speed;
        }
        if (this.y > player.y) {
            this.y -= this.speed;
        }
    }
}

class Player extends Character {
    constructor(sprite, x, y, width, height, frameX, frameY, speed) {
        super(sprite, x, y, width, height, frameX, frameY, speed);
        this.side = 0;
    }
}

const canvas = document.getElementById("canvas1"); //Sucht im .html nach Canvas
const context = canvas.getContext("2d"); // Mit co kann jetzt Objekte gezeichnet werden
canvas.width = 1100;
canvas.height = 800;

const player = new Player(
    null,
    canvas.width / 2,
    canvas.height / 2,
    500,
    716,
    0,
    0,
    3
);

const playerSprite1 = new Image();
playerSprite1.src = "js/src/CandleKnight.png";
const playerSprite2 = new Image();
playerSprite2.src = "js/src/PlagueDoctor";
player.sprite = playerSprite1;

const background = new Image();
background.src = "js/src/dungeon.png";
const enemy1Sprite = new Image();
enemy1Sprite.src = "js/src/Skelett.png";

/////////////////////////////////////////////////////////////////////////////////////
//                        PLAYERVARIABLEN
let position = 0;
let enemies = [] //Gegner-Speicher
const projectiles = []
var activeKey = 0;
var walkLeft = 0;
var walkUp = 0;
var walkRight = 0;
var walkDown = 0;
context.fillStyle = "white";
var enemyPosX = 0;
var enemyPosY = 0;
var enemySpeed = 1;
var enemySpawnCounter = 0;
let lastUpdate = new Date();
let tps = 60;

animate();
spawnEnemies(enemy1Sprite);

/////////////////////////////////////////////////////////////////////////////////////
//                         MOVEMENT

addEventListener("keydown", function (e) {
    switch (e.code) {
        case "KeyA":
            walkLeft = 1;
            break;
        case "KeyW":
            walkUp = 1;
            break;
        case "KeyD":
            walkRight = 1;
            break;
        case "KeyS":
            walkDown = 1;
            break;
    }
})

addEventListener("keyup", function (e) {
    switch (e.code) {
        case "KeyA":
            walkLeft = 0;
            break;
        case "KeyW":
            walkUp = 0;
            break;
        case "KeyD":
            walkRight = 0;
            break;
        case "KeyS":
            walkDown = 0;
            break;
    }
})
///////////////////////////////////////////////////////////////////////////////////////
//                         FUNKTIONEN

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    context.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function walkDirection() {
    if (walkLeft) {
        player.x -= player.speed;
    }
    if (walkUp) {
        player.y -= player.speed;
    }
    if (walkRight) {
        player.x += player.speed;
    }
    if (walkDown) {
        player.y += player.speed;
    }
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); //Alles löschen
    context.drawImage(background, 0, 0, canvas.width, canvas.height); //Hintergrund
    playerDirection() //Spieler Blickrichtung
    walkDirection() //Spieler Lauf-Aktion
    drawSprite(player.sprite, player.side, 0, player.width, player.height, player.x, player.y, 100, 120); //Spieler
    requestAnimationFrame(animate);
    let updateFlag = new Date() - lastUpdate > 1000 / tps;
    if (updateFlag) {
        lastUpdate = new Date();
    }

    enemies = enemies.filter(enemy => enemy.x !== player.x || enemy.y !== player.y);

    enemies.forEach((enemy) => {
        if (updateFlag) {
            enemy.updatePosition(player);
        }
        drawSprite(enemy.sprite, 0, 0, enemy.width, enemy.height, enemy.x, enemy.y, 100, 120);
    });
}

function playerDirection() {
    if (walkRight) {
        player.side = 0
    }
    if (walkLeft) {
        player.side = 500
    }
}

function spawnEnemies(enemyType) {
    setInterval(() => {
        let enemy = new Enemy(
            enemyType,
            (Math.random() < 0.5) ? 0 : canvas.width,
            (Math.random() < 0.5) ? 0 : canvas.height,
            500,
            716,
            0,
            0,
            3);
        enemies.push(enemy);
    }, 2000)
}
