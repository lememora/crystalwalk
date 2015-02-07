'use strict';

define([
  'three',
  'explorer'
], function(
  THREE,
  Explorer
) {

  function Grid(pointA, pointB) {
    var path = new THREE.SplineCurve3([
      pointA.object3d.position,
      pointB.object3d.position
    ]);

    var geometry = new THREE.TubeGeometry(path, 1, 0.01, 8);
    var material = new THREE.MeshNormalMaterial();

    var grid = new THREE.Mesh(geometry, material);
    this.object3d = grid;

    Explorer.add(this);
  }

  Grid.prototype.destroy = function() {
    Explorer.remove(this);
  };

  return Grid;
});
