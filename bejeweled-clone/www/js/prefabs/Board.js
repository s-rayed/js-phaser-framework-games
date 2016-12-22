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

    console.log(this.grid);
    
    // Reserve grid on the top, for when new blocks are needed
    this.reserveGrid = [];

    this.RESERVE_ROW = 5;

    for (i = 0; i < this.RESERVE_ROW; i++) {
        this.reserveGrid.push([]);

        for (j = 0; j < cols; j++) {
            this.reserveGrid[i].push(0);
        }
    }

    console.log(this.reserveGrid);

};

// The board has a visible Grid, and a RESERVE grid on top. the grids are 2 dimensional arrays. 
// Once 3 gems are matched in the visible grid, gems will fall down from the reserve grid