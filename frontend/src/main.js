import Vue from 'vue';
import axios from 'axios';
import VeeValidate from 'vee-validate';
import buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.min.css';

import config from './config';
import App from './App.vue';
import router from './router';
import auth from './firebase';
import store from './store';

Vue.use(buefy);
Vue.use(VeeValidate, {
	events: 'blur',
});
Vue.use(auth);

Vue.config.productionTip = false;

Vue.prototype.$config = config.appConfig;
Vue.prototype.$http = axios;
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
