<template>
  <div class="board">
    <div class="board_inner">
      <div v-for="y in 9" class="board_row">
        <button
          v-for="x in 9"
          :class="getSquareClass(x, y)"
          @click.stop="onSelect(x, y)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Set } from "immutable";
import capitalize from "lodash.capitalize";
import Vue, { PropOptions } from "vue";
import * as core from "@hiryu/shogi-core";
import * as gameObj from "../entities/game_object";

export default Vue.extend({
  props: {
    board: { type: core.Board, required: true },
    selected: { type: Object } as PropOptions<gameObj.BoardSquare | null>,
    moveCandidates: { type: Object } as PropOptions<Set<core.standardRule.MoveCandidate>>,
  },
  data() {
    return {
      Color: core.Color,
    };
  },
  methods: {
    getSquareClass(x: number, y: number): Array<string> {
      const classes: string[] = ["board_square"];
      if (this.selected && x === this.selected.pos.x && y === this.selected.pos.y) {
        classes.push("isSelected");
      }
      const cp = this.board.get([x, y]);
      if (cp === null) {
        return classes.concat(["isEmpty"]);
      }
      return classes.concat([
        "hasPiece",
        `is${capitalize(cp.color.toString())}`,
        `is${cp.piece.toCSAString()}`,
      ]);
    },
    onSelect(x: number, y: number) {
      this.$emit("select", x, y);
    },
  },
});
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  width: 100%;
  
  &:before {
    display: block;
    content: "";
    // In general, the real board size is:
    // W: 33.3cm (1尺1寸)
    // H: 36.4cm (1尺2寸)
    padding-top: 109.3%;
  }

  &_inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 3.25%;
    background-image: url(/skin/default/img/board.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  &_row {
    display: flex;
    flex-direction: row-reverse;
    height: 11.1%;
  }

  &_square {
    position: relative;
    width: 11.1%;
    height: 100%;
    background: none;
    border-width: 0;
    padding: 0px;
    outline: none;

    &.hasPiece.isSelected:before {
      display: block;
      position: absolute;
      top: 3%;
      left: 3%;
      width: 94%;
      height: 94%;
      z-index: 0;
      border-radius: 2%;
      content: "";
      background-color: rgba(144, 94, 0, 0.3);
    }

    &:after {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      z-index: 1;
      content: "";
      background-size: 87%;
      background-origin: content-box;
      background-position: center -10%;
      background-repeat: no-repeat;
    }

    &.isWhite:after {
      transform: rotate(180deg);
    }

    &.isFU:after { background-image: url(/skin/default/img/piece_fu.png); }
    &.isKY:after { background-image: url(/skin/default/img/piece_ky.png); }
    &.isKE:after { background-image: url(/skin/default/img/piece_ke.png); }
    &.isGI:after { background-image: url(/skin/default/img/piece_gi.png); }
    &.isKI:after { background-image: url(/skin/default/img/piece_ki.png); }
    &.isKA:after { background-image: url(/skin/default/img/piece_ka.png); }
    &.isHI:after { background-image: url(/skin/default/img/piece_hi.png); }
    &.isOU:after { background-image: url(/skin/default/img/piece_ou.png); }
    &.isGY:after { background-image: url(/skin/default/img/piece_gy.png); }
    &.isTO:after { background-image: url(/skin/default/img/piece_to.png); }
    &.isNY:after { background-image: url(/skin/default/img/piece_ny.png); }
    &.isNK:after { background-image: url(/skin/default/img/piece_nk.png); }
    &.isNG:after { background-image: url(/skin/default/img/piece_ng.png); }
    &.isUM:after { background-image: url(/skin/default/img/piece_um.png); }
    &.isRY:after { background-image: url(/skin/default/img/piece_ry.png); }
  }
}
</style>
