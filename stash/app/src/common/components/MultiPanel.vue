<template>
  <div class="multiPanel" :class="[isRow ? 'multiPanel-row' : 'multiPanel-column']">
    <div v-bind="getColAttrs('col1')" ref="col1">
      <slot name="col1"></slot>
    </div>

    <div ref="divider" @mousedown.stop="onDragDivider($event)">
      <slot name="divider">
        <div class="multiPanel_defaultDivider"  :class="[isRow ? 'multiPanel_defaultDivider-row' : 'multiPanel_defaultDivider-column']"></div>
      </slot>
    </div>

    <div v-bind="getColAttrs('col2')" ref="col2">
      <slot name="col2"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import throttle from "lodash.throttle";

export default Vue.extend({
  props: {
    direction: {
      type: String,
      default: "row",
      validator: (v: string) => {
        return ["row", "column"].indexOf(v) !== -1;
      },
    },
    resizableSlot: {
      type: String,
      default: "col2",
      validator: (v: string) => {
        return ["col1", "col2"].indexOf(v) !== -1;
      },
    },
    resizableSlotSize: { type: String, default: "100px" },
  },
  computed: {
    isRow(): boolean { return this.direction === "row"; },
    isColumn(): boolean { return this.direction === "column"; },
  },
  methods: {
    getColAttrs(col: string): Object {
      const sizeProp = this.isRow ? "width" : "height";
      if (col === this.resizableSlot) {
        return {
          class: { isResizable: true },
          style: {
            [sizeProp]: this.resizableSlotSize
          },
        };
      }
      return {
        style: {
          flexGrow: 1,
          [sizeProp]: '0px',
        },
      };
    },
    onDragDivider(event: MouseEvent) {
      const elRoot = document.documentElement;
      const elCol = (this.resizableSlot === "col1" ? this.$refs.col1 : this.$refs.col2) as HTMLElement;
      const elDivider = this.$refs.divider as HTMLElement;

      const onMouseMove = throttle((e: MouseEvent) => {
        const colRect = elCol.getBoundingClientRect();
        const dividerRect = elDivider.getBoundingClientRect();
        if (this.isColumn) {
          const dy = (dividerRect.top + colRect.top) * 0.5 - e.clientY;
          elCol.style.height = `${colRect.height + dy}px`;
        } else {
          const dx = (dividerRect.left + colRect.left) * 0.5 - e.clientX;
          elCol.style.width = `${colRect.width + dx}px`;
        }
      }, 100, { trailing: false });

      const onMouseUp = () => {
        elRoot.removeEventListener("mousemove", onMouseMove);
        elRoot.removeEventListener("mouseup", onMouseUp);
      };

      elRoot.addEventListener("mousemove", onMouseMove);
      elRoot.addEventListener("mouseup", onMouseUp);
    },
  },
});
</script>

<style lang="scss" scoped>
.multiPanel {
  display: flex;
  flex-wrap: nowrap;

  &-row { flex-direction: row; }
  &-column { flex-direction: column; }

  &_defaultDivider {
    position: relative;
    z-index: 100;
    // border: 1px solid #F00;
    // background-color: #FF0;

    &-column {
      width: 100%;
      height: 3px;
      margin-top: -3px;

      &:hover {
        cursor: row-resize;
      }
    }

    &-row {
      height: 100%;
      width: 3px;
      margin-left: -3px;

      &:hover {
        cursor: col-resize;
      }
    }
  }
}
</style>
