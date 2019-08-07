<template>
	<section>
		<b-field>
			<b-upload
				v-model="files"
				multiple
				drag-drop
				:disabled="!user"
				@input="createFileArray"
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
		<div>
			<b-progress
				v-for="(file) in files"
				:key="file.size"
				show-value
				size="is-medium"
				:value="file.uploadProgress"
				:type="{'is-info': !file.processed, 'is-success': file.processed}"
			>
				<span v-if="!file.processed">{{ file.name }}</span>
				<a
					v-if="file.processed"
					:href="file.url"
					target="_blank"
				>
					{{ file.url }}
				</a>
			</b-progress>
		</div>
	</section>
</template>
<script>
export default {
	data() {
		return {
			files: [],
			fileIndex: -1,
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		filesInQueue() {
			return this.files.length;
		},
	},
	methods: {
		createFileArray(files) {
			let oldFileIndex;
			this.fileIndex === -1 ? oldFileIndex = 0 : oldFileIndex = this.fileIndex;
			this.fileIndex += (files.length - this.fileIndex);
			const newFiles = [];
			const diff = this.fileIndex - oldFileIndex;
			for (let i = files.length - 1; i >= (files.length - diff); i--) {
				files[i].index = i;
				newFiles.push(files[i]);
			}
			this.process(newFiles);
		},
		async process(files) {
			const promises = files.map(async (file) => {
				let shaData;
				if (file.size > 1000) {
					shaData = await file.slice(0, 1000).arrayBuffer();
				} else {
					shaData = await file.arrayBuffer();
				}

				const token = await this.$auth._firebase.currentUser.getIdToken(true);

				try {
					const res = await this.$http.post('http://localhost:8081', shaData, {
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'Application/octet-stream',
							'X-Original-File-Name': encodeURIComponent(file.name),
						},
					});
					const fileType = file.type;
					const fileIndex = file.index;
					file.stream();
					await this.$http.put(res.data.url, file, {
						headers: {
							'Content-Type': fileType,
							'x-goog-meta-user': this.user.uid,
						},
						onUploadProgress: (progressEvent) => {
							this.files[fileIndex].uploadProgress =	Math.round((progressEvent.loaded * 100)
								/ progressEvent.total);
							const uploadEventReplacement = this.files[fileIndex];
							this.$set(this.files, fileIndex, uploadEventReplacement);
						},
						timeout: 0,
					});

					this.files[fileIndex].processed = true;
					this.files[fileIndex].url = res.data.fileUrl;
					const replacement = this.files[fileIndex];

					this.$set(this.files, fileIndex, replacement);
				} catch (error) {
					console.log(error);
				}
			});
			Promise.all(promises);
		},
	},
};
</script>
