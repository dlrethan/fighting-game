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
  imageSrc: "./imgs/background.png",
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
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
function determineWinner({ user, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (user.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (user.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
  } else {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
  }
}
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ user, enemy });
  }
}
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  user.update();
  enemy.update();

  user.velocity.x = 0;
  enemy.velocity.x = 0;
  //   Player Movement
  if (keys.a.pressed && user.lastKey === "a") {
    user.velocity.x = -3;
  } else if (keys.d.pressed && user.lastKey === "d") {
    user.velocity.x = 3;
  }
  // Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -3;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 3;
  }
  // detect collision
  if (
    rectangularCollision({
      rectangle1: user,
      rectangle2: enemy,
    }) &&
    user.isAttacking
  ) {
    user.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: user,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    user.health -= 20;
    document.querySelector("#userHealth").style.width = user.health + "%";
  }
  // end game if health = 0
  if (enemy.health <= 0 || user.health <= 0) {
    determineWinner({ user, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
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
