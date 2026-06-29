<script lang="ts">
	import type { Item } from '../types/entities';

	interface Props {
		items: Item[];
		onSelect: (item: Item) => void;
	}

	let { items, onSelect }: Props = $props();

	// Filter state
	let activeCategory = $state<string>('Attack');
	let activeLevel = $state<string>('All');

	const categories = ['Attack', 'Magic', 'Defense', 'Movement', 'Jungling', 'Support'];
	const levels = [
		{ val: 'All', label: 'All Levels' },
		{ val: '1', label: 'Lvl 1' },
		{ val: '2', label: 'Lvl 2' },
		{ val: '3', label: 'Lvl 3' }
	];

	// Derived and sorted list
	const filteredItems = $derived(
		items
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
</script>

<div class="item-selector-wrapper">
	<!-- Category Navigation Header -->
	<div class="filter-row categories-bar">
		{#each categories as cat (cat)}
			<button
				class:active={activeCategory === cat}
				onclick={() => (activeCategory = cat)}
				class="cat-btn"
			>
				{cat}
			</button>
		{/each}
	</div>

	<!-- Level Filters Header -->
	<div class="filter-row levels-bar">
		{#each levels as lvl (lvl.val)}
			<button
				class:active={activeLevel === lvl.val}
				onclick={() => (activeLevel = lvl.val)}
				class="lvl-btn"
			>
				{lvl.label}
			</button>
		{/each}
	</div>

	<!-- Render Grid -->
	<div class="icon-grid">
		{#each filteredItems as item (item.id)}
			<button onclick={() => onSelect(item)} title={item.name} class="item-btn">
				<div class="img-container">
					<img src="/items/{item.image}" alt={item.name} loading="lazy" />
					<span class="level-badge">L{item.level}</span>
				</div>
				<span class="item-name">{item.name}</span>
			</button>
		{:else}
			<div class="empty-state">No items match your selected filters.</div>
		{/each}
	</div>
</div>

<style>
	.item-selector-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0 0.5rem;
	}

	.categories-bar .cat-btn {
		background: #1e1e1e;
		border: 1px solid #333;
		color: #999;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.15s;
	}

	.categories-bar .cat-btn:hover {
		color: #fff;
		border-color: #555;
	}

	.categories-bar .cat-btn.active {
		background: #2563eb;
		color: #fff;
		border-color: #3b82f6;
	}

	.levels-bar .lvl-btn {
		background: #111;
		border: 1px solid #222;
		color: #777;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.75rem;
		transition: all 0.15s;
	}

	.levels-bar .lvl-btn:hover {
		color: #bbb;
		border-color: #444;
	}

	.levels-bar .lvl-btn.active {
		background: #333;
		color: #fff;
		border-color: #555;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
		gap: 0.6rem;
		padding: 0.5rem;
	}

	.item-btn {
		background: #141414;
		border: 1px solid #252525;
		border-radius: 8px;
		padding: 0.35rem 0.2rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			transform 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		justify-content: space-between;
		min-height: 94px;
	}

	.item-btn:hover {
		border-color: #444;
		transform: translateY(-1px);
	}

	.img-container {
		position: relative;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.img-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
	}

	.level-badge {
		position: absolute;
		bottom: -2px;
		right: -4px;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid #333;
		font-size: 0.55rem;
		color: #aaa;
		padding: 0px 3px;
		border-radius: 3px;
		font-weight: bold;
	}

	.item-name {
		font-size: 0.7rem;
		color: #bbb;
		margin-top: 0.35rem;
		text-align: center;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		width: 100%;
		height: 24px;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		color: #555;
		font-size: 0.8rem;
		padding: 2rem 0;
	}
</style>
