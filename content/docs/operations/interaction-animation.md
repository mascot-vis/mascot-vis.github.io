---
title: "Specify Interaction and Animation"
description: ""
lead: ""
date: 2026-06-01T00:00:00+00:00
lastmod: 2026-06-01T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 5
toc: true
---

### msc.activate(trigger, responder, evaluator, updater)

Mascot's interaction grammar has four components: trigger, responder, evaluator, updater. Only `trigger`, `responder`, and `updater` are required; `evaluator` may be `undefined`.

- `trigger` (what starts the interaction): `{source, event}`
  - `source`: the element(s) whose event is listened for, a UI widget ID, or a state-variable reference (`scene.state.var("name")`) 
  - `event`: a string representing the triggering event, e.g., "click", "hover", "brush"
- `responder` (what gets updated): `{object, properties}`
  - `object`: a visual element (i.e., mark, collection, axis, legend), an encoding, the state context, or a data transform. Mascot accepts either a single object or an array of objects.
  - `properties`: an array of property, channel, or state-variable names from the object to update.  
- `evaluator` (Function, optional): `(evtCtx, stateCtx, element) => Boolean`. If provided, every instance of the responder object is evaluated by this function. The evaluation result is used in the `updater` to determine what effects apply to the object. If omitted, the `updater` runs unconditionally on every peer.
- `updater` (Function): `(evalResult, evtCtx, stateCtx, respObj) => void`. It mutates `respObj`'s channels/properties.
  - `evalResult`: the result (per instance of responder object) from `evaluator`; if no `evaluator` was provided, defaults to undefined. 
  - `respObj`: an instance of the responder object.
- Return type: `Trigger`
