/* jshint node: true */
var path = require('path');
var pickFiles = require('broccoli-static-compiler');

var EmberAddon = function() {
  var tree = 'node_modules/ember-devtools/lib';
  tree = unwatchedTree(tree);
  this.tree = pickFiles(tree, {
    srcDir: '.',
    destDir: 'ember-devtools'
  });
};

EmberAddon.prototype.treeFor = function treeFor(type) {
  if (type == 'vendor') {
    return this.tree;
  }
};

EmberAddon.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/ember-devtools/ember-devtools.js');
};

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

module.exports = EmberAddon;
