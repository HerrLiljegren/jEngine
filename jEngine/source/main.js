requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'source/main',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        vendor: '../vendor',
        glutils: '../vendor/glutils',
        sylvester: '../vendor/sylvester.src'
    },
    shim: {
        'glutils': {
            deps: ['sylvester']
        }
    }
});

// Start the main app logic.
requirejs(['module.configuration', 'module.utilities', 'game', 'module.demo1', 'webgl.demo1'],
    function(config, utils, game, demo1, demo1_3D) {
        //jQuery, canvas and the app/sub module are all
        //loaded and can be used here now.

        //game.start('canvas', demo1);
        game.start('canvas', demo1_3D);
    });