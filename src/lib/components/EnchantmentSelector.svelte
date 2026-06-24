<script lang="ts">
	import type { Enchantment } from '../types/entities';

	interface Props {
		enchantments: Enchantment[];
		onSelect: (enchantment: Enchantment) => void;
	}

	let { enchantments, onSelect }: Props = $props();
</script>

<div class="icon-grid">
	{#each enchantments as enchantment (enchantment.id)}
		<button onclick={() => onSelect(enchantment)} title={enchantment.name}>
			<img src="/enchantments/{enchantment.image}" alt={enchantment.name} loading="lazy" />
			<span class="enchantment-name">{enchantment.name}</span>
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

	img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 4px;
	}

	.enchantment-name {
		font-size: 0.75rem;
		color: #ccc;
		margin-top: 0.25rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
</style>
