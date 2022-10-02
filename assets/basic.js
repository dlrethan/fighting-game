const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/imgs/background.png",
});
const shop = new Sprite({
  position: {
    x: 625,
    y: 128,
  },
  imageSrc: "./assets/imgs/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const user = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/imgs/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2,
  offset: {
    x: 100,
    y: 95,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/imgs/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/imgs/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/imgs/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/imgs/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/imgs/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/imgs/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/imgs/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 150,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/imgs/kenji/Idle.png",
  framesMax: 4,
  scale: 2,
  offset: {
    x: 100,
    y: 105,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/imgs/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/imgs/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/imgs/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/imgs/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/imgs/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/imgs/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/imgs/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -70,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  user.update();
  enemy.update();

  user.velocity.x = 0;
  enemy.velocity.x = 0;

  //   Player Movement

  if (keys.a.pressed && user.lastKey === "a") {
    user.velocity.x = -3;
    user.switchSprite("run");
  } else if (keys.d.pressed && user.lastKey === "d") {
    user.velocity.x = 3;
    user.switchSprite("run");
  } else {
    user.switchSprite("idle");
  }
  // Jumping
  if (user.velocity.y < 0) {
    user.switchSprite("jump");
  } else if (user.velocity.y > 0) {
    user.switchSprite("fall");
  }
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    // Enemy Movement
    enemy.velocity.x = -3;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 3;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  // detect collision
  if (
    rectangularCollision({
      rectangle1: user,
      rectangle2: enemy,
    }) &&
    user.isAttacking &&
    user.framesCurrent === 4
  ) {
    // enemy gets hit
    enemy.takeHit();
    user.isAttacking = false;

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }
  //  if player misses
  if (user.isAttacking && user.framesCurrent === 4) {
    user.isAttacking = false;
  }
  // player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: user,
    }) &&
    enemy.isAttacking
  ) {
    user.takeHit();
    enemy.isAttacking = false;
    gsap.to("#userHealth", {
      width: user.health + "%",
    });
  }
  //  if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  // end game if health = 0
  if (enemy.health <= 0 || user.health <= 0) {
    determineWinner({ user, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!user.dead) {
    switch (event.key) {
      // player movement
      case "d":
        keys.d.pressed = true;
        user.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        user.lastKey = "a";
        break;
      case "w":
        user.velocity.y = -10;
        break;
      case " ":
        user.attack();
        break;
      // enemy movement
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -10;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (event) => {
  //   Player Keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }
  //Enemy Keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
