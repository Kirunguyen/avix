<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>AVIX — MOBA Build Planner</title>
	<meta name="theme-color" content="#050505" />
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="app-theme-base">
	<!-- Landscape Orientation Blocker -->
	<div class="orientation-blocker">
		<div class="blocker-content">
			<div class="phone-animation">
				<div class="screen-body">
					<span class="home-indicator"></span>
				</div>
				<div class="glowing-arrow">↩</div>
			</div>
			<h3>Rotate Your Device</h3>
			<p>
				AVIX is optimized for horizontal layouts to mimic the in-game client layout. Please rotate
				your device to landscape mode.
			</p>
		</div>
	</div>

	{@render children()}
</div>

<style>
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
		height: 100vh;
		width: 100vw;
		overflow: hidden; /* Lock the global viewport */
		box-sizing: border-box;
		user-select: none;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-theme-base {
		background-color: #050505;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* Landscape Blocker for portrait viewports */
	.orientation-blocker {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(5, 5, 5, 0.98);
		z-index: 99999;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		text-align: center;
	}

	@media (max-width: 950px) and (orientation: portrait) {
		.orientation-blocker {
			display: flex;
		}
	}

	.blocker-content {
		max-width: 320px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.blocker-content h3 {
		font-size: 1.25rem;
		font-weight: 800;
		color: #fff;
		margin: 0;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.blocker-content p {
		font-size: 0.85rem;
		line-height: 1.5;
		color: #64748b;
		margin: 0;
	}

	.phone-animation {
		position: relative;
		width: 100px;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.screen-body {
		width: 40px;
		height: 72px;
		border: 3px solid #222;
		border-radius: 6px;
		background-color: #0d0d0d;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding-bottom: 4px;
		animation: rotatePhone 2.5s infinite ease-in-out;
		transform-origin: center center;
	}

	.home-indicator {
		width: 12px;
		height: 2px;
		background-color: #333;
		border-radius: 1px;
	}

	.glowing-arrow {
		position: absolute;
		top: 15px;
		right: 15px;
		font-size: 1.5rem;
		color: #2563eb;
		font-weight: bold;
		animation: arrowPulse 2.5s infinite ease-in-out;
	}

	@keyframes rotatePhone {
		0%,
		100% {
			transform: rotate(0deg);
			border-color: #222;
		}
		45%,
		55% {
			transform: rotate(-90deg);
			border-color: #2563eb;
		}
	}

	@keyframes arrowPulse {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(0.9);
		}
		45%,
		55% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	:global(::-webkit-scrollbar) {
		width: 4px;
		height: 4px;
	}
	:global(::-webkit-scrollbar-track) {
		background: #090909;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: #252525;
		border-radius: 2px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: #333;
	}
</style>
