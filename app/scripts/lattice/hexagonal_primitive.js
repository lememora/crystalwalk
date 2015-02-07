'use strict';

define(function() {
  return {
    originArray: [
      { x: 0, y: 0, z: 0 }
    ],
    vector: { x: 1, y: 1, z: 1 },
    defaults: {
      'scaleX': 1.5,
      'scaleY': 1.5,
      'scaleZ': 1.0,
      'gamma': 120
    },
    restrictions: {
      'alpha': {
        'alpha': '='
      },
      'beta': {
        'beta': '='
      },
      'gamma': {
        'gamma': '='
      }
    }
  };
});
