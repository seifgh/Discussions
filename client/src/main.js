import Vue from "vue";
// ------------
import router from "./router";
import store from "./store";
import notificationsPlugin from "./plugins/notifications";
import "./index.css";
import App from "./App.vue";
// ----------------------
Vue.config.productionTip = false;
Vue.use(notificationsPlugin);
require("dotenv").config();
new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
