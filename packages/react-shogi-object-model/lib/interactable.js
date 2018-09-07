"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const som = __importStar(require("@hiryu/shogi-object-model"));
const entities_1 = require("./entities");
function interactable(WrappedComponent) {
    return class InteractableGame extends react_1.default.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            return (react_1.default.createElement("div", { onClick: () => !this.state.promotionSelector && this.setActiveGameObject() },
                react_1.default.createElement(WrappedComponent, { state: this.props.gameNode.state, activeGameObject: this.state.activeGameObject, promotionSelector: this.state.promotionSelector, onClickGameObject: obj => this.updateActiveGameObject(obj) })));
        }
        setActiveGameObject(obj) {
            this.setState(Object.assign({}, this.state, { activeGameObject: obj }));
        }
        resetActivatedState() {
            this.setState(Object.assign({}, this.state, { activeGameObject: undefined, promotionSelector: undefined }));
        }
        updateActiveGameObject(obj) {
            // accept no object in selecting promotion options
            if (this.state.promotionSelector) {
                return;
            }
            const gameNode = this.props.gameNode;
            const prev = this.state.activeGameObject;
            if (prev) {
                switch (prev.type) {
                    case entities_1.GameObjectType.BOARD_SQUARE: {
                        switch (obj.type) {
                            case entities_1.GameObjectType.BOARD_SQUARE: {
                                if (som.squareEquals(prev.square, obj.square)) {
                                    return this.resetActivatedState();
                                }
                                const move = (promote) => {
                                    this.props.onMoveEvent(som.newMoveEvent(gameNode.state.nextTurn, prev.square, obj.square, promote));
                                    return this.resetActivatedState();
                                };
                                const mcs = som.rules.standard.searchMoveCandidates(gameNode.state.board, prev.square)
                                    .filter(mc => som.squareEquals(mc.dst, obj.square));
                                const isPromotionSelectable = mcs.length === 2;
                                if (isPromotionSelectable) {
                                    const cp = som.getBoardSquare(gameNode.state.board, prev.square);
                                    this.setState(Object.assign({}, this.state, { promotionSelector: {
                                            piece: cp.piece,
                                            dstSquare: obj.square,
                                            onSelect(promote) {
                                                move(promote);
                                            },
                                        } }));
                                    return;
                                }
                                const maybeMovable = mcs.length > 0;
                                if (maybeMovable) {
                                    move(mcs[0].promote);
                                }
                                break;
                            }
                            case entities_1.GameObjectType.HAND_PIECE: {
                                break;
                            }
                        }
                        break;
                    }
                    case entities_1.GameObjectType.HAND_PIECE: {
                        switch (obj.type) {
                            case entities_1.GameObjectType.BOARD_SQUARE: {
                                this.props.onMoveEvent(som.newDropEvent(gameNode.state.nextTurn, prev.piece, obj.square));
                                return this.resetActivatedState();
                            }
                            case entities_1.GameObjectType.HAND_PIECE: {
                                if (prev.piece === obj.piece) {
                                    return this.resetActivatedState();
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            switch (obj.type) {
                case entities_1.GameObjectType.BOARD_SQUARE: {
                    const cp = som.getBoardSquare(gameNode.state.board, obj.square);
                    if (!cp || cp.color !== gameNode.state.nextTurn) {
                        return this.setActiveGameObject();
                    }
                    break;
                }
                case entities_1.GameObjectType.HAND_PIECE: {
                    if (obj.color !== gameNode.state.nextTurn) {
                        return this.setActiveGameObject();
                    }
                    else {
                        const n = som.getNumPieces(som.getHand(gameNode.state.hands, obj.color), obj.piece);
                        if (n === 0) {
                            return this.setActiveGameObject();
                        }
                    }
                    break;
                }
            }
            this.setActiveGameObject(obj);
        }
    };
}
exports.default = interactable;
//# sourceMappingURL=interactable.js.map