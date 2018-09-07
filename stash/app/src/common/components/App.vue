<template>
  <q-layout view="hHh LpR fFf">
    <q-layout-header class="no-shadow">
      <q-toolbar color="main">
        <q-toolbar-title>Hiryu</q-toolbar-title>

        <q-btn icon="add" dense flat round>
          <q-popover>
            <q-list link>
              <q-item v-close-overlay @click.native="newGame()">
                New game
              </q-item>
              <q-item v-close-overlay @click.native="openRecordLoadDialog()">
                Load record
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>

        <!-- <q-btn outline class="q-ml-sm" label="局面解析" @click="analyze"></q-btn> -->
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <q-page>
        <div class="row" v-if="gameManager" style="height: calc(100vh - 50px); overflow: hidden">
          <MultiPanel direction="row" resizable-slot="col2" resizable-slot-size="25%" class="fit">
            <MultiPanel slot="col1" direction="column" resizable-slot="col2" resizable-slot-size="20%" class="fit">
              <div slot="col1" class="fit" style="position: relative">
                <div class="actionButtons">
                  <q-btn
                    round
                    color="primary"
                    icon="search"
                    @click="analyze()"
                  >
                    <q-tooltip anchor="center left" self="center right">Analyze</q-tooltip>
                  </q-btn>
                  <!-- <q-btn
                    round
                    color="primary"
                  >
                    <q-tooltip anchor="center left" self="center right">Stop</q-tooltip>
                    <q-spinner-facebook></q-spinner-facebook>
                  </q-btn> -->
                  <q-btn
                    round
                    color="secondary"
                    icon="more_vert"
                  >
                  </q-btn>
                </div>
                <q-scroll-area slot="col1" class="non-selectable fit">
                  <div class="q-pa-sm">
                    <Game
                      :state="gameManager.currentGame.state"
                      :selected-game-object="selectedGameObject"
                      :move-candidates="moveCandidates"
                      @select="onGameObjectSelected"
                      @unselect="onGameObjectUnselected"
                      @move="onMove"
                    ></Game>
                  </div>
                </q-scroll-area>
              </div>
              <Panel slot="col2" icon="computer" title="Analysis Result" class="fit" fit-content>
                <AnalysisResult class="fit" :result="analysisResult"></AnalysisResult>
              </Panel>
            </MultiPanel>
            <div slot="col2" class="column fit">
              <div class="col-auto">
                <Panel icon="info_outline" title="Information">
                  <GameInfo></GameInfo>
                </Panel>
              </div>
              <div class="col">
                <Panel class="fit" icon="list" title="Record" fit-content>
                  <div class="column fit">
                    <div class="col">
                      <q-scroll-area class="fit">
                        <Record
                          :gameManager="gameManager"
                          @notation-selected="(n) => onNotationSelected(n)"
                        ></Record>
                      </q-scroll-area>
                    </div>
                    <div class="col-auto">
                      <GameController></GameController>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </MultiPanel>
        </div>
        <div v-else>
          no record loaded
        </div>
        <record-load-modal
          v-model="isRecordLoadModalOpened"
          @onError="error"
          @onRecordFileSelected="onRecordFileSelected"
        ></record-load-modal>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions, mapMutations } from "vuex";
import * as core from "@hiryu/shogi-core";
import * as storeModels from "../store/interfaces";
import { Task } from "../entities/task";
import * as gameObj from "../entities/game_object";
import MultiPanel from "./MultiPanel.vue";
import Panel from "./Panel.vue"
import Game from "./Game.vue";
import GameInfo from "./GameInfo.vue";
import Record from "./Record.vue";
import AnalysisResult from "./AnalysisResult.vue";
import GameController from "./GameController.vue";
import RecordLoadModal from "./RecordLoadModal.vue";
import { AnalysisResultForView, getAnalysisResultForView } from "../utils/shogi";

export default Vue.extend({
  components: {
    Panel, MultiPanel, Game, GameInfo, Record, GameController, AnalysisResult,
    RecordLoadModal,
  },
  data() {
    return {
      isRecordLoadModalOpened: false,
    };
  },
  computed: {
    ...mapState<storeModels.RootState>({
      gameManager: state => state.app.gameManager,
      fileLoadTask: state => state.app.fileLoadTask,
      selectedGameObject: state => state.app.selectedGameObject,
      moveCandidates: state => state.app.moveCandidates,
      rawAnalysisResult: state => state.analysis.result,
    }) as any,
    analysisResult(): AnalysisResultForView[] {
      return (this.rawAnalysisResult as storeModels.AnalysisResult[]).map(x => getAnalysisResultForView(x));
    },
  },
  watch: {
    fileLoadTask: {
      handler(v: Task, old: Task) {
        if (v.isFailed()) {
          this.error(v.error!);
        }
        if (v.isRunning()) {
          this.$q.loading.show({ message: "Loading record file..." });
        } else {
          this.$q.loading.hide();
          if (v.isSucceeded()) {
            this.isRecordLoadModalOpened = false;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("app", [
      "newGameByFile",
    ]) as any,
    ...mapMutations("app", [
      "newGame",
      "goto",
      "move",
      "selectGameObject",
      "unselectGameObject",
    ]) as any,
    ...mapActions("analysis", {
      setupAnalysisService: "setupService",
      doAnalyze: "analyze",
    }),
    onNotationSelected(n: number) {
      if (!this.gameManager) {
        throw new Error("unexpected handler call");
      }
      this.goto(n);
    },
    async analyze() {
      if (!this.gameManager) {
        return;
      }
      await this.setupAnalysisService();
      const sfen = this.gameManager.currentGame.state.toSFEN();
      console.log(sfen);
      await this.doAnalyze(sfen, "");
    },
    openRecordLoadDialog() {
      this.isRecordLoadModalOpened = true;
    },
    async onRecordFileSelected(file: File) {
      await this.newGameByFile(file);
    },
    onGameObjectSelected(obj: gameObj.GameObject) {
      this.selectGameObject(obj);
    },
    onGameObjectUnselected() {
      this.unselectGameObject();
    },
    onMove(c: core.standardRule.MoveCandidate) {
      this.move(c);
    },
    error(err: Error | string) {
      const message = err instanceof Error ? err.message : err;
      const dismiss = this.$q.notify({
        message,
        timeout: 5000,
        color: "red",
        actions: [
          {
            label: "Dismiss",
            handler: () => {
              dismiss();
            },
          },
        ],
      });
    },
  },
});
</script>

<style lang="scss">
body {
  font-family: "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", Arial, "メイリオ", Meiryo, sans-serif;
}

.bg-main {
  background-color: #223a70;
}

.actionButtons {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  z-index: 10;

  > * {
    margin-bottom: 10px;
  }
}
</style>
