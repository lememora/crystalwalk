'use strict';

define(function() {
  return {
    originArray: [
      { x: 0, y: 0, z: 0 }
    ],
    vector: { x: 1, y: 1, z: 1 },
    defaults: {
      'scaleX': 1.0,
      'scaleY': 1.0,
      'scaleZ': 1.5
    },
    restrictions: {
      'scaleY': {
        'scaleX': '='
      },
      'scaleZ': {
        'scaleX': '≠'
      },
      'scaleX': {
        'scaleZ': '≠'
      }
    }
  };
});
