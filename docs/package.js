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
      "content": "Transducers\n===========\n\nExploring transducers.\n\nApplying https://www.youtube.com/watch?v=4KqUvG8HPYo to http://www.danielx.net/stream/docs/\n\ntap\n---\n\nTurn an array into a \"stream\"\n\n    tap = (items) ->\n      (output) ->\n        items.forEach output\n\nMap\n---\n\n    map = (f) ->\n      (output) ->\n        (input) ->\n          output f input\n\n>     #! demo\n>     # Square 10 numbers\n>     tap([0..9]) map((x) -> x * x) STDOUT\n\n---\n\nPartition\n---------\n\nDivide a stream into two streams, one for which the predicate is true, and one\nfor which the predicate is false.\n\n    partition = (predicate) ->\n      (left, right) ->\n        (input) ->\n          if predicate(input)\n            left input\n          else\n            right input\n\nFilter\n------\n\n    filter = (predicate) ->\n      (output) ->\n        partition(predicate)(output, NULL)\n\n>     #! demo\n>     # Filter evens\n>     tap([0..9]) filter((x) -> x % 2 is 0) STDOUT\n\n---\n\n    integrate = (output) ->\n      total = 0\n      (input) ->\n        total += input\n        output total\n\n>     #! demo\n>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach integrate integrate STDOUT\n\n    differentiate = (output) ->\n      last = 0\n      (input) ->\n        output input - last\n        last = input\n\n>     #! demo\n>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach differentiate STDOUT\n\n\n---\n\n    STDOUT = (result, input) ->\n      console.log input\n\n    NULL = (result, input) ->\n\nExpose\n------\n\n    module.exports = Transducer =\n      differentiate: differentiate\n      filter: filter\n      integrate: integrate\n      map: map\n      tap: tap\n      pollute: ->\n        Object.keys(Transducer).forEach (name) ->\n          return if name is \"pollute\"\n\n          global[name] = Transducer[name]\n\n\nSet Up Live Demos\n-------------\n\n>     #! setup\n>     require(\"/interactive\")\n",
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
      "content": "(function() {\n  var NULL, STDOUT, Transducer, differentiate, filter, integrate, map, partition, tap;\n\n  tap = function(items) {\n    return function(output) {\n      return items.forEach(output);\n    };\n  };\n\n  map = function(f) {\n    return function(output) {\n      return function(input) {\n        return output(f(input));\n      };\n    };\n  };\n\n  partition = function(predicate) {\n    return function(left, right) {\n      return function(input) {\n        if (predicate(input)) {\n          return left(input);\n        } else {\n          return right(input);\n        }\n      };\n    };\n  };\n\n  filter = function(predicate) {\n    return function(output) {\n      return partition(predicate)(output, NULL);\n    };\n  };\n\n  integrate = function(output) {\n    var total;\n    total = 0;\n    return function(input) {\n      total += input;\n      return output(total);\n    };\n  };\n\n  differentiate = function(output) {\n    var last;\n    last = 0;\n    return function(input) {\n      output(input - last);\n      return last = input;\n    };\n  };\n\n  STDOUT = function(result, input) {\n    return console.log(input);\n  };\n\n  NULL = function(result, input) {};\n\n  module.exports = Transducer = {\n    differentiate: differentiate,\n    filter: filter,\n    integrate: integrate,\n    map: map,\n    tap: tap,\n    pollute: function() {\n      return Object.keys(Transducer).forEach(function(name) {\n        if (name === \"pollute\") {\n          return;\n        }\n        return global[name] = Transducer[name];\n      });\n    }\n  };\n\n}).call(this);\n",
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