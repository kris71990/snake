window.onload = function() {
    
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var score = 0;
    var level = 0;
    var direction = 0;
    var snake = new Array(5);
    var active = true;
    var speed = 200;
    
    // initialize matrix
    var map = new Array(40);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(40);
    }
    
    canvas.width = 404;
    canvas.height = 454;
    
    var body = document.getElementsByTagName('div')[0];
    body.appendChild(canvas);
    
    map = generateSnake(map);
    map = generateFood(map);
    drawGame();
    
    //event listener to control snake and pause game
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; //Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; //Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; //Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; //Right
        } /**else if (e.keyCode === 32) {
            pauseGame();
        }**/
    });
    
    function drawGame() {
        
        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // traverse length of snake
        for (var i = snake.length - 1; i >= 0; i--) {
            //snake movement
            if (i === 0) {
                switch(direction) {
                    case 0: //Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: //Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: //Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: //Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }
                
                //check if snake is out of bounds
                if (snake[0].x < 0 || snake[0].x >= 40 || 
                    snake[0].y < 0 || snake[0].y >= 40) {
                    gameOver();
                    return;
                }
                
                //eat food, generate new food, increase size of snake, increase level
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);
                    
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
                    
                    if ((score % 100) == 0) {
                        level += 1;
                    }
                // check if snake is running into itself
                } else if (map[snake[0].x][snake[0].y] === 2) {
                    gameOver();
                    return;
                }
                
                map[snake[0].x][snake[0].y] = 2;
            // clear last part from matrix when snake moves
            } else {
                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }
                
                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }
        
        // draw border and score
        drawMain();
        
        // start cycling the matrix
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 1) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
                } else if (map[x][y] === 2) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
                }
            }
        }
        
        if (active) {
            setTimeout(drawGame, speed - (level * 20));
        } 
    
    }
    
    function drawMain() {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(2, 20, canvas.width - 4, canvas.height - 54);
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText('Score: ' + score + ' - Level: ' + level, 160, 442);
    }
    
    function generateFood(map) {
        var rand_x = Math.round(Math.random() * 39);
        var rand_y = Math.round(Math.random() * 39);
        
        while (map[rand_x][rand_y] === 2) {
            rand_x = Math.round(Math.random() * 39);
            rand_y = Math.round(Math.random() * 39);
        }
        
        map[rand_x][rand_y] = 1;
        return map;
    }
    
    function generateSnake(map) {
        var rand_x = Math.round(Math.random() * 39);
        var rand_y = Math.round(Math.random() * 39);
        
        while ((rand_x - snake.length) < 0) {
            rand_x = Math.round(Math.random() * 39);
        }
        
        for (var i = 0; i < snake.length; i++) {
            snake[i] = { x: rand_x - i, y: rand_y };
            map[rand_x - i][rand_y] = 2;
        }
        
        return map;
    }
    
    /**
    function pauseGame() {
        if (active) {
            active = false;
        } else if (!active) {
            active = true;
        }
    }
    **/
    
    function gameOver() {
        active = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '25px sans-serif';
        ctx.fillText('Game Over.', ((canvas.width / 2) - (ctx.measureText('Game Over').width / 2)), 190);
        ctx.font = '15px sans-serif';
        ctx.fillText('Your score was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your score was: ' + score).width / 2)), 210);
    }
};