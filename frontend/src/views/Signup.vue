<template>
	<div class="container">
		<div class="columns is-centered">
			<div class="column is-one-third">
				<div class="card">
					<div class="card-content">
						<b-field
							label="Username"
							:type="{'is-danger': errors.has('username')}"
							:message="errors.first('username')"
						>
							<b-input
								v-model="username"
								v-validate="'required'"
								type="text"
								name="username"
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
						<b-field
							label="Password"
							:type="{'is-danger': errors.has('password')}"
							:message="errors.first('password')"
						>
							<b-input
								v-model="password"
								v-validate="'required|min:6'"
								name="password"
								type="password"
								icon="lock"
								placeholder="Password"
							/>
						</b-field>
						<b-field>
							<b-button
								:loading="processing"
								type="is-success"
								@click="signup"
							>
								Sign up
							</b-button>
						</b-field>
						<p class="help is-danger">
							{{ signupError }}
						</p>
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
			signupError: '',
			processing: false,
		};
	},
	methods: {
		async signup() {
			const ok = await this.$validator.validateAll();
			if (!ok) {
				return;
			}

			try {
				this.processing = true;
				await this.$auth.signup(this.email, this.password, this.username);
				this.$router.push('/');
			} catch (e) {
				this.processing = false;
				this.signupError = e;
			}
		},
	},
};
</script>
