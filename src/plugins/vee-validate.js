import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, min, max, integer, between } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);
extend('integer', integer);
extend('between', between);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
export default {
    components: {
        ValidationProvider,
        ValidationObserver
    }
};
