<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import ArcanaSelector from '$lib/components/ArcanaSelector.svelte';
	import arcanaListRaw from '$lib/data/arcanas.json';
	import { calculateTotalArcanaStats } from '$lib/utils/arcana';
	import type { Arcana } from '$lib/types/entities';

	const arcanaList = arcanaListRaw as Arcana[];

	// Svelte 5 states and options
	let activeColor = $state<'all' | 'red' | 'purple' | 'teal'>('all');
	let filterMenuOpen = $state<boolean>(false);
	let actionMenuOpen = $state<boolean>(false);

	const colors = [
		{ id: 'all', display: 'All Colors', color: '#FFD07B' },
		{ id: 'red', display: 'Red Arcanas', color: '#ef4444' },
		{ id: 'purple', display: 'Purple Arcanas', color: '#a855f7' },
		{ id: 'teal', display: 'Teal Arcanas', color: '#14b8a6' }
	] as const;

	const currentColorObj = $derived(colors.find((c) => c.id === activeColor) || colors[0]);

	// Filter imported list based on activeColor dropdown
	const filteredCatalog = $derived(
		activeColor === 'all' ? arcanaList : arcanaList.filter((a) => a.color === activeColor)
	);

	// Svelte 5 reactive calculations
	const allSelected = $derived([
		...buildState.redArcana,
		...buildState.purpleArcana,
		...buildState.tealArcana
	]);
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelected));

	function selectColor(colorId: 'all' | 'red' | 'purple' | 'teal') {
		activeColor = colorId;
		filterMenuOpen = false;
	}

	function handleAction(type: 'clear-all' | 'clear-red' | 'clear-purple' | 'clear-teal') {
		if (type === 'clear-all') {
			buildState.clearAllArcanas();
		} else {
			const color = type.split('-')[1] as 'red' | 'purple' | 'teal';
			buildState.clearArcanaColor(color);
		}
		actionMenuOpen = false;
	}
</script>

<div class="editor-wrapper">
	<!-- Workspace header with Custom Dropdowns moved up -->
	<div class="editor-header">
		<a class="back-btn" href={resolve('/')}>← Done</a>
		<h1 class="editor-title">Configure Arcana</h1>

		<div class="header-filters-row">
			<!-- Dropdown 1: Active Color Filters -->
			<div class="custom-select-box">
				<button
					class="select-trigger"
					onclick={() => {
						filterMenuOpen = !filterMenuOpen;
						actionMenuOpen = false;
					}}
					class:active={filterMenuOpen}
				>
					<div class="trigger-meta">
						<span class="color-indicator" style="background-color: {currentColorObj.color}"></span>
						<span>{currentColorObj.display}</span>
					</div>
					<span class="chevron-arrow">{filterMenuOpen ? '▲' : '▼'}</span>
				</button>

				{#if filterMenuOpen}
					<div class="options-container">
						{#each colors as c (c.id)}
							<button
								class="option-item"
								class:selected={activeColor === c.id}
								onclick={() => selectColor(c.id)}
							>
								<span class="color-indicator" style="background-color: {c.color}"></span>
								<span>{c.display}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Dropdown 2: Fast Clearance Actions -->
			<div class="custom-select-box">
				<button
					class="select-trigger action-trigger"
					onclick={() => {
						actionMenuOpen = !actionMenuOpen;
						filterMenuOpen = false;
					}}
					class:active={actionMenuOpen}
				>
					<span>🧹 Clear Options</span>
					<span class="chevron-arrow">{actionMenuOpen ? '▲' : '▼'}</span>
				</button>

				{#if actionMenuOpen}
					<div class="options-container action-container">
						<button class="option-item text-danger" onclick={() => handleAction('clear-all')}>
							<span>[X] Clear All Arcanas</span>
						</button>
						<button class="option-item" onclick={() => handleAction('clear-red')}>
							<span class="color-indicator" style="background-color: #ef4444"></span>
							<span>Clear Red Arcanas</span>
						</button>
						<button class="option-item" onclick={() => handleAction('clear-purple')}>
							<span class="color-indicator" style="background-color: #a855f7"></span>
							<span>Clear Purple Arcanas</span>
						</button>
						<button class="option-item" onclick={() => handleAction('clear-teal')}>
							<span class="color-indicator" style="background-color: #14b8a6"></span>
							<span>Clear Teal Arcanas</span>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Full-width Selector Grid Panel -->
	<div class="editor-body">
		<ArcanaSelector arcanas={filteredCatalog} onSelect={(arcana) => buildState.addArcana(arcana)} />
	</div>

	<!-- Compact Bottom Drawer (Always-on Accumulated Stats Dashboard) -->
	<div class="lightweight-preview">
		<div class="stats-dashboard">
			<span class="preview-label">Accumulated Arcana Stats ({allSelected.length}/30)</span>
			{#if accumulatedStats.length > 0}
				<div class="stats-grid">
					{#each accumulatedStats as stat (stat.key)}
						<div class="stat-pill">
							<span class="stat-label">{stat.key}</span>
							<span class="stat-value">+{stat.value}</span>
						</div>
					{/each}
				</div>
			{:else}
				<span class="empty-state"
					>No active stats. Equipping arcanas in the left board will populate calculations here.</span
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background-color: #050505;
		overflow: hidden;
		box-sizing: border-box;
	}

	.editor-header {
		display: flex;
		align-items: center;
		background-color: #0b0b0b;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid #1a1a1a;
		height: 54px;
		box-sizing: border-box;
	}

	.back-btn {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #ccc;
		padding: 0.35rem 0.85rem;
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
		margin: 0 0 0 1.25rem;
	}

	/* Sticky Header Filters positioning */
	.header-filters-row {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.custom-select-box {
		position: relative;
	}

	.select-trigger {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 6px;
		color: #e2e8f0;
		padding: 0.35rem 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
		font-weight: 600;
		transition: all 0.15s;
		outline: none;
		gap: 0.5rem;
	}

	.select-trigger:hover,
	.select-trigger.active {
		border-color: #2563eb;
		background-color: #141414;
	}

	.select-trigger.action-trigger:hover,
	.select-trigger.action-trigger.active {
		border-color: #ef4444;
	}

	.trigger-meta {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.color-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.chevron-arrow {
		font-size: 0.5rem;
		color: #555;
	}

	/* Options lists wrapper positioning */
	.options-container {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.25rem;
		background-color: #0d0d0d;
		border: 1px solid #333;
		border-radius: 6px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
		z-index: 100;
		max-height: 220px;
		overflow-y: auto;
		padding: 0.2rem;
		width: 140px;
	}

	.action-container {
		width: 160px;
	}

	.option-item {
		width: 100%;
		background: none;
		border: none;
		border-radius: 4px;
		color: #94a3b8;
		padding: 0.4rem 0.6rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: left;
		transition: all 0.1s;
		outline: none;
	}

	.option-item:hover {
		background-color: #1e293b;
		color: #fff;
	}

	.option-item.selected {
		background-color: rgba(37, 99, 235, 0.15);
		color: #3b82f6;
		border: 1px solid rgba(37, 99, 235, 0.3);
	}

	.text-danger {
		color: #f87171 !important;
	}

	.text-danger:hover {
		background-color: #450a0a !important;
		color: #fff !important;
	}

	/* Full-screen horizontal split body */
	.editor-body {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		box-sizing: border-box;
	}

	/* Full-width Horizontal Bottom Stats Drawer Layout */
	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 0.85rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-sizing: border-box;
		max-height: 25vh;
		overflow-y: auto;
	}

	.preview-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
		display: block;
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
		padding: 0.35rem 0.55rem;
		font-size: 0.7rem;
	}

	.stat-label {
		color: #64748b;
	}

	.stat-value {
		color: #10b981;
		font-weight: bold;
	}

	.empty-state {
		font-size: 0.75rem;
		color: #444;
		font-style: italic;
		line-height: 1.4;
	}
</style>
