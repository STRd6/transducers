(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "transducers\n===========\n\nExploring CoffeeScript transducers inspired by https://www.youtube.com/watch?v=4KqUvG8HPYo\n",
      "mode": "100644",
      "type": "blob"
    },
    "interactive.coffee.md": {
      "path": "interactive.coffee.md",
      "content": "Interactive Runtime\n-------------------\n\nRegister our interactive documentation runtime components.\n\nThese requires set up our interactive documentation environment.\n\n    require(\"./main\").pollute()\n\nHelpers\n-------\n\nEvaluate a program with a given environment object.\n\nThe values of the environment are mapped to local variables with names equal to\nthe keys.\n\nThe given program is then run with that environment and optionally a context for\n`this`.\n\n    executeWithContext = (program, environment, context) ->\n      args = Object.keys(environment)\n\n      values = args.map (name) ->\n        environment[name]\n\n      Function(args..., program).apply(context, values)\n\nDemo Runtimes\n-------------\n\n`demo` examples provide the pipe functions and dislpay all atoms received into\n`STDOUT` on the righthand side.\n\n    Interactive.register \"demo\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source)\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      STDOUT = (input) ->\n        outputElement.textContent += \"#{input}\\n\"\n\n      executeWithContext program,\n        STDOUT: STDOUT\n        NULL: ->\n\n    Interactive.register \"test\", ({source, runtimeElement}) ->\n      runtimeElement.append \"test\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Transducers\n===========\n\nExploring transducers.\n\nApplying https://www.youtube.com/watch?v=4KqUvG8HPYo to http://www.danielx.net/stream/docs/\n\ntap\n---\n\nTurn an array into a \"stream\"\n\n    tap = (items) ->\n      (output) ->\n        items.forEach output\n\nSource\n------\n\n    source = (f) ->\n      (input) ->\n        (output) ->\n          output f input\n\nMap\n---\n\n    map = (f) ->\n      (output) ->\n        (input) ->\n          output f input\n\n>     #! demo\n>     # Square 10 numbers\n>     tap([0..9]) map((x) -> x * x) STDOUT\n\n---\n\nattr\n----\n\n    attr = (name) ->\n      map (x) ->\n        x[name]\n\nCat\n---\n\nExpand arrays into single items.\n\n    each = (output) ->\n      (input) ->\n        [].concat(input).forEach output\n\nPartition\n---------\n\nDivide a stream into two streams, one for which the predicate is true, and one\nfor which the predicate is false.\n\n    partition = (predicate) ->\n      (left, right) ->\n        (input) ->\n          if predicate(input)\n            left input\n          else\n            right input\n\nAlternate\n---------\n\nSpread a stream among two sinks evenly.\n\n    alternate = (left, right) ->\n      leftSide = false\n      predicate = ->\n        leftSide = !leftSide\n\n      partition(predicate)(left, right)\n\n>     #! demo\n>     # Alternate streams\n>     [0..9].forEach alternate(\n>       map((x) -> -x) STDOUT\n>       STDOUT\n>     )\n\n\nFilter\n------\n\n    filter = (predicate) ->\n      (output) ->\n        partition(predicate)(output, NULL)\n\n>     #! demo\n>     # Filter evens\n>     tap([0..9]) filter((x) -> x % 2 is 0) STDOUT\n\n---\n\n    integrate = (output) ->\n      total = 0\n      (input) ->\n        total += input\n        output total\n\n>     #! demo\n>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach integrate integrate STDOUT\n\n    differentiate = (output) ->\n      last = 0\n      (input) ->\n        output input - last\n        last = input\n\n>     #! demo\n>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach differentiate STDOUT\n\n\n---\n\n    STDOUT = (input) ->\n      console.log input\n\n    NULL = (input) ->\n\nDoneness?\n---------\n\nWe'll want some way to indicate a stream is \"done\".\n\nSay we reach out to a service and process a bunch of records, and then we're\ndone. We'll need to notify the remaining transformers and they'll need to\npropagate a done state.\n\nAlso it would be nice if we could cancel from the bottom and propagate that back\nup the chain.\n\nThe simpler building blocks needn't need to know about this mechanic at all\nand should be able to be transparently wrapped.\n\n>     #! demo\n>     # No need to explicitly say \"done\", the data goes to STDOUT once it's fetched\n>     $.getJSON(\"https://api.github.com/users/distri/repos\").then each attr(\"full_name\") STDOUT\n\n    times = (output) ->\n      (input) ->\n        [0..input].forEach output\n\n    rand = (n) ->\n      (output) ->\n        output Math.floor Math.random() * n\n\n>     #! demo\n>     # A random source\n>     rand(10) times STDOUT\n\n    clock = (period) ->\n      (output) ->\n        count = 0\n        setInterval ->\n          output(count)\n          count += 1\n        , period * 1000\n\n>     #! demo\n>     # A clock is never \"done\"\n>     clock(1) STDOUT\n\n---\n\nSorting\n-------\n\nWe'll want to be able to apply a sorting function to a rendered stream \nconcurrently wtih its resolution or afterwards.\n\nModifying some elements\n-----------------------\n\nFor a spreadsheet or data display we want to be able to modify certain elements\nand keep track of their position and changed properties.\n\nExpose\n------\n\n    module.exports = Transducer =\n      alternate: alternate\n      attr: attr\n      clock: clock\n      each: each\n      differentiate: differentiate\n      filter: filter\n      integrate: integrate\n      map: map\n      rand: rand\n      tap: tap\n      times: times\n      pollute: ->\n        Object.keys(Transducer).forEach (name) ->\n          return if name is \"pollute\"\n\n          global[name] = Transducer[name]\n\n\nSet Up Live Demos\n-------------\n\n>     #! setup\n>     require(\"/interactive\")\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "interactive": {
      "path": "interactive",
      "content": "(function() {\n  var executeWithContext,\n    __slice = [].slice;\n\n  require(\"./main\").pollute();\n\n  executeWithContext = function(program, environment, context) {\n    var args, values;\n    args = Object.keys(environment);\n    values = args.map(function(name) {\n      return environment[name];\n    });\n    return Function.apply(null, __slice.call(args).concat([program])).apply(context, values);\n  };\n\n  Interactive.register(\"demo\", function(_arg) {\n    var STDOUT, outputElement, program, runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    program = CoffeeScript.compile(source);\n    outputElement = document.createElement(\"pre\");\n    runtimeElement.empty().append(outputElement);\n    STDOUT = function(input) {\n      return outputElement.textContent += \"\" + input + \"\\n\";\n    };\n    return executeWithContext(program, {\n      STDOUT: STDOUT,\n      NULL: function() {}\n    });\n  });\n\n  Interactive.register(\"test\", function(_arg) {\n    var runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    return runtimeElement.append(\"test\");\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var NULL, STDOUT, Transducer, alternate, attr, clock, differentiate, each, filter, integrate, map, partition, rand, source, tap, times;\n\n  tap = function(items) {\n    return function(output) {\n      return items.forEach(output);\n    };\n  };\n\n  source = function(f) {\n    return function(input) {\n      return function(output) {\n        return output(f(input));\n      };\n    };\n  };\n\n  map = function(f) {\n    return function(output) {\n      return function(input) {\n        return output(f(input));\n      };\n    };\n  };\n\n  attr = function(name) {\n    return map(function(x) {\n      return x[name];\n    });\n  };\n\n  each = function(output) {\n    return function(input) {\n      return [].concat(input).forEach(output);\n    };\n  };\n\n  partition = function(predicate) {\n    return function(left, right) {\n      return function(input) {\n        if (predicate(input)) {\n          return left(input);\n        } else {\n          return right(input);\n        }\n      };\n    };\n  };\n\n  alternate = function(left, right) {\n    var leftSide, predicate;\n    leftSide = false;\n    predicate = function() {\n      return leftSide = !leftSide;\n    };\n    return partition(predicate)(left, right);\n  };\n\n  filter = function(predicate) {\n    return function(output) {\n      return partition(predicate)(output, NULL);\n    };\n  };\n\n  integrate = function(output) {\n    var total;\n    total = 0;\n    return function(input) {\n      total += input;\n      return output(total);\n    };\n  };\n\n  differentiate = function(output) {\n    var last;\n    last = 0;\n    return function(input) {\n      output(input - last);\n      return last = input;\n    };\n  };\n\n  STDOUT = function(input) {\n    return console.log(input);\n  };\n\n  NULL = function(input) {};\n\n  times = function(output) {\n    return function(input) {\n      var _i, _results;\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= input ? _i <= input : _i >= input; 0 <= input ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(output);\n    };\n  };\n\n  rand = function(n) {\n    return function(output) {\n      return output(Math.floor(Math.random() * n));\n    };\n  };\n\n  clock = function(period) {\n    return function(output) {\n      var count;\n      count = 0;\n      return setInterval(function() {\n        output(count);\n        return count += 1;\n      }, period * 1000);\n    };\n  };\n\n  module.exports = Transducer = {\n    alternate: alternate,\n    attr: attr,\n    clock: clock,\n    each: each,\n    differentiate: differentiate,\n    filter: filter,\n    integrate: integrate,\n    map: map,\n    rand: rand,\n    tap: tap,\n    times: times,\n    pollute: function() {\n      return Object.keys(Transducer).forEach(function(name) {\n        if (name === \"pollute\") {\n          return;\n        }\n        return global[name] = Transducer[name];\n      });\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "inductor-labs/transducers",
    "homepage": null,
    "description": "Exploring CoffeeScript transducers inspired by https://www.youtube.com/watch?v=4KqUvG8HPYo",
    "html_url": "https://github.com/inductor-labs/transducers",
    "url": "https://api.github.com/repos/inductor-labs/transducers",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});