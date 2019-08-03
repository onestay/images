<template>
	<div id="app">
		<header>
			<images-navbar />
		</header>
		<section class="section">
			<router-view />
		</section>
	</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
	components: {
		'images-navbar': Navbar,
	},
};
</script>
