import { flipObject } from "../util";

//------------------------------------------------------------------------------
// Schema Interfaces
//------------------------------------------------------------------------------

export enum Piece {
  FU = "FU",
  KY = "KY",
  KE = "KE",
  GI = "GI",
  KI = "KI",
  KA = "KA",
  HI = "HI",
  OU = "OU",
  TO = "TO",
  NY = "NY",
  NK = "NK",
  NG = "NG",
  UM = "UM",
  RY = "RY",
}

export enum Color {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export interface ColorPiece {
  color: Color;
  piece: Piece;
}

export type SquareNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Square = [SquareNumber, SquareNumber];

export type Board = Array<null | ColorPiece>;

export interface Hand {
  FU: number;
  KY: number;
  KE: number;
  GI: number;
  KI: number;
  KA: number;
  HI: number;
  OU: number;
}

export interface Hands {
  black: Hand;
  white: Hand;
}

export enum EventType {
  MOVE = "MOVE",
  RESIGN = "RESIGN",
}

export interface CommonEventProps {
  type: EventType;
  time?: Date;
  elapsedTime?: number;
  forks?: EventList;
}

export enum Movement {
  DROPPED = "DROPPED",
  UPWARD = "UPWARD",
  DOWNWARD = "DOWNWARD",
  HORIZONTALLY = "HORIZONTALLY",
  FROM_RIGHT = "FROM_RIGHT",
  FROM_LEFT = "FROM_LEFT",
  VERTICALLY = "VERTICALLY",
}

export interface MoveEvent extends CommonEventProps {
  type: EventType.MOVE;
  color: Color;
  srcSquare?: Square | null;
  srcPiece?: Piece;
  dstSquare?: Square;
  dstPiece?: Piece;
  promote?: boolean;
  sameDstSquare?: boolean;
  movements?: Movement[];
}

export interface ResignEvent extends CommonEventProps {
  type: EventType.RESIGN;
  color: Color;
}

export type Event = MoveEvent | ResignEvent;

export type EventList = Event[];

export interface Player {
  name: string;
}

export interface Players {
  black: Player;
  white: Player;
}

export enum Handicap {
  NONE = "NONE",
  KY = "KY",
  RIGHT_KY = "RIGHT_KY",
  KA = "KA",
  HI = "HI",
  HI_KY = "HI_KY",
  TWO = "TWO",
  THREE = "THREE",
  FOUR = "FOUR",
  FIVE = "FIVE",
  SIX = "SIX",
  SEVEN = "SEVEN",
  EIGHT = "EIGHT",
  NINE = "NINE",
  TEN = "TEN",
}

export interface State {
  hands: Hands;
  board: Board;
  nextTurn: Color;
}

export interface StartingSetup {
  handicap?: Handicap;
  state?: State;
}

export interface Record {
  competition: string;
  location: string;
  startingTime?: Date;
  players?: Players;
  startingSetup: StartingSetup;
  events: EventList;
}

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

export const MIN_SQUARE_NUMBER: SquareNumber = 1;
export const MAX_SQUARE_NUMBER: SquareNumber = 9;

export function getSquareNumbers(): SquareNumber[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

export const SQUARE_NUMBERS = getSquareNumbers();

export const SQUARE_NUMBERS_DESC = getSquareNumbers().reverse();

export function getEmptyBoard(): Board {
  return Array(81).fill(null);
}

export const EMPTY_BOARD = getEmptyBoard();

export function getHirateBoard(): Board {
  return [
    { color: Color.WHITE, piece: Piece.KY },
    { color: Color.WHITE, piece: Piece.KE },
    { color: Color.WHITE, piece: Piece.GI },
    { color: Color.WHITE, piece: Piece.KI },
    { color: Color.WHITE, piece: Piece.OU },
    { color: Color.WHITE, piece: Piece.KI },
    { color: Color.WHITE, piece: Piece.GI },
    { color: Color.WHITE, piece: Piece.KE },
    { color: Color.WHITE, piece: Piece.KY },

    null,
    { color: Color.WHITE, piece: Piece.HI },
    null, null, null, null, null,
    { color: Color.WHITE, piece: Piece.KA },
    null,

    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },
    { color: Color.WHITE, piece: Piece.FU },

    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,

    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },
    { color: Color.BLACK, piece: Piece.FU },

    null,
    { color: Color.BLACK, piece: Piece.KA },
    null, null, null, null, null,
    { color: Color.BLACK, piece: Piece.HI },
    null,

    { color: Color.BLACK, piece: Piece.KY },
    { color: Color.BLACK, piece: Piece.KE },
    { color: Color.BLACK, piece: Piece.GI },
    { color: Color.BLACK, piece: Piece.KI },
    { color: Color.BLACK, piece: Piece.OU },
    { color: Color.BLACK, piece: Piece.KI },
    { color: Color.BLACK, piece: Piece.GI },
    { color: Color.BLACK, piece: Piece.KE },
    { color: Color.BLACK, piece: Piece.KY },
  ];
}

export const HIRATE_BOARD = getHirateBoard();

export function getEmptyHand(): Hand {
  return {
    FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0,
  };
}

export const EMPTY_HAND = getEmptyHand();

export function getEmptyHands(): Hands {
  return {
    black: getEmptyHand(),
    white: getEmptyHand(),
  };
}

export const EMPTY_HANDS = getEmptyHands();

export function getHirateState(): State {
  return {
    board: getHirateBoard(),
    hands: getEmptyHands(),
    nextTurn: Color.BLACK,
  };
}

export const HIRATE_STATE = getHirateState();

//------------------------------------------------------------------------------
// Methods
//------------------------------------------------------------------------------

const PROMOTE_MAP: {
  [piece: string]: Piece;
} = {
  [Piece.FU]: Piece.TO,
  [Piece.KY]: Piece.NY,
  [Piece.KE]: Piece.NK,
  [Piece.GI]: Piece.NG,
  [Piece.KA]: Piece.UM,
  [Piece.HI]: Piece.RY,
};

const DEMOTE_MAP: {
  [piece: string]: Piece;
} = flipObject(PROMOTE_MAP);

export function promote(piece: Piece, alt?: Piece): Piece | undefined {
  return PROMOTE_MAP[piece] || alt;
}

export function demote(piece: Piece, alt?: Piece): Piece | undefined {
  return DEMOTE_MAP[piece] || alt;
}

export function canPromote(piece: Piece) {
  return promote(piece) !== undefined;
}

export function isPromoted(piece: Piece) {
  return demote(piece) !== undefined;
}

export function flipPiece(piece: Piece, alt?: Piece) {
  return promote(piece) || demote(piece) || alt;
}

// === Color Methods ===

export function flipColor(color: Color) {
  return color === Color.BLACK ? Color.WHITE : Color.BLACK;
}

// === ColorPiece Methods ===

export function colorPieceEquals(cp1: ColorPiece, cp2: ColorPiece) {
  return cp1.color === cp2.color && cp1.piece === cp2.piece;
}

// === Square Methods ===

export function squareToBoardIndex(sq: Square) {
  return (9 - sq[0]) + (sq[1] - 1) * 9;
}

export function boardIndexToSquare(boardIndex: number): Square {
  const x = 9 - boardIndex % 9;
  return [x, Math.floor((boardIndex - (9 - x)) / 9) + 1] as Square;
}

export function cloneSquare(sq: Square): Square {
  return [sq[0], sq[1]];
}

export function isSquareNumber(n: number): n is SquareNumber {
  return MIN_SQUARE_NUMBER <= n && n <= MAX_SQUARE_NUMBER;
}

export function isSquare(sqLike: number[]): sqLike is Square {
  return sqLike.length === 2 && isSquareNumber(sqLike[0]) && isSquareNumber(sqLike[1]);
}

export function flipSquare(sq: Square) {
  return [MAX_SQUARE_NUMBER - sq[0] + 1, MAX_SQUARE_NUMBER - sq[1] + 1] as Square;
}

export function squareEquals(sq1: Square, sq2: Square) {
  return sq1[0] === sq2[0] && sq1[1] === sq2[1];
}

// === Board Methods ===

export function getBoardSquare(board: Board, sq: Square) {
  return board[squareToBoardIndex(sq)];
}

export function forEachBoardSquare(board: Board, cb: (cp: ColorPiece | null, sq: Square) => any) {
  for (const y of SQUARE_NUMBERS) {
    for (const x of SQUARE_NUMBERS) {
      const sq = [x, y] as Square;
      const cp = board[squareToBoardIndex(sq)];
      if (cb(cp, sq) === false) {
        return;
      }
    }
  }
}

export function findBoardSquare(board: Board, cond: (cp: ColorPiece | null, sq: Square) => boolean): [ColorPiece | null, Square] | null {
  let r: [ColorPiece | null, Square] | null = null;
  forEachBoardSquare(board, (cp, sq) => {
    if (cond(cp, sq)) {
      r = [cp, sq];
    }
  });
  return r;
}

export function filterBoardSquare(board: Board, cond: (cp: ColorPiece | null, sq: Square) => boolean): Array<[ColorPiece | null, Square]> {
  const r: Array<[ColorPiece | null, Square]> = [];
  forEachBoardSquare(board, (cp, sq) => {
    if (cond(cp, sq)) {
      r.push([cp, sq]);
    }
  });
  return r;
}

export function setBoardSquare(board: Board, sq: Square, cp: ColorPiece | null) {
  board[squareToBoardIndex(sq)] = cp;
}

export function cloneBoard(board: Board): Board {
  return [...board];
}

// === Hand(s) Methods ===

export function pieceToKeyOfHand(piece: Piece) {
  return piece as keyof Hand;
}

export function getNumPieces(hand: Hand, piece: Piece): number {
  return hand[pieceToKeyOfHand(piece)];
}

export function addNumPieces(hand: Hand, piece: Piece, delta: number) {
  hand[pieceToKeyOfHand(piece)] += delta;
}

export function colorToKeyOfHands(color: Color) {
  return color.toLowerCase() as keyof Hands;
}

export function getHand(hands: Hands, color: Color): Hand {
  return hands[colorToKeyOfHands(color)];
}

export function cloneHand(hand: Hand): Hand {
  return { ...hand };
}

export function cloneHands(hand: Hands): Hands {
  return {
    black: cloneHand(hand.black),
    white: cloneHand(hand.white),
  };
}

// === State Methods ===

export function cloneState(state: State): State {
  return {
    board: cloneBoard(state.board),
    hands: cloneHands(state.hands),
    nextTurn: state.nextTurn,
  };
}

// === Event Methods ===

export function cloneEvent(event: Event): Event {
  return { ...event };
}
