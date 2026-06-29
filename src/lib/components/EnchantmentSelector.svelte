<script lang="ts">
	import type { Enchantment } from '../types/entities';

	// Import Vite-managed category assets
	import afataIcon from '$lib/assets/enchantments/Afata.png';
	import humanIcon from '$lib/assets/enchantments/League-Of-Humans.png';
	import lokheimIcon from '$lib/assets/enchantments/Lokheim.png';
	import vedaIcon from '$lib/assets/enchantments/Veda.png';

	interface Props {
		enchantments: Enchantment[];
		onSelect: (enchantment: Enchantment) => void;
	}

	let { enchantments, onSelect }: Props = $props();

	// Category configuration with Vite-resolved asset bindings
	const categories = [
		{ id: 'Veda', display: 'Veda', icon: vedaIcon, color: '#F2D95E' },
		{ id: 'Lokheim', display: 'Lokheim', icon: lokheimIcon, color: '#C12817' },
		{ id: 'Afata', display: 'Afata', icon: afataIcon, color: '#B2D246' },
		{ id: 'League of Humans', display: 'Human', icon: humanIcon, color: '#4CA9E2' }
	] as const;

	let activeCategory = $state<string>('Veda');

	// Sort and filter configurations
	const level1Items = $derived(
		enchantments
			.filter((e) => e.category === activeCategory && e.level === 1)
			.sort((a, b) => a.number - b.number)
	);

	const level2Items = $derived(
		enchantments
			.filter((e) => e.category === activeCategory && e.level === 2)
			.sort((a, b) => a.number - b.number)
	);

	const level3Items = $derived(
		enchantments
			.filter((e) => e.category === activeCategory && e.level === 3)
			.sort((a, b) => a.number - b.number)
	);
</script>

<div class="enchantment-selector-wrapper">
	<!-- Category Buttons Header Section -->
	<div class="category-header-grid">
		{#each categories as cat (cat.id)}
			<button
				class="cat-tab-btn"
				class:active={activeCategory === cat.id}
				style="--cat-color: {cat.color}"
				onclick={() => (activeCategory = cat.id)}
			>
				<img src={cat.icon} alt={cat.display} class="category-icon" />
				<span class="category-label">{cat.display}</span>
			</button>
		{/each}
	</div>

	<!-- Level Hierarchy Layout Display Section -->
	<div class="tier-hierarchy-layout">
		<!-- Tier Level I Row -->
		<div class="tier-section">
			<div class="tier-heading">I</div>
			<div class="tier-row">
				{#each level1Items as item (item.id)}
					<button class="enchantment-btn" onclick={() => onSelect(item)} title={item.name}>
						<img src="/enchantments/{item.image}" alt={item.name} loading="lazy" />
						<span class="enchantment-name">{item.name}</span>
					</button>
				{:else}
					<span class="empty-state">No Tier I enchantments.</span>
				{/each}
			</div>
		</div>

		<hr class="tier-divider" />

		<!-- Tier Level II Row -->
		<div class="tier-section">
			<div class="tier-heading">II</div>
			<div class="tier-row">
				{#each level2Items as item (item.id)}
					<button class="enchantment-btn" onclick={() => onSelect(item)} title={item.name}>
						<img src="/enchantments/{item.image}" alt={item.name} loading="lazy" />
						<span class="enchantment-name">{item.name}</span>
					</button>
				{:else}
					<span class="empty-state">No Tier II enchantments.</span>
				{/each}
			</div>
		</div>

		<hr class="tier-divider" />

		<!-- Tier Level III Row -->
		<div class="tier-section">
			<div class="tier-heading">III</div>
			<div class="tier-row">
				{#each level3Items as item (item.id)}
					<button class="enchantment-btn" onclick={() => onSelect(item)} title={item.name}>
						<img src="/enchantments/{item.image}" alt={item.name} loading="lazy" />
						<span class="enchantment-name">{item.name}</span>
					</button>
				{:else}
					<span class="empty-state">No Tier III enchantments.</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.enchantment-selector-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Four equal columns header bar */
	.category-header-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.4rem;
		padding: 0 0.25rem;
	}

	.cat-tab-btn {
		background: #141414;
		border: 1px solid #252525;
		color: #888;
		padding: 0.5rem 0.25rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		transition: all 0.15s ease-in-out;
	}

	.cat-tab-btn:hover {
		color: #eee;
		border-color: #444;
	}

	.cat-tab-btn.active {
		background: rgba(20, 20, 20, 0.4);
		border: 1px solid var(--cat-color);
		color: var(--cat-color);
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.6);
	}

	.category-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
		filter: grayscale(40%);
		transition: filter 0.15s;
	}

	.cat-tab-btn.active .category-icon {
		filter: grayscale(0%);
	}

	.category-label {
		font-size: 0.7rem;
		font-weight: bold;
	}

	/* Tiered Row System styling */
	.tier-hierarchy-layout {
		background: #0d0d0d;
		border: 1px solid #1f1f1f;
		border-radius: 10px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.tier-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.tier-heading {
		font-family: 'Times New Roman', Times, serif;
		font-size: 1.25rem;
		font-weight: bold;
		color: #444;
		width: 24px;
		text-align: center;
		user-select: none;
	}

	.tier-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		flex: 1;
	}

	.enchantment-btn {
		background: #141414;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.4rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition:
			border-color 0.15s,
			transform 0.1s;
		max-width: 180px;
		flex: 1;
		min-width: 130px;
	}

	.enchantment-btn:hover {
		border-color: #444;
		transform: translateY(-1px);
	}

	.enchantment-btn img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		border-radius: 4px;
	}

	.enchantment-name {
		font-size: 0.65rem;
		color: #bbb;
		text-align: left;
		line-height: 1.2;
		font-weight: 600;
	}

	.tier-divider {
		border: 0;
		height: 1px;
		background: #1a1a1a;
		margin: 0;
	}

	.empty-state {
		font-size: 0.65rem;
		color: #444;
		font-style: italic;
	}
</style>
