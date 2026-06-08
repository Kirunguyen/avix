<script lang="ts">
	import heroes from '$lib/data/heroes.json';
	import items from '$lib/data/items.json';
	import enchantments from '$lib/data/enchantments.json';
	type Hero = {
		id: string;
		name: string;
		image: string;
	};

	type Item = {
		id: string;
		name: string;
		image: string;
	};

	type Enchantment = {
		id: string;
		name: string;
		image: string;
	};

	const heroList = heroes as Hero[];
	const itemList = items as Item[];
	const enchantmentList = enchantments as Enchantment[];

	let currentPage = $state<'hero' | 'armory' | 'enchantments'>('hero');

	let selectedHero = $state(heroList.find((h) => h.id === 'sephera') ?? heroList[0]);

	let armory = $state<(Item | null)[]>([null, null, null, null, null, null]);

	let selectedEnchantments = $state<(Enchantment | null)[]>([null, null, null, null, null]);

	function addItem(item: Item) {
		const emptySlot = armory.findIndex((slot) => slot === null);

		if (emptySlot !== -1) {
			armory[emptySlot] = item;
		}
	}

	function removeItem(index: number) {
		armory[index] = null;
	}

	function addEnchantment(enchantment: Enchantment) {
		const emptySlot = selectedEnchantments.findIndex((slot) => slot === null);

		if (emptySlot !== -1) {
			selectedEnchantments[emptySlot] = enchantment;
		}
	}

	function removeEnchantment(index: number) {
		selectedEnchantments[index] = null;
	}
</script>

<div class="container">
	<div class="left-panel">
		<div class="nav">
			<button class:selected={currentPage === 'hero'} onclick={() => (currentPage = 'hero')}>
				Hero
			</button>

			<button class:selected={currentPage === 'armory'} onclick={() => (currentPage = 'armory')}>
				Armory
			</button>

			<button
				class:selected={currentPage === 'enchantments'}
				onclick={() => (currentPage = 'enchantments')}
			>
				Enchantments
			</button>
		</div>

		{#if currentPage === 'hero'}
			<div class="icon-grid">
				{#each heroList as hero (hero.id)}
					<button
						class:selected={hero.id === selectedHero.id}
						onclick={() => (selectedHero = hero)}
					>
						<img src={`/heroes/${hero.image}`} alt={hero.name} />
					</button>
				{/each}
			</div>
		{:else if currentPage === 'enchantments'}
			<div class="icon-grid">
				{#each enchantmentList as enchantment (enchantment.id)}
					<button onclick={() => addEnchantment(enchantment)}>
						<img src={`/enchantments/${enchantment.image}`} alt={enchantment.name} />
					</button>
				{/each}
			</div>
		{:else}
			<div class="icon-grid">
				{#each itemList as item (item.id)}
					<button onclick={() => addItem(item)}>
						<img src={`/items/${item.image}`} alt={item.name} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div class="right-panel">
		<img class="hero-image" src={`/heroes/${selectedHero.image}`} alt={selectedHero.name} />

		<h1>{selectedHero.name}</h1>

		<div class="armory-bar">
			{#each armory as slot, index (index)}
				<button class="armory-slot" onclick={() => removeItem(index)}>
					{#if slot}
						<img src={`/items/${slot.image}`} alt={slot.name} />
					{/if}
				</button>
			{/each}
		</div>
		<div class="enchantment-layout">
			<div class="enchantment-row">
				{#each selectedEnchantments.slice(0, 3) as slot, index (index)}
					<button class="enchantment-slot" onclick={() => removeEnchantment(index)}>
						{#if slot}
							<img src={`/enchantments/${slot.image}`} alt={slot.name} />
						{/if}
					</button>
				{/each}
			</div>

			<div class="enchantment-row">
				{#each selectedEnchantments.slice(3, 5) as slot, index (index)}
					<button class="enchantment-slot" onclick={() => removeEnchantment(index + 3)}>
						{#if slot}
							<img src={`/enchantments/${slot.image}`} alt={slot.name} />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 4fr 6fr;
		height: 100vh;
		overflow: hidden;
	}

	.left-panel {
		border-right: 1px solid #333;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.nav {
		display: flex;
		padding: 0.5rem;
		gap: 0.5rem;
		border-bottom: 1px solid #333;
	}

	.nav button.selected {
		font-weight: bold;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		padding: 1rem;
		overflow-y: auto;
		min-height: 0;
	}

	.icon-grid img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.right-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		overflow-y: auto;
		min-height: 0;
	}

	.hero-image {
		width: 250px;
		max-width: 80%;
		max-height: 40vh;
		object-fit: contain;
	}

	.armory-bar {
		display: flex;
		gap: 0.5rem;
	}

	.armory-slot {
		width: 64px;
		height: 64px;
		border: 1px solid #666;
		background: none;
		padding: 0;
		cursor: pointer;
	}

	.armory-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.enchantment-layout {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.enchantment-row {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.enchantment-slot {
		width: 64px;
		height: 64px;
		border: 1px solid #666;
		background: none;
		padding: 0;
		cursor: pointer;
	}

	.enchantment-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
