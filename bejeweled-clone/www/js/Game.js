var Match3 = Match3 || {};

Match3.GameState = {
    
    init: function() {
        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        this.NUM_VARIATIONS = 6;
        this.BLOCK_SIZE = 35;
        this.ANIMATION_TIME = 350;
    },
    
    create: function() {
        // Game background
        this.background = this.add.sprite(0, 0, 'background');
        this.blocks = this.add.group();
        
        // Board model
        this.board = new Match3.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
        // this.board.consoleLog();

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
    },

    getBlockFromColRow: function(position) {
        var foundBlock;

        this.blocks.forEachAlive(function(block) {
            if (block.row === position.row && block.col === position.col) {
                foundBlock = block;
            }
        }, this);

        return foundBlock;
    },

    dropBlock: function(sourceRow, targetRow, col) {
        var block = this.getBlockFromColRow({ row: sourceRow, col: col });
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        block.row = targetRow;

        var blockMovement = this.game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME );
        blockMovement.start();
    },

    dropReserveBlock: function(sourceRow, targetRow, col) {
        var x = 36 + col * (this.BLOCK_SIZE + 6);
        var y = -(this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow * (this.BLOCK_SIZE + 6);

        var block = this.createBlock(x, y, { asset: 'block' + this.board.grid[targetRow][col], row: targetRow, col: col });
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        var blockMovement = this.game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME );
        blockMovement.start();
    },

    swapBlocks: function(block1, block2) {

        // when swapping... scale block1 back to 0.8
        block1.scale.setTo(0.8);

        var block1Movement = this.game.add.tween(block1);
        block1Movement.to ({ x: block2.x, y: block2.y }, this.ANIMATION_TIME);
        block1Movement.onComplete.add(function() {
            // After animation we update the model
            this.board.swap(block1, block2);

            if (!this.isReversingSwap) {

                var chains = this.board.findAllChains();
                if (chains.length > 0) {
                    this.updateBoard();
                } else {
                    this.isReversingSwap = true;
                    this.swapBlocks(block1, block2);
                }

            } else {
                this.isReversingSwap = false;
                this.clearSelection();
            }

        }, this)
        block1Movement.start();

        var block2Movement = this.game.add.tween(block2);
        block2Movement.to ({ x: block1.x, y: block1.y }, this.ANIMATION_TIME);
        block2Movement.start();
    },

    pickBlock: function(block) {
        // Only swap if UI is not blocked
//        console.log(block)
        if (this.isBoardBlocked) {
            return;
        }

        // If nothing is selected 
        if (!this.selectedBlock) {
            // highlight the first block
            block.scale.setTo(1.5);

            this.selectedBlock = block;
        } else {
            // Second block you are selecting is target block
            this.targetBlock = block;

            // Only adjacent blocks can swap
            if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
                // Block the UI
                this.isBoardBlocked = true;

                //swap blocks
                this.swapBlocks(this.selectedBlock, this.targetBlock);
            } else {
//                console.log('not adjacent');
                this.clearSelection();
            }
        }

    },

    clearSelection: function() {
        this.isBoardBlocked = false;
        this.selectedBlock = null;

        // making the chosen blocks back to regular size
        this.blocks.setAll('scale.x', 0.8);
        this.blocks.setAll('scale.y', 0.8);
    },

    updateBoard: function() {
        this.board.clearChains();
        this.board.updateGrid();

        // after the block drops
        this.game.time.events.add(this.ANIMATION_TIME, function() {
            // check if there are new chains
            var chains = this.board.findAllChains();

            if (chains.length > 0) {
                this.updateBoard();
            } else {
                this.clearSelection();
            }
        }, this)
    }
    
};











