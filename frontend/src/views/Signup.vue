<template>
	<div class="container">
		<div class="columns is-centered">
			<div class="column is-one-third">
				<div class="card">
					<div class="card-content">
						<b-field label="Username">
							<b-input
								v-model="username"
								type="text"
								icon="account"
								placeholder="Username"
							/>
						</b-field>
						<b-field
							label="E-Mail"
							:type="{'is-danger': errors.has('email')}"
							:message="errors.first('email')"
						>
							<b-input
								v-model="email"
								v-validate="'required|email'"
								name="email"
								type="email"
								icon="email"
								placeholder="E-Mail"
								use-html5-validation
							/>
						</b-field>
						<b-field label="Password">
							<b-input
								v-model="password"
								type="password"
								icon="lock"
								placeholder="Password"
							/>
						</b-field>
						<b-field>
							<b-button
								type="is-success"
								@click="login"
							>
								Sign up
							</b-button>
						</b-field>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			username: '',
			email: '',
			password: '',
		};
	},
	methods: {
		login() {
			this.$auth.signup()
				.catch(e => console.log(e));
		},
	},
};
</script>
