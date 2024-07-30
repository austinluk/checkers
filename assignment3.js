let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let checkersBoard = [];

// The checker Board
checkersBoard[0] = ["", "red", "", "red", "", "red", "", "red"];
checkersBoard[1] = ["red", "", "red", "", "red", "", "red", ""];
checkersBoard[2] = ["", "red", "", "red", "", "red", "", "red"];
checkersBoard[3] = ["", "", "", "", "", "", "", ""];
checkersBoard[4] = ["", "", "", "", "", "", "", ""];
checkersBoard[5] = ["gray", "", "gray", "", "gray", "", "gray", ""];
checkersBoard[6] = ["", "gray", "", "gray", "", "gray", "", "gray"];
checkersBoard[7] = ["gray", "", "gray", "", "gray", "", "gray", ""];

// This iterates through the array and replaces the strings "red"/"gray" with an object piece
for (let row = 0; row < checkersBoard.length; row++) {
    for (let col = 0; col < checkersBoard[row].length; col++) {
        if (checkersBoard[row][col] === "red") {
            checkersBoard[row][col] = new Piece(row, col, "red", false, false);
        } else if (checkersBoard[row][col] === "gray") {
            checkersBoard[row][col] = new Piece(row, col, "gray", false, false);
        }
    }
}

/**
 * Draw the Board
 */
function drawBoard() {
    for (let row = 0; row < checkersBoard[0].length; row++) {
        for (let col = 0; col < checkersBoard[0].length; col++) {
            let isBlack = ((row + col) % 2 == 1);
            if (isBlack) {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(col * 100, row * 100, 100, 100);
        }
    }
}

// Functions to draw the pieces on the board
function drawPieces() {
    for (let row = 0; row < checkersBoard.length; row++) {
        for (let col = 0; col < checkersBoard.length; col++) {
            if (checkersBoard[row][col] != "") {
                checkersBoard[row][col].draw();
            }
        }
    }
}

// Two functions are called when page loads to setup the checkerboard
window.addEventListener("load", function (event) {
    drawBoard();
    drawPieces();
});

// Allows user to see which row and column a piece is on in the console
let square = 100;

canvas.addEventListener("click", function (event) {
    let x = event.offsetX;
    let y = event.offsetY;

    // Retrieve the row and col
    let row = Math.floor(y / square);
    let col = Math.floor(x / square);

    console.log("row: " + row + ", col: " + col);

    let piece = checkersBoard[row][col];

    if (piece != "") {
        let selectedPiece = getSelectedPiece();

        if (selectedPiece != null) {
            selectedPiece.isClicked = false; // Deselect the previously selected piece
        }

        piece.isClicked = !piece.isClicked; // Select or deselect the clicked piece
    } else {
        // If the square is empty, attempt to move the selected piece
        let selectedPiece = getSelectedPiece();

        if (selectedPiece && selectedPiece.isValidMove(row, col)) {
            // Update the Board array to remove the Piece from its old location
            checkersBoard[selectedPiece.row][selectedPiece.col] = "";

            // Call the Piece’s move method to update the Piece to its new location
            selectedPiece.move(row, col);

            // Update the Board array to put the Piece in the correct location
            checkersBoard[row][col] = selectedPiece;

            // Set the Piece’s isClicked property back to false
            selectedPiece.isClicked = false;
        }
    }

    // Redraw the board and pieces with the highlighted piece.
    drawBoard();
    drawPieces();
});

/**
 * PIECE OBJECT
 * Number: which row of the board array this piece is on/in.
 * Col Number: which col of the board array this piece is on/in.
 * Color String: the color of the Piece, either red or gray.
 * isClicked Boolean: whether this Piece is currently clicked on by the user or not.
 * Initially false.
 * isKing Boolean: whether this Piece has made it all the way across the board and
 * become a King or not. Initially false
 */
function Piece(row, col, color, isClicked, isKing) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.isClicked = isClicked;
    this.isKing = isKing;

    // Method to draw the object piece to the board
    this.draw = function () {
        if (this.isClicked === true) {
            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 50, 35, 0, Math.PI * 2);
            ctx.strokeStyle = "Yellow";
            ctx.fillStyle = color;
            ctx.lineWidth = 5;
            ctx.fill();
            ctx.stroke();
            console.log(checkersBoard[0]);
        } else {
            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 50, 35, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        // Draw smiley face for King pieces
        if (this.isKing) {
            // Draw eyes
            ctx.beginPath();
            ctx.arc(this.col * 100 + 35, this.row * 100 + 40, 5, 0, Math.PI * 2); // Left eye
            ctx.arc(this.col * 100 + 65, this.row * 100 + 40, 5, 0, Math.PI * 2); // Right eye
            ctx.fillStyle = "white";
            ctx.fill();

            // Draw smile
            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 60, 15, 0, Math.PI, false); // Smiling mouth
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    };

    // Check if the piece is a king.
    this.checkKing = function () {
        if (this.color === "red" && this.row === 7) {
            this.isKing = true;
        }
        if (this.color === "gray" && this.row === 0) {
            this.isKing = true;
        }
    };

    // Method to move the piece and to check if the selected piece is a king. 
    this.move = function (newRow, newCol) {
        this.row = newRow;
        this.col = newCol;
        this.checkKing();
    };

    // Checking all the cases for the piece to move...
    this.isValidMove = function (newRow, newCol) {
        if ((newRow + newCol) % 2 === 0) {
            return false; // cannot move to a white square
        }

        let rowDiff = newRow - this.row;
        let colDiff = newCol - this.col;

        if ((rowDiff === 1 || rowDiff === -1) && (colDiff === 1 || colDiff === -1)) {
            // Move to adjacent square
            if (this.color === "red" && rowDiff === 1 && checkersBoard[newRow][newCol] === "") {
                return true; // Red moves down
            }
            if (this.color === "gray" && rowDiff === -1 && checkersBoard[newRow][newCol] === "") {
                return true; // Gray moves up
            }
            if (this.isKing && checkersBoard[newRow][newCol] === "") {
                return true; // King moves in any direction
            }
        }

        if ((rowDiff === 2 || rowDiff === -2) && (colDiff === 2 || colDiff === -2)) {
            // Jump move
            let midRow = (this.row + newRow) / 2;
            let midCol = (this.col + newCol) / 2;
            let middlePiece = checkersBoard[midRow][midCol];

            if (middlePiece && middlePiece.color !== this.color && checkersBoard[newRow][newCol] === "") {
                // Opponent piece in the middle and target square is empty
                checkersBoard[midRow][midCol] = ""; // Remove the opponent piece
                return true;
            }
        }

        return false; // All other cases are invalid
    };
}

// Method to check if the piece is selected. If true return the piece object otherwise null
function getSelectedPiece() {
    for (let row = 0; row < checkersBoard.length; row++) {
        for (let col = 0; col < checkersBoard[row].length; col++) {
            let piece = checkersBoard[row][col];
            if (piece != "" && piece.isClicked) {
                return piece;
            }
        }
    }
    return null;
}
