var Match3 = Match3 || {};

Match3.Board = function(state, rows, cols, blockVariations) {
    
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;
    
    // Main grid
    this.grid = [];
    
    // Reserve grid on the top, for when new blocks are needed
    this.reserveGrid = [];

};