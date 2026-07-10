<script lang="ts">
	import type { Arcana } from '../types/entities';
	import type { GridSlot } from './types';
	import ArcanaGrid from './ArcanaGrid.svelte';

	interface Props {
		color: 'red' | 'purple' | 'teal';
		equipped: Arcana[];
		onRemove: () => void;
	}

	let { color, equipped, onRemove }: Props = $props();

	// Dynamically maps slot states reactively up to 10
	const slots = $derived.by<GridSlot[]>(() => {
		const result: GridSlot[] = [];
		for (let i = 0; i < 10; i++) {
			result.push({
				index: i + 1,
				arcana: i < equipped.length ? equipped[i] : null
			});
		}
		return result;
	});

	const colorLabels = {
		red: { text: 'Red', hex: '#ef4444' },
		purple: { text: 'Purple', hex: '#a855f7' },
		teal: { text: 'Teal', hex: '#14b8a6' }
	};
</script>

<div class="arcana-section-block">
	<div class="section-title-bar">
		<span class="section-color-label" style="color: {colorLabels[color].hex}">
			{colorLabels[color].text} Arcana
		</span>
		<span class="section-progress-text">{equipped.length} / 10</span>
	</div>
	<ArcanaGrid {slots} {color} {onRemove} />
</div>

<style>
	.arcana-section-block {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.section-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
		max-width: 180px; /* Aligns matching with slots width boundaries */
	}

	.section-color-label {
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section-progress-text {
		font-size: 0.65rem;
		color: #555;
		font-weight: bold;
	}
</style>
