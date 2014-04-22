'use strict';

var game = require('./game.js');
var Cube = require('./mesh.cube.js');
var glutils = require('../vendor/glutils.js');
var sylvester = require('../vendor/sylvester.src');

var demo = {
    defaults: {
        threedee: true,
        stats: true
    },
    runner: null,

    shaderProgram: null,
    vertexPositionAttribute: null,
    textureCoordAttribute: null,
    vertexColorAttribute: null,
    vertexNormalAttribute: null,

    cubeVerticesBuffer: null,
    cubeVerticesIndexBuffer: null,
    cubeVerticesColorBuffer: null,
    cubeVerticesNormalBuffer: null,

    cubeVerticesTextureCoordBuffer: null,
    cubeTexture: null,
    cubeImage: null,

    perspectiveMatrix: null,
    vMatrix: null,
    mvMatrixStack: [],


    cubes: [],

    initialize: function(runner, config) {
        this.runner = runner;

        this.cubes.push(new Cube(runner.front, [-2.0, 2.0, 0.0], [1.0, 1.0, 0.0]));
        this.cubes.push(new Cube(runner.front, [-2.0, -2.0, 0.0], [-1.0, 0.0, 0.0]));
        this.cubes.push(new Cube(runner.front, [2.0, -2.0, 0.0], [0.0, -1.0, 0.0]));
        this.cubes.push(new Cube(runner.front, [2.0, 2.0, 0.0], [0.0, -1.0, 0.0]));

        this.cubes.push(new Cube(runner.front, [0.0, 0.0, 0.0], [1.0, 1.0, 1.0]));


        this.setupShaders(runner.front);

        runner.start();
    },
    update: function(dt) {

        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].update(dt);
        }
    },
    draw: function(gl) {
        // Establish the perspective with which we want to view the
        // scene. Our field of view is 45 degrees, with a width/height
        // ratio of this.runner.width:this.runner.height, and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        this.perspectiveMatrix = glutils.makePerspective(45, this.runner.width / this.runner.height, 0.1, 100.0);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        //this.loadIdentity();

        // Now move the drawing position a bit to where we want to start
        // drawing the cube.
        //this.mvTranslate([-0.0, 0.0, -6.0]);

        this.vMatrix = sylvester.Matrix.Translation(sylvester.$V([0.0, 0.0, 12.0])).ensure4x4(); //Matrix.I(4);

        // Save the current matrix, then rotate before we draw.
        //this.mvPushMatrix();

        //this.mvRotate(this.cubeRotation, [1, 0, 1]);


//this.mvTranslate([this.cubeXOffset, this.cubeYOffset, this.cubeZOffset]);

        // Draw the cube by binding the array buffer to the cube's vertices
        // array, setting attributes, and pushing it to GL.

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubes[0].verticesBuffer);
        gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubes[0].verticesNormalsBuffer);
        gl.vertexAttribPointer(this.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        //var normalMatrix = this.mvMatrix.inverse();
        //normalMatrix = normalMatrix.transpose();
        var nUniform = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
        //gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
        gl.uniformMatrix4fv(nUniform, false, new Float32Array(sylvester.Matrix.I(4).flatten()));

        // Set the colors attribute for the vertices.
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        //gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        // Set the texture coordinates attribute for the vertices.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubes[0].textureCoordinatesBuffer);
        gl.vertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.cubes[0].texture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);

        // Draw the cube.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubes[0].verticesIndicesBuffer);

        var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

        var vUniform = gl.getUniformLocation(this.shaderProgram, "uVMatrix");
        gl.uniformMatrix4fv(vUniform, false, new Float32Array(this.vMatrix.inverse().flatten()));


        for (var i = 0; i < this.cubes.length; i++) {
            var mUniform = gl.getUniformLocation(this.shaderProgram, "uMMatrix");
            gl.uniformMatrix4fv(mUniform, false, new Float32Array(this.cubes[i].modelMatrix.flatten()));

            var uPulsatingColor = gl.getUniformLocation(this.shaderProgram, "uPulsatingColor");
            gl.uniform3f(uPulsatingColor, this.cubes[i].pulsatingColor.x, this.cubes[i].pulsatingColor.y, this.cubes[i].pulsatingColor.z);

            this.cubes[i].render(gl);
        }
    },

    useColors: function(gl) {
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
    },

    setupShaders: function(gl) {
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

        //this.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(this.vertexColorAttribute);

        this.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(this.textureCoordAttribute);
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
    }
}

module.exports = demo;