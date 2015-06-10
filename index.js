/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-devtools',

  isEnabled: function isEnabled() {
    var addonConfig = this.app.project.config(this.app.env)['ember-devtools'];
    return addonConfig.enabled;
  },
};
