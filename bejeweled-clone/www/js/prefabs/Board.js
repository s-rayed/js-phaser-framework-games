var Match3 = Match3 || {};

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

}

// The board has a visible Grid, and a RESERVE grid on top. the grids are 2 dimensional arrays. 
// Once 3 gems are matched in the visible grid, gems will fall down from the reserve grid