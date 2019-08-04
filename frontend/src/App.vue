<template>
	<section
		id="app"
		class="hero is-fullheight"
	>
		<div class="hero-head">
			<images-navbar />
		</div>
		<div class="hero-body">
			<router-view />
		</div>
	</section>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
	components: {
		'images-navbar': Navbar,
	},
};
</script>
