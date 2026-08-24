---
title: "Specify Interaction and Animation"
description: ""
lead: ""
date: 2026-06-01T00:00:00+00:00
lastmod: 2026-08-22T00:00:00+00:00
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
  - `source`: the element(s) whose event is listened for, a UI widget ID, or a state-variable reference (`scene.state.var("name")`). See [Trigger sources](#trigger-sources) below.
  - `event`: a string representing the triggering event, e.g., `"click"`, `"hover"`, `"brush"`, `"drag"`
- `responder` (what gets updated): `{object, properties}`
  - `object`: a visual element (i.e., mark, collection, axis, legend), an encoding, the state context, a data transform, or `msc.TRIGGER_ELEMENT`. Mascot accepts either a single object or an array of objects. See [Responder objects](#responder-objects) below.
  - `properties`: an array of property, channel, or state-variable names from the object to update.
- `evaluator` (Function, optional): `(evtCtx, stateCtx, element) => Boolean`. If provided, every peer of the responder object is evaluated by this function, and the result shapes what `updater` does to that peer -- see [Momentary vs. persistent responses](#momentary-vs-persistent-responses). If omitted, `updater` runs once, unconditionally, on the responder object itself.
- `updater` (Function): `(evalResult, evtCtx, stateCtx, respObj) => void`. It mutates `respObj`'s channels/properties.
  - `evalResult`: the result (per peer of the responder object) from `evaluator`; if no `evaluator` was provided, defaults to `undefined`.
  - `respObj`: the object this call should act on -- which object that is depends on the responder mode; see below.
- Return type: `Trigger`

<hr style="border: 0; border-top: 1px solid #cccccc;">

### Trigger sources

`trigger.source` can be:

- **A single element** -- a [mark](../../marks/mark/), [glyph](../../group/glyph/), or [collection](../../group/collection/). The trigger fires whenever `event` happens on that element.
- **An array of elements** -- e.g. coordinating one brush across several charts. The trigger fires when `event` happens on any element in the array.
- **A UI widget ID** (String) -- for `"change"`/`"input"` events from an HTML input outside the scene.
- **A state-variable reference** (`scene.state.var("name")`) -- the trigger fires whenever that state variable changes, instead of on a DOM event.
- **A peer of a [repeated](../generative/#mscrepeatelem-data-params) element** -- e.g. one circle out of `msc.repeat(circle, dt, {attribute: "id"})`. Every peer produced by the same `msc.repeat` call shares a class ID, and Mascot keys each trigger to that class ID rather than to an individual peer: interacting with *any* peer fires the *same*, shared trigger. Which peer actually changes as a result is entirely up to how the responder is set up -- covered next.

<hr style="border: 0; border-top: 1px solid #cccccc;">

### Responder objects

`responder.object` can be:

- **A single element, encoding, the state context, or a data transform** -- fixed once, when you call `msc.activate`. The updater always acts on this exact object, no matter which peer (if any) triggered it.
- **An array of objects** -- the updater runs once per array item, per trigger firing.
- **`msc.TRIGGER_ELEMENT`** -- a sentinel meaning "whichever peer the interaction is currently on," in place of a fixed object. Use it when the responder is itself a repeated element and each peer's own interaction should affect only that peer -- see [Targeting one peer of a repeated element](#targeting-one-peer-of-a-repeated-element).

<hr style="border: 0; border-top: 1px solid #cccccc;">

### Momentary vs. persistent responses

Because every peer of a repeated element shares one trigger, it's `responder.object` together with the presence or absence of `evaluator` that determines what actually happens when a peer is interacted with.

**No evaluator -- persists, applies to a fixed object.** `updater` runs once per trigger firing, directly on `responder.object`, and nothing is ever reverted. Use this for effects that should stick, such as reassigning a shared [CustomLayout](../../layout/custom/)'s `params` in response to a drag on some other element:

```js
msc.activate({ event: "drag", source: someElem }, { object: sharedLayout, properties: ["params"] },
    undefined,
    (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.params = newParams;
    });
```

**Evaluator present -- momentary, evaluated per peer.** For each firing, `evaluator` runs once per peer of `responder.object`; `updater` then runs on *every* peer, receiving that peer's own `evalResult`. Just before `updater` runs, each peer's watched properties are first restored to the value they had at the moment `msc.activate` was called -- so this mode assumes the effect is momentary and reversible, like a hover highlight:

```js
msc.activate({ event: "hover", source: circles }, { object: circles, properties: ["radius"] },
    (evtCtx, stateCtx, respObj) => respObj === evtCtx.get("element"),
    (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.radius = evalResult ? 12 : 6;
    });
```

When the pointer moves off (or the interaction ends), `evtCtx.get("element")` becomes `undefined`, `evalResult` is `false` for every peer, and every peer's radius is restored to what it was at registration time -- exactly the reset a hover highlight needs. That same reset makes this mode the wrong choice for anything meant to outlive the interaction: dragging a peer to a new spot and releasing it would snap it straight back to wherever it was when `msc.activate` first ran.

<hr style="border: 0; border-top: 1px solid #cccccc;">

### Targeting one peer of a repeated element

To have a repeated element's own interaction affect only itself, persistently, without registering `msc.activate` once per peer, set `responder.object` to `msc.TRIGGER_ELEMENT` and omit `evaluator`:

```js
let nodes = msc.repeat(nodeMark, dt, { attribute: "id" });
msc.activate({ event: "drag", source: nodeMark }, { object: msc.TRIGGER_ELEMENT, properties: ["x", "y"] },
    undefined,
    (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.x += evtCtx.get("dx");
        respObj.y += evtCtx.get("dy");
    });
```

One registration now covers every peer: each time the trigger fires, Mascot resolves `respObj` to whichever specific peer the pointer is actually on, and whatever `updater` does to it sticks -- dragging one node moves only that node and leaves it where it's dropped, while every other peer stays put. This gets you the fixed-object mode's persistence together with the evaluator mode's ability to single out one peer, without either a per-peer `msc.activate` call or a reset you'd have to work around.
