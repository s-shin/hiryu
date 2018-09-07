import Vue from "vue";
import store from "../common/store";
import App from "../common/components/App.vue";
import "./services/usi_engine";
import "./sandbox";

new Vue({
  el: "#app",
  template: "<App></App>",
  components: { App },
  store,
});
