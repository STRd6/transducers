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

Filter
------

    filter = (predicate) ->
      (reducingFunction) ->
        (result, input) ->
          switch arguments.length
            when 0
              reducingFunction()
            when 1
              reducingFunction(result)
            when 2
              if predicate(input)
                reducingFunction result, input
              else
                result

>     #! demo
>     # Filter evens
>     tap([0..9]) filter((x) -> x % 2 is 0) STDOUT

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

    module.exports = Transducer =
      map: map
      filter: filter
      tap: tap
      pollute: ->
        Object.keys(Transducer).forEach (name) ->
          console.log name
          return if name is "pollute"

          global[name] = Transducer[name]


Set Up Live Demos
-------------

>     #! setup
>     require("/interactive")
