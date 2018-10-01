"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = __importDefault(require("immer"));
exports.ROOT_PATH = Object.freeze({ points: [], depth: 0 });
//---
function newTree(v) {
    return { values: [v], forks: newForks() };
}
exports.newTree = newTree;
function newForks() {
    return {};
}
exports.newForks = newForks;
function newRootNode(v) {
    return { tree: newTree(v), path: exports.ROOT_PATH };
}
exports.newRootNode = newRootNode;
function isRootPath(path) {
    return path.points.length === 0 && path.depth === 0;
}
exports.isRootPath = isRootPath;
function getForkTree(tree, p) {
    const trees = tree.forks[p.depth];
    if (!trees) {
        throw new Error("fork not found");
    }
    return trees[p.forkIndex];
}
exports.getForkTree = getForkTree;
function getLastForkTree(tree, path) {
    let t = tree;
    for (const p of path.points) {
        t = getForkTree(t, p);
    }
    return t;
}
exports.getLastForkTree = getLastForkTree;
function getValue(tree, node) {
    const t = getLastForkTree(node.tree, node.path);
    if (node.path.depth >= t.values.length) {
        throw new Error("value not found");
    }
    return t.values[node.path.depth];
}
exports.getValue = getValue;
function getLeafNode(tree, points) {
    const t = getLastForkTree(tree, { points, depth: 0 });
    return { tree: t, path: { points, depth: t.values.length - 1 } };
}
exports.getLeafNode = getLeafNode;
function isRootNode(node) {
    return isRootPath(node.path);
}
exports.isRootNode = isRootNode;
//! @note Forks from leaf node were not checked.
function isLeafNode(node) {
    const t = getLastForkTree(node.tree, node.path);
    return node.path.depth === t.values.length - 1;
}
exports.isLeafNode = isLeafNode;
function getChildNodes(node) {
    const r = [];
    const nextDepth = node.path.depth + 1;
    if (nextDepth < node.tree.values.length) {
        r.push({
            tree: node.tree,
            path: { points: node.path.points, depth: nextDepth },
        });
    }
    const forkTrees = node.tree.forks[nextDepth];
    if (forkTrees) {
        for (let i = 0; i < forkTrees.length; i++) {
            r.push({
                tree: node.tree,
                path: {
                    points: [...node.path.points, { depth: nextDepth, forkIndex: i }],
                    depth: 0,
                },
            });
        }
    }
    return r;
}
exports.getChildNodes = getChildNodes;
function appendChild(node, value) {
    return immer_1.default(node, draft => {
        const t = getLastForkTree(draft.tree, draft.path);
        const nextDepth = draft.path.depth + 1;
        if (nextDepth === t.values.length) {
            t.values.push(value);
            draft.path.depth++;
            return;
        }
        if (!t.forks[nextDepth]) {
            t.forks[nextDepth] = [];
        }
        const ts = t.forks[nextDepth];
        draft.path.points.push({
            depth: nextDepth,
            forkIndex: ts ? ts.length : 0,
        });
        ts.push(newTree(value));
    });
}
exports.appendChild = appendChild;
exports.DEFAULT_WALK_OPTIONS = {
    limit: 1000000,
};
function walk(node, director, opts) {
    const limit = (opts && opts.limit) || exports.DEFAULT_WALK_OPTIONS.limit;
    let next = node;
    for (let i = 0; i < limit; i++) {
        if (opts && opts.trace) {
            opts.trace(i, next.path);
        }
        next = director(next, i);
        if (!next) {
            break;
        }
    }
}
exports.walk = walk;
exports.towardsParent /* : <T> PredicableWalkDirector<T> */ = (pred) => (node, i) => {
    if (!pred(node, i)) {
        return;
    }
    const depth = node.path.depth - 1;
    if (depth >= 0) {
        return {
            tree: node.tree,
            path: { points: node.path.points, depth },
        };
    }
    if (node.path.points.length === 0) {
        return; // root
    }
    const points = node.path.points.slice(0, node.path.points.length - 1);
    const path = { points, depth: 0 };
    const t = getLastForkTree(node.tree, path);
    path.depth = t.values.length - 1;
    return { tree: node.tree, path };
};
exports.towardsChild = (points) => pred => (node, i) => {
    if (!pred(node, i)) {
        return;
    }
    const depth = node.path.depth + 1;
    if (points) {
        const point = points[node.path.points.length];
        if (depth === point.depth) {
            return {
                tree: node.tree,
                path: {
                    points: [...node.path.points, point],
                    depth: 0,
                },
            };
        }
    }
    return {
        tree: node.tree,
        path: { points: node.path.points, depth },
    };
};
function findNode(node, director, pred, opts) {
    let r;
    walk(node, director((node, i) => {
        if (pred(node, i)) {
            r = node;
            return false;
        }
        return true;
    }), opts);
    return r;
}
exports.findNode = findNode;
function findParentNode(node, pred, opts) {
    return findNode(node, exports.towardsParent, pred, opts);
}
exports.findParentNode = findParentNode;
function findChildNode(node, pred, points, opts) {
    return findNode(node, exports.towardsChild(points), pred, opts);
}
exports.findChildNode = findChildNode;
function getParentNode(node) {
    return findParentNode(node, (node, i) => i === 1);
}
exports.getParentNode = getParentNode;
function getSiblings(node) {
    const n = getParentNode(node);
    return n ? getChildNodes(n) : [];
}
exports.getSiblings = getSiblings;
function filter(node, director, pred, opts) {
    const r = [];
    walk(node, director((node, i) => {
        if (pred(node, i)) {
            r.push(node);
        }
        return true;
    }), opts);
    return r;
}
exports.filter = filter;
//---
//! experimental
class NodeWrapper {
    constructor(node) {
        this.node = node;
        this.currentTree = getLastForkTree(node.tree, node.path);
    }
    static from(node) {
        return new NodeWrapper(node);
    }
    get path() {
        return this.node.path;
    }
    get value() {
        return this.currentTree.values[this.path.depth];
    }
    get isRoot() {
        return isRootPath(this.path);
    }
    get parent() {
        const n = getParentNode(this.node);
        return n && new NodeWrapper(n);
    }
    get children() {
        return getChildNodes(this.node).map(node => new NodeWrapper(node));
    }
    get siblings() {
        return getSiblings(this.node).map(node => new NodeWrapper(node));
    }
}
exports.NodeWrapper = NodeWrapper;
//# sourceMappingURL=index.js.map