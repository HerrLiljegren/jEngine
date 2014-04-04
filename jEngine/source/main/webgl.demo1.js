define(['game', 'glutils'], function(game) {
    var demo = {
        defaults: {
            threedee: true,
            stats: true
        },
        runner: null,

        shaderProgram: null,
        vertexPositionAttribute: null,
        vertexColorAttribute: null,
        squareVerticesBuffer: null,
        squareVerticesColorBuffer: null,
        perspectiveMatrix: null,
        mvMatrix: null,

        initialize: function(runner, config) {
            this.runner = runner;

            this.initializeShaders(runner.front);
            this.initializeBuffers(runner.front);

            runner.start();
        },
        update: function(dt) {
        },
        draw: function(gl) {
            this.perspectiveMatrix = makePerspective(45, this.runner.width / this.runner.height, 0.1, 100.0);

            this.loadIdentity();
            this.mvTranslate([-0.0, 0.0, -6.0]);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
            gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            this.setMatrixUniforms(gl);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },

        initializeBuffers: function(gl) {
            this.squareVerticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

            var vertices = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ];

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            var colors = [
                1.0, 1.0, 1.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0
            ];

            this.squareVerticesColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        },

        initializeShaders: function(gl) {
            var fragmentShader = this.getShader(gl, "shader-fs");
            var vertexShader = this.getShader(gl, "shader-vs");

            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);

            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program");
            }

            gl.useProgram(this.shaderProgram);

            this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(this.vertexPositionAttribute);

            this.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
            gl.enableVertexAttribArray(this.vertexColorAttribute);
        },

        getShader: function(gl, id) {
            var shaderScript, theSource, currentChild, shader;

            shaderScript = document.getElementById(id);

            if (!shaderScript) return null;

            theSource = "";
            currentChild = shaderScript.firstChild;

            while (currentChild) {
                if (currentChild.nodeType == currentChild.TEXT_NODE) {
                    theSource += currentChild.textContent;
                }

                currentChild = currentChild.nextSibling;
            }

            if (shaderScript.type === "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (shaderScript.type === "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, theSource);

            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        },
        loadIdentity: function() {
            this.mvMatrix = Matrix.I(4);
        },

        multMatrix: function(m) {
            this.mvMatrix = this.mvMatrix.x(m);
        },

        mvTranslate: function(v) {
            this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
        },

        setMatrixUniforms: function(gl) {
            var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

            var mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
        }
    }

    return demo;
});