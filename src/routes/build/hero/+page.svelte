<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import HeroSelector from '$lib/components/HeroSelector.svelte';
	import heroListRaw from '$lib/data/heroes.json';
	import type { Hero } from '$lib/types/entities';

	const heroList = heroListRaw as Hero[];
</script>

<div class="editor-wrapper">
	<!-- Workspace header -->
	<div class="editor-header">
		<button class="back-btn" onclick={() => goto(resolve('/'))}>← Done</button>
		<h1 class="editor-title">Select Hero</h1>
	</div>

	<!-- Workspace main selector body -->
	<div class="editor-main-panel">
		<HeroSelector
			heroes={heroList}
			selectedHero={buildState.selectedHero}
			onSelect={(hero) => buildState.selectHero(hero)}
		/>
	</div>

	<!-- Bottom lightweight summary footer -->
	<div class="lightweight-preview">
		<span class="preview-label">Active Hero:</span>
		{#if buildState.selectedHero}
			<div class="hero-chip">
				<img src="/heroes/icons/{buildState.selectedHero.image}" alt="" />
				<span class="hero-chip-name">{buildState.selectedHero.name}</span>
			</div>
		{:else}
			<span class="none-text">None</span>
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #050505;
		box-sizing: border-box;
	}

	.editor-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		background-color: #0b0b0b;
		padding: 1rem 2rem;
		border-bottom: 1px solid #1a1a1a;
	}

	.back-btn {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #ccc;
		padding: 0.45rem 1rem;
		border-radius: 6px;
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.back-btn:hover {
		background-color: #2563eb;
		color: #fff;
		border-color: #3b82f6;
	}

	.editor-title {
		font-size: 1.15rem;
		font-weight: bold;
		color: #fff;
		margin: 0;
	}

	.editor-main-panel {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
	}

	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 1rem 2rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.preview-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.hero-chip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #121212;
		border: 1px solid #222;
		padding: 0.35rem 0.75rem;
		border-radius: 20px;
	}

	.hero-chip img {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	.hero-chip-name {
		font-size: 0.85rem;
		font-weight: bold;
		color: #fff;
	}

	.none-text {
		font-size: 0.85rem;
		color: #444;
		font-style: italic;
	}
</style>
