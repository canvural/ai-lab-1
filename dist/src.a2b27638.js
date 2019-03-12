// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"node_modules/@babel/runtime/helpers/defineProperty.js":[function(require,module,exports) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"src/Genetic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Genetic =
/*#__PURE__*/
function () {
  function Genetic() {
    (0, _classCallCheck2.default)(this, Genetic);
    (0, _defineProperty2.default)(this, "mutationSelectionFunctions", {
      // Roulette selection
      // Calculate sum of all fitness in population
      // Select random number between 0 and sum
      // Take the first population that has fitness bigger than the random value
      roulette: function roulette(pop) {
        var sum = 0;
        var n = pop.length;

        for (var i = 0; i < n; ++i) {
          sum += pop[i].fitness;
        }

        var r = Math.floor(Math.random() * Math.floor(sum));
        sum = 0;

        for (var _i = 0; _i < n; ++_i) {
          sum += pop[_i].fitness;

          if (sum > r) {
            return pop[_i].entity;
          }
        }

        return pop[Math.floor(Math.random() * pop.length)].entity;
      },
      // Return the fittest
      fittest: function fittest(pop) {
        return pop[0].entity;
      },
      // Return randomly selected entity
      random: function random(pop) {
        return pop[Math.floor(Math.random() * pop.length)].entity;
      },
      tournament2: function tournament2(pop) {
        var n = pop.length;
        var a = pop[Math.floor(Math.random() * n)];
        var b = pop[Math.floor(Math.random() * n)];
        return a.fitness < b.fitness ? a.entity : b.entity;
      }
    });
  }

  (0, _createClass2.default)(Genetic, null, [{
    key: "evaulatePoly",
    value: function evaulatePoly() {}
  }]);
  return Genetic;
}();

var _default = Genetic;
exports.default = _default;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"node_modules/@babel/runtime/helpers/defineProperty.js"}],"src/Graph.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Genetic = _interopRequireDefault(require("./Genetic.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Graph =
/*#__PURE__*/
function () {
  function Graph(canvas) {
    (0, _classCallCheck2.default)(this, Graph);
    this.grid_size = 50;
    this.x_axis_distance_grid_lines = 5;
    this.y_axis_distance_grid_lines = 5;
    this.x_axis_starting_point = {
      number: 1,
      suffix: ''
    };
    this.y_axis_starting_point = {
      number: 1,
      suffix: ''
    };
    this.width = parseInt(canvas.style.width, 10);
    this.height = parseInt(canvas.style.height, 10);
    this.num_lines_x = Math.floor(this.height / this.grid_size);
    this.num_lines_y = Math.floor(this.width / this.grid_size);
    this.canvas = document.getElementById('scratch');
    var xmax = this.num_lines_y - this.y_axis_distance_grid_lines;
    var ymax = this.y_axis_distance_grid_lines;
    this.xmax = xmax;
    this.ymax = ymax; // retina

    var dpr = window.devicePixelRatio || 1;
    canvas.width = this.width * dpr;
    canvas.height = this.height * dpr;
    this.ctx = canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
    this.bound = [0, this.width - 1, this.height - 1, 0];
    this.bound[0] += 25;
    this.bound[1] -= 25;
    this.bound[2] -= 25;
    this.bound[3] += 25;
    this.vertices = {
      positive: [],
      negative: []
    };
    this.solutions = [];
  }

  (0, _createClass2.default)(Graph, [{
    key: "drawFunction",
    value: function drawFunction(coefficients, strokeStyle, lineWidth) {
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      var xmax = this.xmax;
      var xstride = this.grid_size;
      var inc = 1 / xstride;
      ctx.beginPath();

      for (var x = -xmax; x < xmax; x += inc) {
        var cx = x * xstride + this.y_axis_distance_grid_lines * this.grid_size;
        var cy = _Genetic.default.evaluatePoly(coefficients, x) * this.grid_size * -1 + this.x_axis_distance_grid_lines * this.grid_size;

        if (x === -xmax) {
          ctx.moveTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      }

      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "draw",
    value: function draw() {
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#000';
      ctx.clearRect(0, 0, this.width, this.height); // Draw grid lines along X-axis

      for (var i = 0; i <= this.num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1; // If line represents X-axis draw in different color

        if (i === this.x_axis_distance_grid_lines) ctx.strokeStyle = '#000000';else ctx.strokeStyle = '#e9e9e9';

        if (i === this.num_lines_x) {
          ctx.moveTo(0, this.grid_size * i);
          ctx.lineTo(this.width, this.grid_size * i);
        } else {
          ctx.moveTo(0, this.grid_size * i + 0.5);
          ctx.lineTo(this.width, this.grid_size * i + 0.5);
        }

        ctx.stroke();
      } // Draw grid lines along Y-axis


      for (var _i = 0; _i <= this.num_lines_y; _i++) {
        ctx.beginPath();
        ctx.lineWidth = 1; // If line represents X-axis draw in different color

        if (_i === this.y_axis_distance_grid_lines) ctx.strokeStyle = '#000000';else ctx.strokeStyle = '#e9e9e9';

        if (_i === this.num_lines_y) {
          ctx.moveTo(this.grid_size * _i, 0);
          ctx.lineTo(this.grid_size * _i, this.height);
        } else {
          ctx.moveTo(this.grid_size * _i + 0.5, 0);
          ctx.lineTo(this.grid_size * _i + 0.5, this.height);
        }

        ctx.stroke();
      } // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual


      ctx.translate(this.y_axis_distance_grid_lines * this.grid_size, this.x_axis_distance_grid_lines * this.grid_size); // Ticks marks along the positive X-axis

      for (var _i2 = 1; _i2 < this.num_lines_y - this.y_axis_distance_grid_lines; _i2++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000'; // Draw a tick mark 6px long (-3 to 3)

        ctx.moveTo(this.grid_size * _i2 + 0.5, -3);
        ctx.lineTo(this.grid_size * _i2 + 0.5, 3);
        ctx.stroke(); // Text value at that point

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'start';
        ctx.fillText(this.x_axis_starting_point.number * _i2 + this.x_axis_starting_point.suffix, this.grid_size * _i2 - 2, 15);
      } // Ticks marks along the negative X-axis


      for (var _i3 = 1; _i3 < this.y_axis_distance_grid_lines; _i3++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000'; // Draw a tick mark 6px long (-3 to 3)

        ctx.moveTo(-this.grid_size * _i3 + 0.5, -3);
        ctx.lineTo(-this.grid_size * _i3 + 0.5, 3);
        ctx.stroke(); // Text value at that point

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'end';
        ctx.fillText(-this.x_axis_starting_point.number * _i3 + this.x_axis_starting_point.suffix, -this.grid_size * _i3 + 3, 15);
      } // Ticks marks along the positive Y-axis
      // Positive Y-axis of graph is negative Y-axis of the canvas


      for (var _i4 = 1; _i4 < this.num_lines_x - this.x_axis_distance_grid_lines; _i4++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000'; // Draw a tick mark 6px long (-3 to 3)

        ctx.moveTo(-3, this.grid_size * _i4 + 0.5);
        ctx.lineTo(3, this.grid_size * _i4 + 0.5);
        ctx.stroke(); // Text value at that point

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'start';
        ctx.fillText(-this.y_axis_starting_point.number * _i4 + this.y_axis_starting_point.suffix, 8, this.grid_size * _i4 + 3);
      } // Ticks marks along the negative Y-axis
      // Negative Y-axis of graph is positive Y-axis of the canvas


      for (var _i5 = 1; _i5 < this.x_axis_distance_grid_lines; _i5++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000'; // Draw a tick mark 6px long (-3 to 3)

        ctx.moveTo(-3, -this.grid_size * _i5 + 0.5);
        ctx.lineTo(3, -this.grid_size * _i5 + 0.5);
        ctx.stroke(); // Text value at that point

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'start';
        ctx.fillText(this.y_axis_starting_point.number * _i5 + this.y_axis_starting_point.suffix, 8, -this.grid_size * _i5 + 3);
      }

      ctx.restore();
    }
  }, {
    key: "drawVertices",
    value: function drawVertices() {
      var ctx = this.ctx; //ctx.save();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2; // positive vertices

      for (var i = 0; i < this.vertices.positive.length; ++i) {
        ctx.fillStyle = '#000';
        var cx = this.vertices.positive[i][0] * this.grid_size + this.y_axis_distance_grid_lines * this.grid_size;
        var cy = this.vertices.positive[i][1] * this.grid_size * -1 + this.x_axis_distance_grid_lines * this.grid_size;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } // negative vertices


      for (var _i6 = 0; _i6 < this.vertices.negative.length; ++_i6) {
        ctx.fillStyle = 'red';
        var cx = this.vertices.negative[_i6][0] * this.grid_size + this.y_axis_distance_grid_lines * this.grid_size;
        var cy = this.vertices.negative[_i6][1] * this.grid_size * -1 + this.x_axis_distance_grid_lines * this.grid_size;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }]);
  return Graph;
}();

var _default = Graph;
exports.default = _default;
},{"@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"node_modules/@babel/runtime/helpers/createClass.js","./Genetic.js":"src/Genetic.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _Graph = _interopRequireDefault(require("./Graph.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = new _Graph.default(document.getElementById('scratch'));
graph.draw();
},{"./Graph.js":"src/Graph.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42351" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map