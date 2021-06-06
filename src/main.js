import Vue from "vue";
import App from "./App.vue";
// import scroll from "./plugin/index.js";
import scroll from "infinite-scroll-for-vue";
import "infinite-scroll-for-vue/lib/infinite-scroll-vue.css";
Vue.config.productionTip = false;
Vue.use(scroll);
new Vue({
    render: (h) => h(App),
}).$mount("#app");
