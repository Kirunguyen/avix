<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>AVIX — MOBA Build Planner</title>
	<meta name="theme-color" content="#050505" />
</svelte:head>

<!-- Core Application Wrapper -->
<div class="app-theme-base">
	{@render children()}
</div>

<style>
	/* Global document base styling overrides */
	:global(html),
	:global(body) {
		background-color: #050505 !important;
		color: #e2e8f0 !important;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		margin: 0;
		padding: 0;
		min-height: 100vh;
		width: 100%;
		overflow-x: hidden;
		box-sizing: border-box;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-theme-base {
		background-color: #050505;
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* Beautiful uniform custom scrollbars globally */
	:global(::-webkit-scrollbar) {
		width: 6px;
		height: 6px;
	}
	:global(::-webkit-scrollbar-track) {
		background: #090909;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: #222222;
		border-radius: 4px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: #333333;
	}
</style>
