var Match3 = Match3 || {};

Match3.GameState = {
    
    init: function() {
        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        this.NUM_VARIATIONS = 6;
        this.BLOCK_SIZE = 35;
        this.ANIMATION_TIME = 200;
    },
    
    create: function() {
        // Game background
        this.background = this.add.sprite(0, 0, 'background');
        this.blocks = this.add.group();
        
        // Board model
        this.board = new Match3.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
        this.board.consoleLog();

        this.drawBoard();
    },

    createBlock: function(x, y, data) {
        // Implementing a pool of blocks to allow object recycling to save memory and avoid resource intensive methods
        var block = this.blocks.getFirstExists(false);

        if (!block) {
            block = new Match3.Block(this, x, y, data);
            this.blocks.add(block);
            // scaling the image sizes to fit in the squares
            block.scale.setTo(0.8, 0.8);
        } else {
            // this is not the Phaser reset method. it is a custom reset method from block.js that was overwritten
            block.reset(x, y, data);
        }

        return block;
    },

    drawBoard: function() {
        var i, j, block, square, x, y, data;

        // Semi-transparent black squares
        var squareBitmap = this.add.bitmapData(this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);
        squareBitmap.ctx.fillStyle = '#000';
        squareBitmap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);

        for (i = 0; i < this.NUM_ROWS; i++) {
            for (j = 0; j < this.NUM_COLS; j++) {
                // row & column seperation between each square in the grid
                x = 36 + j * (this.BLOCK_SIZE + 6);
                y = 150 + i * (this.BLOCK_SIZE + 6);

                square = this.add.sprite(x, y, squareBitmap);
                square.anchor.setTo(0.5);
                square.alpha = 0.2;

                this.createBlock(x, y, { asset: 'block' + this.board.grid[i][j], row: i, col: j });
            }
        }
        // this puts the blocks (gems) on top of the square
        this.game.world.bringToTop(this.blocks);
    }
    
};