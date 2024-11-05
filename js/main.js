// Game Constants & variables
let direction = {x: 0, y: 0};
const foodSound = new Audio('../music/food.mp3');
const gameOverSound = new Audio('../music/gameover.mp3');
const moveSound = new Audio('../music/move.mp3');
const musicSound = new Audio('../music/music.mp3');
let speed = 3;
let lastPaintTime = 0;
let score = 0;
let gameStarted = false;
let snakeArr = [
    {x:13, y:15}
];
let food = {x:6, y:7};
let inputDir = {x: 0, y: 0};  // Direction of movement

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sarr) {
    // Check if snake collides with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // Check if snake collides with wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};  // Stop the snake
        alert("Game Over, Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];  // Reset the snake position
        // musicSound.play(); 
        score = 0;  // Reset the score
        gameStarted = false; // Reset the flag here
    }

    // If the Snake has eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if(score > highScoreVal) {
            highScoreVal = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreVal));
            highBox.innerHTML = "High Score: " + highScoreVal;
        }
        scoreBox .innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())};
    }

    

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake & Food
    // Clear the board
    board.innerHTML = "";

    // Display the Snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('body');
        }
        board.appendChild(snakeElement);
    });

    // Display the Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);

// Render initial state of snake and food immediately on page load
gameEngine();  // Call gameEngine once to display the initial position of snake and food

// Event listener to start the game on key press
window.addEventListener('keydown', e => {

// Start the game and play music only on the first key press
    if (!gameStarted) {
        musicSound.play();
        gameStarted = true;
    }

    inputDir = {x: 0, y: 1};  // Start the game on any key press
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});  

// Local Storage 

let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScoreVal = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
    highScoreVal = JSON.parse(highScore);
    highBox.innerHTML = "High Score: " + highScore;
}
