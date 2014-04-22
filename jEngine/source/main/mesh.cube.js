define(function() {
    var Cube = function(gl, startPosition, rotationVector) {
        this.vertices = [];
        this.verticesIndices = [];
        this.verticesNormals = [];
        this.textureCoordinates = [];

        this.verticesBuffer = null;
        this.verticesIndicesBuffer = null;
        this.verticesNormalsBuffer = null;
        this.textureCoordinatesBuffer = null;
        
        this.texture = null;
        this.image = null;

        this.position = $V(startPosition);
        this.modelMatrix = null;

        this.rotationVector = $V(rotationVector);
        this.cubeRotation = 0.0,
        this.lastCubeUpdateTime = 0,

        this.cubeXOffset = 0.0;
        this.cubeYOffset = 0.0;
        this.cubeZOffset = 0.0;

        this.xIncValue = 0.2;
        this.yIncValue = -0.4;
        this.zIncValue = 0.4;
        this.pulse = 0;
        this.switch = 1;
        this.pulsatingColor = $V([1.0, 0.0, 0.0]),

        this._setupMeshData();
        this._setupBuffers(gl);
        this._setupTextures(gl);
    };
    
    Cube.prototype.update = function (dt) {
        this.cubeRotation += (dt * 0.5);

        this.cubeXOffset += this.xIncValue * 3 * dt;
        this.cubeYOffset += this.yIncValue * 3 * dt;
        this.cubeZOffset += this.zIncValue * 3 * dt;

        if (Math.abs(this.cubeYOffset) > 2.5) {
            this.xIncValue = -this.xIncValue;
            this.yIncValue = -this.yIncValue;
            this.zIncValue = -this.zIncValue;
        }

        this.pulse += (dt * this.switch) * 1;
        if (this.pulse > 1) this.switch = -1;
        if (this.pulse < 0) this.switch = 1;

        console.log(this.pulse);
        this.pulsatingColor.x = this.pulse;
        this.pulsatingColor.y = 1;
        this.pulsatingColor.z = this.pulse;

        var translation = Matrix.Translation(this.position).ensure4x4();
        var rotation = Matrix.Rotation(this.cubeRotation, this.rotationVector).ensure4x4();
        this.modelMatrix = translation.multiply(rotation);

    }

    Cube.prototype.render = function (gl) {
        
        
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    Cube.prototype._setupMeshData = function() {
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

    Cube.prototype._setupBuffers = function(gl) {
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

    Cube.prototype._setupTextures = function(gl) {
        var me = this;
        this.texture = gl.createTexture();
        this.image = new Image();
        this.image.onload = function () { onTextureLoaded(gl, me.image, me.texture); }
        this.image.src = "assets/textures/Grass_1.png";
        //this.image.src = "assets/textures/stone_wall_sandstone_4096.jpg";
    }

    function onTextureLoaded(gl, image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    

    return Cube;
});