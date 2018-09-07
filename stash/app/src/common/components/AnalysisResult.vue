<template>
  <div class="analysisResult">
    <!-- NOTE: Ideally, we should use table, thead and tbody tags. -->
    <div class="analysisResult_table column no-wrap fit">
      <div class="col-auto">
        <div class="analysisResult_table_row analysisResult_table_row-header row no-wrap">
          <div>#</div>
          <div>候補手</div>
          <div>評価値</div>
          <div class="col">読み筋</div>
        </div>
      </div>
      <div class="col">
        <q-scroll-area class="fit">
          <div class="analysisResult_table_row analysisResult_table_row-body row no-wrap" v-for="r in result">
            <div>{{r.priority}}</div>
            <div>{{r.moves[0]}}</div>
            <div>{{r.score}}</div>
            <div class="col">{{r.moves.slice(1).join(", ")}}</div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { AnalysisResultForView } from "../utils/shogi";

export default Vue.extend({
  props: {
    result: { type: Array, required: true } as PropOptions<AnalysisResultForView[]>,
  },
});
</script>

<style lang="scss" scoped>
.analysisResult {
  font-size: 0.8rem;

  &_table {
    &_row {
      $highlight: #dbd0e6;

      &-header {
        background-color: $highlight;
      }

      > div {
        box-sizing: border-box;;
        padding: 0.1em 0.3em;
        border-bottom: 1px solid $highlight;

        &:nth-child(1) {
          width: 2em;
          text-align: right;
        }
        &:nth-child(2) {
          width: 6em;
        }
        &:nth-child(3) {
          width: 6em;
        }
      }
    }
  }
}
</style>
