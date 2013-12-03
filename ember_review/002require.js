(function() {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  /*
    define和requireModule都共用
    所有模块都在"注册"registry数组中
    registry = {
      "name": {
        deps: [name1, name2, name3],
        callback: fn
      }
    }
  */
  requireModule = function(name) {
    // seen是require过程中的缓存
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod, deps, callback, reified, exports;

    mod = registry[name];

    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    deps = mod.deps;
    callback = mod.callback;
    /*
      猜想define
      define("test", [nam1, name2, name3], function (dep1, dep2, dep3) {
  
      })
    */
    reified = [];

    // 每加载一个模块时，应该加载其依赖的相应模块
    // 并且执行依赖模块的定义函数(callback)
    for (var i=0, l=deps.length; i<l; i++) {
      // 为什么会出现一个exports的情况？
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();