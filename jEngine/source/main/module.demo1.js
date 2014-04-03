define(['game'], function(game) {
    var demo = {
        defaults: {
            stats: true
        },
        position: { x: 300, y: 300 },
        position2: { x: 100, y: 100 },
        size: { w: 200, h: 100 },

        initialize: function(runner, config) {
            runner.start();
        },
        update: function(dt) {
        },
        draw: function(context) {
            context.beginPath();
            context.rect(this.position.x, this.position.y, this.size.w, this.size.h);
            context.rect(this.position2.x, this.position2.y, this.size.w, this.size.h);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

            this.drawDebugLines(context, this.position.x, this.position.y, this.size.w, this.size.h);
            this.drawDebugLines(context, this.position2.x, this.position2.y, this.size.w, this.size.h);
            context.fill();
        },

        drawDebugLines: function(context, x, y, w, h) {
            context.beginPath();
            context.fillStyle = 'red';

            context.moveTo(x, 0);
            context.lineTo(x, 999);

            context.moveTo(x + w, 0);
            context.lineTo(x + w, 999);

            context.moveTo(0, y);
            context.lineTo(999, y);

            context.moveTo(0, y + h);
            context.lineTo(999, y + h);


            context.lineWidth = 1;
            context.strokeStyle = 'red';
            context.stroke();
        },
        onkeydown: function(keyCode) {
            switch (keyCode) {
            case game.KEY.W:
                this.position.y -= 10;
                break;
            case game.KEY.A:
                this.position.x -= 10;
                break;
            case game.KEY.S:
                this.position.y += 10;
                break;
            case game.KEY.D:
                this.position.x += 10;
                break;
            }
        }
    };

    return demo;
});