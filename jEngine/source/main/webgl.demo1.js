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
        cubeVerticesBuffer: null,
        cubeVerticesIndexBuffer: null,
        cubeVerticesColorBuffer: null,
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
        draw: function (gl) {
            // Establish the perspective with which we want to view the
            // scene. Our field of view is 45 degrees, with a width/height
            // ratio of this.runner.width:this.runner.height, and we only want to see objects between 0.1 units
            // and 100 units away from the camera.
            this.perspectiveMatrix = makePerspective(45, this.runner.width / this.runner.height, 0.1, 100.0);

            // Set the drawing position to the "identity" point, which is
            // the center of the scene.
            this.loadIdentity();

            // Now move the drawing position a bit to where we want to start
            // drawing the cube.
            this.mvTranslate([-0.0, 0.0, -6.0]);

            // Draw the cube by binding the array buffer to the cube's vertices
            // array, setting attributes, and pushing it to GL.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            
            // Set the colors attribute for the vertices.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
            gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            // Draw the cube.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
            this.setMatrixUniforms(gl);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        },

        initializeBuffers: function (gl) {
            // Create a buffer for the cube's vertices.
            this.cubeVerticesBuffer = gl.createBuffer();

            // Select the cubeVerticesBuffer as the one to apply vertex
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer);

            /*            
                         _.-+.
                    _.-""     '.
               +:""            '.
               J \               '.
               L \             _.-+
               |  '.       _.-"   |
               J    \  _.-"       L
               L    +"            J
               +    |             |
                \   |           .+
                 \  |        .-'
                  \ |     .-'
                   \|  .-'
                    +'   hs
*/
            var vertices = [
                // Front face
                -1.0, -1.0, 1.0,
                 1.0, -1.0, 1.0,
                 1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,

                // Back face
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                 1.0, 1.0, -1.0,
                 1.0, -1.0, -1.0,

                // Top face
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                 1.0, 1.0, 1.0,
                 1.0, 1.0, -1.0,

                // Bottom face
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,

                // Right face
                 1.0, -1.0, -1.0,
                 1.0, 1.0, -1.0,
                 1.0, 1.0, 1.0,
                 1.0, -1.0, 1.0,

                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0
            ];

            // Now pass the list of vertices into WebGL to build the shape. We
            // do this by creating a Float32Array from the JavaScript array,
            // then use it to fill the current vertex buffer.
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // Now set up the colors for the faces. We'll use solid colors
            // for each face.
            var colors = [
                [1.0, 1.0, 1.0, 1.0], // Front face: white
                [1.0, 0.0, 0.0, 1.0], // Back face: red
                [0.0, 1.0, 0.0, 1.0], // Top face: green
                [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
                [1.0, 1.0, 0.0, 1.0], // Right face: yellow
                [1.0, 0.0, 1.0, 1.0] // Left face: purple
            ];

            // Convert the array of colors into a table for all the vertices.
            var generatedColors = [];

            for (var j = 0; j < colors.length; j++) {
                var c = colors[j];

                // Repeat each color four times for the four vertices of the face
                for (var i = 0; i < colors[j].length; i++) {
                    generatedColors = generatedColors.concat(c);
                }
            }

            this.cubeVerticesColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

            // Build the element array buffer; this specifies the indices
            // into the vertex array for each face's vertices.

            this.cubeVerticesIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

            // This array defines each face as two triangles, using the
            // indices into the vertex array to specify each triangle's
            // position.
            var cubeVertexIndices = [
                0, 1, 2, 0, 2, 3, // front
                4, 5, 6, 4, 6, 7, // back
                8, 9, 10, 8, 10, 11, // top
                12, 13, 14, 12, 14, 15, // bottom
                16, 17, 18, 16, 18, 19, // right
                20, 21, 22, 20, 22, 23 // left
            ];

            // Now send the element array to GL

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
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