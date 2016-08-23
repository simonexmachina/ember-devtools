/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-devtools',
  isEnabled: function() {
    var options = (this.app && this.app.options && this.app.options['ember-devtools']) || {}
    return options.enabled;
  }
};
