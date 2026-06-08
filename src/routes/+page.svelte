<script lang="ts">
	import heroes from '$lib/data/heroes.json';
	import items from '$lib/data/items.json';
	import enchantments from '$lib/data/enchantments.json';
	import talents from '$lib/data/talents.json';
	import arcanas from '$lib/data/arcanas.json';
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
	type Talent = {
		id: string;
		name: string;
		image: string;
	};

	type ArcanaColor = 'red' | 'purple' | 'teal';

	type Arcana = {
		id: string;
		name: string;
		color: ArcanaColor;
		image: string;
	};
	const heroList = heroes as Hero[];
	const itemList = items as Item[];
	const enchantmentList = enchantments as Enchantment[];
	const talentList = talents as Talent[];
	const arcanaList = arcanas as Arcana[];
	let currentPage = $state<'hero' | 'armory' | 'enchantments' | 'talents' | 'arcana'>('hero');

	let selectedHero = $state(heroList.find((h) => h.id === 'sephera') ?? heroList[0]);

	let armory = $state<(Item | null)[]>([null, null, null, null, null, null]);

	let selectedEnchantments = $state<(Enchantment | null)[]>([null, null, null, null, null]);

	let selectedTalent = $state(talentList.find((t) => t.id === 'talent05_flicker') ?? talentList[0]);

	let redArcana = $state<Arcana[]>([]);
	let purpleArcana = $state<Arcana[]>([]);
	let tealArcana = $state<Arcana[]>([]);

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

	function addArcana(arcana: Arcana) {
		switch (arcana.color) {
			case 'red':
				if (redArcana.length < 10) redArcana.push(arcana);
				break;

			case 'purple':
				if (purpleArcana.length < 10) purpleArcana.push(arcana);
				break;

			case 'teal':
				if (tealArcana.length < 10) tealArcana.push(arcana);
				break;
		}
	}

	function removeArcana(color: ArcanaColor, arcanaId: string) {
		let targetList: Arcana[];

		switch (color) {
			case 'red':
				targetList = redArcana;
				break;

			case 'purple':
				targetList = purpleArcana;
				break;

			default:
				targetList = tealArcana;
		}

		const index = targetList.findIndex((a) => a.id === arcanaId);

		if (index !== -1) {
			targetList.splice(index, 1);
		}
	}
	function groupArcana(list: Arcana[]) {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const grouped = new Map();

		for (const arcana of list) {
			const existing = grouped.get(arcana.id);

			if (existing) {
				existing.count++;
			} else {
				grouped.set(arcana.id, {
					arcana,
					count: 1
				});
			}
		}

		return Array.from(grouped.values());
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

			<button class:selected={currentPage === 'talents'} onclick={() => (currentPage = 'talents')}>
				Talents
			</button>

			<button class:selected={currentPage === 'arcana'} onclick={() => (currentPage = 'arcana')}>
				Arcana
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
		{:else if currentPage === 'talents'}
			<div class="icon-grid">
				{#each talentList as talent (talent.id)}
					<button onclick={() => (selectedTalent = talent)}>
						<img src={`/talents/${talent.image}`} alt={talent.name} />
					</button>
				{/each}
			</div>
		{:else if currentPage === 'arcana'}
			<div class="icon-grid">
				{#each arcanaList as arcana (arcana.id)}
					<button onclick={() => addArcana(arcana)}>
						<img src={`/arcanas/${arcana.image}`} alt={arcana.name} />
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

		<div class="talent-section">
			<h3>Talent</h3>

			<div class="talent-slot">
				<img src={`/talents/${selectedTalent.image}`} alt={selectedTalent.name} />
			</div>
		</div>

		<div class="arcana-section">
			<div class="arcana-column">
				<h3>Red</h3>

				<div class="arcana-row">
					{#each groupArcana(redArcana) as group (group.arcana.id)}
						<button class="arcana-card" onclick={() => removeArcana('red', group.arcana.id)}>
							<img src={`/arcanas/${group.arcana.image}`} alt={group.arcana.name} />

							<span>x{group.count}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="arcana-column">
				<h3>Purple</h3>

				<div class="arcana-row">
					{#each groupArcana(purpleArcana) as group (group.arcana.id)}
						<button class="arcana-card" onclick={() => removeArcana('purple', group.arcana.id)}>
							<img src={`/arcanas/${group.arcana.image}`} alt={group.arcana.name} />

							<span>x{group.count}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="arcana-column">
				<h3>Teal</h3>

				<div class="arcana-row">
					{#each groupArcana(tealArcana) as group (group.arcana.id)}
						<button class="arcana-card" onclick={() => removeArcana('teal', group.arcana.id)}>
							<img src={`/arcanas/${group.arcana.image}`} alt={group.arcana.name} />

							<span>x{group.count}</span>
						</button>
					{/each}
				</div>
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
		width: 128px;
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
	.talent-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.talent-slot {
		width: 64px;
		height: 64px;
		border: 1px solid #666;
	}

	.talent-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.arcana-section {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		width: 100%;
		margin-top: 1rem;
	}

	.arcana-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.arcana-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.arcana-card {
		width: 72px;
		height: 90px;

		display: flex;
		flex-direction: column;
		align-items: center;

		border: 1px solid #666;
		background: none;
		cursor: pointer;
	}

	.arcana-card img {
		width: 64px;
		height: 64px;
		object-fit: cover;
	}

	.arcana-card span {
		font-size: 0.8rem;
	}
</style>
