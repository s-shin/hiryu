import Vue from "vue";

declare module "quasar" {
  export {};
}

declare module "vue/types/vue" {
  interface Vue {
    $q: any;
  }
}
