import { Color, Piece, SquareNumber, Board, Hand, Hands, State } from "./definitions";

export const MIN_SQUARE_NUMBER: SquareNumber = 1;
export const MAX_SQUARE_NUMBER: SquareNumber = 9;

export function getSquareNumbers(): SquareNumber[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

export const SQUARE_NUMBERS = getSquareNumbers();

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
