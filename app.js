// Executes when the content is completely loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    // declare variables and constants

    // var   => A global-scoped variable.
    //          example: var names = ['a','aa','aaa','asdfg']

    // let   => A block-scoped variable.
    //          It's like protected access modifier of a class property.
    //          example: let names = ['a','aa','aaa','asdfg']

    // const => Same as let, but as a constant, it cannot be changed.
    //          example: const pi = 3.14

    const grid        = document.querySelector('#tetri')
    const nextGrid    = document.querySelector('#nextGrid')
    const scoreTxt    = document.querySelector('#score')
    const toggleBtn   = document.querySelector('#start-pause')
    const width       = 10
    const height      = 20
    const nextWidth = 4

    let nextIndex   = 0
    let nextRandom = 0
    let timerId = null
    let score = 0
    let interval = 1000
    // Array.from() => forms an array from the function call output
    let squares, nextSquares
    let currentPosition = 4
    let currentRotation = 0
    let paused = true

    // ES6 standards
    // Arrow Functions
    // names.forEach(name => {
    //     console.log(name + ' BLAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')
    // })

    // declare Tetrimino constants
    // L-shaped Tetrimino
    const jTetrimino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2],
    ]
    // J-shaped Tetrimino
    const lTetrimino = [
        [0, 1, width+1, width*2+1],
        [2, width, width+1, width+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, width*2]
    ]
    // Z-shaped Tetrimino
    const sTetrimino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]
    // S-shaped Tetrimino
    const zTetrimino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
    ]
    // T-shaped Tetrimino
    const tTetrimino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1],
    ]
    // O-shaped Tetrimino (or Square Tetrimino)
    const oTetrimino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    // I-shaped Tetrimino
    const iTetrimino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
    ]

    const tetriminos = [
        jTetrimino, lTetrimino, zTetrimino, sTetrimino, tTetrimino, oTetrimino, iTetrimino
    ]

    // randomize position
    let random = Math.floor(Math.random()*tetriminos.length)
    let current = tetriminos[random][0]

    // tetriminos without rotations
    const nextTetriminos = [
        [1, nextWidth+1, nextWidth*2+1, 2], // jTetrimino
        [0, 1, nextWidth+1, nextWidth*2+1], // lTetrimino
        [0,nextWidth,nextWidth+1,nextWidth*2+1], // zTetrimino
        [nextWidth,nextWidth*2,1,nextWidth+1], // sTetrimino
        [1,nextWidth,nextWidth+1,nextWidth+2], // tTetrimino
        [0,1,nextWidth,nextWidth+1], // oTetrimino
        [1,nextWidth+1,nextWidth*2+1,nextWidth*3+1], // iTetrimino
    ]

    // Functions

    // initialization
    function initializeGame() {
        // initialize the grids
        for(let i = 0; i < (width * height); i++) {
            grid.innerHTML += '<div class="bg-blue-800 border border-blue-900 rounded"></div>'
        }

        for(let i = 0; i < 10; i++) {
            grid.innerHTML += '<div class="taken"></div>'
        }

        // initialize the next grids
        for(let i = 0; i < 16; i++) {
            nextGrid.innerHTML += '<div class="bg-blue-800 border border-blue-900 rounded"></div>'
        }

        squares = Array.from(document.querySelectorAll('#tetri div'))
        nextSquares = Array.from(document.querySelectorAll('#nextGrid div'))
    }

    // draw the Tetrimino
    function draw() {
        if(!paused)
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')

            switch(random) {
                case 0: squares[currentPosition + index].classList.add('j'); break;
                case 1: squares[currentPosition + index].classList.add('l'); break;
                case 2: squares[currentPosition + index].classList.add('z'); break;
                case 3: squares[currentPosition + index].classList.add('s'); break;
                case 4: squares[currentPosition + index].classList.add('t'); break;
                case 5: squares[currentPosition + index].classList.add('o'); break;
                case 6: squares[currentPosition + index].classList.add('i'); break;
            }
        })
    }

    // undraw the Tetrimino
    function undraw() {
        if(!paused)
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino','j','l','z','s','t','o','i')
        })
    }

    // move

    function moveDown(keyPressed = false){
        if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            undraw()
            currentPosition += width
            draw()
            freeze(keyPressed)
        }
    }

    // freeze and create new Tetrimino

    function freeze(keyPressed = false) {
        let timeout = keyPressed ? 0 : 500
        
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            setTimeout(() => {
                current.forEach(index => squares[currentPosition + index].classList.add('taken'))
                // stops the flow, and generate new one
                random = nextRandom
                nextRandom = Math.floor(Math.random() * tetriminos.length)
                current = tetriminos[random][currentRotation]
                currentPosition = 4

                gameOver()
                addScore()
                displayNextShape()
                draw()
            }, timeout);
        }
    }

    // events
    // .addEventListener('event', function)
    
    // keycode events
    function control(e) {
        undraw()
       
        if(!paused)
        switch(e.keyCode) {
            case 37: moveLeft(); break;
            case 38: rotate(); break;
            case 39: moveRight(); break;
            // Move Down
            case 40: moveDown(); break;
            // Insta-move Down
            case 32: 
                e.preventDefault();
                while(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
                moveDown(true)
                }
                break;
        }

        draw()
    }

    // rotate
    function rotate() {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

        currentRotation++

        if(currentRotation === current.length)
            currentRotation = 0

        current = tetriminos[random][currentRotation]
    }

    // moveleft, unless if it's on the left edge
    function moveLeft() {
        const isAtleftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtleftEdge)
            currentPosition--

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition++
        }
    }

    // moveright, unless if it's on the right edge
    function moveRight() {
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if(!isAtRightEdge)
            currentPosition++
        
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition--
        }
    }

    function displayNextShape() {
        // remove .tetrimino class from entire #nextGrid
        nextSquares.forEach(square => {
            square.classList.remove('tetrimino','l','z','s','t','o','i')
        })

        // randomly select next tetrimino
        nextTetriminos[nextRandom].forEach( index => {
            nextSquares[nextIndex + index]
            .classList.add('tetrimino','next')

            switch(nextRandom) {
                case 0: nextSquares[nextIndex + index].classList.add('j'); break;
                case 1: nextSquares[nextIndex + index].classList.add('l'); break;
                case 2: nextSquares[nextIndex + index].classList.add('z'); break;
                case 3: nextSquares[nextIndex + index].classList.add('s'); break;
                case 4: nextSquares[nextIndex + index].classList.add('t'); break;
                case 5: nextSquares[nextIndex + index].classList.add('o'); break;
                case 6: nextSquares[nextIndex + index].classList.add('i'); break;
            }
        })
    }

    // add to score
    // .splice(startIndex,deleteIndex = 1, [values])
    // .concat([values]) // merges 2 arrays togeher
    // .appendChild() // appends element into an existing ones

    function addScore() {
        for(let i=0; i < 199; i += width){
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreTxt.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove(
                        'taken', 'tetrimino', 'j', 'l', 'z', 's', 't', 'o', 'i'
                    )
                })
                const squaresRemoved = squares.splice(i, width)
                
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => {
                    grid.appendChild(cell)
                })
            }
        }
    }

    // toggle game state
    function toggleGameState() {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
            paused = true
        }else{
            paused = false
            draw()
            if(timerId){
                nextRandom = Math.floor(Math.random()*tetriminos.length)
                displayNextShape()
            }
            timerId = setInterval(moveDown, interval)
        }
    }

    // game over when it reaches top row
    function gameOver() {
        if(current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreTxt.innerHTML = score+' (Game Over)'
            clearInterval(timerId)
        }
    }

    // start/pause the game

    initializeGame();

    toggleBtn.addEventListener('click', toggleGameState)
    
    document.addEventListener('keyup', (e) => {
        if(e.keyCode == 27)
            toggleGameState()
        else
            control(e)
    })
    
});