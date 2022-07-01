import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import veeValidate from './plugins/vee-validate';

import DatetimePicker from 'vuetify-datetime-picker';
import vueMoment from 'vue-moment';
// (Optional) import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.use(DatetimePicker);
Vue.use(vueMoment);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    veeValidate,
    render: h => h(App)
}).$mount('#app');
