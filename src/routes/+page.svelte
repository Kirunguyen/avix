<script lang="ts">
	import heroes from '$lib/data/heroes.json';

	type Hero = {
		id: string;
		name: string;
		image: string;
	};

	const heroList = heroes as Hero[];
	let selectedHero = $state(heroList.find((h) => h.id === 'sephera') ?? heroList[0]);
</script>

<div class="container">
	<!-- Left Panel -->
	<div class="hero-list">
		{#each heroList as hero (hero.id)}
			<button class:selected={hero.id === selectedHero.id} onclick={() => (selectedHero = hero)}>
				<img src={`/heroes/${hero.image}`} alt={hero.name} />
			</button>
		{/each}
	</div>

	<!-- Right Panel -->
	<div class="hero-detail">
		<img class="hero-image" src={`/heroes/${selectedHero.image}`} alt={selectedHero.name} />

		<h1>{selectedHero.name}</h1>
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 4fr 6fr;
		height: 100vh;
	}

	.hero-list {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		overflow-y: auto;
		border-right: 1px solid #333;
	}

	.hero-list button {
		padding: 0;
		border: 2px solid transparent;
		background: none;
		cursor: pointer;
	}

	.hero-list button.selected {
		border-color: gold;
	}

	.hero-list img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		display: block;
	}

	.hero-detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.hero-image {
		width: 300px;
		max-width: 80%;
	}

	h1 {
		margin: 0;
	}
</style>
