Transducers
===========

Exploring transducers.

Applying https://www.youtube.com/watch?v=4KqUvG8HPYo to http://www.danielx.net/stream/docs/

tap
---

Turn an array into a "stream"

    tap = (items) ->
      (output) ->
        items.forEach output

Map
---

    map = (f) ->
      (output) ->
        (input) ->
          output f input

>     #! demo
>     # Square 10 numbers
>     tap([0..9]) map((x) -> x * x) STDOUT

---

Partition
---------

Divide a stream into two streams, one for which the predicate is true, and one
for which the predicate is false.

    partition = (predicate) ->
      (left, right) ->
        (input) ->
          if predicate(input)
            left input
          else
            right input

Alternate
---------

Spread a stream among two sinks evenly.

    alternate = (left, right) ->
      leftSide = false
      predicate = ->
        leftSide = !leftSide

      partition(predicate)(left, right)

>     #! demo
>     # Alternate streams
>     [0..9].forEach alternate(
>       map((x) -> -x) STDOUT
>       STDOUT
>     )


Filter
------

    filter = (predicate) ->
      (output) ->
        partition(predicate)(output, NULL)

>     #! demo
>     # Filter evens
>     tap([0..9]) filter((x) -> x % 2 is 0) STDOUT

---

    integrate = (output) ->
      total = 0
      (input) ->
        total += input
        output total

>     #! demo
>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach integrate integrate STDOUT

    differentiate = (output) ->
      last = 0
      (input) ->
        output input - last
        last = input

>     #! demo
>     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].forEach differentiate STDOUT


---

    STDOUT = (result, input) ->
      console.log input

    NULL = (result, input) ->

Expose
------

    module.exports = Transducer =
      alternate: alternate
      differentiate: differentiate
      filter: filter
      integrate: integrate
      map: map
      tap: tap
      pollute: ->
        Object.keys(Transducer).forEach (name) ->
          return if name is "pollute"

          global[name] = Transducer[name]


Set Up Live Demos
-------------

>     #! setup
>     require("/interactive")
