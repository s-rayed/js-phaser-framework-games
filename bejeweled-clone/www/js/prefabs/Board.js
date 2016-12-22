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

    this.RESERVE_ROW = rows;

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

    // If there are any chains right in the beginning, repopulate
    var chains = this.findAllChains();
    if (chains.length > 0) {
        this.populateGrid();
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

// Match3.Board.prototype.consoleLog = function() {

//     var i, j, variation;
//     var prettyString = '';

//     for (i = 0; i < this.RESERVE_ROW; i++) {
//         prettyString += '\n';
//         for (j = 0; j < this.cols; j++) {
//             prettyString += ' ' + this.reserveGrid[i][j];    
//         }
//     }

//     prettyString += '\n';

//     for (j = 0; j < this.cols; j++) {
//         prettyString += ' -';
//     }

//     for (i = 0; i < this.rows; i++) {
//         prettyString += '\n';
//         for (j = 0; j < this.cols; j++) {
//             prettyString += ' ' + this.grid[i][j]; 
//         }
//     }

//     console.log(prettyString);

// };

// Swapping blocks

Match3.Board.prototype.swap = function(source, target) {

    var temp = this.grid[target.row][target.col];

    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temp;

    var tempPos = { row: source.row, col: source.col };
    source.row = target.row;
    source.col = target.col;

    target.row = tempPos.row;
    target.col = tempPos.col;

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
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col + 1]) {
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

// Find all chains on the board
Match3.Board.prototype.findAllChains = function() {
    var chained = [];
    var i, j;

    for (i = 0; i < this.rows; i++) {
        for (j = 0; j < this.cols; j++) {
            if (this.isChained({ row: i, col: j})) {
                chained.push({ row: i, col: j});
            }
        }
    }

    // console.log(chained);
    return chained;
};

// Clear all chains
Match3.Board.prototype.clearChains = function() {
    // Finds all blocks that need to be cleared
    var chainedBlocks = this.findAllChains();

    // Sets the chain blocks to 0
    chainedBlocks.forEach(function(block) {
        this.grid[block.row][block.col] = 0;

        // kill that block object
        this.state.getBlockFromColRow(block).kill();

    }, this);
};


// Drop block in the main grid from one position to another, source is set to 0
Match3.Board.prototype.dropBlock = function(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;
    this.state.dropBlock(sourceRow, targetRow, col);
};

// drop a block in the reserve grid from a position to another. the source is set to 0
Match3.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlock(sourceRow, targetRow, col);
};

// Moves down blocks to fill in empty slots
Match3.Board.prototype.updateGrid = function() {
    // Climb the grid from the bottom up, when an empty slot is found, climb up in the cloumn until a block is found
    // Make the block fall and climb up to the reserve grid if it is required
    var i, j, k, foundBlock;

    // Loop through all the rows, from bottom up
    for (i = this.rows - 1; i >= 0; i--) {
        for (j = 0; j < this.cols; j++) {
            // if block is 0, get first non-zero, then go up to get a non-zero
            if(this.grid[i][j] === 0) {
                foundBlock = false;

                // climb up in the main grid
                for (k = i - 1; k >= 0; k--) {
                    if (this.grid[k][j] > 0) {
                        this.dropBlock(k, i, j);
                        foundBlock = true;
                        break;
                    }
                }

                if (!foundBlock) {
                    // climb up in the reserve grid (only gets called if numbers are 0 in this iteration)
                    for (k = this.RESERVE_ROW - 1; k >= 0; k--) {
                        if (this.reserveGrid[k][j] > 0) {
                            this.dropReserveBlock(k, i, j);
                            break;
                        }
                    }
                }
            }
        }
    }

    // Repopulate the reserveGrid so that there are no chains in the reserve
    this.populateReserveGrid();
};


















