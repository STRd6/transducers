window["inductor-labs/transducers:master"]({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "transducers\n===========\n\nExploring CoffeeScript transducers inspired by https://www.youtube.com/watch?v=4KqUvG8HPYo\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Transducers\n===========\n\nExploring transducers.\n\nApplying https://www.youtube.com/watch?v=4KqUvG8HPYo to http://www.danielx.net/stream/docs/\n\nTap\n---\n\nTurn an array into a \"stream\"\n\n    tap = (items) ->\n      (reducingFunction) ->\n        items.reduce (result, item) ->\n          reducingFunction(result, item)\n        , reducingFunction()\n\nMap\n---\n\n    map = (f) ->\n      (reducingFunction) ->\n        (result, input) ->\n          switch arguments.length\n            when 0\n              reducingFunction()\n            when 1\n              reducingFunction(result)\n            when 2\n              reducingFunction result, f input\n\n\n>     #! demo\n>     # Square 10 numbers\n>     tap([0..9]) map((x) -> x * x) STDOUT\n\n---\n\n    STDOUT = (result, input) ->\n      switch arguments.length\n        when 0\n          return\n        when 1\n          return result\n        when 2\n          console.log input\n\n\nExpose\n------\n\n    module.exports =\n      pollute: ->\n        global.map = map\n        global.tap = tap\n\nSet Up Live Demos\n-------------\n\n>     #! setup\n>     require(\"/interactive\")\n",
      "mode": "100644"
    },
    "interactive.coffee.md": {
      "path": "interactive.coffee.md",
      "content": "Interactive Runtime\n-------------------\n\nRegister our interactive documentation runtime components.\n\nThese requires set up our interactive documentation environment.\n\n    require(\"./main\").pollute()\n\n\nDemo Runtimes\n-------------\n\n`demo` examples provide the pipe functions and dislpay all atoms received into\n`STDOUT` on the righthand side.\n\n    Interactive.register \"demo\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source)\n      console.log program\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      STDOUT = (result, atom) ->\n        switch arguments.length\n          when 0\n            return\n          when 1\n            return result\n          when 2\n            outputElement.textContent += \"#{atom}\\n\"\n\n      executeWithContext program,\n        STDOUT: STDOUT\n        NULL: ->\n\n    Interactive.register \"test\", ({source, runtimeElement}) ->\n      runtimeElement.append \"test\"\n\nHelpers\n-------\n\nEvaluate a program with a given environment object.\n\nThe values of the environment are mapped to local variables with names equal to\nthe keys.\n\nThe given program is then run with that environment and optionally a context for\n`this`.\n\n    executeWithContext = (program, environment, context) ->\n      args = Object.keys(environment)\n\n      values = args.map (name) ->\n        environment[name]\n\n      Function(args..., program).apply(context, values)\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var STDOUT, map, tap;\n\n  tap = function(items) {\n    return function(reducingFunction) {\n      return items.reduce(function(result, item) {\n        return reducingFunction(result, item);\n      }, reducingFunction());\n    };\n  };\n\n  map = function(f) {\n    return function(reducingFunction) {\n      return function(result, input) {\n        switch (arguments.length) {\n          case 0:\n            return reducingFunction();\n          case 1:\n            return reducingFunction(result);\n          case 2:\n            return reducingFunction(result, f(input));\n        }\n      };\n    };\n  };\n\n  STDOUT = function(result, input) {\n    switch (arguments.length) {\n      case 0:\n        break;\n      case 1:\n        return result;\n      case 2:\n        return console.log(input);\n    }\n  };\n\n  module.exports = {\n    pollute: function() {\n      global.map = map;\n      return global.tap = tap;\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "interactive": {
      "path": "interactive",
      "content": "(function() {\n  var executeWithContext,\n    __slice = [].slice;\n\n  require(\"./main\").pollute();\n\n  Interactive.register(\"demo\", function(_arg) {\n    var STDOUT, outputElement, program, runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    program = CoffeeScript.compile(source);\n    console.log(program);\n    outputElement = document.createElement(\"pre\");\n    runtimeElement.empty().append(outputElement);\n    STDOUT = function(result, atom) {\n      switch (arguments.length) {\n        case 0:\n          break;\n        case 1:\n          return result;\n        case 2:\n          return outputElement.textContent += \"\" + atom + \"\\n\";\n      }\n    };\n    return executeWithContext(program, {\n      STDOUT: STDOUT,\n      NULL: function() {}\n    });\n  });\n\n  Interactive.register(\"test\", function(_arg) {\n    var runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    return runtimeElement.append(\"test\");\n  });\n\n  executeWithContext = function(program, environment, context) {\n    var args, values;\n    args = Object.keys(environment);\n    values = args.map(function(name) {\n      return environment[name];\n    });\n    return Function.apply(null, __slice.call(args).concat([program])).apply(context, values);\n  };\n\n}).call(this);\n",
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