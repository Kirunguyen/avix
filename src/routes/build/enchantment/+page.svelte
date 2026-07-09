<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import EnchantmentSelector from '$lib/components/EnchantmentSelector.svelte';
	import enchantmentListRaw from '$lib/data/enchantments.json';
	import type { Enchantment } from '$lib/types/entities';

	const enchantmentList = enchantmentListRaw as Enchantment[];
</script>

<div class="editor-wrapper">
	<div class="editor-header">
		<a class="back-btn" href={resolve('/')}>← Done</a>
		<h1 class="editor-title">Configure Enchantments</h1>
	</div>

	<div class="editor-main-panel">
		<EnchantmentSelector
			enchantments={enchantmentList}
			onSelect={(ench) => buildState.addEnchantment(ench)}
		/>
	</div>

	<div class="lightweight-preview">
		<span class="preview-label">Active Enchantments:</span>
		<!-- Sliding scroller guarantees no wrapping cutoff on narrow screens -->
		<div class="interactive-runes-scroller">
			<div class="interactive-runes-row">
				{#each buildState.selectedEnchantments as slot, index (slot ? `ench-preview-${slot.id}-${index}` : `ench-empty-${index}`)}
					<button
						class="interactive-slot"
						onclick={() => buildState.removeEnchantment(index)}
						title={slot ? `Remove ${slot.name}` : 'Empty Slot'}
					>
						{#if slot}
							<img src="/enchantments/{slot.image}" alt="" />
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

	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 0.85rem 1.25rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		box-sizing: border-box;
	}

	.preview-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
		flex-shrink: 0;
	}

	.interactive-runes-scroller {
		flex: 1;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.interactive-runes-scroller::-webkit-scrollbar {
		display: none;
	}

	.interactive-runes-row {
		display: flex;
		gap: 0.5rem;
		min-width: max-content;
	}

	.interactive-slot {
		width: 42px;
		height: 42px;
		background-color: #121212;
		border: 1px dashed #444;
		border-radius: 50%;
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
		width: 80%;
		height: 80%;
		object-fit: contain;
	}

	.interactive-slot:hover {
		border-color: #ef4444;
	}

	.slot-add {
		color: #444;
		font-weight: bold;
		font-size: 0.9rem;
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
