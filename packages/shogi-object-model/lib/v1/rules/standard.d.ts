import { Square, Color, Piece, ColorPiece, Board, State, Event } from "../definitions";
import { DeepReadonly } from "../../util";
export declare enum Violation {
    ALREADY_RESIGNED = 0,
    INVALID_MOVE_EVENT = 1,
    BAD_TURN = 2,
    NOT_DROPPABLE_PIECE = 3,
    NO_PIECE_TO_BE_DROPPED = 4,
    NOT_MOVABLE_DROPPED_PIECE = 5,
    PIECE_EXISTS = 6,
    UCHIFUZUME = 7,
    NIFU = 8,
    NOT_MOVABLE_PIECE_TO_SQUARE = 9,
    NO_PIECE_TO_BE_MOVED = 10,
    NO_SPECIFIED_PIECE_ON_BOARD = 11
}
export interface GameNode {
    state: State;
    moveNum: number;
    byEvent?: Event;
    violations: Violation[];
    children: GameNode[];
    parent?: GameNode;
}
export declare function newRootGameNode(state?: State, moveNum?: number): GameNode;
export declare function applyEvent(node: DeepReadonly<GameNode>, event: DeepReadonly<Event>): GameNode;
export declare function isDroppablePiece(piece: Piece): boolean;
export declare function isInPromortableArea(sq: Square, color: Color): boolean;
export declare function isNeverMovable(sq: Square, color: Color, piece: Piece): boolean;
export interface MoveCandidate {
    dst: Square;
    promote: boolean;
}
export declare function searchMoveCandidates(board: Board, src: Square): MoveCandidate[];
export declare function canDrop(cp: ColorPiece, board: Board, dst: Square): boolean;
export interface DropCandidate {
    dst: Square;
}
export declare function searchDropCandidates(board: Board, cp: ColorPiece): DropCandidate[];
