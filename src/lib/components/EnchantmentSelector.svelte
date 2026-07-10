<script lang="ts">
	import type { Enchantment } from '../types/entities';
	import { buildState } from '$lib/state.svelte';

	// Import Vite-managed category assets
	import afataIcon from '$lib/assets/enchantments/Afata.webp';
	import humanIcon from '$lib/assets/enchantments/League-Of-Humans.webp';
	import lokheimIcon from '$lib/assets/enchantments/Lokheim.webp';
	import vedaIcon from '$lib/assets/enchantments/Veda.webp';

	interface Props {
		enchantments: Enchantment[];
	}

	let { enchantments }: Props = $props();

	// Explicit Category Interface to secure type safety
	interface CategoryOption {
		id: 'Veda' | 'Lokheim' | 'Afata' | 'League of Humans';
		display: string;
		icon: string;
		color: string;
	}

	// Svelte 5 Disjoint Union definition
	type PickerState =
		| { type: 'category'; list: CategoryOption[] }
		| { type: 'enchantment'; list: Enchantment[] };

	const categories: CategoryOption[] = [
		{ id: 'Veda', display: 'Veda', icon: vedaIcon, color: '#F2D95E' },
		{ id: 'Lokheim', display: 'Lokheim', icon: lokheimIcon, color: '#C12817' },
		{ id: 'Afata', display: 'Afata', icon: afataIcon, color: '#B2D246' },
		{ id: 'League of Humans', display: 'Human', icon: humanIcon, color: '#4CA9E2' }
	];

	// Svelte 5 state trackers
	let currentStep = $state<number>(1);

	// Resolve category styles reactively
	function getCategoryMeta(category?: string) {
		if (!category) return { icon: '', color: '#222' };
		const match = categories.find((c) => c.id === category);
		return match ? { icon: match.icon, color: match.color } : { icon: '', color: '#222' };
	}

	// Automatic progression helper on click
	function getNextUnfilledStep() {
		if (!buildState.enchantmentMainCat) return 1;
		if (!buildState.selectedEnchantments[0]) return 2;
		if (!buildState.selectedEnchantments[1]) return 3;
		if (!buildState.selectedEnchantments[2]) return 4;
		if (!buildState.enchantmentSubCat1) return 5;
		if (!buildState.selectedEnchantments[3]) return 6;
		if (!buildState.enchantmentSubCat2) return 7;
		if (!buildState.selectedEnchantments[4]) return 8;
		return 4; // Default to main slot
	}

	// Statically cast the return signatures to solve the compiler union properties lock
	const pickerOptions = $derived.by<PickerState>(() => {
		switch (currentStep) {
			case 1:
				return { type: 'category', list: [...categories] };
			case 2:
				return {
					type: 'enchantment',
					list: enchantments.filter(
						(e) => e.category === buildState.enchantmentMainCat && e.level === 1
					)
				};
			case 3:
				return {
					type: 'enchantment',
					list: enchantments.filter(
						(e) => e.category === buildState.enchantmentMainCat && e.level === 2
					)
				};
			case 4:
				return {
					type: 'enchantment',
					list: enchantments.filter(
						(e) => e.category === buildState.enchantmentMainCat && e.level === 3
					)
				};
			case 5:
				return {
					type: 'category',
					list: categories.filter((c) => c.id !== buildState.enchantmentMainCat)
				};
			case 6:
				return {
					type: 'enchantment',
					list: enchantments.filter(
						(e) => e.category === buildState.enchantmentSubCat1 && e.level === 1
					)
				};
			case 7:
				return {
					type: 'category',
					list: categories.filter((c) => c.id !== buildState.enchantmentMainCat)
				};
			case 8:
				if (buildState.enchantmentSubCat2 === buildState.enchantmentSubCat1) {
					return {
						type: 'enchantment',
						list: enchantments.filter(
							(e) => e.category === buildState.enchantmentSubCat1 && e.level === 2
						)
					};
				} else {
					return {
						type: 'enchantment',
						list: enchantments.filter(
							(e) => e.category === buildState.enchantmentSubCat2 && e.level === 1
						)
					};
				}
			default:
				return { type: 'category', list: [] };
		}
	});

	// Dynamic selections execution handler
	function handleCategorySelect(catId: 'Veda' | 'Lokheim' | 'Afata' | 'League of Humans') {
		if (currentStep === 1) {
			if (buildState.enchantmentMainCat !== catId) {
				buildState.enchantmentMainCat = catId;
				buildState.selectedEnchantments[0] = null;
				buildState.selectedEnchantments[1] = null;
				buildState.selectedEnchantments[2] = null;
			}
			currentStep = 2;
		} else if (currentStep === 5) {
			if (buildState.enchantmentSubCat1 !== catId) {
				buildState.enchantmentSubCat1 = catId;
				buildState.selectedEnchantments[3] = null;
			}
			currentStep = 6;
		} else if (currentStep === 7) {
			if (buildState.enchantmentSubCat2 !== catId) {
				buildState.enchantmentSubCat2 = catId;
				buildState.selectedEnchantments[4] = null;
			}
			currentStep = 8;
		}
	}

	function handleEnchantmentSelect(ench: Enchantment) {
		if (currentStep === 2) {
			buildState.selectedEnchantments[0] = { ...ench };
		} else if (currentStep === 3) {
			buildState.selectedEnchantments[1] = { ...ench };
		} else if (currentStep === 4) {
			buildState.selectedEnchantments[2] = { ...ench };
		} else if (currentStep === 6) {
			buildState.selectedEnchantments[3] = { ...ench };
		} else if (currentStep === 8) {
			buildState.selectedEnchantments[4] = { ...ench };
		}
		currentStep = getNextUnfilledStep();
	}
</script>

<div class="enchantment-split-workspace">
	<!-- Part 1: Symmetrical Vertical Alignment (Centered inside the Panel) -->
	<div class="interactive-map-panel">
		<span class="panel-section-label">Enchantment Build Map</span>

		<div class="map-centered-aligner">
			<!-- Row 1: Core Branch (1-2-3-4) -->
			<div class="map-row-container">
				<div
					class="connector-line"
					style="background-color: {getCategoryMeta(buildState.enchantmentMainCat).color}"
				></div>
				<div class="nodes-row">
					<button
						class="node-circle"
						class:active={currentStep === 1}
						onclick={() => (currentStep = 1)}
						style="border-color: {getCategoryMeta(buildState.enchantmentMainCat).color}"
					>
						{#if buildState.enchantmentMainCat}
							<img
								src={getCategoryMeta(buildState.enchantmentMainCat).icon}
								alt=""
								class="cat-node-img"
							/>
						{:else}
							<span class="slot-idx">1</span>
						{/if}
					</button>

					<button
						class="node-circle"
						class:active={currentStep === 2}
						onclick={() => (currentStep = 2)}
						style="border-color: {getCategoryMeta(buildState.enchantmentMainCat).color}"
					>
						{#if buildState.selectedEnchantments[0]}
							<img src="/enchantments/{buildState.selectedEnchantments[0].image}" alt="" />
						{:else}
							<span class="slot-idx">2</span>
						{/if}
					</button>

					<button
						class="node-circle"
						class:active={currentStep === 3}
						onclick={() => (currentStep = 3)}
						style="border-color: {getCategoryMeta(buildState.enchantmentMainCat).color}"
					>
						{#if buildState.selectedEnchantments[1]}
							<img src="/enchantments/{buildState.selectedEnchantments[1].image}" alt="" />
						{:else}
							<span class="slot-idx">3</span>
						{/if}
					</button>

					<button
						class="node-circle core-circle"
						class:active={currentStep === 4}
						onclick={() => (currentStep = 4)}
						style="border-color: {getCategoryMeta(buildState.enchantmentMainCat).color}"
					>
						{#if buildState.selectedEnchantments[2]}
							<img src="/enchantments/{buildState.selectedEnchantments[2].image}" alt="" />
						{:else}
							<span class="slot-idx">4</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Row 2: Sub-Branches (5-6) and (7-8) -->
			<div class="map-row-container flex-column">
				<div class="sub-branch-group">
					<div
						class="connector-line half-line"
						style="background-color: {getCategoryMeta(buildState.enchantmentSubCat1).color}"
					></div>
					<div class="nodes-row">
						<button
							class="node-circle"
							class:active={currentStep === 5}
							onclick={() => (currentStep = 5)}
							style="border-color: {getCategoryMeta(buildState.enchantmentSubCat1).color}"
						>
							{#if buildState.enchantmentSubCat1}
								<img
									src={getCategoryMeta(buildState.enchantmentSubCat1).icon}
									alt=""
									class="cat-node-img"
								/>
							{:else}
								<span class="slot-idx">5</span>
							{/if}
						</button>

						<button
							class="node-circle"
							class:active={currentStep === 6}
							onclick={() => (currentStep = 6)}
							style="border-color: {getCategoryMeta(buildState.enchantmentSubCat1).color}"
						>
							{#if buildState.selectedEnchantments[3]}
								<img src="/enchantments/{buildState.selectedEnchantments[3].image}" alt="" />
							{/if}
						</button>
					</div>
				</div>

				<div class="sub-branch-group">
					<div
						class="connector-line half-line right-align"
						style="background-color: {getCategoryMeta(buildState.enchantmentSubCat2).color}"
					></div>
					<div class="nodes-row justify-end">
						<button
							class="node-circle"
							class:active={currentStep === 7}
							onclick={() => (currentStep = 7)}
							style="border-color: {getCategoryMeta(buildState.enchantmentSubCat2).color}"
						>
							{#if buildState.enchantmentSubCat2}
								<img
									src={getCategoryMeta(buildState.enchantmentSubCat2).icon}
									alt=""
									class="cat-node-img"
								/>
							{:else}
								<span class="slot-idx">7</span>
							{/if}
						</button>

						<button
							class="node-circle"
							class:active={currentStep === 8}
							onclick={() => (currentStep = 8)}
							style="border-color: {getCategoryMeta(buildState.enchantmentSubCat2).color}"
						>
							{#if buildState.selectedEnchantments[4]}
								<img src="/enchantments/{buildState.selectedEnchantments[4].image}" alt="" />
							{:else}
								<span class="slot-idx">8</span>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Part 2: Options Selection (Full-Width List Item Choices) -->
	<div class="selections-picker-panel">
		<span class="panel-section-label">Available Selections</span>
		<div class="picker-scroll-view">
			{#if pickerOptions.type === 'category'}
				<!-- Render Categories as full-width list entries decorated with colors -->
				<div class="categories-list-picker">
					{#each pickerOptions.list as cat (cat.id)}
						<button
							class="category-choice-row"
							style="border-color: {cat.color}; --hover-bg: {cat.color}15;"
							onclick={() => handleCategorySelect(cat.id)}
						>
							<img src={cat.icon} alt="" />
							<span class="choice-title" style="color: {cat.color}">{cat.display} Category</span>
						</button>
					{/each}
				</div>
			{:else}
				<!-- Render Enchantments choices -->
				<div class="enchantments-picker-list">
					{#each pickerOptions.list as item (item.id)}
						<button class="enchantment-choice-card" onclick={() => handleEnchantmentSelect(item)}>
							<img src="/enchantments/{item.image}" alt="" />
							<div class="choice-meta">
								<span class="choice-title">{item.name}</span>
								<span class="choice-subtitle">Tier {item.level}</span>
							</div>
						</button>
					{:else}
						<span class="no-options-warning">Please complete preceding configurations.</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.enchantment-split-workspace {
		display: grid;
		grid-template-columns: 5.5fr 4.5fr;
		gap: 1.5rem;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.panel-section-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: 800;
		letter-spacing: 0.1em;
		margin-bottom: 0.5rem;
		display: block;
	}

	/* Map Panel Styles with centered alignment wrapper */
	.interactive-map-panel {
		background-color: #0c0d0d;
		border: 1px solid #1a1a1a;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
	}

	.map-centered-aligner {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center; /* Center horizontally/vertically */
		gap: 2rem;
		width: 100%;
		box-sizing: border-box;
	}

	.map-row-container {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		box-sizing: border-box;
	}

	.flex-column {
		flex-direction: row;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.sub-branch-group {
		position: relative;
		width: 46%;
		display: flex;
		align-items: center;
	}

	.connector-line {
		position: absolute;
		left: 5%;
		right: 5%;
		height: 2px;
		background-color: #222;
		z-index: 1;
		transition: background-color 0.2s;
	}

	.half-line {
		left: 10%;
		right: auto;
		width: 80%;
	}

	.right-align {
		right: 10%;
		left: auto;
	}

	.nodes-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: relative;
		z-index: 2;
	}

	/* Circles visual node design */
	.node-circle {
		width: 48px;
		height: 48px;
		background-color: #121212;
		border: 2px dashed #444;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: all 0.15s ease-in-out;
		position: relative;
		overflow: hidden;
	}

	.node-circle:hover {
		border-color: #94a3b8;
		transform: scale(1.05);
	}

	.node-circle.active {
		border-style: solid;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
		transform: scale(1.05);
		background-color: #1a1a1a;
	}

	.core-circle {
		width: 58px;
		height: 58px;
		border-style: solid;
	}

	.node-circle img {
		width: 85%;
		height: 85%;
		object-fit: contain;
	}

	.node-circle .cat-node-img {
		width: 55%;
		height: 60%;
	}

	.slot-idx {
		font-size: 0.75rem;
		color: #444;
		font-weight: bold;
	}

	/* Selection Picker Panel */
	.selections-picker-panel {
		background-color: #0c0d0d;
		border: 1px solid #1a1a1a;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

	.picker-scroll-view {
		flex: 1;
		overflow-y: auto;
		margin-top: 0.5rem;
		padding-right: 0.25rem;
	}

	/* Categories Choice full-width lists */
	.categories-list-picker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-choice-row {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		width: 100%;
		transition: all 0.15s;
	}

	.category-choice-row:hover {
		background-color: var(--hover-bg, #1a1a1a);
	}

	.category-choice-row img {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.choice-title {
		font-size: 0.8rem;
		font-weight: bold;
		color: #fff;
	}

	.enchantments-picker-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.enchantment-choice-card {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.45rem 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		transition: all 0.15s;
		text-align: left;
	}

	.enchantment-choice-card:hover {
		border-color: #444;
		background-color: #1a1a1a;
	}

	.enchantment-choice-card img {
		width: 34px;
		height: 34px;
		object-fit: contain;
	}

	.choice-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
	}

	.choice-subtitle {
		font-size: 0.65rem;
		color: #555;
		font-weight: bold;
		text-transform: uppercase;
	}

	.no-options-warning {
		font-size: 0.75rem;
		color: #444;
		font-style: italic;
		text-align: center;
		display: block;
		margin-top: 4rem;
	}
</style>
