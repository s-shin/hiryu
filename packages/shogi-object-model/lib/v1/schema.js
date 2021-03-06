"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
exports.default = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://s-shin.github.com/hiryu/packages/shogi-object-model/schema/v1#",
    "$comment": "## 備考\n\n* objectのnullableなpropertyをどうするか。\n    * 1) requiredの有無だけで表現する\n        * nullを表現したい場合、フィールド自体をomitする必要がある。\n        * `null値` と `property自体が無いこと (undefined)` の区別をするべきか否か。\n    * 2) oneOfで `type: \"null\"` する\n        * schemaは若干複雑になる。\n        * requiredにするか否か\n          * ケースバイケースか。\n          * null相当の判定を `フィールド無し or (フィールド有り and null値)`\n            とする必要が出てきたときの冗長感。\n              * とはいえ (フィールドが無い時の) デフォルト値がnullだったと考えれば、\n                さほど不自然でもない。\n    * → 一定決めの問題なので、シンプルさを優先し、ひとまずは 1) で様子見。\n* Boardのindexについて\n    * 盤上左上からなのは、テキスト等で表現しやすい順であるため。\n* MoveEventについて\n    * 既に世にある一般的なMove表現をできる最低限の情報を含むポリシー\n        * 一般的なMove表現の例: USI, CSA, KIF, KI2, 日本語棋譜表記, etc.\n    * Movementは、実質、日本語棋譜表記のためのもの。\n        * Stateと照らし合わせて判定しないと導出できない属性のみ含む。\n        * 言い換えれば、MoveEventのpropertyから導出できる属性は含まない。\n            * ex. 成/不成 (srcPiece, dstPieceから導出可能)\n            * DROPPEDは、公式の棋譜記載ルールでは、原則、\n              必要な場合のみ「打」を書くことになっているので用意。",
    "definitions": {
        "Piece": {
            "type": "string",
            "enum": [
                "FU",
                "KY",
                "KE",
                "GI",
                "KI",
                "KA",
                "HI",
                "OU",
                "TO",
                "NY",
                "NK",
                "NG",
                "UM",
                "RY"
            ]
        },
        "Color": {
            "type": "string",
            "enum": [
                "BLACK",
                "WHITE"
            ]
        },
        "ColorPiece": {
            "type": "object",
            "properties": {
                "color": {
                    "$ref": "#/definitions/Color"
                },
                "piece": {
                    "$ref": "#/definitions/Piece"
                }
            },
            "required": [
                "color",
                "piece"
            ],
            "additionalProperties": false
        },
        "SquareNumber": {
            "type": "integer",
            "enum": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ]
        },
        "Square": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/SquareNumber"
            },
            "minItems": 2,
            "maxItems": 2
        },
        "Board": {
            "description": "```\nindex = (9 - square.x) + (square.y - 1) * 9\nsquare.x = 9 - index % 9\nsquare.y = (index - (9 - square.x)) / 9 + 1\n\n$ for y in {1..9}; do for x in {9..1}; do printf \"%2d=%d%d \" $(((9 - $x) + 9 * ($y - 1))) $x $y; done; echo; done\n 0=91  1=81  2=71  3=61  4=51  5=41  6=31  7=21  8=11\n 9=92 10=82 11=72 12=62 13=52 14=42 15=32 16=22 17=12\n18=93 19=83 20=73 21=63 22=53 23=43 24=33 25=23 26=13\n27=94 28=84 29=74 30=64 31=54 32=44 33=34 34=24 35=14\n36=95 37=85 38=75 39=65 40=55 41=45 42=35 43=25 44=15\n45=96 46=86 47=76 48=66 49=56 50=46 51=36 52=26 53=16\n54=97 55=87 56=77 57=67 58=57 59=47 60=37 61=27 62=17\n63=98 64=88 65=78 66=68 67=58 68=48 69=38 70=28 71=18\n72=99 73=89 74=79 75=69 76=59 77=49 78=39 79=29 80=19\n```",
            "type": "array",
            "items": {
                "oneOf": [
                    {
                        "type": "null"
                    },
                    {
                        "$ref": "#/definitions/ColorPiece"
                    }
                ]
            },
            "minItems": 81,
            "maxItems": 81
        },
        "Hand": {
            "type": "object",
            "properties": {
                "FU": {
                    "type": "integer",
                    "minimum": 0
                },
                "KY": {
                    "type": "integer",
                    "minimum": 0
                },
                "KE": {
                    "type": "integer",
                    "minimum": 0
                },
                "GI": {
                    "type": "integer",
                    "minimum": 0
                },
                "KI": {
                    "type": "integer",
                    "minimum": 0
                },
                "KA": {
                    "type": "integer",
                    "minimum": 0
                },
                "HI": {
                    "type": "integer",
                    "minimum": 0
                },
                "OU": {
                    "type": "integer",
                    "minimum": 0
                }
            },
            "required": [
                "FU",
                "KY",
                "KE",
                "GI",
                "KI",
                "KA",
                "HI",
                "OU"
            ],
            "additionalProperties": false
        },
        "Hands": {
            "type": "object",
            "properties": {
                "black": {
                    "$ref": "#/definitions/Hand"
                },
                "white": {
                    "$ref": "#/definitions/Hand"
                }
            },
            "required": [
                "black",
                "white"
            ],
            "additionalProperties": false
        },
        "Movement": {
            "$comment": "See https://www.shogi.or.jp/faq/kihuhyouki.html.\nNOTE: Both \"行\" and \"入\" had been no longer used.",
            "type": "string",
            "enum": [
                "DROPPED",
                "UPWARD",
                "DOWNWARD",
                "HORIZONTALLY",
                "FROM_RIGHT",
                "FROM_LEFT",
                "VERTICALLY"
            ]
        },
        "EventType": {
            "type": "string",
            "enum": [
                "MOVE",
                "RESIGN"
            ]
        },
        "CommonEventProps": {
            "type": "object",
            "properties": {
                "type": {
                    "$comment": "should be overriden",
                    "$ref": "#/definitions/EventType"
                },
                "time": {
                    "type": "string",
                    "format": "date-time"
                },
                "elapsedTime": {
                    "description": "seconds",
                    "type": "number",
                    "minimum": 0
                },
                "forks": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/EventList"
                    },
                    "minItems": 0
                }
            },
            "required": [
                "type"
            ]
        },
        "MoveEvent": {
            "$comment": "This object includes the properties to represent the notation of USI at least.",
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "const": "MOVE"
                },
                "color": {
                    "$ref": "#/definitions/Color"
                },
                "srcSquare": {
                    "oneOf": [
                        {
                            "$ref": "#/definitions/Square"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "srcPiece": {
                    "$ref": "#/definitions/Piece"
                },
                "dstSquare": {
                    "$ref": "#/definitions/Square"
                },
                "dstPiece": {
                    "$ref": "#/definitions/Piece"
                },
                "sameDstSquare": {
                    "type": "boolean"
                },
                "promote": {
                    "type": "boolean"
                },
                "movements": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Movement"
                    },
                    "uniqueItems": true
                }
            },
            "allOf": [
                {
                    "$ref": "#/definitions/CommonEventProps"
                }
            ],
            "required": [
                "color"
            ],
            "additionalProperties": false
        },
        "ResignEvent": {
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/definitions/CommonEventProps"
                }
            ],
            "properties": {
                "type": {
                    "type": "string",
                    "const": "RESIGN"
                },
                "color": {
                    "$ref": "#/definitions/Color"
                }
            },
            "required": [
                "color"
            ],
            "additionalProperties": false
        },
        "Event": {
            "oneOf": [
                {
                    "$ref": "#/definitions/MoveEvent"
                },
                {
                    "$ref": "#/definitions/ResignEvent"
                }
            ]
        },
        "EventList": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Event"
            }
        },
        "Player": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            },
            "required": [
                "name"
            ]
        },
        "Players": {
            "type": "object",
            "properties": {
                "black": {
                    "$ref": "#/definitions/Player"
                },
                "white": {
                    "$ref": "#/definitions/Player"
                }
            },
            "required": [
                "black",
                "white"
            ],
            "additionalProperties": false
        },
        "Handicap": {
            "type": "string",
            "enum": [
                "NONE",
                "KY",
                "RIGHT_KY",
                "KA",
                "HI",
                "HI_KY",
                "TWO",
                "THREE",
                "FOUR",
                "FIVE",
                "SIX",
                "SEVEN",
                "EIGHT",
                "NINE",
                "TEN"
            ]
        },
        "State": {
            "type": "object",
            "properties": {
                "hands": {
                    "$ref": "#/definitions/Hands"
                },
                "board": {
                    "$ref": "#/definitions/Board"
                },
                "nextTurn": {
                    "$ref": "#/definitions/Color"
                }
            },
            "required": [
                "hands",
                "board",
                "nextTurn"
            ],
            "additionalProperties": false
        },
        "StartingSetup": {
            "type": "object",
            "properties": {
                "handicap": {
                    "$ref": "#/definitions/Handicap"
                },
                "state": {
                    "$ref": "#/definitions/State"
                }
            },
            "minProperties": 1,
            "maxProperties": 1,
            "additionalProperties": false
        },
        "Record": {
            "type": "object",
            "properties": {
                "competition": {
                    "type": "string"
                },
                "location": {
                    "type": "string"
                },
                "startingTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "players": {
                    "$ref": "#/definitions/Players"
                },
                "startingSetup": {
                    "$ref": "#/definitions/StartingSetup"
                },
                "events": {
                    "$ref": "#/definitions/EventList"
                }
            },
            "required": [
                "setup",
                "events"
            ]
        },
        "RecordFile": {
            "type": "object",
            "properties": {
                "version": {
                    "type": "string",
                    "const": "v1"
                },
                "record": {
                    "$ref": "#/definitions/Record"
                }
            },
            "required": [
                "version",
                "record"
            ]
        }
    }
};
//# sourceMappingURL=schema.js.map