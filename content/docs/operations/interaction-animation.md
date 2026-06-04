---
title: "Interaction and Animation"
description: ""
lead: ""
date: 2026-06-04T00:00:00+00:00
lastmod: 2026-06-04T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 5
toc: true
---

These operations specify event-driven interactions and optional animation effects.

### msc.activate(tg, responder, responderEval, responderUpdate, animation)

Registers an interaction trigger and connects it to a responder component.

- `tg` (Object): contains `target`, `event`, and an optional `cumulative` flag
- `responder` (Object): contains `component` and either `properties` or `channels`
- `responderEval` (Function, optional): evaluates whether the responder update should be applied
- `responderUpdate` (Function or Array): applies the interaction effect to the responder component
- `animation` (Object or Array, optional): animation settings paired with the responder update function or functions
- Return type: `Trigger`
