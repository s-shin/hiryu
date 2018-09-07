<template>
  <q-modal v-model="isOpened">
    <div
      ref="dndArea"
      :class="[`dnd`, { isDragOver }]"
      @dragover.prevent=""
      @drop.prevent="isDragOver = false; onDrop($event)"
      @dragenter="isDragOver = true"
      @dragleave="isDragOver = false"
    >Drag and drop a record file here</div>
  </q-modal>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    value: Boolean,
  },
  data() {
    return {
      isOpened: this.value,
      isDragOver: false,
    };
  },
  watch: {
    value(v: boolean, old: boolean) {
      this.isOpened = v;
    },
    isOpened(v: boolean, old: boolean) {
      this.$emit("input", v);
    },
  },
  methods: {
    async onDrop(event: DragEvent) {
      const files = event.dataTransfer.files;
      if (files.length !== 1) {
        return this.$emit("onError", new Error("Only one file should be dropped."));
      }
      this.$emit("onRecordFileSelected", files[0]);
    },
  },
});
</script>

<style lang="scss" scoped>
.dnd {
  box-sizing: border-box;
  width: 70vw;
  padding: 30vh 5%;
  text-align: center;
  &.isDragOver {
    background-color: #e0ebaf;
  }
}
</style>
