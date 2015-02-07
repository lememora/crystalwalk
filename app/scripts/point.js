'use strict';

define([
  'three',
  'explorer'
], function(
  THREE,
  Explorer
) {

  function Point(position, index) {
    var radius = ((index || 0) === 0) ? 0.1 : 0.075;
    var geometry = new THREE.SphereGeometry(radius);

    this.index = index || 0;

    // primary or secondary colors
    var color = (this.index === 0) ? 0xffffff : 0xcccccc;

    // origin
    if (position.x === 0 &&
        position.y === 0 &&
        position.z === 0) {
      color = 0xff00ff;
    }

    var material = new THREE.MeshBasicMaterial({ color: color });
    var sphere = new THREE.Mesh(geometry, material);

    this.object3d = sphere;
    this.object3d.position.fromArray(position.toArray());

    Explorer.add(this);
  }

  Point.prototype.destroy = function() {
    Explorer.remove(this);
  };

  return Point;
});
