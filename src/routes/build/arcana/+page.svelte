<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import ArcanaSelector from '$lib/components/ArcanaSelector.svelte';
	import arcanaListRaw from '$lib/data/arcanas.json';
	import { groupArcana, calculateTotalArcanaStats } from '$lib/utils/arcana';
	import type { Arcana } from '$lib/types/entities';

	const arcanaList = arcanaListRaw as Arcana[];

	// Svelte 5 reactive calculations
	const allSelected = $derived([
		...buildState.redArcana,
		...buildState.purpleArcana,
		...buildState.tealArcana
	]);
	const groupedUnique = $derived(groupArcana(allSelected));
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelected));
</script>

<div class="editor-wrapper">
	<div class="editor-header">
		<a class="back-btn" href={resolve('/')}>← Done</a>
		<h1 class="editor-title">Configure Arcana</h1>
	</div>

	<div class="editor-main-panel">
		<ArcanaSelector arcanas={arcanaList} onSelect={(arcana) => buildState.addArcana(arcana)} />
	</div>

	<!-- HIGHLY COMPACT RESPONSIVE BOTTOM DRAWER -->
	<div class="lightweight-preview">
		<div class="drawer-row upper-row">
			<div class="preview-info-col">
				<span class="preview-label">Equipped Arcana</span>
				<span class="count-text">{allSelected.length} / 30</span>
			</div>

			<!-- Compact Dot Row Summary containing category displays -->
			<div class="compact-gallery-scroll">
				{#each groupedUnique as group (group.arcana.id)}
					<button
						class="compact-pill"
						onclick={() => buildState.removeArcana(group.arcana.color, group.arcana.id)}
						title="Remove 1"
					>
						<span class="color-dot {group.arcana.color}"></span>
						<span class="pill-name">{group.arcana.displayName}</span>
						<span class="pill-badge">x{group.count}</span>
						<span class="pill-clear">×</span>
					</button>
				{:else}
					<span class="empty-state">No arcanas equipped. Tap items above to configure.</span>
				{/each}
			</div>
		</div>

		{#if accumulatedStats.length > 0}
			<hr class="drawer-divider" />
			<!-- Integrated Accumulated Stats block -->
			<div class="stats-dashboard">
				<span class="preview-label">Active Stats Bonus</span>
				<div class="stats-grid">
					{#each accumulatedStats as stat (stat.key)}
						<div class="stat-pill">
							<span class="stat-label">{stat.key}</span>
							<span class="stat-value">+{stat.value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #050505;
		overflow: hidden;
	}

	.editor-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		background-color: #0b0b0b;
		padding: 0.85rem 1.25rem;
		border-bottom: 1px solid #1a1a1a;
	}

	.back-btn {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #ccc;
		padding: 0.4rem 0.85rem;
		border-radius: 6px;
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: all 0.15s;
		outline: none;
	}

	.back-btn:hover {
		background-color: #2563eb;
		color: #fff;
		border-color: #3b82f6;
	}

	.editor-title {
		font-size: 1rem;
		font-weight: bold;
		color: #fff;
		margin: 0;
	}

	.editor-main-panel {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		box-sizing: border-box;
	}

	/* Scale-Optimized Compact Bottom Drawer Layout */
	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 0.85rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		box-sizing: border-box;
		max-height: 35vh;
		overflow-y: auto;
	}

	.drawer-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 768px) {
		.upper-row {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 2rem;
		}
	}

	.preview-info-col {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.preview-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.count-text {
		font-size: 1rem;
		font-weight: 800;
		color: #fff;
	}

	/* Horizontal sliding list of active arcana dots */
	.compact-gallery-scroll {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		scrollbar-width: none;
		width: 100%;
		padding-bottom: 0.15rem;
	}

	.compact-gallery-scroll::-webkit-scrollbar {
		display: none;
	}

	.compact-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 20px;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
		flex-shrink: 0;
		outline: none;
	}

	.compact-pill:hover {
		border-color: #ef4444;
	}

	.color-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.color-dot.red {
		background-color: #ef4444;
	}
	.color-dot.purple {
		background-color: #a855f7;
	}
	.color-dot.teal {
		background-color: #14b8a6;
	}

	.pill-name {
		font-size: 0.7rem;
		color: #bbb;
		font-weight: 600;
	}

	.pill-badge {
		font-size: 0.7rem;
		color: #3b82f6;
		font-weight: bold;
	}

	.pill-clear {
		color: #555;
		font-weight: bold;
		font-size: 0.75rem;
		margin-left: 0.15rem;
	}

	.compact-pill:hover .pill-clear {
		color: #ef4444;
	}

	.drawer-divider {
		border: 0;
		height: 1px;
		background: #1a1a1a;
		margin: 0;
	}

	/* Integrated Statistics Panel */
	.stats-dashboard {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.35rem;
	}

	.stat-pill {
		display: flex;
		justify-content: space-between;
		background-color: #121212;
		border: 1px solid #1a1a1a;
		border-radius: 6px;
		padding: 0.3rem 0.5rem;
		font-size: 0.7rem;
	}

	.stat-label {
		color: #777;
	}

	.stat-value {
		color: #10b981;
		font-weight: bold;
	}

	.empty-state {
		font-size: 0.7rem;
		color: #444;
		font-style: italic;
	}
</style>
