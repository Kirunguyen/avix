<script lang="ts">
	import type { Arcana } from '../types/entities';
	import { buildState } from '$lib/state.svelte';

	interface Props {
		arcanas: Arcana[];
		onSelect: (arcana: Arcana) => void;
	}

	let { arcanas, onSelect }: Props = $props();

	// Active configuration states
	let activeColor = $state<'all' | 'red' | 'purple' | 'teal'>('all');
	let filterMenuOpen = $state<boolean>(false);
	let actionMenuOpen = $state<boolean>(false);

	// Custom color options metadata
	const colors = [
		{ id: 'all', display: 'All Colors', color: '#3b82f6' },
		{ id: 'red', display: 'Red Arcanas', color: '#ef4444' },
		{ id: 'purple', display: 'Purple Arcanas', color: '#a855f7' },
		{ id: 'teal', display: 'Teal Arcanas', color: '#14b8a6' }
	] as const;

	const currentColorObj = $derived(colors.find((c) => c.id === activeColor) || colors[0]);

	const filteredArcanas = $derived(
		activeColor === 'all' ? arcanas : arcanas.filter((a) => a.color === activeColor)
	);

	function selectColor(colorId: 'all' | 'red' | 'purple' | 'teal') {
		activeColor = colorId;
		filterMenuOpen = false;
	}

	function handleAction(type: 'clear-all' | 'clear-red' | 'clear-purple' | 'clear-teal') {
		if (type === 'clear-all') {
			buildState.redArcana = [];
			buildState.purpleArcana = [];
			buildState.tealArcana = [];
		} else {
			const color = type.split('-')[1] as 'red' | 'purple' | 'teal';
			buildState.clearArcanaColor(color);
		}
		actionMenuOpen = false;
	}
</script>

<div class="arcana-selector-wrapper">
	<!-- Twin Menu Filter Row -->
	<div class="filters-bar">
		<!-- Dropdown 1: Active Color Filters -->
		<div class="select-dropdown-container">
			<button
				class="dropdown-trigger"
				onclick={() => {
					filterMenuOpen = !filterMenuOpen;
					actionMenuOpen = false;
				}}
				class:active={filterMenuOpen}
			>
				<div class="trigger-label">
					<span class="color-indicator" style="background-color: {currentColorObj.color}"></span>
					<span>{currentColorObj.display}</span>
				</div>
				<span class="chevron">{filterMenuOpen ? '▲' : '▼'}</span>
			</button>

			{#if filterMenuOpen}
				<div class="dropdown-menu">
					{#each colors as c (c.id)}
						<button
							class="menu-item"
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
		<div class="select-dropdown-container">
			<button
				class="dropdown-trigger action-trigger"
				onclick={() => {
					actionMenuOpen = !actionMenuOpen;
					filterMenuOpen = false;
				}}
				class:active={actionMenuOpen}
			>
				<span>🧹 Clear Options</span>
				<span class="chevron">{actionMenuOpen ? '▲' : '▼'}</span>
			</button>

			{#if actionMenuOpen}
				<div class="dropdown-menu">
					<button class="menu-item text-danger" onclick={() => handleAction('clear-all')}>
						<span>[X] Clear All Arcanas</span>
					</button>
					<button class="menu-item" onclick={() => handleAction('clear-red')}>
						<span class="color-indicator" style="background-color: #ef4444"></span>
						<span>Clear Red Arcanas</span>
					</button>
					<button class="menu-item" onclick={() => handleAction('clear-purple')}>
						<span class="color-indicator" style="background-color: #a855f7"></span>
						<span>Clear Purple Arcanas</span>
					</button>
					<button class="menu-item" onclick={() => handleAction('clear-teal')}>
						<span class="color-indicator" style="background-color: #14b8a6"></span>
						<span>Clear Teal Arcanas</span>
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Arcana Grid Catalog -->
	<div class="icon-grid">
		{#each filteredArcanas as arcana (arcana.id)}
			<button
				class="arcana-card {arcana.color}"
				onclick={() => onSelect(arcana)}
				title={arcana.name}
			>
				<img src="/arcanas/{arcana.image}" alt={arcana.name} loading="lazy" />
				<span class="arcana-name">{arcana.name}</span>
				<span class="arcana-displayName">{arcana.displayName}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.arcana-selector-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Double Dropdown Layout Row */
	.filters-bar {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
		background-color: #0b0b0b;
		border: 1px solid #1f1f1f;
		border-radius: 12px;
		padding: 0.75rem;
	}

	@media (min-width: 600px) {
		.filters-bar {
			grid-template-columns: 1.2fr 0.8fr;
			gap: 1rem;
		}
	}

	.select-dropdown-container {
		position: relative;
		width: 100%;
	}

	.dropdown-trigger {
		width: 100%;
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		color: #e2e8f0;
		padding: 0.55rem 0.85rem;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		outline: none;
		box-sizing: border-box;
	}

	.dropdown-trigger:hover,
	.dropdown-trigger.active {
		border-color: #2563eb;
		background-color: #141414;
	}

	.action-trigger:hover,
	.action-trigger.active {
		border-color: #ef4444;
	}

	.trigger-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.color-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.chevron {
		font-size: 0.6rem;
		color: #555;
	}

	/* Options Menu */
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.25rem;
		background-color: #0d0d0d;
		border: 1px solid #333;
		border-radius: 8px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
		z-index: 100;
		padding: 0.25rem;
	}

	.menu-item {
		width: 100%;
		background: none;
		border: none;
		border-radius: 6px;
		color: #94a3b8;
		padding: 0.45rem 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: left;
		transition: all 0.15s;
		outline: none;
	}

	.menu-item:hover {
		background-color: #1e293b;
		color: #fff;
	}

	.menu-item.selected {
		background-color: rgba(37, 99, 235, 0.15);
		color: #3b82f6;
	}

	.text-danger {
		color: #f87171 !important;
	}

	.text-danger:hover {
		background-color: #450a0a !important;
		color: #fff !important;
	}

	/* Catalog Grid Layout */
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		gap: 0.5rem;
		padding: 0.25rem;
	}

	.arcana-card {
		background: #141414;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.4rem 0.2rem;
		cursor: pointer;
		transition: all 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		min-height: 96px;
		box-sizing: border-box;
	}

	.arcana-card:hover {
		transform: translateY(-1px);
	}

	.arcana-card.red:hover {
		border-color: #ef4444;
	}
	.arcana-card.purple:hover {
		border-color: #a855f7;
	}
	.arcana-card.teal:hover {
		border-color: #14b8a6;
	}

	.arcana-card img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.arcana-name {
		font-size: 0.65rem;
		color: #eee;
		font-weight: 700;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.arcana-displayName {
		font-size: 0.55rem;
		color: #666;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
</style>
