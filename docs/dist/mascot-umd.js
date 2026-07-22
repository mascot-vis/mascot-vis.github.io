/* eslint-disable */
// version: 4.0.0
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.msc = {}, global.d3));
})(this, (function (exports, d3$1) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespaceDefault(d3$1);

    const PrimitiveMarks = Object.freeze({
        Rect: "rect",
        Circle: "circle",
        Line: "line",
        Ring: "ring",
        Path: "path",
        Image: "image",
        SimpleText: "text",
        RichText: "richText",
        Arc: "arc",
        BezierCurve: "bezierCurve",
        BundledPath: "bundledPath",
        Chord: "chord",
        Arrow: "arrow"
    });

    const ElementType = Object.freeze({
        Area: "area",
        Rect: "rect",
        Ellipse: "ellipse",
        Circle: "circle",
        Pie: "pie",
        Ring: "ring",
        Arc: "arc",
        BezierCurve: "bezierCurve",
        BundledPath: "bundledPath",
        Chord: "chord",
        Line: "line",
        Path: "path",
        Image: "image",
        SimpleText: "text",
        RichText: "richText",
        Collection: "collection",
        Group: "group",
        Composite: "composite",
        Scene: "scene",
        Axis: "axis",
        Glyph: "glyph",
        Legend: "legend",
        Polygon: "polygon",
        Gridlines: "gridlines",
        LinearGradient: "LinearGradient",
        Link: "link",
        DataTable: "datatable",
        Layout: "layout",
        NetworkData: "networkdata",
        TreeData: "treedata",
        Arrow: "arrow"
    });

    const refElementTypes = Object.freeze({
        Axis: "axis",
        Legend: "legend",
        Gridlines: "gridlines"
    });

    function generateUniqueID() {
        return Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
    }

    function validateAttribute(attr, dt) {
        if (dt.has(attr))
            return true;
        else if (dt.tree && dt.tree.nodeTable.has(attr.split(".")[1]))
            return true;
        else
            throw new Error(["Attribute", attr, "does not exist in the table", dt.name].join(" "));
    }

    const AttributeType = Object.freeze({
        Boolean: "boolean",
        Integer: "integer",
        Number: "number",
        Date: "date",
        String: "string"
    });

    function inferType(values) {
        var types = Object.values(AttributeType);
        for (let i = 0; i < values.length; i++) {
            let v = values[i];
            if (v == null) continue;
            for (let j = 0; j < types.length; j++) {
                if (!isValidType[types[j]](v)) {
                    types.splice(j, 1);
                    j -= 1;
                }
            }
            if (types.length == 1)
                return types[0];
        }
        return types[0];
    }

    const isValidType = {
        boolean: function (x) { return x === 'true' || x === 'false' || x === true || x === false || toString.call(x) == '[object Boolean]'; },
        integer: function (x) { return isValidType.number(x) && (x = +x) === ~~x; },
        number: function (x) { return !isNaN(+x) && toString.call(x) != '[object Date]'; },
        // date: function(x) { return !isNaN(Date.parse(x)); },
        date: function (x) { let d = new Date(x); return d != undefined && !isNaN(d); },
        // eslint-disable-next-line no-unused-vars
        string: function (x) { return true; }
    };

    function summarize(values, type) {
        let s = {};
        switch (type) {
            case AttributeType.Boolean:
                s.trueCount = values.filter(d => d).length;
                s.falseCount = values.filter(d => !d).length;
                break;
            case AttributeType.Date:
                s.min = d3__namespace.min(values);
                s.max = d3__namespace.max(values);
                s.extent = [s.min, s.max];
                s.unique = [...new Set(values)];
                break;
            case AttributeType.String:
                s.unique = [...new Set(values)];
                break;
            default:
                s.min = d3__namespace.min(values);
                s.max = d3__namespace.max(values);
                s.extent = [s.min, s.max];
                s.mean = d3__namespace.mean(values);
                s.median = d3__namespace.median(values);
                s.unique = [...new Set(values)];
                break;
        }
        return s;
    }

    const Aggregator = {
        Max: "max",
        Min: "min",
        Avg: "avg",
        Mean: "mean",
        Median: "median",
        Count: "count",
        Percentile25: "percentile 25",
        Percentile75: "percentile 75",
        Sum: "sum"
    };

    function createDataScope(dataTable, filters = {}, rowIds) {
        return {
            dataTable,
            filters: Object.assign({}, filters),
            rowIds: rowIds ? rowIds.slice() : undefined
        };
    }

    function normalizeScopeRef(scopeOrRef) {
        if (!scopeOrRef)
            return undefined;
        return createDataScope(scopeOrRef.dataTable, scopeOrRef.filters, scopeOrRef.rowIds);
    }

    function cloneScopeRef(scopeRef) {
        return normalizeScopeRef(scopeRef);
    }

    function getScopeDataTable(scopeOrRef) {
        if (!scopeOrRef)
            return undefined;
        return scopeOrRef.dataTable;
    }

    function getScopeFilters(scopeOrRef) {
        if (!scopeOrRef)
            return {};
        return scopeOrRef.filters || {};
    }

    function getScopeRows(scopeOrRef) {
        if (!scopeOrRef)
            return [];
        if (scopeOrRef.rowIds && scopeOrRef.dataTable)
            return scopeOrRef.dataTable.rows({ [MSCRowID]: scopeOrRef.rowIds });
        return scopeOrRef.dataTable ? scopeOrRef.dataTable.rows(scopeOrRef.filters) : [];
    }

    function getScopeDatum(scopeOrRef) {
        let rows = getScopeRows(scopeOrRef);
        return rows.length > 0 ? rows[0] : {};
    }

    function getScopeNumTuples(scopeOrRef) {
        return getScopeRows(scopeOrRef).length;
    }

    function scopeHasAttribute(scopeOrRef, attr) {
        return attr in getScopeFilters(scopeOrRef);
    }

    function getScopeAttrVal(scopeOrRef, attr) {
        let filters = getScopeFilters(scopeOrRef);
        if (attr in filters)
            return filters[attr];
        let rows = getScopeRows(scopeOrRef);
        return rows.length > 0 ? rows[0][attr] : undefined;
    }

    function getScopeAttributeValues(scopeOrRef, attr) {
        let filters = getScopeFilters(scopeOrRef);
        if (attr in filters)
            return [filters[attr]];
        return Array.from(new Set(getScopeRows(scopeOrRef).map(d => d[attr])));
    }

    function aggregateScopeAttribute(scopeOrRef, attr, aggregator) {
        let values = getScopeRows(scopeOrRef).map(d => d[attr]);
        switch (aggregator) {
            case Aggregator.Max:
                return d3__namespace.max(values);
            case Aggregator.Min:
                return d3__namespace.min(values);
            case Aggregator.Avg:
            case Aggregator.Mean:
                return d3__namespace.mean(values);
            case Aggregator.Median:
                return d3__namespace.median(values);
            case Aggregator.Count:
                return values.length;
            case Aggregator.Percentile25:
                return d3__namespace.quantile(values, 0.25);
            case Aggregator.Percentile75:
                return d3__namespace.quantile(values, 0.75);
            case Aggregator.Sum:
            default:
                return d3__namespace.sum(values);
        }
    }

    function crossScopeRef(scopeOrRef, attr, value) {
        let dataTable = getScopeDataTable(scopeOrRef),
            filters = Object.assign({}, getScopeFilters(scopeOrRef), {[attr]: value});
        return createDataScope(dataTable, filters, _getRowIdsForFilters(dataTable, filters));
    }

    function mergeScopeRefs(scopeA, scopeB) {
        if (!scopeA)
            return cloneScopeRef(scopeB);
        if (!scopeB)
            return cloneScopeRef(scopeA);
        let dataTable = getScopeDataTable(scopeA),
            filters = Object.assign({}, getScopeFilters(scopeA));
        for (let [attr, value] of Object.entries(getScopeFilters(scopeB))) {
            if (attr in filters && filters[attr] !== value) {
                console.warn("Conflict in attribute values when merging dataScope:", attr, filters[attr], value);
                continue;
            }
            filters[attr] = value;
        }
        return createDataScope(dataTable, filters, _getRowIdsForFilters(dataTable, filters));
    }

    function fullTableScopeRef(dataTable) {
        return createDataScope(dataTable, {}, dataTable.data.map(d => d[MSCRowID]));
    }

    function getScopeRefsByAttribute(scopeOrRef, attr, keepEmpty = false) {
        let dataTable = getScopeDataTable(scopeOrRef),
            baseFilters = getScopeFilters(scopeOrRef),
            filterEntries = Object.entries(baseFilters).filter(([a]) => a !== attr),
            attrIndex = dataTable._attrValueIndexes.get(attr),
            refs = [];
        for (let value of dataTable.unique(attr)) {
            let rows = attrIndex && attrIndex.get(value) ? attrIndex.get(value) : [];
            if (filterEntries.length > 0)
                rows = rows.filter(row => filterEntries.every(([a, v]) => row[a] == v));
            if (!keepEmpty && rows.length === 0)
                continue;
            refs.push(createDataScope(dataTable, Object.assign({}, baseFilters, {[attr]: value}), rows.map(d => d[MSCRowID])));
        }
        return refs;
    }

    function _getRowIdsForFilters(dataTable, filters) {
        return dataTable.rows(filters).map(d => d[MSCRowID]);
    }

    class DataTable {

        constructor(data, url, fTypes) {
            this._id = ElementType.DataTable + generateUniqueID();
            this.initialize(data, url, fTypes);
        }

        initialize(data, url, fTypes) {
            this.url = url;
            //this.name = _getFileName(url);
            this._rawData = JSON.parse(JSON.stringify(data));
            this._data = data;
            this._dataScopeCache = new Map();
            this._scopeTupleCache = new Map();
            this._attrValueIndexes = new Map();
            this._rowIdIndex = new Map();
            //remember the original date values after parsing them
            this._dateMap = new Map();
            this._attributes = this._data.length === 0 ?  [] : Object.keys(this._data[0]);
            this._newAttribute = 0;
            if (fTypes) {
                this._attrTypes = fTypes;
            } else {
                this._attrTypes = {};
                for (let f of this._attributes) {
                    this._attrTypes[f] = inferType(this.data.map(d => d[f]));
                    if (f.toLowerCase() == "year" && this._attrTypes[f] == AttributeType.Integer)
                        this._attrTypes[f] = AttributeType.Date;
                }
            }
            //fix null values, cast type and summarize
            this._validate(this.data, this._attrTypes);

            this._attrSummaries = {};
            for (let f of this._attributes) {
                this._attrSummaries[f] = summarize(this.data.map(d => d[f]), this._attrTypes[f]);
            }

            //add row id
            if (this._attributes.indexOf(MSCRowID) < 0) {
                this.addAttr(MSCRowID, AttributeType.String, this.data.map((d, i) => "r" + i));
            }
            this._buildAttributeValueIndexes();
        }

        //TODO: handle attrValuesOrder and other internal properties
        clone() {
            let data = [];
            for (let row of this._data) {
                data.push(Object.assign({}, row));
            }
            let dt = new DataTable(data, this.url, Object.assign({}, this._attrTypes));
            dt.sourceDataTable = this;
            return dt;
        }

        get id() {
            return this._id;
        }

        get name() {
            if (this.url)
                return getFileName(this.url);
            else
                return this.id;
        }

        get data() {
            return this._data;
        }

        //only tracking one transform away
        // set sourceDataTable(dt) {
        //     this._sourceDataTable = dt;
        // }

        // get sourceDataTable() {
        //     return this._sourceDataTable;
        // }

        encodable(channel) {
            switch (channel) {
                case "x":
                case "y":
                case "width":
                case "height":
                case "radius":
                case "fillColor":
                case "strokeColor":
                case "text":
                    return this.measures.concat(this.dimensions);
                case "area":
                case "strokeWidth":
                default:
                    return this.measures;
            }
        }

        // toJSON() {
        //     let json = {};
        //     json.data = this.rawData;
        //     json.attributeTypes = this._attrTypes;
        //     json.url = this.url;
        //     json.id = this.id;
        //     json.sourceDataTable = this._sourceDataTable;
        //     json.transform = this._transform;
        //     json.dateMap = {};
        //     return json;
        // }

        // setValueOrder(attribute, values) {
        //     this._attrSummaries[attribute].unique = values;
        // }

        addAttr(name, type, values) {
            this._data.forEach((d, i) => d[name] = values[i]);
            if (name !== MSCRowID)
                this._rawData.forEach((d, i) => d[name] = values[i]);
            //this._rawData = JSON.parse(JSON.stringify(this._data));
            this._attrTypes[name] = type;
            if (!this._attributes.includes(name))
                this._attributes.push(name);
            this._attrSummaries[name] = summarize(values, type);
            this._clearDataCaches();
        }

        type(f) {
            return this._attrTypes[f];
        }


        summary(attr) {
            return this._attrSummaries[attr];
        }

        values(attr) {
            return this.data.map(d => d[attr]);
        }

        unique(f) {
            return this._attrSummaries[f].unique;
        }

        order(attr, vals) {
            this._attrSummaries[attr].unique = vals;
        }

        load(rows) {
            this._data = rows;
            this._clearDataCaches();
            this.summarize();
        }

        rows(filters = {}) {
            let key = this._getFilterKey(filters);
            if (this._scopeTupleCache.has(key)) {
                return this._scopeTupleCache.get(key);
            }

            let entries = Object.entries(filters);
            if (entries.length === 0) {
                this._scopeTupleCache.set(key, this.data);
                return this.data;
            }

            // Fast path: pure mascot_rowId set filter
            if (entries.length === 1 && entries[0][0] === MSCRowID && Array.isArray(entries[0][1])) {
                let rows = entries[0][1].map(id => this._rowIdIndex.get(id)).filter(d => d);
                this._scopeTupleCache.set(key, rows);
                return rows;
            }

            let candidates = this.data;
            for (let [attr, value] of entries) {
                // Interval and set filters can't use the exact-value index
                if (Array.isArray(value) || _isInterval(value)) continue;
                let indexedRows = this._getRowsByAttributeValue(attr, value);
                if (indexedRows && indexedRows.length < candidates.length) {
                    candidates = indexedRows;
                }
            }

            let rows = candidates.filter(row => entries.every(([attr, value]) => {
                if (_isInterval(value)) {
                    let v = row[attr];
                    return ('min' in value ? v >= value.min : true) && ('max' in value ? v <= value.max : true);
                }
                if (Array.isArray(value)) return value.includes(row[attr]);
                return row[attr] == value;
            }));
            this._scopeTupleCache.set(key, rows);
            return rows;
        }

        _getRowsByAttributeValue(attr, value) {
            let index = this._attrValueIndexes.get(attr);
            return index ? index.get(value) : undefined;
        }

        _buildAttributeValueIndexes() {
            this._attrValueIndexes = new Map();
            this._rowIdIndex = new Map();
            for (let attr of this._attributes) {
                let index = new Map();
                for (let row of this.data) {
                    let value = row[attr];
                    if (!index.has(value)) {
                        index.set(value, []);
                    }
                    index.get(value).push(row);
                }
                this._attrValueIndexes.set(attr, index);
            }
            for (let row of this.data) {
                this._rowIdIndex.set(row[MSCRowID], row);
            }
        }

        _getFilterKey(filters = {}) {
            return Object.entries(filters)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([attr, value]) => {
                    if (_isInterval(value)) {
                        return attr + ":[" + (value.min ?? '-inf') + "," + (value.max ?? '+inf') + "]";
                    }
                    return attr + ":" + JSON.stringify(value);
                })
                .join("|");
        }

        _clearDataCaches() {
            if (this._dataScopeCache) {
                this._dataScopeCache.clear();
            }
            if (this._scopeTupleCache) {
                this._scopeTupleCache.clear();
            }
            if (this._attrValueIndexes) {
                this._attrValueIndexes.clear();
                this._buildAttributeValueIndexes();
            }
        }

        count() {
            return this.data.length;
        }

        has(attr) {
            return this._attributes.indexOf(attr) >= 0;
        }

        //date values are parsed and stored as number of milliseconds
        parseDate(attr, format) {
            //TODO: validate attr and format
            let parse = d3__namespace.timeParse(format);
            for (let row of this.data) {
                let v = row[attr];
                if (v == null || v == undefined) {
                    v = "";
                    row[attr] = (new Date(1899, 11, 31)).getTime();
                } else {
                    row[attr] = parse(v).getTime();
                }
                this._dateMap.set(row[attr], v);
            }
            this._attrTypes[attr] = AttributeType.Date;
            this._attrSummaries[attr] = summarize(this.data.map(d => d[attr]), AttributeType.Date);
            this._clearDataCaches();
        }

        //TODO: need to return the true raw value from the input file
        raw(col, v) {
            if (this.type(col) === AttributeType.Date)
                return this._dateMap.get(v).toString();
            else
                return v;
        }

        get dimensions() {
            let r = [];
            for (let f in this._attrTypes) {
                if (this._attrTypes[f] != AttributeType.Number && this._attrTypes[f] != AttributeType.Integer && f != DataTable.RowID) {
                    r.push(f);
                }
            }
            r.sort((a, b) => this.unique(a).length - this.unique(b).length);
            return r;
        }

        get measures() {
            let r = [];
            for (let f in this._attrTypes) {
                if ((this._attrTypes[f] === AttributeType.Number || this._attrTypes[f] === AttributeType.Integer) && f != DataTable.RowID) {
                    r.push(f);
                }
            }
            return r;
        }

        attrs(t) {
            if (t === undefined) return this._attributes;
            let r = [];
            for (let f in this._attrTypes) {
                if (this._attrTypes[f] === t && f != DataTable.RowID) {
                    r.push(f);
                }
            }
            return r;
        }


        summarize() {
            for (let f of this._attributes) {
                this._attrSummaries[f] = summarize(this.data.map(d => d[f]), this._attrTypes[f]);
            }
        }

        _validate(data, attrTypes) {
            //date values are parsed and stored as number of milliseconds
            for (let row of data) {
                for (let f in attrTypes) {
                    let type = attrTypes[f], v = row[f], realv = undefined;
                    if (row[f] == null || row[f] == undefined) {
                        switch (type) {
                            case AttributeType.Boolean:
                                realv = false;
                                break;
                            case AttributeType.Date:
                                realv = (new Date(1899, 11, 31)).getTime();
                                break;
                            case AttributeType.String:
                                realv = "";
                                break;
                            default:
                                realv = 0;
                                break;
                        }
                    } else {
                        switch (type) {
                            case AttributeType.Boolean:
                                realv = v;
                                break;
                            case AttributeType.Date:
                                if (Number.isInteger(v) && v <= 9999) {
                                    // Small integer → year column (e.g. 2000, 2001)
                                    realv = (new Date(v, 0)).getTime();
                                } else if (Number.isInteger(v)) {
                                    // Large integer → already a millisecond timestamp (clone path)
                                    realv = v;
                                } else {
                                    realv = (new Date(v + "")).getTime();
                                }
                                this._dateMap.set(realv, v);
                                break;
                            case AttributeType.String:
                                realv = v.toString();
                                break;
                            default:
                                realv = v;
                                break;
                        }
                    }
                    row[f] = realv;
                }
            }
        }
    }

    // Returns true if value is a plain object with `min` or `max` keys (interval filter).
    // Arrays are set filters; primitives are exact-match filters.
    function _isInterval(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value) &&
            ('min' in value || 'max' in value);
    }

    function getDataTable(elem) {
        if (elem.dataScope)
            return getScopeDataTable(elem.dataScope);
        if (elem.parent && elem.parent.dataScope)
            return getScopeDataTable(elem.parent.dataScope);
    }

    function getDataTablesInScene(scene) {
        let tables = {};
        for (let classId in scene._encodings) {
            for (let channel in scene._encodings[classId]) {
                let e = scene._encodings[classId][channel];
                if (!(e.dataTable.id in tables) && !e._forLegend) {
                    tables[e.dataTable.id] = e.dataTable;
                }
            }
        }
        for (let c of scene.children) {
            if ([ElementType.Axis, ElementType.Legend, ElementType.Gridlines].includes(c.type)) continue;
            if (c.dataScope) {
                let dt = getScopeDataTable(c.dataScope);
                tables[dt.id] = dt;
                break;
            } else if (c.children && c.children.length > 0) {
                let itm = c.firstChild;
                while (itm) {
                    if (itm.dataScope) {
                        let dt = getScopeDataTable(itm.dataScope);
                        tables[dt.id] = dt;
                        break;
                    } else if (itm.children && itm.children.length > 0) {
                        itm = itm.firstChild;
                    } else {
                        itm = undefined;
                    }
                }
            }
        }
        return tables;
    }

    const MSCRowID = "mascot_rowId";

    const depth = "_depth";

    class Tree {

        constructor(data, url) {
            this._id = ElementType.TreeData + generateUniqueID();
            this.initialize(data, url);
        }

        initialize(data, url) {
            this.url = url;
            this._data = data;
            this._nodeList = [];
            this._linkList = [];
            this._nodeHash = {};

            this._traverse(data, this._nodeList, this._linkList);
            
            //TODO: if the nodes have different sets of attributes, only common attributes will be added to the data table
            //need to support looking up attribute values in this._nodeList, not _nodeTable
            this._nodeTable = new DataTable(this._nodeList, "nodes");
            this._linkTable = new DataTable(this._linkList, "links");
            this._nodeTable.tree = this;
            this._linkTable.tree = this;
        }

        get nodeTable() {
            return this._nodeTable;
        }

        get linkTable() {
            return this._linkTable;
        }

        _traverse(data, nodes, links, d = 0) {
            let node = {};
            if (!(MSCNodeID in data))
                data[MSCNodeID] = "n" + nodes.length;
            nodes.push(node);
            data[depth] = d;
        
            for (let k in data) {
                if (k == "children" && data[k] && data[k].length > 0) {
                    for (let c of data[k]) {
                        let id = this._traverse(c, nodes, links, d + 1);
                        links.push({
                            parent: data[MSCNodeID],
                            child: id
                        });
                    }
                } else
                    node[k] = data[k];
            }
            this._nodeHash[node[MSCNodeID]] = node;
            return node[MSCNodeID];
        }

        getNodeDataScopeRef(node) {
            return crossScopeRef(fullTableScopeRef(this._nodeTable), MSCRowID, node[MSCRowID]);
        }

        getNode(id) {
            return this._nodeHash[id];
        }

        getRoot() {
            let nodes = this._nodeTable["data"];
            return nodes[0]; // Due to recursive appending of nodes, last one is root
        }

        getChildren(node) {
            let id = node[MSCNodeID];
            let children = [];
            let links = this._linkTable["data"];
            let nodes = this._nodeTable["data"];
            for (let i in links) {
                if (links[i]["parent"] == id) {
                    let childId = links[i]["child"];
                    let index = nodes.findIndex(x => x[MSCNodeID] == childId);
                    children.push(nodes[index]);
                }
            }
            return children;
        }

        getParent(node) {
            let id = node[MSCNodeID];
            let links = this._linkTable["data"],
                nodes = this._nodeTable["data"];
            for (let i in links) {
                if (links[i]["child"] == id) {
                    let pid = links[i]["parent"];
                    let index = nodes.findIndex(x => x[MSCNodeID] == pid);
                    return nodes[index];
                }
            }
            return undefined;
        }
    }

    function getTree(nodeMark) {
        return getScopeDataTable(nodeMark.dataScope).tree;
    }

    class Network {

        constructor(data, url) {
            this._id = ElementType.NetworkData + generateUniqueID();
            this.initialize(data, url);
        }

        initialize(data, url) {
            this.url = url;
            this._nodeTable = new DataTable(data["nodes"], this._id + "_nodes");
            this._linkTable = new DataTable(data["links"], this._id + "_links");
            this._nodeTable.graph = this;
            this._linkTable.graph = this;
            this._rawNodes = data["nodes"];
            this._rawLinks = data["links"];
            this._nodeHash = {};
            for (let n of data["nodes"]) {
                this._nodeHash[n[MSCNodeID]] = n;
            }
        }

        get nodeTable() {
            return this._nodeTable;
        }

        get linkTable() {
            return this._linkTable;
        }

        get nodeList() {
            return this._rawNodes;
        }

        get linkList() {
            return this._rawLinks;
        }

        getNode(id) {
            return this._nodeHash[id];
        }

        getLinks(node) {
            let id = node[MSCNodeID];
            let links = this._rawLinks;
            let result = [];
            for (let i in links) {
                if (links[i]["target"] === id || links[i]["source"] === id) {
                    result.push(links[i]);
                }
            }
            return result;
        }

        buildNodeHierarchy(attrs) {
            let root = {};
            root[MSCNodeID] = "root";
            formHierarchy(root, this._rawNodes, attrs);
            return new Tree(root, this.url);
        }
    } 

    function getNetwork(nodeMark) {
        return getScopeDataTable(nodeMark.dataScope).graph;
    }

    function formHierarchy(parent, nodeList, attrs) {
        if (nodeList.length === 0 || attrs.length === 0)
            return;
        if (!("children" in parent)) {
            parent["children"] = [];
        }
        let temp = {};
        for (let n of nodeList) {
            let k = n[attrs[0]];
            if (!(k in temp)) {
                temp[k] = [];
            }
            temp[k].push(n);
        }
        if (attrs.length === 1) {
            for (let k in temp) {
                let c = {"children": temp[k]};
                c[MSCNodeID] = k;
                parent.children.push(c);
            }
        } else {
            for (let k in temp) {
                let obj = {};
                obj[MSCNodeID] = k;
                parent.children.push(obj);
                formHierarchy(obj, temp[k], attrs.slice(1));
            }
        }
    }

    const MSCNodeID = "id";

    function makeRequest(method, url) {
        return fetch(url, { method: method })
            .then(response => {
                if (!response.ok) {// if not (>= 200 and < 300)
                    console.log(response.status);
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText
                    });
                }
                return response.text();
            })
            .catch(error => {
                console.log(error);
                return Promise.reject({
                    status: error.status,
                    statusText: error.statusText
                });
            });
    }

    async function importCSV(url) {
        let data = await makeRequest("GET", url);
        let parsed = d3__namespace.csvParse(data.trim(), d3__namespace.autoType);
        return new DataTable(parsed, url);
    }

    function importCSVString(str) {
        let parsed = d3__namespace.csvParse(str.trim(), d3__namespace.autoType);
        return new DataTable(parsed, "fromString");
    }

    async function importGraphJSON(url) {
        let data = await makeRequest("GET", url);
        return new Network(JSON.parse(data), url);
    }

    async function importTreeJSON(url) {
        let data = await makeRequest("GET", url);
        return new Tree(JSON.parse(data), url);
    }
    function getFileName(url) {
        var startIndex = (url.indexOf('\\') >= 0 ? url.lastIndexOf('\\') : url.lastIndexOf('/'));
        var filename = url.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        return filename;
    }

    class Predicate {

        constructor(type, vt, vn) {
            this._id = "predicate_" + generateUniqueID();
            this._type = type ? type : PredicateType.POINT;
            this._variableType = vt;
            this._variableName = vn;
            this._value = undefined;
        }

        get type() {
            return this._type;
        }

        get value() {
            return this._value;
        }

        set value(v) {
            this._value = v;
        }

        get id() {
            return this._id;
        }

        get variableType() {
            return this._variableType;
        }

        get variableName() {
            return this._variableName;
        }

    }


    const PredicateType = Object.freeze({
        POINT: "point",
        INTERVAL: "interval",
        LIST: "list"
    });

    class IntervalPredicate extends Predicate {

        constructor(type, vt, vn) {
            super(type, vt, vn);
        }

        testElement(elem) {
            let v;
            if (this._variableType == "attribute") {
                if (!elem.dataScope) return false;
                v = elem.datum[this._variableName];
            } else {
                v = elem[this._variableName];
            }
            return this._value[0] <= v && this._value[1] >= v;
        }

        testTuple(row) {
            if (this._variableType == "attribute") {
                let v = row[this._variableName];
                return this._value[0] <= v && this._value[1] >= v;
            } else {
                return false;
            }
        }

        //TODO: equals

    }

    class ListPredicate extends Predicate {

        constructor(type, vt, vn) {
            super(type, vt, vn);
        }

        addValue(v) {
            if (!this._value)
                this._value = [];
            this._value.push(v);
        }

        resetValue() {
            this._value = undefined;
        }

        testElement(elem) {
            if (this._variableType == "attribute") {
                if (!elem.dataScope) return false;
                let v = Array.from(new Set(elem.data.map(d => d[this._variableName])));
                return v.length === 1 && this._value.indexOf(v[0]) >= 0;
            } else {
                return this._value.indexOf(elem[this._variableName]) >= 0;
            }
        }

        testTuple(row) {
            if (this._variableType == "attribute") {
                let v = row[this._variableName];
                return this._value.indexOf(v) >= 0;
            } else {
                return false;
            }
        }

        //TODO: equals

    }

    class PointPredicate extends Predicate {

        constructor(type, vt, vn) {
            super(type, vt, vn);
        }

        testElement(elem) {
            if (this._variableType == "attribute") {
                if (!elem.dataScope) return false;
                let v = elem.datum[this._variableName];
                return v == this._value;
            } else {
                return elem[this._variableName] == this._value;
            }
        }

        testTuple(row) {
            if (this._variableType == "attribute") {
                let v = row[this._variableName];
                return this._value === v;
            } else {
                return false;
            }
        }

        equals(p) {
            return this.type === p.type && this.variableName === p.variableName && this.value === p.value;
        }

    }

    function obj2Predicate$1(obj) {
        let p, 
            vt = "attribute" in obj ? "attribute" : "property",
            vn = obj[vt];
        switch(obj.type) {
            case PredicateType.LIST:
                p = new ListPredicate(obj.type, vt, vn);
                break;
            case PredicateType.INTERVAL:
                p = new IntervalPredicate(obj.type, vt, vn);
                break;
            case PredicateType.POINT:
            default:
                p = new PointPredicate(obj.type, vt, vn);
                break;
        }
        p.value = obj.value;
        return p;
    }

    function matchCriteria(cpnt, predicates) {
        for (let predicate of predicates) {
            if (!predicate.testElement(cpnt))
                return false;
        }
        return true;
    }

    const SVGProvider = {
    	svg: undefined,

    	getSVG: function() {
    		if (!window)
                return null;
    		if (this.svg === undefined) {
    			this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    			this.svg.style.visibility = 'hidden';
    			this.svg.style.pointerEvents = 'none';
    			this.svg.setAttribute('aria-hidden', 'true');
    			document.body.appendChild(this.svg);
    		}
    		return this.svg;
    	}
    };
    function rotatePoint(px, py, cx, cy, angle) {
    	// Convert angle to radians
    	const radians = (angle * Math.PI) / 180;

    	// Translate point back to origin
    	const translatedX = px - cx;
    	const translatedY = py - cy;

    	// Apply rotation
    	const rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    	const rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

    	// Translate point back to its original location
    	const newX = rotatedX + cx;
    	const newY = rotatedY + cy;

    	return {
    		x: newX,
    		y: newY
    	};
    }

    function getDistance(x1, y1, x2, y2) {
    	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function getPositionInScene(domID, clientX, clientY) {
    	const svg = document.getElementById(domID);
    	const pt = svg.createSVGPoint();
    	pt.x = clientX;
    	pt.y = clientY;
    	const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    	return [svgP.x, svgP.y];
    }
    const Style2SVG = Object.freeze({
        "fillColor": "fill",
        "strokeColor": "stroke",
        "strokeWidth": "stroke-width",
        "fillOpacity": "fill-opacity",
        "strokeOpacity": "stroke-opacity",
        "strokeDash": "stroke-dasharray",
        "opacity": "opacity",
        "fontSize": "font-size",
        "fontFamily": "font-family",
        "fontWeight": "font-weight",
        "visibility": "visibility",
        "cursor": "cursor"
    });

    class Rectangle {
    	//x and y refer to the center
    	constructor(left, top, width, height) {
    		this._x = left + width / 2;
    		this._y = top + height / 2;
    		this._width = width;
    		this._height = height;
    	}

    	translate(dx, dy) {
    		this._x += dx;
    		this._y += dy;
    	}

    	toJSON() {
    		let json = {};
    		json.x = this._x;
    		json.y = this._y;
    		json.width = this._width;
    		json.height = this._height;
    		return json;
    	}

    	union(rect) {
    		let left = d3.min([this.left, rect.left]), top = d3.min([this.top, rect.top]), right = d3.max([this.right, rect.right]), btm = d3.max([this.bottom, rect.bottom]), wd = right - left, ht = btm - top;
    		return new Rectangle(left, top, wd, ht);
    	}

    	clone() {
    		return new Rectangle(this.left, this.top, this._width, this._height);
    	}

    	get left() {
    		return this._x - this._width / 2;
    	}

    	set left(v) {
    		this._x = v + this._width/2;
    	}

    	get right() {
    		return this._x + this._width / 2;
    	}

    	set right(v) {
    		this._x = v - this._width/2;
    	}

    	get top() {
    		return this._y - this._height / 2;
    	}

    	set top(v) {
    		this._y = v + this._height/2;
    	}

    	get bottom() {
    		return this._y + this._height / 2;
    	}

    	set bottom(v) {
    		this._y = v - this._height/2;
    	}

    	get x() {
    		return this._x;
    	}

    	get y() {
    		return this._y;
    	}

    	get center() {
    		return this.x;
    	}

    	get middle() {
    		return this.y;
    	}

    	get width() {
    		return this._width;
    	}

    	setWidth(v, ref) {
    		switch (ref) {
    			case BoundsAnchor.RIGHT:
    				this._x = this.right - v/2;
    				break;
    			case BoundsAnchor.CENTER:
    				this._width = v * 2;
    				break;
    			default:
    				this._x = this.left + v/2;
    				break;
    		}
    		this._width = v;
    	} 

    	get height() {
    		return this._height;
    	}

    	setHeight(v, ref) {
    		switch (ref) {
    			case BoundsAnchor.TOP:
    				this._y = this.top + v/2;
    				break;
    				// this._y = this.bottom - v/2;
    				// break;
    			//case "bottom":
    			case BoundsAnchor.MIDDLE:
    				this._height = v * 2;
    				break;
    			default:
    				this._y = this.bottom - v/2;
    				break;
    		}
    		this._height = v;
    	} 

    	contains(x, y) {
    		return this.left <= x && this.right >= x && this.top <= y && this.bottom >= y;
    	}

    	intersects(r) {
    		return !(this.right < r.left || this.bottom < r.top || this.left > r.right || this.top > r.bottom);
    	}

    }

    function unionRectangles(rects) {
        let b = rects[0].clone();
        for (let i = 1; i < rects.length; i++) {
            b = b.union(rects[i]);
        }
        return b;
    }

    function initializeAreaRefBounds(elem) {
    	let area;
    	if (elem.type === "vertex" && elem.parent.type === ElementType.Area) {
    		area = elem.parent;
    	} else if (elem.type === ElementType.Area) {
    		area = elem;
    	}
    	if (area && !area._refBounds) {
    		let peers = getPeers(area);
    		peers.forEach(d => d._refBounds = d.bounds.clone());
    	}
    }

    function unionRefBounds(elems) {
    	let items = elems[0].type == "vertex" || elems[0].type == "segment" ? elems.map(d => d.parent) : elems;
    	return unionRectangles(items.map(d => d.refBounds ? d.refBounds : d.bounds));
    }

    function unionBounds(elems) {
    	let items = elems[0].type == "vertex" || elems[0].type == "segment" ? elems.map(d => d.parent) : elems;
    	return unionRectangles(items.map(d => d.bounds));
    }

    function propagateBoundsUpdate(elem) {
    	let peers = getPeers(elem);
    	for (let p of peers) {
    		p._updateBounds();
    	}
    	let parents = [];
    	for (let p of peers) {
    		if (p.parent && !parents.includes(p.parent))
    			parents.push(p.parent);
    	}
    	for (let p of parents) {
    		propagateBoundsUpdate(p);
    	}
    }

    const BoundsAnchor = Object.freeze({
    	TOP: "top",
    	LEFT: "left",
    	RIGHT: "right",
    	BOTTOM: "bottom",
    	CENTER: "center",
    	MIDDLE: "middle"
    });

    class Mark {

        constructor(args) {
            this._dataScopeRef = undefined;
            this._type = "type" in args ? args.type : ElementType.Mark;
            this._id = args.id ? args.id : this._type + "_" + generateUniqueID();
            this._classId = undefined;
            this._bounds = undefined;
            this._rotate = undefined;
            //when a path encodes data using its width or height, its geometric bounds may not be the same as its orginal bounds without encoding applied
            this._refBounds = undefined;
            this._dirty = true;
            this._clipMask = undefined;
            this._cursor = undefined;

            this._styles = {};
            if (args !== undefined) {
                for (let s in Style2SVG) {
                    if (s in args) {
                        this.styles[s] = args[s];
                    }
                }
            }
        }

        get scene() {
            return getScene(this);
        }

        get datum() {
            return getScopeDatum(this._dataScopeRef);
        }

        get data() {
            return getScopeRows(this._dataScopeRef);
        }

        set strokeColor(c) {
            if (this.styles.strokeColor === c)
                return;
            this.styles.strokeColor = c;
            this._dirty = true; //mark as dirty
        }

        get strokeColor() {
            return this.styles.strokeColor;
        }

        set strokeWidth(w) {
            if (this.styles.strokeWidth === w)
                return;
            this.styles.strokeWidth = w;
            this._dirty = true;
        }

        get strokeWidth() {
            return this.styles.strokeWidth;
        }

        get strokeDash() {
    		return this.styles["strokeDash"];
    	}

    	set strokeDash(c) {
    		if (this.styles["strokeDash"] === c)
    			return;
    		this.styles["strokeDash"] = c;
    		this._dirty = true;
    	}


        set fillColor(w) {
            if (this.styles.fillColor === w)
                return;
            this.styles.fillColor = w;
            this._dirty = true;
        }

        get fillColor() {
            return this.styles.fillColor;
        }

        get rotation() {
            return this._rotate;
        }

        get cursor() {
            return this._cursor;
        }

        get id() {
            return this._id;
        }

        set id(id) {
            if (this.getScene()) {
                delete this.getScene()._itemMap[this._id];
                this._id = id;
                this.getScene()._itemMap[id] = this;
            } else {
                this._id = id;
            }
        }

        get classId() {
            return this._classId ? this._classId : this._id;
        }

        set classId(cid) {
            this._classId = cid;
        }

        get type() {
            return this._type;
        }

        get bounds() {
            if (!this._bounds)
                this._updateBounds();
            return this._bounds;
        }

        /**
         * return the bounds as if the path does not encode data
         */
        get refBounds() {
            return this._refBounds ? this._refBounds : this.bounds;
            // if (!this._bounds)
            // 	this._updateBounds();
            // let ht = (this._bounds.bottom + this.boundsOffsets.bottom) - (this._bounds.top - this.boundsOffsets.top),
            // 	wd = this._bounds.right + this.boundsOffsets.right - (this._bounds.left - this.boundsOffsets.left);
            // return new Rectangle(this._bounds.left - this.boundsOffsets.left, this._bounds.top - this.boundsOffsets.top,  wd, ht);
        }

        //removed from mascot for now to avoid dependency on node-canavas for cjs bundle
        // since node-canvas does not have support for isPointInStroke
        // TODO: implement winding contribution, see paper.js PathItem.Boolean.js
        // contains(px, py) {
        //     if (!this.bounds)
        //         return false;
        //     if (!this.bounds.contains(px, py))
        //         return false;
        //     switch (this.type) {
        //         case ElementType.Rect:
        //         case ElementType.SimpleText:
        //             return true;
        //         case ElementType.Circle: {
        //             let dist = Math.sqrt(Math.pow(px - this.x, 2) + Math.pow(py - this.y, 2));
        //             return dist <= this.radius + this.strokeWidth;
        //         }
        //         case ElementType.Path: {
        //             let ctx = CanvasProvider.getContext(),
        //                 p = CanvasProvider.getPath2D(this.getSVGPathData());
        //             ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
        //             ctx.stroke(p);
        //             if (this.closed) {
        //                 return ctx.isPointInPath(p, px, py);
        //             } else {
        //                 return ctx.isPointInStroke(p, px, py);
        //             }
        //         }
        //         case ElementType.Line: {
        //             let ctx = CanvasProvider.getContext(),
        //                 p = CanvasProvider.getPath2D(this.getSVGPathData());
        //             ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
        //             ctx.stroke(p);
        //             return ctx.isPointInStroke(p, px, py);
        //         }
        //         default: {
        //             let ctx = CanvasProvider.getContext(),
        //                 p = CanvasProvider.getPath2D(this.getSVGPathData());
        //             return ctx.isPointInPath(p, px, py);
        //         }
        //     }
        // }

        set dataScope(ref) {
            this._dataScopeRef = normalizeScopeRef(ref);
        }

        get dataScope() {
            return this._dataScopeRef;
        }

        get styles() {
            return this._styles;
        }

        set styles(value) {
            if (this._styles === value)
                return;
            this._styles = value;
            this._dirty = true;
        }

        set visibility(v) {
            if (this.styles["visibility"] === v)
                return;
            this.styles["visibility"] = v;
            this._dirty = true;
        }

        get visibility() {
            if (!this.styles["visibility"])
                return "visible";
            return this.styles["visibility"];
        }

        get opacity() {
            if (!("opacity" in this.styles))
                return 1;
            return this.styles["opacity"];
        }

        set opacity(c) {
            if (this.styles["opacity"] === c)
                return;
            this.styles["opacity"] = c;
            this._dirty = true;
        }

        get z() {
            return "z" in this.styles ? this.styles["z"] : 0;
        }

        set z(v) {
            if (this.styles["z"] === v) return;
            this.styles["z"] = v;
            this._dirty = true;
        }

        copyPropertiesTo(target) {
            target.styles = Object.assign({}, this.styles);
            if (this._dataScopeRef)
                target._dataScopeRef = cloneScopeRef(this._dataScopeRef);
        }

        createClipMask() {
            let b = this._bounds;
            this._clipMask = new Rectangle(b.left, b.top, b.width, b.height);
        }

        get clipMask() {
            return this._clipMask;
        }
    }

    function isMark(ele) {
        return ele instanceof Mark && ele.type !== ElementType.Gridlines;
    }

    const MarkTypes = Object.freeze({
        Area: "area",
        Rect: "rect",
        Ellipse: "ellipse",
        Circle: "circle",
        Pie: "pie",
        Ring: "ring",
        Arc: "arc",
        Line: "line",
        Path: "path",
        Image: "image",
        SimpleText: "text",
        RichText: "richText",
        Polygon: "polygon",
        BezierCurve: "bezierCurve"
    });

    class Layout {
        
        constructor() {
            this._refElements = [];
        }

        addRefElement(re) {
            this._refElements.push(re);
        }

        get refElements() {
            return this._refElements;
        }

        clearRefElements() {
            this._refElements = [];
        }
    }

    function isLayout(elem) {
        return elem instanceof Layout;
    }

    const LayoutType = Object.freeze({
        GRID: "grid",
        STACK: "stack",
        PACKING: "packing",
        FORCE: "force",
        DIRECTED: "directedgraph",
        TIDYTREE: 'tidytree',
        TREEMAP: 'treemap',
        STRATA: 'strata',
        CIRCULAR: 'circular',
        CLUSTER: 'cluster'
    });

    function validateCellAlignment(orientation, v) {
        if (orientation.startsWith("h")  && [BoundsAnchor.LEFT, BoundsAnchor.CENTER, BoundsAnchor.RIGHT].indexOf(v) >= 0){
            return true;
        } else if (orientation.startsWith("v") && [BoundsAnchor.TOP, BoundsAnchor.MIDDLE, BoundsAnchor.BOTTOM].indexOf(v) >= 0){
            return true;
        }
        console.warn("Invalid alignment:", v);
        return false;

    }

    class OneWayDependency {

        constructor(opType) {
            this._id = opType + "_" + generateUniqueID();
            this._type = opType;
            this._inputVars = [];
            this._outputVars = [];
        }

        run() {
            // console.log("-", this._type, 
            //     this.outputVar && this.outputVar.element ? this.outputVar.element.type : "",
            //     this.outputVar && this.outputVar.channel ? this.outputVar.channel : ""
            // );

            // let e = this.outputVar.element;
            // if (e) {
            //     if (isMark(e))
            //         console.log(this._type, e.refBounds.x);
            //     else if (e.type == "glyph")
            //         console.log(this._type, e.type, e.children.map(d => d.refBounds.x), e.refBounds.x);
            //     else if (e.type == "collection")
            //         console.log(this._type, e.type, e.children[0].children.map(d => d.refBounds.x), e.refBounds.x);
            //     else {
            //         console.log(this._type);
            //     }
            // } else {
            //     console.log(this._type);
            // }
        
        }

        get id() {
            return this._id;
        }

        get type() {
            return this._type;
        }

        get inputVars() {
            return this._inputVars;
        }

        get outputVars() {
            return this._outputVars;
        }

        get outputVar() {
            return this._outputVars[0];
        }

        isIsolated() {
            return this._inputVars.length == 0 && this._outputVars.length == 0;
        }
        // set outputVars(v) {
        //     this._outputVars = v;
        // }
    }

    const OpType = Object.freeze({
        CONDUIT: 'conduit',
        ENCODER: 'encoder',
        LAYOUT: 'layout',
        LINK_PLACER: 'linkRouter',
        CONSTRAINT: 'constraint',
        EVAL_BBOX: 'evalBBox',
        EVAL_REFBOUNDS: 'evalRefBounds',
        AFFIXER: 'affixer',
        ALIGNER: 'aligner',
        // DOMAIN_BUILDER: 'domainBuilder',
        DATA_EXTRACTOR: 'dataExtractor',
        SCALE_BUILDER: 'scaleBuilder',
        AXIS_PATH_PLACER: 'axisPathPlacer',
        AXIS_TICKS_PLACER: 'axisTicksPlacer',
        AXIS_LABELS_PLACER: 'axisLabelsPlacer',
        AXIS_TITLE_PLACER: 'axisTitlePlacer',
        GRIDLINES_PLACER: 'gridlinesPlacer',
        GRID_LAYOUT: 'gridLayout',
        STACK_LAYOUT: 'stackLayout',
        PACK_LAYOUT: 'packLayout',
        FORCE_LAYOUT: 'forceLayout',
        DIRECTED_LAYOUT: 'directedLayout',
        TIDY_TREE_LAYOUT: 'tidyTreeLayout',
        TREEMAP_LAYOUT: 'treemapLayout',
        STRATA_LAYOUT: 'strataLayout',
        CIRCULAR_LAYOUT: 'circularLayout',
        CLUSTER_LAYOUT: 'clusterLayout',
        BIN_TRANSFORMER: 'binTransformer',
        FILTER_TRANSFORMER: 'filterTransformer',
        KDE_TRANSFORMER: 'kdeTransformer',
        CUSTOM_TRANSFORMER: 'customTransformer',
        REPOPULATE: 'repopulate',
        TARGET_EVALUATOR: 'targetEvaluator',
        TARGET_UPDATER: "targetUpdater"
    });

    class Variable {
        constructor(type) {
            this._id = "v_" + generateUniqueID();
            this._type = type;
            this._incomings = [];
            this._outgoings = [];
            this._undirected = [];
        }

        get id() {
            return this._id;
        }

        get incomingEdges() {
            return this._incomings;
        }

        get outgoingEdges() {
            return this._outgoings;
        }

        get undirectedEdges() {
            return this._undirected;
        }

        get type() {
            return this._type;
        }

        get incomingDataflow() {
            for (let ie of this._incomings) {
                if(ie.fromNode && ie.fromNode instanceof OneWayDependency)
                    return ie.fromNode;
            }
            return null;
        }

        isIsolated() {
            return this._incomings.length == 0 && this._outgoings.length == 0;
        }
    }

    const VarType = Object.freeze({
        CHANNEL: 'channel',
        PROPERTY: 'property',
        STATE: 'state',
        ATTRIBUTE: 'attribute',
        ITEMS: "items",
        // CHILDREN_FILTER: "childrenFilter",
        DATASCOPE: 'datascope',
        // DOMAIN: 'domain',
        ATTR_VALUE: 'dataValue',
        BOUNDS: 'bounds',
        SCALE: 'scale',
        CONDITION_RESULT: 'conditionResult',
        AFFIXATION: 'affixation',
        ALIGNMENT: 'alignment',
        EVT_CTX: 'evtContext'
    });

    class StateContext extends Map {

        constructor(scene) {
            super();
            this._scene = scene;
        }

        get scene() {
            return this._scene;
        }

        var(name) {
            if (typeof name !== "string" || name.length === 0)
                throw new Error("state.var(...) expects a non-empty variable name");
            return {
                type: "stateVar",
                key: name,
                stateContext: this
            };
        }

        set(key, value) {
            const oldValue = this.get(key);
            super.set(key, value);
            if (oldValue !== value) {
                this._scene.depGraph.getVariable(VarType.STATE, key, this);
                this._scene.onChange(VarType.STATE, key, this);
            }
            return this;
        }
    }

    function getPeers(elem, container) {
    	
        let scene = getScene(elem);

    	// if (!scene._peerIndex) {
        //     scene._buildPeerIndex();
        // }

    	// Fallback for vertices/segments
        if (elem.type === "vertex" || elem.type === "segment") {
            return getPeers2(elem, container);
        }

    	if (!elem.classId) return [elem];


        //console.log("getPeers for", elem.classId, "in", container ? container.id : "no container");
        // Do not use index because any change in children order after the index is builtis not captured by the index
        // if (elem.classId && scene._peerIndex.has(elem.classId)) {
        //     let peers = scene._peerIndex.get(elem.classId);
    	// 	//console.log("Found peers in index:", peers.length);
        //     // Filter by container if specified
        //     return container ? peers.filter(p => isDescendantOf(p, container)) : peers;
        // }

        //return [elem];
    	let scope = container ? container : scene;
    	return findElements(scope, [{"property": "classId", "value": elem.classId}])
    }


    function getPeers2(elem, container) {
        let scene = getScene(elem),
    		scope = container ? container : scene;
        if (elem.type === "vertex") {
    		let parentPeers = findElements(scope, [{"property": "classId", "value": elem.parent.classId}], true);
    		return getPeerVertices(elem, parentPeers);
    	} else if (elem.type === "segment") {
    		let parentPeers = findElements(scope, [{"property": "classId", "value": elem.parent.classId}], true);
    		return getPeerSegments(elem, parentPeers);
        } else {
            return elem.classId ? findElements(scope, [{"property": "classId", "value": elem.classId}]) : [elem];
        }
    }

    function getPeerVertices(vertex, parentPeers) {
        if (vertex.classId) ; else if (vertex.dataScope) {
    		let parent = vertex.parent;
    		if (!parent)	throw new Error("vertex has no parent mark");
    		//let parentPeers = findItems(container, [{"property": "classId", "value": parent.classId}]);
    		let results = [];
    		if (parent.type === ElementType.Area) {
    			let idx = parent.vertices.indexOf(vertex), firstHalf = idx < parent.vertices.length/2;
    			for (let p of parentPeers) {
    				let vertices = firstHalf ? p.vertices.slice(0, p.vertices.length/2) : p.vertices.slice(p.vertices.length/2);
    				results = results.concat(vertices.filter(d => d.dataScope));
    			}
    		} else {
    			for (let p of parentPeers) {
    				results = results.concat(p.vertices.filter(d => d.dataScope));
    			}
    		}
    		return results;
    	} else {
    		let parent = vertex.parent;
    		if (!parent)	throw new Error("vertex has no parent mark");
    		let index = parent.vertices.indexOf(vertex);
    		//let parentPeers = findItems(container, [{"property": "classId", "value": parent.classId}]);
    		let results = [];
    		for (let p of parentPeers) {
    			results.push(p.vertices[index]);
    		}
    		return results;
    	}
    }

    function getVertexId(parent, index) {
    	return parent.id + "_v_" + parent._vertices._ids[index];
    }

    function getPeerVertexIndices(vertex, parentPeers) {
    	let parent = vertex.parent,
    		index = vertex._index,
    		dataScope = vertex.dataScope,
    		results = [];
    	if (dataScope) {
    		if (parent.type === ElementType.Area) {
    			let firstHalf = index < parent._vertices.length / 2;
    			for (let p of parentPeers) {
    				let start = firstHalf ? 0 : p._vertices.length / 2,
    					end = firstHalf ? p._vertices.length / 2 : p._vertices.length,
    					indices = [];
    				for (let i = start; i < end; i++) {
    					if (p._vertices.hasDataScope(i))
    						indices.push(i);
    				}
    				results.push({ parent: p, indices });
    			}
    		} else {
    			for (let p of parentPeers) {
    				let indices = [];
    				for (let i = 0; i < p._vertices.length; i++) {
    					if (p._vertices.hasDataScope(i))
    						indices.push(i);
    				}
    				results.push({ parent: p, indices });
    			}
    		}
    	} else {
    		for (let p of parentPeers) {
    			results.push({ parent: p, indices: [index] });
    		}
    	}
    	return results;
    }

    function getPeerSegments(segment, parentPeers) {
    	if (segment._dataScopeRef) {
    		let parent = segment.parent;
    		if (!parent)	throw new Error("segment has no parent mark");
    		//let parentPeers = findItems(container, [{"property": "classId", "value": parent.classId}]);
    		let results = [];
    		for (let p of parentPeers) {
    			results = results.concat(p.segments);
    		}
    		return results;
    	} else {
    		let parent = segment.parent;
    		if (!parent)	throw new Error("segment has no parent mark");
    		let index = parent.segments.indexOf(segment);
    		//let parentPeers = findItems(container, [{"property": "classId", "value": parent.classId}]);
    		let results = [];
    		for (let p of parentPeers) {
    			results.push(p.segments[index]);
    		}
    		return results;
    	}
    }

    function findElements(container, objs, includeVerticesSegments) {
        let result = [],
    		predicates = objs ? objs.map(d => obj2Predicate$1(d)) : [];
        findItemsRecursive(container, predicates, result, includeVerticesSegments);
        return result;
    }

    function findElementForAxis(scene, attr) {
    	let colls = scene.children.filter(d => d.type == ElementType.Collection);
    	if (colls.length === 0) return undefined;
    	for (let coll of colls) {
    		let elem = coll;
    		// let leafMarks = getLeafMarks(coll);
    		// for (let m of leafMarks) {
    		// 	if (m.dataScope && m.dataScope.tuples.length > 0 && (attr in m.dataScope.tuples[0]))
    		// 		return m;
    		// }
    		while (elem && elem.dataScope) {
    			if (scopeHasAttribute(elem.dataScope, attr))
    				return elem;
    			// if (elem.dataScope.tuples.length > 0 && attr in elem.dataScope.tuples[0])
    			// 	return elem;
    			else if (elem.children)
    				elem = elem.children[0];
    			else
    				elem = undefined;
    		}
    	}
    	return undefined;
    }

    function getClosestCollection(elem) {
    	if (elem.type == ElementType.Collection)
    		return elem;
    	else if (elem.parent)
    		return getClosestCollection(elem.parent);
    	else
    		return undefined;
    }

    function findItemsRecursive(itm, predicates, result, includeVerticesSegments) {
        if (!itm) return;
        //if (itm.type == "axis" || itm.type == "legend" || itm.type == "gridlines") return;
        if (matchCriteria(itm, predicates)) {
            result.push(itm);
        }

        if (itm.vertices && includeVerticesSegments) {
            for (let i of itm.vertices.concat(itm.segments)) {
                if (matchCriteria(i, predicates))
                    result.push(i);
            }
        } else if (itm.children && itm.children.length > 0) {
            for (let c of itm.children)
                findItemsRecursive(c, predicates, result, includeVerticesSegments);
        }
    }

    function getScene(elem) {
    	let p;
    	if (Array.isArray(elem)) {
    		p = elem[0];
    	} else {
    		p = elem;
    	}

    	if (!p) return undefined;

    	//state context
    	if (p instanceof StateContext) {
    		return p.scene;
    	}

    	// spec objects (BinningSpecification, KDESpecification, etc.) registered via scene.derive
    	if (p._scene) return p._scene;

    	// elem is a layout
    	if (isLayout(p) && p.group) {
    		p = p.group;
    	}

    	if (p.id.startsWith("encoding_")) {
    		p = p.element;
    	}

    	while (p) {
    		if (p.type == ElementType.Scene)
    			return p;
    		else
    			p = p.parent;
    	}
    }

    //get top level container for now
    function getTopLevelCollection(elem) {
        let c = elem;
    	if (c.type == "vertex" || c.type == "segment")
    		c = c.parent;
        while (c.parent && [ElementType.Collection, ElementType.Glyph].includes(c.parent.type)) {
            c = c.parent;
        }
        return c;
    }

    /** overlaps with mark.contains */
    // function contains(elem, x, y) {
    // 	switch (elem.type) {
    // 		case ElementType.Path:
    // 		case ElementType.Arc:
    // 		case ElementType.BezierCurve:
    // 		case ElementType.Line:{
    // 			let ctx = CanvasProvider.getContext(),
    // 				p = CanvasProvider.getPath2D(elem.getSVGPathData());
    // 			ctx.lineWidth = Math.max(elem.strokeWidth, 2.5);
    // 			ctx.stroke(p);
    // 			if (elem.closed) {
    // 				return ctx.isPointInPath(p, x, y);
    // 			} else {
    // 				return ctx.isPointInStroke(p, x, y);
    // 			}
    // 		}
    // 		case ElementType.Circle: {
    // 			let cx = elem.x, cy = elem.y;
    // 			if (elem.rotation) {
    // 				let np = rotatePoint(cx, cy, elem.rotation[1], elem.rotation[2], elem.rotation[0]);
    // 				cx = np.x, cy = np.y;
    // 			}
    // 			let dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    // 			return dist <= elem.radius + elem.strokeWidth;
    // 		}
    // 		default:
    // 			return elem.bounds.contains(x, y);
    // 	}
    // }

    function getLeafMarks(elem, uniqueClassIDs) {
    	let result = [];
    	_getLeafMarks(elem, result);
    	if (!uniqueClassIDs)
    		return result;
    	else {
    		let temp = {};
    		for (let r of result)
    			temp[r.classId] = r;
    		return Object.values(temp);
    	}
    }

    function _getLeafMarks(elem, result) {
    	if (isMark(elem)) {
    		result.push(elem);
    	} else if (elem.children) {
    		if (!Object.values(refElementTypes).includes(elem.type)) {
    			for (let c of elem.children)
    				_getLeafMarks(c, result);
    		}
    	}
    	
    	// else if (elem.type == ElementType.Collection && elem.children) {
    	// 	for (let c of elem.children)
    	// 		_getLeafMarks(c, result);
    	// } else if (elem.type == ElementType.Glyph && elem.children) {
    	// 	for (let c of elem.children)
    	// 		_getLeafMarks(c, result);
    	// } else if (elem.type == ElementType.Composite && elem.children) {
    	// 	for (let c of elem.children)
    	// 		_getLeafMarks(c, result);
    	// }
    }

    function getAncestors(elem) {
    	let e = elem.parent, ancestors = [];
    	while (e.type !== ElementType.Scene) {
    		ancestors.push(e);
    		e = e.parent;
    	}
    	return ancestors;
    }

    // export function getLinkCollection(nodeColl) {
    // 	let nodeMk = nodeColl.children[0],
    // 		links = nodeMk.links;
    // 	return getPeers(links[0]);
    // }

    class ChannelVar extends Variable {
        constructor(type, channel, elem) {
            super(type);
            this._channel = channel;
            this._elem = elem;
        }

        get channel() {
            return this._channel;
        }

        get element() {
            return this._elem;
        }
    }

    const Channels = Object.freeze({
        X: 'x',
        Y: 'y',
        WIDTH: 'width',
        HEIGHT: 'height',
        RADIUS: 'radius',
        FILLCOLOR: 'fillColor',
        STROKECOLOR: 'strokeColor',
        FILLGRADIENT: 'fillGradient',
        TEXT: 'text',
        ANGLE: 'angle',
        THICKNESS: 'thickness',
        AREA: 'area',
        FONTSIZE: "fontSize",
        RADIALDISTANCE: "radialDistance",
        STROKEWIDTH: "strokeWidth",
        OPACITY: "opacity",
        VISIBILITY: "visibility",
        STRENGTH: "strength",
        SRC: "src",
        Z: "z"
    });

    class PropertyVar extends Variable {
        constructor(type, property, elem) {
            super(type);
            this._property = property;
            this._elem = elem;
        }

        get property() {
            return this._property;
        }

        get element() {
            return this._elem;
        }
    }

    function getProperty(prop) {
        return prop in PropertyMap ? PropertyMap[prop] : prop;
    }

    //TODO: complete the map
    const PropertyMap = Object.freeze({
        "numCols": "layoutParameter",
        "numRows": "layoutParameter",
        "startCorner": "layoutParameter",
        "direction": "layoutParameter"
    });

    //these are supposed to be property names to be used for creating PropertyVars
    //multiple properties (e.g., all layout parameters) should be mapped to one propery name ("layoutParameter") to reduce the size of the graph
    const Properties = Object.freeze({
        AXIS_ORIENTATION: 'axisOrientation',
        AXIS_PATH_POSITION: 'axisPathPosition',
        AXIS_TICK_SIZE: 'axisTickSize',
        AXIS_TICK_OFFSET: 'axisTickOffset',
        AXIS_TICKS_POSITION: 'axisTicksPosition',
        AXIS_LABELS_POSITION: 'axisLabelsPosition',
        AXIS_TITLE_POSITION: 'axisTitlePosition',
        AXIS_LABEL_OFFSET: 'axisLabelOffset',
        AXIS_LABEL_FORMAT: 'axisLabelFormat',
        AXIS_FONT_SIZE: 'axisFontSize',
        LEGEND_POSITION: 'legendPosition',
        GRIDLINES_POSITION: 'gridlinesPosition',
        INCLUDE_ZERO: 'includeZero',
        FLIP_SCALE: 'flipScale',
        RANGE_START: 'rangeStart',
        RANGE_EXTENT: 'rangeExtent',
        BASE_LINE: 'baseline',
        LAYOUT_PARAMETER: "layoutParameter",
        NUM_BINS: "numBins",
        CHILDREN_ORDER: 'childrenOrder',
        ATTRIBUTE: "attribute"
    });

    function clearInteractionCaches(elem) {
        let scene = elem ? getScene(elem) : undefined;
        if (scene && scene._clearInteractionCaches)
            scene._clearInteractionCaches();
    }

    //to move to createElement.js
    function newMarkCreated(m, dg) {
        clearInteractionCaches(m);
        let v = dg.findVariable(VarType.BOUNDS, [m]);
        if (v) return;
        let b = dg.getVariable(VarType.BOUNDS, m),
            bbox = dg.createOneWayDependency(OpType.EVAL_BBOX);
        //rb = rt.getVariable(VarType.REF_BOUNDS, m),
        //rbbox = rt.createOneWayDependency(OpType.EVAL_REFBOUNDS);
        dg.connect(bbox, b);
        //rt.connect(b, rbbox);
        //rt.connect(rbbox, rb);
        switch (m.type) {
            case ElementType.Circle:
            case ElementType.Polygon: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    r = dg.getVariable(VarType.CHANNEL, "radius", m),
                    a = dg.getVariable(VarType.CHANNEL, "area", m);
                // bbox = rt.createOneWayDependency(OpType.EVALBBOX, [x, y, r], b);
                dg.connect(r, bbox);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(a, bbox);
                break;
            }
            case ElementType.Area:
            case ElementType.Line:
            case ElementType.BezierCurve:
            case ElementType.Path:
            case ElementType.Image: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    w = dg.getVariable(VarType.CHANNEL, "width", m),
                    h = dg.getVariable(VarType.CHANNEL, "height", m);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(w, bbox);
                dg.connect(h, bbox);
                break;
            }
            case ElementType.Rect: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    w = dg.getVariable(VarType.CHANNEL, "width", m),
                    h = dg.getVariable(VarType.CHANNEL, "height", m),
                    a = dg.getVariable(VarType.CHANNEL, "area", m);
                // bbox = rt.createOneWayDependency(OpType.EVALBBOX, [x, y, r], b);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(w, bbox);
                dg.connect(h, bbox);
                dg.connect(a, bbox);
                break;
            }
            case ElementType.SimpleText:
            case ElementType.RichText: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    t = dg.getVariable(VarType.CHANNEL, "text", m);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(t, bbox);
                break;
            }
            case ElementType.Ring: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    ir = dg.getVariable(VarType.CHANNEL, "innerRadius", m),
                    or = dg.getVariable(VarType.CHANNEL, "outerRadius", m);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(ir, bbox);
                dg.connect(or, bbox);
                break;
            }
            case ElementType.Pie:
            case ElementType.Arc: {
                let x = dg.getVariable(VarType.CHANNEL, "x", m),
                    y = dg.getVariable(VarType.CHANNEL, "y", m),
                    ir = dg.getVariable(VarType.CHANNEL, "innerRadius", m),
                    or = dg.getVariable(VarType.CHANNEL, "outerRadius", m),
                    sa = dg.getVariable(VarType.CHANNEL, "startAngle", m),
                    ea = dg.getVariable(VarType.CHANNEL, "endAngle", m),
                    av = dg.getVariable(VarType.CHANNEL, "angle", m),
                    tv = dg.getVariable(VarType.CHANNEL, "thickness", m);
                dg.connect(x, bbox);
                dg.connect(y, bbox);
                dg.connect(ir, bbox);
                dg.connect(or, bbox);
                dg.connect(sa, bbox);
                dg.connect(ea, bbox);
                dg.connect(av, bbox);
                dg.connect(tv, bbox);
                break;
            }
        }
        bbox.run();
    }

    function elementRemoved(elem, dg) {
        clearInteractionCaches(elem);
        let varsByType = dg.findVariablesByElement(elem);
        for (let t in varsByType) {
            let vars = varsByType[t];
            for (let v of vars) {
                dg.deleteVariable(v);
            }
        }
    }

    function encodingRemoved(enc, dg) {
        let ev = dg.findVariable(VarType.CHANNEL, [enc.channel, enc.element]);
        if (!ev) console.warn("cannot find encoding to remove from the dep graph");
        let op = ev.incomingDataflow;
        dg.deleteOperator(op);
        // for (let i = ev.incomingEdges.length - 1; i >= 0; i--) {
        //     let e = ev.incomingEdges[i], fn = e.fromNode;
        //     if (fn.type === OpType.ENCODER) {
        //         rt.disconnect(fn, ev, e);
        //         for (let j = fn.inputVars.length - 1; j >=0; j--) {
        //             let iv = fn.inputVars[j],
        //                 ed = iv.outgoingEdges.find(d => d.fromNode === iv && d.toNode === fn);
        //             rt.disconnect(iv, fn, ed);
        //         }
        //         delete rt._operators[fn.type][fn.id];
        //     }
        // }
    }

    function refElementRemoved(re, dg) {
        if (re.type === ElementType.Axis) {
            let op = dg.findVariable(VarType.PROPERTY, [Properties.AXIS_PATH_POSITION, re]).incomingDataflow;
            console.log(op, re);
            dg.deleteOperator(op);
            op = dg.findVariable(VarType.PROPERTY, [Properties.AXIS_TICKS_POSITION, re]).incomingDataflow;
            dg.deleteOperator(op);
            op = dg.findVariable(VarType.PROPERTY, [Properties.AXIS_LABELS_POSITION, re]).incomingDataflow;
            dg.deleteOperator(op);
            op = dg.findVariable(VarType.PROPERTY, [Properties.AXIS_TITLE_POSITION, re]).incomingDataflow;
            dg.deleteOperator(op);
        } else if (re.type === ElementType.Gridlines) {
            let op = dg.findVariable(VarType.PROPERTY, [Properties.GRIDLINES_POSITION, re]).incomingDataflow;
            dg.deleteOperator(op);
        }
    }

    // export function parentChanged(elem, oldParent, newParent, rt) {
    //     let eb = rt.getVariable(VarType.BOUNDS, elem),
    //         opb =  rt.getVariable(VarType.BOUNDS, oldParent);
    //         //npb =  rt.getVariable(VarType.BOUNDS, newParent);
    //     let op = opb.incomingDataflow;
    //     if (op && op.type == OpType.EVAL_BBOX) {
    //         let inVars = op.inputVars;
    //         for (let v of inVars) {
    //             if (v instanceof BoundsVar && v == eb) {
    //                 rt.disconnect(v, op);
    //                 break;
    //             }
    //         }
    //     }
    //     if (newParent) {
    //         //TODO:
    //     }
    // }

    function newCollectionCreated(coll, dg) {
        clearInteractionCaches(coll);
        let v = dg.findVariable(VarType.BOUNDS, [coll]);
        if (v) return;
        //bbox of collection depends on its x, y, wd, ht, as well as its children's bbox
        let b = dg.getVariable(VarType.BOUNDS, coll),
            x = dg.getVariable(VarType.CHANNEL, "x", coll),
            y = dg.getVariable(VarType.CHANNEL, "y", coll),
            w = dg.getVariable(VarType.CHANNEL, "width", coll),
            h = dg.getVariable(VarType.CHANNEL, "height", coll),
            //eb = rt.getVariable(VarType.BOUNDS, elem),
            bbox = dg.createOneWayDependency(OpType.EVAL_BBOX);
        //rt.connect(eb, bbox);
        dg.connect(x, bbox);
        dg.connect(y, bbox);
        dg.connect(w, bbox);
        dg.connect(h, bbox);
        dg.connect(bbox, b);
        bbox.run();
    }

    function newCompositeCreated(cpst, dg) {
        clearInteractionCaches(cpst);
        //bbox of collection depends on its x, y, wd, ht, as well as its children's bbox
        let b = dg.getVariable(VarType.BOUNDS, cpst),
            x = dg.getVariable(VarType.CHANNEL, "x", cpst),
            y = dg.getVariable(VarType.CHANNEL, "y", cpst),
            w = dg.getVariable(VarType.CHANNEL, "width", cpst),
            h = dg.getVariable(VarType.CHANNEL, "height", cpst),
            bbox = dg.createOneWayDependency(OpType.EVAL_BBOX);
        dg.connect(x, bbox);
        dg.connect(y, bbox);
        dg.connect(w, bbox);
        dg.connect(h, bbox);
        dg.connect(bbox, b);
        bbox.run();
    }

    function childRemoved(parent, child, dg) {
        clearInteractionCaches(parent);
        //TODO: verify if the following can be deleted
        let pb = dg.getVariable(VarType.BOUNDS, parent),
            cb = dg.getVariable(VarType.BOUNDS, child),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, pb),
            e = cb.outgoingEdges.find(d => d.fromNode === cb && d.toNode === bbox);

        if (e) {
            dg.disconnect(cb, bbox, e);
        }

        // let pw = rt.getVariable(VarType.CHANNEL, "width", parent),
        //     ph = rt.getVariable(VarType.CHANNEL, "height", parent);
        // let cond1 = rt.getIncomingDataflowOperator(OpType.CONDUIT, pw),
        //     cond2 = rt.getIncomingDataflowOperator(OpType.CONDUIT, ph);
        // if (cond1)
        //     rt.deleteOperator(cond1);
        // if (cond2)
        //     rt.deleteOperator(cond2);

        if (parent.layout) {
            let cx = dg.getVariable(VarType.CHANNEL, "x", child),
                layoutOp = dg.getIncomingDataflowOperator(getLayoutOpType(parent.layout.type), cx);
            if (layoutOp)
                dg.deleteOperator(layoutOp);
        }
    }

    function parentChildConnected(parent, child, dg) {
        clearInteractionCaches(parent);
        let pb = dg.getVariable(VarType.BOUNDS, parent),
            cb = dg.getVariable(VarType.BOUNDS, child),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, pb);
        dg.connect(cb, bbox);
        dg.connect(bbox, pb);

        if (parent.layout) {
            layoutSpecified(parent, parent.layout, dg);
            // //TODO: add layout stuff 
            // let cx = rt.getVariable(VarType.CHANNEL, "x", child),
            //     cy = rt.getVariable(VarType.CHANNEL, "y", child),
            //     cw = rt.getVariable(VarType.CHANNEL, "width", child),
            //     ch = rt.getVariable(VarType.CHANNEL, "height", child),
            //     opType = getLayoutOpType(parent.layout.type),
            //     eo;
            // if (cx.incomingDataflow && cx.incomingDataflow.type == opType) {
            //     eo = cx.incomingDataflow;
            // } else {
            //     eo = rt.createOneWayDependency(opType);
            //     rt.connect(cw, eo);
            //     rt.connect(ch, eo);
            //     rt.connect(eo, cx);
            //     rt.connect(eo, cy);
            // }
            // let pp = parent.parent;
            // if (pp && pp.layout) {
            //     let ppx = rt.getVariable(VarType.CHANNEL, "x", pp),
            //         pplo = ppx.incomingDataflow;
            //     if (pplo)
            //         rt.connect(cb, pplo);
            // }
        }
    }

    function newGlyphCreated(g, dg) {
        clearInteractionCaches(g);
        let gb = dg.getVariable(VarType.BOUNDS, g),
            x = dg.getVariable(VarType.CHANNEL, "x", g),
            y = dg.getVariable(VarType.CHANNEL, "y", g),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, gb);
        dg.connect(x, bbox);
        dg.connect(y, bbox);
        for (let c of g.children) {
            dg.connect(dg.getVariable(VarType.BOUNDS, c), bbox);
        }
        dg.connect(bbox, gb);
        bbox.run();
    }

    function getLayoutOpType(layoutType) {
        switch (layoutType) {
            case LayoutType.GRID:
                return OpType.GRID_LAYOUT;
            case LayoutType.STACK:
                return OpType.STACK_LAYOUT;
            case LayoutType.PACKING:
                return OpType.PACK_LAYOUT;
            case LayoutType.FORCE:
                return OpType.FORCE_LAYOUT;
            case LayoutType.DIRECTED:
                return OpType.DIRECTED_LAYOUT;
            case LayoutType.TIDYTREE:
                return OpType.TIDY_TREE_LAYOUT;
            case LayoutType.TREEMAP:
                return OpType.TREEMAP_LAYOUT;
            case LayoutType.STRATA:
                return OpType.STRATA_LAYOUT;
            case LayoutType.CIRCULAR:
                return OpType.CIRCULAR_LAYOUT;
            case LayoutType.CLUSTER:
                return OpType.CLUSTER_LAYOUT;
        }
    }

    // function getEncoderType(channel) {
    //     switch (channel) {
    //         case 'x':
    //             return OpType.X_ENCODER;
    //         case 'y':
    //             return OpType.Y_ENCODER;
    //         case 'fillColor':
    //             return OpType.COLOR_ENCODER;
    //         case 'opacity':
    //             return OpType.OPACITY_ENCODER;
    //         default:
    //             return OpType.ENCODE;
    //     }
    // }

    function layoutRemoved(group, layout, dg) {
        let ov = dg.getVariable(VarType.PROPERTY, Properties.CHILDREN_ORDER, group),
            eo = dg.getOutgoingDataflowOperator(getLayoutOpType(layout.type), ov);
        dg.deleteOperator(eo);
    }


    function layoutSpecified(group, layout, dg) {
        let type = layout ? layout.type : "none",
            child = type === LayoutType.TREEMAP ? getLeafMarks(group)[0] : group.children[0]; //LayoutType.STRATA ? group.children[1] : 
        if (!child) return;
        let wv = dg.getVariable(VarType.CHANNEL, "width", child),
            hv = dg.getVariable(VarType.CHANNEL, "height", child),
            ov = dg.getVariable(VarType.PROPERTY, Properties.CHILDREN_ORDER, group),
            xv = dg.getVariable(VarType.CHANNEL, "x", child),
            yv = dg.getVariable(VarType.CHANNEL, "y", child),
            vv = dg.getVariable(VarType.CHANNEL, "visibility", child),
            lpv = dg.getVariable(VarType.PROPERTY, Properties.LAYOUT_PARAMETER, layout);
        let eo = dg.getOutgoingDataflowOperator(getLayoutOpType(type), ov);

        // let sp = dg.getVariable(VarType.PROPERTY, Properties.ELEMENT_FILTERS, getScene(group));
        //     dg.connect(sp, eo);

        dg.connect(wv, eo);
        dg.connect(hv, eo);
        dg.connect(ov, eo);
        dg.connect(lpv, eo);
        dg.connect(vv, eo);
        //dg.connect(ipv, eo);
        dg.connect(eo, xv);
        dg.connect(eo, yv);
        dg.disconnectChannelVarFromBBoxOperator(wv);
        dg.disconnectChannelVarFromBBoxOperator(hv);
        if (child.type === ElementType.Arc || child.type === ElementType.Pie) {
            let av = dg.getVariable(VarType.CHANNEL, "angle", child),
                tv = dg.getVariable(VarType.CHANNEL, "thickness", child);
            dg.connect(av, eo);
            dg.connect(tv, eo);
        } else if (child.type === ElementType.Circle) {
            let av = dg.getVariable(VarType.CHANNEL, "area", child),
                rv = dg.getVariable(VarType.CHANNEL, "radius", child);
            dg.connect(av, eo);
            dg.connect(rv, eo);
            dg.disconnectChannelVarFromBBoxOperator(av);
            dg.disconnectChannelVarFromBBoxOperator(rv);
        } else if (child.type === ElementType.Rect) {
            let av = dg.getVariable(VarType.CHANNEL, "area", child);
            dg.connect(av, eo);
            dg.disconnectChannelVarFromBBoxOperator(av);
        }
        eo.run();

        //links
        if (child.links) {
            // let link = child.links[0]; //TODO: handle isolated nodes
            // let lxv = rt.getVariable(VarType.CHANNEL, "x", link),
            //     lwv = rt.getVariable(VarType.CHANNEL, "strokeWidth", link),
            //     lsv = rt.getVariable(VarType.CHANNEL, "strength", link),
            //     lop = rt.createOneWayDependency(OpType.LINK_PLACER);
            // rt.connect(xv, lop);
            // rt.connect(lwv, lop);
            // rt.connect(lsv, lop);
            // rt.connect(lop, lxv);
            nodeLinkConnected(child, dg);
        }

        // connect grand child's bounding box to the layout operator, doesn't matter if child collection has layout or internal encodings
        if (child.children && child.children[0]) { //&& child.layout
            let eb = dg.getVariable(VarType.BOUNDS, child.children[0]),
                px = dg.getVariable(VarType.CHANNEL, "x", child),
                lo = px.incomingDataflow;
            if (lo)
                dg.connect(eb, lo);
            dg.disconnectChannelVarFromBBoxOperator(eb);
        }
    }

    function nodeLinkConnected(node, dg) {
        //TODO: check if already connected
        let link = node.links[0]; //TODO: handle isolated nodes
        let xv = dg.getVariable(VarType.CHANNEL, "x", node);
        let lxv = dg.getVariable(VarType.CHANNEL, "x", link),
            lwv = dg.getVariable(VarType.CHANNEL, "strokeWidth", link),
            lsv = dg.getVariable(VarType.CHANNEL, "strength", link),
            lop = dg.createOneWayDependency(OpType.LINK_PLACER);
        dg.connect(xv, lop);
        dg.connect(lwv, lop);
        dg.connect(lsv, lop);
        dg.connect(lop, lxv);
    }

    function interactionSpecified(evtCtx, condEnc, responder, dg, trigger) {
        let compnt = condEnc.responderComponent;
        // let compnt = Array.isArray(c) ? c : [c];

        let tv = trigger && trigger.source && trigger.source.type === "stateVar" ?
            dg.getVariable(VarType.STATE, trigger.source.key, trigger.source.stateContext) :
            dg.getVariable(VarType.EVT_CTX, evtCtx);
        let props = responder.properties ? responder.properties : responder.channels;

        if (condEnc.evalFunction) {
            let pv = dg.getVariable(VarType.CONDITION_RESULT, condEnc),
                evalOp = dg.findIncomingDataflowOperator(OpType.TARGET_EVALUATOR, pv);
            if (!evalOp) {
                evalOp = dg.createOneWayDependency(OpType.TARGET_EVALUATOR, condEnc.evalFunction);
            }
            dg.connect(tv, evalOp);
            dg.connect(evalOp, pv);
            //compnt can be an array, see splom demo
            for (let channel of props) {
                let items = Array.isArray(compnt) ? compnt : [compnt];
                for (let item of items) {
                    let cv = dg.getVariable(VarType.CHANNEL, channel, item),
                    df = cv.incomingDataflow;
                    if (df && df.type === OpType.ENCODER && df.outputVar.channel === channel) {
                        dg.connect(pv, df);
                    } else if (!df) {
                        let eo = dg.createOneWayDependency(OpType.ENCODER);
                        dg.connect(pv, eo);
                        dg.connect(eo, cv);
                        eo.storeValues(item, channel);
                    }
                }
            }
        } else {
            //compnt can be an array, se bubble chart
            let eo = dg.createOneWayDependency(OpType.TARGET_UPDATER, condEnc.stylingFunction, compnt);
            for (let prop of props) {
                let cv;
                if (compnt instanceof StateContext)
                    cv = dg.getVariable(VarType.STATE, prop, compnt);
                else if (Object.values(Channels).includes(prop))
                    cv = dg.getVariable(VarType.CHANNEL, prop, compnt);
                else
                    cv = dg.getVariable(VarType.PROPERTY, getProperty(prop), compnt);
                dg.connect(tv, eo);
                dg.connect(eo, cv);
            }
        }

    }

    /**
     * If `elem` is a segment, connect the RepopulateOperator (if any) that drives
     * the parent collection to `dsv` (DataScopeVar for the segment).  This ensures
     * that the segment's DataExtractor re-runs whenever the collection is
     * repopulated (e.g. during dynamic binning or brush-driven crossfilter updates).
     */
    function wireRepopulateToSegmentDsv(elem, dsv, dg) {
        if (!elem || elem.type !== "segment") return;
        let table = getDataTable(elem),
            iv = table ? dg.findVariable(VarType.ITEMS, [table]) : null;
        if (!iv) return;
        for (let e of iv.outgoingEdges) {
            if (e.isDirected && e.toNode.type === OpType.REPOPULATE) {
                dg.connect(e.toNode, dsv);
                return;
            }
        }
    }

    function encodingSpecified(enc, dg, baseEnc) {
        let attr = enc.attribute,
            channel = enc.channel,
            elem = enc.element;

        let eo = dg.createOneWayDependency(OpType.ENCODER);
        if (["width", "height"].includes(enc.channel) && elem.type === ElementType.Area) {
            let bv = dg.getVariable(VarType.PROPERTY, Properties.BASE_LINE, elem);
            dg.connect(bv, eo);
        }

        //TODO: handle more cases:
        // if (elem.type == "segment" && elem.parent.type == ElementType.Rect) {

        // }
        if (baseEnc) {
            let dv = dg.getVariable(VarType.ATTR_VALUE, baseEnc),
                sv = dg.getVariable(VarType.SCALE, baseEnc),
                ecv = dg.getVariable(VarType.CHANNEL, channel, elem);
            //rt.connect(dv, eo);
            dg.connect(sv, eo);
            dg.connect(eo, ecv);

            dv.addLinkedEncoding(enc);
            sv.addLinkedEncoding(enc);

            // Wire this encoding's DataScopeVar into the shared DataExtractor so that
            // when this element's data changes (e.g. from a custom transform), the
            // DataExtractor re-runs and recomputes attrValues for this encoding.
            let sds = dg.getVariable(VarType.DATASCOPE, enc.element),
                de = dv.incomingDataflow;
            if (de && sds) {
                dg.connect(sds, de);
                // If encoding a segment, also wire RepopulateOperator → sds so the
                // DataExtractor re-runs when the collection is repopulated.
                wireRepopulateToSegmentDsv(enc.element, sds, dg);
            }

            dv.incomingDataflow.run();
            //rv.incomingDataflow.run();
        } else {
            // Domain Builder Operator
            let fv = dg.getVariable(VarType.ATTRIBUTE, attr, getDataTable(elem), enc), // enc → fresh var per encoding
                pv = dg.getVariable(VarType.PROPERTY, Properties.INCLUDE_ZERO, enc),
                dv = dg.getVariable(VarType.ATTR_VALUE, enc),
                dsv = dg.getVariable(VarType.DATASCOPE, elem),
                de = dg.createOneWayDependency(OpType.DATA_EXTRACTOR);
            dg.connect(fv, de);
            dg.connect(pv, de);
            dg.connect(dsv, de);
            dg.connect(de, dv);
            // If encoding a segment, also wire RepopulateOperator → dsv so the
            // DataExtractor re-runs when the collection is repopulated.
            wireRepopulateToSegmentDsv(elem, dsv, dg);
            de.run();

            //connect to scene property
            // if (["width", "height", "x", "y", "area", "radius"].includes(enc.channel)) {
            //     let sp = dg.getVariable(VarType.PROPERTY, Properties.ELEMENT_FILTERS, getScene(elem));
            //     dg.connect(sp, db);
            // }

            // Scale Builder Operator
            let cv = dg.getVariable(VarType.PROPERTY, Properties.RANGE_START, enc),
                rev = dg.getVariable(VarType.PROPERTY, Properties.RANGE_EXTENT, enc),
                fsv = dg.getVariable(VarType.PROPERTY, Properties.FLIP_SCALE, enc),
                sv = dg.getVariable(VarType.SCALE, enc),
                sb = dg.createOneWayDependency(OpType.SCALE_BUILDER);
            dg.connect(cv, sb);
            dg.connect(rev, sb);
            dg.connect(fsv, sb);
            dg.connect(dv, sb);
            dg.connect(sb, sv);
            sb.run();

            //TODO: check if an encoder has already been created based on predicate-based encoding triggered by interaction
            let ecv = dg.getVariable(VarType.CHANNEL, channel, elem);
            //rt.connect(dv, eo);
            dg.connect(sv, eo);
            dg.connect(eo, ecv);
            eo.run();
        }
    }

    function affixationSpecified(affx, dg) {
        let av = dg.getVariable(VarType.AFFIXATION, affx),
            op = dg.getOutgoingDataflowOperator(OpType.AFFIXER, av);
        dg.connect(av, op);
        //rt.createOneWayDependency(OpType.AFFIXER),
        for (let channel of affx.channels) {
            let ec = dg.getVariable(VarType.CHANNEL, channel, affx.element),
                bc = dg.getVariable(VarType.CHANNEL, channel, affx.base);
            dg.connect(bc, op);
            dg.connect(op, ec);
        }

        op.run();
    }

    function alignmentSpecified(aln, dg) {
        //TODO: check if the elements can be aligned
        let op = dg.createMultiWayDependency(OpType.ALIGNER),
            av = dg.getVariable(VarType.ALIGNMENT, aln);
        dg.connect(av, op);
        for (let elem of aln.elements) {
            let v = dg.getVariable(VarType.CHANNEL, aln.channel, elem);
            dg.connect(v, op);
        }
        op.run();
    }

    function layoutAxisSpecified(axis, dg) {
        let ov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_ORIENTATION, axis),
            cv = dg.getVariable(VarType.BOUNDS, axis.elements[0].parent),
            pv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis),
            pp = dg.createOneWayDependency(OpType.AXIS_PATH_PLACER);
        //TODO: axis path position also depends on the layout parameters
        dg.connect(ov, pp);
        dg.connect(cv, pp);
        dg.connect(pp, pv);
        pp.run();

        let tov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_OFFSET, axis),
            tsv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_SIZE, axis),
            tp = dg.createOneWayDependency(OpType.AXIS_TICKS_PLACER),
            tpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICKS_POSITION, axis);
        dg.connect(pv, tp);
        dg.connect(tov, tp);
        dg.connect(tsv, tp);
        dg.connect(tp, tpv);
        tp.run();

        let lov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_OFFSET, axis),
            lfv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_FORMAT, axis),
            afv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_FONT_SIZE, axis),
            lp = dg.createOneWayDependency(OpType.AXIS_LABELS_PLACER),
            lpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABELS_POSITION, axis);
        dg.connect(pv, lp);
        dg.connect(lov, lp);
        dg.connect(lfv, lp);
        dg.connect(afv, lp);
        dg.connect(lp, lpv);
        lp.run();

        let tlpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TITLE_POSITION, axis),
            tlp = dg.createOneWayDependency(OpType.AXIS_TITLE_PLACER);
        dg.connect(pv, tlp);
        dg.connect(tlp, tlpv);
        tlp.run();

        let ab = dg.getVariable(VarType.BOUNDS, axis),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, ab);
        dg.connect(tpv, bbox);
        dg.connect(lpv, bbox);
        dg.connect(bbox, ab);
    }

    function legendSpecified(legend, dg) {
        let lbv = dg.getVariable(VarType.BOUNDS, legend),
            lpv = dg.getVariable(VarType.PROPERTY, Properties.LEGEND_POSITION, legend),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, lbv);
        dg.connect(lpv, bbox);
        dg.connect(bbox, lbv);
    }

    function encodingAxisCreated(axis, dg) {
        let ov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_ORIENTATION, axis),
            cv = dg.getVariable(VarType.BOUNDS, getTopLevelCollection(axis.elements[0])),
            pv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis),
            pp = dg.createOneWayDependency(OpType.AXIS_PATH_PLACER);
        //TODO: axis path position also depends on the scale range, e.g., scatter plot starting from 0
        dg.connect(ov, pp);
        dg.connect(cv, pp);
        dg.connect(pp, pv);
        pp.run();

        let tov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_OFFSET, axis),
            tsv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_SIZE, axis),
            tp = dg.createOneWayDependency(OpType.AXIS_TICKS_PLACER),
            tpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TICKS_POSITION, axis);
        dg.connect(pv, tp);
        dg.connect(tov, tp);
        dg.connect(tsv, tp);
        dg.connect(tp, tpv);
        tp.run();

        let lov = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_OFFSET, axis),
            lfv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_FORMAT, axis),
            afv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_FONT_SIZE, axis),
            lp = dg.createOneWayDependency(OpType.AXIS_LABELS_PLACER),
            lpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_LABELS_POSITION, axis);
        dg.connect(pv, lp);
        dg.connect(lov, lp);
        dg.connect(lfv, lp);
        dg.connect(afv, lp);
        dg.connect(lp, lpv);
        lp.run();

        let tlpv = dg.getVariable(VarType.PROPERTY, Properties.AXIS_TITLE_POSITION, axis),
            tlp = dg.createOneWayDependency(OpType.AXIS_TITLE_PLACER);
        dg.connect(pv, tlp);
        dg.connect(tlp, tlpv);
        tlp.run();

        let ab = dg.getVariable(VarType.BOUNDS, axis),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, ab);
        dg.connect(tpv, bbox);
        dg.connect(lpv, bbox);
        dg.connect(bbox, ab);
    }

    function gridlinesCreated(gl, dg) {
        let cv = dg.getVariable(VarType.BOUNDS, getTopLevelCollection(gl.elements[0])),
            pv = dg.getVariable(VarType.PROPERTY, Properties.GRIDLINES_POSITION, gl),
            pp = dg.createOneWayDependency(OpType.GRIDLINES_PLACER);

        dg.connect(cv, pp);
        dg.connect(pp, pv);
        pp.run();

        let gb = dg.getVariable(VarType.BOUNDS, gl),
            bbox = dg.getIncomingDataflowOperator(OpType.EVAL_BBOX, gb);
        dg.connect(pv, bbox);
        dg.connect(bbox, gb);
    }

    function binningSpecified(args, tbl, outTbl, dg) {
        let inV = dg.getVariable(VarType.ITEMS, tbl),
            outV = dg.getVariable(VarType.ITEMS, outTbl),
            dt = dg.createOneWayDependency(OpType.BIN_TRANSFORMER);
        dg.connect(inV, dt);
        //dg.connect(dt, nds);
        dg.connect(dt, outV);
        let pv = dg.getVariable(VarType.PROPERTY, Properties.NUM_BINS, args);
        dg.connect(pv, dt);
        dt._binConfig = args;
        dt.run();
    }

    function kdeSpecified(spec, tbl, outTbl, dg) {
        let ds = dg.getVariable(VarType.ATTRIBUTE, spec.attribute, tbl),
            nds = dg.getVariable(VarType.ATTRIBUTE, spec.newAttribute, outTbl),
            outV = dg.getVariable(VarType.ITEMS, outTbl),
            dt = dg.createOneWayDependency(OpType.KDE_TRANSFORMER);
        dt.args = spec;
        dg.connect(ds, dt);
        dg.connect(dt, nds);
        dg.connect(dt, outV);
        dt.run();
    }

    function customTransformSpecified(spec, inTbl, outTbl, dg) {
        let inV = dg.getVariable(VarType.ITEMS, inTbl),
            outV = dg.getVariable(VarType.ITEMS, outTbl),
            op = dg.createOneWayDependency(OpType.CUSTOM_TRANSFORMER);
        op._spec = spec;
        dg.connect(inV, op);
        dg.connect(op, outV);
        // Params are stored as direct enumerable non-internal properties on spec.
        for (let key of Object.keys(spec)) {
            if (key.startsWith('_')) continue;
            let pv = dg.getVariable(VarType.PROPERTY, key, spec);
            dg.connect(pv, op);
        }
        op.run();
    }

    function filteringSpecified(spec, inTbl, outTbl, dg) {
        let inV = dg.getVariable(VarType.ITEMS, inTbl),
            outV = dg.getVariable(VarType.ITEMS, outTbl),
            op = dg.createOneWayDependency(OpType.FILTER_TRANSFORMER);
        op._spec = spec;
        dg.connect(inV, op);
        dg.connect(op, outV);
        // Wire PropertyVar("value", spec) so FilterTransformer re-runs when spec.value changes
        // (analogous to PropertyVar(NUM_BINS) wired to BinTransformer).
        let pv = dg.getVariable(VarType.PROPERTY, "value", spec);
        dg.connect(pv, op);
        op.run();
    }

    /**
     * Create a RepopulateOperator for a densified area when no prior msc.repeat
     * put one on the source table's ITEMS var. Called from densify() after
     * rewireRepopulateOperator() returns (with nothing to rewire).
     *
     * Graph shape after this call:
     *   ItemsVar(table) → RepopulateOperator._area → DataScopeVar(area)
     *                                               → DataScopeVar(vertex[0])
     */
    function densifySpecified(area, attr, table, dg) {
        let iv = dg.findVariable(VarType.ITEMS, [table]);
        if (!iv) return;
        // If rewireRepopulateOperator already attached a RepopulateOperator, skip.
        for (let e of iv.outgoingEdges) {
            if (e.isDirected && e.toNode.type === OpType.REPOPULATE) return;
        }
        let rp = dg.createOneWayDependency(OpType.REPOPULATE);
        rp._area = area;
        rp._repeatAttr = attr;
        dg.connect(iv, rp);
        let areaDsv = dg.getVariable(VarType.DATASCOPE, area);
        dg.connect(rp, areaDsv);
        if (area._vertices && area._vertices.length > 0) {
            let vtxDsv = dg.getVariable(VarType.DATASCOPE, area.vertices[0]);
            dg.connect(rp, vtxDsv);
        }
    }

    function repeatSpecified(coll, repeatAttr, table, dg) {
        // Wire to DataScopeVar(coll.children[0]) so the cascade continues into the
        // DataExtractors that are connected to that element's DataScopeVar.
        // For non-densified repeats (bars, circles, …) this wiring lasts for the
        // entire lifecycle.  For densified repeats (line → path), elementRemoved()
        // tears down DataScopeVar(line) and rewireRepopulateOperator() adds
        // DataScopeVar(path) and DataScopeVar(vertex) as new outputs.
        let iv = dg.getVariable(VarType.ITEMS, table),
            rp = dg.createOneWayDependency(OpType.REPOPULATE);
        rp._collection = coll;
        rp._repeatAttr = repeatAttr;
        dg.connect(iv, rp);
        // Connect to the DataScopeVar of the template element and all its leaf
        // descendants. For a plain mark repeat this is just the mark itself; for
        // a glyph repeat it also covers each child mark so their DataExtractors
        // (and the downstream BBox/layout cascade) re-run after repopulation.
        let template = coll.children[0];
        let targets = new Set([template, ...getLeafMarks(template)]);
        for (let elem of targets) {
            dg.connect(rp, dg.getVariable(VarType.DATASCOPE, elem));
        }
    }

    /**
     * After densify replaces line elements with polylines, wire RepopulateOperator
     * directly to DataScopeVar(path) and DataScopeVar(vertex) as additional outputs.
     * Multiple outputs are consistent with how layout operators (GridPlacer,
     * StackPlacer, …) already output to both ChannelVar(x) and ChannelVar(y).
     * getOperatorsOnPath iterates all outputVars, so every downstream DataExtractor
     * is reached.
     *
     * Graph shape after this call:
     *   ItemsVar(table) → RepopulateOperator → DataScopeVar(collection)   [from repeatSpecified]
     *                                        → DataScopeVar(path)          [path-level: strokeColor…]
     *                                        → DataScopeVar(vertex)        [vertex-level: x, y…]
     *
     * The DataScopeVars created here are found by classId / id lookup when
     * encodingSpecified() runs for each subsequent encode() call.
     */
    function rewireRepopulateOperator(newMark, table, dg) {
        let iv = dg.findVariable(VarType.ITEMS, [table]);
        if (!iv) return;

        // Find the RepopulateOperator on this items var.
        // Use OpType check to avoid a circular import (instanceof RepopulateOperator).
        let rp = null;
        for (let e of iv.outgoingEdges) {
            if (e.isDirected && e.toNode.type === OpType.REPOPULATE) {
                rp = e.toNode;
                break;
            }
        }
        if (!rp) return;

        // Add DataScopeVar(path) as an output for path-level encodings (e.g. strokeColor).
        let pathDsv = dg.getVariable(VarType.DATASCOPE, newMark);
        dg.connect(rp, pathDsv);

        // Add DataScopeVar(vertex) as an output for vertex-level encodings (e.g. x, y).
        if (newMark._vertices && newMark._vertices.length > 0) {
            let vtx = newMark.vertices[0];
            let vtxDsv = dg.getVariable(VarType.DATASCOPE, vtx);
            dg.connect(rp, vtxDsv);
        }
    }

    /**
    * Same as group in graphical design tools 
    **/


    class Group {
    	
    	constructor() {
    		this._id = this.type + generateUniqueID();
    		this._type = ElementType.Group;
    		this._dataScopeRef = undefined;
    		this._bounds = undefined;
    		this._layout = undefined;
    		this._children = [];
    		this._sortBy = { property: MSCRowID, descending: false };
    		this._z = 0;
    	}

    	get id() {
    		return this._id;
    	}

        get type() {
            return this._type;
        }

        get datum() {
            return getScopeDatum(this._dataScopeRef);
        }

    	get data() {
    		return getScopeRows(this._dataScopeRef);
    	}

    	// addFilter(p) {
    	// 	this._childrenFilter.push(obj2Predicate(p));
    	// 	for (let c of this._children) {
    	// 		if (this._childrenFilter.length > 0 && matchCriteria(c, this._childrenFilter))
    	// 			c.visibility = "visible";
    	// 		else
    	// 			c.visibility = "hidden";
    	// 	}
    	// }

    	// removeFilter(p) {
    	// 	let predicate = obj2Predicate(p);
    	// 	for (const [i, f] of this._childrenFilter.entries()) {
    	// 		if (f.equals(predicate)) {
    	// 			this._childrenFilter.splice(i, 1);
    	// 			break;
    	// 		}
    	// 	}
    	// 	for (let c of this._children) {
    	// 		if (this._childrenFilter.length > 0 && matchCriteria(c, this._childrenFilter))
    	// 			c.visibility = "visible";
    	// 		else
    	// 			c.visibility = "hidden";
    	// 	}
    	// }

    	// setFilter(f) {
    	// 	this._childrenFilter = [obj2Predicate(f)];
    	// 	for (let c of this._children) {
    	// 		if (this._childrenFilter.length > 0 && matchCriteria(c, this._childrenFilter))
    	// 			c.visibility = "visible";
    	// 		else
    	// 			c.visibility = "hidden";
    	// 	}
    	// }

    	// set id(id) {
    	// 	if (this.type === ElementType.Scene || !this.getScene())
    	// 		this._id = id;
    	// 	else {
    	// 		delete this.getScene()._itemMap[this._id];
    	// 		this._id = id;
    	// 		this.getScene()._itemMap[id] = this;
    	// 	}
    	// }

    	// contains(x, y) {
    	// 	// if (!this._bounds) {
    	// 	// 	this._updateBounds();
    	// 	// }
    	// 	return this.bounds.contains(x, y);
    	// }

    	// toJSON() {
    	// 	let json = {};
    	// 	json.type = this.type;
    	// 	json.id = this.id;
    	// 	if (this._dataScope)
    	// 		json.dataScope = this._dataScope.toJSON();
    	// 	if (this.classId)
    	// 		json.classId = this.classId;
    	// 	if (this._layout)
    	// 		json.layout = this._layout.toJSON();
    	// 	// if (this._bounds)
    	// 	json.bounds = this.bounds.toJSON();
    	// 	json.children = [];
    	// 	if (this.children.length > 0) { //&& this.type != ItemType.Axis
    	// 		for (let c of this.children) {
    	// 			json.children.push(c.toJSON());
    	// 		}
    	// 	}
    	// 	if (this.childrenOrder) {
    	// 		json.childrenOrder = this.childrenOrder;
    	// 	}
    	// 	return json;
    	// }

        get children() {
            return this._children;
        }

    	addChild(c) {
    		if (this._children.indexOf(c) >= 0) return;
    		if (c.parent)
    			c.parent.removeChild(c);
    		this._children.push(c);
    		c.parent = this;
    	}

    	addChildAt(c,index){
    		if (c.parent)
    			c.parent.removeChild(c);
    		this.children.splice(index, 0, c);
    		c.parent = this;
    	}

    	removeChild(c) {
    		let idx = this.children.indexOf(c);
    		if (idx >= 0) {
    			this.children.splice(idx, 1);
    			c.parent = null;
    		}
    	}

    	removeChildAt(i) {
    		this.children[i].parent = null;
    		this.children.splice(i, 1);
    	}

    	removeAll() {
    		for (let c of this.children)
    			c.parent = null;
    		this._children = [];
    	}

    	get dataScope() {
    		return this._dataScopeRef;
    	}

    	set dataScope(ref) {
    		this._dataScopeRef = normalizeScopeRef(ref);
    		if (this._dataScopeRef === undefined) {
    			for (let c of this.children) {
    				c.dataScope = undefined;
    			}
    		} else {
    			for (let c of this.children) {
    				if (c.dataScope)
    					c.dataScope = mergeScopeRefs(c.dataScope, this._dataScopeRef);
    				else
    					c.dataScope = this._dataScopeRef;
    			}
    		}
    	}

    	getInternalEncodings(channel) {
    		if (this.children.length == 0)
    			return [];
    		let item = this.children[0], scene = this.getScene();
    		let encodingKeys = Object.keys(scene.encodings);
    		let classIds = [];
    		while(item) {
    			if (item.classId && classIds.indexOf(item.classId) < 0)
    				classIds.push(item.classId);
    			if (item.type === ElementType.Glyph) {
    				item.children.forEach(d => classIds.push(d.classId));
    				break;
    			} else if (item.children) {
    				item = item.children[0];
    			} else
    				break;
    		}
    		let result = [];
    		for (let k of encodingKeys) {
    			let tokens = k.split("_");
    			for (let classId of classIds) {
    				if (tokens[0] == classId) {
    					if (scene.encodings[k][channel])
    						result.push(scene.encodings[k][channel]);
    				}
    			}
    		}
    		return result;
    	}

    	get firstChild() {
    		return this.children[0];
    	}

    	get lastChild() {
    		return this.children[this.children.length - 1];
    	}

    	set layout(l) {
    		this._layout = l;
    		if (l) {
    			l.group = this;
    		} 
    		layoutSpecified(this, l, this.scene._depGraph);

    		if (this.children && this.children.length > 0) {
    			let lm = getLeafMarks(this, true);
    			//TODO: keep marks with unique classIds only
    			for (let m of lm)
    				this.scene.onChange(VarType.CHANNEL, "x", m);
    		}
    	}

    	get layout() {
    		return this._layout;
    	}

    	get bounds() {
    		if (!this._bounds) {
    			this._updateBounds();
    		}
    		return this._bounds;
    	}

    	get refBounds() {
    		let cRefBounds = this.children.map (d => d.refBounds);
    		let left = d3.min(cRefBounds.map(d => d.left)), top = d3.min(cRefBounds.map(d => d.top)),
    			right = d3.max(cRefBounds.map(d => d.right)), bottom = d3.max(cRefBounds.map(d => d.bottom));
    		return new Rectangle(left, top, right - left, bottom - top);
    	}

    	get x() {
    		return this.bounds.x;
    	}

    	get y() {
    		return this.bounds.y;
    	}

    	_updateBounds() {
    		let children = this.children;
    		if (children.length > 0){
    			this._bounds = children[0].bounds.clone();
    			for (let i = 1; i < children.length; i++) {
    				if (children[i].visibility == "hidden")
    					continue;
    				this._bounds = this._bounds.union(children[i].bounds);
    			}
    			// if (this._layout && this._layout.type == "grid" && this._layout.cellBounds) {
    			// 	let cellBounds = this._layout.cellBounds;
    			// 	for (let i = 0; i < cellBounds.length; i++) {
    			// 		this._bounds = this._bounds.union(cellBounds[i]);
    			// 	}
    			// }
    		} else {
    			this._bounds = new Rectangle(0, 0, 0, 0);
    		}
    	}

    	// sortChildrenByData(attribute, reverse, order) {
    	// 	let type = this.children[0].dataScope.type(attribute);
    	// 	let f; 
    	// 	switch (type) {
    	// 		case DataType.Date:
    	// 			break;
    	// 		case DataType.Number:
    	// 		case DataType.Integer:
    	// 			f = (a, b) =>  a.dataScope.aggregateNumericalAttribute(attribute) - b.dataScope.aggregateNumericalAttribute(attribute);
    	// 			break;
    	// 		case DataType.String:
    	// 			if (order)
    	// 				f = (a, b) => order.indexOf(a.dataScope.getAttrVal(attribute)) - order.indexOf(b.dataScope.getAttrVal(attribute));
    	// 			else
    	// 				f = (a, b) =>  (a.dataScope.getAttrVal(attribute) < b.dataScope.getAttrVal(attribute) ? -1 : 1 );
    	// 			break;
    	// 	}
    	// 	this.children.sort(f);
    	// 	if (reverse)
    	// 		this.children.reverse();
    	// 	if (this.layout)
    	// 		this.layout.run();
    	// 	this._childrenOrder = {attribute: attribute, direction: reverse ? "desc" : "asc", ranking: order};
    	// }

    	// sortChildren(channel, reverse){
    	// 	let f;
    	// 	switch (channel){
    	// 		case "x":
    	// 		case "y":
    	// 		case "width":
    	// 		case "height":
    	// 			f = (a, b) => a.bounds[channel] - b.bounds[channel];
    	// 			break;
    	// 		default:
    	// 			f = (a, b) => a[channel] - b[channel];
    	// 			break;
    	// 	}
    	// 	this.children.sort(f);
    	// 	if (reverse)
    	// 		this.children.reverse();
    	// 	if (this.layout)
    	// 		this.layout.run();
    	// 	this.childrenOrder = {channel: channel, reverse: reverse};
    	// }

    	set visibility(v) {
    		let visibility = v == "hidden" ? "hidden" : "visible";
    		if (this.visibility === visibility)
    			return;
    		if (v == "hidden")
    			this._visibility = v;
    		else
    			this._visibility = "visible";
    		for (let c of this.children)
    			c.visibility = v;
    	}

    	get visibility() {
    		if (!this._visibility)
    			return "visible";
    		return this._visibility;
    	}

    	get z() {
    		return this._z;
    	}

    	set z(v) {
    		if (this._z === v) return;
    		this._z = v;
    	}

    	get scene() {
            return getScene(this);
        }

    	get sortBy() {
    		return this._sortBy;
    	}
    }

    function isRefElement(ele) {
    	return ele.type === ElementType.Axis || ele.type === ElementType.Legend || ele.type === ElementType.Gridlines;
    }

    class Collection extends Group {

        constructor(args) {
            super();
            this._type = ElementType.Collection;
            this._id = args.id ? args.id : this._type + "_" + generateUniqueID();
            //this._id = this.type + "_" + generateUniqueID();
            this._classId = this.id;
            this._childrenOrder = undefined;
            this._clipMask = undefined;
        }

        get classId() {
            return this._classId;
        }

        // get childrenOrder() {
        //     if (!this._childrenOrder)
        //         return { "attribute": MSCRowID, "direction": "asc" };
        //     else
        //         return this._childrenOrder;
        // }

        // set childrenOrder(o) {
        //     if (!("attribute" in o) && !("direction" in o)) return;
        //     let attr = o.attribute;
        //     if (!this.dataScope.dataTable.has(attr)) {
        //         console.warn("Cannot order collection children by an non-existent attribute", o.attribute);
        //         return;
        //     }
        //     this._childrenOrder = o;
        //     let f;
        //     if (attr === MSCRowID) {
        //         f = (a, b) => parseInt(a.dataScope.getAttrVal(attr).substring(1)) - parseInt(b.dataScope.getAttrVal(attr).substring(1));
        //     } else {
        //         let type = this.children[0].dataScope.type(attr);
        //         switch (type) {
        //             case AttributeType.Date:
        //                 break;
        //             case AttributeType.Number:
        //             case AttributeType.Integer:
        //                 f = (a, b) => a.dataScope.aggregateNumericalAttribute(attr) - b.dataScope.aggregateNumericalAttribute(attr);
        //                 break;
        //             case AttributeType.String:
        //                 if (o.ranking)
        //                     f = (a, b) => o.ranking.indexOf(a.dataScope.getAttrVal(attr)) - o.ranking.indexOf(b.dataScope.getAttrVal(attr));
        //                 else
        //                     f = (a, b) => (a.dataScope.getAttrVal(attr) < b.dataScope.getAttrVal(attr) ? -1 : 1);
        //                 break;
        //         }
        //     }
        //     this.children.sort(f);

        //     if (o.direction == "desc")
        //         this.children.reverse();
        //     if (this.layout)
        //         this.layout.run();
        // }

        // contains(x, y) {
        //     let irregular2Ds = [ElementType.Arc, ElementType.Pie, ElementType.Polygon, ElementType.Area];
        //     if (irregular2Ds.indexOf(this.firstChild.type) >= 0) {
        //         let svgData = this.getSVGPathData();
        //         if (svgData !== "") {
        //             let ctx = CanvasProvider.getContext(),
        //                 p = CanvasProvider.getPath2D(svgData);
        //             ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
        //             ctx.stroke(p);
        //             return ctx.isPointInPath(p, x, y);
        //         }
        //     }
        //     // if (!this._bounds) {
        //     //     this._updateBounds();
        //     // }
        //     return this._bounds.contains(x, y);
        // }

        getSVGPathData() {
            let d = "";
            for (let i of this.children) {
                if (i.getSVGPathData)
                    d += i.getSVGPathData();
                else if (i.bounds) {
                    let b = i.bounds;
                    d += ["M", b.left, b.top].join(" ");
                    d += ["L", b.right, b.top].join(" ");
                    d += ["L", b.right, b.bottom].join(" ");
                    d += ["L", b.left, b.bottom, "Z"].join(" ");
                }
            }
            return d;
        }

        createClipMask() {
            let b = unionRefBounds(this._children);
            this._clipMask = new Rectangle(b.left, b.top, b.width, b.height);
        }

        get clipMask() {
            return this._clipMask;
        }
    }

    class Glyph extends Group {

        constructor(args) {
            super();
            this._type = ElementType.Glyph;
            this._id = args && args.id ? args.id : this.type + "_" + generateUniqueID();
            this._classId = this._id;
            if (args && args.children){
    			for (let a of args.children){
    				this.addChild(a);
    			}
    		}
        }

        get classId() {
            return this._classId;
        }

    }

    const GridFillDirection = Object.freeze({
    	RowFirst: "rowFirst",
    	ColumnFirst: "columnFirst"
    });

    const GridCorner = Object.freeze({
    	TopLeft: "topLeft",
    	TopRight: "topRight",
    	BottomLeft: "bottomLeft",
    	BottomRight: "bottomRight"
    });

    const LayoutOrientation = {
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        ANGULAR: "angular",
        RADIAL: "radial"
    };

    const LinearDirection = {
        Left2Right: "l2r",
        Right2Left: "r2l",
        Top2Bottom: "t2b",
        Bottom2Top: "b2t"
    };

    // export const Alignment = {
    //     TOP: "top",
    //     LEFT: "left",
    //     BOTTOM: "bottom",
    //     RIGHT: "right",
    //     CENTER: "center",
    //     MIDDLE: "middle"
    // };

    const AngularDirection = Object.freeze({
        CLOCKWISE: "clockwise",
        ANTI_CLOCKWISE: "anti-clockwise"
    });

    const RadialDirection = Object.freeze({
        INWARD: 'inward',
        OUTWARD: 'outward'
    });

    // Based on path.Segment.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
    // http://paperjs.org/
    // Copyright (c) 2011 - 2019, Juerg Lehni & Jonathan Puckey
    // http://scratchdisk.com/ & https://puckey.studio/
    //
    // Distributed under the MIT license. See LICENSE file for detail
    //
    // All rights reserved.



    class Vertex {

    	//handles are relative to the point
    	constructor(parent, index) {
    		this.type = "vertex";
    		this.parent = parent;
    		this._index = index;
    	}

    	_getStored(property) {
    		return this.parent._vertices.getProperty(this._index, property);
    	}

    	_setStored(property, value) {
    		if (this._getStored(property) === value)
    			return;
    		this.parent._vertices.setProperty(this._index, property, value);
    		this.parent._dirty = true;
    	}

    	get datum() {
    		return this.dataScope ? getScopeDatum(this.dataScope) : this.parent.datum;
    	}

    	get data() {
    		return this.dataScope ? getScopeRows(this.dataScope) : this.parent.data;
    	}

    	get dataScope() {
    		return this.parent._vertices.getDataScopeRef(this._index);
    	}

    	set dataScope(ref) {
    		if (this.dataScope === ref)
    			return;
    		this.parent._vertices.setDataScopeRef(this._index, ref);
    		this.parent._dirty = true;
    	}

    	get bounds() {
    		switch(this.shape) {
    			case "rect":
    				return new Rectangle(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    			case "circle":
    				return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    			default:
    				return new Rectangle(this.x - 0.5, this.y - 0.5, 1, 1);
    		}
    	}

    	get id() {
    		return this.parent.id + "_v_" + this.parent._vertices._ids[this._index];
    	}

    	set polarAngle(a) {
    		this._setStored("polarAngle", a);
    	}

    	get polarAngle() {
    		return this._getStored("polarAngle");
    	}

    	get _polarAngle() {
    		return this.polarAngle;
    	}

    	set _polarAngle(value) {
    		this.polarAngle = value;
    	}

    	get scene() {
    		return this.parent.scene;
    	}

    	get x() {
    		return this.parent._vertices._xs[this._index];
    	}

    	set x(value) {
    		if (this.parent._vertices._xs[this._index] === value)
    			return;
    		this.parent._vertices._xs[this._index] = value;
    		this.parent._dirty = true;
    	}

    	get y() {
    		return this.parent._vertices._ys[this._index];
    	}

    	set y(value) {
    		if (this.parent._vertices._ys[this._index] === value)
    			return;
    		this.parent._vertices._ys[this._index] = value;
    		this.parent._dirty = true;
    	}

    	get shape() {
    		return this._getStored("shape");
    	}

    	set shape(value) {
    		this._setStored("shape", value);
    	}

    	get width() {
    		return this._getStored("width");
    	}

    	set width(value) {
    		this._setStored("width", value);
    	}

    	get height() {
    		return this._getStored("height");
    	}

    	set height(value) {
    		this._setStored("height", value);
    	}

    	get radius() {
    		return this._getStored("radius");
    	}

    	set radius(value) {
    		this._setStored("radius", value);
    	}

    	get fillColor() {
    		return this._getStored("fillColor");
    	}

    	set fillColor(value) {
    		this._setStored("fillColor", value);
    	}

    	get opacity() {
    		return this._getStored("opacity");
    	}

    	set opacity(value) {
    		this._setStored("opacity", value);
    	}

    	get strokeWidth() {
    		return this._getStored("strokeWidth");
    	}

    	set strokeWidth(value) {
    		this._setStored("strokeWidth", value);
    	}

    	get strokeColor() {
    		return this._getStored("strokeColor");
    	}

    	set strokeColor(value) {
    		this._setStored("strokeColor", value);
    	}
    }

    Vertex.styles = ["vxShape", "vxWidth", "vxHeight", "vxRadius", "vxFillColor", "vxStrokeColor", "vxStrokeWidth", "vxOpacity"];

    class Segment {
    	
    	constructor(v1, v2, parentMark, id) {
    		this.type = "segment";
    		this._id = id;
    		this._vertex1Index = typeof v1 === "number" ? v1 : v1._index;
    		this._vertex2Index = typeof v2 === "number" ? v2 : v2._index;

    		this._dataScopeRef = undefined;
    		this.parent = parentMark;
    	}

    	get dataScope() {
    		return this._dataScopeRef ? this._dataScopeRef : this.parent.dataScope;
    	}

    	set dataScope(ref) {
    		this._dataScopeRef = normalizeScopeRef(ref);
    	}

    	get datum() {
    		return this.dataScope ? getScopeDatum(this.dataScope) : this.parent.datum;
    	}

    	get data() {
    		return this.dataScope ? getScopeRows(this.dataScope) : this.parent.data;
    	}

    	get id() {
    		return this.parent.id + "_s_" + this._id;
    	}

    	get vertex1() {
    		return this.parent.vertices[this._vertex1Index];
    	}

    	set vertex1(v) {
    		this._vertex1Index = typeof v === "number" ? v : v._index;
    	}

    	get vertex2() {
    		return this.parent.vertices[this._vertex2Index];
    	}

    	set vertex2(v) {
    		this._vertex2Index = typeof v === "number" ? v : v._index;
    	}

    	get x() {
    		return (this.parent._vertices._xs[this._vertex1Index] + this.parent._vertices._xs[this._vertex2Index])/2;
    	}

    	get y() {
    		return (this.parent._vertices._ys[this._vertex1Index] + this.parent._vertices._ys[this._vertex2Index])/2;
    	}

    	get scene() {
    		return this.parent.scene;
    	}
    }

    class VertexList {
    	constructor(path) {
    		this._path = path;
    		this.clear();
    		return new Proxy(this, {
    			get(target, prop) {
    				if (prop === "length")
    					return target.length;
    				if (prop === Symbol.iterator)
    					return target[Symbol.iterator].bind(target);
    				if (VertexList._isIndex(prop))
    					return target.get(Number(prop));
    				return target[prop];
    			},
    			set(target, prop, value) {
    				if (VertexList._isIndex(prop)) {
    					target.replace(Number(prop), value);
    					return true;
    				}
    				if (typeof prop === "string" && prop[0] === "_") {
    					target[prop] = value;
    					return true;
    				}
    				throw new Error("path.vertices is read-only; mutate vertex properties or use path.vertices = [...].");
    			}
    		});
    	}

    	static _isIndex(prop) {
    		if (typeof prop !== "string" || prop === "")
    			return false;
    		let n = Number(prop);
    		return Number.isInteger(n) && n >= 0 && String(n) === prop;
    	}

    	static getCoords(vertex) {
    		return Array.isArray(vertex) ? vertex : [vertex.x, vertex.y];
    	}

    	static getId(vertex) {
    		if (vertex && vertex.parent && vertex.parent._vertices && vertex._index !== undefined)
    			return vertex.parent._vertices._ids[vertex._index];
    		return vertex ? vertex.id : undefined;
    	}

    	static get storageKeys() {
    		return ["_ids", "_xs", "_ys", "_dataScopeRefs", "_polarAngles", "_shapes", "_widths", "_heights", "_radii", "_fillColors", "_opacities", "_strokeWidths", "_strokeColors", "_refs"];
    	}

    	static get propertyArrays() {
    		return {
    			dataScope: "_dataScopeRefs",
    			polarAngle: "_polarAngles",
    			shape: "_shapes",
    			width: "_widths",
    			height: "_heights",
    			radius: "_radii",
    			fillColor: "_fillColors",
    			opacity: "_opacities",
    			strokeWidth: "_strokeWidths",
    			strokeColor: "_strokeColors"
    		};
    	}

    	get length() {
    		return this._xs.length;
    	}

    	clear() {
    		this._ids = [];
    		this._xs = [];
    		this._ys = [];
    		this._dataScopeRefs = [];
    		this._polarAngles = [];
    		this._shapes = [];
    		this._widths = [];
    		this._heights = [];
    		this._radii = [];
    		this._fillColors = [];
    		this._opacities = [];
    		this._strokeWidths = [];
    		this._strokeColors = [];
    		this._refs = [];
    	}

    	get(index) {
    		if (index < 0 || index >= this.length)
    			return undefined;
    		if (!this._refs[index])
    			this._refs[index] = new Vertex(this._path, index);
    		return this._refs[index];
    	}

    	at(index) {
    		if (index < 0)
    			index = this.length + index;
    		return this.get(index);
    	}

    	append(source, id) {
    		let [x, y] = VertexList.getCoords(source),
    			dataScope = Array.isArray(source) ? undefined : source.dataScope,
    			vertexId = id !== undefined ? id : VertexList.getId(source),
    			index = this.length;
    		this._ids.push(vertexId);
    		this._xs.push(x);
    		this._ys.push(y);
    		this._dataScopeRefs.push(dataScope ? this._copyDataScopeRef(dataScope) : undefined);
    		this._polarAngles.push(Array.isArray(source) ? undefined : source.polarAngle);
    		this._shapes.push(Array.isArray(source) ? undefined : source.shape);
    		this._widths.push(Array.isArray(source) ? 0 : source.width);
    		this._heights.push(Array.isArray(source) ? 0 : source.height);
    		this._radii.push(Array.isArray(source) ? 0 : source.radius);
    		this._fillColors.push(Array.isArray(source) ? "#555" : source.fillColor);
    		this._opacities.push(Array.isArray(source) ? 1 : source.opacity);
    		this._strokeWidths.push(Array.isArray(source) ? 0 : source.strokeWidth);
    		this._strokeColors.push(Array.isArray(source) ? "#aaa" : source.strokeColor);
    		this._refs.push(undefined);
    		return index;
    	}

    	insert(index, source, y, id) {
    		let isCoordinatePair = typeof source === "number",
    			coords = isCoordinatePair ? [source, y] : VertexList.getCoords(source),
    			x = coords[0],
    			yValue = coords[1],
    			dataScope = isCoordinatePair || Array.isArray(source) ? undefined : source.dataScope,
    			vertexId = isCoordinatePair ? id : VertexList.getId(source);
    		this._ids.splice(index, 0, vertexId);
    		this._xs.splice(index, 0, x);
    		this._ys.splice(index, 0, yValue);
    		this._dataScopeRefs.splice(index, 0, dataScope ? this._copyDataScopeRef(dataScope) : undefined);
    		this._polarAngles.splice(index, 0, isCoordinatePair || Array.isArray(source) ? undefined : source.polarAngle);
    		this._shapes.splice(index, 0, isCoordinatePair || Array.isArray(source) ? undefined : source.shape);
    		this._widths.splice(index, 0, isCoordinatePair || Array.isArray(source) ? 0 : source.width);
    		this._heights.splice(index, 0, isCoordinatePair || Array.isArray(source) ? 0 : source.height);
    		this._radii.splice(index, 0, isCoordinatePair || Array.isArray(source) ? 0 : source.radius);
    		this._fillColors.splice(index, 0, isCoordinatePair || Array.isArray(source) ? "#555" : source.fillColor);
    		this._opacities.splice(index, 0, isCoordinatePair || Array.isArray(source) ? 1 : source.opacity);
    		this._strokeWidths.splice(index, 0, isCoordinatePair || Array.isArray(source) ? 0 : source.strokeWidth);
    		this._strokeColors.splice(index, 0, isCoordinatePair || Array.isArray(source) ? "#aaa" : source.strokeColor);
    		this._refs.splice(index, 0, undefined);
    		this._reindexRefs();
    	}

    	replace(index, source) {
    		let [x, y] = VertexList.getCoords(source),
    			dataScope = Array.isArray(source) ? undefined : source.dataScope;
    		this._xs[index] = x;
    		this._ys[index] = y;
    		this._dataScopeRefs[index] = dataScope ? this._copyDataScopeRef(dataScope) : undefined;
    		this._polarAngles[index] = Array.isArray(source) ? undefined : source.polarAngle;
    		this._shapes[index] = Array.isArray(source) ? undefined : source.shape;
    		this._widths[index] = Array.isArray(source) ? 0 : source.width;
    		this._heights[index] = Array.isArray(source) ? 0 : source.height;
    		this._radii[index] = Array.isArray(source) ? 0 : source.radius;
    		this._fillColors[index] = Array.isArray(source) ? "#555" : source.fillColor;
    		this._opacities[index] = Array.isArray(source) ? 1 : source.opacity;
    		this._strokeWidths[index] = Array.isArray(source) ? 0 : source.strokeWidth;
    		this._strokeColors[index] = Array.isArray(source) ? "#aaa" : source.strokeColor;
    		this._refs[index] = undefined;
    	}

    	copyFrom(vertices) {
    		this._ids = vertices._ids.slice();
    		this._xs = vertices._xs.slice();
    		this._ys = vertices._ys.slice();
    		this._dataScopeRefs = vertices._dataScopeRefs.map(d => this._copyDataScopeRef(d));
    		this._polarAngles = vertices._polarAngles.slice();
    		this._shapes = vertices._shapes.slice();
    		this._widths = vertices._widths.slice();
    		this._heights = vertices._heights.slice();
    		this._radii = vertices._radii.slice();
    		this._fillColors = vertices._fillColors.slice();
    		this._opacities = vertices._opacities.slice();
    		this._strokeWidths = vertices._strokeWidths.slice();
    		this._strokeColors = vertices._strokeColors.slice();
    		this._refs = [];
    	}

    	getProperty(index, property) {
    		let key = VertexList.propertyArrays[property];
    		if (property === "dataScope")
    			return this.getDataScopeRef(index);
    		return key ? this[key][index] : undefined;
    	}

    	setProperty(index, property, value) {
    		let key = VertexList.propertyArrays[property];
    		if (!key)
    			return;
    		if (property === "dataScope")
    			this.setDataScopeRef(index, value);
    		else
    			this[key][index] = value;
    	}

    	setDataScopeRef(index, ref) {
    		this._dataScopeRefs[index] = ref ? this._copyDataScopeRef(ref) : undefined;
    	}

    	getDataScopeRef(index) {
    		return this._dataScopeRefs[index];
    	}

    	hasDataScope(index) {
    		return !!this._dataScopeRefs[index];
    	}

    	getDataScopeRows(index) {
    		let ref = this._dataScopeRefs[index];
    		if (!ref)
    			return undefined;
    		return getScopeRows(ref);
    	}

    	getDataScopeAttrVal(index, attr) {
    		let ref = this._dataScopeRefs[index];
    		if (!ref)
    			return undefined;
    		return getScopeAttrVal(ref, attr);
    	}

    	getDataScopeAttributeValues(index, attr) {
    		let ref = this._dataScopeRefs[index];
    		if (!ref)
    			return [];
    		return getScopeAttributeValues(ref, attr);
    	}

    	aggregateDataScopeAttribute(index, attr, aggregator) {
    		let ref = this._dataScopeRefs[index];
    		return aggregateScopeAttribute(ref, attr, aggregator);
    	}

    	_copyDataScopeRef(ref) {
    		if (!ref)
    			return ref;
    		return normalizeScopeRef(ref);
    	}

    	sort(compare) {
    		let order = Array.from({length: this.length}, (_, i) => i);
    		order.sort((a, b) => compare(this.get(a), this.get(b)));
    		this._reorder(order);
    		this._path._reindexSegments();
    		return this;
    	}

    	reverse() {
    		let order = Array.from({length: this.length}, (_, i) => this.length - i - 1);
    		this._reorder(order);
    		this._path._reindexSegments();
    		return this;
    	}

    	splice(start, deleteCount, ...items) {
    		let removed = this.slice(start, start + deleteCount);
    		for (let key of VertexList.storageKeys)
    			this[key].splice(start, deleteCount);
    		for (let i = 0; i < items.length; i++)
    			this.insert(start + i, items[i], undefined);
    		this._reindexRefs();
    		this._path._reindexSegments();
    		return removed;
    	}

    	push(...items) {
    		for (let item of items)
    			this.append(item, undefined);
    		this._path._reindexSegments();
    		return this.length;
    	}

    	map(callback, thisArg) {
    		let result = [];
    		for (let i = 0; i < this.length; i++)
    			result.push(callback.call(thisArg, this.get(i), i, this));
    		return result;
    	}

    	filter(callback, thisArg) {
    		let result = [];
    		for (let i = 0; i < this.length; i++) {
    			let vertex = this.get(i);
    			if (callback.call(thisArg, vertex, i, this))
    				result.push(vertex);
    		}
    		return result;
    	}

    	find(callback, thisArg) {
    		for (let i = 0; i < this.length; i++) {
    			let vertex = this.get(i);
    			if (callback.call(thisArg, vertex, i, this))
    				return vertex;
    		}
    		return undefined;
    	}

    	forEach(callback, thisArg) {
    		for (let i = 0; i < this.length; i++)
    			callback.call(thisArg, this.get(i), i, this);
    	}

    	slice(start, end) {
    		return Array.from(this).slice(start, end);
    	}

    	concat(...items) {
    		return Array.from(this).concat(...items);
    	}

    	entries() {
    		let list = this;
    		return (function*() {
    			for (let i = 0; i < list.length; i++)
    				yield [i, list.get(i)];
    		})();
    	}

    	indexOf(vertex) {
    		return vertex && vertex.parent === this._path ? vertex._index : -1;
    	}

    	includes(vertex) {
    		return this.indexOf(vertex) >= 0;
    	}

    	[Symbol.iterator]() {
    		let list = this;
    		return (function*() {
    			for (let i = 0; i < list.length; i++)
    				yield list.get(i);
    		})();
    	}

    	_reorder(order) {
    		for (let key of VertexList.storageKeys) {
    			let values = this[key];
    			this[key] = order.map(i => values[i]);
    		}
    		this._reindexRefs();
    	}

    	_reindexRefs() {
    		for (let i = 0; i < this._refs.length; i++) {
    			if (this._refs[i])
    				this._refs[i]._index = i;
    		}
    	}
    }


    let Path$1 = class Path extends Mark {
    	
    	constructor(args) {
    		super(args);
    		this._type = "type" in args ? args.type : ElementType.Path;

    		this._vertices = new VertexList(this);
    		this.vertexCounter = 0; //for assigning vertex ids
    		this._sortBy = {}; //sort vertices by
    		this.segmentCounter = 0;
    		this.segments = [];

    		this.anchor = undefined;

    		this.closed = "closed" in args ? args.closed : false;

    		this.curveMode = "curveMode" in args ? args.curveMode : "linear";

    		//this.boundsOffsets = {top: 0, bottom: 0, left: 0, right: 0};

    		this._vxShape = undefined;
    		this._vxWidth = 0;
    		this._vxHeight = 0;
    		this._vxRadius = 0;
    		this._vxFillColor = "#555555";
    		this._vxStrokeColor = "#aaaaaa";
    		this._vxStrokeWidth = 0;
    		this._vxOpacity = 1;

    		for (let vs of Vertex.styles){
    			if (vs in args)
    				this["_" + vs] = args[vs];
    		}

    		if ("vertices" in args) {
    			this.vertices = args["vertices"];
    		}

    		//for links
    		this._sourceAnchor = "sourceAnchor" in args? args.sourceAnchor : ["center", "middle"];
    		this._targetAnchor = "targetAnchor" in args? args.targetAnchor : ["center", "middle"];
    		this._sourceOffset = "sourceOffset" in args? args.sourceOffset : [0, 0];
    		this._targetOffset = "targetOffset" in args? args.targetOffset : [0, 0];

    		//for bundling
    		this._strength = "strength" in args ? args.strength : 0.85;

    		if (!("strokeColor" in this.styles))
    			this.styles["strokeColor"] = "#ccc";
    		if (!("fillColor" in this.styles))
    			this.styles["fillColor"] = "none";
    		if (!("strokeWidth" in this.styles))
    			this.styles["strokeWidth"] = 1;
    		if (!("strokeDash" in this.styles))
    			this.styles["strokeDash"] = "none";
    	}

    	// toJSON() {
    	// 	let json = super.toJSON();
    	// 	json.type = this.type;
    	// 	json.id = this.id;
    	// 	switch (this.type) {
    	// 		case ElementType.Rect:
    	// 			json.args.width = this.width;
    	// 			json.args.height = this.height;
    	// 			json.args.top = this.top;
    	// 			json.args.left = this.left;
    	// 			break;
    	// 		case ElementType.Circle:
    	// 			json.args.x = this.x;
    	// 			json.args.y = this.y;
    	// 			json.args.radius = this.radius;
    	// 			break;
    	// 		case ElementType.Arc:
    	// 		case ElementType.Pie:
    	// 			json.args.x = this._x;
    	// 			json.args.y = this._y;
    	// 			json.args.innerRadius = this._innerRadius;
    	// 			json.args.outerRadius = this._outerRadius;
    	// 			json.args.startAngle = this._startAngle;
    	// 			json.args.endAngle = this._endAngle;
    	// 			break;
    	// 		case ElementType.Link:
    	// 			json.args.mode = this.mode;
    	// 			json.args.directed = this.directed;
    	// 			json.args.sourceAnchor = this.sourceAnchor;
    	// 			json.args.targetAnchor = this.targetAnchor;
    	// 			json.args.sourceOffset = this.sourceOffset;
    	// 			json.args.targetOffset = this.targetOffset;
    	// 			json.args.source = this.source.id;
    	// 			json.args.target = this.target.id;
    	// 			break;
    	// 		default:
    	// 			json.vertices = [];
    	// 			for (let v of this.vertices)
    	// 				json.vertices.push(v.toJSON());
    	// 			if (this.type === ElementType.Polygon) {
    	// 				json.args.x = this._x;
    	// 				json.args.y = this._y;
    	// 				json.args.radius = this._radius;
    	// 			} else if (this.type === ElementType.Area) {
    	// 				json.args.baseline = this._baseline;
    	// 				json.args.orientation = this._orientation;
    	// 			}
    	// 			break;
    	// 	}
    		
    	// 	json.vertexCounter = this.vertexCounter;
    	// 	json.segmentCounter = this.segmentCounter;
    	// 	//do not save segments, anchor and closed for now
    	// 	json.curveMode = this.curveMode;
    	// 	if (this._bounds)
    	// 		json.bounds = this._bounds.toJSON();
    	// 	json.boundsOffsets = this.boundsOffsets;
    	// 	for (let s of Vertex.styles) {
    	// 		json.args[s] = this[s];
    	// 	}
    	// 	return json;
    	// }

    	set vertices(vertices) {
    		this._vertices.clear();
    		this.segments = [];
    		this.vertexCounter = 0;
    		this.segmentCounter = 0;
    		if (vertices.length === 0) {
    			this._dirty = true;
    			this._bounds = undefined;
    			return;
    		}
    		for (let i = 0; i < vertices.length; i++) {

    			let coords = VertexList.getCoords(vertices[i]),
    				firstCoords = VertexList.getCoords(vertices[0]);
    			if (i == vertices.length - 1 && coords[0] === firstCoords[0] && coords[1] === firstCoords[1] && this.type === ElementType.Path) {
    				continue;
    			}

    			let vertexId = Array.isArray(vertices[i]) ? this.vertexCounter++ : VertexList.getId(vertices[i]);
    			let vertexIndex = this._vertices.append(vertices[i], vertexId);
    			if (!Array.isArray(vertices[i]) && typeof vertexId === "number" && vertexId >= this.vertexCounter)
    				this.vertexCounter = vertexId + 1;

    			for (let vs of Vertex.styles){
    				if (this[vs] !== undefined){
    					let temp = vs.replace("vx", "");
    					this._vertices.setProperty(vertexIndex, temp[0].toLowerCase() + temp.slice(1), this[vs]);
    				}
    			}

    			if (i > 0)
    				this.segments.push(new Segment(vertexIndex - 1, vertexIndex, this, this.segmentCounter++));
    		}
    		//if the first vertex has the same position as the last, this path is closed
    		let first = VertexList.getCoords(vertices[0]), last = VertexList.getCoords(vertices[vertices.length - 1]);
    		if (this._vertices.length > 1 && (this.closed || (first[0] === last[0] && first[1] === last[1]) || this.type === ElementType.Rect)) {
    			this.closed = true;
    			if (!("fillColor" in this.styles))
    				this.styles["fillColor"] = "#fff";
    			this.segments.push(new Segment(this._vertices.length - 1, 0, this, this.segmentCounter++));
    		}
    		this._dirty = true;
    		this._updateBounds();
    	}

    	copyPropertiesTo(target) {
    		target.attrs = Object.assign({}, this.attrs);
    		target.styles = Object.assign({}, this.styles);
    		for (let vs of Vertex.styles){
    			if (this["_"+vs] !== undefined)
    				target["_"+vs] = this["_"+vs];
    		}
    		if (this._dataScopeRef)
    			target.dataScope = this._dataScopeRef;
    		target.closed = this.closed;
    		target.curveMode = this.curveMode;
    		target.vertexCounter = this.vertexCounter;
    		target._vertices.copyFrom(this._vertices);
    		target.segments = [];
    		target.segmentCounter = 0;
    		for (let i = 1; i < target._vertices.length; i++) {
    			target.segments.push(new Segment(i - 1, i, target, target.segmentCounter++));
    		}
    		if (target.closed)
    			target.segments.push(new Segment(target._vertices.length - 1, 0, target, target.segmentCounter++));
    		target._sourceAnchor = this._sourceAnchor.slice();
    		target._targetAnchor = this._targetAnchor.slice();
    		target._sourceOffset = this._sourceOffset.slice();
    		target._targetOffset = this._targetOffset.slice();
    		target._beta = this._beta;
    	}

    	/*
    	* returns the bounds without incorporating transformations involving rotation
    	*/
    	get bounds() {
    		if (!this._bounds)
    			this._updateBounds();
    		return this._bounds;
    	}

    	get x() {
    		return this.bounds.x;
    	}

    	get y() {
    		return this.bounds.y;
    	}

    	//by default, with respect to the center of bounds
    	resize(wd, ht, xRef, yRef) {
    		let bounds = this.bounds, bWidth = bounds.width === 0 ? 1 : bounds.width, bHeight = bounds.height === 0 ? 1 : bounds.height,
    			xs = this._vertices._xs, ys = this._vertices._ys;
    		if (xRef === "right") {
    			for (let i = 0; i < this._vertices.length; i++) {
    				xs[i] = bounds.right - (wd/bWidth) * (bounds.right - xs[i]);
    			}
    		} else {
    			for (let i = 0; i < this._vertices.length; i++) {
    				xs[i] = bounds.left + (wd/bWidth) * (xs[i] - bounds.left);
    			}
    		}
    		if (yRef === "top") {
    			for (let i = 0; i < this._vertices.length; i++) {
    				ys[i] = bounds.top + (ht/bHeight) * (ys[i] - bounds.top);
    			}
    		} else {
    			for (let i = 0; i < this._vertices.length; i++) {
    				ys[i] = bounds.bottom - (ht/bHeight) * (bounds.bottom - ys[i]);
    			}
    		}
    		this._updateBounds();
    		this._dirty = true;
    	}

    	_updateBounds() {
    		let vx = [], vy = [];
    		if (this._d) {
    			const commands = this._d.match(/[a-zA-Z][^a-zA-Z]*/g);
    			const delimiter = ' ';
    			commands.forEach(command => {
    				const values = command.slice(1).trim();
    				let vals = values.split(delimiter).map(Number);
    				for (let [i, v] of vals.entries()) {
    					if (i % 2 === 0)
    						vx.push(v);
    					else
    						vy.push(v);
    				}
    			});
    		} else {
    			vx = this._vertices._xs,
    			vy = this._vertices._ys;
    		}

    		let left = d3__namespace.min(vx), top = d3__namespace.min(vy), right = d3__namespace.max(vx), btm = d3__namespace.max(vy),
    			wd = right - left, ht = btm - top;

    		this._bounds = new Rectangle(left, top, wd, ht);
    		if (this.type === ElementType.Line || this.type === ElementType.Path) {
    			let sw = this.styles["strokeWidth"] ? this.styles["strokeWidth"] : 1;
    			if (left === right)
    				this._bounds = new Rectangle(left - sw / 2, top, right - left + sw, btm - top);
    			else if (top === btm)
    				this._bounds = new Rectangle(left, top - sw / 2, right - left, btm - top + sw);
    		}
    	}

    	addVertex(x, y, i) {
    		if (i === undefined)
    			i = this._vertices.length;
    		this._vertices.insert(i, x, y, this.vertexCounter++);
    		this._reindexSegments();
    		//TODO: handle segments
    	}

    	sortVertices(channel, descending) {
    		this._vertices.sort((a,b) => a[channel] - b[channel]);
    		if (descending)
    			this._vertices.reverse();
    		for (let i = 0; i < this.segments.length; i++) {
    			let segment = this.segments[i];
    			segment.vertex1 = i;
    			segment.vertex2 = (i+1)%this._vertices.length;
    		}
    		this._dirty = true;
    	}

    	sortVerticesByData(attr, descending, order) {
    		let f;
    		if (order)
    			f = (a, b) => order.indexOf(a.datum[attr]) - order.indexOf(b.datum[attr]);
    		else
    			f = (a, b) =>  (a.datum[attr] < b.datum[attr] ? -1 : 1 );
    		this._vertices.sort(f);
    		if (descending)
    			this._vertices.reverse();
    		for (let i = 0; i < this.segments.length; i++) {
    			let segment = this.segments[i];
    			segment.vertex1 = i;
    			segment.vertex2 = (i+1)%this._vertices.length;
    		}
    		this._dirty = true;
    	}

    	getSVGPathData() {
    		if (this._d) {
    			return this._d;
    		}
    		if (this._vertices.length < 2) return "";
    		let p = d3__namespace.path();
    		let curve = this._getD3CurveFunction(this.curveMode)(p);
    		curve.lineStart();
    		for (let i = 0; i < this._vertices.length; i++) {
    			curve.point(this._vertices._xs[i], this._vertices._ys[i]);
    		}
    		if (this.closed)
    			curve.point(this._vertices._xs[0], this._vertices._ys[0]);
    		curve.lineEnd();
    		return p._;
    	}

    	get firstVertex() {
    		return this._vertices[0];
    	}

    	get firstSegment() {
    		return this.segments[0];
    	}

    	get lastVertex() {
    		return this._vertices[this._vertices.length - 1];
    	}

    	get lastSegment() {
    		return this.segments[this.segments.length - 1];
    	}

    	_reindexSegments() {
    		for (let i = 0; i < this.segments.length; i++) {
    			this.segments[i].vertex1 = i;
    			this.segments[i].vertex2 = (i+1)%this._vertices.length;
    		}
    	}

    	_getD3CurveFunction(v){
    		switch(v) {
    			case CurveMode.Natural:
    				return d3__namespace.curveNatural;
    			case CurveMode.Basis:
    				return d3__namespace.curveBasis;
    			case CurveMode.BumpX:
    				return d3__namespace.curveBumpX;
    			case CurveMode.BumpY:
    				return d3__namespace.curveBumpY;
    			case CurveMode.Linear:
    				return d3__namespace.curveLinear;
    			case CurveMode.Step:
    				return d3__namespace.curveStep;
    			case CurveMode.CatmullRom:
    				return d3__namespace.curveCatmullRom;
    			case CurveMode.Cardinal:
    				return d3__namespace.curveCardinal;
    			case CurveMode.Bundle:
    				return d3__namespace.curveBundle.beta(0.5);
    			default:
    				return d3__namespace.curveLinear;
    		}
    	}

    	get vxShape(){
    		return this._vxShape;
    	}

    	// set vxShape(s){
    	// 	this._vxShape = s;
    	// 	for (let v of this.vertices)
    	// 		v.shape = s;
    	// }

    	get vxWidth(){
    		return this._vxWidth;
    	}

    	// set vxWidth(s){
    	// 	this._vxWidth = s;
    	// 	for (let v of this.vertices)
    	// 		v.width = s;
    	// }

    	get vxHeight(){
    		return this._vxHeight;
    	}

    	// set vxHeight(s){
    	// 	this._vxHeight = s;
    	// 	for (let v of this.vertices)
    	// 		v.height = s;
    	// }

    	get vxRadius(){
    		return this._vxRadius;
    	}

    	// set vxRadius(s){
    	// 	this._vxRadius = s;
    	// 	for (let v of this.vertices)
    	// 		v.radius = s;
    	// }

    	get vxFillColor(){
    		return this._vxFillColor;
    	}

    	// set vxFillColor(s){
    	// 	this._vxFillColor = s;
    	// 	for (let v of this.vertices)
    	// 		v.fillColor = s;
    	// }

    	get vxStrokeColor(){
    		return this._vxStrokeColor;
    	}

    	// set vxStrokeColor(s){
    	// 	this._vxStrokeColor = s;
    	// 	for (let v of this.vertices)
    	// 		v.strokeColor = s;
    	// }

    	get vxStrokeWidth(){
    		return this._vxStrokeWidth;
    	}

    	// set vxStrokeWidth(s){
    	// 	this._vxStrokeWidth = s;
    	// 	for (let v of this.vertices)
    	// 		v.strokeWidth = s;
    	// }

    	get vxOpacity(){
    		return this._vxOpacity;
    	}

    	set vxOpacity(s){
    		this._vxOpacity = s;
    		for (let v of this.vertices)
    			v.opacity = s;
    	}

    	get sourceAnchor() {
    		return this._sourceAnchor;
    	}

    	get targetAnchor() {
    		return this._targetAnchor;
    	}

    	get sourceOffset() {
    		return this._sourceOffset;
    	}

    	get targetOffset() {
    		return this._targetOffset;
    	}

    	get strength() {
    		return this._strength;
    	}

    	set strength(s) {
    		this._strength = s;
    		this._dirty = true;
    	}

    	get vertices() {
    		return this._vertices;
    	}

    };

    function getPointAt(path, frac) {
    	const svg = SVGProvider.getSVG();
    	let pathSVG = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    	pathSVG.setAttribute("d", path.getSVGPathData());
    	svg.appendChild(pathSVG);
    	let len = pathSVG.getTotalLength();
    	return pathSVG.getPointAtLength(len * frac);
    }

    function isLink(elem) {
    	return elem instanceof Path$1 && elem.source && elem.target;
    }

    const CurveMode = {
    	Natural: "natural",
    	Basis: "basis",
    	BumpX: "bumpX",
    	BumpY: "bumpY",
    	Bundle: "bundle",
    	Linear: "linear",
    	Step: "step",
    	CatmullRom: "CatmullRom",
    	Cardinal: "cardinal"
    };

    // export function getBounds(pathData) {
    // 	const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g);
    // 	const delimiter = ' ';
    // 	let xCoords = [], yCoords = [];
    // 	commands.forEach(command => {
    // 		const values = command.slice(1).trim();
    // 		let vals = values.split(delimiter).map(Number);
    // 		for (let [i, v] of vals.entries()) {
    // 			if (i%2 === 0) xCoords.push(v);
    // 			else yCoords.push(v);
    // 		}
    // 	})
    // 	console.log(xCoords, yCoords);
    // }

    function translateSVGPath(pathData, dx, dy) {
    	// Split the path data into its components
    	const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g);
    	const delimiter = ',';
    	
    	// Map over each command, applying the translation where applicable
    	const translatedCommands = commands.map(command => {
    		const type = command[0]; // The command type (e.g., M, L, Z, etc.)
    		const values = command.slice(1).trim();
    		// Handle commands that involve coordinates
    		if (type === 'M' || type === 'L' || type === 'T') {
    			const [x, y] = values.split(delimiter).map(Number);
    			return `${type}${x + dx} ${y + dy}`;
    		} else if (type === 'C') {
    			// Cubic Bezier curve commands have 6 coordinates (x1 y1 x2 y2 x y)
    			const coords = values.split(delimiter).map(Number);
    			return `${type}${coords[0] + dx} ${coords[1] + dy} ${coords[2] + dx} ${coords[3] + dy} ${coords[4] + dx} ${coords[5] + dy}`;
    		} else if (type === 'Q') {
    			// Quadratic Bezier curve commands have 4 coordinates (x1 y1 x y)
    			const coords = values.split(delimiter).map(Number);
    			return `${type}${coords[0] + dx} ${coords[1] + dy} ${coords[2] + dx} ${coords[3] + dy}`;
    		} else if (type === 'A') {
    			// Arc commands have 7 parameters, only x and y are translated
    			const coords = values.split(delimiter).map(Number);
    			return `${type}${coords[0]} ${coords[1]} ${coords[2]} ${coords[3]} ${coords[4]} ${coords[5] + dx} ${coords[6] + dy}`;
    		} else if (type === 'Z' || type === 'z') {
    			// Close path command has no coordinates to translate
    			return type;
    		} else {
    			// If the command is not recognized, return it as is
    			return command;
    		}
    	});

    	// Rejoin the translated commands into a new path string
    	return translatedCommands.join(' ');
    }

    class Arc extends Path$1 {

        constructor(args) {
    		super(args);
            this._type = ElementType.Arc;
            this.closed = true;
            this._x = "x" in args ? args.x : 100;
    		this._y = "y" in args ? args.y : 100;
    		this._innerRadius = "innerRadius" in args ? args.innerRadius : 100;
            this._outerRadius = "outerRadius" in args ? args.outerRadius : 200;
            this._thickness = "thickness" in args ? args.thickness : this._outerRadius - this._innerRadius;
            this._startAngle = "startAngle" in args ? args.startAngle : 0;
            this._endAngle = "endAngle" in args ? args.endAngle : 90;
            this._sr = degree2radian(this._startAngle);
            this._er = degree2radian(this._endAngle);
            this._direction = "direction" in args? args.direction : AngularDirection.ANTI_CLOCKWISE;

            let isx = this._x + this._innerRadius * Math.cos(this._sr), isy = this._y - this._innerRadius * Math.sin(this._sr),
                iex = this._x + this._innerRadius * Math.cos(this._er), iey = this._y - this._innerRadius * Math.sin(this._er),
                osx = this._x + this._outerRadius * Math.cos(this._sr), osy = this._y - this._outerRadius * Math.sin(this._sr),
                oex = this._x + this._outerRadius * Math.cos(this._er), oey = this._y - this._outerRadius * Math.sin(this._er);
            this.vertices = [[isx, isy], [osx, osy], [oex, oey], [iex, iey]];
        }

        get type() {
            return this._innerRadius === 0 ? ElementType.Pie : ElementType.Arc;
        }

        get innerRadius() {
    		return this._innerRadius;
    	}

        get outerRadius() {
    		return this._outerRadius;
    	}

        get thickness() {
            return this._outerRadius - this._innerRadius;
        }

        get direction() {
            return this._direction;
        }

        get x() {
    		return this._x;
    	}

    	get y() {
    		return this._y;
    	}

        get startAngle() {
            return this._startAngle;
        }

        get endAngle() {
            return this._endAngle;
        }

        get angle() {
            if (this._endAngle < this._startAngle) {
                return this._endAngle + 360 - this._startAngle;
            } else {
                return this._endAngle - this._startAngle;
            }
        }

        setAngles(startAngle, endAngle) {
            this._startAngle = startAngle;
            this._endAngle = endAngle;
            this._sr = degree2radian(this._startAngle);
            this._er = degree2radian(this._endAngle);

            this.vertices[0].x = this._x + this._innerRadius * Math.cos(this._sr);
            this.vertices[0].y = this._y - this._innerRadius * Math.sin(this._sr);
            this.vertices[1].x = this._x + this._outerRadius * Math.cos(this._sr);
            this.vertices[1].y = this._y - this._outerRadius * Math.sin(this._sr);
            this.vertices[2].x = this._x + this._outerRadius * Math.cos(this._er);
            this.vertices[2].y = this._y - this._outerRadius * Math.sin(this._er);
            this.vertices[3].x = this._x + this._innerRadius * Math.cos(this._er);
            this.vertices[3].y = this._y - this._innerRadius * Math.sin(this._er);
            this._dirty = true;
        }

        _updateBounds() {		
    		//this._bounds = new Rectangle(this._x - this._outerRadius, this._y - this._outerRadius, this._outerRadius * 2, this._outerRadius * 2);
            let vx = this.vertices.map(d => d.x),
    			vy = this.vertices.map(d => d.y);

    		let left = d3.min(vx), top = d3.min(vy), right = d3.max(vx), btm = d3.max(vy),
    			wd = right - left, ht = btm - top;

    		this._bounds = new Rectangle(left, top, wd, ht);
    	}

    	copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
    		target._x = this._x;
    		target._y = this._y;
    		target._innerRadius = this._innerRadius;
            target._outerRadius = this._outerRadius;
            target._startAngle = this._startAngle;
            target._endAngle = this._endAngle;
            target._thickness = this._thickness;
            target._direction = this._direction;
            target._sr = this._sr;
            target._er = this._er;
    	}

        getSVGPathData() {
            let angle = this._endAngle < this._startAngle? this._endAngle + 360 - this._startAngle : this._endAngle - this._startAngle, 
                largeArc = angle > 180 ? 1 : 0;
            let cmds = [
                "M " + this.vertices[0].x + ", " + this.vertices[0].y,
                "L " + this.vertices[1].x + ", " + this.vertices[1].y,
                "A " + [this._outerRadius, this._outerRadius, angle, largeArc, 0, this.vertices[2].x, this.vertices[2].y].join(" "),
                "L " + this.vertices[3].x + ", " + this.vertices[3].y,
                "A " + [this._innerRadius, this._innerRadius, angle, largeArc, 1, this.vertices[0].x, this.vertices[0].y].join(" ")
            ];
            return cmds.join(" ");
        }

    }

    function degree2radian(d){
    	return d * Math.PI/180;
    }

    function radian2degree(r){
    	return r * 180 / Math.PI;
    }

    function normalizeAngle(a) {
    	// if (a < 0)
    	// 	return a + 360;
    	// else if (a > 360)
    	// 	return a - 360;
    	// else
    	// 	return a;
        return ((a % 360) + 360) % 360;
    }

    function getPolarAngle(x1, y1, x0, y0) {
        let xA_prime = x1 - x0;
        let yA_prime = y0 - y1; //y coordinates are flipped
        
        // Calculate the polar angle using atan2
        let theta = Math.atan2(yA_prime, xA_prime);
        
        // Optional: Convert radians to degrees
        return theta * (180 / Math.PI);
    }

    class Area extends Path$1 {

        //order of vertices:
        //for horizontal orientation, first top side, left to right; then bottom side, right to left;
        //for vertical orientation, first right side, top to bottom; then left side, bottom to top;
        constructor(args) {
            super(args);
            this._type = ElementType.Area;
            this.closed = true;
            this._orientation = ("orientation" in args) ? args.orientation : undefined;
    		this._baseline = ("baseline" in args) ? args.baseline : undefined;

            //add last segment to close the path
    		if (args && "vertices" in args)
    			this.segments.push(new Segment(this.vertices.length - 1, 0, this, this.segmentCounter++));
        }

        get topLeftVertex() {
            if (this._orientation === LayoutOrientation.HORIZONTAL)
                return this.vertices[0];
            else
                return this.vertices[this.vertices.length - 1];
        }

        get bottomLeftVertex() {
            if (this._orientation === LayoutOrientation.HORIZONTAL)
                return this.vertices[this.vertices.length - 1];
            else
                return this.vertices[this.vertices.length/2];
        }

        get topRightVertex() {
            if (this._orientation === LayoutOrientation.HORIZONTAL)
                return this.vertices[this.vertices.length/2 - 1];
            else
                return this.vertices[0];
        }

        get bottomRightVertex() {
            if (this._orientation === LayoutOrientation.HORIZONTAL)
                return this.vertices[this.vertices.length/2];
            else
                return this.vertices[this.vertices.length/2 - 1];
        }

        get baseline() {
    		return this._baseline;
    	}

    	set baseline(b) {
    		this._baseline = b;
            this._dirty = true;
    	}

    	//this._orientation is set during densification
    	get orientation() {
    		return this._orientation;
    	}

    	set orientation(o) {
    		this._orientation = o;
            this._dirty = true;
    	}

    	get firstVertexPair() {
    		return [this.vertices[0], this.vertices[this.vertices.length-1]];
    	}

    	get width() {
    		return this.vertices[this.vertices.length/2].x - this.vertices[0].x;
    	}

    	get height() {
    		return this.vertices[this.vertices.length/2].y - this.vertices[0].y;
    	}

    	get left() {
    		return this.vertices[0].x;
    	}

    	get top() {
    		return this.vertices[0].y;
    	}

        copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
    		target._baseline = this._baseline;
    		target._orientation = this._orientation;
    	}

        getSVGPathData() {
    		return super.getSVGPathData() + " " + 'z';
    	}

    }

    class BezierCurve extends Path$1 {

        constructor(args) {
    		super(args);
            this._type = ElementType.BezierCurve;
            this._orientation = "orientation" in args ? args.orientation : LayoutOrientation.HORIZONTAL;
        }

        get type() {
            return this._type;
        }

        get orientation() {
            return this._orientation;
        }

        copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
            target._orientation = this._orientation;
        }

        getSVGPathData() {
            if (this._d)
                return this._d;
            let s = "M ";
            s += this.vertices[0].x + " " + this.vertices[0].y + " ";
            s += "C " + this.vertices[1].x + " " + this.vertices[1].y + " ";
            s += this.vertices[2].x + " " + this.vertices[2].y + " ";
            s += this.vertices[3].x + " " + this.vertices[3].y;
            return s;
        }

    }

    class Circle extends Mark {

        constructor(args) {
            super(args);
            this._type = ElementType.Circle;
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._radius = "radius" in args ? args.radius : 100;

            if (!("strokeColor" in this.styles))
    			this.styles["strokeColor"] = "#ccc";
    		if (!("fillColor" in this.styles))
    			this.styles["fillColor"] = "none";
    		if (!("strokeWidth" in this.styles))
    			this.styles["strokeWidth"] = 1;
    		if (!("strokeDash" in this.styles))
    			this.styles["strokeDash"] = "none";
        }

        set x(xin) { 
            this._x = xin;
            this._dirty = true;
        }

        set y(yin) { 
            this._y = yin;
            this._dirty = true;
        }
        
        // set radius(r) {
        //     this._radius = r;
        //     this._updateBounds();
        // }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        get radius() {
            return this._radius;
        }

        set radius(r) {
            this._radius = r;
            this._dirty = true;
        }

        get area() {
            return Math.PI * Math.pow(this._radius, 2);
        }

        _updateBounds() {
            if (this._rotate) {
                let pt = rotatePoint(this._x, this._y, this._rotate[1], this._rotate[2], this._rotate[0]);
                this._bounds = new Rectangle(pt.x - this._radius, pt.y - this._radius, this._radius * 2, this._radius * 2);
            } else {
                this._bounds = new Rectangle(this._x - this._radius, this._y - this._radius, this._radius * 2, this._radius * 2);
            }
    	}

        copyPropertiesTo(target) {
            super.copyPropertiesTo(target);
            target._x = this._x;
            target._y = this._y;
            target._radius = this._radius;
        }

        getSVGPathData() {
            return ["M", this._x, this._y, "m", -this._radius, ", 0 a", this._radius, ",", this._radius, "0 1,0", this._radius * 2, ",0 a", this._radius, ",", this._radius, "0 1,0", -(this._radius * 2), ",0"].join(" ");
        }
    }

    class Image extends Mark {

        constructor(args) {
    		super(args);
            this._type = ElementType.Image;
            this._src = args.src;
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._width = "width" in args ? args.width : 100;
            this._height = "height" in args ? args.height: 100;
        }

        get src() {
            return this._src;
        }

        set src(s) {
            this._src = s;
            this._dirty = true;
        }

        get width() {
            return this._width;
        }

        set width(w) {
            this._width = w;
            this._updateBounds();
            this._dirty = true;
        }

        get height() {
            return this._height;
        }

        set height(h) {
            this._height = h;
            this._updateBounds();
            this._dirty = true;
        }

        resize(w, h) {
            this._width = w;
            this._height = h;
            this._dirty = true;
            this._updateBounds();
        }

        get x() {
            return this._x;
        }

        set x(v) {
            this._x = v;
            this._dirty = true;
            this._updateBounds();
        }

        get y() {
            return this._y;
        }

        set y(v) {
            this._y = v;
            this._dirty = true;
            this._updateBounds();
        }

        get bounds() {
    		if (!this._bounds)
    			this._updateBounds();
    		return this._bounds;
    	}

        _updateBounds() {		
    		this._bounds = new Rectangle(this._x, this._y, this._width, this._height);
    	}

        copyPropertiesTo(target) {
    		target.attrs = Object.assign({}, this.attrs);
    		target.styles = Object.assign({}, this.styles);
    		
    		if (this._dataScopeRef)
    			target.dataScope = this._dataScopeRef;
    		
            target.x = this._x;
            target.y = this._y;
            target.width = this._width;
            target.height = this._height;
            target.src = this._src;
    	}
    }

    class Line extends Path$1 {

    	constructor(args) {
    		super(args);
    	}

    	get x1() {
            return this.vertices[0].x;
        }

        get y1() {
            return this.vertices[0].y;
        }

        get x2() {
            return this.vertices[1].x;
        }

        get y2() {
            return this.vertices[1].y;
        }

        get x() {
            return (this.vertices[0].x + this.vertices[1].x)/2;
        }

        get y() {
            return (this.vertices[0].y + this.vertices[1].y)/2;
        }

        set x(v) {
            let dx = v - this.x;
            this.vertices[0].x += dx;
            this.vertices[1].x += dx;
            this._dirty = true;
        }

        set y(v) {
            let dy = v - this.y;
            this.vertices[0].y += dy;
            this.vertices[1].y += dy;
            this._dirty = true;
        }

        set x1(v) {
            this.vertices[0].x = v;
            this._dirty = true;
        }

        set x2(v) {
            this.vertices[1].x = v;
            this._dirty = true;
        }

        set y1(v) {
            this.vertices[0].y = v;
            this._dirty = true;
        }

        set y2(v) {
            this.vertices[1].y = v;
            this._dirty = true;
        }
    }

    const ArrowheadStyle = {
        Filled: "filled",
        None:   "none"
    };

    /**
     * Arrow — a directed path with optional arrowheads at start and/or end.
     *
     * Constructor args:
     *   x1, y1          — start point (default 0, 0)
     *   x2, y2          — end point   (default 100, 0)
     *   controlPoints   — array of [x, y] intermediate vertices (default [])
     *   curveMode       — inherited from Path (default "linear")
     *   startStyle      — "open" | "filled" | "none"  (default "none")
     *   startSize       — arrowhead size in px          (default 8)
     *   endStyle        — "open" | "filled" | "none"  (default "filled")
     *   endSize         — arrowhead size in px          (default 8)
     */
    class Arrow extends Path$1 {

        constructor(args = {}) {
            const x1 = "x1" in args ? args.x1 : 0;
            const y1 = "y1" in args ? args.y1 : 0;
            const x2 = "x2" in args ? args.x2 : 100;
            const y2 = "y2" in args ? args.y2 : 0;
            const controlPoints = args.controlPoints || [];

            // Build the full vertex list: start → control points → end
            const vertices = [[x1, y1], ...controlPoints, [x2, y2]];

            super({ ...args, type: ElementType.Arrow, vertices });

            this._startStyle = args.startStyle ?? ArrowheadStyle.None;
            this._startSize  = args.startSize  ?? 8;
            this._endStyle   = args.endStyle   ?? ArrowheadStyle.Filled;
            this._endSize    = args.endSize    ?? 8;
        }

        // ── Convenience getters ──────────────────────────────────────────────────

        get x1() { return this.vertices[0].x; }
        set x1(v) { this.vertices[0].x = v; this._dirty = true; }

        get y1() { return this.vertices[0].y; }
        set y1(v) { this.vertices[0].y = v; this._dirty = true; }

        get x2() { return this.vertices[this.vertices.length - 1].x; }
        set x2(v) { this.vertices[this.vertices.length - 1].x = v; this._dirty = true; }

        get y2() { return this.vertices[this.vertices.length - 1].y; }
        set y2(v) { this.vertices[this.vertices.length - 1].y = v; this._dirty = true; }

        // ── Arrowhead properties ─────────────────────────────────────────────────

        get startStyle() { return this._startStyle; }
        set startStyle(v) { this._startStyle = v; this._dirty = true; }

        get startSize() { return this._startSize; }
        set startSize(v) { this._startSize = v; this._dirty = true; }

        get endStyle() { return this._endStyle; }
        set endStyle(v) { this._endStyle = v; this._dirty = true; }

        get endSize() { return this._endSize; }
        set endSize(v) { this._endSize = v; this._dirty = true; }
    }

    class SimpleText extends Mark {

        constructor(args) {
            super(args);
            this._type = ElementType.SimpleText;
            
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._text = "text" in args ? args.text : "",
            this._anchor = "anchor" in args ? args.anchor : [BoundsAnchor.CENTER, BoundsAnchor.MIDDLE];
            this._textPath = undefined;
            this._textPathOffset = "50%";

            if (!("fontSize" in this.styles))
                this.styles["fontSize"] = "12px";
            if (!("fontFamily" in this.styles))
                this.styles["fontFamily"] = "Arial, sans-serif";
            if (!("fontWeight" in this.styles))
                this.styles["fontWeight"] = "normal";
            if (!("fillColor" in this.styles))
                this.styles["fillColor"] = "black";

            if ("backgroundColor" in args)
                this._backgroundColor = args.backgroundColor;
            if ("borderWidth" in args)
                this._borderWidth = args.borderWidth;
            if ("borderColor" in args)
                this._borderColor = args.borderColor;
            this._rotate = "rotate" in args ?  args.rotate : undefined;
            //this._rotate = "rotate" in args ?  args.rotate : [0, this._x, this._y];

        }

        hasBackground() {
            return this._backgroundColor || this._borderStroke || this._borderColor;
        }

        _updateBounds() {
            let size = getTextSize$1(this._text, [this.fontWeight, this.fontSize, this.fontFamily].join(" "), parseFloat(this.fontSize));
            let wd = size.width, ht = size.height;

            let left; //sets the left cordinate of the text box
            switch (this._anchor[0]) {
                case BoundsAnchor.LEFT:
                    left = this._x;
                    break;
                case BoundsAnchor.RIGHT:
                    left = this._x - wd;
                    break;
                case BoundsAnchor.CENTER:
                    left = this._x - wd / 2;
                    break;
                default:
                    left = this._x;
                    break;
            }

            let top;
            switch (this._anchor[1]) {
                case BoundsAnchor.TOP:
                    top = this._y;
                    break;
                case BoundsAnchor.BOTTOM:
                    top = this._y - ht;
                    break;
                case BoundsAnchor.MIDDLE:
                default:
                    top = this._y - ht / 2;
                    break;
            }

            if (this._rotate && this._rotate.length === 3) {
                // let angle = this._rotate[0] * Math.PI / 180; // Convert to radians
                // console.log("angle in radians" + angle);
                // let cos = Math.cos(angle);
                // let sin = Math.sin(angle);

                // Corners of the original bounding box
                let corners = [
                    { x: left, y: top },
                    { x: left + wd, y: top },
                    { x: left, y: top + ht },
                    { x: left + wd, y: top + ht }
                ];

                //corners after box has been rotated 
                let rotatedCorners = corners.map(d => rotatePoint(d.x, d.y, this._rotate[1], this._rotate[2], this._rotate[0]));
                // let rotatedCorners = corners.map(corner => {
                //     return {
                //         x: (this._rotate[1] + (corner.x - this._rotate[1]) * cos) - ((corner.y - this._rotate[2]) * sin),
                //         y: (this._rotate[2]) + ((corner.x - this._rotate[1]) * sin) + ((corner.y - this._rotate[2]) * cos)
                //     };
                // });


                // Calculate the new bounding box
                let minX = d3.min(rotatedCorners.map(c => c.x));
                let maxX = d3.max(rotatedCorners.map(c => c.x));
                let minY = d3.min(rotatedCorners.map(c => c.y));
                let maxY = d3.max(rotatedCorners.map(c => c.y));

                this._bounds = new Rectangle(minX, minY, maxX - minX, maxY - minY);
            }
            else {
                this._bounds = new Rectangle(left, top, wd, ht);
            }
        }

        get x() {
            return this._x;
        }

        set x(v) {
            this._x = v;
            this._dirty = true;
        }

        get y() {
            return this._y;
        }

        set y(v) {
            this._y = v;
            this._dirty = true;
        }

        get text() {
            return this._text;
        }

        set text(t) {
            this._text = t;
            this._dirty = true;
        }

        get anchor() {
            return this._anchor;
        }

        get fontFamily() {
            return this.styles["fontFamily"];
        }

        get fontSize() {
            return this.styles["fontSize"];
        }

        get fontWeight() {
            return this.styles["fontWeight"];
        }

        set fontWeight(w) {
            this.styles["fontWeight"] = w;
            this._dirty = true;
        }

        get textPath() {
            return this._textPath;
        }

        set textPath(path) {
            this._textPath = path;
            this._dirty = true;
        }

        get textPathOffset() {
            return this._textPathOffset;
        }

        set textPathOffset(offset) {
            this._textPathOffset = offset;
            this._dirty = true;
        }
        get backgroundColor() {
            return this._backgroundColor ? this._backgroundColor : "#fff";
        }

        get borderColor() {
            return this._borderColor ? this._borderColor : "#ccc";
        }

        get borderWidth() {
            return this._borderWidth ? this._borderWidth : 1;
        }

        copyPropertiesTo(target) {
            target.styles = Object.assign({}, this.styles);
    		if (this._dataScopeRef)
    			target.dataScope = this._dataScopeRef;
    		target._x = this._x;
            target._y = this._y;
    		target._text = this._text;
    		target._anchor = [this._anchor[0], this._anchor[1]];
            target._backgroundColor = this._backgroundColor;
            target._borderColor = this._borderColor;
            target._borderStroke = this._borderStroke;
        }

    }

    function getTextSize$1(text, font, fontSize) {
        const svg = SVGProvider.getSVG();
        const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tempText.setAttribute("font-family", font);
        tempText.setAttribute("font-size", fontSize);
        tempText.textContent = text;
        svg.appendChild(tempText);
        const bbox = tempText.getBBox();
        svg.removeChild(tempText);
        return { width: bbox.width, height: bbox.height };
        // let context = CanvasProvider.getContext();
        // context.font = font;
        // let metrics = context.measureText(text);

        // if (metrics.fontBoundingBoxAscent) {
        //     return { width: metrics.width, height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent };
        // }
        // else if (metrics.actualBoundingBoxAscent) {
        //     return { width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
        // }
        // else {
        //     return { width: metrics.width, height: fontSize };
        // }
    }

    class Polygon extends Path$1 {

        constructor(args) {
            super(args);
            this._type = ElementType.Polygon;
            this.closed = true;

            if ("x" in args)
                this._x = args.x;
            if ("y" in args)
                this._y = args.y;
            if ("radius" in args)
                this._radius = args.radius;
        }

        get radius() {
    		return this._radius;
    	}

    	get x() {
    		return this._x;
    	}

    	get y() {
    		return this._y;
    	}

        set x(value) {
            this._x = value;
            this._dirty = true;
        }

        set y(value) {
            this._y = value;
            this._dirty = true;
        }

        set radius(value) {
            this._radius = value;
            this._dirty = true;
        }

        copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
    		target._x = this._x;
    		target._y = this._y;
    		target._radius = this._radius;
    	}
    }

    class Rect extends Path$1 {

    	constructor(args) {
    		super(args);
    	}

    	get width() {
    		return this.vertices[1].x - this.vertices[0].x;
    	}

    	get height() {
    		return this.vertices[2].y - this.vertices[1].y;
    	}

    	// set height(ht) {
    	// 	this.resize(this.width, ht);
    	// 	this._updateBounds();
    	// 	if (getPeers(this).length == 1)
    	// 		this._refBounds = this.bounds.clone();
    	// }

    	// set width(wd) {
    	// 	this.resize(wd, this.height);
    	// 	this._updateBounds();
    	// 	if (getPeers(this).length == 1)
    	// 		this._refBounds = this.bounds.clone();
    	// }

    	get left() {
    		return this.vertices[0].x;
    	}

    	get top() {
    		return this.vertices[0].y;
    	}

    	get right() {
    		return this.vertices[1].x;
    	}

    	get bottom() {
    		return this.vertices[2].y;
    	}

    	get area() {
    		return this.width * this.height;
    	}

    	setBounds(left, top, width, height) {
    		this.vertices[0].x = left;
    		this.vertices[0].y = top;
    		this.vertices[1].x = left + width;
    		this.vertices[1].y = top;
    		this.vertices[2].x = left + width;
    		this.vertices[2].y = top + height;
    		this.vertices[3].x = left;
    		this.vertices[3].y = top + height;
    		this._dirty = true;
    	}

    	resize(wd, ht, xRef, yRef) {
    		if (wd !== this.width) {
    			if (xRef === "right") {
    				//reset right to refBounds right first
    				this.vertices[1].x = this.refBounds.right;
    				this.vertices[2].x = this.refBounds.right;
    				this.vertices[0].x = this.vertices[1].x - wd;
    				this.vertices[3].x = this.vertices[0].x;
    			} else {
    				//reset left to refBounds left first
    				this.vertices[0].x = this.refBounds.left;
    				this.vertices[3].x = this.refBounds.left;
    				this.vertices[1].x = this.vertices[0].x + wd;
    				this.vertices[2].x = this.vertices[1].x;
    			}
    		}
    		if (ht !== this.height) {
    			if (yRef === "top") {
    				//reset top to refBounds top first
    				this.vertices[0].y = this.refBounds.top;
    				this.vertices[1].y = this.refBounds.top;
    				this.vertices[3].y = this.vertices[0].y + ht;
    				this.vertices[2].y = this.vertices[3].y;
    			} else {
    				//reset bottom to refBounds bottom first
    				this.vertices[2].y = this.refBounds.bottom;
    				this.vertices[3].y = this.refBounds.bottom;
    				this.vertices[0].y = this.vertices[3].y - ht;
    				this.vertices[1].y = this.vertices[0].y;
    			}
    		}
    		this._dirty = true;
    	}

    	get leftSegment() {
    		return this.segments[3];
    	}

    	get rightSegment() {
    		return this.segments[1];
    	}

    	get topSegment() {
    		return this.segments[0];
    	}

    	get bottomSegment() {
    		return this.segments[2];
    	}
    }

    class Ring extends Path$1 {

        constructor(args) {
    		super(args);
            this._type = ElementType.Ring;
            this.closed = true;
            this._x = ("x" in args) ? args.x : 0;
    		this._y = ("y" in args) ? args.y : 0;
    		this._innerRadius = ("innerRadius" in args) ? args.innerRadius : 100;
            this._outerRadius = ("outerRadius" in args) ? args.outerRadius : 200;
        }

        get innerRadius() {
    		return this._innerRadius;
    	}

        get outerRadius() {
    		return this._outerRadius;
    	}

        get x() {
    		return this._x;
    	}

    	get y() {
    		return this._y;
    	}

        get thickness() {
            return this._outerRadius - this._innerRadius;
        }

        copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
    		target._x = this._x;
    		target._y = this._y;
    		target._innerRadius = this._innerRadius;
            target._outerRadius = this._outerRadius;
    	}

        getSVGPathData() {
            let cmds = [
                "M " +  this._x + " " + this._y, // Move to center of ring
                "m 0, -" + this._outerRadius, // Move to top of ring
                "a " + this._outerRadius + "," + this._outerRadius + ", 0, 1, 0, 1, 0", // Draw outer arc, but don't close it
                "Z", // default fill-rule:even-odd will help create the empty innards
                "m 0 " + (this._outerRadius-this._innerRadius), // Move to top point of inner radius
                "a " + this._innerRadius + ", " + this._innerRadius + ", 0, 1, 1, -1, 0", // Draw inner arc, but don't close it
                "Z" // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke   
            ];
            return cmds.join(" ");
        }
    }

    class RichText extends Mark {

        constructor(args) {
            super(args);
            this._type = ElementType.RichText;
            
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._text = "text" in args ? args.text : "",
            this._width = "width" in args ? args.width : 200,
            this._anchor = "anchor" in args ? args.anchor : [BoundsAnchor.CENTER, BoundsAnchor.MIDDLE];
            
            if (!("fontSize" in this.styles))
                this.styles["fontSize"] = "12px";
            if (!("fontFamily" in this.styles))
                this.styles["fontFamily"] = "Arial, sans-serif";
            if (!("fontWeight" in this.styles))
                this.styles["fontWeight"] = "normal";
            if (!("fillColor" in this.styles))
                this.styles["fillColor"] = "black";

            if ("backgroundColor" in args)
                this._backgroundColor = args.backgroundColor;
            if ("borderWidth" in args)
                this._borderWidth = args.borderWidth;
            if ("borderColor" in args)
                this._borderColor = args.borderColor;
            this._rotate = "rotate" in args ?  args.rotate : undefined;
            //this._rotate = "rotate" in args ?  args.rotate : [0, this._x, this._y];

        }

        hasBackground() {
            return this._backgroundColor || this._borderStroke || this._borderColor;
        }

        _updateBounds() {
            let size = getTextSize(this._text, [this.fontWeight, this.fontSize, this.fontFamily].join(" "), parseFloat(this.fontSize));
            let wd = size.width, ht = size.height;

            let left; //sets the left cordinate of the text box
            switch (this._anchor[0]) {
                case BoundsAnchor.LEFT:
                    left = this._x;
                    break;
                case BoundsAnchor.RIGHT:
                    left = this._x - wd;
                    break;
                case BoundsAnchor.CENTER:
                    left = this._x - wd / 2;
                    break;
                default:
                    left = this._x;
                    break;
            }

            let top;
            switch (this._anchor[1]) {
                case BoundsAnchor.TOP:
                    top = this._y;
                    break;
                case BoundsAnchor.BOTTOM:
                    top = this._y - ht;
                    break;
                case BoundsAnchor.MIDDLE:
                default:
                    top = this._y - ht / 2;
                    break;
            }

            if (this._rotate && this._rotate.length === 3) {
                // let angle = this._rotate[0] * Math.PI / 180; // Convert to radians
                // console.log("angle in radians" + angle);
                // let cos = Math.cos(angle);
                // let sin = Math.sin(angle);

                // Corners of the original bounding box
                let corners = [
                    { x: left, y: top },
                    { x: left + wd, y: top },
                    { x: left, y: top + ht },
                    { x: left + wd, y: top + ht }
                ];

                //corners after box has been rotated 
                let rotatedCorners = corners.map(d => rotatePoint(d.x, d.y, this._rotate[1], this._rotate[2], this._rotate[0]));
                // let rotatedCorners = corners.map(corner => {
                //     return {
                //         x: (this._rotate[1] + (corner.x - this._rotate[1]) * cos) - ((corner.y - this._rotate[2]) * sin),
                //         y: (this._rotate[2]) + ((corner.x - this._rotate[1]) * sin) + ((corner.y - this._rotate[2]) * cos)
                //     };
                // });


                // Calculate the new bounding box
                let minX = d3.min(rotatedCorners.map(c => c.x));
                let maxX = d3.max(rotatedCorners.map(c => c.x));
                let minY = d3.min(rotatedCorners.map(c => c.y));
                let maxY = d3.max(rotatedCorners.map(c => c.y));

                this._bounds = new Rectangle(minX, minY, maxX - minX, maxY - minY);
            }
            else {
                this._bounds = new Rectangle(left, top, wd, ht);
            }
        }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        set x(v) {
            this._x = v;
            this._dirty = true;
        }

        set y(v) {
            this._y = v;
            this._dirty = true;
        }

        get text() {
            return this._text;
        }

        set text(t) {
            this._text = t;
            this._dirty = true;
        }
        
        get anchor() {
            return this._anchor;
        }

        get fontFamily() {
            return this.styles["fontFamily"];
        }

        get fontSize() {
            return this.styles["fontSize"];
        }

        get fontWeight() {
            return this.styles["fontWeight"];
        }

        get textPath() {
            return this._textPath;
        }

        set textPath(path) {
            this._textPath = path;
            this._dirty = true;
        }

        get textPathOffset() {
            return this._textPathOffset;
        }

        set textPathOffset(offset) {
            this._textPathOffset = offset;
            this._dirty = true;
        }

        get backgroundColor() {
            return this._backgroundColor ? this._backgroundColor : "#fff";
        }

        get borderColor() {
            return this._borderColor ? this._borderColor : "#ccc";
        }

        get borderWidth() {
            return this._borderWidth ? this._borderWidth : 1;
        }

        get width() {
            return this._width;
        }

        copyPropertiesTo(target) {
            target.styles = Object.assign({}, this.styles);
    		if (this._dataScopeRef)
    			target.dataScope = this._dataScopeRef;
    		target._x = this._x;
            target._y = this._y;
    		target._text = this._text;
    		target._anchor = [this._anchor[0], this._anchor[1]];
            target._backgroundColor = this._backgroundColor;
            target._borderColor = this._borderColor;
            target._borderStroke = this._borderStroke;
        }

    }

    function getTextSize(text, font, fontSize) {
        const svg = SVGProvider.getSVG();
        const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tempText.setAttribute("font-family", font);
        tempText.setAttribute("font-size", fontSize);
        tempText.textContent = text;
        svg.appendChild(tempText);
        const bbox = tempText.getBBox();
        svg.removeChild(tempText);
        return { width: bbox.width, height: bbox.height };
        // let context = CanvasProvider.getContext();
        // context.font = font;
        // let metrics = context.measureText(text);

        // if (metrics.fontBoundingBoxAscent) {
        //     return { width: metrics.width, height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent };
        // }
        // else if (metrics.actualBoundingBoxAscent) {
        //     return { width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
        // }
        // else {
        //     return { width: metrics.width, height: fontSize };
        // }
    }

    class LinearGradient {

        constructor(params) {
            let args = params ? params : {};
            this._stops = [];
            this.type = ElementType.LinearGradient;
            this.id = this.type + generateUniqueID();
            this.x1 = ("x1" in args) ? args.x1 : 0;
            this.x2 = ("x2" in args) ? args.x2 : 100;
            this.y1 = ("y1" in args) ? args.y1 : 0;
            this.y2 = ("y2" in args) ? args.y2 : 0;
        }

        toJSON() {
            let json = {};
            json.type = this.type;
            json.id = this.id;
            json.x1 = this.x1;
            json.x2 = this.x2;
            json.y1 = this.y1;
            json.y2 = this.y2;
            json.stops = this._stops;
            return json;
        }

        addStop(offset, color, opacity) {
            this._stops.push({ offset: offset, color: color, opacity: opacity });
        }

        get stops() {
            return this._stops;
        }

    }

    function inferTickValues(scale, channel, elems, axis) {
        //TODO:
        let domain = scale.domain, range = scale.range;
        let minPxInterval;
        switch (scale.type) {
            case "linear":
            case "log": {
                let r = Math.abs(range[0] - range[1]);
                minPxInterval = channel == "width" || channel == "x" ? 45 : 30;
                let n = Math.max(2, Math.floor(r / minPxInterval));
                let ticks;
                //handle the case where the marks are stacked
                // if (enc.channel == "width" || enc.channel == "height") {
                //     let layout = getTopLevelLayout(enc.anyItem, "stack");
                //     if (layout) {
                //         let c = layout.group, colls = getPeers(c, enc.scene);
                //         r = Math.max(...colls.map(d => d.refBounds[enc.channel]));
                //         domain[1] = enc.scale.invert(r); // Math.ceil(enc.scale.invert(r)); do not ceil, it can amplify small difference in invert calculation due to imprecision/roundoff in bounding box calculation
                //     }
                // } 
                if (channel == "width" || channel == "height") {
                    let stack = axis ? axis.elements[0].parent.layout && axis.elements[0].parent.layout.type == LayoutType.STACK : false;
                    domain[1] = scale._scale.invert(stack ? unionBounds(elems)[channel] : unionRefBounds(elems)[channel]);
                }
                if (scale.type === "log") {
                    ticks = [];
                    let d3Ticks = scale._scale.ticks();
                    //number of ticks is not configurable for d3 log scales,
                    //use the solution posted here: https://github.com/d3/d3/issues/72
                    for (let d of d3Ticks) {
                        let x = Math.log(d) / Math.log(10) + 0.000001;
                        if (Math.abs(x - Math.floor(x)) < n / d3Ticks.length)
                            ticks.push(d);
                    }
                } else {
                    ticks = d3__namespace.ticks(domain[0], domain[1], n);
                }
                return ticks;
            }
            case "point": {
                minPxInterval = channel == "width" || channel == "x" ? 80 : 30;
                let domainValueIntervalPx = Math.floor(scale.rangeExtent / domain.length);
                let m = Math.ceil(minPxInterval / domainValueIntervalPx);
                return channel == "x" ? domain.filter((d, i) => i % m == 0) : domain;
            }
            case "band": {
                minPxInterval = channel == "width" || channel == "x" ? 80 : 30;
                let domainValueIntervalPx = Math.floor(scale.rangeExtent / domain.length);
                let m = Math.max(1, Math.ceil(minPxInterval / domainValueIntervalPx));
                return domain.filter((d, i) => i % m == 0);
            }
            case "time": {
                minPxInterval = channel == "width" || channel == "x" ? 80 : 30;
                let numIntervals = Math.floor((range[1] - range[0]) / minPxInterval), timeInterval = Math.ceil((domain[1] - domain[0]) / numIntervals) / 1000;

                let units = [1, 60, 3600, 86400, 2628003, 31536000], intervals = [d3__namespace.timeSeconds, d3__namespace.timeMinutes, d3__namespace.timeHours, d3__namespace.timeDays, d3__namespace.timeMonths, d3__namespace.timeYears];

                let tn, tInterval;
                for (let i = 0; i < units.length - 1; i++) {
                    if (timeInterval >= units[i] && timeInterval < units[i + 1]) {
                        tn = Math.floor(timeInterval / units[i]);
                        tInterval = intervals[i];
                        return tInterval(domain[0], domain[1], tn);
                    }
                }
                if (timeInterval > units[units.length - 1]) {
                    tn = Math.floor(timeInterval / units[units.length - 1]);
                    tInterval = intervals[units.length - 1];
                    return tInterval(domain[0], domain[1], tn);
                }
                return [];
            }
            default:
                return [];
        }

    }

    function removeRefElement(re, scene) {
        scene.removeChild(re);
    }

    class Axis extends Group {

        constructor(args){
            super();
            this._type = ElementType.Axis;
            this._id = args.id ? args.id : this._type + generateUniqueID();

            this._attribute = undefined;
            this._channel = undefined;
            this._orientation = undefined;

            this._strokeColor = "strokeColor" in args ? args["strokeColor"] : "#555";
            this._textColor = "textColor" in args ? args.textColor : "#555";
            this._fontSize = "fontSize" in args? args.fontSize: "12px";

            this._tickOffset = "tickOffset" in args ? args["tickOffset"] : 0;
            this._tickSize = "tickSize" in args ? args["tickSize"] : 5;
            this._tickAnchor = args.tickAnchor;

            this._tickVisible = "tickVisible" in args ? args["tickVisible"] : true; // &&  !args["tickVisible"] ? "hidden" : "visible";
            this._pathVisible = "pathVisible" in args ? args["pathVisible"] : true; // && !args["pathVisible"] ? "hidden" : "visible";
            this._labelVisible = "labelVisible" in args ? args["labelVisible"] : true;

            this._labelOffset = "labelOffset" in args ? args["labelOffset"] : this._tickSize + this._tickOffset + 3;
            this._labelFormat = "labelFormat" in args ? args["labelFormat"] : "";

            this._titleOffset = "titleOffset" in args ? args["titleOffset"] : 40;
            // if ("titleAnchor" in args) {
            //     this._titleAnchor = args.titleAnchor;
            // } else {
            //     if (this.channel == "x" || this.channel == "width"){
            //         this._titleAnchor = this._orientation == AxisOrientation.TOP ? [BoundsAnchor.CENTER, BoundsAnchor.BOTTOM] : [BoundsAnchor.CENTER, BoundsAnchor.TOP];
            //     } else {
            //         this._titleAnchor = this._orientation == AxisOrientation.LEFT ? [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE] : [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
            //     }
            // }
            this._rotateYTitle = "rotateTitle" in args && !args.rotateTitle ? false : true;
            //this._titlePosition = args.titlePosition;
            this._showTitle = "titleVisible" in args ? args.titleVisible : true;

            if ("labelRotation" in args)
                this._labelRotation = args.labelRotation;
            else
                this._labelRotation = 0;

            //generate ticks, labels, and path
            this._ticks = new Group();
            this._ticks._id = this._id + "_ticks";
            this.addChild(this._ticks);

            this._labels = new Group();
            this._labels._id = this._id + "_labels";
            this.addChild(this._labels);

            this._title = new SimpleText({"text": this._titleText, fillColor: this._textColor, fontWeight: "bold"});
            this._title._id = this.id + "_title";
            this.addChild(this._title);
            if (!this._showTitle)
                this._title.visibility = "hidden";

            /**
             * x-axis: y
             * y-axis: x
             */
            this._pathPos = undefined;

            this._args = args;
        }

        get id() {
            return this._id;
        }

        get pathPosition() {
            return this._pathPos;
        }

        get pathVisible() {
            return this._pathVisible;
        }

        get attribute(){
            return this._attribute;
        }

        get channel(){
            return this._channel;
        }

        get orientation(){
            return this._orientation;
        }

        get ticksVisible() {
            return this._tickVisible;
        }

        get labelsVisible() {
            return this._labelVisible;
        }

        get tickSize() {
            return this._tickSize;
        }

        get tickOffset() {
            return this._tickOffset;
        }

        get tickAnchor() {
            if (this._tickAnchor)
                return this._tickAnchor;
            else {
                return (this._channel === "x" || this._channel === "width") ? "center" : "middle";
            }
        }

        get labelOffset() {
            return this._labelOffset;
        }

        get labelFormat() {
            return this._labelFormat;
        }

        get labelRotation() {
            return this._labelRotation;
        }

        get tickValues() {
            return this._tickValues;
        }

        get labelValues() {
            return this._labelValues;
        }

        get titleOffset() {
            return this._titleOffset;
        }

        get titleVisisble() {
            return this._showTitle;
        }

        get boundsWithoutTitle() {
            let children = this.children.filter(d => d.type !== ElementType.SimpleText);
            let b = children[0].bounds.clone();
            for (let i = 1; i < children.length; i++) {
                if (children[i].visibility == "hidden")
                    continue;
                b = b.union(children[i].bounds);
            }

            return b;
        }

        get strokeColor() {
            return this._strokeColor;
        }

        get textColor() {
            return this._textColor;
        }
    }

    const AxisOrientation = {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left"};

    class EncodingAxis extends Axis {

        constructor(encoding, scale, elems, args) {
            super(args);
            this._encoding = encoding;
            //this._element = this._encoding.element;
            this._attribute = this._encoding.attribute;
            this._channel = this._encoding.channel;
            this._scale = scale;
            //a scale can be associated with multiple axes, see scene.axis, it's not a 1:1 mapping, so store axis in DataBinding
            //this._scale.refElement = this;
            this._elems = elems;
            this._flip = "flip" in args ? args.flip : false;

            this._posArg = this._channel == "x" || this._channel == "width"? args["pathY"] : args["pathX"]; 
            
            //need to handle angular and radian axes
            this._orientation = "orientation" in args ? args["orientation"] : 
                this._channel === "x" || this._channel == "width" ? AxisOrientation.BOTTOM : AxisOrientation.LEFT;

            this._titleText = "title" in args ? args["title"] : (this._encoding.sourceAttribute ?? this._encoding.attribute);
            
            this._path = this._channel === "angle" ? new Circle({"strokeColor": this._strokeColor, "id": this._id + "_path"}) : 
                         new Path$1({"strokeColor": this._strokeColor, "id": this._id + "_path"});
            if (!this._pathVisible)
                this._path.visibility = "hidden";
            this.addChild(this._path);

            this.createTicksLabels(args);

            if (encoding.dataTable.type(this._attribute) === AttributeType.Date && !("labelFormat" in args)) {
                this._labelFormat = "%m/%d/%y";
            }

            if (this._channel === "radialDistance"){
                if("rotation" in args){
                    this._rotate = [-args["rotation"], this._elems[0].parent.x, this._elems[0].parent.y];
                }
            }
        }

        // get element() {
        //     return this._encoding._scale2elems[this._scale.id][0];
        // }

        isFlipped() {
            return this._flip;
        }

        get elements() {
            return this._elems;
        }

        get scale() {
            return this._scale;
        }

        get encoding() {
            return this._encoding;
        }

        get includeZero() {
            return this._encoding.includeZero;
        }

        createTicksLabels(args) {
            if ("tickValues" in args) {
                this._tickValues = args["tickValues"];
                this._labelValues = args["tickValues"];
            } else {
                this._tickValues = inferTickValues(this._scale, this._channel, this._elems, this);
                this._labelValues = this._tickValues;
            }

            this._ticks.removeAll();
            for (let i = 0; i < this._tickValues.length; i++) {
                let t = new Path$1({"strokeColor": this._strokeColor, "id": this._id + "_tick" + i});
                if (!this._tickVisible)
                    t.visibility = "hidden";
                this._ticks.addChild(t);
            }

            this._labels.removeAll();
            let formatter, attrType = this._encoding.dataTable.type(this._attribute);

            switch (attrType) {
                case AttributeType.Date:
                    formatter = d3__namespace.utcFormat(this._labelFormat);
                    break;
                case AttributeType.String:
                    formatter = function(d) {return d;};
                    break;
                default:
                    formatter = d3__namespace.format(this._labelFormat);
                    break;
            }

            for (let [i, v] of this._labelValues.entries()) {
                let t = new SimpleText({"text": formatter(v), fontSize: this._fontSize, fillColor: this._textColor, "id": this._id + "_label" + i});
                if (!this._labelVisible)
                    t.visibility = "hidden";
                this._labels.addChild(t);
            }

            this._title._text = this._titleText;
        }

    }

    class Scale {

        constructor(type, args) {
            this._id = "scale_" + generateUniqueID();
            this._type = type;
            if (args)
                this._args = args;
            switch (type) {
                case "linear":
                    this._scale = d3__namespace.scaleLinear();
                    break;
                case "point":
                    this._scale = d3__namespace.scalePoint();
                    break;
                case "band":
                    this._scale = d3__namespace.scaleBand().padding(0);
                    break;
                case "ordinal":
                    this._scale = d3__namespace.scaleOrdinal();
                    break;
                case "ordinalColor":
                    this._scale = d3__namespace.scaleOrdinal(d3__namespace[args.scheme]);
                    break;
                case "power":
                    this._scale = d3__namespace.scalePow().exponent(2);
                    break;
                case "sqrt":
                    this._scale = d3__namespace.scalePow().exponent(0.5);
                    break;
                case "log":
                    this._scale = d3__namespace.scaleLog();
                    break;
                case "identity":
                case "time":
                    this._scale = d3__namespace.scaleTime();
                    break;
                case "sequentialColor":
                    if (args.scheme) 
                        this._scale = d3__namespace.scaleSequential(d3__namespace[args.scheme]);
                    else
                        this._scale = d3__namespace.scaleSequential();
                    break;
            }
        }

        get id() {
            return this._id;
        }

        get domain() {
            return this._scale.domain();
        }

        set domain(d) {
            this._scale.domain(d);
        }

        get range() {
            return this._scale.range();
        }

        set range(r) {
            //TODO: check r is a two-element array
            this._scale.range(r);
        }

        get rangeExtent() {
            let r = this._scale.range();
            return Math.abs(r[1] - r[0]);
        }

        set rangeExtent(e) {
            let r = this._scale.range();
            if (r[0] < r[1])
                this._scale.range([r[0], r[0] + e]);
            else
                this._scale.range([r[1] + e, r[1]]);
        }

        get type() {
            return this._type;
        }

        map(d) {
            return this._scale(d);
        }

        invert(r, noClamping) {
            let lo = d3__namespace.min(this._scale.range()), hi = d3__namespace.max(this._scale.range()), v = r;
            if (!noClamping) {
                v = d3__namespace.max([lo, d3__namespace.min([r, hi])]);
            }
            // if ((r < lo || r > hi) && !noClamping)
            //     return undefined;
            if (this._type === "time") {
                return this._scale.invert(v).getTime();
            } else if (["point", "band", "ordinal", "ordinalColor"].includes(this._type)) {
                // ordinal-family scales have no native invert — find the nearest domain value
                let domain = this._scale.domain();
                return domain.reduce((best, d) => {
                    let pos = this._scale(d);
                    if (this._type === "band") pos += this._scale.bandwidth() / 2;
                    let bestPos = this._scale(best);
                    if (this._type === "band") bestPos += this._scale.bandwidth() / 2;
                    return Math.abs(pos - v) < Math.abs(bestPos - v) ? d : best;
                });
            } else {
                return this._scale.invert(v);
            }
    	}
    }

    function createScale(enc) {
        if (enc.scaleType) {
            return new Scale(enc.scaleType);
        }
        // When sharing a scale, inherit the base encoding's scale type so that
        // both encodings produce identical pixel positions from the same domain/range.
        if (enc._baseEnc && enc._baseEnc.scales.length > 0) {
            let baseScale = enc._baseEnc.scales[0];
            return new Scale(baseScale.type, baseScale._args);
        }
        if (enc.channel === "text" || enc.channel === "src") {
            // Text labels and image srcs are always look-up values (exact match against
            // a domain entry), never something to interpolate between, so both use an
            // ordinal scale regardless of the underlying attribute's data type.
            return new Scale("ordinal");
        }
        let fType = enc.dataTable.type(enc.attribute); //getDataTable(enc.element).type(enc.attribute);
        switch (fType) {
            case AttributeType.Boolean:
                break;
            case AttributeType.Date:
                return new Scale("time");
            case AttributeType.String:
                if (enc.aggregator == "count") {
                    return new Scale("linear");
                } else if (enc.channel.indexOf("Color") >= 0) {
                    let args = {};
                    args.scheme = enc.colorScheme ? enc.colorScheme : "schemeCategory10";
                    return new Scale("ordinalColor", args);
                } else {
                    return new Scale("point");
                }
            default: { //integer or number
                if (["strokeColor", "fillColor", "fillGradient"].indexOf(enc.channel) >= 0) {
                    if (!enc.mapping)
                        return new Scale("sequentialColor", {scheme: enc.colorScheme});
                    else
                        return new Scale("linear");
                } else
                    return new Scale("linear");
            }
        }
    }

    const divergingColorSchemes = [
    	"schemeBrBG", "schemePRGn", "schemePiYG", "schemePuOr", "schemeRdBu", "schemeRdGy", "schemeRdYlBu", "schemeRdYlGn", "schemeSpectral"
    ];

    const sequentialColorSchemes = [
    	"schemeBlues", "schemeGreens", "schemeGreys", "schemeOranges", "schemePurples", "schemeReds", "schemeBuGn", "schemeBuPu", "schemeGnBu", "schemeOrRd", "schemePuBuGn", "schemePuBu", "schemePuRd", "schemeRdPu", "schemeYlGnBu", "schemeYlGn", "schemeYlOrBr", "schemeYlOrRd"
    ];

    // export function createScale(attr, channel, elem, aggr, scaleType) {
    //     if (scaleType) {
    //         return new Scale(scaleType);
    //     }
    //     let fType = getDataTable(elem).type(attr);
    //     switch (fType) {
    //         case AttributeType.Boolean:
    //             break;
    //         case AttributeType.Date:
    //             return new Scale("time");
    //         case AttributeType.String:
    //             if (aggr == "count")
    //                 return new Scale("linear");
    //             else if (channel.indexOf("Color") >= 0)
    //                 return new Scale("ordinalColor");
    //             else
    //                 return new Scale("point");
    //         default: //integer or number
    //             return new Scale("linear");
    //     }
    // }

    // export function computeDomain(attr, table, elems) {
    //     let dataScopes = elems.map(d => d.dataScope);
    //     switch (table.type(attr)) {
    //         case AttributeType.Boolean:
    //             break;

    //         case AttributeType.Date:
    //             return dataScopes.map(d => d.getAttrVal(attr));

    //         case AttributeType.String:
    //             try {
    //                 return dataScopes.map(d => d.getAttrVal(attr));
    //             } catch (error) {
    //                 throw new Error("Cannot bind " + this.channel + " to " + attr + " : " + error);
    //             }

    //         default: //integer or number
    //             return dataScopes.map(d => d.aggregateNumericalAttribute(attr, this.aggregator));
    //     }
    // }

    function validateEncodeArguments(elem, channel, attribute) {
        if (!elem || !channel || !attribute)
            throw new Error("encode(elem, channel, attribute) — all three arguments are required");

        if (!Object.values(Channels).includes(channel))
            throw new Error(`Unknown channel "${channel}"`);

        let datatable = getDataTable(elem);
        if (datatable && datatable.tree) {
            if (attribute.indexOf(".") > 0 && !datatable.tree.nodeTable.has(attribute.split(".")[1]))
                throw new Error(`Data attribute "${attribute}" does not exist in the data table`);
        } else if (!datatable || !datatable.has(attribute)) {
            throw new Error(`Data attribute "${attribute}" does not exist in the data table`);
        }

        //TODO: if attribute is nominal, the channel cannot be width or height
    }

    function removeEncoding(enc, scene) {
        let scn = scene ? scene : getScene(enc.element);
        delete scn._encodings[getEncodingKey(enc.element)][enc.channel];
        console.log("remove encoding", enc.channel, enc.attribute);
        encodingRemoved(enc, scn._depGraph);
        for (let re of enc.refElements) {
            removeRefElement(re, scn);
            refElementRemoved(re, scn._depGraph);
        }
        enc.clearRefElements();
    }

    function getEncodingsByElement(elem, includeVertexSegment) {
        let hash = elem.scene._encodings[getEncodingKey(elem)],
            encs = [];
        if (hash) {
            encs = encs.concat(Object.values(hash));
        }

        if (includeVertexSegment) {
            let scene = elem.scene;
            for (let key in scene._encodings) {
                let tokens = key.split("_");
                tokens.pop();
                let classId = tokens.join("_");
                if (classId === elem.classId)
                    encs = encs.concat(Object.values(scene._encodings[key]));
            }
        }
        return encs;
    }

    function getEncodingsByChannel(channel, scene) {
        let encs = [];
        for (let key in scene._encodings) {
            for (let ch in scene._encodings[key]) {
                if (ch === channel) {
                    encs.push(scene._encodings[key][ch]);
                }
            }
        }
        return encs;
    }

    function getChannelEncodingByAttribute(attr, channel, scene) {
        for (let itmKey in scene._encodings) {
            let enc = scene._encodings[itmKey];
            if (enc[channel] && enc[channel].attribute == attr)
                return enc[channel];
        }
        return null;
    }

    function getChannelEncodingByElement(elem, channel) {
        let enc = elem.scene._encodings[getEncodingKey(elem)];
        if (enc && enc[channel]) {
            return enc[channel];
        } else
            return null;
    }

    function getEncodingKey(item) {
        if (Array.isArray(item)) {
            return item.map(d => getEncodingKey(d)).join("_");
        }
        if (item.classId) {
            return item.classId;
        } else if (item.type == "vertex" && item.dataScope) { //vertex created from densify
            if (item.parent.type === ElementType.Area) {
                let firstHalf = item._index < item.parent._vertices.length / 2;
                return item.parent.classId + "_v" + (firstHalf ? 0 : item.parent._vertices.length - 1);
            }

            else
                return item.parent.classId + "_v";
        } else if (item.type == "vertex") { //vertex with index
            return item.parent.classId + "_v" + item._index;
        } else if (item.type == "segment" && item._dataScopeRef) { //segment created from densify
            return item.parent.classId + "_s";
        } else if (item.type == "segment") { //segment with index
            return item.parent.classId + "_s" + item.parent.segments.indexOf(item);
        } else {
            return null;
        }
    }

    function getEncodingsInGridCell(group, channel) {
        if (group.children.length == 0)
            return [];
        let scene = getScene(group),
            items = group.type === ElementType.Composite ? group.children : [group.children[0]];
        let encodingKeys = Object.keys(scene._encodings);
        let classIds = [];
        for (let c of items) {
            let item = c;
            while(item) {
                if (item.classId && classIds.indexOf(item.classId) < 0)
                    classIds.push(item.classId);
                if (item.type === ElementType.Glyph) {
                    item.children.forEach(d => classIds.push(d.classId));
                    break;
                } else if (item.children) {
                    item = item.children[0];
                } else
                    break;
            }
        }

        let result = [];
        for (let k of encodingKeys) {
            // let tokens = k.split("_");
            // tokens.pop();
            // let cid = tokens.join("_");
            for (let classId of classIds) {
                if (k.indexOf(classId) === 0) {
                    if (scene._encodings[k][channel])
                        result.push(scene._encodings[k][channel]);
                }
            }
        }
        return result;
    }

    function isDataBoundVertically(elem) {
        let yEnc = getChannelEncodingByElement(elem, "y"),
    		htEnc = getChannelEncodingByElement(elem, "height");
        return yEnc || (htEnc && htEnc.scales[0].domain[0] < 0);
    }


    function isDataBoundHorizontally(elem) {
        let xEnc = getChannelEncodingByElement(elem, "x"),
    		wdEnc = getChannelEncodingByElement(elem, "width");
        return xEnc || (wdEnc && wdEnc.scales[0].domain[0] < 0);
    }

    function isDataBound(elem, channel) {
        if (channel === "x" || channel === "width") 
            return isDataBoundHorizontally(elem);
        else if (channel === "y" || channel === "height")
            return isDataBoundVertically(elem);
        else
            return getChannelEncodingByElement(elem, channel) !== null;
    }

    class Gridlines extends Path$1 {

        constructor(channel, attribute, scale, elems, args) {
            super(args);
            this._type = ElementType.Gridlines;
            this._id = this._type + generateUniqueID();

            // this._encoding = encoding;
            this._attribute = attribute;
            this._channel = channel;
            this._scale = scale;
            this._elems = elems;

            this._args = args;

            if (!("strokeColor" in args))
    			this.styles["strokeColor"] = "#ddd";

            if (!("opacity" in args))
    			this.styles["opacity"] = 0.5;
        
            this.updateValues();
            this._lines = [];
        }

        updateValues() {
            if ("values" in this._args) {
                this._values = this._args["values"];
            } else if (this._scale) {
                this._values = inferTickValues(this._scale, this._channel, this._elems);
            } else {
                this._values = this._elems.map(d => d.datum[this._attribute]);
            }
        }

        get type() {
            return this._type;
        }

        get id() {
            return this._id;
        }

        getSVGPathData() {
    		let p = "";
            if (this._channel === "radialDistance") {
                for (let ln of this._lines) {
                    p += "M " + ln.x + " " + ln.y + 
                        " m -" + ln.r + " 0" +
                        " a " + ln.r + " " + ln.r + " 0 1 0 " + (2 * ln.r) + " 0" +
                        " a " + ln.r + " " + ln.r + " 0 1 0 -" + (2 * ln.r) + " 0" + " ";
                }
            } else {
                for (let ln of this._lines) {
                    p += ["M", ln.x1, ln.y1].join(" ") + [" L", ln.x2, ln.y2].join(" ") + " ";
                }
            }
            return p;
    	}

        _updateBounds() {
            if (this._channel === "radialDistance") {
                let rects = this._lines.map(d => new Rectangle(d.x - d.r, d.y - d.y, 2 * d.r, 2 * d.r));
                this._bounds = unionRectangles(rects);
            } else {
                let xCoords = this._lines.map(d => d.x1).concat(this._lines.map(d => d.x2)),
                    yCoords = this._lines.map(d => d.y1).concat(this._lines.map(d => d.y2));
                let left = d3.min(xCoords),
                    right = d3.max(xCoords),
                    top = d3.min(yCoords),
                    btm = d3.max(yCoords);
                this._bounds = new Rectangle(left, top, right - left, btm - top);
            }		
        }

        get elements() {
            return this._elems;
        }

        get values() {
            return this._values;
        }

        get channel() {
            return this._channel;
        }

        get attribute() {
            return this._attribute;
        }

        get scale() {
            return this._scale;
        }
        
        get lines() {
            return this._lines;
        }

        set lines(ls) {
            this._lines = ls;
        }
    }

    class AttributeEncoding {
        
        constructor(elem, channel, attr, aggregator, args) {
            this._id = "encoding_" + generateUniqueID();
            this._elem = elem;
            this._channel = channel;
            this._attribute = attr;
            this._table = args.table;
            this._aggregator = aggregator;
            this._includeZero = args.includeZero;
            this._flipScale = args.flipScale;
            this._mapping = args.mapping;
            this._preferredRangeExtent = args.rangeExtent;
            this._preferredRangeStart = args.rangeStart;
            this._preferredDomain = args.domain;
            this._scaleType = args.scaleType;
            this._colorScheme = args.scheme;
            this._forLegend = args.forLegend;
            //this encoding is a derived prxoy for another underlying attribute, e.g., in binned attributes
            this._sourceAttribute = args.sourceAttribute ?? null;

            if (args.shareScale) {
                this._baseEnc = args.shareScale;
            }

            this._scales = [];
            this._elemGroups = [];
            this._elem2scale = {};
            //this._scale2elems = {};

            this._refElements = [];

            if (["width", "height", "radius", "angle", "thickness", "radialDistance", "strokeWidth", "area"].indexOf(this._channel) >= 0)
                this._includeZero = true;

            this.initialize();
        }

        get id() {
            return this._id;
        }

        initialize() {
            this._scales = [];
            this._elemGroups = [];

            if (this._elem.type === "vertex") {
                let tc = getTopLevelCollection(this._elem),
                    parentPeers = getPeers(this._elem.parent),
                    elemGroups;
                if ((this._channel === "x" || this._channel === "y") && tc.layout && tc.layout.type == LayoutType.GRID) {
                    let parentGroups = this._channel === "x" ? tc.layout.getElementsByCol(true, this._elem.parent) : tc.layout.getElementsByRow(true, this._elem.parent);
                    elemGroups = parentGroups.map(d => getPeerVertexIndices(this._elem, d));
                } else {
                    elemGroups = (isDataBoundHorizontally(this._elem.parent) || isDataBoundVertically(this._elem.parent)) ?
                        parentPeers.map(d => getPeerVertexIndices(this._elem, [d])) :
                        [getPeerVertexIndices(this._elem, parentPeers)];
                }
                for (let g of elemGroups) {
                    this._createScaleForVertexIndices(g);
                }
            } else if (this._channel === "x" || this._channel === "y") {
                let e = this._elem,
                    tc = getTopLevelCollection(e);
                if (tc.layout && tc.layout.type == LayoutType.GRID) {
                    let elemGroups = this._channel === "x" ? tc.layout.getElementsByCol(true, e) : tc.layout.getElementsByRow(true, e);
                    for (let g of elemGroups) {
                        this._createScaleForElems(g);
                    }
                } else {
                    let elems = getPeers(this._elem);
                    this._createScaleForElems(elems);
                }
            } else if (this._channel === "angle") {
                let elems = getPeers(this._elem);
                //group elements by parent
                let pid2Elems = elems.reduce((acc, element) => {
                    const parent = element.parent.id;
                    // If the parent group does not exist, create it
                    if (!acc[parent]) {
                        acc[parent] = [];
                    }
                    // Add the current element to the parent group
                    acc[parent].push(element);
                    return acc;
                }, {});
                let elemGroups = Object.values(pid2Elems);
                for (let g of elemGroups) {
                    this._createScaleForElems(g);
                }
            } else { //all elems share the same scale
                let elems = getPeers(this._elem);
                this._createScaleForElems(elems);
            }
        }

    	_createScaleForElems(elems) {
    	    this._elemGroups.push(elems);
            //var s = createScale(this._attribute, this._channel, this._elem, this._aggregator, this._scaleType);
            var s = createScale(this);
            this._scales.push(s);
    	    for (let e of elems)
    	        this._elem2scale[e.id] = s;
    	}

    	_createScaleForVertexIndices(groups) {
    	    this._elemGroups.push({ type: "vertexIndices", groups });
    	    var s = createScale(this);
    	    this._scales.push(s);
    	    for (let group of groups) {
    	        for (let index of group.indices)
    	            this._elem2scale[getVertexId(group.parent, index)] = s;
    	    }
    	}

        // Rebuild element→scale mappings after collection repopulation,
        // preserving existing scale objects (and their domain/range).
        // Only handles the common single-shared-scale case.
        refreshElementMappings() {
            if (this._scales.length !== 1) return;
            this._elem2scale = {};

            if (this._elem.type === "vertex") {
                // Vertex encodings store _elemGroups as [{type:"vertexIndices", groups:[{parent,indices}]}].
                // Rebuild using the current peer polylines so DataExtractor can iterate groups correctly.
                let parentPeers = getPeers(this._elem.parent),
                    groups = getPeerVertexIndices(this._elem, parentPeers);
                this._elemGroups = [{ type: "vertexIndices", groups }];
                for (let group of groups)
                    for (let index of group.indices)
                        this._elem2scale[getVertexId(group.parent, index)] = this._scales[0];
            } else {
                let elems = getPeers(this._elem);
                this._elemGroups = [elems];
                for (let e of elems)
                    this._elem2scale[e.id] = this._scales[0];
            }
        }

        //todo: given an element, get its scale
        getScale(elem) {
            return this._elem2scale[elem.id];
        }

        getAttrValue(channelVal, elem, noClamping) {
            let scale = elem ? this.getScale(elem) : this._scales[0],
                v = scale.invert(channelVal, noClamping),
                attr = this._attribute;
            //find the closest value in data
            let at = this.dataTable.type(attr);
            if (at === AttributeType.Date) {
                const vals = this.dataTable.values(attr).slice().sort((a, b) => a - b);
                let idx = d3__namespace.bisectLeft(vals, v);
                idx = Math.min(idx, vals.length - 1);
                if (idx > 0 && Math.abs(vals[idx - 1] - v) < Math.abs(vals[idx] - v))
                    idx--;
                return vals[idx];
            } else {
                return v;
            }
        }

        getChannelValue(attrVal, elem) {
            let scale = elem ? this.getScale(elem) : this._scales[0];
            return scale.map(attrVal);
        }

    	getElements(scale) {
    	    let idx = this._scales.indexOf(scale);
    	    return this._elemGroups[idx];
    	    //return this._baseEnc._scale2elems[scale.id];
    	}

    	get elementGroups() {
    	    return this._elemGroups;
    	}

        get element() {
            return this._elem;
        } 

        get channel() {
            return this._channel;
        }

        get attribute() {
            return this._attribute;
        }

        get sourceAttribute() {
            return this._sourceAttribute;
        }

        set attribute(attr) {
            let oldAttr = this._attribute;
            this._attribute = attr;
            for (let re of this._refElements) {
                if (re instanceof EncodingAxis) {
                    re._attribute = attr;
                    re.createTicksLabels({});
                    if (re._titleText) {
                        re._titleText = this._sourceAttribute ?? attr;
                    }
                } else if (re instanceof Gridlines) {
                    re._attribute = attr;
                    re.updateValues();
                }
                //TODO: handle other types of ref elements
            }
            // Encoding-aware lookup: each encoding owns exactly one attrVar (keyed by attr+dataset+encoding).
            // Passing `this` as the third param finds only *this* encoding's var — no cross-encoding collision.
            const attrVar = this._elem.scene._depGraph.getVariable(VarType.ATTRIBUTE, oldAttr, this.dataTable, this);
            if (attrVar) {
                attrVar._attribute = attr;
                this._elem.scene.onChange(VarType.ATTRIBUTE, attr, this.dataTable, this);
            }
        }

        get dataTable() {
            return this._table; //getDataTable(this._elem);
        }

        get aggregator() {
            return this._aggregator;
        }

        hasMultipleScales() {
            return this._scales.length > 0;
        }

        get scales() {
            //return this._baseEnc._scales;
            return this._scales;
        }

        getRangeStart(elem) {
            let s = this.getScale(elem);
            return d3__namespace.min(s.range);
            //return Math.min(...this.scales[0].range);
        }

        getRangeExtent(elem) {
            let s = this.getScale(elem);
            return s.rangeExtent; 
            // return this.scales[0].rangeExtent;
        }

        get domain() {
            if (this._scales.length === 1) {
                return this._scales[0].domain;
            } else {
                throw new Error("AttributeEncoding: multiple scales exist, specify element to get domain.");
            }
        }

        get rangeExtent() {
            if (this._scales.length === 1) {
                return this._scales[0].rangeExtent;
            } else {
                throw new Error("AttributeEncoding: multiple scales exist, specify element to get rangeExtent.");
            }
        }

        get scaleType() {
            return this._scaleType;
        }

        set scaleType(r) {
            this._scaleType = r;
        }

        getDomain(elem) {
            let s = this.getScale(elem);
            return s.domain; 
        }

        set domain(d) {
            this._preferredDomain = d;
            for (let s of this._scales) {
                s._scale.domain(d);
            }
            for (let re of this._refElements) {
                if (re instanceof EncodingAxis) {
                    re.createTicksLabels({});
                }
            }
            this._elem.scene.onChange(VarType.ATTR_VALUE, this);
        }

        set rangeExtent(v) {
            //refBounds will be updated in Encoder
            let val = v < 1 ? 1 : Math.round(v);
            for (let s of this._scales) {
                s.rangeExtent = val;
            }
            for (let re of this._refElements) {
                if (re instanceof EncodingAxis) {
                    re.createTicksLabels({});
                }
            }
            this._elem.scene.onChange(VarType.PROPERTY, Properties.RANGE_EXTENT, this);
        }

        set includeZero(b) {
            //TODO: need to update all linked encodings
            this._includeZero = b;
            for (let re of this._refElements) {
                if (re instanceof EncodingAxis) {
                    re.createTicksLabels({});
                }
            }
            this._elem.scene.onChange(VarType.PROPERTY, Properties.INCLUDE_ZERO, this);
        }

        get includeZero() {
            return this._includeZero;
        }

        set flipScale(v) {
            //TODO: need to update all linked encodings
            this._flipScale = v;
            this._elem.scene.onChange(VarType.PROPERTY, Properties.FLIP_SCALE, this);
        }

        get flipScale(){
            return this._flipScale;
        }

        set mapping(m) {
            this._mapping = m;
        }

        get mapping() {
            return this._mapping;
        }

        set colorScheme(s) {
            this._colorScheme = s;
        }

        get colorScheme() {
            return this._colorScheme;
        }

        addRefElement(rf) {
            if (this._refElements.indexOf(rf) < 0)
                this._refElements.push(rf);
        }

        get refElements() {
            return this._refElements;
        }

        clearRefElements() {
            this._refElements = [];
        }

        zoom(dir, pos, extent, element) {
            //TODO: check if the scale is quantiative or temporal
            //console.log("zooming", this._channel);
            let elem = element ? element : this._elem;
            // elem.scene.mask(elem);

            //update domain
            let domain = this.getDomain(elem),
                lo = d3__namespace.min(domain), hi = d3__namespace.max(domain);
            let notLog = this._scales[0].type !== "log";
            let center = this.getAttrValue(pos, elem, notLog), 
                s = lo - (center - lo) * dir * extent,
                t = hi + (hi - center) * dir * extent;
            if (s === t)
                return;
            if (!notLog && s <= 0)
                return;
            this.domain = [s, t];
        }
    }

    /**
     * 
     * @returns the element (may be the elem's parent) to move if movable, otherwise returns false
     */
    function canTranslate(elem, channel) {
        let ancestors = getAncestors(elem);
        for (let e of ancestors) {
            if (getChannelEncodingByElement(e, channel))
                return false;
        }
        return ancestors.length >= 2 ? ancestors[ancestors.length - 2] : elem;
    }

    function translate(elem, dx, dy) {
        translateElement(elem, dx, dy);
        let scene = getScene(elem);
        if (!scene)
            return;
        let lm = getLeafMarks(elem, true);
        for (let m of lm)
            propagateBoundsUpdate(m);
        for (let m of lm)
            scene.onChange(VarType.CHANNEL, "x", m);
    }

    function translateElement(elem, dx, dy) {
        switch (elem.type) {
            case ElementType.Rect:
            case ElementType.Path:
            case ElementType.Line:
            case ElementType.Area:
                translatePath(elem, dx, dy);
                if (dx !== 0 || dy !== 0) {
                    elem._dirty = true;
                }
                break;
            case ElementType.Group:
            case ElementType.Collection:
            case ElementType.Glyph:
                translateGroup(elem, dx, dy);
                break;
            case "segment":
                translateSegment(elem, dx, dy);
                if (dx !== 0 || dy !== 0) {
                    elem.parent._dirty = true;
                }
                break;
            case "vertex":
                translateVertex(elem, dx, dy);
                if (dx !== 0 || dy !== 0) {
                    elem.parent._dirty = true;
                }
                break;
            default:
                translateMark(elem, dx, dy);
                if (dx !== 0 || dy !== 0) {
                    elem._dirty = true;
                }
                break;
        }
    }


    function translateMark(elem, dx, dy) {
        elem._x += dx;
        elem._y += dy;
        elem._updateBounds();
        if (elem._refBounds)
            elem._refBounds.translate(dx, dy);
    }

    function translateGroup(elem, dx, dy) {
        for (let child of elem.children) {
            translateElement(child, dx, dy);
        }
        if (elem._layout) {
            if (elem._layout._left !== undefined)
                elem._layout._left += dx;
            if (elem._layout._top !== undefined)
                elem._layout._top += dy;
            // if (elem._layout.x !== undefined)
            //     elem._layout.x += dx;
            // if (elem._layout.y !== undefined)
            //     elem._layout.y += dy;
            if (elem._layout._cellBounds) {
                elem._layout._cellBounds.forEach(d => d.translate(dx, dy));
            }
            //elem._layout.run();
        }
        if (dx !== 0 || dy !== 0)
            elem._dirty = true;
        elem._updateBounds();
        if (elem._refBounds)
            elem._refBounds.translate(dx, dy);
    }

    function translatePath(elem, dx, dy) {
    	for (let v of elem.vertices) {
    		translateVertex(v, dx, dy);
    	}
        elem._updateBounds();
        if (elem._refBounds)
            elem._refBounds.translate(dx, dy);
    }

    function translateSegment(seg, dx, dy) {
        translateVertex(seg.vertex1, dx, dy);
        translateVertex(seg.vertex2, dx, dy);
    }

    function translateVertex(v, dx, dy) {
        v.x += dx;
    	v.y += dy;
    }

    // encode(elem, channel, attribute, options?)
    // e.g. msc.encode(circle, "x", "GDP per capita", { scaleType: "log" })
    function encode(elem, channel, attribute, options = {}) {
        let param = { channel, attribute, ...options };
        if (param.attribute === "rowId")
            param.attribute = MSCRowID;
        validateEncodeArguments(elem, channel, attribute);

        if (param.shareScale) {
            let binding = param.shareScale;
            //TODO: check attribute type
            if (binding.channel != param.channel) {
                if (binding.channel.indexOf("Color") < 0 && param.channel.indexOf("Color") < 0)
                    throw new Error("Cannot share scales between " + binding.channel + " and " + param.channel + " encodings");
            }

            param.scheme = param.shareScale.colorScheme;
        }

        //initialize refBounds for area mark created through densification
        //TODO: move all refBounds initialization here?
        initializeAreaRefBounds(elem);

        let aggregator = param.aggregator ? param.aggregator : "sum";
        //scale = param.scale ? param.scale : createScale(param.attribute, param.channel, elem),
        //console.log("------ encode", param.channel, param.attribute, " --");

        param.table = getDataTable(elem);

        let enc = new AttributeEncoding(elem, param.channel, param.attribute, aggregator, param),
            scene = elem.scene;
        // let key = getEncodingKey(elem);
        // if (!(key in this._encodings))
        //     this._encodings[key] = {};
        // this._encodings[key][param.channel] = enc;
        scene._addAttributeEncoding(enc);
        encodingSpecified(enc, scene._depGraph, param.shareScale);

        // if (axis)
        //     this.axis(param.channel, param.attribute);

        // if (gridlines)
        //     this.gridlines(param.channel, param.attribute);

        if (param.shareScale)
            scene.onChange(VarType.ATTR_VALUE, enc); //run all the encoders
        else {
            // let channel = elem.type === ElementType.Rect && param.channel === "area" ? "width" : param.channel;
            scene.onChange(VarType.CHANNEL, param.channel, elem);
        }

        return enc;
    }

    function mapWidth_Area(elem, scale, attrValues) {
        let baseline = elem.baseline,
            ori = elem.orientation;
        if (ori === LayoutOrientation.VERTICAL) {
            let half = elem._vertices.length / 2;
            switch (baseline) {
                case "left":
                    setAreaVertexXRange(elem, half, elem._vertices.length, elem.refBounds.left);
                    mapAreaVertexXRange(elem, 0, half, i => elem.refBounds.left + scale.map(attrValues[getVertexId(elem, i)]));
                    break;
                case "right":
                    mapAreaVertexXRange(elem, half, elem._vertices.length, i => elem.refBounds.right - scale.map(attrValues[getVertexId(elem, i)]));
                    setAreaVertexXRange(elem, 0, half, elem.refBounds.right);
                    break;
                case "center":
                    console.log("center");
                    mapAreaVertexXRange(elem, half, elem._vertices.length, i => elem.refBounds.center - scale.map(attrValues[getVertexId(elem, i)]) / 2);
                    mapAreaVertexXRange(elem, 0, half, i => elem.refBounds.center + scale.map(attrValues[getVertexId(elem, i)]) / 2);
                    break;
            }
        }
    }

    function mapHeight_Area(elem, scale, attrValues) {
        let baseline = elem.baseline,
            ori = elem.orientation;
        if (ori === LayoutOrientation.HORIZONTAL) {
            let half = elem._vertices.length / 2;
            switch (baseline) {
                case "top":
                    // let btmVertices = getPeers(area.bottomLeftVertex);
                    // for (let v of btmVertices) {
                    //     setElementProperty(v, "y", area.refBounds.top + scale.map(attrValues[v.id]));
                    // }
                    mapAreaVertexYRange(elem, half, elem._vertices.length, i => elem.refBounds.top + scale.map(attrValues[getVertexId(elem, i)]));
                    setAreaVertexYRange(elem, 0, half, elem.refBounds.top);
                    break;
                case "middle":
                    mapAreaVertexYRange(elem, 0, half, i => elem.refBounds.middle - scale.map(attrValues[getVertexId(elem, i)]) / 2);
                    mapAreaVertexYRange(elem, half, elem._vertices.length, i => elem.refBounds.middle + scale.map(attrValues[getVertexId(elem, i)]) / 2);
                    break;
                case "bottom":
                default:
                    // let topVertices = getPeers(area.topLeftVertex);
                    // for (let v of topVertices) {
                    //     console.log(scale.map(attrValues[v.id]));
                    // }
                    mapAreaVertexYRange(elem, 0, half, i => elem.refBounds.bottom - scale.map(attrValues[getVertexId(elem, i)]));
                    setAreaVertexYRange(elem, half, elem._vertices.length, elem.refBounds.bottom);
                    break;
            }
        }
    }

    function setAreaVertexXRange(area, start, end, value) {
        for (let i = start; i < end; i++)
            area._vertices._xs[i] = value;
        area._dirty = true;
    }

    function mapAreaVertexXRange(area, start, end, valueFn) {
        for (let i = start; i < end; i++)
            area._vertices._xs[i] = valueFn(i);
        area._dirty = true;
    }

    function setAreaVertexYRange(area, start, end, value) {
        for (let i = start; i < end; i++)
            area._vertices._ys[i] = value;
        area._dirty = true;
    }

    function mapAreaVertexYRange(area, start, end, valueFn) {
        for (let i = start; i < end; i++)
            area._vertices._ys[i] = valueFn(i);
        area._dirty = true;
    }

    function mapHeight_NegativeValues_Area(elem, scale, attrValues) {
        let half = elem._vertices.length / 2;
        mapAreaVertexYRange(elem, 0, half, i => elem.refBounds.bottom - scale.map(attrValues[getVertexId(elem, i)]));
        setAreaVertexYRange(elem, half, elem._vertices.length, elem.refBounds.bottom - scale.map(0));
    }


    function mapWidth_NegativeValues_Rect(mk, scale, attrValues) {
        let zeroX = mk.refBounds.left + scale.map(0), valueX = mk.refBounds.left + scale.map(attrValues[mk.id]);
        translateElement(mk.leftSegment, zeroX - mk.leftSegment.x, 0);
        translateElement(mk.rightSegment, valueX - mk.rightSegment.x, 0);
    }

    function mapHeight_NegativeValues_Rect(mk, scale, attrValues) {
        let zeroX = mk.refBounds.bottom - scale.map(0), valueX = mk.refBounds.bottom - scale.map(attrValues[mk.id]);
        translateElement(mk.bottomSegment, 0, zeroX - mk.bottomSegment.y);
        translateElement(mk.topSegment, 0, valueX - mk.topSegment.y);

    }

    function mapFillGradient_Area(area, scale, attrValues, enc) {
        // let vals = Object.values(attrValues),
        //     min = Math.min(...vals),
        //     max = Math.max(...vals);
        let data = area._vertices._ids.map((d, i) => attrValues[getVertexId(area, i)]),
            min = d3.min(data),
            max = d3.max(data);
        let fill = area.orientation === "horizontal" ? new LinearGradient({ x1: 0, y1: 100, x2: 0, y2: 0 }) : new LinearGradient({ x1: 0, y1: 0, x2: 100, y2: 0 });
        fill.addStop(0, scale.map(min), 1.0);
        if (enc._mapping) {
            let vals = Object.keys(enc._mapping).map(d => parseFloat(d)).sort();
            for (let v of vals) {
                if (v > min && v < max) {
                    fill.addStop(100 * (v - min) / (max - min), scale.map(v), 1.0);
                }
            }
        } else if (scale.type === "divergingColor") {
            fill.addStop(100 * (-min) / (max - min), scale.map(0), 1.0);
        }

        if (scale.type === "sequentialColor") {
            fill.addStop(100 * (-min) / (max - min), scale.map(0), 1.0);
        }
        fill.addStop(100, scale.map(max), 1.0);
        area.fillColor = fill;
    }

    function repeat(elem, dataOrCount, param) {
        if (typeof dataOrCount === "number")
            return repeatByCount(elem, dataOrCount);
        if (isGroupCounts(dataOrCount))
            return repeatByGroupCounts(elem, dataOrCount, param);
        return repeatByAttribute(elem, dataOrCount, param);
    }

    function repeatByCount(elem, count) {
        if (!Number.isInteger(count) || count < 1) {
            throw new Error("Repeat count must be a positive integer");
        }
        //prepare table
        let data = [];
        for (let i = 0; i < count; i++)
            data.push({index: i});
        let tbl = new DataTable(data, "from count");
        return repeatByAttribute(elem, tbl);
    }

    // A plain object of group name -> count, e.g. {colored: 15, gray: 20}, as opposed to
    // a DataTable/Tree/Network (real data) or a bare number (repeatByCount).
    function isGroupCounts(obj) {
        if (!obj || typeof obj !== "object" || Array.isArray(obj))
            return false;
        if (obj instanceof DataTable || obj instanceof Tree || obj instanceof Network)
            return false;
        let vals = Object.values(obj);
        return vals.length > 0 && vals.every(v => typeof v === "number");
    }

    // repeat(elem, {colored: 15, gray: 20}) expands to one row per unit (15 + 20 = 35 rows
    // here), each tagged with a "group" attribute set to its key ("colored" or "gray").
    // This lets you sketch an icon array (or any repeated-count chart) straight from counts
    // in code, without first building a CSV/table by hand. Follow up with
    // msc.encode(elem, "src", "group", {mapping: {...}}) (or fillColor, etc.) to
    // differentiate the groups visually.
    function repeatByGroupCounts(elem, counts, param) {
        let data = [];
        for (let key of Object.keys(counts)) {
            let n = counts[key];
            if (!Number.isInteger(n) || n < 0)
                throw new Error("Repeat group counts must be non-negative integers: " + key + " = " + n);
            for (let i = 0; i < n; i++)
                data.push({group: key});
        }
        if (data.length === 0)
            throw new Error("Repeat counts must include at least one group with a positive count");
        let tbl = new DataTable(data, "from group counts");
        return repeatByAttribute(elem, tbl, param);
    }

    function repeatByAttribute(elem, data, param) {
        let scene = getScene(elem),
            args = param ? param : {};
        args["attribute"] = args["attribute"] || MSCRowID;
        //console.log("------ repeat by", args["attribute"], " ----");
        validateRepeatArguments(elem, data, args);

        if (data instanceof Tree || data instanceof Network) {
            let parent0 = elem[0].parent,
                parent1 = elem[1].parent;
            let [nodes, links] = repeatNodeLink(scene, elem[0], elem[1], data);
            // scene._buildPeerIndex();
            childRemoved(parent0, elem[0], scene._depGraph);
            childRemoved(parent1, elem[1], scene._depGraph);
            newCollectionCreated(nodes, scene._depGraph);
            newCollectionCreated(links, scene._depGraph);
            parentChildConnected(nodes, elem[0], scene._depGraph);
            parentChildConnected(nodes.parent, nodes, scene._depGraph);
            parentChildConnected(links, elem[1], scene._depGraph);
            parentChildConnected(links.parent, links, scene._depGraph);
            return [nodes, links];
        } else if (data instanceof DataTable) {
            let parent = elem.parent;
            let collection = repeatElement(scene, elem, args["attribute"], data);
            // scene._buildPeerIndex();
            childRemoved(parent, elem, scene._depGraph);
            newCollectionCreated(collection, scene._depGraph);
            parentChildConnected(collection, elem, scene._depGraph);
            parentChildConnected(collection.parent, collection, scene._depGraph);
            repeatSpecified(collection, args["attribute"], data, scene._depGraph);
            // console.log(scene._depGraph);
            if (args.layout)
                collection.layout = args.layout;
            return collection;
        }
    }

    function validateRepeatArguments(elem, data, param) {
        if (!elem || data === undefined) {
            throw new Error("Incomplete information to do repeat. You must specify an element, a categorical data attribute and a data table");
        }

        if (data instanceof Tree || data instanceof Network) {
            if (!Array.isArray(elem) || elem.length !== 2)
                throw new Error("To repeat with a tree or a network, you need to provide two marks, one for node and one for link");
        } else if (data instanceof DataTable) {
            validateAttribute(param["attribute"], data);
        }

        if (param.layout && !(param.layout instanceof Layout)) {
            throw new Error("Invalid layout: " + param.layout);
        }
    }

    function repeatable(obj) {
        if (Array.isArray(obj)) {
            if (obj.length === 1) {
                return canRepeat(obj[0]);
            } else {
                for (let c of obj) {
                    if (!isMark(c) || c.dataScope)
                        return false;
                }
            }
            return true;
        } else {
            return canRepeat(obj);
        }
    }

    function canRepeat(elem) {
        if ((isMark(elem) || elem.type == ElementType.Glyph) && !elem.dataScope)
            return true;
        else if (elem.type === ElementType.Collection)
            return getScopeNumTuples(elem.firstChild.dataScope) > 1;
        return false;
    }

    function repeatElement(scene, elem, attr, datatable) {
        let type = datatable.type(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Repeat only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!repeatable(elem)) {
            throw new Error("The " + elem.type + " is not repeatable");
        }

        return _doRepeat(scene, elem, attr, datatable);
    }

    function _doRepeat(scene, elem, attr, datatable) {
        let baseRef = elem.dataScope ? elem.dataScope : fullTableScopeRef(datatable),
            ds = getScopeRefsByAttribute(baseRef, attr);
        let coll = createElement(scene, { type: ElementType.Collection });
        coll.dataScope = baseRef;

        coll.addChild(elem);

        if (!elem._refBounds)
            elem._refBounds = elem.bounds.clone();
        for (let i = 1; i < ds.length; i++) {
            let c = duplicate(elem);
            coll.addChild(c);
        }

        coll.children.forEach((d, i) => d.dataScope = ds[i]);
        //TODO: turn the folllwing into getter and setter
        // if (!scene.cellAlign.hasOwnProperty(compnt.classId)) {
        // 	scene.cellAlign[compnt.classId] = {x: BoundsAnchor.Left, y: BoundsAnchor.Bottom};
        // }
        //scene._reapplySizeBindings(elem);
        return coll;
    }

    function repeatNodeLink(scene, node, link, data) {
        let nodeBaseRef = node.dataScope ? node.dataScope : fullTableScopeRef(data.nodeTable),
            nodeDS = getScopeRefsByAttribute(nodeBaseRef, MSCNodeID);
        let linkColl = createElement(scene, { type: ElementType.Collection }),
            nodeColl = createElement(scene, { type: ElementType.Collection }),
            id2nodeMk = {};
        nodeColl.dataScope = nodeBaseRef;

        //do not initialize classId here, initialize in scene.mark/glyph/new Collection()
        // compnt.classId = compnt.id;
        nodeColl.addChild(node);
        for (let i = 1; i < nodeDS.length; i++) {
            let c = duplicate(node);
            nodeColl.addChild(c);
        }

        nodeColl.children.forEach((d, i) => {
            d.dataScope = nodeDS[i];
            d.links = [];
            id2nodeMk[getScopeAttrVal(d.dataScope, MSCNodeID)] = d;
        });

        let linkBaseRef = link.dataScope ? link.dataScope : fullTableScopeRef(data.linkTable),
            linkDS = getScopeRefsByAttribute(linkBaseRef, MSCRowID);
        linkColl.dataScope = linkBaseRef;

        linkColl.addChild(link);
        for (let i = 1; i < linkDS.length; i++) {
            let c = duplicate(link);
            linkColl.addChild(c);
        }

        linkColl.children.forEach((d, i) => d.dataScope = linkDS[i]);

        let s = (data instanceof Tree) ? "parent" : "source",
            t = (data instanceof Tree) ? "child" : "target";
        for (let l of linkColl.children) {
            let sid = getScopeAttrVal(l.dataScope, s),
                tid = getScopeAttrVal(l.dataScope, t),
                sourceMark = id2nodeMk[sid],
                targetMark = id2nodeMk[tid];
            l.source = sourceMark;
            l.target = targetMark;
            sourceMark.links.push(l);
            targetMark.links.push(l);
            //l._updateBounds();
        }

        return [nodeColl, linkColl];
    }

    class GridLayout extends Layout {

        constructor(args) {
    		super();
    		this.type = LayoutType.GRID;
    		this._numCols = args["numCols"];
    		this._numRows = args["numRows"];
    		this._start = ("start" in args) ? args["start"] : GridCorner.TopLeft;
    		this._direction = ("direction" in args) ? args["direction"] : GridFillDirection.RowFirst;
    		this._rowGap = "rowGap" in args && args["rowGap"] !== undefined ? args["rowGap"] : 5;
    		this._colGap = "colGap" in args && args["colGap"] !== undefined ? args["colGap"] : 5;
    		this._cellHorzAlignment = "horzCellAlignment" in args && validateCellAlignment("h", args["horzCellAlignment"]) ? args["horzCellAlignment"] : BoundsAnchor.LEFT;
    		this._cellVertAlignment = "vertCellAlignment" in args && validateCellAlignment("v", args["vertCellAlignment"]) ? args["vertCellAlignment"] : BoundsAnchor.BOTTOM;
    		this._rowOffset = "rowOffset" in args && args["rowOffset"] !== undefined ? args["rowOffset"] : 0;
    		this._colOffset = "colOffset" in args && args["colOffset"] !== undefined ? args["colOffset"] : 0;
    		if (!this._numCols && !this._numRows)
    			this._numRows = 1;
    		this._includeInvisible = false;
    		this._left = undefined;
    		this._top = undefined;
    		this._cellBounds = undefined;
    		this._grid = undefined;
    	}

    	get includeInvisible() {
    		return this._includeInvisible;
    	}

    	set includeInvisible(v) {
    		this._includeInvisible = v;
    	}

    	get cellBounds() {
    		return this._cellBounds;
    	}

    	get numCols() {
    		if (this._numCols) {
    			return this._numCols;
    		} else if (this._numRows) {
    			return Math.ceil(this.group.children.length/this._numRows);
    		} else {
    			return 0;
    		}
    	}

    	set numCols(c) {
    		this._numCols = c;
    	}

    	set numRows(c) {
    		this._numRows = c;
    	}
     
    	get numRows() {
    		if (this._numRows) {
    			return this._numRows;
    		} else if (this._numCols) {
    			return Math.ceil(this.group.children.length/this._numCols);
    		} else 
    			return 0;
    	}

    	get rowOffset() {
    		return this._rowOffset;
    	}

    	set rowOffset(v) {
    		this._rowOffset = v;
    	}

    	get colOffset() {
    		return this._colOffset;
    	}

    	set colOffset(v) {
    		this._colOffset = v;
    	}

    	clone() {
    		let g = new GridLayout({
    			numCols: this._numCols,
    			numRows: this._numRows,
    			start: this._start,
    			direction: this._direction,
    			colGap: this._colGap,
    			rowGap: this._rowGap,
    			horzCellAlignment: this._cellHorzAlignment,
    			vertCellAlignment: this._cellVertAlignment,
    			rowOffset: this._rowOffset,
    			colOffset: this._colOffset
    		});
    		g._includeInvisible = this._includeInvisible;
    		g._left = this._left;
    		g._top = this._top;
    		if (this._cellBounds) {
    			g._cellBounds = this._cellBounds.map(d => d.clone());
    		}
    		return g;
    	}

    	/**
    	 * @param {*} leafMarkOnly: the grid cell content may be a group (e.g., glyph), use this argument to indicate if we need leaf marks (and their vertices/segments)
    	 * @param {*} exampleElem: an example of the elements to get, e.g., a vertex, a segment, or a mark
    	 * @returns {Array} Array of element groups by row
    	 */
    	getElementsByRow(leafMarkOnly, exampleElem) {
    		let elemGroups = [], elems = this.group.children;
    		for (let i = 0; i < this.numRows; i++) {
    			let row = this._grid[i].filter(d => d != null).map(d => elems[d]);
    			if (!leafMarkOnly) {
    				elemGroups.push(row);
    			}
    			else {
    				let leaves = [];
    				for (let t of row) {
    					leaves = leaves.concat(getLeafMarks(t));
    				}
    				elemGroups.push(leaves);
    			}
    		}

    		if (exampleElem) {
    			elemGroups = this._filterElementsByExample(elemGroups, exampleElem);
    		}

    		return elemGroups;
    	}

    	/**
    	 * @param {*} leafMarkOnly: the grid cell content may be a group (e.g., glyph), use this argument to indicate if we need leaf marks (and their vertices/segments)
    	 * @param {*} exampleElem: an example of the elements to get, e.g., a vertex, a segment, or a mark
    	 * @returns {Array} Array of element groups by column
    	 */
    	getElementsByCol(leafMarkOnly, exampleElem) {
    		let elemGroups = [], elems = this.group.children, 
    			grid = this._grid;
    		for (let i = 0; i < this.numCols; i++) {
    			let col = grid.map(r => r[i]).filter(d => d != null).map(d => elems[d]);
    			if (!leafMarkOnly) {
    				elemGroups.push(col);
    			}
    			else {
    				let leaves = [];
    				for (let t of col) {
    					leaves = leaves.concat(getLeafMarks(t));
    				}
    				elemGroups.push(leaves);
    			}
    		}

    		if (exampleElem) {
    			elemGroups = this._filterElementsByExample(elemGroups, exampleElem);
    		}

    		return elemGroups;
    	}

    	/**
    	 * @param {*} leafMarkOnly: the grid cell content may be a group (e.g., glyph), use this argument to indicate if we need leaf marks (and their vertices/segments)
    	 * @param {*} exampleElem: an example of the elements to get, e.g., a vertex, a segment, or a mark
    	 * @returns {Array} Array of element groups by cell
    	 */
    	getElementsByCell(leafMarkOnly, exampleElem) {
    		let elemGroups = [], children = this.group.children; 

    		for (let i = 0; i < children.length; i++) {
    			if (!leafMarkOnly) {
    				elemGroups.push(children[i]);
    			}
    			else {
    				let leaves = getLeafMarks(children[i]);
    				elemGroups.push(leaves);
    			}
    		}

    		if (exampleElem) {
    			elemGroups = this._filterElementsByExample(elemGroups, exampleElem);
    		}

    		return elemGroups;
    	}

    	_filterElementsByExample(elemGroups, exampleElem) {
    		let result;
    		if (exampleElem.type === "vertex") {
    			result = elemGroups.map(arr => arr.filter(d => d.classId === exampleElem.parent.classId)); //needed if grid cell content is a glyph
    			result = result.map(arr => getPeerVertices(exampleElem, arr));
    		} else if (exampleElem.type === "segment") {
    			result = elemGroups.map(arr => arr.filter(d => d.classId === exampleElem.parent.classId)); //needed if grid cell content is a glyph
    			result = result.map(arr => getPeerSegments(exampleElem, arr));
    		} else {
    			result = elemGroups.map(arr => arr.filter(d => d.classId === exampleElem.classId)); //needed if grid cell content is a glyph
    		}
    		return result;
    	}

    	getIndex(elem) {
    		let e = elem;
    		while (e && e.parent !== this.group) {
    			e = e.parent;
    		}
    		return this.group.children.indexOf(e);
    	}
    	
    	getRowCol(index) {
    		let row, col;
            switch (this._direction) {
                case GridFillDirection.RowFirst:
                    row = Math.floor(index / this.numCols);
                    col = index % this.numCols;
                    break;
                case GridFillDirection.ColumnFirst:
                    row = index % this.numRows;
                    col = Math.floor(index / this.numRows);
                    break;
                default:
                    throw new Error("Invalid fill direction. Use 'row_first' or 'column_first'.");
            }

            // Adjust row and column based on the start corner
            if (this._start.toLowerCase().includes('bottom')) {
                row = this.numRows - 1 - row;
            }
            if (this._start.toLowerCase().includes('right')) {
                col = this.numCols - 1 - col;
            }

            return { row, col };
    	}

    	get startCorner() {
    		return this._start;
    	}

    	set startCorner(s) {
    		this._start = s;
    	}

    	get direction() {
    		return this._direction;
    	}

    	set direction(d) {
    		this._direction = d;
    	}
    }

    class Legend extends Group{

        constructor(enc, args) {
            super();
            this._type = ElementType.Axis;
            this._id = this._type + generateUniqueID();
            this._enc = enc;

            this._textColor = ("textColor" in args) ? args["textColor"] : "#555";
            this._strokeColor = ("strokeColor" in args) ? args["strokeColor"] : "#555";
            this._fontSize = "fontSize" in args? args.fontSize: "12px";
            this._x = ("x" in args) ? args["x"] : 100;
            this._y = ("y" in args) ? args["y"] : 100;
            this._showTitle = ("showTitle" in args) ? args["showTitle"] : true;
            this._orientation = ("orientation" in args) ? args["orientation"] : LayoutOrientation.VERTICAL;
            this._numberFormat = args["numberFormat"] ? args["numberFormat"] : "";
        }

        get attribute() {
            return this._enc.attribute;
        }    

        get channel() {
            return this._enc.channel;
        }

        get attributeType() {
            return getDataTable(this._enc.element).getFieldType(this.attribute);
        }

        get orientation() {
            return this._orientation;
        }

        get textColor() {
            return this._textColor;
        }

    }

    class CategoricalLegend extends Legend {

        constructor(enc, args) {
            super(enc, args);

            if (!("numCols" in args) && !("numRows" in args)) {
                if (this._orientation === LayoutOrientation.VERTICAL)
                    this._numCols = 1;
                else
                    this._numRows = 1;
            }
            else {
                this._numCols = args["numCols"];
                this._numRows = args["numRows"];
            }

            this._initialize();
        }

        _initialize() {
            let scene = this._enc.element.scene,
                attr = this._enc.attribute,
                scale = this._enc.scales[0];
            let dt = new DataTable(scale.domain.map(d => ({"category": d, "value": scale.map(d)})));
            let longestText = dt.unique("category").sort((a,b) => b.length - a.length)[0];
            let mark = this._enc.element;
            let sw = mark instanceof Path$1 && mark.closed && this._enc.channel !== "strokeColor" ? mark.strokeWidth : 0;
            if (this._orientation === LayoutOrientation.VERTICAL) {
                let titleSize = 0;
                if (this._showTitle) {
                    this.addChild(new SimpleText({fillColor: this._textColor, "fontSize": this._fontSize, "text": attr, x: this._x, y: this._y, "anchor": ["left", "top"]})); 
                    titleSize = parseFloat(this._fontSize) + 5;
                }
                let rect = scene.mark("rect", {"top": this._y + 2 + titleSize, "left": this._x, "width": 10, "height": 10, "strokeWidth": sw, "strokeColor": mark.strokeColor, "opacity": mark.opacity});
                let text = scene.mark("text", {text: longestText, fillColor: this._textColor, "fontSize": this._fontSize, x: this._x + 20, y: this._y + titleSize + 12 + sw, "anchor": ["left", "bottom"]});
                let glyph = scene.glyph(rect, text);
                let coll = repeat(glyph, dt);
                // encode(text, {"channel": "text", "attribute": "category", "_remember": false});
                // encode(rect, {"channel": "fillColor", "attribute": "category", "_remember": false, scale: scale});
                encode(text, "text", "category", { forLegend: true });
                encode(rect, "fillColor", "category", { shareScale: this._enc, forLegend: true });
                coll.layout = new GridLayout({"numCols": this._numCols, "numRows": this._numRows});
                this.addChild(coll);
            } else {
                //do not show title for now
                let rect = scene.mark("rect", {"top": this._y, "left": this._x, "width": 10, "height": 10, "strokeWidth": sw, "strokeColor": mark.strokeColor, "opacity": mark.opacity});
                let text = scene.mark("text", {text: longestText, fillColor: this._textColor, "fontSize": this._fontSize, x: this._x + 15, y: this._y, "anchor": ["left", "top"]});
                let glyph = scene.glyph(rect, text);
                let coll = repeat(glyph, dt);
                // encode(text, {"channel": "text", "attribute": "category", "_remember": false});
                // encode(rect, {"channel": "fillColor", "attribute": "category", "_remember": false, scale: scale});
                encode(text, "text", "category", { forLegend: true });
                encode(rect, "fillColor", "category", { shareScale: this._enc, forLegend: true });
                coll.layout = new GridLayout({"numCols": this._numCols, "numRows": this._numRows, "colGap": 15});
                this.addChild(coll);
            }
        }

        
    }

    class QuantitativeLegend extends Legend {

        constructor(enc, args) {
            super(enc, args);
            this._initialize();
        }

        _initialize() {
            let scene = this._enc.element.scene,
                attr = this._enc.attribute,
                wd, ht;
            if (this._orientation == LayoutOrientation.VERTICAL) {
                wd = 15;
                ht = 300;
            } else {
                wd = 300;
                ht = 15;
            }
            let titleSize;
            if (this._showTitle){
                let title = scene.mark("text", {fillColor: this._textColor, "text": attr, x: this._x + wd/2, y: this._y, "anchor": ["center", "middle"]});
                this.addChild(title);
                titleSize = 20;
            } else {
                titleSize = 0;
            }
            
            let rect = scene.mark("rect", {"top": this._y + titleSize, "left": this._x, "width": wd, "height": ht, "strokeWidth": 0, opacity: this._enc.element.opacity});
            let vals = Object.values(this._enc.attrValues),
                domain = [d3__namespace.min(vals), d3__namespace.max(vals)], mapping = this._enc.mapping;
            let gradient;
            let texts = [], ticks = [], offset = 5, tickSize = 5;
            let formatter = d3__namespace.format(this._numberFormat);

            if (mapping) {
                let values = Object.keys(mapping).map(d => parseFloat(d)).sort((a,b) => a - b);
                if (this._orientation == LayoutOrientation.VERTICAL) {
                    gradient = new LinearGradient({x1: 0, y1: 100, x2: 0, y2: 0});
                    values.forEach(d => {
                        let p = (d - domain[0])/(domain[1] - domain[0]);
                        gradient.addStop(p*100, mapping[d], 1.0);
                        let tk = scene.mark("line", {"x1": this._x + wd, "x2": this._x + wd + tickSize, "y1": this._y + ht - p * ht + titleSize, "y2": this._y + ht - p * ht+ titleSize, "strokeColor": this._strokeColor});
                        ticks.push(tk);
                        let t = scene.mark("text", {fillColor: this._textColor, "text": this._numberFormat ? formatter(d) : d.toFixed(0), x: this._x + wd + offset + tickSize, y: this._y + ht - p * ht + titleSize, "anchor": ["left", "middle"]});
                        texts.push(t);
                    });
                } else {
                    gradient = new LinearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
                    values.forEach(d => {
                        let p = (d - domain[0])/(domain[1] - domain[0]);
                        gradient.addStop(p*100, mapping[d], 1.0);
                        let tk = scene.mark("line", {"x1": this._x + p * wd, "x2": this._x + p * wd, "y1": this._y + 20 - tickSize + titleSize, "y2": this._y + ht + tickSize + titleSize, "strokeColor": this._strokeColor});
                        ticks.push(tk);
                        let t = scene.mark("text", {fillColor: this._textColor, "text": this._numberFormat ? formatter(d) : d.toFixed(0), x: this._x + p * wd, y: this._y + ht + offset + titleSize, "anchor": ["center", "top"]});
                        texts.push(t);
                    });
                }
            } else {
                let domain = this._enc.scales[0].domain, dt = getDataTable(this._enc.element), ft = dt.type(attr);
                let stops = [], 
                    uniqueVals = ft === AttributeType.Date? dt.getUniqueFieldValues(attr) : [...new Set(Object.values(this._enc.attrValues))];
                    
                if (uniqueVals.length <= 10){
                    stops = uniqueVals;
                    stops.sort((a, b) => a - b);
                } else {
                    if (ft === AttributeType.Date) {
                        uniqueVals.sort((a, b) => a - b);
                        for (let i = 0; i < uniqueVals.length; i+= Math.ceil(uniqueVals.length/10))
                            stops.push(uniqueVals[i]);
                    } else {
                        let incr = (domain[1] - domain[0])/9;
                        for (let i = 0; i < 10; i++)
                            stops.push(domain[0] + i * incr);
                    }
                }
                //determine decimal places
                let decimalPlaces = 0, interval = (stops[stops.length - 1] - stops[0])/stops.length;
                while (interval < 1) {
                    interval *= 10;
                    decimalPlaces++;
                }
                stops = stops.map(d => d.toFixed(decimalPlaces));
                if (this._orientation == LayoutOrientation.VERTICAL) {
                    gradient = new LinearGradient({x1: 0, y1: 100, x2: 0, y2: 0});
                    stops.forEach(d => {
                        let p = (d - domain[0])/(domain[1] - domain[0]);
                        gradient.addStop(p*100, this._enc.scales[0].map(d), 1.0);
                        let tk = scene.mark("line", {"x1": this._x + wd, "x2": this._x + wd + tickSize, "y1": this._y + ht - p * ht + titleSize, "y2": this._y + ht - p * ht + titleSize, "strokeColor": this._strokeColor});
                        ticks.push(tk);
                        let t = scene.mark("text", {fillColor: this._textColor, "text": ft === AttributeType.Date? dt.raw(attr, d) : this._numberFormat ? formatter(d) : d,
                            x: this._x + wd + offset + tickSize, y: this._y + ht - p * ht + titleSize, "anchor": ["left", "middle"]});
                        texts.push(t);
                    });
                } else {
                    gradient = new LinearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
                    stops.forEach(d => {
                        let p = (d - domain[0])/(domain[1] - domain[0]);
                        gradient.addStop(p*100, this._enc.scale.map(d), 1.0);
                        let tk = scene.mark("line", {"x1": this._x + p * wd, "x2": this._x + p * wd, "y1": this._y + ht + titleSize, "y2": this._y + ht + tickSize + titleSize, "strokeColor": this._strokeColor});
                        ticks.push(tk);
                        let t = scene.mark("text", {fillColor: this._textColor, "text": ft === AttributeType.Date? dt.raw(attr, d) : d, x: this._x + p * wd, y: this._y + ht + offset + titleSize, "anchor": ["center", "top"]});
                        texts.push(t);
                    });
                }
            }
            rect.styles.fillColor = gradient;

            this.addChild(rect);
            for (let t of texts)
                this.addChild(t);
            for (let tk of ticks)
                this.addChild(tk);
        }
    }

    class LayoutAxis extends Axis {

        constructor(elems, channel, attr, args) {
            super(args);
            this._elems = elems;
            this._attribute = attr;
            this._channel = channel;
            this._posArg = this._channel == "x" || this._channel == "width"? args["pathY"] : args["pathX"]; 
            this._labelAttribute = args.labelAttribute;

            this._orientation = "orientation" in args ? args["orientation"] : 
                this._channel === "x" || this._channel == "width" ? AxisOrientation.BOTTOM : AxisOrientation.LEFT;
            
            this._titleText = "title" in args ? args["title"] : this._attribute;

            this._path = this._channel === "angle" ? new Circle({"strokeColor": this._strokeColor, "id": this._id + "_path"}) : 
                         new Path$1({"strokeColor": this._strokeColor, "id": this._id + "_path"});
            if (!this._pathVisible)
                this._path.visibility = "hidden";
            this.addChild(this._path);


            this.createTicksLabels(args);

            if (getScopeDataTable(this._elems[0].dataScope).type(this._attribute) === AttributeType.Date && !("labelFormat" in args)) {
                this._labelFormat = "%m/%d/%y";
            }
        }

        // get collection() {
        //     return this._coll;
        // }

        get elements() {
            //return this._elems;
            if (this.layout.type === LayoutType.CLUSTER) {
                const map = new Map(this._elems.map(d => [d.datum[MSCNodeID], d] ));
                return this.layout._d3Root.leaves().map(d => map.get(d.data[MSCNodeID]));
                //new Map(this.layout._d3Root.leaves().map(d => [d.data[MSCNodeID], d]));
            } else {
                return this._elems;
            }
            //return this.layout.type === LayoutType.CLUSTER ? this.layout._d3Root.leaves().map(d => d.data) : this._elems;
        }

        get layout() {
            return this._elems[0].parent.layout;
        }

        createTicksLabels(args) {
            if ("tickValues" in args) {
                this._tickValues = args["tickValues"];
                this._labelValues = args["tickValues"];
            } else {
                this._tickValues = this.elements.map(d => d.datum[this._labelAttribute ? this._labelAttribute : this._attribute]);
                this._labelValues = this._tickValues;
            }
            
            this._ticks.removeAll();
            for (let i = 0; i < this._tickValues.length; i++) {
                let t = new Path$1({"strokeColor": this._strokeColor, "id": this._id + "_tick" + i});
                if (!this._tickVisible)
                    t.visibility = "hidden";
                this._ticks.addChild(t);
            }

            this._labels.removeAll();
            let formatter, attrType = getScopeDataTable(this._elems[0].dataScope).type(this._labelAttribute ? this._labelAttribute : this._attribute);
            switch (attrType) {
                case AttributeType.Date:
                    formatter = d3__namespace.timeFormat(this._labelFormat);
                    break;
                case AttributeType.String:
                    formatter = function(d) {return d;};
                    break;
                default:
                    formatter = d3__namespace.format(this._labelFormat);
                    break;
            }

            for (let [i, v] of this._labelValues.entries()) {
                let t = new SimpleText({"text": formatter(v), fontSize: this._fontSize, fillColor: this._textColor, "id": this._id + "_label" + i});
                this._labels.addChild(t);
            }

            this._title._text = this._titleText;
        }
    }

    class Composite extends Group {

        constructor(args) {
            super();
            this._type = ElementType.Composite;
            this._id = args && args.id ? args.id : this._type + generateUniqueID();
        }

        addChild(c) {
            let p = c.parent;
            super.addChild(c);
            let dp = getScene(c)._depGraph;
            if (p)
                childRemoved(p, c, dp);
            parentChildConnected(this, c, dp);
        }

    }

    function createElement(scene, args) {
        let type = args.type, elem;
        switch (type) {
            case "collection":
                elem = createCollection(args);
                break;
            case "glyph":
                elem = createGlyph(args);
                break;
            case "axis":
                elem = createAxis(args);
                break;
            case "legend":
                elem = createLegend(args);
                break;
            case "composite":
                elem = createComposite(args);
                break;
            default:
                elem = createMark(args);
                break;
        }
        scene.addChild(elem);
        scene._itemMap[elem.id] = elem;
        return elem;
    }

    function createMark(args) {
        let m = null;
        switch (args.type) {
            case ElementType.Circle:
                m = new Circle(args);
                break;
            case ElementType.Line:
                var x1 = "x1" in args ? args["x1"] : 0,
                    y1 = "y1" in args ? args["y1"] : 0,
                    x2 = "x2" in args ? args["x2"] : 100,
                    y2 = "y2" in args ? args["y2"] : 100;
                args.vertices = [[x1, y1], [x2, y2]];
                m = new Line(args);
                break;
            case ElementType.Rect: 
                var top = "top" in args ? args["top"] : 0,
                    left = "left" in args ? args["left"] : 0, 
                    width = "width" in args ? args["width"] : 50,
                    height = "height" in args ? args["height"] : 30;
                args.vertices = [[left, top], [left + width, top], [left + width, top + height], [left, top + height]];
                m = new Rect(args);
                break;
            case ElementType.SimpleText: {
                m = new SimpleText(args);
                break;
            }
            case ElementType.RichText: {
                m = new RichText(args);
                break;
            }
            case ElementType.Image:
                m = new Image(args);
                break;
            case ElementType.BundledPath:
            case ElementType.Chord:
            case ElementType.Path:
                m = new Path$1(args);
                break;
            case ElementType.Arrow:
                m = new Arrow(args);
                break;
            case ElementType.Area:
                m = new Area(args);
                break;
            case ElementType.Ring:
                m = new Ring(args);
                break;
            case ElementType.Arc:
                m = new Arc(args);
                break;
            case ElementType.BezierCurve:
                if (!("vertices" in args)) {
                    args.vertices = [[0, 100], [20, 120], [80, 180], [100, 200]];
                }
                m = new BezierCurve(args);
                break;
            case ElementType.Polygon:
                m = new Polygon(args);
                break;
        }
        if (m)
            m._updateBounds();
        return m;
    }

    function createCollection(args) {
        let c = new Collection(args);
        // scene.addChild(c);
        // scene._itemMap[c.id] = c;
        return c;
    }

    function createGlyph(args) {
        let g = new Glyph(args);
        return g;
    }

    function createComposite(args) {
        let c = new Composite(args);
        return c;
    }

    function createAxis(args) {
        if (args.axisType === "encoding") {
            let axis = new EncodingAxis(args.enc, args.scale, args.elems, args);
            return axis;
        } else if (args.axisType === "layout") {
            let axis = new LayoutAxis(args.elems, args.channel, args.attribute, args);
            return axis;
        }
    }

    function createLegend(args) {
        let legend = args.attrType === "string" ? new CategoricalLegend(args.enc, args) : new QuantitativeLegend(args.enc, args);
        return legend;
    }

    function duplicate(elem) {
        switch (elem.type) {
            case ElementType.Collection:
                return duplicateCollection(elem);
            case ElementType.Glyph:
                return duplicateGlyph(elem);
            default:
                return duplicateMark(elem);
        }
    }

    function duplicateMark(mark) {
        let m = createMark({ type: mark.type });
        mark.copyPropertiesTo(m);
        m._classId = mark.classId;
        m._bounds = mark.bounds.clone();

        if (!mark._refBounds)
            mark._refBounds = mark.bounds.clone();
        m._refBounds = mark._refBounds.clone();

        if (mark.vertices) {
            for (let i = 0; i < mark.vertices.length; i++) {
                if (mark.vertices[i].dataScope) {
                    m.vertices[i].dataScope = mark.vertices[i].dataScope; 
                }
            }
        }
        mark.scene._itemMap[m.id] = m;
        return m;
    }

    function duplicateCollection(collection) {
        let coll = createCollection({});
        for (let i = 0; i < collection.children.length; i++) {
            let c = collection.children[i];
            coll.addChild(duplicate(c));
        }
        coll._classId = collection.classId;
        if (collection._layout) {
            let layout = collection._layout.clone();
            coll._layout = layout;
            layout.group = coll;
        }
        coll._updateBounds();
        collection.scene._itemMap[coll.id] = coll;
        return coll;
    }

    function duplicateGlyph(glyph) {
        let g = new Glyph();
        for (let c of glyph.children){
            g.addChild(duplicate(c));
        }

        g._classId = glyph.classId;
        if (glyph.dataScope) {
            g.dataScope = glyph.dataScope;
        }
        glyph.scene._itemMap[g.id] = g;
        return g;
    }

    class BoundsVar extends Variable {

        constructor(type, elem) {
            super(type);
            this._elem = elem;
        }

        get element() {
            return this._elem;
        }

    }

    class DataScopeVar extends Variable {
        
        constructor(type, item) {
            super(type);
            this._item = item;
        }

        get element() {
            return this._item;
        }
    }

    class MultiWayDependency {

        constructor(opType) {
            this._id = opType + "_" + generateUniqueID();
            this._type = opType;
            this._vars = [];
            this._edges = [];
        }

        get vars() {
            return this._vars;
        }

        get edges() {
            return this._edges;
        }
      
        run() {
            console.log("-", this._type);
        }

    }

    class Edge {

        constructor(fromNode, toNode, isDirected = true) {
            this._id = "e_" + generateUniqueID();
            this._fromNode = fromNode;
            this._toNode = toNode;
            this._isDirected = isDirected;
            //this._inputOnly = false;
        }

        get id() {
            return this._id;
        }

        get fromNode() {
            return this._fromNode;
        }

        get toNode() {
            return this._toNode;
        }

        get isDirected() {
            return this._isDirected;
        }

        get operator() {
            if (this._fromNode instanceof OneWayDependency || this._fromNode instanceof MultiWayDependency)
                return this._fromNode;
            else
                return this._toNode;
        }

        // get isInputOnly() {
        //     return this._inputOnly;
        // }

        // set isInputOnly(val) {
        //     this._inputOnly = val;
        // }

    }

    class ScaleVar extends Variable {
        constructor(type, enc) {
            super(type);
            //this._encs = [enc];
            this._encs = {};
            this._encs[enc.channel+"_"+getEncodingKey(enc.element)] = enc;
            this._initialized = false;
        }

        addLinkedEncoding(enc) {
            //this._encs.push(enc);
            this._encs[enc.channel+"_"+getEncodingKey(enc.element)] = enc;
        }

        getEncoding(channel, elem) {
            let key = channel + "_" + getEncodingKey(elem);
            return this._encs[key];
        }

        get encodings() {
            return Object.values(this._encs);
        }

        get initialized() {
            return this._initialized;
        }

        set initialized(i) {
            this._initialized = i;
        }
    }

    class AttrValueVar extends Variable {
        constructor(type, enc) {
            super(type);
            this._encs = [enc];
            this._valueMap = {};
        }

        addLinkedEncoding(enc) {
            this._encs.push(enc);
        }

        get encodings() {
            return this._encs;
        }

        get attrValues() {
            return this._valueMap;
        }

        set attrValues(v) {
            this._valueMap = v;
        }
    }

    class ScaleBuilder extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();

            let attrValVar = this.inputVars.find(d => d instanceof AttrValueVar),
                scaleVar = this.outputVar,
                encodings = scaleVar.encodings,
                baseEnc = encodings[0],
                channel = baseEnc.channel,
                attribute = baseEnc.attribute,
                attrType = attrValVar.encodings[0].dataTable.type(attrValVar.encodings[0].attribute),
                allValues = Object.values(attrValVar.attrValues);

            if (baseEnc.channel === "angle" && [ElementType.Arc, ElementType.Pie].indexOf(baseEnc.element.type) >= 0) {
                for (let enc of attrValVar.encodings) {
                    for (let scale of enc.scales) {
                        let vals = enc.getElements(scale).map(d => enc.attrValues[d.id]);
                        scale.domain = baseEnc._preferredDomain ? baseEnc._preferredDomain : 
                                            enc.dataTable.tree ? [0, enc.dataTable.tree.getRoot()[attribute]] :  //[0, Math.max(...vals)]
                                                this._getDomainForNumbers(vals);
                        console.log("domain for", attribute, scale.domain);
                    }
                }
            } else {
                let domain;
                if (baseEnc._preferredDomain) {
                    domain = baseEnc._preferredDomain;
                } else if (attrType == AttributeType.String) {
                    domain = this._getDomainForStrings(allValues);
                } else if (attrValVar.encodings[0].channel === "text") {
                    domain = this._getDomainForStrings(allValues);
                } else {
                    domain = this._getDomainForNumbers(allValues);
                }
        
                for (let enc of attrValVar.encodings) {
                    for (let scale of enc.scales) {
                        scale.domain = domain.slice();
                    }
                }
                //console.log("domain for", attribute, baseEnc.channel, domain);
            }
            for (let i = 0; i < baseEnc.scales.length; i++) {
                let scale = baseEnc.scales[i],
                    elems = baseEnc.getElements(scale),
                    range = this._buildRange(channel, elems, baseEnc, scaleVar);
                if (range) {
                    for (let enc of encodings) {
                        enc.scales[i].range = range;
                    }
                }
            }
            scaleVar.initialized = true;
        }

        _getDomainForNumbers(elemVals) {
            let outVar = this.outputVar,
                baseEnc = outVar.encodings[0];

            let domain = [d3__namespace.min(elemVals), d3__namespace.max(elemVals)];

            if (baseEnc.includeZero && domain[0] > 0) {
                domain = [0, d3__namespace.max(elemVals)];
            }

            if (baseEnc.mapping) {
                domain = Object.keys(baseEnc.mapping);
                domain = domain.map(d => parseFloat(d));
                domain.sort((a, b) => a - b);
            } else if (baseEnc.scales[0].type === "sequentialColor") {
                if (domain[0] < 0 && domain[1] > 0) {
                    let abs = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
                    domain = [-abs, abs];
                }
            } else if (baseEnc.channel === "angle") {
                //let sum = Object.values(baseEnc.attrValues).reduce((a, d) => a + d, 0);
                let sum = Object.values(elemVals).reduce((a, d) => a + d, 0);
                domain = [0, sum];
            }

            return domain;
        }

        _getDomainForStrings(elemVals) {
            let outVar = this.outputVar,
                baseEnc = outVar.encodings[0];
            let domain;
            if (outVar.encodings[0].aggregator == "count") {
                domain = [0, Math.max(...elemVals)];
            } else {
                domain = Array.from(new Set(elemVals));
            }

            if (baseEnc.mapping) {
                domain = Object.keys(baseEnc.mapping);
            }

            return domain;
        }

        _buildRange(channel, elems, baseEnc, scaleVar) {
            if (channel === "x") {
                return this._buildXRange(elems, baseEnc, scaleVar);
            } else if (channel === "y") {
                return this._buildYRange(elems, baseEnc, scaleVar);
            } else if (['width', 'height', "radius", "area", "fontSize", "radialDistance", "strokeWidth"].includes(channel)) {
                return this._buildSizeRange(elems, baseEnc, scaleVar);
            } else if (channel.indexOf("Color") > 0 || channel === "fillGradient") {
                return this._buildColorRange(elems, baseEnc);
            } else if (channel === "angle") {
                return this._buildAngleRange(elems, baseEnc);
            } else if (channel === "thickness") {
                return this._buildThicknessRange(elems, baseEnc, scaleVar);
            } else if (channel === "src") {
                let domain = baseEnc.scales[0].domain;
                // If a mapping is given (e.g. category -> image URL), look up each domain
                // entry's URL through it, same as _buildColorRange does for fillColor/
                // strokeColor. Otherwise fall back to the previous identity behavior,
                // which supports the case where the attribute values are already the
                // literal src strings to use.
                return baseEnc.mapping ? domain.map(d => baseEnc.mapping[d + ""]) : domain.slice();
            }
        }

        _buildThicknessRange(elems, baseEnc, scaleVar) {
            let vals = elems.map(d => d.outerRadius - d.innerRadius);
            let rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent :
                Math.max(...vals);
            return [0, rangeExtent];
        }

        _buildAngleRange(elems, baseEnc) {
            // let outVar = this.outputVar;
            // for (let enc of outVar.encodings) {
            //     for (let scale of enc.scales) {
            //         scale._scale.range([0, 360]);
            //     }
            // }   
            return [0, 360];
        }

        _buildColorRange(elems, baseEnc) {
            if (baseEnc.mapping) {
                let domain = baseEnc.scales[0].domain;
                // for (let enc of outVar.encodings) {
                //     for (let scale of enc.scales) {
                //         scale._scale.range(domain.map(d => baseEnc.mapping[d + ""]));
                //     }
                // }
                return domain.map(d => baseEnc.mapping[d + ""]);
            } else if (baseEnc.scales[0].type === "sequentialColor") {//for sequential color scales, determine scheme if unspecified
                let outVar = this.outputVar, domain = baseEnc.scales[0].domain;
                for (let enc of outVar.encodings) {
                    if (!baseEnc.colorScheme) {
                        for (let scale of enc.scales) {
                            let d = scale.domain;
                            scale._scale = d3__namespace.scaleSequential(domain[0] < 0 && domain[1] > 0 ? d3__namespace.interpolatePuOr : d3__namespace.interpolateTurbo);
                            scale._scale.domain(d);
                        }
                    }
                }
            }

            //e.g., multi-line graph 2 where the spectral scheme is used on ordinal attribute
            if ((divergingColorSchemes.indexOf(baseEnc.colorScheme) >= 0 || sequentialColorSchemes.indexOf(baseEnc.colorScheme) >= 0) && baseEnc.scales[0].type === "ordinalColor") {
                let outVar = this.outputVar, domain = baseEnc.scales[0].domain;
                for (let enc of outVar.encodings) {
                    for (let scale of enc.scales) {
                        let d = scale.domain;
                        scale._scale = d3__namespace.scaleOrdinal(d3__namespace[baseEnc.colorScheme][domain.length]);
                        scale._scale.domain(d);
                    }
                }
            }
        }


    	_buildSizeRange(elems, baseEnc, scaleVar) {
    	    let start, rangeExtent;
    	    start = 0;
    	    if (elems.type === "vertexIndices") {
    	        let parent = elems.groups[0].parent,
    	            index = elems.groups[0].indices[0],
    	            id = getVertexId(parent, index);
    	        rangeExtent = scaleVar.initialized ? baseEnc._elem2scale[id].rangeExtent : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent :
    	                        Math.max(...this._getVertexIndexSizeValues(elems, baseEnc.channel));
    	        return [start, start + rangeExtent];
    	    }
    	    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent :
    	                    Math.max(...elems.map(d => 
    	                        baseEnc.channel === "radius" ? d.refBounds.width/2 : 
                                baseEnc.channel === "strokeWidth" ? d.strokeWidth :
                                baseEnc.channel === "radialDistance" ? d.parent.radius : 
                                baseEnc.channel === "area" ? d.type === ElementType.Circle ? Math.PI * Math.pow(d.radius, 2) : d.width * d.height: 
                                baseEnc.channel === "fontSize" ? parseFloat(d.fontSize) : 
                                d.refBounds[baseEnc.channel]));
    	    return [start, start + rangeExtent];
    	}

    	_getVertexIndexSizeValues(elemGroup, channel) {
    	    let values = [];
    	    for (let group of elemGroup.groups) {
    	        let vertices = group.parent._vertices;
    	        for (let index of group.indices) {
    	            values.push(
    	                channel === "radius" ? vertices._radii[index] :
    	                channel === "strokeWidth" ? vertices._strokeWidths[index] :
    	                channel === "radialDistance" ? group.parent.radius :
    	                channel === "width" ? vertices._widths[index] :
    	                channel === "height" ? vertices._heights[index] :
    	                0
    	            );
    	        }
    	    }
    	    return values;
    	}

    	_buildXRange(elems, baseEnc, scaleVar) {
    	    let left, rangeExtent, scaleType = baseEnc.scales[0].type;
    	    if (elems.type === "vertexIndices") {
    	        let parent = elems.groups[0].parent,
    	            index = elems.groups[0].indices[0],
    	            id = getVertexId(parent, index),
    	            b = parent.refBounds ? parent.refBounds : parent.bounds;
    	        left = scaleVar.initialized ? d3__namespace.min(baseEnc._elem2scale[id].range) : b.left;
    	        rangeExtent = scaleVar.initialized ? baseEnc._elem2scale[id].rangeExtent : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.width;
    	        return baseEnc.flipScale ? [left + rangeExtent, left] : [left, left + rangeExtent];
    	    }
    	    switch (elems[0].type) {
    	        case "vertex":
    	        case "segment":
                    var b = elems[0].parent.refBounds ? elems[0].parent.refBounds : elems[0].parent.bounds;
                    left = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : b.left;
                    //left = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : Math.min(...elems.map(d => d.bounds.center));
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.width;
                    break;
                default:
                    left = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : baseEnc._preferredRangeStart ? baseEnc._preferredRangeStart : getTopLevelCollection(elems[0]).bounds.left + elems[0].bounds.width/2;
                            //scaleType === "point" ? getTopLevelCollection(elems[0]).bounds.left + elems[0].bounds.width/2 : getTopLevelCollection(elems[0]).bounds.left;
                    if (scaleType === "band") {
                        // Always derive rangeExtent from domain × element width so that
                        // bandwidth = element width exactly. This holds even when empty bins
                        // are in the domain (keepEmpty=true) or when actualNumBins was not yet
                        // set at encode time (causing _preferredRangeExtent = NaN).
                        rangeExtent = elems[0].bounds.width * baseEnc.scales[0].domain.length;
                    } else {
                        rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : d3__namespace.max([450, d3__namespace.max(elems.map(d => d.bounds.x)) - d3__namespace.min(elems.map(d => d.bounds.x))]);
                    }
                    break;
            }
            return baseEnc.flipScale ? [left + rangeExtent, left] : [left, left + rangeExtent];
        }

    	_buildYRange(elems, baseEnc, scaleVar) {
    	    let top, rangeExtent; baseEnc.scales[0].type;
    	    if (elems.type === "vertexIndices") {
    	        let parent = elems.groups[0].parent,
    	            index = elems.groups[0].indices[0],
    	            id = getVertexId(parent, index),
    	            b = parent.refBounds ? parent.refBounds : parent.bounds;
    	        top = scaleVar.initialized ? d3__namespace.min(baseEnc._elem2scale[id].range) : b.top;
    	        rangeExtent = scaleVar.initialized ? baseEnc._elem2scale[id].rangeExtent : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.height;
    	        return baseEnc.flipScale ? [top, top + rangeExtent] : [top + rangeExtent, top];
    	    }
    	    switch (elems[0].type) {
    	        case "vertex":
    	        case "segment":
                    var b = elems[0].parent.refBounds ? elems[0].parent.refBounds : elems[0].parent.bounds;
                    top = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : b.top;
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.height;
                    break;
                default:
                    top = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : getTopLevelCollection(elems[0]).bounds.top + elems[0].bounds.height/2;
                        //scaleType === "point" ? getTopLevelCollection(elems[0]).bounds.top + elems[0].bounds.height/2 : getTopLevelCollection(elems[0]).bounds.top;
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : 450;
                    break;
            }
            return baseEnc.flipScale ? [top, top + rangeExtent] : [top + rangeExtent, top];
        }
    }

    class BoundsEvaluator extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            //Do nothing since we have propagateBoundsUpdate,
            //TODO: remove BoundsEvaluator and replace it with Conduit
            
            // if (this._outputVars.length > 0) {
            //     let elem = this.outputVar.element,
            //         peers = getPeers(elem);
            //     //elem._bounds = computeBounds(elem);
            //     for (let p of peers)
            //         p._updateBounds();
            // }
        }

        // computeBounds(elem) {
        //     switch (elem.type) {
        //         case ElementType.Circle:
        //             return this.computeCircleBounds(elem);
        //         case ElementType.Scene:
        //         case ElementType.Collection:
        //         case ElementType.Group:
        //         case ElementType.Axis:
        //             return this.computeGroupBounds(elem);
        //     }
        // }

        // computeCircleBounds(elem) {
        //     return new Rectangle(elem.x - elem.radius, elem.y - elem.radius, elem.radius * 2, elem.radius * 2);
        // }

        // computeGroupBounds(elem) {
        //     let b; 
        //     if (elem.children.length > 0){
    	// 		b = elem.children[0].bounds.clone();
    	// 		for (let i = 1; i < elem.children.length; i++) {
    	// 			if (elem.children[i].visibility == "hidden")
    	// 				continue;
    	// 			b = b.union(elem.children[i].bounds);
    	// 		}
    	// 		if (elem._layout && elem._layout.type == "grid") {
    	// 			let cellBounds = this._layout.cellBounds;
    	// 			for (let i = 0; i < cellBounds.length; i++) {
    	// 				b = b.union(cellBounds[i]);
    	// 			}
    	// 		}
    	// 	} else {
    	// 		b = new Rectangle(0, 0, 0, 0);
    	// 	}
        //     return b;
        // }
    }

    class AxisUpdater extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let oriVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_ORIENTATION);
            let axis = oriVar.element;
            axis.createTicksLabels(axis._args);
            if (axis instanceof EncodingAxis)
                this._runForEncoding(axis);
            else if (axis instanceof LayoutAxis)
                this._runForLayout(axis);
            propagateBoundsUpdate(axis._path);
        }

        _runForLayout(axis) {
            let channel = axis.channel,
                stack = axis.elements[0].parent.layout && axis.elements[0].parent.layout.type == LayoutType.STACK,
                //collRefBounds = unionRefBounds(axis.elements),
                collBounds = stack ? unionBounds(axis.elements) : unionRefBounds(axis.elements),
                vertices = [],
                margin = 2;
            if (channel === "x") {
                let y = axis.orientation === AxisOrientation.TOP ? collBounds.top - margin : collBounds.bottom + margin;
                axis._pathPos = axis._posArg ? axis._posArg : y;
                vertices.push([collBounds.left, axis._pathPos]);
                vertices.push([collBounds.right, axis._pathPos]);
                axis._path.vertices = vertices;
            } else if (channel === "y") {
                let x = axis.orientation === AxisOrientation.LEFT ? collBounds.left - margin: collBounds.right + margin;
                axis._pathPos = axis._posArg ? axis._posArg : x;
                vertices.push([axis._pathPos, collBounds.top]);
                vertices.push([axis._pathPos, collBounds.bottom]);
                axis._path.vertices = vertices;
            } else if (channel === "angle") {
                //console.log(channel);
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    axis._path._x = layout.x;
                    axis._path._y = layout.y;
                    axis._path._radius = layout.radius;
                }
            }
        }

        _runForEncoding(axis) {
            //let collBoundsVar = this.inputVars.find(d => d instanceof BoundsVar),
            let channel = axis.channel,
                elems = axis.elements;
            let stack = elems[0].parent.layout && elems[0].parent.layout.type == LayoutType.STACK,
                collBounds = stack ? unionBounds(elems) : unionRefBounds(elems),
                margin = 2,
                vertices = [];
            let tc = getTopLevelCollection(elems[0]);
            if (tc && tc.clipMask) {
                collBounds = tc.clipMask;
            }
            
            if (channel === "x") {
                let yEnc = getChannelEncodingByElement(elems[0], "y");
                let top, btm;
                if (yEnc) {
                    top = Math.min(...yEnc.getScale(elems[0]).range, collBounds.top);
                    btm = Math.max(...yEnc.getScale(elems[0]).range, collBounds.bottom);
                } else {
                    top = collBounds.top;
                    btm = collBounds.bottom;
                }
                let y = axis.orientation === AxisOrientation.TOP ? top - margin : btm + margin;
                axis._pathPos = axis._posArg ? axis._posArg : y;
                vertices.push([axis.scale.range[0], axis._pathPos]);
                vertices.push([axis.scale.range[1], axis._pathPos]);
            
            } else if (channel === "width") {
                let y = axis.orientation === AxisOrientation.TOP ? collBounds.top - margin : collBounds.bottom + margin;
                axis._pathPos = axis._posArg ? axis._posArg : y;
                // vertices.push([axis.scale.range[0] + collBounds.left, axis._pathPos]);
                // vertices.push([axis.scale.range[1] + collBounds.left, axis._pathPos]);
                vertices.push([collBounds.left, axis._pathPos]);
                vertices.push([collBounds.right, axis._pathPos]);
            } else if (channel === "radialDistance") {
                let polygon = axis.elements[0].parent,
                    y = polygon.y;
                axis._pathPos = axis._posArg ? axis._posArg : y;
                vertices.push([axis.scale.range[0] + polygon.x, axis._pathPos]);
                vertices.push([axis.scale.range[1] + polygon.x, axis._pathPos]);
            } else if (channel === 'y') {
                let xEnc = getChannelEncodingByElement(elems[0], "x");
                let left, right;
                if (xEnc) {
                    left = Math.min(...xEnc.getScale(elems[0]).range, collBounds.left);
                    right = Math.max(...xEnc.getScale(elems[0]).range, collBounds.right);
                } else {
                    left = collBounds.left;
                    right = collBounds.right;
                }
                let x = axis.orientation === AxisOrientation.LEFT ? left - margin : right + margin;
                axis._pathPos = axis._posArg ? axis._posArg : x;
                vertices.push([axis._pathPos, axis.scale.range[0]]);
                vertices.push([axis._pathPos, axis.scale.range[1]]);

            } else if (channel === 'height') {
                let x = axis.orientation === AxisOrientation.LEFT ? collBounds.left - margin : collBounds.right + margin;
                axis._pathPos = axis._posArg ? axis._posArg : x;
                // vertices.push([axis._pathPos, collBounds.bottom - axis.scale.range[0]]);
                // vertices.push([axis._pathPos, collBounds.bottom - axis.scale.range[1]]);
                vertices.push([axis._pathPos, collBounds.bottom]);
                vertices.push([axis._pathPos, collBounds.top]);
            } 
            axis._path.vertices = vertices;   
        }

    }

    class AxisTicksPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let pathPosVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_PATH_POSITION);

            let axis = pathPosVar.element;
            if (axis instanceof EncodingAxis)
                this._runForEncoding(axis);
            else if (axis instanceof LayoutAxis)
                this._runForLayout(axis);

            //finalize axis path position
            let vertices = [];
            if (axis.channel === "width" || axis.channel === "x") {
                let tickX = axis._ticks.children.map(d => d.vertices[0].x),
                    pathX = [axis._path.vertices[0].x, axis._path.vertices[1].x];
                vertices.push([
                    d3.min(tickX.concat(pathX)),
                    axis._path.vertices[0].y
                ]);
                vertices.push([
                    d3.max(tickX.concat(pathX)),
                    axis._path.vertices[0].y
                ]);
                axis._path.vertices = vertices;
            } else if (axis.channel === "height" || axis.channel === "y") {
                let tickY = axis._ticks.children.map(d => d.vertices[0].y),
                    pathY = [axis._path.vertices[0].y, axis._path.vertices[1].y];
                vertices.push([
                    axis._pathPos,
                    d3.min(tickY.concat(pathY))
                ]);
                vertices.push([
                    axis._pathPos,
                    d3.max(tickY.concat(pathY))
                ]);
                axis._path.vertices = vertices;   
            }

            for (let l of axis._ticks.children) {
                l._updateBounds();
            }
            propagateBoundsUpdate(axis._ticks);
            //axis._ticks._updateBounds();
        }

        _runForLayout(axis) {
            let channel = axis.channel;
            if (channel == "x") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.tickOffset : axis._pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    let xPos = axis.elements[i].bounds[axis.tickAnchor];
                    t.vertices = [
                        [xPos, baseline],
                        [xPos, baseline + end]
                    ];
                }
            } else if (channel === "y") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis._pathPos - axis.tickOffset : axis._pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    let yPos = axis.elements[i].bounds[axis.tickAnchor];
                    t.vertices = [
                        [baseline, yPos],
                        [baseline + end, yPos]
                    ];
                }
            } else if (channel === "angle") {
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    let leaves = layout._d3Root.leaves();
                    const map = new Map(leaves.map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    for (let [i, t] of axis._ticks.children.entries()) {
                        let id = axis.elements[i].datum[MSCNodeID];
                        let angle = radian2degree(map.get(id)[0]) - 90;
                        t.vertices = [
                            [layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2, layout.y],
                            [layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2 + axis.tickSize, layout.y]
                        ];
                        t._rotate = [angle, layout.x, layout.y];             
                    }
                } 
            }
        }

        _runForEncoding(axis) {
            let channel = axis.channel,
                collBounds = unionRefBounds(axis.elements);
                //coll = getTopLevelCollection(axis.elements[0]);
            if (channel == "x") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.tickOffset : axis._pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t.vertices = [
                        [axis.scale.map(axis._tickValues[i]), baseline],
                        [axis.scale.map(axis._tickValues[i]), baseline + end]
                    ];
                }
            } else if (channel == "width") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.tickOffset : axis._pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                let reverse = axis.isFlipped() || (axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "right") ? true : false;
                if (reverse) {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t.vertices = [
                            [collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis._tickValues[i]), baseline],
                            [collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis._tickValues[i]), baseline + end]
                        ];
                    }
                } else {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t.vertices = [
                            [axis.scale.map(axis._tickValues[i]) + collBounds.left, baseline],
                            [axis.scale.map(axis._tickValues[i]) + collBounds.left, baseline + end]
                        ];
                    }
                }
            } else if (channel === "y") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis._pathPos - axis.tickOffset : axis._pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t.vertices = [
                        [baseline, axis.scale.map(axis._tickValues[i])],
                        [baseline + end, axis.scale.map(axis._tickValues[i])]
                    ];
                }
            } else if (channel === "height") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis._pathPos - axis.tickOffset : axis._pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                let reverse = axis.isFlipped() || (axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "top") ? true : false;
                if (reverse) {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t.vertices = [
                            [baseline, collBounds.top + axis.scale.map(axis._tickValues[i])],
                            [baseline + end, collBounds.top + axis.scale.map(axis._tickValues[i])]
                        ];
                    }
                } else {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        let y = collBounds.bottom - axis.scale.map(axis._tickValues[i]);
                        t.vertices = [
                            [baseline, y],
                            [baseline + end, y]
                        ];
                    }
                }
            } else if (channel === "radialDistance") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.tickOffset : axis._pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize,
                    pg = axis.elements[0].parent;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t.vertices = [
                        [pg.x + axis.scale.map(axis._tickValues[i]), baseline],
                        [pg.x + axis.scale.map(axis._tickValues[i]), baseline + end]
                    ];
                }
            }
        }

    }

    class AxisLabelsPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let pathPosVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_PATH_POSITION);
            let axis = pathPosVar.element;
            if (axis instanceof EncodingAxis)
                this._runForEncoding(axis);
            else if (axis instanceof LayoutAxis)
                this._runForLayout(axis);

            for (let l of axis._labels.children) {
                l._updateBounds();
            }
            propagateBoundsUpdate(axis._labels);
            //axis._labels._updateBounds();
        }

        _runForLayout(axis) {
            let channel = axis.channel;
                // coll = axis.elements[0].parent;
            if (channel == "x") {
                let offset = axis.orientation == AxisOrientation.BOTTOM ? axis.labelOffset : - axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.BOTTOM ? [BoundsAnchor.CENTER, BoundsAnchor.TOP] : [BoundsAnchor.CENTER, BoundsAnchor.BOTTOM];
                    // useAxisPos = (coll.layout.type == LayoutType.GRID && coll.layout.numRows > 1) ? false : true;
                for (let [i, l] of axis._labels.children.entries()) {
                    let b = axis.elements[i].bounds;
                        // y = axis.orientation === AxisOrientation.TOP ? b.top - axis.tickSize : b.bottom + axis.tickSize; 
                    l.x = b[axis.tickAnchor];
                    l._y = axis._pathPos + offset;
                    //l._y = useAxisPos ? axis._pathPos + offset : y + offset;
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE];
                    }
                }
            } else if (channel === "y") {
                let offset = axis.orientation == AxisOrientation.LEFT ? -axis.labelOffset : axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.LEFT ? [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE] : [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
                    // useAxisPos = (coll.layout.type == LayoutType.GRID && coll.layout.numCols > 1) ? false : true;
                for (let [i, l] of axis._labels.children.entries()) {
                    let b = axis.elements[i].bounds;
                        // x = axis.orientation === AxisOrientation.LEFT ? b.left - axis.tickSize : b.right + axis.tickSize;
                    l.x = axis._pathPos + offset;
                    // l._x = useAxisPos ? axis._pathPos + offset : x + offset;
                    l._y = axis.tickAnchor == BoundsAnchor.MIDDLE ? b.y : b[axis.tickAnchor];
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }
            } else if (channel === "angle") {
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    let leaves = layout._d3Root.leaves();
                    const map = new Map(leaves.map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    let gap = 5;
                    for (let [i, l] of axis._labels.children.entries()) {
                        let id = axis.elements[i].datum[MSCNodeID];
                        
                        //console.log(map.get(id));
                        if (map.get(id)[0] < Math.PI) {
                            let angle = radian2degree(map.get(id)[0]) - 90;
                            l._anchor = [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
                            l.x = layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2 + gap;
                            l._y = layout.y;
                            l._rotate = [angle, layout.x, layout.y];
                        } else {
                            let angle = radian2degree(map.get(id)[0]) + 90;
                            l._anchor = [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE];
                            l.x = layout.x - map.get(id)[1] - axis.elements[i].bounds.width/2 - gap;
                            l._y = layout.y;
                            l._rotate = [angle, layout.x, layout.y];
                        }                    
                        
                        // l._anchor = anchor;
                        // if (axis._labelRotation) {
                        //     l._rotate = [axis._labelRotation, l.x, l.y];
                        //     l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                        // }
                    }
                    // for (let elem of axis._labels.children) {
                    //     let id = elem.dataScope.getAttrVal(MSCNodeID);
                    //     translate(elem, layout.x - elem.bounds.x, layout.y - map.get(id)[1] - elem.bounds.y);
                    //     elem._rotate = [radian2degree(map.get(id)[0]), layout.x, layout.y];
                    // }
                    //console.log(channel, layout, axis._labels.children);
                } 
                
            }
        }

        _runForEncoding(axis) {
            let channel = axis.channel,
                collBounds = unionRefBounds(axis.elements);
                //coll = getTopLevelCollection(axis.elements[0]);
            if (channel == "x") {
                let offset = axis.orientation == AxisOrientation.BOTTOM ? axis.labelOffset : - axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.BOTTOM ? [BoundsAnchor.CENTER, BoundsAnchor.TOP] : [BoundsAnchor.CENTER, BoundsAnchor.BOTTOM];
                for (let [i, l] of axis._labels.children.entries()) {
                    l.x = axis.scale.map(axis.labelValues[i]);
                    l._y = axis._pathPos + offset;
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }

            } else if (channel === "width") {
                let offset = axis.orientation == AxisOrientation.BOTTOM ? axis.labelOffset : - axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.BOTTOM ? [BoundsAnchor.CENTER, BoundsAnchor.TOP] : [BoundsAnchor.CENTER, BoundsAnchor.BOTTOM];
                let reverse = axis.isFlipped() || (axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "right") ? true : false;
                for (let [i, l] of axis._labels.children.entries()) {
                    l.x = reverse ? collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis.labelValues[i]) : axis.scale.map(axis.labelValues[i]) + collBounds.left;
                    l._y = axis._pathPos + offset;
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }

            } else if (channel === "y") {
                let offset = axis.orientation == AxisOrientation.LEFT ? -axis.labelOffset : axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.LEFT ? [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE] : [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
                for (let [i, l] of axis._labels.children.entries()) {
                    l.x = axis._pathPos + offset;
                    l._y = axis.scale.map(axis.labelValues[i]);
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }
            } else if (channel === "height") {
                let offset = axis.orientation == AxisOrientation.LEFT ? -axis.labelOffset : axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.LEFT ? [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE] : [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
                let reverse = axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "top" ? true : false;
                for (let [i, l] of axis._labels.children.entries()) {
                    l.x = axis._pathPos + offset;
                    l._y = reverse ? collBounds.top + axis.scale.map(axis.labelValues[i]) : collBounds.bottom - axis.scale.map(axis.labelValues[i]);
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }
            } else if (channel == "radialDistance") {
                let offset = axis.orientation == AxisOrientation.BOTTOM ? axis.labelOffset : - axis.labelOffset,
                    anchor = axis.orientation == AxisOrientation.BOTTOM ? [BoundsAnchor.CENTER, BoundsAnchor.TOP] : [BoundsAnchor.CENTER, BoundsAnchor.BOTTOM],
                    pg = axis.elements[0].parent;
                for (let [i, l] of axis._labels.children.entries()) {
                    l.x = pg.x + axis.scale.map(axis.labelValues[i]);
                    l._y = axis._pathPos + offset;
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }

            } 
        }
    }

    function getRepresentativeElement(enc, scale) {
    	let elems = enc.getElements(scale);
    	return elems && elems.type === "vertexIndices" ? elems.groups[0].parent : elems[0];
    }

    class GridPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let elem = this._outputVars[0].element,
                groups = getPeers(elem.parent);
    		for (let group of groups) {
    			let layout = group.layout;
    			if (!layout) return;
    			let activeChildren = layout._includeInvisible
    				? group.children
    				: group.children.filter(c => c.visibility !== "hidden");
    			this.fillGrid(group, layout, activeChildren);
    			this.computeCellBounds(group, layout, activeChildren);
    			this.placeElements(group, layout, activeChildren);
    		}

    		let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
    		//propagateBoundsUpdate(elem);
        }

        placeElements(group, layout, activeChildren) {
    		let xEncs = getEncodingsInGridCell(group, "x"),
    			yEncs = getEncodingsInGridCell(group, "y");
            for (let i = 0; i < group.children.length; i++) {
                let c = group.children[i];
                let gridBound = layout.cellBounds[i];
                if (!gridBound) continue; // invisible/inactive child — skip
                let cdx = 0, cdy = 0;
                switch (layout._cellHorzAlignment) {
                    case BoundsAnchor.LEFT:
                        cdx = gridBound.left - c.refBounds.left;
                        break;
                    case BoundsAnchor.CENTER:
                        cdx = gridBound.x - c.refBounds.x;
                        break;
                    case BoundsAnchor.RIGHT:
                        cdx = gridBound.right - c.refBounds.right;
                        break;
                }

                switch (layout._cellVertAlignment) {
                    case BoundsAnchor.TOP:
                        cdy = gridBound.top - c.refBounds.top;
                        break;
                    case BoundsAnchor.MIDDLE:
                        cdy = gridBound.y - c.refBounds.y;
                        break;
                    case BoundsAnchor.BOTTOM:
                        cdy = gridBound.bottom - c.refBounds.bottom;
                        break;
                }

    			translateElement(c, cdx, cdy);
            }

    		if (xEncs.length > 0) {
    			for (let xEnc of xEncs) {
    				for (let scale of xEnc.scales) {
    					let elem = getRepresentativeElement(xEnc, scale),
    						idx = layout.getIndex(elem);
    					if (idx < 0 || !layout.cellBounds[idx]) continue;
    					let left = scale.type === "point" ? layout.cellBounds[idx].left + elem.bounds.width/2 : layout.cellBounds[idx].left,
    						right = left + scale.rangeExtent;
    					scale.range = scale.range[0] < scale.range[1] ? [left, right] : [right, left];
    				}
    			}
    		}

    		if (yEncs.length > 0) {
    			for (let yEnc of yEncs) {
    				for (let scale of yEnc.scales) {
    					let elem = getRepresentativeElement(yEnc, scale),
    						idx = layout.getIndex(elem);
    					if (idx < 0 || !layout.cellBounds[idx]) continue;
    					let top = scale.type === "point" ? layout.cellBounds[idx].top + elem.bounds.height/2 : layout.cellBounds[idx].top,
    						btm = top + scale.rangeExtent;
    					scale.range = scale.range[0] < scale.range[1] ? [top, btm] : [btm, top];
    				}
    			}
    		}
        }

    	fillGrid(group, layout, activeChildren) {
    		let n = activeChildren.length;
    		let numCols = layout._numCols ? layout._numCols : (layout._numRows ? Math.ceil(n / layout._numRows) : 1);
    		let numRows = layout._numRows ? layout._numRows : Math.ceil(n / numCols);

    		layout._grid = new Array(numRows).fill(null).map(() => new Array(numCols).fill(null));
    		for (let i = 0; i < n; i++) {
    			let row, col;
    			switch (layout._direction) {
    				case GridFillDirection.RowFirst:
    					row = Math.floor(i / numCols);
    					col = i % numCols;
    					break;
    				case GridFillDirection.ColumnFirst:
    					row = i % numRows;
    					col = Math.floor(i / numRows);
    					break;
    				default:
    					throw new Error("Invalid fill direction. Use 'row_first' or 'column_first'.");
    			}
    			if (layout._start.toLowerCase().includes('bottom')) row = numRows - 1 - row;
    			if (layout._start.toLowerCase().includes('right')) col = numCols - 1 - col;

    			let childIdx = group.children.indexOf(activeChildren[i]);
    			layout._grid[row][col] = childIdx;
    		}
    	}

    	computeCellBounds(group, layout, activeChildren) {
    		let bounds = activeChildren.map(d => d.refBounds ? d.refBounds : d.bounds),
    			colGap = layout._colGap, rowGap = layout._rowGap;

    		if (layout._left === undefined) {
    			let lefts = bounds.map(d => d.left),
    				tops = bounds.map(d => d.top);
    			layout._left = d3.min(lefts);
    			layout._top = d3.min(tops);
    		}

    		let wds = bounds.map(d => d.width),
    			hts = bounds.map(d => d.height),
    			cellWidth = d3.max(wds),
    			cellHeight = d3.max(hts);
    		layout._cellBounds = new Array(group.children.length).fill(null);

    		let numRows = layout._grid.length;
    		let numCols = numRows > 0 && layout._grid[0] ? layout._grid[0].length : 0;

    		let rowOffset = layout._rowOffset || 0,
    			colOffset = layout._colOffset || 0;

    		for (let r = 0; r < numRows; r++) {
    			for (let c = 0; c < numCols; c++) {
    				let idx = layout._grid[r][c];
    				if (idx === null || idx === undefined || idx >= group.children.length) continue;
    				let x = layout._left + (cellWidth + colGap) * c + (r % 2 === 1 ? rowOffset : 0),
    					y = layout._top + (cellHeight + rowGap) * r + (c % 2 === 1 ? colOffset : 0);
    				layout._cellBounds[idx] = new Rectangle(x, y, cellWidth, cellHeight);
    			}
    		}
    	}
    }

    function densify(elem, data, param) {
        let scene = elem.scene,
            args = param ? param : {};
        args["attribute"] = args["attribute"] || MSCRowID;
        validateDensifyArguments(elem, data, args);

        if (data instanceof Tree || data instanceof Network) {
            throw "Not implemented";
        } else if (data instanceof DataTable) {
            let newMark = densifyElement(scene, elem, args["attribute"], args["orientation"], data);
            // scene._buildPeerIndex();
            elementRemoved(elem, scene._depGraph);
            newMarkCreated(newMark, scene._depGraph);
            if (newMark.parent.type !== ElementType.Scene)
                parentChildConnected(newMark.parent, newMark, scene._depGraph);

            // elementRemoved() cleared any RepopulateOperator outputs that pointed
            // to the now-deleted DataScopeVar(line).  Re-wire the operator to the
            // new path and its vertices so downstream DataExtractors stay connected.
            rewireRepopulateOperator(newMark, data, scene._depGraph);

            // If a FilterTransformer feeds this area's source table, create a
            // RepopulateOperator on that ITEMS var so vertex list rebuilds on filter change.
            if (newMark.type === ElementType.Area) {
                densifySpecified(newMark, args["attribute"], data, scene._depGraph);
            }

            scene.onChange(VarType.CHANNEL, "width", newMark);
            return newMark;
        }
    }

    function densifyElement(scene, elem, attr, orientation, datatable) {

        let type = datatable.type(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Number && type != AttributeType.Integer) {
            throw new Error("Densify only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!canDensify(elem)) {
            throw new Error("The " + elem.type + " is not dividable");
        }

        switch (elem.type) {
    		case ElementType.Line:
    			return _doLineDensify(scene, elem, attr, datatable);
    		case ElementType.Circle:
    			return _doCircleDensify(scene, elem, attr, datatable);
    		case ElementType.Rect:
    			return _doRectDensify(scene, elem, orientation, attr, datatable);
    	}
    }

    function _doLineDensify(scene, elem, field, datatable) {
        let peers = getPeers(elem);
        let toReturn, classId;
        for (let p of peers) {
            let lineDS = p.dataScope ? p.dataScope : fullTableScopeRef(datatable);
            let scopeRefs = getScopeRefsByAttribute(lineDS, field, false);
            if (scopeRefs.length === 1) {
                scopeRefs.push(scopeRefs[0]);
            }

            let args = Object.assign({}, p.styles);
            for (let vs of Vertex.styles) {
                if (p[vs] !== undefined)
                    args[vs] = p[vs];
            }
            //compute vertices
            let x1 = p.vertices[0].x,
                y1 = p.vertices[0].y,
                x2 = p.vertices[1].x,
                y2 = p.vertices[1].y;

            let vertices = [], wd = x2 - x1, ht = y2 - y1;
            for (let i = 0; i < scopeRefs.length; i++) {
                vertices.push([x1 + i * wd / (scopeRefs.length - 1), y1 + i * ht / (scopeRefs.length - 1)]);
            }
            args.vertices = vertices;
            args.type = "path";

            let polyline = createElement(scene, args);
            if (!classId)
                classId = polyline.id;
            polyline._classId = classId;
            polyline.dataScope = lineDS;
            polyline._updateBounds();
    		polyline._refBounds = polyline.bounds.clone();

            let parent = p.parent;
            parent.addChild(polyline);
            parent.removeChild(p);

            for (let i = 0; i < polyline._vertices.length; i++)
                polyline._vertices.setDataScopeRef(i, scopeRefs[i]);

            if (p == elem)
                toReturn = polyline;
        }
        return toReturn;
    }

    function _doCircleDensify(scene, elem, attr, datatable, sa, direction) {
        let peers = getPeers(elem),
            attrT = datatable.type(attr);
        let toReturn, polygonClassId;
        for (let p of peers) {
            let polygonDS = p.dataScope ? p.dataScope : fullTableScopeRef(datatable);
            let scopeRefs = getScopeRefsByAttribute(polygonDS, attr, attrT == AttributeType.Number);
            let numVertices = scopeRefs.length;
    		if (numVertices < 3)
    			throw new Error("INSUFFICIENT_DATA_SCOPES");
            let startAngle = 90, k = 360/numVertices, vertices = [], angle = [];
    		let dirSign = -1 ;
    		for (let i = 0; i < scopeRefs.length; i++){
    			let a = startAngle + dirSign * i * k;
    			angle[i] = a;
    			let coords = polar2Cartesian(p.x, p.y, p.radius, angle[i]);
    			vertices.push(coords);
    		}

            let args = Object.assign({}, p.styles);
            args.vertices = vertices;
            args.type = "polygon";
            args.x = p.x;
            args.y = p.y;
            args.radius = p.radius;
            let newPolygon = createElement(scene, args);
            if (!polygonClassId)
                polygonClassId = newPolygon.id;
            newPolygon._classId = polygonClassId;
            newPolygon.dataScope = polygonDS;

            let parent = p.parent;
            parent.addChild(newPolygon);
            parent.removeChild(p);

            for (let i = 0; i < newPolygon._vertices.length; i++) {
                newPolygon._vertices.setProperty(i, "polarAngle", angle[i]);
                newPolygon._vertices.setDataScopeRef(i, scopeRefs[i]);
            }

            if (p === elem)
                toReturn = newPolygon;
        }
        return toReturn;
    }

    function polar2Cartesian(cx, cy, r, deg){
    	let x = r * Math.cos(degree2radian(deg)),
    		y = r * Math.sin(degree2radian(deg));
    	return [x + cx, cy - y];
    }

    function _doRectDensify(scene, elem, o, attr, datatable) {
        let peers = getPeers(elem);
        let toReturn, orientation = o ? o : LayoutOrientation.HORIZONTAL;
        let areaClassId;
        if (orientation != LayoutOrientation.HORIZONTAL && orientation != LayoutOrientation.VERTICAL)
    		throw new Error("Unknown orientation: " + orientation); 
        for (let p of peers) {
            let attrT = datatable.type(attr);
    		let areaDS = p.dataScope ? p.dataScope : fullTableScopeRef(datatable);
    		let scopeRefs = getScopeRefsByAttribute(areaDS, attr, attrT == AttributeType.Number);
            if (scopeRefs.length === 1) {
    			scopeRefs.push(scopeRefs[0]);
    		}
            if (attrT == AttributeType.Number || attrT == AttributeType.Date) {
    			scopeRefs.sort((a, b) => (a.filters[attr] > b.filters[attr]) ? 1 : -1);
    		}
            let args = Object.assign({}, p.styles);

            //compute vertices
    		let x1 = p.vertices[0].x,
                y1 = p.vertices[0].y,
                x2 = p.vertices[p.vertices.length - 2].x,
                y2 = p.vertices[p.vertices.length - 2].y;

            let vertices = [], wd = x2 - x1, ht = y2 - y1;
            for(let j = 0; j < scopeRefs.length; j++) {
                vertices.push(orientation == LayoutOrientation.VERTICAL ? [x2, y1 + j * ht /(scopeRefs.length - 1)] : [x1 + j * wd / (scopeRefs.length - 1), y1]);
            }
            for(let j = 0; j < scopeRefs.length; j++) {
    			vertices.push(orientation == LayoutOrientation.VERTICAL ? [x1, y1 + (scopeRefs.length-1-j) * ht /(scopeRefs.length - 1)] : [x1 + (scopeRefs.length-1-j) * wd / (scopeRefs.length - 1), y2]);
    		}
    		args.vertices = vertices;
            args.type = "area";
            // args.vxShape = "circle";
            // args.vxRadius = 2;

            let newArea = createElement(scene, args);
            if (!areaClassId)
                areaClassId = newArea.id;
            newArea._classId = areaClassId;
            newArea.dataScope = areaDS;
            newArea.orientation = orientation;
            newArea.baseline = orientation === LayoutOrientation.HORIZONTAL ? BoundsAnchor.BOTTOM : BoundsAnchor.LEFT;

            let parent = p.parent;
    		parent.addChild(newArea);
    		parent.removeChild(p);

            for (let i = 0; i < newArea._vertices.length; i++){
    			// two boundary lines are encoded the same; possible to modify later according to the data encoding
    			if (i>=scopeRefs.length) {
    				newArea._vertices.setDataScopeRef(i, scopeRefs[scopeRefs.length*2-1-i]);
    			}
    			else {
    				newArea._vertices.setDataScopeRef(i, scopeRefs[i]);
    			}
    		}

            if (p === elem)
                toReturn = newArea;
        }
        return toReturn;
    }

    function canDensify(elem) {
        if ([ElementType.Line, ElementType.Circle, ElementType.Rect, ElementType.Area].indexOf(elem.type) < 0) {
    		return false;
    	} 
    	if (!elem.dataScope) {
    		return true;
    	} else {
    		let peers = getPeers(elem, elem.scene);
    		for (let p of peers) {
    			if (getScopeNumTuples(p.dataScope) > 1)
    				return true;
    		}
    		return false;
    	}
    }

    function validateDensifyArguments(elem, data, param) {
        if (!elem || data === undefined) {
            throw new Error("Incomplete information to do densification. You must specify an element, a categorical data attribute and a data table");
        }

        if (data instanceof DataTable) {
            validateAttribute(param["attribute"], data);
        }
    }

    function update(target, patch) {
        if (!target)
            throw new Error("update: target is required");
        if (!patch || typeof patch !== "object" || Array.isArray(patch))
            throw new Error("update: patch must be an object");

        if (isLayout(target)) {
            let groups = target.group ? [target.group] : [],
                groupsToUpdate = [];
            for (let g of groups) {
                groupsToUpdate = groupsToUpdate.concat(getPeers(g));
            }
            if (groupsToUpdate.length === 0)
                groupsToUpdate = groups;

            for (let g of groupsToUpdate) {
                if (!g.layout)
                    continue;
                for (const [key, value] of Object.entries(patch)) {
                    g.layout[key] = value;
                }
            }

            let scene = getScene(target);
            if (scene) {
                for (let g of groups) {
                    if (g.firstChild)
                        scene.onChange(VarType.CHANNEL, "width", g.firstChild);
                }
            }
            return;
        }

        let elemsToUpdate = getPeers(target),
            scene = getScene(target);
        for (const [key, value] of Object.entries(patch)) {
            if (key === "layout") {
                if (scene && typeof scene.setLayout === "function") {
                    scene.setLayout(target, value);
                } else {
                    for (let p of elemsToUpdate) {
                        p.layout = value;
                    }
                }
                continue;
            }
            for (let p of elemsToUpdate) {
                setElementProperty(p, key, value);
            }
        }

        if ("width" in patch) {
            elemsToUpdate.forEach(d => { if (d._refBounds) d._refBounds.setWidth(patch["width"]); });
        }
        if ("height" in patch) {
            elemsToUpdate.forEach(d => { if (d._refBounds) d._refBounds.setHeight(patch["height"]); });
        }

        if (scene) {
            for (let k in patch) {
                if (k === "layout")
                    continue;
                if (["vertex", "segment"].includes(target.type) && !["x", "y"].includes(k))
                    continue;
                if (Object.values(Channels).includes(k))
                    scene.onChange(VarType.CHANNEL, k, target);
                else
                    scene.onChange(VarType.PROPERTY, k, target);
            }
        }
    }

    function setElementProperty(elem, channel, value) {
        switch (channel) {
            case "x":
                setXPosition(elem, value);
                break;
            case "y":
                setYPosition(elem, value);
                break;
            case "width":
                setWidth(elem, value);
                break;
            case "height":
                setHeight(elem, value);
                break;
            case "radius":
                elem.radius = value;
                break;
            case "strength":
                elem._strength = value;
                break;
            case "area":
                if (elem.type === ElementType.Circle)
                    elem.radius = Math.sqrt(value/Math.PI);
                else if (elem.type === ElementType.Rect) {
                    elem.resize(Math.sqrt(value), Math.sqrt(value));
                }
                elem._updateBounds();
                break;
            case 'text':
                elem._text = value;
                break;
            case "curveMode":
                elem.curveMode = value;
                break;
            case "baseline":
                elem.baseline = value;
                break;
            case "angle": //for arcs
                if ([ElementType.Arc, ElementType.Pie].includes(elem.type))
                    setAngleSpan(elem, value);
                break;
            case "startAngle": //for arcs
                setStartAngle(elem, value);
                break;
            case "thickness":
                setThickness(elem, value);
                break;
            case "innerRadius":
                setInnerRadius(elem, value);
                break;
            case "outerRadius":
                setOuterRadius(elem, value);
                break;
            case "radialDistance": {
                let coords = polar2Cartesian(elem.parent.x, elem.parent.y, value, elem.polarAngle);
                setXPosition(elem, coords[0]);
                setYPosition(elem, coords[1]);
                break;
            }
            case "visibility":
                elem.visibility = value;
                break;
            case "src":
                elem.src = value;
                break;
            case "vxOpacity":
                if (elem instanceof Group) {
                    for (let c of elem.children)
                        setElementProperty(c, channel, value);
                } else {
                    elem.vxOpacity = value;
                }
                break;
            default: //styles
                if (elem.type === "vertex") {
                    elem[channel] = value;
                } else {
                    if (elem instanceof Group) {
                        for (let c of elem.children)
                            setElementProperty(c, channel, value);
                    } else {
                        if (elem.styles[channel] == value) {
                            return;
                        }
                        elem.styles[channel] = value;
                    }
                }
                break;
        }
        if (elem.type === "vertex")
            elem.parent._dirty = true;
        else
            elem._dirty = true;
    }

    function setInnerRadius(elem, val) {
        elem._innerRadius = val;
        elem.vertices[0].x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0].y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[3].x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3].y = elem._y - elem._innerRadius * Math.sin(elem._er);
    }

    function setOuterRadius(elem, val) {
        elem._outerRadius = val;
        elem.vertices[1].x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1].y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2].x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2].y = elem._y - elem._outerRadius * Math.sin(elem._er);
    }

    function setThickness(elem, val) {
        // elem._outerRadius = elem._innerRadius + val;
        // elem.vertices[1].x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        // elem.vertices[1].y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        // elem.vertices[2].x = elem._x + elem._outerRadius * Math.cos(elem._er);
        // elem.vertices[2].y = elem._y - elem._outerRadius * Math.sin(elem._er);
        setOuterRadius(elem, elem._innerRadius + val);
    }

    function setStartAngle(elem, val) {
        let angle = elem.angle;
        elem._startAngle = val;
        elem._endAngle = normalizeAngle(elem._startAngle + angle);
        elem._sr = degree2radian(elem._startAngle);
        elem._er = degree2radian(elem._endAngle);

        elem.vertices[0].x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0].y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[1].x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1].y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2].x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2].y = elem._y - elem._outerRadius * Math.sin(elem._er);
        elem.vertices[3].x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3].y = elem._y - elem._innerRadius * Math.sin(elem._er);
    }

    function setAngleSpan(elem, val) {
        elem._endAngle = normalizeAngle(elem._startAngle + val);
        elem._sr = degree2radian(elem._startAngle);
        elem._er = degree2radian(elem._endAngle);

        elem.vertices[0].x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0].y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[1].x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1].y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2].x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2].y = elem._y - elem._outerRadius * Math.sin(elem._er);
        elem.vertices[3].x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3].y = elem._y - elem._innerRadius * Math.sin(elem._er);
        //elem.setAngles(elem.startAngle, normalizeAngle(elem.startAngle + val));
    }

    function setXPosition(elem, val) {
        if (elem.type == "vertex") {
            elem.x = val;
        } else {
            translateElement(elem, val - elem.x, 0);
        }
    }

    function setYPosition(elem, val) {
        if (elem.type == "vertex") {
            elem.y = val;
        } else {
            translateElement(elem, 0, val - elem.y);
        }
    }

    function setWidth(elem, val) {
        elem.resize(val, elem.height);
    }

    function setHeight(elem, val) {
        elem.resize(elem.width, val);
    }

    class ConditionResultVar extends Variable {

        constructor(type, condEnc) {
            super(type);
            this._result = condEnc.evalResult;
            this._condEnc = condEnc;
        }

        get result() {
            return this._condEnc.evalResult;
        }

        clearResult() {
            this._condEnc.evalResult = {};
        }

        get conditionalEncoding() {
            return this._condEnc;
        }
    }

    class Encoder extends OneWayDependency {

        constructor(opType) {
            super(opType);
            // this.channel = channel;
        }

        storeValues(elem, channel) {
            this._storedValues = {};
            let peers = getPeers(elem);
            for (let p of peers) {
                this._storedValues[p.id] = p[channel];
            }
        }

        _restoreValue(elem, channel) {
            let stored = this._storedValues[elem.id];
            if (elem.styles) {
                if (elem.styles[channel] !== stored) {
                    elem._dirty = true;
                    elem.styles[channel] = stored;
                }
            } else {
                if (elem[channel] !== stored) {
                    elem._dirty = true;
                    elem[channel] = stored;
                }
            }
        }

        // get channel() {
        //     return this._channel;
        // }

        // set channel(c) {
        //     this._channel = c;
        //     if (c == "x" || c == "y" || c == "radius")
        //         this._accessor = "_" + c;
        //     else
        //         this._accessor = c;
        // }

        run() {
            super.run();
            let scaleVar = this.inputVars.find(d => d instanceof ScaleVar),
                outVar = this.outputVar,
                enc = scaleVar ? scaleVar.getEncoding(outVar.channel, outVar.element) : null,
                channel = outVar.channel;
            let condResultVars = this.inputVars.filter(d => d instanceof ConditionResultVar),
                condEncs = condResultVars.length > 0 ? condResultVars.map(d => d.conditionalEncoding) : [],
                evtCtx = condEncs.length > 0 ? condEncs[0].eventContext : null;
            let ub = ["x", "y", "width", "height", "radius"].includes(outVar.channel);

            if (scaleVar && outVar.element.type === "vertex") {
                this._runVertexIndexEncoding(enc, channel);
                propagateBoundsUpdate(outVar.element.parent);
                return;
            }

            let peers = getPeers(outVar.element),
                scn = peers[0].scene;

            for (let elem of peers) {
                if (scaleVar) {
                    let scale = enc.getScale(elem);
                    this._doMapping(elem, scale, enc.attrValues, enc);
                    if (ub) {
                        this._updateRefBounds(elem, scale, enc);
                    }
                } else {
                    this._restoreValue(elem, channel);
                }

                if (condResultVars.length > 0) {
                    //console.log(condResultVar.result);
                    // let b = condResultVar.result[elem.id];
                    // if (b === undefined) b = true; //.every(d => d  || d === undefined);
                    let b = condEncs.map(d => d.evalResult[elem.id]).every(d => d || d === undefined);
                    condEncs[0].stylingFunction(b, evtCtx, scn.state, elem);
                }
            }

            // if (scaleVar) { //a visual encoding has been specified
            //     let enc = scaleVar.getEncoding(outVar.channel, outVar.element);
            //     //encodings.find(d => d.channel == outVar.channel && getEncodingKey(d.element) == getEncodingKey(outVar.element)); 
            //         //start = 0;
            //     for (let scale of enc.scales) {
            //         let elems = enc.getElements(scale);
            //         console.log(elems.length + " encoded elements for channel " + outVar.channel)
            //         // this._doMapping(elems, scale, enc.attrValues.slice(start, start + elems.length));
            //         this._doMapping(elems, scale, enc.attrValues, enc);
            //         if (ub) {
            //             this._updateRefBounds(elems, scale, enc);
            //         }
            //     }
            // } else { 
            //     this._restoreValues(peers);
            // }


            // if (condResultVar) {
            //     let scn = peers[0].scene, condEnc = condResultVar.conditionalEncoding;
            //     console.log(peers.length + " peers to apply conditional encoding.");
            //     for (let elem of peers) {
            //         let b = condEnc.evalResult[elem.id];
            //         if (b === undefined) b = true; //.every(d => d  || d === undefined);
            //         let evtCtx = condEnc.eventContext;
            //         condEnc.stylingFunction(b, evtCtx, elem, scn);
            //     }
            //     //this._doCondEncoding(peers, condResultVars.map(d => d.conditionalEncoding));
            // }

            if (ub) {
                let elem = ["vertex", "segment"].includes(outVar.element.type) ? outVar.element.parent : outVar.element;
                propagateBoundsUpdate(elem);
            }
        }

        _runVertexIndexEncoding(enc, channel) {
            for (let i = 0; i < enc.scales.length; i++) {
                let scale = enc.scales[i],
                    elemGroup = enc.getElements(scale),
                    updatedParents = [];
                for (let group of elemGroup.groups) {
                    group.parent._vertices;
                    for (let index of group.indices) {
                        let id = getVertexId(group.parent, index),
                            attrValue = enc.attrValues[id],
                            value = channel === "text" ? attrValue : scale.map(attrValue);
                        this._setVertexIndexChannel(group.parent, index, channel, value);
                    }
                    group.parent._dirty = true;
                    if ((channel === "x" || channel === "y") && !updatedParents.includes(group.parent)) {
                        this._updateVertexParentRefBounds(group.parent, channel, scale, enc);
                        updatedParents.push(group.parent);
                    }
                }
            }
        }

        _setVertexIndexChannel(parent, index, channel, value) {
            let vertices = parent._vertices;
            switch (channel) {
                case "x":
                    vertices._xs[index] = value;
                    break;
                case "y":
                    vertices._ys[index] = value;
                    break;
                case "radialDistance": {
                    let angle = vertices._polarAngles[index],
                        rad = angle * Math.PI / 180;
                    vertices._xs[index] = parent.x + value * Math.cos(rad);
                    vertices._ys[index] = parent.y - value * Math.sin(rad);
                    break;
                }
                case "fillColor":
                case "opacity":
                case "strokeWidth":
                case "strokeColor":
                case "shape":
                case "width":
                case "height":
                case "radius":
                case "polarAngle":
                    vertices.setProperty(index, channel, value);
                    break;
                default:
                    vertices.setProperty(index, channel, value);
                    break;
            }
        }

        _updateVertexParentRefBounds(parent, channel, scale, enc) {
            let rf = parent.refBounds;
            if (channel === "x") {
                parent._refBounds = new Rectangle(enc.flipScale ? scale.range[1] : scale.range[0], rf.top, scale.rangeExtent, rf.height);
            } else if (channel === "y") {
                parent._refBounds = new Rectangle(rf.left, enc.flipScale ? scale.range[0] : scale.range[1], rf.width, scale.rangeExtent);
            }
        }

        _updateRefBounds(elem, scale, enc) {
            switch (this.outputVar.channel) {
                case "width":
                    elem._refBounds.setWidth(scale.rangeExtent);
                    break;
                case "height":
                    elem._refBounds.setHeight(scale.rangeExtent);
                    break;
                case "radius":
                    elem._refBounds.setWidth(scale.rangeExtent * 2, BoundsAnchor.CENTER);
                    elem._refBounds.setHeight(scale.rangeExtent * 2, BoundsAnchor.MIDDLE);
                    break;
                case "x":
                    if (elem.type == "vertex" || elem.type == "segment") {
                        let rf = elem.parent._refBounds;
                        elem.parent._refBounds = new Rectangle(enc.flipScale ? scale.range[1] : scale.range[0], rf.top,
                            scale.rangeExtent, rf.height);
                    } else if (elem._refBounds) {
                        if (scale.type === "band") {
                            // Band x-encoding positions each element independently. Update refBounds.left
                            // per-element so that height/width resize (which resets left to refBounds.left)
                            // preserves the x-encoded position rather than collapsing all bars together.
                            let xCenter = scale.map(enc.attrValues[elem.id]);
                            let rf = elem._refBounds;
                            elem._refBounds = new Rectangle(xCenter - elem.width / 2, rf.top, elem.width, rf.height);
                        } else {
                            // Only anchor _refBounds to scale.range[0] when some ancestor has a grid
                            // layout (e.g. SPLOM's outer composite). scale.range[0] then equals the
                            // cell's left edge, so GridPlacer sees a stable reference and won't
                            // counter-translate encoding-driven moves. For non-grid charts (e.g.
                            // MultipleAreaCharts) each element has a distinct position — leave it alone.
                            let anc = elem.parent;
                            while (anc && !(anc.layout && anc.layout.type === LayoutType.GRID)) anc = anc.parent;
                            if (anc) {
                                let rf = elem._refBounds;
                                elem._refBounds = new Rectangle(enc.flipScale ? scale.range[1] : scale.range[0],
                                    rf.top, scale.rangeExtent, rf.height);
                            }
                        }
                    }
                    break;
                case "y":
                    if (elem.type == "vertex" || elem.type == "segment") {
                        let rf = elem.parent._refBounds;
                        elem.parent._refBounds = new Rectangle(rf.left, enc.flipScale ? scale.range[0] : scale.range[1],
                            rf.width, scale.rangeExtent);
                    } else if (elem._refBounds) {
                        let anc = elem.parent;
                        while (anc && !(anc.layout && anc.layout.type === LayoutType.GRID)) anc = anc.parent;
                        if (anc) {
                            let rf = elem._refBounds;
                            let rangeMin = d3__namespace.min(scale.range);
                            elem._refBounds = new Rectangle(rf.left, enc.flipScale ? scale.range[0] : rangeMin,
                                rf.width, scale.rangeExtent);
                        }
                    }
                    break;
            }
        }

        _doMapping(elem, scale, attrValues, enc) {
            switch (this.outputVar.channel) {
                case "width":
                    if (scale.domain[0] < 0 && elem instanceof Rect)
                        mapWidth_NegativeValues_Rect(elem, scale, attrValues);
                    else if (scale.domain[0] < 0 && elem instanceof Area)
                        ;
                    else if (elem.type === ElementType.Area)
                        mapWidth_Area(elem, scale, attrValues);
                    else
                        this._doStandardMapping(elem, scale, attrValues);
                    break;
                case "height":
                    if (scale.domain[0] < 0 && elem instanceof Rect)
                        mapHeight_NegativeValues_Rect(elem, scale, attrValues);
                    else if (scale.domain[0] < 0 && elem instanceof Area)
                        mapHeight_NegativeValues_Area(elem, scale, attrValues);
                    else if (elem.type === ElementType.Area)
                        mapHeight_Area(elem, scale, attrValues);
                    else
                        this._doStandardMapping(elem, scale, attrValues);
                    break;
                case 'text':
                    this._doTextMapping(elem, attrValues);
                    break;
                case 'fillGradient':
                    mapFillGradient_Area(elem, scale, attrValues, enc);
                    break;
                case 'angle':
                default:
                    this._doStandardMapping(elem, scale, attrValues);
                    break;
            }
        }

        _doTextMapping(elem, attrValues) {
            let channel = this.outputVar.channel;
            setElementProperty(elem, channel, attrValues[elem.id]);
        }

        _doStandardMapping(elem, scale, attrValues) {
            let channel = this.outputVar.channel;
            let val = scale.map(attrValues[elem.id]);
            setElementProperty(elem, channel, val);
            if (elem instanceof Path$1 && elem.firstVertex && elem.firstVertex.shape && channel === "strokeColor") {
                elem.vertices.forEach(v => v.fillColor = val);
            }
        }
        _doCondEncoding(peers, condEncs) {
            let scn = peers[0].scene;
            for (let elem of peers) {
                let b = condEncs.map(d => d.evalResult[elem.id]).every(d => d || d === undefined);
                let evtCtx = condEncs[0].eventContext;
                condEncs[0].stylingFunction(b, evtCtx, elem, scn);
            }
        }


        //     //TODO: continue
        //     // if (condEnc.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
        //     //     peers.forEach((mark) => {
        //     //         let tests = condEnc.predicates.map(d => d.testElement(mark));
        //     //         let b = tests.every(v => v === true);
        //     //         condEnc._efxFn(b, mark, condEnc.triggerElement, condEnc.evtCoords);
        //     //     });
        //     // } else if (condEnc.type === CondEncType.TRIGGER_ELEMENT_EXISTS) {
        //     //     peers.forEach((mark) => {
        //     //         //let tests = condEnc.predicates.map(d => d.value);
        //     //         let b = condEnc.triggerElement !== undefined; // tests.every(v => v !== undefined);
        //     //         condEnc._efxFn(b, mark, condEnc.triggerElement, condEnc.evtCoords);
        //     //     });
        //     // }
        // }

        _updateElement(condEnc, elem, channel, val) {
            let v;
            if (typeof val === 'object' && condEnc.triggerElement) {
                if ("property" in val)
                    v = condEnc.triggerElement[val.property];
                else if ("attribute" in val)
                    v = condEnc.triggerElement.datum[val.attribute];
            } else {
                v = val;
            }

            if (["x", "y"].includes(channel) && ("offset" in val)) {
                v += val.offset;
            }
            setElementProperty(elem, channel, v);
        }

        // _getUsableCondEncodings() {
        //     let condResultVars = this.inputVars.filter(d => d instanceof ConditionResultVar);
        //     // ,
        //     //     usableCondEncVars = condEncVars.filter(d => {
        //     //         if (d.condEncoding.type === CondEncType.TRIGGER_ELEMENT_EXISTS) {
        //     //             return true; //d.condEncoding.triggerElement !== undefined;
        //     //         } else if (d.condEncoding.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
        //     //             for (let p of d.condEncoding.predicates)
        //     //                 if (!p._value)
        //     //                     return false;
        //     //             return true;
        //     //         }                
        //     //     });
        //     return condResultVars; // usableCondEncVars;
        // }

    }

    class GridlinesUpdater extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let gl = this.outputVar.element;
            gl.updateValues();
            if (gl.scale) {
                this._runForEncoding(gl);
            } else {
                this._runForLayout(gl);
            }
            propagateBoundsUpdate(gl);
        }

        _runForLayout(gl) {
            let channel = gl.channel,
                collBounds = unionRefBounds(gl.elements),
                lines = [];
            if (channel === "x") {
                for (let i = 0; i < gl.values.length; i++) {
                    let b = gl.elements[i].refBounds;
                    lines.push({x1: b.x, y1: collBounds.bottom,
                        x2: b.x, y2: collBounds.top});
                }
            } else if (channel === "y") {
                for (let i = 0; i < gl.values.length; i++) {
                    let b = gl.elements[i].refBounds;
                    lines.push({x1: collBounds.left, y1: b.y,
                        x2:collBounds.right, y2: b.y});
                }
            }
            gl.lines = lines; 
            gl._dirty = true;
        }

        _runForEncoding(gl) {
            let channel = gl.channel,
                collBounds = unionRefBounds(gl.elements),
                lines = [];
            if (channel === "x") {
                let yEnc = getChannelEncodingByElement(gl.elements[0], "y");
                let top, btm;
                if (yEnc) {
                    top = Math.min(...yEnc.getScale(gl.elements[0]).range, collBounds.top);
                    btm = Math.max(...yEnc.getScale(gl.elements[0]).range, collBounds.bottom);
                } else {
                    top = collBounds.top;
                    btm = collBounds.bottom;
                }
                for (let v of gl.values) {
                    lines.push({x1: gl.scale.map(v), y1: btm,
                        x2: gl.scale.map(v), y2: top});
                }
            } else if (channel === "width") {
                for (let v of gl.values) {
                    lines.push({x1: gl.scale.map(v) + collBounds.left, y1: collBounds.bottom,
                        x2: gl.scale.map(v) + collBounds.left, y2: collBounds.top});
                }
            } else if (channel === 'y') {
                let xEnc = getChannelEncodingByElement(gl.elements[0], "x");
                let left, right;
                if (xEnc) {
                    left = Math.min(...xEnc.getScale(gl.elements[0]).range, collBounds.left);
                    right = Math.max(...xEnc.getScale(gl.elements[0]).range, collBounds.right);
                } else {
                    left = collBounds.left;
                    right = collBounds.right;
                }
                for (let v of gl.values) {
                    lines.push({x1: left, y1: gl.scale.map(v),
                        x2: right, y2: gl.scale.map(v)});
                }
            } else if (channel === 'height') {
                for (let v of gl.values) {
                    lines.push({x1: collBounds.left, y1: collBounds.bottom - gl.scale.map(v),
                        x2: collBounds.right, y2: collBounds.bottom - gl.scale.map(v)});
                }
            } else if (channel === "radialDistance") {
                let pg = gl.elements[0].parent;
                for (let i = 0; i < gl.values.length; i++) {
                    lines.push({"x": pg.x, "y": pg.y, "r": gl.scale.map(gl.values[i])});
                }
            }
            gl.lines = lines;
            gl._dirty = true; 
        }

    }

    class StackPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let elem = this._outputVars[0].element,
    			leafMark = getLeafMarks(elem)[0],
                groups = getPeers(elem.parent);
            for (let group of groups) {
                let layout = group.layout;
                if (!layout) return;
                switch (leafMark.type) {
                    case ElementType.Rect:
    				case ElementType.Circle:
    				case ElementType.Image:
                        this._stackRects(group, layout);
                        break;
    				case ElementType.Area:
    					if (group.children[0].orientation === LayoutOrientation.HORIZONTAL) {
    						this._stackAreasVert(group, layout);
    					} else {
    						this._stackAreasHorz(group, layout);
    					}
    					break;
    				case ElementType.Arc:
    				case ElementType.Pie:
    					if (leafMark.parent.classId === group.classId)
    						this._stackArcs(group, layout);
    					//TODO: handle collections of arcs, e.g., RoseChart
    					break;
                }
            }
    		propagateBoundsUpdate(leafMark);
        }

    	_stackArcs(group, layout) {
    		if (layout.orientation === LayoutOrientation.ANGULAR) {
    			let startAngle = 90,
    				dir = this._direction ? this._direction : AngularDirection.Clockwise;
    			if (dir === AngularDirection.Clockwise) {
    				for (let c of group.children) {
    					let temp = normalizeAngle(startAngle - c.angle);
    					//c.adjustAngle(temp, startAngle);
    					setElementProperty(c, "startAngle", temp);
    					startAngle = temp;
    				}
    			} else {
    				for (let c of group.children) {
    					let temp = normalizeAngle(startAngle + c.angle);
    					//c.adjustAngle(startAngle, temp);
    					setElementProperty(c, "startAngle", temp);
    					startAngle = temp;
    				}
    			}
    		} else if (layout.orientation === LayoutOrientation.RADIAL) {
    			//TODO: stack arc radially 
    			let r = d3.min(group.children.map(d => d.innerRadius));
    			for (let c of group.children) {
    				let t = c.outerRadius - c.innerRadius;
    				setElementProperty(c, "innerRadius", r);
    				setElementProperty(c, "outerRadius", r + t);
    				r = c._outerRadius;
    			}
    		}
    	}

    	_stackAreasVert(group, layout) {
    		let areas = group.children.filter(d => d.visibility === "visible"), gb = group.bounds, 
    			start = layout.vertCellAlignment === BoundsAnchor.TOP ? gb.top : gb.bottom,
    			dir = layout.vertCellAlignment === BoundsAnchor.TOP ? 1 : -1;
    		if (areas.length === 0) return;
    		if (layout.vertCellAlignment === BoundsAnchor.BOTTOM)
    			areas.reverse();
    		let vCnt = areas[0].vertices.length/2,
    			cumuHts = new Array(vCnt).fill(0);
    		for (let area of areas) {
    			for (let i = 0; i < vCnt; i++) {
    				let v1 = area.vertices[i],
    					v2 = area.vertices[vCnt*2 - i - 1],
    					ht = Math.abs(v1.y - v2.y);
    				let y1 = start + cumuHts[i] * dir, y2 = start + (cumuHts[i] + ht) * dir;
    				translateElement(v1, 0, y1 - v1.y);
    				translateElement(v2, 0, y2 - v2.y);
    				cumuHts[i] += ht;
    			}
    			let oldBottom = area.bounds.bottom;
    			area._updateBounds();
    			area._refBounds.translate(0, area.bounds.bottom - oldBottom);
    		}
    		if (layout.vertCellAlignment === BoundsAnchor.MIDDLE) {
    			for (let area of areas) {
    				for (let i = 0; i < vCnt; i++) {
    					let v1 = area.vertices[i],
    						v2 = area.vertices[vCnt*2 - i - 1];
    					let b = gb.middle + cumuHts[i]/2;
    					translateElement(v1, 0, b - gb.bottom);
    					translateElement(v2, 0, b - gb.bottom);
    				}
    				let oldBottom = area.bounds.bottom;
    				area._updateBounds();
    				area._refBounds.translate(0, area.bounds.bottom - oldBottom);
    			}
    		}
    	}

    	_stackAreasHorz(group, layout) {

    	}

        _stackRects(group, layout) {
            group.scene;
                let o = layout._orientation;
    		let bounds = group.children.map(d => d.bounds),
                lefts = bounds.map(d => d.left),
    			tops = bounds.map(d => d.top),
    			wds = bounds.map(d => d.width),
    			hts = bounds.map(d => d.height);
    		let left = layout._left == undefined ? d3.min(lefts) : layout._left,
    			top = layout._top == undefined ? d3.min(tops) : layout._top;
    		
    		let maxWd = d3.max(wds), maxHt = d3.max(hts);
    		if (o == LayoutOrientation.VERTICAL) {
    			//let centerX = left + maxWd/2;
    			for (let i = 0; i < group.children.length; i++) {
    				let c = group.children[i]; 
    				let dx = 0, //centerX - c.bounds.x,
    					dy = top + c.bounds.height/2 - c.bounds.y;
    				top += c.bounds.height + layout._gap;
    				translateElement(c, dx, dy);
    				c._updateBounds();
    				//alignment
    				let cdx = 0, cdy = 0;
    				if (!isDataBoundHorizontally(c)) {
    					switch (layout._horzCellAlignment) {
    						case BoundsAnchor.LEFT:
    							cdx = left - c.bounds.left;
    							break;
    						case BoundsAnchor.CENTER:
    							cdx = left + maxWd / 2 - c.bounds.x;
    							break;
    						case BoundsAnchor.RIGHT:
    							cdx = left + maxWd - c.bounds.right;
    							break;
    					}
    				}
    				translateElement(c, cdx, cdy);
    			}
    		} else {
    			//let centerY = top + maxHt/2;
    			for (let i = 0; i < group.children.length; i++) {
    				let c = group.children[i]; 
    				let dx = left + c.bounds.width/2 - c.bounds.x,
    					dy = 0;// centerY - c.bounds.y;
    				left += c.bounds.width + layout._gap;
    				translateElement(c, dx, dy);
    				c._updateBounds();

    				let cdx = 0, cdy = 0;
    				if (!isDataBoundVertically(c)) {
    					switch (layout._vertCellAlignment) {
    						case BoundsAnchor.TOP:
    							cdy = top - c.bounds.top;
    							break;
    						case BoundsAnchor.MIDDLE:
    							cdy = top + maxHt/2 - c.bounds.y;
    							break;
    						case BoundsAnchor.BOTTOM:
    							cdy = top + maxHt - c.bounds.bottom;
    							break;
    					}
    				}
    				translateElement(c, cdx, cdy);
    			}
    		}
        }

    }

    // this operator does nothing, it exists as a conduit to propagate changes
    class Conduit extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
        }
    }

    class BinTransformer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let attr      = this._binConfig.attribute,
                startAttr = this._binConfig.startAttr,
                endAttr   = this._binConfig.endAttr,
                binIdAttr = this._binConfig.binIdAttr,
                inTbl     = this.inputVars[0].dataset,
                outTbl    = this.outputVar.dataset;

            let vals = inTbl.values(attr),
                binner = d3__namespace.bin();
            if (this._binConfig?.numBins != null) binner = binner.thresholds(this._binConfig.numBins);
            let d3Bins = binner(vals);
            this._binConfig.actualNumBins = d3Bins.length;

            // Zero-pad bin indices so lexicographic order = numeric order.
            let padWidth = String(d3Bins.length - 1).length;
            let pad = i => String(i).padStart(padWidth, '0');

            let findBin   = this._findBin;
            let startVals = vals.map(d => { let b = findBin(d, d3Bins); return b["x0"]; });
            let endVals   = vals.map(d => { let b = findBin(d, d3Bins); return b["x1"]; });
            let binIds    = vals.map(d => { let i = d3Bins.indexOf(findBin(d, d3Bins)); return pad(i); });

            let binIdsInOrder = d3Bins.map((_, i) => pad(i));

            outTbl.addAttr(startAttr, AttributeType.Number, startVals);
            outTbl.addAttr(endAttr,   AttributeType.Number, endVals);
            outTbl.addAttr(binIdAttr, AttributeType.String, binIds);
            outTbl.order(binIdAttr, binIdsInOrder);
        }

        _findBin(v, bins) {
            for (let b of bins) {
                if (b.indexOf(v) >= 0)
                    return b;
            }
        }
    }

    class ItemsVar extends Variable {

        constructor(type, dataset) {
            super(type);
            this._dataset = dataset;
        }

        get dataset() {
            return this._dataset;
        }

    }

    class FilterTransformer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let inItemsVar = this.inputVars.find(d => d instanceof ItemsVar),
                outTbl = this.outputVar.dataset;
            if (!inItemsVar) return;
            let inTbl = inItemsVar.dataset,
                spec = this._spec;

            // No value set → pass through all rows (brush not yet drawn or cleared)
            if (!spec.value) {
                outTbl.load(inTbl.data.slice());
                return;
            }

            let predicate = obj2Predicate$1(spec);
            outTbl.load(inTbl.data.filter(row => predicate.testTuple(row)));
        }

    }

    function repopulate(coll, dt, mapping) {
        coll.dataScope = undefined;
        let scene = getScene(coll),
            currentColl = coll;

        for (let k in mapping) {
            repopulateCollection(scene, currentColl, mapping[k], dt);

            let encs = getEncodingsByElement(currentColl.children[0], true);
            for (let enc of encs) {
                removeEncoding(enc, scene);
            }

            let peers = getPeers(currentColl);
            for (let cc of peers) {
                if (cc.layout) {
                    for (let re of cc.layout.refElements) {
                        removeRefElement(re, scene);
                        refElementRemoved(re, scene._depGraph);
                    }
                    cc.layout.clearRefElements();
                }
            }

            currentColl = currentColl.children[0];
        }

        coll.dataScope = fullTableScopeRef(dt);
        // scene._buildPeerIndex();
        scene.onChange(VarType.CHANNEL, "width", coll.children[0]);
    }

    /**
     * Repopulate the vertices of a densified Area after its source table changes
     * (e.g. due to a FilterTransformer re-run). Analogous to repopulateCollection
     * for Collection elements.
     *
     * Steps:
     *  1. Derive new scopeRefs from the updated datatable.
     *  2. Rebuild the vertex list (via the `vertices` setter, which resets counter).
     *  3. Assign dataScopeRefs to each vertex (top half + mirrored bottom half).
     *  4. Refresh element→scale mappings on all vertex and area-level encodings.
     */
    function repopulateArea(scene, area, attr, datatable) {
        let attrT = datatable.type(attr);
        let areaDS = fullTableScopeRef(datatable);
        let scopeRefs = getScopeRefsByAttribute(areaDS, attr, attrT === AttributeType.Number);

        if (attrT === AttributeType.Number || attrT === AttributeType.Date) {
            scopeRefs.sort((a, b) => (a.filters[attr] > b.filters[attr]) ? 1 : -1);
        }
        if (scopeRefs.length === 1) scopeRefs.push(scopeRefs[0]);

        let n = scopeRefs.length;
        let b = area.refBounds ?? area.bounds;
        let { left: x1, top: y1, right: x2, bottom: y2 } = b;
        let wd = x2 - x1, ht = y2 - y1;
        let isVert = area.orientation === LayoutOrientation.VERTICAL;

        let newVertices = [];
        if (n > 0) {
            // top / right boundary (index 0 … n-1)
            for (let j = 0; j < n; j++) {
                newVertices.push(isVert
                    ? [x2, y1 + j * ht / (n - 1)]
                    : [x1 + j * wd / (n - 1), y1]);
            }
            // bottom / left boundary (index n … 2n-1, reversed)
            for (let j = 0; j < n; j++) {
                newVertices.push(isVert
                    ? [x1, y1 + (n - 1 - j) * ht / (n - 1)]
                    : [x1 + (n - 1 - j) * wd / (n - 1), y2]);
            }
        }

        // Rebuild vertex list through the setter — resets vertexCounter to 0, giving
        // fresh sequential IDs (0, 1, …, 2n-1). getVertexId(area, i) = area.id+"_v_"+i.
        area.vertices = newVertices;

        // Assign dataScopeRefs: top half → scopeRefs[i], bottom half → mirror
        for (let i = 0; i < area._vertices.length; i++) {
            let ref = i < n ? scopeRefs[i] : scopeRefs[n * 2 - 1 - i];
            area._vertices.setDataScopeRef(i, ref);
        }

        // Rebuild element→scale mappings for all encodings on this area and its vertices.
        //
        // We CANNOT rely on enc.refreshElementMappings() here because that method reads
        // vertex.dataScope via vertex._index on the ORIGINAL vertex object stored in
        // enc._elem. After area.vertices = newVertices the original bottomLeftVertex has
        // _index = 2N-1, but the new vertex list only has indices 0…2n-1.
        // area._vertices.getDataScopeRef(2N-1) returns null, so getPeerVertexIndices
        // falls into the else-branch and maps only the stale index — leaving the
        // actual bottom vertices (n…2n-1) without a scale entry.
        //
        // Instead, rebuild _elem2scale/_elemGroups directly from the current vertex list.
        let areaClassId = area.classId ?? area.id;
        let half = Math.floor(area._vertices.length / 2);  // n

        for (let key in area.scene._encodings) {
            if (key === areaClassId) {
                // Area-level encodings (e.g. "height")
                for (let enc of Object.values(area.scene._encodings[key])) {
                    if (enc._scales.length !== 1) continue;
                    enc._elem2scale = { [area.id]: enc._scales[0] };
                    enc._elemGroups = [[area]];
                }
            } else if (key.startsWith(areaClassId + "_v")) {
                // Vertex-level encodings: top half (key "_v0") or bottom half (any other "_v*")
                let isTop = (key === areaClassId + "_v0");
                let start = isTop ? 0 : half;
                let end   = isTop ? half : area._vertices.length;
                let indices = [];
                for (let i = start; i < end; i++) {
                    if (area._vertices.hasDataScope(i)) indices.push(i);
                }
                let groups = [{ parent: area, indices }];
                for (let enc of Object.values(area.scene._encodings[key])) {
                    if (enc._scales.length !== 1) continue;
                    enc._elem2scale = {};
                    enc._elemGroups = [{ type: "vertexIndices", groups }];
                    for (let idx of indices)
                        enc._elem2scale[getVertexId(area, idx)] = enc._scales[0];
                }
            }
        }

        area.dataScope = areaDS;
    }

    function repopulateCollection(scene, collection, attr, datatable) {
        let type = datatable.type(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Repopulate only works on a string or date attribute: " + attr + " is " + type);
        }

        let peers = getPeers(collection);
        for (let coll of peers) {
            // keepEmpty=true: include zero-row groups so that e.g. empty histogram
            // bins (present in table.order() but with no data rows) render as
            // zero-height bars rather than being omitted and leaving visual gaps.
            let ds = getScopeRefsByAttribute(coll.dataScope ? coll.dataScope : fullTableScopeRef(datatable), attr, true);
            //coll.dataScope = coll.parent && coll.parent.dataScope ? coll.parent.dataScope : DataScope.intern(datatable);
        
            let toRemove = coll.children.length - ds.length, toAdd = ds.length - coll.children.length;
            for (let i = 0; i < toRemove; i++) {
                coll.removeChildAt(coll.children.length - 1);
            }
        
            let len = coll._children.length;
            for (let i = 0; i < toAdd; i++) {
                let c = duplicate(coll._children[i%len]);
                coll.addChild(c);
            }
        
            coll.children.forEach((d, i) => d.dataScope = ds[i]);
        }

    }

    class RepopulateOperator extends OneWayDependency {

        constructor(opType) {
            super(opType);
            this._collection = null;
            this._area = null;
            this._repeatAttr = null;
        }

        run() {
            super.run();

            // Area branch: repopulate vertices of a densified area chart
            if (this._area && this._repeatAttr) {
                let itemsVar = this.inputVars[0];
                if (!itemsVar) return;
                let outTbl = itemsVar.dataset;
                let scene = getScene(this._area);
                repopulateArea(scene, this._area, this._repeatAttr, outTbl);
                this.needsFullRender = true;
                return;
            }

            if (!this._collection || !this._repeatAttr) return;

            let itemsVar = this.inputVars[0];
            if (!itemsVar) return;

            let outTbl = itemsVar.dataset,
                coll = this._collection,
                scene = getScene(coll);

            // Clear stale datascopes on the collection and all its descendants
            // before repopulating. Without this, Group.set dataScope merges the
            // old child scopes (e.g. mascot_rowId: "r0") with the new ones
            // (e.g. mascot_rowId: "r77"), producing a conflict warning and keeping
            // the wrong row ID. Clearing first also makes repopulateCollection
            // fall through to fullTableScopeRef(outTbl), which is what we want.
            coll.dataScope = undefined;
            repopulateCollection(scene, coll, this._repeatAttr, outTbl);
            coll.dataScope = fullTableScopeRef(outTbl);

            // Refresh element→scale mappings so newly added (and removed) elements
            // are reflected in _elem2scale/_elemGroups without recreating scale objects
            // (preserving their domain/range for ScaleBuilder to update correctly).
            for (let enc of getEncodingsByElement(coll.children[0], true)) {
                enc.refreshElementMappings();
            }

            // Update _elems on any LayoutAxis attached to this collection so that
            // createTicksLabels (called by AxisUpdater) sees the new child list.
            // This collection is a flat repeat (not a multi-column grid subset),
            // so _elems should always equal all current children.
            if (coll.layout) {
                for (let re of coll.layout.refElements) {
                    if (re instanceof LayoutAxis) {
                        re._elems = coll.children.slice();
                    }
                }
            }

            // Signal Scene.onChange to do a full re-render after all operators finish,
            // so DOM nodes are created for new elements and the axis/encodings are
            // all up-to-date before anything is painted.
            this.needsFullRender = true;
        }
    }

    class Affixer extends OneWayDependency {

        constructor(type) {
            super(type);
        }

        run() {
            super.run();
            let affx = this.inputVars.find(d => d.type === VarType.AFFIXATION).affixation,
                baseElem = affx.base,
                elem = affx.element,
                baseElems = getPeers(baseElem),
                elems = getPeers(elem),
                channels = affx.channels,
                attr = affx.attribute;

            //TODO: handle cases where elem or baseElem is a glyph/collection (e.g., violin plot, tower chart, sparklines)
            if (isMark(elem) && isMark(baseElem)) {
                let baseAttrs = baseElems.map(d => d.datum[attr]);
                elems = elems.filter(d => baseAttrs.includes(d.datum[attr]));
                let cf = (a, b) => {
                    if (a.datum[attr] < b.datum[attr])
                        return -1;
                    else if (a.datum[attr] > b.datum[attr])
                        return 1;
                    else
                        return 0;
                };
                elems.sort(cf);
                baseElems.sort(cf);
            }

            if (channels.includes("x") || channels.includes("y")) {
                for (let channel of channels)
                    this._handleXY(channel, elems, baseElems, affx.getElementAnchor(channel), affx.getBaseAnchor(channel), affx.getOffset(channel));
            } if (channels.includes("radialDistance") || channels.includes("angle")) {
                this._handlePolar(elems, baseElems, affx);
            }
            
            // if (channel === "radialDistance") {
            //     this._handleRadialDistance(elems, baseElems, eAnchor, bAnchor, offset);
            // } else if (channel === "angle") {
            //     this._handleAngle(elems, baseElems, eAnchor, bAnchor, offset);
            // } else {
            //     this._handleXY(channel, elems, baseElems, eAnchor, bAnchor, offset);
            // }

            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);

        }

        _handlePolar(elems, baseElems, affx) {
            let radiusBaseAnchor = affx.hasChannel("radialDistance") ? affx.getBaseAnchor("radialDistance") : BoundsAnchor.MIDDLE,
                radiusElemAnchor = affx.hasChannel("radialDistance") ? affx.getElementAnchor("radialDistance") : BoundsAnchor.MIDDLE,
                angleBaseAnchor = affx.hasChannel("angle") ? affx.getBaseAnchor("angle") : BoundsAnchor.CENTER;
                affx.hasChannel("angle") ? affx.getElementAnchor("angle") : BoundsAnchor.CENTER;
                let radiusOffset = affx.hasChannel("radialDistance") ? affx.getOffset("radialDistance") : 0,
                angleOffset = affx.hasChannel("angle") ? affx.getOffset("angle") : 0;
            if ([ElementType.Arc, ElementType.Ring].indexOf(baseElems[0].type) >= 0 && elems[0].type == ElementType.SimpleText) {
                for (let i = 0; i < elems.length; i++) {
                    let base = baseElems[i], item = elems[i];
                    let r = radiusBaseAnchor === BoundsAnchor.MIDDLE ? (base.outerRadius + base.innerRadius)/2 : radiusBaseAnchor === BoundsAnchor.TOP ? base.outerRadius - 5 : base.innerRadius + 5;
                    r += radiusOffset;
                    if (base.type === ElementType.Arc) {
                        let s = polar2Cartesian(base.x, base.y, r, base.startAngle),
                            e = polar2Cartesian(base.x, base.y, r, base.endAngle);
                        if (base.endAngle >= 180 && base.endAngle <= 360) {
                            item._textPath = [
                                `M`, s[0], s[1],
                                `A`, r, r, base.angle, base.angle >= 180 ? 1 : 0, 0, e[0], e[1]
                            ].join(" ");
                        } else {
                            item._textPath = [
                                `M`, e[0], e[1],
                                `A`, r, r, base.angle, base.angle >= 180 ? 1 : 0, 1, s[0], s[1]
                            ].join(" ");
                        }
                    } else if (base.type === ElementType.Ring) {
                        let startAngle = 275, endAngle = 265, angle = 350;
                        let s = polar2Cartesian(base.x, base.y, r, startAngle),
                            e = polar2Cartesian(base.x, base.y, r, endAngle);
                        item._textPath = [
                            `M`, e[0], e[1],
                            `A`, r, r, angle, 1 , 1, s[0], s[1]
                        ].join(" ");
                    }
                    item.textPathOffset = angleBaseAnchor === BoundsAnchor.LEFT ? "0%" : "50%";
                }
            } else {
                for (let i = 0; i < elems.length; i++) {
                    let dist, angle, base = baseElems[i], item = elems[i];
                    if (base.type == ElementType.Arc || base.type == ElementType.Ring) {
                        angle = angleBaseAnchor == "left" ? base.endAngle + angleOffset : angleBaseAnchor == "center" ?  base.startAngle + base.angle/2 + angleOffset : base.startAngle + angleOffset;
                        dist = radiusBaseAnchor == "top" ? base.outerRadius + radiusOffset : radiusBaseAnchor == "bottom" ? base.innerRadius + radiusOffset : (base.outerRadius + base.innerRadius)/2 + radiusOffset;
                    }
                    else if (base.type == ElementType.Circle) {
                        angle = 90;
                        dist = radiusBaseAnchor == "top" ? base.radius + radiusOffset : radiusBaseAnchor == "bottom" ? radiusOffset : base.radius/2 + radiusOffset;
                    }
                    translateElement(item, base.x - item.x, base.y - dist - item.bounds[radiusElemAnchor] );
                   //translate(item, base.x - item.bounds[angleElemAnchor], base.y - elems[i].y );

                    item._rotate = [90 - angle, base.x, base.y];
                    
                }
            }
        }

        // _handleAngle(elems, baseElems, eAnchor, bAnchor, offset) {
        //     for (let i = 0; i < elems.length; i++) {
        //         let angle, base = baseElems[i], item = elems[i];
        //         if (!base) break;
        //         if (base.type == ElementType.Arc) {
        //             angle = bAnchor == "left" ? base.endAngle + offset : bAnchor == "center" ?  base.startAngle + base.angle/2 + offset : base.startAngle + offset;
        //         } else {
        //             angle = 90;
        //         }

        //         if (item._rotate) {
        //             item._rotate[0] = 90 - angle;
        //         } else {
        //             translate(item, base.x - item.bounds[eAnchor], base.y - elems[i].y );
        //             item._rotate = [90 - angle, baseElems[i].x, baseElems[i].y];
        //         }
        //     }
        // }

        // _handleRadialDistance(elems, baseElems, eAnchor, bAnchor, offset) {
        //     for (let i = 0; i < elems.length; i++) {
        //         let dist, base = baseElems[i], item = elems[i];
        //         if (!base) break;
        //         if (base.type == ElementType.Arc && item.type == ElementType.PointText) {
        //             let s = polar2Cartesian(base.x, base.y, (base.outerRadius + base.innerRadius)/2, base.startAngle),
        //             e = polar2Cartesian(base.x, base.y, (base.outerRadius + base.innerRadius)/2, base.endAngle);
        //             if (base.endAngle > 180 && base.endAngle < 360) {
        //                 item._textPath = [
        //                     `M`, s[0], s[1],
        //                     `A`, (base.outerRadius + base.innerRadius)/2, (base.outerRadius + base.innerRadius)/2, base.angle, base.angle >= 180 ? 1 : 0, 0, e[0], e[1]
        //                 ].join(" ");
        //             } else {
        //                 item._textPath = [
        //                     `M`, e[0], e[1],
        //                     `A`, (base.outerRadius + base.innerRadius)/2, (base.outerRadius + base.innerRadius)/2, base.angle, base.angle >= 180 ? 1 : 0, 1, s[0], s[1]
        //                 ].join(" ");
        //             }
                    
        //         } else {
        //             if (base.type == ElementType.Arc || base.type == ElementType.Ring)
        //                 dist = bAnchor == "top" ? base.outerRadius + offset : bAnchor == "bottom" ? base.innerRadius + offset : (base.outerRadius + base.innerRadius)/2 + offset;
        //             else if (base.type == ElementType.Circle)
        //                 dist = bAnchor == "top" ? base.radius + offset : bAnchor == "bottom" ? offset : base.radius/2 + offset;
        //             translate(item, base.x - item.x, base.y - dist - item.bounds[eAnchor] );
        //             if (item._rotate) {
        //                 item._rotate = [item._rotate[0], base.x, base.y];
        //             } else {
        //                 item._rotate = [0, base.x, base.y];
        //             }
        //         }
        //     }
        // }

        _handleXY(channel, elems, baseElems, eAnchor, bAnchor, offset) {
            //TODO: need to establish correspondences based on data scope
            for (let i = 0; i < elems.length; i++) {
                let p, baseElem = baseElems[i], elem = elems[i];

                if (isLink(baseElem)) {
                    let frac = [BoundsAnchor.LEFT, BoundsAnchor.TOP].includes(bAnchor) ? 0 : [BoundsAnchor.CENTER, BoundsAnchor.MIDDLE].includes(bAnchor) ? 0.5 : 1;
                    p = getPointAt(baseElem, frac)[channel];
                } else {
                    p = baseElem.bounds[bAnchor] + offset;
                }

                if (elems[0].type === ElementType.SimpleText) {
                    elem.anchor[channel == "x" ? 0 : 1] = eAnchor;
                    setElementProperty(elem, channel, p);
                } else {
                    if (channel == "x")
                        translateElement(elem, p - elem.bounds[eAnchor], 0);
                    else
                        translateElement(elem, 0, p - elem.bounds[eAnchor]);
                }
            }
        }
    }

    class AffixationVar extends Variable {

        constructor(type, affx) {
            super(type);
            this._affx = affx;
        }

        get affixation() {
            return this._affx;
        }

    }

    class KdeTransformer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let attrVar = this.inputVars[0],
                newAttrVar = this.outputVar;
            let attr = attrVar.attribute, newAttr = newAttrVar.attribute, inTbl = attrVar.dataset, outTbl = newAttrVar.dataset;

            let args = this.args,
                min = args.min != null ? args.min : inTbl.summary(attr).min,
                max = args.max != null ? args.max : inTbl.summary(attr).max;
            let v = min, thresholds = [];
            while (v < max) {
                thresholds.push(v);
                v += args["interval"];
            }
            thresholds.push(v);

            let group2attrVals = {}, group2data = {};
            if (args.groupBy) {
                for (let row of inTbl.data) {
                    let k = args.groupBy.map(d => row[d]).join("-");
                    if (!(k in group2attrVals)) {
                        group2attrVals[k] = [];
                        group2data[k] = args.groupBy.map(d => row[d]);
                    }
                    group2attrVals[k].push(row[attr]);
                }
            } else {
                group2attrVals[""] = inTbl.data.map(d => d[attr]);
                group2data[""] = "";
            }

            let newData = [];
            for (let g in group2data) {
                let density = _kde(_epanechnikov(args.bandwidth), thresholds, group2attrVals[g]);
                for (let t of density) {
                    let o = {};
                    if (g !== "") {
                        args.groupBy.forEach((d, i) => o[d] = group2data[g][i]);
                    }
                    o[attr] = t[0];
                    o[newAttr] = t[1];
                    newData.push(o);
                }
            }
            // console.log(newData);
            
            let fTypes = {};
            fTypes[attr] = inTbl.type(attr);
            fTypes[newAttr] = AttributeType.Number;
            if (args.groupBy) {
                for (let c of args.groupBy) {
                    fTypes[c] = inTbl.type(c);
                }
            }
            outTbl.initialize(newData, outTbl.url, fTypes);
        }
    }

    function _kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3__namespace.mean(data, d => kernel(t - d))]);
    }

    function _epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    class CustomTransformer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let inItemsVar = this.inputVars.find(d => d instanceof ItemsVar);
            if (!inItemsVar) return;
            let inTbl = inItemsVar.dataset,
                outTbl = this.outputVar.dataset;
            this._spec.fn(inTbl, outTbl, this._spec);
        }
    }

    class PackPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let elem = this._outputVars[0].element,
                groups = getPeers(elem.parent);
            for (let group of groups) {
                let layout = group.layout;
                if (!layout) return;

                let nodes = group.children.map(d => ({"name": d.id, "radius": d.radius, "itm": d}));
                let area = nodes.reduce((total, current) => total + Math.pow(current.radius, 2), 0),
                    s = Math.sqrt(area);
                
                if (layout._width === undefined) {
                    layout._width = s;
                }

                if (layout._height === undefined) {
                    layout._height = s;
                }

                let data = d3__namespace.hierarchy({name: "root", children: nodes}).sum(d => d.radius ? d.radius : 0).sort((a, b) => b.value - a.value);
                d3__namespace.pack().size([layout._width, layout._height]).radius(d => d.value)(data);

                for (let c of data.children) {
                    let itm = c.data.itm;
                    let dx = layout._x - data.x + c.x - itm.x, dy = layout._y - data.y + c.y - itm.y;
                    translateElement(itm, dx, dy);
                }
            }
            
            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }
    }

    class AxisTitlePlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let pathPosVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_PATH_POSITION);

            let axis = pathPosVar.element;
            if (axis instanceof EncodingAxis)
                this._runForEncoding(axis);
            else if (axis instanceof LayoutAxis)
                this._runForLayout(axis);

            propagateBoundsUpdate(axis._title);
            //axis._title._updateBounds();
        }

        _runForEncoding(axis) {
            let channel = axis.channel,
                collBounds = unionRefBounds(axis.elements);
            if (channel == "x") {
                axis._title.x = (axis.scale.range[0] + axis.scale.range[1])/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.titleOffset : axis._pathPos - axis.titleOffset;
            } else if (channel == "width") {
                axis._title.x = collBounds.left + axis.scale.rangeExtent/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.titleOffset : axis._pathPos - axis.titleOffset;
            } else if (channel === "y") {
                if (axis._rotateYTitle) {
                    axis._title.x = axis.orientation == AxisOrientation.LEFT ? axis._pathPos - axis.titleOffset : axis._pathPos + axis.titleOffset;
                    axis._title._y = (axis.scale.range[0] + axis.scale.range[1])/2; // - collBounds.width/2 - axis.titleOffset;
                    axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, axis._title._x, axis._title._y] : [90, axis._title._x, axis._title._y];
                } else {
                    axis._title.x = axis.orientation == AxisOrientation.LEFT ? axis._pathPos - axis.titleOffset : axis._pathPos + axis.titleOffset;
                    axis._title._y = d3.min([axis.scale.range[0], axis.scale.range[1]]) - 25;
                    axis._title._rotate = undefined;
                }
            } else if (channel === "height") {
                axis._title.x = collBounds.center;
                axis._title._y = (collBounds.top + collBounds.bottom)/2 - collBounds.width/2 - axis.titleOffset;
                axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, collBounds.center, collBounds.middle] : [90, collBounds.center, collBounds.middle];
            } else if (channel === "radialDistance") {
                let pg = axis.elements[0].parent;
                axis._title.x = pg.x + axis.scale.rangeExtent/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.titleOffset : axis._pathPos - axis.titleOffset;
                if (axis._rotate) {
                    axis._title._rotate = axis._rotate.slice();
                }
            }
        }

        _runForLayout(axis) {
            let channel = axis.channel,
                stack = axis.elements[0].parent.layout && axis.elements[0].parent.layout.type == LayoutType.STACK,
                collBounds = stack ? unionBounds(axis.elements) : unionRefBounds(axis.elements);
            if (channel == "x") {
                axis._title.x = collBounds.center;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis._pathPos + axis.titleOffset : axis._pathPos - axis.titleOffset;
            } else if (channel === "y") {
                axis._title.x = collBounds.center;
                axis._title._y = collBounds.middle - collBounds.width/2 - axis.titleOffset;
                axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, collBounds.center, collBounds.middle] : [90, collBounds.center, collBounds.middle];
            } else if (channel === "angle") {
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    axis._title.x = layout.x;
                    axis._title._y = layout.y;
                }
            }
        }
    }

    class Aligner extends MultiWayDependency {

        constructor(type) {
            super(type);
        }

        run() {
            super.run();
            let aln = this.vars.find(d => d.type === VarType.ALIGNMENT).alignment;
            let baseline, anchor = aln.anchor, elems = aln.elements;
            //console.log(anchor, elems.map(d => d.bounds[anchor]));
            if (anchor == BoundsAnchor.Top || anchor == BoundsAnchor.LEFT)
                baseline = d3__namespace.min(elems.map(d => d.bounds[anchor]));
            else if (anchor == BoundsAnchor.BOTTOM || anchor == BoundsAnchor.RIGHT)
                baseline = d3__namespace.max(elems.map(d => d.bounds[anchor]));
            else if (anchor == BoundsAnchor.CENTER || anchor == BoundsAnchor.MIDDLE)
                baseline = d3__namespace.mean(elems.map(d => d.bounds[anchor]));
            //let delta = elems.map(d => baseline - d.bounds[anchor]);
            for (let elem of elems) {
                let t = canTranslate(elem, aln.channel);
                if (t) {
                    let delta = baseline - elem.bounds[anchor],
                        dx = aln.channel === "x" ? delta : 0,
                        dy = aln.channel === "x" ? 0 : delta;
                    //console.log(t, dx, dy);
                    translateElement(t, dx, dy);
                }
            }

            for (let elem of elems) {
                propagateBoundsUpdate(elem);
            }
        }
    }

    class AlignmentVar extends Variable {

        constructor(type, aln) {
            super(type);
            this._aln = aln;
        }

        get alignment() {
            return this._aln;
        }

    }

    class ForcePlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();

            let node = this._outputVars[0].element,
                nodeColls = getPeers(node.parent);

            for (let nodeColl of nodeColls) {
                let layout = nodeColl.layout;
    			if (!layout) continue;
                let graph = getNetwork(nodeColl.children[0]);
                if (!graph) continue;
                let links = graph.linkList.map(d => ({ source: graph.getNode(d.source), target: graph.getNode(d.target) }));
                let simulation = d3__namespace.forceSimulation(graph.nodeList)
                                    .force("charge", d3__namespace.forceManyBody().strength(-layout._repulsion))
                                    .force("link", d3__namespace.forceLink(links).id(d => d.id).distance(layout._linkDistance))
                                    .force("x", d3__namespace.forceX())
                                    .force("y", d3__namespace.forceY())
                                    .force("center", d3__namespace.forceCenter(layout._x, layout._y).strength(layout._attraction))
                                    ;
                simulation.stop();
                simulation.tick(layout._iterations);
                for (let i = 0; i < nodeColl.children.length; i++) {
                    let nodeMark = nodeColl.children[i],
                        node = graph.nodeList[i],
                        dx = node.x - nodeMark.x,
                        dy = node.y - nodeMark.y;
                    translateElement(nodeMark, dx, dy);
                }
                // let linkMks = getPeers(nodeColl.firstChild.links[0]);

                // for (let lm of linkMks) {
                //     updateLinkPosition(lm);
                // }
            }

            let lm = getLeafMarks(node, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }

    }

    class LinkRouter extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let link = this._outputVars[0].element,
                links = getPeers(link);
            
            switch (link.type) {
                case ElementType.Arc:
                    this._updateArcLinks(links);
                    break;
                case ElementType.BezierCurve:
                    this._updateBezierLinks(links);
                    break;
                case ElementType.BundledPath:
                    this._updateBundledLinks(links);
                    break;
                case ElementType.Chord:
                    this._updateChordLinks(links);
                    break;
                case ElementType.Line:
                default:
                    this._updateLineLinks(links);
                    break;
            }

            propagateBoundsUpdate(link);
        }

        _updateArcLinks(links) {
            for (let link of links) {
                let sMk = link.source.x < link.target.x ? link.source : link.target,
                    tMk = link.source.x < link.target.x ? link.target : link.source;
                
                link._x = (sMk.x + tMk.x)/2;
                link._y = (sMk.y + tMk.y)/2;
                link._innerRadius = Math.sqrt(Math.pow(sMk.x - tMk.x, 2) + Math.pow(sMk.y - tMk.y, 2))/2;
                link._outerRadius = link._innerRadius + link._thickness;
                let sa = getPolarAngle(sMk.x, sMk.y, link._x, link._y),
                    ea = getPolarAngle(tMk.x, tMk.y, link._x, link._y);
                if (link.direction === AngularDirection.CLOCKWISE) {
                    [sa, ea] = [ea, sa];
                }
                //link._endAngle = normalizeAngle(getPolarAngle(tMk.x, tMk.y, link._x, link._y));
                setElementProperty(link, "startAngle", sa);
                setElementProperty(link, "angle", Math.abs(ea - sa));
            }
        }

        _updateBezierLinks(links) {

            let node = this._inputVars[0].element,
                nodes = getPeers(node),
                layout = node.parent.layout;

            if (layout.type === LayoutType.DIRECTED || layout.type === LayoutType.TIDYTREE) {
                this._updateBezierLinksForDirectedGraph(nodes, links, layout);
            } else if (layout.type === LayoutType.CLUSTER) {
                this._updateBezierLinksForClusteredGraph(nodes, links, layout);
            }
        }

        _updateBezierLinksForClusteredGraph(nodes, links, layout) {
            const descendants = layout._d3Root.descendants();

            const idInTree2leaf = new Map(descendants.map(d => [id(d), d])),
                leafId2idInTree = new Map(descendants.map(d => [d.data[MSCNodeID], id(d)]));

            if (layout.isRadial()) {
                const line = d3__namespace.linkRadial().angle(d => d.x).radius(d => d.y);

                for (let link of links) {
                    let source = link.source, target = link.target,
                        sid = source.datum[MSCNodeID], tid = target.datum[MSCNodeID];
                    let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                        tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                    link._d = translateSVGPath(line({source: sLeaf, target: tLeaf}), layout.x, layout.y);
                }
            } else if (layout.orientation === LayoutOrientation.VERTICAL) {
                const line = d3__namespace.linkVertical().x(d => d.x).y(d => d.y);
                for (let link of links) {
                    let source = link.source, target = link.target,
                        sid = source.datum[MSCNodeID], tid = target.datum[MSCNodeID];
                    let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                        tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                    link._d = translateSVGPath(line({source: sLeaf, target: tLeaf}), layout.left - layout._x0, layout.top);
                }
            } else if (layout.orientation === LayoutOrientation.HORIZONTAL) {
                const line = d3__namespace.linkHorizontal().x(d => d.y).y(d => d.x);
                for (let link of links) {
                    let source = link.source, target = link.target,
                        sid = source.datum[MSCNodeID], tid = target.datum[MSCNodeID];
                    let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                        tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                    link._d = translateSVGPath(line({source: sLeaf, target: tLeaf}), layout.left, layout.top - layout._x0);
                }
            }
        }

        _updateBezierLinksForDirectedGraph(nodes, links, layout) {
            let cumulativeOutLinkWidth = {},
                cumulativeInLinkWidth = {},
                totalOutLinkWidth = {},
                totalInLinkWidth = {};
            for (let n of nodes) {
                cumulativeInLinkWidth[n.id] = 0;
                cumulativeOutLinkWidth[n.id] = 0;
                let outLinks = n.links.filter(d => d.source === n),
                    inLinks = n.links.filter(d => d.target === n);
                totalInLinkWidth[n.id] = inLinks.map(d => d.strokeWidth).reduce((acc, curr) => acc + curr, 0);
                totalOutLinkWidth[n.id] = outLinks.map(d => d.strokeWidth).reduce((acc, curr) => acc + curr, 0);
            }

            // Note: layout.direction holds LinearDirection values ("l2r"/"r2l"/"t2b"/"b2t"),
            // not the "LR"/"RL" dagre abbreviations, so this check (also used below) is the
            // correct way to distinguish horizontal from vertical flow.
            const isHorizontal = layout.direction === LinearDirection.Left2Right || layout.direction === LinearDirection.Right2Left;

            // Assign each link a lane at its source and a (possibly different) lane at its
            // target. The two need independent orderings: a node's outgoing links should be
            // laned in the order of their targets' positions along the perpendicular axis
            // (x for vertical flow, y for horizontal flow), and its incoming links should be
            // laned in the order of their sources' positions along that same axis. Sorting
            // the single shared `links` array once by polar angle (the previous approach)
            // conflated these two orderings and isn't even monotonic in the perpendicular
            // coordinate when sibling links span different distances along the main flow
            // axis -- which is exactly what produced the crossing outgoing links.
            if (layout.spreadLinks) {
                const perpCoord = isHorizontal
                    ? (mk) => mk.bounds.y
                    : (mk) => mk.bounds.x;

                const outOrder = [...links].sort((a, b) => perpCoord(a.target) - perpCoord(b.target));
                for (let link of outOrder) {
                    link._outLane = cumulativeOutLinkWidth[link.source.id];
                    cumulativeOutLinkWidth[link.source.id] += link.strokeWidth;
                }

                const inOrder = [...links].sort((a, b) => perpCoord(a.source) - perpCoord(b.source));
                for (let link of inOrder) {
                    link._inLane = cumulativeInLinkWidth[link.target.id];
                    cumulativeInLinkWidth[link.target.id] += link.strokeWidth;
                }
            }

            for (let link of links) {
                let source = link.source, target = link.target;
                let x1, y1, x2, y2;
                if (layout.spreadLinks) {
                    if (isHorizontal) {
                        x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0];
                        x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0];
                        y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1] - totalOutLinkWidth[source.id]/2 + link._outLane + link.strokeWidth/2;
                        y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1] - totalInLinkWidth[target.id]/2 + link._inLane + link.strokeWidth/2;
                    } else {
                        y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1];
                        y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1];
                        x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0] - totalOutLinkWidth[source.id]/2 + link._outLane + link.strokeWidth/2;
                        x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0] - totalInLinkWidth[target.id]/2 + link._inLane + link.strokeWidth/2;
                    }
                } else {
                    x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0];
                    y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1];
                    x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0];
                    y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1];
                }

                if (link.orientation === LayoutOrientation.HORIZONTAL) {
                    link.vertices = [
                        [x1, y1],
                        [(x1 + x2)/2, y1],
                        [x1, y2],
                        [x2, y2]
                    ];
                } else if (link.orientation === LayoutOrientation.VERTICAL) {
                    link.vertices = [
                        [x1, y1],
                        [x1, (y1 + y2)/2],
                        [x2, y1],
                        [x2, y2]
                    ];
                } 
            }
        }

        _updateBundledLinks(links) {
            let node = this._inputVars[0].element,
                layout = node.parent.layout;
            if (layout.type !== LayoutType.CLUSTER)
                throw "Bundled links must work on a cluster layout";
                
            let d3Root = layout._d3Root,
                leaves = d3Root.leaves();

            //bilink
            const idInTree2leaf = new Map(leaves.map(d => [id(d), d])),
                leafId2idInTree = new Map(leaves.map(d => [d.data[MSCNodeID], id(d)]));

            const line = d3__namespace.lineRadial()
                .curve(d3__namespace.curveBundle.beta(links[0]._strength))
                .radius(d => d.y)
                .angle(d => d.x);
            //const line = d3.line().curve(d3.curveBundle.beta(0.85)).x(d => d.x).y(d => d.y);
            
            for (let link of links) {
                let sid = link.source.datum[MSCNodeID],
                    tid = link.target.datum[MSCNodeID];
                let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                    tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                (sLeaf.outgoing ??= []).push([sLeaf, tLeaf]);
                tLeaf.incoming ??= [];
                let path = sLeaf.path(tLeaf);
                link._d = translateSVGPath(line(path), layout.x, layout.y);
                link._dirty = true;
                //(tLeaf.incoming ??= []).push([sLeaf, tLeaf]);
            }
        }

        _updateChordLinks(links) {
            for (let link of links) {
                let sMk = link.source,
                    tMk = link.target;
                
                let start1 = polar2Cartesian(sMk.x, sMk.y, sMk.innerRadius, sMk.startAngle),
                    end1 = polar2Cartesian(sMk.x, sMk.y, sMk.innerRadius, sMk.endAngle);
                let start2 = polar2Cartesian(tMk.x, tMk.y, tMk.innerRadius, tMk.startAngle),
                    end2 = polar2Cartesian(tMk.x, tMk.y, tMk.innerRadius, tMk.endAngle);

                link._d = [
                    `M`, start1[0], start1[1],
                    `Q`, sMk.x, sMk.y, end2[0], end2[1],
                    `A`, sMk.x, sMk.y, tMk.angle, tMk.angle > 180 ? 1 : 0, 1, start2[0], start2[1],
                    `Q`, sMk.x, sMk.y, end1[0], end1[1], 
                    `A`, sMk.x, sMk.y, sMk.angle, sMk.angle > 180 ? 1 : 0, 1, start1[0], start1[1]
                  ].join(" ");
                link._dirty = true;
            }
        }

        _updateLineLinks(links) {
            for (let link of links) {
                let sMk = link.source,
                    tMk = link.target;
                link.vertices[0].x = sMk.bounds.x;
                link.vertices[0].y = sMk.bounds.y;
                link.vertices[1].x = tMk.bounds.x;
                link.vertices[1].y = tMk.bounds.y;
                link._dirty = true;
            }
        }

    }

    function id(node) {
        return `${node.parent ? id(node.parent) + "." : ""}${node.data[MSCNodeID]}`;
    }

    var DEFAULT_EDGE_NAME = "\x00";
    var GRAPH_NODE = "\x00";
    var EDGE_KEY_DELIM = "\x01";

    // Implementation notes:
    //
    //  * Node id query functions should return string ids for the nodes
    //  * Edge id query functions should return an "edgeObj", edge object, that is
    //    composed of enough information to uniquely identify an edge: {v, w, name}.
    //  * Internally we use an "edgeId", a stringified form of the edgeObj, to
    //    reference edges. This is because we need a performant way to look these
    //    edges up and, object properties, which have string keys, are the closest
    //    we're going to get to a performant hashtable in JavaScript.

    let Graph$a = class Graph {
      _isDirected = true;
      _isMultigraph = false;
      _isCompound = false;

      // Label for the graph itself
      _label;

      // Defaults to be set when creating a new node
      _defaultNodeLabelFn = () => undefined;

      // Defaults to be set when creating a new edge
      _defaultEdgeLabelFn = () => undefined;

      // v -> label
      _nodes = {};

      // v -> edgeObj
      _in = {};

      // u -> v -> Number
      _preds = {};

      // v -> edgeObj
      _out = {};

      // v -> w -> Number
      _sucs = {};

      // e -> edgeObj
      _edgeObjs = {};

      // e -> label
      _edgeLabels = {};

      /* Number of nodes in the graph. Should only be changed by the implementation. */
      _nodeCount = 0;

      /* Number of edges in the graph. Should only be changed by the implementation. */
      _edgeCount = 0;

      _parent;

      _children;

      constructor(opts) {
        if (opts) {
          this._isDirected = Object.hasOwn(opts, "directed") ? opts.directed : true;
          this._isMultigraph = Object.hasOwn(opts, "multigraph") ? opts.multigraph : false;
          this._isCompound = Object.hasOwn(opts, "compound") ? opts.compound : false;
        }

        if (this._isCompound) {
          // v -> parent
          this._parent = {};

          // v -> children
          this._children = {};
          this._children[GRAPH_NODE] = {};
        }
      }

      /* === Graph functions ========= */

      /**
       * Whether graph was created with 'directed' flag set to true or not.
       */
      isDirected() {
        return this._isDirected;
      }

      /**
       * Whether graph was created with 'multigraph' flag set to true or not.
       */
      isMultigraph() {
        return this._isMultigraph;
      }

      /**
       * Whether graph was created with 'compound' flag set to true or not.
       */
      isCompound() {
        return this._isCompound;
      }

      /**
       * Sets the label of the graph.
       */
      setGraph(label) {
        this._label = label;
        return this;
      }

      /**
       * Gets the graph label.
       */
      graph() {
        return this._label;
      }


      /* === Node functions ========== */

      /**
       * Sets the default node label. If newDefault is a function, it will be
       * invoked ach time when setting a label for a node. Otherwise, this label
       * will be assigned as default label in case if no label was specified while
       * setting a node.
       * Complexity: O(1).
       */
      setDefaultNodeLabel(newDefault) {
        this._defaultNodeLabelFn = newDefault;
        if (typeof newDefault !== 'function') {
          this._defaultNodeLabelFn = () => newDefault;
        }

        return this;
      }

      /**
       * Gets the number of nodes in the graph.
       * Complexity: O(1).
       */
      nodeCount() {
        return this._nodeCount;
      }

      /**
       * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
       * not included in list.
       * Complexity: O(1).
       */
      nodes() {
        return Object.keys(this._nodes);
      }

      /**
       * Gets list of nodes without in-edges.
       * Complexity: O(|V|).
       */
      sources() {
        var self = this;
        return this.nodes().filter(v => Object.keys(self._in[v]).length === 0);
      }

      /**
       * Gets list of nodes without out-edges.
       * Complexity: O(|V|).
       */
      sinks() {
        var self = this;
        return this.nodes().filter(v => Object.keys(self._out[v]).length === 0);
      }

      /**
       * Invokes setNode method for each node in names list.
       * Complexity: O(|names|).
       */
      setNodes(vs, value) {
        var args = arguments;
        var self = this;
        vs.forEach(function(v) {
          if (args.length > 1) {
            self.setNode(v, value);
          } else {
            self.setNode(v);
          }
        });
        return this;
      }

      /**
       * Creates or updates the value for the node v in the graph. If label is supplied
       * it is set as the value for the node. If label is not supplied and the node was
       * created by this call then the default node label will be assigned.
       * Complexity: O(1).
       */
      setNode(v, value) {
        if (Object.hasOwn(this._nodes, v)) {
          if (arguments.length > 1) {
            this._nodes[v] = value;
          }
          return this;
        }

        this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
        if (this._isCompound) {
          this._parent[v] = GRAPH_NODE;
          this._children[v] = {};
          this._children[GRAPH_NODE][v] = true;
        }
        this._in[v] = {};
        this._preds[v] = {};
        this._out[v] = {};
        this._sucs[v] = {};
        ++this._nodeCount;
        return this;
      }

      /**
       * Gets the label of node with specified name.
       * Complexity: O(|V|).
       */
      node(v) {
        return this._nodes[v];
      }

      /**
       * Detects whether graph has a node with specified name or not.
       */
      hasNode(v) {
        return Object.hasOwn(this._nodes, v);
      }

      /**
       * Remove the node with the name from the graph or do nothing if the node is not in
       * the graph. If the node was removed this function also removes any incident
       * edges.
       * Complexity: O(1).
       */
      removeNode(v) {
        var self = this;
        if (Object.hasOwn(this._nodes, v)) {
          var removeEdge = e => self.removeEdge(self._edgeObjs[e]);
          delete this._nodes[v];
          if (this._isCompound) {
            this._removeFromParentsChildList(v);
            delete this._parent[v];
            this.children(v).forEach(function(child) {
              self.setParent(child);
            });
            delete this._children[v];
          }
          Object.keys(this._in[v]).forEach(removeEdge);
          delete this._in[v];
          delete this._preds[v];
          Object.keys(this._out[v]).forEach(removeEdge);
          delete this._out[v];
          delete this._sucs[v];
          --this._nodeCount;
        }
        return this;
      }

      /**
       * Sets node p as a parent for node v if it is defined, or removes the
       * parent for v if p is undefined. Method throws an exception in case of
       * invoking it in context of noncompound graph.
       * Average-case complexity: O(1).
       */
      setParent(v, parent) {
        if (!this._isCompound) {
          throw new Error("Cannot set parent in a non-compound graph");
        }

        if (parent === undefined) {
          parent = GRAPH_NODE;
        } else {
          // Coerce parent to string
          parent += "";
          for (var ancestor = parent; ancestor !== undefined; ancestor = this.parent(ancestor)) {
            if (ancestor === v) {
              throw new Error("Setting " + parent+ " as parent of " + v +
                  " would create a cycle");
            }
          }

          this.setNode(parent);
        }

        this.setNode(v);
        this._removeFromParentsChildList(v);
        this._parent[v] = parent;
        this._children[parent][v] = true;
        return this;
      }

      _removeFromParentsChildList(v) {
        delete this._children[this._parent[v]][v];
      }

      /**
       * Gets parent node for node v.
       * Complexity: O(1).
       */
      parent(v) {
        if (this._isCompound) {
          var parent = this._parent[v];
          if (parent !== GRAPH_NODE) {
            return parent;
          }
        }
      }

      /**
       * Gets list of direct children of node v.
       * Complexity: O(1).
       */
      children(v = GRAPH_NODE) {
        if (this._isCompound) {
          var children = this._children[v];
          if (children) {
            return Object.keys(children);
          }
        } else if (v === GRAPH_NODE) {
          return this.nodes();
        } else if (this.hasNode(v)) {
          return [];
        }
      }

      /**
       * Return all nodes that are predecessors of the specified node or undefined if node v is not in
       * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
       * Complexity: O(|V|).
       */
      predecessors(v) {
        var predsV = this._preds[v];
        if (predsV) {
          return Object.keys(predsV);
        }
      }

      /**
       * Return all nodes that are successors of the specified node or undefined if node v is not in
       * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
       * Complexity: O(|V|).
       */
      successors(v) {
        var sucsV = this._sucs[v];
        if (sucsV) {
          return Object.keys(sucsV);
        }
      }

      /**
       * Return all nodes that are predecessors or successors of the specified node or undefined if
       * node v is not in the graph.
       * Complexity: O(|V|).
       */
      neighbors(v) {
        var preds = this.predecessors(v);
        if (preds) {
          const union = new Set(preds);
          for (var succ of this.successors(v)) {
            union.add(succ);
          }

          return Array.from(union.values());
        }
      }

      isLeaf(v) {
        var neighbors;
        if (this.isDirected()) {
          neighbors = this.successors(v);
        } else {
          neighbors = this.neighbors(v);
        }
        return neighbors.length === 0;
      }

      /**
       * Creates new graph with nodes filtered via filter. Edges incident to rejected node
       * are also removed. In case of compound graph, if parent is rejected by filter,
       * than all its children are rejected too.
       * Average-case complexity: O(|E|+|V|).
       */
      filterNodes(filter) {
        var copy = new this.constructor({
          directed: this._isDirected,
          multigraph: this._isMultigraph,
          compound: this._isCompound
        });

        copy.setGraph(this.graph());

        var self = this;
        Object.entries(this._nodes).forEach(function([v, value]) {
          if (filter(v)) {
            copy.setNode(v, value);
          }
        });

        Object.values(this._edgeObjs).forEach(function(e) {
          if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
            copy.setEdge(e, self.edge(e));
          }
        });

        var parents = {};
        function findParent(v) {
          var parent = self.parent(v);
          if (parent === undefined || copy.hasNode(parent)) {
            parents[v] = parent;
            return parent;
          } else if (parent in parents) {
            return parents[parent];
          } else {
            return findParent(parent);
          }
        }

        if (this._isCompound) {
          copy.nodes().forEach(v => copy.setParent(v, findParent(v)));
        }

        return copy;
      }

      /* === Edge functions ========== */

      /**
       * Sets the default edge label or factory function. This label will be
       * assigned as default label in case if no label was specified while setting
       * an edge or this function will be invoked each time when setting an edge
       * with no label specified and returned value * will be used as a label for edge.
       * Complexity: O(1).
       */
      setDefaultEdgeLabel(newDefault) {
        this._defaultEdgeLabelFn = newDefault;
        if (typeof newDefault !== 'function') {
          this._defaultEdgeLabelFn = () => newDefault;
        }

        return this;
      }

      /**
       * Gets the number of edges in the graph.
       * Complexity: O(1).
       */
      edgeCount() {
        return this._edgeCount;
      }

      /**
       * Gets edges of the graph. In case of compound graph subgraphs are not considered.
       * Complexity: O(|E|).
       */
      edges() {
        return Object.values(this._edgeObjs);
      }

      /**
       * Establish an edges path over the nodes in nodes list. If some edge is already
       * exists, it will update its label, otherwise it will create an edge between pair
       * of nodes with label provided or default label if no label provided.
       * Complexity: O(|nodes|).
       */
      setPath(vs, value) {
        var self = this;
        var args = arguments;
        vs.reduce(function(v, w) {
          if (args.length > 1) {
            self.setEdge(v, w, value);
          } else {
            self.setEdge(v, w);
          }
          return w;
        });
        return this;
      }

      /**
       * Creates or updates the label for the edge (v, w) with the optionally supplied
       * name. If label is supplied it is set as the value for the edge. If label is not
       * supplied and the edge was created by this call then the default edge label will
       * be assigned. The name parameter is only useful with multigraphs.
       */
      setEdge() {
        var v, w, name, value;
        var valueSpecified = false;
        var arg0 = arguments[0];

        if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
          v = arg0.v;
          w = arg0.w;
          name = arg0.name;
          if (arguments.length === 2) {
            value = arguments[1];
            valueSpecified = true;
          }
        } else {
          v = arg0;
          w = arguments[1];
          name = arguments[3];
          if (arguments.length > 2) {
            value = arguments[2];
            valueSpecified = true;
          }
        }

        v = "" + v;
        w = "" + w;
        if (name !== undefined) {
          name = "" + name;
        }

        var e = edgeArgsToId(this._isDirected, v, w, name);
        if (Object.hasOwn(this._edgeLabels, e)) {
          if (valueSpecified) {
            this._edgeLabels[e] = value;
          }
          return this;
        }

        if (name !== undefined && !this._isMultigraph) {
          throw new Error("Cannot set a named edge when isMultigraph = false");
        }

        // It didn't exist, so we need to create it.
        // First ensure the nodes exist.
        this.setNode(v);
        this.setNode(w);

        this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

        var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
        // Ensure we add undirected edges in a consistent way.
        v = edgeObj.v;
        w = edgeObj.w;

        Object.freeze(edgeObj);
        this._edgeObjs[e] = edgeObj;
        incrementOrInitEntry(this._preds[w], v);
        incrementOrInitEntry(this._sucs[v], w);
        this._in[w][e] = edgeObj;
        this._out[v][e] = edgeObj;
        this._edgeCount++;
        return this;
      }

      /**
       * Gets the label for the specified edge.
       * Complexity: O(1).
       */
      edge(v, w, name) {
        var e = (arguments.length === 1
          ? edgeObjToId(this._isDirected, arguments[0])
          : edgeArgsToId(this._isDirected, v, w, name));
        return this._edgeLabels[e];
      }

      /**
       * Gets the label for the specified edge and converts it to an object.
       * Complexity: O(1)
       */
      edgeAsObj() {
        const edge = this.edge(...arguments);
        if (typeof edge !== "object") {
          return {label: edge};
        }

        return edge;
      }

      /**
       * Detects whether the graph contains specified edge or not. No subgraphs are considered.
       * Complexity: O(1).
       */
      hasEdge(v, w, name) {
        var e = (arguments.length === 1
          ? edgeObjToId(this._isDirected, arguments[0])
          : edgeArgsToId(this._isDirected, v, w, name));
        return Object.hasOwn(this._edgeLabels, e);
      }

      /**
       * Removes the specified edge from the graph. No subgraphs are considered.
       * Complexity: O(1).
       */
      removeEdge(v, w, name) {
        var e = (arguments.length === 1
          ? edgeObjToId(this._isDirected, arguments[0])
          : edgeArgsToId(this._isDirected, v, w, name));
        var edge = this._edgeObjs[e];
        if (edge) {
          v = edge.v;
          w = edge.w;
          delete this._edgeLabels[e];
          delete this._edgeObjs[e];
          decrementOrRemoveEntry(this._preds[w], v);
          decrementOrRemoveEntry(this._sucs[v], w);
          delete this._in[w][e];
          delete this._out[v][e];
          this._edgeCount--;
        }
        return this;
      }

      /**
       * Return all edges that point to the node v. Optionally filters those edges down to just those
       * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
       * Complexity: O(|E|).
       */
      inEdges(v, u) {
        var inV = this._in[v];
        if (inV) {
          var edges = Object.values(inV);
          if (!u) {
            return edges;
          }
          return edges.filter(edge => edge.v === u);
        }
      }

      /**
       * Return all edges that are pointed at by node v. Optionally filters those edges down to just
       * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
       * Complexity: O(|E|).
       */
      outEdges(v, w) {
        var outV = this._out[v];
        if (outV) {
          var edges = Object.values(outV);
          if (!w) {
            return edges;
          }
          return edges.filter(edge => edge.w === w);
        }
      }

      /**
       * Returns all edges to or from node v regardless of direction. Optionally filters those edges
       * down to just those between nodes v and w regardless of direction.
       * Complexity: O(|E|).
       */
      nodeEdges(v, w) {
        var inEdges = this.inEdges(v, w);
        if (inEdges) {
          return inEdges.concat(this.outEdges(v, w));
        }
      }
    };

    function incrementOrInitEntry(map, k) {
      if (map[k]) {
        map[k]++;
      } else {
        map[k] = 1;
      }
    }

    function decrementOrRemoveEntry(map, k) {
      if (!--map[k]) { delete map[k]; }
    }

    function edgeArgsToId(isDirected, v_, w_, name) {
      var v = "" + v_;
      var w = "" + w_;
      if (!isDirected && v > w) {
        var tmp = v;
        v = w;
        w = tmp;
      }
      return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
                 (name === undefined ? DEFAULT_EDGE_NAME : name);
    }

    function edgeArgsToObj(isDirected, v_, w_, name) {
      var v = "" + v_;
      var w = "" + w_;
      if (!isDirected && v > w) {
        var tmp = v;
        v = w;
        w = tmp;
      }
      var edgeObj =  { v: v, w: w };
      if (name) {
        edgeObj.name = name;
      }
      return edgeObj;
    }

    function edgeObjToId(isDirected, edgeObj) {
      return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
    }

    var graph = Graph$a;

    var version$1 = '2.2.4';

    // Includes only the "core" of graphlib
    var lib$1 = {
      Graph: graph,
      version: version$1
    };

    var Graph$9 = graph;

    var json = {
      write: write,
      read: read
    };

    /**
     * Creates a JSON representation of the graph that can be serialized to a string with
     * JSON.stringify. The graph can later be restored using json.read.
     */
    function write(g) {
      var json = {
        options: {
          directed: g.isDirected(),
          multigraph: g.isMultigraph(),
          compound: g.isCompound()
        },
        nodes: writeNodes(g),
        edges: writeEdges(g)
      };

      if (g.graph() !== undefined) {
        json.value = structuredClone(g.graph());
      }
      return json;
    }

    function writeNodes(g) {
      return g.nodes().map(function(v) {
        var nodeValue = g.node(v);
        var parent = g.parent(v);
        var node = { v: v };
        if (nodeValue !== undefined) {
          node.value = nodeValue;
        }
        if (parent !== undefined) {
          node.parent = parent;
        }
        return node;
      });
    }

    function writeEdges(g) {
      return g.edges().map(function(e) {
        var edgeValue = g.edge(e);
        var edge = { v: e.v, w: e.w };
        if (e.name !== undefined) {
          edge.name = e.name;
        }
        if (edgeValue !== undefined) {
          edge.value = edgeValue;
        }
        return edge;
      });
    }

    /**
     * Takes JSON as input and returns the graph representation.
     *
     * @example
     * var g2 = graphlib.json.read(JSON.parse(str));
     * g2.nodes();
     * // ['a', 'b']
     * g2.edges()
     * // [ { v: 'a', w: 'b' } ]
     */
    function read(json) {
      var g = new Graph$9(json.options).setGraph(json.value);
      json.nodes.forEach(function(entry) {
        g.setNode(entry.v, entry.value);
        if (entry.parent) {
          g.setParent(entry.v, entry.parent);
        }
      });
      json.edges.forEach(function(entry) {
        g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
      });
      return g;
    }

    var components_1 = components;

    function components(g) {
      var visited = {};
      var cmpts = [];
      var cmpt;

      function dfs(v) {
        if (Object.hasOwn(visited, v)) return;
        visited[v] = true;
        cmpt.push(v);
        g.successors(v).forEach(dfs);
        g.predecessors(v).forEach(dfs);
      }

      g.nodes().forEach(function(v) {
        cmpt = [];
        dfs(v);
        if (cmpt.length) {
          cmpts.push(cmpt);
        }
      });

      return cmpts;
    }

    /**
     * A min-priority queue data structure. This algorithm is derived from Cormen,
     * et al., "Introduction to Algorithms". The basic idea of a min-priority
     * queue is that you can efficiently (in O(1) time) get the smallest key in
     * the queue. Adding and removing elements takes O(log n) time. A key can
     * have its priority decreased in O(log n) time.
     */

    let PriorityQueue$2 = class PriorityQueue {
      _arr = [];
      _keyIndices = {};

      /**
       * Returns the number of elements in the queue. Takes `O(1)` time.
       */
      size() {
        return this._arr.length;
      }

      /**
       * Returns the keys that are in the queue. Takes `O(n)` time.
       */
      keys() {
        return this._arr.map(function(x) { return x.key; });
      }

      /**
       * Returns `true` if **key** is in the queue and `false` if not.
       */
      has(key) {
        return Object.hasOwn(this._keyIndices, key);
      }

      /**
       * Returns the priority for **key**. If **key** is not present in the queue
       * then this function returns `undefined`. Takes `O(1)` time.
       *
       * @param {Object} key
       */
      priority(key) {
        var index = this._keyIndices[key];
        if (index !== undefined) {
          return this._arr[index].priority;
        }
      }

      /**
       * Returns the key for the minimum element in this queue. If the queue is
       * empty this function throws an Error. Takes `O(1)` time.
       */
      min() {
        if (this.size() === 0) {
          throw new Error("Queue underflow");
        }
        return this._arr[0].key;
      }

      /**
       * Inserts a new key into the priority queue. If the key already exists in
       * the queue this function returns `false`; otherwise it will return `true`.
       * Takes `O(n)` time.
       *
       * @param {Object} key the key to add
       * @param {Number} priority the initial priority for the key
       */
      add(key, priority) {
        var keyIndices = this._keyIndices;
        key = String(key);
        if (!Object.hasOwn(keyIndices, key)) {
          var arr = this._arr;
          var index = arr.length;
          keyIndices[key] = index;
          arr.push({key: key, priority: priority});
          this._decrease(index);
          return true;
        }
        return false;
      }

      /**
       * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
       */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var min = this._arr.pop();
        delete this._keyIndices[min.key];
        this._heapify(0);
        return min.key;
      }

      /**
       * Decreases the priority for **key** to **priority**. If the new priority is
       * greater than the previous priority, this function will throw an Error.
       *
       * @param {Object} key the key for which to raise priority
       * @param {Number} priority the new priority for the key
       */
      decrease(key, priority) {
        var index = this._keyIndices[key];
        if (priority > this._arr[index].priority) {
          throw new Error("New priority is greater than current priority. " +
              "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
        }
        this._arr[index].priority = priority;
        this._decrease(index);
      }

      _heapify(i) {
        var arr = this._arr;
        var l = 2 * i;
        var r = l + 1;
        var largest = i;
        if (l < arr.length) {
          largest = arr[l].priority < arr[largest].priority ? l : largest;
          if (r < arr.length) {
            largest = arr[r].priority < arr[largest].priority ? r : largest;
          }
          if (largest !== i) {
            this._swap(i, largest);
            this._heapify(largest);
          }
        }
      }

      _decrease(index) {
        var arr = this._arr;
        var priority = arr[index].priority;
        var parent;
        while (index !== 0) {
          parent = index >> 1;
          if (arr[parent].priority < priority) {
            break;
          }
          this._swap(index, parent);
          index = parent;
        }
      }

      _swap(i, j) {
        var arr = this._arr;
        var keyIndices = this._keyIndices;
        var origArrI = arr[i];
        var origArrJ = arr[j];
        arr[i] = origArrJ;
        arr[j] = origArrI;
        keyIndices[origArrJ.key] = i;
        keyIndices[origArrI.key] = j;
      }
    };

    var priorityQueue = PriorityQueue$2;

    var PriorityQueue$1 = priorityQueue;

    var dijkstra_1 = dijkstra$1;

    var DEFAULT_WEIGHT_FUNC$1 = () => 1;

    function dijkstra$1(g, source, weightFn, edgeFn) {
      return runDijkstra(g, String(source),
        weightFn || DEFAULT_WEIGHT_FUNC$1,
        edgeFn || function(v) { return g.outEdges(v); });
    }

    function runDijkstra(g, source, weightFn, edgeFn) {
      var results = {};
      var pq = new PriorityQueue$1();
      var v, vEntry;

      var updateNeighbors = function(edge) {
        var w = edge.v !== v ? edge.v : edge.w;
        var wEntry = results[w];
        var weight = weightFn(edge);
        var distance = vEntry.distance + weight;

        if (weight < 0) {
          throw new Error("dijkstra does not allow negative edge weights. " +
                          "Bad edge: " + edge + " Weight: " + weight);
        }

        if (distance < wEntry.distance) {
          wEntry.distance = distance;
          wEntry.predecessor = v;
          pq.decrease(w, distance);
        }
      };

      g.nodes().forEach(function(v) {
        var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
        results[v] = { distance: distance };
        pq.add(v, distance);
      });

      while (pq.size() > 0) {
        v = pq.removeMin();
        vEntry = results[v];
        if (vEntry.distance === Number.POSITIVE_INFINITY) {
          break;
        }

        edgeFn(v).forEach(updateNeighbors);
      }

      return results;
    }

    var dijkstra = dijkstra_1;

    var dijkstraAll_1 = dijkstraAll;

    function dijkstraAll(g, weightFunc, edgeFunc) {
      return g.nodes().reduce(function(acc, v) {
        acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
        return acc;
      }, {});
    }

    var tarjan_1 = tarjan$1;

    function tarjan$1(g) {
      var index = 0;
      var stack = [];
      var visited = {}; // node id -> { onStack, lowlink, index }
      var results = [];

      function dfs(v) {
        var entry = visited[v] = {
          onStack: true,
          lowlink: index,
          index: index++
        };
        stack.push(v);

        g.successors(v).forEach(function(w) {
          if (!Object.hasOwn(visited, w)) {
            dfs(w);
            entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
          } else if (visited[w].onStack) {
            entry.lowlink = Math.min(entry.lowlink, visited[w].index);
          }
        });

        if (entry.lowlink === entry.index) {
          var cmpt = [];
          var w;
          do {
            w = stack.pop();
            visited[w].onStack = false;
            cmpt.push(w);
          } while (v !== w);
          results.push(cmpt);
        }
      }

      g.nodes().forEach(function(v) {
        if (!Object.hasOwn(visited, v)) {
          dfs(v);
        }
      });

      return results;
    }

    var tarjan = tarjan_1;

    var findCycles_1 = findCycles;

    function findCycles(g) {
      return tarjan(g).filter(function(cmpt) {
        return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
      });
    }

    var floydWarshall_1 = floydWarshall;

    var DEFAULT_WEIGHT_FUNC = () => 1;

    function floydWarshall(g, weightFn, edgeFn) {
      return runFloydWarshall(g,
        weightFn || DEFAULT_WEIGHT_FUNC,
        edgeFn || function(v) { return g.outEdges(v); });
    }

    function runFloydWarshall(g, weightFn, edgeFn) {
      var results = {};
      var nodes = g.nodes();

      nodes.forEach(function(v) {
        results[v] = {};
        results[v][v] = { distance: 0 };
        nodes.forEach(function(w) {
          if (v !== w) {
            results[v][w] = { distance: Number.POSITIVE_INFINITY };
          }
        });
        edgeFn(v).forEach(function(edge) {
          var w = edge.v === v ? edge.w : edge.v;
          var d = weightFn(edge);
          results[v][w] = { distance: d, predecessor: v };
        });
      });

      nodes.forEach(function(k) {
        var rowK = results[k];
        nodes.forEach(function(i) {
          var rowI = results[i];
          nodes.forEach(function(j) {
            var ik = rowI[k];
            var kj = rowK[j];
            var ij = rowI[j];
            var altDistance = ik.distance + kj.distance;
            if (altDistance < ij.distance) {
              ij.distance = altDistance;
              ij.predecessor = kj.predecessor;
            }
          });
        });
      });

      return results;
    }

    function topsort$1(g) {
      var visited = {};
      var stack = {};
      var results = [];

      function visit(node) {
        if (Object.hasOwn(stack, node)) {
          throw new CycleException();
        }

        if (!Object.hasOwn(visited, node)) {
          stack[node] = true;
          visited[node] = true;
          g.predecessors(node).forEach(visit);
          delete stack[node];
          results.push(node);
        }
      }

      g.sinks().forEach(visit);

      if (Object.keys(visited).length !== g.nodeCount()) {
        throw new CycleException();
      }

      return results;
    }

    class CycleException extends Error {
      constructor() {
        super(...arguments);
      }
    }

    var topsort_1 = topsort$1;
    topsort$1.CycleException = CycleException;

    var topsort = topsort_1;

    var isAcyclic_1 = isAcyclic;

    function isAcyclic(g) {
      try {
        topsort(g);
      } catch (e) {
        if (e instanceof topsort.CycleException) {
          return false;
        }
        throw e;
      }
      return true;
    }

    var dfs_1 = dfs$3;

    /*
     * A helper that preforms a pre- or post-order traversal on the input graph
     * and returns the nodes in the order they were visited. If the graph is
     * undirected then this algorithm will navigate using neighbors. If the graph
     * is directed then this algorithm will navigate using successors.
     *
     * If the order is not "post", it will be treated as "pre".
     */
    function dfs$3(g, vs, order) {
      if (!Array.isArray(vs)) {
        vs = [vs];
      }

      var navigation = g.isDirected() ? v => g.successors(v) : v => g.neighbors(v);
      var orderFunc = order === "post" ? postOrderDfs : preOrderDfs;

      var acc = [];
      var visited = {};
      vs.forEach(v => {
        if (!g.hasNode(v)) {
          throw new Error("Graph does not have node: " + v);
        }

        orderFunc(v, navigation, visited, acc);
      });

      return acc;
    }

    function postOrderDfs(v, navigation, visited, acc) {
      var stack = [[v, false]];
      while (stack.length > 0) {
        var curr = stack.pop();
        if (curr[1]) {
          acc.push(curr[0]);
        } else {
          if (!Object.hasOwn(visited, curr[0])) {
            visited[curr[0]] = true;
            stack.push([curr[0], true]);
            forEachRight(navigation(curr[0]), w => stack.push([w, false]));
          }
        }
      }
    }

    function preOrderDfs(v, navigation, visited, acc) {
      var stack = [v];
      while (stack.length > 0) {
        var curr = stack.pop();
        if (!Object.hasOwn(visited, curr)) {
          visited[curr] = true;
          acc.push(curr);
          forEachRight(navigation(curr), w => stack.push(w));
        }
      }
    }

    function forEachRight(array, iteratee) {
      var length = array.length;
      while (length--) {
        iteratee(array[length], length, array);
      }

      return array;
    }

    var dfs$2 = dfs_1;

    var postorder_1 = postorder$2;

    function postorder$2(g, vs) {
      return dfs$2(g, vs, "post");
    }

    var dfs$1 = dfs_1;

    var preorder_1 = preorder$1;

    function preorder$1(g, vs) {
      return dfs$1(g, vs, "pre");
    }

    var Graph$8 = graph;
    var PriorityQueue = priorityQueue;

    var prim_1 = prim;

    function prim(g, weightFunc) {
      var result = new Graph$8();
      var parents = {};
      var pq = new PriorityQueue();
      var v;

      function updateNeighbors(edge) {
        var w = edge.v === v ? edge.w : edge.v;
        var pri = pq.priority(w);
        if (pri !== undefined) {
          var edgeWeight = weightFunc(edge);
          if (edgeWeight < pri) {
            parents[w] = v;
            pq.decrease(w, edgeWeight);
          }
        }
      }

      if (g.nodeCount() === 0) {
        return result;
      }

      g.nodes().forEach(function(v) {
        pq.add(v, Number.POSITIVE_INFINITY);
        result.setNode(v);
      });

      // Start from an arbitrary node
      pq.decrease(g.nodes()[0], 0);

      var init = false;
      while (pq.size() > 0) {
        v = pq.removeMin();
        if (Object.hasOwn(parents, v)) {
          result.setEdge(v, parents[v]);
        } else if (init) {
          throw new Error("Input graph is not connected: " + g);
        } else {
          init = true;
        }

        g.nodeEdges(v).forEach(updateNeighbors);
      }

      return result;
    }

    var alg = {
      components: components_1,
      dijkstra: dijkstra_1,
      dijkstraAll: dijkstraAll_1,
      findCycles: findCycles_1,
      floydWarshall: floydWarshall_1,
      isAcyclic: isAcyclic_1,
      postorder: postorder_1,
      preorder: preorder_1,
      prim: prim_1,
      tarjan: tarjan_1,
      topsort: topsort_1
    };

    /**
     * Copyright (c) 2014, Chris Pettitt
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     * list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     * this list of conditions and the following disclaimer in the documentation
     * and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its contributors
     * may be used to endorse or promote products derived from this software without
     * specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
     * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
     * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
     * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
     * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
     * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
     * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    var lib = lib$1;

    var graphlib = {
      Graph: lib.Graph,
      json: json,
      alg: alg,
      version: lib.version
    };

    /*
     * Simple doubly linked list implementation derived from Cormen, et al.,
     * "Introduction to Algorithms".
     */

    let List$1 = class List {
      constructor() {
        let sentinel = {};
        sentinel._next = sentinel._prev = sentinel;
        this._sentinel = sentinel;
      }

      dequeue() {
        let sentinel = this._sentinel;
        let entry = sentinel._prev;
        if (entry !== sentinel) {
          unlink(entry);
          return entry;
        }
      }

      enqueue(entry) {
        let sentinel = this._sentinel;
        if (entry._prev && entry._next) {
          unlink(entry);
        }
        entry._next = sentinel._next;
        sentinel._next._prev = entry;
        sentinel._next = entry;
        entry._prev = sentinel;
      }

      toString() {
        let strs = [];
        let sentinel = this._sentinel;
        let curr = sentinel._prev;
        while (curr !== sentinel) {
          strs.push(JSON.stringify(curr, filterOutLinks));
          curr = curr._prev;
        }
        return "[" + strs.join(", ") + "]";
      }
    };

    function unlink(entry) {
      entry._prev._next = entry._next;
      entry._next._prev = entry._prev;
      delete entry._next;
      delete entry._prev;
    }

    function filterOutLinks(k, v) {
      if (k !== "_next" && k !== "_prev") {
        return v;
      }
    }

    var list = List$1;

    let Graph$7 = graphlib.Graph;
    let List = list;

    /*
     * A greedy heuristic for finding a feedback arc set for a graph. A feedback
     * arc set is a set of edges that can be removed to make a graph acyclic.
     * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
     * effective heuristic for the feedback arc set problem." This implementation
     * adjusts that from the paper to allow for weighted edges.
     */
    var greedyFas = greedyFAS$1;

    let DEFAULT_WEIGHT_FN = () => 1;

    function greedyFAS$1(g, weightFn) {
      if (g.nodeCount() <= 1) {
        return [];
      }
      let state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
      let results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

      // Expand multi-edges
      return results.flatMap(e => g.outEdges(e.v, e.w));
    }

    function doGreedyFAS(g, buckets, zeroIdx) {
      let results = [];
      let sources = buckets[buckets.length - 1];
      let sinks = buckets[0];

      let entry;
      while (g.nodeCount()) {
        while ((entry = sinks.dequeue()))   { removeNode(g, buckets, zeroIdx, entry); }
        while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
        if (g.nodeCount()) {
          for (let i = buckets.length - 2; i > 0; --i) {
            entry = buckets[i].dequeue();
            if (entry) {
              results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
              break;
            }
          }
        }
      }

      return results;
    }

    function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
      let results = collectPredecessors ? [] : undefined;

      g.inEdges(entry.v).forEach(edge => {
        let weight = g.edge(edge);
        let uEntry = g.node(edge.v);

        if (collectPredecessors) {
          results.push({ v: edge.v, w: edge.w });
        }

        uEntry.out -= weight;
        assignBucket(buckets, zeroIdx, uEntry);
      });

      g.outEdges(entry.v).forEach(edge => {
        let weight = g.edge(edge);
        let w = edge.w;
        let wEntry = g.node(w);
        wEntry["in"] -= weight;
        assignBucket(buckets, zeroIdx, wEntry);
      });

      g.removeNode(entry.v);

      return results;
    }

    function buildState(g, weightFn) {
      let fasGraph = new Graph$7();
      let maxIn = 0;
      let maxOut = 0;

      g.nodes().forEach(v => {
        fasGraph.setNode(v, { v: v, "in": 0, out: 0 });
      });

      // Aggregate weights on nodes, but also sum the weights across multi-edges
      // into a single edge for the fasGraph.
      g.edges().forEach(e => {
        let prevWeight = fasGraph.edge(e.v, e.w) || 0;
        let weight = weightFn(e);
        let edgeWeight = prevWeight + weight;
        fasGraph.setEdge(e.v, e.w, edgeWeight);
        maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
        maxIn  = Math.max(maxIn,  fasGraph.node(e.w)["in"]  += weight);
      });

      let buckets = range$1(maxOut + maxIn + 3).map(() => new List());
      let zeroIdx = maxIn + 1;

      fasGraph.nodes().forEach(v => {
        assignBucket(buckets, zeroIdx, fasGraph.node(v));
      });

      return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx };
    }

    function assignBucket(buckets, zeroIdx, entry) {
      if (!entry.out) {
        buckets[0].enqueue(entry);
      } else if (!entry["in"]) {
        buckets[buckets.length - 1].enqueue(entry);
      } else {
        buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry);
      }
    }

    function range$1(limit) {
      const range = [];
      for (let i = 0; i < limit; i++) {
        range.push(i);
      }

      return range;
    }

    /* eslint "no-console": off */

    let Graph$6 = graphlib.Graph;

    var util$d = {
      addBorderNode: addBorderNode$1,
      addDummyNode,
      applyWithChunking: applyWithChunking$1,
      asNonCompoundGraph,
      buildLayerMatrix,
      intersectRect,
      mapValues,
      maxRank,
      normalizeRanks: normalizeRanks$1,
      notime,
      partition,
      pick,
      predecessorWeights,
      range,
      removeEmptyRanks: removeEmptyRanks$1,
      simplify: simplify$1,
      successorWeights,
      time,
      uniqueId: uniqueId$1,
      zipObject: zipObject$1,
    };

    /*
     * Adds a dummy node to the graph and return v.
     */
    function addDummyNode(g, type, attrs, name) {
      var v = name;
      while (g.hasNode(v)) {
        v = uniqueId$1(name);
      }

      attrs.dummy = type;
      g.setNode(v, attrs);
      return v;
    }

    /*
     * Returns a new graph with only simple edges. Handles aggregation of data
     * associated with multi-edges.
     */
    function simplify$1(g) {
      let simplified = new Graph$6().setGraph(g.graph());
      g.nodes().forEach(v => simplified.setNode(v, g.node(v)));
      g.edges().forEach(e => {
        let simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
        let label = g.edge(e);
        simplified.setEdge(e.v, e.w, {
          weight: simpleLabel.weight + label.weight,
          minlen: Math.max(simpleLabel.minlen, label.minlen)
        });
      });
      return simplified;
    }

    function asNonCompoundGraph(g) {
      let simplified = new Graph$6({ multigraph: g.isMultigraph() }).setGraph(g.graph());
      g.nodes().forEach(v => {
        if (!g.children(v).length) {
          simplified.setNode(v, g.node(v));
        }
      });
      g.edges().forEach(e => {
        simplified.setEdge(e, g.edge(e));
      });
      return simplified;
    }

    function successorWeights(g) {
      let weightMap = g.nodes().map(v => {
        let sucs = {};
        g.outEdges(v).forEach(e => {
          sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
        });
        return sucs;
      });
      return zipObject$1(g.nodes(), weightMap);
    }

    function predecessorWeights(g) {
      let weightMap = g.nodes().map(v => {
        let preds = {};
        g.inEdges(v).forEach(e => {
          preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
        });
        return preds;
      });
      return zipObject$1(g.nodes(), weightMap);
    }

    /*
     * Finds where a line starting at point ({x, y}) would intersect a rectangle
     * ({x, y, width, height}) if it were pointing at the rectangle's center.
     */
    function intersectRect(rect, point) {
      let x = rect.x;
      let y = rect.y;

      // Rectangle intersection algorithm from:
      // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
      let dx = point.x - x;
      let dy = point.y - y;
      let w = rect.width / 2;
      let h = rect.height / 2;

      if (!dx && !dy) {
        throw new Error("Not possible to find intersection inside of the rectangle");
      }

      let sx, sy;
      if (Math.abs(dy) * w > Math.abs(dx) * h) {
        // Intersection is top or bottom of rect.
        if (dy < 0) {
          h = -h;
        }
        sx = h * dx / dy;
        sy = h;
      } else {
        // Intersection is left or right of rect.
        if (dx < 0) {
          w = -w;
        }
        sx = w;
        sy = w * dy / dx;
      }

      return { x: x + sx, y: y + sy };
    }

    /*
     * Given a DAG with each node assigned "rank" and "order" properties, this
     * function will produce a matrix with the ids of each node.
     */
    function buildLayerMatrix(g) {
      let layering = range(maxRank(g) + 1).map(() => []);
      g.nodes().forEach(v => {
        let node = g.node(v);
        let rank = node.rank;
        if (rank !== undefined) {
          layering[rank][node.order] = v;
        }
      });
      return layering;
    }

    /*
     * Adjusts the ranks for all nodes in the graph such that all nodes v have
     * rank(v) >= 0 and at least one node w has rank(w) = 0.
     */
    function normalizeRanks$1(g) {
      let nodeRanks = g.nodes().map(v => {
        let rank = g.node(v).rank;
        if (rank === undefined) {
          return Number.MAX_VALUE;
        }

        return rank;
      });
      let min = applyWithChunking$1(Math.min, nodeRanks);
      g.nodes().forEach(v => {
        let node = g.node(v);
        if (Object.hasOwn(node, "rank")) {
          node.rank -= min;
        }
      });
    }

    function removeEmptyRanks$1(g) {
      // Ranks may not start at 0, so we need to offset them
      let nodeRanks = g.nodes().map(v => g.node(v).rank);
      let offset = applyWithChunking$1(Math.min, nodeRanks);

      let layers = [];
      g.nodes().forEach(v => {
        let rank = g.node(v).rank - offset;
        if (!layers[rank]) {
          layers[rank] = [];
        }
        layers[rank].push(v);
      });

      let delta = 0;
      let nodeRankFactor = g.graph().nodeRankFactor;
      Array.from(layers).forEach((vs, i) => {
        if (vs === undefined && i % nodeRankFactor !== 0) {
          --delta;
        } else if (vs !== undefined && delta) {
          vs.forEach(v => g.node(v).rank += delta);
        }
      });
    }

    function addBorderNode$1(g, prefix, rank, order) {
      let node = {
        width: 0,
        height: 0
      };
      if (arguments.length >= 4) {
        node.rank = rank;
        node.order = order;
      }
      return addDummyNode(g, "border", node, prefix);
    }

    function splitToChunks(array, chunkSize = CHUNKING_THRESHOLD) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      return chunks;
    }

    const CHUNKING_THRESHOLD = 65535;

    function applyWithChunking$1(fn, argsArray) {
      if(argsArray.length > CHUNKING_THRESHOLD) {
        const chunks = splitToChunks(argsArray);
        return fn.apply(null, chunks.map(chunk => fn.apply(null, chunk)));
      } else {
        return fn.apply(null, argsArray);
      }
    }

    function maxRank(g) {
      const nodes = g.nodes();
      const nodeRanks = nodes.map(v => {
        let rank = g.node(v).rank;
        if (rank === undefined) {
          return Number.MIN_VALUE;
        }
        return rank;
      });

      return applyWithChunking$1(Math.max, nodeRanks);
    }

    /*
     * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
     * function returns true for an entry it goes into `lhs`. Otherwise it goes
     * into `rhs.
     */
    function partition(collection, fn) {
      let result = { lhs: [], rhs: [] };
      collection.forEach(value => {
        if (fn(value)) {
          result.lhs.push(value);
        } else {
          result.rhs.push(value);
        }
      });
      return result;
    }

    /*
     * Returns a new function that wraps `fn` with a timer. The wrapper logs the
     * time it takes to execute the function.
     */
    function time(name, fn) {
      let start = Date.now();
      try {
        return fn();
      } finally {
        console.log(name + " time: " + (Date.now() - start) + "ms");
      }
    }

    function notime(name, fn) {
      return fn();
    }

    let idCounter = 0;
    function uniqueId$1(prefix) {
      var id = ++idCounter;
      return prefix + ("" + id);
    }

    function range(start, limit, step = 1) {
      if (limit == null) {
        limit = start;
        start = 0;
      }

      let endCon = (i) => i < limit;
      if (step < 0) {
        endCon = (i) => limit < i;
      }

      const range = [];
      for (let i = start; endCon(i); i += step) {
        range.push(i);
      }

      return range;
    }

    function pick(source, keys) {
      const dest = {};
      for (const key of keys) {
        if (source[key] !== undefined) {
          dest[key] = source[key];
        }
      }

      return dest;
    }

    function mapValues(obj, funcOrProp) {
      let func = funcOrProp;
      if (typeof funcOrProp === 'string') {
        func = (val) => val[funcOrProp];
      }

      return Object.entries(obj).reduce((acc, [k, v]) => {
        acc[k] = func(v, k);
        return acc;
      }, {});
    }

    function zipObject$1(props, values) {
      return props.reduce((acc, key, i) => {
        acc[key] = values[i];
        return acc;
      }, {});
    }

    let greedyFAS = greedyFas;
    let uniqueId = util$d.uniqueId;

    var acyclic$1 = {
      run: run$2,
      undo: undo$2
    };

    function run$2(g) {
      let fas = (g.graph().acyclicer === "greedy"
        ? greedyFAS(g, weightFn(g))
        : dfsFAS(g));
      fas.forEach(e => {
        let label = g.edge(e);
        g.removeEdge(e);
        label.forwardName = e.name;
        label.reversed = true;
        g.setEdge(e.w, e.v, label, uniqueId("rev"));
      });

      function weightFn(g) {
        return e => {
          return g.edge(e).weight;
        };
      }
    }

    function dfsFAS(g) {
      let fas = [];
      let stack = {};
      let visited = {};

      function dfs(v) {
        if (Object.hasOwn(visited, v)) {
          return;
        }
        visited[v] = true;
        stack[v] = true;
        g.outEdges(v).forEach(e => {
          if (Object.hasOwn(stack, e.w)) {
            fas.push(e);
          } else {
            dfs(e.w);
          }
        });
        delete stack[v];
      }

      g.nodes().forEach(dfs);
      return fas;
    }

    function undo$2(g) {
      g.edges().forEach(e => {
        let label = g.edge(e);
        if (label.reversed) {
          g.removeEdge(e);

          let forwardName = label.forwardName;
          delete label.reversed;
          delete label.forwardName;
          g.setEdge(e.w, e.v, label, forwardName);
        }
      });
    }

    let util$c = util$d;

    var normalize$1 = {
      run: run$1,
      undo: undo$1
    };

    /*
     * Breaks any long edges in the graph into short segments that span 1 layer
     * each. This operation is undoable with the denormalize function.
     *
     * Pre-conditions:
     *
     *    1. The input graph is a DAG.
     *    2. Each node in the graph has a "rank" property.
     *
     * Post-condition:
     *
     *    1. All edges in the graph have a length of 1.
     *    2. Dummy nodes are added where edges have been split into segments.
     *    3. The graph is augmented with a "dummyChains" attribute which contains
     *       the first dummy in each chain of dummy nodes produced.
     */
    function run$1(g) {
      g.graph().dummyChains = [];
      g.edges().forEach(edge => normalizeEdge(g, edge));
    }

    function normalizeEdge(g, e) {
      let v = e.v;
      let vRank = g.node(v).rank;
      let w = e.w;
      let wRank = g.node(w).rank;
      let name = e.name;
      let edgeLabel = g.edge(e);
      let labelRank = edgeLabel.labelRank;

      if (wRank === vRank + 1) return;

      g.removeEdge(e);

      let dummy, attrs, i;
      for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
        edgeLabel.points = [];
        attrs = {
          width: 0, height: 0,
          edgeLabel: edgeLabel, edgeObj: e,
          rank: vRank
        };
        dummy = util$c.addDummyNode(g, "edge", attrs, "_d");
        if (vRank === labelRank) {
          attrs.width = edgeLabel.width;
          attrs.height = edgeLabel.height;
          attrs.dummy = "edge-label";
          attrs.labelpos = edgeLabel.labelpos;
        }
        g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
        if (i === 0) {
          g.graph().dummyChains.push(dummy);
        }
        v = dummy;
      }

      g.setEdge(v, w, { weight: edgeLabel.weight }, name);
    }

    function undo$1(g) {
      g.graph().dummyChains.forEach(v => {
        let node = g.node(v);
        let origLabel = node.edgeLabel;
        let w;
        g.setEdge(node.edgeObj, origLabel);
        while (node.dummy) {
          w = g.successors(v)[0];
          g.removeNode(v);
          origLabel.points.push({ x: node.x, y: node.y });
          if (node.dummy === "edge-label") {
            origLabel.x = node.x;
            origLabel.y = node.y;
            origLabel.width = node.width;
            origLabel.height = node.height;
          }
          v = w;
          node = g.node(v);
        }
      });
    }

    const { applyWithChunking } = util$d;

    var util$b = {
      longestPath: longestPath$1,
      slack: slack$2
    };

    /*
     * Initializes ranks for the input graph using the longest path algorithm. This
     * algorithm scales well and is fast in practice, it yields rather poor
     * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
     * ranks wide and leaving edges longer than necessary. However, due to its
     * speed, this algorithm is good for getting an initial ranking that can be fed
     * into other algorithms.
     *
     * This algorithm does not normalize layers because it will be used by other
     * algorithms in most cases. If using this algorithm directly, be sure to
     * run normalize at the end.
     *
     * Pre-conditions:
     *
     *    1. Input graph is a DAG.
     *    2. Input graph node labels can be assigned properties.
     *
     * Post-conditions:
     *
     *    1. Each node will be assign an (unnormalized) "rank" property.
     */
    function longestPath$1(g) {
      var visited = {};

      function dfs(v) {
        var label = g.node(v);
        if (Object.hasOwn(visited, v)) {
          return label.rank;
        }
        visited[v] = true;

        let outEdgesMinLens = g.outEdges(v).map(e => {
          if (e == null) {
            return Number.POSITIVE_INFINITY;
          }

          return dfs(e.w) - g.edge(e).minlen;
        });

        var rank = applyWithChunking(Math.min, outEdgesMinLens);

        if (rank === Number.POSITIVE_INFINITY) {
          rank = 0;
        }

        return (label.rank = rank);
      }

      g.sources().forEach(dfs);
    }

    /*
     * Returns the amount of slack for the given edge. The slack is defined as the
     * difference between the length of the edge and its minimum length.
     */
    function slack$2(g, e) {
      return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
    }

    var Graph$5 = graphlib.Graph;
    var slack$1 = util$b.slack;

    var feasibleTree_1 = feasibleTree$2;

    /*
     * Constructs a spanning tree with tight edges and adjusted the input node's
     * ranks to achieve this. A tight edge is one that is has a length that matches
     * its "minlen" attribute.
     *
     * The basic structure for this function is derived from Gansner, et al., "A
     * Technique for Drawing Directed Graphs."
     *
     * Pre-conditions:
     *
     *    1. Graph must be a DAG.
     *    2. Graph must be connected.
     *    3. Graph must have at least one node.
     *    5. Graph nodes must have been previously assigned a "rank" property that
     *       respects the "minlen" property of incident edges.
     *    6. Graph edges must have a "minlen" property.
     *
     * Post-conditions:
     *
     *    - Graph nodes will have their rank adjusted to ensure that all edges are
     *      tight.
     *
     * Returns a tree (undirected graph) that is constructed using only "tight"
     * edges.
     */
    function feasibleTree$2(g) {
      var t = new Graph$5({ directed: false });

      // Choose arbitrary node from which to start our tree
      var start = g.nodes()[0];
      var size = g.nodeCount();
      t.setNode(start, {});

      var edge, delta;
      while (tightTree(t, g) < size) {
        edge = findMinSlackEdge(t, g);
        delta = t.hasNode(edge.v) ? slack$1(g, edge) : -slack$1(g, edge);
        shiftRanks(t, g, delta);
      }

      return t;
    }

    /*
     * Finds a maximal tree of tight edges and returns the number of nodes in the
     * tree.
     */
    function tightTree(t, g) {
      function dfs(v) {
        g.nodeEdges(v).forEach(e => {
          var edgeV = e.v,
            w = (v === edgeV) ? e.w : edgeV;
          if (!t.hasNode(w) && !slack$1(g, e)) {
            t.setNode(w, {});
            t.setEdge(v, w, {});
            dfs(w);
          }
        });
      }

      t.nodes().forEach(dfs);
      return t.nodeCount();
    }

    /*
     * Finds the edge with the smallest slack that is incident on tree and returns
     * it.
     */
    function findMinSlackEdge(t, g) {
      const edges = g.edges();

      return edges.reduce((acc, edge) => {
        let edgeSlack = Number.POSITIVE_INFINITY;
        if (t.hasNode(edge.v) !== t.hasNode(edge.w)) {
          edgeSlack = slack$1(g, edge);
        }

        if (edgeSlack < acc[0]) {
          return [edgeSlack, edge];
        }

        return acc;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }

    function shiftRanks(t, g, delta) {
      t.nodes().forEach(v => g.node(v).rank += delta);
    }

    var feasibleTree$1 = feasibleTree_1;
    var slack = util$b.slack;
    var initRank = util$b.longestPath;
    var preorder = graphlib.alg.preorder;
    var postorder$1 = graphlib.alg.postorder;
    var simplify = util$d.simplify;

    var networkSimplex_1 = networkSimplex$1;

    // Expose some internals for testing purposes
    networkSimplex$1.initLowLimValues = initLowLimValues;
    networkSimplex$1.initCutValues = initCutValues;
    networkSimplex$1.calcCutValue = calcCutValue;
    networkSimplex$1.leaveEdge = leaveEdge;
    networkSimplex$1.enterEdge = enterEdge;
    networkSimplex$1.exchangeEdges = exchangeEdges;

    /*
     * The network simplex algorithm assigns ranks to each node in the input graph
     * and iteratively improves the ranking to reduce the length of edges.
     *
     * Preconditions:
     *
     *    1. The input graph must be a DAG.
     *    2. All nodes in the graph must have an object value.
     *    3. All edges in the graph must have "minlen" and "weight" attributes.
     *
     * Postconditions:
     *
     *    1. All nodes in the graph will have an assigned "rank" attribute that has
     *       been optimized by the network simplex algorithm. Ranks start at 0.
     *
     *
     * A rough sketch of the algorithm is as follows:
     *
     *    1. Assign initial ranks to each node. We use the longest path algorithm,
     *       which assigns ranks to the lowest position possible. In general this
     *       leads to very wide bottom ranks and unnecessarily long edges.
     *    2. Construct a feasible tight tree. A tight tree is one such that all
     *       edges in the tree have no slack (difference between length of edge
     *       and minlen for the edge). This by itself greatly improves the assigned
     *       rankings by shorting edges.
     *    3. Iteratively find edges that have negative cut values. Generally a
     *       negative cut value indicates that the edge could be removed and a new
     *       tree edge could be added to produce a more compact graph.
     *
     * Much of the algorithms here are derived from Gansner, et al., "A Technique
     * for Drawing Directed Graphs." The structure of the file roughly follows the
     * structure of the overall algorithm.
     */
    function networkSimplex$1(g) {
      g = simplify(g);
      initRank(g);
      var t = feasibleTree$1(g);
      initLowLimValues(t);
      initCutValues(t, g);

      var e, f;
      while ((e = leaveEdge(t))) {
        f = enterEdge(t, g, e);
        exchangeEdges(t, g, e, f);
      }
    }

    /*
     * Initializes cut values for all edges in the tree.
     */
    function initCutValues(t, g) {
      var vs = postorder$1(t, t.nodes());
      vs = vs.slice(0, vs.length - 1);
      vs.forEach(v => assignCutValue(t, g, v));
    }

    function assignCutValue(t, g, child) {
      var childLab = t.node(child);
      var parent = childLab.parent;
      t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
    }

    /*
     * Given the tight tree, its graph, and a child in the graph calculate and
     * return the cut value for the edge between the child and its parent.
     */
    function calcCutValue(t, g, child) {
      var childLab = t.node(child);
      var parent = childLab.parent;
      // True if the child is on the tail end of the edge in the directed graph
      var childIsTail = true;
      // The graph's view of the tree edge we're inspecting
      var graphEdge = g.edge(child, parent);
      // The accumulated cut value for the edge between this node and its parent
      var cutValue = 0;

      if (!graphEdge) {
        childIsTail = false;
        graphEdge = g.edge(parent, child);
      }

      cutValue = graphEdge.weight;

      g.nodeEdges(child).forEach(e => {
        var isOutEdge = e.v === child,
          other = isOutEdge ? e.w : e.v;

        if (other !== parent) {
          var pointsToHead = isOutEdge === childIsTail,
            otherWeight = g.edge(e).weight;

          cutValue += pointsToHead ? otherWeight : -otherWeight;
          if (isTreeEdge(t, child, other)) {
            var otherCutValue = t.edge(child, other).cutvalue;
            cutValue += pointsToHead ? -otherCutValue : otherCutValue;
          }
        }
      });

      return cutValue;
    }

    function initLowLimValues(tree, root) {
      if (arguments.length < 2) {
        root = tree.nodes()[0];
      }
      dfsAssignLowLim(tree, {}, 1, root);
    }

    function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
      var low = nextLim;
      var label = tree.node(v);

      visited[v] = true;
      tree.neighbors(v).forEach(w => {
        if (!Object.hasOwn(visited, w)) {
          nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
        }
      });

      label.low = low;
      label.lim = nextLim++;
      if (parent) {
        label.parent = parent;
      } else {
        // TODO should be able to remove this when we incrementally update low lim
        delete label.parent;
      }

      return nextLim;
    }

    function leaveEdge(tree) {
      return tree.edges().find(e => tree.edge(e).cutvalue < 0);
    }

    function enterEdge(t, g, edge) {
      var v = edge.v;
      var w = edge.w;

      // For the rest of this function we assume that v is the tail and w is the
      // head, so if we don't have this edge in the graph we should flip it to
      // match the correct orientation.
      if (!g.hasEdge(v, w)) {
        v = edge.w;
        w = edge.v;
      }

      var vLabel = t.node(v);
      var wLabel = t.node(w);
      var tailLabel = vLabel;
      var flip = false;

      // If the root is in the tail of the edge then we need to flip the logic that
      // checks for the head and tail nodes in the candidates function below.
      if (vLabel.lim > wLabel.lim) {
        tailLabel = wLabel;
        flip = true;
      }

      var candidates = g.edges().filter(edge => {
        return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
               flip !== isDescendant(t, t.node(edge.w), tailLabel);
      });

      return candidates.reduce((acc, edge) => {
        if (slack(g, edge) < slack(g, acc)) {
          return edge;
        }

        return acc;
      });
    }

    function exchangeEdges(t, g, e, f) {
      var v = e.v;
      var w = e.w;
      t.removeEdge(v, w);
      t.setEdge(f.v, f.w, {});
      initLowLimValues(t);
      initCutValues(t, g);
      updateRanks(t, g);
    }

    function updateRanks(t, g) {
      var root = t.nodes().find(v => !g.node(v).parent);
      var vs = preorder(t, root);
      vs = vs.slice(1);
      vs.forEach(v => {
        var parent = t.node(v).parent,
          edge = g.edge(v, parent),
          flipped = false;

        if (!edge) {
          edge = g.edge(parent, v);
          flipped = true;
        }

        g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
      });
    }

    /*
     * Returns true if the edge is in the tree.
     */
    function isTreeEdge(tree, u, v) {
      return tree.hasEdge(u, v);
    }

    /*
     * Returns true if the specified node is descendant of the root node per the
     * assigned low and lim attributes in the tree.
     */
    function isDescendant(tree, vLabel, rootLabel) {
      return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
    }

    var rankUtil = util$b;
    var longestPath = rankUtil.longestPath;
    var feasibleTree = feasibleTree_1;
    var networkSimplex = networkSimplex_1;

    var rank_1 = rank$1;

    /*
     * Assigns a rank to each node in the input graph that respects the "minlen"
     * constraint specified on edges between nodes.
     *
     * This basic structure is derived from Gansner, et al., "A Technique for
     * Drawing Directed Graphs."
     *
     * Pre-conditions:
     *
     *    1. Graph must be a connected DAG
     *    2. Graph nodes must be objects
     *    3. Graph edges must have "weight" and "minlen" attributes
     *
     * Post-conditions:
     *
     *    1. Graph nodes will have a "rank" attribute based on the results of the
     *       algorithm. Ranks can start at any index (including negative), we'll
     *       fix them up later.
     */
    function rank$1(g) {
      var ranker = g.graph().ranker;
      if (ranker instanceof Function) {
        return ranker(g);
      }

      switch(g.graph().ranker) {
      case "network-simplex": networkSimplexRanker(g); break;
      case "tight-tree": tightTreeRanker(g); break;
      case "longest-path": longestPathRanker(g); break;
      case "none": break;
      default: networkSimplexRanker(g);
      }
    }

    // A fast and simple ranker, but results are far from optimal.
    var longestPathRanker = longestPath;

    function tightTreeRanker(g) {
      longestPath(g);
      feasibleTree(g);
    }

    function networkSimplexRanker(g) {
      networkSimplex(g);
    }

    var parentDummyChains_1 = parentDummyChains$1;

    function parentDummyChains$1(g) {
      let postorderNums = postorder(g);

      g.graph().dummyChains.forEach(v => {
        let node = g.node(v);
        let edgeObj = node.edgeObj;
        let pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
        let path = pathData.path;
        let lca = pathData.lca;
        let pathIdx = 0;
        let pathV = path[pathIdx];
        let ascending = true;

        while (v !== edgeObj.w) {
          node = g.node(v);

          if (ascending) {
            while ((pathV = path[pathIdx]) !== lca &&
                   g.node(pathV).maxRank < node.rank) {
              pathIdx++;
            }

            if (pathV === lca) {
              ascending = false;
            }
          }

          if (!ascending) {
            while (pathIdx < path.length - 1 &&
                   g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
              pathIdx++;
            }
            pathV = path[pathIdx];
          }

          g.setParent(v, pathV);
          v = g.successors(v)[0];
        }
      });
    }

    // Find a path from v to w through the lowest common ancestor (LCA). Return the
    // full path and the LCA.
    function findPath(g, postorderNums, v, w) {
      let vPath = [];
      let wPath = [];
      let low = Math.min(postorderNums[v].low, postorderNums[w].low);
      let lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
      let parent;
      let lca;

      // Traverse up from v to find the LCA
      parent = v;
      do {
        parent = g.parent(parent);
        vPath.push(parent);
      } while (parent &&
               (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
      lca = parent;

      // Traverse from w to LCA
      parent = w;
      while ((parent = g.parent(parent)) !== lca) {
        wPath.push(parent);
      }

      return { path: vPath.concat(wPath.reverse()), lca: lca };
    }

    function postorder(g) {
      let result = {};
      let lim = 0;

      function dfs(v) {
        let low = lim;
        g.children(v).forEach(dfs);
        result[v] = { low: low, lim: lim++ };
      }
      g.children().forEach(dfs);

      return result;
    }

    let util$a = util$d;

    var nestingGraph$1 = {
      run,
      cleanup,
    };

    /*
     * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
     * adds appropriate edges to ensure that all cluster nodes are placed between
     * these boundaries, and ensures that the graph is connected.
     *
     * In addition we ensure, through the use of the minlen property, that nodes
     * and subgraph border nodes to not end up on the same rank.
     *
     * Preconditions:
     *
     *    1. Input graph is a DAG
     *    2. Nodes in the input graph has a minlen attribute
     *
     * Postconditions:
     *
     *    1. Input graph is connected.
     *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
     *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
     *       get placed on the same rank as subgraph border nodes.
     *
     * The nesting graph idea comes from Sander, "Layout of Compound Directed
     * Graphs."
     */
    function run(g) {
      let root = util$a.addDummyNode(g, "root", {}, "_root");
      let depths = treeDepths(g);
      let depthsArr = Object.values(depths);
      let height = util$a.applyWithChunking(Math.max, depthsArr) - 1; // Note: depths is an Object not an array
      let nodeSep = 2 * height + 1;

      g.graph().nestingRoot = root;

      // Multiply minlen by nodeSep to align nodes on non-border ranks.
      g.edges().forEach(e => g.edge(e).minlen *= nodeSep);

      // Calculate a weight that is sufficient to keep subgraphs vertically compact
      let weight = sumWeights(g) + 1;

      // Create border nodes and link them up
      g.children().forEach(child => dfs(g, root, nodeSep, weight, height, depths, child));

      // Save the multiplier for node layers for later removal of empty border
      // layers.
      g.graph().nodeRankFactor = nodeSep;
    }

    function dfs(g, root, nodeSep, weight, height, depths, v) {
      let children = g.children(v);
      if (!children.length) {
        if (v !== root) {
          g.setEdge(root, v, { weight: 0, minlen: nodeSep });
        }
        return;
      }

      let top = util$a.addBorderNode(g, "_bt");
      let bottom = util$a.addBorderNode(g, "_bb");
      let label = g.node(v);

      g.setParent(top, v);
      label.borderTop = top;
      g.setParent(bottom, v);
      label.borderBottom = bottom;

      children.forEach(child => {
        dfs(g, root, nodeSep, weight, height, depths, child);

        let childNode = g.node(child);
        let childTop = childNode.borderTop ? childNode.borderTop : child;
        let childBottom = childNode.borderBottom ? childNode.borderBottom : child;
        let thisWeight = childNode.borderTop ? weight : 2 * weight;
        let minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

        g.setEdge(top, childTop, {
          weight: thisWeight,
          minlen: minlen,
          nestingEdge: true
        });

        g.setEdge(childBottom, bottom, {
          weight: thisWeight,
          minlen: minlen,
          nestingEdge: true
        });
      });

      if (!g.parent(v)) {
        g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
      }
    }

    function treeDepths(g) {
      var depths = {};
      function dfs(v, depth) {
        var children = g.children(v);
        if (children && children.length) {
          children.forEach(child => dfs(child, depth + 1));
        }
        depths[v] = depth;
      }
      g.children().forEach(v => dfs(v, 1));
      return depths;
    }

    function sumWeights(g) {
      return g.edges().reduce((acc, e) => acc + g.edge(e).weight, 0);
    }

    function cleanup(g) {
      var graphLabel = g.graph();
      g.removeNode(graphLabel.nestingRoot);
      delete graphLabel.nestingRoot;
      g.edges().forEach(e => {
        var edge = g.edge(e);
        if (edge.nestingEdge) {
          g.removeEdge(e);
        }
      });
    }

    let util$9 = util$d;

    var addBorderSegments_1 = addBorderSegments$1;

    function addBorderSegments$1(g) {
      function dfs(v) {
        let children = g.children(v);
        let node = g.node(v);
        if (children.length) {
          children.forEach(dfs);
        }

        if (Object.hasOwn(node, "minRank")) {
          node.borderLeft = [];
          node.borderRight = [];
          for (let rank = node.minRank, maxRank = node.maxRank + 1;
            rank < maxRank;
            ++rank) {
            addBorderNode(g, "borderLeft", "_bl", v, node, rank);
            addBorderNode(g, "borderRight", "_br", v, node, rank);
          }
        }
      }

      g.children().forEach(dfs);
    }

    function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
      let label = { width: 0, height: 0, rank: rank, borderType: prop };
      let prev = sgNode[prop][rank - 1];
      let curr = util$9.addDummyNode(g, "border", label, prefix);
      sgNode[prop][rank] = curr;
      g.setParent(curr, sg);
      if (prev) {
        g.setEdge(prev, curr, { weight: 1 });
      }
    }

    var coordinateSystem$1 = {
      adjust: adjust,
      undo: undo
    };

    function adjust(g) {
      let rankDir = g.graph().rankdir.toLowerCase();
      if (rankDir === "lr" || rankDir === "rl") {
        swapWidthHeight(g);
      }
    }

    function undo(g) {
      let rankDir = g.graph().rankdir.toLowerCase();
      if (rankDir === "bt" || rankDir === "rl") {
        reverseY(g);
      }

      if (rankDir === "lr" || rankDir === "rl") {
        swapXY(g);
        swapWidthHeight(g);
      }
    }

    function swapWidthHeight(g) {
      g.nodes().forEach(v => swapWidthHeightOne(g.node(v)));
      g.edges().forEach(e => swapWidthHeightOne(g.edge(e)));
    }

    function swapWidthHeightOne(attrs) {
      let w = attrs.width;
      attrs.width = attrs.height;
      attrs.height = w;
    }

    function reverseY(g) {
      g.nodes().forEach(v => reverseYOne(g.node(v)));

      g.edges().forEach(e => {
        let edge = g.edge(e);
        edge.points.forEach(reverseYOne);
        if (Object.hasOwn(edge, "y")) {
          reverseYOne(edge);
        }
      });
    }

    function reverseYOne(attrs) {
      attrs.y = -attrs.y;
    }

    function swapXY(g) {
      g.nodes().forEach(v => swapXYOne(g.node(v)));

      g.edges().forEach(e => {
        let edge = g.edge(e);
        edge.points.forEach(swapXYOne);
        if (Object.hasOwn(edge, "x")) {
          swapXYOne(edge);
        }
      });
    }

    function swapXYOne(attrs) {
      let x = attrs.x;
      attrs.x = attrs.y;
      attrs.y = x;
    }

    let util$8 = util$d;

    var initOrder_1 = initOrder$1;

    /*
     * Assigns an initial order value for each node by performing a DFS search
     * starting from nodes in the first rank. Nodes are assigned an order in their
     * rank as they are first visited.
     *
     * This approach comes from Gansner, et al., "A Technique for Drawing Directed
     * Graphs."
     *
     * Returns a layering matrix with an array per layer and each layer sorted by
     * the order of its nodes.
     */
    function initOrder$1(g) {
      let visited = {};
      let simpleNodes = g.nodes().filter(v => !g.children(v).length);
      let simpleNodesRanks = simpleNodes.map(v => g.node(v).rank);
      let maxRank = util$8.applyWithChunking(Math.max, simpleNodesRanks);
      let layers = util$8.range(maxRank + 1).map(() => []);

      function dfs(v) {
        if (visited[v]) return;
        visited[v] = true;
        let node = g.node(v);
        layers[node.rank].push(v);
        g.successors(v).forEach(dfs);
      }

      let orderedVs = simpleNodes.sort((a, b) => g.node(a).rank - g.node(b).rank);
      orderedVs.forEach(dfs);

      return layers;
    }

    let zipObject = util$d.zipObject;

    var crossCount_1 = crossCount$1;

    /*
     * A function that takes a layering (an array of layers, each with an array of
     * ordererd nodes) and a graph and returns a weighted crossing count.
     *
     * Pre-conditions:
     *
     *    1. Input graph must be simple (not a multigraph), directed, and include
     *       only simple edges.
     *    2. Edges in the input graph must have assigned weights.
     *
     * Post-conditions:
     *
     *    1. The graph and layering matrix are left unchanged.
     *
     * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
     */
    function crossCount$1(g, layering) {
      let cc = 0;
      for (let i = 1; i < layering.length; ++i) {
        cc += twoLayerCrossCount(g, layering[i-1], layering[i]);
      }
      return cc;
    }

    function twoLayerCrossCount(g, northLayer, southLayer) {
      // Sort all of the edges between the north and south layers by their position
      // in the north layer and then the south. Map these edges to the position of
      // their head in the south layer.
      let southPos = zipObject(southLayer, southLayer.map((v, i) => i));
      let southEntries = northLayer.flatMap(v => {
        return g.outEdges(v).map(e => {
          return { pos: southPos[e.w], weight: g.edge(e).weight };
        }).sort((a, b) => a.pos - b.pos);
      });

      // Build the accumulator tree
      let firstIndex = 1;
      while (firstIndex < southLayer.length) firstIndex <<= 1;
      let treeSize = 2 * firstIndex - 1;
      firstIndex -= 1;
      let tree = new Array(treeSize).fill(0);

      // Calculate the weighted crossings
      let cc = 0;
      southEntries.forEach(entry => {
        let index = entry.pos + firstIndex;
        tree[index] += entry.weight;
        let weightSum = 0;
        while (index > 0) {
          if (index % 2) {
            weightSum += tree[index + 1];
          }
          index = (index - 1) >> 1;
          tree[index] += entry.weight;
        }
        cc += entry.weight * weightSum;
      });

      return cc;
    }

    var barycenter_1 = barycenter$1;

    function barycenter$1(g, movable = []) {
      return movable.map(v => {
        let inV = g.inEdges(v);
        if (!inV.length) {
          return { v: v };
        } else {
          let result = inV.reduce((acc, e) => {
            let edge = g.edge(e),
              nodeU = g.node(e.v);
            return {
              sum: acc.sum + (edge.weight * nodeU.order),
              weight: acc.weight + edge.weight
            };
          }, { sum: 0, weight: 0 });

          return {
            v: v,
            barycenter: result.sum / result.weight,
            weight: result.weight
          };
        }
      });
    }

    let util$7 = util$d;

    var resolveConflicts_1 = resolveConflicts$1;

    /*
     * Given a list of entries of the form {v, barycenter, weight} and a
     * constraint graph this function will resolve any conflicts between the
     * constraint graph and the barycenters for the entries. If the barycenters for
     * an entry would violate a constraint in the constraint graph then we coalesce
     * the nodes in the conflict into a new node that respects the contraint and
     * aggregates barycenter and weight information.
     *
     * This implementation is based on the description in Forster, "A Fast and
     * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
     * differs in some specific details.
     *
     * Pre-conditions:
     *
     *    1. Each entry has the form {v, barycenter, weight}, or if the node has
     *       no barycenter, then {v}.
     *
     * Returns:
     *
     *    A new list of entries of the form {vs, i, barycenter, weight}. The list
     *    `vs` may either be a singleton or it may be an aggregation of nodes
     *    ordered such that they do not violate constraints from the constraint
     *    graph. The property `i` is the lowest original index of any of the
     *    elements in `vs`.
     */
    function resolveConflicts$1(entries, cg) {
      let mappedEntries = {};
      entries.forEach((entry, i) => {
        let tmp = mappedEntries[entry.v] = {
          indegree: 0,
          "in": [],
          out: [],
          vs: [entry.v],
          i: i
        };
        if (entry.barycenter !== undefined) {
          tmp.barycenter = entry.barycenter;
          tmp.weight = entry.weight;
        }
      });

      cg.edges().forEach(e => {
        let entryV = mappedEntries[e.v];
        let entryW = mappedEntries[e.w];
        if (entryV !== undefined && entryW !== undefined) {
          entryW.indegree++;
          entryV.out.push(mappedEntries[e.w]);
        }
      });

      let sourceSet = Object.values(mappedEntries).filter(entry => !entry.indegree);

      return doResolveConflicts(sourceSet);
    }

    function doResolveConflicts(sourceSet) {
      let entries = [];

      function handleIn(vEntry) {
        return uEntry => {
          if (uEntry.merged) {
            return;
          }
          if (uEntry.barycenter === undefined ||
              vEntry.barycenter === undefined ||
              uEntry.barycenter >= vEntry.barycenter) {
            mergeEntries(vEntry, uEntry);
          }
        };
      }

      function handleOut(vEntry) {
        return wEntry => {
          wEntry["in"].push(vEntry);
          if (--wEntry.indegree === 0) {
            sourceSet.push(wEntry);
          }
        };
      }

      while (sourceSet.length) {
        let entry = sourceSet.pop();
        entries.push(entry);
        entry["in"].reverse().forEach(handleIn(entry));
        entry.out.forEach(handleOut(entry));
      }

      return entries.filter(entry => !entry.merged).map(entry => {
        return util$7.pick(entry, ["vs", "i", "barycenter", "weight"]);
      });
    }

    function mergeEntries(target, source) {
      let sum = 0;
      let weight = 0;

      if (target.weight) {
        sum += target.barycenter * target.weight;
        weight += target.weight;
      }

      if (source.weight) {
        sum += source.barycenter * source.weight;
        weight += source.weight;
      }

      target.vs = source.vs.concat(target.vs);
      target.barycenter = sum / weight;
      target.weight = weight;
      target.i = Math.min(source.i, target.i);
      source.merged = true;
    }

    let util$6 = util$d;

    var sort_1 = sort$1;

    function sort$1(entries, biasRight) {
      let parts = util$6.partition(entries, entry => {
        return Object.hasOwn(entry, "barycenter");
      });
      let sortable = parts.lhs,
        unsortable = parts.rhs.sort((a, b) => b.i - a.i),
        vs = [],
        sum = 0,
        weight = 0,
        vsIndex = 0;

      sortable.sort(compareWithBias(!!biasRight));

      vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

      sortable.forEach(entry => {
        vsIndex += entry.vs.length;
        vs.push(entry.vs);
        sum += entry.barycenter * entry.weight;
        weight += entry.weight;
        vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
      });

      let result = { vs: vs.flat(true) };
      if (weight) {
        result.barycenter = sum / weight;
        result.weight = weight;
      }
      return result;
    }

    function consumeUnsortable(vs, unsortable, index) {
      let last;
      while (unsortable.length && (last = unsortable[unsortable.length - 1]).i <= index) {
        unsortable.pop();
        vs.push(last.vs);
        index++;
      }
      return index;
    }

    function compareWithBias(bias) {
      return (entryV, entryW) => {
        if (entryV.barycenter < entryW.barycenter) {
          return -1;
        } else if (entryV.barycenter > entryW.barycenter) {
          return 1;
        }

        return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
      };
    }

    let barycenter = barycenter_1;
    let resolveConflicts = resolveConflicts_1;
    let sort = sort_1;

    var sortSubgraph_1 = sortSubgraph$1;

    function sortSubgraph$1(g, v, cg, biasRight) {
      let movable = g.children(v);
      let node = g.node(v);
      let bl = node ? node.borderLeft : undefined;
      let br = node ? node.borderRight: undefined;
      let subgraphs = {};

      if (bl) {
        movable = movable.filter(w => w !== bl && w !== br);
      }

      let barycenters = barycenter(g, movable);
      barycenters.forEach(entry => {
        if (g.children(entry.v).length) {
          let subgraphResult = sortSubgraph$1(g, entry.v, cg, biasRight);
          subgraphs[entry.v] = subgraphResult;
          if (Object.hasOwn(subgraphResult, "barycenter")) {
            mergeBarycenters(entry, subgraphResult);
          }
        }
      });

      let entries = resolveConflicts(barycenters, cg);
      expandSubgraphs(entries, subgraphs);

      let result = sort(entries, biasRight);

      if (bl) {
        result.vs = [bl, result.vs, br].flat(true);
        if (g.predecessors(bl).length) {
          let blPred = g.node(g.predecessors(bl)[0]),
            brPred = g.node(g.predecessors(br)[0]);
          if (!Object.hasOwn(result, "barycenter")) {
            result.barycenter = 0;
            result.weight = 0;
          }
          result.barycenter = (result.barycenter * result.weight +
                               blPred.order + brPred.order) / (result.weight + 2);
          result.weight += 2;
        }
      }

      return result;
    }

    function expandSubgraphs(entries, subgraphs) {
      entries.forEach(entry => {
        entry.vs = entry.vs.flatMap(v => {
          if (subgraphs[v]) {
            return subgraphs[v].vs;
          }
          return v;
        });
      });
    }

    function mergeBarycenters(target, other) {
      if (target.barycenter !== undefined) {
        target.barycenter = (target.barycenter * target.weight +
                             other.barycenter * other.weight) /
                            (target.weight + other.weight);
        target.weight += other.weight;
      } else {
        target.barycenter = other.barycenter;
        target.weight = other.weight;
      }
    }

    let Graph$4 = graphlib.Graph;
    let util$5 = util$d;

    var buildLayerGraph_1 = buildLayerGraph$1;

    /*
     * Constructs a graph that can be used to sort a layer of nodes. The graph will
     * contain all base and subgraph nodes from the request layer in their original
     * hierarchy and any edges that are incident on these nodes and are of the type
     * requested by the "relationship" parameter.
     *
     * Nodes from the requested rank that do not have parents are assigned a root
     * node in the output graph, which is set in the root graph attribute. This
     * makes it easy to walk the hierarchy of movable nodes during ordering.
     *
     * Pre-conditions:
     *
     *    1. Input graph is a DAG
     *    2. Base nodes in the input graph have a rank attribute
     *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
     *    4. Edges have an assigned weight
     *    5. If `nodesWithRank` is not undefined, it must contains only the nodes
     *       which belong to `g` and belong to `rank`.
     *
     * Post-conditions:
     *
     *    1. Output graph has all nodes in the movable rank with preserved
     *       hierarchy.
     *    2. Root nodes in the movable layer are made children of the node
     *       indicated by the root attribute of the graph.
     *    3. Non-movable nodes incident on movable nodes, selected by the
     *       relationship parameter, are included in the graph (without hierarchy).
     *    4. Edges incident on movable nodes, selected by the relationship
     *       parameter, are added to the output graph.
     *    5. The weights for copied edges are aggregated as need, since the output
     *       graph is not a multi-graph.
     */
    function buildLayerGraph$1(g, rank, relationship, nodesWithRank) {
      if (!nodesWithRank) {
        nodesWithRank = g.nodes();
      }
      let root = createRootNode(g),
        result = new Graph$4({ compound: true })
          .setGraph({ root: root })
          .setDefaultNodeLabel((v) => g.node(v));

      nodesWithRank.forEach((v) => {
        let node = g.node(v),
          parent = g.parent(v);

        if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
          result.setNode(v);
          result.setParent(v, parent || root);

          // This assumes we have only short edges!
          g[relationship](v).forEach(e => {
            let u = e.v === v ? e.w : e.v,
              edge = result.edge(u, v),
              weight = edge !== undefined ? edge.weight : 0;
            result.setEdge(u, v, { weight: g.edge(e).weight + weight });
          });

          if (Object.hasOwn(node, "minRank")) {
            result.setNode(v, {
              borderLeft: node.borderLeft[rank],
              borderRight: node.borderRight[rank]
            });
          }
        }
      });

      return result;
    }

    function createRootNode(g) {
      var v;
      while (g.hasNode((v = util$5.uniqueId("_root"))));
      return v;
    }

    var addSubgraphConstraints_1 = addSubgraphConstraints$1;

    function addSubgraphConstraints$1(g, cg, vs) {
      let prev = {},
        rootPrev;

      vs.forEach(v => {
        let child = g.parent(v),
          parent,
          prevChild;
        while (child) {
          parent = g.parent(child);
          if (parent) {
            prevChild = prev[parent];
            prev[parent] = child;
          } else {
            prevChild = rootPrev;
            rootPrev = child;
          }
          if (prevChild && prevChild !== child) {
            cg.setEdge(prevChild, child);
            return;
          }
          child = parent;
        }
      });

      /*
      function dfs(v) {
        var children = v ? g.children(v) : g.children();
        if (children.length) {
          var min = Number.POSITIVE_INFINITY,
              subgraphs = [];
          children.forEach(function(child) {
            var childMin = dfs(child);
            if (g.children(child).length) {
              subgraphs.push({ v: child, order: childMin });
            }
            min = Math.min(min, childMin);
          });
          _.sortBy(subgraphs, "order").reduce(function(prev, curr) {
            cg.setEdge(prev.v, curr.v);
            return curr;
          });
          return min;
        }
        return g.node(v).order;
      }
      dfs(undefined);
      */
    }

    let initOrder = initOrder_1;
    let crossCount = crossCount_1;
    let sortSubgraph = sortSubgraph_1;
    let buildLayerGraph = buildLayerGraph_1;
    let addSubgraphConstraints = addSubgraphConstraints_1;
    let Graph$3 = graphlib.Graph;
    let util$4 = util$d;

    var order_1 = order$1;

    /*
     * Applies heuristics to minimize edge crossings in the graph and sets the best
     * order solution as an order attribute on each node.
     *
     * Pre-conditions:
     *
     *    1. Graph must be DAG
     *    2. Graph nodes must be objects with a "rank" attribute
     *    3. Graph edges must have the "weight" attribute
     *
     * Post-conditions:
     *
     *    1. Graph nodes will have an "order" attribute based on the results of the
     *       algorithm.
     */
    function order$1(g, opts) {
      if (opts && typeof opts.customOrder === 'function') {
        opts.customOrder(g, order$1);
        return;
      }

      let maxRank = util$4.maxRank(g),
        downLayerGraphs = buildLayerGraphs(g, util$4.range(1, maxRank + 1), "inEdges"),
        upLayerGraphs = buildLayerGraphs(g, util$4.range(maxRank - 1, -1, -1), "outEdges");

      let layering = initOrder(g);
      assignOrder(g, layering);

      if (opts && opts.disableOptimalOrderHeuristic) {
        return;
      }

      let bestCC = Number.POSITIVE_INFINITY,
        best;

      for (let i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
        sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

        layering = util$4.buildLayerMatrix(g);
        let cc = crossCount(g, layering);
        if (cc < bestCC) {
          lastBest = 0;
          best = Object.assign({}, layering);
          bestCC = cc;
        }
      }

      assignOrder(g, best);
    }

    function buildLayerGraphs(g, ranks, relationship) {
      // Build an index mapping from rank to the nodes with that rank.
      // This helps to avoid a quadratic search for all nodes with the same rank as
      // the current node.
      const nodesByRank = new Map();
      const addNodeToRank = (rank, node) => {
        if (!nodesByRank.has(rank)) {
          nodesByRank.set(rank, []);
        }
        nodesByRank.get(rank).push(node);
      };

      // Visit the nodes in their original order in the graph, and add each
      // node to the ranks(s) that it belongs to.
      for (const v of g.nodes()) {
        const node = g.node(v);
        if (typeof node.rank === "number") {
          addNodeToRank(node.rank, v);
        }
        // If there is a range of ranks, add it to each, but skip the `node.rank` which
        // has already had the node added.
        if (typeof node.minRank === "number" && typeof node.maxRank === "number") {
          for (let r = node.minRank; r <= node.maxRank; r++) {
            if (r !== node.rank) {
              // Don't add this node to its `node.rank` twice.
              addNodeToRank(r, v);
            }
          }
        }
      }

      return ranks.map(function (rank) {
        return buildLayerGraph(g, rank, relationship, nodesByRank.get(rank) || []);
      });
    }

    function sweepLayerGraphs(layerGraphs, biasRight) {
      let cg = new Graph$3();
      layerGraphs.forEach(function(lg) {
        let root = lg.graph().root;
        let sorted = sortSubgraph(lg, root, cg, biasRight);
        sorted.vs.forEach((v, i) => lg.node(v).order = i);
        addSubgraphConstraints(lg, cg, sorted.vs);
      });
    }

    function assignOrder(g, layering) {
      Object.values(layering).forEach(layer => layer.forEach((v, i) => g.node(v).order = i));
    }

    let Graph$2 = graphlib.Graph;
    let util$3 = util$d;

    /*
     * This module provides coordinate assignment based on Brandes and Köpf, "Fast
     * and Simple Horizontal Coordinate Assignment."
     */

    var bk = {
      positionX: positionX$1};

    /*
     * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
     * property. A type-1 conflict is one where a non-inner segment crosses an
     * inner segment. An inner segment is an edge with both incident nodes marked
     * with the "dummy" property.
     *
     * This algorithm scans layer by layer, starting with the second, for type-1
     * conflicts between the current layer and the previous layer. For each layer
     * it scans the nodes from left to right until it reaches one that is incident
     * on an inner segment. It then scans predecessors to determine if they have
     * edges that cross that inner segment. At the end a final scan is done for all
     * nodes on the current rank to see if they cross the last visited inner
     * segment.
     *
     * This algorithm (safely) assumes that a dummy node will only be incident on a
     * single node in the layers being scanned.
     */
    function findType1Conflicts(g, layering) {
      let conflicts = {};

      function visitLayer(prevLayer, layer) {
        let
          // last visited node in the previous layer that is incident on an inner
          // segment.
          k0 = 0,
          // Tracks the last node in this layer scanned for crossings with a type-1
          // segment.
          scanPos = 0,
          prevLayerLength = prevLayer.length,
          lastNode = layer[layer.length - 1];

        layer.forEach((v, i) => {
          let w = findOtherInnerSegmentNode(g, v),
            k1 = w ? g.node(w).order : prevLayerLength;

          if (w || v === lastNode) {
            layer.slice(scanPos, i+1).forEach(scanNode => {
              g.predecessors(scanNode).forEach(u => {
                let uLabel = g.node(u),
                  uPos = uLabel.order;
                if ((uPos < k0 || k1 < uPos) &&
                    !(uLabel.dummy && g.node(scanNode).dummy)) {
                  addConflict(conflicts, u, scanNode);
                }
              });
            });
            scanPos = i + 1;
            k0 = k1;
          }
        });

        return layer;
      }

      layering.length && layering.reduce(visitLayer);

      return conflicts;
    }

    function findType2Conflicts(g, layering) {
      let conflicts = {};

      function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
        let v;
        util$3.range(southPos, southEnd).forEach(i => {
          v = south[i];
          if (g.node(v).dummy) {
            g.predecessors(v).forEach(u => {
              let uNode = g.node(u);
              if (uNode.dummy &&
                  (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
                addConflict(conflicts, u, v);
              }
            });
          }
        });
      }


      function visitLayer(north, south) {
        let prevNorthPos = -1,
          nextNorthPos,
          southPos = 0;

        south.forEach((v, southLookahead) => {
          if (g.node(v).dummy === "border") {
            let predecessors = g.predecessors(v);
            if (predecessors.length) {
              nextNorthPos = g.node(predecessors[0]).order;
              scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
              southPos = southLookahead;
              prevNorthPos = nextNorthPos;
            }
          }
          scan(south, southPos, south.length, nextNorthPos, north.length);
        });

        return south;
      }

      layering.length && layering.reduce(visitLayer);

      return conflicts;
    }

    function findOtherInnerSegmentNode(g, v) {
      if (g.node(v).dummy) {
        return g.predecessors(v).find(u => g.node(u).dummy);
      }
    }

    function addConflict(conflicts, v, w) {
      if (v > w) {
        let tmp = v;
        v = w;
        w = tmp;
      }

      let conflictsV = conflicts[v];
      if (!conflictsV) {
        conflicts[v] = conflictsV = {};
      }
      conflictsV[w] = true;
    }

    function hasConflict(conflicts, v, w) {
      if (v > w) {
        let tmp = v;
        v = w;
        w = tmp;
      }
      return !!conflicts[v] && Object.hasOwn(conflicts[v], w);
    }

    /*
     * Try to align nodes into vertical "blocks" where possible. This algorithm
     * attempts to align a node with one of its median neighbors. If the edge
     * connecting a neighbor is a type-1 conflict then we ignore that possibility.
     * If a previous node has already formed a block with a node after the node
     * we're trying to form a block with, we also ignore that possibility - our
     * blocks would be split in that scenario.
     */
    function verticalAlignment(g, layering, conflicts, neighborFn) {
      let root = {},
        align = {},
        pos = {};

      // We cache the position here based on the layering because the graph and
      // layering may be out of sync. The layering matrix is manipulated to
      // generate different extreme alignments.
      layering.forEach(layer => {
        layer.forEach((v, order) => {
          root[v] = v;
          align[v] = v;
          pos[v] = order;
        });
      });

      layering.forEach(layer => {
        let prevIdx = -1;
        layer.forEach(v => {
          let ws = neighborFn(v);
          if (ws.length) {
            ws = ws.sort((a, b) => pos[a] - pos[b]);
            let mp = (ws.length - 1) / 2;
            for (let i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
              let w = ws[i];
              if (align[v] === v &&
                  prevIdx < pos[w] &&
                  !hasConflict(conflicts, v, w)) {
                align[w] = v;
                align[v] = root[v] = root[w];
                prevIdx = pos[w];
              }
            }
          }
        });
      });

      return { root: root, align: align };
    }

    function horizontalCompaction(g, layering, root, align, reverseSep) {
      // This portion of the algorithm differs from BK due to a number of problems.
      // Instead of their algorithm we construct a new block graph and do two
      // sweeps. The first sweep places blocks with the smallest possible
      // coordinates. The second sweep removes unused space by moving blocks to the
      // greatest coordinates without violating separation.
      let xs = {},
        blockG = buildBlockGraph(g, layering, root, reverseSep),
        borderType = reverseSep ? "borderLeft" : "borderRight";

      function iterate(setXsFunc, nextNodesFunc) {
        let stack = blockG.nodes();
        let elem = stack.pop();
        let visited = {};
        while (elem) {
          if (visited[elem]) {
            setXsFunc(elem);
          } else {
            visited[elem] = true;
            stack.push(elem);
            stack = stack.concat(nextNodesFunc(elem));
          }

          elem = stack.pop();
        }
      }

      // First pass, assign smallest coordinates
      function pass1(elem) {
        xs[elem] = blockG.inEdges(elem).reduce((acc, e) => {
          return Math.max(acc, xs[e.v] + blockG.edge(e));
        }, 0);
      }

      // Second pass, assign greatest coordinates
      function pass2(elem) {
        let min = blockG.outEdges(elem).reduce((acc, e) => {
          return Math.min(acc, xs[e.w] - blockG.edge(e));
        }, Number.POSITIVE_INFINITY);

        let node = g.node(elem);
        if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
          xs[elem] = Math.max(xs[elem], min);
        }
      }

      iterate(pass1, blockG.predecessors.bind(blockG));
      iterate(pass2, blockG.successors.bind(blockG));

      // Assign x coordinates to all nodes
      Object.keys(align).forEach(v => xs[v] = xs[root[v]]);

      return xs;
    }


    function buildBlockGraph(g, layering, root, reverseSep) {
      let blockGraph = new Graph$2(),
        graphLabel = g.graph(),
        sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

      layering.forEach(layer => {
        let u;
        layer.forEach(v => {
          let vRoot = root[v];
          blockGraph.setNode(vRoot);
          if (u) {
            var uRoot = root[u],
              prevMax = blockGraph.edge(uRoot, vRoot);
            blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
          }
          u = v;
        });
      });

      return blockGraph;
    }

    /*
     * Returns the alignment that has the smallest width of the given alignments.
     */
    function findSmallestWidthAlignment(g, xss) {
      return Object.values(xss).reduce((currentMinAndXs, xs) => {
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;

        Object.entries(xs).forEach(([v, x]) => {
          let halfWidth = width(g, v) / 2;

          max = Math.max(x + halfWidth, max);
          min = Math.min(x - halfWidth, min);
        });

        const newMin = max - min;
        if (newMin < currentMinAndXs[0]) {
          currentMinAndXs = [newMin, xs];
        }
        return currentMinAndXs;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }

    /*
     * Align the coordinates of each of the layout alignments such that
     * left-biased alignments have their minimum coordinate at the same point as
     * the minimum coordinate of the smallest width alignment and right-biased
     * alignments have their maximum coordinate at the same point as the maximum
     * coordinate of the smallest width alignment.
     */
    function alignCoordinates(xss, alignTo) {
      let alignToVals = Object.values(alignTo),
        alignToMin = util$3.applyWithChunking(Math.min, alignToVals),
        alignToMax = util$3.applyWithChunking(Math.max, alignToVals);

      ["u", "d"].forEach(vert => {
        ["l", "r"].forEach(horiz => {
          let alignment = vert + horiz,
            xs = xss[alignment];

          if (xs === alignTo) return;

          let xsVals = Object.values(xs);
          let delta = alignToMin - util$3.applyWithChunking(Math.min, xsVals);
          if (horiz !== "l") {
            delta = alignToMax - util$3.applyWithChunking(Math.max,xsVals);
          }

          if (delta) {
            xss[alignment] = util$3.mapValues(xs, x => x + delta);
          }
        });
      });
    }

    function balance(xss, align) {
      return util$3.mapValues(xss.ul, (num, v) => {
        if (align) {
          return xss[align.toLowerCase()][v];
        } else {
          let xs = Object.values(xss).map(xs => xs[v]).sort((a, b) => a - b);
          return (xs[1] + xs[2]) / 2;
        }
      });
    }

    function positionX$1(g) {
      let layering = util$3.buildLayerMatrix(g);
      let conflicts = Object.assign(
        findType1Conflicts(g, layering),
        findType2Conflicts(g, layering));

      let xss = {};
      let adjustedLayering;
      ["u", "d"].forEach(vert => {
        adjustedLayering = vert === "u" ? layering : Object.values(layering).reverse();
        ["l", "r"].forEach(horiz => {
          if (horiz === "r") {
            adjustedLayering = adjustedLayering.map(inner => {
              return Object.values(inner).reverse();
            });
          }

          let neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
          let align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
          let xs = horizontalCompaction(g, adjustedLayering,
            align.root, align.align, horiz === "r");
          if (horiz === "r") {
            xs = util$3.mapValues(xs, x => -x);
          }
          xss[vert + horiz] = xs;
        });
      });


      let smallestWidth = findSmallestWidthAlignment(g, xss);
      alignCoordinates(xss, smallestWidth);
      return balance(xss, g.graph().align);
    }

    function sep(nodeSep, edgeSep, reverseSep) {
      return (g, v, w) => {
        let vLabel = g.node(v);
        let wLabel = g.node(w);
        let sum = 0;
        let delta;

        sum += vLabel.width / 2;
        if (Object.hasOwn(vLabel, "labelpos")) {
          switch (vLabel.labelpos.toLowerCase()) {
          case "l": delta = -vLabel.width / 2; break;
          case "r": delta = vLabel.width / 2; break;
          }
        }
        if (delta) {
          sum += reverseSep ? delta : -delta;
        }
        delta = 0;

        sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
        sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

        sum += wLabel.width / 2;
        if (Object.hasOwn(wLabel, "labelpos")) {
          switch (wLabel.labelpos.toLowerCase()) {
          case "l": delta = wLabel.width / 2; break;
          case "r": delta = -wLabel.width / 2; break;
          }
        }
        if (delta) {
          sum += reverseSep ? delta : -delta;
        }
        delta = 0;

        return sum;
      };
    }

    function width(g, v) {
      return g.node(v).width;
    }

    let util$2 = util$d;
    let positionX = bk.positionX;

    var position_1 = position$1;

    function position$1(g) {
      g = util$2.asNonCompoundGraph(g);

      positionY(g);
      Object.entries(positionX(g)).forEach(([v, x]) => g.node(v).x = x);
    }

    function positionY(g) {
      let layering = util$2.buildLayerMatrix(g);
      let rankSep = g.graph().ranksep;
      let prevY = 0;
      layering.forEach(layer => {
        const maxHeight = layer.reduce((acc, v) => {
          const height = g.node(v).height;
          if (acc > height) {
            return acc;
          } else {
            return height;
          }
        }, 0);
        layer.forEach(v => g.node(v).y = prevY + maxHeight / 2);
        prevY += maxHeight + rankSep;
      });
    }

    let acyclic = acyclic$1;
    let normalize = normalize$1;
    let rank = rank_1;
    let normalizeRanks = util$d.normalizeRanks;
    let parentDummyChains = parentDummyChains_1;
    let removeEmptyRanks = util$d.removeEmptyRanks;
    let nestingGraph = nestingGraph$1;
    let addBorderSegments = addBorderSegments_1;
    let coordinateSystem = coordinateSystem$1;
    let order = order_1;
    let position = position_1;
    let util$1 = util$d;
    let Graph$1 = graphlib.Graph;

    var layout_1 = layout$1;

    function layout$1(g, opts) {
      let time = opts && opts.debugTiming ? util$1.time : util$1.notime;
      time("layout", () => {
        let layoutGraph =
          time("  buildLayoutGraph", () => buildLayoutGraph(g));
        time("  runLayout",        () => runLayout(layoutGraph, time, opts));
        time("  updateInputGraph", () => updateInputGraph(g, layoutGraph));
      });
    }

    function runLayout(g, time, opts) {
      time("    makeSpaceForEdgeLabels", () => makeSpaceForEdgeLabels(g));
      time("    removeSelfEdges",        () => removeSelfEdges(g));
      time("    acyclic",                () => acyclic.run(g));
      time("    nestingGraph.run",       () => nestingGraph.run(g));
      time("    rank",                   () => rank(util$1.asNonCompoundGraph(g)));
      time("    injectEdgeLabelProxies", () => injectEdgeLabelProxies(g));
      time("    removeEmptyRanks",       () => removeEmptyRanks(g));
      time("    nestingGraph.cleanup",   () => nestingGraph.cleanup(g));
      time("    normalizeRanks",         () => normalizeRanks(g));
      time("    assignRankMinMax",       () => assignRankMinMax(g));
      time("    removeEdgeLabelProxies", () => removeEdgeLabelProxies(g));
      time("    normalize.run",          () => normalize.run(g));
      time("    parentDummyChains",      () => parentDummyChains(g));
      time("    addBorderSegments",      () => addBorderSegments(g));
      time("    order",                  () => order(g, opts));
      time("    insertSelfEdges",        () => insertSelfEdges(g));
      time("    adjustCoordinateSystem", () => coordinateSystem.adjust(g));
      time("    position",               () => position(g));
      time("    positionSelfEdges",      () => positionSelfEdges(g));
      time("    removeBorderNodes",      () => removeBorderNodes(g));
      time("    normalize.undo",         () => normalize.undo(g));
      time("    fixupEdgeLabelCoords",   () => fixupEdgeLabelCoords(g));
      time("    undoCoordinateSystem",   () => coordinateSystem.undo(g));
      time("    translateGraph",         () => translateGraph(g));
      time("    assignNodeIntersects",   () => assignNodeIntersects(g));
      time("    reversePoints",          () => reversePointsForReversedEdges(g));
      time("    acyclic.undo",           () => acyclic.undo(g));
    }

    /*
     * Copies final layout information from the layout graph back to the input
     * graph. This process only copies whitelisted attributes from the layout graph
     * to the input graph, so it serves as a good place to determine what
     * attributes can influence layout.
     */
    function updateInputGraph(inputGraph, layoutGraph) {
      inputGraph.nodes().forEach(v => {
        let inputLabel = inputGraph.node(v);
        let layoutLabel = layoutGraph.node(v);

        if (inputLabel) {
          inputLabel.x = layoutLabel.x;
          inputLabel.y = layoutLabel.y;
          inputLabel.rank = layoutLabel.rank;

          if (layoutGraph.children(v).length) {
            inputLabel.width = layoutLabel.width;
            inputLabel.height = layoutLabel.height;
          }
        }
      });

      inputGraph.edges().forEach(e => {
        let inputLabel = inputGraph.edge(e);
        let layoutLabel = layoutGraph.edge(e);

        inputLabel.points = layoutLabel.points;
        if (Object.hasOwn(layoutLabel, "x")) {
          inputLabel.x = layoutLabel.x;
          inputLabel.y = layoutLabel.y;
        }
      });

      inputGraph.graph().width = layoutGraph.graph().width;
      inputGraph.graph().height = layoutGraph.graph().height;
    }

    let graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
    let graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
    let graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
    let nodeNumAttrs = ["width", "height", "rank"];
    let nodeDefaults = { width: 0, height: 0 };
    let edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
    let edgeDefaults = {
      minlen: 1, weight: 1, width: 0, height: 0,
      labeloffset: 10, labelpos: "r"
    };
    let edgeAttrs = ["labelpos"];

    /*
     * Constructs a new graph from the input graph, which can be used for layout.
     * This process copies only whitelisted attributes from the input graph to the
     * layout graph. Thus this function serves as a good place to determine what
     * attributes can influence layout.
     */
    function buildLayoutGraph(inputGraph) {
      let g = new Graph$1({ multigraph: true, compound: true });
      let graph = canonicalize(inputGraph.graph());

      g.setGraph(Object.assign({},
        graphDefaults,
        selectNumberAttrs(graph, graphNumAttrs),
        util$1.pick(graph, graphAttrs)));

      inputGraph.nodes().forEach(v => {
        let node = canonicalize(inputGraph.node(v));
        const newNode = selectNumberAttrs(node, nodeNumAttrs);
        Object.keys(nodeDefaults).forEach(k => {
          if (newNode[k] === undefined) {
            newNode[k] = nodeDefaults[k];
          }
        });

        g.setNode(v, newNode);
        g.setParent(v, inputGraph.parent(v));
      });

      inputGraph.edges().forEach(e => {
        let edge = canonicalize(inputGraph.edge(e));
        g.setEdge(e, Object.assign({},
          edgeDefaults,
          selectNumberAttrs(edge, edgeNumAttrs),
          util$1.pick(edge, edgeAttrs)));
      });

      return g;
    }

    /*
     * This idea comes from the Gansner paper: to account for edge labels in our
     * layout we split each rank in half by doubling minlen and halving ranksep.
     * Then we can place labels at these mid-points between nodes.
     *
     * We also add some minimal padding to the width to push the label for the edge
     * away from the edge itself a bit.
     */
    function makeSpaceForEdgeLabels(g) {
      let graph = g.graph();
      graph.ranksep /= 2;
      g.edges().forEach(e => {
        let edge = g.edge(e);
        edge.minlen *= 2;
        if (edge.labelpos.toLowerCase() !== "c") {
          if (graph.rankdir === "TB" || graph.rankdir === "BT") {
            edge.width += edge.labeloffset;
          } else {
            edge.height += edge.labeloffset;
          }
        }
      });
    }

    /*
     * Creates temporary dummy nodes that capture the rank in which each edge's
     * label is going to, if it has one of non-zero width and height. We do this
     * so that we can safely remove empty ranks while preserving balance for the
     * label's position.
     */
    function injectEdgeLabelProxies(g) {
      g.edges().forEach(e => {
        let edge = g.edge(e);
        if (edge.width && edge.height) {
          let v = g.node(e.v);
          let w = g.node(e.w);
          let label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
          util$1.addDummyNode(g, "edge-proxy", label, "_ep");
        }
      });
    }

    function assignRankMinMax(g) {
      let maxRank = 0;
      g.nodes().forEach(v => {
        let node = g.node(v);
        if (node.borderTop) {
          node.minRank = g.node(node.borderTop).rank;
          node.maxRank = g.node(node.borderBottom).rank;
          maxRank = Math.max(maxRank, node.maxRank);
        }
      });
      g.graph().maxRank = maxRank;
    }

    function removeEdgeLabelProxies(g) {
      g.nodes().forEach(v => {
        let node = g.node(v);
        if (node.dummy === "edge-proxy") {
          g.edge(node.e).labelRank = node.rank;
          g.removeNode(v);
        }
      });
    }

    function translateGraph(g) {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = 0;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = 0;
      let graphLabel = g.graph();
      let marginX = graphLabel.marginx || 0;
      let marginY = graphLabel.marginy || 0;

      function getExtremes(attrs) {
        let x = attrs.x;
        let y = attrs.y;
        let w = attrs.width;
        let h = attrs.height;
        minX = Math.min(minX, x - w / 2);
        maxX = Math.max(maxX, x + w / 2);
        minY = Math.min(minY, y - h / 2);
        maxY = Math.max(maxY, y + h / 2);
      }

      g.nodes().forEach(v => getExtremes(g.node(v)));
      g.edges().forEach(e => {
        let edge = g.edge(e);
        if (Object.hasOwn(edge, "x")) {
          getExtremes(edge);
        }
      });

      minX -= marginX;
      minY -= marginY;

      g.nodes().forEach(v => {
        let node = g.node(v);
        node.x -= minX;
        node.y -= minY;
      });

      g.edges().forEach(e => {
        let edge = g.edge(e);
        edge.points.forEach(p => {
          p.x -= minX;
          p.y -= minY;
        });
        if (Object.hasOwn(edge, "x")) { edge.x -= minX; }
        if (Object.hasOwn(edge, "y")) { edge.y -= minY; }
      });

      graphLabel.width = maxX - minX + marginX;
      graphLabel.height = maxY - minY + marginY;
    }

    function assignNodeIntersects(g) {
      g.edges().forEach(e => {
        let edge = g.edge(e);
        let nodeV = g.node(e.v);
        let nodeW = g.node(e.w);
        let p1, p2;
        if (!edge.points) {
          edge.points = [];
          p1 = nodeW;
          p2 = nodeV;
        } else {
          p1 = edge.points[0];
          p2 = edge.points[edge.points.length - 1];
        }
        edge.points.unshift(util$1.intersectRect(nodeV, p1));
        edge.points.push(util$1.intersectRect(nodeW, p2));
      });
    }

    function fixupEdgeLabelCoords(g) {
      g.edges().forEach(e => {
        let edge = g.edge(e);
        if (Object.hasOwn(edge, "x")) {
          if (edge.labelpos === "l" || edge.labelpos === "r") {
            edge.width -= edge.labeloffset;
          }
          switch (edge.labelpos) {
          case "l": edge.x -= edge.width / 2 + edge.labeloffset; break;
          case "r": edge.x += edge.width / 2 + edge.labeloffset; break;
          }
        }
      });
    }

    function reversePointsForReversedEdges(g) {
      g.edges().forEach(e => {
        let edge = g.edge(e);
        if (edge.reversed) {
          edge.points.reverse();
        }
      });
    }

    function removeBorderNodes(g) {
      g.nodes().forEach(v => {
        if (g.children(v).length) {
          let node = g.node(v);
          let t = g.node(node.borderTop);
          let b = g.node(node.borderBottom);
          let l = g.node(node.borderLeft[node.borderLeft.length - 1]);
          let r = g.node(node.borderRight[node.borderRight.length - 1]);

          node.width = Math.abs(r.x - l.x);
          node.height = Math.abs(b.y - t.y);
          node.x = l.x + node.width / 2;
          node.y = t.y + node.height / 2;
        }
      });

      g.nodes().forEach(v => {
        if (g.node(v).dummy === "border") {
          g.removeNode(v);
        }
      });
    }

    function removeSelfEdges(g) {
      g.edges().forEach(e => {
        if (e.v === e.w) {
          var node = g.node(e.v);
          if (!node.selfEdges) {
            node.selfEdges = [];
          }
          node.selfEdges.push({ e: e, label: g.edge(e) });
          g.removeEdge(e);
        }
      });
    }

    function insertSelfEdges(g) {
      var layers = util$1.buildLayerMatrix(g);
      layers.forEach(layer => {
        var orderShift = 0;
        layer.forEach((v, i) => {
          var node = g.node(v);
          node.order = i + orderShift;
          (node.selfEdges || []).forEach(selfEdge => {
            util$1.addDummyNode(g, "selfedge", {
              width: selfEdge.label.width,
              height: selfEdge.label.height,
              rank: node.rank,
              order: i + (++orderShift),
              e: selfEdge.e,
              label: selfEdge.label
            }, "_se");
          });
          delete node.selfEdges;
        });
      });
    }

    function positionSelfEdges(g) {
      g.nodes().forEach(v => {
        var node = g.node(v);
        if (node.dummy === "selfedge") {
          var selfNode = g.node(node.e.v);
          var x = selfNode.x + selfNode.width / 2;
          var y = selfNode.y;
          var dx = node.x - x;
          var dy = selfNode.height / 2;
          g.setEdge(node.e, node.label);
          g.removeNode(v);
          node.label.points = [
            { x: x + 2 * dx / 3, y: y - dy },
            { x: x + 5 * dx / 6, y: y - dy },
            { x: x +     dx    , y: y },
            { x: x + 5 * dx / 6, y: y + dy },
            { x: x + 2 * dx / 3, y: y + dy }
          ];
          node.label.x = node.x;
          node.label.y = node.y;
        }
      });
    }

    function selectNumberAttrs(obj, attrs) {
      return util$1.mapValues(util$1.pick(obj, attrs), Number);
    }

    function canonicalize(attrs) {
      var newAttrs = {};
      if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => {
          if (typeof k === "string") {
            k = k.toLowerCase();
          }

          newAttrs[k] = v;
        });
      }
      return newAttrs;
    }

    let util = util$d;
    let Graph = graphlib.Graph;

    var debug = {
      debugOrdering: debugOrdering
    };

    /* istanbul ignore next */
    function debugOrdering(g) {
      let layerMatrix = util.buildLayerMatrix(g);

      let h = new Graph({ compound: true, multigraph: true }).setGraph({});

      g.nodes().forEach(v => {
        h.setNode(v, { label: v });
        h.setParent(v, "layer" + g.node(v).rank);
      });

      g.edges().forEach(e => h.setEdge(e.v, e.w, {}, e.name));

      layerMatrix.forEach((layer, i) => {
        let layerV = "layer" + i;
        h.setNode(layerV, { rank: "same" });
        layer.reduce((u, v) => {
          h.setEdge(u, v, { style: "invis" });
          return v;
        });
      });

      return h;
    }

    var version = "1.1.8";

    /*
    Copyright (c) 2012-2014 Chris Pettitt

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    */

    var dagre = {
      graphlib: graphlib,

      layout: layout_1,
      debug: debug,
      util: {
        time: util$d.time,
        notime: util$d.notime
      },
      version: version
    };

    class DirectedGraphPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let node = this._outputVars[0].element,
                nodeColls = getPeers(node.parent);

            for (let nodeColl of nodeColls) {
                let layout = nodeColl.layout;
    			if (!layout) continue;
                let netData = getNetwork(nodeColl.children[0]);
                if (!netData) continue;

                var g = new dagre.graphlib.Graph();
                g.setGraph({edgesep: layout.edgeSep, nodesep: layout.nodeSep, ranksep: layout.rankSep});
                g.setDefaultEdgeLabel(function() { return {}; });
                g.graph().rankdir = this._getDagreDirection(layout.direction);

                //in case the node ids in the input graph file are integers
                let nodeIdHash = new Map();
                for (let n of nodeColl.children) {
                    let id = n.datum[MSCNodeID];
                    nodeIdHash.set(id, id + "");
                    g.setNode(id, { label: n.text ? n.text : "", width: n.bounds.width, height: n.bounds.height });
                }
                for (let l of netData.linkList) {
                    g.setEdge(l.source, l.target);
                }
                dagre.layout(g);

                const nid2pos = {};
                let t = d3.min(g.nodes().map(d => g.node(d).y)), l = d3.min(g.nodes().map(d => g.node(d).x));
                let dx = layout.left - l, dy = layout.top - t;
                for (const id of g.nodes()) {
                    nid2pos[id] = { x: g.node(id).x + dx, y: g.node(id).y + dy };
                }

                for (let nodeMk of nodeColl.children) {
                    let nid = nodeMk.datum[MSCNodeID],
                        dx = nid2pos[nodeIdHash.get(nid)].x - nodeMk.x,
                        dy = nid2pos[nodeIdHash.get(nid)].y - nodeMk.y;
                    translateElement(nodeMk, dx, dy);
                }
            }

            let lm = getLeafMarks(node, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }

        _getDagreDirection(d) {
            switch (d) {
                case LinearDirection.Left2Right:
                    return "LR";
                case LinearDirection.Right2Left:
                    return "RL";
                case LinearDirection.Top2Bottom:
                    return "TB";
                case LinearDirection.Bottom2Top:
                    return "BT";
            }
        }
    }

    class TidyTreePlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let node = this._outputVars[0].element,
                nodeColls = getPeers(node.parent);
            
            for (let nodeColl of nodeColls) {
                let layout = nodeColl.layout;
    			if (!layout) continue;
                let tree = getTree(nodeColl.children[0]);
                if (!tree) continue;

                let hierarchy = d3__namespace.hierarchy(tree._data);
                let wd = Math.max(...nodeColl.children.map(d => d.bounds.width)), ht = Math.max(...nodeColl.children.map(d => d.bounds.height));
                let size = layout.orientation == LayoutOrientation.HORIZONTAL ? [layout.height, layout.width] : [layout.width, layout.height];
                let d3Tree = d3__namespace.tree().nodeSize([wd, ht]).size(size)(hierarchy);
                this._apply(d3Tree, layout, nodeColl);
            }
            propagateBoundsUpdate(node);
        }

        _apply(d3Tree, layout, coll) {
            let mark = coll.children.filter(d => d.datum[MSCNodeID] == d3Tree.data[MSCNodeID])[0];
            let x, y;
            switch (layout.orientation) {
                case LayoutOrientation.HORIZONTAL:
                    x = d3Tree.y + layout.left;
                    y = d3Tree.x + layout.top;
                    break;
                case LayoutOrientation.VERTICAL:
                    x = d3Tree.x + layout.left;
                    y = layout.top + d3Tree.y;
                    break;
            }

            translateElement(mark, x - mark.x, y - mark.y);
            
            if (d3Tree.children && d3Tree.children.length > 0) {
                for (let c of d3Tree.children)
                    this._apply(c, layout, coll);
            }
        }

    }

    class TreemapPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let elem = this._outputVars[0].element;
            let group = this._inputVars.filter(d => d.type === VarType.PROPERTY && d.property === Properties.CHILDREN_ORDER)[0].element, 
                layout = group.layout;
            let w = layout.width ? layout.width : group.bounds.width,
                h = layout.height ? layout.height : group.bounds.height,
                top = layout.top === undefined ? group.bounds.top : layout.top,
                left = layout.left === undefined ? group.bounds.left : layout.left;
            let hierarchy = d3__namespace.hierarchy((group)).sum(d => d.type === ElementType.Rect ? d.width * d.height : 0);
            d3__namespace.treemap().size([w,h])(hierarchy);
            this._apply(hierarchy, left, top);

            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }

        _apply(node, left, top) {
            if (node.data.type == ElementType.Collection && node.children) {
                for (let c of node.children)
                    this._apply(c, left, top);
            } else if (node.data.type == ElementType.Rect) {
                node.data.resize(node.x1 - node.x0, node.y1 - node.y0);
                //console.log(node.data.id, node.x1 - node.x0, node.y1 - node.y0);
                //console.log(node.data.id, node.x0 + left - node.data.bounds.left, node.y0 + top - node.data.bounds.top);
                translateElement(node.data, node.x0 + left - node.data.left, node.y0 + top - node.data.top);
            }
        }
    }

    class StrataPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let node = this._outputVars[0].element,
                nodeColls = getPeers(node.parent);
            
            for (let nodeColl of nodeColls) {
                let layout = nodeColl.layout;
                if (!layout) continue;
                if (nodeColl.children.length === 0) continue;
                let tree = getTree(nodeColl.children[0]);
                if (!tree) continue;

                let nodeId2mark = {};
                for (let elem of nodeColl.children) {
                    nodeId2mark[elem.datum[MSCNodeID]] = elem;
                }
                
                // let rootMark = nodeColl.children[0];
                // console.log(rootMark)

                if (nodeColl.children[0].type === ElementType.Rect) {
                    this._layoutRects(tree.getRoot(), tree, nodeId2mark);
                } else { //if (rootMark.type === ElementType.Circle || rootMark.type === ElementType.Ring) {
                    this._layoutArcs(tree.getRoot(), tree, nodeId2mark);
                }
            }

            propagateBoundsUpdate(node);
        }

        _layoutArcs(node, tree, node2mark) {
    		let childrenNodes = tree.getChildren(node);
    		if (childrenNodes.length === 0) return;
    		let parentMark = node2mark[node[MSCNodeID]];
    		let startAngle = parentMark && (parentMark.type == ElementType.Arc || parentMark.type == ElementType.Pie) ? parentMark.startAngle : 60;
    		for (let i = 0; i < childrenNodes.length; i++) {
    			let cn = childrenNodes[i],
    				mark = node2mark[cn[MSCNodeID]];
    			if (mark.type === ElementType.Arc) {
                    let temp = normalizeAngle(startAngle + mark.angle);
                    // console.log(mark.dataScope.getFieldValue("event_attribute"), mark.startAngle, mark.endAngle, mark.angle);
    				mark.setAngles(startAngle, temp);
    				startAngle = temp; 
    			}
    			this._layoutArcs(cn, tree, node2mark);
    		}
            //console.log("-------------");
    	}

        _layoutRects(node, tree, node2mark) {
            let childrenNodes = tree.getChildren(node);
    		if (childrenNodes.length === 0) return;
    		let parentMark = node2mark[node[MSCNodeID]];
            let x, y;
            switch (this._direction) {
                case LinearDirection.Top2Bottom:
                default:
                    x = parentMark.left;
                    y = parentMark.bottom;
                    break;
            }
    		for (let i = 0; i < childrenNodes.length; i++) {
    			let cn = childrenNodes[i],
    				mark = node2mark[cn[MSCNodeID]];
    			
                translateElement(mark, x - mark.left , y - mark.top);
                x += mark.width; 
                this._layoutRects(cn, tree, node2mark);
    		}
        }
    }

    class TargetEvaluator extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let condResultVar = this.outputVar;
            condResultVar.clearResult();
            
            let evtCtxVar = this.inputVars.find(d => d.context !== undefined),
                condEnc = condResultVar.conditionalEncoding,
                evtCtx = evtCtxVar ? evtCtxVar.context : undefined,
                stateCtx = getScene(condEnc.responderComponent).state,
                evalResult = condResultVar.result;
            //evalResult.clear();
            //let time = performance.now();
            if (condEnc.evalFunction) {
                let peers = condEnc.getResponderPeers();
                // Coerce to boolean so falsy-but-not-false returns (e.g. `undefined && x`)
                // are stored as false rather than undefined, keeping them distinct from
                // "evaluator hasn't run yet" (which stays undefined → treated as pass-through).
                peers.forEach((mark) => evalResult[mark.id] = !!condEnc.evalFunction(evtCtx, stateCtx, mark));
                //console.log(Object.keys(evalResult).length + " condition results evaluated.");
            }
            //console.log(`TargetEvaluator ran in ${(performance.now() - time).toFixed(3)}ms`);
        }

    }

    class CircularPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();

            let elem = this._outputVars[0].element,
                elemColls = getPeers(elem.parent);

            for (let coll of elemColls) {
                let layout = coll.layout;
    			if (!layout) continue;

                let angle = 360/coll.children.length;
                for (let [i, elem] of coll.children.entries()) {
                    translateElement(elem, layout.x + layout.radius - elem.bounds.x, layout.y - elem.bounds.y);
                    elem._rotate = [i * angle, layout.x, layout.y];
                }
            }
            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }
    }

    class ClusterPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();

            let elem = this._outputVars[0].element,
                elemColls = getPeers(elem.parent);

            for (let coll of elemColls) {
                let layout = coll.layout;
    			if (!layout) continue;
                
                let root = layout._tree ? layout._tree._data : getTree(coll.children[0])._data;
                let d3Root = d3__namespace.hierarchy(root);

                if (layout.isRadial()) {
                    const tree = d3__namespace.cluster().size([degree2radian(layout.angleExtent), layout.radius]);
                    d3Root = tree(d3Root);

                    layout._d3Root = d3Root;

                    const map = new Map(d3Root.descendants().map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    for (let elem of coll.children) {
                        let id = elem.datum[MSCNodeID];
                        translateElement(elem, layout.x - elem.bounds.x, layout.y - map.get(id)[1] - elem.bounds.y);
                        elem._rotate = [radian2degree(map.get(id)[0]), layout.x, layout.y];
                    }
                } else if (layout.orientation === LayoutOrientation.VERTICAL) {
                    layout.width ? layout.width : 800;
                        let ht = layout.height ? layout.height : 600;
                    const tree = d3__namespace.cluster().nodeSize([elem.bounds.width+1, ht/(d3Root.height + 1)]);
                    
                    d3Root = tree(d3Root);
                    layout._d3Root = d3Root;

                    const map = new Map(d3Root.descendants().map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    let x0 = Infinity;
                    let x1 = -x0;
                    d3Root.each(d => {
                        if (d.x > x1) x1 = d.x;
                        if (d.x < x0) x0 = d.x;
                    });
                    layout._x0 = x0; 

                    for (let elem of coll.children) {
                        let id = elem.datum[MSCNodeID];
                        translateElement(elem, map.get(id)[0] - x0 + layout.left - elem.bounds.x, map.get(id)[1] + layout.top - elem.bounds.y);
                    }
                } else if (layout.orientation === LayoutOrientation.HORIZONTAL) {
                    layout.width ? layout.width : 800;
                        let ht = layout.height ? layout.height : 600;
                    const tree = d3__namespace.cluster().nodeSize([elem.bounds.height, ht/(d3Root.height + 1)]);
                    
                    d3Root = tree(d3Root);
                    layout._d3Root = d3Root;

                    const map = new Map(d3Root.descendants().map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    let x0 = Infinity;
                    let x1 = -x0;
                    d3Root.each(d => {
                        if (d.x > x1) x1 = d.x;
                        if (d.x < x0) x0 = d.x;
                    });

                    layout._x0 = x0; 

                    for (let elem of coll.children) {
                        let id = elem.datum[MSCNodeID];
                        translateElement(elem, map.get(id)[1] + layout.left - elem.bounds.x, map.get(id)[0] - x0  + layout.top - elem.bounds.y);
                    }
                }
                
            }

            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
        }
    }

    class EvtCtxVar extends Variable {

        constructor(type, cond) {
            super(type);
            this._cond = cond;
        }

        get context() {
            return this._cond;
        }

        // get conditionalEncoding() {
        //     return this._condEnc;
        // }

    }

    class TargetUpdater extends OneWayDependency {

        constructor(opType, fn, compnt) {
            super(opType);
            this._fn = fn;
            this._compnt = compnt;
        }

        run() {
            super.run();
            let evtCtxVar = this.inputVars.find(d => d instanceof EvtCtxVar),
                evtCtx = evtCtxVar ? evtCtxVar.context : undefined;
            let scene = getScene(this._compnt);
            this._fn(undefined, evtCtx, scene ? scene.state : undefined, this._compnt);
            if (scene) {
                for (let v of this._outputVars) {
                    // Only cascade manually for spec objects (e.g. BinningSpecification).
                    // Scene elements handle onChange internally via setProperty.js / update().
                    let elem = v.element || v.stateContext;
                    if (!elem || !elem._scene) continue;
                    if (v.type === VarType.CHANNEL)
                        scene.onChange(VarType.CHANNEL, v.channel, elem);
                    else if (v.type === VarType.PROPERTY)
                        scene.onChange(VarType.PROPERTY, v.property, elem);
                    else if (v.type === VarType.STATE)
                        scene.onChange(VarType.STATE, v.key, v.stateContext);
                }
            }
        }
    }

    class AttributeVar extends Variable {
        constructor(type, attr, dataset, encoding = null) {
            super(type);
            this._attribute = attr;
            this._dataset = dataset;
            this._encoding = encoding; // null for standalone vars (binning/KDE); set for encoding-specific vars
        }

        get attribute() {
            return this._attribute;
        }

        get dataset() {
            return this._dataset;
        }

        get encoding() {
            return this._encoding;
        }
    }

    class DataExtractor extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let outVar = this.outputVar,
                // baseEnc = outVar.encodings[0],
                inputAttrVar = this.inputVars.find(d => d instanceof AttributeVar);
            let attrType = outVar.encodings[0].dataTable.type(inputAttrVar.attribute);
            // attribute = inputAttrVar.attribute,
                
            
            let allValues = {};
            for (let enc of outVar.encodings) {
                let attrValues = this._computeAttrValues(enc, attrType); 
                Object.assign(allValues, attrValues);
                //allValues = allValues.concat(attrValues);
            }         

            outVar.attrValues = allValues;
        }

        _computeAttrValues(enc, attrType) {
            if (enc.element.type === "vertex")
                return this._computeVertexIndexAttrValues(enc, attrType);

            let elems = getPeers(enc.element);
            // if (isMark(enc.element))
            //     elems = elems.filter(d => d.visibility === "visible");
            // else if (enc.element.type === "vertex" || enc.element.type === "segment")
            //     elems = elems.filter(d => d.parent.visibility === "visible");
            let attrValues = {}; //attrValues is a dict so that we can freely sort the elements in a collection and look up their corresponding values when encoding
            
            if (enc.element.type === ElementType.Area && ["width", "height", "fillGradient"].indexOf(enc.channel) >= 0) {
                for (let elem of elems) {
                    for (let i = 0; i < elem._vertices.length; i++) {
                        attrValues[getVertexId(elem, i)] = elem._vertices.hasDataScope(i) ?
                            elem._vertices.aggregateDataScopeAttribute(i, enc.attribute, enc.aggregator) :
                            aggregateScopeAttribute(elem.dataScope, enc.attribute, enc.aggregator);
                    }
                }
            } else {
                switch (attrType) {
                    case AttributeType.Boolean:
                        break;
        
                    case AttributeType.Date:
                        for (let elem of elems) {
                            attrValues[elem.id] = getScopeAttrVal(elem.dataScope, enc.attribute);
                        }
                        break;
        
                    case AttributeType.String:
                        try {
                            if (enc.aggregator == "count") {
                                for (let elem of elems) {
                                    attrValues[elem.id] = getScopeAttributeValues(elem.dataScope, enc.attribute).length;
                                }
                            } else {
                                // attrValues = dataScopes.map(d => d.getAttrVal(enc.attribute));
                                for (let elem of elems) {
                                    attrValues[elem.id] = getScopeAttrVal(elem.dataScope, enc.attribute);
                                }
                            }
                        } catch (error) {
                            throw new Error("Cannot bind " + this.channel + " to " + enc.attribute + " : " + error);
                        }
                        break;
        
                    default: //integer or number
                        // attrValues = dataScopes.map(d => d.aggregateNumericalAttribute(enc.attribute, enc.aggregator));
                        if (enc.attribute.startsWith("parent.") || enc.attribute.startsWith("child.")) {
                            let dt = enc.dataTable.tree.nodeTable;
                            let s = enc.attribute.split(".")[0], f = enc.attribute.split(".")[1];
                            for (let elem of elems) {
                                let nodeId = getScopeAttrVal(elem.dataScope, s);
                                attrValues[elem.id] = getScopeAttrVal(crossScopeRef(fullTableScopeRef(dt), MSCNodeID, nodeId), f);
                            }
                        } else {
                            for (let elem of elems) {
                                attrValues[elem.id] = aggregateScopeAttribute(elem.dataScope, enc.attribute, enc.aggregator);
                            }
                        }
                        break;
                }
            }

            enc.attrValues = attrValues;
            return attrValues;
            //return Object.values(attrValues);
        }

        _computeVertexIndexAttrValues(enc, attrType) {
            let attrValues = {};
            for (let elemGroup of enc.elementGroups) {
                for (let group of elemGroup.groups) {
                    for (let index of group.indices) {
                        let id = getVertexId(group.parent, index);
                        attrValues[id] = this._computeVertexIndexValue(group.parent, index, enc, attrType);
                    }
                }
            }
            enc.attrValues = attrValues;
            return attrValues;
        }

        _getVertexIndexContext(parent, index, id) {
            let context = {
                type: "vertex",
                parent,
                index,
                _index: index,
                id
            };
            Object.defineProperty(context, "dataScope", {
                get() {
                    return parent._vertices.hasDataScope(index) ? parent._vertices.getDataScopeRef(index) : parent.dataScope;
                }
            });
            Object.defineProperty(context, "datum", {
                get() {
                    return getScopeDatum(context.dataScope);
                }
            });
            Object.defineProperty(context, "data", {
                get() {
                    return getScopeRows(context.dataScope);
                }
            });
            return context;
        }

        _computeVertexIndexValue(parent, index, enc, attrType) {
            if (!parent._vertices.hasDataScope(index))
                return this._computeValue(parent.dataScope, enc, attrType);
            if (enc.attribute.startsWith("parent.") || enc.attribute.startsWith("child."))
                return this._computeValue(parent._vertices.getDataScopeRef(index), enc, attrType);

            switch (attrType) {
                case AttributeType.Boolean:
                    return undefined;
                case AttributeType.Date:
                    return parent._vertices.getDataScopeAttrVal(index, enc.attribute);
                case AttributeType.String:
                    return enc.aggregator == "count" ?
                        parent._vertices.getDataScopeAttributeValues(index, enc.attribute).length :
                        parent._vertices.getDataScopeAttrVal(index, enc.attribute);
                default:
                    return parent._vertices.aggregateDataScopeAttribute(index, enc.attribute, enc.aggregator);
            }
        }

        _computeValue(ds, enc, attrType) {
            switch (attrType) {
                case AttributeType.Boolean:
                    return undefined;
                case AttributeType.Date:
                    return getScopeAttrVal(ds, enc.attribute);
                case AttributeType.String:
                    return enc.aggregator == "count" ? getScopeAttributeValues(ds, enc.attribute).length : getScopeAttrVal(ds, enc.attribute);
                default:
                    if (enc.attribute.startsWith("parent.") || enc.attribute.startsWith("child.")) {
                        let dt = enc.dataTable.tree.nodeTable,
                            s = enc.attribute.split(".")[0],
                            f = enc.attribute.split(".")[1],
                            nodeId = getScopeAttrVal(ds, s);
                        return getScopeAttrVal(crossScopeRef(fullTableScopeRef(dt), MSCNodeID, nodeId), f);
                    }
                    return aggregateScopeAttribute(ds, enc.attribute, enc.aggregator);
            }
        }

    }

    class StateVar extends Variable {
        constructor(type, key, stateContext) {
            super(type);
            this._key = key;
            this._stateContext = stateContext;
        }

        get key() {
            return this._key;
        }

        get stateContext() {
            return this._stateContext;
        }
    }

    class DependencyGraph {

        constructor() {
            this._variables = {};
            this._operators = {};
            this._edges = [];
        }

        toJSON() {
            const edges = this._edges.map(edge => ({
                //params from Edge.js constructor
                from: edge.fromNode.id,
                to: edge.toNode.id,
                isDirected: edge.isDirected,
            }));

            const variables = {};
            for (const type in this._variables) {
                variables[type] = Object.values(this._variables[type]).map(variable => {
                    let varData = {
                        id: variable.id,
                        type: variable.type,
                        incoming: variable.incomingEdges.map(edge => edge.id),
                        outgoing: variable.outgoingEdges.map(edge => edge.id),
                        undirected: variable.undirectedEdges.map(edge => edge.id),
                    };

                    // Additional params based on variable type
                    if (variable.type === 'ChannelVar') {
                        varData.channel = variable.channel;
                        varData.element = variable.element;
                    } else if (variable.type === 'BoundsVar' || variable.type === 'DataScopeVar') {
                        varData.element = variable.element;
                    } else if (variable.type === 'dataValue') {
                        varData.scale = variable.scale;
                        varData.attrValues = variable.attrValues;
                    } else if (variable.type === 'FieldVar') {
                        varData.field = variable.field;
                        varData.dataset = variable.dataset;
                    } else if (variable.type === 'PropertyVar') {
                        varData.property = variable.property;
                        varData.element = variable.element;
                    } else if (variable.type === VarType.STATE) {
                        varData.key = variable.key;
                    // } else if (variable.type === 'RangeExtentVar' || variable.type === 'RangeStartVar') {
                    //     varData.scale = variable.scale;
                    //     varData.initialized = variable.initialized;
                    //     varData.element = variable.element;
                    } else { //ScaleVar
                        varData.scale = variable.scale;
                    }
                    return varData;
                });
            }

            const operators = {};
            for (const type in this._operators) {
                operators[type] = Object.values(this._operators[type]).map(operator => {
                    let operatorData = {
                        id: operator.id,
                        type: operator.type,
                        inputVars: operator.inputVars.map(variable => variable.id),
                        outputVar: operator.outputVar ? operator.outputVar.id : null,
                    };

                    // Additional params based on operator type
                    if (operator.type === OpType.DOMAIN_BUILDER) {
                        operatorData.aggregator = operator.aggregator;
                    } else if (operator.type === OpType.SCALE_BUILDER) {
                        operatorData.channel = operator.channel;
                    }

                    return operatorData;
                });
            }

            return {
                edges,
                variables,
                operators,
            };
        }

        getVariable(type, ...params) {
            if (Object.values(VarType).indexOf(type) < 0) {
                console.log(type);
                throw new Error('Variable Type Not Known');
            }
            let v = this.findVariable(type, params);
            if (v) return v;
            switch (type) {
                case VarType.CHANNEL:
                    v = new ChannelVar(type, params[0], params[1]);
                    if (params[1].type == "vertex" || params[1].type == "segment") {
                        this._connectPathElement2Size(params[1], v);
                    }
                    break;
                case VarType.PROPERTY:
                    v = new PropertyVar(type, params[0], params[1]);
                    break;
                case VarType.STATE:
                    v = new StateVar(type, params[0], params[1]);
                    break;
                case VarType.ATTRIBUTE:
                    v = new AttributeVar(type, params[0], params[1], params[2] || null);
                    break;
                case VarType.ITEMS:
                    v = new ItemsVar(type, params[0]);
                    break;
                // case VarType.DOMAIN:
                //     v = new DomainVar(type, params[0]);
                //     break;
                case VarType.ATTR_VALUE:
                    v = new AttrValueVar(type, params[0]);
                    break;
                case VarType.DATASCOPE:
                    v = new DataScopeVar(type, params[0]);
                    break;
                case VarType.BOUNDS:
                    v = new BoundsVar(type, params[0]);
                    break;
                case VarType.SCALE:
                    v = new ScaleVar(type, params[0]);
                    break;
                case VarType.AFFIXATION:
                    v = new AffixationVar(type, params[0]);
                    break;
                case VarType.ALIGNMENT:
                    v = new AlignmentVar(type, params[0]);
                    break;
                case VarType.EVT_CTX:
                    v = new EvtCtxVar(type, params[0], params[1]);
                    break;
                case VarType.CONDITION_RESULT:
                    v = new ConditionResultVar(type, params[0]);
                    break;
            }
            if (!(type in this._variables))
                this._variables[type] = {};
            this._variables[type][v.id] = v;
            return v;
        }

        _connectPathElement2Size(elem, channelVar) {
            let mk = elem.parent,
                channel = channelVar.channel,
                bv = this.findVariable(VarType.CHANNEL, [channel === "x" ? "width" : "height", mk]);
            if (bv) {
                let op = bv.incomingDataflow;
                if (!op) {
                    op = this.createOneWayDependency(OpType.CONDUIT);
                }
                this.connect(channelVar, op);
                this.connect(op, bv);
            }
        }

        findIncomingDataflowOperator(type, variable) {
            if (variable.incomingDataflow && variable.incomingDataflow.type === type) {
                //console.log("found");
                return variable.incomingDataflow;
            } else {
                return undefined;
            }
        }

        //TODO: handle params 
        getIncomingDataflowOperator(type, variable) {
            let op = this.findIncomingDataflowOperator(type, variable);
            if (op) {
                return op;
            } else
                return this.createOneWayDependency(type);
        }

        getOutgoingDataflowOperator(type, variable) {
            for (let e of variable.outgoingEdges) {
                if (e.toNode instanceof OneWayDependency && e.toNode.type === type)
                    return e.toNode;
            }
            return this.createOneWayDependency(type);
        }

        // createDataflowOperator(type, input, output) {
        //     if (Object.values(OpType).indexOf(type) < 0)
        //         throw new Error('Operator Type Not Known');
        //     let op = new Dataflow(type, input, output);
        //     if (!(type in this._operators))
        //         this._operators[type] = {}
        //     this._operators[type][op.id] = op;
        //     return op;
        // }

        createOneWayDependency(type, ...params) {
            // console.log("creating", type, params);
            if (Object.values(OpType).indexOf(type) < 0)
                throw new Error('Dependency Type Not Known');
            let op;
            switch (type) {
                case OpType.EVAL_BBOX:
                    op = new BoundsEvaluator(type);
                    break;
                case OpType.AFFIXER:
                    op = new Affixer(type);
                    break;
                // case OpType.DOMAIN_BUILDER:
                //     op = new DomainBuilder(type, params[0]);
                //     break;
                case OpType.DATA_EXTRACTOR:
                    op = new DataExtractor(type, params[0]);
                    break;
                case OpType.SCALE_BUILDER:
                    op = new ScaleBuilder(type, params[0]);
                    break;
                case OpType.ENCODER:
                    op = new Encoder(type, params[0]);
                    break;
                case OpType.AXIS_PATH_PLACER:
                    op = new AxisUpdater(type);
                    break;
                case OpType.AXIS_TICKS_PLACER:
                    op = new AxisTicksPlacer(type);
                    break;
                case OpType.AXIS_LABELS_PLACER:
                    op = new AxisLabelsPlacer(type);
                    break;
                case OpType.AXIS_TITLE_PLACER:
                    op = new AxisTitlePlacer(type);
                    break;
                case OpType.LINK_PLACER:
                    op = new LinkRouter(type);
                    break;
                case OpType.GRID_LAYOUT:
                    op = new GridPlacer(type);
                    break;
                case OpType.STACK_LAYOUT:
                    op = new StackPlacer(type);
                    break;
                case OpType.PACK_LAYOUT:
                    op = new PackPlacer(type);
                    break;
                case OpType.FORCE_LAYOUT:
                    op = new ForcePlacer(type);
                    break;
                case OpType.DIRECTED_LAYOUT:
                    op = new DirectedGraphPlacer(type);
                    break;
                case OpType.TIDY_TREE_LAYOUT:
                    op = new TidyTreePlacer(type);
                    break;
                case OpType.TREEMAP_LAYOUT:
                    op = new TreemapPlacer(type);
                    break;
                case OpType.STRATA_LAYOUT:
                    op = new StrataPlacer(type);
                    break;
                case OpType.CIRCULAR_LAYOUT:
                    op = new CircularPlacer(type);
                    break;
                case OpType.CLUSTER_LAYOUT:
                    op = new ClusterPlacer(type);
                    break;
                case OpType.GRIDLINES_PLACER:
                    op = new GridlinesUpdater(type);
                    break;
                case OpType.BIN_TRANSFORMER:
                    op = new BinTransformer(type);
                    break;
                case OpType.FILTER_TRANSFORMER:
                    op = new FilterTransformer(type);
                    break;
                case OpType.KDE_TRANSFORMER:
                    op = new KdeTransformer(type);
                    break;
                case OpType.CUSTOM_TRANSFORMER:
                    op = new CustomTransformer(type);
                    break;
                case OpType.REPOPULATE:
                    op = new RepopulateOperator(type);
                    break;
                case OpType.TARGET_EVALUATOR:
                    op = new TargetEvaluator(type);
                    break;
                case OpType.TARGET_UPDATER:
                    op = new TargetUpdater(type, params[0], params[1]);
                    break;
                case OpType.CONDUIT:
                default:
                    op = new Conduit(type);
                    break;
            }
            if (!(type in this._operators))
                this._operators[type] = {};
            this._operators[type][op.id] = op;
            return op;
        }

        createMultiWayDependency(type) {
            if (Object.values(OpType).indexOf(type) < 0)
                throw new Error('Dependency Type Not Known');
            let op;
            switch (type) {
                case OpType.ALIGNER:
                default:
                    op = new Aligner(type);
                    break;
            }
            if (!(type in this._operators))
                this._operators[type] = {};
            this._operators[type][op.id] = op;
            return op;
        }

        connect(fromNode, toNode, isDirected = true) {
            if (fromNode instanceof Variable && toNode instanceof OneWayDependency) {
                if (!toNode.inputVars.includes(fromNode)) {
                    const edge = new Edge(fromNode, toNode, isDirected);
                    this._edges.push(edge);
                    fromNode.outgoingEdges.push(edge);
                    toNode.inputVars.push(fromNode);
                    return edge;
                }
            } else if (fromNode instanceof OneWayDependency && toNode instanceof Variable) {
                if (!fromNode.outputVars.includes(toNode)) {
                    const edge = new Edge(fromNode, toNode, isDirected);
                    this._edges.push(edge);
                    fromNode.outputVars.push(toNode); // = toNode;
                    toNode.incomingEdges.push(edge);
                    return edge;
                }
            } else if (fromNode instanceof Variable && toNode instanceof MultiWayDependency) {
                if (!toNode.vars.includes(fromNode)) {
                    const edge = new Edge(fromNode, toNode, false);
                    this._edges.push(edge);
                    toNode.vars.push(fromNode); // = toNode;
                    toNode.edges.push(fromNode);
                    fromNode.undirectedEdges.push(edge);
                    return edge;
                }
            } else if (fromNode instanceof MultiWayDependency && toNode instanceof Variable) {
                if (!fromNode.vars.includes(toNode)) {
                    const edge = new Edge(toNode, fromNode, false);
                    this._edges.push(edge);
                    fromNode.vars.push(toNode); // = toNode;
                    fromNode.edges.push(toNode);
                    toNode.undirectedEdges.push(edge);
                    return edge;
                }
            } else {
                throw new Error("An edge must connect a variable and an operator.");
            }
        }

        disconnectChannelVarFromBBoxOperator(chnlVar) {
            let bbox = this.getOutgoingDataflowOperator(OpType.EVAL_BBOX, chnlVar),
                e = chnlVar.outgoingEdges.find(d => d.fromNode === chnlVar && d.toNode === bbox);
            if (e) {
                this.disconnect(chnlVar, bbox, e);
            }
        }

        disconnect(fromNode, toNode, edge) {
            if (fromNode instanceof Variable && toNode instanceof OneWayDependency) {
                let edgeIdx = fromNode.outgoingEdges.findIndex(d => d === edge);
                if (edgeIdx >= 0) {
                    this._edges.splice(this._edges.indexOf(edge), 1);
                    fromNode.outgoingEdges.splice(edgeIdx, 1);
                }
                let vIdx = toNode.inputVars.findIndex(d => d == fromNode);
                if (vIdx >= 0) {
                    toNode.inputVars.splice(vIdx, 1);
                }
            } else if (fromNode instanceof OneWayDependency && toNode instanceof Variable) {
                let edgeIdx = toNode.incomingEdges.findIndex(d => d === edge);
                if (edgeIdx >= 0) {
                    this._edges.splice(this._edges.indexOf(edge), 1);
                    toNode.incomingEdges.splice(edgeIdx, 1);
                }
                let vIdx = fromNode.outputVars.findIndex(d => d === toNode);
                if (vIdx >= 0) {
                    fromNode.outputVars.splice(vIdx, 1);
                }
            }
        }

        deleteVariable(v) {
            //delete edges first
            for (let i = v.incomingEdges.length - 1; i >= 0; i--) {
                let e = v.incomingEdges[i], fn = e.fromNode;
                this.disconnect(fn, v, e);
                if (fn.isIsolated())
                    delete this._operators[fn.type][fn.id];    
            }
            for (let i = v.outgoingEdges.length - 1; i >= 0; i--) {
                let e = v.outgoingEdges[i], tn = e.toNode;
                this.disconnect(v, tn, e);
                if (tn.isIsolated())
                    delete this._operators[tn.type][tn.id];    
            }
            //delete variable
            delete this._variables[v.type][v.id];
        }

        deleteOperator(op) {
            for (let i = op.outputVars.length - 1; i >= 0; i--) {
                let v = op.outputVars[i],
                    e = v.incomingEdges.find(d => d.fromNode === op && d.toNode === v);
                //console.log(v);
                this.disconnect(op, v, e);
                if (v.isIsolated())
                    delete this._variables[v.type][v.id];
            }
            for (let i = op.inputVars.length - 1; i >= 0; i--) {
                let v = op.inputVars[i],
                    e = v.outgoingEdges.find(d => d.fromNode === v && d.toNode === op);
                this.disconnect(v, op, e);
                if (v.isIsolated())
                    delete this._variables[v.type][v.id];
            }
            delete this._operators[op.type][op.id];
        }

        // createOperator(type, ...params) {
        //     if (Object.values(OpType).indexOf(type) < 0)
        //         throw new Error('Operator Type Not Known');
        //     let op;
        //     switch(type) {
        //         case OpType.ENCODER:
        //             if ((params[0] == "x" || params[0] == "y") && isMark(params[1]))
        //                 op = new MarkPosEncoder(params[0], params[1]);
        //             break;
        //         case OpType.LAYOUT:
        //             break;
        //         case OpType.CONSTRAINT:
        //             break;
        //         default:
        //             break;
        //     }
        //     if (!(type in this._operators))
        //         this._operators[type] = {}
        //     this._operators[type][op.id] = op;
        //     return op;
        // }

        /**
         * 
         * @param {object} def: 
         */
        addInteraction(def) {

        }

        _dfs(currentVar, path, results) {
            //path.push(currentVar);
            if (!currentVar || currentVar.outgoingEdges.length === 0) {
                results.push(path);
            } else {
                for (let e of currentVar.outgoingEdges) {
                    if (e.isDirected) {
                        path.push(e.toNode);
                        this._dfs(e.toNode.outputVars[0], path.slice(), results);
                    }
                }
            }
        }

        // getPropagationPaths(varType, ...params) {
        //     let v = this.findVariable(varType, params);
        //     if (!v)
        //         throw new Error('Unable to find variables matching the described change');
        //     let results = [];
        //     this._dfs(v, [], results);
        //     return results;
        // }

        getOperatorsOnPath(varType, oneWays, multiways, ...params) {
            let v = this.findVariable(varType, params);
            if (!v) {
                console.warn('Unable to find variables matching the described change: ', varType, params);
                return;
            }
            for (let e of v.outgoingEdges) {
                if (e.isDirected) {
                    let dfOp = e.toNode;

                    // Keep oneWays in dependency order by re-appending an existing operator.
                    let existingIndex = oneWays.indexOf(dfOp);
                    if (existingIndex !== -1) {
                        oneWays.splice(existingIndex, 1);
                    }
                    oneWays.push(dfOp);

                    // Follow ALL output vars so operators with multiple outputs
                    // (e.g. RepopulateOperator → DataScopeVar(path) + DataScopeVar(vertex),
                    //  or layout operators → ChannelVar(x) + ChannelVar(y)) propagate correctly.
                    for (let outVar of dfOp.outputVars) {
                        switch (outVar.type) {
                            case VarType.ITEMS:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.dataset);
                                break;
                            case VarType.ATTRIBUTE:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.attribute, outVar.dataset);
                                break;
                            case VarType.DATASCOPE:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.element);
                                break;
                            case VarType.BOUNDS:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.element);
                                break;
                            case VarType.CHANNEL:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.channel, outVar.element);
                                break;
                            case VarType.PROPERTY:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.property, outVar.element);
                                break;
                            case VarType.STATE:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.key, outVar.stateContext);
                                break;
                            case VarType.SCALE:
                            case VarType.ATTR_VALUE:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.encodings[0]);
                                break;
                            case VarType.CONDITION_RESULT:
                                this.getOperatorsOnPath(outVar.type, oneWays, multiways, outVar.conditionalEncoding);
                                break;
                        }
                    }
                }
            }

            for (let e of v.undirectedEdges) {
                multiways.push(e.operator);
            }
        }

        
        // Deprecated: replaced by getOperatorsOnPath + Scene-managed execution.
        // processChange(varType, multiways, ...params) {
        //     // if (Object.values(VarType).indexOf(varType) < 0)
        //     //     throw new Error('Unknown Variable Type: ' + varType);
        //     let v = this.findVariable(varType, params);
        //     if (!v) {
        //         console.warn('Unable to find variables matching the described change: ', varType, params);
        //         return;
        //     }
        //     for (let e of v.outgoingEdges) {
        //         if (e.isDirected) { //TODO: all outgoing edges should be directed
        //             let dfOp = e.toNode;
        //             dfOp.run();
        //             let outVars = dfOp.outputVars;
        //             // ToDo: Need to Refactor and combine with findVaraiable method; the logic is working
        //             if (outVars.length > 0) {
        //                 //TODO: need to handle multiple out vars, e.g., layout operator sets both x and y channel vars
        //                 let outVar = outVars[0];
        //                 switch (outVar.type) {
        //                     case VarType.ITEMS:
        //                         this.processChange(outVar.type, multiways, outVar.predicate, outVar.dataset);
        //                         break;
        //                     case VarType.ATTRIBUTE:
        //                         this.processChange(outVar.type, multiways, outVar.attribute, outVar.dataset);
        //                         break;
        //                     case VarType.BOUNDS:
        //                     // case VarType.ORDER:
        //                         this.processChange(outVar.type, multiways, outVar.element);
        //                         break;
        //                     case VarType.CHANNEL:
        //                         this.processChange(outVar.type, multiways, outVar.channel, outVar.element);
        //                         break;
        //                     case VarType.PROPERTY:
        //                         this.processChange(outVar.type, multiways, outVar.property, outVar.element);
        //                         break;
        //                     case VarType.SCALE:
        //                     case VarType.ATTR_VALUE:
        //                     // case VarType.RANGE_EXTENT:
        //                         this.processChange(outVar.type, multiways, outVar.encodings[0]);
        //                         break;
        //                     case VarType.CONDITION_RESULT:
        //                         this.processChange(outVar.type, multiways, outVar.result);
        //                         break;
        //                 }
        //             }
        //         }
        //     }

        //     for (let e of v.undirectedEdges) {
        //         multiways.push(e.operator);
        //     }
        // }

        findVariable(varType, params) {
            if (!(varType in this._variables))
                return null;
            let vars = Object.values(this._variables[varType]);
            switch (varType) {
                case VarType.CHANNEL:
                    return vars.find(d => d.channel == params[0] && getEncodingKey(d.element) == getEncodingKey(params[1]));
                case VarType.PROPERTY:
                    return vars.find(d => d.property == params[0] && d.element == params[1]);
                case VarType.STATE:
                    return vars.find(d => d.key == params[0] && d.stateContext == params[1]);
                case VarType.AFFIXATION:
                    return vars.find(d => d.affixation == params[0]);
                case VarType.ATTRIBUTE:
                    if (params[2]) {
                        // encoding-specific: exact triple match (one attrVar per encoding)
                        return vars.find(d => d.attribute == params[0] && d.dataset == params[1] && d.encoding === params[2]);
                    } else {
                        // standalone (binning/KDE): only match vars with no encoding
                        return vars.find(d => d.attribute == params[0] && d.dataset == params[1] && !d.encoding);
                    }
                case VarType.ITEMS:
                    return vars.find(d => d.dataset == params[0]);
                case VarType.ATTR_VALUE:
                case VarType.SCALE:
                    return vars.find(d => d.encodings.includes(params[0]));
                case VarType.EVT_CTX:
                    return vars.find(d => d.context === params[0]);
                case VarType.CONDITION_RESULT:
                    return vars.find(d => d.conditionalEncoding == params[0]);
                case VarType.DATASCOPE:
                default:
                    return params[0].classId ? vars.find(d => getEncodingKey(d.element) == getEncodingKey(params[0])) : vars.find(d => d.element.id == params[0].id);
            }
        }

        findVariablesByElement(elem) {
            let results = {};
            for (let varType in this._variables) {
                let vars = Object.values(this._variables[varType]),
                    fv = vars.filter(d => d.element && getEncodingKey(d.element) == getEncodingKey(elem));
                if (fv.length > 0)
                    results[varType] = fv;
            }
            return results;
        }

        // addEdges(...stp) {
        //     for (let p of stp) {
        //         this.addEdge(p[0], p[1]);
        //     }
        // }

        // addEdge(source, target) {
        //     // let e = new Edge(source, target);
        //     // this._edges.push(e);
        //     // if (!(source.id in this._outgoing))
        //     //     this._outgoing[source.id] = [];
        //     // this._outgoing[source.id].push(target.id);

        //     // if (!(target.id in this._incoming))
        //     //     this._incoming[target.id] = [];
        //     // this._incoming[target.id].push(source.id);
        //     if (source instanceof Variable && target instanceof Dataflow) {
        //         source.targetDf = target;
        //     } else if (source instanceof Dataflow && target instanceof Variable) {

        //     }
        // }
    }

    class BinningSpecification {
        constructor(args = {}) {
            this._attribute = args.attribute ?? null;
            this._numBins   = args.numBins   ?? null;
        }

        get attribute()  { return this._attribute; }
        set attribute(v) { this._attribute = v; }

        get numBins()    { return this._numBins; }
        set numBins(v)   { this._numBins = v; }

        // Auto-generated column names for the output bin columns.
        get startAttr()  { return this._attribute + "_bin_start"; }
        get endAttr()    { return this._attribute + "_bin_end"; }
        // Categorical string column used for repeat/encode (zero-padded bin index).
        get binIdAttr()  { return this._attribute + "_bin_id"; }
    }

    class KDESpecification {
        constructor(args = {}) {
            this._attribute    = args.attribute    ?? null;
            this._newAttribute = args.newAttribute ?? null;
            this._groupBy      = args.groupBy      ?? null;
            this._min          = args.min          ?? null;
            this._max          = args.max          ?? null;
            this._interval     = args.interval     ?? null;
            this._bandwidth    = args.bandwidth    ?? null;
        }

        get attribute()    { return this._attribute; }
        set attribute(v)   { this._attribute = v; }

        get newAttribute() { return this._newAttribute; }
        set newAttribute(v){ this._newAttribute = v; }

        get groupBy()      { return this._groupBy; }
        set groupBy(v)     { this._groupBy = v; }

        get min()          { return this._min; }
        set min(v)         { this._min = v; }

        get max()          { return this._max; }
        set max(v)         { this._max = v; }

        get interval()     { return this._interval; }
        set interval(v)    { this._interval = v; }

        get bandwidth()    { return this._bandwidth; }
        set bandwidth(v)   { this._bandwidth = v; }


    }

    class FilterSpecification {
        constructor(args = {}) {
            this._attribute = args.attribute ?? null;
            this._type      = args.type      ?? null;
            this._value     = args.value     ?? null;
        }

        get attribute()  { return this._attribute; }
        set attribute(v) { this._attribute = v; }

        get type()       { return this._type; }
        set type(v)      { this._type = v; }

        get value()      { return this._value; }
        set value(v)     { this._value = v; }


    }

    class CustomTransformSpecification {
        constructor(fn, params) {
            this._fn = fn;
            // Flatten params as direct enumerable properties so dep-graph
            // can track each one via PropertyVar(key, spec).
            if (params) Object.assign(this, params);
        }

        get fn() { return this._fn; }
    }

    function normalizeRefElems(elems) {
        if (!elems || elems.type !== "vertexIndices")
            return elems;
        return Array.from(new Set(elems.groups.map(d => d.parent)));
    }

    class Scene extends Group {

        constructor(args) {
            super();
            this._itemMap = {};
            // this._peerIndex = new Map();
            this._type = ElementType.Scene;
            this._id = args && args.id ? args.id : this._type + generateUniqueID();
            if (args && args.fillColor) {
                this.fillColor = args.fillColor;
            }
            this._encodings = {};
            this._relations = [];
            this._triggers = {};
            this._condEncodings = {};
            this._stateContext = new StateContext(this);
            this._stateContext.__scene__ = this;
            this._depGraph = new DependencyGraph();
            this._renderers = [];
        }

        get depGraph() {
            return this._depGraph;
        }

        get interactionTriggers() {
            return this._triggers;
        }

        getConditionalEncodings(triggerID) {
            return this._condEncodings[triggerID] || [];
        }

        _clearInteractionCaches() {
            for (let triggerID in this._condEncodings) {
                for (let condEnc of this._condEncodings[triggerID])
                    condEnc.clearResponderPeers();
            }
        }

        // state(vals) {
        //     if (vals !== undefined) {
        //         if (typeof vals !== "object" || vals === null || Array.isArray(vals))
        //             throw new Error("scene.state(...) expects an object with key/value pairs");
        //         for (let [k, v] of Object.entries(vals)) {
        //             this._stateContext.set(k, v);
        //         }
        //     }
        //     return this._stateContext;
        // }

        get state() {
            return this._stateContext;
        }

        // _buildPeerIndex() {
        //     this._peerIndex = new Map();
        //     let peerIdx = this._peerIndex;

        //     let visit = (elem) => {
        //         if (elem.classId) {
        //             if (!peerIdx.has(elem.classId)) {
        //                 peerIdx.set(elem.classId, []);
        //             }
        //             peerIdx.get(elem.classId).push(elem);
        //         }
        //         if (elem.children) {
        //             for (let child of elem.children)
        //                 visit(child);
        //         }
        //     };

        //     visit(this);
        // }

        mark(type, param) {
            if (Object.values(PrimitiveMarks).indexOf(type) < 0)
                throw new Error("Mascot does not allow directly creating a " + type);
            let args = param === undefined ? {} : param;
            args.type = type;
            let m = createElement(this, args);
            if (m !== null) {
                m._classId = m.id;
                this.addChild(m);
                this._itemMap[m.id] = m;
                newMarkCreated(m, this._depGraph);
                parentChildConnected(this, m, this._depGraph);
            }
            return m;
        }

        glyph(...args) {
            //TODO: check if param contains valid glyph children
            let temp = [];
            for (let a of args){
                temp.push([a.parent, a]);
            }
            let g = createElement(this, {type: ElementType.Glyph, children: args});
            if (g !== null) {
                g._classId = g.id;
                for (let t of temp)
                    childRemoved(t[0], t[1], this._depGraph);
                newGlyphCreated(g, this._depGraph);
                parentChildConnected(this, g, this._depGraph);
            }
            return g;
        }

        composite() {
            let c = createElement(this, {type: ElementType.Composite});
            if (c !== null) {
                c._classId = c.id;
                this.addChild(c);
                this._itemMap[c.id] = c;
                newCompositeCreated(c, this._depGraph);
                parentChildConnected(this, c, this._depGraph);
            }
            return c;
        }

        _addAttributeEncoding(enc) {
            //console.log(enc);
            let key = getEncodingKey(enc.element);
            if (!(key in this._encodings))
                this._encodings[key] = {};
            this._encodings[key][enc.channel] = enc;
        }

        get tables() {
            let tables = {};
            //get all the collection childrens in the scene
            //TODO: handle composites
            let colls = this.children.filter(d => d.type === ElementType.Collection);

            for (let coll of colls) {
                let dt = coll.dataScope ? getScopeDataTable(coll.dataScope) : null;
                if (dt && !(dt.id in tables)) {
                    tables[dt.id] = dt;
                }
            }
            return tables;
        }

        // activate2(trigger, target, targetEval, efxFunc, animation) {
        //     validateActivateArguments2(trigger, target, targetEval, efxFunc, animation);
            
        //     let event = trigger.event, id = getTriggerID(trigger);
        //     event = event.indexOf("brush") === 0 ? "brush" : event;
        //     if (!(event in this._triggers)) {
        //         this._triggers[event] = {};
        //     }
        //     if (!(id in this._triggers[event]))
        //         this._triggers[event][id] = createTrigger(trigger);
            
        //     this._triggers[event][id]["animation"] = animation;

        //     if ([TriggerType.WIDGET, TriggerType.KEYBOARD].includes(trigger.type)) {
        //         this._triggers[event][id]["callback"] = efxFunc;
        //     } else {
        //         let triggerObj = this._triggers[event][id];
        //         let condEnc = new ConditionalEncoding(triggerObj, target, targetEval, efxFunc);
        //         interactionSpecified(condEnc, target.targetChannels, this._depGraph);
        //         return condEnc;
        //     }
            
        // }

        // activate2(elem, params) {
        //     //TODO: check params
        //     let target = params.target ? params.target : elem,
        //         predicates = params.criteria.map(d => obj2Predicate(d)),
        //         effect = params.effect,
        //         event = params.event;

        //     let condEnc = new ConditionalEncoding(elem, target, predicates, effect);
        //     if (!(event in this._events)) {
        //         this._events[event] = {};
        //     }
        //     if (!(elem.classId in this._events[event]))
        //         this._events[event][elem.classId] = [];
        //     this._events[event][elem.classId].push(condEnc);
        //     //this._events[event][elem.classId] = {"predicates": predicates, "element": target};

        //     interactionSpecified(condEnc, this._depGraph);
        //     return condEnc;
        // }


        /**
         * 
         * @param {*} varType: type of variable: channel, attribute, bounds, datascope, scale, ... 
         * @param {*} newVal: variable value: "x", "y", "radius", etc. for channel, ... 
         * @param {*} compnt: the component that the variable belongs to, e.g., channel/bounds/datascope: element, attribute: dataset
         */
        onChange(varType, ...params) {
            //console.log("on change", varType, params);
            if (Object.values(VarType).indexOf(varType) < 0)
                throw new Error('Unknown Variable Type: ' + varType);
            //console.log("========== triggering change in", varType, params, " ==========");
            let oneWays = [], multiways = [], outVars = [];
            this._depGraph.getOperatorsOnPath(varType, oneWays, multiways, ...params);
            // console.log(varType, params);
            //console.log(oneWays.map(d => d._type));
            let needsFullRender = false;
            for (let op of oneWays) {
                //let startTime = performance.now();
                op.run();
                if (op.needsFullRender) needsFullRender = true;
                outVars = outVars.concat(op.outputVars.filter(d => d.type === VarType.CHANNEL || d.type === VarType.PROPERTY));
                //let endTime = performance.now();
                //let duration = endTime - startTime;
                //console.log(`${op._type} took ${duration.toFixed(3)}ms to run`);
            }
            for (let m of multiways)
                m.run();

            const toUpdate = {};
            for (let v of outVars) {
                let elem = (v.element.type === "vertex" || v.element.type === "segment") ? v.element.parent : v.element;
                if (!(elem.id in toUpdate))
                    toUpdate[elem.id] = [];
                let prop = v.channel || v.property;
                if (!toUpdate[elem.id].includes(prop)) {
                    toUpdate[elem.id].push(prop);
                }
            }
            if (needsFullRender) {
                for (const renderer of this._renderers)
                    renderer._render(this);
                // DOM nodes now exist; apply incremental updates (axis ticks, etc.)
                // that only run via _renderChanges.
                for (const renderer of this._renderers)
                    renderer._renderChanges(this, toUpdate);
            } else {
                // console.log("in scene.onChange", toUpdate);
                for (const renderer of this._renderers)
                    renderer._renderChanges(this, toUpdate);
            }

            return toUpdate;
        }

        gridlines(channel, attr, params) {
            let args = params ? params : {},
                attribute = attr == "rowId" ? MSCRowID : attr,
                enc = args.element ? getChannelEncodingByElement(args.element, channel) : getChannelEncodingByAttribute(attribute, channel, this);
            if (enc) {
                if (enc.attribute !== attribute)
                    console.warn("Cannot create a " + channel + " axis for " + attr);
                let scaleElems = [];
                if (channel == "x") {
                    for (let scale of enc.scales) {
                        scaleElems.push({ "scale": scale, "elems": normalizeRefElems(enc.getElements(scale)) });
                    }
                } else if (channel == "width") {
                    let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numCols > 1) {
                        let elemGroups = tc.layout.getElementsByCol(true);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": scale, "elems": elems });
                        }
                    } else {
                        scaleElems.push({ "scale": enc.scales[0], "elems": normalizeRefElems(enc.getElements(enc.scales[0])) });
                    }
                } else if (channel == "y") {
                    let tc = getTopLevelCollection(enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByRow(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({"scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({"scale": enc.scales[0], "elems": normalizeRefElems(enc.getElements(enc.scales[0]))});
                    }
                } else if (channel == "height") {
                    let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByRow(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": scale, "elems": elems });
                        }
                    } else {
                        scaleElems.push({ "scale": scale, "elems": normalizeRefElems(enc.getElements(scale)) });
                    }
                } else if (channel == "radialDistance") {
                    //find polygons
                    // scaleElems.push({"scale": enc.scales[0], "elems": getPeers(enc.element)});
                    let elem = args.element ? args.element: enc.element;
                    scaleElems.push({"scale": enc.scales[0],  "elems": getPeers(elem, elem.parent)});
                }
                for (let se of scaleElems) {
                    let gl = new Gridlines(enc.channel, enc.attribute, se.scale, se.elems, args);
                    this.addChild(gl);
                    this._itemMap[gl.id] = gl;
                    enc.addRefElement(gl);
                    gridlinesCreated(gl, this._depGraph);
                    parentChildConnected(this, gl, this._depGraph);
                }
            } else {
                let elem = args.element ? args.element : findElementForAxis(this, attr);
                if (!elem) {
                    console.warn("Cannot create " + channel + " gridlines for " + attr);
                    return;
                }
                let coll = getClosestCollection(elem.parent);
                if (!coll.layout) {
                    console.warn("Cannot create " + channel + " gridlines for " + attr);
                    return;
                }
                let peers = getPeers(coll);
                for (let p of peers) {
                    let elemGroups = [];
                    if (p.layout.type == LayoutType.GRID && p.layout.numRows > 1 && channel == "x") {
                        elemGroups = p.layout.getElementsByRow();
                    } else if (p.layout.type == LayoutType.GRID && p.layout.numCols > 1 && channel == "y") {
                        elemGroups = p.layout.getElementsByCol();
                    } else {
                        elemGroups.push(p.children);
                    }
                    for (let elems of elemGroups) {
                        let gl = new Gridlines(channel, attr, null, elems, args);
                        this.addChild(gl);
                        this._itemMap[gl.id] = gl;
                        p.layout.addRefElement(gl);
                        gridlinesCreated(gl, this._depGraph);
                        parentChildConnected(this, gl, this._depGraph);
                    }
                }
            }
        }

        //returns an axis if only one axis is created, otherwise returns an array of axes
        axis(channel, attr, params) {
            let args = params ? params : {},
                attribute = attr == "rowId" ? MSCRowID : attr,
                axes = [];
            let enc = args.element ? getChannelEncodingByElement(args.element, channel) : getChannelEncodingByAttribute(attribute, channel, this);
            if (enc) {
                if (enc.attribute !== attribute)
                    console.warn("Cannot create a " + channel + " axis for " + attribute);
                let scaleElems = [];
                if (channel == "x" || channel == "width") {
                    let tc = getTopLevelCollection(args.element ? args.element: enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numCols > 1) {
                        let elemGroups = tc.layout.getElementsByCell(true, enc.element);
                        // let elemGroups = tc.layout.getElementsByCol(true);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({ "scale": enc.scales[0], "elems": normalizeRefElems(enc.getElements(enc.scales[0])) });
                    }
                // } else if (channel == "width") {
                //     let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                //     if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numCols > 1) {
                //         let elemGroups = tc.layout.getElementsByCol(true);
                //         for (let elems of elemGroups) {
                //             scaleElems.push({ "scale": scale, "elems": elems });
                //         }
                //     } else {
                //         scaleElems.push({ "scale": enc.scales[0], "elems": enc.getElements(enc.scales[0]) });
                //     }
                } else if (channel == "y" || channel == "height") {
                    let tc = getTopLevelCollection(args.element ? args.element: enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByCell(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({"scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({"scale": enc.scales[0], "elems": normalizeRefElems(enc.getElements(enc.scales[0]))});
                    }
                // } else if (channel == "height") {
                //     let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                //     if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                //         let elemGroups = tc.layout.getElementsByRow(true);
                //         for (let elems of elemGroups) {
                //             scaleElems.push({"scale": scale, "elems": elems});
                //         }
                //     } else {
                //         scaleElems.push({"scale": scale, "elems": enc.getElements(scale)});
                //     }
                } else if (channel == "radialDistance") {
                    //find polygons
                    let elem = args.element ? args.element: enc.element;
                    scaleElems.push({"scale": enc.scales[0],  "elems": getPeers(elem, elem.parent)});
                }
                for (let se of scaleElems) {
                    let axisArgs = Object.assign({}, args);
                    axisArgs.scale = se.scale;
                    axisArgs.elems = se.elems;
                    axisArgs.type = "axis";
                    axisArgs.axisType = "encoding";
                    axisArgs.enc = enc;
                    axisArgs.rawArgs = args;
                    let axis = createElement(this, axisArgs);
                    //new EncodingAxis(enc, se.scale, se.elems, args);
                    //this.addChild(axis);
                    axes.push(axis);
                    enc.addRefElement(axis);
                    encodingAxisCreated(axis, this._depGraph);
                    parentChildConnected(this, axis, this._depGraph);
                    this.onChange(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis);
                }
            } else {
                let elem = args.element ? args.element : findElementForAxis(this, attribute);
                if (!elem) {
                    console.warn("Cannot create a " + channel + " axis for " + attribute);
                    return;
                }
                let coll = getClosestCollection(elem.parent);
                if (!coll.layout) {
                    console.warn("Cannot create a " + channel + " axis for " + attribute);
                    return;
                }
                let peers = getPeers(coll);
                for (let p of peers) {
                    let elemGroups = [];
                    if (p.layout.type == LayoutType.GRID && p.layout.numRows > 1 && channel == "x") {
                        elemGroups = p.layout.getElementsByRow();
                    } else if (p.layout.type == LayoutType.GRID && p.layout.numCols > 1 && channel == "y") {
                        elemGroups = p.layout.getElementsByCol();
                    } else {
                        elemGroups.push(p.children);
                    }
                    for (let elems of elemGroups) {
                        let axisArgs = Object.assign({}, args);
                        axisArgs.elems = elems.slice();
                        axisArgs.type = "axis";
                        axisArgs.axisType = "layout";
                        axisArgs.channel = channel;
                        axisArgs.attribute = attribute;
                        let axis = createElement(this, axisArgs);
                        //new LayoutAxis(elems.slice(), channel, attribute, args);
                        //this.addChild(axis);
                        axes.push(axis);
                        p.layout.addRefElement(axis);
                        layoutAxisSpecified(axis, this._depGraph);
                        parentChildConnected(this, axis, this._depGraph);
                        this.onChange(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis);
                    }
                }
            }
            return axes.length > 1 ? axes : axes[0];
        }

        legend(channel, attr, params) {
            let args = params ? params : {},
                attribute = attr == "rowId" ? MSCRowID : attr;
            let enc = args.element ? getChannelEncodingByElement(args.element, channel) : getChannelEncodingByAttribute(attribute, channel, this);
            if (enc) {
                if (enc.attribute !== attr)
                    console.warn("Cannot create a " + channel + " legend for " + attr);
                let attrType = getDataTable(enc.element).type(attr);
                // let legend = attrType === "string" ? new CategoricalLegend(enc, args) : new QuantitativeLegend(enc, args);
                // this.addChild(legend);
                args.type = "legend";
                args.enc = enc;
                args.attrType = attrType;
                let legend = createElement(this, args);
                legendSpecified(legend, this._depGraph);
                parentChildConnected(this, legend, this._depGraph);
                propagateBoundsUpdate(legend);
                this.onChange(VarType.PROPERTY, Properties.LEGEND_POSITION, legend);
            } else {
                console.warn("Cannot create a " + channel + " legend for " + attribute);
            }
        }

        mask(elem) {
            //add clip mask 
            let coll = getTopLevelCollection(elem);
            let item = coll ? coll : elem;
            if (!item.clipMask)
                item.createClipMask();
        }

        setLayout(group, layout) {
            // if (Array.isArray(elem) && elem.length === 2 && elem[0] instanceof Group && elem[0] instanceof Group) {
            //     let nodeColls = getPeers(elem[0]),
            //         linkColls = getPeers(elem[1]);
            //     for (let i = 0; i < nodeColls.length; i++) {
            //         let nodeColl = nodeColls[i], linkColl = linkColls[i];
            //         let l = layout ? layout.clone() : layout;
            //         nodeColl._layout = l;
            //         if (l) l.group = nodeColl;
            //     }
            //     layoutSpecified([elem[0], elem[1]], layout, this._depGraph);
            // } else if (elem instanceof Group) {
            if (group.layout) {
                layoutRemoved(group, group.layout, this._depGraph);
                
                if (layout.type === LayoutType.TREEMAP) {
                    let childColl = group.firstChild;
                    while (childColl && childColl.type === ElementType.Collection && childColl.layout) {
                        layoutRemoved(childColl, childColl.layout, this._depGraph);
                        childColl = childColl.firstChild;
                    }
                }
            }
                
            let peers = getPeers(group);
            peers.forEach(p => {
                let l = layout ? layout.clone() : layout;
                p._layout = l;
                if (l) l.group = p;
            });
            
            layoutSpecified(group, layout, this._depGraph);

            if (group.children && group.children.length > 0) {
                let lm = getLeafMarks(group, true);
                //TODO: keep marks with unique classIds only
                for (let m of lm) {
                    this.onChange(VarType.CHANNEL, "x", m);
                }
                    
            }
            // }
            
        }

        // getChannelEncodingByElement(elem, channel) {
        //     let enc = this._encodings[getEncodingKey(elem)];
        //     if (enc && enc[channel]) {
        //         return enc[channel];
        //     } else
        //         return null;
        // }

        // findElements(predicates) {
        //     return findItems(this, predicates);
        // }

        derive(table, spec) {
            let resultTbl = table.clone();
            spec._scene = this;
            if (spec instanceof BinningSpecification) {
                binningSpecified(spec, table, resultTbl, this._depGraph);
                resultTbl._binTransform = spec;
            } else if (spec instanceof KDESpecification) {
                kdeSpecified(spec, table, resultTbl, this._depGraph);
            } else if (spec instanceof FilterSpecification) {
                filteringSpecified(spec, table, resultTbl, this._depGraph);
            } else if (spec instanceof CustomTransformSpecification) {
                customTransformSpecified(spec, table, resultTbl, this._depGraph);
            }
            return resultTbl;
        }

        getElement(id) { return this._itemMap[id];  }

        //getEncodingByAttribute(attr, channel) { return getChannelEncodingByAttribute(attr, channel, this) }

        //getEncodingByElement(elem, channel) { return getChannelEncodingByElement(elem, channel) }

        getAxis(attr, channel) { return getChannelEncodingByAttribute(attr, channel, this).refElements[0] }
    }

    function processDataScopeRef(json, tables) {
        return createDataScope(tables[json.dt], json.attr2value || json.filters || {}, json.rowIds);
    }

    class DirectedGraphLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.DIRECTED;
            // this._width = "width" in args ? args["width"] : 500;
            // this._height = "height" in args ? args["height"] : 300;
            this._top = "top" in args ? args["top"] : 0;
            this._left = "left" in args ? args["left"] : 0;
            this._nodeSep = "nodeSep" in args ? args["nodeSep"] : 100;
            this._edgeSep = "edgeSep" in args? args["edgeSep"] : 50;
            this._rankSep = "rankSep" in args ? args["rankSep"] : 50;
            this._spreadLinks = "spreadLinks" in args ? args["spreadLinks"] : true;
            this._direction = "direction" in args ? args["direction"] : LinearDirection.Top2Bottom;        
        }

        clone() {
            let f = new DirectedGraphLayout({
                // width: this._width,
                // height: this._height,
                top: this._top,
                left: this._left,
                nodeSep: this._nodeSep,
                edgeSep: this._edgeSep,
                rankSep: this._rankSep,
                spreadLinks: this._spreadLinks,
                direction: this._direction
            });
            return f;
        }

        // get width() {
        //     return this._width;
        // }

        // get height() {
        //     return this._height;
        // }

        get top() {
            return this._top;
        }

        get left() {
            return this._left;
        }

        get nodeSep() {
            return this._nodeSep;
        }

        get edgeSep() {
            return this._edgeSep;
        }

        get rankSep() {
            return this._rankSep;
        }

        get spreadLinks() {
            return this._spreadLinks;
        }

        get direction() {
            return this._direction;
        }
    }

    class ForceLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.FORCE;
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._iterations = "iterations" in args ? args.iterations : 1;
            this._repulsion = "repulsion" in args ? args.repulsion : 30;
            this._attraction = "attraction" in args ? args.attraction : 1;
            this._linkDistance = "linkDistance" in args ? args.linkDistance : 30;
        }

        clone() {
            let f = new ForceLayout({
                x: this._x,
                y: this._y,
                iterations: this._iterations,
                repulsion: this._repulsion,
                attraction: this._attraction,
                linkDistance: this._linkDistance
            });
            return f;
        }

    }

    class PackingLayout extends Layout {

        constructor(args) {
          super();
          this.type = LayoutType.PACKING;
          this._x = "x" in args ? args.x : 400;
          this._y = "y" in args ? args.y : 400;
          this._width = args.width;
          this._height = args.height;
        }

        clone() {
    		return new PackingLayout({x: this._x, y: this._y, width: this._width, height: this._height});
    	}

    }

    class StackLayout extends Layout {

        constructor(args) {
    		super();
    		this.type = LayoutType.STACK;
            this._orientation = args.orientation;
    		this._direction = args.direction;
    		this._left = args.left;
    		this._top = args.top;
            this._horzCellAlignment = "horzCellAlignment" in args && args["horzCellAlignment"] ? args.horzCellAlignment : BoundsAnchor.LEFT;
    		this._vertCellAlignment = "vertCellAlignment" in args && args["vertCellAlignment"]  ? args.vertCellAlignment : BoundsAnchor.BOTTOM;
            this._gap = "gap" in args ? args.gap : 0;
        }

        clone() {
    		let s = new StackLayout({orientation: this._orientation, direction: this._direction, left: this._left, top: this._top});
    		s._horzCellAlignment = this._horzCellAlignment;
    		s._vertCellAlignment = this._vertCellAlignment;
    		return s;
    	}

        get horzCellAlignment() {
    		return this._horzCellAlignment;
    	}

        get vertCellAlignment() {
    		return this._vertCellAlignment;
    	}

    	get orientation() {
    		return this._orientation;
    	}

    	set horzCellAlignment(v) {
    		this._horzCellAlignment = v;
    	}

        set vertCellAlignment(v) {
    		this._vertCellAlignment = v;
    	}

    	set orientation(v) {
    		this._orientation = v;
    	}
    }

    class StrataLayout extends Layout {

        constructor(args) {
    		super();
            this.type = LayoutType.STRATA;
    		this._direction = args.direction;
    		this._gap = "gap" in args ? args.gap : 0;
        }

        clone() {
            return new StrataLayout({
                direction: this._direction,
                gap: this._gap
            });
        }
    }

    class TidyTreeLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.TIDYTREE;
            this._width = "width" in args ? args.width : 500;
            this._height = "height" in args ? args.height : 500;
            this._left = "left" in args ? args.left : 100;
            this._top = "top" in args ? args.top : 100;
            this._orientation = "orientation" in args ? args.orientation : LayoutOrientation.HORIZONTAL;
        }

        get width() {
            return this._width;
        }

        get height() {
            return this._height;
        }

        get top() {
            return this._top;
        }

        get left() {
            return this._left;
        }

        get orientation() {
            return this._orientation;
        }

        clone() {
            let t = new TidyTreeLayout({
                width: this._width,
                height: this._height,
                top: this._top,
                left: this._left,
                orientation: this._orientation
            });
            return t;
        }

    }

    class TreemapLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.TREEMAP;
            this._width = args.width;
            this._height = args.height;
            this._left = args.left;
            this._top = args.top;
        }

        get width() {
            return this._width;
        }

        get height() {
            return this._height;
        }

        get top() {
            return this._top;
        }

        get left() {
            return this._left;
        }

        clone() {
            let t = new TreemapLayout({
                width: this._width,
                height: this._height,
                top: this._top,
                left: this._left,
            });
            return t;
        }
    }

    function processLayout(json) {
        switch (json.type) {
            case LayoutType.GRID:
                return processGridLayout(json);
            case LayoutType.STACK:
                return processStackLayout(json);
            case LayoutType.PACKING:
                return processPackingLayout(json);
            case LayoutType.FORCE:
                return processForceLayout(json);
            case LayoutType.DIRECTED:
                return processDirectedGraphLayout(json);
            case LayoutType.TIDYTREE:
                return processTidyTreeLayout(json);
            case LayoutType.TREEMAP:
                return processTreemapLayout(json);
            case LayoutType.STRATA:
                return processStrataLayout(json);
            default:
                console.warn("unsupported layout type for deserialization:", json.type);
                return;
        }
    }

    function processTreemapLayout(json) {
        return new TreemapLayout(json.args);
    }

    function processStrataLayout(json) {
        return new StrataLayout(json.args);
    }

    function processTidyTreeLayout(json) {
        return new TidyTreeLayout(json.args);
    }

    function processDirectedGraphLayout(json) {
        return new DirectedGraphLayout(json.args);
    }

    function processForceLayout(json) {
        return new ForceLayout(json.args);
    }

    function processPackingLayout(json) {
        let l = new PackingLayout(json.args);
        return l;
    }

    function processGridLayout(json) {
        let l = new GridLayout(json.args);
        if ("left" in json)
            l._left = json.left;
        if ("top" in json)
            l._top = json.top;
        if ("cellBounds" in json)
            l._cellBounds = json.cellBounds.map(d => processBounds(d));
        if ("grid" in json)
            l._grid = json.grid;
        return l;
    }

    function processStackLayout(json) {
        let l = new StackLayout(json.args);
        return l;
    }

    function processBounds(b) {
        return new Rectangle(b.x - b.width/2, b.y - b.height/2, b.width, b.height);
    }

    function processMark(json, scene, tables) {
        if (json.type === ElementType.Pie)
            json.type = ElementType.Arc;
        json.args.type = json.type;
        let mark = createElement(scene, json.args);
        if (json.id)
            mark._id = json.id;
        if (json.classId)
            mark._classId = json.classId;
        if (json.dataScope)
            mark.dataScope = processDataScopeRef(json.dataScope, tables);
        if (json.bounds)
            mark._bounds = processBounds(json.bounds);
        if (json.refBounds)
            mark._refBounds = processBounds(json.refBounds);
        processPath(json, mark, scene, tables);
        // switch (json.type) {
        //     case ElementType.Arc:
        //     case ElementType.Pie:
        //         processArc(json, mark);
        //         break;
        //     case ElementType.Area:
        //         processArea(json, mark);
        //         break;
        //     case ElementType.Circle:
        //         processCircle(json, mark);
        //         break;
        //     case ElementType.Image:
        //         processImage(json, mark, scene);
        //         break;
        //     case ElementType.Line:
        //     case ElementType.Path:
        //         processPath(json, mark);
        //         break;
        //     case ElementType.Link:
        //         processLink(json, mark);
        //         break;
        //     case ElementType.PointText:
        //         processText(json, mark);
        //         break;
        //     case ElementType.Polygon:
        //         processPolygon(json, mark, scene);
        //         break;
        //     case ElementType.Rect:
        //         processRect(json, mark, scene);
        //         break;
        //     case ElementType.Ring:
        //         processRing(json, mark, scene);
        //         break;
        //     default:
        //         console.warn("unsupported mark type for deserialization", json.type);
        //         break;
        // }
        return mark;
    }

    // function processArc(json, mark) {
    //     processPath(json, mark);
    // }

    // function processArea(json, mark) {
    //     processPath(json, mark);
    // }

    // function processCircle(json, mark) {
    //     //do nothing
    // }

    // function processImage(json, mark, scene) {

    // }

    function processPath(json, mark, scene, tables) {
        if (json.vertices) {
            const vertices = [];
            for (let d of json.vertices) {
                const v = processVertex(d, tables);
                vertices.push(v);
            }
            mark.vertices = vertices;
        }
        mark.vertexCounter = json.vertexCounter;
        mark.segmentCounter = json.segmentCounter;
        mark.curveMode = json.curveMode;
    }

    // function processLink(json, mark) {

    // }

    // function processText(json, mark) {

    // }

    // function processPolygon(json, mark, scene) {

    // }

    // function processRect(json, mark, scene) {

    // }

    // function processRing(json, mark, scene) {

    // }

    function processVertex(json, tables) {
        let v = {
            type: "vertex",
            id: json.id,
            x: json.x,
            y: json.y,
            shape: json.shape,
            width: json.width,
            height: json.height,
            radius: json.radius,
            fillColor: json.fillColor,
            opacity: json.opacity,
            strokeWidth: json.strokeWidth,
            strokeColor: json.strokeColor
        };
        if (json.dataScope)
            v.dataScope = processDataScopeRef(json.dataScope, tables);
        if ("polarAngle" in json)
            v.polarAngle = json.polarAngle;
        return v;
    }

    function deserializeScene(json) {
        let scnArgs = {};
        scnArgs.fillColor = json.fillColor;
        let scn = new Scene(scnArgs);

        console.log("======== deserialization =========");

        let tables = {};
        if (json.tables) {
            for (let t in json.tables) {
                let tbl = json.tables[t];
                tables[t] = new DataTable(tbl.data, tbl.url, tbl.attributeTypes);
                tables[t]._id = tbl.id;
            }
        }
        //scn.tables = tables;

        let scales = {};
        if (json.scales) {
            for (let s in json.scales)
                scales[s] = processScale(json.scales[s]);
        }
        scn.scales = scales;

        processGroup(json, scn, scn, tables);

        processLinks(json, scn);

        // scn._buildPeerIndex();

        if (json.encodings) {
            let encs = {};
            for (let e of json.encodings) {
                let enc = processEncoding(e, scn, tables);
                encs[enc.id] = enc;
            }

            for (let id in encs) {
                scn._addAttributeEncoding(encs[id]);
                let baseEnc = encs[id]._baseEnc ? encs[encs[id]._baseEnc] : undefined;
                encodingSpecified(encs[id], scn._depGraph, baseEnc);
                if (baseEnc)
                    scn.onChange(VarType.ATTR_VALUE, encs[id]); //run all the encoders
                else {
                    scn.onChange(VarType.CHANNEL, encs[id].channel, encs[id].element);
                }
            }
        }

        if (json.axes) {
            for (let axis of json.axes) {
                let args = axis.args ? axis.args : {};
                if (args.tickValues && Object.values(tables)[0].type(axis.attr) === AttributeType.Date) {
                    args.tickValues = args.tickValues.map(d => new Date(new Date(d).toISOString()));
                }

                if (axis.id) args.id = axis.id;    
                scn.axis(axis.channel, axis.attr, args);
            }
        }

        if (json.gridlines) {
            for (let gl of json.gridlines) {
                scn.gridlines(gl.channel, gl.attr, gl.args);
            }
        }

        if (json.bounds)
            scn._bounds = processBounds(json.bounds);

        //delete scn.tables;
        delete scn.scales;
        return scn;
    }

    function processElement(json, parentObj, scene, tables) {
        //TODO: check if top level element is a scene
        if (json.type === ElementType.Collection) {
            let coll = createElement(scene, {type: ElementType.Collection, id: json.id});
            if (json.classId)
                coll._classId = json.classId;
            parentObj.addChild(coll);
            //scene._itemMap[coll.id] = coll;
            newCollectionCreated(coll, scene._depGraph);
            parentChildConnected(parentObj, coll, scene._depGraph);
            processGroup(json, coll, scene, tables);
        } else if (json.type === ElementType.Glyph) {
            let glyph = createElement(scene, {type: ElementType.Glyph, id: json.id});
            if (json.classId)
                glyph._classId = json.classId;
            parentObj.addChild(glyph);
            //scene._itemMap[glyph.id] = glyph;
            newGlyphCreated(glyph, scene._depGraph);
            parentChildConnected(parentObj, glyph, scene._depGraph);
            processGroup(json, glyph, scene, tables);
        } else if (json.type === ElementType.Composite) {
            let comp = createElement(scene, {type: ElementType.Composite, id: json.id});
            parentObj.addChild(comp);
            scene._itemMap[comp.id] = comp;
            newCompositeCreated(comp, scene._depGraph);
            parentChildConnected(parentObj, comp, scene._depGraph);
            processGroup(json, comp, scene, tables);
            comp._bounds = processBounds(json.bounds);
        } else if (json.type === ElementType.Axis) { // for VisAnatomy
            let axis = new Axis({});
            parentObj.addChild(axis);
            processAxis(json, axis, scene, tables);
            scene._itemMap[axis.id] = axis;
            //axis._bounds = processBounds(json.bounds);
        } else if (Object.values(MarkTypes).includes(json.type)) {
            let mk = processMark(json, scene, tables);
            scene._itemMap[mk.id] = mk;
            parentObj.addChild(mk);
            newMarkCreated(mk, scene._depGraph);
            parentChildConnected(parentObj, mk, scene._depGraph);
            return mk;
        } else ;
    }

    function processLinks(json, scene, tables) {
        if (json.children) {
            for (let c of json.children) {
                processLinks(c, scene);
            }
        } else if (Object.values(MarkTypes).includes(json.type)) {
            let mk = scene._itemMap[json.id];
            if (json.links)
                mk.links = json.links.map(d => scene._itemMap[d]);
            if (json.source)
                mk.source = scene._itemMap[json.source];
            if (json.target)
                mk.target = scene._itemMap[json.target];
        }
    }

    function processAxis(json, axis, scene, tables) {
        if (json.id)
            axis._id = json.id;
        axis._children = [];
        if (json.labels) {
            let lg = new Group();
            processGroup(json.labels, lg, scene, tables);
            axis._labels = lg;
            axis._children.push(lg);
        }
        
        if (json.path) {
            axis._path = processElement(json.path, axis, scene, tables);
        }
        if (json.ticks) {
            let tg = new Group();
            processGroup(json.ticks, tg, scene, tables);
            axis._ticks = tg;
            axis._children.push(tg);
        }
        if (json.title) {
            axis._title = processElement(json.title, axis, scene, tables);
        }
    }

    function processGroup(json, groupObj, scene, tables) {
        if (json.id)
            groupObj._id = json.id;
        if (json.classId)
            groupObj._classId = json.classId;
        if (json.dataScope)
            groupObj.dataScope = processDataScopeRef(json.dataScope, tables);
        if (json.bounds)
            groupObj._bounds = processBounds(json.bounds);

        groupObj._sortBy = json.sortBy;
        if (json.children) {
            for (let c of json.children) {
                processElement(c, groupObj, scene, tables);
            }
        }

        if (json.layout) {
            groupObj._layout = processLayout(json.layout);
            groupObj._layout.group = groupObj;
            layoutSpecified(groupObj, groupObj._layout, scene._depGraph);
        }
    }

    function processScale(json) {
        let scale = new Scale(json.type, json.args);
        scale._id = json.id;
        scale.domain = json.domain;
        scale.range = json.range;
        return scale;
    }

    function processEncoding(json, scn, tables) {
        let elem = getItem(json.element, json.elementType, scn);
        if (!elem)
            console.warn("element not created:", json.element, json.elementType);

        let args = json.args ? json.args : {};
        if (json.table) {
            args.table = tables[json.table];
        }

        let enc = new AttributeEncoding(elem, json.channel, json.attr, json.aggregator ? json.aggregator : "sum", args);
        enc._id = json.id;

        if (json.scales) {
            enc._scales = json.scales.map(d => scn.scales[d]);
        }

        if (args.baseEnc) {
            enc._baseEnc = json.args.baseEnc;
        }

        if (json.elemGroups) {
            enc._elemGroups = json.elemGroups.map(g => g.map(d => getItem(d, elem.type, scn)));
        }

        if (json.elem2scale) {
            enc._elem2scale = {};
            for (let eid in json.elem2scale) {
                enc._elem2scale[eid] = scn.scales[json.elem2scale[eid]];
            }
        }

        if (args.startAngle)
            enc.startAngle = args.startAngle;

        return enc;
    }

    function getItem(id, type, scn) {
        if (type === "vertex") {
            let tokens = id.split("_v_");
            return scn._itemMap[tokens[0]].vertices.find(d => d.id === id);
        } else if (type === "segment") {
            let tokens = id.split("_s_");
            return scn._itemMap[tokens[0]].segments.find(d => d._id === parseInt(tokens[1]));
        } else {
            return scn._itemMap[id];
        }
    }

    function serializeDataTable(tbl) {
        let json = {};
        json.id = tbl._id;
        json.data = tbl._rawData;
        json.attributeTypes = tbl._attrTypes;
        json.url = tbl.url;
        // json.sourceDataTable = tbl._sourceDataTable;
        // json.transform = tbl._transform;
        // json.dateMap = {};
        return json;
    }

    function serializeDataScopeRef(ref) {
        let json = {};
        json.dt = ref.dataTable.id;
        json.attr2value = Object.assign({}, ref.filters);
        if (ref.rowIds)
            json.rowIds = ref.rowIds.slice();
        return json;
    }

    function serializeLayout(layout) {
        switch (layout.type) {
            case LayoutType.GRID:
                return serializeGridLayout(layout);
            case LayoutType.STACK:
                return serializeStackLayout(layout);
            case LayoutType.PACKING:
                return serializePackingLayout(layout);
            case LayoutType.FORCE:
                return serializeForceLayout(layout);
            case LayoutType.CLUSTER:
                return serializeClusterLayout(layout);
            case LayoutType.DIRECTED:
                return serializeDirectedGraphLayout(layout);
            case LayoutType.TIDYTREE:
                return serializeTidyTreeLayout(layout);
            case LayoutType.TREEMAP:
                return serializeTreemapLayout(layout);
            case LayoutType.STRATA:
                return serializeStrataLayout(layout);
            default:
                throw new Error("unknow layout type " + layout.type);
        }
    }

    function serializeGridLayout(layout) {
        let json = {args: {}};
        json.type = layout.type;
        json.args.numCols = layout._numCols;
        json.args.numRows = layout._numRows;
        json.args.start = layout._start;
        json.args.direction = layout._direction;
        json.args.colGap = layout._colGap;
        json.args.rowGap = layout._rowGap;
        json.args.horzCellAlignment = layout._cellHorzAlignment;
        json.args.vertCellAlignment = layout._cellVertAlignment;
        json.args.rowOffset = layout._rowOffset;
        json.args.colOffset = layout._colOffset;
        json.left = layout._left;
        json.top = layout._top;
        //json.cellBounds = layout._cellBounds.map(d => d.toJSON());
        json.group = layout.group.id;
        //json.grid = layout._grid;
        //TODO: save grid
        return json;
    }

    function serializeStackLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.orientation = layout._orientation;
        json.args.direction = layout._direction;
        json.args.left = layout._left;
        json.args.top = layout._top;
        json.args.horzCellAlignment = layout._horzCellAlignment;
        json.args.vertCellAlignment = layout._vertCellAlignment;
        json.args.gap = layout._gap;
        json.group = layout.group.id;
        return json;
    }

    function serializePackingLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.x = layout._x;
        json.args.y = layout._y;
        json.args.width = layout._width;
        json.args.height = layout._height;
        json.group = layout.group.id;
        return json;
    }

    function serializeForceLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.x = layout._x;
        json.args.y = layout._y;
        json.args.iterations = layout._iterations;
        json.args.repulsion = layout._repulsion;
        json.args.attraction = layout._attraction;
        json.args.linkDistance = layout._linkDistance;
        json.group = layout.group.id;
        return json;
    }

    function serializeDirectedGraphLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.left = layout._left;
        json.args.top = layout._top;
        json.args.width = layout._width;
        json.args.height = layout._height;
        json.args.edgeSep = layout._edgeSep;
        json.args.spreadLinks = layout._spreadLinks;
        json.args.direction = layout._direction;
        return json;
    }

    function serializeTidyTreeLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.left = layout._left;
        json.args.top = layout._top;
        json.args.width = layout._width;
        json.args.height = layout._height;
        json.args.orientation = layout._orientation;
        return json;
    }

    function serializeClusterLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.size = layout._size;
        json.args.rootX = layout._rootX;
        json.args.rootY = layout._rootY;
        return json;
    }

    function serializeStrataLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.direction = layout._direction;
        json.args.gap = layout._gap;
        return json;
    }

    function serializeTreemapLayout(layout) {
        let json = { args: {} };
        json.type = layout.type;
        json.args.left = layout._left;
        json.args.top = layout._top;
        json.args.width = layout._width;
        json.args.height = layout._height;
        return json;
    }

    function serializeMark(mark) {
        let json = {};
        json.args = {};
        json.type = mark.type;
        json.id = mark.id;
        if (mark.classId)
            json.classId = mark.classId;
        if (mark.dataScope)
            json.dataScope = serializeDataScopeRef(mark.dataScope);
        if (mark.bounds)
            json.bounds = mark.bounds.toJSON();
        if (mark.refBounds)
            json.refBounds = mark.refBounds.toJSON();

        //for networks/trees
        if (mark.links)
            json.links = mark.links.map(d => d.id);
        if (mark.source)
            json.source = mark.source.id;
        if (mark.target)
            json.target = mark.target.id;

        // for (let s in mark.attrs) {
        //     json.args[s] = mark.attrs[s];
        // }
        for (let s in mark.styles) {
            if (s.indexOf("Color") > 0 && mark.styles[s] instanceof LinearGradient) {
                json.args[s] = mark.styles[s].toJSON();
            } else {
                json.args[s] = mark.styles[s];
            }
        }

        //handle specific properties for each mark type
        switch (mark.type) {
            case ElementType.Arc:
            case ElementType.Pie:
                serializeArc(mark, json);
                serializePath(mark, json);
                break;
            case ElementType.Area:
                serializeArea(mark, json);
                serializePath(mark, json);
                break;
            case ElementType.Circle:
                serializeCircle(mark, json);
                break;
            case ElementType.Image:
                break;
            case ElementType.Line:
            case ElementType.Path:
            case ElementType.BezierCurve:
                serializePath(mark, json);
                break;
            // case ElementType.Link:
            //     serializeLink(mark, json);
            //     break;
            case ElementType.SimpleText:
                serializeSimpleText(mark, json);
                break;
            case ElementType.Polygon:
                serializePolygon(mark, json);
                serializePath(mark, json);
                break;
            case ElementType.Rect:
                serializeRect(mark, json);
                serializePath(mark, json);
                break;
            case ElementType.Ring:
        }
        return json;
    }

    function serializeRect(mark, json) {
        json.args.width = mark.width;
        json.args.height = mark.height;
        json.args.top = mark.top;
        json.args.left = mark.left;
    }

    function serializeCircle(mark, json) {
        json.args.x = mark.x;
        json.args.y = mark.y;
        json.args.radius = mark.radius;
    }

    function serializeArc(mark, json) {
        json.args.x = mark._x;
        json.args.y = mark._y;
        json.args.innerRadius = mark._innerRadius;
        json.args.outerRadius = mark._outerRadius;
        json.args.startAngle = mark._startAngle;
        json.args.endAngle = mark._endAngle;
        json.args.direction = mark._direction;
        json.args.thickness = mark._thickness;
    }

    function serializeArea(mark, json) {
        json.args.baseline = mark._baseline;
        json.args.orientation = mark._orientation;
    }

    function serializePolygon(mark, json) {
        json.args.x = mark._x;
        json.args.y = mark._y;
        json.args.radius = mark._radius;
    }

    function serializePath(mark, json) {
        json.vertices = [];
        for (let i = 0; i < mark._vertices.length; i++)
            json.vertices.push(serializeVertex(mark._vertices, i));
        json.vertexCounter = mark.vertexCounter;
    	json.segmentCounter = mark.segmentCounter;
    	//do not save segments, anchor and closed for now
    	json.curveMode = mark.curveMode;
    }

    function serializeSimpleText(mark, json) {
        json.args.x = mark._x;
        json.args.y = mark._y;
        json.args.text = mark._text;
        json.args.anchor = mark._anchor;
        if (mark._backgroundColor)
            json.args.backgroundColor = mark._backgroundColor;
        if (mark._borderWidth)
            json.args.borderWidth = mark._borderWidth;
        if (mark._borderColor)
            json.args.borderColor = mark._borderColor;
    }

    // function serializeLink(mark, json) {
    //     json.args.mode = mark.mode;
    //     json.args.directed = mark.directed;
    //     json.args.sourceAnchor = mark.sourceAnchor;
    //     json.args.targetAnchor = mark.targetAnchor;
    //     json.args.sourceOffset = mark.sourceOffset;
    //     json.args.targetOffset = mark.targetOffset;
    //     json.args.source = mark.source.id;
    //     json.args.target = mark.target.id;
    // }

    function serializeVertex(vertices, index) {
        let json = {};
        json.type = "vertex";
        json.id = vertices._ids[index];
        json.x = vertices._xs[index];
        json.y = vertices._ys[index];
        if (vertices.hasDataScope(index))
            json.dataScope = serializeDataScopeRef(vertices.getDataScopeRef(index));
        if (vertices._polarAngles[index] !== undefined)
            json.polarAngle = vertices._polarAngles[index];
        json.shape = vertices._shapes[index];
        json.width = vertices._widths[index];
        json.height = vertices._heights[index];
        json.radius = vertices._radii[index];
        json.fillColor = vertices._fillColors[index];
        json.opacity = vertices._opacities[index];
        json.strokeWidth = vertices._strokeWidths[index];
        json.strokeColor = vertices._strokeColors[index];
        return json;
    }

    function serializeElement(elem) {
        if (elem.type === ElementType.Scene) 
            return serializeScene(elem);
        else if ([ElementType.Collection, ElementType.Glyph, ElementType.Composite].includes(elem.type))
            return serializeGroup(elem, {});
        else if (elem instanceof Axis)
            return serializeAxis(elem, {});
        else if (elem instanceof Mark)
            return serializeMark(elem);
        else {
            console.warn("unsupported serialization", elem.type);
            return {type: elem.type};
        }
    }

    function serializeScene(scene) {
        let json = serializeGroup(scene, {});
        json.fillColor = scene.fillColor;

        json.scales = {};
        json.encodings = [];
        for (let classId in scene._encodings) {
            for (let channel in scene._encodings[classId]) {
                let e = scene._encodings[classId][channel];
                if (!e._forLegend)
                    json.encodings.push(serializeAttributeEncoding(e));
                for (let scale of e._scales) {
                    if (!(scale.id in json.scales)) {
                        json.scales[scale.id] = serializeScale(scale);
                    }
                }
            }
        }

        //TODO: relations
        // json.relations = {};
        // for (let c of scene.relations)
        //     json.relations[c] = c.toJSON();

        json.tables = {};
        let tables = getDataTablesInScene(scene);
        for (let t in tables) {
            json.tables[t] = serializeDataTable(tables[t]);
        }
        console.log("======== serialization =========");
        console.log(json);
        return json;
    }

    function serializeScale(scale) {
        let json = {};
        json.type = scale.type;
        json.id = scale.id;
        //json.offset = scale._offset;
        if (scale._args)
            json.args = scale._args;
        json.domain = scale.domain;
        json.range = scale.range;
        //json.clamp = scale.clamp;
        //json.isFlipped = scale.isFlipped;
        //json.includeZero = scale.includeZero;
        
        // if (scale._mapping)
        //     json.mapping = scale._mapping;
        // if (scale._baseItem)
        //     json.baseItem = scale._baseItem.id;
        return json;
    }

    function serializeAttributeEncoding(enc) {
        let json = {};
        json.id = enc._id;
        json.element = enc._elem.id;
        json.elementType = enc._elem.type;
        // if (enc.attrValues)
        //     json.attrValues = enc.attrValues;
        json.channel = enc._channel;
        json.attr = enc._attribute;
        json.aggregator = enc._aggregator;
        json.table = enc._table.id;

        json.args = {};
        json.args.includeZero = enc._includeZero;
        json.args.flipScale = enc._flipScale;
        json.args.mapping = enc._mapping;
        json.args.rangeExtent = enc._preferredRangeExtent;
        json.args.domain = enc._preferredDomain;
        json.args.scaleType = enc._scaleType;
        json.args.scheme = enc._colorScheme;

        if (enc._baseEnc)
            json.args.baseEnc = enc._baseEnc.id;
        
        //json.args.datatable = enc.datatable.id;
        json.scales = enc._scales.map(d => d.id);
        json.elemGroups = enc._elemGroups.map(g => g.map(d => d.id));
        json.elem2scale = {};
        for (let eid in enc._elem2scale) {
            json.elem2scale[eid] = enc._elem2scale[eid].id;
        }

        //json.refElements = enc._refElements.map(d => d.id);

        if (enc.channel == "angle") {
            json.args.startAngle = enc.startAngle;
            //json.args.angleDirection = enc.angleDirection;
        }
        return json;
    }

    // function serializeCollection(coll) {
    //     return serializeGroup(coll, {});
    // }

    // function serializeGlyph(glyph) {
    //     return serializeGroup(glyph, {});
    // }

    function serializeGroup(group, json) {
        json.id = group.id;
        json.type = group.type;
        if (group.classId)
            json.classId = group.classId;
        if (group.dataScope)
            json.dataScope = serializeDataScopeRef(group.dataScope);
        // if (group._bounds)
        json.bounds = group.bounds.toJSON();
        if (group._layout)
            json.layout = serializeLayout(group._layout);
        
        json.children = [];
        if (group.children.length > 0) { //&& group.type != ItemType.Axis
            for (let c of group.children) {
                if (c instanceof Axis) 
                    serializeAxis(c, json);
                else if (c instanceof Gridlines)
                    serializeGridlines(c, json);
                else
                    json.children.push(serializeElement(c));
            }
        }
        json.sortBy = group._sortBy;
        return json;
    }

    function serializeAxis(c, json) {
        json["axes"] ??= [];
        let axis = {};
        axis.type = c._type;
        axis.id = c._id;
        axis.attr = c._attribute;
        axis.channel = c._channel;
        axis.args = {};
        axis.args.orientation = c._orientation;
        axis.args.strokeColor = c._strokeColor;
        axis.args.textColor = c._textColor;
        axis.args.fontSize = c._fontSize;
        axis.args.tickOffset = c._tickOffset;
        axis.args.tickSize = c._tickSize;
        axis.args.tickAnchor = c._tickAnchor;
        axis.args.tickVisible = c._tickVisible;
        axis.args.pathVisible = c._pathVisible;
        axis.args.labelOffset = c._labelOffset;
        axis.args.labelFormat = c._labelFormat;
        axis.args.titleOffset = c._titleOffset;
        axis.args.title = c._titleText;
        axis.args.rotateTitle = c._rotateTitle;
        axis.args.titleVisible = c._showTitle;
        axis.args.labelRotation = c._labelRotation;
        json["axes"].push(axis);
    }

    function serializeGridlines(c, json) {
        json["gridlines"] ??= [];
        let gl = {};
        gl.type = c._type;
        gl.id = c._id;
        gl.attr = c._attribute;
        gl.channel = c._channel;
        gl.args = c._args;
        json["gridlines"].push(gl);
    }

    const CanvasProvider = {
    	canvas : undefined,
    	getContext: function() {
            if (!window)
                return null;
    		if (this.canvas === undefined) {
    			this.canvas = document.createElement('canvas');
    		}
            return this.canvas ? this.canvas.getContext('2d') : null;
        },
    	getPath2D: function(svgData) {
    		if (svgData)
    			return new Path2D(svgData);
    		else
    			return new Path2D();
    	}
    };

    function contains (elem, x, y) {
        if (!elem.bounds.contains(x, y)) return false;
        switch (elem.type) {
    		case ElementType.Path:
    		case ElementType.Arc:
    		case ElementType.BezierCurve:
    		case ElementType.Line:{
    			let ctx = CanvasProvider.getContext(),
    				p = CanvasProvider.getPath2D(elem.getSVGPathData());
    			ctx.lineWidth = Math.max(elem.strokeWidth, 2.5);
    			ctx.stroke(p);
    			if (elem.closed || elem.fillColor !== "none") {
    				return ctx.isPointInPath(p, x, y);
    			} else {
    				return ctx.isPointInStroke(p, x, y);
    			}
    		}
    		case ElementType.Circle: {
    			let cx = elem.x, cy = elem.y;
    			if (elem.rotation) {
    				let np = rotatePoint(cx, cy, elem.rotation[1], elem.rotation[2], elem.rotation[0]);
    				cx = np.x, cy = np.y;
    			}
    			let dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    			return dist <= elem.radius + elem.strokeWidth;
    		}
            case ElementType.Collection: {
                let irregular2Ds = [ElementType.Arc, ElementType.Pie, ElementType.Polygon, ElementType.Area];
                if (irregular2Ds.indexOf(elem.firstChild.type) >= 0) {
                    let svgData = elem.getSVGPathData();
                    if (svgData !== "") {
                        let ctx = CanvasProvider.getContext(),
                            p = CanvasProvider.getPath2D(svgData);
                        ctx.lineWidth = Math.max(elem.firstChild.strokeWidth, 2.5);
                        ctx.stroke(p);
                        return ctx.isPointInPath(p, x, y);
                    }
                }
                return elem.bounds.contains(x, y);
            }
    		default:
    			return elem.bounds.contains(x, y);
    	}
    }

    function markHitTest(item, x, y, objs) {
    	let items = getLeafMarks(item),
    		predicates = objs ? objs.map(d => obj2Predicate(d)) : [];
    	for (let i = items.length - 1; i >= 0; i--) {
    		let c = items[i];
    		if (contains(c, x, y)  && matchCriteria(c, predicates))
    			return c;
    	}
    }

    function childHitTest(item, x, y, objs) {
    	let predicates = objs ? objs.map(d => obj2Predicate(d)) : [];
    	if (!item.children || item.children.length == 0) {
    		return contains(item, x, y) && item.type !== ElementType.Scene ? item : undefined;
    	}
    	let children = item.children;
    	if (item.type === ElementType.Scene) {
    		children = children.slice();
    		children.sort((a,b) => isRefElement(a) ? 1 : isRefElement(b) ? -1 : 0 );
    	}
    	for (let i = 0; i < children.length; i++) {
    		let c = children[i];
    		if (contains(c, x, y) && matchCriteria(c, predicates))
    			return c;
    	}
    	// let elems = findElements(container, predicates);

        // for (let elem of elems) {
    	// 	if (contains(elem, x, y))
        //         return elem;   
        // }
    }

    function childrenHitTestByRect(item, rect, predicates) {
    	// let elems = findElements(container, predicates);
    	// for (let elem of elems) {
    	// 	if (elem.bounds.intersects(rect))
    	// 		return elem;
    	// }
    	let result = [];
    	if (!item.children || item.children.length == 0) {
    		return item.bounds.overlap(rect) && item.type !== ElementType.Scene ? [item] : [];
    	}
    	for (let i = item.children.length - 1; i >= 0; i--) {
    		let c = item.children[i];
    		if (c.bounds.overlap(rect))
    			result.push(c);
    	}
    	return result;
    }

    function markPrimitiveHitTest(item, x, y, tolerance) {
    	let leafMarks = getLeafMarks(item);
    	let itm, t = tolerance ? tolerance : 2;
    	let ctx = CanvasProvider.getContext();
    		
    	for (let m of leafMarks) {
    		if (!(m instanceof Path)) continue;
    		let p = CanvasProvider.getPath2D(m.getSVGPathData());
    		ctx.lineWidth = Math.max(m.strokeWidth, t * 2);
    		ctx.stroke(p);
    		if (ctx.isPointInStroke(p, x, y)) {
    			itm = m;
    			break;
    		}
    	}

    	if (!itm) return null;
    	
    	let list = [];
    	for (let v of itm.vertices) {
    		let wd = Math.max(t, v.width, v.radius * 2), ht = Math.max(t, v.height, v.radius * 2);
    		list.push({i: v, b: new Rectangle(v.x - wd/2, v.y - ht/2, wd, ht)});
    	}
    	for (let l of list) {
    		if (l.b.contains(x, y))
    			return l.i;
    	}

    	if (itm.segments && itm.segments.length > 0) {
    		for (let s of itm.segments) {
    			let p = CanvasProvider.getPath2D();
    			p.moveTo(s.vertex1.x, s.vertex1.y);
    			p.lineTo(s.vertex2.x, s.vertex2.y);
    			ctx.lineWidth = Math.max(itm.strokeWidth, t);
    			ctx.stroke(p);
    			if (ctx.isPointInStroke(p, x, y))
    				return s;
    		}
    	}
    	return null;
    }

    function markPrimitiveHitTestByRect(item, rect, tolerance) {
    	let t = tolerance ? tolerance : 2;
    	if (isMark(item)) {
    		let list = [];
    		for (let v of item.vertices) {
    			let wd = Math.max(t, v.width, v.radius * 2), ht = Math.max(t, v.height, v.radius * 2);
    			list.push({i: v, b: new Rectangle(v.x - wd/2, v.y - ht/2, wd, ht)});
    		}
    		if (item.type === ItemType.Rect) {
    			for (let s of item.segments) {
    				let tk = Math.max(item.strokeWidth, t), orientation = s.vertex1.x === s.vertex2.x ? "v" : "h";
    				if (orientation === "v")
    					list.push({i: s, b: new Rectangle(s.vertex1.x - tk/2, d3.min([s.vertex1.y, s.vertex2.y]) - tk/2, tk, Math.abs(s.vertex1.y - s.vertex2.y))});
    				else 
    					list.push({i: s, b: new Rectangle(d3.min([s.vertex1.x, s.vertex2.x]) - tk/2, s.vertex1.y - tk/2,  Math.abs(s.vertex1.x - s.vertex2.x), tk)});
    			}
    		}

    		for (let l of list) {
    			if (l.b.intersects(rect))
    				return l.i;
    		}
    		return null;
    	} else if (!isGuide(item) && item.children && item.children.length > 0) {
    		for (let c of item.children) {
    			if (c.bounds.intersects(rect)) {
    				let r = markPrimitiveHitTestByRect(c, rect, t);
    				if (r) return r;
    			}
    		}
    		return null;
    	}
    	return null;
    }

    const EvtCtxField = {
        X:            "x",
        Y:            "y",
        X_ATTR:       "xAttr",
        Y_ATTR:       "yAttr",
        X_COORDS:     "xCoords",
        Y_COORDS:     "yCoords",
        X_VALS:       "xVals",
        Y_VALS:       "yVals",
        X_VAL:        "xVal",
        Y_VAL:        "yVal",
        SELECTED_ROWS: "selectedRows",
        DX:           "dx",
        DY:           "dy",
        DX_DATA:      "dxData",
        DY_DATA:      "dyData",
        DELTA_X:      "deltaX",
        DELTA_Y:      "deltaY",
        ELEMENT:      "element",
    };

    // For categorical (band/point) x-encodings, compute an array of domain values
    // whose bar/step overlaps the pixel interval [p0, p1]. For numeric scales,
    // fall back to the standard {min, max} interval filter.
    function getEncFilter(enc, pixelInt, child) {
        let scale = enc.getScale(child);
        let scaleType = scale ? scale.type : null;
        if (scaleType === "band") {
            let d3s = scale._scale;
            let bw = d3s.bandwidth();
            return d3s.domain().filter(d => {
                // pos is d3's band left-edge, which Mascot sets as the bar's visual center
                // (range[0] = collectionLeft + barWidth/2). So the bar spans [pos-bw/2, pos+bw/2].
                let pos = d3s(d);
                return pos + bw / 2 > pixelInt[0] && pos - bw / 2 < pixelInt[1];
            });
        } else if (scaleType === "point") {
            let d3s = scale._scale;
            let step = d3s.step();
            return d3s.domain().filter(d => {
                let pos = d3s(d);
                return pos + step / 2 > pixelInt[0] && pos - step / 2 < pixelInt[1];
            });
        }
        let vals = pixelInt.map(d => enc.getAttrValue(d, child)).sort((a, b) => a - b);
        return { min: vals[0], max: vals[1] };
    }

    function buildBrushMetadata(listener) {
        let cache = new Map();
        for (let l of listener) {
            if (!l) continue;
            if (l.type === ElementType.Collection && l.children && l.children.length > 0) {
                let child = l.children[0],
                    xEnc = msc.getChannelEncodingByElement(child, "x"),
                    yEnc = msc.getChannelEncodingByElement(child, "y");
                // When x/y is encoded on a segment rather than the mark directly
                // (e.g. linear-scale histogram using leftSegment/rightSegment), look there.
                let xChild = child, yChild = child;
                if (!xEnc && child.leftSegment) {
                    xEnc = msc.getChannelEncodingByElement(child.leftSegment, "x");
                    if (xEnc) xChild = child.leftSegment;
                }
                if (!yEnc && child.bottomSegment) {
                    yEnc = msc.getChannelEncodingByElement(child.bottomSegment, "y");
                    if (yEnc) yChild = child.bottomSegment;
                }
                cache.set(l.id, {
                    element: l,
                    child,
                    xEnc,
                    yEnc,
                    xChild,
                    yChild,
                    xAttr: xEnc ? (xEnc.sourceAttribute ?? xEnc.attribute) : undefined,
                    yAttr: yEnc ? (yEnc.sourceAttribute ?? yEnc.attribute) : undefined
                });
            } else if (l.type === ElementType.Area) {
                // Densified area: x is encoded on topLeft/bottomLeft vertex;
                // y/height is encoded on the area element itself.
                // Vertex.id === getVertexId(parent, index), so getScale(vertex) works.
                let xEnc = null, xChild = null, yEnc = null, yChild = null;
                if (l.topLeftVertex) {
                    xEnc = msc.getChannelEncodingByElement(l.topLeftVertex, "x");
                    if (xEnc) xChild = l.topLeftVertex;
                }
                if (!xEnc && l.bottomLeftVertex) {
                    xEnc = msc.getChannelEncodingByElement(l.bottomLeftVertex, "x");
                    if (xEnc) xChild = l.bottomLeftVertex;
                }
                // "y" first, then fall back to "height" (common for area charts)
                yEnc = msc.getChannelEncodingByElement(l, "y")
                    ?? msc.getChannelEncodingByElement(l, "height");
                if (yEnc) yChild = l;
                if (!yEnc && l.topLeftVertex) {
                    yEnc = msc.getChannelEncodingByElement(l.topLeftVertex, "y");
                    if (yEnc) yChild = l.topLeftVertex;
                }
                cache.set(l.id, {
                    element: l,
                    child: l,
                    xEnc,
                    yEnc,
                    xChild,
                    yChild,
                    xAttr: xEnc ? (xEnc.sourceAttribute ?? xEnc.attribute) : undefined,
                    yAttr: yEnc ? (yEnc.sourceAttribute ?? yEnc.attribute) : undefined
                });
            }
        }
        return cache;
    }

    function handleBrush(triggers, svg, scene, renderer, renderArgs) {
        for (let trigger of triggers) {
            let listener = trigger.source === "background" ? scene : trigger.source;
            listener = Array.isArray(listener) ? listener : [listener];
            let brushMetaById;
            let brush = trigger.event === "brushX" ? d3__namespace.brushX() : trigger.event === "brushY" ? d3__namespace.brushY() : d3__namespace.brush();
            var g;
            brush.on("start", function(e){
                brushMetaById = buildBrushMetadata(listener);
                if (g && listener.length > 1) {
                    d3__namespace.select(g).call(brush.move, null);
                }
                g = this;
                //let xInt = trigger.mouseEvent ? trigger.mouseEvent.xInterval : undefined,
                //    yInt = trigger.mouseEvent ? trigger.mouseEvent.yInterval : undefined;
                // let ctx = trigger.eventContext;
                // ctx.clear();
                // ctx.set("xInterval", undefined);
                // ctx.set("yInterval", undefined);
                // ctx.set("target", undefined);
                //trigger.mouseEvent = { xInterval: xInt, yInterval: yInt };
                //scene.onChange(VarType.EVT_CTX, ctx);

                //renderer._render(scene, renderArgs);
            });

            brush.on("brush end", function(e){
                let xInt, yInt;
                if (e && e.selection) {
                    switch (trigger.event) {
                        case "brushX":
                            xInt = [e.selection[0], e.selection[1]];
                            yInt = undefined;
                            break;
                        case "brushY":
                            xInt = undefined;
                            yInt = [e.selection[0], e.selection[1]];
                            break;
                        default:
                            xInt = [e.selection[0][0], e.selection[1][0]];
                            yInt = [e.selection[0][1], e.selection[1][1]];
                            break;
                    }
                } else {
                    xInt = undefined;
                    yInt = undefined;
                }

                //console.log("======= brush =======")
                let ctx = trigger.eventContext;
                ctx.clear();
                ctx.set(EvtCtxField.X_COORDS, xInt);
                ctx.set(EvtCtxField.Y_COORDS, yInt);
                let targetId = d3__namespace.select(this).attr("id").replace("brush-", "");
                if (!brushMetaById)
                    brushMetaById = buildBrushMetadata(listener);
                let meta = brushMetaById.get(targetId),
                    xVals = meta && meta.xAttr && xInt ? xInt.map(d => meta.xEnc.getAttrValue(d, meta.xChild)).sort((a, b) => a - b) : undefined,
                    yVals = meta && meta.yAttr && yInt ? yInt.map(d => meta.yEnc.getAttrValue(d, meta.yChild)).sort((a, b) => a - b) : undefined;
                let table = meta && meta.xAttr ? meta.xEnc.dataTable : meta && meta.yAttr ? meta.yEnc.dataTable : undefined;
                let filters = {};
                if (meta && meta.xAttr && xInt) filters[meta.xAttr] = getEncFilter(meta.xEnc, xInt, meta.xChild);
                if (meta && meta.yAttr && yInt) filters[meta.yAttr] = getEncFilter(meta.yEnc, yInt, meta.yChild);
                let selectedRows = table ? table.rows(filters) : undefined;
                if (meta) {
                    ctx.set(EvtCtxField.X_ATTR, meta.xAttr);
                    ctx.set(EvtCtxField.Y_ATTR, meta.yAttr);
                    ctx.set(EvtCtxField.X_VALS, xVals);
                    ctx.set(EvtCtxField.Y_VALS, yVals);
                    ctx.set(EvtCtxField.SELECTED_ROWS, selectedRows);
                }
                //let onChangeStart = performance.now();
                scene.onChange(VarType.EVT_CTX, ctx);
                            // let onChangeEnd = performance.now();
                // let onChangeDuration = onChangeEnd - onChangeStart;
                // console.log(`scene.onChange took ${onChangeDuration.toFixed(3)}ms`);

                //let renderStart = performance.now();
                
                
                
                // let domUpdateTime = performance.now() - renderStart;
                // console.log(`renderer._render (DOM updates) took ${domUpdateTime.toFixed(3)}ms`);
                
                // Measure actual browser painting time
                // requestAnimationFrame(() => {
                //     let totalRenderTime = performance.now() - renderStart;
                //     console.log(`Total render + paint took ${totalRenderTime.toFixed(3)}ms`);
                // });
                if (e && e.type === "end")
                    brushMetaById = undefined;
            });

            for (let l of listener) {
                let b = l.type === ElementType.Axis ? l.boundsWithoutTitle : l.bounds,
                    extent = [[b.left, b.top], [b.right, b.bottom]];
                svg.append("g").attr("class", "brush").attr("id", "brush-" + l.id).call(brush.extent(extent));
            }
        }
    }

    function handleZoom(triggers, svg, scene, renderer, renderArgs) {
        for (let trigger of triggers) {
            trigger.source === "background" ? scene : trigger.source;
            //listener = Array.isArray(listener) ? listener : [listener];
            let zoom = d3__namespace.zoom();
            zoom.on("zoom", (e) => {
                e.sourceEvent.preventDefault();
                e.sourceEvent.stopPropagation();
                //console.log("zooming event", e.transform);
                let ctx = trigger.eventContext;
                ctx.clear();
                let [x, y] = getPositionInScene(svg.attr("id"), e.sourceEvent.clientX, e.sourceEvent.clientY);
                ctx.set(EvtCtxField.X, x);
                ctx.set(EvtCtxField.Y, y);
                //let delta = Math.max(e.sourceEvent.deltaX, e.sourceEvent.deltaY);
                ctx.set(EvtCtxField.DELTA_X, e.sourceEvent.deltaX);
                ctx.set(EvtCtxField.DELTA_Y, e.sourceEvent.deltaY);
                scene.onChange(VarType.EVT_CTX, ctx);
            });
            //console.log(listener.id)
            //d3.select("#" + listener.id).call(zoom);
            svg.call(zoom);
        }
    }

    function handleDrag(triggers, svg, scene, renderer, renderArgs) {
        for (let trigger of triggers) {
            let sel = trigger.source === "background" ? svg.select("#"+scene.id) :
                Array.isArray(trigger.source) ? svg.selectAll(trigger.source.map(s => s.classId ? "." + s.classId : "#" + s.id).join(", ")) :
                trigger.source.classId ? svg.selectAll("." + trigger.source.classId) : svg.select("#" + trigger.source.id);
            let drag = d3__namespace.drag();
            drag.on("start", (e) => {
                let elem = e.sourceEvent.target.__data__;
                if (!elem || (!msc.getChannelEncodingByElement(elem, "x") && !msc.getChannelEncodingByElement(elem, "y"))) {
                    let [sx, sy] = getPositionInScene(svg.attr("id"), e.sourceEvent.clientX, e.sourceEvent.clientY);
                    const allElems = findElements(scene, []);
                    // First try: tight hit test on individual marks
                    elem = allElems.find(el =>
                        el.type !== "vertex" && el.type !== "segment" &&
                        !el.children &&
                        contains(el, sx, sy) &&
                        (msc.getChannelEncodingByElement(el, "x") || msc.getChannelEncodingByElement(el, "y"))
                    );
                    // Fallback: find a mark whose parent's bounding box contains the
                    // cursor (covers empty space between marks, e.g. background drags)
                    if (!elem) {
                        elem = allElems.find(el => {
                            if (el.type === "vertex" || el.type === "segment") return false;
                            if (el.children) return false; // exclude collections, groups, composites
                            if (!msc.getChannelEncodingByElement(el, "x") && !msc.getChannelEncodingByElement(el, "y")) return false;
                            let b = el.parent?.bounds;
                            return b && sx >= b.left && sx <= b.right && sy >= b.top && sy <= b.bottom;
                        });
                    }
                }
                trigger._dragElem = elem;
            });
            drag.on("drag", (e) => {
                let [x, y] = getPositionInScene(svg.attr("id"), e.sourceEvent.clientX, e.sourceEvent.clientY);
                let ctx = trigger.eventContext;
                ctx.set(EvtCtxField.X, x);
                ctx.set(EvtCtxField.Y, y);
                ctx.set(EvtCtxField.DX, e.dx);
                ctx.set(EvtCtxField.DY, e.dy);
                let dragElem = trigger._dragElem;
                ctx.set("element", dragElem);
                if (dragElem) {
                    let xEnc = msc.getChannelEncodingByElement(dragElem, "x");
                    let yEnc = msc.getChannelEncodingByElement(dragElem, "y");
                    if (xEnc) {
                        let notLog = xEnc.getScale(dragElem)?.type !== "log";
                        ctx.set(EvtCtxField.X_ATTR, xEnc.attribute);
                        ctx.set(EvtCtxField.DX_DATA, xEnc.getAttrValue(x - e.dx, dragElem, notLog) - xEnc.getAttrValue(x, dragElem, notLog));
                    }
                    if (yEnc) {
                        let notLog = yEnc.getScale(dragElem)?.type !== "log";
                        ctx.set(EvtCtxField.Y_ATTR, yEnc.attribute);
                        ctx.set(EvtCtxField.DY_DATA, yEnc.getAttrValue(y - e.dy, dragElem, notLog) - yEnc.getAttrValue(y, dragElem, notLog));
                    }
                }
                scene.onChange(VarType.EVT_CTX, ctx);
            });
            drag.on("end", (e) => {
                trigger._dragElem = undefined;
                let ctx = trigger.eventContext;
                ctx.set("element", undefined);
                scene.onChange(VarType.EVT_CTX, ctx);
            });
            sel.call(drag);
        }
    }

    function handleHover(triggers, svg, scene, renderer, renderArgs) {
        for (let trigger of triggers) {
            let sel = trigger.source === "background" ? svg.select("#"+scene.id) :
                Array.isArray(trigger.source) ? svg.selectAll(trigger.source.map(s => s.classId ? "." + s.classId : "#" + s.id).join(", ")) :
                trigger.source.classId ? svg.selectAll("." + trigger.source.classId) : svg.select("#" + trigger.source.id);
            const moveHandler = (e) => {
                let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
                let ctx = trigger.eventContext;
                ctx.set(EvtCtxField.X, x);
                ctx.set(EvtCtxField.Y, y);
                if (trigger.source === "background") {
                    let xEnc = msc.getEncodingsByChannel("x", scene)[0];
                    let yEnc = msc.getEncodingsByChannel("y", scene)[0];
                    let xAttr = xEnc ? xEnc.attribute : undefined,
                        yAttr = yEnc ? yEnc.attribute : undefined;
                    let xVal = xAttr ? xEnc.getAttrValue(x) : undefined,
                        yVal = yAttr ? yEnc.getAttrValue(y) : undefined;
                    ctx.set(EvtCtxField.X_ATTR, xAttr);
                    ctx.set(EvtCtxField.Y_ATTR, yAttr);
                    ctx.set(EvtCtxField.X_VAL, xVal);
                    ctx.set(EvtCtxField.Y_VAL, yVal);
                }
                let elem = e.target.__data__;
                ctx.set(EvtCtxField.ELEMENT, elem);
                scene.onChange(VarType.EVT_CTX, ctx);
            };
            if (trigger.source === "background") {
                svg.on("mousemove", moveHandler);
            } else {
                sel.on("mouseover", moveHandler);
            }
            const outHandler = (e) => {
                let ctx = trigger.eventContext;
                ctx.set(EvtCtxField.ELEMENT, undefined);
                // if (trigger.source === "background") {
                //     ctx.set("xAttribute", undefined);
                //     ctx.set("yAttribute", undefined);
                //     ctx.set("xAttrVal", undefined);
                //     ctx.set("yAttrVal", undefined);
                // }
                scene.onChange(VarType.EVT_CTX, ctx);
            };
            if (trigger.source === "background") {
                svg.on("mouseleave", outHandler);
            } else {
                sel.on("mouseout", outHandler);
            }
        }
    }

    // //deprecated
    // export function handleHover2(triggers, svg, scene, renderer, renderArgs) {
    //     svg.on("mousemove", (e) => {
    //         for (let trigger of triggers) {
    //             let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
    //             let ctx = trigger.eventContext;
    //             ctx.set("x", x);
    //             ctx.set("y", y);

    //             if (trigger.source === "background") {
    //                 scene.onChange(VarType.EVT_CTX, ctx);
    //             } else {
    //                 // if (elementType) {
    // 	// 	predicates.push({property: "type", value: elementType});
    // 	// }
    // 	// if (classId) {
    // 	// 	predicates.push({"property": "classId", "value": classId});
    // 	// }        
    //                 let predicates = [];
    //                 if (trigger.source.type)
    //                     predicates.push({property: "type", value: trigger.source.type});
    //                 if (trigger.source.classId)
    //                     predicates.push({property: "classId", value: trigger.source.classId});
    //                 let hit = findElements(scene, predicates).filter(d => contains(d, x, y))[0],
    //                     elements = ctx.get("elements").slice();
    //                 if (hit)
    //                     trigger.isCumulative && !ctx.get("elements").includes(hit) ? elements.push(hit) : elements = [hit];
    //                 else
    //                     elements = [];
    //                 if (elements.length !== ctx.get("elements").length || !(elements.every((value, index) => value === ctx.get("elements")[index])) ) {
    //                     //ctx.clear();
    //                     ctx.set("elements", elements);
    //                     ctx.set("element", elements.length > 0 ? elements[elements.length - 1] : undefined);
    //                     scene.onChange(VarType.EVT_CTX, ctx);
    //                 }
    //             }
    //         }
    //         renderer._render(scene, renderArgs);
    //     })
    // }

    function handleInput(triggers, svg, scene, renderer, renderArgs) {    
        let keyboardTriggers = triggers.filter(d => d.isKeyboardDriven());
        if (keyboardTriggers.length > 0)
            handleKeyboard(keyboardTriggers, svg, scene);

        for (let trigger of triggers) {
            if (trigger.isStateDriven()) {
                continue; // propagated via StateContext.set → scene.onChange(VarType.STATE)
            } else if (trigger.isKeyboardDriven()) {
                continue;
            } else if (trigger.isWidgetDriven()) {
                let input = Array.isArray(trigger.source) ? trigger.source : [trigger.source];
                let ctrls = input.map(d => document.getElementById(d));
                let ctx = trigger.eventContext;
                
                for (let ctrl of ctrls) {
                    if (!ctrl)
                        continue;
                    ctrl.addEventListener(trigger.event, function() {
                        //triggerActivated(trigger, scene, renderer, renderArgs);
                        ctx.set("inputValue", ctrl.value);
                        if (ctrl.type === "checkbox") {
                            ctx.set("checked", ctrl.checked);
                        }
                        scene.onChange(VarType.EVT_CTX, ctx); 
                        //renderChanges(scene, toUpdate, renderer, renderArgs);
                    } );
                }
            }
            
        }
    }

    function handleKeyboard(triggers, svg, scene, renderer, renderArgs) {
        let namespace = ".mascot-keyboard-" + scene.id + "-" + svg.attr("id"),
            byEvent = {};
        for (let trigger of triggers) {
            let eventType = ["keydown", "keyup"].includes(trigger.event) ? trigger.event : "keydown";
            if (!(eventType in byEvent))
                byEvent[eventType] = [];
            byEvent[eventType].push(trigger);
        }

        for (let eventType in byEvent) {
            d3__namespace.select(window).on(eventType + namespace, null);
            d3__namespace.select(window).on(eventType + namespace, (e) => {
                for (let trigger of byEvent[eventType]) {
                    if (trigger.source !== undefined && e.key !== trigger.source)
                        continue;
                    let ctx = trigger.eventContext;
                    ctx.clear();
                    ctx.set("event", eventType);
                    ctx.set("source", trigger.source);
                    ctx.set("key", e.key);
                    ctx.set("code", e.code);
                    ctx.set("altKey", e.altKey);
                    ctx.set("ctrlKey", e.ctrlKey);
                    ctx.set("metaKey", e.metaKey);
                    ctx.set("shiftKey", e.shiftKey);
                    ctx.set("repeat", e.repeat);
                    scene.onChange(VarType.EVT_CTX, ctx);
                }
            });
        }
    }

    function handleWheel(triggers, svg, scene, renderer, renderArgs) {
        svg.on("wheel", (e) => {
            for (let trigger of triggers) {
                e.preventDefault();
                e.stopPropagation();
                let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
                let ctx = trigger.eventContext;
                //console.log(e.deltaX, e.deltaY);
                ctx.set("deltaX", e.deltaX);
                ctx.set("deltaY", e.deltaY);
                ctx.set("x", x);
                ctx.set("y", y);
                scene.onChange(VarType.EVT_CTX, ctx);
                //renderChanges(scene, toUpdate, renderer, renderArgs);
                // if (trigger.target === "background") {
                //     scene.onChange(VarType.EVT_CTX, ctx);
                // } else {

                // }
            }
            //renderer._render(scene, renderArgs);
        });
    }

    function handleClick(triggers, svg, scene, renderer, renderArgs) {
        svg.on("click", (e) => {
            for (let trigger of triggers) {
                let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
                let ctx = trigger.eventContext;
                let predicates = [];
                if (trigger.source.type)
                    predicates.push({property: "type", value: trigger.source.type});
                if (trigger.source.classId)
                    predicates.push({property: "classId", value: trigger.source.classId});
                let hit = findElements(scene, predicates).filter(d => contains(d, x, y))[0];
                ctx.clear();
                ctx.set("x", x);
                ctx.set("y", y);
                ctx.set("element", hit);
                scene.onChange(VarType.EVT_CTX, ctx);
                // ,
                //     elements = ctx.get("elements").slice();
                // if (hit)
                //     !ctx.get("elements").includes(hit) ? elements.push(hit) : elements = [hit];
                // else
                //     elements = [];
                // if (elements.length !== ctx.get("elements").length || !(elements.every((value, index) => value === ctx.get("elements")[index]))) {
                //     ctx.clear();
                //     ctx.set("x", x);
                //     ctx.set("y", y);
                //     ctx.set("elements", elements);
                //     ctx.set("element", elements.length > 0 ? elements[elements.length - 1] : undefined);
                //     scene.onChange(VarType.EVT_CTX, ctx);
                // }
            }
        });
    }

    // function _click(condEnc, svg, scene, e, classId, renderer, renderArgs) {
    //     let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
    //     let hit = hitTest(scene, condEnc.element.type, x, y);
    //     if (hit)
    //         condEnc.isCumulative ? condEnc.triggerElements.push(hit) : condEnc.triggerElements = [hit];
    //     else
    //         condEnc.triggerElements = [];
    //     condEnc.mouseEvent = {"x": x, "y":y};

    //     // if (condEnc.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
    //     //     setPredicateValues(condEnc, hit)
    //     // } else if (condEnc.type === CondEncType.TRIGGER_ELEMENT_EXISTS) {
    //     //     condEnc.triggerElement = hit;
    //     // }
        
    //     scene.onChange(VarType.COND_ENCODING, condEnc);
    //     renderer._render(scene, renderArgs);

    //     // let predicates = condEnc.predicates,
    //     //     values = condEnc.hitElement ? predicates.map(d => condEnc.hitElement.dataScope.getAttrVal(d.variableName)) :
    //     //         predicates.map(d => undefined);

    //     // if (condEnc.target.classId === classId) {
    //     //     for (const [idx, predicate] of predicates.entries()) {
    //     //         switch (predicate.type) {
    //     //             case PredicateType.POINT:
    //     //                 predicate.value = values[idx];
    //     //                 break;
    //     //             case PredicateType.LIST:
    //     //                 if (values[idx]) predicate.addValue(values[idx]);
    //     //                 else predicate.resetValue();
    //     //                 break;
    //     //             case PredicateType.INTERVAL:
    //     //                 predicate.value = undefined;
    //     //                 break;
    //     //         }
    //     //     }
    //     //     //for (let predicate of predicates)
    //     //     scene.onChange(VarType.COND_ENCODING, condEnc);
    //     //     renderer._render(scene, renderArgs);
    //     //     //return;
    //     // } else { // target different from hit element

    //     // }
    // }

    function renderCircle(c, el) {
        el.setAttribute("cx", c.x);
        el.setAttribute("cy", c.y);
        el.setAttribute("r", c.radius);
    }

    function renderImage(c, el) {
        el.setAttribute("href", c.src);
        el.setAttribute("x", c.x);
        el.setAttribute("y", c.y);
        el.setAttribute("width", c.width);
        el.setAttribute("height", c.height);
    }

    function renderPath(c, el, svg) {
        el.setAttribute("d", c.getSVGPathData());
        if (!c.closed)
            el.style.fill = "none";
        if (c.id.includes("axis") || c.id.includes("gridlines")) {
            el.style.shapeRendering = "crispEdges";
        }
        if (c.type === ElementType.BundledPath) {
            el.style.mixBlendMode = "multiply";
        }
        if (c.type === ElementType.Arrow && svg) {
            renderArrowMarkers(c, el, svg);
        }
    }

    function renderArrowMarkers(c, el, svg) {
        const defs = svg.querySelector("defs");
        if (!defs) return;
        const strokeColor = (c.styles && c.styles.strokeColor) || "#ccc";

        el.removeAttribute("marker-start");
        el.removeAttribute("marker-end");

        if (c.startStyle && c.startStyle !== "none") {
            const id = c.id + "-marker-start";
            _buildMarker(defs, id, c.startStyle, c.startSize, strokeColor);
            el.setAttribute("marker-start", "url(#" + id + ")");
        }
        if (c.endStyle && c.endStyle !== "none") {
            const id = c.id + "-marker-end";
            _buildMarker(defs, id, c.endStyle, c.endSize, strokeColor);
            el.setAttribute("marker-end", "url(#" + id + ")");
        }
    }

    function _buildMarker(defs, id, style, size, color) {
        let marker = defs.querySelector("#" + id);
        if (!marker) {
            marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
            defs.appendChild(marker);
        }
        // Rebuild children on every render so color/size stay in sync
        while (marker.firstChild) marker.firstChild.remove();

        marker.setAttribute("id", id);
        marker.setAttribute("viewBox", "0 0 " + size + " " + size);
        marker.setAttribute("refX", size);
        marker.setAttribute("refY", size / 2);
        marker.setAttribute("markerWidth", size / 2);
        marker.setAttribute("markerHeight", size / 2);
        // auto-start-reverse: same shape works for both marker-start and marker-end
        marker.setAttribute("orient", "auto-start-reverse");

        const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        if (style === "filled") {
            shape.setAttribute("d", "M0,0 L" + size + "," + (size / 2) + " L0," + size + " Z");
            shape.style.fill = color;
            shape.style.stroke = "none";
        } else { // "open"
            shape.setAttribute("d", "M0,0 L" + size + "," + (size / 2) + " L0," + size);
            shape.style.fill = "none";
            shape.style.stroke = color;
            shape.style.strokeWidth = "2";
            shape.style.strokeLinecap = "round";
            shape.style.strokeLinejoin = "round";
        }
        marker.appendChild(shape);
    }

    function renderRect(c, el) {
        //do not use c.left, c.top, c.width, c.height as the rectangle may be flipped
        //use c.bounds
        let b = c.bounds;
        el.setAttribute("x", b.left);
        el.setAttribute("y", b.top);
        el.setAttribute("width", b.width);
        el.setAttribute("height", b.height);
    }

    function renderScene(c, el) {
        el.style.background = c.fillColor ? c.fillColor : "#fff";
    }

    function renderSimpleText(c, el, bgEl) {
        el.setAttribute("text-anchor", getTextAnchor(c.anchor[0]));
        el.setAttribute("alignment-baseline", getTextAnchor(c.anchor[1]));
        el.setAttribute("dominant-baseline", getTextAnchor(c.anchor[1]));
        el.setAttribute("x", c.x);
        el.setAttribute("y", c.y);

        if (bgEl) {
            c._updateBounds();
            let tb = c.bounds;
            bgEl.setAttribute("x", tb.left - 5);
            bgEl.setAttribute("y", tb.top - 5);
            bgEl.setAttribute("width", tb.width + 10);
            bgEl.setAttribute("height", tb.height + 10);
            bgEl.setAttribute("rx", 5);
            bgEl.setAttribute("ry", 5);
            bgEl.style.fill = c.backgroundColor;
            bgEl.style.stroke = c.borderColor;
            bgEl.style.strokeWidth = c.borderWidth;
        }
        if (c.textPath) {
            let textPath = el.querySelector("textPath");
            if (!textPath) {
                textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
                el.appendChild(textPath);
            }
            textPath.setAttribute("href", "#" + getTextPathDomID(c));
            textPath.setAttribute("startOffset", c.textPathOffset);
            textPath.textContent = c.text;
        } else {
            el.textContent = c.text;
        }
    }

    function renderRichText(c, el) {
        // Remove all child elements
        while (el.firstChild) {
            el.firstChild.remove();
        }
        el.setAttribute("width", c.width);
        el.setAttribute("x", c.x);
        el.setAttribute("y", c.y);
        el.style.border = '1px solid #ddd';

        let div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        div.style.width = "100%";
        div.style.padding = "10px";
        div.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
        div.style.color = "black";
        div.style.visibility = "visible";
        div.style.boxSizing = "border-box";
        div.style.opacity = "1";
        div.innerHTML = c.text;
        el.appendChild(div);
        el.setAttribute("height", div.offsetHeight);
    }

    function getTextBgDomID(c) {
        return c.id + "-bg";
    }

    function getTextPathDomID(c) {
        return c.id + "-path";
    }

    function applyStyles(c, el, svg) {
        if (!c.styles) return;
        let styles = Object.keys(c.styles);
        if (c.type === ElementType.RichText) {
            styles = styles.filter(d => ["textAnchor", "fillColor"].indexOf(d) < 0);
        }
        for (let s of styles) {
            if (c.styles[s] === undefined)
                continue;
            if (s.indexOf("Color") > 0 && c.styles[s].type == ElementType.LinearGradient) {
                const defs = svg.querySelector("defs");
                const gradient = c.styles[s];
                let existingGrad = defs.querySelector("#" + gradient.id);
                if (!existingGrad) {
                    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                    grad.setAttribute("id", gradient.id);
                    grad.setAttribute("x1", gradient.x1 + "%");
                    grad.setAttribute("x2", gradient.x2 + "%");
                    grad.setAttribute("y1", gradient.y1 + "%");
                    grad.setAttribute("y2", gradient.y2 + "%");
                    
                    for (let stop of gradient.stops) {
                        const stopEl = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                        stopEl.setAttribute("offset", stop.offset + "%");
                        stopEl.style.stopColor = stop.color;
                        stopEl.style.stopOpacity = stop.opacity;
                        grad.appendChild(stopEl);
                    }
                    defs.appendChild(grad);
                }
                el.style[Style2SVG[s]] = "url(#" + gradient.id + ")";
            } else {
                el.style[Style2SVG[s]] = c.styles[s];
                if (s === "visibility") {
                    if (c.type === ElementType.SimpleText) {
                        if (c.hasBackground()) {
                            const bgEl = svg.querySelector("#" + getTextBgDomID(c));
                            if (bgEl) {
                                bgEl.style[Style2SVG[s]] = c.styles[s];
                            }
                        }
                    } else if (c.type === ElementType.RichText) {
                        const div = el.querySelector("div");
                        if (div) {
                            div.style.visibility = c.styles[s];
                        }
                    }
                }
            }

        }
    }

    function getTextAnchor(anchor) {
        switch (anchor) {
            case BoundsAnchor.TOP:
                return "text-before-edge";
            //return "hanging";
            case BoundsAnchor.BOTTOM:
                //return "text-after-edge";
                return "auto";
            case BoundsAnchor.LEFT:
                return "start";
            case BoundsAnchor.RIGHT:
                return "end";
            case BoundsAnchor.CENTER:
                return "middle";
            case BoundsAnchor.MIDDLE:
                return "middle";
            default:
                return anchor;
        }
    }

    function updateRect(elem, svgEl, props) {
        //do not use c.left, c.top, c.width, c.height as the rectangle may be flipped
        //use c.bounds
        let b = elem.bounds;
        for (let prop of props) {
            switch (prop) {
                case "x":
                    svgEl.setAttribute("x", b.left);
                    break;
                case "y":
                    svgEl.setAttribute("y", b.top);
                    break;
                case "width":
                    svgEl.setAttribute("width", b.width);
                    break;
                case "height":
                    svgEl.setAttribute("height", b.height);
                    break;
                default:
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
            }
        }
        elem._dirty = false;
    }

    function updateCircle(elem, svgEl, props) {
        for (let prop of props) {
            switch (prop) {
                case "x":
                    svgEl.setAttribute("cx", elem.x);
                    break;
                case "y":
                    svgEl.setAttribute("cy", elem.y);
                    break;
                case "radius":
                    svgEl.setAttribute("r", elem.radius);
                    break;
                default:
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
            }
        }
        elem._dirty = false;
    }

    function updatePath(elem, compMap, props) {
        let svgEl = compMap[elem.id];
        //let needsPathRedraw = false;
        for (let prop of props) {
            switch (prop) {
                case "d": case "strength": case "vertices":
                case "x1":case "y1": case "x2": case "y2":
                    svgEl.setAttribute("d", elem.getSVGPathData());
                    break;
                // Arrow endpoint props — redraw the path and markers
                // case "x1": case "y1": case "x2": case "y2":
                //     needsPathRedraw = true;
                //     break;
                // Arrow head style/size props — markers only
                case "startStyle": case "startSize": case "endStyle": case "endSize":
                    break;
                default:
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
            }
        }
        // if (needsPathRedraw) {
        //     svgEl.setAttribute("d", elem.getSVGPathData());
        // }
        if (elem.type === ElementType.Arrow) {
            const svg = svgEl.ownerSVGElement;
            if (svg) renderArrowMarkers(elem, svgEl, svg);
        }
        if (elem.vertices && elem.vertices.length > 0) {
            let vertices = elem.vertices.filter(d => d.shape !== undefined);
            if (vertices.length > 0) {
                for (let v of vertices) {
                    let vEl = compMap[elem.id + "-vertices-" + v.id];
                    if (v.shape == "rect") {
                        vEl.setAttribute("x", v.x - v.width / 2);
                        vEl.setAttribute("y", v.y - v.height / 2);
                        vEl.setAttribute("width", v.width);
                        vEl.setAttribute("height", v.height);
                    } else if (v.shape == "circle") {
                        vEl.setAttribute("cx", v.x);
                        vEl.setAttribute("cy", v.y);
                        vEl.setAttribute("r", v.radius);
                    }
                    vEl.style.fill = v.fillColor;
                    vEl.style.opacity = v.opacity;
                    vEl.style.strokeWidth = v.strokeWidth;
                    vEl.style.stroke = v.strokeColor;
                }
            }
        }
        elem._dirty = false;
    }

    function updateSimpleText(elem, svgEl, props, bgEl) {
        for (let prop of props) {
            switch (prop) {
                case "text":
                    svgEl.textContent = elem.text;
                    if (bgEl) {
                        bgEl.setAttribute("width", elem.bounds.width + 10);
                        bgEl.setAttribute("height", elem.bounds.height + 10);
                    }
                    break;
                case "x":
                    svgEl.setAttribute("x", elem.x);
                    if (bgEl) bgEl.setAttribute("x", elem.bounds.left - 5);
                    break;
                case "y":
                    svgEl.setAttribute("y", elem.y);
                    if (bgEl) bgEl.setAttribute("y", elem.bounds.top - 5);
                    break;
                default:
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    if (bgEl) bgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
            }
        }
        elem._dirty = false;
    }

    function updateRichText(elem, svgEl, props) {
        for (let prop of props) {
            switch (prop) {
                case "text": {
                    const div = svgEl.querySelector("div");
                    if (div) {
                        div.innerHTML = elem.text;
                        svgEl.setAttribute("height", div.offsetHeight);  
                    }
                    break;
                }
                case "x":
                    svgEl.setAttribute("x", elem.x);
                    break;
                case "y":
                    svgEl.setAttribute("y", elem.y);
                    break;
                case "width":
                    svgEl.setAttribute("width", elem.width);
                    break;
                case "visibility":
                    const div = svgEl.querySelector("div");
                    if (div) {
                        div.style.visibility = elem.visibility;
                    }
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
                default:
                    svgEl.style[Style2SVG[prop]] = elem[prop];
                    break;
            }
        }
        elem._dirty = false;
    }

    function updateGridlines(elem, svgEl, props) {
        for (let prop of props) {
            if (prop === "gridlinesPosition") {
                svgEl.setAttribute("d", elem.getSVGPathData());
            } else {
                svgEl.style[Style2SVG[prop]] = elem[prop];
            }
        }
        elem._dirty = false;
    }

    function updateGlyph(elem, props, renderer) {
        let positionChanged = props.some(prop => prop === "x" || prop === "y");
        getPeers(elem).forEach(p => {
            let el = renderer._compMap[p.id];
            if (!el) return;
            if (positionChanged) {
                // GridPlacer moved this glyph — re-render all children to
                // propagate translated positions to the DOM.
                for (let child of p.children) {
                    renderer._renderItem(child, {});
                }
            }
            // Apply glyph-level style changes
            if (p._dirty !== false || !positionChanged) {
                for (let prop of props) {
                    if (prop === "visibility") el.style.visibility = p.visibility;
                    else if (prop === "opacity") el.style.opacity = p.opacity;
                }
                p._dirty = false;
            }
        });
    }

    function updateAxis(elem, renderer) {
        let axisElems = Object.keys(renderer._compMap).filter(d => d.startsWith(elem.id + "_"));
        for (let k of axisElems) {
            renderer._removed[k] = 1;
        }
        renderer._renderItem(elem);

        for (let k in renderer._removed) {
            if (k in renderer._compMap) {
                renderer._compMap[k].remove();
                delete renderer._compMap[k];
            }
        }

        for (let k of axisElems) {
            delete renderer._removed[k];
        }
    }

    class SVGRenderer {

        constructor(svgId) {
            this._svgId = svgId;
            this._svg = document.getElementById(this._svgId);
            this._compMap = {};
            this._decoMap = {};
            //this._brushCreated = 0;

            this._lastTriggerEvt = undefined;
        }

        render(scene, params) {
            // Ensure the SVG element exists; if not, defer until DOM is ready
            if (!this._svg) {
                // Try to resolve again in case DOM is already ready
                this._svg = document.getElementById(this._svgId);
                if (!this._svg) {
                    const proceed = () => {
                        this._svg = document.getElementById(this._svgId);
                        if (!this._svg) {
                            console.error("SVGRenderer: SVG element '#" + this._svgId + "' not found after DOMContentLoaded.");
                            return;
                        }
                        // Retry render after SVG becomes available
                        this.render(scene, params);
                    };
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', proceed, { once: true });
                    } else {
                        // DOM already ready but element missing; schedule microtask retry
                        Promise.resolve().then(proceed);
                    }
                    return; // Defer rendering until SVG is available
                }
            }
            // this._compMap = {};
            // this._decoMap = {};
            //this._brushCreated = 0;

            let args = params ? params : {};
            if (!this._svg.querySelector("defs")) {
                const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                this._svg.appendChild(defs);
            }
            this._render(scene, args);
            this._registerEvents(scene, args);
            if (!scene._renderers.includes(this))
                scene._renderers.push(this);
        }

        //only repaints, do not update events
        _render(scene, args, transition) {
            for (let k in this._decoMap) {
                this._decoMap[k].remove();
                delete this._decoMap[k];
            }
            this._removed = {};
            for (let k in this._compMap) {
                this._removed[k] = 1;
            }
            this._renderItem(scene, args, transition);
            for (let k in this._removed) {
                this._compMap[k].remove();
                delete this._compMap[k];
            }
        }

        _registerEvents(scene, renderArgs) {
            let svg = d3__namespace.select("#" + this._svgId);
            svg.on('.', null);
            for (let evt in scene.interactionTriggers) {
                let triggers = Object.values(scene.interactionTriggers[evt]);
                switch (evt) {
                    case "click":
                        svg.on("click", null);
                        handleClick(triggers, svg, scene);
                        break;
                    case "brush":
                    case "brushX":
                    case "brushY":
                        handleBrush(triggers, svg, scene);
                        break;
                    case "drag":
                    case "dragX":
                    case "dragY":
                        handleDrag(triggers, svg, scene);
                        break;
                    case "hover":
                        handleHover(triggers, svg, scene);
                        break;
                    case "change":
                    case "input":
                        handleInput(triggers, svg, scene);
                        break;
                    case "keydown":
                    case "keyup":
                        handleKeyboard(triggers, svg, scene);
                        break;
                    case "zoom":
                        handleZoom(triggers, svg, scene);   
                        break;
                    case "scroll":
                        handleWheel(triggers, svg, scene);
                        break;
                }
            }
        }

        clear() {
            if (!this._svg) return;
            while (this._svg.firstChild) {
                this._svg.firstChild.remove();
            }
            // Remove all event listeners
            // const newSvg = this._svg.cloneNode(true);
            // this._svg.parentNode.replaceChild(newSvg, this._svg);
            // this._svg = newSvg;
            d3__namespace.select("#" + this._svgId).on('.', null);
            console.log("clearing canvas");
            this._compMap = {};
            this._decoMap = {};
        }

        _renderItem(c, args, transition) {
            
            this._configSVG(c);

            if ((!c.children) && c._dirty === false) {
                //console.log(c.type + " is clean, skip rendering");
                return;
            }

            let el = this._compMap[c.id];

            if (transition) {
                // Apply CSS transition for smooth animations
                const delay = transition.delay || 0;
                const duration = transition.duration || 0;
                el.style.transition = `all ${duration}ms ease ${delay}ms`;
            }

            switch(c.type) {
                case ElementType.Scene:
                    renderScene(c, this._svg);
                    break;
                case ElementType.Circle:
                    renderCircle(c, el);
                    break;
                case ElementType.Rect:
                    renderRect(c, el);
                    break;
                case ElementType.Path:
                case ElementType.BezierCurve:
                case ElementType.BundledPath:
                case ElementType.Chord:
                case ElementType.Polygon:
                case ElementType.Link:
                case ElementType.Pie:
                case ElementType.Line:
                case ElementType.Area:
                case ElementType.Ring:
                case ElementType.Arc:
                case ElementType.Gridlines:
                case ElementType.Arrow:
                    renderPath(c, el, this._svg);
                    break;
                case ElementType.SimpleText:
                    renderSimpleText(c, el, this._compMap[getTextBgDomID(c)]);
                    break;
                case ElementType.RichText:
                    renderRichText(c, el);
                    break;
                case ElementType.Image:
                    renderImage(c, el);
                    break;
            }

            if (c._rotate)
                el.setAttribute("transform", "rotate(" + c._rotate.join(" ") + ")");

            applyStyles(c, el, this._svg);

            // render vertices if shape is defined
            if (c.vertices && c.vertices.length > 0 && c.vertices.map(v => v.shape).filter(s => s !== undefined).length > 0) {
                this._renderVertices(c);
            }

            // render collection bound
            //ElementType.Collection, ElementType.Glyph, ElementType.Axis, ElementType.Legend
            if (args && args["bounds"]) {
                this._renderBounds(c);
            } else if (isMark(c) && args && args["refBounds"]) {
                this._renderRefBounds(c);
            }

            if (c.clipMask) {
                const defs = this._svg.querySelector("defs");
                let clipPath = defs.querySelector("#" + c.id + "-clipPath");
                if (!clipPath) {
                    clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                    clipPath.setAttribute("id", c.id + "-clipPath");
                    defs.appendChild(clipPath);
                }
                let rect = clipPath.querySelector("rect");
                if (!rect) {
                    rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    clipPath.appendChild(rect);
                }
                rect.setAttribute("x", c.clipMask.left);
                rect.setAttribute("y", c.clipMask.top);
                rect.setAttribute("width", c.clipMask.width);
                rect.setAttribute("height", c.clipMask.height);
                el.setAttribute("clip-path", "url(#" + c.id + "-clipPath" + ")");

                // Transparent background rect covering the masked area so that pointer
                // events (drag, zoom) fire on empty space and bubble up to the scene <g>.
                let bgId = c.id + "-bg";
                let bg = el.querySelector("#" + bgId);
                if (!bg) {
                    bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    bg.setAttribute("id", bgId);
                    bg.setAttribute("pointer-events", "all");
                    bg.setAttribute("fill", "transparent");
                    el.insertBefore(bg, el.firstChild);
                }
                bg.setAttribute("x", c.clipMask.left);
                bg.setAttribute("y", c.clipMask.top);
                bg.setAttribute("width", c.clipMask.width);
                bg.setAttribute("height", c.clipMask.height);
            }

            if (c.children) {
                let sorted = [...c.children].sort((a, b) => (a.z || 0) - (b.z || 0));
                for (let child of sorted) {
                    this._renderItem(child, args, transition);
                }
            } else {
                c._dirty = false; //mark as clean
            }
        }

        _renderChanges(scene, toUpdate) {
            for (let elemId in toUpdate) {
                let elem = scene.getElement(elemId);
                if (!elem) continue;
                //console.log(elemId, elem, toUpdate[elemId]);
                switch (elem.type) {
                    case ElementType.Rect:
                        getPeers(elem).forEach(p => { if (p._dirty === false) return; updateRect(p, this._compMap[p.id], toUpdate[elemId]); });
                        break;
                    case ElementType.Circle:
                        getPeers(elem).forEach(p => { if (p._dirty === false) return; updateCircle(p, this._compMap[p.id], toUpdate[elemId]); });
                        break;
                    case ElementType.Path:
                    case ElementType.Area:
                    case ElementType.Line:
                    case ElementType.Arrow:
                    case ElementType.BezierCurve:
                    case ElementType.BundledPath:
                        let props = [], spatialProps = ["x", "y", "width", "height"];
                        for (let p of toUpdate[elemId]) {
                            if (spatialProps.includes(p)) {
                                if (props.indexOf("d") < 0) props.push("d");
                            } else {
                                props.push(p);
                            }
                        }
                        getPeers(elem).forEach(p => { if (p._dirty === false) return; updatePath(p, this._compMap, props); });
                        //this._update(getPeers(elem), props);
                        break;
                    case ElementType.SimpleText:
                        getPeers(elem).forEach(p => { if (p._dirty === false) return; updateSimpleText(p, this._compMap[p.id], toUpdate[elemId], this._compMap[getTextBgDomID(p)]); });
                        break;
                    case ElementType.RichText:
                        getPeers(elem).forEach(p => { if (p._dirty === false) return; updateRichText(p, this._compMap[p.id], toUpdate[elemId]); });
                        break;
                    case ElementType.Glyph:
                        updateGlyph(elem, toUpdate[elemId], this);
                        break;
                    case ElementType.Gridlines:
                        //console.log(toUpdate[elemId]);
                        if (elem._dirty === true) updateGridlines(elem, this._compMap[elem.id], toUpdate[elemId]);
                        break;
                    case ElementType.Axis:
                        getPeers(elem).forEach(p => { updateAxis(p, this); });
                        break;
                    case ElementType.Collection:
                    case ElementType.Group:
                    case ElementType.Composite:
                        // Group-type elements have no direct SVG node to update;
                        // their children handle their own incremental rendering.
                        break;
                    default:
                        console.warn("unsupported element type for update: " + elem.type);
                        //this._update(getPeers(elem), toUpdate[elemId]);
                        break;
                }
                //console.log(elem.id, props);
                //this._update(getPeers(elem), props);
                if (toUpdate[elemId].includes("z") && elem.parent) {
                    this._reorderSiblingsByZ(elem.parent);
                }
            }
            // let condEncs = scene.getConditionalEncodings(trigger.id),
            //     props = condEncs.map(d => d.responderProperties).flat();
            // let styles = Object.keys(Style2SVG);
            // let allPropsAreStyles = props.every(prop => styles.includes(prop));
            // if (allPropsAreStyles) {
            //     let elems = [];
            //     for (let condEnc of condEncs) {
            //         let respCompnts = Array.isArray(condEnc.responderComponent) ? condEnc.responderComponent : [condEnc.responderComponent];
            //         for (let rc of respCompnts) {
            //             elems = elems.concat(getPeers(rc));
            //         }
            //         renderer._update(elems, condEnc.responderProperties);
            //     }
            // } else {
            //     renderer._render(scene, renderArgs);
            // }
        }

        // _update(elems, props) {
        //     for (let elem of elems) {
        //         if (elem._dirty === false) continue;
        //         if (!(elem.id in this._compMap)) continue;
                
        //         for (let p of props) {
        //             this._updateProperty(elem, this._compMap[elem.id], p);
        //         }
        //     }
        // }

        // _updateProperty(elem, svgEl, property) {
        //     // let value = elem[property];
        //     // if (elem.type === ElementType.Rect) {
        //     //     if (property === "x") value = elem.left;
        //     //     if (property === "y") value = elem.top;
        //     // }
        //     if (Object.keys(Style2SVG).includes(property)) {
        //         svgEl.style[Style2SVG[property]] = elem[property];
        //     } else {
        //         switch(elem.type) {
        //             case ElementType.Rect:
        //                 updateRect(elem, svgEl, property);
        //                 break;
        //         }
        //     }
                
        //     //     if (property === "d") {
        //     //     svgEl.setAttribute("d", elem.getSVGPathData());
        //     // } else {
        //     //     svgEl.setAttribute(Style2SVG[property], value);
        //     // }
        //     elem._dirty = false;
        // }

        _reorderSiblingsByZ(parent) {
            let svgParent = this._compMap[parent.id];
            if (!svgParent) return;
            let sorted = [...parent.children].sort((a, b) => (a.z || 0) - (b.z || 0));
            for (let child of sorted) {
                let svgChild = this._compMap[child.id];
                if (svgChild) svgParent.appendChild(svgChild); // moves to end if already present
            }
        }

        _configSVG(c) {
            if (!(c.id in this._compMap)) {
                let svgParent, parent = c.parent;
                if (parent && parent.id && parent.id in this._compMap) {
                    svgParent = this._svg.querySelector("#" + parent.id);
                } else {
                    svgParent = this._svg;
                }
                //TODO: what if the parent is not rendered? What if the hierarchy has changed?
                if (c.type === ElementType.SimpleText) {
                    if (c.hasBackground()) {
                        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        rect.setAttribute("id", getTextBgDomID(c));
                        svgParent.appendChild(rect);
                        this._compMap[getTextBgDomID(c)] = rect;
                    }
                    if (c.textPath) {
                        const defs = this._svg.querySelector("defs");
                        const id = getTextPathDomID(c);
                        let path = defs.querySelector("#" + id);
                        if (!path) {
                            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            path.setAttribute("id", id);
                            defs.appendChild(path);
                            this._compMap[id] = path;
                        }
                        path.setAttribute("d", c.textPath);
                        path.style.fill = "none";
                    }
                }
                const element = document.createElementNS("http://www.w3.org/2000/svg", this._getSVGElementType(c));
                if (svgParent) {
                    svgParent.appendChild(element);
                } else {
                    console.warn("Parent element not found for ", c.id, c.parent ? c.parent.id : null);
                }
                this._compMap[c.id] = element;
            } else {
                delete this._removed[c.id];
                if (c.type === ElementType.SimpleText) {
                    if (c.hasBackground()) delete this._removed[getTextBgDomID(c)];
                    if (c.textPath) delete this._removed[getTextPathDomID(c)];
                }
            }

            if (c.type == ElementType.Gridlines) {
                // Move element to front (equivalent to d3's lower())
                const parent = this._compMap[c.id].parentNode;
                parent.insertBefore(this._compMap[c.id], parent.firstChild);
            }
            this._compMap[c.id].setAttribute("id", c.id);
            this._compMap[c.id].__data__ = c;
            let className = c.type;
            if (c.classId) 
                className += " " + c.classId;
            if (c.parent && c.parent.type === ElementType.Axis) {
                className += c.id.endsWith("_ticks") ? " axis_ticks" : c.id.endsWith("_labels") ? " axis_labels" : "";
            }
            this._compMap[c.id].setAttribute("class", className);
        }

        _renderBounds(c) {
            let b = c.bounds;
            if (c.layout && c.layout.type == "grid") {
                this._renderLayout(c);
            }
            // } else {
            //     if (!(c.id in this._decoMap)) {
            //         this._decoMap[c.id] = d3.select("#" + this._svgId).append("rect").attr("class", "deco");
            //     }
            //     this._decoMap[c.id].attr("x", b.left).attr("y", b.top)
            //         .attr("width", b.width).attr("height", b.height).attr("fill", "none")
            //         .attr("stroke", "#1ecb40").attr("stroke-width", "2px")
            //         .attr("stroke-dasharray", "5,5");
            // }
            if (!(c.id in this._decoMap)) {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("class", "deco");
                this._svg.appendChild(rect);
                this._decoMap[c.id] = rect;
            }
            const rect = this._decoMap[c.id];
            rect.setAttribute("x", b.left);
            rect.setAttribute("y", b.top);
            rect.setAttribute("width", b.width);
            rect.setAttribute("height", b.height);
            rect.setAttribute("fill", "none");
            rect.setAttribute("stroke", "blue");
            rect.setAttribute("stroke-width", "1px");
            rect.setAttribute("stroke-dasharray", "5,5");

            //render text/axis bound
            //let types = [ElementType.SimpleText];
            // if (types.indexOf(c.type) >= 0) {
            //     console.log("draw text")
            //     let id = c.id + "-box";
            //     let b = c.bounds;
            //     if (!(id in this._decoMap)) {
            //         this._decoMap[id] = d3.select("#" + this._svgId).append("rect");
            //     }
            //     this._decoMap[id].attr("x", b.left).attr("y", b.top)
            //         .attr("width", b.width).attr("height", b.height).attr("fill", "none")
            //         .attr("stroke", "#1ecb40").attr("stroke-width", "1px")
            //         .attr("stroke-dasharray", "5,5");
            // }
        }

        _renderRefBounds(c) {
            let b = c.refBounds;
            if (b) {
                if (!(c.id in this._decoMap)) {
                    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    rect.setAttribute("class", "deco");
                    this._svg.appendChild(rect);
                    this._decoMap[c.id] = rect;
                }
                const rect = this._decoMap[c.id];
                rect.setAttribute("x", b.left);
                rect.setAttribute("y", b.top);
                rect.setAttribute("width", b.width);
                rect.setAttribute("height", b.height);
                rect.setAttribute("fill", "none");
                rect.setAttribute("stroke", "blue");
                rect.setAttribute("stroke-width", "1px");
                rect.setAttribute("stroke-dasharray", "5,5");
            }
        }

        _renderVertices(c) {
            let id = c.id + "-vertices";
            if (!(id in this._compMap)) {
                let parent = c.parent,
                    pid = parent ? parent.id : this._svgId;
                const parentElement = this._svg.querySelector("#" + pid);
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("id", id);
                parentElement.appendChild(g);
                this._compMap[id] = g;
            } else {
                delete this._removed[id];
            }

            let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
            if (shapes.length === 0) {
                this._compMap[id].style.visibility = "hidden";
                return;
            } else {
                this._compMap[id].style.visibility = "visible";
            }

            let vertices = c.vertices.filter(d => d.shape !== undefined);
            for (let v of vertices) {
                let vid = id + "-" + v.id;
                if (!(vid in this._compMap)) {
                    const element = document.createElementNS("http://www.w3.org/2000/svg", v.shape);
                    element.setAttribute("id", vid);
                    this._compMap[id].appendChild(element);
                    this._compMap[vid] = element;
                } else if (v.shape !== this._compMap[vid].tagName) {
                    this._compMap[vid].remove();
                    const element = document.createElementNS("http://www.w3.org/2000/svg", v.shape);
                    element.setAttribute("id", vid);
                    this._compMap[id].appendChild(element);
                    this._compMap[vid] = element;
                    delete this._removed[vid];
                } else {
                    delete this._removed[vid];
                }
                const element = this._compMap[vid];
                if (v.shape == "rect") {
                    element.setAttribute("x", v.x - v.width / 2);
                    element.setAttribute("y", v.y - v.height / 2);
                    element.setAttribute("width", v.width);
                    element.setAttribute("height", v.height);
                } else if (v.shape == "circle") {
                    element.setAttribute("cx", v.x);
                    element.setAttribute("cy", v.y);
                    element.setAttribute("r", v.radius);
                }
                element.style.fill = v.fillColor;
                element.style.opacity = v.opacity;
                element.style.strokeWidth = v.strokeWidth;
                element.style.stroke = v.strokeColor;
            }
        }

        _renderLayout(c) {
            let gridId = c.id + "-grid";
            if (!(gridId in this._decoMap)) {
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("id", gridId);
                g.setAttribute("class", "deco");
                this._svg.appendChild(g);
                this._decoMap[gridId] = g;
            }
            let cellBounds = c.layout.cellBounds; c.layout.rowGap;
            // Remove all existing rects
            const rects = this._decoMap[gridId].querySelectorAll("rect");
            rects.forEach(rect => rect.remove());
            
            for (let cb of cellBounds) {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", cb.left);
                rect.setAttribute("y", cb.top);
                rect.setAttribute("width", cb.width);
                rect.setAttribute("height", cb.height);
                rect.setAttribute("stroke", "blue");
                rect.setAttribute("stroke-width", "1px");
                rect.setAttribute("stroke-dasharray", "5,5");
                rect.setAttribute("fill", "none");
                this._decoMap[gridId].appendChild(rect);
            }
        }

        _getSVGElementType(cpnt) {
            switch (cpnt.type) {
                case ElementType.Rect:
                    return "rect";
                case ElementType.Collection:
                case ElementType.Group:
                case ElementType.Glyph:
                case ElementType.Scene:
                case ElementType.Axis:
                case ElementType.Legend:
                case ElementType.Composite:
                    return "g";
                case ElementType.Area:
                case ElementType.Path:
                case ElementType.Polygon:
                case ElementType.Ring:
                case ElementType.Pie:
                case ElementType.Arc:
                case ElementType.BezierCurve:
                case ElementType.BundledPath:
                case ElementType.Chord:
                case ElementType.Line:
                case ElementType.Gridlines:
                case ElementType.Arrow:
                    return "path";
                case ElementType.Circle:
                    return "circle";
                case ElementType.SimpleText:
                    return "text";
                case ElementType.RichText:
                    return "foreignObject";
                case "vertex":
                    if (cpnt.shape == "circle")
                        return "circle";
                    else if (cpnt.shape == "rect")
                        return "rect";
                    else throw "argument exception";
                case "image":
                    return "image";
            }
        }
    }

    function areBothDefined(obj1, obj2) {
        if (typeof obj1 === 'undefined' && typeof obj2 === 'undefined') {
            return true;
        }
        if (typeof obj1 !== 'undefined' && typeof obj2 !== 'undefined') {
            return true;
        }
        return false;
    }

    function simpleObjectsEqual(obj1, obj2) {
        if (!haveSameKeys(obj1, obj2)) {
            console.log("different keys", obj1, obj2);
            return false;
        }

        for (let k in obj1) {
            if (obj1[k] !== obj2[k])
                return false;
        }

        return true;
    }

    function haveSameKeys(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        if (keys1.length === 0)
            return true;

        return keys1.every(key => keys2.includes(key));
    }

    function layoutsEqual(e1, e2) {
        if (!areBothDefined(e1.layout, e2.layout)) {
            console.log("Not both defined or undefined:", e1.bounds, e2.bounds);
            return false;
        }

        let l1 = e1.layout, l2 = e2.layout;
        if (!l1 && !l2)
            return true;

        if (l1.type !== l2.type) {
            console.log("layout types are different:", l1, l2);
            return false;
        }

        switch (l1.type) {
            case LayoutType.GRID:
                return gridLayoutsEqual(l1, l2);
            case LayoutType.STACK:
                return stackLayoutsEqual(l1, l2);
            case LayoutType.PACKING:
                return packingLayoutsEqual(l1, l2);
            case LayoutType.FORCE:
                return forceLayoutsEqual(l1, l2);
            case LayoutType.DIRECTED:
                return directedLayoutsEqual(l1, l2);
            case LayoutType.TIDYTREE:
                return tidyTreeLayoutsEqual(l1, l2);
            case LayoutType.STRATA:
                return strataLayoutsEqual(l1, l2);
            case LayoutType.TREEMAP:
                return treemapLayoutsEqual(l1, l2);
            default:
                return false;
        }
    }

    function strataLayoutsEqual(l1, l2) {
        return l1._direction === l2._direction && l1._gap === l2._gap;
    }

    function directedLayoutsEqual(l1, l2) {
        return l1._width === l2._width && l1._height === l2._height && l1._top === l2._top && l1._left === l2._left && l1._edgeSep === l2._edgeSep && l1._spreadLinks === l2._spreadLinks && l1._direction === l2._direction;
    }

    function treemapLayoutsEqual(l1, l2) {
        return l1._width === l2._width && l1._height === l2._height && l1._top === l2._top && l1._left === l2._left;
    }

    function tidyTreeLayoutsEqual(l1, l2) {
        return l1._width === l2._width && l1._height === l2._height && l1._top === l2._top && l1._left === l2._left && l1._orientation === l2._orientation;
    }

    function forceLayoutsEqual(l1, l2) {
        return l1._x === l2._x && l1._y === l2._y && l1._iterations === l2._iterations && l1._repulsion === l2._repulsion && l1._attraction === l2._attraction && l1._linkDistance === l2._linkDistance;
    }

    function packingLayoutsEqual(l1, l2) {
        return l1._x === l2._x && l1._y === l2._y && l1._width === l2._width && l1._height === l2._height;
    }

    function stackLayoutsEqual(l1, l2) {
        return l1._orientation === l2._orientation && l1._direction === l2._direction && l1._left === l2._left && l1._top === l2._top && l1._horzCellAlignment === l2._horzCellAlignment && l1._vertCellAlignment === l2._vertCellAlignment && l1._gap === l2._gap;
    }

    function gridLayoutsEqual(l1, l2) {

        if (l1._cellBounds.length !== l2._cellBounds.length) {
            console.log("cell bounds length different:", l1, l2);
        }

        for (let i = 0; i < l1._cellBounds; i++) {
            if (!rectanglesEqual(l1._cellBounds[i], l2._cellBounds[i])) {
                console.log("cell bounds not equal:", l1, l2);
                return false;
            }
        }

        for (let i = 0; i < l1._grid.length; i++) {
            for (let j = 0; j < l1._grid[i].length; j++) {
                if (l1._grid[i][j] !== l2._grid[i][j]) {
                    console.log("grid not equal", l1, l2);
                    return false;
                }
            }

        }

        return l1._numCols === l2._numCols && l1._numRows === l2._numRows &&
            l1._start === l2._start && l1._direction === l2._direction &&
            l1._rowGap === l2._rowGap && l1._colGap === l2._colGap &&
            l1._cellHorzAlignment === l2._cellHorzAlignment &&
            l1._cellVertAlignment === l2._cellVertAlignment &&
            l1._rowOffset === l2._rowOffset && l1._colOffset === l2._colOffset &&
            l1._left === l2._left && l1._top === l2._top;

    }

    function boundsEqual(e1, e2) {
        if (!areBothDefined(e1.bounds, e2.bounds)) {
            console.log("Not both defined or undefined:", e1.bounds, e2.bounds);
            return false;
        }

        let b1 = e1.bounds, b2 = e2.bounds;

        if (!b1 && !b2)
            return true;

        return rectanglesEqual(b1, b2);
    }

    function rectanglesEqual(r1, r2) {
        return r1.x === r2.x && r1.y === r2.y && r1.width === r2.width && r1.height === r2.height;
    }

    function marksEqual(m1, m2) {
        if (!areBothDefined(m1, m2)) {
            console.log("Not both defined or undefined:", m1, m2);
            return false;
        }

        if (m1.type !== m2.type) {
            console.log("Different mark types:", m1, m2);
            return false;
        }

        if (m1.id !== m2.id) {
            console.log("id not equal:", m1, m2);
            return false;
        }

        if (m1.classId !== m2.classId) {
            console.log("class id not equal:", m1, m2);
            return false;
        }

        if (!dataScopesEqual(m1, m2)) {
            console.log("DataScopes not equal", m1, m2);
            return false;
        }

        if (!boundsEqual(m1, m2)) {
            console.log("Bounds not equal", m1, m2);
            return false;
        }

        if (!areBothDefined(m1.links, m2.links)) {
            console.log("Not both defined or undefined: links ", m1.links, m2.links);
            return false;
        }

        if (!areBothDefined(m1.source, m2.source)) {
            console.log("Not both defined or undefined: source ", m1.source, m2.source);
            return false;
        }

        if (!areBothDefined(m1.target, m2.target)) {
            console.log("Not both defined or undefined: links ", m1.target, m2.target);
            return false;
        }

        if (m1.links && m2.links) {
            if (m1.links.length !== m2.links.length) {
                console.log("unequal number of links", m1, m2);
                return false;
            }
            //TODO: compare link elements
        }

        if (m1.source && m2.source && !marksEqual(m1.source, m2.source)) {
            console.log("different sources", m1.source, m2.source);
            return false;
        }

        if (m1.target && m2.target && !marksEqual(m1.target, m2.target)) {
            console.log("different targets", m1.target, m2.target);
            return false;
        }

        switch (m1.type) {
            case ElementType.Arc:
            case ElementType.Pie:
                if (!verticesEqual(m1, m2)) {
                    console.log("vertices not equal:", m1, m2);
                    return false;
                }
                return m1.x === m2.x && m1.y === m2.y && m1.innerRadius === m2.innerRadius && m1.outerRadius === m2.outerRadius && m1.startAngle === m2.startAngle && m1.endAngle === m2.endAngle && m1.direction === m2.direction && m1.thickness === m2.thickness;
            case ElementType.Area:
                if (!verticesEqual(m1, m2)) {
                    console.log("vertices not equal:", m1, m2);
                    return false;
                }
                return m1.baseline === m2.baseline && m1.orientation === m2.orientation;
            case ElementType.Circle:
                return m1.x === m2.x && m1.y === m2.y && m1.radius === m2.radius;
            case ElementType.Image:
                console.warn("not implemented");
                return true;
            case ElementType.Line:
            case ElementType.Path:
            case ElementType.BezierCurve:
                if (!verticesEqual(m1, m2)) {
                    console.log("vertices not equal:", m1, m2);
                    return false;
                }
                return true;
            case ElementType.SimpleText:
                return m1.x === m2.x && m1.y === m2.y && m1.text === m2.text && m1.anchor[0] === m2.anchor[0] && m1.anchor[1] === m2.anchor[1];
            case ElementType.Polygon:
                if (!verticesEqual(m1, m2)) {
                    console.log("vertices not equal:", m1, m2);
                    return false;
                }
                return m1.x === m2.x && m1.y === m2.y && m1.radius === m2.radius;
            case ElementType.Rect:
                if (!verticesEqual(m1, m2)) {
                    console.log("vertices not equal:", m1, m2);
                    return false;
                }
                return m1.width === m2.width && m1.height === m2.height && m1.top === m2.top && m1.left === m2.left;
            case ElementType.Ring:
            default:
                console.warn("not implemented");
                return true;
        }

    }

    function verticesEqual(m1, m2) {
        if (m1.vertices.length !== m2.vertices.length) {
            console.log("unequal number of vertices:", m1, m2);
            return false;
        }

        for (let i = 0; i < m1.vertices.length; i++) {
            let v1 = m1.vertices[i], v2 = m2.vertices[i];
            if (v1.id !== v2.id) {
                console.log("vertex id not equal:", v1, v2);
                return false;
            }

            if (v1.x !== v2.x || v1.y !== v2.y) {
                console.log("vertex position not equal:", v1, v2);
                return false;
            }

            if (!dataScopesEqual(v1, v2)) {
                console.log("vertex data scopes not equal:", v1.dataScope, v2.dataScope);
                return false;
            }

            return v1._polarAngle === v2._polarAngle && v1.shape === v2.shape && v1.width === v2.width && v1.height == v2.height && v1.radius == v2.radius && v1.fillColor == v2.fillColor && v1.opacity == v2.opacity && v1.strokeWidth == v2.strokeWidth && v1.strokeColor == v2.strokeColor;
        }
    }

    function dataScopesEqual(g1, g2) {

        if (!areBothDefined(g1.dataScope, g2.dataScope)) {
            console.log("Not both defined or undefined:", g1.dataScope, g2.dataScope);
            return false;
        }

        if (!g1.dataScope && !g2.dataScope)
            return true;

        let ds1 = g1.dataScope, ds2 = g2.dataScope,
            filters1 = ds1.filters || {},
            filters2 = ds2.filters || {};

        if (!haveSameKeys(filters1, filters2))
            return false;

        for (let k in filters1) {
            if (filters1[k] !== filters2[k])
                return false;
        }

        return ds1.dataTable.id === ds2.dataTable.id && getScopeRows(ds1).length === getScopeRows(ds2).length;
    }

    function scenesEqual(scn1, scn2) {
        if (scn1.fillColor !== scn2.fillColor) {
            console.log("fillColor not equal:", scn1, scn2);
            return false;
        }

        return groupsEqual(scn1, scn2);
    }

    function isEqual$1(e1, e2) {
        if (e1.type !== e2.type) {
            console.log("Different types:", e1.type, e2.type);
        }
        if ([ElementType.Collection, ElementType.Glyph, ElementType.Composite].includes(e1.type))
            return groupsEqual(e1, e2);
        else if (e1 instanceof Mark)
            return marksEqual(e1, e2);
    }

    function groupsEqual(g1, g2) {

        //ignore axes, legends and gridlines for now
        let children1 = g1.children.filter(d => !Object.values(refElementTypes).includes(d.type)),
            children2 = g2.children.filter(d => !Object.values(refElementTypes).includes(d.type));

        if (children1.length !== children2.length) {
            console.log("children length not equal:", children1, children2);
            return false;
        }

        if (g1.id !== g2.id) {
            console.log("id not equal:", g1, g2);
            return false;
        }

        if (g1.classId !== g2.classId) {
            console.log("class id not equal:", g1, g2);
            return false;
        }

        if (!dataScopesEqual(g1, g2)) {
            console.log("DataScopes not equal", g1.dataScope, g2.dataScope);
            return false;
        }

        if (!boundsEqual(g1, g2)) {
            console.log("Bounds not equal", g1, g2);
            return false;
        }

        if (!layoutsEqual(g1, g2)) {
            console.log("Layouts not equal", g1, g2);
            return false;
        }

        if (!simpleObjectsEqual(g1._sortBy, g2._sortBy)) {
            console.log("SortBy not equal", g1, g2);
            return false;
        }

        for (let i = 0; i < children1.length; i++) {
            if (!isEqual$1(children1[i], children2[i])) {
                console.log("Not equal", children1[i], children2[i]);
                return false;
            }
        }

        return true;
    }

    class CircularLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.CIRCULAR;
            this._x = "x" in args ? args.x : 100;
            this._y = "y" in args ? args.y : 100;
            this._radius = "radius" in args ? args.radius : 100;
        }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        get radius() {
            return this._radius;
        }

        clone() {
            let f = new CircularLayout({
                x: this._x,
                y: this._y,
                radius: this._radius
            });
            return f;
        }

    }

    class ClusterLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.CLUSTER;
            this._isRadial = "radial" in args ? args.radial : false;
            //radial
            this._angleExtent = "angleExtent" in args ? args.angleExtent : 360;
            this._radius = "radius" in args ? args.radius : 300;
            //this._size = "size" in args ? args.size : [2 * Math.PI, 300];
            this._rootX = "x" in args ? args.x : 300;
            this._rootY = "y" in args ? args.y : 300;

            //non-radial
            this._orientation = "orientation" in args ? args.orientation : LayoutOrientation.HORIZONTAL;
            this._width = "width" in args ? args.width : 800;
            this._height = "height" in args ? args.height : 600;
            this._left = "left" in args ? args.left : 60;
            this._top = "top" in args ? args.top : 100;
            this._tree = "tree" in args ? args.tree : undefined;
        }

        // get size() {
        //     return this._size.slice();
        // }

        get radius() {
            return this._radius;
        }

        get angleExtent() {
            return this._angleExtent;
        }

        get x() {
            return this._rootX;
        }

        get y() {
            return this._rootY;
        }

        get width() {
            return this._width;
        }

        get height() {
            return this._height;
        }

        get left() {
            return this._left;
        }

        get top() {
            return this._top;
        }

        isRadial() {
            return this._isRadial;
        }

        get orientation() {
            return this._orientation;
        }

        clone() {
            let f = new ClusterLayout({
                radius: this._radius,
                angleExtent: this._angleExtent,
                x: this._rootX,
                y: this._rootY,
                radial: this._isRadial,
                orientation: this._orientation,
                left: this._left,
                top: this._top,
                width: this._width,
                height: this._height,
                tree: this._tree
            });
            return f;
        }
    }

    function divide(elem, data, param) {
    	let scene = elem.scene,
    		args = param ? param : {};
    	args["attribute"] = args["attribute"] || MSCRowID;
    	console.log("------ divide by", args["attribute"], " ----");
    	validateDivideArguments(elem, data, args);

    	if (data instanceof Tree || data instanceof Network) {
    		throw "Not implemented";
    	} else if (data instanceof DataTable) {
    		let {newMark, collection} = divideElement(scene, elem, args["attribute"], args["orientation"], data);
    		// scene._buildPeerIndex();
    		elementRemoved(elem, scene._depGraph);
    		newMarkCreated(newMark, scene._depGraph);
    		newCollectionCreated(collection, scene._depGraph);
    		parentChildConnected(collection, newMark, scene._depGraph);
    		if (collection.parent.type !== ElementType.Scene)
    			parentChildConnected(collection.parent, collection, scene._depGraph);

    		scene.onChange(VarType.CHANNEL, "width", newMark);
    		return {newMark, collection};
    	}
    }

    function divideElement(scene, elem, attr, orientation, datatable) {
        let type = datatable.type(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Divide only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!canDivide(elem)) {
            throw new Error("The " + elem.type + " is not dividable");
        }

        switch (elem.type) {
    		case ElementType.Line:
    			return _doLineDivide();
    		case ElementType.Path:
    			return _doPathDivide();
    		case ElementType.Circle:
    			return _doCircleDivide(scene, elem, orientation, attr, datatable);
    		case ElementType.Rect:
    			return _doRectDivide(scene, elem, orientation, attr, datatable);
    		case ElementType.Area:
    			return _doAreaDivide(scene, elem, orientation, attr, datatable);
    		case ElementType.Ring:
    			return _doRingDivide(scene, elem, orientation, attr, datatable);
    		case ElementType.Pie:
    		case ElementType.Arc:
    			return _doArcDivide(scene, elem, orientation, attr, datatable);
    	}
    }

    function _doArcDivide(scene, elem, o, attr, table) {
    	let peers = getPeers(elem);
    	let toReturn, orientation = o ? o : LayoutOrientation.ANGULAR;
    	if (orientation != LayoutOrientation.ANGULAR && orientation != LayoutOrientation.RADIAL)
    		throw new Error("Unknown orientation: " + orientation); 

    	let collClassId, arcClassId;
    	if (orientation === LayoutOrientation.ANGULAR) ; else { // radial
    		peers.forEach(p => {
    			let pieDS = p.dataScope ? p.dataScope : fullTableScopeRef(table);
    			let ds = getScopeRefsByAttribute(pieDS, attr); 

    			let coll = createElement(scene, {type: ElementType.Collection});
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = pieDS;

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			for (let i = 0; i < ds.length; i++) {
    				let c = createElement(scene, {type: "arc", 
    					innerRadius: p.innerRadius + i * (p.outerRadius - p.innerRadius)/ds.length, 
    					outerRadius: p.innerRadius + (i + 1) * (p.outerRadius - p.innerRadius)/ds.length, 
    					x: p.x, y: p.y,
    					startAngle: p.startAngle,
    					endAngle: p.endAngle,
    					strokeColor: p.strokeColor,
    					fillColor: p.fillColor,
    					strokeWidth: p.strokeWidth,
    					opacity: p.opacity
    				});

    				if (!arcClassId)
    					arcClassId = c.id;
    				c.classId = arcClassId;
    				c.dataScope = ds[i];
    				c._updateBounds();
    				c._refBounds = c.bounds.clone();
    				coll.addChild(c);

    				coll._layout = new StackLayout({orientation: LayoutOrientation.RADIAL});
    				coll._layout.group = coll;
    				parent.removeChild(p);
    				parent.addChild(coll);

    				if (p === elem)
    					toReturn = coll;
    			}
    		});
    	}

        return {"newMark": toReturn.children[0], "collection": toReturn};
    }

    function _doAreaDivide(scene, elem, o, attr, table) {
    	let inputAreas = getPeers(elem);
    	let toReturn, orientation = o ? o : LayoutOrientation.HORIZONTAL;
    	if (orientation != LayoutOrientation.HORIZONTAL && orientation != LayoutOrientation.VERTICAL)
    		throw new Error("Unknown orientation: " + orientation); 
    	let area2Scope = {}, max = 0;
    	for (let p of inputAreas) {
    		let baseRef = p.dataScope ? p.dataScope : fullTableScopeRef(table),
    			scopes = getScopeRefsByAttribute(baseRef, attr);
    		if (scopes.length > max)
    			max = scopes.length;
    		area2Scope[p.id] = scopes;
    	}

    	let collClassId;
    	let args = Object.assign({}, elem.styles);
    	args.vertices = elem.vertices.map(d => [d.x, d.y]);
    	args.type = "area";
    	args.orientation = elem.orientation;
        args.baseline = elem.baseline;
    	// args.vxShape = "circle";
    	// args.vxRadius = 2;
    	// args.vxFillColor = "blue";
    	//orientation === LayoutOrientation.HORIZONTAL ? BoundsAnchor.BOTTOM : BoundsAnchor.LEFT;

        let r = createElement(scene, args);
        r._classId = r.id;

    	for (let p of inputAreas) {
    		let coll = createElement(scene, {type: ElementType.Collection});
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		coll.dataScope = p.dataScope ? p.dataScope : fullTableScopeRef(table);

    		let parent = p.parent;
            parent.removeChild(p);
            delete scene._itemMap[p.id];

    		let scopes = area2Scope[p.id];
    		let bounds = p.bounds, left = bounds.left, top = bounds.top;

    		// let wd = orientation == Orientation.HORIZONTAL ? bounds.width/max : bounds.width,
    		// 	ht = orientation == Orientation.HORIZONTAL ? bounds.height : bounds.height/max;
    		let wd = orientation == LayoutOrientation.HORIZONTAL ? bounds.width/scopes.length : bounds.width,
    			ht = orientation == LayoutOrientation.HORIZONTAL ? bounds.height : bounds.height/scopes.length;
    		for (let i = 0; i < scopes.length; i++) {
    			let newArea = duplicate(r);
                newArea.dataScope = scopes[i];
    			// console.log(newArea.dataScope);
                newArea.resize(wd, ht);
    			newArea._updateBounds();
    			newArea._refBounds = newArea.bounds.clone();
    			coll.addChild(newArea);

    			for (let j = 0; j < newArea.vertices.length; j++){
    				let v = newArea.vertices[j],
    					sourceVertex = p.vertices[j];
    				if (sourceVertex && sourceVertex.dataScope) {
    					v.dataScope = mergeScopeRefs(newArea.dataScope, sourceVertex.dataScope);
    				}
    				else {
    					v.dataScope = newArea.dataScope;
    				}
    			}
    		}
    		
            parent.addChild(coll);
    		//colls.push(coll);
    		coll._layout = new StackLayout({orientation: orientation, left: left, top: top});
    		coll._layout.group = coll;
    		if (p == elem)
    			toReturn = coll;
        }

    	scene.removeChild(r);
    	delete scene._itemMap[r.id];

        return {"newMark": toReturn.children[0], "collection": toReturn};
    }

    function _doCircleDivide(scene, elem, o, attr, table) {
        let peers = getPeers(elem);
    	let toReturn, orientation = o ? o : LayoutOrientation.ANGULAR;
    	if (orientation != LayoutOrientation.ANGULAR && orientation != LayoutOrientation.RADIAL)
    		throw new Error("Unknown orientation: " + orientation); 

    	let collClassId, arcClassId;
    	if (orientation === LayoutOrientation.ANGULAR) {
    		peers.forEach(p => {
    			let circleDS = p.dataScope ? p.dataScope : fullTableScopeRef(table);
    			let ds = getScopeRefsByAttribute(circleDS, attr); 

    			let coll = createElement(scene, {type: ElementType.Collection});
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = circleDS;

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			let arcAng = 360 / ds.length;
    			let start = 90;
    			for (let i = 0; i < ds.length; i++) {
    				let c = createElement(scene, {type: "arc", innerRadius: 0, outerRadius: p.radius, x: p.x, y: p.y,
    					startAngle: normalizeAngle(start - arcAng * (i + 1)) ,
    					endAngle: normalizeAngle(start - arcAng * i) ,
    					strokeColor: p.strokeColor,
    					fillColor: p.fillColor,
    					strokeWidth: p.strokeWidth,
    					opacity: p.opacity
    				});

    				if (!arcClassId)
    					arcClassId = c.id;
    				c.classId = arcClassId;
    				c.dataScope = ds[i];
    				c._updateBounds();
    				c._refBounds = c.bounds.clone();
    				coll.addChild(c);

    				coll._layout = new StackLayout({orientation: LayoutOrientation.ANGULAR, direction: AngularDirection.CLOCKWISE});
    				coll._layout.group = coll;
    				parent.removeChild(p);
    				parent.addChild(coll);

    				if (p === elem)
    					toReturn = coll;
    			}
    		});
    	}

        return {"newMark": toReturn.children[0], "collection": toReturn};
    }

    function _doLineDivide(scene, elem, attr, table) {
        
    }

    function _doPathDivide(scene, elem, attr, table) {
        
    }

    function _doRectDivide(scene, elem, o, attr, table) {
        let peers = getPeers(elem);
    	let toReturn, orientation = o ? o : LayoutOrientation.HORIZONTAL;
            // colls = [];
    	if (orientation != LayoutOrientation.HORIZONTAL && orientation != LayoutOrientation.VERTICAL)
    		throw new Error("Unknown orientation: " + orientation); 
    	let rect2Scopes = {}, max = 0;
    	for (let p of peers) {
    		let baseRef = p.dataScope ? p.dataScope : fullTableScopeRef(table),
    			scopes = getScopeRefsByAttribute(baseRef, attr);
    		if (scopes.length > max)
    			max = scopes.length;
    		rect2Scopes[p.id] = scopes;
    	}

    	let collClassId,
            r = createElement(scene, {type: "rect", left: elem.bounds.left, top: elem.bounds.top, width: elem.bounds.width, height: elem.bounds.height, 
                                strokeColor: elem.strokeColor, fillColor: elem.fillColor, strokeWidth: elem.strokeWidth, opacity: elem.opacity});
        r._classId = r.id;

    	for (let p of peers) {
    		let coll = createElement(scene, {type: ElementType.Collection});
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		coll.dataScope = p.dataScope ? p.dataScope : fullTableScopeRef(table);

    		let parent = p.parent;
            parent.removeChild(p);
            delete scene._itemMap[p.id];

    		let scopes = rect2Scopes[p.id];
    		let bounds = p.bounds, left = bounds.left, top = bounds.top;

    		// let wd = orientation == Orientation.HORIZONTAL ? bounds.width/max : bounds.width,
    		// 	ht = orientation == Orientation.HORIZONTAL ? bounds.height : bounds.height/max;
    		let wd = orientation == LayoutOrientation.HORIZONTAL ? bounds.width/scopes.length : bounds.width,
    			ht = orientation == LayoutOrientation.HORIZONTAL ? bounds.height : bounds.height/scopes.length;
    		
    		for (let i = 0; i < scopes.length; i++) {
    			let c = duplicate(r);
                c.dataScope = scopes[i];
                c.resize(wd, ht);
    			c._updateBounds();
    			c._refBounds = c.bounds.clone();
    			coll.addChild(c);
    		}
    		
            parent.addChild(coll);
    		//colls.push(coll);
    		coll._layout = new StackLayout({orientation: orientation, left: left, top: top});
    		coll._layout.group = coll;
    		if (p == elem)
    			toReturn = coll;
        }

    	//remove r
    	scene.removeChild(r);
    	delete scene._itemMap[r.id];

        return {"newMark": toReturn.children[0], "collection": toReturn};
    }

    function _doRingDivide(scene, elem, o, attr, table) {
        let peers = getPeers(elem);
    	let toReturn, orientation = o ? o : LayoutOrientation.ANGULAR;
    	if (orientation != LayoutOrientation.ANGULAR && orientation != LayoutOrientation.RADIAL)
    		throw new Error("Unknown orientation: " + orientation); 

    	let collClassId, arcClassId;
    	if (orientation === LayoutOrientation.ANGULAR) {
    		peers.forEach(p => {
    			let ringDS = p.dataScope ? p.dataScope : fullTableScopeRef(table);
    			let ds = getScopeRefsByAttribute(ringDS, attr); 

    			let coll = createElement(scene, {type: ElementType.Collection});
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = ringDS;

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			let arcAng = 360 / ds.length;
    			let start = 90;
    			for (let i = 0; i < ds.length; i++) {
    				let c = createElement(scene, {type: "arc", innerRadius: p.innerRadius, outerRadius: p.outerRadius, x: p.x, y: p.y,
    					startAngle: normalizeAngle(start - arcAng * (i + 1)) ,
    					endAngle: normalizeAngle(start - arcAng * i) ,
    					strokeColor: p.strokeColor,
    					fillColor: p.fillColor,
    					strokeWidth: p.strokeWidth,
    					opacity: p.opacity
    				});

    				if (!arcClassId)
    					arcClassId = c.id;
    				c.classId = arcClassId;
    				c.dataScope = ds[i];
    				c._updateBounds();
    				c._refBounds = c.bounds.clone();
    				coll.addChild(c);

    				coll._layout = new StackLayout({orientation: LayoutOrientation.ANGULAR, direction: AngularDirection.CLOCKWISE});
    				coll._layout.group = coll;
    				parent.removeChild(p);
    				parent.addChild(coll);

    				if (p === elem)
    					toReturn = coll;
    			}
    		});
    	}

        return {"newMark": toReturn.children[0], "collection": toReturn};
    }




    function validateDivideArguments(elem, data, param) {
        if (!elem || data === undefined) {
            throw new Error("Incomplete information to do divide. You must specify an element, a categorical data attribute and a data table");
        }

        if (data instanceof DataTable) {
            validateAttribute(param["attribute"], data);
        }

        if (param.layout && !(param.layout instanceof Layout)) {
            throw new Error("Invalid layout: " + param.layout);
        }
    }

    function canDivide(elem) {
        if ([ElementType.Line, ElementType.Circle, ElementType.Rect, ElementType.Area, ElementType.Ring, ElementType.Pie, ElementType.Path].indexOf(elem.type) < 0) {
    		return false;
    	} 

    	if (elem.type === ElementType.Path && (elem.closed || !elem.firstVertex.dataScope))
    		return false;

    	if (!elem.dataScope) {
    		return true;
    	} else {
    		let peers = getPeers(elem);
    		for (let p of peers) {
    			if (getScopeNumTuples(p.dataScope) > 1)
    				return true;
    		}
    		return false;
    	}
    }

    function classify(coll, param) {
        let scene = getScene(coll),
            args = param ? param : {};
        console.log("------ classify by", args["attribute"], " ----");

        if (!canClassify(coll)) {
            throw new Error("The " + coll.type + " is not classifiable");
        }

        classifyCollectionChildren(scene, coll, args["attribute"], args["layout"]);
        // scene._buildPeerIndex();
        childRemoved(coll, coll.firstChild.firstChild, scene._depGraph);
        newCollectionCreated(coll.firstChild, scene._depGraph);
        // must go from lower-level to higher-level
        parentChildConnected(coll.firstChild, coll.firstChild.firstChild, scene._depGraph);
        parentChildConnected(coll, coll.firstChild, scene._depGraph);
        scene.onChange(VarType.CHANNEL, "width", coll.firstChild.firstChild);
        return coll.firstChild;
    }

    function classifyCollectionChildren(scene, collection, attr, layout) {
        let peers = getPeers(collection);
        for (let p of peers) {
            let collections = {}, cid, elems = p.children;
            for (let elem of elems) {
                let v = getScopeAttrVal(elem.dataScope, attr);
                if (!(v in collections)) {
                    collections[v] = [];
                }
                collections[v].push(elem);
            }
            let tbl = getDataTable(elems[0]);
            for (let v in collections) {
                let coll = createElement(scene, {type: ElementType.Collection});
                p.addChild(coll);
                if (cid === undefined)
                    cid = coll.id;
                coll._classId = cid;
                coll.dataScope = crossScopeRef(p.dataScope ? p.dataScope : fullTableScopeRef(tbl), attr, v);
                for (let c of collections[v]) {
                    coll.addChild(c);
                }
                if (layout) {
                    coll._layout = layout.clone();
                    coll._layout.group = coll;
                }
            }
        }
    }

    function canClassify(elem) {
    	if (elem.type !== ElementType.Collection) return false;
    	if (elem.children.length < 2) return false;
    	return true;
    }

    function stratify(elem, tree, param) {
    	if (!((tree instanceof Tree) || (Array.isArray(tree) && tree.every(e => e instanceof Tree)))) {
    		throw "Cannot stratify on a non-tree dataset";
    	}

    	if (![ElementType.Circle, ElementType.Rect, ElementType.Ring].includes(elem.type)) {
    		throw "Cannot stratify elements that are not rects, circles, or rings";
    	}

    	let scene = getScene(elem),
    		args = param ? param : {},
    		direction = args["direction"],
    		size = args["size"],
    		parent = elem.parent;

    	let collection = stratifyElement(scene, elem, direction, args["startFromLeaf"], size, tree);
    	// scene._buildPeerIndex();
    	childRemoved(parent, elem, scene._depGraph);
    	newCollectionCreated(collection, scene._depGraph);
    	if (collection.children.length > 0)
    		parentChildConnected(collection, collection.firstChild, scene._depGraph);
    	parentChildConnected(collection.parent, collection, scene._depGraph);
    	return collection;
    }

    function stratifyElement(scene, elem, direction, fromLeaf, size, tree) {
        switch (elem.type) {
    		case ElementType.Circle:
    		case ElementType.Ring:
    			return _doPolarStratify(scene, elem, direction, fromLeaf, size, tree);
    		case ElementType.Rect:
    			return _doRectStratify(scene, elem, direction, fromLeaf, size, tree);
    	}
    }

    function _doPolarStratify(scene, compnt, dir, fromLeaf, sz, tree) {
    	let toReturn, direction = dir ? dir : RadialDirection.OUTWARD, size = sz ? sz : 50;
    	if (direction !== RadialDirection.INWARD && direction !== RadialDirection.OUTWARD) {
    		throw "Unknown direction to stratify";
    	}
    	let peers = getPeers(compnt, scene), trees = Array.isArray(tree) ? tree : [tree];
    	let collClassId;
    	if (!fromLeaf) {
    		peers.forEach((p, i) => {
    			let coll = createElement(scene, {type: ElementType.Collection});
    			coll.dataScope = undefined;
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			let parent = p.parent;

    			//current strategy: the seed mark (circle or ring) has a different class id as the arcs, and it is not added to the collection
    			_addChildrenStrata(p, compnt.id, direction, size, trees[i], trees[i].getRoot(), coll, scene, true);

    			//p.parent.removeChild(p);

    			coll._layout = new StrataLayout({ direction: direction });
    			coll._layout.group = coll;
    			parent.addChild(coll);
    	
    			if (p === compnt)
    				toReturn = coll;
    			
    		});
    	} else {
    		let coll = createElement(scene, {type: ElementType.Collection});
    		coll.dataScope = undefined;
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		let nodes = peers.map(d => trees[0].getNode(d.datum[MSCNodeID]));
    		_addParentStrata(scene, peers, nodes, trees[0], coll, compnt.classId ? compnt.classId : compnt.id, 400, 350, direction, size);
    		toReturn = coll;
    	}
    	
    	return toReturn;
    }

    function _addParentStrata(scene, cmpnts, treeNodes, tree, coll, classId, cx, cy, direction, size) {
    	let uniqueParents = treeNodes.map(d => tree.getParent(d)).filter((obj, index, self) => self.findIndex(o => o[MSCNodeID] === obj[MSCNodeID]) === index);
    	uniqueParents = uniqueParents.filter(d => d !== tree.getRoot());
    	if (uniqueParents.length === 0) return;
    	let arcs = [];
    	//create one arc for each parent
    	for (let pnd of uniqueParents) {
    		let cmks = cmpnts.filter( d => tree.getParent(tree.getNode(d.datum[MSCNodeID])) === pnd);
    		let sa, ea, ir;
    		if (cmks[0].type === ElementType.Circle) {
    			let irs = cmks.map(d => getDistance(cx, cy, d.bounds.x, d.bounds.y) - d.radius),
    				ors = cmks.map(d => getDistance(cx, cy, d.bounds.x, d.bounds.y) + d.radius);
    			ir = direction === RadialDirection.OUTWARD ?  d3.max(ors) : d3.min(irs) - size;
    			let angles = cmks.map(d => getPolarAngle(d.bounds.x, d.bounds.y, cx, cy)),
    				angleAdjustments = cmks.map(d => getPolarAngle(cx + getDistance(cx, cy, d.bounds.x, d.bounds.y), cy - d.radius, cx, cy) );
    			let arr1 = angles.map((num, index) => num - angleAdjustments[index]),
    				arr2 = angles.map((num, index) => num + angleAdjustments[index]),
    				arr3 = arr1.concat(arr2);
    			sa = d3.min(arr3), ea = d3.max(arr3);
    		} else if (cmks[0].type === ElementType.Arc) {
    			// if (pnd["id"] === "VMWare") {
    			// 	console.log(cmks.map(d => d.startAngle));
    			// 	console.log(cmks.map(d => d.endAngle));
    			// }
    			// sa = Math.min(...cmks.map(d => d.startAngle));
    			// ea = Math.max(...cmks.map(d => d.endAngle));
    			sa = 360; // Initialize with a large value
    			ea = -360;  // Initialize with a small value

    			cmks.forEach(arc => {
    				let start = arc.startAngle;
    				let end = arc.endAngle;

    				// If the arc wraps around 0 degrees, treat end as greater than start
    				if (end < start) {
    					end += 360;
    				}

    				// Update the minimum start and maximum end
    				sa = d3.min([sa, start]);
    				ea = d3.max([ea, end]);
    			});

    			// Normalize the result if the end angle extends beyond 360 degrees
    			sa = normalizeAngle(sa);
    			ea = normalizeAngle(ea);

    			ir = direction === RadialDirection.OUTWARD ?  d3.max(cmks.map(d => d.outerRadius)) : d3.min(cmks.map(d => d.innerRadius)) - size;
    		}
    		let mark = createElement(scene, {
    			type: "arc", 
    				innerRadius: ir,
    				outerRadius: ir + size,
    				x: cx,
    				y: cy,
    				startAngle: normalizeAngle(sa),
    				endAngle: normalizeAngle(ea),
    				strokeColor: cmpnts[0].strokeColor,
    				fillColor: cmpnts[0].fillColor,
    				strokeWidth: cmpnts[0].strokeWidth,
    				opacity: cmpnts[0].opacity
    		});
    		mark._updateBounds();
    		mark.dataScope = tree.getNodeDataScopeRef(pnd);
    		// console.log(mark.dataScope);
    		mark._classId = classId;
    		coll.addChild(mark);
    		arcs.push(mark);
    	}
    	_addParentStrata(scene, arcs, uniqueParents, tree, coll, classId, cx, cy, direction, size);
    }

    function _doRectStratify(scene, compnt, dir, fromLeaf, sz, tree) {
        let toReturn, direction = dir ? dir : LinearDirection.Top2Bottom, size = sz ? sz : 50;
        if (!Object.values(LinearDirection).includes(direction)) {
            throw "Unknown direction to stratify";
        }
        let peers = getPeers(compnt);
        let collClassId;
        peers.forEach(p => {
            let coll = createElement(scene, {type: ElementType.Collection});
            coll.dataScope = undefined;
            if (collClassId == undefined)
                collClassId = coll.id;
            coll._classId = collClassId;
            let parent = p.parent;
            _addRectStrata(p, compnt.id, direction, size, tree, tree.getRoot(), coll, scene, true);
            coll._layout = new StrataLayout({ direction: direction });
            coll._layout.group = coll;
            parent.addChild(coll);

            if (p === compnt)
                toReturn = coll;
        });
        return toReturn;
    }

    function _addChildrenStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
    	if (isRoot) {
    		compnt.dataScope = tree.getNodeDataScopeRef(node);
    		compnt._classId = classId;
    		//coll.addChild(compnt);
    	}
    	let children = tree.getChildren(node);
    	if (children.length === 0) return;
    	let start = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 60 : compnt.startAngle,
    		extent = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 360 : compnt.angle,
    		angle = extent/children.length;
    	for (let i = 0; i < children.length; i++) {
    		//let ir = compnt.type === ElementType.Circle ? compnt.radius : direction === RadialDirection.OUTWARD ?  : compnt.innerRadius;
    		let mark, ir;
    		if (direction === RadialDirection.OUTWARD) {
    			ir = compnt.type === ElementType.Circle ? compnt.radius : compnt.outerRadius;
    		} else {
    			ir = compnt.type === ElementType.Circle ? compnt.radius - size : compnt.innerRadius - size;
    		}
    		if (angle === 360) {
    			mark = createElement(scene, {
    				type: "ring",
    				innerRadius: ir,
    				outerRadius: ir + size,
    				x: compnt.x,
    				y: compnt.y,
    				strokeColor: compnt.strokeColor,
    				fillColor: compnt.fillColor,
    				strokeWidth: compnt.strokeWidth,
    				opacity: compnt.opacity
    			});
    		} else {
    			mark = createElement(scene, {
    				type: "arc", 
    				innerRadius: ir,
    				outerRadius: ir + size,
    				x: compnt.x,
    				y: compnt.y,
    				startAngle: normalizeAngle(start + angle * i),
    				endAngle: normalizeAngle(start + angle * (i+1)),
    				strokeColor: compnt.strokeColor,
    				fillColor: compnt.fillColor,
    				strokeWidth: compnt.strokeWidth,
    				opacity: compnt.opacity
    			});
    		}
    		mark._updateBounds();
    		mark.dataScope = tree.getNodeDataScopeRef(children[i]);
    		// console.log(mark.dataScope);
    		mark._classId = classId + "_strata";
    		coll.addChild(mark);
    		_addChildrenStrata(mark, classId, direction, size, tree, children[i], coll, scene);
    	}
    }

    // function _addChildrenStrataOutward(compnt, classId, direction, fromLeaf, size, tree, node, coll, scene, isRoot) {
    // 	if (isRoot) {
    // 		compnt.dataScope = tree.getNodeDataScopeRef(node);
    // 		// console.log(mark.dataScope);
    // 		compnt._classId = classId;
    // 		coll.addChild(compnt);
    // 	}
    // 	let children = tree.getChildren(node);
    // 	if (children.length === 0) return;
    // 	let start = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 90 : compnt.startAngle,
    // 		extent = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 360 : compnt.angle,
    // 		angle = extent/children.length;
    // 	for (let i = 0; i < children.length; i++) {
    // 		let ir = compnt.type === ElementType.Circle ? compnt.radius : compnt.outerRadius;
    // 		let mark;
    // 		if (angle === 360) {
    // 			mark = createElement(scene, {
    // 				type: "ring",
    // 				innerRadius: ir,
    // 				outerRadius: ir + size,
    // 				x: compnt.x,
    // 				y: compnt.y,
    // 				strokeColor: compnt.strokeColor,
    // 				fillColor: compnt.fillColor,
    // 				strokeWidth: compnt.strokeWidth,
    // 				opacity: compnt.opacity
    // 			});
    // 		} else {
    // 			mark = createElement(scene, {
    // 				type: "arc", 
    // 				innerRadius: ir,
    // 				outerRadius: ir + size,
    // 				x: compnt.x,
    // 				y: compnt.y,
    // 				startAngle: normalizeAngle(start + angle * i),
    // 				endAngle: normalizeAngle(start + angle * (i+1)),
    // 				strokeColor: compnt.strokeColor,
    // 				fillColor: compnt.fillColor,
    // 				strokeWidth: compnt.strokeWidth,
    // 				opacity: compnt.opacity
    // 			});
    // 		}
    // 		mark._updateBounds();
    // 		mark.dataScope = tree.getNodeDataScopeRef(children[i]);
    // 		// console.log(mark.dataScope);
    // 		mark._classId = classId;
    // 		coll.addChild(mark);
    // 		_addChildrenStrataOutward(mark, classId, direction, size, tree, children[i], coll, scene);
    // 	}
    // }

    function _addRectStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
    	if (isRoot) {
    		compnt.dataScope = tree.getNodeDataScopeRef(node);
    		compnt._classId = classId;
    		coll.addChild(compnt);
    	}
    	let children = tree.getChildren(node);
    	if (children.length === 0) return;
    	let x, y, width;
    	switch (direction) {
    		case LinearDirection.Top2Bottom:
    		case LinearDirection.Bottom2Top:
    		case LinearDirection.Left2Right:
    		case LinearDirection.Right2Left:
    		default:
    			x = compnt.left;
    			y = compnt.bottom;
    			width = compnt.width/children.length;
    			break;
    	}

    	// let start = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 90 : compnt.startAngle,
    	// 	extent = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 360 : compnt.angle,
    	// 	angle = extent/children.length;
    	for (let i = 0; i < children.length; i++) {
    		let mark = duplicate(compnt);
    		translateElement(mark, x - mark.left, y - mark.top);
            mark.resize(width, size);
            mark._updateBounds();
    		x += width;
    		mark.dataScope = tree.getNodeDataScopeRef(children[i]);
    		mark._classId = classId;
    		coll.addChild(mark);
    		_addRectStrata(mark, classId, direction, size, tree, children[i], coll);
    	}
    }

    function attach(elem, table) {
        if (elem.type == ElementType.Glyph) {
            for (let e of elem.children) {
                if (!e._refBounds)
                    e._refBounds = e.bounds.clone();
            }
        }
        elem.dataScope = fullTableScopeRef(table);
    }

    class Alignment {

        constructor(elems, channel, anchor) {
            this._elems = elems;
            this._channel = channel;
            this._anchor = anchor;
        }

        get elements() {
            return this._elems;
        }

        get channel() {
            return this._channel;
        }

        get anchor() {
            return this._anchor;
        }
    }

    class Affixation {

        constructor(elem, base) {
            this._elem = elem;
            this._base = base;
            this._id = getAffixationID(elem, base);
            this._channels = {};
            // this._elemAnchor = "elementAnchor" in args ? args.elementAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            // this._baseAnchor = "baseAnchor" in args ? args.baseAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            // this._offset = "offset" in args ? args.offset : 0;
            this._attribute = undefined;
        }

        get id() {
            return this._id;
        }

        get element() {
            return this._elem;
        }

        get base() {
            return this._base;
        }

        get channels() {
            return Object.keys(this._channels);
        }

        addChannel(channel, args) {
            //TODO: check if the added channel is compatible with existing channels
            let o = {};
            o.elemAnchor = "elementAnchor" in args ? args.elementAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            o.baseAnchor = "baseAnchor" in args ? args.baseAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            o.offset = "offset" in args ? args.offset : 0;
            if ("attribute" in args)
                this._attribute = args.attribute;
            this._channels[channel] = o;
        }

        hasChannel(channel) {
            return channel in this._channels;
        }

        getElementAnchor(channel) {
            return this._channels[channel].elemAnchor;
        }

        getBaseAnchor(channel) {
            return this._channels[channel].baseAnchor;
        }

        getOffset(channel) {
            return this._channels[channel].offset;
        }

        get attribute() {
            return this._attribute ? this._attribute : MSCRowID;
        }
    }

    function getAffixationID(elem, base) {
        return (elem.classId ? elem.classId : elem.id) + ":" + (base.classId ? base.classId : base.id);
    }

    function affix(elem, base, channel, params) {
        let scene = getScene(elem),
            elemTbl = getScopeDataTable(elem.dataScope),
            baseTbl = getScopeDataTable(base.dataScope);

        if (elemTbl !== baseTbl)
            console.warn("Affix: elements and base elements are not created from the same table");

        let affxId = getAffixationID(elem, base),
            affx = scene._relations.find(d => d.id === affxId);

        if (!affx) {
            affx = new Affixation(elem, base);
            scene._relations.push(affx);
        }

        affx.addChannel(channel, params ? params : {});
        affixationSpecified(affx, scene._depGraph);
    }

    function align(elems, channel, anchor) {
        let scene = getScene(elems[0]),
            aln = new Alignment(elems, channel, anchor);

        alignmentSpecified(aln, scene._depGraph);
        scene._relations.push(aln);
    }

    function connect(nodeMks, linkMks) {
        let scene = getScene(nodeMks[0]),
            id2nodeMk = {};

        nodeMks.forEach(d => id2nodeMk[getScopeAttrVal(d.dataScope, MSCNodeID)] = d);

        let linkTbl = getScopeDataTable(linkMks[0].dataScope);
        let s = linkTbl.tree ? "parent" : "source",
            t = linkTbl.tree ? "child" : "target";

        for (let n of nodeMks) {
            n.links = [];
        }

        for (let l of linkMks) {
            let sid = getScopeAttrVal(l.dataScope, s),
                tid = getScopeAttrVal(l.dataScope, t),
                sourceMark = id2nodeMk[sid],
                targetMark = id2nodeMk[tid];
            l.source = sourceMark;
            l.target = targetMark;
            sourceMark.links.push(l);
            targetMark.links.push(l);
        }

        nodeLinkConnected(nodeMks.find(n => n.links.length > 0), scene._depGraph);
        scene.onChange(VarType.CHANNEL, "x", nodeMks[0]);
    }

    function sortChildren(elem, property, descending, orderedVals) {
        let scene = getScene(elem);
        if (elem instanceof Group) {
            sortGroupChildren(elem, property, descending, orderedVals);
            scene.onChange(VarType.PROPERTY, Properties.CHILDREN_ORDER, elem);
        } else if (elem instanceof Path$1) {
            let paths = getPeers(elem);
            for (let path of paths)
                sortVertices(path, property, descending, orderedVals);
        }
    }


    function sortGroupChildren(group, property, descending, vals) {
        if (group.dataScope && getScopeDataTable(group.dataScope).has(property))
            sortGroupChildrenByAttribute(group, property, descending, vals);
        else
            sortGroupChildrenByChannel(group, property, descending);
        group._sortBy = { property: property, descending: descending, vals: vals };
    }

    function sortGroupChildrenByChannel(group, channel, reverse) {
        let f;
        switch (channel) {
            case "x":
            case "y":
            case "width":
            case "height":
                f = (a, b) => a.bounds[channel] - b.bounds[channel];
                break;
            default:
                f = (a, b) => a[channel] - b[channel];
                break;
        }
        group._children.sort(f);
        if (reverse)
            group.children.reverse();
    }

    function sortGroupChildrenByAttribute(group, attr, descending, ranking) {
        //TODO
        //if (!("attribute" in o) && !("direction" in o)) return;
        //let attr = o.attribute;
        if (!getScopeDataTable(group.dataScope).has(attr)) {
            console.warn("Cannot order collection children by an non-existent attribute", attr);
            return;
        }
        //this._childrenOrder = o;
        let f;
        if (attr === MSCRowID) {
            f = (a, b) => parseInt(getScopeAttrVal(a.dataScope, attr).substring(1)) - parseInt(getScopeAttrVal(b.dataScope, attr).substring(1));
        } else {
            let type = getScopeDataTable(group.children[0].dataScope).type(attr);
            switch (type) {
                case AttributeType.Date:
                    break;
                case AttributeType.Number:
                case AttributeType.Integer:
                    f = (a, b) => aggregateScopeAttribute(a.dataScope, attr) - aggregateScopeAttribute(b.dataScope, attr);
                    break;
                case AttributeType.String:
                    if (ranking)
                        f = (a, b) => ranking.indexOf(getScopeAttrVal(a.dataScope, attr)) - ranking.indexOf(getScopeAttrVal(b.dataScope, attr));
                    else
                        f = (a, b) => (getScopeAttrVal(a.dataScope, attr) < getScopeAttrVal(b.dataScope, attr) ? -1 : 1);
                    break;
            }
        }
        group.children.sort(f);

        if (descending)
            group.children.reverse();
        //     if (this.layout)
        //         this.layout.run();
    }

    function sortVertices(path, property, descending, vals) {
        if (path.vertices[0].dataScope && getScopeDataTable(path.vertices[0].dataScope).has(property))
            sortVerticesByAttribute(path, property, descending, vals);
        else
            sortVerticesByChannel(path, property, descending);
        path._sortBy = { property: property, descending: descending, vals: vals };
    }

    function sortVerticesByChannel(path, channel, reverse) {
        let f = (a, b) => a[channel] - b[channel];
        path.vertices.sort(f);
        if (reverse)
            path.vertices.reverse();
    }


    function sortVerticesByAttribute(path, attr, descending, ranking) {
        //TODO
        //if (!("attribute" in o) && !("direction" in o)) return;
        //let attr = o.attribute;
        // if (!path.dataScope.dataTable.has(attr)) {
        //     console.warn("Cannot order collection children by an non-existent attribute", attr);
        //     return;
        // }
        //this._childrenOrder = o;
        let f;
        if (attr === MSCRowID) {
            f = (a, b) => parseInt(getScopeAttrVal(a.dataScope, attr).substring(1)) - parseInt(getScopeAttrVal(b.dataScope, attr).substring(1));
        } else {
            let type = getScopeDataTable(path.vertices[0].dataScope).type(attr);
            switch (type) {
                case AttributeType.Date:
                    break;
                case AttributeType.Number:
                case AttributeType.Integer:
                    f = (a, b) => aggregateScopeAttribute(a.dataScope, attr) - aggregateScopeAttribute(b.dataScope, attr);
                    break;
                case AttributeType.String:
                    if (ranking)
                        f = (a, b) => ranking.indexOf(getScopeAttrVal(a.dataScope, attr)) - ranking.indexOf(getScopeAttrVal(b.dataScope, attr));
                    else
                        f = (a, b) => (getScopeAttrVal(a.dataScope, attr) < getScopeAttrVal(b.dataScope, attr) ? -1 : 1);
                    break;
            }
        }
        path.vertices.sort(f);

        if (descending)
            path.vertices.reverse();
    }

    class EventContext {

        constructor() {
            this._vals = {};
            this._vals["elements"] = [];
        }

        // get predicates() {
        //     return this._vals;
        // }

        set(k, p) {
            this._vals[k] = p;
        }

        get(k) {
            return this._vals[k];
        }

        clear() {
            // let elems = this._vals["elements"];
            this._vals = {};
            this._vals["elements"] = [];
        }

    }

    //import ValueMap from "./ValueMap";

    class ConditionalEncoding {
        
        constructor(evtCtx, responder, responderEval, efxFn) {
            this._respCompnt = responder.object;
            this._respProps = responder.properties || responder.channels;
            this._responderEval = responderEval;
            this._efxFn = efxFn;
            this._evtCtx = evtCtx;

            this._evalResult = {};
            this._responderPeers = undefined;

            // this._elements = [];
            //this._triggerElements = [];
            //this._mouseEvent = undefined;
        }


        get responderComponent() {
            return this._respCompnt;
        }

        getResponderPeers() {
            if (!this._responderPeers) {
                let responders = Array.isArray(this._respCompnt) ? this._respCompnt : [this._respCompnt];
                this._responderPeers = responders.map(d => getPeers(d)).flat();
            }
            return this._responderPeers;
        }

        clearResponderPeers() {
            this._responderPeers = undefined;
        }

        get responderProperties() {
            return this._respProps;
        }

        get eventContext() {
            return this._evtCtx;
        }

        get evalResult() {
            return this._evalResult;
        }

        set evalResult(r) {
            this._evalResult = r;
        }

        get evalFunction() {
            return this._responderEval;
        }

        get stylingFunction() {
            return this._efxFn;
        }

        // get elements() {
        //     return this._elements;
        // }

        // set elements(t) {
        //     this._elements = t;
        // }

        // get type() {
        //     return this._type;
        // }

        // get element() {
        //     return this._elem;
        // } 

        // get predicates() {
        //     return this._predicates;
        // }

        // get mouseEvent() {
        //     return this._mouseEvent;
        // }

        // set mouseEvent(v) {
        //     this._mouseEvent = v;
        // }

        // get rules() {
        //     return this._rules;
        // }

        // get listener() {
        //     return this._listener;
        // }

        // get triggerElements() {
        //     return this._triggerElements;
        // }

        // set triggerElements(t) {
        //     this._triggerElements = t;
        // }

        // get triggerType() {
        //     return this._triggerType;
        // }

        // get triggerEvent() {
        //     return this._triggerEvent;
        // }

        // isCumulative() {
        //     return this._cumulative;
        // }

    }

    class Trigger {

        constructor(id, source, evt, cumulative) {
            this._id = id;
            this._event = evt;
            this._source = source;
            this._evtCtx = new EventContext();
            this._cumulative = cumulative;
            
            //this._condEnc = undefined;
        }

        get id() {
            return this._id;
        }

        get event() {
            return this._event;
        }

        get eventContext() {
            return this._evtCtx;
        }

        get source() {
            return this._source;
        }

        isCumulative() {
            return this._cumulative;
        }

        isMouseDriven(){
            return ["brush", "brushX", "brushY", "click", "hover"].includes(this._event);
        }

        isKeyboardDriven() {
            return ["keydown", "keyup"].includes(this._event);
        }

        isWidgetDriven() {
            return ["change", "input"].includes(this._event);
        }

        isStateDriven() {
            return this._source !== null && typeof this._source === "object" && this._source.type === "stateVar";
        }
    }

    function getTriggerID(tg) {
        let t = typeof tg.source === "string" ? tg.source :
            Array.isArray(tg.source) ? tg.source.map(s => s.classId || s.id).join("_") :
            tg.source.type === "stateVar" ? "state:" + tg.source.key :
            tg.source.classId ? tg.source.classId : tg.source.id;
        return [t, tg.event].join("-");
    }


    function validateActivateArguments(trigger, responder, evaluator, updater, animation) {
        if (!("event" in trigger) || !("source" in trigger))
            throw "Source and event must be specified in the trigger";
        if (!("object" in responder))
            throw "Responder object must be specified";
        // if (typeof targetEval !== "function")
        //     throw "Target evaluator must be a function";
        // if (!Array.isArray(target.channels)) {
        //     throw "The channels must be an array";
        // }

        if (Array.isArray(updater)) {
            if (!updater.every(element => typeof element === 'function'))
                throw 'Updater must be a function';
            if (animation && !Array.isArray(animation))
                throw 'An array of effect setters must be accompanied by an array of animation effects';
            if (animation && Array.isArray(animation) && animation.length !== updater.length)
                throw 'the length of effect setters is not equal to the length of animation effects';
        } else if (typeof updater !== "function")
            throw 'Updater must be a function';
    }

    function activate(tg, responder, evaluator, updater, animation) {
    	const scene = getScene(responder.object);
    	validateActivateArguments(tg, responder, evaluator, updater, animation);
    	let event = tg.event, id = getTriggerID(tg);
    	event = event.indexOf("brush") === 0 ? "brush" : event.indexOf("drag") === 0 ? "drag" : event;
    	if (!(event in scene._triggers)) {
    		scene._triggers[event] = {};
    	}
    	if (!(id in scene._triggers[event]))
    		scene._triggers[event][id] = new Trigger(id, tg.source, tg.event, tg.cumulative);

    	let evtCtx = scene._triggers[event][id].eventContext;
    	let condEnc = new ConditionalEncoding(evtCtx, responder, evaluator, updater);
    	if (!(id in scene._condEncodings))
    		scene._condEncodings[id] = [];
    	scene._condEncodings[id].push(condEnc);
    	interactionSpecified(evtCtx, condEnc, responder, scene._depGraph, tg);
    	return scene._triggers[event][id];
    }

    function layout(type, params) {
    	let args = params ? params : {};
    	switch (type.toLowerCase()) {
            case LayoutType.STACK:
                return new StackLayout(args);
            case LayoutType.PACKING:
                return new PackingLayout(args);
            case LayoutType.FORCE:
                return new ForceLayout(args);
            case LayoutType.DIRECTED:
                return new DirectedGraphLayout(args);
            case LayoutType.TIDYTREE:
                return new TidyTreeLayout(args);
            case LayoutType.TREEMAP:
                return new TreemapLayout(args);
            case LayoutType.CIRCULAR:
                return new CircularLayout(args);
            case LayoutType.CLUSTER:
                return new ClusterLayout(args);
            case LayoutType.GRID:
            default:
                return new GridLayout(args);
    	}
    }

    function transform(type, fnOrArgs, params) {
        switch (type) {
            case "kde":    return new KDESpecification(fnOrArgs);
            case "filter": return new FilterSpecification(fnOrArgs);
            case "custom": return new CustomTransformSpecification(fnOrArgs, params);
            case "bin":
            default:       return new BinningSpecification(fnOrArgs);
        }
    }

    function scene(args) {
        return new Scene(args);
    }

    function table(args) {
        return new DataTable(args, "");
    }

    async function csv(url) {
        return importCSV(url);
    }

    function csvString(str) {
        return importCSVString(str);
    }

    async function graphJSON(url) {
        return importGraphJSON(url);
    }

    async function treeJSON(url) {
        return importTreeJSON(url);
    }

    function renderer(type, id) {
        switch (type) {
            case "svg":
            default:
                return new SVGRenderer(id);
        }
    }

    function serialize(elem) {
        return serializeElement(elem);
    }

    function deserialize(json) {
        return deserializeScene(json);
    }

    function isEqual(scn1, scn2) {
        return scenesEqual(scn1, scn2);
    }

    const ROW_ID = MSCRowID;

    exports.ROW_ID = ROW_ID;
    exports.activate = activate;
    exports.affix = affix;
    exports.align = align;
    exports.attach = attach;
    exports.canClassify = canClassify;
    exports.canDensify = canDensify;
    exports.canDivide = canDivide;
    exports.canRepeat = canRepeat;
    exports.childHitTest = childHitTest;
    exports.childrenHitTestByRect = childrenHitTestByRect;
    exports.classify = classify;
    exports.connect = connect;
    exports.contains = contains;
    exports.csv = csv;
    exports.csvString = csvString;
    exports.densify = densify;
    exports.deserialize = deserialize;
    exports.divide = divide;
    exports.encode = encode;
    exports.findElements = findElements;
    exports.getChannelEncodingByAttribute = getChannelEncodingByAttribute;
    exports.getChannelEncodingByElement = getChannelEncodingByElement;
    exports.getEncodingsByChannel = getEncodingsByChannel;
    exports.getEncodingsByElement = getEncodingsByElement;
    exports.getLeafMarks = getLeafMarks;
    exports.getPeers = getPeers;
    exports.graphJSON = graphJSON;
    exports.isDataBound = isDataBound;
    exports.isDataBoundHorizontally = isDataBoundHorizontally;
    exports.isDataBoundVertically = isDataBoundVertically;
    exports.isEqual = isEqual;
    exports.isMark = isMark;
    exports.isRefElement = isRefElement;
    exports.layout = layout;
    exports.markHitTest = markHitTest;
    exports.markPrimitiveHitTest = markPrimitiveHitTest;
    exports.markPrimitiveHitTestByRect = markPrimitiveHitTestByRect;
    exports.removeEncoding = removeEncoding;
    exports.renderer = renderer;
    exports.repeat = repeat;
    exports.repopulate = repopulate;
    exports.scene = scene;
    exports.serialize = serialize;
    exports.sortChildren = sortChildren;
    exports.stratify = stratify;
    exports.table = table;
    exports.transform = transform;
    exports.translate = translate;
    exports.treeJSON = treeJSON;
    exports.update = update;

}));
