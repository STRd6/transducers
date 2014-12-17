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

Source
------

    source = (f) ->
      (input) ->
        (output) ->
          output f input

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

attr
----

    attr = (name) ->
      map (x) ->
        x[name]

Cat
---

Expand arrays into single items.

    each = (output) ->
      (input) ->
        [].concat(input).forEach output

Buffer Counter
--------------

Track the current number of items within this segment. Only works for 1-to-1
mappings, not 1-to-n or filters.

TODO: Figure out how to expose the current count.
TODO: Figure out the correct way to handle 1-to-* mappings.

    bufferCounter = (pipe) ->
      (output) ->
        pending = 0

        countedSegment = pipe (input) ->
          output input
          pending -= 1

        (input) ->
          pending += 1
          input countedSegment

Delay
-----

Delay a signal for `duration` seconds.

    delay = (duration) ->
      (output) ->
        (input) ->
          setTimeout ->
            output input
          , duration * 1000

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

    STDOUT = (input) ->
      console.log input

    NULL = (input) ->

Doneness?
---------

We'll want some way to indicate a stream is "done".

Say we reach out to a service and process a bunch of records, and then we're
done. We'll need to notify the remaining transformers and they'll need to
propagate a done state.

Also it would be nice if we could cancel from the bottom and propagate that back
up the chain.

The simpler building blocks needn't need to know about this mechanic at all
and should be able to be transparently wrapped.

>     #! demo
>     # No need to explicitly say "done", the data goes to STDOUT once it's fetched
>     $.getJSON("https://api.github.com/users/distri/repos").then each attr("full_name") STDOUT

    times = (output) ->
      (input) ->
        [0..input].forEach output

    rand = (n) ->
      (output) ->
        output Math.floor Math.random() * n

>     #! demo
>     # A random source
>     rand(10) times STDOUT

    clock = (period) ->
      (output) ->
        count = 0
        setInterval ->
          output(count)
          count += 1
        , period * 1000

>     #! demo
>     # A clock is never "done"
>     clock(1) STDOUT

---

Sorting
-------

We'll want to be able to apply a sorting function to a rendered stream 
concurrently wtih its resolution or afterwards.

Modifying some elements
-----------------------

For a spreadsheet or data display we want to be able to modify certain elements
and keep track of their position and changed properties.

Expose
------

    module.exports = Transducer =
      alternate: alternate
      attr: attr
      clock: clock
      each: each
      differentiate: differentiate
      filter: filter
      integrate: integrate
      map: map
      rand: rand
      tap: tap
      times: times
      pollute: ->
        Object.keys(Transducer).forEach (name) ->
          return if name is "pollute"

          global[name] = Transducer[name]


Set Up Live Demos
-------------

>     #! setup
>     require("/interactive")
