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

So far we have seen how we can specify the positions of visual objects using [layout](../../tutorials/layout/) and [encoding](../../tutorials/encode/), one more method is to use constraints. 

Mascot currently supports two kinds of constraints: [align and affix](../../docs/group/scene/#methods-specify-constraints). The _align_ constraint applies to an array of visual objects, and moves the objects so that their bounding boxes have the same value at a specified [anchor](../../docs/global/constants/#anchor). The figure below illustrates alignment constraints in the "y" direction with different anchor parameters.

{{< figure src="align.png" width="800px" alt="Alignment Constraint" caption="" class="border-0 mx-auto text-center">}}


The _affix_ constraint specifies the relative positioning between an object _i_ and a base object along the "x" or "y" direction. When such a constraint is applied, the base object's position remains unchanged, and object _i_'s position is changed to satisfy the constraint. The figure below illustrates affix constraints in the "x" direction with different [anchor](../../docs/global/constants/#anchor) and offset parameters. If the object and the base object have peers that are generated using repeat, divide or densify, these peers will be taken care automatically. 

{{< figure src="affix.png" width="750px" alt="Affix Constraint" caption="" class="border-0 mx-auto text-center">}}