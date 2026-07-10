<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import BuildPreview from '$lib/components/BuildPreview.svelte';

	let downloadTrigger = $state<() => Promise<void>>();

	const armoryItemCount = $derived(buildState.armory.filter(Boolean).length);
	const enchantmentCount = $derived(buildState.selectedEnchantments.filter(Boolean).length);
	const arcanaCount = $derived(
		buildState.redArcana.length + buildState.purpleArcana.length + buildState.tealArcana.length
	);

	function triggerDownload() {
		if (downloadTrigger) {
			downloadTrigger();
		}
	}
</script>

<div class="dashboard-grid">
	<!-- Left Side: Build Navigator (32% width) -->
	<div class="navigator-panel">
		<div class="brand-header">
			<span class="brand-title">AVIX</span>
			<span class="brand-subtitle">MOBA Build Architect</span>
		</div>

		<div class="nav-cards-list">
			<!-- Hero Card -->
			<a class="nav-card" href={resolve('/build/hero')}>
				<div class="card-meta">
					<span class="card-category">Hero</span>
					<span class="card-value"
						>{buildState.selectedHero ? buildState.selectedHero.name : 'Unselected'}</span
					>
				</div>
				{#if buildState.selectedHero}
					<img
						class="card-icon circle-icon"
						src="/heroes/icons/{buildState.selectedHero.image}"
						alt=""
					/>
				{:else}
					<div class="card-icon-placeholder circle-placeholder">👤</div>
				{/if}
			</a>

			<!-- Equipment Card -->
			<a class="nav-card" href={resolve('/build/equipment')}>
				<div class="card-meta">
					<span class="card-category">Equipment</span>
					<span class="card-value">{armoryItemCount} / {buildState.armoryCapacity} Items</span>
				</div>
				<div class="mini-icon-row">
					{#each buildState.armory
						.filter(Boolean)
						.slice(0, 4) as item, idx (item ? `equipment-${item.id}-${idx}` : `equipment-empty-${idx}`)}
						<!-- Dynamic WebP Translation -->
						<img
							src="/items/{item?.image.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp')}"
							alt=""
							class="mini-img"
						/>
					{/each}
				</div>
			</a>

			<!-- Enchantments Card -->
			<a class="nav-card" href={resolve('/build/enchantment')}>
				<div class="card-meta">
					<span class="card-category">Enchantment</span>
					<span class="card-value">{enchantmentCount} / 5 Selected</span>
				</div>
				<div class="mini-icon-row circle-row">
					{#each buildState.selectedEnchantments.filter(Boolean).slice(0, 3) as ench (ench?.id)}
						<img
							src="/enchantments/{ench?.image.replace(/\.png$/i, '.webp')}"
							alt=""
							class="mini-img circular-img"
						/>
					{/each}
				</div>
			</a>

			<!-- Talent Card -->
			<a class="nav-card" href={resolve('/build/talent')}>
				<div class="card-meta">
					<span class="card-category">Talent</span>
					<span class="card-value"
						>{buildState.selectedTalent ? buildState.selectedTalent.name : 'Unselected'}</span
					>
				</div>
				{#if buildState.selectedTalent}
					<img
						class="card-icon square-icon"
						src="/talents/{buildState.selectedTalent.image.replace(/\.png$/i, '.webp')}"
						alt=""
					/>
				{:else}
					<div class="card-icon-placeholder square-placeholder">+</div>
				{/if}
			</a>

			<!-- Arcana Card -->
			<a class="nav-card" href={resolve('/build/arcana')}>
				<div class="card-meta">
					<span class="card-category">Arcana Configuration</span>
					<span class="card-value">{arcanaCount} / 30 Equipped</span>
				</div>
				<div class="arcana-colors-pills">
					<span class="color-pill red-pill">{buildState.redArcana.length}</span>
					<span class="color-pill purple-pill">{buildState.purpleArcana.length}</span>
					<span class="color-pill teal-pill">{buildState.tealArcana.length}</span>
				</div>
			</a>

			<!-- Card Customization Inputs Block -->
			<div class="meta-customization-box">
				<div class="input-element">
					<label for="b-name">Build Name</label>
					<input
						id="b-name"
						type="text"
						bind:value={buildState.buildName}
						placeholder="Enter loadout title..."
						maxlength="28"
					/>
				</div>
				<div class="input-element">
					<label for="c-name">Creator Name</label>
					<input
						id="c-name"
						type="text"
						bind:value={buildState.authorName}
						placeholder="Enter your name..."
						maxlength="20"
					/>
				</div>
			</div>

			<!-- Export trigger inside Navigator list -->
			<button class="export-nav-action" onclick={triggerDownload}>
				<span>📥 Export Build Image</span>
			</button>
		</div>
	</div>

	<!-- Right Side: Live Preview Panel (68% width) -->
	<div class="preview-panel">
		<BuildPreview bind:downloadTrigger />
	</div>
</div>

<style>
	.dashboard-grid {
		display: grid;
		grid-template-columns: 32vw 68vw;
		height: 100vh;
		width: 100vw;
		margin: 0;
		padding: 0;
		overflow: hidden;
		box-sizing: border-box;
	}

	.navigator-panel {
		background-color: #0b0b0b;
		border-right: 1px solid #1a1a1a;
		height: 100vh;
		overflow-y: auto;
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		box-sizing: border-box;
	}

	.preview-panel {
		height: 100vh;
		overflow-y: auto;
		background-color: #050505;
		box-sizing: border-box;
	}

	.brand-header {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #1f1f1f;
		padding-bottom: 0.5rem;
	}

	.brand-title {
		font-size: 1.75rem;
		font-weight: 900;
		color: #fff;
		letter-spacing: 0.1em;
	}

	.brand-subtitle {
		font-size: 0.7rem;
		color: #444;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-cards-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.nav-card {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: left;
		transition:
			border-color 0.12s,
			background-color 0.12s;
		box-sizing: border-box;
		text-decoration: none;
		outline: none;
	}

	.nav-card:hover {
		border-color: #3b82f6;
		background-color: #151515;
	}

	.card-meta {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.card-category {
		font-size: 0.6rem;
		text-transform: uppercase;
		color: #555;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.card-value {
		font-size: 0.85rem;
		color: #f1f5f9;
		font-weight: 700;
	}

	.card-icon {
		width: 34px;
		height: 34px;
		object-fit: cover;
		border: 1px solid #333;
	}

	.circle-icon {
		border-radius: 50%;
	}

	.square-icon {
		border-radius: 6px;
		border-color: #eab308;
	}

	.card-icon-placeholder {
		width: 34px;
		height: 34px;
		background-color: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
		font-size: 1rem;
		font-weight: bold;
	}

	.circle-placeholder {
		border-radius: 50%;
	}

	.square-placeholder {
		border-radius: 6px;
	}

	.mini-icon-row {
		display: flex;
		gap: 0.2rem;
	}

	.mini-img {
		width: 22px;
		height: 22px;
		object-fit: cover;
		border-radius: 4px;
		background-color: #090909;
		border: 1px solid #333;
	}

	.circular-img {
		border-radius: 50%;
	}

	.arcana-colors-pills {
		display: flex;
		gap: 0.2rem;
	}

	.color-pill {
		font-size: 0.6rem;
		font-weight: bold;
		color: #fff;
		padding: 0.1rem 0.35rem;
		border-radius: 3px;
	}

	.red-pill {
		background-color: #ef4444;
	}
	.purple-pill {
		background-color: #a855f7;
	}
	.teal-pill {
		background-color: #14b8a6;
	}

	.meta-customization-box {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.65rem;
		box-sizing: border-box;
	}

	.input-element {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.input-element label {
		font-size: 0.6rem;
		text-transform: uppercase;
		color: #555;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.input-element input {
		background-color: #0d0d0d;
		border: 1px solid #252525;
		border-radius: 5px;
		color: #fff;
		padding: 0.4rem 0.5rem;
		font-size: 0.75rem;
		outline: none;
		transition: border-color 0.12s;
	}

	.input-element input:focus {
		border-color: #2563eb;
	}

	.export-nav-action {
		background-color: #2563eb;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.65rem;
		font-size: 0.8rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.12s;
	}

	.export-nav-action:hover {
		background-color: #1d4ed8;
	}
</style>
