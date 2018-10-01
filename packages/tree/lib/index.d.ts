import { Draft } from "immer";
export declare type Value<T> = Draft<T>;
export interface Tree<T> {
    values: T[];
    forks: Forks<T>;
}
export interface Forks<T> {
    [depth: number]: Tree<T>[] | undefined;
}
export interface PathPoint {
    depth: number;
    forkIndex: number;
}
export interface Path {
    points: PathPoint[];
    depth: number;
}
export declare const ROOT_PATH: Path;
export interface Node<T> {
    tree: Tree<T>;
    path: Path;
}
export declare function newTree<T>(v: T): Tree<T>;
export declare function newForks<T>(): Forks<T>;
export declare function newRootNode<T>(v: T): Node<T>;
export declare function isRootPath(path: Path): boolean;
export declare function getForkTree<T>(tree: Tree<T>, p: PathPoint): Tree<T>;
export declare function getLastForkTree<T>(tree: Tree<T>, path: Path): Tree<T>;
export declare function getValue<T>(tree: Tree<T>, node: Node<T>): T;
export declare function getLeafNode<T>(tree: Tree<T>, points: PathPoint[]): {
    tree: Tree<T>;
    path: {
        points: PathPoint[];
        depth: number;
    };
};
export declare function isRootNode<T>(node: Node<T>): boolean;
export declare function isLeafNode<T>(node: Node<T>): boolean;
export declare function getChildNodes<T>(node: Node<T>): Node<T>[];
export declare function appendChild<T>(node: Node<T>, value: Value<T>): Node<T>;
export interface WalkOptions {
    limit?: number;
    trace?: (i: number, path: Path) => void;
}
export declare const DEFAULT_WALK_OPTIONS: {
    limit: number;
};
export declare type WalkDirector<T> = (node: Node<T>, i: number) => Node<T> | undefined;
export declare function walk<T>(node: Node<T>, director: WalkDirector<T>, opts?: WalkOptions): void;
export declare type Predicate<T> = (node: Node<T>, i: number) => boolean;
export declare type PredicableWalkDirector<T> = (pred: Predicate<T>) => WalkDirector<T>;
export declare const towardsParent: <T>(pred: Predicate<T>) => WalkDirector<T>;
export declare const towardsChild: <T>(points?: PathPoint[] | undefined) => PredicableWalkDirector<T>;
export declare function findNode<T>(node: Node<T>, director: PredicableWalkDirector<T>, pred: Predicate<T>, opts?: WalkOptions): Node<T> | undefined;
export declare function findParentNode<T>(node: Node<T>, pred: Predicate<T>, opts?: WalkOptions): Node<T> | undefined;
export declare function findChildNode<T>(node: Node<T>, pred: Predicate<T>, points?: PathPoint[], opts?: WalkOptions): Node<T> | undefined;
export declare function getParentNode<T>(node: Node<T>): Node<T> | undefined;
export declare function getSiblings<T>(node: Node<T>): Node<T>[];
export declare function filter<T>(node: Node<T>, director: PredicableWalkDirector<T>, pred: Predicate<T>, opts?: WalkOptions): Node<T>[];
export declare class NodeWrapper<T> {
    node: Node<T>;
    currentTree: Tree<T>;
    static from<T>(node: Node<T>): NodeWrapper<T>;
    constructor(node: Node<T>);
    readonly path: Path;
    readonly value: T;
    readonly isRoot: boolean;
    readonly parent: NodeWrapper<T> | undefined;
    readonly children: NodeWrapper<T>[];
    readonly siblings: NodeWrapper<T>[];
}
