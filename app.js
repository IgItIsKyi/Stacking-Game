document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-btn');
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    let score = 0;

    console.log(squares);



    // Tetris shapes 
    const lTetromino = [
        [1,width+1,width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width, width+1, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width+1, width + 2, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];



    const tetriminoShapes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];


    let currentPosition = 4;
    let currentRotation = 0;

    // Choose a random Tetrimino shape
    let random = Math.floor(Math.random() * tetriminoShapes.length);
    let current = tetriminoShapes[random][0];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }


    function control(e) {
        if (e.keyCode === 37) {
            // left key
            moveLeft();
        } else if (e.keyCode === 38) {
            //rotate (up key)
            rotate();
        } else if (e.keyCode === 39) {
            // right key
            moveRight();
        } else if (e.keyCode === 40) {
            // down key
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetriminoShapes.length);
            currentRotation = 0;
            current = tetriminoShapes[random][currentRotation];

            console.log(tetriminoShapes[random]);
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -=1;


        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1;
        }

        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

        if (!isAtRightEdge) currentPosition +=1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1;
        }
        draw();
    }

function rotate() {
        undraw();
        currentRotation++

        currentRotation = currentRotation % tetriminoShapes[random].length;
        current = tetriminoShapes[random][currentRotation];

        draw();
    }


const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;


const upNextTetrominoes = [
    [1, 5, 9, 2],       // lTetromino (centered)
    [1, 5, 6, 10],      // zTetromino
    [4, 5, 6, 9],       // tTetromino (nicely centered)
    [5, 6, 9, 10],      // oTetromino (2x2 center)
    [1, 5, 9, 13]       // iTetromino (vertical, centered)
];



function displayShape() {
    // remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
    });
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
    });

}


startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*tetriminoShapes.length);
        displayShape();
    }  
})



function addScore() {
    for(let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

function clearAllTetrominoes() {
    squares.forEach(square => {
        square.classList.remove('tetromino');
    });

    squares.forEach((square, index) => {
        if (index > 200) {
            square.classList.add('taken');
        } else {
            square.classList.remove('taken');
        }
    });
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over';
        clearInterval(timerId);
        document.removeEventListener('keydown', control);
        clearAllTetrominoes();
    }
}






});

