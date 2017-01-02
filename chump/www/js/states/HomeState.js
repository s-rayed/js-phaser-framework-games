var Chump = Chump || {};

Chump.HomeState = {
    
    init: function(message, score) {
        this.message = message;
        this.score = score;
    },
    
    create: function() {
        var background = this.game.add.sprite(0, 0, 'background');
        background.inputEnabled = true;
        
        background.events.onInputDown.add(function() {
            this.state.start('GameState');    
        }, this);
        
        var style = {
            font: '35px Arial',
            fill: '#fff'
        };
        
        var scoreStyle = {
            font: '35px Arial',
            fill: 'Red'
        }
        
        this.game.add.text(30, this.game.world.centerY + 200, 'TOUCH TO START', style);
        
        if (this.message) {
            this.game.add.text(60, this.game.world.centerY - 200, this.message, style);
        }
        
        if (this.score) {
            this.game.add.text(120, this.game.world.centerY, 'Score: ' + this.score, scoreStyle);
        }
        
    }
    
};