<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import HeroSelector from '$lib/components/HeroSelector.svelte';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import EnchantmentSelector from '$lib/components/EnchantmentSelector.svelte';
	import TalentSelector from '$lib/components/TalentSelector.svelte';
	import ArcanaSelector from '$lib/components/ArcanaSelector.svelte';
	import BuildPreview from '$lib/components/BuildPreview.svelte';

	import heroListRaw from '$lib/data/heroes.json';
	import itemListRaw from '$lib/data/items.json';
	import enchantmentListRaw from '$lib/data/enchantments.json';
	import talentListRaw from '$lib/data/talents.json';
	import arcanaListRaw from '$lib/data/arcanas.json';

	import type { Hero, Item, Enchantment, Talent, Arcana } from '$lib/types/entities';

	const heroList = heroListRaw as Hero[];
	const itemList = itemListRaw as Item[];
	const enchantmentList = enchantmentListRaw as Enchantment[];
	const talentList = talentListRaw as Talent[];
	const arcanaList = arcanaListRaw as Arcana[];

	let currentPage = $state<string>('hero');
	let selectedHero = $state<Hero | null>(heroList[0] || null);
	let armory = $state<(Item | null)[]>([null, null, null, null, null, null]);
	let selectedEnchantments = $state<(Enchantment | null)[]>([null, null, null, null, null]);
	let selectedTalent = $state<Talent | null>(talentList[0] || null);

	let redArcana = $state<Arcana[]>([]);
	let purpleArcana = $state<Arcana[]>([]);
	let tealArcana = $state<Arcana[]>([]);

	function handlePageChange(page: string) {
		currentPage = page;
	}

	function handleSelectHero(hero: Hero) {
		selectedHero = hero;
	}

	function handleAddItem(item: Item) {
		const freeIdx = armory.indexOf(null);
		if (freeIdx !== -1) {
			armory[freeIdx] = item;
		}
	}

	function handleRemoveItem(index: number) {
		armory[index] = null;
	}

	function handleAddEnchantment(enchantment: Enchantment) {
		const freeIdx = selectedEnchantments.indexOf(null);
		if (freeIdx !== -1) {
			selectedEnchantments[freeIdx] = enchantment;
		}
	}

	function handleRemoveEnchantment(index: number) {
		selectedEnchantments[index] = null;
	}

	function handleSelectTalent(talent: Talent) {
		selectedTalent = talent;
	}

	function handleAddArcana(arcana: Arcana) {
		if (arcana.color === 'red' && redArcana.length < 10) {
			redArcana = [...redArcana, arcana];
		} else if (arcana.color === 'purple' && purpleArcana.length < 10) {
			purpleArcana = [...purpleArcana, arcana];
		} else if (arcana.color === 'teal' && tealArcana.length < 10) {
			tealArcana = [...tealArcana, arcana];
		}
	}

	function handleRemoveArcana(color: 'red' | 'purple' | 'teal', arcanaId: string) {
		if (color === 'red') {
			const idx = redArcana.findIndex((a) => a.id === arcanaId);
			if (idx !== -1) redArcana = redArcana.filter((_, i) => i !== idx);
		} else if (color === 'purple') {
			const idx = purpleArcana.findIndex((a) => a.id === arcanaId);
			if (idx !== -1) purpleArcana = purpleArcana.filter((_, i) => i !== idx);
		} else if (color === 'teal') {
			const idx = tealArcana.findIndex((a) => a.id === arcanaId);
			if (idx !== -1) tealArcana = tealArcana.filter((_, i) => i !== idx);
		}
	}
</script>

<div class="planner-layout">
	<div class="left-panel">
		<Navbar {currentPage} onPageChange={handlePageChange} />

		<div class="selector-container">
			{#if currentPage === 'hero'}
				<HeroSelector heroes={heroList} {selectedHero} onSelect={handleSelectHero} />
			{:else if currentPage === 'armory'}
				<ItemSelector items={itemList} onSelect={handleAddItem} />
			{:else if currentPage === 'enchantments'}
				<EnchantmentSelector enchantments={enchantmentList} onSelect={handleAddEnchantment} />
			{:else if currentPage === 'talents'}
				<TalentSelector talents={talentList} {selectedTalent} onSelect={handleSelectTalent} />
			{:else if currentPage === 'arcana'}
				<ArcanaSelector arcanas={arcanaList} onSelect={handleAddArcana} />
			{/if}
		</div>
	</div>

	<div class="right-panel">
		<BuildPreview
			{selectedHero}
			{armory}
			{selectedEnchantments}
			{selectedTalent}
			{redArcana}
			{purpleArcana}
			{tealArcana}
			onRemoveItem={handleRemoveItem}
			onRemoveEnchantment={handleRemoveEnchantment}
			onRemoveArcana={handleRemoveArcana}
		/>
	</div>
</div>

<style>
	:global(body) {
		background-color: #050505;
		color: #e5e5e5;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		margin: 0;
		padding: 0;
	}

	.planner-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 1rem;
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* Parallel workspace display activated on desktop screens */
	@media (min-width: 1024px) {
		.planner-layout {
			grid-template-columns: 1.25fr 0.75fr;
			gap: 2rem;
			padding: 2rem;
			height: 100vh;
			overflow: hidden;
		}

		.left-panel,
		.right-panel {
			height: calc(100vh - 4rem);
			overflow-y: auto;
			box-sizing: border-box;
		}
	}

	.left-panel {
		background-color: #0b0b0b;
		border: 1px solid #222;
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
	}

	.selector-container {
		margin-top: 1rem;
		max-height: 60vh;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #333 #111;
	}

	@media (min-width: 1024px) {
		.selector-container {
			max-height: none;
			flex: 1;
		}
	}

	.selector-container::-webkit-scrollbar {
		width: 5px;
	}

	.selector-container::-webkit-scrollbar-track {
		background: #111;
	}

	.selector-container::-webkit-scrollbar-thumb {
		background: #333;
		border-radius: 3px;
	}
</style>
