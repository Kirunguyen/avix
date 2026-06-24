<script lang="ts">
	import type { Arcana } from '../types/entities';

	interface Props {
		arcanas: Arcana[];
		onSelect: (arcana: Arcana) => void;
	}

	let { arcanas, onSelect }: Props = $props();

	let activeColor = $state<'all' | 'red' | 'purple' | 'teal'>('all');

	const filteredArcanas = $derived(
		activeColor === 'all' ? arcanas : arcanas.filter((a) => a.color === activeColor)
	);
</script>

<div class="color-filters">
	<button class:active={activeColor === 'all'} onclick={() => (activeColor = 'all')}>All</button>
	<button class:active={activeColor === 'red'} class="red-btn" onclick={() => (activeColor = 'red')}>Red</button>
	<button class:active={activeColor === 'purple'} class="purple-btn" onclick={() => (activeColor = 'purple')}>Purple</button>
	<button class:active={activeColor === 'teal'} class="teal-btn" onclick={() => (activeColor = 'teal')}>Teal</button>
</div>

<div class="icon-grid">
	{#each filteredArcanas as arcana (arcana.id)}
		<button class="arcana-card {arcana.color}" onclick={() => onSelect(arcana)} title={arcana.name}>
			<img src="/arcanas/{arcana.image}" alt={arcana.name} loading="lazy" />
			<span class="arcana-name">{arcana.name}</span>
			<span class="arcana-display-name">{arcana.displayName}</span>
		</button>
	{/each}
</div>

<style>
	.color-filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0 0.5rem;
	}

	.color-filters button {
		background: #1e1e1e;
		border: 1px solid #333;
		color: #aaa;
		padding: 0.35rem 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s;
	}

	.color-filters button:hover {
		color: #fff;
		border-color: #555;
	}

	.color-filters button.active {
		color: #fff;
		border-width: 1.5px;
	}

	.color-filters button.active.red-btn { border-color: #ef4444; background: #450a0a; }
	.color-filters button.active.purple-btn { border-color: #a855f7; background: #3b0764; }
	.color-filters button.active.teal-btn { border-color: #14b8a6; background: #042f2e; }
	.color-filters button.active:not(.red-btn):not(.purple-btn):not(.teal-btn) { border-color: #3b82f6; background: #1e293b; }

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.75rem;
		padding: 0.5rem;
	}

	.arcana-card {
		background: #1a1a1a;
		border: 2px solid #333;
		border-radius: 8px;
		padding: 0.5rem 0.25rem;
		cursor: pointer;
		transition: border-color 0.2s, transform 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		min-height: 110px;
		justify-content: space-between;
	}

	.arcana-card:hover {
		transform: translateY(-2px);
	}

	.arcana-card.red:hover { border-color: #ef4444; }
	.arcana-card.purple:hover { border-color: #a855f7; }
	.arcana-card.teal:hover { border-color: #14b8a6; }

	img {
		width: 48px;
		height: 48px;
		object-fit: contain;
		margin-bottom: 0.25rem;
	}

	.arcana-name {
		font-size: 0.75rem;
		font-weight: bold;
		color: #fff;
		text-align: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arcana-display-name {
		font-size: 0.65rem;
		color: #888;
		margin-top: 0.15rem;
		text-align: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
