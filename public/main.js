const canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.documentElement.clientHeight;
const ctx = canvas.getContext('2d'),
    player = {
        x: 60,
        y: canvas.height / 2,
        w: 30,
        h: 30
    }

let obstacles = [];
let score = 0
let color = '#FF0000';

class Character {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = 0;
        this.dy = 0;
    }

    draw() {
        this.wallCollisions();

        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.font = '30px Work Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`PPMS: ${timeCount}`, 120, 30)

        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.font = '30px Work Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${score} | Seconds Until Next Spawn: ${(timeInterval / 1000).toFixed(2)} seconds`, canvas.width / 2, 30)

        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 60, canvas.height)
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    wallCollisions() {
        //Top Wall
        if (this.y <= 0) {
            this.y = 0;
        }
        //Bottom Wall
        if (this.y >= canvas.height - player.h) {
            this.y = canvas.height - player.h
        }
    }

    update() {
        if (controller1.up) {
            this.dy -= 0.5
        };
        if (controller1.down) {
            this.dy += 0.5
        };
        
        if (controller1.left) {
            this.dx -= 0.5
        };
        
        if (controller1.right) {
            this.dx += 0.5
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dx *= 0.9;
        this.dy *= 0.9;
        this.draw();
    }

    spawner() {
        obstacles.push({
            x: canvas.width - 60,
            y: Math.random() * (canvas.height - 0) + 0,
            w: 60,
            h: 30,
        });
        /*
        obstacles.push({
            x: canvas.width - 60,
            y: Math.random() * (canvas.height - 0) + 0,
            //triange stuff
        })
        */
    }
}

class Controller {
    constructor() {
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;

        let keyEvent = (e) => {
            if (e.code == "KeyW" || e.code == "ArrowUp") { this.up = e.type == 'keydown' };
            if (e.code == "KeyD" || e.code == "ArrowRight") { this.right = e.type == 'keydown' };
            if (e.code == "KeyS" || e.code == "ArrowDown") { this.down = e.type == 'keydown' };
            if (e.code == "KeyA" || e.code == "ArrowLeft") { this.left = e.type == 'keydown' };

        }
        addEventListener('keydown', keyEvent);
        addEventListener('keyup', keyEvent);
        addEventListener('mousemove', keyEvent)
    }
}

let character1 = new Character(player.x, player.y, player.w, player.h);
let controller1 = new Controller();

let timeInterval = 1000;
let timeCount = 10;
let timeCheck = true;

setInterval(function() {
    if (timeInterval != 100) {
        timeInterval = timeInterval - 20;
    } else if (timeInterval < 100) {
        return
    }
    if (timeInterval <= 2750) {
        character1.spawner();
        color = '#fcffa4';
        if (timeInterval > 2500) {
            timeCount = 12;
        }
    }
    if (timeInterval <= 2500) {
        character1.spawner();
        color = '#ffcff1';
    }
    if (timeInterval <= 2250 && timeInterval > 2000) {
        color = 'ffcba4';
        timeCount = 14;
    }
    if (timeInterval <= 2000 && timeInterval > 1500) {
        color = '#98ff98';
        timeCount = 18;
    }
    if (timeInterval <= 1500) {
        character1.spawner();
        color = '#87cefa';
        if (timeInterval > 1000) {
            timeCount = 20;
        }
    }
    if (timeInterval <= 1000) {
        character1.spawner();
        color = '#dda0dd';
        if (timeInterval > 500) {
            timeCount = 23;
        }
    }
    if (timeInterval <= 500) {
        character1.spawner();
        color = '#d2691e';
        if (timeInterval > 250) {
            timeCount = 25;
        }
    }
    if (timeInterval <= 250) {
        character1.spawner();
        color = '#000000';
        timeCount = 30;
    }
}, 3000)

setInterval(function() {
    character1.spawner();
}, timeInterval)

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character1.update();



    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);

        if (obstacles[i].x + obstacles[i].w <= 60 && obstacles[i].x >= -10) {
            //obstacles.splice(i, 1)
            score++
        }

        setTimeout(function() {
            if (!obstacles[i]) return
            obstacles[i].x = obstacles[i].x - timeCount;
        })
        collisionCheck(character1, obstacles[i])

    }

    requestAnimationFrame(animate);
}
animate();

function collisionCheck(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
        obstacles = [];
        if (confirm("You Died!")) {
            document.location.reload();
        } else {
            document.location.reload();
        }
    }
}
