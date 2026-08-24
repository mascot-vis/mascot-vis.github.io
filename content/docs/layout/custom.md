---
title: "CustomLayout"
description: ""
lead: ""
date: 2026-08-20T00:00:00+00:00
lastmod: 2026-08-24T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 610
toc: true
---
<span style="font-size:1.2em">extends [Layout](../layout/)</span><br>

The CustomLayout class lets you supply your own positioning logic while still fully participating in Mascot's reactive layout pipeline -- the same dependency-graph machinery used by [GridLayout](../grid/), [ForceLayout](../force/), and every other built-in layout. Use it when none of the built-in layout algorithms produce the arrangement you need. To create a CustomLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/). The following code creates a custom layout for the [Dust and Magnet interaction technique](../../../gallery/#reconfigure_dustMagnet):

```js
let cl = msc.layout("custom", {
    // called ONCE per recompute for the whole set of active children (not once
    // per child -- this lets compute() amortize any per-recompute setup, like
    // destructuring layout.params, across the whole group instead of repeating
    // it for every child). Must return the children's target CENTER positions
    // keyed by CHILD ID (child.id), not by array position -- every Mascot
    // element carries a unique, stable .id, and keying by id keeps compute()
    // correct even if `children`'s order ever changes between recomputes.
    compute: (children, layout) => {
        // read whatever state you need off layout.params
        let magnets = layout.params.magnets;
        ...
        let targets = {};
        for (let child of children)
            targets[child.id] = { x: targetX, y: targetY };
        return targets;
    },
    // arbitrary data read back inside compute() -- can be anything
    params: { magnets: [...] }
});
collection.layout = cl;
```

Assigning the layout to a collection immediately positions every child (`compute` runs once right away for the whole group, the same as any other Mascot layout). To reposition everything afterwards -- for example, in response to a drag interaction -- reassign the layout's `params`:

```js
msc.update(cl, { params: newParams });
```

or, from inside [`msc.activate`](../../operations/interaction-animation/#mscactivatetrigger-responder-evaluator-updater):

```js
msc.activate(trigger, { object: cl, properties: ["params"] }, undefined,
    (evalResult, evtCtx, stateCtx, respObj) => {
        respObj.params = newParams;
    });
```

Either path reassigns `layout.params`, which -- like every other layout parameter (`numCols`, `direction`, etc.) -- is mapped to the single shared `layoutParameter` dependency-graph node. Reassigning it automatically triggers `compute()` to re-run and reposition every child; no manual dependency-graph wiring and no peer-broadcast workaround are required.

Because `compute` is arbitrary JavaScript, it cannot be included when a scene is saved with `msc.serialize`. Serializing a CustomLayout persists `params` only and prints a console warning; after `msc.deserialize`-ing a saved scene, reattach the layout's `compute` function yourself.

### Properties
| property | explanation | type | default value |
| --- | --- | --- | --- |
| **compute** | the function called once per recompute for the whole set of active children -- as `compute(children, layout)` -- to get their target `{x, y}` center positions, returned as an object keyed by each child's `id` | Function | *(required)* |
| **params** | arbitrary data read by `compute`; reassigning this property re-runs `compute` and repositions every child | Object | {} |
| **refElements** <img width="70px" src="../../readonly.png"> | the reference elements used by this layout | Array | [] |
| **type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "custom" |

{.table-striped}

### Methods
| method | explanation | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | CustomLayout |

{.table-striped}

### Methods inherited from Layout
| method | explanation | return type |
| --- | --- | --- |
| **addRefElement**(re) | adds a reference element to this layout | void |
| **clearRefElements**() | removes all reference elements from this layout | void |

{.table-striped}
