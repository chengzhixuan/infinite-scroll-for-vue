import Scroll from "./scroll";
const components = [Scroll];
let ScrollInfint = {
    install(Vue, options) {
        components.map((com) => {
            Vue.component(com.name, com);
        });
    },
};
if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(ScrollInfint);
}
export default ScrollInfint;
