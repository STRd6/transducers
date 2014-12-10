Interactive Runtime
-------------------

Register our interactive documentation runtime components.

These requires set up our interactive documentation environment.

    require("./main").pollute()

Helpers
-------

Evaluate a program with a given environment object.

The values of the environment are mapped to local variables with names equal to
the keys.

The given program is then run with that environment and optionally a context for
`this`.

    executeWithContext = (program, environment, context) ->
      args = Object.keys(environment)

      values = args.map (name) ->
        environment[name]

      Function(args..., program).apply(context, values)

Demo Runtimes
-------------

`demo` examples provide the pipe functions and dislpay all atoms received into
`STDOUT` on the righthand side.

    Interactive.register "demo", ({source, runtimeElement}) ->
      program = CoffeeScript.compile(source)
      outputElement = document.createElement "pre"
      runtimeElement.empty().append outputElement

      STDOUT = (input) ->
        outputElement.textContent += "#{input}\n"

      executeWithContext program,
        STDOUT: STDOUT
        NULL: ->

    Interactive.register "test", ({source, runtimeElement}) ->
      runtimeElement.append "test"
