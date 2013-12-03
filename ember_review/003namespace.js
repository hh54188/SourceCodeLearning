//  - 354


/*globals Em:true ENV */

/**
@module ember
@submodule ember-metal
*/

/**
  All Ember methods and functions are defined inside of this namespace. You
  generally should not add new properties to this namespace as it may be
  overwritten by future versions of Ember.

  You can also use the shorthand `Em` instead of `Ember`.

  Ember-Runtime is a framework that provides core functions for Ember including
  cross-platform functions, support for property observing and objects. Its
  focus is on small size and performance. You can use this in place of or
  along-side other cross-platform libraries such as jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.

  @class Ember
  @static
  @version 1.2.0
*/

if ('undefined' === typeof Ember) {
  // Create core object. Make it act like an instance of Ember.Namespace so that
  // objects assigned to it are given a sane string representation.
  Ember = {};
}

// Default imports, exports and lookup to the global object;
var imports = Ember.imports = Ember.imports || this;
var exports = Ember.exports = Ember.exports || this;
var lookup  = Ember.lookup  = Ember.lookup  || this;

// aliases needed to keep minifiers from removing the global context
// 为什么要处理这么多种情况？
// Ember.exports.Em = Ember.exports.Ember = Em = Ember
exports.Em = exports.Ember = Em = Ember;

// Make sure these are set whether Ember was already defined or not
// 这一步是为什么？
Ember.isNamespace = true;

Ember.toString = function() { return "Ember"; };


/**
  @property VERSION
  @type String
  @default '1.2.0'
  @final
*/
Ember.VERSION = '1.2.0';

/**
  Standard environmental variables. You can define these in a global `ENV`
  variable before loading Ember to control various configuration
  settings.

  @property ENV
  @type Hash
*/
// 全局ENV与__failed__一致？
if ('undefined' === typeof ENV) {
  exports.ENV = {};
}

// We disable the RANGE API by default for performance reasons
// 为什么要禁用DISABLE_RANGE_API？
if ('undefined' === typeof ENV.DISABLE_RANGE_API) {
  ENV.DISABLE_RANGE_API = true;
}


Ember.ENV = Ember.ENV || ENV;

Ember.config = Ember.config || {};

/**
  Hash of enabled Canary features. Add to before creating your application.

  You can also define `ENV.FEATURES` if you need to enable features flagged at runtime.

  @property FEATURES
  @type Hash
*/

Ember.FEATURES = Ember.ENV.FEATURES || {};

/**
  Test that a feature is enabled. Parsed by Ember's build tools to leave
  experimental features out of beta/stable builds.

  You can define the following configuration options:

  * `ENV.ENABLE_ALL_FEATURES` - force all features to be enabled.
  * `ENV.ENABLE_OPTIONAL_FEATURES` - enable any features that have not been explicitly
    enabled/disabled.

  @method isEnabled
  @param {string} feature
*/

Ember.FEATURES.isEnabled = function(feature) {
  var featureValue = Ember.FEATURES[feature];

  if (Ember.ENV.ENABLE_ALL_FEATURES) {
    return true;
  } else if (featureValue === true || featureValue === false || featureValue === undefined) {
    return featureValue;
  } else if (Ember.ENV.ENABLE_OPTIONAL_FEATURES) {
    return true;
  } else {
    return false;
  }
};