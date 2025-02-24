let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = false;
let aiMode = false;
let aiDifficulty = 'easy';

function setMode(mode) {
    aiMode = mode === 'ai';
    document.getElementById("aiLevels").classList.toggle("hidden", !aiMode);
    document.getElementById("selectedMode").innerText = aiMode ? "Select AI Level" : "Multiplayer Mode";

    if (!aiMode) startGame();
}

function setDifficulty(level) {
    aiDifficulty = level;
    document.getElementById("selectedMode").innerText = `AI Mode - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`;
    startGame();
}

function startGame() {
    board.fill(null);
    gameActive = true;
    currentPlayer = 'X';
    document.getElementById("status").innerText = "Game Started!";
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';

    board.forEach((value, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.innerText = value || '';
        cell.addEventListener("click", () => handleMove(index));
        boardElement.appendChild(cell);
    });
}

function handleMove(index) {
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (aiMode && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let move;
    
    if (aiDifficulty === 'hard') {
        move = getBestMove();
    } else {
        let emptyCells = board.map((v, i) => (v === null ? i : null)).filter(v => v !== null);
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    handleMove(move);
}

function getBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    let scores = { X: -10, O: 10, tie: 0 };
    let result = getWinner();
    
    if (result) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    let winner = getWinner();

    if (winner) {
        document.getElementById("status").innerText = winner === "tie" ? "It's a Draw!" : `Winner: ${winner}!`;
        if (winner !== "tie") showCongratsMessage(winner);
        gameActive = false;
        return true;
    }

    return false;
}

function getWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes(null)) return "tie";
    return null;
}

function showCongratsMessage(winner) {
    const overlay = document.getElementById("congratsOverlay");
    const message = document.getElementById("congratsMessage");

    message.innerText = `🎉 Congratulations! Player ${winner} Wins! 🎉`;
    overlay.style.display = "flex";

    startEmojiShower();

    setTimeout(() => {
        overlay.style.display = "none";
        stopCelebration();
        resetGame();
    }, 5000);
}

function stopCelebration() {
    document.querySelectorAll(".emoji").forEach(el => el.remove());
}

function startEmojiShower() {
    const emojis = ["🎉", "🥳", "🎊", "🥂", "🎈", "🎗", "🎇", "🎍", "💐", "🌸", "🌷", "🌹", "🪷","🎆", "🎀", "🎁", "🍾", "🍷", "🎤", "🎶", "🔥", "✨", "💖", "💫", "🎠", "🎡", "🎢"];
    
    for (let i = 0; i < 30; i++) {
        let emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}vw`;
        emoji.style.animationDuration = `${2 + Math.random() * 3}s`;
        document.getElementById("congratsOverlay").appendChild(emoji);

        setTimeout(() => {
            emoji.remove();
        }, 5000);
    }
}
function resetGame() {
    board.fill(null);
    gameActive = true;
    currentPlayer = 'X';
    document.getElementById("status").innerText = "Game Reset! Start Playing.";
    renderBoard(); // Re-render the board with empty cells
}
