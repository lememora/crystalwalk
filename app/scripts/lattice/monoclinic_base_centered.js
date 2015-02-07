'use strict';

define(function() {
  return {
    originArray: [
      { x: 0,   y: 0,   z: 0   },
      { x: 0.5, y: 0.5, z: 0   }
    ],
    vector: { x: 1, y: 1, z: 1 },
    defaults: {
      'alpha': 90,
      'beta': 120,
      'gamma': 90
    },
    restrictions: {
      'beta': {
        '90': '≠'
      },
      'alpha': {
        'alpha': '='
      },
      'gamma': {
        'gamma': '='
      }
    }
  };
});
