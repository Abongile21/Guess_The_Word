const words = [
    { word: "server", hint: "A powerful computer" },
    { word: "database", hint: "Organizes data" },
    { word: "javascript", hint: "Programming language" },
    { word: "algorithm", hint: "Step-by-step procedure" },
    { word: "frontend", hint: "User interface part" },
    { word: "backend", hint: "Server-side part" },
    { word: "api", hint: "Application Programming Interface" },
    { word: "html", hint: "Markup language" },
    { word: "css", hint: "Stylesheet language" },
    { word: "framework", hint: "Pre-built library" }
];

const bonusImages = [
    { image: "images/server.jfif", word: "server" },
    { image: "images/database.jfif", word: "database" },
    { image: "images/javascript.jfif", word: "javascript" }
];

let currentWordIndex = 0;
let score = 0;
let correctStreak = 0;
let incorrectGuesses = 0;
const maxIncorrectGuesses = 3;
let highScore = localStorage.getItem('highScore') || 0;
let username = localStorage.getItem('username') || 'Player';

const landingPage = document.getElementById('landing-page');
const gamePage = document.getElementById('game-page');
const profilePage = document.getElementById('profile-page');
const startBtn = document.getElementById('start-btn');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const attemptsDisplay = document.getElementById('attempts');
const scrambledWord = document.getElementById('scrambled-word');
const bonusLevel = document.getElementById('bonus-level');
const profileBtn = document.getElementById('profile-btn');
const backToGameBtn = document.getElementById('back-to-game-btn');
const usernameDisplay = document.getElementById('username');
const highScoreDisplay = document.getElementById('high-score');
const bonusImage = document.getElementById('bonus-image');
const bonusInput = document.getElementById('bonus-input');
const bonusBtn = document.getElementById('bonus-btn');
const hintBtn = document.getElementById('hint-btn');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const bonusSound = document.getElementById('bonus-sound');
const toastContainer = document.getElementById('toast-container');

startBtn.addEventListener('click', () => {
    landingPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    resetGame();
});

guessBtn.addEventListener('click', checkGuess);
guessInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

profileBtn.addEventListener('click', () => {
    gamePage.classList.add('hidden');
    profilePage.classList.remove('hidden');
    displayProfile();
});

backToGameBtn.addEventListener('click', () => {
    profilePage.classList.add('hidden');
    gamePage.classList.remove('hidden');
});

bonusBtn.addEventListener('click', checkBonusGuess);

hintBtn.addEventListener('click', () => {
    const hint = words[currentWordIndex].hint;
    showToast(`Hint: ${hint}`, 'info');
});

function loadNewWord() {
    const currentWord = words[currentWordIndex].word;
    scrambledWord.textContent = shuffle(currentWord.split('')).join('');
    guessInput.value = '';
    message.textContent = '';
    guessInput.classList.remove('correct', 'wrong');
}

function checkGuess() {
    const userGuess = guessInput.value.toLowerCase().trim();
    const currentWord = words[currentWordIndex].word;

    

    if (userGuess === currentWord) {
        showToast('Correct!', 'success');
        correctSound.play();
        guessInput.classList.add('correct');
        score++;
        correctStreak++;
        incorrectGuesses = 0;
        if (correctStreak >= 5) {
            bonusSound.play();
            showBonusLevel();
        }
    } else if (userGuess ==='') {
        showToast('field cannot be empty')
        wrongSound.play();
        guessInput.classList.add('wrong');
    }
    else {
        showToast('Wrong! Try again.', 'error');
        wrongSound.play();
        guessInput.classList.add('wrong');
        correctStreak = 0;
        incorrectGuesses++;
        updateAttempts();

        if (incorrectGuesses >= maxIncorrectGuesses) {
            showToast('Game Over! Restarting...', 'error');
            setTimeout(() => {
                resetGame();
            }, 2000);
        }
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    scoreDisplay.textContent = `Score: ${score}`;
    currentWordIndex = (currentWordIndex + 1) % words.length;
    loadNewWord();
}

function updateAttempts() {
    const remainingAttempts = maxIncorrectGuesses - incorrectGuesses;
    attemptsDisplay.textContent = `Remaining Attempts: ${remainingAttempts}`;
}

function showBonusLevel() {
    bonusLevel.classList.remove('hidden');
    const randomImageIndex = Math.floor(Math.random() * bonusImages.length);
    bonusImage.src = bonusImages[randomImageIndex].image;
    bonusImage.dataset.word = bonusImages[randomImageIndex].word;
}

function checkBonusGuess() {
    const userGuess = bonusInput.value.toLowerCase();
    const correctWord = bonusImage.dataset.word;

    if (userGuess === correctWord) {
        showToast('Correct! Bonus points awarded!', 'success');
        correctSound.play();
        score += 5;
        bonusLevel.classList.add('hidden');
    } else {
        showToast('Wrong! Try again.', 'error');
        wrongSound.play();
    }

    scoreDisplay.textContent = `Score: ${score}`;
    bonusInput.value = '';
}

function displayProfile() {
    usernameDisplay.textContent = username;
    highScoreDisplay.textContent = highScore;
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'info' ? 'toast-info' : 'toast-error'}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetGame() {
    incorrectGuesses = 0;
    score = 0;
    correctStreak = 0;
    currentWordIndex = 0;
    updateAttempts();
    bonusLevel.classList.add('hidden');
    scoreDisplay.textContent = `Score: ${score}`;
    loadNewWord();
}

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

scoreDisplay.textContent = `Score: ${score}`;
usernameDisplay.textContent = username;
highScoreDisplay.textContent = highScore;
