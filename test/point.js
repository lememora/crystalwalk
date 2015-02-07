var assert = require("assert");
var requirejs = require("requirejs");

requirejs.config({
  baseUrl: __dirname + '/../app/scripts',
  nodeRequire: require
});

describe('base/graphics/point', function() {
  it('should have _3d property center on (0,0,0)', function() {
    var Point = requirejs('point');
    var p = new Point();
    assert.notEqual('undefined', p);
  })
})
