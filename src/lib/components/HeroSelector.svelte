<script lang="ts">
	import type { Hero } from '../types/entities';

	interface Props {
		heroes: Hero[];
		selectedHero: Hero | null;
		onSelect: (hero: Hero) => void;
	}

	let { heroes, selectedHero, onSelect }: Props = $props();
</script>

<div class="hero-selector-wrapper">
	<!-- Hero Grid Section -->
	<div class="icon-grid">
		{#each heroes as hero (hero.id)}
			<button
				class="hero-btn"
				class:selected={selectedHero?.id === hero.id}
				onclick={() => onSelect(hero)}
				title={hero.name}
			>
				<div class="image-wrapper">
					<img src="/heroes/icons/{hero.image}" alt={hero.name} loading="lazy" />
				</div>
				<span class="hero-name">{hero.name}</span>
			</button>
		{:else}
			<div class="empty-results-state">No heroes match the selected filters.</div>
		{/each}
	</div>
</div>

<style>
	.hero-selector-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	/* Grid Layout Styling */
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
		gap: 0.65rem;
		padding: 0.25rem;
	}

	.hero-btn {
		background: #141414;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.35rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			transform 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		box-sizing: border-box;
	}

	.hero-btn:hover {
		border-color: #444;
		transform: translateY(-2px);
	}

	.hero-btn.selected {
		border-color: #3b82f6;
		background: #1e293b;
	}

	.image-wrapper {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 4px;
		overflow: hidden;
		background-color: #090909;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-name {
		font-size: 0.7rem;
		color: #bbb;
		margin-top: 0.35rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		font-weight: 600;
	}

	.hero-btn.selected .hero-name {
		color: #60a5fa;
		font-weight: bold;
	}

	.empty-results-state {
		grid-column: 1 / -1;
		text-align: center;
		color: #444;
		font-style: italic;
		font-size: 0.8rem;
		padding: 3rem 0;
	}
</style>
