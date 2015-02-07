 /*unused:false*/
'use strict';

require.config({
  baseUrl: 'scripts',
  paths: {
    'pubsub': '../vendor/pubsub',
    'three': '../vendor/three',
    'threejs-controls/OrbitControls': '../vendor/threejs-controls/OrbitControls',
    'underscore': '../vendor/underscore',
    'jquery': '../vendor/jquery'
  },
  shim: {
    'three': { exports: 'THREE' },
    'threejs-controls/OrbitControls': { deps: [ 'three' ] }
  }
});

require([
  'pubsub', 'underscore', 'three',
  'explorer', 'camera', 'renderer', 'orbit',
  'menu', 'lattice'
], function(
  PubSub, _, THREE,
  Explorer, Camera, Renderer, Orbit,
  Menu, Lattice
) {
  var explorer = Explorer.getInstance();
  var explorerCamera = new Camera();
  var explorerRenderer = new Renderer(explorer, explorerCamera, 'explorer');

  explorerCamera.setPosition(new THREE.Vector3(5, 5, 5));
  explorerRenderer.startAnimation();

  /*jshint unused:false*/
  var orbit = new Orbit(explorerCamera);
  explorerRenderer.onAnimationUpdate(orbit.update.bind(orbit));

  var menu = new Menu();
  var lattice = new Lattice();

  menu.onLatticeChange(function(message, latticeName) {
    lattice.load(latticeName);
  });

  menu.onLatticeParameterChange(function(message, latticeParameters) {
    lattice.setParameters(latticeParameters);
  });

  lattice.onLoad(function(message, lattice) {
    if (_.isObject(lattice)) {
      menu.setLatticeParameters(lattice.defaults);
      menu.setLatticeRestrictions(lattice.restrictions);
    }
  });

});
