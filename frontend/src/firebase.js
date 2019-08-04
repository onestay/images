import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import config from '@/config';
import store from '@/store';

export default {
	install: (Vue) => {
		firebase.initializeApp(config.firebaseConfig);
		const auth = firebase.auth();

		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$auth = {
			login: async (username, pass) => {
				await auth.signInWithEmailAndPassword(username, pass);
			},
			logout: async () => {
				auth.signOut();
			},
			signup: async (email, pass, displayName) => {
				await auth.createUserWithEmailAndPassword(email, pass);
				await auth.currentUser.updateProfile({
					displayName,
				});
			},
			_firebase: auth,
		};
		auth.onAuthStateChanged((user) => {
			store.commit('updateUser', { user });
		});
	},
};
