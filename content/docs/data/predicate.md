---
title: "Predicate"
description: ""
lead: ""
date: 2020-10-06T08:49:15+00:00
lastmod: 2020-10-06T08:49:15+00:00
draft: false
images: []
menu: 
  docs:
        parent: "data"
weight: 4
toc: true
---

A predicate is used to define an inclusion or exclusion criterion. Predicates are passed to the [_findElements_ function](../../operations/manage-elements/#mscfindelementscontainer-objs-includeprimitives), which takes an array of predicate objects as its parameter. A predicate can be defined for a visual property or a data attribute.

### Point predicates
A point predicate matches a single value. This is the default predicate type, so the `type` field can be omitted.

- `{property: _property_, value: _value_}` matches a visual property exactly, for example, the following code will return all the text elements in the scene:

```js
    msc.findElements(scene, [{property: "type", value: "text"}])
```

- `{attribute: _attribute_, value: _value_}` matches a data attribute exactly, for example, the following code will return all the circles whose data value for `Continent` is `"Asia"`:

```js
    msc.findElements(scene, [
        {attribute: "Continent", value: "Asia"},
        {property: "type", value: "circle"}
    ])
```

### List predicates
A list predicate matches any value in a list.

- `{type: "list", property: _property_, value: _[values]_}` matches any one of the listed property values, for example:

```js
    msc.findElements(scene, [
        {type: "list", property: "type", value: ["text", "rect"]}
    ])
```

- `{type: "list", attribute: _attribute_, value: _[values]_}` matches any one of the listed data values, for example:

```js
    msc.findElements(scene, [
        {type: "list", attribute: "event_attribute", value: ["_Start", "_Exit"]}
    ])
```

### Interval predicates
An interval predicate matches values within a range.

- `{type: "interval", property: _property_, value: _[low, high]_}` matches elements whose property lies within the specified range, for example:

```js
    msc.findElements(scene, [
        {type: "interval", property: "x", value: [0, 200]}
    ])
```

- `{type: "interval", attribute: _attribute_, value: _[low, high]_}` matches elements whose data attribute lies within the specified range, for example:

```js
    msc.findElements(scene, [
        {type: "interval", attribute: "age", value: [20, 50]}
    ])
```

### Combining predicates
Multiple predicates are combined with logical AND. An element must satisfy all predicates in the array to be returned.

```js
    msc.findElements(scene, [
        {attribute: "name", value: "VMWare"},
        {property: "type", value: "text"}
    ])
```
