const introScreen = document.getElementById('intro-screen');
const gameContent = document.getElementById('game-content');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

const gameArea = document.getElementById("game-area");
const typeInput = document.getElementById("type-input");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");

const words = ["javascript", "html", "css", "python", "java", "ruby", "swift", "kotlin", "typescript", "developer"];

let score = 0;
let time = 60;
let gameInterval;
let timerInterval;
let wordsOnScreen = [];
let speed = 1;
let isPaused = false;

function initGame() {
    introScreen.classList.add('hidden');
    gameContent.classList.remove('hidden');
    startGame();
}

function startGame() {
    score = 0;
    time = 60;
    wordsOnScreen = [];
    isPaused = false;
    pauseButton.textContent = 'Pause';
    speed = parseInt(speedSlider.value, 10);
    gameArea.innerHTML = '';
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    typeInput.disabled = false;
    typeInput.value = '';
    gameOverDisplay.classList.add("hidden");
    typeInput.focus();

    timerInterval = setInterval(updateTime, 1000);
    gameInterval = setInterval(createWord, 1500);
    requestAnimationFrame(moveWords);
}

function updateTime() {
    if (isPaused) return;
    time--;
    timeDisplay.textContent = time;
    if (time <= 0) {
        endGame();
    }
}

function createWord() {
    if (isPaused || time <= 0) return;
    const wordText = words[Math.floor(Math.random() * words.length)];
    const wordElement = document.createElement("div");
    wordElement.classList.add("word");
    wordElement.textContent = wordText;

    const gameAreaWidth = gameArea.offsetWidth;
    const wordWidth = wordText.length * 12;
    const randomLeft = Math.floor(Math.random() * (gameAreaWidth - wordWidth));
    
    wordElement.style.left = (randomLeft > 0 ? randomLeft : 0) + "px";
    wordElement.style.top = "0px";

    gameArea.appendChild(wordElement);
    wordsOnScreen.push({ element: wordElement, text: wordText, y: 0 });
}

function moveWords() {
    if (isPaused || time <= 0) {
        if (time > 0) requestAnimationFrame(moveWords); // Keep checking if unpaused
        return;
    }

    const gameAreaHeight = gameArea.offsetHeight;

    for (let i = wordsOnScreen.length - 1; i >= 0; i--) {
        const wordData = wordsOnScreen[i];
        wordData.y += speed;
        wordData.element.style.top = wordData.y + "px";

        if (wordData.y > gameAreaHeight) {
            wordData.element.remove();
            wordsOnScreen.splice(i, 1);
        }
    }

    requestAnimationFrame(moveWords);
}

function endGame() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    time = 0; 
    gameOverDisplay.classList.remove("hidden");
    finalScoreDisplay.textContent = score;
    typeInput.disabled = true;
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = 'Resume';
        typeInput.disabled = true;
        clearInterval(timerInterval); // Pauses the timer
        clearInterval(gameInterval); // Pauses word creation
    } else {
        pauseButton.textContent = 'Pause';
        typeInput.disabled = false;
        typeInput.focus();
        timerInterval = setInterval(updateTime, 1000); // Resumes the timer
        gameInterval = setInterval(createWord, 1500); // Resumes word creation
        requestAnimationFrame(moveWords); // Restarts the animation frame loop
    }
}

typeInput.addEventListener("keydown", (event) => {
    if (isPaused || event.key !== 'Enter') {
        return;
    }

    const typedWord = typeInput.value.trim().toLowerCase();
    if (typedWord === "") {
        return;
    }

    for (let i = wordsOnScreen.length - 1; i >= 0; i--) {
        const wordData = wordsOnScreen[i];
        if (wordData.text === typedWord) {
            score++;
            scoreDisplay.textContent = score;
            
            wordData.element.classList.add('exploding');
            
            setTimeout(() => {
                wordData.element.remove();
            }, 300);

            wordsOnScreen.splice(i, 1);
            typeInput.value = "";
            return;
        }
    }
});

speedSlider.addEventListener('input', (e) => {
    speed = parseInt(e.target.value, 10);
    speedValue.textContent = speed;
});

startButton.addEventListener('click', initGame);
pauseButton.addEventListener('click', togglePause);
restartButton.addEventListener("click", startGame);
