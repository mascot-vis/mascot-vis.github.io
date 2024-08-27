/* eslint-disable */
// version: 3.0.0
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.msc = {}, global.d3));
})(this, (function (exports, d3) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
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
        n["default"] = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespace(d3);

    const CanvasProvider$1 = {
        canvas: undefined,

        getCanvas: function () {
            if (!window)
                return null;
            if (this.canvas === undefined) {
                this.canvas = document.createElement('canvas');
            }
            return this.canvas;
        },

        getContext: function () {
            var canvas = this.getCanvas();
            return canvas ? canvas.getContext('2d') : null;
        }
    };

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
                v = elem.dataScope.getAttributeValue(this._variableName);
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
                let v = elem.dataScope.getAttributeValue(this._variableName);
                return this._value.indexOf(v) >= 0;
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

    }

    class PointPredicate extends Predicate {

        constructor(type, vt, vn) {
            super(type, vt, vn);
        }

        testElement(elem) {
            if (this._variableType == "attribute") {
                if (!elem.dataScope) return false;
                let v = elem.dataScope.getAttributeValue(this._variableName);
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

    }

    function obj2Predicate(obj) {
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
        
        if (obj.value)
            p.value = obj.value;
        return p;
    }

    function matchCriteria(cpnt, predicates) {
        for (let p of predicates) {
            let predicate = obj2Predicate(p);
            if (!predicate.testElement(cpnt))
                return false;
        }
        return true;
    }

    // export function evaluatePredicate(elem, p) {
    //     if ("attribute" in p) {
    //         if (!elem.dataScope) return false;
    //         let f = p["attribute"];
    //         if ("value" in p) {
    //             return elem.dataScope.getAttributeValue(f) === p["value"];
    //         } else if ("interval" in p) {
    //             let v = elem.dataScope.getAttributeValue(f);
    //             return v >= p["interval"][0] && v <= p["interval"][1];
    //         } else if ("values" in p) {
    //             return p["values"].indexOf(elem.dataScope.getAttributeValue(f)) >= 0;
    //         } else {
    //             return elem.dataScope.hasAttribute(f);
    //         }
    //     } else if ("channel" in p) {
    //         let c = p["channel"];
    //         if ("value" in p) {
    //             return elem[c] === p["value"];
    //         } else if ("interval" in p) {
    //             return elem[c] >= p["interval"][0] && elem[c] <= p["interval"][1];
    //         } else if ("values" in p) {
    //             return p["values"].indexOf(elem[c]) >= 0;
    //         }
    //     } else if ("type" in p) {
    //         return elem.type === p["type"];
    //     } else if ("id" in p) {
    //         return elem.id === p["id"];
    //     } else if ("classId" in p) {
    //         return elem.classId === p["classId"];
    //     } else if ("attributes" in p) {
    //         if (!elem.dataScope) return false;
    //         let f1 = p["attributes"][0], f2 = p["attributes"][1],
    //             v1 = elem.dataScope.getAttributeValue(f1), v2 = elem.dataScope.getAttributeValue(f2);
    //         switch (p["operator"]) {
    //             case "==":
    //                 return v1 == v2;
    //             case ">":
    //                 return v1 > v2;
    //             case ">=":
    //                 return v1 >= v2;
    //             case "<":
    //                 return v1 < v2;
    //             case "<=":
    //                 return v1 <= v2;
    //         }
    //     }
    //     return false;
    // }

    class OneWayDependency {

        constructor(opType) {
            this._id = opType + "_" + generateUniqueID();
            this._type = opType;
            this._inputVars = [];
            this._outputVars = [];
        }

        run() {
            console.log("-", this._type, 
                this.outputVar.element ? this.outputVar.element.type : "",
                this.outputVar.channel ? this.outputVar.channel : ""
            );

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
        DOMAIN_BUILDER: 'domainBuilder',
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
        TARGET_EVALUATOR: 'targetEvaluator'
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
        ATTRIBUTE: 'attribute',
        ITEMS: "items",
        DATASCOPE: 'datascope',
        DOMAIN: 'domain',
        BOUNDS: 'bounds',
        ORDER: 'order',
        SCALE: 'scale',
        COND_ENCODING: 'condEncoding',
        AFFIXATION: 'affixation',
        ALIGNMENT: 'alignment',
        TRIGGER: 'trigger'
    });

    function getPositionInScene (domID, clientX, clientY) {
        const svg = document.getElementById(domID);
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        return [svgP.x, svgP.y];
    }

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

    const SVGProvider = {
    	svg: undefined,

    	getSVG: function() {
    		if (!window)
                return null;
    		if (this.svg === undefined) {
    			this.svg = document.createElement('svg');
    		}
    		return this.svg;
    	}
    };

    const CanvasProvider = {
    	canvas : undefined,

    	getCanvas: function() {
    		if (!window)
                return null;
    		if (this.canvas === undefined) {
    			this.canvas = document.createElement('canvas');
    		}
    		return this.canvas;
    	},

    	getContext: function() {
            var canvas = this.getCanvas();
            return canvas ? canvas.getContext('2d') : null;
        },
    };

    function handleBrush(triggers, svg, scene, renderer, renderArgs) {
        for (let trigger of triggers) {
            let listener = trigger.listener ? trigger.listener : scene,
                b = listener.type === ElementType.Axis ? listener.boundsWithoutTitle : listener.bounds,
                extent = [[b.left, b.top], [b.right, b.bottom]];
            let brush = trigger.event === "brushX" ? d3__namespace.brushX() : trigger.event === "brushY" ? d3__namespace.brushY() : d3__namespace.brush();
            brush.extent(extent).on("brush end", e => {
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

                trigger.mouseEvent = { xInterval: xInt, yInterval: yInt };
                scene.onChange(VarType.TRIGGER, trigger);
                renderer._render(scene, renderArgs);
            });
            svg.append("g").attr("class", "brush").call(brush);
        }
        // for (let triggerKey in scene.eventMap["brush"]) {
        //     for (let condEnc of scene.eventMap["brush"][triggerKey]) {
        //         _brush(condEnc, svg, scene, renderer, renderArgs);
        //     }
        // }
    }

    // export function handleHover2(svg, scene, renderer, renderArgs) {
    //     svg.on("mousemove", (e) => {
    //         for (let classId in scene.eventMap["hover"]) {
    //             for (let condEnc of scene.eventMap["hover"][classId]) {
    //                 _hover(condEnc, svg, scene, e, classId, renderer, renderArgs);
    //             }
    //         }
    //     })
    // }

    function handleHover(triggers, svg, scene, renderer, renderArgs) {
        svg.on("mousemove", (e) => {
            for (let trigger of triggers) {
                let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
                let hit = hitTest(scene, trigger.element.type, x, y);
                if (hit)
                    trigger.isCumulative && !trigger.elements.includes(hit) ? trigger.elements.push(hit) : trigger.elements = [hit];
                else
                    trigger.elements = [];
                trigger.mouseEvent = {"x": x, "y":y};
                scene.onChange(VarType.TRIGGER, trigger);
            }
            renderer._render(scene, renderArgs);
        });
    }

    function handleInput(triggers, svg, scene, renderer, renderArgs) {    
        for (let trigger of triggers) {
            let ctrl = document.getElementById(trigger.element);
            ctrl.addEventListener('input', function() {
                trigger.callback();
                renderer._render(scene, renderArgs);
            } );
        }
    }

    // function _hover(condEnc, svg, scene, e, classId, renderer, renderArgs) {
    //     let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
    //     let hit = hitTest(scene, condEnc.element.type, x, y);
    //     if (hit)
    //         condEnc.isCumulative ? condEnc.triggerElements.push(hit) : condEnc.triggerElements = [hit];
    //     else
    //         condEnc.triggerElements = [];
    //     condEnc.mouseEvent = {"x": x, "y":y};
    //     // if (condEnc.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
    //     //     setPredicateValues(condEnc, hit)
    //     // }
        
    //     scene.onChange(VarType.COND_ENCODING, condEnc);
    //     renderer._render(scene, renderArgs);
    //     //return;
    // }

    // function setPredicateValues(condEnc, hit) {
    //     let predicates = condEnc.predicates,
    //             values = hit ? predicates.map(d => hit.dataScope.getAttributeValue(d.variableName)) :
    //                         predicates.map(d => undefined);
    //     for (const [idx, predicate] of predicates.entries()) {
    //         switch (predicate.type) {
    //             case PredicateType.POINT:
    //                 predicate.value = values[idx];
    //                 break;
    //             case PredicateType.LIST:
    //                 if (values[idx]) predicate.addValue(values[idx]);
    //                 else predicate.resetValue();
    //                 break;
    //             case PredicateType.INTERVAL:
    //                 predicate.value = undefined;
    //                 break;
    //         }
    //     }
    // }

    function handleClick(triggers, svg, scene, renderer, renderArgs) {
        svg.on("click", (e) => {
            // for (let classId in scene.eventMap["click"]) {
            //     for (let condEnc of scene.eventMap["click"][classId]) {
            //         _click(condEnc, svg, scene, e, classId, renderer, renderArgs);
            //     }
            // }
            for (let trigger of triggers) {
                let [x, y] = getPositionInScene(svg.attr("id"), e.clientX, e.clientY);
                let hit = hitTest(scene, trigger.element.type, x, y);
                if (hit)
                    trigger.isCumulative && !trigger.elements.includes(hit) ? trigger.elements.push(hit) : trigger.elements = [hit];
                else
                    trigger.elements = [];
                trigger.mouseEvent = { "x": x, "y": y };
                scene.onChange(VarType.TRIGGER, trigger);
            }
            renderer._render(scene, renderArgs);
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
    //     //     values = condEnc.hitElement ? predicates.map(d => condEnc.hitElement.dataScope.getAttributeValue(d.variableName)) :
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
    		let left = Math.min(this.left, rect.left), top = Math.min(this.top, rect.top), right = Math.max(this.right, rect.right), btm = Math.max(this.bottom, rect.bottom), wd = right - left, ht = btm - top;
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

    	overlap(r) {
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

    class SVGRenderer {

        constructor(svgId) {
            this._svgId = svgId;
            this._compMap = {};
            this._decoMap = {};
            this._brushCreated = 0;
        }

        render(scene, params) {
            let args = params ? params : {};
            this._render(scene, args);
            this._registerEvents(scene, args);
        }

        //only repaints, do not update events
        _render(scene, args) {
            for (let k in this._decoMap) {
                this._decoMap[k].remove();
                delete this._decoMap[k];
            }
            this._removed = {};
            for (let k in this._compMap) {
                this._removed[k] = 1;
            }
            this._renderItem(scene, args);
            for (let k in this._removed) {
                this._compMap[k].remove();
                delete this._compMap[k];
            }
        }

        _registerEvents(scene, renderArgs) {
            let svg = d3__namespace.select("#" + this._svgId);
            for (let evt in scene.interactionTriggers) {
                let triggers = Object.values(scene.interactionTriggers[evt]);
                switch (evt) {
                    case "click":
                        svg.on("click", null);
                        handleClick(triggers, svg, scene, this, renderArgs);
                        break;
                    case "brush":
                    case "brushX":
                    case "brushY":
                        handleBrush(triggers, svg, scene, this, renderArgs);
                        break;
                    case "hover":
                        handleHover(triggers, svg, scene, this, renderArgs);
                        break;
                    case "input":
                        handleInput(triggers, svg, scene, this, renderArgs);
                }
            }
        }

        clear() {
            let svg = document.getElementById(this._svgId);
            while (svg.firstChild) {
                svg.firstChild.remove();
            }
            this._compMap = {};
            this._decoMap = {};
        }

        _renderItem(c, args) {
            let cid = c.id,
                parent = c.parent;

            let svgParent;
            if (parent && parent.id && parent.id in this._compMap) {
                svgParent = d3__namespace.select("#" + this._svgId).select("#" + parent.id);
            } else {
                svgParent = d3__namespace.select("#" + this._svgId);
            }

            if (!(cid in this._compMap)) {
                //TODO: what if the parent is not rendered? What if the hierarchy has changed?
                if (c.type === ElementType.PointText && c.hasBackground())
                    this._compMap[cid+"-bg"] = svgParent.append("rect");
                this._compMap[cid] = svgParent.append(this._getSVGElementType(c));
            } else {
                delete this._removed[cid];
                delete this._removed[cid+"-bg"];
            }

            if (c.type == ElementType.Gridlines) {
                this._compMap[cid].lower();
            }

            let el = this._compMap[cid];

            el.attr("id", cid);
            if (c.classId)
                el.attr("class", c.classId);

            if (c.type == ElementType.Scene) {
                d3__namespace.select("#" + this._svgId).style("background", c.fillColor ? c.fillColor : "#fff");
            }

            if (c.type == "vertex") {
                //TODO: render vertices
                return;
            }

            let pathTypes = [ElementType.Path, ElementType.BezierCurve, ElementType.BundledPath, ElementType.Polygon, ElementType.Link, ElementType.Pie, ElementType.Line, ElementType.Area, ElementType.Ring, ElementType.Arc, ElementType.Gridlines];
            if (pathTypes.indexOf(c.type) >= 0) {
                el.attr("d", c.getSVGPathData());
                if (!c.closed)
                    el.style("fill", "none");
                if (cid.includes("axis") || cid.includes("gridlines")) {
                    el.style("shape-rendering", "crispEdges");
                }
                if (c.type === ElementType.BundledPath) {
                    el.style("mix-blend-mode", "multiply");
                }
            } else if (c.type == ElementType.Circle) {
                el.attr("cx", c.x);
                el.attr("cy", c.y);
                el.attr("r", c.radius);
            } else if (c.type == ElementType.Rect) {
                //do not use c.left, c.top, c.width, c.height as the rectangle may be flipped
                //use c.bounds
                let b = c.bounds;
                el.attr("x", b.left).attr("y", b.top).attr("width", b.width).attr("height", b.height);
            } else if (c.type == ElementType.PointText) {
                el.attr("text-anchor", this._getTextAnchor(c.anchor[0]))
                    .attr("alignment-baseline", this._getTextAnchor(c.anchor[1]))
                    .attr("dominant-baseline", this._getTextAnchor(c.anchor[1]))
                    .text(c.text)
                    .attr("x", c.x).attr("y", c.y);

                if (c.hasBackground()) {
                    let bg = this._compMap[cid + "-bg"], tb = c.bounds;
                    bg.attr("x", tb.left - 5).attr("y", tb.top - 5).attr("width", tb.width + 10).attr("height", tb.height + 10)
                        .attr("rx", 5).attr("ry", 5)
                        .style("fill", c.backgroundColor).style("stroke", c.borderColor).style("strokeWidth", c.borderWidth);
                }
            } else if (c.type == ElementType.Image) {
                el.attr("href", c.src).attr("x", c.x).attr("y", c.y).attr("width", c.width).attr("height", c.height);
            }

            for (let s in c.styles) {
                if (c.styles[s] === undefined)
                    continue;
                if (s.indexOf("Color") > 0 && c.styles[s].type == ElementType.LinearGradient) {
                    if (d3__namespace.select("#" + this._svgId).select("defs").empty())
                        d3__namespace.select("#" + this._svgId).append("defs");
                    let defs = d3__namespace.select("defs"), gradient = c.styles[s];
                    if (defs.select("#" + gradient.id).empty()) {
                        let grad = defs.append("linearGradient").attr("id", gradient.id);
                        grad.attr("x1", gradient.x1 + "%").attr("x2", gradient.x2 + "%").attr("y1", gradient.y1 + "%").attr("y2", gradient.y2 + "%");
                        for (let stop of gradient.stops)
                            grad.append("stop").attr("offset", stop.offset + "%").style("stop-color", stop.color).style("stop-opacity", stop.opacity);
                    }
                    el.style(Style2SVG[s], "url(#" + gradient.id + ")");
                } else {
                    el.style(Style2SVG[s], c.styles[s]);
                    if (s === "visibility" && c.type === ElementType.PointText && c.hasBackground()) {
                        let bg = this._compMap[cid + "-bg"];
                        bg.style(Style2SVG[s], c.styles[s]);
                    }
                }

            }

            if (c._rotate)
                el.attr("transform", "rotate(" + c._rotate.join(" ") + ")");

            // render vertices if shape is defined
            if (c.vertices) {
                // let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
                // if (shapes.length > 0) 
                this._renderVertices(c);
            }

            // render collection bound
            //ElementType.Collection, ElementType.Glyph, ElementType.Axis, ElementType.Legend
            if (([ElementType.Circle].includes(c.type) ) && args && args["bounds"]) {
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
                    this._decoMap[c.id] = d3__namespace.select("#" + this._svgId).append("rect").attr("class", "deco");
                }
                this._decoMap[c.id].attr("x", b.left).attr("y", b.top)
                    .attr("width", b.width).attr("height", b.height).attr("fill", "none")
                    .attr("stroke", "blue").attr("stroke-width", "1px")
                    .attr("stroke-dasharray", "5,5");
            } else if (isMark(c) && args && args["refBounds"]) {
                let b = c.refBounds;
                if (b) {
                    if (!(c.id in this._decoMap)) {
                        this._decoMap[c.id] = d3__namespace.select("#" + this._svgId).append("rect").attr("class", "deco");
                    }
                    this._decoMap[c.id].attr("x", b.left).attr("y", b.top)
                        .attr("width", b.width).attr("height", b.height).attr("fill", "none")
                        .attr("stroke", "blue").attr("stroke-width", "1px")
                        .attr("stroke-dasharray", "5,5");
                }
            }

            //render text/axis bound
            // let types = [ElementType.PointText, ElementType.Axis];
            // if (types.indexOf(c.type) >= 0) {
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

            if (c.children) {
                for (let child of c.children) {
                    this._renderItem(child, args);
                }
            }

        }

        _renderVertices(c) {
            let id = c.id + "-vertices";
            if (!(id in this._compMap)) {
                let parent = c.parent,
                    pid = parent ? parent.id : this._svgId;
                this._compMap[id] = d3__namespace.select("#" + pid).append("g").attr("id", id);
            } else {
                delete this._removed[id];
            }

            let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
            if (shapes.length === 0) {
                this._compMap[id].style("visible", "hidden");
                return;
            } else {
                this._compMap[id].style("visible", "visible");
            }

            let vertices = c.vertices.filter(d => d.shape !== undefined);
            for (let v of vertices) {
                let vid = id + "-" + v.id;
                if (!(vid in this._compMap)) {
                    this._compMap[vid] = d3__namespace.select("#" + id).append(v.shape).attr("id", vid);
                } else if (v.shape !== this._compMap[vid].node().tagName) {
                    this._compMap[vid].remove();
                    this._compMap[vid] = d3__namespace.select("#" + id).append(v.shape).attr("id", vid);
                    delete this._removed[vid];
                } else {
                    delete this._removed[vid];
                }
                if (v.shape == "rect") {
                    d3__namespace.select("#" + vid).attr("x", v.x - v.width / 2).attr("y", v.y - v.height / 2)
                        .attr("width", v.width).attr("height", v.height);
                } else if (v.shape == "circle") {
                    d3__namespace.select("#" + vid).attr("cx", v.x).attr("cy", v.y).attr("r", v.radius);
                }
                d3__namespace.select("#" + vid).style("fill", v.fillColor).style("opacity", v.opacity)
                    .style("stroke-width", v.strokeWidth).style("stroke", v.strokeColor);
            }
        }

        _renderLayout(c) {
            let gridId = c.id + "-grid";
            if (!(gridId in this._decoMap)) {
                this._decoMap[gridId] = d3__namespace.select("#" + this._svgId).append("g")
                    .attr("id", gridId).attr("class", "deco");
            }
            let cellBounds = c.layout.cellBounds; c.layout.rowGap;
            this._decoMap[gridId].selectAll("rect").remove();
            // this._decoMap[gridId].selectAll("rect").data(cellBounds.slice(0, cellBounds.length - 1))
            //     .enter().append("rect").attr("x", d => d.left).attr("y", d => d.bottom)
            //     .attr("width", d => d.width).attr("height", rowGap)
            //     .style("fill", "pink").style("opacity", 0.5)
            //     ;
            
            for (let cb of cellBounds) {
                this._decoMap[gridId].append("rect").attr("x", cb.left).attr("y", cb.top)
                    .attr("width", cb.width).attr("height", cb.height)
                    .attr("stroke", "blue").attr("stroke-width", "1px")
                    .attr("stroke-dasharray", "5,5").attr("fill", "none");
            }
            // let left = Math.min(...cellBounds.map(d => d.left)),
            // 	top = Math.min(...cellBounds.map(d => d.top))
            // this._decoMap[gridId].append("rect").attr("x", left).attr("y", top)
            // 	.attr("width", c.bounds.width).attr("height", c.bounds.height)
            // 	.attr("stroke", "blue").attr("stroke-width", "1px")
            // 	.attr("stroke-dasharray", "5,5").attr("fill", "none");

        }

        _getTextAnchor(anchor) {
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
                case ElementType.Line:
                case ElementType.Gridlines:
                    return "path";
                case ElementType.Circle:
                    return "circle";
                //return "line";
                case ElementType.PointText:
                    return "text";
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
        "visibility": "visibility"
    });

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

    class Mark {

        constructor(args) {
            this._dataScope = undefined;
            this._type = "type" in args ? args.type : ElementType.Mark;
            this._id = args.id ? args.id : this._type + "_" + generateUniqueID();
            this._classId = undefined;
            this._bounds = undefined;
            this._rotate = undefined;
            //when a path encodes data using its width or height, its geometric bounds may not be the same as its orginal bounds without encoding applied
    		this._refBounds = undefined;

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

        set strokeColor(c) {
            this.styles.strokeColor = c;
        }

        get strokeColor() {
            return this.styles.strokeColor;
        }

        set strokeWidth(w) {
            this.styles.strokeWidth = w;
        }

        get strokeWidth(){
            return this.styles.strokeWidth;
        }

        set strokeDash(w) {
            this.styles.strokeDash = w;
        }

        get strokeDash(){
            return this.styles.strokeDash;
        }


        set fillColor(w) {
            this.styles.fillColor = w;
        }

        get fillColor(){
            return this.styles.fillColor;
        }

        get rotation() {
            return this._rotate;
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

        //TODO: implement winding contribution, see paper.js PathItem.Boolean.js
        contains(px, py) {
            if (!this.bounds)
                return false;
            if (!this.bounds.contains(px, py))
                return false;
            switch (this.type) {
                case ElementType.Rect:
                case ElementType.PointText:
                    return true;
                case ElementType.Circle: {
                    let dist = Math.sqrt(Math.pow(px - this.x, 2) + Math.pow(py - this.y, 2));
                    return dist <= this.radius + this.strokeWidth;
                }
                case ElementType.Path: {
                    let ctx = CanvasProvider$1.getContext(),
                        p = new Path2D(this.getSVGPathData());
                    ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
                    ctx.stroke(p);
                    if (this.closed) {
                        return ctx.isPointInPath(p, px, py);
                    } else {
                        return ctx.isPointInStroke(p, px, py);
                    }
                }
                case ElementType.Line: {
                    let ctx = CanvasProvider$1.getContext(),
                        p = new Path2D(this.getSVGPathData());
                    ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
                    ctx.stroke(p);
                    return ctx.isPointInStroke(p, px, py);
                }
                default: {
                    let ctx = CanvasProvider$1.getContext(),
                        p = new Path2D(this.getSVGPathData());
                    return ctx.isPointInPath(p, px, py);
                }
            }
        }

        // toJSON() {
        //     let json = {};
        //     json.type = this.type;
        //     json.id = this.id;
        //     if (this.classId)
        //         json.classId = this.classId;
        //     if (this._dataScope)
        //         json.dataScope = this._dataScope.toJSON();
        //     json.args = {};
        //     for (let s in this.attrs) {
        //         json.args[s] = this.attrs[s];
        //     }

        //     for (let s in this.styles) {
        //         if (s.indexOf("Color") > 0 && this.styles[s] instanceof LinearGradient) {
        //             json.args[s] = this.styles[s].toJSON();
        //         } else {
        //             json.args[s] = this.styles[s];
        //         }
        //     }
        //     return json;
        // }

        set dataScope(ds) {
            this._dataScope = ds;
        }

        get dataScope() {
            return this._dataScope;
        }

        get styles() {
            return this._styles;
        }

        set styles(value) {
            this._styles = value;
        }

        set visibility(v) {
            this.styles["visibility"] = v;
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
            this.styles["opacity"] = c;
        }

        copyPropertiesTo(target) {
            target.styles = Object.assign({}, this.styles);
            if (this._dataScope)
                target._dataScope = this._dataScope.clone();
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
        PointText: "text",
        Polygon: "polygon",
        BezierCurve: "bezierCurve"
    });

    function getPeers(elem, container) {
        let scene = getScene(elem),
    		scope = container ? container : scene;
        if (elem.type === "vertex") {
    		let parentPeers = findItems(scope, [{"property": "classId", "value": elem.parent.classId}]);
    		return getPeerVertices(elem, parentPeers);
    	} else if (elem.type === "segment") {
    		let parentPeers = findItems(scope, [{"property": "classId", "value": elem.parent.classId}]);
    		return getPeerSegments(elem, parentPeers);
        } else {
            return elem.classId ? findItems(scope, [{"property": "classId", "value": elem.classId}]) : [elem];
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

    function getPeerSegments(segment, parentPeers) {
    	if (segment.dataScope) {
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

    function findItems(container, predicates) {
        let result = [];
        findItemsRecursive(container, predicates, result);
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
    			if (elem.dataScope.hasAttribute(attr))
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

    function findItemsRecursive(itm, predicates, result) {
        if (!itm) return;
        if (itm.type == "axis" || itm.type == "legend" || itm.type == "gridlines") return;
        if (matchCriteria(itm, predicates)) {
            result.push(itm);
        }

        if (itm.vertices) {
            for (let i of itm.vertices.concat(itm.segments)) {
                if (matchCriteria(i, predicates))
                    result.push(i);
            }
        } else if (itm.children && itm.children.length > 0) {
            for (let c of itm.children)
                findItemsRecursive(c, predicates, result);
        }
    }

    function getScene(elem) {
        let p = elem;
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

    function hitTest(container, elementType, x, y) {
        let elems = findItems(container, [{property: "type", value: elementType}]);
        for (let elem of elems) {
            if (contains(elem, x, y))
                return elem;
        }
    }

    function contains(elem, x, y) {
    	switch (elem.type) {
    		case ElementType.Path:
    		case ElementType.BezierCurve:
    		case ElementType.Line:{
    			let ctx = CanvasProvider$1.getContext(),
    				p = new Path2D(elem.getSVGPathData());
    			ctx.lineWidth = Math.max(elem.strokeWidth, 2.5);
    			ctx.stroke(p);
    			if (elem.closed) {
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
    		default:
    			return elem.bounds.contains(x, y);
    	}
    }

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
    	} else if (elem.type == ElementType.Collection && elem.children) {
    		for (let c of elem.children)
    			_getLeafMarks(c, result);
    	} else if (elem.type == ElementType.Glyph && elem.children) {
    		for (let c of elem.children)
    			_getLeafMarks(c, result);
    	} else if (elem.type == ElementType.Composite && elem.children) {
    		for (let c of elem.children)
    			_getLeafMarks(c, result);
    	}
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

    class CondEncodingVar extends Variable {

        constructor(type, condEnc) {
            super(type);
            this._condEnc = condEnc;
        }

        get condEncoding() {
            return this._condEnc;
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


    class Vertex {

    	//handles are relative to the point
    	constructor(x, y, parentMark, id) {
    		this.type = "vertex";
    		this._id = id;
    		this._x = x;
    		this._y = y;
    		this._dataScope = undefined;
    		this.parent = parentMark; 

    		this.shape = undefined;
    		this.width = 0;
    		this.height = 0;
    		this.radius = 0;
    		this.fillColor = "#555";
    		this.opacity = 1;
    		this.strokeWidth = 0;
    		this.strokeColor = "#aaa";
    		this._polarAngle = undefined;
    	}

    	get dataScope() {
    		return this._dataScope;
    	}

    	set dataScope(ds) {
    		this._dataScope = ds;
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
    		return this.parent.id + "_v_" + this._id;
    	}

    	// toJSON() {
    	// 	let json = {};
    	// 	json.type = this.type;
    	// 	json.id = this._id;
    	// 	json.x = this.x;
    	// 	json.y = this.y;
    	// 	if (this._dataScope)
    	// 		json.dataScope = this._dataScope.toJSON();
    	// 	if (this._polarAngle !== undefined)
    	// 		json.polarAngle = this._polarAngle;
    	// 	json.shape = this.shape;
    	// 	json.width = this.width;
    	// 	json.height = this.height;
    	// 	json.radius = this.radius;
    	// 	json.fillColor = this.fillColor;
    	// 	json.opacity = this.opacity;
    	// 	json.strokeWidth = this.strokeWidth;
    	// 	json.strokeColor = this.strokeColor;
    	// 	return json;
    	// }

    	// static fromJSON(json, parent) {
    	// 	let v = new Vertex(json, parent, json.id);
    	// 	if (json.dataScope)
    	// 		v._dataScope = json.dataScope;
    	// 	if ("polarAngle" in json)
    	// 		v.polarAngle = json.polarAngle;
    	// 	v.shape = json.shape;
    	// 	v.width = json.width;
    	// 	v.height = json.height;
    	// 	v.radius = json.radius;
    	// 	v.fillColor = json.fillColor;
    	// 	v.opacity = json.opacity;
    	// 	v.strokeWidth = json.strokeWidth;
    	// 	v.strokeColor = json.strokeColor;
    	// 	return v;
    	// }

    	_clone(parent) {
    		let v = new Vertex(this.x, this.y, parent, this._id);
    		if (this._dataScope) {
    			v._dataScope = this._dataScope.clone();
    		}
    		v.shape = this.shape;
    		v.width = this.width;
    		v.height = this.height;
    		v.radius = this.radius;
    		v.fillColor = this.fillColor;
    		v.opacity = this.opacity;
    		v.strokeWidth = this.strokeWidth;
    		v.strokeColor = this.strokeColor;
    		return v;
    	}

    	// set polarAngle(a) {
    	// 	this._polarAngle = a;
    	// }

    	get polarAngle() {
    		return this._polarAngle;
    	}

    	get scene() {
    		return this.parent.scene;
    	}

    	get x() {
    		return this._x;
    	}

    	get y() {
    		return this._y;
    	}
    }

    Vertex.styles = ["vxShape", "vxWidth", "vxHeight", "vxRadius", "vxFillColor", "vxStrokeColor", "vxStrokeWidth", "vxOpacity"];

    class Segment {
    	
    	constructor(v1, v2, parentMark, id) {
    		this.type = "segment";
    		this._id = id;
    		this.vertex1 = v1;
    		this.vertex2 = v2;

    		this.dataScope = undefined;
    		this.parent = parentMark;
    	}

    	get id() {
    		return this.parent.id + "_s_" + this._id;
    	}

    	get x() {
    		return (this.vertex1.x + this.vertex2.x)/2;
    	}

    	get y() {
    		return (this.vertex1.y + this.vertex2.y)/2;
    	}

    	get scene() {
    		return this.parent.scene;
    	}
    }

    class Path extends Mark {
    	
    	constructor(args) {
    		super(args);
    		this._type = "type" in args ? args.type : ElementType.Path;

    		this.vertices = [];
    		this.vertexCounter = 0; //for assigning vertex ids
    		this._sortBy = {}; //sort vertices by
    		this.segmentCounter = 0;
    		this.segments = [];

    		this.anchor = undefined;

    		this.closed = false;

    		this.curveMode = "linear";

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
    			this._setVertices(args["vertices"]);
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

    	_setVertices(vertices) {
    		let vertex;
    		this.vertices = [];
    		this.segments = [];
    		this.vertexCounter = 0;
    		this.segmentCounter = 0;
    		for (let i = 0; i < vertices.length; i++) {

    			if (i == vertices.length - 1 && vertices[i][0] === vertices[0][0] && vertices[i][1] === vertices[0][1] && this.type === ElementType.Path) {
    				continue;
    			}

    			vertex = new Vertex(vertices[i][0], vertices[i][1], this, this.vertexCounter++);

    			for (let vs of Vertex.styles){
    				if (this[vs]){
    					let temp = vs.replace("vx", "");
    					vertex[temp[0].toLowerCase() + temp.slice(1)] = this[vs];
    				}
    			}

    			this.vertices.push(vertex);
    			if (i > 0)
    				this.segments.push(new Segment(this.vertices[i-1], this.vertices[i], this, this.segmentCounter++));
    		}
    		//if the first vertex has the same position as the last, this path is closed
    		let first = vertices[0], last = vertices[vertices.length - 1];
    		if ((first[0] === last[0] && first[1] === last[1]) || this.type === ElementType.Rect) {
    			this.closed = true;
    			if (!("fillColor" in this.styles))
    				this.styles["fillColor"] = "#fff";
    			this.segments.push(new Segment(this.vertices[this.vertices.length-1], this.vertices[0], this, this.segmentCounter++));
    		}
    	}

    	copyPropertiesTo(target) {
    		target.attrs = Object.assign({}, this.attrs);
    		target.styles = Object.assign({}, this.styles);
    		for (let vs of Vertex.styles){
    			if (this["_"+vs])
    				target["_"+vs] = this["_"+vs];
    		}
    		if (this._dataScope)
    			target._dataScope = this._dataScope.clone();
    		target.closed = this.closed;
    		target.curveMode = this.curveMode;
    		target.vertices = [];
    		target.segments = [];
    		for (let v of this.vertices) {
    			target.vertices.push(v._clone(target));
    		}
    		target.segmentCounter = 0;
    		for (let i = 1; i < target.vertices.length; i++) {
    			target.segments.push(new Segment(target.vertices[i-1], target.vertices[i], target, target.segmentCounter++));
    		}
    		if (target.closed)
    			target.segments.push(new Segment(target.vertices[target.vertices.length-1], target.vertices[0], target, target.segmentCounter++));
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

    	get strokeColor() {
    		return this.styles["strokeColor"];
    	}

    	// set strokeColor(c) {
    	// 	this.styles["strokeColor"] = c;
    	// }

    	get strokeWidth() {
    		return this.styles["strokeWidth"];
    	}

    	// set strokeWidth(c) {
    	// 	this.styles["strokeWidth"] = c;
    	// }

    	get fillColor() {
    		return this.styles["fillColor"];
    	}

    	set fillColor(c) {
    		this.styles["fillColor"] = c;
    	}

    	get strokeDash() {
    		return this.styles["strokeDash"];
    	}

    	set strokeDash(c) {
    		this.styles["strokeDash"] = c;
    	}

    	//by default, with respect to the center of bounds
    	resize(wd, ht, xRef, yRef) {
    		let bounds = this.bounds, bWidth = bounds.width === 0 ? 1 : bounds.width, bHeight = bounds.height === 0 ? 1 : bounds.height;
    		if (xRef === "right") {
    			for (let v of this.vertices) {
    				v._x = bounds.right - (wd/bWidth) * (bounds.right - v.x);
    			}
    		} else {
    			for (let v of this.vertices) {
    				v._x = bounds.left + (wd/bWidth) * (v.x - bounds.left);
    			}
    		}
    		if (yRef === "top") {
    			for (let v of this.vertices) {
    				v._y = bounds.top + (ht/bHeight) * (v.y - bounds.top);
    			}
    		} else {
    			for (let v of this.vertices) {
    				v._y = bounds.bottom - (ht/bHeight) * (bounds.bottom - v.y);
    			}
    		}
    		this._updateBounds();
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
    			vx = this.vertices.map(d => d.x),
    			vy = this.vertices.map(d => d.y);
    		}

    		let left = Math.min(...vx), top = Math.min(...vy), right = Math.max(...vx), btm = Math.max(...vy),
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
    		let vertex = new Vertex(x, y, this, this.vertexCounter++);
    		this.vertices.splice(i, 0, vertex);
    		//TODO: handle segments
    	}

    	sortVertices(channel, descending) {
    		this.vertices.sort((a,b) => a[channel] - b[channel]);
    		if (descending)
    			this.vertices.reverse();
    		for (let i = 0; i < this.segments.length; i++) {
    			let segment = this.segments[i];
    			segment.vertex1 = this.vertices[i];
    			segment.vertex2 = this.vertices[(i+1)%this.vertices.length];
    		}
    	}

    	sortVerticesByData(attr, descending, order) {
    		let f;
    		if (order)
    			f = (a, b) => order.indexOf(a.dataScope.getValue(attr)) - order.indexOf(b.dataScope.getAttributeValue(attr));
    		else
    			f = (a, b) =>  (a.dataScope.getAttributeValue(attr) < b.dataScope.getAttributeValue(attr) ? -1 : 1 );
    		this.vertices.sort(f);
    		if (descending)
    			this.vertices.reverse();
    		for (let i = 0; i < this.segments.length; i++) {
    			let segment = this.segments[i];
    			segment.vertex1 = this.vertices[i];
    			segment.vertex2 = this.vertices[(i+1)%this.vertices.length];
    		}
    	}

    	getSVGPathData() {
    		if (this._d) {
    			return this._d;
    		}
    		let p = d3__namespace.path();
    		let curve = this._getD3CurveFunction(this.curveMode)(p);
    		curve.lineStart();
    		for (let vertex of this.vertices) {
    			curve.point(vertex.x, vertex.y);
    		}
    		if (this.closed)
    			curve.point(this.vertices[0].x, this.vertices[0].y);
    		curve.lineEnd();
    		return p._;
    	}

    	get firstVertex() {
    		return this.vertices[0];
    	}

    	get firstSegment() {
    		return this.segments[0];
    	}

    	get lastVertex() {
    		return this.vertices[this.vertices.length - 1];
    	}

    	get lastSegment() {
    		return this.segments[this.segments.length - 1];
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

    	// set vxOpacity(s){
    	// 	this._vxOpacity = s;
    	// 	for (let v of this.vertices)
    	// 		v.opacity = s;
    	// }

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

    }

    function getPointAt(path, frac) {
    	const svg = SVGProvider.getSVG();
    	let pathSVG = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    	pathSVG.setAttribute("d", path.getSVGPathData());
    	svg.appendChild(pathSVG);
    	let len = pathSVG.getTotalLength();
    	return pathSVG.getPointAtLength(len * frac);
    }

    function isLink(elem) {
    	return elem instanceof Path && elem.source && elem.target;
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

    class Arc extends Path {

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
            this._setVertices([[isx, isy], [osx, osy], [oex, oey], [iex, iey]]);
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

            this.vertices[0]._x = this._x + this._innerRadius * Math.cos(this._sr);
            this.vertices[0]._y = this._y - this._innerRadius * Math.sin(this._sr);
            this.vertices[1]._x = this._x + this._outerRadius * Math.cos(this._sr);
            this.vertices[1]._y = this._y - this._outerRadius * Math.sin(this._sr);
            this.vertices[2]._x = this._x + this._outerRadius * Math.cos(this._er);
            this.vertices[2]._y = this._y - this._outerRadius * Math.sin(this._er);
            this.vertices[3]._x = this._x + this._innerRadius * Math.cos(this._er);
            this.vertices[3]._y = this._y - this._innerRadius * Math.sin(this._er);
        }

        _updateBounds() {		
    		this._bounds = new Rectangle(this._x - this._outerRadius, this._y - this._outerRadius, this._outerRadius * 2, this._outerRadius * 2);
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
    	if (a < 0)
    		return a + 360;
    	else if (a > 360)
    		return a - 360;
    	else
    		return a;
    }

    function getPolarAngle(x1, y1, x0, y0) {
        let xA_prime = x1 - x0;
        let yA_prime = y1 - y0;
        
        // Calculate the polar angle using atan2
        let theta = Math.atan2(yA_prime, xA_prime);
        
        // Optional: Convert radians to degrees
        return theta * (180 / Math.PI);
    }

    class DataScope {

        constructor(datatable) {
            this._attr2value = {};
            this._dt = datatable;
            this._tuples = this._dt.data;
        }

        // toJSON() {
        //     let json = {};
        //     json.dt = this._dt.id;
        //     json.f2v = Object.assign({}, this._attr2value);
        //     json.tuples = this._tuples.map(d => parseInt(d[MSCRowID].substring(1)));
        //     return json;
        // }

        isFullTable() {
            return Object.keys(this._attr2value).length === 0;
        }

        isEmpty() {
            return this._tuples.length == 0;
        }

        get numTuples() {
            return this._tuples.length;
        }

        get attributes() {
            return Object.keys(this._attr2value);
        }

        get dataTable() {
            return this._dt;
        }

        get filters() {
            return this._attr2value;
        }

        merge(ds) {
            let r = new DataScope(this._dt);
            for (let attr in this._attr2value) {
                r = r.cross(attr, this._attr2value[attr]);
            }
            for (let attr in ds._attr2value) {
                r = r.cross(attr, ds._attr2value[attr]);
            }
            return r;
        }

        cross(attr, value) {
            if (attr in this._attr2value && this._attr2value[attr] !== value) {
                console.warn("Conflict in attribute values when merging dataScope:", attr, this._attr2value[attr], value);
                return this;
            }
            let ds = this.clone();
            ds._attr2value[attr] = value;
            ds._updateTuples(attr, value);
            return ds;
        }

        clone() {
            let ds = new DataScope(this._dt);
            ds._attr2value = Object.assign({}, this._attr2value);
            ds._tuples = this._tuples.map(d => d);
            return ds;
        }

        getAttributeValue(attr) {
            let values = this.getAttributeValues(attr);
            if (values.length > 1) ;
            return values[0];
        }

        getAttributeValues(attr) {
            let values = this._tuples.map(d => d[attr]);
            values = [...new Set(values)];
            return values;
        }

        getUniqueAttributeValues(attr) {
            let values = this._tuples.map(d => d[attr]);
            return [...new Set(values)];
        }

        hasAttribute(attr) {
            return (attr in this._attr2value);
        }

        getAttributeType(attr) {
            return this._dt.getAttributeType(attr);
        }

        aggregateNumericalAttribute(attr, aggregator) {
            let values = this._tuples.map(d => d[attr]);
            switch (aggregator) {
                case Aggregator.Max:
                    return Math.max(...values);
                case Aggregator.Min:
                    return Math.min(...values);
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

        _updateTuples(attr, value) {
            this._tuples = this._tuples.filter(d => d[attr] == value);
        }

        get tuples() {
            return this._tuples;
        }
    }

    function getUsableDataScope(elem) {
        if (elem.type == "vertex" || elem.type == "segment")
            return elem.dataScope ? elem.dataScope : elem.parent.dataScope;
        else
            return elem.dataScope;
    }

    const Aggregator = {
        Max: "max",
        Min: "min",
        Avg: "avg",
        Median: "median",
        Sum: "sum",
        Count: "count",
        Mean: "mean",
        Percentile25: "percentile 25",
        Percentile75: "percentile 75"
    };

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

        getNodeDataScope(node) {
            let ds = new DataScope(this._nodeTable);
            return ds.cross(MSCRowID, node[MSCRowID]);
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
    }

    function getTree(nodeMark) {
        return nodeMark.dataScope._dt.tree;
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
        return nodeMark.dataScope._dt.graph;
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

    function validateAttribute(attr, dt) {
        if (dt.hasAttribute(attr))
            return true;
        else if (dt.tree && dt.tree.nodeTable.hasAttribute(attr.split(".")[1]))
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

    function densifyElement(scene, elem, attr, orientation, datatable) {

        let type = datatable.getAttributeType(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Number && type != AttributeType.Integer) {
            throw new Error("Densify only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!densifiable(elem)) {
            throw new Error("The " + elem.type + " is not dividable");
        }

        switch (elem.type) {
    		case ElementType.Line:
    			return _doLineDensify(elem, attr, datatable);
    		case ElementType.Circle:
    			return _doCircleDensify(elem, attr, datatable);
    		case ElementType.Rect:
    			return _doRectDensify(elem, orientation, attr, datatable);
    	}
    }

    function _doLineDensify(elem, field, datatable) {
        let peers = getPeers(elem);
        let toReturn, classId;
        for (let p of peers) {
            let lineDS = p.dataScope ? p.dataScope : new DataScope(datatable);
            let ds = datatable.getUniqueAttributeValues(field).map(d => lineDS.cross(field, d));
            ds = ds.filter(d => !d.isEmpty());
            if (ds.length === 1) {
                ds.push(ds[0].clone());
            }

            let args = Object.assign({}, p.styles);
            for (let vs of Vertex.styles) {
                if (p[vs])
                    args[vs] = p[vs];
            }
            //compute vertices
            let x1 = p.vertices[0].x,
                y1 = p.vertices[0].y,
                x2 = p.vertices[1].x,
                y2 = p.vertices[1].y;

            let vertices = [], wd = x2 - x1, ht = y2 - y1;
            for (let i = 0; i < ds.length; i++) {
                vertices.push([x1 + i * wd / (ds.length - 1), y1 + i * ht / (ds.length - 1)]);
            }
            args.vertices = vertices;
            args.type = "path";

            let polyline = createMark(args);
            if (!classId)
                classId = polyline.id;
            polyline._classId = classId;
            polyline.dataScope = lineDS;
            polyline._updateBounds();
    		polyline._refBounds = polyline.bounds.clone();

            let parent = p.parent;
            parent.addChild(polyline);
            parent.removeChild(p);

            for (let [i, v] of polyline.vertices.entries()) {
                if (v.dataScope)
                    v.dataScope = v.dataScope.merge(ds[i]);
                else
                    v.dataScope = ds[i];
            }

            if (p == elem)
                toReturn = polyline;
        }
        return toReturn;
    }

    function _doCircleDensify(elem, attr, datatable, sa, direction) {
        let peers = getPeers(elem),
            attrT = datatable.getAttributeType(attr);
        let toReturn, polygonClassId;
        for (let p of peers) {
            let polygonDS = p.dataScope ? p.dataScope : new DataScope(datatable);
            let ds = datatable.getUniqueAttributeValues(attr).map(d => polygonDS.cross(attr, d));
            ds = attrT == AttributeType.Number? ds : ds.filter(d => !d.isEmpty());
            let numVertices = ds.length;
    		if (numVertices < 3)
    			throw new Error("INSUFFICIENT_DATA_SCOPES");
            let startAngle = sa ? sa : 90, k = 360/numVertices, vertices = [], angle = [],
                dir = direction ? direction : "clockwise";
    		let dirSign = dir == "clockwise" ? -1 : 1;
    		for (let i = 0; i < ds.length; i++){
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
            let newPolygon = createMark(args);
            if (!polygonClassId)
                polygonClassId = newPolygon.id;
            newPolygon._classId = polygonClassId;
            newPolygon.dataScope = polygonDS;

            let parent = p.parent;
            parent.addChild(newPolygon);
            parent.removeChild(p);

            for (let [i, v] of newPolygon.vertices.entries()) {
                v._polarAngle = angle[i];
                if (i >= ds.length) {
                    v.dataScope = polygonDS.merge(ds[ds.length * 2 - 1 - i]);
                }
                else {
                    v.dataScope = polygonDS.merge(ds[i]);
                }
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

    function _doRectDensify(elem, o, attr, datatable) {
        let peers = getPeers(elem);
        let toReturn, orientation = o ? o : LayoutOrientation.HORIZONTAL;
        let areaClassId;
        if (orientation != LayoutOrientation.HORIZONTAL && orientation != LayoutOrientation.VERTICAL)
    		throw new Error("Unknown orientation: " + orientation); 
        for (let p of peers) {
            let attrT = datatable.getAttributeType(attr);
    		let areaDS = p.dataScope ? p.dataScope : new DataScope(datatable);
    		let ds = datatable.getUniqueAttributeValues(attr).map(d => areaDS.cross(attr, d));
            ds = attrT == AttributeType.Number? ds : ds.filter(d => !d.isEmpty());
            if (ds.length === 1) {
    			ds.push(ds[0].clone());
    		}
            if (attrT == AttributeType.Number || attrT == AttributeType.Date) {
    			// sorting ds
    			ds.sort((a, b) => (a._attr2value[attr] > b._attr2value[attr]) ? 1 : -1);
    		}
            let args = Object.assign({}, p.styles);

            //compute vertices
    		let x1 = p.vertices[0].x,
                y1 = p.vertices[0].y,
                x2 = p.vertices[p.vertices.length - 2].x,
                y2 = p.vertices[p.vertices.length - 2].y;

            let vertices = [], wd = x2 - x1, ht = y2 - y1;
            for(let j = 0; j < ds.length; j++) {
                vertices.push(orientation == LayoutOrientation.VERTICAL ? [x2, y1 + j * ht /(ds.length - 1)] : [x1 + j * wd / (ds.length - 1), y1]);
            }
            for(let j = 0; j < ds.length; j++) {
    			vertices.push(orientation == LayoutOrientation.VERTICAL ? [x1, y1 + (ds.length-1-j) * ht /(ds.length - 1)] : [x1 + (ds.length-1-j) * wd / (ds.length - 1), y2]);
    		}
    		args.vertices = vertices;
            args.type = "area";
            // args.vxShape = "circle";
            // args.vxRadius = 2;

            let newArea = createMark(args);
            if (!areaClassId)
                areaClassId = newArea.id;
            newArea._classId = areaClassId;
            newArea.dataScope = areaDS;
            newArea.orientation = orientation;
            newArea.baseline = orientation === LayoutOrientation.HORIZONTAL ? BoundsAnchor.BOTTOM : BoundsAnchor.LEFT;

            let parent = p.parent;
    		parent.addChild(newArea);
    		parent.removeChild(p);

            for (let [i, v] of newArea.vertices.entries()){
    			// two boundary lines are encoded the same; possible to modify later according to the data encoding
    			if (i>=ds.length) {
    				v.dataScope = areaDS.merge(ds[ds.length*2-1-i]);
    			}
    			else {
    				v.dataScope = areaDS.merge(ds[i]);
    			}
    		}

            if (p === elem)
                toReturn = newArea;
        }
        return toReturn;
    }


    function densifiable(elem) {
        if ([ElementType.Line, ElementType.Circle, ElementType.Rect, ElementType.Area].indexOf(elem.type) < 0) {
    		return false;
    	} 
    	if (!elem.dataScope) {
    		return true;
    	} else {
    		let peers = getPeers(elem, elem.scene);
    		for (let p of peers) {
    			if (p.dataScope.numTuples > 1)
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
        STRENGTH: "strength"
    });

    /**
        refer to validateRepeatArguments in action/repeat.js as well as
        _validateEncodeArgs in src/item/group/Scene.js as examples
    */
    function validateEncodeArguments(elem, param) {
        //the elem should have a data scope
        //the param should have an attribute and a channel
        if (!elem || !("channel" in param) || !("attribute" in param)) {
            throw new Error("Incomplete information to do encoding. You must specify an item, a categorical data attribute and a data table");
        }
        //the attribute should be a valid column name in the elem's data scope
        let datatable = getDataTable(elem);
        if (datatable.tree) { 
            let attr = param.attribute;
            if (attr.indexOf(".") > 0 && !datatable.tree.nodeTable.hasAttribute(attr.split(".")[1]) )
                throw new Error("Data attribute does not exist in the data table");
        }
        else if (!datatable || !datatable.hasAttribute(param.attribute)) {
            throw new Error("Data attribute does not exist in the data table");
        }
        //the channel should be a valid channel for the given elem
        if (!Object.values(Channels).includes(param.channel)) {
            throw new Error("Channel Not Supported");
        }

        //TODO: if attribute is nominal, the channel cannot be width or height
    }

    function removeEncoding(enc, scene) {
        delete scene._encodings[getEncodingKey(enc.element)][enc.channel];
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
        if (item.classId) {
            return item.classId;
        } else if (item.type == "vertex" && item.dataScope) { //vertex created from densify
            if (item.parent.type === ElementType.Area) {
                let firstHalf = item.parent.vertices.indexOf(item) < item.parent.vertices.length / 2;
                return item.parent.classId + "_v" + (firstHalf ? 0 : item.parent.vertices.length - 1);
            }

            else
                return item.parent.classId + "_v";
        } else if (item.type == "vertex") { //vertex with index
            return item.parent.classId + "_v" + item.parent.vertices.indexOf(item);
        } else if (item.type == "segment" && item.dataScope) { //segment created from densify
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
        switch (elem.type) {
            case ElementType.Rect:
            case ElementType.Path:
            case ElementType.Line:
            case ElementType.Area:
                translatePath(elem, dx, dy);
                break;
            case ElementType.Group:
            case ElementType.Collection:
            case ElementType.Glyph:
                translateGroup(elem, dx, dy);
                break;
            case "segment":
                translateSegment(elem, dx, dy);
                break;
            default:
                translateMark(elem, dx, dy);
                break;
            
        }
    }

    function translateMark(elem, dx, dy) {
        elem._x += dx;
        elem._y += dy;
        if (elem._refBounds)
            elem._refBounds.translate(dx, dy);
    }

    function translateGroup(elem, dx, dy) {
        for (let child of elem.children) {
            translate(child, dx, dy);
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
        v._x += dx;
    	v._y += dy;
    }

    function setProperty(elem, channel, value) {
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
            default: //styles
                if (elem.type === "vertex") {
                    elem[channel] = value;
                } else {
                    elem.styles[channel] = value;
                }
                break;
        }
    }

    function setInnerRadius(elem, val) {
        elem._innerRadius = val;
        elem.vertices[0]._x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0]._y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[3]._x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3]._y = elem._y - elem._innerRadius * Math.sin(elem._er);
    }

    function setOuterRadius(elem, val) {
        elem._outerRadius = val;
        elem.vertices[1]._x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1]._y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2]._x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2]._y = elem._y - elem._outerRadius * Math.sin(elem._er);
    }

    function setThickness(elem, val) {
        // elem._outerRadius = elem._innerRadius + val;
        // elem.vertices[1]._x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        // elem.vertices[1]._y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        // elem.vertices[2]._x = elem._x + elem._outerRadius * Math.cos(elem._er);
        // elem.vertices[2]._y = elem._y - elem._outerRadius * Math.sin(elem._er);
        setOuterRadius(elem, elem._innerRadius + val);
    }

    function setStartAngle(elem, val) {
        let angle = elem.angle;
        elem._startAngle = val;
        elem._endAngle = normalizeAngle(elem._startAngle + angle);
        elem._sr = degree2radian(elem._startAngle);
        elem._er = degree2radian(elem._endAngle);

        elem.vertices[0]._x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0]._y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[1]._x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1]._y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2]._x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2]._y = elem._y - elem._outerRadius * Math.sin(elem._er);
        elem.vertices[3]._x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3]._y = elem._y - elem._innerRadius * Math.sin(elem._er);
    }

    function setAngleSpan(elem, val) {
        elem._endAngle = normalizeAngle(elem._startAngle + val);
        elem._sr = degree2radian(elem._startAngle);
        elem._er = degree2radian(elem._endAngle);

        elem.vertices[0]._x = elem._x + elem._innerRadius * Math.cos(elem._sr);
        elem.vertices[0]._y = elem._y - elem._innerRadius * Math.sin(elem._sr);
        elem.vertices[1]._x = elem._x + elem._outerRadius * Math.cos(elem._sr);
        elem.vertices[1]._y = elem._y - elem._outerRadius * Math.sin(elem._sr);
        elem.vertices[2]._x = elem._x + elem._outerRadius * Math.cos(elem._er);
        elem.vertices[2]._y = elem._y - elem._outerRadius * Math.sin(elem._er);
        elem.vertices[3]._x = elem._x + elem._innerRadius * Math.cos(elem._er);
        elem.vertices[3]._y = elem._y - elem._innerRadius * Math.sin(elem._er);
        //elem.setAngles(elem.startAngle, normalizeAngle(elem.startAngle + val));
    }

    function setXPosition(elem, val) {
        if (elem.type == "vertex") {
            elem._x = val;
        } else {
            translate(elem, val - elem.x, 0);
        }
    }

    function setYPosition(elem, val) {
        if (elem.type == "vertex") {
            elem._y = val;
        } else {
            translate(elem, 0, val - elem.y);
        }
    }

    function setWidth(elem, val) {
        elem.resize(val, elem.height);
    }

    function setHeight(elem, val) {
        elem.resize(elem.width, val);
    }

    function mapWidth_Area(elems, scale, attrValues) {
        let baseline = elems[0].baseline,
            ori = elems[0].orientation;
        if (ori === LayoutOrientation.VERTICAL) {
            switch (baseline) {
                case "left":
                    for (let area of elems) {
                        // getPeers(area.topLeftVertex, area).forEach(v => console.log(area.refBounds.left, scale.map(attrValues[v.id])))
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "x", area.refBounds.left));
                        getPeers(area.topRightVertex, area).forEach(v => setProperty(v, "x", area.refBounds.left + scale.map(attrValues[v.id])));
                    }
                    break;
                case "right":
                    for (let area of elems) {
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "x", area.refBounds.right - scale.map(attrValues[v.id])));
                        getPeers(area.topRightVertex, area).forEach(v => setProperty(v, "x", area.refBounds.right));
                    }
                    break;
                case "center":
                    console.log("center");
                    for (let area of elems) {
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "x", area.refBounds.center - scale.map(attrValues[v.id])/2));
                        getPeers(area.topRightVertex, area).forEach(v => setProperty(v, "x", area.refBounds.center + scale.map(attrValues[v.id])/2));
                    }
                    break;
            }
        }
    }

    function mapHeight_Area(elems, scale, attrValues) {
        let baseline = elems[0].baseline,
            ori = elems[0].orientation;
        if (ori === LayoutOrientation.HORIZONTAL) {
            switch (baseline) {
                case "bottom":
                    for (let area of elems) {
                        // let topVertices = getPeers(area.topLeftVertex);
                        // for (let v of topVertices) {
                        //     console.log(scale.map(attrValues[v.id]));
                        // }
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.bottom - scale.map(attrValues[v.id])));
                        getPeers(area.bottomLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.bottom));
                    }
                    break;
                case "top":
                    for (let area of elems) {
                        // let btmVertices = getPeers(area.bottomLeftVertex);
                        // for (let v of btmVertices) {
                        //     setProperty(v, "y", area.refBounds.top + scale.map(attrValues[v.id]));
                        // }
                        getPeers(area.bottomLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.top + scale.map(attrValues[v.id])));
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.top));
                    }
                    break;
                case "middle":
                    for (let area of elems) {
                        getPeers(area.topLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.middle - scale.map(attrValues[v.id])/2));
                        getPeers(area.bottomLeftVertex, area).forEach(v => setProperty(v, "y", area.refBounds.middle + scale.map(attrValues[v.id])/2));
                    }
                    break;
            }
        }
    }

    function mapHeight_NegativeValues_Area(elems, scale, attrValues) {
        for (let area of elems) {
            let topVertices = getPeerVertices(area.topLeftVertex, [area]);
            for (let v of topVertices) {
                setProperty(v, "y", area.refBounds.bottom - scale.map(attrValues[v.id]));
            }
            getPeerVertices(area.bottomLeftVertex, [area]).forEach(v => setProperty(v, "y", area.refBounds.bottom - scale.map(0)));
        }
    }


    function mapWidth_NegativeValues_Rect(marks, scale, attrValues) {
        for (let i = 0; i < marks.length; i++) {
            let mk = marks[i], zeroX = mk.refBounds.left + scale.map(0), valueX = mk.refBounds.left + scale.map(attrValues[mk.id]);

            translate(mk.leftSegment, zeroX - mk.leftSegment.x, 0);
            translate(mk.rightSegment, valueX - mk.rightSegment.x, 0);
        }
    }

    function mapHeight_NegativeValues_Rect(marks, scale, attrValues) {
        for (let i = 0; i < marks.length; i++) {
            let mk = marks[i], zeroX = mk.refBounds.bottom - scale.map(0), valueX = mk.refBounds.bottom - scale.map(attrValues[mk.id]);

            translate(mk.bottomSegment, 0, zeroX - mk.bottomSegment.y);
            translate(mk.topSegment, 0, valueX - mk.topSegment.y);
        }
    }

    function mapFillGradient_Area(elems, scale, attrValues, enc) {
        // let vals = Object.values(attrValues),
        //     min = Math.min(...vals),
        //     max = Math.max(...vals);
        for (let area of elems) {
            let data = area.vertices.map(d => attrValues[d.id]),
                min = Math.min(...data),
                max = Math.max(...data);
            let fill = area.orientation === "horizontal" ? new LinearGradient({x1: 0, y1: 100, x2: 0, y2: 0}) : new LinearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
            fill.addStop(0, scale.map(min), 1.0);
            if (enc._mapping) {
                let vals = Object.keys(enc._mapping).map(d => parseFloat(d)).sort();
                for (let v of vals) {
                    if (v > min && v < max) {
                        fill.addStop(100*(v-min)/(max-min), scale.map(v), 1.0);
                    }
                }
            } else if (scale.type === "divergingColor") {
                fill.addStop(100*(-min)/(max-min), scale.map(0), 1.0);
            }

            if (scale.type === "sequentialColor") {
                fill.addStop(100*(-min)/(max-min), scale.map(0), 1.0);
            }
            fill.addStop(100, scale.map(max), 1.0);
            area.fillColor = fill;
        }
    }

    class Rect extends Path {

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

    	resize(wd, ht, xRef, yRef) {
    		if (wd !== this.width) {
    			if (xRef === "right") {
    				//reset right to refBounds right first
    				this.vertices[1]._x = this.refBounds.right;
    				this.vertices[2]._x = this.refBounds.right;
    				this.vertices[0]._x = this.vertices[1]._x - wd;
    				this.vertices[3]._x = this.vertices[0]._x;
    			} else {
    				//reset left to refBounds left first
    				this.vertices[0]._x = this.refBounds.left;
    				this.vertices[3]._x = this.refBounds.left;
    				this.vertices[1]._x = this.vertices[0]._x + wd;
    				this.vertices[2]._x = this.vertices[1]._x;
    			}
    		}
    		if (ht !== this.height) {
    			if (yRef === "top") {
    				//reset top to refBounds top first
    				this.vertices[0]._y = this.refBounds.top;
    				this.vertices[1]._y = this.refBounds.top;
    				this.vertices[3]._y = this.vertices[0]._y + ht;
    				this.vertices[2]._y = this.vertices[3]._y;
    			} else {
    				//reset bottom to refBounds bottom first
    				this.vertices[2]._y = this.refBounds.bottom;
    				this.vertices[3]._y = this.refBounds.bottom;
    				this.vertices[0]._y = this.vertices[3]._y - ht;
    				this.vertices[1]._y = this.vertices[0]._y;
    			}
    		}
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

    class Area extends Path {

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
    			this.segments.push(new Segment(this.vertices[this.vertices.length-1], this.vertices[0], this, this.segmentCounter++));
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
    	}

    	//this._orientation is set during densification
    	get orientation() {
    		return this._orientation;
    	}

    	set orientation(o) {
    		this._orientation = o;
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

    class ScaleVar extends Variable {
        constructor(type, enc) {
            super(type);
            this._encs = [enc];
            this._initialized = false;
        }

        addLinkedEncoding(enc) {
            this._encs.push(enc);
        }

        get encodings() {
            return this._encs;
        }

        get initialized() {
            return this._initialized;
        }

        set initialized(i) {
            this._initialized = i;
        }
    }

    class Trigger {

        constructor(evt, type, element, listener, cumulative) {
            this._event = evt;
            this._type = type;
            this._elem = element;
            this._listener = listener;
            this._cumulative = cumulative;

            this._elements = [];
        }

        get event() {
            return this._event;
        }

        get type() {
            return this._type;
        }

        get element() {
            return this._elem;
        }

        get listener() {
            return this._listener;
        }

        isCumulative() {
            return this._cumulative;
        }

        //run-time variables 
        get elements() {
            return this._elements;
        }

        set elements(t) {
            this._elements = t;
        }

        get mouseEvent() {
            return this._mouseEvent;
        }

        set mouseEvent(v) {
            this._mouseEvent = v;
        }
    }

    function getTriggerID(triggerJSON) {
        switch (triggerJSON.type) {
            case TriggerType.ELEMENT:
                return [triggerJSON.type, triggerJSON.element.classId ? triggerJSON.element.classId : triggerJSON.element.id].join("-");
            case TriggerType.ATTRIBUTE:
                return [triggerJSON.type].join("-");
            case TriggerType.MOUSE:
            default:
                return [triggerJSON.type, triggerJSON.event, triggerJSON.listener ? triggerJSON.listener.id : "scene"].join("-");
        }
    }

    const TriggerType = Object.freeze({
        ELEMENT: "element",
        MOUSE: "mouse",
        ATTRIBUTE: "attribute"
    });

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

        _restoreValues(peers) {
            let channel = this.outputVar.channel;
            peers.forEach((mark) => {
                mark.styles[channel] = this._storedValues[mark.id];
            });
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
                peers = getPeers(outVar.element);
            
            if (scaleVar) { //a visual encoding has been specified
                let enc = scaleVar.encodings.find(d => d.channel == outVar.channel && getEncodingKey(d.element) == getEncodingKey(outVar.element)); 
                    //start = 0;
                for (let scale of enc.scales) {
                    let elems = enc.getElements(scale);
                    // this._doMapping(elems, scale, enc.attrValues.slice(start, start + elems.length));
                    this._doMapping(elems, scale, enc.attrValues, enc);
                    this._updateRefBounds(elems, scale, enc);
                    //start += elems.length;
                }
            } else { //predicate-based encoding 
                this._restoreValues(peers);
            }
            
            let predVars = this._getUsableCondEncodings();
            //for (let pv of predVars)
            if (predVars.length > 0)
                this._doCondEncoding(peers, predVars.map(d => d.condEncoding));

            let elem = ["vertex", "segment"].includes(outVar.element.type) ? outVar.element.parent: outVar.element;
            propagateBoundsUpdate(elem);

        }

        _updateRefBounds(elems, scale, enc) {
            switch (this.outputVar.channel) {
                case "width":
                    elems.forEach(e => {
                        e._refBounds.setWidth(scale.rangeExtent);
                    });
                    break;
                case "height":
                    elems.forEach(e => {
                        e._refBounds.setHeight(scale.rangeExtent);
                    });
                    break;
                case "radius":
                    elems.forEach(e => {
                        e._refBounds.setWidth(scale.rangeExtent * 2, BoundsAnchor.CENTER);
                        e._refBounds.setHeight(scale.rangeExtent * 2, BoundsAnchor.MIDDLE);
                    });
                    break;
                case "x":
                    if (elems[0].type == "vertex" || elems[0].type == "segment") {
                        elems.forEach(e => {
                            let rf = e.parent._refBounds;
                            e.parent._refBounds = new Rectangle(enc.flipScale ? scale.range[1] : scale.range[0], rf.top, 
                                    scale.rangeExtent, rf.height);
                        });
                    }
                    break;
                case "y":
                    if (elems[0].type == "vertex" || elems[0].type == "segment") {
                        elems.forEach(e => {
                            let rf = e.parent._refBounds;
                            e.parent._refBounds = new Rectangle(rf.left, enc.flipScale ? scale.range[0] : scale.range[1],
                                    rf.width, scale.rangeExtent);
                        });
                    }
                    break;
            }
        }

        _doMapping(elems, scale, attrValues, enc) {
            switch (this.outputVar.channel) {
                case "width":
                    if (scale.domain[0] < 0 && elems[0] instanceof Rect)
                        mapWidth_NegativeValues_Rect(elems, scale, attrValues);
                    else if (scale.domain[0] < 0 && elems[0] instanceof Area)
                        ;
                    else if (elems[0].type === ElementType.Area)
                        mapWidth_Area(elems, scale, attrValues);
                    else
                        this._doStandardMapping(elems, scale, attrValues);
                    break;
                case "height":
                    if (scale.domain[0] < 0 && elems[0] instanceof Rect)
                        mapHeight_NegativeValues_Rect(elems, scale, attrValues);
                    else if (scale.domain[0] < 0 && elems[0] instanceof Area)
                        mapHeight_NegativeValues_Area(elems, scale, attrValues);
                    else if (elems[0].type === ElementType.Area)
                        mapHeight_Area(elems, scale, attrValues);
                    else
                        this._doStandardMapping(elems, scale, attrValues);
                    break;
                case 'text':
                    this._doTextMapping(elems, attrValues);
                    break;
                case 'fillGradient':
                    mapFillGradient_Area(elems, scale, attrValues, enc);
                    break;
                case 'angle':
                default:
                    this._doStandardMapping(elems, scale, attrValues);
                    break;
            }
        }

        _doTextMapping(peers, attrValues) {
            let channel = this.outputVar.channel;
            peers.forEach(mark => {
                setProperty(mark, channel, attrValues[mark.id]);
            });
        }

        _doStandardMapping(peers, scale, attrValues) {
            let channel = this.outputVar.channel;
            peers.forEach(mark => {
                let val = scale.map(attrValues[mark.id]);
                setProperty(mark, channel, val);
                if (mark instanceof Path && mark.firstVertex.shape && channel === "strokeColor") {
                    mark.vertices.forEach(v => v.fillColor = val);
                }
            });
        }

        _doCondEncoding(peers, condEncs) {
            for (let elem of peers) {
                let b = condEncs.map(d => d.evalResult[elem.id]).every(d => d  || d === undefined);
                condEncs[0]._efxFn(b, condEncs[0].trigger.elements[0], elem, condEncs[0].trigger.mouseEvent);
            }
        }
        
        // _doCondEncoding2(peers, pv) {
        //     let condEnc = pv.condEncoding; 
        //     console.log(condEnc.trigger.listener.id, Object.values(condEnc.evalResult));
        //     if (condEnc.evalResult && Object.keys(condEnc.evalResult) > 0)
        //         peers.forEach(elem => condEnc._efxFn(condEnc.evalResult[elem.id], condEnc.trigger.elements[0], elem, condEnc.trigger.mouseEvent) );
        //         //channel = this.outputVar.channel;
        //         //accessor = this._getAccessor(peers[0], channel);
        //     // if (condEnc.triggerType === TriggerType.ELEMENT) {
        //     //     peers.forEach((mark) => {
        //     //         let triggerElems = condEnc.triggerElements.length > 0 ? condEnc.triggerElements : [undefined];
        //     //         let tests = triggerElems.map(d => condEnc._targetEval(d, mark));
        //     //         condEnc._efxFn(tests.some(d => d), triggerElems[0], mark, condEnc.mouseEvent);
        //     //     });
        //     // } if (condEnc.triggerType === TriggerType.MOUSE) {
        //     //     peers.forEach((mark) => {
        //     //         let test = condEnc._targetEval(condEnc.mouseEvent, mark);
        //     //         condEnc._efxFn(test, undefined, mark, condEnc.mouseEvent);
        //     //     });
        //     // }
            

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
                    v = condEnc.triggerElement.dataScope.getAttributeValue(val.attribute);
            } else {
                v = val;
            }

            if (["x", "y"].includes(channel) && ("offset" in val)) {
                v += val.offset;
            }
            setProperty(elem, channel, v);
        }

        _getUsableCondEncodings() {
            let condEncVars = this.inputVars.filter(d => d instanceof CondEncodingVar);
            // ,
            //     usableCondEncVars = condEncVars.filter(d => {
            //         if (d.condEncoding.type === CondEncType.TRIGGER_ELEMENT_EXISTS) {
            //             return true; //d.condEncoding.triggerElement !== undefined;
            //         } else if (d.condEncoding.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
            //             for (let p of d.condEncoding.predicates)
            //                 if (!p._value)
            //                     return false;
            //             return true;
            //         }                
            //     });
            return condEncVars; // usableCondEncVars;
        }

    }

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
        BASE_LINE: 'baseline'
    });

    //to move to createElement.js
    function newMarkCreated(m, rt) {
        let b = rt.getVariable(VarType.BOUNDS, m),
            bbox = rt.createOneWayDependency(OpType.EVAL_BBOX);
            //rb = rt.getVariable(VarType.REF_BOUNDS, m),
            //rbbox = rt.createOneWayDependency(OpType.EVAL_REFBOUNDS);
        rt.connect(bbox, b);
        //rt.connect(b, rbbox);
        //rt.connect(rbbox, rb);
        switch (m.type) {
            case ElementType.Circle: 
            case ElementType.Polygon: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    r = rt.getVariable(VarType.CHANNEL, "radius", m),
                    a = rt.getVariable(VarType.CHANNEL, "area", m);
                // bbox = rt.createOneWayDependency(OpType.EVALBBOX, [x, y, r], b);
                rt.connect(r, bbox);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(a, bbox);
                break;
            }
            case ElementType.Area:
            case ElementType.Line:
            case ElementType.BezierCurve:
            case ElementType.Path:
            case ElementType.Image: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    w = rt.getVariable(VarType.CHANNEL, "width", m),
                    h = rt.getVariable(VarType.CHANNEL, "height", m);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(w, bbox);
                rt.connect(h, bbox);
                break;
            }
            case ElementType.Rect: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    w = rt.getVariable(VarType.CHANNEL, "width", m),
                    h = rt.getVariable(VarType.CHANNEL, "height", m),
                    a = rt.getVariable(VarType.CHANNEL, "area", m);
                // bbox = rt.createOneWayDependency(OpType.EVALBBOX, [x, y, r], b);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(w, bbox);
                rt.connect(h, bbox);
                rt.connect(a, bbox);
                break;
            }
            case ElementType.PointText: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    t = rt.getVariable(VarType.CHANNEL, "text", m);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(t, bbox);
                break;
            }
            case ElementType.Ring: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    ir = rt.getVariable(VarType.CHANNEL, "innerRadius", m),
                    or = rt.getVariable(VarType.CHANNEL, "outerRadius", m);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(ir, bbox);
                rt.connect(or, bbox);
                break;
            }
            case ElementType.Pie:
            case ElementType.Arc: {
                let x = rt.getVariable(VarType.CHANNEL, "x", m),
                    y = rt.getVariable(VarType.CHANNEL, "y", m),
                    ir = rt.getVariable(VarType.CHANNEL, "innerRadius", m),
                    or = rt.getVariable(VarType.CHANNEL, "outerRadius", m),
                    sa = rt.getVariable(VarType.CHANNEL, "startAngle", m),
                    ea = rt.getVariable(VarType.CHANNEL, "endAngle", m),
                    av = rt.getVariable(VarType.CHANNEL, "angle", m),
                    tv = rt.getVariable(VarType.CHANNEL, "thickness", m);
                rt.connect(x, bbox);
                rt.connect(y, bbox);
                rt.connect(ir, bbox);
                rt.connect(or, bbox);
                rt.connect(sa, bbox);
                rt.connect(ea, bbox);
                rt.connect(av, bbox);
                rt.connect(tv, bbox);
                break;
            }
        }
        bbox.run();
    }

    function elementRemoved(elem, rt) {
        let varsByType = rt.findVariablesByElement(elem);
        for (let t in varsByType) {
            let vars = varsByType[t];
            for (let v of vars) {
                rt.deleteVariable(v);
            }
        }
    }

    function encodingRemoved(enc, rt) {
        let ev = rt.findVariable(VarType.CHANNEL, [enc.channel, enc.element]);
        if (!ev) console.warn("cannot find encoding to remove from the dep graph");
        let op = ev.incomingDataflow;
        rt.deleteOperator(op);
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

    function refElementRemoved(re, rt) {
        if (re.type === ElementType.Axis) {
            let op = rt.findVariable(VarType.PROPERTY, [Properties.AXIS_PATH_POSITION, re]).incomingDataflow;
            rt.deleteOperator(op);
            op = rt.findVariable(VarType.PROPERTY, [Properties.AXIS_TICKS_POSITION, re]).incomingDataflow;
            rt.deleteOperator(op);
            op = rt.findVariable(VarType.PROPERTY, [Properties.AXIS_LABELS_POSITION, re]).incomingDataflow;
            rt.deleteOperator(op);
        } else if (re.type === ElementType.Gridlines) {
            let op = rt.findVariable(VarType.PROPERTY, [Properties.GRIDLINES_POSITION, re]).incomingDataflow;
            rt.deleteOperator(op);
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

    function newCollectionCreated(coll, rt) {
        //bbox of collection depends on its x, y, wd, ht, as well as its children's bbox
        let b = rt.getVariable(VarType.BOUNDS, coll),
            x = rt.getVariable(VarType.CHANNEL, "x", coll),
            y = rt.getVariable(VarType.CHANNEL, "y", coll),
            w = rt.getVariable(VarType.CHANNEL, "width", coll),
            h = rt.getVariable(VarType.CHANNEL, "height", coll),
            //eb = rt.getVariable(VarType.BOUNDS, elem),
            bbox = rt.createOneWayDependency(OpType.EVAL_BBOX);
        //rt.connect(eb, bbox);
        rt.connect(x, bbox);
        rt.connect(y, bbox);
        rt.connect(w, bbox);
        rt.connect(h, bbox);
        rt.connect(bbox, b);
        bbox.run();
    }

    function newCompositeCreated(cpst, rt) {
        //bbox of collection depends on its x, y, wd, ht, as well as its children's bbox
        let b = rt.getVariable(VarType.BOUNDS, cpst),
            x = rt.getVariable(VarType.CHANNEL, "x", cpst),
            y = rt.getVariable(VarType.CHANNEL, "y", cpst),
            w = rt.getVariable(VarType.CHANNEL, "width", cpst),
            h = rt.getVariable(VarType.CHANNEL, "height", cpst),
            bbox = rt.createOneWayDependency(OpType.EVAL_BBOX);
        rt.connect(x, bbox);
        rt.connect(y, bbox);
        rt.connect(w, bbox);
        rt.connect(h, bbox);
        rt.connect(bbox, b);
        bbox.run();
    }

    function childRemoved(parent, child, rt) {
        //TODO: verify if the following can be deleted
        let pb = rt.getVariable(VarType.BOUNDS, parent),
            cb = rt.getVariable(VarType.BOUNDS, child),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, pb),
            e = cb.outgoingEdges.find(d => d.fromNode === cb && d.toNode === bbox);

        if (e) {
            rt.disconnect(cb, bbox, e);
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
            let cx = rt.getVariable(VarType.CHANNEL, "x", child),
                layoutOp = rt.getIncomingDataflowOperator(getLayoutOpType(parent.layout.type), cx);
            if (layoutOp)
                rt.deleteOperator(layoutOp);
        }
    }

    function parentChildConnected(parent, child, rt) {
        let pb = rt.getVariable(VarType.BOUNDS, parent),
            cb = rt.getVariable(VarType.BOUNDS, child),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, pb);
        rt.connect(cb, bbox);
        rt.connect(bbox, pb);

        if (parent.layout) {
            layoutSpecified(parent, parent.layout, rt);
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

    function newGlyphCreated(g, rt) {
        let gb = rt.getVariable(VarType.BOUNDS, g),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, gb);
        for (let c of g.children) {
            rt.connect(rt.getVariable(VarType.BOUNDS, c), bbox);
        }
        rt.connect(bbox, gb);
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

    function layoutRemoved(group, layout, rt) {
        let ov = rt.getVariable(VarType.ORDER, group),
            eo = rt.getOutgoingDataflowOperator(getLayoutOpType(layout.type), ov);
        rt.deleteOperator(eo);
    }


    function layoutSpecified(group, layout, rt) {
        let type = layout ? layout.type : "none",
            child = type === LayoutType.TREEMAP ? getLeafMarks(group)[0] : LayoutType.STRATA ? group.children[1] : group.children[0];
        if (!child) return;
        let wv = rt.getVariable(VarType.CHANNEL, "width", child),
            hv = rt.getVariable(VarType.CHANNEL, "height", child),
            ov = rt.getVariable(VarType.ORDER, group),
            xv = rt.getVariable(VarType.CHANNEL, "x", child),
            yv = rt.getVariable(VarType.CHANNEL, "y", child);
        let eo = rt.getOutgoingDataflowOperator(getLayoutOpType(type), ov);

        rt.connect(wv, eo);
        rt.connect(hv, eo);
        rt.connect(ov, eo);
        rt.connect(eo, xv);
        rt.connect(eo, yv);
        rt.disconnectChannelVarFromBBoxOperator(wv);
        rt.disconnectChannelVarFromBBoxOperator(hv);
        if (child.type === ElementType.Arc || child.type === ElementType.Pie) {
            let av = rt.getVariable(VarType.CHANNEL, "angle", child),
                tv = rt.getVariable(VarType.CHANNEL, "thickness", child);
            rt.connect(av, eo);
            rt.connect(tv, eo);
        } else if (child.type === ElementType.Circle) {
            let av = rt.getVariable(VarType.CHANNEL, "area", child),
                rv = rt.getVariable(VarType.CHANNEL, "radius", child);
            rt.connect(av, eo);
            rt.connect(rv, eo);
            rt.disconnectChannelVarFromBBoxOperator(av);
            rt.disconnectChannelVarFromBBoxOperator(rv);
        } else if (child.type === ElementType.Rect) {
            let av = rt.getVariable(VarType.CHANNEL, "area", child);        
            rt.connect(av, eo);
            rt.disconnectChannelVarFromBBoxOperator(av);
        }
        eo.run();

        //links
        if (child.links) {
            let link = child.links[0]; //TODO: handle isolated nodes
            let lxv = rt.getVariable(VarType.CHANNEL, "x", link),
                lwv = rt.getVariable(VarType.CHANNEL, "strokeWidth", link),
                lsv = rt.getVariable(VarType.CHANNEL, "strength", link),
                lop = rt.createOneWayDependency(OpType.LINK_PLACER);
            rt.connect(xv, lop);
            rt.connect(lwv, lop);
            rt.connect(lsv, lop);
            rt.connect(lop, lxv);
        }

        // connect grand child's bounding box to the layout operator, doesn't matter if child collection has layout or internal encodings
        if (child.children && child.children[0]) { //&& child.layout
            let eb = rt.getVariable(VarType.BOUNDS, child.children[0]),
                px = rt.getVariable(VarType.CHANNEL, "x", child),
                lo = px.incomingDataflow;
            if (lo)
                rt.connect(eb, lo);
            rt.disconnectChannelVarFromBBoxOperator(eb);
        }
    }

    function interactionSpecified(condEnc, channels, rt) {
        
        //effect = condEnc.rules,
        let elem = condEnc.target,
            pv = rt.getVariable(VarType.COND_ENCODING, condEnc);

        for (let channel of channels) {
            let tv = rt.getVariable(VarType.TRIGGER, condEnc.trigger),
                evalOp = rt.findIncomingDataflowOperator(OpType.TARGET_EVALUATOR, pv);
            if (!evalOp) {
                evalOp = rt.createOneWayDependency(OpType.TARGET_EVALUATOR, condEnc._targetEval);
            }
            rt.connect(tv, evalOp);
            rt.connect(evalOp, pv);
            
            let cv = rt.getVariable(VarType.CHANNEL, channel, elem),
                df = cv.incomingDataflow;            
            if (df && df instanceof Encoder && df.outputVar.channel === channel) {
                rt.connect(pv, df);
            } else if (!df) {
                let eo = rt.createOneWayDependency(OpType.ENCODER);
                rt.connect(pv, eo);
                rt.connect(eo, cv);
                eo.storeValues(elem, channel);
            }
        }
    }


    function encodingSpecified(enc, rt, baseEnc) {
        let attr = enc.attribute,
            channel = enc.channel,
            elem = enc.element;

        let eo = rt.createOneWayDependency(OpType.ENCODER);
        if (["width", "height"].includes(enc.channel) && elem.type === ElementType.Area) {
            let bv = rt.getVariable(VarType.PROPERTY, Properties.BASE_LINE, elem);
            rt.connect(bv, eo);
        }

        //TODO: handle more cases:
        // if (elem.type == "segment" && elem.parent.type == ElementType.Rect) {
            
        // }

        if (baseEnc) {
            let dv = rt.getVariable(VarType.DOMAIN, baseEnc),
                sv = rt.getVariable(VarType.SCALE, baseEnc),
                ecv = rt.getVariable(VarType.CHANNEL, channel, elem);
            //rt.connect(dv, eo);
            rt.connect(sv, eo);
            rt.connect(eo, ecv);

            dv.addLinkedEncoding(enc);
            sv.addLinkedEncoding(enc);

            dv.incomingDataflow.run();
            //rv.incomingDataflow.run();
        } else {
            // Domain Builder Operator
            let fv = rt.getVariable(VarType.ATTRIBUTE, attr, getDataTable(elem)),
                pv = rt.getVariable(VarType.PROPERTY, Properties.INCLUDE_ZERO, enc),
                dv = rt.getVariable(VarType.DOMAIN, enc),
                dsv = rt.getVariable(VarType.DATASCOPE, elem),
                db = rt.createOneWayDependency(OpType.DOMAIN_BUILDER);
            rt.connect(fv, db);
            rt.connect(pv, db);
            rt.connect(dsv, db);
            rt.connect(db, dv);
            db.run();

            // Scale Builder Operator
            let cv = rt.getVariable(VarType.PROPERTY, Properties.RANGE_START, enc),
                rev = rt.getVariable(VarType.PROPERTY, Properties.RANGE_EXTENT, enc),
                fsv = rt.getVariable(VarType.PROPERTY, Properties.FLIP_SCALE, enc),
                sv = rt.getVariable(VarType.SCALE, enc),
                sb = rt.createOneWayDependency(OpType.SCALE_BUILDER);
            rt.connect(cv, sb);
            rt.connect(rev, sb);
            rt.connect(fsv, sb);
            rt.connect(dv, sb);
            rt.connect(sb, sv);
            sb.run();

            //TODO: check if an encoder has already been created based on predicate-based encoding triggered by interaction
            let ecv = rt.getVariable(VarType.CHANNEL, channel, elem);
            //rt.connect(dv, eo);
            rt.connect(sv, eo);
            rt.connect(eo, ecv);
            eo.run();
        }
    }

    function affixationSpecified(affx, rt) {
        let ec = rt.getVariable(VarType.CHANNEL, affx.channel, affx.element),
            bc = rt.getVariable(VarType.CHANNEL, affx.channel, affx.base),
            av = rt.getVariable(VarType.AFFIXATION, affx),
            op = rt.createOneWayDependency(OpType.AFFIXER);
        rt.connect(bc, op);
        rt.connect(av, op);
        rt.connect(op, ec);
        op.run();
    }

    function alignmentSpecified(aln, rt) {
        //TODO: check if the elements can be aligned
        let op = rt.createMultiWayDependency(OpType.ALIGNER),
            av = rt.getVariable(VarType.ALIGNMENT, aln);
        rt.connect(av, op);
        for (let elem of aln.elements) {
            let v = rt.getVariable(VarType.CHANNEL, aln.channel, elem);
            rt.connect(v, op);
        }
        op.run();
    }

    function layoutAxisSpecified(axis, rt) {
        let ov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_ORIENTATION, axis),
            cv = rt.getVariable(VarType.BOUNDS, axis.elements[0].parent),
            pv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis),
            pp = rt.createOneWayDependency(OpType.AXIS_PATH_PLACER);
        //TODO: axis path position also depends on the layout parameters
        rt.connect(ov, pp);
        rt.connect(cv, pp);
        rt.connect(pp, pv);
        pp.run();

        let tov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_OFFSET, axis),
            tsv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_SIZE, axis),
            tp = rt.createOneWayDependency(OpType.AXIS_TICKS_PLACER),
            tpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICKS_POSITION, axis);
        rt.connect(pv, tp);
        rt.connect(tov, tp);
        rt.connect(tsv, tp);
        rt.connect(tp, tpv);
        tp.run();

        let lov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_OFFSET, axis),
            lfv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_FORMAT, axis),
            afv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_FONT_SIZE, axis),
            lp = rt.createOneWayDependency(OpType.AXIS_LABELS_PLACER),
            lpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABELS_POSITION, axis);
        rt.connect(pv, lp);
        rt.connect(lov, lp);
        rt.connect(lfv, lp);
        rt.connect(afv, lp);
        rt.connect(lp, lpv);
        lp.run();

        let tlpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TITLE_POSITION, axis),
            tlp = rt.createOneWayDependency(OpType.AXIS_TITLE_PLACER);
        rt.connect(pv, tlp);
        rt.connect(tlp, tlpv);
        tlp.run();

        let ab = rt.getVariable(VarType.BOUNDS, axis),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, ab);
        rt.connect(tpv, bbox);
        rt.connect(lpv, bbox);
        rt.connect(bbox, ab);
    }

    function legendSpecified(legend, rt) {
        let lbv = rt.getVariable(VarType.BOUNDS, legend),
            lpv = rt.getVariable(VarType.PROPERTY, Properties.LEGEND_POSITION, legend),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, lbv);
        rt.connect(lpv, bbox);
        rt.connect(bbox, lbv);
    }

    function encodingAxisCreated(axis, rt) {
        let ov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_ORIENTATION, axis),
            cv = rt.getVariable(VarType.BOUNDS, getTopLevelCollection(axis.elements[0])),
            pv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis),
            pp = rt.createOneWayDependency(OpType.AXIS_PATH_PLACER);
        //TODO: axis path position also depends on the scale range, e.g., scatter plot starting from 0
        rt.connect(ov, pp);
        rt.connect(cv, pp);
        rt.connect(pp, pv);
        pp.run();

        let tov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_OFFSET, axis),
            tsv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICK_SIZE, axis),
            tp = rt.createOneWayDependency(OpType.AXIS_TICKS_PLACER),
            tpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TICKS_POSITION, axis);
        rt.connect(pv, tp);
        rt.connect(tov, tp);
        rt.connect(tsv, tp);
        rt.connect(tp, tpv);
        tp.run();

        let lov = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_OFFSET, axis),
            lfv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABEL_FORMAT, axis),
            afv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_FONT_SIZE, axis),
            lp = rt.createOneWayDependency(OpType.AXIS_LABELS_PLACER),
            lpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_LABELS_POSITION, axis);
        rt.connect(pv, lp);
        rt.connect(lov, lp);
        rt.connect(lfv, lp);
        rt.connect(afv, lp);
        rt.connect(lp, lpv);
        lp.run();

        let tlpv = rt.getVariable(VarType.PROPERTY, Properties.AXIS_TITLE_POSITION, axis),
            tlp = rt.createOneWayDependency(OpType.AXIS_TITLE_PLACER);
        rt.connect(pv, tlp);
        rt.connect(tlp, tlpv);
        tlp.run();

        let ab = rt.getVariable(VarType.BOUNDS, axis),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, ab);
        rt.connect(tpv, bbox);
        rt.connect(lpv, bbox);
        rt.connect(bbox, ab);
    }

    function gridlinesCreated(gl, rt) {
        let cv = rt.getVariable(VarType.BOUNDS, getTopLevelCollection(gl.elements[0])),
            pv = rt.getVariable(VarType.PROPERTY, Properties.GRIDLINES_POSITION, gl),
            pp = rt.createOneWayDependency(OpType.GRIDLINES_PLACER);

        rt.connect(cv, pp);
        rt.connect(pp, pv);
        pp.run();

        let gb = rt.getVariable(VarType.BOUNDS, gl),
            bbox = rt.getIncomingDataflowOperator(OpType.EVAL_BBOX, gb);
        rt.connect(pv, bbox);
        rt.connect(bbox, gb);
    }

    function binningSpecified(attr, newAttr, tbl, outTbl, rt) {
        let ds = rt.getVariable(VarType.ATTRIBUTE, attr, tbl),
            nds = rt.getVariable(VarType.ATTRIBUTE, newAttr, outTbl),
            dt = rt.createOneWayDependency(OpType.BIN_TRANSFORMER);
        rt.connect(ds, dt);
        rt.connect(dt, nds);
        dt.run();
    }

    function kdeSpecified(attr, newAttr, tbl, outTbl, args, rt) {
        let ds = rt.getVariable(VarType.ATTRIBUTE, attr, tbl),
            nds = rt.getVariable(VarType.ATTRIBUTE, newAttr, outTbl),
            dt = rt.createOneWayDependency(OpType.KDE_TRANSFORMER);
        //TODO: handle kde args properly
        dt.args = args;
        rt.connect(ds, dt);
        rt.connect(dt, nds);
        dt.run();
    }

    function filteringSpecified(predicate, inTbl, outTbl, rt) {
        let inV = rt.getVariable(VarType.ITEMS, undefined, inTbl),
            outV = rt.getVariable(VarType.ITEMS, predicate, outTbl),
            op = rt.createOneWayDependency(OpType.FILTER_TRANSFORMER);
        rt.connect(inV, op);
        rt.connect(op, outV);
        op.run();
    }

    /**
    * Same as group in graphical design tools 
    **/

    class Group {
    	
    	constructor() {
    		this._id = this.type + generateUniqueID();
    		this._type = ElementType.Group;
    		this._dataScope = undefined;
    		this._bounds = undefined;
    		this._layout = undefined;
    		this._children = [];
    		this._sortBy = {};
    	}

    	get id() {
    		return this._id;
    	}

        get type() {
            return this._type;
        }

    	// set id(id) {
    	// 	if (this.type === ElementType.Scene || !this.getScene())
    	// 		this._id = id;
    	// 	else {
    	// 		delete this.getScene()._itemMap[this._id];
    	// 		this._id = id;
    	// 		this.getScene()._itemMap[id] = this;
    	// 	}
    	// }

    	contains(x, y) {
    		// if (!this._bounds) {
    		// 	this._updateBounds();
    		// }
    		return this.bounds.contains(x, y);
    	}

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
    		if (this.children.indexOf(c) >= 0) return;
    		if (c.parent)
    			c.parent.removeChild(c);
    		this.children.push(c);
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
    		return this._dataScope;
    	}

    	set dataScope(ds) {
    		this._dataScope = ds;
    		if (ds === undefined) {
    			for (let c of this.children) {
    				c.dataScope = ds;
    			}
    		} else {
    			for (let c of this.children) {
    				if (c.dataScope)
    					c.dataScope = c.dataScope.merge(ds);
    				else
    					c.dataScope = ds;
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
    		let left = Math.min(...cRefBounds.map(d => d.left)), top = Math.min(...cRefBounds.map(d => d.top)),
    			right = Math.max(...cRefBounds.map(d => d.right)), bottom = Math.max(...cRefBounds.map(d => d.bottom));
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
    	// 	let type = this.children[0].dataScope.getAttributeType(attribute);
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
    	// 				f = (a, b) => order.indexOf(a.dataScope.getAttributeValue(attribute)) - order.indexOf(b.dataScope.getAttributeValue(attribute));
    	// 			else
    	// 				f = (a, b) =>  (a.dataScope.getAttributeValue(attribute) < b.dataScope.getAttributeValue(attribute) ? -1 : 1 );
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

    	get scene() {
            return getScene(this);
        }
    }

    class Collection extends Group {

        constructor() {
            super();
            this._type = ElementType.Collection;
            this._id = this.type + "_" + generateUniqueID();
            this._classId = this.id;
            this._childrenOrder = undefined;
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
        //     if (!this.dataScope.dataTable.hasAttribute(attr)) {
        //         console.warn("Cannot order collection children by an non-existent attribute", o.attribute);
        //         return;
        //     }
        //     this._childrenOrder = o;
        //     let f;
        //     if (attr === MSCRowID) {
        //         f = (a, b) => parseInt(a.dataScope.getAttributeValue(attr).substring(1)) - parseInt(b.dataScope.getAttributeValue(attr).substring(1));
        //     } else {
        //         let type = this.children[0].dataScope.getAttributeType(attr);
        //         switch (type) {
        //             case AttributeType.Date:
        //                 break;
        //             case AttributeType.Number:
        //             case AttributeType.Integer:
        //                 f = (a, b) => a.dataScope.aggregateNumericalAttribute(attr) - b.dataScope.aggregateNumericalAttribute(attr);
        //                 break;
        //             case AttributeType.String:
        //                 if (o.ranking)
        //                     f = (a, b) => o.ranking.indexOf(a.dataScope.getAttributeValue(attr)) - o.ranking.indexOf(b.dataScope.getAttributeValue(attr));
        //                 else
        //                     f = (a, b) => (a.dataScope.getAttributeValue(attr) < b.dataScope.getAttributeValue(attr) ? -1 : 1);
        //                 break;
        //         }
        //     }
        //     this.children.sort(f);

        //     if (o.direction == "desc")
        //         this.children.reverse();
        //     if (this.layout)
        //         this.layout.run();
        // }

        contains(x, y) {
            let irregular2Ds = [ElementType.Arc, ElementType.Pie, ElementType.Polygon, ElementType.Area];
            if (irregular2Ds.indexOf(this.firstChild.type) >= 0) {
                let svgData = this.getSVGPathData();
                if (svgData !== "") {
                    let ctx = CanvasProvider$1.getContext(),
                        p = new Path2D(svgData);
                    ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
                    ctx.stroke(p);
                    return ctx.isPointInPath(p, x, y);
                }
            }
            // if (!this._bounds) {
            //     this._updateBounds();
            // }
            return this._bounds.contains(x, y);
        }

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
    }

    class Glyph extends Group {

        constructor(args) {
            super();
            this._type = ElementType.Glyph;
            this._id = this.type + "_" + generateUniqueID();
            this._classId = this._id;
            if (args){
    			for (let a of args){
    				this.addChild(a);
    			}
    		}
        }

        get classId() {
            return this._classId;
        }

    }

    class BezierCurve extends Path {

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

        // set x(xin) { 
        //     this._x = xin;
        //     this._updateBounds();
        // }

        // set y(yin) { 
        //     this._y = yin;
        //     this._updateBounds();
        // }
        
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
        }

        get width() {
            return this._width;
        }

        set width(w) {
            this._width = w;
            this._updateBounds();
        }

        get height() {
            return this._height;
        }

        set height(h) {
            this._height = h;
            this._updateBounds();
        }

        get x() {
            return this._x;
        }

        set x(v) {
            this._x = v;
            this._updateBounds();
        }

        get y() {
            return this._y;
        }

        set y(v) {
            this._y = v;
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
    		
    		if (this._dataScope)
    			target._dataScope = this._dataScope.clone();
    		
            target.x = this._x;
            target.y = this._y;
            target.width = this._width;
            target.height = this._height;
            target.src = this._src;
    	}
    }

    class Line extends Path {

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
            this.vertices[0]._x += dx;
            this.vertices[1]._x += dx;
        }

        set y(v) {
            let dy = v - this.y;
            this.vertices[0]._y += dy;
            this.vertices[1]._y += dy;
        }
    }

    class PointText extends Mark {

        constructor(args) {
            super(args);
            this._type = ElementType.PointText;
            
            this._x = "x" in args ? args.x : 0;
            this._y = "y" in args ? args.y : 0;
            this._text = "text" in args ? args.text : "",
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
                let minX = Math.min(...rotatedCorners.map(c => c.x));
                let maxX = Math.max(...rotatedCorners.map(c => c.x));
                let minY = Math.min(...rotatedCorners.map(c => c.y));
                let maxY = Math.max(...rotatedCorners.map(c => c.y));

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

        get text() {
            return this._text;
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
    		if (this._dataScope)
    			target._dataScope = this._dataScope.clone();
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
        let context = CanvasProvider.getContext();
        context.font = font;
        let metrics = context.measureText(text);

        if (metrics.fontBoundingBoxAscent) {
            return { width: metrics.width, height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent };
        }
        else if (metrics.actualBoundingBoxAscent) {
            return { width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
        }
        else {
            return { width: metrics.width, height: fontSize };
        }
    }

    class Polygon extends Path {

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

        copyPropertiesTo(target) {
    		super.copyPropertiesTo(target);
    		target._x = this._x;
    		target._y = this._y;
    		target._radius = this._radius;
    	}
    }

    class Ring extends Path {

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
            case ElementType.PointText: {
                m = new PointText(args);
                break;
            }
            case ElementType.Image:
                m = new Image(args);
                break;
            case ElementType.BundledPath:
            case ElementType.Path:
                m = new Path(args);
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

    function createCollection(scene) {
        let c = new Collection();
        scene.addChild(c);
        scene._itemMap[c.id] = c;
        return c;
    }

    function createGlyph(args) {
        let g = new Glyph(args);
        return g;
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

        if (mark.dataScope) {
            m._dataScope = mark.dataScope.clone();
        }

        if (mark.vertices) {
            for (let i = 0; i < mark.vertices.length; i++) {
                if (mark.vertices[i].dataScope) {
                    m.vertices[i]._dataScope = mark.vertices[i].dataScope.clone(); 
                }
            }
        }
        
        return m;
    }

    function duplicateCollection(collection) {
        let coll = createCollection(collection.scene);
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
        return coll;
    }

    function duplicateGlyph(glyph) {
        let g = new Glyph();
        for (let c of glyph.children){
            g.addChild(duplicate(c));
        }

        g._classId = glyph.classId;
        if (glyph._dataScope) {
            g.dataScope = glyph._dataScope.clone();
        }
        return g;
    }

    const PrimitiveMarks = Object.freeze({
        Rect: "rect",
        Circle: "circle",
        Line: "line",
        Ring: "ring",
        Path: "path",
        Image: "image",
        PointText: "text",
        Arc: "arc",
        BezierCurve: "bezierCurve",
        BundledPath: "bundledPath",
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
        Line: "line",
        Path: "path",
        Image: "image",
        PointText: "text",
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
        TreeData: "treedata"
    });

    const refElementTypes = Object.freeze({
        Axis: "axis",
        Legend: "legend",
        Gridlines: "gridlines"
    });

    function generateUniqueID() {
        return Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
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
            //remember the original date values after parsing them
            this._dateMap = new Map();
            this._attributes = Object.keys(this.data[0]);
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
                this._addAttribute(MSCRowID, AttributeType.String, this.data.map((d, i) => "r" + i));
            }
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

        getEncodableAttributes(channel) {
            switch (channel) {
                case "x":
                case "y":
                case "width":
                case "height":
                case "radius":
                case "fillColor":
                case "strokeColor":
                case "text":
                    return this.numericAttributes.concat(this.nonNumericAttributes);
                case "area":
                case "strokeWidth":
                default:
                    return this.numericAttributes;
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

        _addAttribute(name, type, values) {
            this._data.forEach((d, i) => d[name] = values[i]);
            if (name !== MSCRowID)
                this._rawData.forEach((d, i) => d[name] = values[i]);
            //this._rawData = JSON.parse(JSON.stringify(this._data));
            this._attrTypes[name] = type;
            this._attributes.push(name);
            this._attrSummaries[name] = summarize(values, type);
        }

        getAttributeType(f) {
            return this._attrTypes[f];
        }

        get attributes() {
            return this._attributes;
        }

        getAttributeSummary(attr) {
            return this._attrSummaries[attr];
        }

        getAttributeValues(attr) {
            return this.data.map(d => d[attr]);
        }

        getUniqueAttributeValues(f) {
            return this._attrSummaries[f].unique;
        }

        orderAttributeValues(attr, vals) {
            this._attrSummaries[attr].unique = vals;
        }

        getRowCount() {
            return this.data.length;
        }

        hasAttribute(attr) {
            return this._attributes.indexOf(attr) >= 0;
        }

        //date values are parsed and stored as number of milliseconds
        parseAttributeAsDate(attr, format) {
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
        }

        //TODO: need to return the true raw value from the input file
        getRawValue(col, v) {
            if (this.getAttributeType(col) === AttributeType.Date)
                return this._dateMap.get(v).toString();
            else
                return v;
        }

        get nonNumericAttributes() {
            let r = [];
            for (let f in this._attrTypes) {
                if (this._attrTypes[f] != AttributeType.Number && this._attrTypes[f] != AttributeType.Integer && f != DataTable.RowID) {
                    r.push(f);
                }
            }
            r.sort((a, b) => this.getUniqueAttributeValues(a).length - this.getUniqueAttributeValues(b).length);
            return r;
        }

        get numericAttributes() {
            let r = [];
            for (let f in this._attrTypes) {
                if ((this._attrTypes[f] === AttributeType.Number || this._attrTypes[f] === AttributeType.Integer) && f != DataTable.RowID) {
                    r.push(f);
                }
            }
            return r;
        }

        getAttributesByType(t) {
            let r = [];
            for (let f in this._attrTypes) {
                if ((this._attrTypes[f] === t) && f != DataTable.RowID) {
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
                                if (Number.isInteger(v)) { //year
                                    realv = (new Date(v, 0)).getTime();
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

    function getDataTable(elem) {
        let ds = getUsableDataScope(elem);
        if (ds) return ds.dataTable;
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
                tables[c.dataScope.dataTable.id] = c.dataScope.dataTable;
                break;
            } else if (c.children && c.children.length > 0) {
                let itm = c.firstChild;
                while (itm) {
                    if (itm.dataScope) {
                        tables[itm.dataScope.dataTable.id] = itm.dataScope.dataTable;
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

    }

    class AttributeVar extends Variable {
        constructor(type, attr, dataset) {
            super(type);
            this._attribute = attr;
            this._dataset = dataset;
        }

        get attribute() {
            return this._attribute;
        }

        get dataset() {
            return this._dataset;
        }
    }

    /**
     * domain of a scale
     */
    class DomainVar extends Variable {
        constructor(type, binding) {
            super(type);
            this._encs = [binding];
            //this._attrValues = [];
        }

        addLinkedEncoding(enc) {
            this._encs.push(enc);
        }

        get encodings() {
            return this._encs;
        }

        // get attrValues() {
        //     return this._attrValues;
        // }

        // set attrValues(v) {
        //     this._attrValues = v;
        // }
    }

    class DomainBuilder extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let outVar = this.outputVar,
                baseEnc = outVar.encodings[0],
                inputAttrVar = this.inputVars.find(d => d instanceof AttributeVar);
            let attribute = inputAttrVar.attribute,
                attrType = outVar.encodings[0].dataTable.getAttributeType(outVar.encodings[0].attribute);
            
            let allValues = [];
            for (let enc of outVar.encodings) {
                let attrValues = this._computeAttrValues(enc, attrType); 
                allValues = allValues.concat(attrValues);
            }

            if (baseEnc.channel === "angle" && [ElementType.Arc, ElementType.Pie].indexOf(baseEnc.element.type)) {
                for (let enc of outVar.encodings) {
                    for (let scale of enc.scales) {
                        let vals = enc.getElements(scale).map(d => enc.attrValues[d.id]);
                        scale.domain = baseEnc._preferredDomain ? baseEnc._preferredDomain : 
                                            enc.dataTable.tree ? [0, Math.max(...vals)] : 
                                                this._getDomainForNumbers(vals);
                        console.log("domain for", attribute, scale.domain);
                    }
                }
            } else {
                let domain;
                if (attrType == AttributeType.String) {
                    domain = this._getDomainForStrings(allValues);
                } else if (outVar.encodings[0].channel === "text") {
                    domain = this._getDomainForStrings(allValues);
                } else {
                    domain = this._getDomainForNumbers(allValues);
                }
        
                for (let enc of outVar.encodings) {
                    for (let scale of enc.scales) {
                        scale.domain = baseEnc._preferredDomain ? baseEnc._preferredDomain : domain.slice();
                    }
                }
                console.log("domain for", attribute, domain);
            }
                    
        }

        _getDomainForNumbers(elemVals) {
            let outVar = this.outputVar,
                baseEnc = outVar.encodings[0];

            let domain = [Math.min(...elemVals), Math.max(...elemVals)];

            if (baseEnc.includeZero && domain[0] > 0) {
                domain = [0, Math.max(...elemVals)];
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

        _computeAttrValues(enc, attrType) {
            let elems = getPeers(enc.element),
                // dataScopes = .map(d => getUsableDataScope(d)),
                attrValues = {}; //attrValues is a dict so that we can freely sort the elements in a collection and look up their corresponding values when encoding
            
            if (enc.element.type === ElementType.Area && ["width", "height", "fillGradient"].indexOf(enc.channel) >= 0) {
                for (let elem of elems) {
                    for (let v of elem.vertices)
                        attrValues[v.id] = getUsableDataScope(v).aggregateNumericalAttribute(enc.attribute, enc.aggregator);
                }
            } else {
                switch (attrType) {
                    case AttributeType.Boolean:
                        break;
        
                    case AttributeType.Date:
                        for (let elem of elems) {
                            attrValues[elem.id] = getUsableDataScope(elem).getAttributeValue(enc.attribute);
                            // console.log(elem.id, getUsableDataScope(elem).numTuples);
                        }
                        //attrValues = dataScopes.map(d => d.getAttributeValue(enc.attribute));
                        break;
        
                    case AttributeType.String:
                        try {
                            if (enc.aggregator == "count") {
                                //attrValues = dataScopes.map(d => d.getAttributeValues(enc.attribute).length);
                                for (let elem of elems) {
                                    attrValues[elem.id] = getUsableDataScope(elem).getAttributeValues(enc.attribute).length;
                                }
                            } else {
                                // attrValues = dataScopes.map(d => d.getAttributeValue(enc.attribute));
                                for (let elem of elems) {
                                    attrValues[elem.id] = getUsableDataScope(elem).getAttributeValue(enc.attribute);
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
                                let nodeId = getUsableDataScope(elem).getAttributeValue(s);
                                attrValues[elem.id] = (new DataScope(dt)).cross(MSCNodeID, nodeId).getAttributeValue(f);
                            }
                        } else {
                            for (let elem of elems) {
                                attrValues[elem.id] = getUsableDataScope(elem).aggregateNumericalAttribute(enc.attribute, enc.aggregator);
                            }
                        }
                        break;
                }
            }

            enc.attrValues = attrValues;
            return Object.values(attrValues);
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
    }

    function createScale(enc) {
        if (enc.scaleType) {
            return new Scale(enc.scaleType);
        }
        if (enc.channel === "text") {
            return new Scale("ordinal");
        }
        let fType = getDataTable(enc.element).getAttributeType(enc.attribute);
        switch (fType) {
            case AttributeType.Boolean:
                break;
            case AttributeType.Date:
                return new Scale("time");
            case AttributeType.String:
                if (enc.aggregator == "count")
                    return new Scale("linear");
                else if (enc.channel.indexOf("Color") >= 0) {
                    let args = {};
                    args.scheme = enc.colorScheme ? enc.colorScheme : "schemeCategory10";
                    return new Scale("ordinalColor", args);
                }
                else {
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
    //     let fType = getDataTable(elem).getAttributeType(attr);
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
    //     switch (table.getAttributeType(attr)) {
    //         case AttributeType.Boolean:
    //             break;

    //         case AttributeType.Date:
    //             return dataScopes.map(d => d.getAttributeValue(attr));

    //         case AttributeType.String:
    //             try {
    //                 return dataScopes.map(d => d.getAttributeValue(attr));
    //             } catch (error) {
    //                 throw new Error("Cannot bind " + this.channel + " to " + attr + " : " + error);
    //             }

    //         default: //integer or number
    //             return dataScopes.map(d => d.aggregateNumericalAttribute(attr, this.aggregator));
    //     }
    // }

    class ScaleBuilder extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();

            let scaleVar = this.outputVar,
                encodings = scaleVar.encodings,
                baseEnc = encodings[0],
                channel = baseEnc.channel;
            
            for (let i = 0; i < baseEnc.scales.length; i++) {
                let scale = baseEnc.scales[i],
                    elems = baseEnc.getElements(scale),
                    range = this._buildRange(channel, elems, baseEnc, scaleVar);
                if (range) {
                    for (let enc of encodings) {
                        enc.scales[i].range = range;
                    }
                }
                console.log("range", baseEnc.scales[i].range);
            }
            
            scaleVar.initialized = true;
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

        _buildXRange(elems, baseEnc, scaleVar) {
            let left, rangeExtent, scaleType = baseEnc.scales[0].type;
            switch (elems[0].type) {
                case "vertex":
                case "segment":
                    var b = elems[0].parent.refBounds ? elems[0].parent.refBounds : elems[0].parent.bounds;
                    left = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : b.left;
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.width;
                    break;
                default:
                    left = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : 
                            scaleType === "point" ? getTopLevelCollection(elems[0]).bounds.left + elems[0].bounds.width/2 : getTopLevelCollection(elems[0]).bounds.left;
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : 450;
                    break;
            }
            return baseEnc.flipScale ? [left + rangeExtent, left] : [left, left + rangeExtent];
        }

        _buildYRange(elems, baseEnc, scaleVar) {
            let top, rangeExtent, scaleType = baseEnc.scales[0].type;
            switch (elems[0].type) {
                case "vertex":
                case "segment":
                    var b = elems[0].parent.refBounds ? elems[0].parent.refBounds : elems[0].parent.bounds;
                    top = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : b.top;
                    rangeExtent = scaleVar.initialized ? baseEnc.getRangeExtent(elems[0]) : baseEnc._preferredRangeExtent ? baseEnc._preferredRangeExtent : b.height;
                    break;
                default:
                    top = scaleVar.initialized ? baseEnc.getRangeStart(elems[0]) : 
                        scaleType === "point" ? getTopLevelCollection(elems[0]).bounds.top + elems[0].bounds.height/2 : getTopLevelCollection(elems[0]).bounds.top;
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

    class Axis extends Group {

        constructor(args){
            super();
            this._type = ElementType.Axis;
            this._id = this._type + generateUniqueID();

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

            this._title = new PointText({"text": this._titleText, fillColor: this._textColor, fontWeight: "bold"});
            this._title._id = this.id + "_title";
            this.addChild(this._title);
            if (!this._showTitle)
                this._title.visibility = "hidden";

            /**
             * x-axis: y
             * y-axis: x
             */
            this._pathPos = undefined;
        }

        get pathPos() {
            return this._pathPos;
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

        get tickValues() {
            return this._tickValues;
        }

        get labelValues() {
            return this._labelValues;
        }

        get titleOffset() {
            return this._titleOffset;
        }

        get boundsWithoutTitle() {
            let children = this.children.filter(d => d.type !== ElementType.PointText);
            let b = children[0].bounds.clone();
            for (let i = 1; i < children.length; i++) {
                if (children[i].visibility == "hidden")
                    continue;
                b = b.union(children[i].bounds);
            }

            return b;
        }
    }

    const AxisOrientation = {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right"
    };

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

            this._titleText = "title" in args ? args["title"] : this._encoding.attribute;
            
            this._path = this._channel === "angle" ? new Circle({"strokeColor": this._strokeColor, "id": this._id + "_path"}) : 
                         new Path({"strokeColor": this._strokeColor, "id": this._id + "_path"});
            if (!this._pathVisible)
                this._path.visibility = "hidden";
            this.addChild(this._path);

            this.createTicksLabels(args);

            if (encoding.dataTable.getAttributeType(this._attribute) === AttributeType.Date && !("labelFormat" in args)) {
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
                let t = new Path({"strokeColor": this._strokeColor, "id": this._id + "_tick" + i});
                if (!this._tickVisible)
                    t.visibility = "hidden";
                this._ticks.addChild(t);
            }

            this._labels.removeAll();
            let formatter, attrType = this._encoding.dataTable.getAttributeType(this._attribute);

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
                let t = new PointText({"text": formatter(v), fontSize: this._fontSize, fillColor: this._textColor, "id": this._id + "_label" + i});
                this._labels.addChild(t);
            }

            this._title._text = this._titleText;
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
                         new Path({"strokeColor": this._strokeColor, "id": this._id + "_path"});
            if (!this._pathVisible)
                this._path.visibility = "hidden";
            this.addChild(this._path);


            this.createTicksLabels(args);

            if (this._elems[0].dataScope.dataTable.getAttributeType(this._attribute) === AttributeType.Date && !("labelFormat" in args)) {
                this._labelFormat = "%m/%d/%y";
            }
        }

        // get collection() {
        //     return this._coll;
        // }

        get elements() {
            //return this._elems;
            if (this.layout.type === LayoutType.CLUSTER) {
                const map = new Map(this._elems.map(d => [d.dataScope.getAttributeValue(MSCNodeID), d] ));
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
                this._tickValues = this.elements.map(d => d.dataScope.getAttributeValue(this._labelAttribute ? this._labelAttribute : this._attribute));
                this._labelValues = this._tickValues;
            }
            
            this._ticks.removeAll();
            for (let i = 0; i < this._tickValues.length; i++) {
                let t = new Path({"strokeColor": this._strokeColor, "id": this._id + "_tick" + i});
                if (!this._tickVisible)
                    t.visibility = "hidden";
                this._ticks.addChild(t);
            }

            this._labels.removeAll();
            let formatter, attrType = this._elems[0].dataScope.dataTable.getAttributeType(this._labelAttribute ? this._labelAttribute : this._attribute);
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
                let t = new PointText({"text": formatter(v), fontSize: this._fontSize, fillColor: this._textColor, "id": this._id + "_label" + i});
                this._labels.addChild(t);
            }

            this._title._text = this._titleText;
        }
    }

    class AxisPathPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let oriVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_ORIENTATION);
            let axis = oriVar.element;
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
                axis._path._setVertices(vertices);
            } else if (channel === "y") {
                let x = axis.orientation === AxisOrientation.LEFT ? collBounds.left - margin: collBounds.right + margin;
                axis._pathPos = axis._posArg ? axis._posArg : x;
                vertices.push([axis._pathPos, collBounds.top]);
                vertices.push([axis._pathPos, collBounds.bottom]);
                axis._path._setVertices(vertices);
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
                stack = axis.elements[0].parent.layout && axis.elements[0].parent.layout.type == LayoutType.STACK,
                collBounds = stack ? unionBounds(axis.elements) : unionRefBounds(axis.elements),
                margin = 2,
                //coll = collBoundsVar.element,
                vertices = [];
            if (channel === "x") {
                let y = axis.orientation === AxisOrientation.TOP ? collBounds.top - margin : collBounds.bottom + margin;
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
                let x = axis.orientation === AxisOrientation.LEFT ? collBounds.left - margin : collBounds.right + margin;
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
            axis._path._setVertices(vertices);   
        }

    }

    class AxisTicksPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let pathPosVar = this.inputVars.find(d => d instanceof PropertyVar && d.property == Properties.AXIS_PATH_POSITION);

            let axis = pathPosVar.element;
            if (axis instanceof EncodingAxis)
                this._runForEncoding(axis);
            else if (axis instanceof LayoutAxis)
                this._runForLayout(axis);

            for (let l of axis._ticks.children) {
                l._updateBounds();
            }
            propagateBoundsUpdate(axis._ticks);
            //axis._ticks._updateBounds();
        }

        _runForLayout(axis) {
            let channel = axis.channel;
            if (channel == "x") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.tickOffset : axis.pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    let xPos = axis.elements[i].bounds[axis.tickAnchor];
                    t._setVertices([
                        [xPos, baseline],
                        [xPos, baseline + end]
                    ]);
                }
            } else if (channel === "y") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis.pathPos - axis.tickOffset : axis.pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    let yPos = axis.elements[i].bounds[axis.tickAnchor];
                    t._setVertices([
                        [baseline, yPos],
                        [baseline + end, yPos]
                    ]);
                }
            } else if (channel === "angle") {
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    let leaves = layout._d3Root.leaves();
                    const map = new Map(leaves.map(d => [d.data[MSCNodeID], [d.x, d.y]]));
                    for (let [i, t] of axis._ticks.children.entries()) {
                        let id = axis.elements[i].dataScope.getAttributeValue(MSCNodeID);
                        let angle = radian2degree(map.get(id)[0]) - 90;
                        t._setVertices([
                            [layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2, layout.y],
                            [layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2 + axis.tickSize, layout.y]
                        ]);
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
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.tickOffset : axis.pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t._setVertices([
                        [axis.scale.map(axis._tickValues[i]), baseline],
                        [axis.scale.map(axis._tickValues[i]), baseline + end]
                    ]);
                }
            } else if (channel == "width") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.tickOffset : axis.pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize;
                let reverse = axis.isFlipped() || (axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "right") ? true : false;
                if (reverse) {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t._setVertices([
                            [collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis._tickValues[i]), baseline],
                            [collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis._tickValues[i]), baseline + end]
                        ]);
                    }
                } else {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t._setVertices([
                            [axis.scale.map(axis._tickValues[i]) + collBounds.left, baseline],
                            [axis.scale.map(axis._tickValues[i]) + collBounds.left, baseline + end]
                        ]);
                    }
                }
            } else if (channel === "y") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis.pathPos - axis.tickOffset : axis.pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t._setVertices([
                        [baseline, axis.scale.map(axis._tickValues[i])],
                        [baseline + end, axis.scale.map(axis._tickValues[i])]
                    ]);
                }
            } else if (channel === "height") {
                let baseline = axis.orientation == AxisOrientation.LEFT ? axis.pathPos - axis.tickOffset : axis.pathPos + axis.tickOffset,
                    end = axis.orientation == AxisOrientation.LEFT ? -axis.tickSize : axis.tickSize;
                let reverse = axis.isFlipped() || (axis.elements[0].type === ElementType.Area && axis.elements[0].baseline === "top") ? true : false;
                if (reverse) {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        t._setVertices([
                            [baseline, collBounds.top + axis.scale.map(axis._tickValues[i])],
                            [baseline + end, collBounds.top + axis.scale.map(axis._tickValues[i])]
                        ]);
                    }
                } else {
                    for (let [i, t] of axis._ticks.children.entries()) {
                        let y = collBounds.bottom - axis.scale.map(axis._tickValues[i]);
                        t._setVertices([
                            [baseline, y],
                            [baseline + end, y]
                        ]);
                    }
                }
            } else if (channel === "radialDistance") {
                let baseline = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.tickOffset : axis.pathPos - axis.tickOffset,
                    end = axis.orientation == AxisOrientation.BOTTOM ? axis.tickSize : -axis.tickSize,
                    pg = axis.elements[0].parent;
                for (let [i, t] of axis._ticks.children.entries()) {
                    t._setVertices([
                        [pg.x + axis.scale.map(axis._tickValues[i]), baseline],
                        [pg.x + axis.scale.map(axis._tickValues[i]), baseline + end]
                    ]);
                }
            }
        }

    }

    class AxisLabelsPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
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
                    l._x = b[axis.tickAnchor];
                    l._y = axis.pathPos + offset;
                    //l._y = useAxisPos ? axis.pathPos + offset : y + offset;
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
                    l._x = axis.pathPos + offset;
                    // l._x = useAxisPos ? axis.pathPos + offset : x + offset;
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
                        let id = axis.elements[i].dataScope.getAttributeValue(MSCNodeID);
                        
                        //console.log(map.get(id));
                        if (map.get(id)[0] < Math.PI) {
                            let angle = radian2degree(map.get(id)[0]) - 90;
                            l._anchor = [BoundsAnchor.LEFT, BoundsAnchor.MIDDLE];
                            l._x = layout.x + map.get(id)[1] + axis.elements[i].bounds.width/2 + gap;
                            l._y = layout.y;
                            l._rotate = [angle, layout.x, layout.y];
                        } else {
                            let angle = radian2degree(map.get(id)[0]) + 90;
                            l._anchor = [BoundsAnchor.RIGHT, BoundsAnchor.MIDDLE];
                            l._x = layout.x - map.get(id)[1] - axis.elements[i].bounds.width/2 - gap;
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
                    //     let id = elem.dataScope.getAttributeValue(MSCNodeID);
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
                    l._x = axis.scale.map(axis.labelValues[i]);
                    l._y = axis.pathPos + offset;
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
                    l._x = reverse ? collBounds.left + axis.scale.rangeExtent - axis.scale.map(axis.labelValues[i]) : axis.scale.map(axis.labelValues[i]) + collBounds.left;
                    l._y = axis.pathPos + offset;
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
                    l._x = axis.pathPos + offset;
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
                    l._x = axis.pathPos + offset;
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
                    l._x = pg.x + axis.scale.map(axis.labelValues[i]);
                    l._y = axis.pathPos + offset;
                    l._anchor = anchor;
                    if (axis._labelRotation) {
                        l._rotate = [axis._labelRotation, l.x, l.y];
                        l._anchor = [BoundsAnchor.RIGHT, anchor[1]];
                    }
                }

            } 
        }
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
    			this.fillGrid(group, layout);
    			this.computeCellBounds(group, layout);
    			this.placeElements(group, layout);
    		}

    		let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
    		//propagateBoundsUpdate(elem);
        }

        placeElements(group, layout) {
    		let xEncs = getEncodingsInGridCell(group, "x"),
    			yEncs = getEncodingsInGridCell(group, "y");
            for (let i = 0; i < group.children.length; i++) {
                let c = group.children[i];
                let gridBound = layout.cellBounds[i];
                // let dx = gridBound.left - c.bounds.left,
                //     dy = gridBound.top - c.bounds.top;
                // translate(c, dx, dy);
                // c._updateBounds();
                //TODO: check if c's position is bound to data, alignment in cell if c's position is not bound to data
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
    			
                translate(c, cdx, cdy);
            }

    		// if (xEncs.length > 0 && xEncs[0].scales.length > 1) {
    		// 	for (let scale of xEncs[0].scales) {
    		// 		let elem = xEncs[0].getElements(scale)[0],
    		// 			idx = layout.getIndex(elem),
    		// 			left = scale.type === "point" ? layout.cellBounds[idx].left + yEncs[0].getElements(scale)[0].bounds.width/2 : layout.cellBounds[idx].left,
    		// 			right = left + scale.rangeExtent;
    		// 		scale.range = scale.range[0] < scale.range[1] ? [left, right] : [right, left]; 
    		// 	}
    		// }

    		if (xEncs.length > 0) {
    			for (let xEnc of xEncs) {
    				for (let scale of xEnc.scales) {
    					let elem = xEnc.getElements(scale)[0],
    						idx = layout.getIndex(elem);
    					if (idx < 0) continue;
    					let left = scale.type === "point" ? layout.cellBounds[idx].left + elem.bounds.width/2 : layout.cellBounds[idx].left,
    						right = left + scale.rangeExtent;
    					scale.range = scale.range[0] < scale.range[1] ? [left, right] : [right, left]; 
    					//console.log(idx, layout.cellBounds[idx].left, scale.range);
    				}
    			}
    		}

    		if (yEncs.length > 0) {
    			for (let yEnc of yEncs) {
    				for (let scale of yEnc.scales) {
    					let elem = yEnc.getElements(scale)[0],
    						idx = layout.getIndex(elem);
    					if (idx < 0) continue;
    					let top = scale.type === "point" ? layout.cellBounds[idx].top + yEnc.getElements(scale)[0].bounds.height/2 : layout.cellBounds[idx].top,
    						btm = top + scale.rangeExtent;
    					scale.range = scale.range[0] < scale.range[1] ? [top, btm] : [btm, top]; 
    				}
    			}
    		}

    		// if (yEncs.length > 0 && yEncs[0].scales.length > 1) {
    		// 	for (let scale of yEncs[0].scales) {
    		// 		let elem = yEncs[0].getElements(scale)[0],
    		// 			idx = layout.getIndex(elem),
    		// 			top = scale.type === "point" ? layout.cellBounds[idx].top + yEncs[0].getElements(scale)[0].bounds.height/2 : layout.cellBounds[idx].top,
    		// 			btm = top + scale.rangeExtent;
    		// 		scale.range = scale.range[0] < scale.range[1] ? [top, btm] : [btm, top]; 
    		// 	}
    		// }
        }

    	fillGrid(group, layout) {
    		// let numCols, numRows;
    		// if (layout._numRows) {
    		// 	numRows = layout._numRows;
    		// 	numCols = Math.ceil(group.children.length/layout._numRows);
    		// } else if (layout._numCols) {
    		// 	numCols = layout._numCols;
    		// 	numRows = Math.ceil(group.children.length/layout._numCols);
    		// }
    		layout._grid = new Array(layout.numRows).fill(null).map(() => new Array(layout.numCols).fill(null));
    		for (let i = 0; i < group.children.length; i++) {
                let p = layout.getRowCol(i);
                layout._grid[p.row][p.col] = i;
            }
    	}

    	// _getPosition(index, layout, numRows, numCols) {
    	// 	let row, col;
        //     switch (layout._direction) {
        //         case GridFillDirection.RowFirst:
        //             row = Math.floor(index / numCols);
        //             col = index % numCols;
        //             break;
        //         case GridFillDirection.ColumnFirst:
        //             row = index % numRows;
        //             col = Math.floor(index / numRows);
        //             break;
        //         default:
        //             throw new Error("Invalid fill direction. Use 'row_first' or 'column_first'.");
        //     }

        //     // Adjust row and column based on the start corner
        //     if (layout._start.toLowerCase().includes('bottom')) {
        //         row = numRows - 1 - row;
        //     }
        //     if (layout._start.toLowerCase().includes('right')) {
        //         col = numCols - 1 - col;
        //     }

        //     return { row, col };
    	// }

    	computeCellBounds(group, layout) {
    		let bounds = group.children.map(d => d.refBounds ? d.refBounds : d.bounds),
    			colGap = layout._colGap, rowGap = layout._rowGap;

    		if (layout._left === undefined) {
    			let lefts = bounds.map(d => d.left),
    				tops = bounds.map(d => d.top);
    			layout._left = Math.min(...lefts);
    			layout._top = Math.min(...tops);
    		}

    		let wds = bounds.map(d => d.width),
    			hts = bounds.map(d => d.height),
    			cellWidth = Math.max(...wds), 
    			cellHeight = Math.max(...hts);
    		//cell size should be determined by the scale range extent if bound to data
    		let leftOffset = 0; //, topOffset = 0;
    		layout._cellBounds = new Array(group.children.length).fill(null);

    		for (let r = 0; r < layout.numRows; r++) {
    			for (let c = 0; c < layout.numCols; c++) {
    				let idx = layout._grid[r][c];
    				if (idx >= group.children.length) continue;
    				layout._cellBounds[idx] = new Rectangle(layout._left + (cellWidth + colGap) * c + leftOffset, 
    				layout._top + (cellHeight + rowGap) * r, cellWidth, cellHeight);
    			}
    		}
    	}

        // computeCellBounds2(group, layout) {
    	// 	let numCols, numRows, colGap = layout._colGap, rowGap = layout._rowGap;
    	// 	if (layout._numRows) {
    	// 		numRows = layout._numRows;
    	// 		numCols = Math.ceil(layout.group.children.length/layout._numRows);
    	// 	} else if (layout._numCols) {
    	// 		numCols = layout._numCols;
    	// 		numRows = Math.ceil(layout.group.children.length/layout._numCols);
    	// 	}

    	// 	let bounds = group.children.map(d => d.refBounds ? d.refBounds : d.bounds);

    	// 	if (layout._left === undefined) {
    	// 		let lefts = bounds.map(d => d.left),
    	// 			tops = bounds.map(d => d.top);
    	// 		layout._left = Math.min(...lefts);
    	// 		layout._top = Math.min(...tops);
    	// 	}

    	// 	let wds = bounds.map(d => d.width),
    	// 		hts = bounds.map(d => d.height),
    	// 		cellWidth = Math.max(...wds), 
    	// 		cellHeight = Math.max(...hts);
    	// 	//cell size should be determined by the scale range extent if bound to data
    	// 	let leftOffset = 0; //, topOffset = 0;
    		
    	// 	// let xEncs = group.getInternalEncodings("x"),
    	// 	// 	yEncs = group.getInternalEncodings("y"),
    	// 	// 	wdEncs = group.getInternalEncodings("width"),
    	// 	// 	htEncs = group.getInternalEncodings("height");
    	// 	// if (xEncs.length > 0) {
    	// 	// 	let xEnc = xEncs[xEncs.length -1];
    	// 	// 	let cw = xEnc.scale.rangeExtent;
    	// 	// 	leftOffset = xEnc.scale.range[0];
    	// 	// 	// if (xEnc.scale.type === "point") {
    	// 	// 	// 	//TODO: need to handle variable sizes
    	// 	// 	// 	cw += xEnc.anyItem.bounds.width;
    	// 	// 	// }
    	// 	// 	cellWidth = Math.max(cw, cellWidth);
    	// 	// } else if (wdEncs.length > 0 && wdEncs[wdEncs.length -1]._rectNegativeValues) { //width encoding with negative values
    	// 	// 	cellWidth = wdEncs[wdEncs.length -1].scale.rangeExtent;
    	// 	// 	leftOffset = wdEncs[wdEncs.length -1].scale.range[0];
    	// 	// }
    	// 	// if (yEncs.length > 0) {
    	// 	// 	let yEnc = yEncs[yEncs.length -1];
    	// 	// 	let ch = yEnc.scale.rangeExtent;
    	// 	// 	// if (yEnc.scale.type === "point") {
    	// 	// 	// 	//TODO: need to handle variable sizes
    	// 	// 	// 	ch += yEnc.anyItem.bounds.height;
    	// 	// 	// }
    	// 	// 	cellHeight = Math.max(ch, cellHeight);
    	// 	// } else if (htEncs.length > 0 &&  htEncs[htEncs.length -1]._rectNegativeValues) { //width encoding with negative values
    	// 	// 	cellHeight = htEncs[htEncs.length -1].scale.rangeExtent;
    	// 	// }

    	// 	let cb = [], cellCount = numRows * numCols;

    	// 	switch (layout._dir[0]) {
    	// 		case GridDirection.Left2Right:
    	// 			switch (layout._dir[1]) {
    	// 				case GridDirection.Top2Bottom:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(layout._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
    	// 							layout._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 				case GridDirection.Bottom2Top: 
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(layout._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
    	// 							layout._top + (layout.numRows - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 			}
    	// 			break;	
    	// 		case GridDirection.Right2Left:
    	// 			switch (layout._dir[1]) {
    	// 				case GridDirection.Top2Bottom:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left + (numCols - 1) * (cellWidth + colGap) - (cellWidth + colGap) * (i%numCols),
    	// 							layout._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 				case GridDirection.Bottom2Top: {
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left + (numCols - 1 - i%numCols) * (cellWidth + colGap),
    	// 							layout._top + (layout.numRows - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 				}
    	// 			}
    	// 			break;
    	// 		case GridDirection.Top2Bottom:
    	// 			switch (layout._dir[1]) {
    	// 				case GridDirection.Left2Right:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left + (cellWidth + colGap) * Math.floor(i/layout.numRows),
    	// 							layout._top + (cellHeight + rowGap) * (i%layout.numRows), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 				case GridDirection.Right2Left:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left + (cellWidth + colGap) * (layout.numCols - 1) - (cellWidth + colGap) * Math.floor(i/layout.numRows),
    	// 							layout._top + (cellHeight + rowGap) * (i%layout.numRows), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 			}
    	// 			break;
    	// 		case GridDirection.Bottom2Top:
    	// 			switch (layout._dir[1]) {
    	// 				case GridDirection.Left2Right:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left + (cellWidth + colGap) * Math.floor(i/layout.numRows),
    	// 							layout._top + (cellHeight + rowGap) * (layout.numRows - 1) - (cellHeight + rowGap) * (i%layout.numRows), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 				case GridDirection.Right2Left:
    	// 					for (let i = 0; i < cellCount; i++) {
    	// 						cb.push(new Rectangle(leftOffset + layout._left +  (cellWidth + colGap) * (layout.numCols - 1) - (cellWidth + colGap) * Math.floor(i/layout.numRows),
    	// 							layout._top + (cellHeight + rowGap) * (layout.numRows - 1) - (cellHeight + rowGap) * (i%layout.numRows), cellWidth, cellHeight));
    	// 					}
    	// 					break;
    	// 			}
    	// 			break;
    	// 	}

    	// 	layout._cellBounds = cb;
    	// 	//console.log("cellbounds", layout.group.id, cb[0].left);
    	// }
    }

    class GridlinesPlacer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let gl = this.outputVar.element;
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
        }

        _runForEncoding(gl) {
            let channel = gl.channel,
                collBounds = unionRefBounds(gl.elements),
                lines = [];
            if (channel === "x") {
                for (let v of gl.values) {
                    lines.push({x1: gl.scale.map(v), y1: collBounds.bottom,
                        x2: gl.scale.map(v), y2: collBounds.top});
                }
            } else if (channel === "width") {
                for (let v of gl.values) {
                    lines.push({x1: gl.scale.map(v) + collBounds.left, y1: collBounds.bottom,
                        x2: gl.scale.map(v) + collBounds.left, y2: collBounds.top});
                }
            } else if (channel === 'y') {
                for (let v of gl.values) {
                    lines.push({x1: collBounds.left, y1: gl.scale.map(v),
                        x2: collBounds.right, y2: gl.scale.map(v)});
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
    					setProperty(c, "startAngle", temp);
    					startAngle = temp;
    				}
    			} else {
    				for (let c of group.children) {
    					let temp = normalizeAngle(startAngle + c.angle);
    					//c.adjustAngle(startAngle, temp);
    					setProperty(c, "startAngle", temp);
    					startAngle = temp;
    				}
    			}
    		} else if (layout.orientation === LayoutOrientation.RADIAL) {
    			//TODO: stack arc radially 
    			let r = Math.min(...group.children.map(d => d.innerRadius));
    			for (let c of group.children) {
    				let t = c.outerRadius - c.innerRadius;
    				setProperty(c, "innerRadius", r);
    				setProperty(c, "outerRadius", r + t);
    				r = c._outerRadius;
    			}
    		}
    	}

    	_stackAreasVert(group, layout) {
    		let areas = group.children, gb = group.bounds, 
    			start = layout.vertCellAlignment === BoundsAnchor.TOP ? gb.top : gb.bottom,
    			dir = layout.vertCellAlignment === BoundsAnchor.TOP ? 1 : -1;
    		let vCnt = areas[0].vertices.length/2,
    			cumuHts = new Array(vCnt).fill(0);
    		for (let area of areas) {
    			for (let i = 0; i < vCnt; i++) {
    				let v1 = area.vertices[i],
    					v2 = area.vertices[vCnt*2 - i - 1],
    					ht = Math.abs(v1.y - v2.y);
    				let y1 = start + cumuHts[i] * dir, y2 = start + (cumuHts[i] + ht) * dir;
    				translate(v1, 0, y1 - v1.y);
    				translate(v2, 0, y2 - v2.y);
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
    					translate(v1, 0, b - gb.bottom);
    					translate(v2, 0, b - gb.bottom);
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
    		let left = layout._left == undefined ? Math.min(...lefts) : layout._left,
    			top = layout._top == undefined ? Math.min(...tops) : layout._top;
    		
    		let maxWd = Math.max(...wds), maxHt = Math.max(...hts);
    		if (o == LayoutOrientation.VERTICAL) {
    			//let centerX = left + maxWd/2;
    			for (let i = 0; i < group.children.length; i++) {
    				let c = group.children[i]; 
    				let dx = 0, //centerX - c.bounds.x,
    					dy = top + c.bounds.height/2 - c.bounds.y;
    				top += c.bounds.height + layout._gap;
    				translate(c, dx, dy);
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
    				translate(c, cdx, cdy);
    			}
    		} else {
    			//let centerY = top + maxHt/2;
    			for (let i = 0; i < group.children.length; i++) {
    				let c = group.children[i]; 
    				let dx = left + c.bounds.width/2 - c.bounds.x,
    					dy = 0;// centerY - c.bounds.y;
    				left += c.bounds.width + layout._gap;
    				translate(c, dx, dy);
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
    				translate(c, cdx, cdy);
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
            let attrVar = this.inputVars[0],
                newAttrVar = this.outputVar;
            let attr = attrVar.attribute, newAttr = newAttrVar.attribute, inTbl = attrVar.dataset, outTbl = newAttrVar.dataset;

            let vals = inTbl.getAttributeValues(attr), 
                d3Bins = d3__namespace.bin()(vals);

            //category names are the average value in each bin
            let findBin = this._findBin,
                categories = vals.map(d => {
                let b = findBin(d, d3Bins);
                return (b["x0"] + b["x1"])/2 + '';
            });

            let binsInOrder = d3Bins.map(b => (b["x0"] + b["x1"])/2 + '');

            outTbl._addAttribute(newAttr, AttributeType.String, categories);
            outTbl.orderAttributeValues(newAttr, binsInOrder);
        }

        _findBin(v, bins) {
            for (let b of bins) {
                if (b.indexOf(v) >= 0)
                    return b;
            }
        }
    }

    class FilterTransformer extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            let outItemsVar = this.outputVar,
                outTbl = outItemsVar.dataset, 
                predicate = outItemsVar.predicate;

            let toRemove = [];
            for (let [i, row] of outTbl.data.entries()) {
                if (!predicate.testTuple(row))
                    toRemove.push(i);
            }

            toRemove.sort((a, b) => b - a);

            toRemove.forEach(index => {
                if (index >= 0 && index < outTbl.data.length) {
                    outTbl._data.splice(index, 1);
                    outTbl._rawData.splice(index, 1);
                }
            });

            for (let f of outTbl._attributes) {
                outTbl._attrSummaries[f] = summarize(outTbl.data.map(d => d[f]), outTbl._attrTypes[f]);
            }
        }

    }

    class ItemsVar extends Variable {

        constructor(type, predicate, dataset) {
            super(type);
            this._dataset = dataset;
            this._predicate = predicate;
        }

        get dataset() {
            return this._dataset;
        }

        get predicate() {
            return this._predicate;
        }

        // addPredicate(p) {
        //     this._predicates.push(p);
        // }

    }

    class OrderVar extends Variable {

        constructor(type, element) {
            super(type);
            this._group = element;
        }

        get element() {
            return this._group;
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
                eAnchor = affx.elementAnchor,
                bAnchor = affx.baseAnchor,
                channel = affx.channel,
                offset = affx.offset,
                baseElems = getPeers(baseElem),
                elems = getPeers(elem);
            
            if (channel === "radialDistance") {
                this._handleRadialDistance(elems, baseElems, eAnchor, bAnchor, offset);
            } else if (channel === "angle") {
                this._handleAngle(elems, baseElems, eAnchor, bAnchor, offset);
            } else {
                this._handleXY(channel, elems, baseElems, eAnchor, bAnchor, offset);
            }

            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);

        }

        _handleAngle(elems, baseElems, eAnchor, bAnchor, offset) {
            for (let i = 0; i < elems.length; i++) {
                let angle, base = baseElems[i], item = elems[i];
                if (base.type == ElementType.Arc) {
                    angle = bAnchor == "left" ? base.endAngle + offset : bAnchor == "center" ?  base.startAngle + base.angle/2 + offset : base.startAngle + offset;
                } else {
                    angle = 90;
                }
                
                if (item._rotate) {
                    item._rotate[0] = 90 - angle;
                } else {
                    translate(item, base.x - item.bounds[eAnchor], base.y - elems[i].y );
                    item._rotate = [90 - angle, baseElems[i].x, baseElems[i].y];
                }
            }
        }

        _handleRadialDistance(elems, baseElems, eAnchor, bAnchor, offset) {
            for (let i = 0; i < elems.length; i++) {
                let dist, base = baseElems[i], item = elems[i];
                if (base.type == ElementType.Arc || base.type == ElementType.Ring)
                    dist = bAnchor == "top" ? base.outerRadius + offset : bAnchor == "bottom" ? base.innerRadius + offset : (base.outerRadius + base.innerRadius)/2 + offset;
                else if (base.type == ElementType.Circle)
                    dist = bAnchor == "top" ? base.radius + offset : bAnchor == "bottom" ? offset : base.radius/2 + offset;
                translate(item, base.x - item.x, base.y - dist - item.bounds[eAnchor] );
                if (item._rotate) {
                    item._rotate = [item._rotate[0], base.x, base.y];
                } else {
                    item._rotate = [0, base.x, base.y];
                }
            }
        }

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

                if (elems[0].type === ElementType.PointText) {
                    elem.anchor[channel == "x" ? 0 : 1] = eAnchor;
                    setProperty(elem, channel, p);
                } else {
                    if (channel == "x")
                        translate(elem, p - elem.bounds[eAnchor], 0);
                    else
                        translate(elem, 0, p - elem.bounds[eAnchor]);
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
                min = ("min" in args) ? args.min : inTbl.getAttributeSummary(attr).min,
                max = ("max" in args) ? args.max : inTbl.getAttributeSummary(attr).max;
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
            fTypes[attr] = inTbl.getAttributeType(attr);
            fTypes[newAttr] = AttributeType.Number;
            if (args.groupBy) {
                for (let c of args.groupBy) {
                    fTypes[c] = inTbl.getAttributeType(c);
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
                    translate(itm, dx, dy);
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
            //super.run();
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
                axis._title._x = (axis.scale.range[0] + axis.scale.range[1])/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.titleOffset : axis.pathPos - axis.titleOffset;
            } else if (channel == "width") {
                axis._title._x = collBounds.left + axis.scale.rangeExtent/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.titleOffset : axis.pathPos - axis.titleOffset;
            } else if (channel === "y") {
                if (axis._rotateYTitle) {
                    axis._title._x = axis.orientation == AxisOrientation.LEFT ? axis.pathPos - axis.titleOffset : axis.pathPos + axis.titleOffset;
                    axis._title._y = (axis.scale.range[0] + axis.scale.range[1])/2; // - collBounds.width/2 - axis.titleOffset;
                    axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, axis._title._x, axis._title._y] : [90, axis._title._x, axis._title._y];
                } else {
                    axis._title._x = axis.orientation == AxisOrientation.LEFT ? axis.pathPos - axis.titleOffset : axis.pathPos + axis.titleOffset;
                    axis._title._y = Math.min(axis.scale.range[0], axis.scale.range[1]) - 25;
                    axis._title._rotate = undefined;
                }
            } else if (channel === "height") {
                axis._title._x = collBounds.center;
                axis._title._y = (collBounds.top + collBounds.bottom)/2 - collBounds.width/2 - axis.titleOffset;
                axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, collBounds.center, collBounds.middle] : [90, collBounds.center, collBounds.middle];
            } else if (channel === "radialDistance") {
                let pg = axis.elements[0].parent;
                axis._title._x = pg.x + axis.scale.rangeExtent/2;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.titleOffset : axis.pathPos - axis.titleOffset;
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
                axis._title._x = collBounds.center;
                axis._title._y = axis.orientation == AxisOrientation.BOTTOM ? axis.pathPos + axis.titleOffset : axis.pathPos - axis.titleOffset;
            } else if (channel === "y") {
                axis._title._x = collBounds.center;
                axis._title._y = collBounds.middle - collBounds.width/2 - axis.titleOffset;
                axis._title._rotate = axis.orientation == AxisOrientation.LEFT ? [-90, collBounds.center, collBounds.middle] : [90, collBounds.center, collBounds.middle];
            } else if (channel === "angle") {
                let layout = axis.elements[0].parent.layout;
                if (layout.type === LayoutType.CLUSTER) {
                    axis._title._x = layout.x;
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
                baseline = Math.min(...elems.map(d => d.bounds[anchor]));
            else if (anchor == BoundsAnchor.BOTTOM || anchor == BoundsAnchor.RIGHT)
                baseline = Math.max(...elems.map(d => d.bounds[anchor]));
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
                    translate(t, dx, dy);
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
                    translate(nodeMark, dx, dy);
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
                setProperty(link, "startAngle", sa);
                setProperty(link, "angle", Math.abs(ea - sa));
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
                        sid = source.dataScope.getAttributeValue(MSCNodeID), tid = target.dataScope.getAttributeValue(MSCNodeID);
                    let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                        tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                    link._d = translateSVGPath(line({source: sLeaf, target: tLeaf}), layout.x, layout.y);
                }
            } else if (layout.orientation === LayoutOrientation.VERTICAL) {
                const line = d3__namespace.linkVertical().x(d => d.x).y(d => d.y);
                for (let link of links) {
                    let source = link.source, target = link.target,
                        sid = source.dataScope.getAttributeValue(MSCNodeID), tid = target.dataScope.getAttributeValue(MSCNodeID);
                    let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                        tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                    link._d = translateSVGPath(line({source: sLeaf, target: tLeaf}), layout.left - layout._x0, layout.top);
                }
            } else if (layout.orientation === LayoutOrientation.HORIZONTAL) {
                const line = d3__namespace.linkHorizontal().x(d => d.y).y(d => d.x);
                for (let link of links) {
                    let source = link.source, target = link.target,
                        sid = source.dataScope.getAttributeValue(MSCNodeID), tid = target.dataScope.getAttributeValue(MSCNodeID);
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

            //sort links
            if (layout.spreadLinks) {
                if (layout.direction === "LR" || layout.direction === "RL") {
                    links.sort((a, b) => getPolarAngle(a.target.bounds.x, a.target.bounds.y, a.source.bounds.x, a.source.bounds.y) - getPolarAngle(b.target.bounds.x, b.target.bounds.y, b.source.bounds.x, b.source.bounds.y));
                } else {
                    links.sort((a, b) => getPolarAngle(b.target.bounds.x, b.target.bounds.y, b.source.bounds.x, b.source.bounds.y) - getPolarAngle(a.target.bounds.x, a.target.bounds.y, a.source.bounds.x, a.source.bounds.y));
                }
            }

            for (let link of links) {
                let source = link.source, target = link.target;
                let x1, y1, x2, y2;
                if (layout.spreadLinks) {
                    if (layout.direction === "LR" || layout.direction === "RL") {
                        x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0];
                        x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0];
                        y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1] - totalOutLinkWidth[source.id]/2 + cumulativeOutLinkWidth[source.id] + link.strokeWidth/2;
                        y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1] - totalInLinkWidth[target.id]/2 + cumulativeInLinkWidth[target.id] + link.strokeWidth/2;
                        cumulativeOutLinkWidth[source.id] += link.strokeWidth;
                        cumulativeInLinkWidth[target.id] += link.strokeWidth;
                    } else {
                        y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1];
                        y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1];
                        x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0] - totalOutLinkWidth[source.id]/2 + cumulativeOutLinkWidth[source.id] + link.strokeWidth/2;
                        x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0] - totalInLinkWidth[target.id]/2 + cumulativeInLinkWidth[target.id] + link.strokeWidth/2;
                        cumulativeOutLinkWidth[source.id] += link.strokeWidth;
                        cumulativeInLinkWidth[target.id] += link.strokeWidth;
                    }
                } else {
                    x1 = source.bounds[link.sourceAnchor[0]] + link.sourceOffset[0];
                    y1 = source.bounds[link.sourceAnchor[1]] + link.sourceOffset[1];
                    x2 = target.bounds[link.targetAnchor[0]] + link.targetOffset[0];
                    y2 = target.bounds[link.targetAnchor[1]] + link.targetOffset[1];
                }

                if (link.orientation === LayoutOrientation.HORIZONTAL) {
                    link._setVertices([
                        [x1, y1],
                        [(x1 + x2)/2, y1],
                        [x1, y2],
                        [x2, y2]
                    ]);
                } else if (link.orientation === LayoutOrientation.VERTICAL) {
                    link._setVertices([
                        [x1, y1],
                        [x1, (y1 + y2)/2],
                        [x2, y1],
                        [x2, y2]
                    ]);
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
                let sid = link.source.dataScope.getAttributeValue(MSCNodeID),
                    tid = link.target.dataScope.getAttributeValue(MSCNodeID);
                let sLeaf = idInTree2leaf.get(leafId2idInTree.get(sid)),
                    tLeaf = idInTree2leaf.get(leafId2idInTree.get(tid));
                (sLeaf.outgoing ??= []).push([sLeaf, tLeaf]);
                tLeaf.incoming ??= [];
                let path = sLeaf.path(tLeaf);
                link._d = translateSVGPath(line(path), layout.x, layout.y);
                //(tLeaf.incoming ??= []).push([sLeaf, tLeaf]);
            }
        }

        _updateLineLinks(links) {
            for (let link of links) {
                let sMk = link.source,
                    tMk = link.target;
                link.vertices[0]._x = sMk.bounds.x;
                link.vertices[0]._y = sMk.bounds.y;
                link.vertices[1]._x = tMk.bounds.x;
                link.vertices[1]._y = tMk.bounds.y;
            }
        }

    }

    function id(node) {
        return `${node.parent ? id(node.parent) + "." : ""}${node.data[MSCNodeID]}`;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire(path) {
    	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */

    var _listCacheClear;
    var hasRequired_listCacheClear;

    function require_listCacheClear () {
    	if (hasRequired_listCacheClear) return _listCacheClear;
    	hasRequired_listCacheClear = 1;
    	function listCacheClear() {
    	  this.__data__ = [];
    	  this.size = 0;
    	}

    	_listCacheClear = listCacheClear;
    	return _listCacheClear;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */

    var eq_1;
    var hasRequiredEq;

    function requireEq () {
    	if (hasRequiredEq) return eq_1;
    	hasRequiredEq = 1;
    	function eq(value, other) {
    	  return value === other || (value !== value && other !== other);
    	}

    	eq_1 = eq;
    	return eq_1;
    }

    var _assocIndexOf;
    var hasRequired_assocIndexOf;

    function require_assocIndexOf () {
    	if (hasRequired_assocIndexOf) return _assocIndexOf;
    	hasRequired_assocIndexOf = 1;
    	var eq = requireEq();

    	/**
    	 * Gets the index at which the `key` is found in `array` of key-value pairs.
    	 *
    	 * @private
    	 * @param {Array} array The array to inspect.
    	 * @param {*} key The key to search for.
    	 * @returns {number} Returns the index of the matched value, else `-1`.
    	 */
    	function assocIndexOf(array, key) {
    	  var length = array.length;
    	  while (length--) {
    	    if (eq(array[length][0], key)) {
    	      return length;
    	    }
    	  }
    	  return -1;
    	}

    	_assocIndexOf = assocIndexOf;
    	return _assocIndexOf;
    }

    var _listCacheDelete;
    var hasRequired_listCacheDelete;

    function require_listCacheDelete () {
    	if (hasRequired_listCacheDelete) return _listCacheDelete;
    	hasRequired_listCacheDelete = 1;
    	var assocIndexOf = require_assocIndexOf();

    	/** Used for built-in method references. */
    	var arrayProto = Array.prototype;

    	/** Built-in value references. */
    	var splice = arrayProto.splice;

    	/**
    	 * Removes `key` and its value from the list cache.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function listCacheDelete(key) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  if (index < 0) {
    	    return false;
    	  }
    	  var lastIndex = data.length - 1;
    	  if (index == lastIndex) {
    	    data.pop();
    	  } else {
    	    splice.call(data, index, 1);
    	  }
    	  --this.size;
    	  return true;
    	}

    	_listCacheDelete = listCacheDelete;
    	return _listCacheDelete;
    }

    var _listCacheGet;
    var hasRequired_listCacheGet;

    function require_listCacheGet () {
    	if (hasRequired_listCacheGet) return _listCacheGet;
    	hasRequired_listCacheGet = 1;
    	var assocIndexOf = require_assocIndexOf();

    	/**
    	 * Gets the list cache value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function listCacheGet(key) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  return index < 0 ? undefined : data[index][1];
    	}

    	_listCacheGet = listCacheGet;
    	return _listCacheGet;
    }

    var _listCacheHas;
    var hasRequired_listCacheHas;

    function require_listCacheHas () {
    	if (hasRequired_listCacheHas) return _listCacheHas;
    	hasRequired_listCacheHas = 1;
    	var assocIndexOf = require_assocIndexOf();

    	/**
    	 * Checks if a list cache value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf ListCache
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function listCacheHas(key) {
    	  return assocIndexOf(this.__data__, key) > -1;
    	}

    	_listCacheHas = listCacheHas;
    	return _listCacheHas;
    }

    var _listCacheSet;
    var hasRequired_listCacheSet;

    function require_listCacheSet () {
    	if (hasRequired_listCacheSet) return _listCacheSet;
    	hasRequired_listCacheSet = 1;
    	var assocIndexOf = require_assocIndexOf();

    	/**
    	 * Sets the list cache `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the list cache instance.
    	 */
    	function listCacheSet(key, value) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  if (index < 0) {
    	    ++this.size;
    	    data.push([key, value]);
    	  } else {
    	    data[index][1] = value;
    	  }
    	  return this;
    	}

    	_listCacheSet = listCacheSet;
    	return _listCacheSet;
    }

    var _ListCache;
    var hasRequired_ListCache;

    function require_ListCache () {
    	if (hasRequired_ListCache) return _ListCache;
    	hasRequired_ListCache = 1;
    	var listCacheClear = require_listCacheClear(),
    	    listCacheDelete = require_listCacheDelete(),
    	    listCacheGet = require_listCacheGet(),
    	    listCacheHas = require_listCacheHas(),
    	    listCacheSet = require_listCacheSet();

    	/**
    	 * Creates an list cache object.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function ListCache(entries) {
    	  var index = -1,
    	      length = entries == null ? 0 : entries.length;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	// Add methods to `ListCache`.
    	ListCache.prototype.clear = listCacheClear;
    	ListCache.prototype['delete'] = listCacheDelete;
    	ListCache.prototype.get = listCacheGet;
    	ListCache.prototype.has = listCacheHas;
    	ListCache.prototype.set = listCacheSet;

    	_ListCache = ListCache;
    	return _ListCache;
    }

    var _stackClear;
    var hasRequired_stackClear;

    function require_stackClear () {
    	if (hasRequired_stackClear) return _stackClear;
    	hasRequired_stackClear = 1;
    	var ListCache = require_ListCache();

    	/**
    	 * Removes all key-value entries from the stack.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf Stack
    	 */
    	function stackClear() {
    	  this.__data__ = new ListCache;
    	  this.size = 0;
    	}

    	_stackClear = stackClear;
    	return _stackClear;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    var _stackDelete;
    var hasRequired_stackDelete;

    function require_stackDelete () {
    	if (hasRequired_stackDelete) return _stackDelete;
    	hasRequired_stackDelete = 1;
    	function stackDelete(key) {
    	  var data = this.__data__,
    	      result = data['delete'](key);

    	  this.size = data.size;
    	  return result;
    	}

    	_stackDelete = stackDelete;
    	return _stackDelete;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */

    var _stackGet;
    var hasRequired_stackGet;

    function require_stackGet () {
    	if (hasRequired_stackGet) return _stackGet;
    	hasRequired_stackGet = 1;
    	function stackGet(key) {
    	  return this.__data__.get(key);
    	}

    	_stackGet = stackGet;
    	return _stackGet;
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */

    var _stackHas;
    var hasRequired_stackHas;

    function require_stackHas () {
    	if (hasRequired_stackHas) return _stackHas;
    	hasRequired_stackHas = 1;
    	function stackHas(key) {
    	  return this.__data__.has(key);
    	}

    	_stackHas = stackHas;
    	return _stackHas;
    }

    /** Detect free variable `global` from Node.js. */

    var _freeGlobal;
    var hasRequired_freeGlobal;

    function require_freeGlobal () {
    	if (hasRequired_freeGlobal) return _freeGlobal;
    	hasRequired_freeGlobal = 1;
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    	_freeGlobal = freeGlobal;
    	return _freeGlobal;
    }

    var _root;
    var hasRequired_root;

    function require_root () {
    	if (hasRequired_root) return _root;
    	hasRequired_root = 1;
    	var freeGlobal = require_freeGlobal();

    	/** Detect free variable `self`. */
    	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    	/** Used as a reference to the global object. */
    	var root = freeGlobal || freeSelf || Function('return this')();

    	_root = root;
    	return _root;
    }

    var _Symbol;
    var hasRequired_Symbol;

    function require_Symbol () {
    	if (hasRequired_Symbol) return _Symbol;
    	hasRequired_Symbol = 1;
    	var root = require_root();

    	/** Built-in value references. */
    	var Symbol = root.Symbol;

    	_Symbol = Symbol;
    	return _Symbol;
    }

    var _getRawTag;
    var hasRequired_getRawTag;

    function require_getRawTag () {
    	if (hasRequired_getRawTag) return _getRawTag;
    	hasRequired_getRawTag = 1;
    	var Symbol = require_Symbol();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Used to resolve the
    	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
    	 * of values.
    	 */
    	var nativeObjectToString = objectProto.toString;

    	/** Built-in value references. */
    	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    	/**
    	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @returns {string} Returns the raw `toStringTag`.
    	 */
    	function getRawTag(value) {
    	  var isOwn = hasOwnProperty.call(value, symToStringTag),
    	      tag = value[symToStringTag];

    	  try {
    	    value[symToStringTag] = undefined;
    	    var unmasked = true;
    	  } catch (e) {}

    	  var result = nativeObjectToString.call(value);
    	  if (unmasked) {
    	    if (isOwn) {
    	      value[symToStringTag] = tag;
    	    } else {
    	      delete value[symToStringTag];
    	    }
    	  }
    	  return result;
    	}

    	_getRawTag = getRawTag;
    	return _getRawTag;
    }

    /** Used for built-in method references. */

    var _objectToString;
    var hasRequired_objectToString;

    function require_objectToString () {
    	if (hasRequired_objectToString) return _objectToString;
    	hasRequired_objectToString = 1;
    	var objectProto = Object.prototype;

    	/**
    	 * Used to resolve the
    	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
    	 * of values.
    	 */
    	var nativeObjectToString = objectProto.toString;

    	/**
    	 * Converts `value` to a string using `Object.prototype.toString`.
    	 *
    	 * @private
    	 * @param {*} value The value to convert.
    	 * @returns {string} Returns the converted string.
    	 */
    	function objectToString(value) {
    	  return nativeObjectToString.call(value);
    	}

    	_objectToString = objectToString;
    	return _objectToString;
    }

    var _baseGetTag;
    var hasRequired_baseGetTag;

    function require_baseGetTag () {
    	if (hasRequired_baseGetTag) return _baseGetTag;
    	hasRequired_baseGetTag = 1;
    	var Symbol = require_Symbol(),
    	    getRawTag = require_getRawTag(),
    	    objectToString = require_objectToString();

    	/** `Object#toString` result references. */
    	var nullTag = '[object Null]',
    	    undefinedTag = '[object Undefined]';

    	/** Built-in value references. */
    	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    	/**
    	 * The base implementation of `getTag` without fallbacks for buggy environments.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @returns {string} Returns the `toStringTag`.
    	 */
    	function baseGetTag(value) {
    	  if (value == null) {
    	    return value === undefined ? undefinedTag : nullTag;
    	  }
    	  return (symToStringTag && symToStringTag in Object(value))
    	    ? getRawTag(value)
    	    : objectToString(value);
    	}

    	_baseGetTag = baseGetTag;
    	return _baseGetTag;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */

    var isObject_1;
    var hasRequiredIsObject;

    function requireIsObject () {
    	if (hasRequiredIsObject) return isObject_1;
    	hasRequiredIsObject = 1;
    	function isObject(value) {
    	  var type = typeof value;
    	  return value != null && (type == 'object' || type == 'function');
    	}

    	isObject_1 = isObject;
    	return isObject_1;
    }

    var isFunction_1;
    var hasRequiredIsFunction;

    function requireIsFunction () {
    	if (hasRequiredIsFunction) return isFunction_1;
    	hasRequiredIsFunction = 1;
    	var baseGetTag = require_baseGetTag(),
    	    isObject = requireIsObject();

    	/** `Object#toString` result references. */
    	var asyncTag = '[object AsyncFunction]',
    	    funcTag = '[object Function]',
    	    genTag = '[object GeneratorFunction]',
    	    proxyTag = '[object Proxy]';

    	/**
    	 * Checks if `value` is classified as a `Function` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
    	 * @example
    	 *
    	 * _.isFunction(_);
    	 * // => true
    	 *
    	 * _.isFunction(/abc/);
    	 * // => false
    	 */
    	function isFunction(value) {
    	  if (!isObject(value)) {
    	    return false;
    	  }
    	  // The use of `Object#toString` avoids issues with the `typeof` operator
    	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
    	  var tag = baseGetTag(value);
    	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    	}

    	isFunction_1 = isFunction;
    	return isFunction_1;
    }

    var _coreJsData;
    var hasRequired_coreJsData;

    function require_coreJsData () {
    	if (hasRequired_coreJsData) return _coreJsData;
    	hasRequired_coreJsData = 1;
    	var root = require_root();

    	/** Used to detect overreaching core-js shims. */
    	var coreJsData = root['__core-js_shared__'];

    	_coreJsData = coreJsData;
    	return _coreJsData;
    }

    var _isMasked;
    var hasRequired_isMasked;

    function require_isMasked () {
    	if (hasRequired_isMasked) return _isMasked;
    	hasRequired_isMasked = 1;
    	var coreJsData = require_coreJsData();

    	/** Used to detect methods masquerading as native. */
    	var maskSrcKey = (function() {
    	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    	  return uid ? ('Symbol(src)_1.' + uid) : '';
    	}());

    	/**
    	 * Checks if `func` has its source masked.
    	 *
    	 * @private
    	 * @param {Function} func The function to check.
    	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
    	 */
    	function isMasked(func) {
    	  return !!maskSrcKey && (maskSrcKey in func);
    	}

    	_isMasked = isMasked;
    	return _isMasked;
    }

    /** Used for built-in method references. */

    var _toSource;
    var hasRequired_toSource;

    function require_toSource () {
    	if (hasRequired_toSource) return _toSource;
    	hasRequired_toSource = 1;
    	var funcProto = Function.prototype;

    	/** Used to resolve the decompiled source of functions. */
    	var funcToString = funcProto.toString;

    	/**
    	 * Converts `func` to its source code.
    	 *
    	 * @private
    	 * @param {Function} func The function to convert.
    	 * @returns {string} Returns the source code.
    	 */
    	function toSource(func) {
    	  if (func != null) {
    	    try {
    	      return funcToString.call(func);
    	    } catch (e) {}
    	    try {
    	      return (func + '');
    	    } catch (e) {}
    	  }
    	  return '';
    	}

    	_toSource = toSource;
    	return _toSource;
    }

    var _baseIsNative;
    var hasRequired_baseIsNative;

    function require_baseIsNative () {
    	if (hasRequired_baseIsNative) return _baseIsNative;
    	hasRequired_baseIsNative = 1;
    	var isFunction = requireIsFunction(),
    	    isMasked = require_isMasked(),
    	    isObject = requireIsObject(),
    	    toSource = require_toSource();

    	/**
    	 * Used to match `RegExp`
    	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
    	 */
    	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    	/** Used to detect host constructors (Safari). */
    	var reIsHostCtor = /^\[object .+?Constructor\]$/;

    	/** Used for built-in method references. */
    	var funcProto = Function.prototype,
    	    objectProto = Object.prototype;

    	/** Used to resolve the decompiled source of functions. */
    	var funcToString = funcProto.toString;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/** Used to detect if a method is native. */
    	var reIsNative = RegExp('^' +
    	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    	);

    	/**
    	 * The base implementation of `_.isNative` without bad shim checks.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a native function,
    	 *  else `false`.
    	 */
    	function baseIsNative(value) {
    	  if (!isObject(value) || isMasked(value)) {
    	    return false;
    	  }
    	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    	  return pattern.test(toSource(value));
    	}

    	_baseIsNative = baseIsNative;
    	return _baseIsNative;
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */

    var _getValue;
    var hasRequired_getValue;

    function require_getValue () {
    	if (hasRequired_getValue) return _getValue;
    	hasRequired_getValue = 1;
    	function getValue(object, key) {
    	  return object == null ? undefined : object[key];
    	}

    	_getValue = getValue;
    	return _getValue;
    }

    var _getNative;
    var hasRequired_getNative;

    function require_getNative () {
    	if (hasRequired_getNative) return _getNative;
    	hasRequired_getNative = 1;
    	var baseIsNative = require_baseIsNative(),
    	    getValue = require_getValue();

    	/**
    	 * Gets the native function at `key` of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {string} key The key of the method to get.
    	 * @returns {*} Returns the function if it's native, else `undefined`.
    	 */
    	function getNative(object, key) {
    	  var value = getValue(object, key);
    	  return baseIsNative(value) ? value : undefined;
    	}

    	_getNative = getNative;
    	return _getNative;
    }

    var _Map;
    var hasRequired_Map;

    function require_Map () {
    	if (hasRequired_Map) return _Map;
    	hasRequired_Map = 1;
    	var getNative = require_getNative(),
    	    root = require_root();

    	/* Built-in method references that are verified to be native. */
    	var Map = getNative(root, 'Map');

    	_Map = Map;
    	return _Map;
    }

    var _nativeCreate;
    var hasRequired_nativeCreate;

    function require_nativeCreate () {
    	if (hasRequired_nativeCreate) return _nativeCreate;
    	hasRequired_nativeCreate = 1;
    	var getNative = require_getNative();

    	/* Built-in method references that are verified to be native. */
    	var nativeCreate = getNative(Object, 'create');

    	_nativeCreate = nativeCreate;
    	return _nativeCreate;
    }

    var _hashClear;
    var hasRequired_hashClear;

    function require_hashClear () {
    	if (hasRequired_hashClear) return _hashClear;
    	hasRequired_hashClear = 1;
    	var nativeCreate = require_nativeCreate();

    	/**
    	 * Removes all key-value entries from the hash.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf Hash
    	 */
    	function hashClear() {
    	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
    	  this.size = 0;
    	}

    	_hashClear = hashClear;
    	return _hashClear;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    var _hashDelete;
    var hasRequired_hashDelete;

    function require_hashDelete () {
    	if (hasRequired_hashDelete) return _hashDelete;
    	hasRequired_hashDelete = 1;
    	function hashDelete(key) {
    	  var result = this.has(key) && delete this.__data__[key];
    	  this.size -= result ? 1 : 0;
    	  return result;
    	}

    	_hashDelete = hashDelete;
    	return _hashDelete;
    }

    var _hashGet;
    var hasRequired_hashGet;

    function require_hashGet () {
    	if (hasRequired_hashGet) return _hashGet;
    	hasRequired_hashGet = 1;
    	var nativeCreate = require_nativeCreate();

    	/** Used to stand-in for `undefined` hash values. */
    	var HASH_UNDEFINED = '__lodash_hash_undefined__';

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Gets the hash value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf Hash
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function hashGet(key) {
    	  var data = this.__data__;
    	  if (nativeCreate) {
    	    var result = data[key];
    	    return result === HASH_UNDEFINED ? undefined : result;
    	  }
    	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
    	}

    	_hashGet = hashGet;
    	return _hashGet;
    }

    var _hashHas;
    var hasRequired_hashHas;

    function require_hashHas () {
    	if (hasRequired_hashHas) return _hashHas;
    	hasRequired_hashHas = 1;
    	var nativeCreate = require_nativeCreate();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Checks if a hash value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf Hash
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function hashHas(key) {
    	  var data = this.__data__;
    	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    	}

    	_hashHas = hashHas;
    	return _hashHas;
    }

    var _hashSet;
    var hasRequired_hashSet;

    function require_hashSet () {
    	if (hasRequired_hashSet) return _hashSet;
    	hasRequired_hashSet = 1;
    	var nativeCreate = require_nativeCreate();

    	/** Used to stand-in for `undefined` hash values. */
    	var HASH_UNDEFINED = '__lodash_hash_undefined__';

    	/**
    	 * Sets the hash `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf Hash
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the hash instance.
    	 */
    	function hashSet(key, value) {
    	  var data = this.__data__;
    	  this.size += this.has(key) ? 0 : 1;
    	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    	  return this;
    	}

    	_hashSet = hashSet;
    	return _hashSet;
    }

    var _Hash;
    var hasRequired_Hash;

    function require_Hash () {
    	if (hasRequired_Hash) return _Hash;
    	hasRequired_Hash = 1;
    	var hashClear = require_hashClear(),
    	    hashDelete = require_hashDelete(),
    	    hashGet = require_hashGet(),
    	    hashHas = require_hashHas(),
    	    hashSet = require_hashSet();

    	/**
    	 * Creates a hash object.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function Hash(entries) {
    	  var index = -1,
    	      length = entries == null ? 0 : entries.length;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	// Add methods to `Hash`.
    	Hash.prototype.clear = hashClear;
    	Hash.prototype['delete'] = hashDelete;
    	Hash.prototype.get = hashGet;
    	Hash.prototype.has = hashHas;
    	Hash.prototype.set = hashSet;

    	_Hash = Hash;
    	return _Hash;
    }

    var _mapCacheClear;
    var hasRequired_mapCacheClear;

    function require_mapCacheClear () {
    	if (hasRequired_mapCacheClear) return _mapCacheClear;
    	hasRequired_mapCacheClear = 1;
    	var Hash = require_Hash(),
    	    ListCache = require_ListCache(),
    	    Map = require_Map();

    	/**
    	 * Removes all key-value entries from the map.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf MapCache
    	 */
    	function mapCacheClear() {
    	  this.size = 0;
    	  this.__data__ = {
    	    'hash': new Hash,
    	    'map': new (Map || ListCache),
    	    'string': new Hash
    	  };
    	}

    	_mapCacheClear = mapCacheClear;
    	return _mapCacheClear;
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */

    var _isKeyable;
    var hasRequired_isKeyable;

    function require_isKeyable () {
    	if (hasRequired_isKeyable) return _isKeyable;
    	hasRequired_isKeyable = 1;
    	function isKeyable(value) {
    	  var type = typeof value;
    	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    	    ? (value !== '__proto__')
    	    : (value === null);
    	}

    	_isKeyable = isKeyable;
    	return _isKeyable;
    }

    var _getMapData;
    var hasRequired_getMapData;

    function require_getMapData () {
    	if (hasRequired_getMapData) return _getMapData;
    	hasRequired_getMapData = 1;
    	var isKeyable = require_isKeyable();

    	/**
    	 * Gets the data for `map`.
    	 *
    	 * @private
    	 * @param {Object} map The map to query.
    	 * @param {string} key The reference key.
    	 * @returns {*} Returns the map data.
    	 */
    	function getMapData(map, key) {
    	  var data = map.__data__;
    	  return isKeyable(key)
    	    ? data[typeof key == 'string' ? 'string' : 'hash']
    	    : data.map;
    	}

    	_getMapData = getMapData;
    	return _getMapData;
    }

    var _mapCacheDelete;
    var hasRequired_mapCacheDelete;

    function require_mapCacheDelete () {
    	if (hasRequired_mapCacheDelete) return _mapCacheDelete;
    	hasRequired_mapCacheDelete = 1;
    	var getMapData = require_getMapData();

    	/**
    	 * Removes `key` and its value from the map.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function mapCacheDelete(key) {
    	  var result = getMapData(this, key)['delete'](key);
    	  this.size -= result ? 1 : 0;
    	  return result;
    	}

    	_mapCacheDelete = mapCacheDelete;
    	return _mapCacheDelete;
    }

    var _mapCacheGet;
    var hasRequired_mapCacheGet;

    function require_mapCacheGet () {
    	if (hasRequired_mapCacheGet) return _mapCacheGet;
    	hasRequired_mapCacheGet = 1;
    	var getMapData = require_getMapData();

    	/**
    	 * Gets the map value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function mapCacheGet(key) {
    	  return getMapData(this, key).get(key);
    	}

    	_mapCacheGet = mapCacheGet;
    	return _mapCacheGet;
    }

    var _mapCacheHas;
    var hasRequired_mapCacheHas;

    function require_mapCacheHas () {
    	if (hasRequired_mapCacheHas) return _mapCacheHas;
    	hasRequired_mapCacheHas = 1;
    	var getMapData = require_getMapData();

    	/**
    	 * Checks if a map value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf MapCache
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function mapCacheHas(key) {
    	  return getMapData(this, key).has(key);
    	}

    	_mapCacheHas = mapCacheHas;
    	return _mapCacheHas;
    }

    var _mapCacheSet;
    var hasRequired_mapCacheSet;

    function require_mapCacheSet () {
    	if (hasRequired_mapCacheSet) return _mapCacheSet;
    	hasRequired_mapCacheSet = 1;
    	var getMapData = require_getMapData();

    	/**
    	 * Sets the map `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the map cache instance.
    	 */
    	function mapCacheSet(key, value) {
    	  var data = getMapData(this, key),
    	      size = data.size;

    	  data.set(key, value);
    	  this.size += data.size == size ? 0 : 1;
    	  return this;
    	}

    	_mapCacheSet = mapCacheSet;
    	return _mapCacheSet;
    }

    var _MapCache;
    var hasRequired_MapCache;

    function require_MapCache () {
    	if (hasRequired_MapCache) return _MapCache;
    	hasRequired_MapCache = 1;
    	var mapCacheClear = require_mapCacheClear(),
    	    mapCacheDelete = require_mapCacheDelete(),
    	    mapCacheGet = require_mapCacheGet(),
    	    mapCacheHas = require_mapCacheHas(),
    	    mapCacheSet = require_mapCacheSet();

    	/**
    	 * Creates a map cache object to store key-value pairs.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function MapCache(entries) {
    	  var index = -1,
    	      length = entries == null ? 0 : entries.length;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	// Add methods to `MapCache`.
    	MapCache.prototype.clear = mapCacheClear;
    	MapCache.prototype['delete'] = mapCacheDelete;
    	MapCache.prototype.get = mapCacheGet;
    	MapCache.prototype.has = mapCacheHas;
    	MapCache.prototype.set = mapCacheSet;

    	_MapCache = MapCache;
    	return _MapCache;
    }

    var _stackSet;
    var hasRequired_stackSet;

    function require_stackSet () {
    	if (hasRequired_stackSet) return _stackSet;
    	hasRequired_stackSet = 1;
    	var ListCache = require_ListCache(),
    	    Map = require_Map(),
    	    MapCache = require_MapCache();

    	/** Used as the size to enable large array optimizations. */
    	var LARGE_ARRAY_SIZE = 200;

    	/**
    	 * Sets the stack `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf Stack
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the stack cache instance.
    	 */
    	function stackSet(key, value) {
    	  var data = this.__data__;
    	  if (data instanceof ListCache) {
    	    var pairs = data.__data__;
    	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
    	      pairs.push([key, value]);
    	      this.size = ++data.size;
    	      return this;
    	    }
    	    data = this.__data__ = new MapCache(pairs);
    	  }
    	  data.set(key, value);
    	  this.size = data.size;
    	  return this;
    	}

    	_stackSet = stackSet;
    	return _stackSet;
    }

    var _Stack;
    var hasRequired_Stack;

    function require_Stack () {
    	if (hasRequired_Stack) return _Stack;
    	hasRequired_Stack = 1;
    	var ListCache = require_ListCache(),
    	    stackClear = require_stackClear(),
    	    stackDelete = require_stackDelete(),
    	    stackGet = require_stackGet(),
    	    stackHas = require_stackHas(),
    	    stackSet = require_stackSet();

    	/**
    	 * Creates a stack cache object to store key-value pairs.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function Stack(entries) {
    	  var data = this.__data__ = new ListCache(entries);
    	  this.size = data.size;
    	}

    	// Add methods to `Stack`.
    	Stack.prototype.clear = stackClear;
    	Stack.prototype['delete'] = stackDelete;
    	Stack.prototype.get = stackGet;
    	Stack.prototype.has = stackHas;
    	Stack.prototype.set = stackSet;

    	_Stack = Stack;
    	return _Stack;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */

    var _arrayEach;
    var hasRequired_arrayEach;

    function require_arrayEach () {
    	if (hasRequired_arrayEach) return _arrayEach;
    	hasRequired_arrayEach = 1;
    	function arrayEach(array, iteratee) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length;

    	  while (++index < length) {
    	    if (iteratee(array[index], index, array) === false) {
    	      break;
    	    }
    	  }
    	  return array;
    	}

    	_arrayEach = arrayEach;
    	return _arrayEach;
    }

    var _defineProperty;
    var hasRequired_defineProperty;

    function require_defineProperty () {
    	if (hasRequired_defineProperty) return _defineProperty;
    	hasRequired_defineProperty = 1;
    	var getNative = require_getNative();

    	var defineProperty = (function() {
    	  try {
    	    var func = getNative(Object, 'defineProperty');
    	    func({}, '', {});
    	    return func;
    	  } catch (e) {}
    	}());

    	_defineProperty = defineProperty;
    	return _defineProperty;
    }

    var _baseAssignValue;
    var hasRequired_baseAssignValue;

    function require_baseAssignValue () {
    	if (hasRequired_baseAssignValue) return _baseAssignValue;
    	hasRequired_baseAssignValue = 1;
    	var defineProperty = require_defineProperty();

    	/**
    	 * The base implementation of `assignValue` and `assignMergeValue` without
    	 * value checks.
    	 *
    	 * @private
    	 * @param {Object} object The object to modify.
    	 * @param {string} key The key of the property to assign.
    	 * @param {*} value The value to assign.
    	 */
    	function baseAssignValue(object, key, value) {
    	  if (key == '__proto__' && defineProperty) {
    	    defineProperty(object, key, {
    	      'configurable': true,
    	      'enumerable': true,
    	      'value': value,
    	      'writable': true
    	    });
    	  } else {
    	    object[key] = value;
    	  }
    	}

    	_baseAssignValue = baseAssignValue;
    	return _baseAssignValue;
    }

    var _assignValue;
    var hasRequired_assignValue;

    function require_assignValue () {
    	if (hasRequired_assignValue) return _assignValue;
    	hasRequired_assignValue = 1;
    	var baseAssignValue = require_baseAssignValue(),
    	    eq = requireEq();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
    	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
    	 * for equality comparisons.
    	 *
    	 * @private
    	 * @param {Object} object The object to modify.
    	 * @param {string} key The key of the property to assign.
    	 * @param {*} value The value to assign.
    	 */
    	function assignValue(object, key, value) {
    	  var objValue = object[key];
    	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
    	      (value === undefined && !(key in object))) {
    	    baseAssignValue(object, key, value);
    	  }
    	}

    	_assignValue = assignValue;
    	return _assignValue;
    }

    var _copyObject;
    var hasRequired_copyObject;

    function require_copyObject () {
    	if (hasRequired_copyObject) return _copyObject;
    	hasRequired_copyObject = 1;
    	var assignValue = require_assignValue(),
    	    baseAssignValue = require_baseAssignValue();

    	/**
    	 * Copies properties of `source` to `object`.
    	 *
    	 * @private
    	 * @param {Object} source The object to copy properties from.
    	 * @param {Array} props The property identifiers to copy.
    	 * @param {Object} [object={}] The object to copy properties to.
    	 * @param {Function} [customizer] The function to customize copied values.
    	 * @returns {Object} Returns `object`.
    	 */
    	function copyObject(source, props, object, customizer) {
    	  var isNew = !object;
    	  object || (object = {});

    	  var index = -1,
    	      length = props.length;

    	  while (++index < length) {
    	    var key = props[index];

    	    var newValue = customizer
    	      ? customizer(object[key], source[key], key, object, source)
    	      : undefined;

    	    if (newValue === undefined) {
    	      newValue = source[key];
    	    }
    	    if (isNew) {
    	      baseAssignValue(object, key, newValue);
    	    } else {
    	      assignValue(object, key, newValue);
    	    }
    	  }
    	  return object;
    	}

    	_copyObject = copyObject;
    	return _copyObject;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */

    var _baseTimes;
    var hasRequired_baseTimes;

    function require_baseTimes () {
    	if (hasRequired_baseTimes) return _baseTimes;
    	hasRequired_baseTimes = 1;
    	function baseTimes(n, iteratee) {
    	  var index = -1,
    	      result = Array(n);

    	  while (++index < n) {
    	    result[index] = iteratee(index);
    	  }
    	  return result;
    	}

    	_baseTimes = baseTimes;
    	return _baseTimes;
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */

    var isObjectLike_1;
    var hasRequiredIsObjectLike;

    function requireIsObjectLike () {
    	if (hasRequiredIsObjectLike) return isObjectLike_1;
    	hasRequiredIsObjectLike = 1;
    	function isObjectLike(value) {
    	  return value != null && typeof value == 'object';
    	}

    	isObjectLike_1 = isObjectLike;
    	return isObjectLike_1;
    }

    var _baseIsArguments;
    var hasRequired_baseIsArguments;

    function require_baseIsArguments () {
    	if (hasRequired_baseIsArguments) return _baseIsArguments;
    	hasRequired_baseIsArguments = 1;
    	var baseGetTag = require_baseGetTag(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var argsTag = '[object Arguments]';

    	/**
    	 * The base implementation of `_.isArguments`.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
    	 */
    	function baseIsArguments(value) {
    	  return isObjectLike(value) && baseGetTag(value) == argsTag;
    	}

    	_baseIsArguments = baseIsArguments;
    	return _baseIsArguments;
    }

    var isArguments_1;
    var hasRequiredIsArguments;

    function requireIsArguments () {
    	if (hasRequiredIsArguments) return isArguments_1;
    	hasRequiredIsArguments = 1;
    	var baseIsArguments = require_baseIsArguments(),
    	    isObjectLike = requireIsObjectLike();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/** Built-in value references. */
    	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

    	/**
    	 * Checks if `value` is likely an `arguments` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
    	 *  else `false`.
    	 * @example
    	 *
    	 * _.isArguments(function() { return arguments; }());
    	 * // => true
    	 *
    	 * _.isArguments([1, 2, 3]);
    	 * // => false
    	 */
    	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    	    !propertyIsEnumerable.call(value, 'callee');
    	};

    	isArguments_1 = isArguments;
    	return isArguments_1;
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */

    var isArray_1;
    var hasRequiredIsArray;

    function requireIsArray () {
    	if (hasRequiredIsArray) return isArray_1;
    	hasRequiredIsArray = 1;
    	var isArray = Array.isArray;

    	isArray_1 = isArray;
    	return isArray_1;
    }

    var isBuffer = {exports: {}};

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */

    var stubFalse_1;
    var hasRequiredStubFalse;

    function requireStubFalse () {
    	if (hasRequiredStubFalse) return stubFalse_1;
    	hasRequiredStubFalse = 1;
    	function stubFalse() {
    	  return false;
    	}

    	stubFalse_1 = stubFalse;
    	return stubFalse_1;
    }

    isBuffer.exports;

    var hasRequiredIsBuffer;

    function requireIsBuffer () {
    	if (hasRequiredIsBuffer) return isBuffer.exports;
    	hasRequiredIsBuffer = 1;
    	(function (module, exports) {
    		var root = require_root(),
    		    stubFalse = requireStubFalse();

    		/** Detect free variable `exports`. */
    		var freeExports = exports && !exports.nodeType && exports;

    		/** Detect free variable `module`. */
    		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    		/** Detect the popular CommonJS extension `module.exports`. */
    		var moduleExports = freeModule && freeModule.exports === freeExports;

    		/** Built-in value references. */
    		var Buffer = moduleExports ? root.Buffer : undefined;

    		/* Built-in method references for those with the same name as other `lodash` methods. */
    		var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    		/**
    		 * Checks if `value` is a buffer.
    		 *
    		 * @static
    		 * @memberOf _
    		 * @since 4.3.0
    		 * @category Lang
    		 * @param {*} value The value to check.
    		 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
    		 * @example
    		 *
    		 * _.isBuffer(new Buffer(2));
    		 * // => true
    		 *
    		 * _.isBuffer(new Uint8Array(2));
    		 * // => false
    		 */
    		var isBuffer = nativeIsBuffer || stubFalse;

    		module.exports = isBuffer; 
    	} (isBuffer, isBuffer.exports));
    	return isBuffer.exports;
    }

    /** Used as references for various `Number` constants. */

    var _isIndex;
    var hasRequired_isIndex;

    function require_isIndex () {
    	if (hasRequired_isIndex) return _isIndex;
    	hasRequired_isIndex = 1;
    	var MAX_SAFE_INTEGER = 9007199254740991;

    	/** Used to detect unsigned integer values. */
    	var reIsUint = /^(?:0|[1-9]\d*)$/;

    	/**
    	 * Checks if `value` is a valid array-like index.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
    	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
    	 */
    	function isIndex(value, length) {
    	  var type = typeof value;
    	  length = length == null ? MAX_SAFE_INTEGER : length;

    	  return !!length &&
    	    (type == 'number' ||
    	      (type != 'symbol' && reIsUint.test(value))) &&
    	        (value > -1 && value % 1 == 0 && value < length);
    	}

    	_isIndex = isIndex;
    	return _isIndex;
    }

    /** Used as references for various `Number` constants. */

    var isLength_1;
    var hasRequiredIsLength;

    function requireIsLength () {
    	if (hasRequiredIsLength) return isLength_1;
    	hasRequiredIsLength = 1;
    	var MAX_SAFE_INTEGER = 9007199254740991;

    	/**
    	 * Checks if `value` is a valid array-like length.
    	 *
    	 * **Note:** This method is loosely based on
    	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
    	 * @example
    	 *
    	 * _.isLength(3);
    	 * // => true
    	 *
    	 * _.isLength(Number.MIN_VALUE);
    	 * // => false
    	 *
    	 * _.isLength(Infinity);
    	 * // => false
    	 *
    	 * _.isLength('3');
    	 * // => false
    	 */
    	function isLength(value) {
    	  return typeof value == 'number' &&
    	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    	}

    	isLength_1 = isLength;
    	return isLength_1;
    }

    var _baseIsTypedArray;
    var hasRequired_baseIsTypedArray;

    function require_baseIsTypedArray () {
    	if (hasRequired_baseIsTypedArray) return _baseIsTypedArray;
    	hasRequired_baseIsTypedArray = 1;
    	var baseGetTag = require_baseGetTag(),
    	    isLength = requireIsLength(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var argsTag = '[object Arguments]',
    	    arrayTag = '[object Array]',
    	    boolTag = '[object Boolean]',
    	    dateTag = '[object Date]',
    	    errorTag = '[object Error]',
    	    funcTag = '[object Function]',
    	    mapTag = '[object Map]',
    	    numberTag = '[object Number]',
    	    objectTag = '[object Object]',
    	    regexpTag = '[object RegExp]',
    	    setTag = '[object Set]',
    	    stringTag = '[object String]',
    	    weakMapTag = '[object WeakMap]';

    	var arrayBufferTag = '[object ArrayBuffer]',
    	    dataViewTag = '[object DataView]',
    	    float32Tag = '[object Float32Array]',
    	    float64Tag = '[object Float64Array]',
    	    int8Tag = '[object Int8Array]',
    	    int16Tag = '[object Int16Array]',
    	    int32Tag = '[object Int32Array]',
    	    uint8Tag = '[object Uint8Array]',
    	    uint8ClampedTag = '[object Uint8ClampedArray]',
    	    uint16Tag = '[object Uint16Array]',
    	    uint32Tag = '[object Uint32Array]';

    	/** Used to identify `toStringTag` values of typed arrays. */
    	var typedArrayTags = {};
    	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    	typedArrayTags[uint32Tag] = true;
    	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
    	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
    	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
    	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
    	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
    	typedArrayTags[setTag] = typedArrayTags[stringTag] =
    	typedArrayTags[weakMapTag] = false;

    	/**
    	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
    	 */
    	function baseIsTypedArray(value) {
    	  return isObjectLike(value) &&
    	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    	}

    	_baseIsTypedArray = baseIsTypedArray;
    	return _baseIsTypedArray;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */

    var _baseUnary;
    var hasRequired_baseUnary;

    function require_baseUnary () {
    	if (hasRequired_baseUnary) return _baseUnary;
    	hasRequired_baseUnary = 1;
    	function baseUnary(func) {
    	  return function(value) {
    	    return func(value);
    	  };
    	}

    	_baseUnary = baseUnary;
    	return _baseUnary;
    }

    var _nodeUtil = {exports: {}};

    _nodeUtil.exports;

    var hasRequired_nodeUtil;

    function require_nodeUtil () {
    	if (hasRequired_nodeUtil) return _nodeUtil.exports;
    	hasRequired_nodeUtil = 1;
    	(function (module, exports) {
    		var freeGlobal = require_freeGlobal();

    		/** Detect free variable `exports`. */
    		var freeExports = exports && !exports.nodeType && exports;

    		/** Detect free variable `module`. */
    		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    		/** Detect the popular CommonJS extension `module.exports`. */
    		var moduleExports = freeModule && freeModule.exports === freeExports;

    		/** Detect free variable `process` from Node.js. */
    		var freeProcess = moduleExports && freeGlobal.process;

    		/** Used to access faster Node.js helpers. */
    		var nodeUtil = (function() {
    		  try {
    		    // Use `util.types` for Node.js 10+.
    		    var types = freeModule && freeModule.require && freeModule.require('util').types;

    		    if (types) {
    		      return types;
    		    }

    		    // Legacy `process.binding('util')` for Node.js < 10.
    		    return freeProcess && freeProcess.binding && freeProcess.binding('util');
    		  } catch (e) {}
    		}());

    		module.exports = nodeUtil; 
    	} (_nodeUtil, _nodeUtil.exports));
    	return _nodeUtil.exports;
    }

    var isTypedArray_1;
    var hasRequiredIsTypedArray;

    function requireIsTypedArray () {
    	if (hasRequiredIsTypedArray) return isTypedArray_1;
    	hasRequiredIsTypedArray = 1;
    	var baseIsTypedArray = require_baseIsTypedArray(),
    	    baseUnary = require_baseUnary(),
    	    nodeUtil = require_nodeUtil();

    	/* Node.js helper references. */
    	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    	/**
    	 * Checks if `value` is classified as a typed array.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 3.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
    	 * @example
    	 *
    	 * _.isTypedArray(new Uint8Array);
    	 * // => true
    	 *
    	 * _.isTypedArray([]);
    	 * // => false
    	 */
    	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    	isTypedArray_1 = isTypedArray;
    	return isTypedArray_1;
    }

    var _arrayLikeKeys;
    var hasRequired_arrayLikeKeys;

    function require_arrayLikeKeys () {
    	if (hasRequired_arrayLikeKeys) return _arrayLikeKeys;
    	hasRequired_arrayLikeKeys = 1;
    	var baseTimes = require_baseTimes(),
    	    isArguments = requireIsArguments(),
    	    isArray = requireIsArray(),
    	    isBuffer = requireIsBuffer(),
    	    isIndex = require_isIndex(),
    	    isTypedArray = requireIsTypedArray();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Creates an array of the enumerable property names of the array-like `value`.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @param {boolean} inherited Specify returning inherited property names.
    	 * @returns {Array} Returns the array of property names.
    	 */
    	function arrayLikeKeys(value, inherited) {
    	  var isArr = isArray(value),
    	      isArg = !isArr && isArguments(value),
    	      isBuff = !isArr && !isArg && isBuffer(value),
    	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    	      skipIndexes = isArr || isArg || isBuff || isType,
    	      result = skipIndexes ? baseTimes(value.length, String) : [],
    	      length = result.length;

    	  for (var key in value) {
    	    if ((inherited || hasOwnProperty.call(value, key)) &&
    	        !(skipIndexes && (
    	           // Safari 9 has enumerable `arguments.length` in strict mode.
    	           key == 'length' ||
    	           // Node.js 0.10 has enumerable non-index properties on buffers.
    	           (isBuff && (key == 'offset' || key == 'parent')) ||
    	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
    	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
    	           // Skip index properties.
    	           isIndex(key, length)
    	        ))) {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	_arrayLikeKeys = arrayLikeKeys;
    	return _arrayLikeKeys;
    }

    /** Used for built-in method references. */

    var _isPrototype;
    var hasRequired_isPrototype;

    function require_isPrototype () {
    	if (hasRequired_isPrototype) return _isPrototype;
    	hasRequired_isPrototype = 1;
    	var objectProto = Object.prototype;

    	/**
    	 * Checks if `value` is likely a prototype object.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
    	 */
    	function isPrototype(value) {
    	  var Ctor = value && value.constructor,
    	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    	  return value === proto;
    	}

    	_isPrototype = isPrototype;
    	return _isPrototype;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */

    var _overArg;
    var hasRequired_overArg;

    function require_overArg () {
    	if (hasRequired_overArg) return _overArg;
    	hasRequired_overArg = 1;
    	function overArg(func, transform) {
    	  return function(arg) {
    	    return func(transform(arg));
    	  };
    	}

    	_overArg = overArg;
    	return _overArg;
    }

    var _nativeKeys;
    var hasRequired_nativeKeys;

    function require_nativeKeys () {
    	if (hasRequired_nativeKeys) return _nativeKeys;
    	hasRequired_nativeKeys = 1;
    	var overArg = require_overArg();

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeKeys = overArg(Object.keys, Object);

    	_nativeKeys = nativeKeys;
    	return _nativeKeys;
    }

    var _baseKeys;
    var hasRequired_baseKeys;

    function require_baseKeys () {
    	if (hasRequired_baseKeys) return _baseKeys;
    	hasRequired_baseKeys = 1;
    	var isPrototype = require_isPrototype(),
    	    nativeKeys = require_nativeKeys();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 */
    	function baseKeys(object) {
    	  if (!isPrototype(object)) {
    	    return nativeKeys(object);
    	  }
    	  var result = [];
    	  for (var key in Object(object)) {
    	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	_baseKeys = baseKeys;
    	return _baseKeys;
    }

    var isArrayLike_1;
    var hasRequiredIsArrayLike;

    function requireIsArrayLike () {
    	if (hasRequiredIsArrayLike) return isArrayLike_1;
    	hasRequiredIsArrayLike = 1;
    	var isFunction = requireIsFunction(),
    	    isLength = requireIsLength();

    	/**
    	 * Checks if `value` is array-like. A value is considered array-like if it's
    	 * not a function and has a `value.length` that's an integer greater than or
    	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
    	 * @example
    	 *
    	 * _.isArrayLike([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isArrayLike(document.body.children);
    	 * // => true
    	 *
    	 * _.isArrayLike('abc');
    	 * // => true
    	 *
    	 * _.isArrayLike(_.noop);
    	 * // => false
    	 */
    	function isArrayLike(value) {
    	  return value != null && isLength(value.length) && !isFunction(value);
    	}

    	isArrayLike_1 = isArrayLike;
    	return isArrayLike_1;
    }

    var keys_1;
    var hasRequiredKeys;

    function requireKeys () {
    	if (hasRequiredKeys) return keys_1;
    	hasRequiredKeys = 1;
    	var arrayLikeKeys = require_arrayLikeKeys(),
    	    baseKeys = require_baseKeys(),
    	    isArrayLike = requireIsArrayLike();

    	/**
    	 * Creates an array of the own enumerable property names of `object`.
    	 *
    	 * **Note:** Non-object values are coerced to objects. See the
    	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
    	 * for more details.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.keys(new Foo);
    	 * // => ['a', 'b'] (iteration order is not guaranteed)
    	 *
    	 * _.keys('hi');
    	 * // => ['0', '1']
    	 */
    	function keys(object) {
    	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    	}

    	keys_1 = keys;
    	return keys_1;
    }

    var _baseAssign;
    var hasRequired_baseAssign;

    function require_baseAssign () {
    	if (hasRequired_baseAssign) return _baseAssign;
    	hasRequired_baseAssign = 1;
    	var copyObject = require_copyObject(),
    	    keys = requireKeys();

    	/**
    	 * The base implementation of `_.assign` without support for multiple sources
    	 * or `customizer` functions.
    	 *
    	 * @private
    	 * @param {Object} object The destination object.
    	 * @param {Object} source The source object.
    	 * @returns {Object} Returns `object`.
    	 */
    	function baseAssign(object, source) {
    	  return object && copyObject(source, keys(source), object);
    	}

    	_baseAssign = baseAssign;
    	return _baseAssign;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */

    var _nativeKeysIn;
    var hasRequired_nativeKeysIn;

    function require_nativeKeysIn () {
    	if (hasRequired_nativeKeysIn) return _nativeKeysIn;
    	hasRequired_nativeKeysIn = 1;
    	function nativeKeysIn(object) {
    	  var result = [];
    	  if (object != null) {
    	    for (var key in Object(object)) {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	_nativeKeysIn = nativeKeysIn;
    	return _nativeKeysIn;
    }

    var _baseKeysIn;
    var hasRequired_baseKeysIn;

    function require_baseKeysIn () {
    	if (hasRequired_baseKeysIn) return _baseKeysIn;
    	hasRequired_baseKeysIn = 1;
    	var isObject = requireIsObject(),
    	    isPrototype = require_isPrototype(),
    	    nativeKeysIn = require_nativeKeysIn();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 */
    	function baseKeysIn(object) {
    	  if (!isObject(object)) {
    	    return nativeKeysIn(object);
    	  }
    	  var isProto = isPrototype(object),
    	      result = [];

    	  for (var key in object) {
    	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	_baseKeysIn = baseKeysIn;
    	return _baseKeysIn;
    }

    var keysIn_1;
    var hasRequiredKeysIn;

    function requireKeysIn () {
    	if (hasRequiredKeysIn) return keysIn_1;
    	hasRequiredKeysIn = 1;
    	var arrayLikeKeys = require_arrayLikeKeys(),
    	    baseKeysIn = require_baseKeysIn(),
    	    isArrayLike = requireIsArrayLike();

    	/**
    	 * Creates an array of the own and inherited enumerable property names of `object`.
    	 *
    	 * **Note:** Non-object values are coerced to objects.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 3.0.0
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.keysIn(new Foo);
    	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
    	 */
    	function keysIn(object) {
    	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    	}

    	keysIn_1 = keysIn;
    	return keysIn_1;
    }

    var _baseAssignIn;
    var hasRequired_baseAssignIn;

    function require_baseAssignIn () {
    	if (hasRequired_baseAssignIn) return _baseAssignIn;
    	hasRequired_baseAssignIn = 1;
    	var copyObject = require_copyObject(),
    	    keysIn = requireKeysIn();

    	/**
    	 * The base implementation of `_.assignIn` without support for multiple sources
    	 * or `customizer` functions.
    	 *
    	 * @private
    	 * @param {Object} object The destination object.
    	 * @param {Object} source The source object.
    	 * @returns {Object} Returns `object`.
    	 */
    	function baseAssignIn(object, source) {
    	  return object && copyObject(source, keysIn(source), object);
    	}

    	_baseAssignIn = baseAssignIn;
    	return _baseAssignIn;
    }

    var _cloneBuffer = {exports: {}};

    _cloneBuffer.exports;

    var hasRequired_cloneBuffer;

    function require_cloneBuffer () {
    	if (hasRequired_cloneBuffer) return _cloneBuffer.exports;
    	hasRequired_cloneBuffer = 1;
    	(function (module, exports) {
    		var root = require_root();

    		/** Detect free variable `exports`. */
    		var freeExports = exports && !exports.nodeType && exports;

    		/** Detect free variable `module`. */
    		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    		/** Detect the popular CommonJS extension `module.exports`. */
    		var moduleExports = freeModule && freeModule.exports === freeExports;

    		/** Built-in value references. */
    		var Buffer = moduleExports ? root.Buffer : undefined,
    		    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    		/**
    		 * Creates a clone of  `buffer`.
    		 *
    		 * @private
    		 * @param {Buffer} buffer The buffer to clone.
    		 * @param {boolean} [isDeep] Specify a deep clone.
    		 * @returns {Buffer} Returns the cloned buffer.
    		 */
    		function cloneBuffer(buffer, isDeep) {
    		  if (isDeep) {
    		    return buffer.slice();
    		  }
    		  var length = buffer.length,
    		      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    		  buffer.copy(result);
    		  return result;
    		}

    		module.exports = cloneBuffer; 
    	} (_cloneBuffer, _cloneBuffer.exports));
    	return _cloneBuffer.exports;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */

    var _copyArray;
    var hasRequired_copyArray;

    function require_copyArray () {
    	if (hasRequired_copyArray) return _copyArray;
    	hasRequired_copyArray = 1;
    	function copyArray(source, array) {
    	  var index = -1,
    	      length = source.length;

    	  array || (array = Array(length));
    	  while (++index < length) {
    	    array[index] = source[index];
    	  }
    	  return array;
    	}

    	_copyArray = copyArray;
    	return _copyArray;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */

    var _arrayFilter;
    var hasRequired_arrayFilter;

    function require_arrayFilter () {
    	if (hasRequired_arrayFilter) return _arrayFilter;
    	hasRequired_arrayFilter = 1;
    	function arrayFilter(array, predicate) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length,
    	      resIndex = 0,
    	      result = [];

    	  while (++index < length) {
    	    var value = array[index];
    	    if (predicate(value, index, array)) {
    	      result[resIndex++] = value;
    	    }
    	  }
    	  return result;
    	}

    	_arrayFilter = arrayFilter;
    	return _arrayFilter;
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */

    var stubArray_1;
    var hasRequiredStubArray;

    function requireStubArray () {
    	if (hasRequiredStubArray) return stubArray_1;
    	hasRequiredStubArray = 1;
    	function stubArray() {
    	  return [];
    	}

    	stubArray_1 = stubArray;
    	return stubArray_1;
    }

    var _getSymbols;
    var hasRequired_getSymbols;

    function require_getSymbols () {
    	if (hasRequired_getSymbols) return _getSymbols;
    	hasRequired_getSymbols = 1;
    	var arrayFilter = require_arrayFilter(),
    	    stubArray = requireStubArray();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Built-in value references. */
    	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeGetSymbols = Object.getOwnPropertySymbols;

    	/**
    	 * Creates an array of the own enumerable symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of symbols.
    	 */
    	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    	  if (object == null) {
    	    return [];
    	  }
    	  object = Object(object);
    	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    	    return propertyIsEnumerable.call(object, symbol);
    	  });
    	};

    	_getSymbols = getSymbols;
    	return _getSymbols;
    }

    var _copySymbols;
    var hasRequired_copySymbols;

    function require_copySymbols () {
    	if (hasRequired_copySymbols) return _copySymbols;
    	hasRequired_copySymbols = 1;
    	var copyObject = require_copyObject(),
    	    getSymbols = require_getSymbols();

    	/**
    	 * Copies own symbols of `source` to `object`.
    	 *
    	 * @private
    	 * @param {Object} source The object to copy symbols from.
    	 * @param {Object} [object={}] The object to copy symbols to.
    	 * @returns {Object} Returns `object`.
    	 */
    	function copySymbols(source, object) {
    	  return copyObject(source, getSymbols(source), object);
    	}

    	_copySymbols = copySymbols;
    	return _copySymbols;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */

    var _arrayPush;
    var hasRequired_arrayPush;

    function require_arrayPush () {
    	if (hasRequired_arrayPush) return _arrayPush;
    	hasRequired_arrayPush = 1;
    	function arrayPush(array, values) {
    	  var index = -1,
    	      length = values.length,
    	      offset = array.length;

    	  while (++index < length) {
    	    array[offset + index] = values[index];
    	  }
    	  return array;
    	}

    	_arrayPush = arrayPush;
    	return _arrayPush;
    }

    var _getPrototype;
    var hasRequired_getPrototype;

    function require_getPrototype () {
    	if (hasRequired_getPrototype) return _getPrototype;
    	hasRequired_getPrototype = 1;
    	var overArg = require_overArg();

    	/** Built-in value references. */
    	var getPrototype = overArg(Object.getPrototypeOf, Object);

    	_getPrototype = getPrototype;
    	return _getPrototype;
    }

    var _getSymbolsIn;
    var hasRequired_getSymbolsIn;

    function require_getSymbolsIn () {
    	if (hasRequired_getSymbolsIn) return _getSymbolsIn;
    	hasRequired_getSymbolsIn = 1;
    	var arrayPush = require_arrayPush(),
    	    getPrototype = require_getPrototype(),
    	    getSymbols = require_getSymbols(),
    	    stubArray = requireStubArray();

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeGetSymbols = Object.getOwnPropertySymbols;

    	/**
    	 * Creates an array of the own and inherited enumerable symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of symbols.
    	 */
    	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    	  var result = [];
    	  while (object) {
    	    arrayPush(result, getSymbols(object));
    	    object = getPrototype(object);
    	  }
    	  return result;
    	};

    	_getSymbolsIn = getSymbolsIn;
    	return _getSymbolsIn;
    }

    var _copySymbolsIn;
    var hasRequired_copySymbolsIn;

    function require_copySymbolsIn () {
    	if (hasRequired_copySymbolsIn) return _copySymbolsIn;
    	hasRequired_copySymbolsIn = 1;
    	var copyObject = require_copyObject(),
    	    getSymbolsIn = require_getSymbolsIn();

    	/**
    	 * Copies own and inherited symbols of `source` to `object`.
    	 *
    	 * @private
    	 * @param {Object} source The object to copy symbols from.
    	 * @param {Object} [object={}] The object to copy symbols to.
    	 * @returns {Object} Returns `object`.
    	 */
    	function copySymbolsIn(source, object) {
    	  return copyObject(source, getSymbolsIn(source), object);
    	}

    	_copySymbolsIn = copySymbolsIn;
    	return _copySymbolsIn;
    }

    var _baseGetAllKeys;
    var hasRequired_baseGetAllKeys;

    function require_baseGetAllKeys () {
    	if (hasRequired_baseGetAllKeys) return _baseGetAllKeys;
    	hasRequired_baseGetAllKeys = 1;
    	var arrayPush = require_arrayPush(),
    	    isArray = requireIsArray();

    	/**
    	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
    	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
    	 * symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {Function} keysFunc The function to get the keys of `object`.
    	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
    	 * @returns {Array} Returns the array of property names and symbols.
    	 */
    	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    	  var result = keysFunc(object);
    	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    	}

    	_baseGetAllKeys = baseGetAllKeys;
    	return _baseGetAllKeys;
    }

    var _getAllKeys;
    var hasRequired_getAllKeys;

    function require_getAllKeys () {
    	if (hasRequired_getAllKeys) return _getAllKeys;
    	hasRequired_getAllKeys = 1;
    	var baseGetAllKeys = require_baseGetAllKeys(),
    	    getSymbols = require_getSymbols(),
    	    keys = requireKeys();

    	/**
    	 * Creates an array of own enumerable property names and symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names and symbols.
    	 */
    	function getAllKeys(object) {
    	  return baseGetAllKeys(object, keys, getSymbols);
    	}

    	_getAllKeys = getAllKeys;
    	return _getAllKeys;
    }

    var _getAllKeysIn;
    var hasRequired_getAllKeysIn;

    function require_getAllKeysIn () {
    	if (hasRequired_getAllKeysIn) return _getAllKeysIn;
    	hasRequired_getAllKeysIn = 1;
    	var baseGetAllKeys = require_baseGetAllKeys(),
    	    getSymbolsIn = require_getSymbolsIn(),
    	    keysIn = requireKeysIn();

    	/**
    	 * Creates an array of own and inherited enumerable property names and
    	 * symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names and symbols.
    	 */
    	function getAllKeysIn(object) {
    	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
    	}

    	_getAllKeysIn = getAllKeysIn;
    	return _getAllKeysIn;
    }

    var _DataView;
    var hasRequired_DataView;

    function require_DataView () {
    	if (hasRequired_DataView) return _DataView;
    	hasRequired_DataView = 1;
    	var getNative = require_getNative(),
    	    root = require_root();

    	/* Built-in method references that are verified to be native. */
    	var DataView = getNative(root, 'DataView');

    	_DataView = DataView;
    	return _DataView;
    }

    var _Promise;
    var hasRequired_Promise;

    function require_Promise () {
    	if (hasRequired_Promise) return _Promise;
    	hasRequired_Promise = 1;
    	var getNative = require_getNative(),
    	    root = require_root();

    	/* Built-in method references that are verified to be native. */
    	var Promise = getNative(root, 'Promise');

    	_Promise = Promise;
    	return _Promise;
    }

    var _Set;
    var hasRequired_Set;

    function require_Set () {
    	if (hasRequired_Set) return _Set;
    	hasRequired_Set = 1;
    	var getNative = require_getNative(),
    	    root = require_root();

    	/* Built-in method references that are verified to be native. */
    	var Set = getNative(root, 'Set');

    	_Set = Set;
    	return _Set;
    }

    var _WeakMap;
    var hasRequired_WeakMap;

    function require_WeakMap () {
    	if (hasRequired_WeakMap) return _WeakMap;
    	hasRequired_WeakMap = 1;
    	var getNative = require_getNative(),
    	    root = require_root();

    	/* Built-in method references that are verified to be native. */
    	var WeakMap = getNative(root, 'WeakMap');

    	_WeakMap = WeakMap;
    	return _WeakMap;
    }

    var _getTag;
    var hasRequired_getTag;

    function require_getTag () {
    	if (hasRequired_getTag) return _getTag;
    	hasRequired_getTag = 1;
    	var DataView = require_DataView(),
    	    Map = require_Map(),
    	    Promise = require_Promise(),
    	    Set = require_Set(),
    	    WeakMap = require_WeakMap(),
    	    baseGetTag = require_baseGetTag(),
    	    toSource = require_toSource();

    	/** `Object#toString` result references. */
    	var mapTag = '[object Map]',
    	    objectTag = '[object Object]',
    	    promiseTag = '[object Promise]',
    	    setTag = '[object Set]',
    	    weakMapTag = '[object WeakMap]';

    	var dataViewTag = '[object DataView]';

    	/** Used to detect maps, sets, and weakmaps. */
    	var dataViewCtorString = toSource(DataView),
    	    mapCtorString = toSource(Map),
    	    promiseCtorString = toSource(Promise),
    	    setCtorString = toSource(Set),
    	    weakMapCtorString = toSource(WeakMap);

    	/**
    	 * Gets the `toStringTag` of `value`.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @returns {string} Returns the `toStringTag`.
    	 */
    	var getTag = baseGetTag;

    	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    	    (Map && getTag(new Map) != mapTag) ||
    	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    	    (Set && getTag(new Set) != setTag) ||
    	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    	  getTag = function(value) {
    	    var result = baseGetTag(value),
    	        Ctor = result == objectTag ? value.constructor : undefined,
    	        ctorString = Ctor ? toSource(Ctor) : '';

    	    if (ctorString) {
    	      switch (ctorString) {
    	        case dataViewCtorString: return dataViewTag;
    	        case mapCtorString: return mapTag;
    	        case promiseCtorString: return promiseTag;
    	        case setCtorString: return setTag;
    	        case weakMapCtorString: return weakMapTag;
    	      }
    	    }
    	    return result;
    	  };
    	}

    	_getTag = getTag;
    	return _getTag;
    }

    /** Used for built-in method references. */

    var _initCloneArray;
    var hasRequired_initCloneArray;

    function require_initCloneArray () {
    	if (hasRequired_initCloneArray) return _initCloneArray;
    	hasRequired_initCloneArray = 1;
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Initializes an array clone.
    	 *
    	 * @private
    	 * @param {Array} array The array to clone.
    	 * @returns {Array} Returns the initialized clone.
    	 */
    	function initCloneArray(array) {
    	  var length = array.length,
    	      result = new array.constructor(length);

    	  // Add properties assigned by `RegExp#exec`.
    	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    	    result.index = array.index;
    	    result.input = array.input;
    	  }
    	  return result;
    	}

    	_initCloneArray = initCloneArray;
    	return _initCloneArray;
    }

    var _Uint8Array;
    var hasRequired_Uint8Array;

    function require_Uint8Array () {
    	if (hasRequired_Uint8Array) return _Uint8Array;
    	hasRequired_Uint8Array = 1;
    	var root = require_root();

    	/** Built-in value references. */
    	var Uint8Array = root.Uint8Array;

    	_Uint8Array = Uint8Array;
    	return _Uint8Array;
    }

    var _cloneArrayBuffer;
    var hasRequired_cloneArrayBuffer;

    function require_cloneArrayBuffer () {
    	if (hasRequired_cloneArrayBuffer) return _cloneArrayBuffer;
    	hasRequired_cloneArrayBuffer = 1;
    	var Uint8Array = require_Uint8Array();

    	/**
    	 * Creates a clone of `arrayBuffer`.
    	 *
    	 * @private
    	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
    	 * @returns {ArrayBuffer} Returns the cloned array buffer.
    	 */
    	function cloneArrayBuffer(arrayBuffer) {
    	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    	  return result;
    	}

    	_cloneArrayBuffer = cloneArrayBuffer;
    	return _cloneArrayBuffer;
    }

    var _cloneDataView;
    var hasRequired_cloneDataView;

    function require_cloneDataView () {
    	if (hasRequired_cloneDataView) return _cloneDataView;
    	hasRequired_cloneDataView = 1;
    	var cloneArrayBuffer = require_cloneArrayBuffer();

    	/**
    	 * Creates a clone of `dataView`.
    	 *
    	 * @private
    	 * @param {Object} dataView The data view to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned data view.
    	 */
    	function cloneDataView(dataView, isDeep) {
    	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    	}

    	_cloneDataView = cloneDataView;
    	return _cloneDataView;
    }

    /** Used to match `RegExp` flags from their coerced string values. */

    var _cloneRegExp;
    var hasRequired_cloneRegExp;

    function require_cloneRegExp () {
    	if (hasRequired_cloneRegExp) return _cloneRegExp;
    	hasRequired_cloneRegExp = 1;
    	var reFlags = /\w*$/;

    	/**
    	 * Creates a clone of `regexp`.
    	 *
    	 * @private
    	 * @param {Object} regexp The regexp to clone.
    	 * @returns {Object} Returns the cloned regexp.
    	 */
    	function cloneRegExp(regexp) {
    	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    	  result.lastIndex = regexp.lastIndex;
    	  return result;
    	}

    	_cloneRegExp = cloneRegExp;
    	return _cloneRegExp;
    }

    var _cloneSymbol;
    var hasRequired_cloneSymbol;

    function require_cloneSymbol () {
    	if (hasRequired_cloneSymbol) return _cloneSymbol;
    	hasRequired_cloneSymbol = 1;
    	var Symbol = require_Symbol();

    	/** Used to convert symbols to primitives and strings. */
    	var symbolProto = Symbol ? Symbol.prototype : undefined,
    	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    	/**
    	 * Creates a clone of the `symbol` object.
    	 *
    	 * @private
    	 * @param {Object} symbol The symbol object to clone.
    	 * @returns {Object} Returns the cloned symbol object.
    	 */
    	function cloneSymbol(symbol) {
    	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    	}

    	_cloneSymbol = cloneSymbol;
    	return _cloneSymbol;
    }

    var _cloneTypedArray;
    var hasRequired_cloneTypedArray;

    function require_cloneTypedArray () {
    	if (hasRequired_cloneTypedArray) return _cloneTypedArray;
    	hasRequired_cloneTypedArray = 1;
    	var cloneArrayBuffer = require_cloneArrayBuffer();

    	/**
    	 * Creates a clone of `typedArray`.
    	 *
    	 * @private
    	 * @param {Object} typedArray The typed array to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned typed array.
    	 */
    	function cloneTypedArray(typedArray, isDeep) {
    	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    	}

    	_cloneTypedArray = cloneTypedArray;
    	return _cloneTypedArray;
    }

    var _initCloneByTag;
    var hasRequired_initCloneByTag;

    function require_initCloneByTag () {
    	if (hasRequired_initCloneByTag) return _initCloneByTag;
    	hasRequired_initCloneByTag = 1;
    	var cloneArrayBuffer = require_cloneArrayBuffer(),
    	    cloneDataView = require_cloneDataView(),
    	    cloneRegExp = require_cloneRegExp(),
    	    cloneSymbol = require_cloneSymbol(),
    	    cloneTypedArray = require_cloneTypedArray();

    	/** `Object#toString` result references. */
    	var boolTag = '[object Boolean]',
    	    dateTag = '[object Date]',
    	    mapTag = '[object Map]',
    	    numberTag = '[object Number]',
    	    regexpTag = '[object RegExp]',
    	    setTag = '[object Set]',
    	    stringTag = '[object String]',
    	    symbolTag = '[object Symbol]';

    	var arrayBufferTag = '[object ArrayBuffer]',
    	    dataViewTag = '[object DataView]',
    	    float32Tag = '[object Float32Array]',
    	    float64Tag = '[object Float64Array]',
    	    int8Tag = '[object Int8Array]',
    	    int16Tag = '[object Int16Array]',
    	    int32Tag = '[object Int32Array]',
    	    uint8Tag = '[object Uint8Array]',
    	    uint8ClampedTag = '[object Uint8ClampedArray]',
    	    uint16Tag = '[object Uint16Array]',
    	    uint32Tag = '[object Uint32Array]';

    	/**
    	 * Initializes an object clone based on its `toStringTag`.
    	 *
    	 * **Note:** This function only supports cloning values with tags of
    	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
    	 *
    	 * @private
    	 * @param {Object} object The object to clone.
    	 * @param {string} tag The `toStringTag` of the object to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the initialized clone.
    	 */
    	function initCloneByTag(object, tag, isDeep) {
    	  var Ctor = object.constructor;
    	  switch (tag) {
    	    case arrayBufferTag:
    	      return cloneArrayBuffer(object);

    	    case boolTag:
    	    case dateTag:
    	      return new Ctor(+object);

    	    case dataViewTag:
    	      return cloneDataView(object, isDeep);

    	    case float32Tag: case float64Tag:
    	    case int8Tag: case int16Tag: case int32Tag:
    	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
    	      return cloneTypedArray(object, isDeep);

    	    case mapTag:
    	      return new Ctor;

    	    case numberTag:
    	    case stringTag:
    	      return new Ctor(object);

    	    case regexpTag:
    	      return cloneRegExp(object);

    	    case setTag:
    	      return new Ctor;

    	    case symbolTag:
    	      return cloneSymbol(object);
    	  }
    	}

    	_initCloneByTag = initCloneByTag;
    	return _initCloneByTag;
    }

    var _baseCreate;
    var hasRequired_baseCreate;

    function require_baseCreate () {
    	if (hasRequired_baseCreate) return _baseCreate;
    	hasRequired_baseCreate = 1;
    	var isObject = requireIsObject();

    	/** Built-in value references. */
    	var objectCreate = Object.create;

    	/**
    	 * The base implementation of `_.create` without support for assigning
    	 * properties to the created object.
    	 *
    	 * @private
    	 * @param {Object} proto The object to inherit from.
    	 * @returns {Object} Returns the new object.
    	 */
    	var baseCreate = (function() {
    	  function object() {}
    	  return function(proto) {
    	    if (!isObject(proto)) {
    	      return {};
    	    }
    	    if (objectCreate) {
    	      return objectCreate(proto);
    	    }
    	    object.prototype = proto;
    	    var result = new object;
    	    object.prototype = undefined;
    	    return result;
    	  };
    	}());

    	_baseCreate = baseCreate;
    	return _baseCreate;
    }

    var _initCloneObject;
    var hasRequired_initCloneObject;

    function require_initCloneObject () {
    	if (hasRequired_initCloneObject) return _initCloneObject;
    	hasRequired_initCloneObject = 1;
    	var baseCreate = require_baseCreate(),
    	    getPrototype = require_getPrototype(),
    	    isPrototype = require_isPrototype();

    	/**
    	 * Initializes an object clone.
    	 *
    	 * @private
    	 * @param {Object} object The object to clone.
    	 * @returns {Object} Returns the initialized clone.
    	 */
    	function initCloneObject(object) {
    	  return (typeof object.constructor == 'function' && !isPrototype(object))
    	    ? baseCreate(getPrototype(object))
    	    : {};
    	}

    	_initCloneObject = initCloneObject;
    	return _initCloneObject;
    }

    var _baseIsMap;
    var hasRequired_baseIsMap;

    function require_baseIsMap () {
    	if (hasRequired_baseIsMap) return _baseIsMap;
    	hasRequired_baseIsMap = 1;
    	var getTag = require_getTag(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var mapTag = '[object Map]';

    	/**
    	 * The base implementation of `_.isMap` without Node.js optimizations.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
    	 */
    	function baseIsMap(value) {
    	  return isObjectLike(value) && getTag(value) == mapTag;
    	}

    	_baseIsMap = baseIsMap;
    	return _baseIsMap;
    }

    var isMap_1;
    var hasRequiredIsMap;

    function requireIsMap () {
    	if (hasRequiredIsMap) return isMap_1;
    	hasRequiredIsMap = 1;
    	var baseIsMap = require_baseIsMap(),
    	    baseUnary = require_baseUnary(),
    	    nodeUtil = require_nodeUtil();

    	/* Node.js helper references. */
    	var nodeIsMap = nodeUtil && nodeUtil.isMap;

    	/**
    	 * Checks if `value` is classified as a `Map` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.3.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
    	 * @example
    	 *
    	 * _.isMap(new Map);
    	 * // => true
    	 *
    	 * _.isMap(new WeakMap);
    	 * // => false
    	 */
    	var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    	isMap_1 = isMap;
    	return isMap_1;
    }

    var _baseIsSet;
    var hasRequired_baseIsSet;

    function require_baseIsSet () {
    	if (hasRequired_baseIsSet) return _baseIsSet;
    	hasRequired_baseIsSet = 1;
    	var getTag = require_getTag(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var setTag = '[object Set]';

    	/**
    	 * The base implementation of `_.isSet` without Node.js optimizations.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
    	 */
    	function baseIsSet(value) {
    	  return isObjectLike(value) && getTag(value) == setTag;
    	}

    	_baseIsSet = baseIsSet;
    	return _baseIsSet;
    }

    var isSet_1;
    var hasRequiredIsSet;

    function requireIsSet () {
    	if (hasRequiredIsSet) return isSet_1;
    	hasRequiredIsSet = 1;
    	var baseIsSet = require_baseIsSet(),
    	    baseUnary = require_baseUnary(),
    	    nodeUtil = require_nodeUtil();

    	/* Node.js helper references. */
    	var nodeIsSet = nodeUtil && nodeUtil.isSet;

    	/**
    	 * Checks if `value` is classified as a `Set` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.3.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
    	 * @example
    	 *
    	 * _.isSet(new Set);
    	 * // => true
    	 *
    	 * _.isSet(new WeakSet);
    	 * // => false
    	 */
    	var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    	isSet_1 = isSet;
    	return isSet_1;
    }

    var _baseClone;
    var hasRequired_baseClone;

    function require_baseClone () {
    	if (hasRequired_baseClone) return _baseClone;
    	hasRequired_baseClone = 1;
    	var Stack = require_Stack(),
    	    arrayEach = require_arrayEach(),
    	    assignValue = require_assignValue(),
    	    baseAssign = require_baseAssign(),
    	    baseAssignIn = require_baseAssignIn(),
    	    cloneBuffer = require_cloneBuffer(),
    	    copyArray = require_copyArray(),
    	    copySymbols = require_copySymbols(),
    	    copySymbolsIn = require_copySymbolsIn(),
    	    getAllKeys = require_getAllKeys(),
    	    getAllKeysIn = require_getAllKeysIn(),
    	    getTag = require_getTag(),
    	    initCloneArray = require_initCloneArray(),
    	    initCloneByTag = require_initCloneByTag(),
    	    initCloneObject = require_initCloneObject(),
    	    isArray = requireIsArray(),
    	    isBuffer = requireIsBuffer(),
    	    isMap = requireIsMap(),
    	    isObject = requireIsObject(),
    	    isSet = requireIsSet(),
    	    keys = requireKeys(),
    	    keysIn = requireKeysIn();

    	/** Used to compose bitmasks for cloning. */
    	var CLONE_DEEP_FLAG = 1,
    	    CLONE_FLAT_FLAG = 2,
    	    CLONE_SYMBOLS_FLAG = 4;

    	/** `Object#toString` result references. */
    	var argsTag = '[object Arguments]',
    	    arrayTag = '[object Array]',
    	    boolTag = '[object Boolean]',
    	    dateTag = '[object Date]',
    	    errorTag = '[object Error]',
    	    funcTag = '[object Function]',
    	    genTag = '[object GeneratorFunction]',
    	    mapTag = '[object Map]',
    	    numberTag = '[object Number]',
    	    objectTag = '[object Object]',
    	    regexpTag = '[object RegExp]',
    	    setTag = '[object Set]',
    	    stringTag = '[object String]',
    	    symbolTag = '[object Symbol]',
    	    weakMapTag = '[object WeakMap]';

    	var arrayBufferTag = '[object ArrayBuffer]',
    	    dataViewTag = '[object DataView]',
    	    float32Tag = '[object Float32Array]',
    	    float64Tag = '[object Float64Array]',
    	    int8Tag = '[object Int8Array]',
    	    int16Tag = '[object Int16Array]',
    	    int32Tag = '[object Int32Array]',
    	    uint8Tag = '[object Uint8Array]',
    	    uint8ClampedTag = '[object Uint8ClampedArray]',
    	    uint16Tag = '[object Uint16Array]',
    	    uint32Tag = '[object Uint32Array]';

    	/** Used to identify `toStringTag` values supported by `_.clone`. */
    	var cloneableTags = {};
    	cloneableTags[argsTag] = cloneableTags[arrayTag] =
    	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    	cloneableTags[boolTag] = cloneableTags[dateTag] =
    	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    	cloneableTags[int32Tag] = cloneableTags[mapTag] =
    	cloneableTags[numberTag] = cloneableTags[objectTag] =
    	cloneableTags[regexpTag] = cloneableTags[setTag] =
    	cloneableTags[stringTag] = cloneableTags[symbolTag] =
    	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    	cloneableTags[errorTag] = cloneableTags[funcTag] =
    	cloneableTags[weakMapTag] = false;

    	/**
    	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
    	 * traversed objects.
    	 *
    	 * @private
    	 * @param {*} value The value to clone.
    	 * @param {boolean} bitmask The bitmask flags.
    	 *  1 - Deep clone
    	 *  2 - Flatten inherited properties
    	 *  4 - Clone symbols
    	 * @param {Function} [customizer] The function to customize cloning.
    	 * @param {string} [key] The key of `value`.
    	 * @param {Object} [object] The parent object of `value`.
    	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
    	 * @returns {*} Returns the cloned value.
    	 */
    	function baseClone(value, bitmask, customizer, key, object, stack) {
    	  var result,
    	      isDeep = bitmask & CLONE_DEEP_FLAG,
    	      isFlat = bitmask & CLONE_FLAT_FLAG,
    	      isFull = bitmask & CLONE_SYMBOLS_FLAG;

    	  if (customizer) {
    	    result = object ? customizer(value, key, object, stack) : customizer(value);
    	  }
    	  if (result !== undefined) {
    	    return result;
    	  }
    	  if (!isObject(value)) {
    	    return value;
    	  }
    	  var isArr = isArray(value);
    	  if (isArr) {
    	    result = initCloneArray(value);
    	    if (!isDeep) {
    	      return copyArray(value, result);
    	    }
    	  } else {
    	    var tag = getTag(value),
    	        isFunc = tag == funcTag || tag == genTag;

    	    if (isBuffer(value)) {
    	      return cloneBuffer(value, isDeep);
    	    }
    	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
    	      result = (isFlat || isFunc) ? {} : initCloneObject(value);
    	      if (!isDeep) {
    	        return isFlat
    	          ? copySymbolsIn(value, baseAssignIn(result, value))
    	          : copySymbols(value, baseAssign(result, value));
    	      }
    	    } else {
    	      if (!cloneableTags[tag]) {
    	        return object ? value : {};
    	      }
    	      result = initCloneByTag(value, tag, isDeep);
    	    }
    	  }
    	  // Check for circular references and return its corresponding clone.
    	  stack || (stack = new Stack);
    	  var stacked = stack.get(value);
    	  if (stacked) {
    	    return stacked;
    	  }
    	  stack.set(value, result);

    	  if (isSet(value)) {
    	    value.forEach(function(subValue) {
    	      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    	    });
    	  } else if (isMap(value)) {
    	    value.forEach(function(subValue, key) {
    	      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    	    });
    	  }

    	  var keysFunc = isFull
    	    ? (isFlat ? getAllKeysIn : getAllKeys)
    	    : (isFlat ? keysIn : keys);

    	  var props = isArr ? undefined : keysFunc(value);
    	  arrayEach(props || value, function(subValue, key) {
    	    if (props) {
    	      key = subValue;
    	      subValue = value[key];
    	    }
    	    // Recursively populate clone (susceptible to call stack limits).
    	    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    	  });
    	  return result;
    	}

    	_baseClone = baseClone;
    	return _baseClone;
    }

    var clone_1;
    var hasRequiredClone;

    function requireClone () {
    	if (hasRequiredClone) return clone_1;
    	hasRequiredClone = 1;
    	var baseClone = require_baseClone();

    	/** Used to compose bitmasks for cloning. */
    	var CLONE_SYMBOLS_FLAG = 4;

    	/**
    	 * Creates a shallow clone of `value`.
    	 *
    	 * **Note:** This method is loosely based on the
    	 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
    	 * and supports cloning arrays, array buffers, booleans, date objects, maps,
    	 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
    	 * arrays. The own enumerable properties of `arguments` objects are cloned
    	 * as plain objects. An empty object is returned for uncloneable values such
    	 * as error objects, functions, DOM nodes, and WeakMaps.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to clone.
    	 * @returns {*} Returns the cloned value.
    	 * @see _.cloneDeep
    	 * @example
    	 *
    	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
    	 *
    	 * var shallow = _.clone(objects);
    	 * console.log(shallow[0] === objects[0]);
    	 * // => true
    	 */
    	function clone(value) {
    	  return baseClone(value, CLONE_SYMBOLS_FLAG);
    	}

    	clone_1 = clone;
    	return clone_1;
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */

    var constant_1;
    var hasRequiredConstant;

    function requireConstant () {
    	if (hasRequiredConstant) return constant_1;
    	hasRequiredConstant = 1;
    	function constant(value) {
    	  return function() {
    	    return value;
    	  };
    	}

    	constant_1 = constant;
    	return constant_1;
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */

    var _createBaseFor;
    var hasRequired_createBaseFor;

    function require_createBaseFor () {
    	if (hasRequired_createBaseFor) return _createBaseFor;
    	hasRequired_createBaseFor = 1;
    	function createBaseFor(fromRight) {
    	  return function(object, iteratee, keysFunc) {
    	    var index = -1,
    	        iterable = Object(object),
    	        props = keysFunc(object),
    	        length = props.length;

    	    while (length--) {
    	      var key = props[fromRight ? length : ++index];
    	      if (iteratee(iterable[key], key, iterable) === false) {
    	        break;
    	      }
    	    }
    	    return object;
    	  };
    	}

    	_createBaseFor = createBaseFor;
    	return _createBaseFor;
    }

    var _baseFor;
    var hasRequired_baseFor;

    function require_baseFor () {
    	if (hasRequired_baseFor) return _baseFor;
    	hasRequired_baseFor = 1;
    	var createBaseFor = require_createBaseFor();

    	/**
    	 * The base implementation of `baseForOwn` which iterates over `object`
    	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
    	 * Iteratee functions may exit iteration early by explicitly returning `false`.
    	 *
    	 * @private
    	 * @param {Object} object The object to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @param {Function} keysFunc The function to get the keys of `object`.
    	 * @returns {Object} Returns `object`.
    	 */
    	var baseFor = createBaseFor();

    	_baseFor = baseFor;
    	return _baseFor;
    }

    var _baseForOwn;
    var hasRequired_baseForOwn;

    function require_baseForOwn () {
    	if (hasRequired_baseForOwn) return _baseForOwn;
    	hasRequired_baseForOwn = 1;
    	var baseFor = require_baseFor(),
    	    keys = requireKeys();

    	/**
    	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Object} object The object to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @returns {Object} Returns `object`.
    	 */
    	function baseForOwn(object, iteratee) {
    	  return object && baseFor(object, iteratee, keys);
    	}

    	_baseForOwn = baseForOwn;
    	return _baseForOwn;
    }

    var _createBaseEach;
    var hasRequired_createBaseEach;

    function require_createBaseEach () {
    	if (hasRequired_createBaseEach) return _createBaseEach;
    	hasRequired_createBaseEach = 1;
    	var isArrayLike = requireIsArrayLike();

    	/**
    	 * Creates a `baseEach` or `baseEachRight` function.
    	 *
    	 * @private
    	 * @param {Function} eachFunc The function to iterate over a collection.
    	 * @param {boolean} [fromRight] Specify iterating from right to left.
    	 * @returns {Function} Returns the new base function.
    	 */
    	function createBaseEach(eachFunc, fromRight) {
    	  return function(collection, iteratee) {
    	    if (collection == null) {
    	      return collection;
    	    }
    	    if (!isArrayLike(collection)) {
    	      return eachFunc(collection, iteratee);
    	    }
    	    var length = collection.length,
    	        index = fromRight ? length : -1,
    	        iterable = Object(collection);

    	    while ((fromRight ? index-- : ++index < length)) {
    	      if (iteratee(iterable[index], index, iterable) === false) {
    	        break;
    	      }
    	    }
    	    return collection;
    	  };
    	}

    	_createBaseEach = createBaseEach;
    	return _createBaseEach;
    }

    var _baseEach;
    var hasRequired_baseEach;

    function require_baseEach () {
    	if (hasRequired_baseEach) return _baseEach;
    	hasRequired_baseEach = 1;
    	var baseForOwn = require_baseForOwn(),
    	    createBaseEach = require_createBaseEach();

    	/**
    	 * The base implementation of `_.forEach` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @returns {Array|Object} Returns `collection`.
    	 */
    	var baseEach = createBaseEach(baseForOwn);

    	_baseEach = baseEach;
    	return _baseEach;
    }

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */

    var identity_1;
    var hasRequiredIdentity;

    function requireIdentity () {
    	if (hasRequiredIdentity) return identity_1;
    	hasRequiredIdentity = 1;
    	function identity(value) {
    	  return value;
    	}

    	identity_1 = identity;
    	return identity_1;
    }

    var _castFunction;
    var hasRequired_castFunction;

    function require_castFunction () {
    	if (hasRequired_castFunction) return _castFunction;
    	hasRequired_castFunction = 1;
    	var identity = requireIdentity();

    	/**
    	 * Casts `value` to `identity` if it's not a function.
    	 *
    	 * @private
    	 * @param {*} value The value to inspect.
    	 * @returns {Function} Returns cast function.
    	 */
    	function castFunction(value) {
    	  return typeof value == 'function' ? value : identity;
    	}

    	_castFunction = castFunction;
    	return _castFunction;
    }

    var forEach_1;
    var hasRequiredForEach;

    function requireForEach () {
    	if (hasRequiredForEach) return forEach_1;
    	hasRequiredForEach = 1;
    	var arrayEach = require_arrayEach(),
    	    baseEach = require_baseEach(),
    	    castFunction = require_castFunction(),
    	    isArray = requireIsArray();

    	/**
    	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
    	 * The iteratee is invoked with three arguments: (value, index|key, collection).
    	 * Iteratee functions may exit iteration early by explicitly returning `false`.
    	 *
    	 * **Note:** As with other "Collections" methods, objects with a "length"
    	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
    	 * or `_.forOwn` for object iteration.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @alias each
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @returns {Array|Object} Returns `collection`.
    	 * @see _.forEachRight
    	 * @example
    	 *
    	 * _.forEach([1, 2], function(value) {
    	 *   console.log(value);
    	 * });
    	 * // => Logs `1` then `2`.
    	 *
    	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
    	 *   console.log(key);
    	 * });
    	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
    	 */
    	function forEach(collection, iteratee) {
    	  var func = isArray(collection) ? arrayEach : baseEach;
    	  return func(collection, castFunction(iteratee));
    	}

    	forEach_1 = forEach;
    	return forEach_1;
    }

    var each;
    var hasRequiredEach;

    function requireEach () {
    	if (hasRequiredEach) return each;
    	hasRequiredEach = 1;
    	each = requireForEach();
    	return each;
    }

    var _baseFilter;
    var hasRequired_baseFilter;

    function require_baseFilter () {
    	if (hasRequired_baseFilter) return _baseFilter;
    	hasRequired_baseFilter = 1;
    	var baseEach = require_baseEach();

    	/**
    	 * The base implementation of `_.filter` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} predicate The function invoked per iteration.
    	 * @returns {Array} Returns the new filtered array.
    	 */
    	function baseFilter(collection, predicate) {
    	  var result = [];
    	  baseEach(collection, function(value, index, collection) {
    	    if (predicate(value, index, collection)) {
    	      result.push(value);
    	    }
    	  });
    	  return result;
    	}

    	_baseFilter = baseFilter;
    	return _baseFilter;
    }

    /** Used to stand-in for `undefined` hash values. */

    var _setCacheAdd;
    var hasRequired_setCacheAdd;

    function require_setCacheAdd () {
    	if (hasRequired_setCacheAdd) return _setCacheAdd;
    	hasRequired_setCacheAdd = 1;
    	var HASH_UNDEFINED = '__lodash_hash_undefined__';

    	/**
    	 * Adds `value` to the array cache.
    	 *
    	 * @private
    	 * @name add
    	 * @memberOf SetCache
    	 * @alias push
    	 * @param {*} value The value to cache.
    	 * @returns {Object} Returns the cache instance.
    	 */
    	function setCacheAdd(value) {
    	  this.__data__.set(value, HASH_UNDEFINED);
    	  return this;
    	}

    	_setCacheAdd = setCacheAdd;
    	return _setCacheAdd;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */

    var _setCacheHas;
    var hasRequired_setCacheHas;

    function require_setCacheHas () {
    	if (hasRequired_setCacheHas) return _setCacheHas;
    	hasRequired_setCacheHas = 1;
    	function setCacheHas(value) {
    	  return this.__data__.has(value);
    	}

    	_setCacheHas = setCacheHas;
    	return _setCacheHas;
    }

    var _SetCache;
    var hasRequired_SetCache;

    function require_SetCache () {
    	if (hasRequired_SetCache) return _SetCache;
    	hasRequired_SetCache = 1;
    	var MapCache = require_MapCache(),
    	    setCacheAdd = require_setCacheAdd(),
    	    setCacheHas = require_setCacheHas();

    	/**
    	 *
    	 * Creates an array cache object to store unique values.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [values] The values to cache.
    	 */
    	function SetCache(values) {
    	  var index = -1,
    	      length = values == null ? 0 : values.length;

    	  this.__data__ = new MapCache;
    	  while (++index < length) {
    	    this.add(values[index]);
    	  }
    	}

    	// Add methods to `SetCache`.
    	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    	SetCache.prototype.has = setCacheHas;

    	_SetCache = SetCache;
    	return _SetCache;
    }

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */

    var _arraySome;
    var hasRequired_arraySome;

    function require_arraySome () {
    	if (hasRequired_arraySome) return _arraySome;
    	hasRequired_arraySome = 1;
    	function arraySome(array, predicate) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length;

    	  while (++index < length) {
    	    if (predicate(array[index], index, array)) {
    	      return true;
    	    }
    	  }
    	  return false;
    	}

    	_arraySome = arraySome;
    	return _arraySome;
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */

    var _cacheHas;
    var hasRequired_cacheHas;

    function require_cacheHas () {
    	if (hasRequired_cacheHas) return _cacheHas;
    	hasRequired_cacheHas = 1;
    	function cacheHas(cache, key) {
    	  return cache.has(key);
    	}

    	_cacheHas = cacheHas;
    	return _cacheHas;
    }

    var _equalArrays;
    var hasRequired_equalArrays;

    function require_equalArrays () {
    	if (hasRequired_equalArrays) return _equalArrays;
    	hasRequired_equalArrays = 1;
    	var SetCache = require_SetCache(),
    	    arraySome = require_arraySome(),
    	    cacheHas = require_cacheHas();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1,
    	    COMPARE_UNORDERED_FLAG = 2;

    	/**
    	 * A specialized version of `baseIsEqualDeep` for arrays with support for
    	 * partial deep comparisons.
    	 *
    	 * @private
    	 * @param {Array} array The array to compare.
    	 * @param {Array} other The other array to compare.
    	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
    	 * @param {Function} customizer The function to customize comparisons.
    	 * @param {Function} equalFunc The function to determine equivalents of values.
    	 * @param {Object} stack Tracks traversed `array` and `other` objects.
    	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
    	 */
    	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    	      arrLength = array.length,
    	      othLength = other.length;

    	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    	    return false;
    	  }
    	  // Check that cyclic values are equal.
    	  var arrStacked = stack.get(array);
    	  var othStacked = stack.get(other);
    	  if (arrStacked && othStacked) {
    	    return arrStacked == other && othStacked == array;
    	  }
    	  var index = -1,
    	      result = true,
    	      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

    	  stack.set(array, other);
    	  stack.set(other, array);

    	  // Ignore non-index properties.
    	  while (++index < arrLength) {
    	    var arrValue = array[index],
    	        othValue = other[index];

    	    if (customizer) {
    	      var compared = isPartial
    	        ? customizer(othValue, arrValue, index, other, array, stack)
    	        : customizer(arrValue, othValue, index, array, other, stack);
    	    }
    	    if (compared !== undefined) {
    	      if (compared) {
    	        continue;
    	      }
    	      result = false;
    	      break;
    	    }
    	    // Recursively compare arrays (susceptible to call stack limits).
    	    if (seen) {
    	      if (!arraySome(other, function(othValue, othIndex) {
    	            if (!cacheHas(seen, othIndex) &&
    	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
    	              return seen.push(othIndex);
    	            }
    	          })) {
    	        result = false;
    	        break;
    	      }
    	    } else if (!(
    	          arrValue === othValue ||
    	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
    	        )) {
    	      result = false;
    	      break;
    	    }
    	  }
    	  stack['delete'](array);
    	  stack['delete'](other);
    	  return result;
    	}

    	_equalArrays = equalArrays;
    	return _equalArrays;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */

    var _mapToArray;
    var hasRequired_mapToArray;

    function require_mapToArray () {
    	if (hasRequired_mapToArray) return _mapToArray;
    	hasRequired_mapToArray = 1;
    	function mapToArray(map) {
    	  var index = -1,
    	      result = Array(map.size);

    	  map.forEach(function(value, key) {
    	    result[++index] = [key, value];
    	  });
    	  return result;
    	}

    	_mapToArray = mapToArray;
    	return _mapToArray;
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */

    var _setToArray;
    var hasRequired_setToArray;

    function require_setToArray () {
    	if (hasRequired_setToArray) return _setToArray;
    	hasRequired_setToArray = 1;
    	function setToArray(set) {
    	  var index = -1,
    	      result = Array(set.size);

    	  set.forEach(function(value) {
    	    result[++index] = value;
    	  });
    	  return result;
    	}

    	_setToArray = setToArray;
    	return _setToArray;
    }

    var _equalByTag;
    var hasRequired_equalByTag;

    function require_equalByTag () {
    	if (hasRequired_equalByTag) return _equalByTag;
    	hasRequired_equalByTag = 1;
    	var Symbol = require_Symbol(),
    	    Uint8Array = require_Uint8Array(),
    	    eq = requireEq(),
    	    equalArrays = require_equalArrays(),
    	    mapToArray = require_mapToArray(),
    	    setToArray = require_setToArray();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1,
    	    COMPARE_UNORDERED_FLAG = 2;

    	/** `Object#toString` result references. */
    	var boolTag = '[object Boolean]',
    	    dateTag = '[object Date]',
    	    errorTag = '[object Error]',
    	    mapTag = '[object Map]',
    	    numberTag = '[object Number]',
    	    regexpTag = '[object RegExp]',
    	    setTag = '[object Set]',
    	    stringTag = '[object String]',
    	    symbolTag = '[object Symbol]';

    	var arrayBufferTag = '[object ArrayBuffer]',
    	    dataViewTag = '[object DataView]';

    	/** Used to convert symbols to primitives and strings. */
    	var symbolProto = Symbol ? Symbol.prototype : undefined,
    	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    	/**
    	 * A specialized version of `baseIsEqualDeep` for comparing objects of
    	 * the same `toStringTag`.
    	 *
    	 * **Note:** This function only supports comparing values with tags of
    	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
    	 *
    	 * @private
    	 * @param {Object} object The object to compare.
    	 * @param {Object} other The other object to compare.
    	 * @param {string} tag The `toStringTag` of the objects to compare.
    	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
    	 * @param {Function} customizer The function to customize comparisons.
    	 * @param {Function} equalFunc The function to determine equivalents of values.
    	 * @param {Object} stack Tracks traversed `object` and `other` objects.
    	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
    	 */
    	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    	  switch (tag) {
    	    case dataViewTag:
    	      if ((object.byteLength != other.byteLength) ||
    	          (object.byteOffset != other.byteOffset)) {
    	        return false;
    	      }
    	      object = object.buffer;
    	      other = other.buffer;

    	    case arrayBufferTag:
    	      if ((object.byteLength != other.byteLength) ||
    	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
    	        return false;
    	      }
    	      return true;

    	    case boolTag:
    	    case dateTag:
    	    case numberTag:
    	      // Coerce booleans to `1` or `0` and dates to milliseconds.
    	      // Invalid dates are coerced to `NaN`.
    	      return eq(+object, +other);

    	    case errorTag:
    	      return object.name == other.name && object.message == other.message;

    	    case regexpTag:
    	    case stringTag:
    	      // Coerce regexes to strings and treat strings, primitives and objects,
    	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
    	      // for more details.
    	      return object == (other + '');

    	    case mapTag:
    	      var convert = mapToArray;

    	    case setTag:
    	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
    	      convert || (convert = setToArray);

    	      if (object.size != other.size && !isPartial) {
    	        return false;
    	      }
    	      // Assume cyclic values are equal.
    	      var stacked = stack.get(object);
    	      if (stacked) {
    	        return stacked == other;
    	      }
    	      bitmask |= COMPARE_UNORDERED_FLAG;

    	      // Recursively compare objects (susceptible to call stack limits).
    	      stack.set(object, other);
    	      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
    	      stack['delete'](object);
    	      return result;

    	    case symbolTag:
    	      if (symbolValueOf) {
    	        return symbolValueOf.call(object) == symbolValueOf.call(other);
    	      }
    	  }
    	  return false;
    	}

    	_equalByTag = equalByTag;
    	return _equalByTag;
    }

    var _equalObjects;
    var hasRequired_equalObjects;

    function require_equalObjects () {
    	if (hasRequired_equalObjects) return _equalObjects;
    	hasRequired_equalObjects = 1;
    	var getAllKeys = require_getAllKeys();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1;

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * A specialized version of `baseIsEqualDeep` for objects with support for
    	 * partial deep comparisons.
    	 *
    	 * @private
    	 * @param {Object} object The object to compare.
    	 * @param {Object} other The other object to compare.
    	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
    	 * @param {Function} customizer The function to customize comparisons.
    	 * @param {Function} equalFunc The function to determine equivalents of values.
    	 * @param {Object} stack Tracks traversed `object` and `other` objects.
    	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
    	 */
    	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
    	      objProps = getAllKeys(object),
    	      objLength = objProps.length,
    	      othProps = getAllKeys(other),
    	      othLength = othProps.length;

    	  if (objLength != othLength && !isPartial) {
    	    return false;
    	  }
    	  var index = objLength;
    	  while (index--) {
    	    var key = objProps[index];
    	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
    	      return false;
    	    }
    	  }
    	  // Check that cyclic values are equal.
    	  var objStacked = stack.get(object);
    	  var othStacked = stack.get(other);
    	  if (objStacked && othStacked) {
    	    return objStacked == other && othStacked == object;
    	  }
    	  var result = true;
    	  stack.set(object, other);
    	  stack.set(other, object);

    	  var skipCtor = isPartial;
    	  while (++index < objLength) {
    	    key = objProps[index];
    	    var objValue = object[key],
    	        othValue = other[key];

    	    if (customizer) {
    	      var compared = isPartial
    	        ? customizer(othValue, objValue, key, other, object, stack)
    	        : customizer(objValue, othValue, key, object, other, stack);
    	    }
    	    // Recursively compare objects (susceptible to call stack limits).
    	    if (!(compared === undefined
    	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
    	          : compared
    	        )) {
    	      result = false;
    	      break;
    	    }
    	    skipCtor || (skipCtor = key == 'constructor');
    	  }
    	  if (result && !skipCtor) {
    	    var objCtor = object.constructor,
    	        othCtor = other.constructor;

    	    // Non `Object` object instances with different constructors are not equal.
    	    if (objCtor != othCtor &&
    	        ('constructor' in object && 'constructor' in other) &&
    	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
    	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
    	      result = false;
    	    }
    	  }
    	  stack['delete'](object);
    	  stack['delete'](other);
    	  return result;
    	}

    	_equalObjects = equalObjects;
    	return _equalObjects;
    }

    var _baseIsEqualDeep;
    var hasRequired_baseIsEqualDeep;

    function require_baseIsEqualDeep () {
    	if (hasRequired_baseIsEqualDeep) return _baseIsEqualDeep;
    	hasRequired_baseIsEqualDeep = 1;
    	var Stack = require_Stack(),
    	    equalArrays = require_equalArrays(),
    	    equalByTag = require_equalByTag(),
    	    equalObjects = require_equalObjects(),
    	    getTag = require_getTag(),
    	    isArray = requireIsArray(),
    	    isBuffer = requireIsBuffer(),
    	    isTypedArray = requireIsTypedArray();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1;

    	/** `Object#toString` result references. */
    	var argsTag = '[object Arguments]',
    	    arrayTag = '[object Array]',
    	    objectTag = '[object Object]';

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * A specialized version of `baseIsEqual` for arrays and objects which performs
    	 * deep comparisons and tracks traversed objects enabling objects with circular
    	 * references to be compared.
    	 *
    	 * @private
    	 * @param {Object} object The object to compare.
    	 * @param {Object} other The other object to compare.
    	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
    	 * @param {Function} customizer The function to customize comparisons.
    	 * @param {Function} equalFunc The function to determine equivalents of values.
    	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
    	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
    	 */
    	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    	  var objIsArr = isArray(object),
    	      othIsArr = isArray(other),
    	      objTag = objIsArr ? arrayTag : getTag(object),
    	      othTag = othIsArr ? arrayTag : getTag(other);

    	  objTag = objTag == argsTag ? objectTag : objTag;
    	  othTag = othTag == argsTag ? objectTag : othTag;

    	  var objIsObj = objTag == objectTag,
    	      othIsObj = othTag == objectTag,
    	      isSameTag = objTag == othTag;

    	  if (isSameTag && isBuffer(object)) {
    	    if (!isBuffer(other)) {
    	      return false;
    	    }
    	    objIsArr = true;
    	    objIsObj = false;
    	  }
    	  if (isSameTag && !objIsObj) {
    	    stack || (stack = new Stack);
    	    return (objIsArr || isTypedArray(object))
    	      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
    	      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    	  }
    	  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
    	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    	    if (objIsWrapped || othIsWrapped) {
    	      var objUnwrapped = objIsWrapped ? object.value() : object,
    	          othUnwrapped = othIsWrapped ? other.value() : other;

    	      stack || (stack = new Stack);
    	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    	    }
    	  }
    	  if (!isSameTag) {
    	    return false;
    	  }
    	  stack || (stack = new Stack);
    	  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    	}

    	_baseIsEqualDeep = baseIsEqualDeep;
    	return _baseIsEqualDeep;
    }

    var _baseIsEqual;
    var hasRequired_baseIsEqual;

    function require_baseIsEqual () {
    	if (hasRequired_baseIsEqual) return _baseIsEqual;
    	hasRequired_baseIsEqual = 1;
    	var baseIsEqualDeep = require_baseIsEqualDeep(),
    	    isObjectLike = requireIsObjectLike();

    	/**
    	 * The base implementation of `_.isEqual` which supports partial comparisons
    	 * and tracks traversed objects.
    	 *
    	 * @private
    	 * @param {*} value The value to compare.
    	 * @param {*} other The other value to compare.
    	 * @param {boolean} bitmask The bitmask flags.
    	 *  1 - Unordered comparison
    	 *  2 - Partial comparison
    	 * @param {Function} [customizer] The function to customize comparisons.
    	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
    	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
    	 */
    	function baseIsEqual(value, other, bitmask, customizer, stack) {
    	  if (value === other) {
    	    return true;
    	  }
    	  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    	    return value !== value && other !== other;
    	  }
    	  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    	}

    	_baseIsEqual = baseIsEqual;
    	return _baseIsEqual;
    }

    var _baseIsMatch;
    var hasRequired_baseIsMatch;

    function require_baseIsMatch () {
    	if (hasRequired_baseIsMatch) return _baseIsMatch;
    	hasRequired_baseIsMatch = 1;
    	var Stack = require_Stack(),
    	    baseIsEqual = require_baseIsEqual();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1,
    	    COMPARE_UNORDERED_FLAG = 2;

    	/**
    	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Object} object The object to inspect.
    	 * @param {Object} source The object of property values to match.
    	 * @param {Array} matchData The property names, values, and compare flags to match.
    	 * @param {Function} [customizer] The function to customize comparisons.
    	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
    	 */
    	function baseIsMatch(object, source, matchData, customizer) {
    	  var index = matchData.length,
    	      length = index,
    	      noCustomizer = !customizer;

    	  if (object == null) {
    	    return !length;
    	  }
    	  object = Object(object);
    	  while (index--) {
    	    var data = matchData[index];
    	    if ((noCustomizer && data[2])
    	          ? data[1] !== object[data[0]]
    	          : !(data[0] in object)
    	        ) {
    	      return false;
    	    }
    	  }
    	  while (++index < length) {
    	    data = matchData[index];
    	    var key = data[0],
    	        objValue = object[key],
    	        srcValue = data[1];

    	    if (noCustomizer && data[2]) {
    	      if (objValue === undefined && !(key in object)) {
    	        return false;
    	      }
    	    } else {
    	      var stack = new Stack;
    	      if (customizer) {
    	        var result = customizer(objValue, srcValue, key, object, source, stack);
    	      }
    	      if (!(result === undefined
    	            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
    	            : result
    	          )) {
    	        return false;
    	      }
    	    }
    	  }
    	  return true;
    	}

    	_baseIsMatch = baseIsMatch;
    	return _baseIsMatch;
    }

    var _isStrictComparable;
    var hasRequired_isStrictComparable;

    function require_isStrictComparable () {
    	if (hasRequired_isStrictComparable) return _isStrictComparable;
    	hasRequired_isStrictComparable = 1;
    	var isObject = requireIsObject();

    	/**
    	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` if suitable for strict
    	 *  equality comparisons, else `false`.
    	 */
    	function isStrictComparable(value) {
    	  return value === value && !isObject(value);
    	}

    	_isStrictComparable = isStrictComparable;
    	return _isStrictComparable;
    }

    var _getMatchData;
    var hasRequired_getMatchData;

    function require_getMatchData () {
    	if (hasRequired_getMatchData) return _getMatchData;
    	hasRequired_getMatchData = 1;
    	var isStrictComparable = require_isStrictComparable(),
    	    keys = requireKeys();

    	/**
    	 * Gets the property names, values, and compare flags of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the match data of `object`.
    	 */
    	function getMatchData(object) {
    	  var result = keys(object),
    	      length = result.length;

    	  while (length--) {
    	    var key = result[length],
    	        value = object[key];

    	    result[length] = [key, value, isStrictComparable(value)];
    	  }
    	  return result;
    	}

    	_getMatchData = getMatchData;
    	return _getMatchData;
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */

    var _matchesStrictComparable;
    var hasRequired_matchesStrictComparable;

    function require_matchesStrictComparable () {
    	if (hasRequired_matchesStrictComparable) return _matchesStrictComparable;
    	hasRequired_matchesStrictComparable = 1;
    	function matchesStrictComparable(key, srcValue) {
    	  return function(object) {
    	    if (object == null) {
    	      return false;
    	    }
    	    return object[key] === srcValue &&
    	      (srcValue !== undefined || (key in Object(object)));
    	  };
    	}

    	_matchesStrictComparable = matchesStrictComparable;
    	return _matchesStrictComparable;
    }

    var _baseMatches;
    var hasRequired_baseMatches;

    function require_baseMatches () {
    	if (hasRequired_baseMatches) return _baseMatches;
    	hasRequired_baseMatches = 1;
    	var baseIsMatch = require_baseIsMatch(),
    	    getMatchData = require_getMatchData(),
    	    matchesStrictComparable = require_matchesStrictComparable();

    	/**
    	 * The base implementation of `_.matches` which doesn't clone `source`.
    	 *
    	 * @private
    	 * @param {Object} source The object of property values to match.
    	 * @returns {Function} Returns the new spec function.
    	 */
    	function baseMatches(source) {
    	  var matchData = getMatchData(source);
    	  if (matchData.length == 1 && matchData[0][2]) {
    	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    	  }
    	  return function(object) {
    	    return object === source || baseIsMatch(object, source, matchData);
    	  };
    	}

    	_baseMatches = baseMatches;
    	return _baseMatches;
    }

    var isSymbol_1;
    var hasRequiredIsSymbol;

    function requireIsSymbol () {
    	if (hasRequiredIsSymbol) return isSymbol_1;
    	hasRequiredIsSymbol = 1;
    	var baseGetTag = require_baseGetTag(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var symbolTag = '[object Symbol]';

    	/**
    	 * Checks if `value` is classified as a `Symbol` primitive or object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
    	 * @example
    	 *
    	 * _.isSymbol(Symbol.iterator);
    	 * // => true
    	 *
    	 * _.isSymbol('abc');
    	 * // => false
    	 */
    	function isSymbol(value) {
    	  return typeof value == 'symbol' ||
    	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
    	}

    	isSymbol_1 = isSymbol;
    	return isSymbol_1;
    }

    var _isKey;
    var hasRequired_isKey;

    function require_isKey () {
    	if (hasRequired_isKey) return _isKey;
    	hasRequired_isKey = 1;
    	var isArray = requireIsArray(),
    	    isSymbol = requireIsSymbol();

    	/** Used to match property names within property paths. */
    	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    	    reIsPlainProp = /^\w*$/;

    	/**
    	 * Checks if `value` is a property name and not a property path.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @param {Object} [object] The object to query keys on.
    	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
    	 */
    	function isKey(value, object) {
    	  if (isArray(value)) {
    	    return false;
    	  }
    	  var type = typeof value;
    	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
    	      value == null || isSymbol(value)) {
    	    return true;
    	  }
    	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    	    (object != null && value in Object(object));
    	}

    	_isKey = isKey;
    	return _isKey;
    }

    var memoize_1;
    var hasRequiredMemoize;

    function requireMemoize () {
    	if (hasRequiredMemoize) return memoize_1;
    	hasRequiredMemoize = 1;
    	var MapCache = require_MapCache();

    	/** Error message constants. */
    	var FUNC_ERROR_TEXT = 'Expected a function';

    	/**
    	 * Creates a function that memoizes the result of `func`. If `resolver` is
    	 * provided, it determines the cache key for storing the result based on the
    	 * arguments provided to the memoized function. By default, the first argument
    	 * provided to the memoized function is used as the map cache key. The `func`
    	 * is invoked with the `this` binding of the memoized function.
    	 *
    	 * **Note:** The cache is exposed as the `cache` property on the memoized
    	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
    	 * constructor with one whose instances implement the
    	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
    	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Function
    	 * @param {Function} func The function to have its output memoized.
    	 * @param {Function} [resolver] The function to resolve the cache key.
    	 * @returns {Function} Returns the new memoized function.
    	 * @example
    	 *
    	 * var object = { 'a': 1, 'b': 2 };
    	 * var other = { 'c': 3, 'd': 4 };
    	 *
    	 * var values = _.memoize(_.values);
    	 * values(object);
    	 * // => [1, 2]
    	 *
    	 * values(other);
    	 * // => [3, 4]
    	 *
    	 * object.a = 2;
    	 * values(object);
    	 * // => [1, 2]
    	 *
    	 * // Modify the result cache.
    	 * values.cache.set(object, ['a', 'b']);
    	 * values(object);
    	 * // => ['a', 'b']
    	 *
    	 * // Replace `_.memoize.Cache`.
    	 * _.memoize.Cache = WeakMap;
    	 */
    	function memoize(func, resolver) {
    	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    	    throw new TypeError(FUNC_ERROR_TEXT);
    	  }
    	  var memoized = function() {
    	    var args = arguments,
    	        key = resolver ? resolver.apply(this, args) : args[0],
    	        cache = memoized.cache;

    	    if (cache.has(key)) {
    	      return cache.get(key);
    	    }
    	    var result = func.apply(this, args);
    	    memoized.cache = cache.set(key, result) || cache;
    	    return result;
    	  };
    	  memoized.cache = new (memoize.Cache || MapCache);
    	  return memoized;
    	}

    	// Expose `MapCache`.
    	memoize.Cache = MapCache;

    	memoize_1 = memoize;
    	return memoize_1;
    }

    var _memoizeCapped;
    var hasRequired_memoizeCapped;

    function require_memoizeCapped () {
    	if (hasRequired_memoizeCapped) return _memoizeCapped;
    	hasRequired_memoizeCapped = 1;
    	var memoize = requireMemoize();

    	/** Used as the maximum memoize cache size. */
    	var MAX_MEMOIZE_SIZE = 500;

    	/**
    	 * A specialized version of `_.memoize` which clears the memoized function's
    	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
    	 *
    	 * @private
    	 * @param {Function} func The function to have its output memoized.
    	 * @returns {Function} Returns the new memoized function.
    	 */
    	function memoizeCapped(func) {
    	  var result = memoize(func, function(key) {
    	    if (cache.size === MAX_MEMOIZE_SIZE) {
    	      cache.clear();
    	    }
    	    return key;
    	  });

    	  var cache = result.cache;
    	  return result;
    	}

    	_memoizeCapped = memoizeCapped;
    	return _memoizeCapped;
    }

    var _stringToPath;
    var hasRequired_stringToPath;

    function require_stringToPath () {
    	if (hasRequired_stringToPath) return _stringToPath;
    	hasRequired_stringToPath = 1;
    	var memoizeCapped = require_memoizeCapped();

    	/** Used to match property names within property paths. */
    	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    	/** Used to match backslashes in property paths. */
    	var reEscapeChar = /\\(\\)?/g;

    	/**
    	 * Converts `string` to a property path array.
    	 *
    	 * @private
    	 * @param {string} string The string to convert.
    	 * @returns {Array} Returns the property path array.
    	 */
    	var stringToPath = memoizeCapped(function(string) {
    	  var result = [];
    	  if (string.charCodeAt(0) === 46 /* . */) {
    	    result.push('');
    	  }
    	  string.replace(rePropName, function(match, number, quote, subString) {
    	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    	  });
    	  return result;
    	});

    	_stringToPath = stringToPath;
    	return _stringToPath;
    }

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */

    var _arrayMap;
    var hasRequired_arrayMap;

    function require_arrayMap () {
    	if (hasRequired_arrayMap) return _arrayMap;
    	hasRequired_arrayMap = 1;
    	function arrayMap(array, iteratee) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length,
    	      result = Array(length);

    	  while (++index < length) {
    	    result[index] = iteratee(array[index], index, array);
    	  }
    	  return result;
    	}

    	_arrayMap = arrayMap;
    	return _arrayMap;
    }

    var _baseToString;
    var hasRequired_baseToString;

    function require_baseToString () {
    	if (hasRequired_baseToString) return _baseToString;
    	hasRequired_baseToString = 1;
    	var Symbol = require_Symbol(),
    	    arrayMap = require_arrayMap(),
    	    isArray = requireIsArray(),
    	    isSymbol = requireIsSymbol();

    	/** Used as references for various `Number` constants. */
    	var INFINITY = 1 / 0;

    	/** Used to convert symbols to primitives and strings. */
    	var symbolProto = Symbol ? Symbol.prototype : undefined,
    	    symbolToString = symbolProto ? symbolProto.toString : undefined;

    	/**
    	 * The base implementation of `_.toString` which doesn't convert nullish
    	 * values to empty strings.
    	 *
    	 * @private
    	 * @param {*} value The value to process.
    	 * @returns {string} Returns the string.
    	 */
    	function baseToString(value) {
    	  // Exit early for strings to avoid a performance hit in some environments.
    	  if (typeof value == 'string') {
    	    return value;
    	  }
    	  if (isArray(value)) {
    	    // Recursively convert values (susceptible to call stack limits).
    	    return arrayMap(value, baseToString) + '';
    	  }
    	  if (isSymbol(value)) {
    	    return symbolToString ? symbolToString.call(value) : '';
    	  }
    	  var result = (value + '');
    	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    	}

    	_baseToString = baseToString;
    	return _baseToString;
    }

    var toString_1;
    var hasRequiredToString;

    function requireToString () {
    	if (hasRequiredToString) return toString_1;
    	hasRequiredToString = 1;
    	var baseToString = require_baseToString();

    	/**
    	 * Converts `value` to a string. An empty string is returned for `null`
    	 * and `undefined` values. The sign of `-0` is preserved.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to convert.
    	 * @returns {string} Returns the converted string.
    	 * @example
    	 *
    	 * _.toString(null);
    	 * // => ''
    	 *
    	 * _.toString(-0);
    	 * // => '-0'
    	 *
    	 * _.toString([1, 2, 3]);
    	 * // => '1,2,3'
    	 */
    	function toString(value) {
    	  return value == null ? '' : baseToString(value);
    	}

    	toString_1 = toString;
    	return toString_1;
    }

    var _castPath;
    var hasRequired_castPath;

    function require_castPath () {
    	if (hasRequired_castPath) return _castPath;
    	hasRequired_castPath = 1;
    	var isArray = requireIsArray(),
    	    isKey = require_isKey(),
    	    stringToPath = require_stringToPath(),
    	    toString = requireToString();

    	/**
    	 * Casts `value` to a path array if it's not one.
    	 *
    	 * @private
    	 * @param {*} value The value to inspect.
    	 * @param {Object} [object] The object to query keys on.
    	 * @returns {Array} Returns the cast property path array.
    	 */
    	function castPath(value, object) {
    	  if (isArray(value)) {
    	    return value;
    	  }
    	  return isKey(value, object) ? [value] : stringToPath(toString(value));
    	}

    	_castPath = castPath;
    	return _castPath;
    }

    var _toKey;
    var hasRequired_toKey;

    function require_toKey () {
    	if (hasRequired_toKey) return _toKey;
    	hasRequired_toKey = 1;
    	var isSymbol = requireIsSymbol();

    	/** Used as references for various `Number` constants. */
    	var INFINITY = 1 / 0;

    	/**
    	 * Converts `value` to a string key if it's not a string or symbol.
    	 *
    	 * @private
    	 * @param {*} value The value to inspect.
    	 * @returns {string|symbol} Returns the key.
    	 */
    	function toKey(value) {
    	  if (typeof value == 'string' || isSymbol(value)) {
    	    return value;
    	  }
    	  var result = (value + '');
    	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    	}

    	_toKey = toKey;
    	return _toKey;
    }

    var _baseGet;
    var hasRequired_baseGet;

    function require_baseGet () {
    	if (hasRequired_baseGet) return _baseGet;
    	hasRequired_baseGet = 1;
    	var castPath = require_castPath(),
    	    toKey = require_toKey();

    	/**
    	 * The base implementation of `_.get` without support for default values.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {Array|string} path The path of the property to get.
    	 * @returns {*} Returns the resolved value.
    	 */
    	function baseGet(object, path) {
    	  path = castPath(path, object);

    	  var index = 0,
    	      length = path.length;

    	  while (object != null && index < length) {
    	    object = object[toKey(path[index++])];
    	  }
    	  return (index && index == length) ? object : undefined;
    	}

    	_baseGet = baseGet;
    	return _baseGet;
    }

    var get_1;
    var hasRequiredGet;

    function requireGet () {
    	if (hasRequiredGet) return get_1;
    	hasRequiredGet = 1;
    	var baseGet = require_baseGet();

    	/**
    	 * Gets the value at `path` of `object`. If the resolved value is
    	 * `undefined`, the `defaultValue` is returned in its place.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 3.7.0
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @param {Array|string} path The path of the property to get.
    	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
    	 * @returns {*} Returns the resolved value.
    	 * @example
    	 *
    	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
    	 *
    	 * _.get(object, 'a[0].b.c');
    	 * // => 3
    	 *
    	 * _.get(object, ['a', '0', 'b', 'c']);
    	 * // => 3
    	 *
    	 * _.get(object, 'a.b.c', 'default');
    	 * // => 'default'
    	 */
    	function get(object, path, defaultValue) {
    	  var result = object == null ? undefined : baseGet(object, path);
    	  return result === undefined ? defaultValue : result;
    	}

    	get_1 = get;
    	return get_1;
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */

    var _baseHasIn;
    var hasRequired_baseHasIn;

    function require_baseHasIn () {
    	if (hasRequired_baseHasIn) return _baseHasIn;
    	hasRequired_baseHasIn = 1;
    	function baseHasIn(object, key) {
    	  return object != null && key in Object(object);
    	}

    	_baseHasIn = baseHasIn;
    	return _baseHasIn;
    }

    var _hasPath;
    var hasRequired_hasPath;

    function require_hasPath () {
    	if (hasRequired_hasPath) return _hasPath;
    	hasRequired_hasPath = 1;
    	var castPath = require_castPath(),
    	    isArguments = requireIsArguments(),
    	    isArray = requireIsArray(),
    	    isIndex = require_isIndex(),
    	    isLength = requireIsLength(),
    	    toKey = require_toKey();

    	/**
    	 * Checks if `path` exists on `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {Array|string} path The path to check.
    	 * @param {Function} hasFunc The function to check properties.
    	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
    	 */
    	function hasPath(object, path, hasFunc) {
    	  path = castPath(path, object);

    	  var index = -1,
    	      length = path.length,
    	      result = false;

    	  while (++index < length) {
    	    var key = toKey(path[index]);
    	    if (!(result = object != null && hasFunc(object, key))) {
    	      break;
    	    }
    	    object = object[key];
    	  }
    	  if (result || ++index != length) {
    	    return result;
    	  }
    	  length = object == null ? 0 : object.length;
    	  return !!length && isLength(length) && isIndex(key, length) &&
    	    (isArray(object) || isArguments(object));
    	}

    	_hasPath = hasPath;
    	return _hasPath;
    }

    var hasIn_1;
    var hasRequiredHasIn;

    function requireHasIn () {
    	if (hasRequiredHasIn) return hasIn_1;
    	hasRequiredHasIn = 1;
    	var baseHasIn = require_baseHasIn(),
    	    hasPath = require_hasPath();

    	/**
    	 * Checks if `path` is a direct or inherited property of `object`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @param {Array|string} path The path to check.
    	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
    	 * @example
    	 *
    	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
    	 *
    	 * _.hasIn(object, 'a');
    	 * // => true
    	 *
    	 * _.hasIn(object, 'a.b');
    	 * // => true
    	 *
    	 * _.hasIn(object, ['a', 'b']);
    	 * // => true
    	 *
    	 * _.hasIn(object, 'b');
    	 * // => false
    	 */
    	function hasIn(object, path) {
    	  return object != null && hasPath(object, path, baseHasIn);
    	}

    	hasIn_1 = hasIn;
    	return hasIn_1;
    }

    var _baseMatchesProperty;
    var hasRequired_baseMatchesProperty;

    function require_baseMatchesProperty () {
    	if (hasRequired_baseMatchesProperty) return _baseMatchesProperty;
    	hasRequired_baseMatchesProperty = 1;
    	var baseIsEqual = require_baseIsEqual(),
    	    get = requireGet(),
    	    hasIn = requireHasIn(),
    	    isKey = require_isKey(),
    	    isStrictComparable = require_isStrictComparable(),
    	    matchesStrictComparable = require_matchesStrictComparable(),
    	    toKey = require_toKey();

    	/** Used to compose bitmasks for value comparisons. */
    	var COMPARE_PARTIAL_FLAG = 1,
    	    COMPARE_UNORDERED_FLAG = 2;

    	/**
    	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
    	 *
    	 * @private
    	 * @param {string} path The path of the property to get.
    	 * @param {*} srcValue The value to match.
    	 * @returns {Function} Returns the new spec function.
    	 */
    	function baseMatchesProperty(path, srcValue) {
    	  if (isKey(path) && isStrictComparable(srcValue)) {
    	    return matchesStrictComparable(toKey(path), srcValue);
    	  }
    	  return function(object) {
    	    var objValue = get(object, path);
    	    return (objValue === undefined && objValue === srcValue)
    	      ? hasIn(object, path)
    	      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    	  };
    	}

    	_baseMatchesProperty = baseMatchesProperty;
    	return _baseMatchesProperty;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */

    var _baseProperty;
    var hasRequired_baseProperty;

    function require_baseProperty () {
    	if (hasRequired_baseProperty) return _baseProperty;
    	hasRequired_baseProperty = 1;
    	function baseProperty(key) {
    	  return function(object) {
    	    return object == null ? undefined : object[key];
    	  };
    	}

    	_baseProperty = baseProperty;
    	return _baseProperty;
    }

    var _basePropertyDeep;
    var hasRequired_basePropertyDeep;

    function require_basePropertyDeep () {
    	if (hasRequired_basePropertyDeep) return _basePropertyDeep;
    	hasRequired_basePropertyDeep = 1;
    	var baseGet = require_baseGet();

    	/**
    	 * A specialized version of `baseProperty` which supports deep paths.
    	 *
    	 * @private
    	 * @param {Array|string} path The path of the property to get.
    	 * @returns {Function} Returns the new accessor function.
    	 */
    	function basePropertyDeep(path) {
    	  return function(object) {
    	    return baseGet(object, path);
    	  };
    	}

    	_basePropertyDeep = basePropertyDeep;
    	return _basePropertyDeep;
    }

    var property_1;
    var hasRequiredProperty;

    function requireProperty () {
    	if (hasRequiredProperty) return property_1;
    	hasRequiredProperty = 1;
    	var baseProperty = require_baseProperty(),
    	    basePropertyDeep = require_basePropertyDeep(),
    	    isKey = require_isKey(),
    	    toKey = require_toKey();

    	/**
    	 * Creates a function that returns the value at `path` of a given object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 2.4.0
    	 * @category Util
    	 * @param {Array|string} path The path of the property to get.
    	 * @returns {Function} Returns the new accessor function.
    	 * @example
    	 *
    	 * var objects = [
    	 *   { 'a': { 'b': 2 } },
    	 *   { 'a': { 'b': 1 } }
    	 * ];
    	 *
    	 * _.map(objects, _.property('a.b'));
    	 * // => [2, 1]
    	 *
    	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
    	 * // => [1, 2]
    	 */
    	function property(path) {
    	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    	}

    	property_1 = property;
    	return property_1;
    }

    var _baseIteratee;
    var hasRequired_baseIteratee;

    function require_baseIteratee () {
    	if (hasRequired_baseIteratee) return _baseIteratee;
    	hasRequired_baseIteratee = 1;
    	var baseMatches = require_baseMatches(),
    	    baseMatchesProperty = require_baseMatchesProperty(),
    	    identity = requireIdentity(),
    	    isArray = requireIsArray(),
    	    property = requireProperty();

    	/**
    	 * The base implementation of `_.iteratee`.
    	 *
    	 * @private
    	 * @param {*} [value=_.identity] The value to convert to an iteratee.
    	 * @returns {Function} Returns the iteratee.
    	 */
    	function baseIteratee(value) {
    	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    	  if (typeof value == 'function') {
    	    return value;
    	  }
    	  if (value == null) {
    	    return identity;
    	  }
    	  if (typeof value == 'object') {
    	    return isArray(value)
    	      ? baseMatchesProperty(value[0], value[1])
    	      : baseMatches(value);
    	  }
    	  return property(value);
    	}

    	_baseIteratee = baseIteratee;
    	return _baseIteratee;
    }

    var filter_1;
    var hasRequiredFilter;

    function requireFilter () {
    	if (hasRequiredFilter) return filter_1;
    	hasRequiredFilter = 1;
    	var arrayFilter = require_arrayFilter(),
    	    baseFilter = require_baseFilter(),
    	    baseIteratee = require_baseIteratee(),
    	    isArray = requireIsArray();

    	/**
    	 * Iterates over elements of `collection`, returning an array of all elements
    	 * `predicate` returns truthy for. The predicate is invoked with three
    	 * arguments: (value, index|key, collection).
    	 *
    	 * **Note:** Unlike `_.remove`, this method returns a new array.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
    	 * @returns {Array} Returns the new filtered array.
    	 * @see _.reject
    	 * @example
    	 *
    	 * var users = [
    	 *   { 'user': 'barney', 'age': 36, 'active': true },
    	 *   { 'user': 'fred',   'age': 40, 'active': false }
    	 * ];
    	 *
    	 * _.filter(users, function(o) { return !o.active; });
    	 * // => objects for ['fred']
    	 *
    	 * // The `_.matches` iteratee shorthand.
    	 * _.filter(users, { 'age': 36, 'active': true });
    	 * // => objects for ['barney']
    	 *
    	 * // The `_.matchesProperty` iteratee shorthand.
    	 * _.filter(users, ['active', false]);
    	 * // => objects for ['fred']
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.filter(users, 'active');
    	 * // => objects for ['barney']
    	 *
    	 * // Combining several predicates using `_.overEvery` or `_.overSome`.
    	 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
    	 * // => objects for ['fred', 'barney']
    	 */
    	function filter(collection, predicate) {
    	  var func = isArray(collection) ? arrayFilter : baseFilter;
    	  return func(collection, baseIteratee(predicate, 3));
    	}

    	filter_1 = filter;
    	return filter_1;
    }

    /** Used for built-in method references. */

    var _baseHas;
    var hasRequired_baseHas;

    function require_baseHas () {
    	if (hasRequired_baseHas) return _baseHas;
    	hasRequired_baseHas = 1;
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * The base implementation of `_.has` without support for deep paths.
    	 *
    	 * @private
    	 * @param {Object} [object] The object to query.
    	 * @param {Array|string} key The key to check.
    	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
    	 */
    	function baseHas(object, key) {
    	  return object != null && hasOwnProperty.call(object, key);
    	}

    	_baseHas = baseHas;
    	return _baseHas;
    }

    var has_1;
    var hasRequiredHas;

    function requireHas () {
    	if (hasRequiredHas) return has_1;
    	hasRequiredHas = 1;
    	var baseHas = require_baseHas(),
    	    hasPath = require_hasPath();

    	/**
    	 * Checks if `path` is a direct property of `object`.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @param {Array|string} path The path to check.
    	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
    	 * @example
    	 *
    	 * var object = { 'a': { 'b': 2 } };
    	 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
    	 *
    	 * _.has(object, 'a');
    	 * // => true
    	 *
    	 * _.has(object, 'a.b');
    	 * // => true
    	 *
    	 * _.has(object, ['a', 'b']);
    	 * // => true
    	 *
    	 * _.has(other, 'a');
    	 * // => false
    	 */
    	function has(object, path) {
    	  return object != null && hasPath(object, path, baseHas);
    	}

    	has_1 = has;
    	return has_1;
    }

    var isEmpty_1;
    var hasRequiredIsEmpty;

    function requireIsEmpty () {
    	if (hasRequiredIsEmpty) return isEmpty_1;
    	hasRequiredIsEmpty = 1;
    	var baseKeys = require_baseKeys(),
    	    getTag = require_getTag(),
    	    isArguments = requireIsArguments(),
    	    isArray = requireIsArray(),
    	    isArrayLike = requireIsArrayLike(),
    	    isBuffer = requireIsBuffer(),
    	    isPrototype = require_isPrototype(),
    	    isTypedArray = requireIsTypedArray();

    	/** `Object#toString` result references. */
    	var mapTag = '[object Map]',
    	    setTag = '[object Set]';

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Checks if `value` is an empty object, collection, map, or set.
    	 *
    	 * Objects are considered empty if they have no own enumerable string keyed
    	 * properties.
    	 *
    	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
    	 * jQuery-like collections are considered empty if they have a `length` of `0`.
    	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
    	 * @example
    	 *
    	 * _.isEmpty(null);
    	 * // => true
    	 *
    	 * _.isEmpty(true);
    	 * // => true
    	 *
    	 * _.isEmpty(1);
    	 * // => true
    	 *
    	 * _.isEmpty([1, 2, 3]);
    	 * // => false
    	 *
    	 * _.isEmpty({ 'a': 1 });
    	 * // => false
    	 */
    	function isEmpty(value) {
    	  if (value == null) {
    	    return true;
    	  }
    	  if (isArrayLike(value) &&
    	      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
    	        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    	    return !value.length;
    	  }
    	  var tag = getTag(value);
    	  if (tag == mapTag || tag == setTag) {
    	    return !value.size;
    	  }
    	  if (isPrototype(value)) {
    	    return !baseKeys(value).length;
    	  }
    	  for (var key in value) {
    	    if (hasOwnProperty.call(value, key)) {
    	      return false;
    	    }
    	  }
    	  return true;
    	}

    	isEmpty_1 = isEmpty;
    	return isEmpty_1;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */

    var isUndefined_1;
    var hasRequiredIsUndefined;

    function requireIsUndefined () {
    	if (hasRequiredIsUndefined) return isUndefined_1;
    	hasRequiredIsUndefined = 1;
    	function isUndefined(value) {
    	  return value === undefined;
    	}

    	isUndefined_1 = isUndefined;
    	return isUndefined_1;
    }

    var _baseMap;
    var hasRequired_baseMap;

    function require_baseMap () {
    	if (hasRequired_baseMap) return _baseMap;
    	hasRequired_baseMap = 1;
    	var baseEach = require_baseEach(),
    	    isArrayLike = requireIsArrayLike();

    	/**
    	 * The base implementation of `_.map` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @returns {Array} Returns the new mapped array.
    	 */
    	function baseMap(collection, iteratee) {
    	  var index = -1,
    	      result = isArrayLike(collection) ? Array(collection.length) : [];

    	  baseEach(collection, function(value, key, collection) {
    	    result[++index] = iteratee(value, key, collection);
    	  });
    	  return result;
    	}

    	_baseMap = baseMap;
    	return _baseMap;
    }

    var map_1;
    var hasRequiredMap;

    function requireMap () {
    	if (hasRequiredMap) return map_1;
    	hasRequiredMap = 1;
    	var arrayMap = require_arrayMap(),
    	    baseIteratee = require_baseIteratee(),
    	    baseMap = require_baseMap(),
    	    isArray = requireIsArray();

    	/**
    	 * Creates an array of values by running each element in `collection` thru
    	 * `iteratee`. The iteratee is invoked with three arguments:
    	 * (value, index|key, collection).
    	 *
    	 * Many lodash methods are guarded to work as iteratees for methods like
    	 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
    	 *
    	 * The guarded methods are:
    	 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
    	 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
    	 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
    	 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @returns {Array} Returns the new mapped array.
    	 * @example
    	 *
    	 * function square(n) {
    	 *   return n * n;
    	 * }
    	 *
    	 * _.map([4, 8], square);
    	 * // => [16, 64]
    	 *
    	 * _.map({ 'a': 4, 'b': 8 }, square);
    	 * // => [16, 64] (iteration order is not guaranteed)
    	 *
    	 * var users = [
    	 *   { 'user': 'barney' },
    	 *   { 'user': 'fred' }
    	 * ];
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.map(users, 'user');
    	 * // => ['barney', 'fred']
    	 */
    	function map(collection, iteratee) {
    	  var func = isArray(collection) ? arrayMap : baseMap;
    	  return func(collection, baseIteratee(iteratee, 3));
    	}

    	map_1 = map;
    	return map_1;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */

    var _arrayReduce;
    var hasRequired_arrayReduce;

    function require_arrayReduce () {
    	if (hasRequired_arrayReduce) return _arrayReduce;
    	hasRequired_arrayReduce = 1;
    	function arrayReduce(array, iteratee, accumulator, initAccum) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length;

    	  if (initAccum && length) {
    	    accumulator = array[++index];
    	  }
    	  while (++index < length) {
    	    accumulator = iteratee(accumulator, array[index], index, array);
    	  }
    	  return accumulator;
    	}

    	_arrayReduce = arrayReduce;
    	return _arrayReduce;
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight`, without support
     * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initAccum Specify using the first or last element of
     *  `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */

    var _baseReduce;
    var hasRequired_baseReduce;

    function require_baseReduce () {
    	if (hasRequired_baseReduce) return _baseReduce;
    	hasRequired_baseReduce = 1;
    	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    	  eachFunc(collection, function(value, index, collection) {
    	    accumulator = initAccum
    	      ? (initAccum = false, value)
    	      : iteratee(accumulator, value, index, collection);
    	  });
    	  return accumulator;
    	}

    	_baseReduce = baseReduce;
    	return _baseReduce;
    }

    var reduce_1;
    var hasRequiredReduce;

    function requireReduce () {
    	if (hasRequiredReduce) return reduce_1;
    	hasRequiredReduce = 1;
    	var arrayReduce = require_arrayReduce(),
    	    baseEach = require_baseEach(),
    	    baseIteratee = require_baseIteratee(),
    	    baseReduce = require_baseReduce(),
    	    isArray = requireIsArray();

    	/**
    	 * Reduces `collection` to a value which is the accumulated result of running
    	 * each element in `collection` thru `iteratee`, where each successive
    	 * invocation is supplied the return value of the previous. If `accumulator`
    	 * is not given, the first element of `collection` is used as the initial
    	 * value. The iteratee is invoked with four arguments:
    	 * (accumulator, value, index|key, collection).
    	 *
    	 * Many lodash methods are guarded to work as iteratees for methods like
    	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
    	 *
    	 * The guarded methods are:
    	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
    	 * and `sortBy`
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @param {*} [accumulator] The initial value.
    	 * @returns {*} Returns the accumulated value.
    	 * @see _.reduceRight
    	 * @example
    	 *
    	 * _.reduce([1, 2], function(sum, n) {
    	 *   return sum + n;
    	 * }, 0);
    	 * // => 3
    	 *
    	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
    	 *   (result[value] || (result[value] = [])).push(key);
    	 *   return result;
    	 * }, {});
    	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
    	 */
    	function reduce(collection, iteratee, accumulator) {
    	  var func = isArray(collection) ? arrayReduce : baseReduce,
    	      initAccum = arguments.length < 3;

    	  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    	}

    	reduce_1 = reduce;
    	return reduce_1;
    }

    var isString_1;
    var hasRequiredIsString;

    function requireIsString () {
    	if (hasRequiredIsString) return isString_1;
    	hasRequiredIsString = 1;
    	var baseGetTag = require_baseGetTag(),
    	    isArray = requireIsArray(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var stringTag = '[object String]';

    	/**
    	 * Checks if `value` is classified as a `String` primitive or object.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
    	 * @example
    	 *
    	 * _.isString('abc');
    	 * // => true
    	 *
    	 * _.isString(1);
    	 * // => false
    	 */
    	function isString(value) {
    	  return typeof value == 'string' ||
    	    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    	}

    	isString_1 = isString;
    	return isString_1;
    }

    var _asciiSize;
    var hasRequired_asciiSize;

    function require_asciiSize () {
    	if (hasRequired_asciiSize) return _asciiSize;
    	hasRequired_asciiSize = 1;
    	var baseProperty = require_baseProperty();

    	/**
    	 * Gets the size of an ASCII `string`.
    	 *
    	 * @private
    	 * @param {string} string The string inspect.
    	 * @returns {number} Returns the string size.
    	 */
    	var asciiSize = baseProperty('length');

    	_asciiSize = asciiSize;
    	return _asciiSize;
    }

    /** Used to compose unicode character classes. */

    var _hasUnicode;
    var hasRequired_hasUnicode;

    function require_hasUnicode () {
    	if (hasRequired_hasUnicode) return _hasUnicode;
    	hasRequired_hasUnicode = 1;
    	var rsAstralRange = '\\ud800-\\udfff',
    	    rsComboMarksRange = '\\u0300-\\u036f',
    	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    	    rsVarRange = '\\ufe0e\\ufe0f';

    	/** Used to compose unicode capture groups. */
    	var rsZWJ = '\\u200d';

    	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
    	var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

    	/**
    	 * Checks if `string` contains Unicode symbols.
    	 *
    	 * @private
    	 * @param {string} string The string to inspect.
    	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
    	 */
    	function hasUnicode(string) {
    	  return reHasUnicode.test(string);
    	}

    	_hasUnicode = hasUnicode;
    	return _hasUnicode;
    }

    /** Used to compose unicode character classes. */

    var _unicodeSize;
    var hasRequired_unicodeSize;

    function require_unicodeSize () {
    	if (hasRequired_unicodeSize) return _unicodeSize;
    	hasRequired_unicodeSize = 1;
    	var rsAstralRange = '\\ud800-\\udfff',
    	    rsComboMarksRange = '\\u0300-\\u036f',
    	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    	    rsVarRange = '\\ufe0e\\ufe0f';

    	/** Used to compose unicode capture groups. */
    	var rsAstral = '[' + rsAstralRange + ']',
    	    rsCombo = '[' + rsComboRange + ']',
    	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    	    rsNonAstral = '[^' + rsAstralRange + ']',
    	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    	    rsZWJ = '\\u200d';

    	/** Used to compose unicode regexes. */
    	var reOptMod = rsModifier + '?',
    	    rsOptVar = '[' + rsVarRange + ']?',
    	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

    	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
    	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

    	/**
    	 * Gets the size of a Unicode `string`.
    	 *
    	 * @private
    	 * @param {string} string The string inspect.
    	 * @returns {number} Returns the string size.
    	 */
    	function unicodeSize(string) {
    	  var result = reUnicode.lastIndex = 0;
    	  while (reUnicode.test(string)) {
    	    ++result;
    	  }
    	  return result;
    	}

    	_unicodeSize = unicodeSize;
    	return _unicodeSize;
    }

    var _stringSize;
    var hasRequired_stringSize;

    function require_stringSize () {
    	if (hasRequired_stringSize) return _stringSize;
    	hasRequired_stringSize = 1;
    	var asciiSize = require_asciiSize(),
    	    hasUnicode = require_hasUnicode(),
    	    unicodeSize = require_unicodeSize();

    	/**
    	 * Gets the number of symbols in `string`.
    	 *
    	 * @private
    	 * @param {string} string The string to inspect.
    	 * @returns {number} Returns the string size.
    	 */
    	function stringSize(string) {
    	  return hasUnicode(string)
    	    ? unicodeSize(string)
    	    : asciiSize(string);
    	}

    	_stringSize = stringSize;
    	return _stringSize;
    }

    var size_1;
    var hasRequiredSize;

    function requireSize () {
    	if (hasRequiredSize) return size_1;
    	hasRequiredSize = 1;
    	var baseKeys = require_baseKeys(),
    	    getTag = require_getTag(),
    	    isArrayLike = requireIsArrayLike(),
    	    isString = requireIsString(),
    	    stringSize = require_stringSize();

    	/** `Object#toString` result references. */
    	var mapTag = '[object Map]',
    	    setTag = '[object Set]';

    	/**
    	 * Gets the size of `collection` by returning its length for array-like
    	 * values or the number of own enumerable string keyed properties for objects.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object|string} collection The collection to inspect.
    	 * @returns {number} Returns the collection size.
    	 * @example
    	 *
    	 * _.size([1, 2, 3]);
    	 * // => 3
    	 *
    	 * _.size({ 'a': 1, 'b': 2 });
    	 * // => 2
    	 *
    	 * _.size('pebbles');
    	 * // => 7
    	 */
    	function size(collection) {
    	  if (collection == null) {
    	    return 0;
    	  }
    	  if (isArrayLike(collection)) {
    	    return isString(collection) ? stringSize(collection) : collection.length;
    	  }
    	  var tag = getTag(collection);
    	  if (tag == mapTag || tag == setTag) {
    	    return collection.size;
    	  }
    	  return baseKeys(collection).length;
    	}

    	size_1 = size;
    	return size_1;
    }

    var transform_1;
    var hasRequiredTransform;

    function requireTransform () {
    	if (hasRequiredTransform) return transform_1;
    	hasRequiredTransform = 1;
    	var arrayEach = require_arrayEach(),
    	    baseCreate = require_baseCreate(),
    	    baseForOwn = require_baseForOwn(),
    	    baseIteratee = require_baseIteratee(),
    	    getPrototype = require_getPrototype(),
    	    isArray = requireIsArray(),
    	    isBuffer = requireIsBuffer(),
    	    isFunction = requireIsFunction(),
    	    isObject = requireIsObject(),
    	    isTypedArray = requireIsTypedArray();

    	/**
    	 * An alternative to `_.reduce`; this method transforms `object` to a new
    	 * `accumulator` object which is the result of running each of its own
    	 * enumerable string keyed properties thru `iteratee`, with each invocation
    	 * potentially mutating the `accumulator` object. If `accumulator` is not
    	 * provided, a new object with the same `[[Prototype]]` will be used. The
    	 * iteratee is invoked with four arguments: (accumulator, value, key, object).
    	 * Iteratee functions may exit iteration early by explicitly returning `false`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 1.3.0
    	 * @category Object
    	 * @param {Object} object The object to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @param {*} [accumulator] The custom accumulator value.
    	 * @returns {*} Returns the accumulated value.
    	 * @example
    	 *
    	 * _.transform([2, 3, 4], function(result, n) {
    	 *   result.push(n *= n);
    	 *   return n % 2 == 0;
    	 * }, []);
    	 * // => [4, 9]
    	 *
    	 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
    	 *   (result[value] || (result[value] = [])).push(key);
    	 * }, {});
    	 * // => { '1': ['a', 'c'], '2': ['b'] }
    	 */
    	function transform(object, iteratee, accumulator) {
    	  var isArr = isArray(object),
    	      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

    	  iteratee = baseIteratee(iteratee, 4);
    	  if (accumulator == null) {
    	    var Ctor = object && object.constructor;
    	    if (isArrLike) {
    	      accumulator = isArr ? new Ctor : [];
    	    }
    	    else if (isObject(object)) {
    	      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    	    }
    	    else {
    	      accumulator = {};
    	    }
    	  }
    	  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    	    return iteratee(accumulator, value, index, object);
    	  });
    	  return accumulator;
    	}

    	transform_1 = transform;
    	return transform_1;
    }

    var _isFlattenable;
    var hasRequired_isFlattenable;

    function require_isFlattenable () {
    	if (hasRequired_isFlattenable) return _isFlattenable;
    	hasRequired_isFlattenable = 1;
    	var Symbol = require_Symbol(),
    	    isArguments = requireIsArguments(),
    	    isArray = requireIsArray();

    	/** Built-in value references. */
    	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

    	/**
    	 * Checks if `value` is a flattenable `arguments` object or array.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
    	 */
    	function isFlattenable(value) {
    	  return isArray(value) || isArguments(value) ||
    	    !!(spreadableSymbol && value && value[spreadableSymbol]);
    	}

    	_isFlattenable = isFlattenable;
    	return _isFlattenable;
    }

    var _baseFlatten;
    var hasRequired_baseFlatten;

    function require_baseFlatten () {
    	if (hasRequired_baseFlatten) return _baseFlatten;
    	hasRequired_baseFlatten = 1;
    	var arrayPush = require_arrayPush(),
    	    isFlattenable = require_isFlattenable();

    	/**
    	 * The base implementation of `_.flatten` with support for restricting flattening.
    	 *
    	 * @private
    	 * @param {Array} array The array to flatten.
    	 * @param {number} depth The maximum recursion depth.
    	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
    	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
    	 * @param {Array} [result=[]] The initial result value.
    	 * @returns {Array} Returns the new flattened array.
    	 */
    	function baseFlatten(array, depth, predicate, isStrict, result) {
    	  var index = -1,
    	      length = array.length;

    	  predicate || (predicate = isFlattenable);
    	  result || (result = []);

    	  while (++index < length) {
    	    var value = array[index];
    	    if (depth > 0 && predicate(value)) {
    	      if (depth > 1) {
    	        // Recursively flatten arrays (susceptible to call stack limits).
    	        baseFlatten(value, depth - 1, predicate, isStrict, result);
    	      } else {
    	        arrayPush(result, value);
    	      }
    	    } else if (!isStrict) {
    	      result[result.length] = value;
    	    }
    	  }
    	  return result;
    	}

    	_baseFlatten = baseFlatten;
    	return _baseFlatten;
    }

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */

    var _apply;
    var hasRequired_apply;

    function require_apply () {
    	if (hasRequired_apply) return _apply;
    	hasRequired_apply = 1;
    	function apply(func, thisArg, args) {
    	  switch (args.length) {
    	    case 0: return func.call(thisArg);
    	    case 1: return func.call(thisArg, args[0]);
    	    case 2: return func.call(thisArg, args[0], args[1]);
    	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
    	  }
    	  return func.apply(thisArg, args);
    	}

    	_apply = apply;
    	return _apply;
    }

    var _overRest;
    var hasRequired_overRest;

    function require_overRest () {
    	if (hasRequired_overRest) return _overRest;
    	hasRequired_overRest = 1;
    	var apply = require_apply();

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeMax = Math.max;

    	/**
    	 * A specialized version of `baseRest` which transforms the rest array.
    	 *
    	 * @private
    	 * @param {Function} func The function to apply a rest parameter to.
    	 * @param {number} [start=func.length-1] The start position of the rest parameter.
    	 * @param {Function} transform The rest array transform.
    	 * @returns {Function} Returns the new function.
    	 */
    	function overRest(func, start, transform) {
    	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    	  return function() {
    	    var args = arguments,
    	        index = -1,
    	        length = nativeMax(args.length - start, 0),
    	        array = Array(length);

    	    while (++index < length) {
    	      array[index] = args[start + index];
    	    }
    	    index = -1;
    	    var otherArgs = Array(start + 1);
    	    while (++index < start) {
    	      otherArgs[index] = args[index];
    	    }
    	    otherArgs[start] = transform(array);
    	    return apply(func, this, otherArgs);
    	  };
    	}

    	_overRest = overRest;
    	return _overRest;
    }

    var _baseSetToString;
    var hasRequired_baseSetToString;

    function require_baseSetToString () {
    	if (hasRequired_baseSetToString) return _baseSetToString;
    	hasRequired_baseSetToString = 1;
    	var constant = requireConstant(),
    	    defineProperty = require_defineProperty(),
    	    identity = requireIdentity();

    	/**
    	 * The base implementation of `setToString` without support for hot loop shorting.
    	 *
    	 * @private
    	 * @param {Function} func The function to modify.
    	 * @param {Function} string The `toString` result.
    	 * @returns {Function} Returns `func`.
    	 */
    	var baseSetToString = !defineProperty ? identity : function(func, string) {
    	  return defineProperty(func, 'toString', {
    	    'configurable': true,
    	    'enumerable': false,
    	    'value': constant(string),
    	    'writable': true
    	  });
    	};

    	_baseSetToString = baseSetToString;
    	return _baseSetToString;
    }

    /** Used to detect hot functions by number of calls within a span of milliseconds. */

    var _shortOut;
    var hasRequired_shortOut;

    function require_shortOut () {
    	if (hasRequired_shortOut) return _shortOut;
    	hasRequired_shortOut = 1;
    	var HOT_COUNT = 800,
    	    HOT_SPAN = 16;

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeNow = Date.now;

    	/**
    	 * Creates a function that'll short out and invoke `identity` instead
    	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
    	 * milliseconds.
    	 *
    	 * @private
    	 * @param {Function} func The function to restrict.
    	 * @returns {Function} Returns the new shortable function.
    	 */
    	function shortOut(func) {
    	  var count = 0,
    	      lastCalled = 0;

    	  return function() {
    	    var stamp = nativeNow(),
    	        remaining = HOT_SPAN - (stamp - lastCalled);

    	    lastCalled = stamp;
    	    if (remaining > 0) {
    	      if (++count >= HOT_COUNT) {
    	        return arguments[0];
    	      }
    	    } else {
    	      count = 0;
    	    }
    	    return func.apply(undefined, arguments);
    	  };
    	}

    	_shortOut = shortOut;
    	return _shortOut;
    }

    var _setToString;
    var hasRequired_setToString;

    function require_setToString () {
    	if (hasRequired_setToString) return _setToString;
    	hasRequired_setToString = 1;
    	var baseSetToString = require_baseSetToString(),
    	    shortOut = require_shortOut();

    	/**
    	 * Sets the `toString` method of `func` to return `string`.
    	 *
    	 * @private
    	 * @param {Function} func The function to modify.
    	 * @param {Function} string The `toString` result.
    	 * @returns {Function} Returns `func`.
    	 */
    	var setToString = shortOut(baseSetToString);

    	_setToString = setToString;
    	return _setToString;
    }

    var _baseRest;
    var hasRequired_baseRest;

    function require_baseRest () {
    	if (hasRequired_baseRest) return _baseRest;
    	hasRequired_baseRest = 1;
    	var identity = requireIdentity(),
    	    overRest = require_overRest(),
    	    setToString = require_setToString();

    	/**
    	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
    	 *
    	 * @private
    	 * @param {Function} func The function to apply a rest parameter to.
    	 * @param {number} [start=func.length-1] The start position of the rest parameter.
    	 * @returns {Function} Returns the new function.
    	 */
    	function baseRest(func, start) {
    	  return setToString(overRest(func, start, identity), func + '');
    	}

    	_baseRest = baseRest;
    	return _baseRest;
    }

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */

    var _baseFindIndex;
    var hasRequired_baseFindIndex;

    function require_baseFindIndex () {
    	if (hasRequired_baseFindIndex) return _baseFindIndex;
    	hasRequired_baseFindIndex = 1;
    	function baseFindIndex(array, predicate, fromIndex, fromRight) {
    	  var length = array.length,
    	      index = fromIndex + (fromRight ? 1 : -1);

    	  while ((fromRight ? index-- : ++index < length)) {
    	    if (predicate(array[index], index, array)) {
    	      return index;
    	    }
    	  }
    	  return -1;
    	}

    	_baseFindIndex = baseFindIndex;
    	return _baseFindIndex;
    }

    /**
     * The base implementation of `_.isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */

    var _baseIsNaN;
    var hasRequired_baseIsNaN;

    function require_baseIsNaN () {
    	if (hasRequired_baseIsNaN) return _baseIsNaN;
    	hasRequired_baseIsNaN = 1;
    	function baseIsNaN(value) {
    	  return value !== value;
    	}

    	_baseIsNaN = baseIsNaN;
    	return _baseIsNaN;
    }

    /**
     * A specialized version of `_.indexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */

    var _strictIndexOf;
    var hasRequired_strictIndexOf;

    function require_strictIndexOf () {
    	if (hasRequired_strictIndexOf) return _strictIndexOf;
    	hasRequired_strictIndexOf = 1;
    	function strictIndexOf(array, value, fromIndex) {
    	  var index = fromIndex - 1,
    	      length = array.length;

    	  while (++index < length) {
    	    if (array[index] === value) {
    	      return index;
    	    }
    	  }
    	  return -1;
    	}

    	_strictIndexOf = strictIndexOf;
    	return _strictIndexOf;
    }

    var _baseIndexOf;
    var hasRequired_baseIndexOf;

    function require_baseIndexOf () {
    	if (hasRequired_baseIndexOf) return _baseIndexOf;
    	hasRequired_baseIndexOf = 1;
    	var baseFindIndex = require_baseFindIndex(),
    	    baseIsNaN = require_baseIsNaN(),
    	    strictIndexOf = require_strictIndexOf();

    	/**
    	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
    	 *
    	 * @private
    	 * @param {Array} array The array to inspect.
    	 * @param {*} value The value to search for.
    	 * @param {number} fromIndex The index to search from.
    	 * @returns {number} Returns the index of the matched value, else `-1`.
    	 */
    	function baseIndexOf(array, value, fromIndex) {
    	  return value === value
    	    ? strictIndexOf(array, value, fromIndex)
    	    : baseFindIndex(array, baseIsNaN, fromIndex);
    	}

    	_baseIndexOf = baseIndexOf;
    	return _baseIndexOf;
    }

    var _arrayIncludes;
    var hasRequired_arrayIncludes;

    function require_arrayIncludes () {
    	if (hasRequired_arrayIncludes) return _arrayIncludes;
    	hasRequired_arrayIncludes = 1;
    	var baseIndexOf = require_baseIndexOf();

    	/**
    	 * A specialized version of `_.includes` for arrays without support for
    	 * specifying an index to search from.
    	 *
    	 * @private
    	 * @param {Array} [array] The array to inspect.
    	 * @param {*} target The value to search for.
    	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
    	 */
    	function arrayIncludes(array, value) {
    	  var length = array == null ? 0 : array.length;
    	  return !!length && baseIndexOf(array, value, 0) > -1;
    	}

    	_arrayIncludes = arrayIncludes;
    	return _arrayIncludes;
    }

    /**
     * This function is like `arrayIncludes` except that it accepts a comparator.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @param {Function} comparator The comparator invoked per element.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */

    var _arrayIncludesWith;
    var hasRequired_arrayIncludesWith;

    function require_arrayIncludesWith () {
    	if (hasRequired_arrayIncludesWith) return _arrayIncludesWith;
    	hasRequired_arrayIncludesWith = 1;
    	function arrayIncludesWith(array, value, comparator) {
    	  var index = -1,
    	      length = array == null ? 0 : array.length;

    	  while (++index < length) {
    	    if (comparator(value, array[index])) {
    	      return true;
    	    }
    	  }
    	  return false;
    	}

    	_arrayIncludesWith = arrayIncludesWith;
    	return _arrayIncludesWith;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */

    var noop_1;
    var hasRequiredNoop;

    function requireNoop () {
    	if (hasRequiredNoop) return noop_1;
    	hasRequiredNoop = 1;
    	function noop() {
    	  // No operation performed.
    	}

    	noop_1 = noop;
    	return noop_1;
    }

    var _createSet;
    var hasRequired_createSet;

    function require_createSet () {
    	if (hasRequired_createSet) return _createSet;
    	hasRequired_createSet = 1;
    	var Set = require_Set(),
    	    noop = requireNoop(),
    	    setToArray = require_setToArray();

    	/** Used as references for various `Number` constants. */
    	var INFINITY = 1 / 0;

    	/**
    	 * Creates a set object of `values`.
    	 *
    	 * @private
    	 * @param {Array} values The values to add to the set.
    	 * @returns {Object} Returns the new set.
    	 */
    	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
    	  return new Set(values);
    	};

    	_createSet = createSet;
    	return _createSet;
    }

    var _baseUniq;
    var hasRequired_baseUniq;

    function require_baseUniq () {
    	if (hasRequired_baseUniq) return _baseUniq;
    	hasRequired_baseUniq = 1;
    	var SetCache = require_SetCache(),
    	    arrayIncludes = require_arrayIncludes(),
    	    arrayIncludesWith = require_arrayIncludesWith(),
    	    cacheHas = require_cacheHas(),
    	    createSet = require_createSet(),
    	    setToArray = require_setToArray();

    	/** Used as the size to enable large array optimizations. */
    	var LARGE_ARRAY_SIZE = 200;

    	/**
    	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array} array The array to inspect.
    	 * @param {Function} [iteratee] The iteratee invoked per element.
    	 * @param {Function} [comparator] The comparator invoked per element.
    	 * @returns {Array} Returns the new duplicate free array.
    	 */
    	function baseUniq(array, iteratee, comparator) {
    	  var index = -1,
    	      includes = arrayIncludes,
    	      length = array.length,
    	      isCommon = true,
    	      result = [],
    	      seen = result;

    	  if (comparator) {
    	    isCommon = false;
    	    includes = arrayIncludesWith;
    	  }
    	  else if (length >= LARGE_ARRAY_SIZE) {
    	    var set = iteratee ? null : createSet(array);
    	    if (set) {
    	      return setToArray(set);
    	    }
    	    isCommon = false;
    	    includes = cacheHas;
    	    seen = new SetCache;
    	  }
    	  else {
    	    seen = iteratee ? [] : result;
    	  }
    	  outer:
    	  while (++index < length) {
    	    var value = array[index],
    	        computed = iteratee ? iteratee(value) : value;

    	    value = (comparator || value !== 0) ? value : 0;
    	    if (isCommon && computed === computed) {
    	      var seenIndex = seen.length;
    	      while (seenIndex--) {
    	        if (seen[seenIndex] === computed) {
    	          continue outer;
    	        }
    	      }
    	      if (iteratee) {
    	        seen.push(computed);
    	      }
    	      result.push(value);
    	    }
    	    else if (!includes(seen, computed, comparator)) {
    	      if (seen !== result) {
    	        seen.push(computed);
    	      }
    	      result.push(value);
    	    }
    	  }
    	  return result;
    	}

    	_baseUniq = baseUniq;
    	return _baseUniq;
    }

    var isArrayLikeObject_1;
    var hasRequiredIsArrayLikeObject;

    function requireIsArrayLikeObject () {
    	if (hasRequiredIsArrayLikeObject) return isArrayLikeObject_1;
    	hasRequiredIsArrayLikeObject = 1;
    	var isArrayLike = requireIsArrayLike(),
    	    isObjectLike = requireIsObjectLike();

    	/**
    	 * This method is like `_.isArrayLike` except that it also checks if `value`
    	 * is an object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an array-like object,
    	 *  else `false`.
    	 * @example
    	 *
    	 * _.isArrayLikeObject([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isArrayLikeObject(document.body.children);
    	 * // => true
    	 *
    	 * _.isArrayLikeObject('abc');
    	 * // => false
    	 *
    	 * _.isArrayLikeObject(_.noop);
    	 * // => false
    	 */
    	function isArrayLikeObject(value) {
    	  return isObjectLike(value) && isArrayLike(value);
    	}

    	isArrayLikeObject_1 = isArrayLikeObject;
    	return isArrayLikeObject_1;
    }

    var union_1;
    var hasRequiredUnion;

    function requireUnion () {
    	if (hasRequiredUnion) return union_1;
    	hasRequiredUnion = 1;
    	var baseFlatten = require_baseFlatten(),
    	    baseRest = require_baseRest(),
    	    baseUniq = require_baseUniq(),
    	    isArrayLikeObject = requireIsArrayLikeObject();

    	/**
    	 * Creates an array of unique values, in order, from all given arrays using
    	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
    	 * for equality comparisons.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Array
    	 * @param {...Array} [arrays] The arrays to inspect.
    	 * @returns {Array} Returns the new array of combined values.
    	 * @example
    	 *
    	 * _.union([2], [1, 2]);
    	 * // => [2, 1]
    	 */
    	var union = baseRest(function(arrays) {
    	  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    	});

    	union_1 = union;
    	return union_1;
    }

    var _baseValues;
    var hasRequired_baseValues;

    function require_baseValues () {
    	if (hasRequired_baseValues) return _baseValues;
    	hasRequired_baseValues = 1;
    	var arrayMap = require_arrayMap();

    	/**
    	 * The base implementation of `_.values` and `_.valuesIn` which creates an
    	 * array of `object` property values corresponding to the property names
    	 * of `props`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {Array} props The property names to get values for.
    	 * @returns {Object} Returns the array of property values.
    	 */
    	function baseValues(object, props) {
    	  return arrayMap(props, function(key) {
    	    return object[key];
    	  });
    	}

    	_baseValues = baseValues;
    	return _baseValues;
    }

    var values_1;
    var hasRequiredValues;

    function requireValues () {
    	if (hasRequiredValues) return values_1;
    	hasRequiredValues = 1;
    	var baseValues = require_baseValues(),
    	    keys = requireKeys();

    	/**
    	 * Creates an array of the own enumerable string keyed property values of `object`.
    	 *
    	 * **Note:** Non-object values are coerced to objects.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property values.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.values(new Foo);
    	 * // => [1, 2] (iteration order is not guaranteed)
    	 *
    	 * _.values('hi');
    	 * // => ['h', 'i']
    	 */
    	function values(object) {
    	  return object == null ? [] : baseValues(object, keys(object));
    	}

    	values_1 = values;
    	return values_1;
    }

    /* global window */

    var lodash_1$1;
    var hasRequiredLodash;

    function requireLodash () {
    	if (hasRequiredLodash) return lodash_1$1;
    	hasRequiredLodash = 1;
    	var lodash;

    	if (typeof commonjsRequire === "function") {
    	  try {
    	    lodash = {
    	      clone: requireClone(),
    	      constant: requireConstant(),
    	      each: requireEach(),
    	      filter: requireFilter(),
    	      has:  requireHas(),
    	      isArray: requireIsArray(),
    	      isEmpty: requireIsEmpty(),
    	      isFunction: requireIsFunction(),
    	      isUndefined: requireIsUndefined(),
    	      keys: requireKeys(),
    	      map: requireMap(),
    	      reduce: requireReduce(),
    	      size: requireSize(),
    	      transform: requireTransform(),
    	      union: requireUnion(),
    	      values: requireValues()
    	    };
    	  } catch (e) {
    	    // continue regardless of error
    	  }
    	}

    	if (!lodash) {
    	  lodash = window._;
    	}

    	lodash_1$1 = lodash;
    	return lodash_1$1;
    }

    var graph;
    var hasRequiredGraph;

    function requireGraph () {
    	if (hasRequiredGraph) return graph;
    	hasRequiredGraph = 1;

    	var _ = requireLodash();

    	graph = Graph;

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

    	function Graph(opts) {
    	  this._isDirected = _.has(opts, "directed") ? opts.directed : true;
    	  this._isMultigraph = _.has(opts, "multigraph") ? opts.multigraph : false;
    	  this._isCompound = _.has(opts, "compound") ? opts.compound : false;

    	  // Label for the graph itself
    	  this._label = undefined;

    	  // Defaults to be set when creating a new node
    	  this._defaultNodeLabelFn = _.constant(undefined);

    	  // Defaults to be set when creating a new edge
    	  this._defaultEdgeLabelFn = _.constant(undefined);

    	  // v -> label
    	  this._nodes = {};

    	  if (this._isCompound) {
    	    // v -> parent
    	    this._parent = {};

    	    // v -> children
    	    this._children = {};
    	    this._children[GRAPH_NODE] = {};
    	  }

    	  // v -> edgeObj
    	  this._in = {};

    	  // u -> v -> Number
    	  this._preds = {};

    	  // v -> edgeObj
    	  this._out = {};

    	  // v -> w -> Number
    	  this._sucs = {};

    	  // e -> edgeObj
    	  this._edgeObjs = {};

    	  // e -> label
    	  this._edgeLabels = {};
    	}

    	/* Number of nodes in the graph. Should only be changed by the implementation. */
    	Graph.prototype._nodeCount = 0;

    	/* Number of edges in the graph. Should only be changed by the implementation. */
    	Graph.prototype._edgeCount = 0;


    	/* === Graph functions ========= */

    	Graph.prototype.isDirected = function() {
    	  return this._isDirected;
    	};

    	Graph.prototype.isMultigraph = function() {
    	  return this._isMultigraph;
    	};

    	Graph.prototype.isCompound = function() {
    	  return this._isCompound;
    	};

    	Graph.prototype.setGraph = function(label) {
    	  this._label = label;
    	  return this;
    	};

    	Graph.prototype.graph = function() {
    	  return this._label;
    	};


    	/* === Node functions ========== */

    	Graph.prototype.setDefaultNodeLabel = function(newDefault) {
    	  if (!_.isFunction(newDefault)) {
    	    newDefault = _.constant(newDefault);
    	  }
    	  this._defaultNodeLabelFn = newDefault;
    	  return this;
    	};

    	Graph.prototype.nodeCount = function() {
    	  return this._nodeCount;
    	};

    	Graph.prototype.nodes = function() {
    	  return _.keys(this._nodes);
    	};

    	Graph.prototype.sources = function() {
    	  var self = this;
    	  return _.filter(this.nodes(), function(v) {
    	    return _.isEmpty(self._in[v]);
    	  });
    	};

    	Graph.prototype.sinks = function() {
    	  var self = this;
    	  return _.filter(this.nodes(), function(v) {
    	    return _.isEmpty(self._out[v]);
    	  });
    	};

    	Graph.prototype.setNodes = function(vs, value) {
    	  var args = arguments;
    	  var self = this;
    	  _.each(vs, function(v) {
    	    if (args.length > 1) {
    	      self.setNode(v, value);
    	    } else {
    	      self.setNode(v);
    	    }
    	  });
    	  return this;
    	};

    	Graph.prototype.setNode = function(v, value) {
    	  if (_.has(this._nodes, v)) {
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
    	};

    	Graph.prototype.node = function(v) {
    	  return this._nodes[v];
    	};

    	Graph.prototype.hasNode = function(v) {
    	  return _.has(this._nodes, v);
    	};

    	Graph.prototype.removeNode =  function(v) {
    	  var self = this;
    	  if (_.has(this._nodes, v)) {
    	    var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
    	    delete this._nodes[v];
    	    if (this._isCompound) {
    	      this._removeFromParentsChildList(v);
    	      delete this._parent[v];
    	      _.each(this.children(v), function(child) {
    	        self.setParent(child);
    	      });
    	      delete this._children[v];
    	    }
    	    _.each(_.keys(this._in[v]), removeEdge);
    	    delete this._in[v];
    	    delete this._preds[v];
    	    _.each(_.keys(this._out[v]), removeEdge);
    	    delete this._out[v];
    	    delete this._sucs[v];
    	    --this._nodeCount;
    	  }
    	  return this;
    	};

    	Graph.prototype.setParent = function(v, parent) {
    	  if (!this._isCompound) {
    	    throw new Error("Cannot set parent in a non-compound graph");
    	  }

    	  if (_.isUndefined(parent)) {
    	    parent = GRAPH_NODE;
    	  } else {
    	    // Coerce parent to string
    	    parent += "";
    	    for (var ancestor = parent;
    	      !_.isUndefined(ancestor);
    	      ancestor = this.parent(ancestor)) {
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
    	};

    	Graph.prototype._removeFromParentsChildList = function(v) {
    	  delete this._children[this._parent[v]][v];
    	};

    	Graph.prototype.parent = function(v) {
    	  if (this._isCompound) {
    	    var parent = this._parent[v];
    	    if (parent !== GRAPH_NODE) {
    	      return parent;
    	    }
    	  }
    	};

    	Graph.prototype.children = function(v) {
    	  if (_.isUndefined(v)) {
    	    v = GRAPH_NODE;
    	  }

    	  if (this._isCompound) {
    	    var children = this._children[v];
    	    if (children) {
    	      return _.keys(children);
    	    }
    	  } else if (v === GRAPH_NODE) {
    	    return this.nodes();
    	  } else if (this.hasNode(v)) {
    	    return [];
    	  }
    	};

    	Graph.prototype.predecessors = function(v) {
    	  var predsV = this._preds[v];
    	  if (predsV) {
    	    return _.keys(predsV);
    	  }
    	};

    	Graph.prototype.successors = function(v) {
    	  var sucsV = this._sucs[v];
    	  if (sucsV) {
    	    return _.keys(sucsV);
    	  }
    	};

    	Graph.prototype.neighbors = function(v) {
    	  var preds = this.predecessors(v);
    	  if (preds) {
    	    return _.union(preds, this.successors(v));
    	  }
    	};

    	Graph.prototype.isLeaf = function (v) {
    	  var neighbors;
    	  if (this.isDirected()) {
    	    neighbors = this.successors(v);
    	  } else {
    	    neighbors = this.neighbors(v);
    	  }
    	  return neighbors.length === 0;
    	};

    	Graph.prototype.filterNodes = function(filter) {
    	  var copy = new this.constructor({
    	    directed: this._isDirected,
    	    multigraph: this._isMultigraph,
    	    compound: this._isCompound
    	  });

    	  copy.setGraph(this.graph());

    	  var self = this;
    	  _.each(this._nodes, function(value, v) {
    	    if (filter(v)) {
    	      copy.setNode(v, value);
    	    }
    	  });

    	  _.each(this._edgeObjs, function(e) {
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
    	    _.each(copy.nodes(), function(v) {
    	      copy.setParent(v, findParent(v));
    	    });
    	  }

    	  return copy;
    	};

    	/* === Edge functions ========== */

    	Graph.prototype.setDefaultEdgeLabel = function(newDefault) {
    	  if (!_.isFunction(newDefault)) {
    	    newDefault = _.constant(newDefault);
    	  }
    	  this._defaultEdgeLabelFn = newDefault;
    	  return this;
    	};

    	Graph.prototype.edgeCount = function() {
    	  return this._edgeCount;
    	};

    	Graph.prototype.edges = function() {
    	  return _.values(this._edgeObjs);
    	};

    	Graph.prototype.setPath = function(vs, value) {
    	  var self = this;
    	  var args = arguments;
    	  _.reduce(vs, function(v, w) {
    	    if (args.length > 1) {
    	      self.setEdge(v, w, value);
    	    } else {
    	      self.setEdge(v, w);
    	    }
    	    return w;
    	  });
    	  return this;
    	};

    	/*
    	 * setEdge(v, w, [value, [name]])
    	 * setEdge({ v, w, [name] }, [value])
    	 */
    	Graph.prototype.setEdge = function() {
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
    	  if (!_.isUndefined(name)) {
    	    name = "" + name;
    	  }

    	  var e = edgeArgsToId(this._isDirected, v, w, name);
    	  if (_.has(this._edgeLabels, e)) {
    	    if (valueSpecified) {
    	      this._edgeLabels[e] = value;
    	    }
    	    return this;
    	  }

    	  if (!_.isUndefined(name) && !this._isMultigraph) {
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
    	};

    	Graph.prototype.edge = function(v, w, name) {
    	  var e = (arguments.length === 1
    	    ? edgeObjToId(this._isDirected, arguments[0])
    	    : edgeArgsToId(this._isDirected, v, w, name));
    	  return this._edgeLabels[e];
    	};

    	Graph.prototype.hasEdge = function(v, w, name) {
    	  var e = (arguments.length === 1
    	    ? edgeObjToId(this._isDirected, arguments[0])
    	    : edgeArgsToId(this._isDirected, v, w, name));
    	  return _.has(this._edgeLabels, e);
    	};

    	Graph.prototype.removeEdge = function(v, w, name) {
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
    	};

    	Graph.prototype.inEdges = function(v, u) {
    	  var inV = this._in[v];
    	  if (inV) {
    	    var edges = _.values(inV);
    	    if (!u) {
    	      return edges;
    	    }
    	    return _.filter(edges, function(edge) { return edge.v === u; });
    	  }
    	};

    	Graph.prototype.outEdges = function(v, w) {
    	  var outV = this._out[v];
    	  if (outV) {
    	    var edges = _.values(outV);
    	    if (!w) {
    	      return edges;
    	    }
    	    return _.filter(edges, function(edge) { return edge.w === w; });
    	  }
    	};

    	Graph.prototype.nodeEdges = function(v, w) {
    	  var inEdges = this.inEdges(v, w);
    	  if (inEdges) {
    	    return inEdges.concat(this.outEdges(v, w));
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
    	             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
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
    	return graph;
    }

    var version$1;
    var hasRequiredVersion;

    function requireVersion () {
    	if (hasRequiredVersion) return version$1;
    	hasRequiredVersion = 1;
    	version$1 = '2.1.8';
    	return version$1;
    }

    var lib;
    var hasRequiredLib;

    function requireLib () {
    	if (hasRequiredLib) return lib;
    	hasRequiredLib = 1;
    	// Includes only the "core" of graphlib
    	lib = {
    	  Graph: requireGraph(),
    	  version: requireVersion()
    	};
    	return lib;
    }

    var json;
    var hasRequiredJson;

    function requireJson () {
    	if (hasRequiredJson) return json;
    	hasRequiredJson = 1;
    	var _ = requireLodash();
    	var Graph = requireGraph();

    	json = {
    	  write: write,
    	  read: read
    	};

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
    	  if (!_.isUndefined(g.graph())) {
    	    json.value = _.clone(g.graph());
    	  }
    	  return json;
    	}

    	function writeNodes(g) {
    	  return _.map(g.nodes(), function(v) {
    	    var nodeValue = g.node(v);
    	    var parent = g.parent(v);
    	    var node = { v: v };
    	    if (!_.isUndefined(nodeValue)) {
    	      node.value = nodeValue;
    	    }
    	    if (!_.isUndefined(parent)) {
    	      node.parent = parent;
    	    }
    	    return node;
    	  });
    	}

    	function writeEdges(g) {
    	  return _.map(g.edges(), function(e) {
    	    var edgeValue = g.edge(e);
    	    var edge = { v: e.v, w: e.w };
    	    if (!_.isUndefined(e.name)) {
    	      edge.name = e.name;
    	    }
    	    if (!_.isUndefined(edgeValue)) {
    	      edge.value = edgeValue;
    	    }
    	    return edge;
    	  });
    	}

    	function read(json) {
    	  var g = new Graph(json.options).setGraph(json.value);
    	  _.each(json.nodes, function(entry) {
    	    g.setNode(entry.v, entry.value);
    	    if (entry.parent) {
    	      g.setParent(entry.v, entry.parent);
    	    }
    	  });
    	  _.each(json.edges, function(entry) {
    	    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
    	  });
    	  return g;
    	}
    	return json;
    }

    var components_1;
    var hasRequiredComponents;

    function requireComponents () {
    	if (hasRequiredComponents) return components_1;
    	hasRequiredComponents = 1;
    	var _ = requireLodash();

    	components_1 = components;

    	function components(g) {
    	  var visited = {};
    	  var cmpts = [];
    	  var cmpt;

    	  function dfs(v) {
    	    if (_.has(visited, v)) return;
    	    visited[v] = true;
    	    cmpt.push(v);
    	    _.each(g.successors(v), dfs);
    	    _.each(g.predecessors(v), dfs);
    	  }

    	  _.each(g.nodes(), function(v) {
    	    cmpt = [];
    	    dfs(v);
    	    if (cmpt.length) {
    	      cmpts.push(cmpt);
    	    }
    	  });

    	  return cmpts;
    	}
    	return components_1;
    }

    var priorityQueue;
    var hasRequiredPriorityQueue;

    function requirePriorityQueue () {
    	if (hasRequiredPriorityQueue) return priorityQueue;
    	hasRequiredPriorityQueue = 1;
    	var _ = requireLodash();

    	priorityQueue = PriorityQueue;

    	/**
    	 * A min-priority queue data structure. This algorithm is derived from Cormen,
    	 * et al., "Introduction to Algorithms". The basic idea of a min-priority
    	 * queue is that you can efficiently (in O(1) time) get the smallest key in
    	 * the queue. Adding and removing elements takes O(log n) time. A key can
    	 * have its priority decreased in O(log n) time.
    	 */
    	function PriorityQueue() {
    	  this._arr = [];
    	  this._keyIndices = {};
    	}

    	/**
    	 * Returns the number of elements in the queue. Takes `O(1)` time.
    	 */
    	PriorityQueue.prototype.size = function() {
    	  return this._arr.length;
    	};

    	/**
    	 * Returns the keys that are in the queue. Takes `O(n)` time.
    	 */
    	PriorityQueue.prototype.keys = function() {
    	  return this._arr.map(function(x) { return x.key; });
    	};

    	/**
    	 * Returns `true` if **key** is in the queue and `false` if not.
    	 */
    	PriorityQueue.prototype.has = function(key) {
    	  return _.has(this._keyIndices, key);
    	};

    	/**
    	 * Returns the priority for **key**. If **key** is not present in the queue
    	 * then this function returns `undefined`. Takes `O(1)` time.
    	 *
    	 * @param {Object} key
    	 */
    	PriorityQueue.prototype.priority = function(key) {
    	  var index = this._keyIndices[key];
    	  if (index !== undefined) {
    	    return this._arr[index].priority;
    	  }
    	};

    	/**
    	 * Returns the key for the minimum element in this queue. If the queue is
    	 * empty this function throws an Error. Takes `O(1)` time.
    	 */
    	PriorityQueue.prototype.min = function() {
    	  if (this.size() === 0) {
    	    throw new Error("Queue underflow");
    	  }
    	  return this._arr[0].key;
    	};

    	/**
    	 * Inserts a new key into the priority queue. If the key already exists in
    	 * the queue this function returns `false`; otherwise it will return `true`.
    	 * Takes `O(n)` time.
    	 *
    	 * @param {Object} key the key to add
    	 * @param {Number} priority the initial priority for the key
    	 */
    	PriorityQueue.prototype.add = function(key, priority) {
    	  var keyIndices = this._keyIndices;
    	  key = String(key);
    	  if (!_.has(keyIndices, key)) {
    	    var arr = this._arr;
    	    var index = arr.length;
    	    keyIndices[key] = index;
    	    arr.push({key: key, priority: priority});
    	    this._decrease(index);
    	    return true;
    	  }
    	  return false;
    	};

    	/**
    	 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
    	 */
    	PriorityQueue.prototype.removeMin = function() {
    	  this._swap(0, this._arr.length - 1);
    	  var min = this._arr.pop();
    	  delete this._keyIndices[min.key];
    	  this._heapify(0);
    	  return min.key;
    	};

    	/**
    	 * Decreases the priority for **key** to **priority**. If the new priority is
    	 * greater than the previous priority, this function will throw an Error.
    	 *
    	 * @param {Object} key the key for which to raise priority
    	 * @param {Number} priority the new priority for the key
    	 */
    	PriorityQueue.prototype.decrease = function(key, priority) {
    	  var index = this._keyIndices[key];
    	  if (priority > this._arr[index].priority) {
    	    throw new Error("New priority is greater than current priority. " +
    	        "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
    	  }
    	  this._arr[index].priority = priority;
    	  this._decrease(index);
    	};

    	PriorityQueue.prototype._heapify = function(i) {
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
    	};

    	PriorityQueue.prototype._decrease = function(index) {
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
    	};

    	PriorityQueue.prototype._swap = function(i, j) {
    	  var arr = this._arr;
    	  var keyIndices = this._keyIndices;
    	  var origArrI = arr[i];
    	  var origArrJ = arr[j];
    	  arr[i] = origArrJ;
    	  arr[j] = origArrI;
    	  keyIndices[origArrJ.key] = i;
    	  keyIndices[origArrI.key] = j;
    	};
    	return priorityQueue;
    }

    var dijkstra_1;
    var hasRequiredDijkstra;

    function requireDijkstra () {
    	if (hasRequiredDijkstra) return dijkstra_1;
    	hasRequiredDijkstra = 1;
    	var _ = requireLodash();
    	var PriorityQueue = requirePriorityQueue();

    	dijkstra_1 = dijkstra;

    	var DEFAULT_WEIGHT_FUNC = _.constant(1);

    	function dijkstra(g, source, weightFn, edgeFn) {
    	  return runDijkstra(g, String(source),
    	    weightFn || DEFAULT_WEIGHT_FUNC,
    	    edgeFn || function(v) { return g.outEdges(v); });
    	}

    	function runDijkstra(g, source, weightFn, edgeFn) {
    	  var results = {};
    	  var pq = new PriorityQueue();
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
    	return dijkstra_1;
    }

    var dijkstraAll_1;
    var hasRequiredDijkstraAll;

    function requireDijkstraAll () {
    	if (hasRequiredDijkstraAll) return dijkstraAll_1;
    	hasRequiredDijkstraAll = 1;
    	var dijkstra = requireDijkstra();
    	var _ = requireLodash();

    	dijkstraAll_1 = dijkstraAll;

    	function dijkstraAll(g, weightFunc, edgeFunc) {
    	  return _.transform(g.nodes(), function(acc, v) {
    	    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
    	  }, {});
    	}
    	return dijkstraAll_1;
    }

    var tarjan_1;
    var hasRequiredTarjan;

    function requireTarjan () {
    	if (hasRequiredTarjan) return tarjan_1;
    	hasRequiredTarjan = 1;
    	var _ = requireLodash();

    	tarjan_1 = tarjan;

    	function tarjan(g) {
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
    	      if (!_.has(visited, w)) {
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
    	    if (!_.has(visited, v)) {
    	      dfs(v);
    	    }
    	  });

    	  return results;
    	}
    	return tarjan_1;
    }

    var findCycles_1;
    var hasRequiredFindCycles;

    function requireFindCycles () {
    	if (hasRequiredFindCycles) return findCycles_1;
    	hasRequiredFindCycles = 1;
    	var _ = requireLodash();
    	var tarjan = requireTarjan();

    	findCycles_1 = findCycles;

    	function findCycles(g) {
    	  return _.filter(tarjan(g), function(cmpt) {
    	    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
    	  });
    	}
    	return findCycles_1;
    }

    var floydWarshall_1;
    var hasRequiredFloydWarshall;

    function requireFloydWarshall () {
    	if (hasRequiredFloydWarshall) return floydWarshall_1;
    	hasRequiredFloydWarshall = 1;
    	var _ = requireLodash();

    	floydWarshall_1 = floydWarshall;

    	var DEFAULT_WEIGHT_FUNC = _.constant(1);

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
    	return floydWarshall_1;
    }

    var topsort_1;
    var hasRequiredTopsort;

    function requireTopsort () {
    	if (hasRequiredTopsort) return topsort_1;
    	hasRequiredTopsort = 1;
    	var _ = requireLodash();

    	topsort_1 = topsort;
    	topsort.CycleException = CycleException;

    	function topsort(g) {
    	  var visited = {};
    	  var stack = {};
    	  var results = [];

    	  function visit(node) {
    	    if (_.has(stack, node)) {
    	      throw new CycleException();
    	    }

    	    if (!_.has(visited, node)) {
    	      stack[node] = true;
    	      visited[node] = true;
    	      _.each(g.predecessors(node), visit);
    	      delete stack[node];
    	      results.push(node);
    	    }
    	  }

    	  _.each(g.sinks(), visit);

    	  if (_.size(visited) !== g.nodeCount()) {
    	    throw new CycleException();
    	  }

    	  return results;
    	}

    	function CycleException() {}
    	CycleException.prototype = new Error(); // must be an instance of Error to pass testing
    	return topsort_1;
    }

    var isAcyclic_1;
    var hasRequiredIsAcyclic;

    function requireIsAcyclic () {
    	if (hasRequiredIsAcyclic) return isAcyclic_1;
    	hasRequiredIsAcyclic = 1;
    	var topsort = requireTopsort();

    	isAcyclic_1 = isAcyclic;

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
    	return isAcyclic_1;
    }

    var dfs_1;
    var hasRequiredDfs;

    function requireDfs () {
    	if (hasRequiredDfs) return dfs_1;
    	hasRequiredDfs = 1;
    	var _ = requireLodash();

    	dfs_1 = dfs;

    	/*
    	 * A helper that preforms a pre- or post-order traversal on the input graph
    	 * and returns the nodes in the order they were visited. If the graph is
    	 * undirected then this algorithm will navigate using neighbors. If the graph
    	 * is directed then this algorithm will navigate using successors.
    	 *
    	 * Order must be one of "pre" or "post".
    	 */
    	function dfs(g, vs, order) {
    	  if (!_.isArray(vs)) {
    	    vs = [vs];
    	  }

    	  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

    	  var acc = [];
    	  var visited = {};
    	  _.each(vs, function(v) {
    	    if (!g.hasNode(v)) {
    	      throw new Error("Graph does not have node: " + v);
    	    }

    	    doDfs(g, v, order === "post", visited, navigation, acc);
    	  });
    	  return acc;
    	}

    	function doDfs(g, v, postorder, visited, navigation, acc) {
    	  if (!_.has(visited, v)) {
    	    visited[v] = true;

    	    if (!postorder) { acc.push(v); }
    	    _.each(navigation(v), function(w) {
    	      doDfs(g, w, postorder, visited, navigation, acc);
    	    });
    	    if (postorder) { acc.push(v); }
    	  }
    	}
    	return dfs_1;
    }

    var postorder_1;
    var hasRequiredPostorder;

    function requirePostorder () {
    	if (hasRequiredPostorder) return postorder_1;
    	hasRequiredPostorder = 1;
    	var dfs = requireDfs();

    	postorder_1 = postorder;

    	function postorder(g, vs) {
    	  return dfs(g, vs, "post");
    	}
    	return postorder_1;
    }

    var preorder_1;
    var hasRequiredPreorder;

    function requirePreorder () {
    	if (hasRequiredPreorder) return preorder_1;
    	hasRequiredPreorder = 1;
    	var dfs = requireDfs();

    	preorder_1 = preorder;

    	function preorder(g, vs) {
    	  return dfs(g, vs, "pre");
    	}
    	return preorder_1;
    }

    var prim_1;
    var hasRequiredPrim;

    function requirePrim () {
    	if (hasRequiredPrim) return prim_1;
    	hasRequiredPrim = 1;
    	var _ = requireLodash();
    	var Graph = requireGraph();
    	var PriorityQueue = requirePriorityQueue();

    	prim_1 = prim;

    	function prim(g, weightFunc) {
    	  var result = new Graph();
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

    	  _.each(g.nodes(), function(v) {
    	    pq.add(v, Number.POSITIVE_INFINITY);
    	    result.setNode(v);
    	  });

    	  // Start from an arbitrary node
    	  pq.decrease(g.nodes()[0], 0);

    	  var init = false;
    	  while (pq.size() > 0) {
    	    v = pq.removeMin();
    	    if (_.has(parents, v)) {
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
    	return prim_1;
    }

    var alg;
    var hasRequiredAlg;

    function requireAlg () {
    	if (hasRequiredAlg) return alg;
    	hasRequiredAlg = 1;
    	alg = {
    	  components: requireComponents(),
    	  dijkstra: requireDijkstra(),
    	  dijkstraAll: requireDijkstraAll(),
    	  findCycles: requireFindCycles(),
    	  floydWarshall: requireFloydWarshall(),
    	  isAcyclic: requireIsAcyclic(),
    	  postorder: requirePostorder(),
    	  preorder: requirePreorder(),
    	  prim: requirePrim(),
    	  tarjan: requireTarjan(),
    	  topsort: requireTopsort()
    	};
    	return alg;
    }

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

    var graphlib$1;
    var hasRequiredGraphlib;

    function requireGraphlib () {
    	if (hasRequiredGraphlib) return graphlib$1;
    	hasRequiredGraphlib = 1;
    	var lib = requireLib();

    	graphlib$1 = {
    	  Graph: lib.Graph,
    	  json: requireJson(),
    	  alg: requireAlg(),
    	  version: lib.version
    	};
    	return graphlib$1;
    }

    /* global window */

    var graphlib;

    if (typeof commonjsRequire === "function") {
      try {
        graphlib = requireGraphlib();
      } catch (e) {
        // continue regardless of error
      }
    }

    if (!graphlib) {
      graphlib = window.graphlib;
    }

    var graphlib_1 = graphlib;

    var cloneDeep_1;
    var hasRequiredCloneDeep;

    function requireCloneDeep () {
    	if (hasRequiredCloneDeep) return cloneDeep_1;
    	hasRequiredCloneDeep = 1;
    	var baseClone = require_baseClone();

    	/** Used to compose bitmasks for cloning. */
    	var CLONE_DEEP_FLAG = 1,
    	    CLONE_SYMBOLS_FLAG = 4;

    	/**
    	 * This method is like `_.clone` except that it recursively clones `value`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 1.0.0
    	 * @category Lang
    	 * @param {*} value The value to recursively clone.
    	 * @returns {*} Returns the deep cloned value.
    	 * @see _.clone
    	 * @example
    	 *
    	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
    	 *
    	 * var deep = _.cloneDeep(objects);
    	 * console.log(deep[0] === objects[0]);
    	 * // => false
    	 */
    	function cloneDeep(value) {
    	  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    	}

    	cloneDeep_1 = cloneDeep;
    	return cloneDeep_1;
    }

    var _isIterateeCall;
    var hasRequired_isIterateeCall;

    function require_isIterateeCall () {
    	if (hasRequired_isIterateeCall) return _isIterateeCall;
    	hasRequired_isIterateeCall = 1;
    	var eq = requireEq(),
    	    isArrayLike = requireIsArrayLike(),
    	    isIndex = require_isIndex(),
    	    isObject = requireIsObject();

    	/**
    	 * Checks if the given arguments are from an iteratee call.
    	 *
    	 * @private
    	 * @param {*} value The potential iteratee value argument.
    	 * @param {*} index The potential iteratee index or key argument.
    	 * @param {*} object The potential iteratee object argument.
    	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
    	 *  else `false`.
    	 */
    	function isIterateeCall(value, index, object) {
    	  if (!isObject(object)) {
    	    return false;
    	  }
    	  var type = typeof index;
    	  if (type == 'number'
    	        ? (isArrayLike(object) && isIndex(index, object.length))
    	        : (type == 'string' && index in object)
    	      ) {
    	    return eq(object[index], value);
    	  }
    	  return false;
    	}

    	_isIterateeCall = isIterateeCall;
    	return _isIterateeCall;
    }

    var defaults_1;
    var hasRequiredDefaults;

    function requireDefaults () {
    	if (hasRequiredDefaults) return defaults_1;
    	hasRequiredDefaults = 1;
    	var baseRest = require_baseRest(),
    	    eq = requireEq(),
    	    isIterateeCall = require_isIterateeCall(),
    	    keysIn = requireKeysIn();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Assigns own and inherited enumerable string keyed properties of source
    	 * objects to the destination object for all destination properties that
    	 * resolve to `undefined`. Source objects are applied from left to right.
    	 * Once a property is set, additional values of the same property are ignored.
    	 *
    	 * **Note:** This method mutates `object`.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The destination object.
    	 * @param {...Object} [sources] The source objects.
    	 * @returns {Object} Returns `object`.
    	 * @see _.defaultsDeep
    	 * @example
    	 *
    	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
    	 * // => { 'a': 1, 'b': 2 }
    	 */
    	var defaults = baseRest(function(object, sources) {
    	  object = Object(object);

    	  var index = -1;
    	  var length = sources.length;
    	  var guard = length > 2 ? sources[2] : undefined;

    	  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    	    length = 1;
    	  }

    	  while (++index < length) {
    	    var source = sources[index];
    	    var props = keysIn(source);
    	    var propsIndex = -1;
    	    var propsLength = props.length;

    	    while (++propsIndex < propsLength) {
    	      var key = props[propsIndex];
    	      var value = object[key];

    	      if (value === undefined ||
    	          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    	        object[key] = source[key];
    	      }
    	    }
    	  }

    	  return object;
    	});

    	defaults_1 = defaults;
    	return defaults_1;
    }

    var _createFind;
    var hasRequired_createFind;

    function require_createFind () {
    	if (hasRequired_createFind) return _createFind;
    	hasRequired_createFind = 1;
    	var baseIteratee = require_baseIteratee(),
    	    isArrayLike = requireIsArrayLike(),
    	    keys = requireKeys();

    	/**
    	 * Creates a `_.find` or `_.findLast` function.
    	 *
    	 * @private
    	 * @param {Function} findIndexFunc The function to find the collection index.
    	 * @returns {Function} Returns the new find function.
    	 */
    	function createFind(findIndexFunc) {
    	  return function(collection, predicate, fromIndex) {
    	    var iterable = Object(collection);
    	    if (!isArrayLike(collection)) {
    	      var iteratee = baseIteratee(predicate, 3);
    	      collection = keys(collection);
    	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    	    }
    	    var index = findIndexFunc(collection, predicate, fromIndex);
    	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    	  };
    	}

    	_createFind = createFind;
    	return _createFind;
    }

    /** Used to match a single whitespace character. */

    var _trimmedEndIndex;
    var hasRequired_trimmedEndIndex;

    function require_trimmedEndIndex () {
    	if (hasRequired_trimmedEndIndex) return _trimmedEndIndex;
    	hasRequired_trimmedEndIndex = 1;
    	var reWhitespace = /\s/;

    	/**
    	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
    	 * character of `string`.
    	 *
    	 * @private
    	 * @param {string} string The string to inspect.
    	 * @returns {number} Returns the index of the last non-whitespace character.
    	 */
    	function trimmedEndIndex(string) {
    	  var index = string.length;

    	  while (index-- && reWhitespace.test(string.charAt(index))) {}
    	  return index;
    	}

    	_trimmedEndIndex = trimmedEndIndex;
    	return _trimmedEndIndex;
    }

    var _baseTrim;
    var hasRequired_baseTrim;

    function require_baseTrim () {
    	if (hasRequired_baseTrim) return _baseTrim;
    	hasRequired_baseTrim = 1;
    	var trimmedEndIndex = require_trimmedEndIndex();

    	/** Used to match leading whitespace. */
    	var reTrimStart = /^\s+/;

    	/**
    	 * The base implementation of `_.trim`.
    	 *
    	 * @private
    	 * @param {string} string The string to trim.
    	 * @returns {string} Returns the trimmed string.
    	 */
    	function baseTrim(string) {
    	  return string
    	    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    	    : string;
    	}

    	_baseTrim = baseTrim;
    	return _baseTrim;
    }

    var toNumber_1;
    var hasRequiredToNumber;

    function requireToNumber () {
    	if (hasRequiredToNumber) return toNumber_1;
    	hasRequiredToNumber = 1;
    	var baseTrim = require_baseTrim(),
    	    isObject = requireIsObject(),
    	    isSymbol = requireIsSymbol();

    	/** Used as references for various `Number` constants. */
    	var NAN = 0 / 0;

    	/** Used to detect bad signed hexadecimal string values. */
    	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    	/** Used to detect binary string values. */
    	var reIsBinary = /^0b[01]+$/i;

    	/** Used to detect octal string values. */
    	var reIsOctal = /^0o[0-7]+$/i;

    	/** Built-in method references without a dependency on `root`. */
    	var freeParseInt = parseInt;

    	/**
    	 * Converts `value` to a number.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to process.
    	 * @returns {number} Returns the number.
    	 * @example
    	 *
    	 * _.toNumber(3.2);
    	 * // => 3.2
    	 *
    	 * _.toNumber(Number.MIN_VALUE);
    	 * // => 5e-324
    	 *
    	 * _.toNumber(Infinity);
    	 * // => Infinity
    	 *
    	 * _.toNumber('3.2');
    	 * // => 3.2
    	 */
    	function toNumber(value) {
    	  if (typeof value == 'number') {
    	    return value;
    	  }
    	  if (isSymbol(value)) {
    	    return NAN;
    	  }
    	  if (isObject(value)) {
    	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    	    value = isObject(other) ? (other + '') : other;
    	  }
    	  if (typeof value != 'string') {
    	    return value === 0 ? value : +value;
    	  }
    	  value = baseTrim(value);
    	  var isBinary = reIsBinary.test(value);
    	  return (isBinary || reIsOctal.test(value))
    	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    	    : (reIsBadHex.test(value) ? NAN : +value);
    	}

    	toNumber_1 = toNumber;
    	return toNumber_1;
    }

    var toFinite_1;
    var hasRequiredToFinite;

    function requireToFinite () {
    	if (hasRequiredToFinite) return toFinite_1;
    	hasRequiredToFinite = 1;
    	var toNumber = requireToNumber();

    	/** Used as references for various `Number` constants. */
    	var INFINITY = 1 / 0,
    	    MAX_INTEGER = 1.7976931348623157e+308;

    	/**
    	 * Converts `value` to a finite number.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.12.0
    	 * @category Lang
    	 * @param {*} value The value to convert.
    	 * @returns {number} Returns the converted number.
    	 * @example
    	 *
    	 * _.toFinite(3.2);
    	 * // => 3.2
    	 *
    	 * _.toFinite(Number.MIN_VALUE);
    	 * // => 5e-324
    	 *
    	 * _.toFinite(Infinity);
    	 * // => 1.7976931348623157e+308
    	 *
    	 * _.toFinite('3.2');
    	 * // => 3.2
    	 */
    	function toFinite(value) {
    	  if (!value) {
    	    return value === 0 ? value : 0;
    	  }
    	  value = toNumber(value);
    	  if (value === INFINITY || value === -INFINITY) {
    	    var sign = (value < 0 ? -1 : 1);
    	    return sign * MAX_INTEGER;
    	  }
    	  return value === value ? value : 0;
    	}

    	toFinite_1 = toFinite;
    	return toFinite_1;
    }

    var toInteger_1;
    var hasRequiredToInteger;

    function requireToInteger () {
    	if (hasRequiredToInteger) return toInteger_1;
    	hasRequiredToInteger = 1;
    	var toFinite = requireToFinite();

    	/**
    	 * Converts `value` to an integer.
    	 *
    	 * **Note:** This method is loosely based on
    	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to convert.
    	 * @returns {number} Returns the converted integer.
    	 * @example
    	 *
    	 * _.toInteger(3.2);
    	 * // => 3
    	 *
    	 * _.toInteger(Number.MIN_VALUE);
    	 * // => 0
    	 *
    	 * _.toInteger(Infinity);
    	 * // => 1.7976931348623157e+308
    	 *
    	 * _.toInteger('3.2');
    	 * // => 3
    	 */
    	function toInteger(value) {
    	  var result = toFinite(value),
    	      remainder = result % 1;

    	  return result === result ? (remainder ? result - remainder : result) : 0;
    	}

    	toInteger_1 = toInteger;
    	return toInteger_1;
    }

    var findIndex_1;
    var hasRequiredFindIndex;

    function requireFindIndex () {
    	if (hasRequiredFindIndex) return findIndex_1;
    	hasRequiredFindIndex = 1;
    	var baseFindIndex = require_baseFindIndex(),
    	    baseIteratee = require_baseIteratee(),
    	    toInteger = requireToInteger();

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeMax = Math.max;

    	/**
    	 * This method is like `_.find` except that it returns the index of the first
    	 * element `predicate` returns truthy for instead of the element itself.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 1.1.0
    	 * @category Array
    	 * @param {Array} array The array to inspect.
    	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
    	 * @param {number} [fromIndex=0] The index to search from.
    	 * @returns {number} Returns the index of the found element, else `-1`.
    	 * @example
    	 *
    	 * var users = [
    	 *   { 'user': 'barney',  'active': false },
    	 *   { 'user': 'fred',    'active': false },
    	 *   { 'user': 'pebbles', 'active': true }
    	 * ];
    	 *
    	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
    	 * // => 0
    	 *
    	 * // The `_.matches` iteratee shorthand.
    	 * _.findIndex(users, { 'user': 'fred', 'active': false });
    	 * // => 1
    	 *
    	 * // The `_.matchesProperty` iteratee shorthand.
    	 * _.findIndex(users, ['active', false]);
    	 * // => 0
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.findIndex(users, 'active');
    	 * // => 2
    	 */
    	function findIndex(array, predicate, fromIndex) {
    	  var length = array == null ? 0 : array.length;
    	  if (!length) {
    	    return -1;
    	  }
    	  var index = fromIndex == null ? 0 : toInteger(fromIndex);
    	  if (index < 0) {
    	    index = nativeMax(length + index, 0);
    	  }
    	  return baseFindIndex(array, baseIteratee(predicate, 3), index);
    	}

    	findIndex_1 = findIndex;
    	return findIndex_1;
    }

    var find_1;
    var hasRequiredFind;

    function requireFind () {
    	if (hasRequiredFind) return find_1;
    	hasRequiredFind = 1;
    	var createFind = require_createFind(),
    	    findIndex = requireFindIndex();

    	/**
    	 * Iterates over elements of `collection`, returning the first element
    	 * `predicate` returns truthy for. The predicate is invoked with three
    	 * arguments: (value, index|key, collection).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to inspect.
    	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
    	 * @param {number} [fromIndex=0] The index to search from.
    	 * @returns {*} Returns the matched element, else `undefined`.
    	 * @example
    	 *
    	 * var users = [
    	 *   { 'user': 'barney',  'age': 36, 'active': true },
    	 *   { 'user': 'fred',    'age': 40, 'active': false },
    	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
    	 * ];
    	 *
    	 * _.find(users, function(o) { return o.age < 40; });
    	 * // => object for 'barney'
    	 *
    	 * // The `_.matches` iteratee shorthand.
    	 * _.find(users, { 'age': 1, 'active': true });
    	 * // => object for 'pebbles'
    	 *
    	 * // The `_.matchesProperty` iteratee shorthand.
    	 * _.find(users, ['active', false]);
    	 * // => object for 'fred'
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.find(users, 'active');
    	 * // => object for 'barney'
    	 */
    	var find = createFind(findIndex);

    	find_1 = find;
    	return find_1;
    }

    var flatten_1;
    var hasRequiredFlatten;

    function requireFlatten () {
    	if (hasRequiredFlatten) return flatten_1;
    	hasRequiredFlatten = 1;
    	var baseFlatten = require_baseFlatten();

    	/**
    	 * Flattens `array` a single level deep.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Array
    	 * @param {Array} array The array to flatten.
    	 * @returns {Array} Returns the new flattened array.
    	 * @example
    	 *
    	 * _.flatten([1, [2, [3, [4]], 5]]);
    	 * // => [1, 2, [3, [4]], 5]
    	 */
    	function flatten(array) {
    	  var length = array == null ? 0 : array.length;
    	  return length ? baseFlatten(array, 1) : [];
    	}

    	flatten_1 = flatten;
    	return flatten_1;
    }

    var forIn_1;
    var hasRequiredForIn;

    function requireForIn () {
    	if (hasRequiredForIn) return forIn_1;
    	hasRequiredForIn = 1;
    	var baseFor = require_baseFor(),
    	    castFunction = require_castFunction(),
    	    keysIn = requireKeysIn();

    	/**
    	 * Iterates over own and inherited enumerable string keyed properties of an
    	 * object and invokes `iteratee` for each property. The iteratee is invoked
    	 * with three arguments: (value, key, object). Iteratee functions may exit
    	 * iteration early by explicitly returning `false`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.3.0
    	 * @category Object
    	 * @param {Object} object The object to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @returns {Object} Returns `object`.
    	 * @see _.forInRight
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.forIn(new Foo, function(value, key) {
    	 *   console.log(key);
    	 * });
    	 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
    	 */
    	function forIn(object, iteratee) {
    	  return object == null
    	    ? object
    	    : baseFor(object, castFunction(iteratee), keysIn);
    	}

    	forIn_1 = forIn;
    	return forIn_1;
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */

    var last_1;
    var hasRequiredLast;

    function requireLast () {
    	if (hasRequiredLast) return last_1;
    	hasRequiredLast = 1;
    	function last(array) {
    	  var length = array == null ? 0 : array.length;
    	  return length ? array[length - 1] : undefined;
    	}

    	last_1 = last;
    	return last_1;
    }

    var mapValues_1;
    var hasRequiredMapValues;

    function requireMapValues () {
    	if (hasRequiredMapValues) return mapValues_1;
    	hasRequiredMapValues = 1;
    	var baseAssignValue = require_baseAssignValue(),
    	    baseForOwn = require_baseForOwn(),
    	    baseIteratee = require_baseIteratee();

    	/**
    	 * Creates an object with the same keys as `object` and values generated
    	 * by running each own enumerable string keyed property of `object` thru
    	 * `iteratee`. The iteratee is invoked with three arguments:
    	 * (value, key, object).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 2.4.0
    	 * @category Object
    	 * @param {Object} object The object to iterate over.
    	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
    	 * @returns {Object} Returns the new mapped object.
    	 * @see _.mapKeys
    	 * @example
    	 *
    	 * var users = {
    	 *   'fred':    { 'user': 'fred',    'age': 40 },
    	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
    	 * };
    	 *
    	 * _.mapValues(users, function(o) { return o.age; });
    	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.mapValues(users, 'age');
    	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
    	 */
    	function mapValues(object, iteratee) {
    	  var result = {};
    	  iteratee = baseIteratee(iteratee, 3);

    	  baseForOwn(object, function(value, key, object) {
    	    baseAssignValue(result, key, iteratee(value, key, object));
    	  });
    	  return result;
    	}

    	mapValues_1 = mapValues;
    	return mapValues_1;
    }

    var _baseExtremum;
    var hasRequired_baseExtremum;

    function require_baseExtremum () {
    	if (hasRequired_baseExtremum) return _baseExtremum;
    	hasRequired_baseExtremum = 1;
    	var isSymbol = requireIsSymbol();

    	/**
    	 * The base implementation of methods like `_.max` and `_.min` which accepts a
    	 * `comparator` to determine the extremum value.
    	 *
    	 * @private
    	 * @param {Array} array The array to iterate over.
    	 * @param {Function} iteratee The iteratee invoked per iteration.
    	 * @param {Function} comparator The comparator used to compare values.
    	 * @returns {*} Returns the extremum value.
    	 */
    	function baseExtremum(array, iteratee, comparator) {
    	  var index = -1,
    	      length = array.length;

    	  while (++index < length) {
    	    var value = array[index],
    	        current = iteratee(value);

    	    if (current != null && (computed === undefined
    	          ? (current === current && !isSymbol(current))
    	          : comparator(current, computed)
    	        )) {
    	      var computed = current,
    	          result = value;
    	    }
    	  }
    	  return result;
    	}

    	_baseExtremum = baseExtremum;
    	return _baseExtremum;
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */

    var _baseGt;
    var hasRequired_baseGt;

    function require_baseGt () {
    	if (hasRequired_baseGt) return _baseGt;
    	hasRequired_baseGt = 1;
    	function baseGt(value, other) {
    	  return value > other;
    	}

    	_baseGt = baseGt;
    	return _baseGt;
    }

    var max_1;
    var hasRequiredMax;

    function requireMax () {
    	if (hasRequiredMax) return max_1;
    	hasRequiredMax = 1;
    	var baseExtremum = require_baseExtremum(),
    	    baseGt = require_baseGt(),
    	    identity = requireIdentity();

    	/**
    	 * Computes the maximum value of `array`. If `array` is empty or falsey,
    	 * `undefined` is returned.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Math
    	 * @param {Array} array The array to iterate over.
    	 * @returns {*} Returns the maximum value.
    	 * @example
    	 *
    	 * _.max([4, 2, 8, 6]);
    	 * // => 8
    	 *
    	 * _.max([]);
    	 * // => undefined
    	 */
    	function max(array) {
    	  return (array && array.length)
    	    ? baseExtremum(array, identity, baseGt)
    	    : undefined;
    	}

    	max_1 = max;
    	return max_1;
    }

    var _assignMergeValue;
    var hasRequired_assignMergeValue;

    function require_assignMergeValue () {
    	if (hasRequired_assignMergeValue) return _assignMergeValue;
    	hasRequired_assignMergeValue = 1;
    	var baseAssignValue = require_baseAssignValue(),
    	    eq = requireEq();

    	/**
    	 * This function is like `assignValue` except that it doesn't assign
    	 * `undefined` values.
    	 *
    	 * @private
    	 * @param {Object} object The object to modify.
    	 * @param {string} key The key of the property to assign.
    	 * @param {*} value The value to assign.
    	 */
    	function assignMergeValue(object, key, value) {
    	  if ((value !== undefined && !eq(object[key], value)) ||
    	      (value === undefined && !(key in object))) {
    	    baseAssignValue(object, key, value);
    	  }
    	}

    	_assignMergeValue = assignMergeValue;
    	return _assignMergeValue;
    }

    var isPlainObject_1;
    var hasRequiredIsPlainObject;

    function requireIsPlainObject () {
    	if (hasRequiredIsPlainObject) return isPlainObject_1;
    	hasRequiredIsPlainObject = 1;
    	var baseGetTag = require_baseGetTag(),
    	    getPrototype = require_getPrototype(),
    	    isObjectLike = requireIsObjectLike();

    	/** `Object#toString` result references. */
    	var objectTag = '[object Object]';

    	/** Used for built-in method references. */
    	var funcProto = Function.prototype,
    	    objectProto = Object.prototype;

    	/** Used to resolve the decompiled source of functions. */
    	var funcToString = funcProto.toString;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/** Used to infer the `Object` constructor. */
    	var objectCtorString = funcToString.call(Object);

    	/**
    	 * Checks if `value` is a plain object, that is, an object created by the
    	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.8.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 * }
    	 *
    	 * _.isPlainObject(new Foo);
    	 * // => false
    	 *
    	 * _.isPlainObject([1, 2, 3]);
    	 * // => false
    	 *
    	 * _.isPlainObject({ 'x': 0, 'y': 0 });
    	 * // => true
    	 *
    	 * _.isPlainObject(Object.create(null));
    	 * // => true
    	 */
    	function isPlainObject(value) {
    	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    	    return false;
    	  }
    	  var proto = getPrototype(value);
    	  if (proto === null) {
    	    return true;
    	  }
    	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    	    funcToString.call(Ctor) == objectCtorString;
    	}

    	isPlainObject_1 = isPlainObject;
    	return isPlainObject_1;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */

    var _safeGet;
    var hasRequired_safeGet;

    function require_safeGet () {
    	if (hasRequired_safeGet) return _safeGet;
    	hasRequired_safeGet = 1;
    	function safeGet(object, key) {
    	  if (key === 'constructor' && typeof object[key] === 'function') {
    	    return;
    	  }

    	  if (key == '__proto__') {
    	    return;
    	  }

    	  return object[key];
    	}

    	_safeGet = safeGet;
    	return _safeGet;
    }

    var toPlainObject_1;
    var hasRequiredToPlainObject;

    function requireToPlainObject () {
    	if (hasRequiredToPlainObject) return toPlainObject_1;
    	hasRequiredToPlainObject = 1;
    	var copyObject = require_copyObject(),
    	    keysIn = requireKeysIn();

    	/**
    	 * Converts `value` to a plain object flattening inherited enumerable string
    	 * keyed properties of `value` to own properties of the plain object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 3.0.0
    	 * @category Lang
    	 * @param {*} value The value to convert.
    	 * @returns {Object} Returns the converted plain object.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.assign({ 'a': 1 }, new Foo);
    	 * // => { 'a': 1, 'b': 2 }
    	 *
    	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
    	 * // => { 'a': 1, 'b': 2, 'c': 3 }
    	 */
    	function toPlainObject(value) {
    	  return copyObject(value, keysIn(value));
    	}

    	toPlainObject_1 = toPlainObject;
    	return toPlainObject_1;
    }

    var _baseMergeDeep;
    var hasRequired_baseMergeDeep;

    function require_baseMergeDeep () {
    	if (hasRequired_baseMergeDeep) return _baseMergeDeep;
    	hasRequired_baseMergeDeep = 1;
    	var assignMergeValue = require_assignMergeValue(),
    	    cloneBuffer = require_cloneBuffer(),
    	    cloneTypedArray = require_cloneTypedArray(),
    	    copyArray = require_copyArray(),
    	    initCloneObject = require_initCloneObject(),
    	    isArguments = requireIsArguments(),
    	    isArray = requireIsArray(),
    	    isArrayLikeObject = requireIsArrayLikeObject(),
    	    isBuffer = requireIsBuffer(),
    	    isFunction = requireIsFunction(),
    	    isObject = requireIsObject(),
    	    isPlainObject = requireIsPlainObject(),
    	    isTypedArray = requireIsTypedArray(),
    	    safeGet = require_safeGet(),
    	    toPlainObject = requireToPlainObject();

    	/**
    	 * A specialized version of `baseMerge` for arrays and objects which performs
    	 * deep merges and tracks traversed objects enabling objects with circular
    	 * references to be merged.
    	 *
    	 * @private
    	 * @param {Object} object The destination object.
    	 * @param {Object} source The source object.
    	 * @param {string} key The key of the value to merge.
    	 * @param {number} srcIndex The index of `source`.
    	 * @param {Function} mergeFunc The function to merge values.
    	 * @param {Function} [customizer] The function to customize assigned values.
    	 * @param {Object} [stack] Tracks traversed source values and their merged
    	 *  counterparts.
    	 */
    	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    	  var objValue = safeGet(object, key),
    	      srcValue = safeGet(source, key),
    	      stacked = stack.get(srcValue);

    	  if (stacked) {
    	    assignMergeValue(object, key, stacked);
    	    return;
    	  }
    	  var newValue = customizer
    	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    	    : undefined;

    	  var isCommon = newValue === undefined;

    	  if (isCommon) {
    	    var isArr = isArray(srcValue),
    	        isBuff = !isArr && isBuffer(srcValue),
    	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    	    newValue = srcValue;
    	    if (isArr || isBuff || isTyped) {
    	      if (isArray(objValue)) {
    	        newValue = objValue;
    	      }
    	      else if (isArrayLikeObject(objValue)) {
    	        newValue = copyArray(objValue);
    	      }
    	      else if (isBuff) {
    	        isCommon = false;
    	        newValue = cloneBuffer(srcValue, true);
    	      }
    	      else if (isTyped) {
    	        isCommon = false;
    	        newValue = cloneTypedArray(srcValue, true);
    	      }
    	      else {
    	        newValue = [];
    	      }
    	    }
    	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
    	      newValue = objValue;
    	      if (isArguments(objValue)) {
    	        newValue = toPlainObject(objValue);
    	      }
    	      else if (!isObject(objValue) || isFunction(objValue)) {
    	        newValue = initCloneObject(srcValue);
    	      }
    	    }
    	    else {
    	      isCommon = false;
    	    }
    	  }
    	  if (isCommon) {
    	    // Recursively merge objects and arrays (susceptible to call stack limits).
    	    stack.set(srcValue, newValue);
    	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    	    stack['delete'](srcValue);
    	  }
    	  assignMergeValue(object, key, newValue);
    	}

    	_baseMergeDeep = baseMergeDeep;
    	return _baseMergeDeep;
    }

    var _baseMerge;
    var hasRequired_baseMerge;

    function require_baseMerge () {
    	if (hasRequired_baseMerge) return _baseMerge;
    	hasRequired_baseMerge = 1;
    	var Stack = require_Stack(),
    	    assignMergeValue = require_assignMergeValue(),
    	    baseFor = require_baseFor(),
    	    baseMergeDeep = require_baseMergeDeep(),
    	    isObject = requireIsObject(),
    	    keysIn = requireKeysIn(),
    	    safeGet = require_safeGet();

    	/**
    	 * The base implementation of `_.merge` without support for multiple sources.
    	 *
    	 * @private
    	 * @param {Object} object The destination object.
    	 * @param {Object} source The source object.
    	 * @param {number} srcIndex The index of `source`.
    	 * @param {Function} [customizer] The function to customize merged values.
    	 * @param {Object} [stack] Tracks traversed source values and their merged
    	 *  counterparts.
    	 */
    	function baseMerge(object, source, srcIndex, customizer, stack) {
    	  if (object === source) {
    	    return;
    	  }
    	  baseFor(source, function(srcValue, key) {
    	    stack || (stack = new Stack);
    	    if (isObject(srcValue)) {
    	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    	    }
    	    else {
    	      var newValue = customizer
    	        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
    	        : undefined;

    	      if (newValue === undefined) {
    	        newValue = srcValue;
    	      }
    	      assignMergeValue(object, key, newValue);
    	    }
    	  }, keysIn);
    	}

    	_baseMerge = baseMerge;
    	return _baseMerge;
    }

    var _createAssigner;
    var hasRequired_createAssigner;

    function require_createAssigner () {
    	if (hasRequired_createAssigner) return _createAssigner;
    	hasRequired_createAssigner = 1;
    	var baseRest = require_baseRest(),
    	    isIterateeCall = require_isIterateeCall();

    	/**
    	 * Creates a function like `_.assign`.
    	 *
    	 * @private
    	 * @param {Function} assigner The function to assign values.
    	 * @returns {Function} Returns the new assigner function.
    	 */
    	function createAssigner(assigner) {
    	  return baseRest(function(object, sources) {
    	    var index = -1,
    	        length = sources.length,
    	        customizer = length > 1 ? sources[length - 1] : undefined,
    	        guard = length > 2 ? sources[2] : undefined;

    	    customizer = (assigner.length > 3 && typeof customizer == 'function')
    	      ? (length--, customizer)
    	      : undefined;

    	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    	      customizer = length < 3 ? undefined : customizer;
    	      length = 1;
    	    }
    	    object = Object(object);
    	    while (++index < length) {
    	      var source = sources[index];
    	      if (source) {
    	        assigner(object, source, index, customizer);
    	      }
    	    }
    	    return object;
    	  });
    	}

    	_createAssigner = createAssigner;
    	return _createAssigner;
    }

    var merge_1;
    var hasRequiredMerge;

    function requireMerge () {
    	if (hasRequiredMerge) return merge_1;
    	hasRequiredMerge = 1;
    	var baseMerge = require_baseMerge(),
    	    createAssigner = require_createAssigner();

    	/**
    	 * This method is like `_.assign` except that it recursively merges own and
    	 * inherited enumerable string keyed properties of source objects into the
    	 * destination object. Source properties that resolve to `undefined` are
    	 * skipped if a destination value exists. Array and plain object properties
    	 * are merged recursively. Other objects and value types are overridden by
    	 * assignment. Source objects are applied from left to right. Subsequent
    	 * sources overwrite property assignments of previous sources.
    	 *
    	 * **Note:** This method mutates `object`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.5.0
    	 * @category Object
    	 * @param {Object} object The destination object.
    	 * @param {...Object} [sources] The source objects.
    	 * @returns {Object} Returns `object`.
    	 * @example
    	 *
    	 * var object = {
    	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
    	 * };
    	 *
    	 * var other = {
    	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
    	 * };
    	 *
    	 * _.merge(object, other);
    	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
    	 */
    	var merge = createAssigner(function(object, source, srcIndex) {
    	  baseMerge(object, source, srcIndex);
    	});

    	merge_1 = merge;
    	return merge_1;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */

    var _baseLt;
    var hasRequired_baseLt;

    function require_baseLt () {
    	if (hasRequired_baseLt) return _baseLt;
    	hasRequired_baseLt = 1;
    	function baseLt(value, other) {
    	  return value < other;
    	}

    	_baseLt = baseLt;
    	return _baseLt;
    }

    var min_1;
    var hasRequiredMin;

    function requireMin () {
    	if (hasRequiredMin) return min_1;
    	hasRequiredMin = 1;
    	var baseExtremum = require_baseExtremum(),
    	    baseLt = require_baseLt(),
    	    identity = requireIdentity();

    	/**
    	 * Computes the minimum value of `array`. If `array` is empty or falsey,
    	 * `undefined` is returned.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Math
    	 * @param {Array} array The array to iterate over.
    	 * @returns {*} Returns the minimum value.
    	 * @example
    	 *
    	 * _.min([4, 2, 8, 6]);
    	 * // => 2
    	 *
    	 * _.min([]);
    	 * // => undefined
    	 */
    	function min(array) {
    	  return (array && array.length)
    	    ? baseExtremum(array, identity, baseLt)
    	    : undefined;
    	}

    	min_1 = min;
    	return min_1;
    }

    var minBy_1;
    var hasRequiredMinBy;

    function requireMinBy () {
    	if (hasRequiredMinBy) return minBy_1;
    	hasRequiredMinBy = 1;
    	var baseExtremum = require_baseExtremum(),
    	    baseIteratee = require_baseIteratee(),
    	    baseLt = require_baseLt();

    	/**
    	 * This method is like `_.min` except that it accepts `iteratee` which is
    	 * invoked for each element in `array` to generate the criterion by which
    	 * the value is ranked. The iteratee is invoked with one argument: (value).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Math
    	 * @param {Array} array The array to iterate over.
    	 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
    	 * @returns {*} Returns the minimum value.
    	 * @example
    	 *
    	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
    	 *
    	 * _.minBy(objects, function(o) { return o.n; });
    	 * // => { 'n': 1 }
    	 *
    	 * // The `_.property` iteratee shorthand.
    	 * _.minBy(objects, 'n');
    	 * // => { 'n': 1 }
    	 */
    	function minBy(array, iteratee) {
    	  return (array && array.length)
    	    ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt)
    	    : undefined;
    	}

    	minBy_1 = minBy;
    	return minBy_1;
    }

    var now_1;
    var hasRequiredNow;

    function requireNow () {
    	if (hasRequiredNow) return now_1;
    	hasRequiredNow = 1;
    	var root = require_root();

    	/**
    	 * Gets the timestamp of the number of milliseconds that have elapsed since
    	 * the Unix epoch (1 January 1970 00:00:00 UTC).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 2.4.0
    	 * @category Date
    	 * @returns {number} Returns the timestamp.
    	 * @example
    	 *
    	 * _.defer(function(stamp) {
    	 *   console.log(_.now() - stamp);
    	 * }, _.now());
    	 * // => Logs the number of milliseconds it took for the deferred invocation.
    	 */
    	var now = function() {
    	  return root.Date.now();
    	};

    	now_1 = now;
    	return now_1;
    }

    var _baseSet;
    var hasRequired_baseSet;

    function require_baseSet () {
    	if (hasRequired_baseSet) return _baseSet;
    	hasRequired_baseSet = 1;
    	var assignValue = require_assignValue(),
    	    castPath = require_castPath(),
    	    isIndex = require_isIndex(),
    	    isObject = requireIsObject(),
    	    toKey = require_toKey();

    	/**
    	 * The base implementation of `_.set`.
    	 *
    	 * @private
    	 * @param {Object} object The object to modify.
    	 * @param {Array|string} path The path of the property to set.
    	 * @param {*} value The value to set.
    	 * @param {Function} [customizer] The function to customize path creation.
    	 * @returns {Object} Returns `object`.
    	 */
    	function baseSet(object, path, value, customizer) {
    	  if (!isObject(object)) {
    	    return object;
    	  }
    	  path = castPath(path, object);

    	  var index = -1,
    	      length = path.length,
    	      lastIndex = length - 1,
    	      nested = object;

    	  while (nested != null && ++index < length) {
    	    var key = toKey(path[index]),
    	        newValue = value;

    	    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    	      return object;
    	    }

    	    if (index != lastIndex) {
    	      var objValue = nested[key];
    	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
    	      if (newValue === undefined) {
    	        newValue = isObject(objValue)
    	          ? objValue
    	          : (isIndex(path[index + 1]) ? [] : {});
    	      }
    	    }
    	    assignValue(nested, key, newValue);
    	    nested = nested[key];
    	  }
    	  return object;
    	}

    	_baseSet = baseSet;
    	return _baseSet;
    }

    var _basePickBy;
    var hasRequired_basePickBy;

    function require_basePickBy () {
    	if (hasRequired_basePickBy) return _basePickBy;
    	hasRequired_basePickBy = 1;
    	var baseGet = require_baseGet(),
    	    baseSet = require_baseSet(),
    	    castPath = require_castPath();

    	/**
    	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Object} object The source object.
    	 * @param {string[]} paths The property paths to pick.
    	 * @param {Function} predicate The function invoked per property.
    	 * @returns {Object} Returns the new object.
    	 */
    	function basePickBy(object, paths, predicate) {
    	  var index = -1,
    	      length = paths.length,
    	      result = {};

    	  while (++index < length) {
    	    var path = paths[index],
    	        value = baseGet(object, path);

    	    if (predicate(value, path)) {
    	      baseSet(result, castPath(path, object), value);
    	    }
    	  }
    	  return result;
    	}

    	_basePickBy = basePickBy;
    	return _basePickBy;
    }

    var _basePick;
    var hasRequired_basePick;

    function require_basePick () {
    	if (hasRequired_basePick) return _basePick;
    	hasRequired_basePick = 1;
    	var basePickBy = require_basePickBy(),
    	    hasIn = requireHasIn();

    	/**
    	 * The base implementation of `_.pick` without support for individual
    	 * property identifiers.
    	 *
    	 * @private
    	 * @param {Object} object The source object.
    	 * @param {string[]} paths The property paths to pick.
    	 * @returns {Object} Returns the new object.
    	 */
    	function basePick(object, paths) {
    	  return basePickBy(object, paths, function(value, path) {
    	    return hasIn(object, path);
    	  });
    	}

    	_basePick = basePick;
    	return _basePick;
    }

    var _flatRest;
    var hasRequired_flatRest;

    function require_flatRest () {
    	if (hasRequired_flatRest) return _flatRest;
    	hasRequired_flatRest = 1;
    	var flatten = requireFlatten(),
    	    overRest = require_overRest(),
    	    setToString = require_setToString();

    	/**
    	 * A specialized version of `baseRest` which flattens the rest array.
    	 *
    	 * @private
    	 * @param {Function} func The function to apply a rest parameter to.
    	 * @returns {Function} Returns the new function.
    	 */
    	function flatRest(func) {
    	  return setToString(overRest(func, undefined, flatten), func + '');
    	}

    	_flatRest = flatRest;
    	return _flatRest;
    }

    var pick_1;
    var hasRequiredPick;

    function requirePick () {
    	if (hasRequiredPick) return pick_1;
    	hasRequiredPick = 1;
    	var basePick = require_basePick(),
    	    flatRest = require_flatRest();

    	/**
    	 * Creates an object composed of the picked `object` properties.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The source object.
    	 * @param {...(string|string[])} [paths] The property paths to pick.
    	 * @returns {Object} Returns the new object.
    	 * @example
    	 *
    	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
    	 *
    	 * _.pick(object, ['a', 'c']);
    	 * // => { 'a': 1, 'c': 3 }
    	 */
    	var pick = flatRest(function(object, paths) {
    	  return object == null ? {} : basePick(object, paths);
    	});

    	pick_1 = pick;
    	return pick_1;
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */

    var _baseRange;
    var hasRequired_baseRange;

    function require_baseRange () {
    	if (hasRequired_baseRange) return _baseRange;
    	hasRequired_baseRange = 1;
    	var nativeCeil = Math.ceil,
    	    nativeMax = Math.max;

    	/**
    	 * The base implementation of `_.range` and `_.rangeRight` which doesn't
    	 * coerce arguments.
    	 *
    	 * @private
    	 * @param {number} start The start of the range.
    	 * @param {number} end The end of the range.
    	 * @param {number} step The value to increment or decrement by.
    	 * @param {boolean} [fromRight] Specify iterating from right to left.
    	 * @returns {Array} Returns the range of numbers.
    	 */
    	function baseRange(start, end, step, fromRight) {
    	  var index = -1,
    	      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
    	      result = Array(length);

    	  while (length--) {
    	    result[fromRight ? length : ++index] = start;
    	    start += step;
    	  }
    	  return result;
    	}

    	_baseRange = baseRange;
    	return _baseRange;
    }

    var _createRange;
    var hasRequired_createRange;

    function require_createRange () {
    	if (hasRequired_createRange) return _createRange;
    	hasRequired_createRange = 1;
    	var baseRange = require_baseRange(),
    	    isIterateeCall = require_isIterateeCall(),
    	    toFinite = requireToFinite();

    	/**
    	 * Creates a `_.range` or `_.rangeRight` function.
    	 *
    	 * @private
    	 * @param {boolean} [fromRight] Specify iterating from right to left.
    	 * @returns {Function} Returns the new range function.
    	 */
    	function createRange(fromRight) {
    	  return function(start, end, step) {
    	    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
    	      end = step = undefined;
    	    }
    	    // Ensure the sign of `-0` is preserved.
    	    start = toFinite(start);
    	    if (end === undefined) {
    	      end = start;
    	      start = 0;
    	    } else {
    	      end = toFinite(end);
    	    }
    	    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    	    return baseRange(start, end, step, fromRight);
    	  };
    	}

    	_createRange = createRange;
    	return _createRange;
    }

    var range_1;
    var hasRequiredRange;

    function requireRange () {
    	if (hasRequiredRange) return range_1;
    	hasRequiredRange = 1;
    	var createRange = require_createRange();

    	/**
    	 * Creates an array of numbers (positive and/or negative) progressing from
    	 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
    	 * `start` is specified without an `end` or `step`. If `end` is not specified,
    	 * it's set to `start` with `start` then set to `0`.
    	 *
    	 * **Note:** JavaScript follows the IEEE-754 standard for resolving
    	 * floating-point values which can produce unexpected results.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Util
    	 * @param {number} [start=0] The start of the range.
    	 * @param {number} end The end of the range.
    	 * @param {number} [step=1] The value to increment or decrement by.
    	 * @returns {Array} Returns the range of numbers.
    	 * @see _.inRange, _.rangeRight
    	 * @example
    	 *
    	 * _.range(4);
    	 * // => [0, 1, 2, 3]
    	 *
    	 * _.range(-4);
    	 * // => [0, -1, -2, -3]
    	 *
    	 * _.range(1, 5);
    	 * // => [1, 2, 3, 4]
    	 *
    	 * _.range(0, 20, 5);
    	 * // => [0, 5, 10, 15]
    	 *
    	 * _.range(0, -4, -1);
    	 * // => [0, -1, -2, -3]
    	 *
    	 * _.range(1, 4, 0);
    	 * // => [1, 1, 1]
    	 *
    	 * _.range(0);
    	 * // => []
    	 */
    	var range = createRange();

    	range_1 = range;
    	return range_1;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define the
     * sort order of `array` and replaces criteria objects with their corresponding
     * values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */

    var _baseSortBy;
    var hasRequired_baseSortBy;

    function require_baseSortBy () {
    	if (hasRequired_baseSortBy) return _baseSortBy;
    	hasRequired_baseSortBy = 1;
    	function baseSortBy(array, comparer) {
    	  var length = array.length;

    	  array.sort(comparer);
    	  while (length--) {
    	    array[length] = array[length].value;
    	  }
    	  return array;
    	}

    	_baseSortBy = baseSortBy;
    	return _baseSortBy;
    }

    var _compareAscending;
    var hasRequired_compareAscending;

    function require_compareAscending () {
    	if (hasRequired_compareAscending) return _compareAscending;
    	hasRequired_compareAscending = 1;
    	var isSymbol = requireIsSymbol();

    	/**
    	 * Compares values to sort them in ascending order.
    	 *
    	 * @private
    	 * @param {*} value The value to compare.
    	 * @param {*} other The other value to compare.
    	 * @returns {number} Returns the sort order indicator for `value`.
    	 */
    	function compareAscending(value, other) {
    	  if (value !== other) {
    	    var valIsDefined = value !== undefined,
    	        valIsNull = value === null,
    	        valIsReflexive = value === value,
    	        valIsSymbol = isSymbol(value);

    	    var othIsDefined = other !== undefined,
    	        othIsNull = other === null,
    	        othIsReflexive = other === other,
    	        othIsSymbol = isSymbol(other);

    	    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
    	        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
    	        (valIsNull && othIsDefined && othIsReflexive) ||
    	        (!valIsDefined && othIsReflexive) ||
    	        !valIsReflexive) {
    	      return 1;
    	    }
    	    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
    	        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
    	        (othIsNull && valIsDefined && valIsReflexive) ||
    	        (!othIsDefined && valIsReflexive) ||
    	        !othIsReflexive) {
    	      return -1;
    	    }
    	  }
    	  return 0;
    	}

    	_compareAscending = compareAscending;
    	return _compareAscending;
    }

    var _compareMultiple;
    var hasRequired_compareMultiple;

    function require_compareMultiple () {
    	if (hasRequired_compareMultiple) return _compareMultiple;
    	hasRequired_compareMultiple = 1;
    	var compareAscending = require_compareAscending();

    	/**
    	 * Used by `_.orderBy` to compare multiple properties of a value to another
    	 * and stable sort them.
    	 *
    	 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
    	 * specify an order of "desc" for descending or "asc" for ascending sort order
    	 * of corresponding values.
    	 *
    	 * @private
    	 * @param {Object} object The object to compare.
    	 * @param {Object} other The other object to compare.
    	 * @param {boolean[]|string[]} orders The order to sort by for each property.
    	 * @returns {number} Returns the sort order indicator for `object`.
    	 */
    	function compareMultiple(object, other, orders) {
    	  var index = -1,
    	      objCriteria = object.criteria,
    	      othCriteria = other.criteria,
    	      length = objCriteria.length,
    	      ordersLength = orders.length;

    	  while (++index < length) {
    	    var result = compareAscending(objCriteria[index], othCriteria[index]);
    	    if (result) {
    	      if (index >= ordersLength) {
    	        return result;
    	      }
    	      var order = orders[index];
    	      return result * (order == 'desc' ? -1 : 1);
    	    }
    	  }
    	  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    	  // that causes it, under certain circumstances, to provide the same value for
    	  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    	  // for more details.
    	  //
    	  // This also ensures a stable sort in V8 and other engines.
    	  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
    	  return object.index - other.index;
    	}

    	_compareMultiple = compareMultiple;
    	return _compareMultiple;
    }

    var _baseOrderBy;
    var hasRequired_baseOrderBy;

    function require_baseOrderBy () {
    	if (hasRequired_baseOrderBy) return _baseOrderBy;
    	hasRequired_baseOrderBy = 1;
    	var arrayMap = require_arrayMap(),
    	    baseGet = require_baseGet(),
    	    baseIteratee = require_baseIteratee(),
    	    baseMap = require_baseMap(),
    	    baseSortBy = require_baseSortBy(),
    	    baseUnary = require_baseUnary(),
    	    compareMultiple = require_compareMultiple(),
    	    identity = requireIdentity(),
    	    isArray = requireIsArray();

    	/**
    	 * The base implementation of `_.orderBy` without param guards.
    	 *
    	 * @private
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
    	 * @param {string[]} orders The sort orders of `iteratees`.
    	 * @returns {Array} Returns the new sorted array.
    	 */
    	function baseOrderBy(collection, iteratees, orders) {
    	  if (iteratees.length) {
    	    iteratees = arrayMap(iteratees, function(iteratee) {
    	      if (isArray(iteratee)) {
    	        return function(value) {
    	          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
    	        }
    	      }
    	      return iteratee;
    	    });
    	  } else {
    	    iteratees = [identity];
    	  }

    	  var index = -1;
    	  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

    	  var result = baseMap(collection, function(value, key, collection) {
    	    var criteria = arrayMap(iteratees, function(iteratee) {
    	      return iteratee(value);
    	    });
    	    return { 'criteria': criteria, 'index': ++index, 'value': value };
    	  });

    	  return baseSortBy(result, function(object, other) {
    	    return compareMultiple(object, other, orders);
    	  });
    	}

    	_baseOrderBy = baseOrderBy;
    	return _baseOrderBy;
    }

    var sortBy_1;
    var hasRequiredSortBy;

    function requireSortBy () {
    	if (hasRequiredSortBy) return sortBy_1;
    	hasRequiredSortBy = 1;
    	var baseFlatten = require_baseFlatten(),
    	    baseOrderBy = require_baseOrderBy(),
    	    baseRest = require_baseRest(),
    	    isIterateeCall = require_isIterateeCall();

    	/**
    	 * Creates an array of elements, sorted in ascending order by the results of
    	 * running each element in a collection thru each iteratee. This method
    	 * performs a stable sort, that is, it preserves the original sort order of
    	 * equal elements. The iteratees are invoked with one argument: (value).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Collection
    	 * @param {Array|Object} collection The collection to iterate over.
    	 * @param {...(Function|Function[])} [iteratees=[_.identity]]
    	 *  The iteratees to sort by.
    	 * @returns {Array} Returns the new sorted array.
    	 * @example
    	 *
    	 * var users = [
    	 *   { 'user': 'fred',   'age': 48 },
    	 *   { 'user': 'barney', 'age': 36 },
    	 *   { 'user': 'fred',   'age': 30 },
    	 *   { 'user': 'barney', 'age': 34 }
    	 * ];
    	 *
    	 * _.sortBy(users, [function(o) { return o.user; }]);
    	 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
    	 *
    	 * _.sortBy(users, ['user', 'age']);
    	 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
    	 */
    	var sortBy = baseRest(function(collection, iteratees) {
    	  if (collection == null) {
    	    return [];
    	  }
    	  var length = iteratees.length;
    	  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    	    iteratees = [];
    	  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    	    iteratees = [iteratees[0]];
    	  }
    	  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    	});

    	sortBy_1 = sortBy;
    	return sortBy_1;
    }

    var uniqueId_1;
    var hasRequiredUniqueId;

    function requireUniqueId () {
    	if (hasRequiredUniqueId) return uniqueId_1;
    	hasRequiredUniqueId = 1;
    	var toString = requireToString();

    	/** Used to generate unique IDs. */
    	var idCounter = 0;

    	/**
    	 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Util
    	 * @param {string} [prefix=''] The value to prefix the ID with.
    	 * @returns {string} Returns the unique ID.
    	 * @example
    	 *
    	 * _.uniqueId('contact_');
    	 * // => 'contact_104'
    	 *
    	 * _.uniqueId();
    	 * // => '105'
    	 */
    	function uniqueId(prefix) {
    	  var id = ++idCounter;
    	  return toString(prefix) + id;
    	}

    	uniqueId_1 = uniqueId;
    	return uniqueId_1;
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */

    var _baseZipObject;
    var hasRequired_baseZipObject;

    function require_baseZipObject () {
    	if (hasRequired_baseZipObject) return _baseZipObject;
    	hasRequired_baseZipObject = 1;
    	function baseZipObject(props, values, assignFunc) {
    	  var index = -1,
    	      length = props.length,
    	      valsLength = values.length,
    	      result = {};

    	  while (++index < length) {
    	    var value = index < valsLength ? values[index] : undefined;
    	    assignFunc(result, props[index], value);
    	  }
    	  return result;
    	}

    	_baseZipObject = baseZipObject;
    	return _baseZipObject;
    }

    var zipObject_1;
    var hasRequiredZipObject;

    function requireZipObject () {
    	if (hasRequiredZipObject) return zipObject_1;
    	hasRequiredZipObject = 1;
    	var assignValue = require_assignValue(),
    	    baseZipObject = require_baseZipObject();

    	/**
    	 * This method is like `_.fromPairs` except that it accepts two arrays,
    	 * one of property identifiers and one of corresponding values.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.4.0
    	 * @category Array
    	 * @param {Array} [props=[]] The property identifiers.
    	 * @param {Array} [values=[]] The property values.
    	 * @returns {Object} Returns the new object.
    	 * @example
    	 *
    	 * _.zipObject(['a', 'b'], [1, 2]);
    	 * // => { 'a': 1, 'b': 2 }
    	 */
    	function zipObject(props, values) {
    	  return baseZipObject(props || [], values || [], assignValue);
    	}

    	zipObject_1 = zipObject;
    	return zipObject_1;
    }

    /* global window */

    var lodash;

    if (typeof commonjsRequire === "function") {
      try {
        lodash = {
          cloneDeep: requireCloneDeep(),
          constant: requireConstant(),
          defaults: requireDefaults(),
          each: requireEach(),
          filter: requireFilter(),
          find: requireFind(),
          flatten: requireFlatten(),
          forEach: requireForEach(),
          forIn: requireForIn(),
          has:  requireHas(),
          isUndefined: requireIsUndefined(),
          last: requireLast(),
          map: requireMap(),
          mapValues: requireMapValues(),
          max: requireMax(),
          merge: requireMerge(),
          min: requireMin(),
          minBy: requireMinBy(),
          now: requireNow(),
          pick: requirePick(),
          range: requireRange(),
          reduce: requireReduce(),
          sortBy: requireSortBy(),
          uniqueId: requireUniqueId(),
          values: requireValues(),
          zipObject: requireZipObject(),
        };
      } catch (e) {
        // continue regardless of error
      }
    }

    if (!lodash) {
      lodash = window._;
    }

    var lodash_1 = lodash;

    /*
     * Simple doubly linked list implementation derived from Cormen, et al.,
     * "Introduction to Algorithms".
     */

    var list = List$1;

    function List$1() {
      var sentinel = {};
      sentinel._next = sentinel._prev = sentinel;
      this._sentinel = sentinel;
    }

    List$1.prototype.dequeue = function() {
      var sentinel = this._sentinel;
      var entry = sentinel._prev;
      if (entry !== sentinel) {
        unlink(entry);
        return entry;
      }
    };

    List$1.prototype.enqueue = function(entry) {
      var sentinel = this._sentinel;
      if (entry._prev && entry._next) {
        unlink(entry);
      }
      entry._next = sentinel._next;
      sentinel._next._prev = entry;
      sentinel._next = entry;
      entry._prev = sentinel;
    };

    List$1.prototype.toString = function() {
      var strs = [];
      var sentinel = this._sentinel;
      var curr = sentinel._prev;
      while (curr !== sentinel) {
        strs.push(JSON.stringify(curr, filterOutLinks));
        curr = curr._prev;
      }
      return "[" + strs.join(", ") + "]";
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

    var _$n = lodash_1;
    var Graph$7 = graphlib_1.Graph;
    var List = list;

    /*
     * A greedy heuristic for finding a feedback arc set for a graph. A feedback
     * arc set is a set of edges that can be removed to make a graph acyclic.
     * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
     * effective heuristic for the feedback arc set problem." This implementation
     * adjusts that from the paper to allow for weighted edges.
     */
    var greedyFas = greedyFAS$1;

    var DEFAULT_WEIGHT_FN = _$n.constant(1);

    function greedyFAS$1(g, weightFn) {
      if (g.nodeCount() <= 1) {
        return [];
      }
      var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
      var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

      // Expand multi-edges
      return _$n.flatten(_$n.map(results, function(e) {
        return g.outEdges(e.v, e.w);
      }), true);
    }

    function doGreedyFAS(g, buckets, zeroIdx) {
      var results = [];
      var sources = buckets[buckets.length - 1];
      var sinks = buckets[0];

      var entry;
      while (g.nodeCount()) {
        while ((entry = sinks.dequeue()))   { removeNode(g, buckets, zeroIdx, entry); }
        while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
        if (g.nodeCount()) {
          for (var i = buckets.length - 2; i > 0; --i) {
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
      var results = collectPredecessors ? [] : undefined;

      _$n.forEach(g.inEdges(entry.v), function(edge) {
        var weight = g.edge(edge);
        var uEntry = g.node(edge.v);

        if (collectPredecessors) {
          results.push({ v: edge.v, w: edge.w });
        }

        uEntry.out -= weight;
        assignBucket(buckets, zeroIdx, uEntry);
      });

      _$n.forEach(g.outEdges(entry.v), function(edge) {
        var weight = g.edge(edge);
        var w = edge.w;
        var wEntry = g.node(w);
        wEntry["in"] -= weight;
        assignBucket(buckets, zeroIdx, wEntry);
      });

      g.removeNode(entry.v);

      return results;
    }

    function buildState(g, weightFn) {
      var fasGraph = new Graph$7();
      var maxIn = 0;
      var maxOut = 0;

      _$n.forEach(g.nodes(), function(v) {
        fasGraph.setNode(v, { v: v, "in": 0, out: 0 });
      });

      // Aggregate weights on nodes, but also sum the weights across multi-edges
      // into a single edge for the fasGraph.
      _$n.forEach(g.edges(), function(e) {
        var prevWeight = fasGraph.edge(e.v, e.w) || 0;
        var weight = weightFn(e);
        var edgeWeight = prevWeight + weight;
        fasGraph.setEdge(e.v, e.w, edgeWeight);
        maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
        maxIn  = Math.max(maxIn,  fasGraph.node(e.w)["in"]  += weight);
      });

      var buckets = _$n.range(maxOut + maxIn + 3).map(function() { return new List(); });
      var zeroIdx = maxIn + 1;

      _$n.forEach(fasGraph.nodes(), function(v) {
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

    var _$m = lodash_1;
    var greedyFAS = greedyFas;

    var acyclic$1 = {
      run: run$2,
      undo: undo$2
    };

    function run$2(g) {
      var fas = (g.graph().acyclicer === "greedy"
        ? greedyFAS(g, weightFn(g))
        : dfsFAS(g));
      _$m.forEach(fas, function(e) {
        var label = g.edge(e);
        g.removeEdge(e);
        label.forwardName = e.name;
        label.reversed = true;
        g.setEdge(e.w, e.v, label, _$m.uniqueId("rev"));
      });

      function weightFn(g) {
        return function(e) {
          return g.edge(e).weight;
        };
      }
    }

    function dfsFAS(g) {
      var fas = [];
      var stack = {};
      var visited = {};

      function dfs(v) {
        if (_$m.has(visited, v)) {
          return;
        }
        visited[v] = true;
        stack[v] = true;
        _$m.forEach(g.outEdges(v), function(e) {
          if (_$m.has(stack, e.w)) {
            fas.push(e);
          } else {
            dfs(e.w);
          }
        });
        delete stack[v];
      }

      _$m.forEach(g.nodes(), dfs);
      return fas;
    }

    function undo$2(g) {
      _$m.forEach(g.edges(), function(e) {
        var label = g.edge(e);
        if (label.reversed) {
          g.removeEdge(e);

          var forwardName = label.forwardName;
          delete label.reversed;
          delete label.forwardName;
          g.setEdge(e.w, e.v, label, forwardName);
        }
      });
    }

    /* eslint "no-console": off */

    var _$l = lodash_1;
    var Graph$6 = graphlib_1.Graph;

    var util$a = {
      addDummyNode: addDummyNode,
      simplify: simplify$1,
      asNonCompoundGraph: asNonCompoundGraph,
      successorWeights: successorWeights,
      predecessorWeights: predecessorWeights,
      intersectRect: intersectRect,
      buildLayerMatrix: buildLayerMatrix,
      normalizeRanks: normalizeRanks$1,
      removeEmptyRanks: removeEmptyRanks$1,
      addBorderNode: addBorderNode$1,
      maxRank: maxRank,
      partition: partition,
      time: time,
      notime: notime
    };

    /*
     * Adds a dummy node to the graph and return v.
     */
    function addDummyNode(g, type, attrs, name) {
      var v;
      do {
        v = _$l.uniqueId(name);
      } while (g.hasNode(v));

      attrs.dummy = type;
      g.setNode(v, attrs);
      return v;
    }

    /*
     * Returns a new graph with only simple edges. Handles aggregation of data
     * associated with multi-edges.
     */
    function simplify$1(g) {
      var simplified = new Graph$6().setGraph(g.graph());
      _$l.forEach(g.nodes(), function(v) { simplified.setNode(v, g.node(v)); });
      _$l.forEach(g.edges(), function(e) {
        var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
        var label = g.edge(e);
        simplified.setEdge(e.v, e.w, {
          weight: simpleLabel.weight + label.weight,
          minlen: Math.max(simpleLabel.minlen, label.minlen)
        });
      });
      return simplified;
    }

    function asNonCompoundGraph(g) {
      var simplified = new Graph$6({ multigraph: g.isMultigraph() }).setGraph(g.graph());
      _$l.forEach(g.nodes(), function(v) {
        if (!g.children(v).length) {
          simplified.setNode(v, g.node(v));
        }
      });
      _$l.forEach(g.edges(), function(e) {
        simplified.setEdge(e, g.edge(e));
      });
      return simplified;
    }

    function successorWeights(g) {
      var weightMap = _$l.map(g.nodes(), function(v) {
        var sucs = {};
        _$l.forEach(g.outEdges(v), function(e) {
          sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
        });
        return sucs;
      });
      return _$l.zipObject(g.nodes(), weightMap);
    }

    function predecessorWeights(g) {
      var weightMap = _$l.map(g.nodes(), function(v) {
        var preds = {};
        _$l.forEach(g.inEdges(v), function(e) {
          preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
        });
        return preds;
      });
      return _$l.zipObject(g.nodes(), weightMap);
    }

    /*
     * Finds where a line starting at point ({x, y}) would intersect a rectangle
     * ({x, y, width, height}) if it were pointing at the rectangle's center.
     */
    function intersectRect(rect, point) {
      var x = rect.x;
      var y = rect.y;

      // Rectangle intersection algorithm from:
      // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
      var dx = point.x - x;
      var dy = point.y - y;
      var w = rect.width / 2;
      var h = rect.height / 2;

      if (!dx && !dy) {
        throw new Error("Not possible to find intersection inside of the rectangle");
      }

      var sx, sy;
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
      var layering = _$l.map(_$l.range(maxRank(g) + 1), function() { return []; });
      _$l.forEach(g.nodes(), function(v) {
        var node = g.node(v);
        var rank = node.rank;
        if (!_$l.isUndefined(rank)) {
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
      var min = _$l.min(_$l.map(g.nodes(), function(v) { return g.node(v).rank; }));
      _$l.forEach(g.nodes(), function(v) {
        var node = g.node(v);
        if (_$l.has(node, "rank")) {
          node.rank -= min;
        }
      });
    }

    function removeEmptyRanks$1(g) {
      // Ranks may not start at 0, so we need to offset them
      var offset = _$l.min(_$l.map(g.nodes(), function(v) { return g.node(v).rank; }));

      var layers = [];
      _$l.forEach(g.nodes(), function(v) {
        var rank = g.node(v).rank - offset;
        if (!layers[rank]) {
          layers[rank] = [];
        }
        layers[rank].push(v);
      });

      var delta = 0;
      var nodeRankFactor = g.graph().nodeRankFactor;
      _$l.forEach(layers, function(vs, i) {
        if (_$l.isUndefined(vs) && i % nodeRankFactor !== 0) {
          --delta;
        } else if (delta) {
          _$l.forEach(vs, function(v) { g.node(v).rank += delta; });
        }
      });
    }

    function addBorderNode$1(g, prefix, rank, order) {
      var node = {
        width: 0,
        height: 0
      };
      if (arguments.length >= 4) {
        node.rank = rank;
        node.order = order;
      }
      return addDummyNode(g, "border", node, prefix);
    }

    function maxRank(g) {
      return _$l.max(_$l.map(g.nodes(), function(v) {
        var rank = g.node(v).rank;
        if (!_$l.isUndefined(rank)) {
          return rank;
        }
      }));
    }

    /*
     * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
     * function returns true for an entry it goes into `lhs`. Otherwise it goes
     * into `rhs.
     */
    function partition(collection, fn) {
      var result = { lhs: [], rhs: [] };
      _$l.forEach(collection, function(value) {
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
      var start = _$l.now();
      try {
        return fn();
      } finally {
        console.log(name + " time: " + (_$l.now() - start) + "ms");
      }
    }

    function notime(name, fn) {
      return fn();
    }

    var _$k = lodash_1;
    var util$9 = util$a;

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
      _$k.forEach(g.edges(), function(edge) { normalizeEdge(g, edge); });
    }

    function normalizeEdge(g, e) {
      var v = e.v;
      var vRank = g.node(v).rank;
      var w = e.w;
      var wRank = g.node(w).rank;
      var name = e.name;
      var edgeLabel = g.edge(e);
      var labelRank = edgeLabel.labelRank;

      if (wRank === vRank + 1) return;

      g.removeEdge(e);

      var dummy, attrs, i;
      for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
        edgeLabel.points = [];
        attrs = {
          width: 0, height: 0,
          edgeLabel: edgeLabel, edgeObj: e,
          rank: vRank
        };
        dummy = util$9.addDummyNode(g, "edge", attrs, "_d");
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
      _$k.forEach(g.graph().dummyChains, function(v) {
        var node = g.node(v);
        var origLabel = node.edgeLabel;
        var w;
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

    var _$j = lodash_1;

    var util$8 = {
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
        if (_$j.has(visited, v)) {
          return label.rank;
        }
        visited[v] = true;

        var rank = _$j.min(_$j.map(g.outEdges(v), function(e) {
          return dfs(e.w) - g.edge(e).minlen;
        }));

        if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
            rank === undefined || // return value of _.map([]) for Lodash 4
            rank === null) { // return value of _.map([null])
          rank = 0;
        }

        return (label.rank = rank);
      }

      _$j.forEach(g.sources(), dfs);
    }

    /*
     * Returns the amount of slack for the given edge. The slack is defined as the
     * difference between the length of the edge and its minimum length.
     */
    function slack$2(g, e) {
      return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
    }

    var _$i = lodash_1;
    var Graph$5 = graphlib_1.Graph;
    var slack$1 = util$8.slack;

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
        _$i.forEach(g.nodeEdges(v), function(e) {
          var edgeV = e.v,
            w = (v === edgeV) ? e.w : edgeV;
          if (!t.hasNode(w) && !slack$1(g, e)) {
            t.setNode(w, {});
            t.setEdge(v, w, {});
            dfs(w);
          }
        });
      }

      _$i.forEach(t.nodes(), dfs);
      return t.nodeCount();
    }

    /*
     * Finds the edge with the smallest slack that is incident on tree and returns
     * it.
     */
    function findMinSlackEdge(t, g) {
      return _$i.minBy(g.edges(), function(e) {
        if (t.hasNode(e.v) !== t.hasNode(e.w)) {
          return slack$1(g, e);
        }
      });
    }

    function shiftRanks(t, g, delta) {
      _$i.forEach(t.nodes(), function(v) {
        g.node(v).rank += delta;
      });
    }

    var _$h = lodash_1;
    var feasibleTree$1 = feasibleTree_1;
    var slack = util$8.slack;
    var initRank = util$8.longestPath;
    var preorder = graphlib_1.alg.preorder;
    var postorder$1 = graphlib_1.alg.postorder;
    var simplify = util$a.simplify;

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
      _$h.forEach(vs, function(v) {
        assignCutValue(t, g, v);
      });
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

      _$h.forEach(g.nodeEdges(child), function(e) {
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
      _$h.forEach(tree.neighbors(v), function(w) {
        if (!_$h.has(visited, w)) {
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
      return _$h.find(tree.edges(), function(e) {
        return tree.edge(e).cutvalue < 0;
      });
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

      var candidates = _$h.filter(g.edges(), function(edge) {
        return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
               flip !== isDescendant(t, t.node(edge.w), tailLabel);
      });

      return _$h.minBy(candidates, function(edge) { return slack(g, edge); });
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
      var root = _$h.find(t.nodes(), function(v) { return !g.node(v).parent; });
      var vs = preorder(t, root);
      vs = vs.slice(1);
      _$h.forEach(vs, function(v) {
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

    var rankUtil = util$8;
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
      switch(g.graph().ranker) {
      case "network-simplex": networkSimplexRanker(g); break;
      case "tight-tree": tightTreeRanker(g); break;
      case "longest-path": longestPathRanker(g); break;
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

    var _$g = lodash_1;

    var parentDummyChains_1 = parentDummyChains$1;

    function parentDummyChains$1(g) {
      var postorderNums = postorder(g);

      _$g.forEach(g.graph().dummyChains, function(v) {
        var node = g.node(v);
        var edgeObj = node.edgeObj;
        var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
        var path = pathData.path;
        var lca = pathData.lca;
        var pathIdx = 0;
        var pathV = path[pathIdx];
        var ascending = true;

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
      var vPath = [];
      var wPath = [];
      var low = Math.min(postorderNums[v].low, postorderNums[w].low);
      var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
      var parent;
      var lca;

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
      var result = {};
      var lim = 0;

      function dfs(v) {
        var low = lim;
        _$g.forEach(g.children(v), dfs);
        result[v] = { low: low, lim: lim++ };
      }
      _$g.forEach(g.children(), dfs);

      return result;
    }

    var _$f = lodash_1;
    var util$7 = util$a;

    var nestingGraph$1 = {
      run: run,
      cleanup: cleanup
    };

    /*
     * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
     * adds appropriate edges to ensure that all cluster nodes are placed between
     * these boundries, and ensures that the graph is connected.
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
      var root = util$7.addDummyNode(g, "root", {}, "_root");
      var depths = treeDepths(g);
      var height = _$f.max(_$f.values(depths)) - 1; // Note: depths is an Object not an array
      var nodeSep = 2 * height + 1;

      g.graph().nestingRoot = root;

      // Multiply minlen by nodeSep to align nodes on non-border ranks.
      _$f.forEach(g.edges(), function(e) { g.edge(e).minlen *= nodeSep; });

      // Calculate a weight that is sufficient to keep subgraphs vertically compact
      var weight = sumWeights(g) + 1;

      // Create border nodes and link them up
      _$f.forEach(g.children(), function(child) {
        dfs(g, root, nodeSep, weight, height, depths, child);
      });

      // Save the multiplier for node layers for later removal of empty border
      // layers.
      g.graph().nodeRankFactor = nodeSep;
    }

    function dfs(g, root, nodeSep, weight, height, depths, v) {
      var children = g.children(v);
      if (!children.length) {
        if (v !== root) {
          g.setEdge(root, v, { weight: 0, minlen: nodeSep });
        }
        return;
      }

      var top = util$7.addBorderNode(g, "_bt");
      var bottom = util$7.addBorderNode(g, "_bb");
      var label = g.node(v);

      g.setParent(top, v);
      label.borderTop = top;
      g.setParent(bottom, v);
      label.borderBottom = bottom;

      _$f.forEach(children, function(child) {
        dfs(g, root, nodeSep, weight, height, depths, child);

        var childNode = g.node(child);
        var childTop = childNode.borderTop ? childNode.borderTop : child;
        var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
        var thisWeight = childNode.borderTop ? weight : 2 * weight;
        var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

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
          _$f.forEach(children, function(child) {
            dfs(child, depth + 1);
          });
        }
        depths[v] = depth;
      }
      _$f.forEach(g.children(), function(v) { dfs(v, 1); });
      return depths;
    }

    function sumWeights(g) {
      return _$f.reduce(g.edges(), function(acc, e) {
        return acc + g.edge(e).weight;
      }, 0);
    }

    function cleanup(g) {
      var graphLabel = g.graph();
      g.removeNode(graphLabel.nestingRoot);
      delete graphLabel.nestingRoot;
      _$f.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        if (edge.nestingEdge) {
          g.removeEdge(e);
        }
      });
    }

    var _$e = lodash_1;
    var util$6 = util$a;

    var addBorderSegments_1 = addBorderSegments$1;

    function addBorderSegments$1(g) {
      function dfs(v) {
        var children = g.children(v);
        var node = g.node(v);
        if (children.length) {
          _$e.forEach(children, dfs);
        }

        if (_$e.has(node, "minRank")) {
          node.borderLeft = [];
          node.borderRight = [];
          for (var rank = node.minRank, maxRank = node.maxRank + 1;
            rank < maxRank;
            ++rank) {
            addBorderNode(g, "borderLeft", "_bl", v, node, rank);
            addBorderNode(g, "borderRight", "_br", v, node, rank);
          }
        }
      }

      _$e.forEach(g.children(), dfs);
    }

    function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
      var label = { width: 0, height: 0, rank: rank, borderType: prop };
      var prev = sgNode[prop][rank - 1];
      var curr = util$6.addDummyNode(g, "border", label, prefix);
      sgNode[prop][rank] = curr;
      g.setParent(curr, sg);
      if (prev) {
        g.setEdge(prev, curr, { weight: 1 });
      }
    }

    var _$d = lodash_1;

    var coordinateSystem$1 = {
      adjust: adjust,
      undo: undo
    };

    function adjust(g) {
      var rankDir = g.graph().rankdir.toLowerCase();
      if (rankDir === "lr" || rankDir === "rl") {
        swapWidthHeight(g);
      }
    }

    function undo(g) {
      var rankDir = g.graph().rankdir.toLowerCase();
      if (rankDir === "bt" || rankDir === "rl") {
        reverseY(g);
      }

      if (rankDir === "lr" || rankDir === "rl") {
        swapXY(g);
        swapWidthHeight(g);
      }
    }

    function swapWidthHeight(g) {
      _$d.forEach(g.nodes(), function(v) { swapWidthHeightOne(g.node(v)); });
      _$d.forEach(g.edges(), function(e) { swapWidthHeightOne(g.edge(e)); });
    }

    function swapWidthHeightOne(attrs) {
      var w = attrs.width;
      attrs.width = attrs.height;
      attrs.height = w;
    }

    function reverseY(g) {
      _$d.forEach(g.nodes(), function(v) { reverseYOne(g.node(v)); });

      _$d.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        _$d.forEach(edge.points, reverseYOne);
        if (_$d.has(edge, "y")) {
          reverseYOne(edge);
        }
      });
    }

    function reverseYOne(attrs) {
      attrs.y = -attrs.y;
    }

    function swapXY(g) {
      _$d.forEach(g.nodes(), function(v) { swapXYOne(g.node(v)); });

      _$d.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        _$d.forEach(edge.points, swapXYOne);
        if (_$d.has(edge, "x")) {
          swapXYOne(edge);
        }
      });
    }

    function swapXYOne(attrs) {
      var x = attrs.x;
      attrs.x = attrs.y;
      attrs.y = x;
    }

    var _$c = lodash_1;

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
      var visited = {};
      var simpleNodes = _$c.filter(g.nodes(), function(v) {
        return !g.children(v).length;
      });
      var maxRank = _$c.max(_$c.map(simpleNodes, function(v) { return g.node(v).rank; }));
      var layers = _$c.map(_$c.range(maxRank + 1), function() { return []; });

      function dfs(v) {
        if (_$c.has(visited, v)) return;
        visited[v] = true;
        var node = g.node(v);
        layers[node.rank].push(v);
        _$c.forEach(g.successors(v), dfs);
      }

      var orderedVs = _$c.sortBy(simpleNodes, function(v) { return g.node(v).rank; });
      _$c.forEach(orderedVs, dfs);

      return layers;
    }

    var _$b = lodash_1;

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
      var cc = 0;
      for (var i = 1; i < layering.length; ++i) {
        cc += twoLayerCrossCount(g, layering[i-1], layering[i]);
      }
      return cc;
    }

    function twoLayerCrossCount(g, northLayer, southLayer) {
      // Sort all of the edges between the north and south layers by their position
      // in the north layer and then the south. Map these edges to the position of
      // their head in the south layer.
      var southPos = _$b.zipObject(southLayer,
        _$b.map(southLayer, function (v, i) { return i; }));
      var southEntries = _$b.flatten(_$b.map(northLayer, function(v) {
        return _$b.sortBy(_$b.map(g.outEdges(v), function(e) {
          return { pos: southPos[e.w], weight: g.edge(e).weight };
        }), "pos");
      }), true);

      // Build the accumulator tree
      var firstIndex = 1;
      while (firstIndex < southLayer.length) firstIndex <<= 1;
      var treeSize = 2 * firstIndex - 1;
      firstIndex -= 1;
      var tree = _$b.map(new Array(treeSize), function() { return 0; });

      // Calculate the weighted crossings
      var cc = 0;
      _$b.forEach(southEntries.forEach(function(entry) {
        var index = entry.pos + firstIndex;
        tree[index] += entry.weight;
        var weightSum = 0;
        while (index > 0) {
          if (index % 2) {
            weightSum += tree[index + 1];
          }
          index = (index - 1) >> 1;
          tree[index] += entry.weight;
        }
        cc += entry.weight * weightSum;
      }));

      return cc;
    }

    var _$a = lodash_1;

    var barycenter_1 = barycenter$1;

    function barycenter$1(g, movable) {
      return _$a.map(movable, function(v) {
        var inV = g.inEdges(v);
        if (!inV.length) {
          return { v: v };
        } else {
          var result = _$a.reduce(inV, function(acc, e) {
            var edge = g.edge(e),
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

    var _$9 = lodash_1;

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
      var mappedEntries = {};
      _$9.forEach(entries, function(entry, i) {
        var tmp = mappedEntries[entry.v] = {
          indegree: 0,
          "in": [],
          out: [],
          vs: [entry.v],
          i: i
        };
        if (!_$9.isUndefined(entry.barycenter)) {
          tmp.barycenter = entry.barycenter;
          tmp.weight = entry.weight;
        }
      });

      _$9.forEach(cg.edges(), function(e) {
        var entryV = mappedEntries[e.v];
        var entryW = mappedEntries[e.w];
        if (!_$9.isUndefined(entryV) && !_$9.isUndefined(entryW)) {
          entryW.indegree++;
          entryV.out.push(mappedEntries[e.w]);
        }
      });

      var sourceSet = _$9.filter(mappedEntries, function(entry) {
        return !entry.indegree;
      });

      return doResolveConflicts(sourceSet);
    }

    function doResolveConflicts(sourceSet) {
      var entries = [];

      function handleIn(vEntry) {
        return function(uEntry) {
          if (uEntry.merged) {
            return;
          }
          if (_$9.isUndefined(uEntry.barycenter) ||
              _$9.isUndefined(vEntry.barycenter) ||
              uEntry.barycenter >= vEntry.barycenter) {
            mergeEntries(vEntry, uEntry);
          }
        };
      }

      function handleOut(vEntry) {
        return function(wEntry) {
          wEntry["in"].push(vEntry);
          if (--wEntry.indegree === 0) {
            sourceSet.push(wEntry);
          }
        };
      }

      while (sourceSet.length) {
        var entry = sourceSet.pop();
        entries.push(entry);
        _$9.forEach(entry["in"].reverse(), handleIn(entry));
        _$9.forEach(entry.out, handleOut(entry));
      }

      return _$9.map(_$9.filter(entries, function(entry) { return !entry.merged; }),
        function(entry) {
          return _$9.pick(entry, ["vs", "i", "barycenter", "weight"]);
        });

    }

    function mergeEntries(target, source) {
      var sum = 0;
      var weight = 0;

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

    var _$8 = lodash_1;
    var util$5 = util$a;

    var sort_1 = sort$1;

    function sort$1(entries, biasRight) {
      var parts = util$5.partition(entries, function(entry) {
        return _$8.has(entry, "barycenter");
      });
      var sortable = parts.lhs,
        unsortable = _$8.sortBy(parts.rhs, function(entry) { return -entry.i; }),
        vs = [],
        sum = 0,
        weight = 0,
        vsIndex = 0;

      sortable.sort(compareWithBias(!!biasRight));

      vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

      _$8.forEach(sortable, function (entry) {
        vsIndex += entry.vs.length;
        vs.push(entry.vs);
        sum += entry.barycenter * entry.weight;
        weight += entry.weight;
        vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
      });

      var result = { vs: _$8.flatten(vs, true) };
      if (weight) {
        result.barycenter = sum / weight;
        result.weight = weight;
      }
      return result;
    }

    function consumeUnsortable(vs, unsortable, index) {
      var last;
      while (unsortable.length && (last = _$8.last(unsortable)).i <= index) {
        unsortable.pop();
        vs.push(last.vs);
        index++;
      }
      return index;
    }

    function compareWithBias(bias) {
      return function(entryV, entryW) {
        if (entryV.barycenter < entryW.barycenter) {
          return -1;
        } else if (entryV.barycenter > entryW.barycenter) {
          return 1;
        }

        return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
      };
    }

    var _$7 = lodash_1;
    var barycenter = barycenter_1;
    var resolveConflicts = resolveConflicts_1;
    var sort = sort_1;

    var sortSubgraph_1 = sortSubgraph$1;

    function sortSubgraph$1(g, v, cg, biasRight) {
      var movable = g.children(v);
      var node = g.node(v);
      var bl = node ? node.borderLeft : undefined;
      var br = node ? node.borderRight: undefined;
      var subgraphs = {};

      if (bl) {
        movable = _$7.filter(movable, function(w) {
          return w !== bl && w !== br;
        });
      }

      var barycenters = barycenter(g, movable);
      _$7.forEach(barycenters, function(entry) {
        if (g.children(entry.v).length) {
          var subgraphResult = sortSubgraph$1(g, entry.v, cg, biasRight);
          subgraphs[entry.v] = subgraphResult;
          if (_$7.has(subgraphResult, "barycenter")) {
            mergeBarycenters(entry, subgraphResult);
          }
        }
      });

      var entries = resolveConflicts(barycenters, cg);
      expandSubgraphs(entries, subgraphs);

      var result = sort(entries, biasRight);

      if (bl) {
        result.vs = _$7.flatten([bl, result.vs, br], true);
        if (g.predecessors(bl).length) {
          var blPred = g.node(g.predecessors(bl)[0]),
            brPred = g.node(g.predecessors(br)[0]);
          if (!_$7.has(result, "barycenter")) {
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
      _$7.forEach(entries, function(entry) {
        entry.vs = _$7.flatten(entry.vs.map(function(v) {
          if (subgraphs[v]) {
            return subgraphs[v].vs;
          }
          return v;
        }), true);
      });
    }

    function mergeBarycenters(target, other) {
      if (!_$7.isUndefined(target.barycenter)) {
        target.barycenter = (target.barycenter * target.weight +
                             other.barycenter * other.weight) /
                            (target.weight + other.weight);
        target.weight += other.weight;
      } else {
        target.barycenter = other.barycenter;
        target.weight = other.weight;
      }
    }

    var _$6 = lodash_1;
    var Graph$4 = graphlib_1.Graph;

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
    function buildLayerGraph$1(g, rank, relationship) {
      var root = createRootNode(g),
        result = new Graph$4({ compound: true }).setGraph({ root: root })
          .setDefaultNodeLabel(function(v) { return g.node(v); });

      _$6.forEach(g.nodes(), function(v) {
        var node = g.node(v),
          parent = g.parent(v);

        if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
          result.setNode(v);
          result.setParent(v, parent || root);

          // This assumes we have only short edges!
          _$6.forEach(g[relationship](v), function(e) {
            var u = e.v === v ? e.w : e.v,
              edge = result.edge(u, v),
              weight = !_$6.isUndefined(edge) ? edge.weight : 0;
            result.setEdge(u, v, { weight: g.edge(e).weight + weight });
          });

          if (_$6.has(node, "minRank")) {
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
      while (g.hasNode((v = _$6.uniqueId("_root"))));
      return v;
    }

    var _$5 = lodash_1;

    var addSubgraphConstraints_1 = addSubgraphConstraints$1;

    function addSubgraphConstraints$1(g, cg, vs) {
      var prev = {},
        rootPrev;

      _$5.forEach(vs, function(v) {
        var child = g.parent(v),
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
          _.each(children, function(child) {
            var childMin = dfs(child);
            if (g.children(child).length) {
              subgraphs.push({ v: child, order: childMin });
            }
            min = Math.min(min, childMin);
          });
          _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
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

    var _$4 = lodash_1;
    var initOrder = initOrder_1;
    var crossCount = crossCount_1;
    var sortSubgraph = sortSubgraph_1;
    var buildLayerGraph = buildLayerGraph_1;
    var addSubgraphConstraints = addSubgraphConstraints_1;
    var Graph$3 = graphlib_1.Graph;
    var util$4 = util$a;

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
    function order$1(g) {
      var maxRank = util$4.maxRank(g),
        downLayerGraphs = buildLayerGraphs(g, _$4.range(1, maxRank + 1), "inEdges"),
        upLayerGraphs = buildLayerGraphs(g, _$4.range(maxRank - 1, -1, -1), "outEdges");

      var layering = initOrder(g);
      assignOrder(g, layering);

      var bestCC = Number.POSITIVE_INFINITY,
        best;

      for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
        sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

        layering = util$4.buildLayerMatrix(g);
        var cc = crossCount(g, layering);
        if (cc < bestCC) {
          lastBest = 0;
          best = _$4.cloneDeep(layering);
          bestCC = cc;
        }
      }

      assignOrder(g, best);
    }

    function buildLayerGraphs(g, ranks, relationship) {
      return _$4.map(ranks, function(rank) {
        return buildLayerGraph(g, rank, relationship);
      });
    }

    function sweepLayerGraphs(layerGraphs, biasRight) {
      var cg = new Graph$3();
      _$4.forEach(layerGraphs, function(lg) {
        var root = lg.graph().root;
        var sorted = sortSubgraph(lg, root, cg, biasRight);
        _$4.forEach(sorted.vs, function(v, i) {
          lg.node(v).order = i;
        });
        addSubgraphConstraints(lg, cg, sorted.vs);
      });
    }

    function assignOrder(g, layering) {
      _$4.forEach(layering, function(layer) {
        _$4.forEach(layer, function(v, i) {
          g.node(v).order = i;
        });
      });
    }

    var _$3 = lodash_1;
    var Graph$2 = graphlib_1.Graph;
    var util$3 = util$a;

    /*
     * This module provides coordinate assignment based on Brandes and Köpf, "Fast
     * and Simple Horizontal Coordinate Assignment."
     */

    var bk = {
      positionX: positionX$1,
      findType1Conflicts: findType1Conflicts,
      findType2Conflicts: findType2Conflicts,
      addConflict: addConflict,
      hasConflict: hasConflict,
      verticalAlignment: verticalAlignment,
      horizontalCompaction: horizontalCompaction,
      alignCoordinates: alignCoordinates,
      findSmallestWidthAlignment: findSmallestWidthAlignment,
      balance: balance
    };

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
      var conflicts = {};

      function visitLayer(prevLayer, layer) {
        var
          // last visited node in the previous layer that is incident on an inner
          // segment.
          k0 = 0,
          // Tracks the last node in this layer scanned for crossings with a type-1
          // segment.
          scanPos = 0,
          prevLayerLength = prevLayer.length,
          lastNode = _$3.last(layer);

        _$3.forEach(layer, function(v, i) {
          var w = findOtherInnerSegmentNode(g, v),
            k1 = w ? g.node(w).order : prevLayerLength;

          if (w || v === lastNode) {
            _$3.forEach(layer.slice(scanPos, i +1), function(scanNode) {
              _$3.forEach(g.predecessors(scanNode), function(u) {
                var uLabel = g.node(u),
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

      _$3.reduce(layering, visitLayer);
      return conflicts;
    }

    function findType2Conflicts(g, layering) {
      var conflicts = {};

      function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
        var v;
        _$3.forEach(_$3.range(southPos, southEnd), function(i) {
          v = south[i];
          if (g.node(v).dummy) {
            _$3.forEach(g.predecessors(v), function(u) {
              var uNode = g.node(u);
              if (uNode.dummy &&
                  (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
                addConflict(conflicts, u, v);
              }
            });
          }
        });
      }


      function visitLayer(north, south) {
        var prevNorthPos = -1,
          nextNorthPos,
          southPos = 0;

        _$3.forEach(south, function(v, southLookahead) {
          if (g.node(v).dummy === "border") {
            var predecessors = g.predecessors(v);
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

      _$3.reduce(layering, visitLayer);
      return conflicts;
    }

    function findOtherInnerSegmentNode(g, v) {
      if (g.node(v).dummy) {
        return _$3.find(g.predecessors(v), function(u) {
          return g.node(u).dummy;
        });
      }
    }

    function addConflict(conflicts, v, w) {
      if (v > w) {
        var tmp = v;
        v = w;
        w = tmp;
      }

      var conflictsV = conflicts[v];
      if (!conflictsV) {
        conflicts[v] = conflictsV = {};
      }
      conflictsV[w] = true;
    }

    function hasConflict(conflicts, v, w) {
      if (v > w) {
        var tmp = v;
        v = w;
        w = tmp;
      }
      return _$3.has(conflicts[v], w);
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
      var root = {},
        align = {},
        pos = {};

      // We cache the position here based on the layering because the graph and
      // layering may be out of sync. The layering matrix is manipulated to
      // generate different extreme alignments.
      _$3.forEach(layering, function(layer) {
        _$3.forEach(layer, function(v, order) {
          root[v] = v;
          align[v] = v;
          pos[v] = order;
        });
      });

      _$3.forEach(layering, function(layer) {
        var prevIdx = -1;
        _$3.forEach(layer, function(v) {
          var ws = neighborFn(v);
          if (ws.length) {
            ws = _$3.sortBy(ws, function(w) { return pos[w]; });
            var mp = (ws.length - 1) / 2;
            for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
              var w = ws[i];
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
      var xs = {},
        blockG = buildBlockGraph(g, layering, root, reverseSep),
        borderType = reverseSep ? "borderLeft" : "borderRight";

      function iterate(setXsFunc, nextNodesFunc) {
        var stack = blockG.nodes();
        var elem = stack.pop();
        var visited = {};
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
        xs[elem] = blockG.inEdges(elem).reduce(function(acc, e) {
          return Math.max(acc, xs[e.v] + blockG.edge(e));
        }, 0);
      }

      // Second pass, assign greatest coordinates
      function pass2(elem) {
        var min = blockG.outEdges(elem).reduce(function(acc, e) {
          return Math.min(acc, xs[e.w] - blockG.edge(e));
        }, Number.POSITIVE_INFINITY);

        var node = g.node(elem);
        if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
          xs[elem] = Math.max(xs[elem], min);
        }
      }

      iterate(pass1, blockG.predecessors.bind(blockG));
      iterate(pass2, blockG.successors.bind(blockG));

      // Assign x coordinates to all nodes
      _$3.forEach(align, function(v) {
        xs[v] = xs[root[v]];
      });

      return xs;
    }


    function buildBlockGraph(g, layering, root, reverseSep) {
      var blockGraph = new Graph$2(),
        graphLabel = g.graph(),
        sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

      _$3.forEach(layering, function(layer) {
        var u;
        _$3.forEach(layer, function(v) {
          var vRoot = root[v];
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
      return _$3.minBy(_$3.values(xss), function (xs) {
        var max = Number.NEGATIVE_INFINITY;
        var min = Number.POSITIVE_INFINITY;

        _$3.forIn(xs, function (x, v) {
          var halfWidth = width(g, v) / 2;

          max = Math.max(x + halfWidth, max);
          min = Math.min(x - halfWidth, min);
        });

        return max - min;
      });
    }

    /*
     * Align the coordinates of each of the layout alignments such that
     * left-biased alignments have their minimum coordinate at the same point as
     * the minimum coordinate of the smallest width alignment and right-biased
     * alignments have their maximum coordinate at the same point as the maximum
     * coordinate of the smallest width alignment.
     */
    function alignCoordinates(xss, alignTo) {
      var alignToVals = _$3.values(alignTo),
        alignToMin = _$3.min(alignToVals),
        alignToMax = _$3.max(alignToVals);

      _$3.forEach(["u", "d"], function(vert) {
        _$3.forEach(["l", "r"], function(horiz) {
          var alignment = vert + horiz,
            xs = xss[alignment],
            delta;
          if (xs === alignTo) return;

          var xsVals = _$3.values(xs);
          delta = horiz === "l" ? alignToMin - _$3.min(xsVals) : alignToMax - _$3.max(xsVals);

          if (delta) {
            xss[alignment] = _$3.mapValues(xs, function(x) { return x + delta; });
          }
        });
      });
    }

    function balance(xss, align) {
      return _$3.mapValues(xss.ul, function(ignore, v) {
        if (align) {
          return xss[align.toLowerCase()][v];
        } else {
          var xs = _$3.sortBy(_$3.map(xss, v));
          return (xs[1] + xs[2]) / 2;
        }
      });
    }

    function positionX$1(g) {
      var layering = util$3.buildLayerMatrix(g);
      var conflicts = _$3.merge(
        findType1Conflicts(g, layering),
        findType2Conflicts(g, layering));

      var xss = {};
      var adjustedLayering;
      _$3.forEach(["u", "d"], function(vert) {
        adjustedLayering = vert === "u" ? layering : _$3.values(layering).reverse();
        _$3.forEach(["l", "r"], function(horiz) {
          if (horiz === "r") {
            adjustedLayering = _$3.map(adjustedLayering, function(inner) {
              return _$3.values(inner).reverse();
            });
          }

          var neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
          var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
          var xs = horizontalCompaction(g, adjustedLayering,
            align.root, align.align, horiz === "r");
          if (horiz === "r") {
            xs = _$3.mapValues(xs, function(x) { return -x; });
          }
          xss[vert + horiz] = xs;
        });
      });

      var smallestWidth = findSmallestWidthAlignment(g, xss);
      alignCoordinates(xss, smallestWidth);
      return balance(xss, g.graph().align);
    }

    function sep(nodeSep, edgeSep, reverseSep) {
      return function(g, v, w) {
        var vLabel = g.node(v);
        var wLabel = g.node(w);
        var sum = 0;
        var delta;

        sum += vLabel.width / 2;
        if (_$3.has(vLabel, "labelpos")) {
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
        if (_$3.has(wLabel, "labelpos")) {
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

    var _$2 = lodash_1;
    var util$2 = util$a;
    var positionX = bk.positionX;

    var position_1 = position$1;

    function position$1(g) {
      g = util$2.asNonCompoundGraph(g);

      positionY(g);
      _$2.forEach(positionX(g), function(x, v) {
        g.node(v).x = x;
      });
    }

    function positionY(g) {
      var layering = util$2.buildLayerMatrix(g);
      var rankSep = g.graph().ranksep;
      var prevY = 0;
      _$2.forEach(layering, function(layer) {
        var maxHeight = _$2.max(_$2.map(layer, function(v) { return g.node(v).height; }));
        _$2.forEach(layer, function(v) {
          g.node(v).y = prevY + maxHeight / 2;
        });
        prevY += maxHeight + rankSep;
      });
    }

    var _$1 = lodash_1;
    var acyclic = acyclic$1;
    var normalize = normalize$1;
    var rank = rank_1;
    var normalizeRanks = util$a.normalizeRanks;
    var parentDummyChains = parentDummyChains_1;
    var removeEmptyRanks = util$a.removeEmptyRanks;
    var nestingGraph = nestingGraph$1;
    var addBorderSegments = addBorderSegments_1;
    var coordinateSystem = coordinateSystem$1;
    var order = order_1;
    var position = position_1;
    var util$1 = util$a;
    var Graph$1 = graphlib_1.Graph;

    var layout_1 = layout$1;

    function layout$1(g, opts) {
      var time = opts && opts.debugTiming ? util$1.time : util$1.notime;
      time("layout", function() {
        var layoutGraph = 
          time("  buildLayoutGraph", function() { return buildLayoutGraph(g); });
        time("  runLayout",        function() { runLayout(layoutGraph, time); });
        time("  updateInputGraph", function() { updateInputGraph(g, layoutGraph); });
      });
    }

    function runLayout(g, time) {
      time("    makeSpaceForEdgeLabels", function() { makeSpaceForEdgeLabels(g); });
      time("    removeSelfEdges",        function() { removeSelfEdges(g); });
      time("    acyclic",                function() { acyclic.run(g); });
      time("    nestingGraph.run",       function() { nestingGraph.run(g); });
      time("    rank",                   function() { rank(util$1.asNonCompoundGraph(g)); });
      time("    injectEdgeLabelProxies", function() { injectEdgeLabelProxies(g); });
      time("    removeEmptyRanks",       function() { removeEmptyRanks(g); });
      time("    nestingGraph.cleanup",   function() { nestingGraph.cleanup(g); });
      time("    normalizeRanks",         function() { normalizeRanks(g); });
      time("    assignRankMinMax",       function() { assignRankMinMax(g); });
      time("    removeEdgeLabelProxies", function() { removeEdgeLabelProxies(g); });
      time("    normalize.run",          function() { normalize.run(g); });
      time("    parentDummyChains",      function() { parentDummyChains(g); });
      time("    addBorderSegments",      function() { addBorderSegments(g); });
      time("    order",                  function() { order(g); });
      time("    insertSelfEdges",        function() { insertSelfEdges(g); });
      time("    adjustCoordinateSystem", function() { coordinateSystem.adjust(g); });
      time("    position",               function() { position(g); });
      time("    positionSelfEdges",      function() { positionSelfEdges(g); });
      time("    removeBorderNodes",      function() { removeBorderNodes(g); });
      time("    normalize.undo",         function() { normalize.undo(g); });
      time("    fixupEdgeLabelCoords",   function() { fixupEdgeLabelCoords(g); });
      time("    undoCoordinateSystem",   function() { coordinateSystem.undo(g); });
      time("    translateGraph",         function() { translateGraph(g); });
      time("    assignNodeIntersects",   function() { assignNodeIntersects(g); });
      time("    reversePoints",          function() { reversePointsForReversedEdges(g); });
      time("    acyclic.undo",           function() { acyclic.undo(g); });
    }

    /*
     * Copies final layout information from the layout graph back to the input
     * graph. This process only copies whitelisted attributes from the layout graph
     * to the input graph, so it serves as a good place to determine what
     * attributes can influence layout.
     */
    function updateInputGraph(inputGraph, layoutGraph) {
      _$1.forEach(inputGraph.nodes(), function(v) {
        var inputLabel = inputGraph.node(v);
        var layoutLabel = layoutGraph.node(v);

        if (inputLabel) {
          inputLabel.x = layoutLabel.x;
          inputLabel.y = layoutLabel.y;

          if (layoutGraph.children(v).length) {
            inputLabel.width = layoutLabel.width;
            inputLabel.height = layoutLabel.height;
          }
        }
      });

      _$1.forEach(inputGraph.edges(), function(e) {
        var inputLabel = inputGraph.edge(e);
        var layoutLabel = layoutGraph.edge(e);

        inputLabel.points = layoutLabel.points;
        if (_$1.has(layoutLabel, "x")) {
          inputLabel.x = layoutLabel.x;
          inputLabel.y = layoutLabel.y;
        }
      });

      inputGraph.graph().width = layoutGraph.graph().width;
      inputGraph.graph().height = layoutGraph.graph().height;
    }

    var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
    var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
    var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
    var nodeNumAttrs = ["width", "height"];
    var nodeDefaults = { width: 0, height: 0 };
    var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
    var edgeDefaults = {
      minlen: 1, weight: 1, width: 0, height: 0,
      labeloffset: 10, labelpos: "r"
    };
    var edgeAttrs = ["labelpos"];

    /*
     * Constructs a new graph from the input graph, which can be used for layout.
     * This process copies only whitelisted attributes from the input graph to the
     * layout graph. Thus this function serves as a good place to determine what
     * attributes can influence layout.
     */
    function buildLayoutGraph(inputGraph) {
      var g = new Graph$1({ multigraph: true, compound: true });
      var graph = canonicalize(inputGraph.graph());

      g.setGraph(_$1.merge({},
        graphDefaults,
        selectNumberAttrs(graph, graphNumAttrs),
        _$1.pick(graph, graphAttrs)));

      _$1.forEach(inputGraph.nodes(), function(v) {
        var node = canonicalize(inputGraph.node(v));
        g.setNode(v, _$1.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
        g.setParent(v, inputGraph.parent(v));
      });

      _$1.forEach(inputGraph.edges(), function(e) {
        var edge = canonicalize(inputGraph.edge(e));
        g.setEdge(e, _$1.merge({},
          edgeDefaults,
          selectNumberAttrs(edge, edgeNumAttrs),
          _$1.pick(edge, edgeAttrs)));
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
      var graph = g.graph();
      graph.ranksep /= 2;
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
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
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        if (edge.width && edge.height) {
          var v = g.node(e.v);
          var w = g.node(e.w);
          var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
          util$1.addDummyNode(g, "edge-proxy", label, "_ep");
        }
      });
    }

    function assignRankMinMax(g) {
      var maxRank = 0;
      _$1.forEach(g.nodes(), function(v) {
        var node = g.node(v);
        if (node.borderTop) {
          node.minRank = g.node(node.borderTop).rank;
          node.maxRank = g.node(node.borderBottom).rank;
          maxRank = _$1.max(maxRank, node.maxRank);
        }
      });
      g.graph().maxRank = maxRank;
    }

    function removeEdgeLabelProxies(g) {
      _$1.forEach(g.nodes(), function(v) {
        var node = g.node(v);
        if (node.dummy === "edge-proxy") {
          g.edge(node.e).labelRank = node.rank;
          g.removeNode(v);
        }
      });
    }

    function translateGraph(g) {
      var minX = Number.POSITIVE_INFINITY;
      var maxX = 0;
      var minY = Number.POSITIVE_INFINITY;
      var maxY = 0;
      var graphLabel = g.graph();
      var marginX = graphLabel.marginx || 0;
      var marginY = graphLabel.marginy || 0;

      function getExtremes(attrs) {
        var x = attrs.x;
        var y = attrs.y;
        var w = attrs.width;
        var h = attrs.height;
        minX = Math.min(minX, x - w / 2);
        maxX = Math.max(maxX, x + w / 2);
        minY = Math.min(minY, y - h / 2);
        maxY = Math.max(maxY, y + h / 2);
      }

      _$1.forEach(g.nodes(), function(v) { getExtremes(g.node(v)); });
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        if (_$1.has(edge, "x")) {
          getExtremes(edge);
        }
      });

      minX -= marginX;
      minY -= marginY;

      _$1.forEach(g.nodes(), function(v) {
        var node = g.node(v);
        node.x -= minX;
        node.y -= minY;
      });

      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        _$1.forEach(edge.points, function(p) {
          p.x -= minX;
          p.y -= minY;
        });
        if (_$1.has(edge, "x")) { edge.x -= minX; }
        if (_$1.has(edge, "y")) { edge.y -= minY; }
      });

      graphLabel.width = maxX - minX + marginX;
      graphLabel.height = maxY - minY + marginY;
    }

    function assignNodeIntersects(g) {
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        var nodeV = g.node(e.v);
        var nodeW = g.node(e.w);
        var p1, p2;
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
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        if (_$1.has(edge, "x")) {
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
      _$1.forEach(g.edges(), function(e) {
        var edge = g.edge(e);
        if (edge.reversed) {
          edge.points.reverse();
        }
      });
    }

    function removeBorderNodes(g) {
      _$1.forEach(g.nodes(), function(v) {
        if (g.children(v).length) {
          var node = g.node(v);
          var t = g.node(node.borderTop);
          var b = g.node(node.borderBottom);
          var l = g.node(_$1.last(node.borderLeft));
          var r = g.node(_$1.last(node.borderRight));

          node.width = Math.abs(r.x - l.x);
          node.height = Math.abs(b.y - t.y);
          node.x = l.x + node.width / 2;
          node.y = t.y + node.height / 2;
        }
      });

      _$1.forEach(g.nodes(), function(v) {
        if (g.node(v).dummy === "border") {
          g.removeNode(v);
        }
      });
    }

    function removeSelfEdges(g) {
      _$1.forEach(g.edges(), function(e) {
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
      _$1.forEach(layers, function(layer) {
        var orderShift = 0;
        _$1.forEach(layer, function(v, i) {
          var node = g.node(v);
          node.order = i + orderShift;
          _$1.forEach(node.selfEdges, function(selfEdge) {
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
      _$1.forEach(g.nodes(), function(v) {
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
      return _$1.mapValues(_$1.pick(obj, attrs), Number);
    }

    function canonicalize(attrs) {
      var newAttrs = {};
      _$1.forEach(attrs, function(v, k) {
        newAttrs[k.toLowerCase()] = v;
      });
      return newAttrs;
    }

    var _ = lodash_1;
    var util = util$a;
    var Graph = graphlib_1.Graph;

    var debug = {
      debugOrdering: debugOrdering
    };

    /* istanbul ignore next */
    function debugOrdering(g) {
      var layerMatrix = util.buildLayerMatrix(g);

      var h = new Graph({ compound: true, multigraph: true }).setGraph({});

      _.forEach(g.nodes(), function(v) {
        h.setNode(v, { label: v });
        h.setParent(v, "layer" + g.node(v).rank);
      });

      _.forEach(g.edges(), function(e) {
        h.setEdge(e.v, e.w, {}, e.name);
      });

      _.forEach(layerMatrix, function(layer, i) {
        var layerV = "layer" + i;
        h.setNode(layerV, { rank: "same" });
        _.reduce(layer, function(u, v) {
          h.setEdge(u, v, { style: "invis" });
          return v;
        });
      });

      return h;
    }

    var version = "0.8.5";

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
      graphlib: graphlib_1,

      layout: layout_1,
      debug: debug,
      util: {
        time: util$a.time,
        notime: util$a.notime
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
                g.setGraph({edgesep: layout._edgeSep});
                g.setDefaultEdgeLabel(function() { return {}; });
                g.graph().rankdir = this._getDagreDirection(layout.direction);

                //in case the node ids in the input graph file are integers
                let nodeIdHash = new Map();
                for (let n of nodeColl.children) {
                    let id = n.dataScope.getAttributeValue(MSCNodeID);
                    nodeIdHash.set(id, id + "");
                    g.setNode(id, { label: n.text ? n.text : "", width: n.bounds.width, height: n.bounds.height });
                }
                for (let l of netData.linkList) {
                    g.setEdge(l.source, l.target);
                }
                dagre.layout(g);

                const nid2pos = {};
                let t = Math.min(...g.nodes().map(d => g.node(d).y)), l = Math.min(...g.nodes().map(d => g.node(d).x));
                let dx = layout.left - l, dy = layout.top - t;
                for (const id of g.nodes()) {
                    nid2pos[id] = { x: g.node(id).x + dx, y: g.node(id).y + dy };
                }

                for (let nodeMk of nodeColl.children) {
                    let nid = nodeMk.dataScope.getAttributeValue(MSCNodeID),
                        dx = nid2pos[nodeIdHash.get(nid)].x - nodeMk.x,
                        dy = nid2pos[nodeIdHash.get(nid)].y - nodeMk.y;
                    translate(nodeMk, dx, dy);
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
            let mark = coll.children.filter(d => d.dataScope.getAttributeValue(MSCNodeID) == d3Tree.data[MSCNodeID])[0];
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

            translate(mark, x - mark.x, y - mark.y);
            
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
            let group = this._inputVars.filter(d => d.type === VarType.ORDER)[0].element, 
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
                translate(node.data, node.x0 + left - node.data.left, node.y0 + top - node.data.top);
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
                let tree = getTree(nodeColl.children[0]);
                if (!tree) continue;
                // console.log(layout, tree);

                let nodeId2mark = {};
                for (let elem of nodeColl.children) {
                    nodeId2mark[elem.dataScope.getAttributeValue(MSCNodeID)] = elem;
                }
                
                let rootMark = nodeColl.children[0];

                if (rootMark.type === ElementType.Rect) {
                    this._layoutRects(tree.getRoot(), tree, nodeId2mark);
                } else if (rootMark.type === ElementType.Circle) {
                    this._layoutArcs(tree.getRoot(), tree, nodeId2mark);
                }
            }

            propagateBoundsUpdate(node);
        }

        _layoutArcs(node, tree, node2mark) {
    		let childrenNodes = tree.getChildren(node);
    		if (childrenNodes.length === 0) return;
    		let parentMark = node2mark[node[MSCNodeID]];
    		let startAngle = parentMark.type == ElementType.Arc || parentMark.type == ElementType.Pie ? parentMark.startAngle : 90;
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
    			
                translate(mark, x - mark.left , y - mark.top);
                x += mark.width; 
                this._layoutRects(cn, tree, node2mark);
    		}
        }
    }

    class TriggerVar extends Variable {

        constructor(type, trigger) {
            super(type);
            this._trigger = trigger;
        }

        get trigger() {
            return this._trigger;
        }
    }

    class TargetEvaluator extends OneWayDependency {

        constructor(opType) {
            super(opType);
        }

        run() {
            super.run();
            let condEncVar = this.outputVar,
                condEnc = condEncVar.condEncoding,
                trigger = condEnc.trigger,
                target = condEnc.target,
                peers = getPeers(target); 
            
            let testResult = {};
            if (trigger.type === TriggerType.ELEMENT) {
                let triggerElems = trigger.elements.length > 0 ? trigger.elements : [undefined];
                peers.forEach( mark => testResult[mark.id] = triggerElems.map(d => condEnc._targetEval(d, mark)).some(d => d) );
            } if (trigger.type === TriggerType.MOUSE) {
                peers.forEach((mark) => testResult[mark.id] = condEnc._targetEval(trigger.mouseEvent, mark) );
            }
            condEnc.evalResult = testResult;
            //console.log(this._evalFn, condEnc);
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
                    translate(elem, layout.x + layout.radius - elem.bounds.x, layout.y - elem.bounds.y);
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
                        let id = elem.dataScope.getAttributeValue(MSCNodeID);
                        translate(elem, layout.x - elem.bounds.x, layout.y - map.get(id)[1] - elem.bounds.y);
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
                        let id = elem.dataScope.getAttributeValue(MSCNodeID);
                        translate(elem, map.get(id)[0] - x0 + layout.left - elem.bounds.x, map.get(id)[1] + layout.top - elem.bounds.y);
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
                        let id = elem.dataScope.getAttributeValue(MSCNodeID);
                        translate(elem, map.get(id)[1] + layout.left - elem.bounds.x, map.get(id)[0] - x0  + layout.top - elem.bounds.y);
                    }
                }
                
            }

            let lm = getLeafMarks(elem, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
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
                    } else if (variable.type === 'DomainVar') {
                        varData.scale = variable.scale;
                        varData.attrValues = variable.attrValues;
                    } else if (variable.type === 'FieldVar') {
                        varData.field = variable.field;
                        varData.dataset = variable.dataset;
                    } else if (variable.type === 'PropertyVar') {
                        varData.property = variable.property;
                        varData.element = variable.element;
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
            if (Object.values(VarType).indexOf(type) < 0)
                throw new Error('Variable Type Not Known');
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
                case VarType.ATTRIBUTE:
                    v = new AttributeVar(type, params[0], params[1]);
                    break;
                case VarType.ITEMS:
                    v = new ItemsVar(type, params[0], params[1]);
                    break;
                case VarType.DOMAIN:
                    v = new DomainVar(type, params[0]);
                    break;
                case VarType.DATASCOPE:
                    v = new DataScopeVar(type, params[0]);
                    break;
                case VarType.BOUNDS:
                    v = new BoundsVar(type, params[0]);
                    break;
                case VarType.ORDER:
                    v = new OrderVar(type, params[0]);
                    break;
                case VarType.SCALE:
                    v = new ScaleVar(type, params[0]);
                    break;
                case VarType.COND_ENCODING:
                    v = new CondEncodingVar(type, params[0]);
                    break;
                case VarType.AFFIXATION:
                    v = new AffixationVar(type, params[0]);
                    break;
                case VarType.ALIGNMENT:
                    v = new AlignmentVar(type, params[0]);
                    break;
                case VarType.TRIGGER:
                    v = new TriggerVar(type, params[0]);
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
                case OpType.DOMAIN_BUILDER:
                    op = new DomainBuilder(type, params[0]);
                    break;
                case OpType.SCALE_BUILDER:
                    op = new ScaleBuilder(type, params[0]);
                    break;
                case OpType.ENCODER:
                    op = new Encoder(type, params[0]);
                    break;
                case OpType.AXIS_PATH_PLACER:
                    op = new AxisPathPlacer(type);
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
                    op = new GridlinesPlacer(type);
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
                case OpType.TARGET_EVALUATOR:
                    op = new TargetEvaluator(type);
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
                }
            } else if (fromNode instanceof OneWayDependency && toNode instanceof Variable) {
                if (!fromNode.outputVars.includes(toNode)) {
                    const edge = new Edge(fromNode, toNode, isDirected);
                    this._edges.push(edge);
                    fromNode.outputVars.push(toNode); // = toNode;
                    toNode.incomingEdges.push(edge);
                }
            } else if (fromNode instanceof Variable && toNode instanceof MultiWayDependency) {
                if (!toNode.vars.includes(fromNode)) {
                    const edge = new Edge(fromNode, toNode, false);
                    this._edges.push(edge);
                    toNode.vars.push(fromNode); // = toNode;
                    toNode.edges.push(fromNode);
                    fromNode.undirectedEdges.push(edge);
                }
            } else if (fromNode instanceof MultiWayDependency && toNode instanceof Variable) {
                if (!fromNode.vars.includes(toNode)) {
                    const edge = new Edge(toNode, fromNode, false);
                    this._edges.push(edge);
                    fromNode.vars.push(toNode); // = toNode;
                    fromNode.edges.push(toNode);
                    toNode.undirectedEdges.push(edge);
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

        processChange(varType, multiways, ...params) {
            // if (Object.values(VarType).indexOf(varType) < 0)
            //     throw new Error('Unknown Variable Type: ' + varType);
            let v = this.findVariable(varType, params);
            if (!v) {
                console.warn('Unable to find variables matching the described change: ', varType, params);
                return;
            }
            for (let e of v.outgoingEdges) {
                if (e.isDirected) { //TODO: all outgoing edges should be directed
                    let dfOp = e.toNode;
                    dfOp.run();
                    let outVars = dfOp.outputVars;
                    // ToDo: Need to Refactor and combine with findVaraiable method; the logic is working
                    if (outVars.length > 0) {
                        //TODO: need to handle multiple out vars, e.g., layout operator sets both x and y channel vars
                        let outVar = outVars[0];
                        switch (outVar.type) {
                            case VarType.ITEMS:
                                this.processChange(outVar.type, multiways, outVar.predicate, outVar.dataset);
                                break;
                            case VarType.ATTRIBUTE:
                                this.processChange(outVar.type, multiways, outVar.attribute, outVar.dataset);
                                break;
                            case VarType.BOUNDS:
                            case VarType.ORDER:
                                this.processChange(outVar.type, multiways, outVar.element);
                                break;
                            case VarType.CHANNEL:
                                this.processChange(outVar.type, multiways, outVar.channel, outVar.element);
                                break;
                            case VarType.PROPERTY:
                                this.processChange(outVar.type, multiways, outVar.property, outVar.element);
                                break;
                            case VarType.SCALE:
                            case VarType.DOMAIN:
                            // case VarType.RANGE_EXTENT:
                                this.processChange(outVar.type, multiways, outVar.encodings[0]);
                                break;
                            case VarType.COND_ENCODING:
                                this.processChange(outVar.type, multiways, outVar.condEncoding);
                                break;
                        }
                    }
                }
            }

            for (let e of v.undirectedEdges) {
                multiways.push(e.operator);
            }
        }

        findVariable(varType, params) {
            if (!(varType in this._variables))
                return null;
            let vars = Object.values(this._variables[varType]);
            switch (varType) {
                case VarType.CHANNEL:
                    return vars.find(d => d.channel == params[0] && getEncodingKey(d.element) == getEncodingKey(params[1]));
                case VarType.PROPERTY:
                    return vars.find(d => d.property == params[0] && d.element == params[1]);
                case VarType.COND_ENCODING:
                    return vars.find(d => d.condEncoding == params[0]);
                case VarType.AFFIXATION:
                    return vars.find(d => d.affixation == params[0]);
                case VarType.ATTRIBUTE:
                    return vars.find(d => d.attribute == params[0] && d.dataset == params[1]);
                case VarType.ITEMS:
                    return vars.find(d => d.dataset == params[1]);
                case VarType.DOMAIN:
                case VarType.SCALE:
                    return vars.find(d => d.encodings.includes(params[0]));
                case VarType.TRIGGER:
                    return vars.find(d => d.trigger === params[0]);
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
                return elementRepeatable(obj[0]);
            } else {
                for (let c of obj) {
                    if (!isMark(c) || c.dataScope)
                        return false;
                }
            }
            return true;
        } else {
            return elementRepeatable(obj);
        }
    }

    function elementRepeatable(elem) {
        if ((isMark(elem) || elem.type == ElementType.Glyph) && !elem.dataScope)
            return true;
        else if (elem.type === ElementType.Collection)
            return elem.firstChild.dataScope.numTuples > 1;
        return false;
    }

    function repeatElement(scene, elem, attr, datatable) {
        let type = datatable.getAttributeType(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Repeat only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!repeatable(elem)) {
            throw new Error("The " + elem.type + " is not repeatable");
        }

        return _doRepeat(scene, elem, attr, datatable);
    }

    function _doRepeat(scene, elem, attr, datatable) {
        let ds = datatable.getAttributeSummary(attr).unique.map(d => elem.dataScope ? elem.dataScope.cross(attr, d) : new DataScope(datatable).cross(attr, d));
        ds = ds.filter(d => !d.isEmpty());
        let coll = createCollection(scene);
        coll.dataScope = elem.dataScope ? elem.dataScope.clone() : new DataScope(datatable);

        coll.addChild(elem);

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
        let nodeDS = data.nodeTable.getAttributeSummary(MSCNodeID).unique.map(d => node.dataScope ? node.dataScope.cross(MSCNodeID, d) : new DataScope(data.nodeTable).cross(MSCNodeID, d));
        let linkColl = createCollection(scene),
            nodeColl = createCollection(scene), 
            id2nodeMk = {};
        nodeColl.dataScope = node.dataScope ? node.dataScope.clone() : new DataScope(data.nodeTable);

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
            id2nodeMk[d.dataScope.getAttributeValue(MSCNodeID)] = d;
        });

        let linkDS = data.linkTable.getAttributeSummary(MSCRowID).unique.map(d => link.dataScope ? link.dataScope.cross(MSCRowID, d) : new DataScope(data.linkTable).cross(MSCRowID, d));
        linkColl.dataScope = link.dataScope ? link.dataScope.clone() : new DataScope(data.linkTable);

        linkColl.addChild(link);
        for (let i = 1; i < linkDS.length; i++) {
            let c = duplicate(link);
            linkColl.addChild(c);
        }

        linkColl.children.forEach((d, i) => d.dataScope = linkDS[i]);

        let s = (data instanceof Tree) ? "parent" : "source", 
            t = (data instanceof Tree) ? "child" : "target";
        for (let l of linkColl.children) {
            let sid = l.dataScope.getAttributeValue(s),
                tid = l.dataScope.getAttributeValue(t),
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

    class AttributeEncoding {
        
        constructor(elem, channel, attr, aggregator, args) {
            this._elem = elem;
            this._channel = channel;
            this._attribute = attr;
            this._aggregator = aggregator;
            this._includeZero = args.includeZero;
            this._flipScale = args.flipScale;
            this._mapping = args.mapping;
            this._preferredRangeExtent = args.rangeExtent;
            this._preferredDomain = undefined;
            this._scaleType = args.scaleType;
            this._colorScheme = args.scheme;
            this._forLegend = args.forLegend;

            this._scales = [];
            this._elemGroups = [];
            this._elem2scale = {};
            //this._scale2elems = {};

            this._refElements = [];

            if (["width", "height", "radius", "angle", "thickness", "radialDistance", "strokeWidth", "area"].indexOf(this._channel) >= 0)
                this._includeZero = true;

            this.initialize();
        }

        initialize() {
            this._scales = [];
            let elems = getPeers(this._elem);
            this._elemGroups = [];

            if (this._channel === "x" || this._channel === "y") {
                let e = this._elem,
                    tc = getTopLevelCollection(e);
                if (tc.layout && tc.layout.type == LayoutType.GRID) {
                    let elemGroups = this._channel === "x" ? tc.layout.getElementsByCol(true, e) : tc.layout.getElementsByRow(true, e);
                    for (let g of elemGroups) {
                        this._createScaleForElems(g);
                    }
                } else if (this._elem.type === "vertex" && (isDataBoundHorizontally(this._elem.parent) || isDataBoundVertically(this._elem.parent) ) ) {
                    let elemGroups = getPeers(this._elem.parent).map(d => getPeerVertices(this._elem, [d]));
                    for (let g of elemGroups) {
                        this._createScaleForElems(g);
                    }
                } else {
                    this._createScaleForElems(elems);
                }
            } else if (this._channel === "angle") {
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

        //todo: given an element, get its scale
        getScale(elem) {
            return this._elem2scale[elem.id];
        }

        getElements(scale) {
            let idx = this._scales.indexOf(scale);
            return this._elemGroups[idx];
            //return this._baseEnc._scale2elems[scale.id];
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

        get dataTable() {
            return getDataTable(this._elem);
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
            return Math.min(...s.range);
            //return Math.min(...this.scales[0].range);
        }

        getRangeExtent(elem) {
            let s = this.getScale(elem);
            return s.rangeExtent; 
            // return this.scales[0].rangeExtent;
        }

        get scaleType() {
            return this._scaleType;
        }

        set scaleType(r) {
            this._scaleType = r;
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
            this._elem.scene.onChange(VarType.DOMAIN, this);
        }

        set rangeExtent(v) {
            //refBounds will be updated in Encoder
            for (let s of this._scales) {
                s.rangeExtent = v;
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
    }

    class ConditionalEncoding {

        // constructor(elem, target, predicates, rules) {
        //     this._elem = elem;
        //     this._target = target;
        //     this._predicates = predicates;
        //     this._rules = rules;
        //     this._hitElement = undefined;
        // }

        // constructor(trigger, effect) {
        //     this._type = effect.type;
        //     this._elem = trigger.element;
        //     this._target = effect.target;
        //     if (effect.type === CondEncType.MATCH_TRIGGER_ELEMENT) {
        //         this._predicates = effect.criteria.map(d => obj2Predicate(d));
        //     }
        //     this._rules = effect.update;
        //     this._triggerElement = undefined;
        // }

        constructor(trigger, target, targetEval, efxFn) {
            this._trigger = trigger;
            this._target = target.target;
            this._targetEval = targetEval;
            this._efxFn = efxFn;

            this._evalResult = {};
            //this._triggerElements = [];
            //this._mouseEvent = undefined;
        }

        get trigger() {
            return this._trigger;
        }

        get target() {
            return this._target;
        }

        get channels() {
            return Object.keys(this._rules);
        }

        get evalResult() {
            return this._evalResult;
        }

        set evalResult(r) {
            this._evalResult = r;
        }

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

    class Gridlines extends Path {

        constructor(channel, attribute, scale, elems, args) {
            super(args);
            this._type = ElementType.Gridlines;
            this._id = this._type + generateUniqueID();

            // this._encoding = encoding;
            this._attribute = attribute;
            this._channel = channel;
            this._scale = scale;
            this._elems = elems;

            if (!("strokeColor" in args))
    			this.styles["strokeColor"] = "#ddd";

            if (!("opacity" in args))
    			this.styles["opacity"] = 0.5;


            if ("values" in args) {
                this._values = args["values"];
            } else if (this._scale) {
                this._values = inferTickValues(this._scale, this._channel, this._elems);
            } else {
                this._values = this._elems.map(d => d.dataScope.getAttributeValue(this._attribute));
            }

            this._lines = [];
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
                let left = Math.min(...xCoords),
                    right = Math.max(...xCoords),
                    top = Math.min(...yCoords),
                    btm = Math.max(...yCoords);
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

    function divideElement(scene, elem, attr, orientation, datatable) {
        let type = datatable.getAttributeType(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Divide only works on a string or date attribute: " + attr + " is " + type);
        }

        if (!dividable(elem)) {
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
    			let pieDS = p.dataScope ? p.dataScope : new DataScope(table);
    			let ds = table.getUniqueAttributeValues(attr).map(d => pieDS.cross(attr, d));
    			ds = ds.filter(d => !d.isEmpty()); 

    			let coll = createCollection(scene);
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = p.dataScope ? p.dataScope : new DataScope(table);

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			for (let i = 0; i < ds.length; i++) {
    				let c = createMark({type: "arc", 
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
    	let ds = table.getUniqueAttributeValues(attr).map(d => new DataScope(table).cross(attr, d));
    	//datascopes
    	let area2Scope = {}, max = 0;
    	for (let p of inputAreas) {
    		let scopes = ds;
    		if (p.dataScope) {
    			scopes = ds.map(d => d.merge(p.dataScope));
    			scopes = scopes.filter(d => !d.isEmpty());
    		}
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

        let r = createMark(args);
        r._classId = r.id;
    	if (elem.vertices) {
            for (let i = 0; i < elem.vertices.length; i++) {
                if (elem.vertices[i].dataScope) {
                    r.vertices[i]._dataScope = elem.vertices[i].dataScope.clone(); 
                }
            }
        }

    	for (let p of inputAreas) {
    		let coll = createCollection(scene);
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		coll.dataScope = p.dataScope ? p.dataScope : new DataScope(table);

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
    			console.log(newArea.dataScope);
                newArea.resize(wd, ht);
    			newArea._updateBounds();
    			newArea._refBounds = newArea.bounds.clone();
    			coll.addChild(newArea);

    			for (let v of newArea.vertices){
    				if (v.dataScope) {
    					v.dataScope = newArea.dataScope.merge(v.dataScope);
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
    			let circleDS = p.dataScope ? p.dataScope : new DataScope(table);
    			let ds = table.getUniqueAttributeValues(attr).map(d => circleDS.cross(attr, d));
    			ds = ds.filter(d => !d.isEmpty()); 

    			let coll = createCollection(scene);
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = p.dataScope ? p.dataScope : new DataScope(table);

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			let arcAng = 360 / ds.length;
    			let start = 90;
    			for (let i = 0; i < ds.length; i++) {
    				let c = createMark({type: "arc", innerRadius: 0, outerRadius: p.radius, x: p.x, y: p.y,
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
    	let ds = table.getUniqueAttributeValues(attr).map(d => new DataScope(table).cross(attr, d));

    	//datascopes
    	let rect2Scopes = {}, max = 0;
    	for (let p of peers) {
    		let scopes = ds;
    		if (p.dataScope) {
    			scopes = ds.map(d => d.merge(p.dataScope));
    			scopes = scopes.filter(d => !d.isEmpty());
    		}
    		if (scopes.length > max)
    			max = scopes.length;
    		rect2Scopes[p.id] = scopes;
    	}

    	let collClassId,
            r = createMark({type: "rect", left: elem.bounds.left, top: elem.bounds.top, width: elem.bounds.width, height: elem.bounds.height, 
                                strokeColor: elem.strokeColor, fillColor: elem.fillColor, strokeWidth: elem.strokeWidth, opacity: elem.opacity});
        r._classId = r.id;

    	for (let p of peers) {
    		let coll = createCollection(scene);
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		coll.dataScope = p.dataScope ? p.dataScope : new DataScope(table);

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
    			let ringDS = p.dataScope ? p.dataScope : new DataScope(table);
    			let ds = table.getUniqueAttributeValues(attr).map(d => ringDS.cross(attr, d));
    			ds = ds.filter(d => !d.isEmpty()); 

    			let coll = createCollection(scene);
    			if (collClassId == undefined)
    				collClassId = coll.id;
    			coll._classId = collClassId;
    			coll.dataScope = p.dataScope ? p.dataScope : new DataScope(table);

    			let parent = p.parent;
    			parent.removeChild(p);
    			delete scene._itemMap[p.id];

    			let arcAng = 360 / ds.length;
    			let start = 90;
    			for (let i = 0; i < ds.length; i++) {
    				let c = createMark({type: "arc", innerRadius: p.innerRadius, outerRadius: p.outerRadius, x: p.x, y: p.y,
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

    function dividable(elem) {
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
    			if (p.dataScope.numTuples > 1)
    				return true;
    		}
    		return false;
    	}
    }

    function repopulate(scene, collection, attr, datatable) {
        let type = datatable.getAttributeType(attr);

        if (type != AttributeType.String && type != AttributeType.Date && type != AttributeType.Integer) {
            throw new Error("Repopulate only works on a string or date attribute: " + attr + " is " + type);
        }

        let peers = getPeers(collection);
        for (let coll of peers) {
            let ds = datatable.getAttributeSummary(attr).unique.map(d => coll.dataScope ? coll.dataScope.cross(attr, d) : new DataScope(datatable).cross(attr, d));
            ds = ds.filter(d => !d.isEmpty());
            //coll.dataScope = coll.parent && coll.parent.dataScope ? coll.parent.dataScope : new DataScope(datatable);
        
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

    class Affixation {

        constructor(elem, base, channel, args) {
            this._elem = elem;
            this._base = base;
            this._channel = channel;
            this._elemAnchor = "elementAnchor" in args ? args.elementAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            this._baseAnchor = "baseAnchor" in args ? args.baseAnchor : (channel == "x" || channel == "angle") ? BoundsAnchor.CENTER : BoundsAnchor.MIDDLE;
            this._offset = "offset" in args ? args.offset : 0;
        }

        get element() {
            return this._elem;
        }

        get base() {
            return this._base;
        }

        get channel() {
            return this._channel;
        }

        get elementAnchor() {
            return this._elemAnchor;
        }

        get baseAnchor() {
            return this._baseAnchor;
        }

        get offset() {
            return this._offset;
        }
    }

    function sortGroupChildren(group, property, descending, vals) {
        if (group.dataScope && group.dataScope.dataTable.hasAttribute(property))
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
        if (!group.dataScope.dataTable.hasAttribute(attr)) {
            console.warn("Cannot order collection children by an non-existent attribute", attr);
            return;
        }
        //this._childrenOrder = o;
        let f;
        if (attr === MSCRowID) {
            f = (a, b) => parseInt(a.dataScope.getAttributeValue(attr).substring(1)) - parseInt(b.dataScope.getAttributeValue(attr).substring(1));
        } else {
            let type = group.children[0].dataScope.getAttributeType(attr);
            switch (type) {
                case AttributeType.Date:
                    break;
                case AttributeType.Number:
                case AttributeType.Integer:
                    f = (a, b) => a.dataScope.aggregateNumericalAttribute(attr) - b.dataScope.aggregateNumericalAttribute(attr);
                    break;
                case AttributeType.String:
                    if (ranking)
                        f = (a, b) => ranking.indexOf(a.dataScope.getAttributeValue(attr)) - ranking.indexOf(b.dataScope.getAttributeValue(attr));
                    else
                        f = (a, b) => (a.dataScope.getAttributeValue(attr) < b.dataScope.getAttributeValue(attr) ? -1 : 1);
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
        if (path.vertices[0].dataScope && path.vertices[0].dataScope.dataTable.hasAttribute(property))
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
        // if (!path.dataScope.dataTable.hasAttribute(attr)) {
        //     console.warn("Cannot order collection children by an non-existent attribute", attr);
        //     return;
        // }
        //this._childrenOrder = o;
        let f;
        if (attr === MSCRowID) {
            f = (a, b) => parseInt(a.dataScope.getAttributeValue(attr).substring(1)) - parseInt(b.dataScope.getAttributeValue(attr).substring(1));
        } else {
            let type = path.vertices[0].dataScope.getAttributeType(attr);
            switch (type) {
                case AttributeType.Date:
                    break;
                case AttributeType.Number:
                case AttributeType.Integer:
                    f = (a, b) => a.dataScope.aggregateNumericalAttribute(attr) - b.dataScope.aggregateNumericalAttribute(attr);
                    break;
                case AttributeType.String:
                    if (ranking)
                        f = (a, b) => ranking.indexOf(a.dataScope.getAttributeValue(attr)) - ranking.indexOf(b.dataScope.getAttributeValue(attr));
                    else
                        f = (a, b) => (a.dataScope.getAttributeValue(attr) < b.dataScope.getAttributeValue(attr) ? -1 : 1);
                    break;
            }
        }
        path.vertices.sort(f);

        if (descending)
            path.vertices.reverse();
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
    		if (!this._numCols && !this._numRows)
    			this._numRows = 1;
    		this._left = undefined;
    		this._top = undefined;
    		this._cellBounds = undefined;
    		this._grid = undefined;
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
     
    	get numRows() {
    		if (this._numRows) {
    			return this._numRows;
    		} else if (this._numCols) {
    			return Math.ceil(this.group.children.length/this._numCols);
    		} else 
    			return 0;
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
    			vertCellAlignment: this._cellVertAlignment
    		});
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
    	 * @returns 
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
    	 * @returns 
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
    	 * @returns 
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
            let longestText = dt.getUniqueAttributeValues("category").sort((a,b) => b.length - a.length)[0];
            let mark = this._enc.element;
            let sw = mark instanceof Path && mark.closed ? mark.strokeWidth : 0;
            if (this._orientation === LayoutOrientation.VERTICAL) {
                let titleSize = 0;
                if (this._showTitle) {
                    this.addChild(new PointText({fillColor: this._textColor, "fontSize": this._fontSize, "text": attr, x: this._x, y: this._y, "anchor": ["left", "top"]})); 
                    titleSize = parseFloat(this._fontSize) + 5;
                }
                let rect = scene.mark("rect", {"top": this._y + 2 + titleSize, "left": this._x, "width": 10, "height": 10, "strokeWidth": sw, "strokeColor": mark.strokeColor, "opacity": mark.opacity});
                let text = scene.mark("text", {text: longestText, fillColor: this._textColor, "fontSize": this._fontSize, x: this._x + 20, y: this._y + titleSize + 12 + sw, "anchor": ["left", "bottom"]});
                let glyph = scene.glyph(rect, text);
                let coll = scene.repeat(glyph, dt);
                // scene.encode(text, {"channel": "text", "attribute": "category", "_remember": false});
                // scene.encode(rect, {"channel": "fillColor", "attribute": "category", "_remember": false, scale: scale});
                scene.encode(text, {"channel": "text", "attribute": "category", "forLegend": true});
                scene.encode(rect, {"channel": "fillColor", "attribute": "category", shareScale: this._enc, "forLegend": true});
                coll.layout = new GridLayout({"numCols": this._numCols, "numRows": this._numRows});
                this.addChild(coll);
            } else {
                //do not show title for now
                let rect = scene.mark("rect", {"top": this._y, "left": this._x, "width": 10, "height": 10, "strokeWidth": sw, "strokeColor": mark.strokeColor, "opacity": mark.opacity});
                let text = scene.mark("text", {text: longestText, fillColor: this._textColor, "fontSize": this._fontSize, x: this._x + 15, y: this._y, "anchor": ["left", "top"]});
                let glyph = scene.glyph(rect, text);
                let coll = scene.repeat(glyph, dt);
                // scene.encode(text, {"channel": "text", "attribute": "category", "_remember": false});
                // scene.encode(rect, {"channel": "fillColor", "attribute": "category", "_remember": false, scale: scale});
                scene.encode(text, {"channel": "text", "attribute": "category", "forLegend": true});
                scene.encode(rect, {"channel": "fillColor", "attribute": "category", shareScale: this._enc, "forLegend": true});
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
                domain = [Math.min(...vals), Math.max(...vals)], mapping = this._enc.mapping;
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
                let domain = this._enc.scales[0].domain, dt = getDataTable(this._enc.element), ft = dt.getAttributeType(attr);
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
                        let t = scene.mark("text", {fillColor: this._textColor, "text": ft === AttributeType.Date? dt.getRawValue(attr, d) : this._numberFormat ? formatter(d) : d, 
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
                        let t = scene.mark("text", {fillColor: this._textColor, "text": ft === AttributeType.Date? dt.getRawValue(attr, d) : d, x: this._x + p * wd, y: this._y + ht + offset + titleSize, "anchor": ["center", "top"]});
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

    function classifyCollectionChildren(scene, collection, attr, layout) {
        let peers = getPeers(collection);
        for (let p of peers) {
            let collections = {}, cid, elems = p.children;
            for (let elem of elems) {
                let v = elem.dataScope.getAttributeValue(attr);
                if (!(v in collections)) {
                    collections[v] = [];
                }
                collections[v].push(elem);
            }
            let tbl = getDataTable(elems[0]);
            for (let v in collections) {
                let coll = createCollection(scene);
                p.addChild(coll);
                if (cid === undefined)
                    cid = coll.id;
                coll._classId = cid;
                coll.dataScope = p.dataScope ? p.dataScope.cross(attr, v) : new DataScope(tbl).cross(attr, v);
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

    function stratifyElement(scene, elem, direction, size, tree) {
        switch (elem.type) {
    		case ElementType.Circle:
    			return _doCircleStratify(scene, elem, direction, size, tree);
    		case ElementType.Rect:
    			return _doRectStratify(scene, elem, direction, size, tree);
    	}
    }

    function _doCircleStratify(scene, compnt, dir, sz, tree) {
    	let toReturn, direction = dir ? dir : RadialDirection.OUTWARD, size = sz ? sz : 50;
    	if (direction !== RadialDirection.INWARD && direction !== RadialDirection.OUTWARD) {
    		throw "Unknown direction to stratify";
    	}
    	let peers = getPeers(compnt, scene);
    	let collClassId;
    	peers.forEach(p => {
    		let coll = createCollection(scene);
    		coll.dataScope = undefined;
    		if (collClassId == undefined)
    			collClassId = coll.id;
    		coll._classId = collClassId;
    		let parent = p.parent;
    		_addArcStrata(p, compnt.id, direction, size, tree, tree.getRoot(), coll, scene, true);
    		coll._layout = new StrataLayout({direction: direction});
    		coll._layout.group = coll;
    		parent.addChild(coll);
    		
    		if (p === compnt)
    			toReturn = coll;
    	});
    	return toReturn;
    }

    function _doRectStratify(scene, compnt, dir, sz, tree) {
        let toReturn, direction = dir ? dir : LinearDirection.Top2Bottom, size = sz ? sz : 50;
        if (!Object.values(LinearDirection).includes(direction)) {
            throw "Unknown direction to stratify";
        }
        let peers = getPeers(compnt);
        let collClassId;
        peers.forEach(p => {
            let coll = createCollection(scene);
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

    function _addArcStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
    	if (isRoot) {
    		compnt.dataScope = tree.getNodeDataScope(node);
    		// console.log(mark.dataScope);
    		compnt._classId = classId;
    		coll.addChild(compnt);
    	}
    	let children = tree.getChildren(node);
    	if (children.length === 0) return;
    	let start = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 90 : compnt.startAngle,
    		extent = compnt.type === ElementType.Circle || compnt.type === ElementType.Ring ? 360 : compnt.angle,
    		angle = extent/children.length;
    	for (let i = 0; i < children.length; i++) {
    		let ir = compnt.type === ElementType.Circle ? compnt.radius : compnt.outerRadius;
    		let mark;
    		if (angle === 360) {
    			mark = createMark({
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
    			mark = createMark({
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
    		mark.dataScope = tree.getNodeDataScope(children[i]);
    		// console.log(mark.dataScope);
    		mark._classId = classId;
    		coll.addChild(mark);
    		_addArcStrata(mark, classId, direction, size, tree, children[i], coll);
    	}
    }

    function _addRectStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
    	if (isRoot) {
    		compnt.dataScope = tree.getNodeDataScope(node);
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
            translate(mark, x - mark.left, y - mark.top);
            mark.resize(width, size);
            mark._updateBounds();
    		x += width;
    		mark.dataScope = tree.getNodeDataScope(children[i]);
    		mark._classId = classId;
    		coll.addChild(mark);
    		_addRectStrata(mark, classId, direction, size, tree, children[i], coll);
    	}
    }

    class Scene extends Group {

        constructor(args) {
            super();
            this._itemMap = {};
            this._type = ElementType.Scene;
            this._id = args && args.id ? args.id : this._type + generateUniqueID();
            if (args && args.fillColor) {
                this.fillColor = args.fillColor;
            }
            this._encodings = {};
            this._relations = [];
            this._triggers = {};
            this._depGraph = new DependencyGraph();
        }

        get depGraph() {
            return this._depGraph;
        }

        get interactionTriggers() {
            return this._triggers;
        }

        mark(type, param) {
            if (Object.values(PrimitiveMarks).indexOf(type) < 0)
                throw new Error("Mascot does not allow directly creating a " + type);
            let args = param === undefined ? {} : param;
            args.type = type;
            let m = createMark(args);
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
            let g = createGlyph(args);
            if (g !== null) {
                g._classId = g.id;
                this.addChild(g);
                this._itemMap[g.id] = g;
                for (let t of temp)
                    childRemoved(t[0], t[1], this._depGraph);
                newGlyphCreated(g, this._depGraph);
                parentChildConnected(this, g, this._depGraph);
            }
            return g;
        }

        composite() {
            let c = new Composite();
            if (c !== null) {
                c._classId = c.id;
                this.addChild(c);
                this._itemMap[c.id] = c;
                newCompositeCreated(c, this._depGraph);
                parentChildConnected(this, c, this._depGraph);
            }
            return c;
        }

        attach(elem, table) {
            if (elem.type == ElementType.Glyph) {
                for (let e of elem.children) {
                    if (!e._refBounds)
                        e._refBounds = e.bounds.clone();
                }
            }
    		elem.dataScope = new DataScope(table);
    	}

        repeat(elem, data, param) {
            let args = param ? param : {};
            args["attribute"] = args["attribute"] || MSCRowID;
            console.log("------ repeat by", args["attribute"], " ----");
            validateRepeatArguments(elem, data, args);

            if (data instanceof Tree || data instanceof Network) {
                let parent0 = elem[0].parent,
                    parent1 = elem[1].parent;
                let [nodes, links] = repeatNodeLink(this, elem[0], elem[1], data);
                childRemoved(parent0, elem[0], this._depGraph);
                childRemoved(parent1, elem[1], this._depGraph);
                newCollectionCreated(nodes, this._depGraph);
                newCollectionCreated(links, this._depGraph);
                parentChildConnected(nodes, elem[0], this._depGraph);
                parentChildConnected(nodes.parent, nodes, this._depGraph);
                parentChildConnected(links, elem[1], this._depGraph);
                parentChildConnected(links.parent, links, this._depGraph);
                return [nodes, links];
            } else if (data instanceof DataTable) {
                let parent = elem.parent;
                let collection = repeatElement(this, elem, args["attribute"], data);
                childRemoved(parent, elem, this._depGraph);
                newCollectionCreated(collection, this._depGraph);
                parentChildConnected(collection, elem, this._depGraph);
                parentChildConnected(collection.parent, collection, this._depGraph);
                // console.log(this._depGraph);
                if (args.layout)
                    collection.layout = args.layout;
                return collection;
            }
        }

        divide(elem, data, param) {
            let args = param ? param : {};
            args["attribute"] = args["attribute"] || MSCRowID;
            console.log("------ divide by", args["attribute"], " ----");
            validateDivideArguments(elem, data, args);

            if (data instanceof Tree || data instanceof Network) {
                throw "Not implemented";
            } else if (data instanceof DataTable) {
                let {newMark, collection} = divideElement(this, elem, args["attribute"], args["orientation"], data);
                elementRemoved(elem, this._depGraph);
                newMarkCreated(newMark, this._depGraph);
                newCollectionCreated(collection, this._depGraph);
                //must go from lower-level to higher-level
                parentChildConnected(collection, newMark, this._depGraph);
                if (collection.parent.type !== ElementType.Scene)
                    parentChildConnected(collection.parent, collection, this._depGraph);
                
                this.onChange(VarType.CHANNEL, "width", newMark);
                return {newMark, collection};
            }
        }

        densify(elem, data, param) {
            let args = param ? param : {};
            args["attribute"] = args["attribute"] || MSCRowID;
            console.log("------ densify by", args["attribute"], " ----");
            validateDensifyArguments(elem, data, args);

            if (data instanceof Tree || data instanceof Network) {
                throw "Not implemented";
            } else if (data instanceof DataTable) {
                let newMark = densifyElement(this, elem, args["attribute"], args["orientation"], data);
                elementRemoved(elem, this._depGraph);
                newMarkCreated(newMark, this._depGraph);
                // must go from lower-level to higher-level
                if (newMark.parent.type !== ElementType.Scene)
                    parentChildConnected(newMark.parent, newMark, this._depGraph);
                
                this.onChange(VarType.CHANNEL, "width", newMark);
                return newMark;
            }
        }

        stratify(elem, tree, param) {
            if (!(tree instanceof Tree)) {
    			throw "Cannot stratify on a non-tree dataset";
    		}

            if (![ElementType.Circle, ElementType.Rect].includes(elem.type))
                throw "Cannot stratify elements that are not rects or circles";

            let args = param ? param : {},
    			direction = args["direction"],
    			size = args["size"];
            let parent = elem.parent;
            let collection = stratifyElement(this, elem, direction, size, tree);
            childRemoved(parent, elem, this._depGraph);
            newCollectionCreated(collection, this._depGraph);
            parentChildConnected(collection, elem, this._depGraph);
            parentChildConnected(collection.parent, collection, this._depGraph);
            return collection;
        }

        repopulate(coll, dt, mapping) {
            //TODO: validate arguments: coll must be a top-level collection
            coll.dataScope = undefined;
            let currentColl = coll;

            for (let k in mapping) {
                repopulate(this, currentColl, mapping[k], dt);

                let encs = getEncodingsByElement(currentColl.children[0], true);
                for (let enc of encs) {
                    removeEncoding(enc, this);
                    encodingRemoved(enc, this._depGraph);
                    for (let re of enc.refElements) {
                        removeRefElement(re, this);
                        refElementRemoved(re, this._depGraph);
                    }
                    enc.clearRefElements();
                }
                
                let peers = getPeers(currentColl);
                for (let cc of peers) {
                    if (cc.layout) {
                        for (let re of cc.layout.refElements) {
                            removeRefElement(re, this);
                            refElementRemoved(re, this._depGraph);
                        }
                        cc.layout.clearRefElements();
                    }
                }

                currentColl = currentColl.children[0];
            }

            coll.dataScope = new DataScope(dt);
            this.onChange(VarType.CHANNEL, "width", coll.children[0]);
        }

        classify(coll, param) {
            let args = param ? param : {};
            console.log("------ classify by", args["attribute"], " ----");
            
            // validateClassifyArguments(coll, args);
            classifyCollectionChildren(this, coll, args["attribute"], args["layout"]);
            childRemoved(coll, coll.firstChild.firstChild, this._depGraph);
            newCollectionCreated(coll.firstChild, this._depGraph);
            //must go from lower-level to higher-level
            parentChildConnected(coll.firstChild, coll.firstChild.firstChild, this._depGraph);
            parentChildConnected(coll, coll.firstChild, this._depGraph);
            this.onChange(VarType.CHANNEL, "width", coll.firstChild.firstChild);
        }

        affix(elem, base, channel, params) {
            //TODO: validate
            let affx = new Affixation(elem, base, channel, params ? params : {});
            affixationSpecified(affx, this._depGraph);
            this._relations.push(affx);
        }

        align(elems, channel, anchor) {
            let aln = new Alignment(elems, channel, anchor);
            alignmentSpecified(aln, this._depGraph);
            this._relations.push(aln);
        }

        //example usage in the scatterplot demo: scn.encode(circle, { attribute: "GDP per capita", channel: "x" });
        encode(elem, param) {
            if (param.attribute === "rowId")
                param.attribute = MSCRowID;
            validateEncodeArguments(elem, param);

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
            console.log("------ encode", param.channel, param.attribute, " --");

            let enc = new AttributeEncoding(elem, param.channel, param.attribute, aggregator, param);
            // let key = getEncodingKey(elem);
            // if (!(key in this._encodings))
            //     this._encodings[key] = {};
            // this._encodings[key][param.channel] = enc;
            this._addAttributeEncoding(enc);
            encodingSpecified(enc, this._depGraph, param.shareScale);
            if (param.shareScale)
                this.onChange(VarType.DOMAIN, enc); //run all the encoders
            else {
                // let channel = elem.type === ElementType.Rect && param.channel === "area" ? "width" : param.channel;
                this.onChange(VarType.CHANNEL, param.channel, elem);
            }

            return enc;
        }

        _addAttributeEncoding(enc) {
            let key = getEncodingKey(enc.element);
            if (!(key in this._encodings))
                this._encodings[key] = {};
            this._encodings[key][enc.channel] = enc;
        }


        activate(trigger, target, targetEval, efxFunc) {
            if (!("event" in trigger) || !("type" in trigger))
                throw "Event and trigger must be specified";
            if (trigger.type !== "control") {
                if (!("target" in target) || !("targetChannels" in target))
                    throw "Target must be specified";
                if (typeof targetEval !== "function")
                    throw "Target evaluator must be a function";
            }
            if (trigger.type === TriggerType.ELEMENT && !("element" in trigger))
                throw "Element must be specified for trigger";
            if (typeof efxFunc !== "function")
                throw 'Effect setter must be a function';

            let event = trigger.event, id = getTriggerID(trigger);
            event = event.indexOf("brush") === 0 ? "brush" : event;
            if (!(event in this._triggers)) {
                this._triggers[event] = {};
            }
            if (!(id in this._triggers[event]))
                this._triggers[event][id] = new Trigger(trigger.event, trigger.type, trigger.element, trigger.listener, "cumulative" in trigger ? trigger.cumulative : false);
            
            if (trigger.type === "control") {
                this._triggers[event][id]["callback"] = efxFunc;
            } else {
                let triggerObj = this._triggers[event][id];
                let condEnc = new ConditionalEncoding(triggerObj, target, targetEval, efxFunc);
                interactionSpecified(condEnc, target.targetChannels, this._depGraph);
                return condEnc;
            }
            
        }

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
            if (Object.values(VarType).indexOf(varType) < 0)
                throw new Error('Unknown Variable Type: ' + varType);
            // console.log("triggering change", varType, params);
            let multiways = [];
            this._depGraph.processChange(varType, multiways, ...params);
            for (let m of multiways)
                m.run(); 
        }

        gridlines(channel, attr, params) {
            let args = params ? params : {},
                enc = args.element ? getChannelEncodingByElement(args.element, channel) : getChannelEncodingByAttribute(attr, channel, this);
            if (enc) {
                if (enc.attribute !== attr)
                    console.warn("Cannot create a " + channel + " axis for " + attr);
                let scaleElems = [];
                if (channel == "x") {
                    for (let scale of enc.scales) {
                        scaleElems.push({ "scale": scale, "elems": enc.getElements(scale) });
                    }
                } else if (channel == "width") {
                    let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numCols > 1) {
                        let elemGroups = tc.layout.getElementsByCol(true);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": scale, "elems": elems });
                        }
                    } else {
                        scaleElems.push({ "scale": enc.scales[0], "elems": enc.getElements(enc.scales[0]) });
                    }
                } else if (channel == "y") {
                    let tc = getTopLevelCollection(enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByRow(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({"scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({"scale": enc.scales[0], "elems": enc.getElements(enc.scales[0])});
                    }
                } else if (channel == "height") {
                    let tc = getTopLevelCollection(enc.element), scale = enc.scales[0];
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByRow(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": scale, "elems": elems });
                        }
                    } else {
                        scaleElems.push({ "scale": scale, "elems": enc.getElements(scale) });
                    }
                } else if (channel == "radialDistance") {
                    //find polygons
                    scaleElems.push({"scale": enc.scales[0], "elems": getPeers(enc.element)});
                }
                for (let se of scaleElems) {
                    let gl = new Gridlines(enc.channel, enc.attribute, se.scale, se.elems, args);
                    this.addChild(gl);
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
                        p.layout.addRefElement(gl);
                        gridlinesCreated(gl, this._depGraph);
                        parentChildConnected(this, gl, this._depGraph);
                    }
                }
            }
        }

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
                    let tc = getTopLevelCollection(enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numCols > 1) {
                        let elemGroups = tc.layout.getElementsByCell(true, enc.element);
                        // let elemGroups = tc.layout.getElementsByCol(true);
                        for (let elems of elemGroups) {
                            scaleElems.push({ "scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({ "scale": enc.scales[0], "elems": enc.getElements(enc.scales[0]) });
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
                    let tc = getTopLevelCollection(enc.element);
                    if (tc.layout && tc.layout.type == LayoutType.GRID && tc.layout.numRows > 1) {
                        let elemGroups = tc.layout.getElementsByCell(true, enc.element);
                        for (let elems of elemGroups) {
                            scaleElems.push({"scale": enc.getScale(elems[0]), "elems": elems});
                        }
                    } else {
                        scaleElems.push({"scale": enc.scales[0], "elems": enc.getElements(enc.scales[0])});
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
                    scaleElems.push({"scale": enc.scales[0], "elems": getPeers(enc.element)});
                }
                for (let se of scaleElems) {
                    let axis = new EncodingAxis(enc, se.scale, se.elems, args);
                    this.addChild(axis);
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
                        let axis = new LayoutAxis(elems, channel, attribute, args);
                        this.addChild(axis);
                        axes.push(axis);
                        p.layout.addRefElement(axis);
                        layoutAxisSpecified(axis, this._depGraph);
                        parentChildConnected(this, axis, this._depGraph);
                        this.onChange(VarType.PROPERTY, Properties.AXIS_PATH_POSITION, axis);
                    }
                }
            }
            return axes;
        }

        legend(channel, attr, params) {
            let args = params ? params : {},
                attribute = attr == "rowId" ? MSCRowID : attr;
            let enc = args.element ? getChannelEncodingByElement(args.element, channel) : getChannelEncodingByAttribute(attribute, channel, this);
            if (enc) {
                if (enc.attribute !== attr)
                    console.warn("Cannot create a " + channel + " legend for " + attr);
                let attrType = getDataTable(enc.element).getAttributeType(attr);
                let legend = attrType === "string" ? new CategoricalLegend(enc, args) : new QuantitativeLegend(enc, args);
                this.addChild(legend);
                legendSpecified(legend, this._depGraph);
                parentChildConnected(this, legend, this._depGraph);
                propagateBoundsUpdate(legend);
                this.onChange(VarType.PROPERTY, Properties.LEGEND_POSITION, legend);
            } else {
                console.warn("Cannot create a " + channel + " legend for " + attribute);
            }
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

        //TODO: handle noPeers case
        setProperties(cmpnt, params, noPeers) {
            //TODO: validate channel against elem type, and validate if the channels are encoding data
            let peers = noPeers ? [cmpnt] : getPeers(cmpnt);
            peers.forEach(c => {
                for (const [key, value] of Object.entries(params)) {
                    // c[key] = value;
                    setProperty(c, key, value);
                }
            });

            //TODO: handle conditions when width or height bound to data
            if ("width" in params) {
                peers.forEach(d => d._refBounds.setWidth(params["width"]));
            }
            if ("height" in params) {
                peers.forEach(d => d._refBounds.setHeight(params["height"]));
            }

            for (let k in params) {
                if (["vertex", "segment"].includes(cmpnt.type) && !["x", "y"].includes(k))
                    continue;
                if (Object.values(Channels).includes(k))
                    this.onChange(VarType.CHANNEL, k, cmpnt);
                else
                    this.onChange(VarType.PROPERTY, k, cmpnt);
            }
        }

        setLayoutParameters(coll, params) {
            //TODO: validate
            let peers = getPeers(coll);
            for (let p of peers) {
                for (let k in params) {
                    p.layout[k] = params[k];
                }
            }
            this.onChange(VarType.CHANNEL, "width", coll.firstChild);
        }

        sortChildren(elem, property, descending, orderedVals) {
            if (elem instanceof Group) {
                sortGroupChildren(elem, property, descending, orderedVals);
                this.onChange(VarType.ORDER, elem);
            } else if (elem instanceof Path) {
                let paths = getPeers(elem);
                for (let path of paths)
                    sortVertices(path, property, descending, orderedVals);
            }
        }

        // getChannelEncodingByElement(elem, channel) {
        //     let enc = this._encodings[getEncodingKey(elem)];
        //     if (enc && enc[channel]) {
        //         return enc[channel];
        //     } else
        //         return null;
        // }

        findElements(predicates) {
            return findItems(this, predicates);
        }

        translate(c, dx, dy) {
            //TODO: check if movable due to position encoding, affixation constraints
            translate(c, dx, dy);
            let lm = getLeafMarks(c, true);
            for (let m of lm)
                propagateBoundsUpdate(m);
            for (let m of lm)
                this.onChange(VarType.CHANNEL, "x", m);
        }

        transform(type, table, args) {
            //TODO: validate args 
            let resultTbl = table.clone();
            switch (type) {
                case "bin":
                    binningSpecified(args.attribute, args.newAttribute, table, resultTbl, this._depGraph);
                    break;
                case "filter":
                    filteringSpecified(obj2Predicate(args), table, resultTbl, this._depGraph);
                    break;
                case "kde":
                    kdeSpecified(args.attribute, args.newAttribute, table, resultTbl, args, this._depGraph);
                    break;
            }
            return resultTbl;
        }
    }

    function processDataScope(json, scn) {
        let scope = new DataScope(scn.tables[json.dt]);
        for (let k in json.attr2value) {
            scope._attr2value[k] = json.attr2value[k];
            scope._updateTuples(k, json.attr2value[k]);
        }
        return scope;
    }

    class DirectedGraphLayout extends Layout {

        constructor(args) {
            super();
            this.type = LayoutType.DIRECTED;
            this._width = "width" in args ? args["width"] : 500;
            this._height = "height" in args ? args["height"] : 300;
            this._top = "top" in args ? args["top"] : 0;
            this._left = "left" in args ? args["left"] : 0;
            this._edgeSep = "edgeSep" in args? args["edgeSep"] : 50;
            this._spreadLinks = "spreadLinks" in args ? args["spreadLinks"] : true;
            this._direction = "direction" in args ? args["direction"] : LinearDirection.Top2Bottom;        
        }

        clone() {
            let f = new DirectedGraphLayout({
                width: this._width,
                height: this._height,
                top: this._top,
                left: this._left,
                edgeSep: this._edgeSep,
                spreadLinks: this._spreadLinks,
                direction: this._direction
            });
            return f;
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

        get edgeSep() {
            return this._edgeSep;
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
        l._left = json.left;
        l._top = json.top;
        l._cellBounds = json.cellBounds.map(d => processBounds(d));
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

    function processMark(json, scene) {
        if (json.type === ElementType.Pie)
            json.type = ElementType.Arc;
        json.args.type = json.type;
        let mark = createMark(json.args);
        if (json.id)
            mark._id = json.id;
        if (json.classId)
            mark._classId = json.classId;
        if (json.dataScope)
            mark._dataScope = processDataScope(json.dataScope, scene);
        if (json.bounds)
            mark._bounds = processBounds(json.bounds);
        if (json.refBounds)
            mark._refBounds = processBounds(json.refBounds);
        processPath(json, mark, scene);
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

    function processPath(json, mark, scene) {
        if (json.vertices) {
            const vertices = [];
            for (let d of json.vertices) {
                const v = processVertex(d, mark, scene);
                vertices.push(v);
            }
            mark.vertices = vertices;
            //TODO: modify instead of replace segments
            mark.segments = [];
            let segmentCounter = 0;
            for (let i = 1; i < mark.vertices.length; i++)
                mark.segments.push(new Segment(mark.vertices[i-1], mark.vertices[i], mark, segmentCounter++));
            if (mark.type === ElementType.Rect)
                mark.segments.push(new Segment(mark.vertices[mark.vertices.length-1], mark.vertices[0], mark, segmentCounter++));

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

    function processVertex(json, parent, scene) {
        let v = new Vertex(json.x, json.y, parent, json.id);
        if (json.dataScope)
            v._dataScope = processDataScope(json.dataScope, scene);
        if ("polarAngle" in json)
            v._polarAngle = json.polarAngle;
        v.shape = json.shape;
        v.width = json.width;
        v.height = json.height;
        v.radius = json.radius;
        v.fillColor = json.fillColor;
        v.opacity = json.opacity;
        v.strokeWidth = json.strokeWidth;
        v.strokeColor = json.strokeColor;
        return v;
    }

    function deserializeScene(json) {
        let scnArgs = {};
        scnArgs.fillColor = json.fillColor;
        let scn = new Scene(scnArgs);

        let tables = {};
        if (json.tables) {
            for (let t in json.tables) {
                let tbl = json.tables[t];
                tables[t] = new DataTable(tbl.data, tbl.url, tbl.attributeTypes);
                tables[t]._id = tbl.id;
            }
        }
        scn.tables = tables;

        let scales = {};
        if (json.scales) {
            for (let s in json.scales)
                scales[s] = processScale(json.scales[s]);
        }
        scn.scales = scales;

        processGroup(json, scn, scn);

        processLinks(json, scn);

        if (json.encodings) {
            for (let e of json.encodings) {
                scn._addAttributeEncoding(processEncoding(e, scn));
            }
        }

        delete scn.tables;
        delete scn.scales;
        scn._bounds = processBounds(json.bounds);

        return scn;
    }

    function processElement(json, parentObj, scene) {
        //TODO: check if top level element is a scene
        if (json.type === ElementType.Collection) {
            let coll = createCollection(scene);
            parentObj.addChild(coll);
            processGroup(json, coll, scene);
            scene._itemMap[coll.id] = coll;
        } else if (json.type === ElementType.Glyph) {
            let glyph = createGlyph();
            parentObj.addChild(glyph);
            processGroup(json, glyph, scene);
            scene._itemMap[glyph.id] = glyph;
        } else if (json.type === ElementType.Composite) {
            let comp = new Composite();
            parentObj.addChild(comp);
            processGroup(json, comp, scene);
            scene._itemMap[comp.id] = comp;
            comp._bounds = processBounds(json.bounds);
        } else if (Object.values(MarkTypes).includes(json.type)) {
            let mk = processMark(json, scene);
            scene._itemMap[mk.id] = mk;
            parentObj.addChild(mk);
        } else ;
    }

    function processLinks(json, scene) {
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

    function processGroup(json, groupObj, scene) {
        if (json.id)
            groupObj._id = json.id;
        if (json.classId)
            groupObj._classId = json.classId;
        if (json.dataScope)
            groupObj._dataScope = processDataScope(json.dataScope, scene);
        groupObj._bounds = processBounds(json.bounds);
        if (json.layout) {
            groupObj._layout = processLayout(json.layout);
            groupObj._layout.group = groupObj;
        }
        
        groupObj._sortBy = json.sortBy;
        if (json.children) {
            for (let c of json.children) {
                processElement(c, groupObj, scene);
            }
        }
    }

    function processScale(json) {
        let scale = new Scale(json.type, json.args);
        scale._id = json.id;
        scale.domain = json.domain;
        scale.range = json.range;
        return scale;
    }

    function processEncoding(json, scn) {
        let elem = getItem(json.element, json.elementType, scn);
        if (!elem)
            console.warn("element not created:", json.element, json.elementType);

        let enc = new AttributeEncoding(elem, json.channel, json.attr, json.aggregator, json.args);

        if (json.scales) {
            enc._scales = json.scales.map(d => scn.scales[d]);
        }

        if (json.elemGroups) {
            enc._elemGroups = json.elemGroups.map(g => g.map(d => scn._itemMap[d]));
        }

        if (json.elem2scale) {
            enc._elem2scale = {};
            for (let eid in json.elem2scale) {
                enc._elem2scale[eid] = scn.scales[json.elem2scale[eid]];
            }
        }

        if (json.args.startAngle)
            enc.startAngle = json.args.startAngle;

        return enc;
    }

    function getItem(id, type, scn) {
        if (type === "vertex") {
            let tokens = id.split("_v_");
            return scn._itemMap[tokens[0]].vertices.find(d => d._id === parseInt(tokens[1]));
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

    function serializeDataScope(scope) {
        let json = {};
        json.dt = scope._dt.id;
        json.attr2value = Object.assign({}, scope._attr2value);
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
        json.left = layout._left;
        json.top = layout._top;
        json.cellBounds = layout._cellBounds.map(d => d.toJSON());
        json.group = layout.group.id;
        json.grid = layout._grid;
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
        if (mark._dataScope)
            json.dataScope = serializeDataScope(mark._dataScope);
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
            case ElementType.PointText:
                serializePointText(mark, json);
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
        for (let v of mark.vertices)
            json.vertices.push(serializeVertex(v));
        json.vertexCounter = mark.vertexCounter;
    	json.segmentCounter = mark.segmentCounter;
    	//do not save segments, anchor and closed for now
    	json.curveMode = mark.curveMode;
    }

    function serializePointText(mark, json) {
        json.args.x = mark._x;
        json.args.y = mark._y;
        json.args.text = mark._text;
        json.args.anchor = mark._anchor;
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

    function serializeVertex(vertex) {
        let json = {};
        json.type = vertex.type;
        json.id = vertex._id;
        json.x = vertex.x;
        json.y = vertex.y;
        if (vertex._dataScope)
            json.dataScope = serializeDataScope(vertex._dataScope);
        if (vertex._polarAngle !== undefined)
            json.polarAngle = vertex._polarAngle;
        json.shape = vertex.shape;
        json.width = vertex.width;
        json.height = vertex.height;
        json.radius = vertex.radius;
        json.fillColor = vertex.fillColor;
        json.opacity = vertex.opacity;
        json.strokeWidth = vertex.strokeWidth;
        json.strokeColor = vertex.strokeColor;
        return json;
    }

    function serializeElement(elem) {
        if (elem.type === ElementType.Scene) 
            return serializeScene(elem);
        else if (elem instanceof Group)
            return serializeGroup(elem, {});
        // else if (elem.type === ElementType.Collection)
        //     return serializeCollection(elem);
        // else if (elem.type === ElementType.Glyph)
        //     return serializeGlyph(elem);
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
        console.log(json.tables);
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
        json.element = enc._elem.id;
        json.elementType = enc._elem.type;
        if (enc.attrValues)
            json.attrValues = enc.attrValues;
        json.channel = enc._channel;
        json.attr = enc._attribute;
        json.aggregator = enc._aggregator;

        json.args = {};
        json.args.includeZero = enc._includeZero;
        json.args.flipScale = enc._flipScale;
        json.args.mapping = enc._mapping;
        json.args.rangeExtent = enc._preferredRangeExtent;
        json.args.domain = enc._preferredDomain;
        json.args.scaleType = enc._scaleType;
        json.args.scheme = enc._colorScheme;

        //json.args.datatable = enc.datatable.id;
        json.scales = enc._scales.map(d => d.id);
        json.elemGroups = enc._elemGroups.map(g => g.map(d => d.id));
        json.elem2scale = {};
        for (let eid in enc._elem2scale) {
            json.elem2scale[eid] = enc._elem2scale[eid].id;
        }

        json.refElements = enc._refElements.map(d => d.id);

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
        if (group._dataScope)
            json.dataScope = serializeDataScope(group._dataScope);
        // if (group._bounds)
        json.bounds = group.bounds.toJSON();
        if (group._layout)
            json.layout = serializeLayout(group._layout);
        
        json.children = [];
        if (group.children.length > 0) { //&& group.type != ItemType.Axis
            for (let c of group.children) {
                json.children.push(serializeElement(c));
            }
        }
        json.sortBy = group._sortBy;
        return json;
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
            case ElementType.PointText:
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

        let ds1 = g1.dataScope, ds2 = g2.dataScope;

        if (!haveSameKeys(ds1._attr2value, ds2._attr2value))
            return false;

        for (let k in ds1._attr2value) {
            if (ds1._attr2value[k] !== ds2._attr2value[k])
                return false;
        }

        return ds1._dt.id === ds2._dt.id && ds1._tuples.length === ds2._tuples.length;
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

    function scene(args) {
        return new Scene(args);
    }

    async function csv(url) {
        return importCSV(url);
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

    exports.csv = csv;
    exports.deserialize = deserialize;
    exports.graphJSON = graphJSON;
    exports.isEqual = isEqual;
    exports.layout = layout;
    exports.renderer = renderer;
    exports.scene = scene;
    exports.serialize = serialize;
    exports.treeJSON = treeJSON;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
