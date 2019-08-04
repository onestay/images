<template>
	<section>
		<b-field>
			<b-upload
				v-model="files"
				multiple
				drag-drop
				:disabled="!user"
			>
				<section class="section">
					<div class="content has-text-centered">
						<p>
							<b-icon
								icon="upload"
								size="is-large"
							/>
						</p>
						<p v-if="!user">
							<strong>Please log in to upload</strong>
						</p>
						<p v-else>
							Drop files or click to upload
						</p>
					</div>
				</section>
			</b-upload>
		</b-field>
	</section>
</template>
<script>
export default {
	data() {
		return {
			files: [],
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
	},
	methods: {
		async process() {
			console.log(this.files[0].name);

			const shaFile = this.files[0].slice(0, 1000);
			const shaFileData = await shaFile.arrayBuffer();
			this.$http.post('http://localhost:8081/', shaFileData, {
				headers: {
					'Content-Type': 'Application/octet-stream',
					'X-Original-File-Name': encodeURIComponent(this.files[0].name),
				},
			});
		},
	},
};
</script>
