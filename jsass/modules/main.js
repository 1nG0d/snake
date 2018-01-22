/**
 * Created by amartseniuk on 2/21/17.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function randomCell(){
    return [getRandomInt(0,snakeArea.grid[0]),getRandomInt(0,snakeArea.grid[0])];
}
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function mainFunc(){
    var key = "right";
        $("body" ).on( "keydown", function( event ) {
            //console.log( event.type + ": " +  event.which );
            if(game.mode.mirror == false){
                switch(event.which) {
                    case 39:
                        snake.side = (key == "left") ? "left" : "right";
                        key = snake.side;
                            break;
                    case 38:
                        snake.side = (key == "down") ? "down" : "up";
                        key = snake.side;
                        break;
                    case 40:
                        snake.side = (key == "up") ? "up" : "down";
                        key = snake.side;
                        break;
                    case 37:
                        snake.side = (key == "right") ? "right" : "left";
                        key = snake.side;
                        break;
                    default:
                        snake.side = (key == "left") ? "left" : "right";
                        key = snake.side;
            }
            } else {
                console.log("mirror");
                    switch(event.which) {
                        case 39:
                            snake.side = (key == "right") ? "right" : "left";
                            key = snake.side;
                            break;
                        case 40:
                            snake.side = (key == "down") ? "down" : "up";
                            key = snake.side;
                            break;
                        case 38:
                            snake.side = (key == "up") ? "up" : "down";
                            key = snake.side;
                            break;
                        case 37:
                            snake.side = (key == "left") ? "left" : "right";
                            key = snake.side;
                            break;
                        default:
                            snake.side = (key == "right") ? "right" : "left";
                            key = snake.side;
                    }
            }
            console.log(snake.side);
        });

    $(".pause").on("click", function(){
        if ( $(this).attr("id") == "pauseOff"){
            $(this).attr("id","pauseOn").text("Continue");
            game.stop();
        } else {
            if ($(this).attr("id") == "pauseOn") {
                $(this).attr("id", "pauseOff").text("Pause");
                game.start();
            }
        }
    });
    $(".speedControl button").on("click", function(){

        if(!$(this).hasClass("active")){
            $(".active").removeClass("active");
            $(this).addClass("active");
            snake.speed = $(this).attr("data-speed-game");
            snake.snakeMoves();
        }
    });
    $(".newGame").on("click",function(){
        location.reload();
        game.newGame();
    });
    $("button.strict").on("click",function(){
        if($(this).attr("data-strict") == "Off"){
            game.mode.strict = "false";
            $(this).attr("data-strict","On").text("On");
        } else {
            game.mode.strict = "true";
            $(this).attr("data-strict","Off").text("Off");
        }
    });

    $("button.mirror").on("click",function(){
        if($(this).attr("data-mirror") == "Off"){
            game.mode.mirror = false;
            $(this).attr("data-mirror","On").text("On");
        } else {
            game.mode.mirror = true;
            $(this).attr("data-mirror","Off").text("Off");
        }
    });

}
var game =  {
    score: 0,
    highScore: 0,
    changeScore: function(){
        game.score += 10;
        $("h3.score span").text(game.score);

        snake.speed = (game.score > 100 && snake.speed == 300)?
            snake.speed - 100 : (game.score > 200 && snake.speed == 200) ?
            snake.speed - 100 : (game.score > 300 && snake.speed == 100) ?
            snake.speed - 50 : snake.speed;
        snake.snakeMoves();
    },
    newGame: function(){
        game.score = 0;
        snakeArea.init();
        snake.snakeDrawFirst();
        food.init();
        game.start();
    },
    gameOver: function(){
        game.stop();
        $(".gameOver").css("display","inline-block");
        $(".wrapper").css("display","none");
        setTimeout(function(){
            $(".gameOver").css("display","none");
            $(".wrapper").css("display","inline-block");
            location.reload();
            game.newGame();
        },3000);
    },
    mode: {
        strict: true,
        mirror: false
    },
    stop: function(){
        snake.pause = true;
        snake.snakeMoves();
    },
    start: function(){
        snake.pause = false;
        snake.snakeMoves();
    }
};
var snakeArea = {
    grid: [25,25],
    init: function(){
        var cells;
        for (var i = 0; i < this.grid[0]; i++){
            for( j = 0; j < this.grid[1]; j++){
                cells +='<div class="block" cell-i="'+i+'" cell-j="'+j+'"></div>';
            }
        }
        $("#gameArea .wrapper").append(cells);
    }
};
var food = {
    newFoodcoord: function(){
        return randomCell();
    },
    drawFood: function(arr){
        var $cell = $(".block[cell-i='"+ arr[0] +"'][cell-j='"+ arr[1]+"']");
        $($cell).attr('data-food','food');
    },
    init: function(){
        var newFood = this.newFoodcoord(),
            $foodCell= $(".block[cell-i='"+ newFood[0] +"'][cell-j='"+ newFood[1] +"']");
        $(".block[data-food='food']").attr("data-food","");
        if($foodCell.attr("id") == "head" || $foodCell.hasClass("tail")){
            this.init();
        } else {
            this.drawFood(newFood);
        }
    }
};
var snake = {
    snakeLength: 4,
    speed: 300,
    pause: false,
    myInterval: undefined,
    SnakeArr: [[Math.round(snakeArea.grid[0]/2),5]],
    side: "right",
    snakeDrawFirst: function(){
        var $cell = $(".block[cell-i='"+ this.SnakeArr[0][0] +"'][cell-j='"+ this.SnakeArr[0][1] +"']");
        $($cell).attr('id','head');
        for (var i = 1; i < snake.snakeLength; i++){
            var j = this.SnakeArr[0][1] - i;
            var $cellTail = $(".block[cell-i='"+ this.SnakeArr[0][0] +"'][cell-j='"+ j +"']");
            $($cellTail).addClass('tail');
            this.SnakeArr.push([this.SnakeArr[0][0],j]);
        }
    },
    snakeDraw: function(arr){
        var $cell = $(".block[cell-i='"+ arr[0][0] +"'][cell-j='"+ arr[0][1] +"']");
        $($cell).attr('id','head');
        for (var i = 1; i < arr.length; i++){
            var $cellTail = $(".block[cell-i='"+ arr[i][0] +"'][cell-j='"+ arr[i][1] +"']");
            $($cellTail).addClass('tail');
        }
    },
    snakeClearOld: function(){
        $(".tail").removeClass("tail");
        $("#head").attr("id","");
    },
    snakeChangePosition: {
        changeTail: function(arr){
            var newSnakeTail = [];
            for(var i = 1; i < arr.length; i++){
                newSnakeTail[i] = arr[i-1];
            }
            return newSnakeTail;
        },
        up: function(arr){
            return [arr[0][0] - 1,arr[0][1]];
        },
        down: function(arr){
            return [arr[0][0] + 1,arr[0][1]];
        },
        left: function(arr){
            return [arr[0][0],arr[0][1] - 1];
        },
        right: function(arr){
            return [arr[0][0],arr[0][1] + 1];
        },
        move: function(arr,side){
            var newArr = [];
            newArr = this.changeTail(arr);
            newArr[0] = this[side](arr);
            snake.SnakeArr = newArr;
        }
    },
    snakeEats:  function(){
        $cellHead = $("#head");
        if($cellHead.attr("data-food") == "food") {
            snake.snakeLength++;
            snake.SnakeArr.push([]);
            food.init();
            game.changeScore();
        }
    },
    snakeDies: function(){
        for(var i = 1; i < snake.SnakeArr.length; i++ ){
            if(snake.SnakeArr[0][0] == snake.SnakeArr[i][0]){
                if(snake.SnakeArr[0][1] == snake.SnakeArr[i][1]){
                    game.stop();
                    setTimeout(function(){
                        game.gameOver();
                    },500);
                }
            }
        }
        //console.log(snake.SnakeArr[0][0] + " / " + snake.SnakeArr[0][1]);
        if (game.mode.strict == true){
            if(snake.SnakeArr[0][0] == snakeArea.grid[0] || snake.SnakeArr[0][1] == snakeArea.grid[1] ||
                snake.SnakeArr[0][0] == -1 || snake.SnakeArr[0][1] == -1){
                game.stop();
                setTimeout(function(){
                    game.gameOver();
                },500);
            }
        }else {
            alert("It is not a strict mode!")
        }
    },
    snakeMoves: function(){
        if (snake.pause === true) {
            clearInterval(snake.myInterval);
        }
        else {
            clearInterval(snake.myInterval);
            snake.myInterval = setInterval(
                function(){
                    snake.snakeChangePosition.move(snake.SnakeArr,snake.side);
                    snake.snakeDies();
                    snake.snakeEats();
                    snake.snakeClearOld();
                    snake.snakeDraw(snake.SnakeArr);
                }, snake.speed
            );
        }
    }
};

$( document ).ready(function() {
    mainFunc();
    game.newGame();
});
