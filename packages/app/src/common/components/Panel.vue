<template>
  <div class="panel column">
    <header class="panel_header q-caption col-auto">
      <q-icon :name="icon" size="1.3em"></q-icon>
      <span>{{ title }}</span>
    </header>
    <div :class="[`col${fitContent ? '' : '-auto'}`]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    icon: { type: String },
    title: { type: String, required: true },
    fitContent: { type: Boolean, default: false },
  },
});
</script>

<style lang="scss" scoped>
.panel {
  // border: 1px solid #44617b;

  &_header {
    padding: 0 0 0 0.4em;
    color: #FFF;
    background-color: #44617b;

    > * {
      display: inline-block;
      vertical-align: middle;
      line-height: 1.5;
    }
  }
}
</style>
