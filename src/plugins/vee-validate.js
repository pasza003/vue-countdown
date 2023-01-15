import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: (a) => `${a} is required`,
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
export default {
    components: {
        ValidationProvider,
        ValidationObserver
    }
};
