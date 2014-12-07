Transducers
===========

Exploring transducers.

Applying https://www.youtube.com/watch?v=4KqUvG8HPYo to http://www.danielx.net/stream/docs/

Tap
---

Turn an array into a "stream"

    tap = (items) ->
      (reducingFunction) ->
        items.reduce (result, item) ->
          reducingFunction(result, item)
        , reducingFunction()

Map
---

    map = (f) ->
      (reducingFunction) ->
        (result, input) ->
          switch arguments.length
            when 0
              reducingFunction()
            when 1
              reducingFunction(result)
            when 2
              reducingFunction result, f input


>     #! demo
>     # Square 10 numbers
>     tap([0..9]) map((x) -> x * x) STDOUT

---

    STDOUT = (result, input) ->
      switch arguments.length
        when 0
          return
        when 1
          return result
        when 2
          console.log input


Expose
------

    module.exports =
      pollute: ->
        global.map = map
        global.tap = tap

Set Up Live Demos
-------------

>     #! setup
>     require("/interactive")
