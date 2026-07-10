<script lang="ts">
	import type { Item } from '../types/entities';

	interface Props {
		items: Item[];
		onSelect: (item: Item) => void;
	}

	let { items, onSelect }: Props = $props();

	// Defensive runtime image extension replacement helper
	function toWebp(path: string): string {
		if (!path) return '';
		return path.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
	}
</script>

<div class="item-selector-wrapper">
	<!-- Render Grid -->
	<div class="icon-grid">
		{#each items as item (item.id)}
			<button onclick={() => onSelect(item)} title={item.name} class="item-btn">
				<div class="img-container">
					<img src="/items/{toWebp(item.image)}" alt={item.name} loading="lazy" />
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
		width: 100%;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
		gap: 0.6rem;
		padding: 0.25rem;
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
		box-sizing: border-box;
	}

	.item-btn:hover {
		border-color: #444;
		transform: translateY(-1px);
	}

	.img-container {
		position: relative;
		width: 44px;
		height: 44px;
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
		font-weight: 600;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		color: #555;
		font-size: 0.8rem;
		padding: 2rem 0;
	}
</style>
