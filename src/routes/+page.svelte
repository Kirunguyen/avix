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

<!-- Mobile Portrait Orientation Warning -->
<div class="orientation-warning">
	<div class="warning-box">
		<span class="warning-icon">🔄</span>
		<p>For the PC parallel build layout, please rotate your device to landscape mode.</p>
	</div>
</div>

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
		overflow-x: hidden;
	}

	/* Layout Base rules */
	.planner-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		padding: 0.75rem;
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* Parallel Desktop & rotated mobile landscape styling (typically >640px wide) */
	@media (min-width: 640px) {
		.planner-layout {
			grid-template-columns: 1.1fr 0.9fr;
			gap: 1.25rem;
			padding: 1.25rem;
			height: 100vh;
			overflow: hidden; /* Avoids screen scrollbar */
		}

		.left-panel,
		.right-panel {
			height: calc(100vh - 2.5rem);
			overflow-y: auto;
			box-sizing: border-box;
		}
	}

	@media (min-width: 1024px) {
		.planner-layout {
			grid-template-columns: 1.2fr 0.8fr;
		}
	}

	.left-panel {
		background-color: #0b0b0b;
		border: 1px solid #222;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	.selector-container {
		margin-top: 0.5rem;
		flex: 1;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #333 #111;
	}

	/* Ensure scroll container is smooth */
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

	/* Orientation Warning Overlays */
	.orientation-warning {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(5, 5, 5, 0.98);
		z-index: 9999;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		text-align: center;
		box-sizing: border-box;
	}

	.warning-box {
		max-width: 320px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.warning-icon {
		font-size: 3rem;
		animation: rotate 2.5s infinite ease-in-out;
	}

	.warning-box p {
		font-size: 0.95rem;
		line-height: 1.5;
		color: #aaa;
		margin: 0;
	}

	@keyframes rotate {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(90deg);
		}
	}

	/* Activate warning on mobile screens when strictly held vertically (Portrait) */
	@media (max-width: 950px) and (orientation: portrait) {
		.orientation-warning {
			display: flex;
		}
	}
</style>
