<script lang="ts">
	import type { GridSlot } from './types';

	interface Props {
		slots: GridSlot[];
		color: 'red' | 'purple' | 'teal';
		onRemove: () => void;
	}

	let { slots, color, onRemove }: Props = $props();
</script>

<div class="arcana-grid-2x5">
	{#each slots as slot (slot.index)}
		{#if slot.arcana}
			<button
				type="button"
				class="slot-circle filled {color}"
				onclick={onRemove}
				title="Remove 1 {slot.arcana.name}"
			>
				<img src="/arcanas/{slot.arcana.image.replace(/\.png$/i, '.webp')}" alt="" />
			</button>
		{:else}
			<div class="slot-circle empty {color}"></div>
		{/if}
	{/each}
</div>

<style>
	.arcana-grid-2x5 {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.35rem;
		width: fit-content;
	}

	.slot-circle {
		width: clamp(24px, 4.5vw, 32px);
		height: clamp(24px, 4.5vw, 32px);
		border-radius: 50%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.slot-circle.empty {
		border: 1.5px dashed #333;
		background-color: #111;
	}

	/* Symmetrical color indicators */
	.slot-circle.empty.red {
		border-color: rgba(239, 68, 68, 0.4);
	}
	.slot-circle.empty.purple {
		border-color: rgba(168, 85, 247, 0.4);
	}
	.slot-circle.empty.teal {
		border-color: rgba(20, 184, 166, 0.4);
	}

	.slot-circle.filled {
		cursor: pointer;
		background-color: #1a1a1a;
		outline: none;
		transition:
			border-color 0.12s,
			box-shadow 0.12s;
	}

	.slot-circle.filled.red {
		border: 1.5px solid #ef4444;
		box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
	}
	.slot-circle.filled.purple {
		border: 1.5px solid #a855f7;
		box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
	}
	.slot-circle.filled.teal {
		border: 1.5px solid #14b8a6;
		box-shadow: 0 0 6px rgba(20, 184, 166, 0.4);
	}

	.slot-circle.filled img {
		width: 85%;
		height: 85%;
		object-fit: contain;
	}
</style>
