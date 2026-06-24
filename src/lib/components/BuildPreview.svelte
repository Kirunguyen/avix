<script lang="ts">
	import type { Hero, Item, Enchantment, Talent, Arcana } from '../types/entities';
	import { groupArcana } from '../utils/arcana';

	interface Props {
		selectedHero: Hero | null;
		armory: (Item | null)[];
		selectedEnchantments: (Enchantment | null)[];
		selectedTalent: Talent | null;
		redArcana: Arcana[];
		purpleArcana: Arcana[];
		tealArcana: Arcana[];
		onRemoveItem: (index: number) => void;
		onRemoveEnchantment: (index: number) => void;
		onRemoveArcana: (color: 'red' | 'purple' | 'teal', arcanaId: string) => void;
	}

	let {
		selectedHero,
		armory,
		selectedEnchantments,
		selectedTalent,
		redArcana,
		purpleArcana,
		tealArcana,
		onRemoveItem,
		onRemoveEnchantment,
		onRemoveArcana
	}: Props = $props();

	// Reactively compute the grouped arcanas
	const groupedRed = $derived(groupArcana(redArcana));
	const groupedPurple = $derived(groupArcana(purpleArcana));
	const groupedTeal = $derived(groupArcana(tealArcana));
</script>

<div class="right-panel-container">
	{#if selectedHero}
		<div class="hero-header">
			<img class="hero-image" src="/heroes/{selectedHero.image}" alt={selectedHero.name} />
			<h1>{selectedHero.name}</h1>
		</div>
	{:else}
		<div class="placeholder-hero">
			<div class="hero-placeholder-icon">👤</div>
			<h2>No Hero Selected</h2>
		</div>
	{/if}

	<!-- Armory Bar -->
	<div class="section-title">Armory</div>
	<div class="armory-bar">
		{#each armory as slot, index (index)}
			<button class="armory-slot" onclick={() => onRemoveItem(index)} title={slot ? `Remove ${slot.name}` : 'Empty Slot'}>
				{#if slot}
					<img src="/items/{slot.image}" alt={slot.name} />
				{:else}
					<span class="placeholder">+</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Enchantments Grid -->
	<div class="section-title">Enchantments</div>
	<div class="enchantment-layout">
		<div class="enchantment-row">
			{#each selectedEnchantments.slice(0, 3) as slot, index (index)}
				<button class="enchantment-slot" onclick={() => onRemoveEnchantment(index)} title={slot ? `Remove ${slot.name}` : 'Empty Slot'}>
					{#if slot}
						<img src="/enchantments/{slot.image}" alt={slot.name} />
					{:else}
						<span class="placeholder">+</span>
					{/if}
				</button>
			{/each}
		</div>

		<div class="enchantment-row">
			{#each selectedEnchantments.slice(3, 5) as slot, index (index)}
				<button class="enchantment-slot" onclick={() => onRemoveEnchantment(index + 3)} title={slot ? `Remove ${slot.name}` : 'Empty Slot'}>
					{#if slot}
						<img src="/enchantments/{slot.image}" alt={slot.name} />
					{:else}
						<span class="placeholder">+</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Talent Section -->
	<div class="section-title">Talent</div>
	<div class="talent-section">
		<div class="talent-slot">
			{#if selectedTalent}
				<img src="/talents/{selectedTalent.image}" alt={selectedTalent.name} title={selectedTalent.name} />
			{:else}
				<span class="placeholder">No Talent</span>
			{/if}
		</div>
	</div>

	<!-- Arcana Grid Section -->
	<div class="section-title">Arcana ({redArcana.length + purpleArcana.length + tealArcana.length}/30)</div>
	<div class="arcana-section">
		<!-- Red Arcana Column -->
		<div class="arcana-column red-column">
			<div class="column-title">Red ({redArcana.length}/10)</div>
			<div class="arcana-row">
				{#each groupedRed as group (group.arcana.id)}
					<button class="arcana-card" onclick={() => onRemoveArcana('red', group.arcana.id)} title="Remove 1 {group.arcana.name}">
						<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
						<span class="badge">x{group.count}</span>
					</button>
				{:else}
					<span class="empty-text">Empty</span>
				{/each}
			</div>
		</div>

		<!-- Purple Arcana Column -->
		<div class="arcana-column purple-column">
			<div class="column-title">Purple ({purpleArcana.length}/10)</div>
			<div class="arcana-row">
				{#each groupedPurple as group (group.arcana.id)}
					<button class="arcana-card" onclick={() => onRemoveArcana('purple', group.arcana.id)} title="Remove 1 {group.arcana.name}">
						<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
						<span class="badge">x{group.count}</span>
					</button>
				{:else}
					<span class="empty-text">Empty</span>
				{/each}
			</div>
		</div>

		<!-- Teal Arcana Column -->
		<div class="arcana-column teal-column">
			<div class="column-title">Teal ({tealArcana.length}/10)</div>
			<div class="arcana-row">
				{#each groupedTeal as group (group.arcana.id)}
					<button class="arcana-card" onclick={() => onRemoveArcana('teal', group.arcana.id)} title="Remove 1 {group.arcana.name}">
						<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
						<span class="badge">x{group.count}</span>
					</button>
				{:else}
					<span class="empty-text">Empty</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.right-panel-container {
		background-color: #111;
		border: 1px solid #222;
		border-radius: 12px;
		padding: 1.5rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid #222;
		padding-bottom: 1rem;
	}

	.hero-image {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		border: 2px solid #3b82f6;
		object-fit: cover;
	}

	.placeholder-hero {
		display: flex;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid #222;
		padding-bottom: 1rem;
		color: #555;
	}

	.hero-placeholder-icon {
		font-size: 2.5rem;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background-color: #1e1e1e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0;
		font-weight: 700;
	}

	h2 {
		font-size: 1.25rem;
		margin: 0;
		color: #777;
	}

	.section-title {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		font-weight: bold;
		margin-bottom: -0.5rem;
	}

	.armory-bar {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.5rem;
	}

	.armory-slot {
		aspect-ratio: 1;
		background: #1a1a1a;
		border: 1px dashed #444;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.armory-slot:hover {
		border-color: #3b82f6;
	}

	.armory-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		color: #555;
		font-size: 1.25rem;
	}

	.enchantment-layout {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.enchantment-row {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.enchantment-slot {
		width: 48px;
		height: 48px;
		background: #1a1a1a;
		border: 1px dashed #444;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.enchantment-slot:hover {
		border-color: #10b981;
	}

	.enchantment-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.talent-section {
		display: flex;
		justify-content: center;
	}

	.talent-slot {
		width: 60px;
		height: 60px;
		background: #1a1a1a;
		border: 2px solid #eab308;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.talent-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.arcana-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.arcana-column {
		background: #161616;
		border-radius: 8px;
		padding: 0.75rem;
		border-left: 3px solid #333;
	}

	.red-column { border-left-color: #ef4444; }
	.purple-column { border-left-color: #a855f7; }
	.teal-column { border-left-color: #14b8a6; }

	.column-title {
		font-size: 0.75rem;
		color: #777;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.arcana-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.arcana-card {
		position: relative;
		width: 44px;
		height: 44px;
		background: #222;
		border: 1px solid #444;
		border-radius: 6px;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.1s;
	}

	.arcana-card:hover {
		transform: scale(1.05);
	}

	.arcana-card img {
		width: 85%;
		height: 85%;
		object-fit: contain;
	}

	.badge {
		position: absolute;
		bottom: -2px;
		right: -2px;
		background-color: #000;
		color: #fff;
		font-size: 0.65rem;
		padding: 1px 4px;
		border-radius: 4px;
		border: 1px solid #444;
		font-weight: bold;
	}

	.empty-text {
		font-size: 0.75rem;
		color: #444;
		font-style: italic;
	}
</style>
