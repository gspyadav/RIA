"use strict";
//(function() {

var Board = function () {

    var err = "";
    var score = 0;
    var board = [];
    var boardSize;
    var bobCat = {
        "bobDir": 0
    };
    var target = {
    };
    /*
     * 
     * @type Array 
     * Move     Row     Column
     * North-0  -1      0
     * East-1   0       +1
     * South-2  +1      0
     * West-3   0       -1
     */
    var rowDir = [-1, 0, 1, 0];
    var colDir = [0, 1, 0, -1];
    var dirArrow = ["&uarr;", "&rarr;", "&darr;", "&larr;"];//Arrows for showing the direction

    // var rrr = Util.seed;
    // alert(Util.seed);

    /**
     * public function to initialize the entire board
     * @returns {undefined}
     */
    this.initGame = function () {
        //alert(Util.random(false));
        // alert("I am an alert box!");
        boardSize = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
        for (var r = 0; r < boardSize; r++) {
            board[r] = [];
        }
        //initializing the board with randome weight
        for (var r = 0; r < boardSize; r++) {
            for (var c = 0; c < boardSize; c++) {
                board[r][c] = randomWeight();
            }
        }
        //Decide the Bob-cat initial Position
        bobCat.bobRow = boardSize - 1;
        bobCat.mainBobRow = boardSize - 1; //To save the original bobcat position
        var bobCatCol;
        var flag = false;
        while (flag === false) {
            bobCatCol = Math.floor(Math.random() * (boardSize));
            if (board[bobCat.bobRow][bobCatCol] === 0) {
                flag = true;
                bobCat.bobCol = bobCatCol;
                bobCat.mainBobCol = bobCatCol; //To save the original bobcat position
            }
        }
        //Decide the Target position
        var targetRow;
        var targetCol;
        flag = false;
        while (flag === false) {
            Math.floor(Math.random() * (12 - 8 + 1)) + 8;
            targetRow = Math.floor(Math.random() * (boardSize - 2)) + 1;
            targetCol = Math.floor(Math.random() * (boardSize - 2)) + 1;
            if (board[targetRow][targetCol] > 0) {
                target.targetRow = targetRow;
                target.targetCol = targetCol;
                target.targetWeight = board[targetRow][targetCol];
                flag = true;
            }
        }
        //fancyOutput();
        canvasOutput();
    };

    /**
     * Function to produce random numbers
     * @returns {Number}
     */
    var randomWeight = function randomWeight() {
        var rand = Math.random();
        if (rand < 0.2) {
            return 1;
        }
        else if (rand < 0.3) {
            return 2;
        }
        else if (rand < 0.4) {
            return 3;
        }
        else {
            return 0;
        }
    };

    /**
     * Function to produce normal display in the prompt window
     * @returns {String}
     */
    this.toString = function () {
        var out = "";
        for (var r = 0; r < boardSize; r++) {
            for (var c = 0; c < boardSize; c++) {
                if (r === bobCat.bobRow && c === bobCat.bobCol) {
                    out = out + "  " + "B";
                } else if (r === target.targetRow && c === target.targetCol) {
                    out = out + " " + "T" + target.targetWeight;
                }
                else {
                    out = out + "  " + board[r][c];
                }
            }
            out = out + "\n\n";
        }
        return err + "BobCat Direction: " + bobCat.bobDir + "\nn=" + boardSize + "\n" + out;
    };

    /*
     * function which compares two different position and returns whether they are pointing to same location or not
     * @param {type} row1
     * @param {type} col1
     * @param {type} x
     * @param {type} n
     * @returns {Boolean}
     */
    var checkPoistions = function (row1, col1, x, n) {
        if (row1 === (bobCat.bobRow + rowDir[x] * n) && col1 === (bobCat.bobCol + colDir[x] * n)) {
            return true;
        }
        else {
            return false;
        }

    };
    var isGameOver = function () {
        if (target.targetRow === bobCat.mainBobRow && target.targetCol === bobCat.mainBobCol) {
            return true;
        }
        else {
            return false;
        }

    };

    /**
     * returns the next nth cart weight from bobcat position
     * @param {type} x
     * @param {type} n
     * @returns {unresolved}
     */
    var nextCartWt = function (x, n) {
        var weight = board[bobCat.bobRow + rowDir[x] * n][bobCat.bobCol + colDir[x] * n];
        return weight;
    };

    /**
     * change the weight of nth cartbox from the bobcat to new weight
     * @param {type} x
     * @param {type} n
     * @param {type} weight
     * @returns {undefined}
     */
    var boardWtChange = function (x, n, weight) {

        board[bobCat.bobRow + rowDir[x] * n][bobCat.bobCol + colDir[x] * n] = weight;
    };

    var boundaryCheck = function (x, n) {
        if ((bobCat.bobRow + rowDir[x] * n < boardSize && bobCat.bobRow + rowDir[x] * n >= 0) &&
                (bobCat.bobCol + colDir[x] * n < boardSize && bobCat.bobCol + colDir[x] * n >= 0)) {
            return true;
        }

        else {
            return false;
        }
    };
    /*
     * public function which takes the command and process it
     */
    var move = function (x) {
        err = "";
        //Moving/Pushing the cart
        if (bobCat.bobDir === parseInt(x)) {
            x = parseInt(x);
            //Logic for moving the Bobcat to empty cart
            var totalWt = 0;
            var numOfCarts = 1;
            while (nextCartWt(x, numOfCarts) !== 0 && boundaryCheck(x, numOfCarts)) {
                totalWt += nextCartWt(x, numOfCarts);
                numOfCarts += 1;
            }
            var nextCartWeight = nextCartWt(x, 1);
            if (totalWt === 0) {
                bobCat.bobRow += rowDir[x];
                bobCat.bobCol += colDir[x];
                score += 10;
            }
            else if (totalWt <= 3 && nextCartWt(x, numOfCarts) === 0) {
                if (numOfCarts - 1 === 3) {
                    boardWtChange(x, 4, nextCartWt(x, 3));
                    boardWtChange(x, 3, nextCartWt(x, 2));
                    boardWtChange(x, 2, nextCartWt(x, 1));
                    boardWtChange(x, 1, 0);
                }
                else if (numOfCarts - 1 === 2) {
                    boardWtChange(x, 3, nextCartWt(x, 2));
                    boardWtChange(x, 2, nextCartWt(x, 1));
                    boardWtChange(x, 1, 0);

                }
                else if (numOfCarts - 1 === 1) {
                    boardWtChange(x, 2, nextCartWt(x, 1));
                    boardWtChange(x, 1, 0);
                }
                score += 10;
                //If next cart is the target then change the location of target
                for (var i = 1; i <= (numOfCarts - 1); i++) {
                    if (checkPoistions(target.targetRow, target.targetCol, x, i)) {
                        target.targetRow += rowDir[x];
                        target.targetCol += colDir[x];
//                        if (target.targetRow === bobCat.mainBobRow && target.targetCol === bobCat.mainBobCol) {
//                            fancyOutput();
//                            canvasOutput();
//                            alert("GAME OVER YOUR SCORE IS:" + score);
//                        }
                        break;
                    }
                }
                bobCat.bobRow += rowDir[x];
                bobCat.bobCol += colDir[x];


            }
            else {
                err += "\nERROR: Invalid Move, Next Carts weight is more than 3 / it reached the boundary";
            }
        }
        //Logic for Blasting the next cart
        else if (x.toUpperCase() === "B") {
            if (nextCartWt(bobCat.bobDir, 1) === 0) {
                err += "ERROR: You cant explode 0 weight cart";
            } else if (checkPoistions(target.targetRow, target.targetCol, bobCat.bobDir, 1)) {
                err += "ERROR: You cant explode Target cart";
            }
            else {
                boardWtChange(bobCat.bobDir, 1, 0);
                score += 100;
            }
        }
        //Logic for changing the direction of BobCat
        else if (x.toUpperCase() === "R") {
            bobCat.bobDir = (bobCat.bobDir + 1) % 4;
            score += 10;
        }
        else if (x.toUpperCase() === "L") {
            bobCat.bobDir = (bobCat.bobDir + 3) % 4;
            score += 10;
        }
        //Invalid command for bobcat
        else {
            err += "ERROR: Invalid Command";
        }
    };

    /*
     * public function which displays the output in fancy way using table format
     */
    var fancyOutput = function () {
        var text = "<br>Score is : " + score + "<br><br>";// + "<br>BobCat Direction: " + bobCat.bobDir + "<br>Board Size=" + boardSize + "<br><br>" + err + ".";
        text += "<table style=\"display:table; width:50%; table-layout:fixed; border: 2px solid black; padding: 5px; text-align: left; background-color: #66FF99;\">";
        for (var r = 0; r < boardSize; r++) {
            text += "<tr>";
            for (var c = 0; c < boardSize; c++) {
                if (r === bobCat.bobRow && c === bobCat.bobCol) {
                    text += "<td style=\"color:red; background-color: white;\"><b>&#9822;" + dirArrow[bobCat.bobDir] + "</b></td>";
                } else if (r === target.targetRow && c === target.targetCol) {
                    text += "<td style=\"color:red; background-color: white;\"><b>&#9971; " + target.targetWeight + "</b></td>";
                } else if (r === bobCat.mainBobRow && c === bobCat.mainBobCol) {
                    //Pointing the Original BobCat Position
                    text += "<td style=\"color:red; background-color: white;\"><b>&#9730; " + board[r][c] + "</b></td>";
                }
                else {
                    text += "<td>" + board[r][c] + "</td>";
                }
            }
            text += "</tr>";
        }
        text += "</table>";
        document.getElementById("demo").innerHTML = text;
    };

    var canvasOutput = function () {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var blockSize = canvasWidth / boardSize;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        for (var i = 0; i < boardSize; i++)
        {
            for (var j = 0; j < boardSize; j++)
            {
                ctx.rect(blockSize * i, blockSize * j, blockSize, blockSize);
                if (j === bobCat.mainBobRow && i === bobCat.mainBobCol) {
                    ctx.fillStyle = "#9AFE2E";
                    ctx.fillRect(blockSize * i, blockSize * j, blockSize, blockSize);
                }
                ctx.stroke();
                var startx = blockSize * i + 4;
                var starty = blockSize * j + 4;
                if (j === bobCat.bobRow && i === bobCat.bobCol) {
                    drawImage(startx, starty, blockSize - 8, blockSize - 8, ctx, 'bobcat_1.gif', -1, bobCat.bobDir);
                }
                else if (j === target.targetRow && i === target.targetCol) {
                    drawImage(startx, starty, blockSize - 8, blockSize - 8, ctx, 'target.gif', board[j][i]);
                }
                else if (board[j][i] > 0) {
                    drawImage(startx, starty, blockSize - 8, blockSize - 8, ctx, 'crate.png', board[j][i]);
                }
            }
        }
    };
    var drawImage = function (x, y, imgWidth, imgHeight, ctx, imageName, wt, dir) {
        var image = new Image();

        image.onload = function () {
            if (dir >= 0) {
                Util.drawRotatedImage(ctx, dir * 90, image, x, y, imgWidth, imgHeight);
            }
            else {
                ctx.drawImage(image, x, y, imgWidth, imgHeight);
                if (wt > 0) {
                    //ctx.font="bold";
                    ctx.font = "italic small-caps bold 12px arial";
                    ctx.fillStyle = "#0000ff";
                    ctx.fillText(wt, x + (imgWidth / 2), y + (imgHeight / 2));
                }
            }
        };
        image.src = imageName;
    };
    this.checkKey = function (e) {
        e = e || window.event;
        // alert("KeyCode is " + e.keyCode);
        if (!isGameOver()) {
            if (e.keyCode === 38) {
                //alert("in if"+bobCat.bobDir);
                // up arrow
                if (bobCat.bobDir === 0) {

                    move(0);
                    // alert("After Move"+bobCat.bobDir);
                }
                else if (bobCat.bobDir === 1) {
                    move("L");
                }
                else if (bobCat.bobDir === 3) {
                    move("R");
                }


                //alert("Output Done");
            } else if (e.keyCode === 40) {
                // down arrow
                if (bobCat.bobDir === 2) {
                    move(2);
                }
                else if (bobCat.bobDir === 1) {
                    move("R");
                }
                else if (bobCat.bobDir === 3) {
                    move("L");
                }
            } else if (e.keyCode === 37) {
                // left arrow
                //alert("in if"+bobCat.bobDir);
                if (bobCat.bobDir === 3) {
                    move(3);
                }
                else if (bobCat.bobDir === 0) {
                    //alert("After Left Dir change"+"L".toUpperCase());
                    move("L");

                }
                else if (bobCat.bobDir === 2) {
                    move("R");
                }
            } else if (e.keyCode === 39) {
                // right arrow
                if (bobCat.bobDir === 1) {
                    move(1);
                }
                else if (bobCat.bobDir === 0) {
                    move("R");
                }
                else if (bobCat.bobDir === 2) {
                    move("L");
                }
            } else if (e.keyCode === 46) {
                move("B");
            }
            //fancyOutput();
            canvasOutput();
            //if (isGameOver()) {
            //alert("YOUR GAME OVER & SCORE IS:" + score);
            //}
        }
        else {
            alert("YOUR GAME OVER & SCORE IS:" + score);
        }
    };
};
var brd = new Board();

window.onload = function () {
    //alert(Util.seed);
    brd.initGame();
};
document.onkeydown = brd.checkKey;
//})();