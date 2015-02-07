/*global define*/
'use strict';

define([
  'pubsub', 'three', 'underscore',
  'point', 'grid'
], function(
  PubSub, THREE, _,
  Point, Grid
) {
  var events = {
    LOAD: 'lattice.load'
  };

  var defaultParameters = {
    repeatX: 1, repeatY: 1, repeatZ: 1,
    scaleX: 1, scaleY: 1, scaleZ: 1,
    alpha: 90, beta: 90, gamma: 90
  };

  var shearing = [
    'alpha', 'beta', 'gamma'
  ];

  var reverseShearing = shearing.slice(0).reverse();

  var scaling = [
    'scaleX', 'scaleY', 'scaleZ'
  ];

  var reverseScaling = scaling.slice(0).reverse();

  function Lattice() {
    this.lattice = null;
    this.points = {};
    this.grids = [];
    this.parameters = defaultParameters;
  }

  Lattice.prototype.destroyPoints = function() {
    var _this = this;

    _.each(this.points, function(point, reference) {
      point.destroy();
      delete _this.points[reference];
    });
  };

  /* TODO replication */
  Lattice.prototype.updateGrid = function() {
    var grid = this.lattice.grid;

    if (_.isUndefined(grid)) {
      return;
    }

    var origin;
    var destination;
    var _this = this;

    _.each(grid, function(destinationReferences, originReference) {
      origin = _this.points['r_' + originReference];
      _.each(destinationReferences, function(destinationReference) {
        destination = _this.points['r_' + destinationReference];
        _this.grids.push(new Grid(origin, destination));
      });
    });
  };

  Lattice.prototype.updatePoints = function() {
    var lattice = this.lattice;

    this.destroyPoints();

    if (_.isEmpty(lattice)) {
      return;
    }

    var parameters = this.parameters;
    var origin = lattice.originArray[0];
    var vector = lattice.vector;

    var limit = new THREE.Vector3(
      parameters.repeatX * vector.x + origin.x,
      parameters.repeatY * vector.y + origin.y,
      parameters.repeatZ * vector.z + origin.z
    );

    var index;
    var originLength = lattice.originArray.length;
    var position;
    var reference;
    var _this = this;

    _.times(parameters.repeatX + 1, function(_x) {
      _.times(parameters.repeatY + 1, function(_y) {
        _.times(parameters.repeatZ + 1, function(_z) {

          for (index = 0; index < originLength; index++) {
            origin = lattice.originArray[index];
            position = new THREE.Vector3(
              _x * vector.x + origin.x,
              _y * vector.y + origin.y,
              _z * vector.z + origin.z
            );
            if (position.x <= limit.x &&
                position.y <= limit.y &&
                position.z <= limit.z) {
              reference = 'r_' + _x + '_' + _y + '_' + _z + '_' + index;
              if (_.isUndefined(_this.points[reference])) {
                _this.points[reference] = new Point(position, index);
              }
            }
          }

        }); // repeat X
      }); // repeat Y
    }); // repeat Z
  };

  Lattice.prototype.load = function(latticeName) {
    if (_.isEmpty(latticeName)) {
      this.lattice = null;
      this.destroyPoints();
      PubSub.publish(events.LOAD, null);
      return;
    }

    var _this = this;

    require(['lattice/' + latticeName], function(lattice) {
      _this.lattice = lattice;
      _this.update();
      PubSub.publish(events.LOAD, lattice);
    });
  };

  var transformationMatrix = function(parameter) {
    var ab = Math.tan((90 - (parameter.gamma || 90)) * Math.PI / 180);
    var ac = Math.tan((90 - (parameter.beta || 90)) * Math.PI / 180);
    var xy = 0;
    var zy = 0;
    var xz = 0;
    var bc = Math.tan((90 - (parameter.alpha || 90)) * Math.PI / 180);
    var sa = parameter.scaleX || 1;
    var sb = parameter.scaleY || 1;
    var sc = parameter.scaleZ || 1;

    return new THREE.Matrix4(
      sa, ab, ac,  0,
      xy, sb, zy,  0,
      xz, bc, sc,  0,
       0,  0,  0,  1
    );
  };

  Lattice.prototype.transform = function(parameterKeys, operation) {
    var matrix;
    var argument;
    var points = this.points;
    var parameters = this.parameters;

    _.each(parameterKeys, function(k) {
      if (_.isUndefined(parameters[k]) === false) {
        argument = {};
        argument[k] = operation(parameters[k]);
        matrix = transformationMatrix(argument);

        /*jshint unused:false*/
        _.each(points, function(point, reference) {
          point.object3d.position.applyMatrix4(matrix);
        });
      }
    });
  };

  Lattice.prototype.revertShearing = function() {
    this.transform(reverseShearing, function(value) {
      return -value;
    });
  };

  Lattice.prototype.revertScaling = function() {
    this.transform(reverseScaling, function(value) {
      return (value === 0 ? 0 : 1 / value);
    });
  };

  var calculateDelta = function(original, update) {
    var delta = {};
    if (_.isObject(update)) {
      _.each(update, function(value, k) {
        if (_.isUndefined(original[k]) === false && value !== original[k]) {
          delta[k] = value;
        }
      });
    }
    return delta;
  };

  Lattice.prototype.backwardTransformations = function() {
    this.revertShearing();
    this.revertScaling();
  };

  Lattice.prototype.forwardTransformations = function() {
    this.transform(_.union(scaling, shearing), function(value) {
      return value;
    });
  };

  Lattice.prototype.update = function() {
    this.backwardTransformations();
    this.updatePoints();
    this.updateGrid();
    this.forwardTransformations();
  };

  Lattice.prototype.setParameters = function(latticeParameters) {
      var delta = calculateDelta(this.parameters, latticeParameters);
      var deltaKeys = _.keys(delta);

      this.backwardTransformations();

      _.extend(this.parameters, delta);

      if (_.indexOf(deltaKeys, 'repeatX') ||
          _.indexOf(deltaKeys, 'repeatY') ||
          _.indexOf(deltaKeys, 'repeatZ')) {
        this.updatePoints();
        this.updateGrid();
      }

      this.forwardTransformations();
  };

  Lattice.prototype.onLoad = function(callback) {
    PubSub.subscribe(events.LOAD, callback);
  };

  return Lattice;
});
