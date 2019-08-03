import Vue from 'vue';
import axios from 'axios';
import VeeValidate from 'vee-validate';
import buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.min.css';

import App from './App.vue';
import router from './router';
import auth from './auth';
import store from './store';

Vue.use(buefy);
Vue.use(VeeValidate);
Vue.use(auth);

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
