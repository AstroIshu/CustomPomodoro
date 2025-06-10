const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const sessionInfo = document.getElementById('sessionInfo');
const progressBar = document.getElementById('progress');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const toggleFullScreenBtn = document.getElementById('toggleFullScreen');
const fullScreen = document.getElementById('fullScreen');
const fullScreenTimer = document.getElementById('fullScreenTimer');
const fullScreenProgress = document.getElementById('fullScreenProgress');
const backButton = document.getElementById('backButton');
const sessionChime = document.getElementById('sessionChime');
const breakChime = document.getElementById('breakChime');

const sessions = [50 * 60, 10 * 60, 40 * 60, 10 * 60, 30 * 60, 10 * 60, 20 * 60, 10 * 60, 10 * 60, 10 * 60];
let currentSession = 0;
let timeLeft = sessions[0];
let isRunning = false;
let isPaused = false;
let interval;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    fullScreenTimer.textContent = formatTime(timeLeft);
    const isBreak = currentSession % 2 === 1;
    statusDisplay.textContent = isBreak ? 'Break' : 'Session';
    const sessionNumber = Math.floor(currentSession / 2) + 1;
    sessionInfo.textContent = `Session ${sessionNumber} of 5`;
    fullScreenProgress.textContent = `Session ${sessionNumber} of 5`;

    const totalTime = sessions[currentSession];
    const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function playChime() {
    const isBreak = currentSession % 2 === 1;
    (isBreak ? breakChime : sessionChime).play().catch(() => {});
}

function startTimer() {
    if (!isRunning) {
        interval = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                if (timeLeft < 0) {
                    playChime();
                    currentSession = (currentSession + 1) % sessions.length;
                    timeLeft = sessions[currentSession];
                    if (currentSession === 0) {
                        resetTimer();
                        return;
                    }
                }
                updateDisplay();
            }
        }, 1000);
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
    } else if (isPaused) {
        isPaused = false;
        startPauseBtn.textContent = 'Pause';
    } else {
        isPaused = true;
        startPauseBtn.textContent = 'Resume';
    }
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    isPaused = false;
    currentSession = 0;
    timeLeft = sessions[0];
    startPauseBtn.textContent = 'Start';
    updateDisplay();
    progressBar.style.width = '0%';
}

function toggleFullScreen() {
    fullScreen.style.display = fullScreen.style.display === 'flex' ? 'none' : 'flex';
}

startPauseBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
toggleFullScreenBtn.addEventListener('click', toggleFullScreen);
backButton.addEventListener('click', toggleFullScreen);

updateDisplay();
