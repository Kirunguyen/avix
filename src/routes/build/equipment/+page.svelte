<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import itemListRaw from '$lib/data/items.json';
	import type { Item } from '$lib/types/entities';

	const itemList = itemListRaw as Item[];
</script>

<div class="editor-wrapper">
	<div class="editor-header">
		<button class="back-btn" onclick={() => goto(resolve('/'))}>← Done</button>
		<h1 class="editor-title">Configure Equipment</h1>
	</div>

	<div class="editor-main-panel">
		<ItemSelector items={itemList} onSelect={(item) => buildState.addItem(item)} />
	</div>

	<!-- Lightweight Preview with capacity scale actions -->
	<div class="lightweight-preview">
		<div class="preview-left">
			<span class="preview-label">Equipment Path:</span>
			<div class="capacity-selector">
				<button
					disabled={buildState.armoryCapacity <= 6}
					onclick={() => buildState.changeArmoryCapacity(buildState.armoryCapacity - 1)}>−</button
				>
				<span class="indicator">{buildState.armoryCapacity} Slots</span>
				<button
					disabled={buildState.armoryCapacity >= 12}
					onclick={() => buildState.changeArmoryCapacity(buildState.armoryCapacity + 1)}>+</button
				>
			</div>
		</div>

		<div
			class="armory-interactive-row"
			style="grid-template-columns: repeat({buildState.armoryCapacity}, 1fr)"
		>
			{#each buildState.armory as slot, index (slot ? `${slot.id}-${index}` : `empty-${index}`)}
				<button
					class="interactive-slot"
					onclick={() => buildState.removeItem(index)}
					title={slot ? `Remove ${slot.name}` : 'Empty Slot'}
				>
					{#if slot}
						<img src="/items/{slot.image}" alt="" />
						<div class="delete-overlay">×</div>
					{:else}
						<span class="slot-add">+</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #050505;
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
		padding: 1.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 900px) {
		.lightweight-preview {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 2rem;
		}
	}

	.preview-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.preview-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.capacity-selector {
		display: flex;
		align-items: center;
		background-color: #121212;
		border: 1px solid #333;
		border-radius: 6px;
		overflow: hidden;
		width: fit-content;
	}

	.capacity-selector button {
		background: none;
		border: none;
		color: #fff;
		padding: 0.3rem 0.6rem;
		font-weight: bold;
		cursor: pointer;
	}

	.capacity-selector button:hover:not(:disabled) {
		background-color: #222;
	}

	.capacity-selector button:disabled {
		color: #444;
	}

	.indicator {
		font-size: 0.75rem;
		color: #aaa;
		font-weight: bold;
		padding: 0 0.5rem;
		border-left: 1px solid #333;
		border-right: 1px solid #333;
	}

	.armory-interactive-row {
		display: grid;
		gap: 0.4rem;
		max-width: 600px;
		width: 100%;
	}

	.interactive-slot {
		aspect-ratio: 1;
		background-color: #121212;
		border: 1px dashed #444;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		overflow: hidden;
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
		font-size: 1.15rem;
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
		font-size: 1.5rem;
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
