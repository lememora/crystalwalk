/*global define*/
'use strict';

define([
  'jquery',
  'pubsub',
  'underscore'
], function(
  jQuery,
  PubSub,
  _
) {
  var events = {
    LATTICE_CHANGE: 'menu.lattice_change',
    LATTICE_PARAMETER_CHANGE: 'menu.lattice_parameter_change'
  };

  var $bravaisLattice = jQuery('#bravaisLattice');
  var $repeatX = jQuery('#repeatX');
  var $repeatY = jQuery('#repeatY');
  var $repeatZ = jQuery('#repeatZ');
  var $scaleX = jQuery('#scaleX');
  var $scaleY = jQuery('#scaleY');
  var $scaleZ = jQuery('#scaleZ');
  var $alpha = jQuery('#alpha');
  var $beta = jQuery('#beta');
  var $gamma = jQuery('#gamma');

  var latticeParameters = {
    'repeatX': $repeatX,
    'repeatY': $repeatY,
    'repeatZ': $repeatZ,
    'scaleX': $scaleX,
    'scaleY': $scaleY,
    'scaleZ': $scaleZ,
    'alpha': $alpha,
    'beta': $beta,
    'gamma': $gamma
  };

  function Menu() {
    $bravaisLattice.on('change', function() {
      return PubSub.publish(events.LATTICE_CHANGE, jQuery(this).val());
    });

    var _this = this;
    var argument;
    /*jshint unused:false*/
    _.each(latticeParameters, function($parameter, k) {
      $parameter.on('change', function() {
        argument = {};
        argument[k] = $parameter.val();
        PubSub.publish(events.LATTICE_PARAMETER_CHANGE, argument);
      });
    });

    this.restrictionEvents = [];
  }

  Menu.prototype.getLatticeParameters = function() {
    var parameters = {};
    _.each(latticeParameters, function($latticeParameter, k) {
      parameters[k] = $latticeParameter.val();
    });
    return parameters;
  };

  Menu.prototype.setLatticeParameters = function(parameters) {
    if (_.isObject(parameters) === false) {
      return;
    }
    /*jshint unused:false*/
    _.each(latticeParameters, function($latticeParameter, k) {
      if (_.isUndefined(parameters[k]) === false) {
        $latticeParameter.val(parameters[k]);
      }
    });
    PubSub.publish(events.LATTICE_PARAMETER_CHANGE, this.getLatticeParameters());
  };

  Menu.prototype.onLatticeChange = function(callback) {
    PubSub.subscribe(events.LATTICE_CHANGE, callback);
  };

  Menu.prototype.onLatticeParameterChange = function(callback) {
    PubSub.subscribe(events.LATTICE_PARAMETER_CHANGE, callback);
  };

  Menu.prototype.setLatticeRestrictions = function(restrictions) {
    var $body = jQuery('body');

    _.each(this.restrictionEvents, function(restriction) {
      $body.off('change', '#' + restriction.id, restriction.ev);
    });

    /*jshint unused:false*/
    _.each(latticeParameters, function($parameter, pk) {
      $parameter.removeAttr('disabled');
    });

    if (_.isObject(restrictions) === false) {
      return;
    }

    var left = {};
    var right = {};
    var id;
    var restrictionEvent;
    var _this = this;
    var rightValue;

    _.each(latticeParameters, function($parameter, pk) {
      if (_.isUndefined(restrictions[pk]) === false) {
        left[pk] = $parameter;
        _.each(restrictions[pk], function(operator, rk) {
          right[rk] = latticeParameters[rk];
          // sometimes right value may be bounded to a number instead of an input
          rightValue = _.isUndefined(right[rk]) ? parseFloat(rk) : null;

          if (operator === '=') {
            left[pk].attr('disabled', 'disabled');
            restrictionEvent = function() {
              left[pk].val(right[rk].val());
              left[pk].trigger('change');
            };
            id = right[rk].attr('id');
            _this.restrictionEvents.push({
              ev: restrictionEvent,
              id: id
            });
            $body.on('change', '#' + id, restrictionEvent);

          } else if (operator === '≠') {
            restrictionEvent = function() {
              rightValue = _.isUndefined(right[rk]) ? rightValue : right[rk].val();
              if (parseFloat(left[pk].val()) === rightValue) {
                left[pk].focus();
                left[pk].select();
              }
            };
            id = left[pk].attr('id');
            _this.restrictionEvents.push({
              ev: restrictionEvent,
              id: id
            });
            $body.on('change', '#' + id, restrictionEvent);
          }
        });
      }
    });

  };

  return Menu;
});
