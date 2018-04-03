<template>
  <div class="game">
    <div class="game_hand game_hand-white">
      <Hand
        :color="Color.WHITE"
        :hand="state.getHand(Color.WHITE)"
        :selected="getSelectedHandPiece(Color.WHITE)"
        @select="p => onSelectHandPiece(Color.WHITE, p)"
      ></Hand>
    </div>
    <div class="game_board">
      <Board
        :board="state.board"
        :selected="selectedBoardSquare"
        :move-candidates="moveCandidates"
        @select="onSelectBoardSquare"
      ></Board>
    </div>
    <div class="game_hand game_hand-black">
      <Hand
        :color="Color.BLACK"
        :hand="state.getHand(Color.BLACK)"
        :selected="getSelectedHandPiece(Color.BLACK)"
        @select="p => onSelectHandPiece(Color.BLACK, p)"
      ></Hand>
    </div>
  </div>
</template>

<script lang="ts">
import { Set } from "immutable";
import Vue, { PropOptions } from "vue";
import Board from "./Board.vue";
import Hand from "./Hand.vue";
import * as core from "@hiryu/shogi-core";
import * as gameObj from "../entities/game_object";

export default Vue.extend({
  components: { Board, Hand },
  props: {
    state: { type: core.State, required: true },
    selectedGameObject: { type: Object } as PropOptions<gameObj.GameObject>,
    moveCandidates: { type: Object } as PropOptions<Set<core.standardRule.MoveCandidate>>,
  },
  data() {
    return {
      isConfirming: false,
      Color: core.Color,
      gameObj
    };
  },
  computed: {
    selectedBoardSquare(): gameObj.BoardSquare | null {
      const obj = this.selectedGameObject;
      if (obj && obj.type === gameObj.GameObjectType.BOARD_SQUARE) {
        return obj;
      }
      return null;
    },
  },
  mounted() {
    document.body.addEventListener("click", () => {
      if (!this.isConfirming) {
        this.$emit("unselect");
      }
    });
  },
  methods: {
    getSelectedHandPiece(color: core.Color): core.Piece | null {
      const obj = this.selectedGameObject;
      if (obj && obj.type === gameObj.GameObjectType.HAND_PIECE && obj.color.equals(color)) {
        return obj.piece;
      }
      return null;
    },
    onSelectBoardSquare(x: number, y: number) {
      const cs = this.moveCandidates.filter(c => {
        return c.to.x === x && c.to.y === y;
      });
      switch (cs.size) {
        case 1: {
          this.$emit("move", cs.first());
          break;
        }
        case 2: {
          this.isConfirming = true;
          this.$q.dialog({
            message: "Promote?",
            color: "primary",
            ok: "Yes",
            cancel: "No",
            preventClose: true,
          }).then(() => {
            this.$emit("move", cs.find(c => c.piece.isTails()));
            this.isConfirming = false;
          }).catch(() => {
            this.$emit("move", cs.find(c => c.piece.isHeads()));
            this.isConfirming = false;
          });
          break;
        }
        default: {
          this.$emit("select", new gameObj.BoardSquare({ pos: core.Position.from([x, y]) }));
          break;
        }
      }
    },
    onSelectHandPiece(color: core.Color, piece: core.Piece) {
      this.$emit("select", new gameObj.HandPiece({ color, piece }));
    },
  },
});
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  flex-direction: row;

  &_board {
    // width: 69.23%;
    flex-grow: 2.8;
  }

  &_hand {
    flex-grow: 1;
    // width: 20.96%;

    &-white {
      .hand {
        margin-top: 1%;
      }
    }

    &-black {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .hand {
        order: 1;
        margin-bottom: 1%;
      }
    }
  }
}
</style>
