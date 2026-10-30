const snackMessages = {
  cozy: 'Cozy & warm it is. I’m claiming the comfiest seat next to you. 🍜',
  sweet: 'Sweet treat date! You pick the dessert, I’ll bring the kisses. 🍓',
  surprise: 'A surprise snack date! I trust your excellent snack instincts. 🎁',
};

const snackButtons = document.querySelectorAll('.snack-option');
const snackFeedback = document.querySelector('#snack-feedback');

snackButtons.forEach((button) => {
  button.addEventListener('click', () => {
    snackButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    snackFeedback.textContent = snackMessages[button.dataset.snack];
  });
});

const gameStage = document.querySelector('#game-stage');
const gameIntro = document.querySelector('#game-intro');
const gameTarget = document.querySelector('#game-target');
const gameResult = document.querySelector('#game-result');
const gameScore = document.querySelector('#game-score');
const gameTimer = document.querySelector('#game-timer');
const gameMessage = document.querySelector('#game-message');
const gameButton = document.querySelector('#game-button');
const snackSprites = ['🍪', '🍓', '🍕', '🧁', '🥐', '🍩'];
let caughtSnacks = 0;
let secondsLeft = 20;
let gameClock;
let escapeClock;
let gameIsRunning = false;

function moveRunawaySnack() {
  gameTarget.style.left = `${12 + Math.random() * 76}%`;
  gameTarget.style.top = `${19 + Math.random() * 62}%`;
  gameTarget.textContent = snackSprites[Math.floor(Math.random() * snackSprites.length)];
}

function stopSnackGame(won) {
  gameIsRunning = false;
  window.clearInterval(gameClock);
  window.clearInterval(escapeClock);
  gameTarget.hidden = true;
  gameResult.innerHTML = won
    ? 'Snack champion! 🏆<small>Five snacks rescued. Your reward: a real snack date with your favorite human.</small>'
    : 'The snacks escaped… for now. 🏃<small>No worries, we believe in second breakfast and second chances.</small>';
  gameResult.hidden = false;
  gameMessage.textContent = won ? 'Achievement unlocked: responsible snack guardian.' : 'The snack gremlin won this round. Rematch?';
  gameButton.innerHTML = 'Play again <span aria-hidden="true">↻</span>';
}

function startSnackGame() {
  window.clearInterval(gameClock);
  window.clearInterval(escapeClock);
  caughtSnacks = 0;
  secondsLeft = 20;
  gameIsRunning = true;
  gameScore.textContent = '0 / 5';
  gameTimer.textContent = `${secondsLeft}s`;
  gameMessage.textContent = 'Tap the snack before it scurries away!';
  gameIntro.hidden = true;
  gameResult.hidden = true;
  gameTarget.hidden = false;
  gameButton.innerHTML = 'Game in progress… <span aria-hidden="true">♥</span>';
  moveRunawaySnack();
  escapeClock = window.setInterval(moveRunawaySnack, 1150);
  gameClock = window.setInterval(() => {
    secondsLeft -= 1;
    gameTimer.textContent = `${secondsLeft}s`;
    if (secondsLeft <= 0) stopSnackGame(false);
  }, 1000);
}

gameButton.addEventListener('click', startSnackGame);
gameTarget.addEventListener('click', () => {
  if (!gameIsRunning) return;
  caughtSnacks += 1;
  gameScore.textContent = `${caughtSnacks} / 5`;
  gameMessage.textContent = ['Gotcha! The snack gremlin is shook. 😳', 'One for you, one for… also you. 🍪', 'That snack never stood a chance. 💨', 'Elite reflexes, babe! ✨'][Math.floor(Math.random() * 4)];
  if (caughtSnacks >= 5) {
    stopSnackGame(true);
    launchHearts();
    return;
  }
  moveRunawaySnack();
});

const promiseButton = document.querySelector('#promise-button');
const promiseConfirmation = document.querySelector('#promise-confirmation');
const celebrationLayer = document.querySelector('#celebration-layer');

promiseButton.addEventListener('click', () => {
  if (promiseButton.classList.contains('is-sealed')) return;

  promiseButton.classList.add('is-sealed');
  promiseButton.innerHTML = '<span>Promise sealed!</span><span aria-hidden="true">♥</span>';
  promiseButton.setAttribute('aria-pressed', 'true');
  promiseConfirmation.hidden = false;
  launchHearts();
});

const secretButton = document.querySelector('#secret-button');
const secretNote = document.querySelector('#secret-note');

secretButton.addEventListener('click', () => {
  const isExpanded = secretButton.getAttribute('aria-expanded') === 'true';
  secretButton.setAttribute('aria-expanded', String(!isExpanded));
  secretNote.hidden = isExpanded;
});

function launchHearts() {
  const symbols = ['♥', '♡', '✦', '💗'];
  for (let index = 0; index < 34; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'confetti';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.setProperty('--left', `${Math.random() * 100}%`);
    heart.style.setProperty('--size', `${12 + Math.random() * 16}px`);
    heart.style.setProperty('--duration', `${2.2 + Math.random() * 2.2}s`);
    heart.style.setProperty('--delay', `${Math.random() * 0.6}s`);
    heart.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    heart.style.setProperty('--rotation', `${-240 + Math.random() * 480}deg`);
    celebrationLayer.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}
