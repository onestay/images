<template>
	<div class="container">
		<div class="has-text-centered is-size-1">
			{{ appName }}
		</div>
		<div class="columns is-centered">
			<div class="column is-half has-text-centered">
				<images-uploader />
			</div>
		</div>
	</div>
</template>
<script>
import Uploader from '@/components/Uploader.vue';

export default {
	components: {
		'images-uploader': Uploader,
	},
	data() {
		return {
			appName: this.$config.appName,
		};
	},
};
</script>
