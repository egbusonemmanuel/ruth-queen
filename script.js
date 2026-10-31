const surpriseButton = document.getElementById('surprise-button');
const surpriseNote = document.getElementById('surprise-note');
const photoDialog = document.getElementById('photo-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogCaption = document.getElementById('dialog-caption');
const dialogClose = photoDialog.querySelector('.dialog-close');
const loveButton = document.getElementById('love-button');
const heartBurst = document.getElementById('heart-burst');
const loveAnnouncement = document.getElementById('love-announcement');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeButton = document.getElementById('welcome-button');
const welcomeButtonLabel = welcomeButton.querySelector('.welcome-button-label');
const stardustField = document.getElementById('stardust-field');
const siteContent = document.getElementById('site-content');
const song = document.getElementById('our-song');
const musicPlayer = document.querySelector('.music-player');
const musicPlayButton = document.getElementById('music-play');
const musicProgress = document.getElementById('music-progress');
const musicCurrent = document.getElementById('music-current');
const musicDuration = document.getElementById('music-duration');
const musicStatus = document.getElementById('music-status');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeLabel = themeToggle.querySelector('.theme-label');
const themeColor = document.querySelector('meta[name="theme-color"]');
const previousPhoto = document.getElementById('previous-photo');
const nextPhoto = document.getElementById('next-photo');
const memoryCards = Array.from(document.querySelectorAll('.memory-card'));
const loveNotes = [
  'In every version of the story, in every ordinary Tuesday and every big adventure, I’m grateful it’s you.',
  'If I could keep one little moment forever, it would be one where I get to see you smile.',
  'Just a reminder: you make my world softer, brighter, and so much more fun.',
];
let currentPhotoIndex = 0;
let currentLoveNote = 0;

function addAmbientStars() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 85; index++) {
    const star = document.createElement('span');
    star.className = `ambient-star${index % 9 === 0 ? ' is-bright' : ''}`;
    star.style.setProperty('--star-x', `${Math.random() * 100}%`);
    star.style.setProperty('--star-y', `${Math.random() * 100}%`);
    star.style.setProperty('--star-size', `${1 + Math.random() * (index % 9 === 0 ? 2 : 1.4)}px`);
    star.style.setProperty('--star-duration', `${2.4 + Math.random() * 4.5}s`);
    star.style.setProperty('--star-delay', `${-Math.random() * 6}s`);
    fragment.append(star);
  }

  stardustField.append(fragment);
}

function createStardustBurst() {
  const fragment = document.createDocumentFragment();
  const radius = Math.hypot(window.innerWidth, window.innerHeight) * .68;
  const colors = ['#fff0d4', '#f7c3d4', '#d9c5ff', '#ffffff', '#e7a5b8'];

  for (let index = 0; index < 145; index++) {
    const star = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = radius * (.22 + Math.random() * .78);
    star.className = `burst-star${index % 10 === 0 ? ' is-spark' : ''}`;
    star.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
    star.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
    star.style.setProperty('--burst-size', `${1 + Math.random() * 2.4}px`);
    star.style.setProperty('--star-color', colors[Math.floor(Math.random() * colors.length)]);
    star.style.setProperty('--burst-duration', `${1.2 + Math.random() * .55}s`);
    star.style.setProperty('--burst-delay', `${Math.random() * .16}s`);
    star.addEventListener('animationend', () => star.remove(), { once: true });
    fragment.append(star);
  }

  stardustField.append(fragment);
}

function startOurSongFromWelcome() {
  musicStatus.textContent = 'Starting our song...';
  song.play().catch(() => {
    musicStatus.textContent = 'Tap play if the song did not start automatically.';
  });
}

function openWelcome() {
  if (welcomeScreen.classList.contains('is-opening')) return;

  welcomeButton.disabled = true;
  welcomeButtonLabel.textContent = 'Opening a little magic...';
  welcomeScreen.classList.add('is-opening');
  createStardustBurst();
  startOurSongFromWelcome();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => {
    welcomeScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      siteContent.inert = false;
      siteContent.removeAttribute('aria-hidden');
      welcomeScreen.hidden = true;
      document.body.classList.remove('welcome-active');
      document.querySelector('#home h1').focus({ preventScroll: true });
    }, reducedMotion ? 100 : 760);
  }, reducedMotion ? 100 : 1760);
}

addAmbientStars();
welcomeButton.addEventListener('click', openWelcome);
welcomeButton.focus({ preventScroll: true });

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateMusicProgress() {
  if (!Number.isFinite(song.duration) || song.duration <= 0) return;

  const progress = (song.currentTime / song.duration) * 100;
  musicProgress.max = String(song.duration);
  musicProgress.value = String(song.currentTime);
  musicProgress.style.setProperty('--progress', `${progress}%`);
  musicProgress.setAttribute('aria-valuetext', `${formatTime(song.currentTime)} of ${formatTime(song.duration)}`);
  musicCurrent.textContent = formatTime(song.currentTime);
  musicDuration.textContent = formatTime(song.duration);
  musicProgress.disabled = false;
}

song.addEventListener('loadedmetadata', updateMusicProgress);
song.addEventListener('durationchange', updateMusicProgress);
song.addEventListener('timeupdate', updateMusicProgress);
song.addEventListener('seeked', updateMusicProgress);
if (song.readyState >= HTMLMediaElement.HAVE_METADATA) {
  updateMusicProgress();
}

song.addEventListener('play', () => {
  musicPlayer.classList.add('is-playing');
  musicPlayer.classList.remove('has-error');
  musicPlayButton.setAttribute('aria-label', 'Pause our song');
  musicStatus.textContent = 'Getting our song ready...';
});

song.addEventListener('playing', () => {
  musicPlayer.classList.remove('has-error');
  musicStatus.textContent = 'Now playing · just for us';
});

song.addEventListener('waiting', () => {
  if (!song.paused) {
    musicStatus.textContent = 'Getting our song ready...';
  }
});

song.addEventListener('pause', () => {
  musicPlayer.classList.remove('is-playing');
  musicPlayButton.setAttribute('aria-label', 'Play our song');
  if (!song.ended && !musicPlayer.classList.contains('has-error')) {
    musicStatus.textContent = song.currentTime > 0 ? 'Paused · pick up where we left off' : 'A little soundtrack for us';
  }
});

song.addEventListener('ended', () => {
  musicStatus.textContent = 'A little soundtrack for us';
});

song.addEventListener('error', () => {
  musicPlayer.classList.add('has-error');
  musicStatus.textContent = `Couldn't load the song (audio error ${song.error?.code ?? 'unknown'}).`;
});

musicPlayButton.addEventListener('click', () => {
  if (song.paused) {
    song.play().catch(() => {
      musicPlayer.classList.add('has-error');
      musicStatus.textContent = 'Could not play the song. Check that the music file is available.';
    });
  } else {
    song.pause();
  }
});

musicProgress.addEventListener('input', () => {
  if (Number.isFinite(song.duration)) {
    const seekTime = Number(musicProgress.value);
    song.currentTime = seekTime;
    musicCurrent.textContent = formatTime(seekTime);
    musicProgress.style.setProperty('--progress', `${(seekTime / song.duration) * 100}%`);
    musicProgress.setAttribute('aria-valuetext', `${formatTime(seekTime)} of ${formatTime(song.duration)}`);
  }
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  const isDark = nextTheme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  themeIcon.textContent = isDark ? '☼' : '☾';
  themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeColor.content = isDark ? '#000000' : '#f8f2ed';
});

surpriseButton.addEventListener('click', () => {
  const isExpanded = surpriseButton.getAttribute('aria-expanded') === 'true';
  if (!isExpanded) {
    let nextNote = currentLoveNote;
    while (loveNotes.length > 1 && nextNote === currentLoveNote) {
      nextNote = Math.floor(Math.random() * loveNotes.length);
    }
    currentLoveNote = nextNote;
    surpriseNote.textContent = loveNotes[currentLoveNote];
  }
  surpriseButton.setAttribute('aria-expanded', String(!isExpanded));
  surpriseNote.hidden = isExpanded;
  surpriseButton.firstChild.textContent = isExpanded ? 'One more thing ' : 'A little more ';
});

document.querySelector('.memory-grid').addEventListener('click', (event) => {
  const card = event.target.closest('.memory-card');
  if (!card) return;

  currentPhotoIndex = memoryCards.indexOf(card);
  showCurrentPhoto();
  photoDialog.showModal();
});

function showCurrentPhoto() {
  const card = memoryCards[currentPhotoIndex];
  dialogImage.src = card.dataset.photo;
  dialogImage.alt = card.querySelector('img').alt;
  dialogCaption.textContent = `${card.dataset.caption} · ${currentPhotoIndex + 1} of ${memoryCards.length}`;
}

function movePhoto(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + memoryCards.length) % memoryCards.length;
  showCurrentPhoto();
}

previousPhoto.addEventListener('click', () => movePhoto(-1));
nextPhoto.addEventListener('click', () => movePhoto(1));

photoDialog.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    photoDialog.close();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    movePhoto(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    movePhoto(1);
  }
});

let swipeStartX = null;

dialogImage.addEventListener('pointerdown', (event) => {
  swipeStartX = event.pointerType === 'touch' ? event.clientX : null;
});

dialogImage.addEventListener('pointerup', (event) => {
  if (swipeStartX === null) return;

  const swipeDistance = event.clientX - swipeStartX;
  swipeStartX = null;

  if (Math.abs(swipeDistance) >= 48) {
    movePhoto(swipeDistance > 0 ? -1 : 1);
  }
});

dialogImage.addEventListener('pointercancel', () => {
  swipeStartX = null;
});

dialogClose.addEventListener('click', () => photoDialog.close());

photoDialog.addEventListener('click', (event) => {
  if (event.target === photoDialog) photoDialog.close();
});

loveButton.addEventListener('click', () => {
  const bounds = loveButton.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;

  for (let index = 0; index < 9; index++) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = index % 3 === 0 ? '♡' : '♥';
    heart.style.setProperty('--start-x', `${originX + (Math.random() - 0.5) * 70}px`);
    heart.style.setProperty('--start-y', `${originY + (Math.random() - 0.5) * 18}px`);
    heart.style.setProperty('--heart-size', `${13 + Math.random() * 12}px`);
    heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 110}px`);
    heart.style.setProperty('--turn', `${(Math.random() - 0.5) * 55}deg`);
    heart.style.setProperty('--heart-duration', `${900 + Math.random() * 500}ms`);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    heartBurst.append(heart);
  }

  loveAnnouncement.textContent = 'A little love, sent!';
});
