var Match3 = Match3 || {};

// The board has a visible Grid, and a RESERVE grid on top. the grids are 2 dimensional arrays. 
// Once 3 gems are matched in the visible grid, gems will fall down from the reserve grid

Match3.Board = function(state, rows, cols, blockVariations) {
    
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;
    
    // Main grid
    this.grid = [];
    
    // 2x2 array
    var i, j;
    for (i = 0; i < rows; i++) {
        this.grid.push([]);
        
        for (j = 0; j < cols; j++) {
            this.grid[i].push(0);    
        }
    }
    
    // Reserve grid on the top, for when new blocks are needed
    this.reserveGrid = [];

    this.RESERVE_ROW = 5;

    for (i = 0; i < this.RESERVE_ROW; i++) {
        this.reserveGrid.push([]);

        for (j = 0; j < cols; j++) {
            this.reserveGrid[i].push(0);
        }
    }

    // Populate Grids
    this.populateGrid();
    this.populateReserveGrid();

};

Match3.Board.prototype.populateGrid = function() {
    // Random number generations here MUST be uniformly distributed
    var i, j, variation;
    for (i = 0; i < this.rows; i++) {
        for (j = 0; j < this.cols; j++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1; // number b/w 1 and 7
            this.grid[i][j] = variation;
        }
    }
}

Match3.Board.prototype.populateReserveGrid = function() {
    // Random number generations here MUST be uniformly distributed
    var i, j, variation;
    for (i = 0; i < this.RESERVE_ROW; i++) {
        for (j = 0; j < this.cols; j++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1; // number b/w 1 and 7
            this.reserveGrid[i][j] = variation;
        }
    }
}

Match3.Board.prototype.consoleLog = function() {

    var i, j, variation;
    var prettyString = '';

    for (i = 0; i < this.RESERVE_ROW; i++) {
        prettyString += '\n';
        for (j = 0; j < this.cols; j++) {
            prettyString += ' ' + this.reserveGrid[i][j];    
        }
    }

    prettyString += '\n';

    for (j = 0; j < this.cols; j++) {
        prettyString += ' -';
    }

    for (i = 0; i < this.rows; i++) {
        prettyString += '\n';
        for (j = 0; j < this.cols; j++) {
            prettyString += ' ' + this.grid[i][j]; 
        }
    }

    console.log(prettyString);

};

// Swapping blocks

Match3.Board.prototype.swap = function(source, target) {

    var temp = this.grid[target.row][target.col];

    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temp;

};

// Check if 2 blocks that are going to be swapped are adjacent to each other

Match3.Board.prototype.checkAdjacent = function(source, target) {
    var diffRow = Math.abs(source.row - target.row);
    var diffCol = Math.abs(source.col - target.col);

    var isAdjacent = (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1)
    return isAdjacent;
};


// Check whether a single block is a part of a chain

Match3.Board.prototype.isChained = function(block) {
    // There are 6 possible chains we have to check all the time, whether there is a chain above, below, to the left, to the right, horizontally centered, vertically centered.
    var isChained = false;
    var variation = this.grid[block.row][block.col];
    var row = block.row;
    var col = block.col;

    // Left
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col - 2]) {
        isChained = true;
    }

    // Right
    if (variation == this.grid[row][col + 1] && variation == this.grid[row][col + 2]) {
        isChained = true;
    }

    // Up
    if (this.grid[row - 2]) {
        if (variation == this.grid[row - 1][col] && variation == this.grid[row - 2][col]) {
            isChained = true;
        }        
    }

    // Down
    if (this.grid[row + 2]) {
        if (variation == this.grid[row + 1][col] && variation == this.grid[row + 2][col]) {
            isChained = true;
        }        
    }

    // center - horizontal
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col + 2]) {
        isChained = true;
    }

    // center - vertical
    if (this.grid[row + 1] && this.grid[row - 1]) {
        if (variation == this.grid[row + 1][col] && variation == this.grid[row - 1][col]) {
            isChained = true;
        }        
    }

    return isChained;
};







