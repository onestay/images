<template>
	<b-navbar>
		<template slot="brand">
			<b-navbar-item>
				<b-icon
					icon="image-filter-center-focus-weak"
					size="is-large"
				/>
			</b-navbar-item>
		</template>
		<template slot="start">
			<router-link
				class="navbar-item"
				to="/"
			>
				Home
			</router-link>
			<router-link
				class="navbar-item"
				to="/sharex"
			>
				Share X
			</router-link>
			<router-link
				class="navbar-item"
				to="/about"
			>
				About
			</router-link>
		</template>
		<template slot="end">
			<b-navbar-item
				v-if="!user"
				tag="div"
			>
				<div class="buttons">
					<router-link
						class="button is-primary"
						to="signup"
					>
						<strong>Sign up</strong>
					</router-link>
					<router-link
						class="button is-light"
						to="login"
					>
						Log in
					</router-link>
				</div>
			</b-navbar-item>
			<router-link
				class="navbar-item"
				to="/profile"
			>
				Profile
			</router-link>
			<b-navbar-item v-if="user">
				<div class="buttons">
					<a
						class="button is-light"
						@click="logout"
					>
						Sign out
					</a>
				</div>
			</b-navbar-item>
		</template>
	</b-navbar>
</template>
<script>
export default {
	computed: {
		user() {
			return this.$store.state.user;
		},
	},
	methods: {
		logout() {
			this.$auth.logout();
		},
		login() {
			this.$auth.login('mariusmeschter99@gmail.com', 'prdg2a8mafrau');
		},
	},
};
</script>
