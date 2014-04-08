define(function() {
    var Cube = function(gl, startPosition) {
        this.vertices = [];
        this.verticesIndices = [];
        this.verticesNormals = [];
        this.textureCoordinates = [];

        this.verticesBuffer = null;
        this.verticesIndicesBuffer = null;
        this.verticesNormalsBuffer = null;
        this.textureCoordinatesBuffer = null;

        this.shaderProgram = null;
        this.vertexPositionAttribute = null;
        this.textureCoordAttribute = null;

        this.texture = null;
        this.image = null;

        this.position = $V(startPosition);

        _setupMeshData();
        _setupBuffers(gl);
        _setupTextures(gl);
        _setupShaders(gl);
    };
    
    Cube.prototype.update = function (dt) {

    }

    Cube.prototype.render = function (gl) {
        // Draw the cube by binding the array buffer to the cube's vertices
        // array, setting attributes, and pushing it to GL.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesNormalsBuffer);
        gl.vertexAttribPointer(this.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    }

    function _setupMeshData() {
        this.vertices = [
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

        this.verticesIndices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23 // left
        ];

        this.verticesNormals = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];

        this.textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
    }

    function _setupBuffers(gl) {
        // Create a buffer for the cube's vertices.
        this.verticesBuffer = gl.createBuffer();

        // Select the cubeVerticesBuffer as the one to apply vertex
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);

        // Now pass the list of vertices into WebGL to build the shape. We
        // do this by creating a Float32Array from the JavaScript array,
        // then use it to fill the current vertex buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.verticesIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.verticesIndices), gl.STATIC_DRAW);

        this.verticesNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesNormalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesNormals), gl.STATIC_DRAW);

        this.textureCoordinatesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
    }

    function _setupTextures(gl) {
        var me = this;
        this.texture = gl.createTexture();
        this.image = new Image();
        this.image.onload = function () { onTextureLoaded(gl, me.image, me.texture); }
        //this.cubeImage.src = "assets/textures/Grass_1.png";
        this.image.src = "assets/textures/stone_wall_sandstone_4096.jpg";
    }

    function onTextureLoaded(gl, image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function _setupShaders(gl) {
        var fragmentShader = _getShader(gl, "shader-fs");
        var vertexShader = _getShader(gl, "shader-vs");

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

        //this.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(this.vertexColorAttribute);

        this.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(this.textureCoordAttribute);
    }

    function _getShader(gl, id) {
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
    }

    return Cube;
});