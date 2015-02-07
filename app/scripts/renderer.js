/*jslint browser: true*/
/*global define*/
'use strict';

define([
  'three',
  'jquery',
  'pubsub'
], function(
  THREE,
  jQuery,
  PubSub
) {
  var events = {
    ANIMATION_UPDATE: 'renderer.animation_update'
  };

  function Renderer(scene, camera, name) {
    var width = jQuery('#app-container').width();
    var height = jQuery(window).height();
    var $appRendererContainer = jQuery('#app-renderer-container');

    this.scene = scene;
    this.camera = camera;
    this.name = name || 'default';
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);

    this.animationIsActive = false;

    $appRendererContainer.append(this.renderer.domElement);
  }

  Renderer.prototype.startAnimation = function() {
    if (this.animationIsActive === false) {
      this.animationIsActive = true;
      this.animate();
    }
  };

  Renderer.prototype.stopAnimation = function() {
    this.animationIsActive = false;
  };

  Renderer.prototype.animate = function() {
    if (this.animationIsActive === false) {
      return;
    }
    window.requestAnimationFrame(this.animate.bind(this));

    PubSub.publish(events.ANIMATION_UPDATE + '_' + this.name, true);

    this.renderer.render(
      this.scene.object3d,
      this.camera.object3d
    );
  };

  Renderer.prototype.onAnimationUpdate = function(callback) {
    PubSub.subscribe(events.ANIMATION_UPDATE + '_' + this.name, callback);
  };

  return Renderer;
});
