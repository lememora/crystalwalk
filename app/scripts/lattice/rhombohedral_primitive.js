'use strict';

define(function() {
  return {
    originArray: [
      { x: 0, y: 0, z: 0 }
    ],
    vector: { x: 1, y: 1, z: 1 },
    defaults: {
      'alpha': 60,
      'beta':  60,
      'gamma': 60
    },
    restrictions: {
      'gamma': {
        '90': '≠'
      },
      'beta': {
        'gamma': '='
      },
      'alpha': {
        'gamma': '='
      }
    }
  };
});
