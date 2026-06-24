<script lang="ts">
	import type { Talent } from '../types/entities';

	interface Props {
		talents: Talent[];
		selectedTalent: Talent | null;
		onSelect: (talent: Talent) => void;
	}

	let { talents, selectedTalent, onSelect }: Props = $props();
</script>

<div class="icon-grid">
	{#each talents as talent (talent.id)}
		<button
			class:selected={selectedTalent?.id === talent.id}
			onclick={() => onSelect(talent)}
			title={talent.name}
		>
			<img src="/talents/{talent.image}" alt={talent.name} loading="lazy" />
			<span class="talent-name">{talent.name}</span>
		</button>
	{/each}
</div>

<style>
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 0.75rem;
		padding: 0.5rem;
	}

	button {
		background: #1a1a1a;
		border: 2px solid #333;
		border-radius: 8px;
		padding: 0.25rem;
		cursor: pointer;
		transition: border-color 0.2s, transform 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	button:hover {
		border-color: #555;
		transform: translateY(-2px);
	}

	button.selected {
		border-color: #3b82f6;
		background: #1e293b;
	}

	img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 4px;
	}

	.talent-name {
		font-size: 0.75rem;
		color: #ccc;
		margin-top: 0.25rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	button.selected .talent-name {
		color: #60a5fa;
		font-weight: bold;
	}
</style>
