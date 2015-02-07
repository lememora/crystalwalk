 /*jshint unused:false*/
'use strict';

define([
  'three',
  'jquery',
  'threejs-controls/OrbitControls' // no AMD module
], function(
  THREE,
  jQuery
) {
  var $appRendererContainer = jQuery('#app-renderer-container');

  function Orbit(camera) {
    this.control = new THREE.OrbitControls(camera.object3d, $appRendererContainer[0]);
  }

  Orbit.prototype.update = function() {
    this.control.update();
  };

  return Orbit;
});
