// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Copyright 2011-2013 Tilde Inc. and contributors
//            Portions Copyright 2006-2011 Strobe Inc.
//            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license
//            See https://raw.github.com/emberjs/ember.js/master/LICENSE
// ==========================================================================


 // Version: 1.2.0

(function() {
/*global __fail__*/

/**
Ember Debug

@module ember
@submodule ember-debug
*/

/**
@class Ember
*/

if ('undefined' === typeof Ember) {
  Ember = {};

  if ('undefined' !== typeof window) {
    window.Em = window.Ember = Em = Ember;
  }
}

Ember.ENV = 'undefined' === typeof ENV ? {} : ENV;

if (!('MANDATORY_SETTER' in Ember.ENV)) {
  // 如果环境变量中不存在MANDATORY_SETTER，则默认为true
  // 强制启动debug？
  Ember.ENV.MANDATORY_SETTER = true; // default to true for debug dist
}

/**
  Define an assertion that will throw an exception if the condition is not
  met. Ember build tools will remove any calls to `Ember.assert()` when
  doing a production build. Example:

  ```javascript
  // Test for truthiness
  Ember.assert('Must pass a valid object', obj);
  // Fail unconditionally
  Ember.assert('This code path should never be run')
  ```

  @method assert
  @param {String} desc A description of the assertion. This will become
    the text of the Error thrown if the assertion fails.
  @param {Boolean} test Must be truthy for the assertion to pass. If
    falsy, an exception will be thrown.
*/
Ember.assert = function(desc, test) {
  if (!test) {
    // 为什么不直接使用assert?
    Ember.Logger.assert(test, desc);
  }

  // testing:
  // 是否安装了Chrome浏览器Ember调试插件
  if (Ember.testing && !test) {
    // when testing, ensure test failures when assertions fail
    throw new Ember.Error("Assertion Failed: " + desc);
  }
};


/**
  Display a warning with the provided message. Ember build tools will
  remove any calls to `Ember.warn()` when doing a production build.

  @method warn
  @param {String} message A warning to display.
  @param {Boolean} test An optional boolean. If falsy, the warning
    will be displayed.
*/
Ember.warn = function(message, test) {
  if (!test) {
    Ember.Logger.warn("WARNING: "+message);
    if ('trace' in Ember.Logger) Ember.Logger.trace();
  }
};

/**
  Display a debug notice. Ember build tools will remove any calls to
  `Ember.debug()` when doing a production build.

  ```javascript
  Ember.debug("I'm a debug notice!");
  ```

  @method debug
  @param {String} message A debug message to display.
*/
Ember.debug = function(message) {
  Ember.Logger.debug("DEBUG: "+message);
};

/**
  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only). Ember build tools will remove any calls to
  `Ember.deprecate()` when doing a production build.

  @method deprecate
  @param {String} message A description of the deprecation.
  @param {Boolean} test An optional boolean. If falsy, the deprecation
    will be displayed.
*/
Ember.deprecate = function(message, test) {
  if (Ember.TESTING_DEPRECATION) { return; }

  if (arguments.length === 1) { test = false; }
  if (test) { return; }

  if (Ember.ENV.RAISE_ON_DEPRECATION) { throw new Ember.Error(message); }

  var error;

  // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
  // __fail__从哪里来的？/*global __fail__*/ 我在windows全局变量中找不到它？
  try { __fail__.fail(); } catch (e) { error = e; }

  if (Ember.LOG_STACKTRACE_ON_DEPRECATION && error.stack) {
    var stack, stackStr = '';
    // 根据是否有arguments来判断是火狐还是chrome？
    if (error['arguments']) {
      // Chrome
      // 抛出的异常中都用存储了错误的追踪信息
      /*
          想看错误的栈信息？
          var obj = {}; 
          try {
              obj.hello.world
          } catch(e) {
              console.log(e["arguments"])
              console.log(e.stack)
          }
          TypeError: Cannot read property 'world' of undefined
              at <anonymous>:4:14
              at Object.InjectedScript._evaluateOn (<anonymous>:581:39)
              at Object.InjectedScript._evaluateAndWrap (<anonymous>:540:52)
              at Object.InjectedScript.evaluate (<anonymous>:459:21)           
      */
      stack = error.stack.replace(/^\s+at\s+/gm, '').
                          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
                          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
      stack.shift();
    } else {
      // Firefox
      stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
                          replace(/^\(/gm, '{anonymous}(').split('\n');
    }

    stackStr = "\n    " + stack.slice(2).join("\n    ");
    message = message + stackStr;
  }

  Ember.Logger.warn("DEPRECATION: "+message);
};



/**
  Alias an old, deprecated method with its new counterpart.

  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only) when the assigned method is called.

  Ember build tools will not remove calls to `Ember.deprecateFunc()`, though
  no warnings will be shown in production.

  ```javascript
  Ember.oldMethod = Ember.deprecateFunc("Please use the new, updated method", Ember.newMethod);
  ```

  @method deprecateFunc
  @param {String} message A description of the deprecation.
  @param {Function} func The new function called to replace its deprecated counterpart.
  @return {Function} a new function that wrapped the original function with a deprecation warning
*/
Ember.deprecateFunc = function(message, func) {
  return function() {
    Ember.deprecate(message);
    return func.apply(this, arguments);
  };
};


// Inform the developer about the Ember Inspector if not installed.
if (!Ember.testing) {
  if (typeof window !== 'undefined' && window.chrome && window.addEventListener) {
    window.addEventListener("load", function() {
      if (document.body && document.body.dataset && !document.body.dataset.emberExtension) {
        Ember.debug('For more advanced debugging, install the Ember Inspector from https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi');
      }
    }, false);
  }
}

})();