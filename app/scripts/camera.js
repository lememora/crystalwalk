/*jslint browser: true*/
/*global define*/
'use strict';

define([
  'three',
  'underscore',
  'jquery'
], function(
  THREE,
  _,
  jQuery
) {
  var projections = {
    ORTHOGRAPHIC: 'orthographic',
    PERSPECTIVE: 'perspective'
  };

  function Camera(options) {
    var width = jQuery('#app-container').width();
    var height = jQuery(window).height();

    options = options || {};
    var fov = options.fov || 75;
    var projection = options.projection || projections.ORTHOGRAPHIC;
    var near = 0.1;
    var far = 1000;

    this.cameras = {};

    var aspect = options.aspect || (width / height);
    this.cameras[projections.PERSPECTIVE] = new THREE.PerspectiveCamera(fov, aspect, near, far);

    var left = width / -100;
    var right = -left;
    var _top = height / 100;
    var bottom = -_top;
    this.cameras[projections.ORTHOGRAPHIC] = new THREE.OrthographicCamera(left, right, _top, bottom, near, far);

    this.setProjection(projection);
  }

  Camera.prototype.setPosition = function(position) {
    _.each(this.cameras, function(camera) {
      camera.position.fromArray(position.toArray());
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    });
  };

  Camera.prototype.setProjection = function(projection) {
    this.object3d = this.cameras[projection];
  };

  Camera.prototype.setProjectionAsOrthographic = function() {
    this.setProjection(projections.ORTHOGRAPHIC);
  };

  Camera.prototype.setProjectionAsPerspective = function() {
    this.setProjection(projections.PERSPECTIVE);
  };

  return Camera;
});
