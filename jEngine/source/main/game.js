define(function() {
    var g = {
        start: function(id, game, config) {
            return Object.construct(g.Runner, id, game, config).game;
        },

        addEvent: function(object, type, callback) { object.addEventListener(type, callback, false); },
        removeEvent: function(object, type, callback) { object.removeEventListener(type, callback, false); },

        ready: function(callback) { g.addEvent(document, 'DOMContentLoaded', callback); },
        createCanvas: function() { return document.createElement('canvas'); },

        random: function(min, max) { return (min + (Math.random() * (max - min))); },
        timestamp: function() { return window.performance && window.performance.now ? window.performance.now() : new Date().getTime(); },

        KEY: {
            BACKSPACE: 8,
            TAB: 9,
            RETURN: 13,
            ESC: 27,
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            INSERT: 45,
            DELETE: 46,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            TILDA: 192
        },

        Runner: {
            initialize: function(id, game, config) {
                this.config = Object.extend(game.defaults || {}, config || {});
                this.threedee = this.config.threedee || false;
                this.fps = this.config.fps || 60;
                this.interval = 1000.0 / this.fps;
                this.canvas = document.getElementById(id);
                this.width = this.config.width || this.canvas.offsetWidth;
                this.height = this.config.height || this.canvas.offsetHeight;
                this.frontCanvas = this.canvas;
                this.frontCanvas.width = this.width;
                this.frontCanvas.height = this.height;
                this.backCanvas = g.createCanvas();
                this.backCanvas.width = this.width;
                this.backCanvas.height = this.height;
                this.front = (this.threedee && (this.frontCanvas.getContext('webgl') || this.frontCanvas.getContext('experimental-webgl'))) || this.frontCanvas.getContext('2d');
                this.back = (this.threedee && (this.backCanvas.getContext('webgl') || this.backCanvas.getContext('experimental-webgl'))) || this.backCanvas.getContext('2d');
                this.addEvents();
                this.resetStats();

                this.game = Object.construct(game, this, this.config);

                if (this.threedee && !this.front) alert("no 3d :(");
                console.log("Canvas: " + (this.threedee ? "3" : "2") + "D");
            },

            start: function() { // game instance should call runner.start() when its finished initializing and is ready to start the game loop
                this.lastFrame = g.timestamp();
                this.timer = setInterval(this.loop.bind(this), this.interval);
            },

            stop: function() {
                clearInterval(this.timer);
            },

            loop: function() {
                var start = g.timestamp();
                this.update((start - this.lastFrame) / 1000.0);
                var middle = g.timestamp();
                this.draw();
                var end = g.timestamp();

                this.updateStats(middle - start, end - middle);
                this.lastFrame = start;
            },

            update: function(dt) {
                this.game.update(dt);
            },

            draw: function() {
                if (this.threedee) {
                    this.front.clearColor(0.0, 0.0, 0.0, 1.0);
                    this.front.enable(this.front.DEPTH_TEST);
                    this.front.depthFunc(this.front.LEQUAL);
                    this.front.clear(this.front.COLOR_BUFFER_BIT | this.front.DEPTH_BUFFER_BIT);
                    this.game.draw(this.front);

                } else {
                    this.back.clearRect(0, 0, this.width, this.height);
                    this.game.draw(this.back);
                    this.drawStats(this.back);
                    this.front.clearRect(0, 0, this.width, this.height);
                    this.front.drawImage(this.backCanvas, 0, 0);
                }
            },

            resetStats: function() {
                this.stats = {
                    count: 0,
                    fps: 0,
                    update: 0,
                    draw: 0,
                    frame: 0
                };
            },

            updateStats: function(update, draw) {
                if (this.config.stats) {
                    this.stats.update = Math.max(1, update);
                    this.stats.draw = Math.max(1, draw);
                    this.stats.frame = this.stats.update + this.stats.draw;
                    this.stats.count = this.stats.count == this.fps ? 0 : this.stats.count + 1;
                    this.stats.fps = Math.min(this.fps, 1000 / this.stats.frame);
                }
            },

            drawStats: function(context) {
                if (this.config.stats) {
                    context.fillText("frame: " + this.stats.count, this.width - 100, this.height - 60);
                    context.fillText("fps: " + this.stats.fps, this.width - 100, this.height - 50);
                    context.fillText("update: " + this.stats.update, this.width - 100, this.height - 40);
                    context.fillText("draw: " + this.stats.draw, this.width - 100, this.height - 30);
                }
            },

            addEvents: function() {
                g.addEvent(document, 'keydown', this.onkeydown.bind(this));
                g.addEvent(document, 'keyup', this.onkeyup.bind(this));
            },

            onkeydown: function(event) { if (this.game.onkeydown) this.game.onkeydown(event.keyCode); },
            onkeyup: function(event) { if (this.game.onkeyup) this.game.onkeyup(event.keyCode); },

            hideCursor: function() { this.canvas.style.cursor = 'none'; },
            showCursor: function() { this.canvas.style.cursor = 'auto'; },

            alert: function(msg) {
                this.stop();
                var result = window.alert(msg);
                this.start();
                return result;
            },

            confirm: function(msg) {
                this.stop();
                var result = window.confirm(msg);
                this.start();
                return result;
            }
        }
    };

    return g;
});