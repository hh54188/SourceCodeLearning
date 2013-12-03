(function(root, factory) {
  // facetory是一个函数，函数形式的参数
  // Set up Backbone appropriately for the environment. Start with AMD.
  // 兼容requirejs？从什么时候开始的？原来不是不兼容吗？
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  // Node.js
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch(e) {};
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }
  // 从上面的依赖可以看出，对underscore和jQuery（或者Zepto/ender）的依赖是必须的，
  // Backbone没有对这些类库的缺失做容错处理，如果你没有引用，或者引入的相应版本没有所需的
  // 函数功能， 则直接报错

}(this, function(root, Backbone, _, $) {
  /* 
    为什么这里用的是this，而不是直接是windows？
    因为Backbone不一定会以全局变量Backbone的形式调用
    var target = {};
    target.bindBackbone = function () {
        (function (root) {
            root.Backbone = {
              //TODO
            };
        })(this);
        console.log(target);
    };

    target.bindBackbone();
    var Person = target.bindBackbone.Model.extend({});
};

  */
}));

