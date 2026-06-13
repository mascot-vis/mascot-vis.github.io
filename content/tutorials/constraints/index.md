---
title: "7. Apply Constraints"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 60
---

So far we have seen how to specify the positions of visual elements using [layout](../../tutorials/layout/) and [encoding](../../tutorials/encode/). Another way is to use constraints.

Mascot currently supports two kinds of constraints: [align and affix](../../docs/operations/constraint-connection/). The `msc.align` operation applies to an array of visual elements, and moves the elements so that their bounding boxes have the same value at a specified [anchor](../../docs/global/constants/#anchor). The figure below illustrates alignment constraints in the `"y"` direction with different anchor parameters.

{{< figure src="align.png" width="800px" alt="Alignment Constraint" caption="" class="border-0 mx-auto text-center">}}


The `msc.affix` operation specifies the relative positioning between an element _i_ and a base element along the `"x"` or `"y"` direction. When such a constraint is applied, the base element's position remains unchanged, and element _i_'s position is changed to satisfy the constraint. The figure below illustrates affix constraints in the `"x"` direction with different [anchor](../../docs/global/constants/#anchor) and offset parameters. If the element and the base element have peers that are generated using `msc.repeat`, `msc.divide`, or `msc.densify`, those peers are handled automatically.

{{< figure src="affix.png" width="750px" alt="Affix Constraint" caption="" class="border-0 mx-auto text-center">}}
