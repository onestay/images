import Vue from 'vue';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/login',
			name: 'login',
			component: () => import(/* webpackChunkName "Login" */ './views/Login.vue'),
		},
		{
			path: '/signup',
			name: 'signup',
			component: () => import(/* webpackChunkName "Signup" */ './views/Signup.vue'),
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import(/* webpackChunkName "profile" */ './views/Profile.vue'),
			meta: {
				auth: true,
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.auth)) {
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				next('/login');
			} else {
				next();
			}
		});
	} else {
		next();
	}
});

export default router;
