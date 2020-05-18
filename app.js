// Executes when the content is completely loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    // declare constants
    const grid = document.querySelector('#tetri')
    const scoreTxt = document.querySelector('#score')
    const toggleBtn = document.querySelector('#start-pause')
    const width = 10
    let nextRandom = 0
    let timerId = null
    let score = 0
    
    // declare variables
    // let => block-scoped variable
    // var => global-scoped variable
    let squares = Array.from(document.querySelectorAll('#tetri div')) // Array.from() => forms an array from the function call output

    // ES6
    // Arrow Functions
    // let names = ['a','aa','aaa','asdfg']

    // names.forEach(name => {
    //     console.log(name + ' BLAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')
    // })

    // declare Tetriminoes
    const lTetrimino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2],
    ]
    const zTetrimino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]
    const tTetrimino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1],
    ]
    const oTetrimino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const iTetrimino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
    ]

    const tetriminos = [
        lTetrimino, zTetrimino, tTetrimino, oTetrimino, iTetrimino
    ]

    let currentPosition = 4
    let currentRotation = 0

    // randomize position
    let random = Math.floor(Math.random()*tetriminos.length)
    let current = tetriminos[random][0]

    // draw the Tetrimino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')

            switch(random) {
                case 0: squares[currentPosition + index].classList.add('l'); break;
                case 1: squares[currentPosition + index].classList.add('z'); break;
                case 2: squares[currentPosition + index].classList.add('t'); break;
                case 3: squares[currentPosition + index].classList.add('o'); break;
                case 4: squares[currentPosition + index].classList.add('i'); break;
            }
        })
    }

    // undraw the Tetrimino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino')
            squares[currentPosition + index].classList.remove('l')
            squares[currentPosition + index].classList.remove('z')
            squares[currentPosition + index].classList.remove('t')
            squares[currentPosition + index].classList.remove('o')
            squares[currentPosition + index].classList.remove('i')
        })
    }

    // draw()
    
    // setInterval(() => {
    //     undraw()
    //     draw()
    // }, 1000);

    // move

    // timerId = setInterval(moveDown, 1000)

    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze and create new Tetrimino

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // stops the flow, and generate new one
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tetriminos.length)
            current = tetriminos[random][currentRotation]
            currentPosition = 4

            gameOver()
            draw()
            nextShape()
            addScore()
        }
    }

    // events
    // .addEventListener('event', function)
    
    // keycode events
    function control(e) {
        // if((e.keyCode === 37)) moveLeft()

        switch(e.keyCode) {
            case 37: moveLeft(); break;
            case 38: rotate(); break;
            case 39: moveRight(); break;
            case 40: moveDown(); break;
        }
    }
    document.addEventListener('keyup',control)

    // rotate
    function rotate() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

        if(isAtLeftEdge){
            currentPosition++
        }
        if(isAtRightEdge){
            currentPosition--
        }

        currentRotation++

        if(currentRotation === current.length)
            currentRotation = 0

        current = tetriminos[random][currentRotation]

        draw()
    }
    // moveleft, unless if it's on the left edge
    function moveLeft() {
        undraw()
        const isAtleftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtleftEdge)
            currentPosition--

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition++
        }

        draw()
    }
    // moveright, unless if it's on the right edge
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if(!isAtRightEdge)
            currentPosition++
        
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition--
        }

        draw()
    }

    // next

    const nextSquares = document.querySelectorAll('#nextGrid div')
    const nextWidth = 4
    let nextIndex = 0

    // tetriminos without rotations
    const nextTetriminos = [
        [1, nextWidth+1, nextWidth*2+1, 2],
        [0,nextWidth,nextWidth+1,nextWidth*2+1],
        [1,nextWidth,nextWidth+1,nextWidth+2],
        [0,1,nextWidth,nextWidth+1],
        [1,nextWidth+1,nextWidth*2+1,nextWidth*3+1],
    ]

    // displays the shape

    function nextShape() {
        // remove .tetrimino class from entire #nextGrid
        nextSquares.forEach(square => {
            square.classList.remove('tetrimino')
            square.classList.remove('l')
            square.classList.remove('z')
            square.classList.remove('t')
            square.classList.remove('o')
            square.classList.remove('i')
        })

        // randomly select next tetrimino
        nextTetriminos[nextRandom].forEach( index => {
            nextSquares[nextIndex + index].classList.add('tetrimino')

            switch(nextRandom) {
                case 0: nextSquares[nextIndex + index].classList.add('l'); break;
                case 1: nextSquares[nextIndex + index].classList.add('z'); break;
                case 2: nextSquares[nextIndex + index].classList.add('t'); break;
                case 3: nextSquares[nextIndex + index].classList.add('o'); break;
                case 4: nextSquares[nextIndex + index].classList.add('i'); break;
            }
        })
    }

    // start/pause the game

    let interval = 1000;
    toggleBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        }else{
            draw()
            timerId = setInterval(moveDown, interval)
            nextRandom = Math.floor(Math.random()*tetriminos.length)
            nextShape()
        }
    })

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
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimino')
                    squares[index].classList.remove('l')
                    squares[index].classList.remove('z')
                    squares[index].classList.remove('t')
                    squares[index].classList.remove('o')
                    squares[index].classList.remove('i')
                })
                const squaresRemoved = squares.splice(i, width)
                
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => {
                    grid.appendChild(cell)
                })
            }
        }
    }

    // game over when it reaches top row
    function gameOver() {
        if(current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreTxt.innerHTML = score+' (Game Over)'
            clearInterval(timerId)
        }
    }
    
});