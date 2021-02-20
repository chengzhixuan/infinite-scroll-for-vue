import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import scroll from './plugin/index.js'
Vue.use(scroll)
new Vue({
    render: h => h(App),
}).$mount('#app')