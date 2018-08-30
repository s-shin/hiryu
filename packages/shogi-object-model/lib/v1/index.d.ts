export declare const schema: {
    "$schema": string;
    "$id": string;
    "$comment": string;
    "definitions": {
        "Piece": {
            "type": string;
            "enum": string[];
        };
        "Color": {
            "type": string;
            "enum": string[];
        };
        "ColorPiece": {
            "type": string;
            "properties": {
                "color": {
                    "$ref": string;
                };
                "piece": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "SquareNumber": {
            "type": string;
            "enum": number[];
        };
        "Square": {
            "type": string;
            "items": {
                "$ref": string;
            };
            "minItems": number;
            "maxItems": number;
        };
        "Board": {
            "description": string;
            "type": string;
            "items": {
                "oneOf": ({
                    "type": string;
                    "$ref"?: undefined;
                } | {
                    "$ref": string;
                    "type"?: undefined;
                })[];
            };
            "minItems": number;
            "maxItems": number;
        };
        "Hand": {
            "type": string;
            "properties": {
                "FU": {
                    "type": string;
                    "minimum": number;
                };
                "KY": {
                    "type": string;
                    "minimum": number;
                };
                "KE": {
                    "type": string;
                    "minimum": number;
                };
                "GI": {
                    "type": string;
                    "minimum": number;
                };
                "KI": {
                    "type": string;
                    "minimum": number;
                };
                "KA": {
                    "type": string;
                    "minimum": number;
                };
                "HI": {
                    "type": string;
                    "minimum": number;
                };
                "OU": {
                    "type": string;
                    "minimum": number;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "Hands": {
            "type": string;
            "properties": {
                "black": {
                    "$ref": string;
                };
                "white": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "Movement": {
            "$comment": string;
            "type": string;
            "enum": string[];
        };
        "EventType": {
            "type": string;
            "enum": string[];
        };
        "CommonEventProps": {
            "type": string;
            "properties": {
                "type": {
                    "$comment": string;
                    "$ref": string;
                };
                "time": {
                    "type": string;
                    "format": string;
                };
                "elapsedTime": {
                    "description": string;
                    "type": string;
                    "minimum": number;
                };
                "forks": {
                    "type": string;
                    "items": {
                        "$ref": string;
                    };
                    "minItems": number;
                };
            };
            "required": string[];
        };
        "MoveEvent": {
            "$comment": string;
            "type": string;
            "properties": {
                "type": {
                    "type": string;
                    "const": string;
                };
                "color": {
                    "$ref": string;
                };
                "srcSquare": {
                    "$ref": string;
                };
                "srcPiece": {
                    "$ref": string;
                };
                "dstSquare": {
                    "$ref": string;
                };
                "dstPiece": {
                    "$ref": string;
                };
                "sameDstSquare": {
                    "type": string;
                };
                "promote": {
                    "type": string;
                };
                "movements": {
                    "type": string;
                    "items": {
                        "$ref": string;
                    };
                    "uniqueItems": boolean;
                };
            };
            "allOf": {
                "$ref": string;
            }[];
            "required": string[];
            "additionalProperties": boolean;
        };
        "ResignEvent": {
            "type": string;
            "allOf": {
                "$ref": string;
            }[];
            "properties": {
                "type": {
                    "type": string;
                    "const": string;
                };
                "color": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "Event": {
            "oneOf": {
                "$ref": string;
            }[];
        };
        "EventList": {
            "type": string;
            "items": {
                "$ref": string;
            };
        };
        "Player": {
            "type": string;
            "properties": {
                "name": {
                    "type": string;
                };
            };
            "required": string[];
        };
        "Players": {
            "type": string;
            "properties": {
                "black": {
                    "$ref": string;
                };
                "white": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "Handicap": {
            "type": string;
            "enum": string[];
        };
        "State": {
            "type": string;
            "properties": {
                "hands": {
                    "$ref": string;
                };
                "board": {
                    "$ref": string;
                };
                "nextTurn": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "StartingSetup": {
            "type": string;
            "properties": {
                "handicap": {
                    "$ref": string;
                };
                "state": {
                    "$ref": string;
                };
            };
            "minProperties": number;
            "maxProperties": number;
            "additionalProperties": boolean;
        };
        "Record": {
            "type": string;
            "properties": {
                "competition": {
                    "type": string;
                };
                "location": {
                    "type": string;
                };
                "startingTime": {
                    "type": string;
                    "format": string;
                };
                "players": {
                    "$ref": string;
                };
                "startingSetup": {
                    "$ref": string;
                };
                "events": {
                    "$ref": string;
                };
            };
            "required": string[];
        };
        "RecordFile": {
            "type": string;
            "properties": {
                "schema": {
                    "type": string;
                    "const": string;
                };
                "record": {
                    "$ref": string;
                };
            };
            "required": string[];
        };
    };
};
export * from "./definitions";
export * from "./definitions2";
import * as rules from "./rules";
export { rules };
