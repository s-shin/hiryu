<template>
  <div :class="['hand', `is${colorStr}`]">
    <div class="hand_inner">
      <div
        v-for="p in [Piece.HI, Piece.KA, Piece.KI, Piece.GI, Piece.KE, Piece.KY, Piece.FU]"
        :data-num-pieces="getNum(p)"
        :class="[
          'hand_pieces',
          `is${p.toCSAString()}`,
          { isSelected: selected !== null && selected.equals(p) },
        ]"
        @click.stop="onSelect(p)"
      >
        <div v-for="i in getNum(p)" :class="['hand_pieces_piece', `is${i}`]"></div>
        <div :data-num-pieces="getNum(p)" class="hand_pieces_num"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import capitalize from "lodash.capitalize";
import Vue, { PropOptions } from "vue";
import * as core from "@hiryu/shogi-core";

export default Vue.extend({
  props: {
    color: { required: true },
    hand: { type: core.Hand, required: true },
    selected: { type: Object } as PropOptions<core.Piece | null>,
  },
  data() {
    return { Piece: core.Piece };
  },
  computed: {
    colorStr(): string { return capitalize((this.color as core.Color).toString()); },
  },
  methods: {
    getNum(p: core.Piece): number {
      return this.hand.get(p);
    },
    onSelect(p: core.Piece) {
      this.$emit("select", p);
    },
  },
});
</script>

<style lang="scss" scoped>
.hand {
  position: relative;
  width: 100%;

  &.isWhite {
    transform: rotate(180deg);
  }

  &:before {
    display: block;
    content: "";
    padding-top: 100%;
  }

  &_inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 3.25%;
    background-image: url(/skin/default/img/hand.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  &_pieces {
    // position: absolute;
    // width: 27%;
    // &[data-num-pieces="0"] {
    //   opacity: 0.3;
    // }
    // &.isFU { top: 65%; left: 65%; }
    // &.isKY { top: 65%; left: 35%; }
    // &.isKE { top: 65%; left: 5%; }
    // &.isGI { top: 35%; left: 35%; }
    // &.isKI { top: 35%; left: 5%; }
    // &.isKA { top: 5%; left: 35%; }
    // &.isHI { top: 5%; left: 5%; }

    position: relative;
    float: left;
    width: 27%;
    margin: 2.5%;
      
    &[data-num-pieces="0"] {
      display: none;
    }

    &:before {
      display: block;
      content: "";
      padding-top: 109.3%;
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      z-index: 0;
      content: "";
      background-size: 87%;
      background-origin: content-box;
      background-position: center -10%;
      background-repeat: no-repeat;
    }

    &.isSelected {
      border: solid 1px rgba(255, 255, 255, 0.5);
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

    &_num {
      position: absolute;
      right: -5%;
      bottom: 0;
      z-index: 1;
      display: block;
      padding: 0em 0.3em;
      text-align: center;
      border-radius: 10%;
      background-color: black;
      color: white;
      font-size: 0.7em;

      &:before {
        content: attr(data-num-pieces);
      }
    }
  }
}
</style>
