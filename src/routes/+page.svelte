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
	<!-- Left Side: Build Navigator (30%) -->
	<div class="navigator-panel">
		<div class="brand-header">
			<span class="brand-title">AVIX</span>
			<span class="brand-subtitle">MOBA Build Architect</span>
		</div>

		<div class="nav-cards-list">
			<!-- Hero Card -->
			<a class="nav-card hero-card" href={resolve('/build/hero')}>
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
						.slice(0, 4) as item, idx (item ? `${idx}-${item.id}` : idx)}
						<img src="/items/{item?.image}" alt="" class="mini-img" />
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
						<img src="/enchantments/{ench?.image}" alt="" class="mini-img circular-img" />
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
						src="/talents/{buildState.selectedTalent.image}"
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

	<!-- Right Side: Live preview frame (70%) -->
	<div class="preview-panel">
		<BuildPreview bind:downloadTrigger />
	</div>
</div>

<style>
	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 1rem;
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (min-width: 1024px) {
		.dashboard-grid {
			grid-template-columns: 3fr 7fr;
			height: 100vh;
			gap: 2rem;
			padding: 2rem;
			overflow: hidden;
		}

		.navigator-panel,
		.preview-panel {
			height: calc(100vh - 4rem);
			overflow-y: auto;
		}
	}

	.navigator-panel {
		background-color: #0b0b0b;
		border: 1px solid #1f1f1f;
		border-radius: 14px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	.brand-header {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #222;
		padding-bottom: 0.5rem;
	}

	.brand-title {
		font-size: 1.85rem;
		font-weight: 900;
		color: #fff;
		letter-spacing: 0.1em;
	}

	.brand-subtitle {
		font-size: 0.75rem;
		color: #555;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-cards-list {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.nav-card {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 10px;
		padding: 0.85rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: left;
		transition:
			border-color 0.15s,
			background-color 0.15s;
		box-sizing: border-box;
		text-decoration: none;
		outline: none;
	}

	.nav-card:hover {
		border-color: #3b82f6;
		background-color: #161616;
	}

	.card-meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.card-category {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #64748b;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.card-value {
		font-size: 0.95rem;
		color: #f8fafc;
		font-weight: 700;
	}

	.card-icon {
		width: 38px;
		height: 38px;
		object-fit: cover;
		border: 1px solid #333;
	}

	.circle-icon {
		border-radius: 50%;
	}

	.square-icon {
		border-radius: 8px;
		border-color: #eab308;
	}

	.card-icon-placeholder {
		width: 38px;
		height: 38px;
		background-color: #1f1f1f;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
		font-size: 1.1rem;
		font-weight: bold;
	}

	.circle-placeholder {
		border-radius: 50%;
	}

	.square-placeholder {
		border-radius: 8px;
	}

	.mini-icon-row {
		display: flex;
		gap: 0.25rem;
	}

	.mini-img {
		width: 24px;
		height: 24px;
		object-fit: cover;
		border-radius: 4px;
		background-color: #0d0d0d;
		border: 1px solid #333;
	}

	.circular-img {
		border-radius: 50%;
	}

	.arcana-colors-pills {
		display: flex;
		gap: 0.25rem;
	}

	.color-pill {
		font-size: 0.65rem;
		font-weight: bold;
		color: #fff;
		padding: 0.1rem 0.45rem;
		border-radius: 4px;
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

	/* Custom inputs block styling */
	.meta-customization-box {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 10px;
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.input-element {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.input-element label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #64748b;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	.input-element input {
		background-color: #0d0d0d;
		border: 1px solid #2a2a2a;
		border-radius: 6px;
		color: #fff;
		padding: 0.45rem 0.6rem;
		font-size: 0.8rem;
		outline: none;
		transition: border-color 0.15s;
	}

	.input-element input:focus {
		border-color: #2563eb;
	}

	.export-nav-action {
		background-color: #2563eb;
		color: #fff;
		border: none;
		border-radius: 8px;
		padding: 0.75rem;
		font-size: 0.85rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.15s;
	}

	.export-nav-action:hover {
		background-color: #1d4ed8;
	}
</style>
