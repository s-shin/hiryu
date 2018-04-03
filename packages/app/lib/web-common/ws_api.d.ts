/**
 * Definitions of API via WebSocket.
 */
import * as usi from "@hiryu/usi";
export interface CommonResponse {
    error?: {
        reason: string;
    };
}
export declare enum Name {
    REQ_NEW_GAME = "usi_api:req:new_game",
    REQ_SET_GAME_STATE = "usi_api:req:set_game_state",
    REQ_GO = "usi_api:req:go",
    REQ_STOP = "usi_api:req:stop",
    NOTI_INFO = "usi_api:noti:info",
    NOTI_BEST_MOVE = "usi_api:noti:best_move",
    NOTI_ERROR = "usi_api:noti:error",
}
export interface NewGameRequest {
    engine: string;
}
export declare type NewGameResponse = CommonResponse;
export interface SetGameStateRequest {
    state: string;
    moves: string;
}
export declare type SetGameStateResponse = CommonResponse;
export interface GoRequest {
    options: usi.GoOptions;
}
export declare type GoResponse = CommonResponse;
export declare type StopRequest = undefined;
export declare type StopResponse = CommonResponse;
export interface InfoNotification {
    info: usi.Info;
}
export interface BestMoveNotification {
    move: usi.BestMove;
}
export interface ErrorNotification {
    error: Error;
}
