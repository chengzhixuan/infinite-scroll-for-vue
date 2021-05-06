import Vue from "vue";
import App from "./App.vue";
import scroll from "./plugin/index.js";
Vue.config.productionTip = false;
Vue.use(scroll);
new Vue({
    render: (h) => h(App),
}).$mount("#app");
