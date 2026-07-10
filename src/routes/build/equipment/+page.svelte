<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import itemListRaw from '$lib/data/items.json';
	import type { Item } from '$lib/types/entities';

	const itemList = itemListRaw as Item[];

	// Filter state
	let activeCategory = $state<string>('Attack');
	let activeLevel = $state<string>('All');

	// Toggle states for custom dropdowns
	let categoryMenuOpen = $state<boolean>(false);
	let levelMenuOpen = $state<boolean>(false);

	const categories = ['Attack', 'Magic', 'Defense', 'Movement', 'Jungling', 'Support'];
	const levels = [
		{ val: 'All', label: 'All Levels' },
		{ val: '1', label: 'Lvl 1' },
		{ val: '2', label: 'Lvl 2' },
		{ val: '3', label: 'Lvl 3' }
	];

	const currentLevelObj = $derived(levels.find((l) => l.val === activeLevel) || levels[0]);

	// Derived and sorted list
	const filteredItems = $derived(
		itemList
			.filter((item) => {
				const matchesCategory = item.category === activeCategory;
				const matchesLevel = activeLevel === 'All' || item.level.toString() === activeLevel;
				return matchesCategory && matchesLevel;
			})
			.sort((a, b) => {
				if (a.level !== b.level) {
					return a.level - b.level;
				}
				return a.number - b.number;
			})
	);

	function toggleCategoryMenu() {
		categoryMenuOpen = !categoryMenuOpen;
		if (categoryMenuOpen) levelMenuOpen = false;
	}

	function toggleLevelMenu() {
		levelMenuOpen = !levelMenuOpen;
		if (levelMenuOpen) categoryMenuOpen = false;
	}

	function selectCategory(cat: string) {
		activeCategory = cat;
		categoryMenuOpen = false;
	}

	function selectLevel(lvlVal: string) {
		activeLevel = lvlVal;
		levelMenuOpen = false;
	}

	// Defensive runtime image extension replacement helper
	function toWebp(path: string): string {
		if (!path) return '';
		return path.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
	}
</script>

<div class="editor-wrapper">
	<!-- Workspace header -->
	<div class="editor-header">
		<button class="back-btn" onclick={() => goto(resolve('/'))}>← Done</button>
		<h1 class="editor-title">Configure Equipment</h1>

		<div class="header-filters-row">
			<!-- Category Select Dropdown (Attack default) -->
			<div class="custom-select-box">
				<button class="select-trigger" onclick={toggleCategoryMenu} class:active={categoryMenuOpen}>
					<span>Category: {activeCategory}</span>
					<span class="chevron-arrow">{categoryMenuOpen ? '▲' : '▼'}</span>
				</button>
				{#if categoryMenuOpen}
					<div class="options-container">
						{#each categories as cat (cat)}
							<button
								class="option-item"
								class:selected={activeCategory === cat}
								onclick={() => selectCategory(cat)}
							>
								<span>{cat}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Level Select Dropdown (All default) -->
			<div class="custom-select-box">
				<button class="select-trigger" onclick={toggleLevelMenu} class:active={levelMenuOpen}>
					<span>{currentLevelObj.label}</span>
					<span class="chevron-arrow">{levelMenuOpen ? '▲' : '▼'}</span>
				</button>
				{#if levelMenuOpen}
					<div class="options-container">
						{#each levels as lvl (lvl.val)}
							<button
								class="option-item"
								class:selected={activeLevel === lvl.val}
								onclick={() => selectLevel(lvl.val)}
							>
								<span>{lvl.label}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Workspace main selector body -->
	<div class="editor-body">
		<div class="picker-panel">
			<ItemSelector items={filteredItems} onSelect={(item) => buildState.addItem(item)} />
		</div>

		<!-- Compact, space-saving horizontal footer (No more row-splitting, strictly stacked vertical details) -->
		<div class="lightweight-preview">
			<div class="preview-header-bar">
				<div class="preview-left">
					<span class="preview-label">Capacity</span>
					<div class="capacity-selector">
						<button
							disabled={buildState.armoryCapacity <= 6}
							onclick={() => buildState.changeArmoryCapacity(buildState.armoryCapacity - 1)}
							>−</button
						>
						<span class="indicator">{buildState.armoryCapacity} slots</span>
						<button
							disabled={buildState.armoryCapacity >= 12}
							onclick={() => buildState.changeArmoryCapacity(buildState.armoryCapacity + 1)}
							>+</button
						>
					</div>
				</div>
			</div>

			<!-- 1 single horizontal scrolling row containing fixed 42px slots -->
			<div class="armory-interactive-wrapper">
				<div class="interactive-grid-row">
					{#each buildState.armory as slot, index (slot ? `preview-equip-${slot.id}-${index}` : `empty-equip-${index}`)}
						<button
							class="interactive-slot"
							onclick={() => buildState.removeItem(index)}
							title={slot ? `Remove ${slot.name}` : 'Empty Slot'}
						>
							{#if slot}
								<img src="/items/{toWebp(slot.image)}" alt="" />
								<div class="delete-overlay">×</div>
							{:else}
								<span class="slot-add">+</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
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
		box-sizing: border-box;
		overflow: hidden;
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
		transition: all 0.15s;
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

	/* 2-panel horizontal split */
	.editor-body {
		display: grid;
		grid-template-columns: 1fr;
		height: calc(100vh - 54px);
		width: 100%;
	}

	@media (min-width: 1024px) {
		.editor-body {
			grid-template-columns: 75% 25%;
		}
	}

	.picker-panel {
		overflow-y: auto;
		padding: 1rem;
		box-sizing: border-box;
		border-right: 1px solid #141414;
	}

	/* Strictly stacked bottom preview, taking full-width horizontally */
	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column; /* ALWAYS stacked vertically */
		gap: 0.5rem;
		box-sizing: border-box;
		width: 100vw; /* full screen width */
	}

	.preview-header-bar {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.preview-left {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.preview-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.capacity-selector {
		display: flex;
		align-items: center;
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 6px;
		overflow: hidden;
		width: fit-content;
	}

	.capacity-selector button {
		background: none;
		border: none;
		color: #fff;
		padding: 0.2rem 0.55rem;
		font-weight: bold;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.capacity-selector button:hover:not(:disabled) {
		background-color: #222;
	}

	.capacity-selector button:disabled {
		color: #444;
	}

	.indicator {
		font-size: 0.7rem;
		color: #aaa;
		font-weight: bold;
		padding: 0 0.45rem;
		border-left: 1px solid #222;
		border-right: 1px solid #222;
	}

	/* Dynamic horizontal scrolling bar */
	.armory-interactive-wrapper {
		width: 100%;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.armory-interactive-wrapper::-webkit-scrollbar {
		display: none;
	}

	.interactive-grid-row {
		display: flex;
		gap: 0.35rem;
		min-width: max-content;
	}

	.interactive-slot {
		width: 42px;
		height: 42px;
		background-color: #121212;
		border: 1px dashed #444;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
	}

	.interactive-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.interactive-slot:hover {
		border-color: #ef4444;
	}

	.slot-add {
		color: #444;
		font-weight: bold;
		font-size: 1rem;
	}

	.delete-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(239, 68, 68, 0.85);
		color: #fff;
		font-weight: bold;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.interactive-slot:hover .delete-overlay {
		opacity: 1;
	}
</style>
