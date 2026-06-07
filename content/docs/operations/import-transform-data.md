---
title: "Import and Transform Data"
description: ""
lead: ""
date: 2026-06-06T00:00:00+00:00
lastmod: 2026-06-06T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "operations"
weight: 1
toc: true
---

This page covers operations for importing data, applying transformations, and managing data flow in Mascot.

| function |  explanation  |  return type |
| --- | --- | --- |
| async **msc.csv**(url) | import a CSV file as a [data table](../../data/datatable/)<br>url (String): path to the file | Promise |
| async **msc.csvFromString**(data, name) | import CSV data in a string as a [data table](../../data/datatable/)<br>data (String): CSV data in a string<br>name (String): name of the data | Promise |
| async **msc.treeJSON**(url) | import a tree dataset in the JSON format as a [tree](../../data/tree/)<br>url (String): path to the file | Promise |
| async **msc.graphJSON**(url) | import a network dataset in the JSON format as a [Network](../../data/network/)<br>url (String): path to the file | Promise |
