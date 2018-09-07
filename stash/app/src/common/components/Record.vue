<template>
  <div class="record" ref="container">
    <GlobalEvents
      @keydown.up.capture.stop.prevent="select(gameManager.currentEventIndex - 1)"
      @keydown.down.capture.stop.prevent="select(gameManager.currentEventIndex + 1)"
    />
    <q-list highlight dense no-border>
      <q-item
        v-for="([ptr, er], i) of eventResultEntries"
        v-if="er.by"
        ref="notations"
        :key="i"
        @click.native="select(i)"
        :class="{
          'text-weight-bold': isActiveEventPointer(ptr),
          'text-info': isActiveEventPointer(ptr),
        }"
      >
        <q-item-side>
          {{i === 0 ? '#' : i}}
        </q-item-side>
        <q-item-main>
          {{er.by.toJapaneseNotationString()}}
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GlobalEvents from "vue-global-events";
import * as core from "@hiryu/shogi-core";

export default Vue.extend({
  components: { GlobalEvents },
  props: {
    gameManager: { type: core.standardRule.GameManager, required: true },
  },
  mounted() {
    this.scrollToNotationElement(this.gameManager.currentEventIndex);
  },
  computed: {
    eventResultEntries(): Array<[core.RecordEventPointer, core.standardRule.EventResult]> {
      return this.gameManager.getEventResultEntries();
    },
  },
  methods: {
    isActiveEventPointer(ptr: core.RecordEventPointer) {
      return this.gameManager.currentEventPointer.equals(ptr);
    },
    select(n: number) {
      this.$emit("notation-selected", n);
      this.scrollToNotationElement(n);
    },
    scrollToNotationElement(n: number) {
      if (n === 0) {
        return;
      }
      const elContainer = this.$refs.container as Element;
      const containerRect = elContainer.getBoundingClientRect();
      let elScroll = elContainer.parentElement;
      for (let i = 0; i < 5; i++) {
        if (elScroll === null) {
          break;
        }
        const r = elScroll.getBoundingClientRect();
        if (r.height < containerRect.height) {
          break;
        }
        elScroll = elScroll.parentElement;
      }
      if (!elScroll) {
        return;
      }
      const scrollRect = elScroll.getBoundingClientRect();
      const elNotations = this.$refs.notations as Vue[];
      const elNotation = elNotations[n - 1].$el;
      const notationRect = elNotation.getBoundingClientRect();
      const offset = 10;
      if (notationRect.top < scrollRect.top) {
        elScroll.scrollTop = notationRect.top - containerRect.top - offset;
      } else if (notationRect.bottom > scrollRect.bottom) {
        elScroll.scrollTop = notationRect.top - containerRect.top - scrollRect.height + notationRect.height + offset;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
