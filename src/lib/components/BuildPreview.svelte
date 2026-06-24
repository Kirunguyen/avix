<script lang="ts">
	import type { Hero, Item, Enchantment, Talent, Arcana } from '../types/entities';
	import { groupArcana, calculateTotalArcanaStats } from '../utils/arcana';

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

	// Derived grouped and accumulated data
	const groupedRed = $derived(groupArcana(redArcana));
	const groupedPurple = $derived(groupArcana(purpleArcana));
	const groupedTeal = $derived(groupArcana(tealArcana));

	const allSelectedArcanas = $derived([...redArcana, ...purpleArcana, ...tealArcana]);
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelectedArcanas));
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

	<!-- Gear Layout Section -->
	<div class="gear-row">
		<!-- Armory Bar -->
		<div class="gear-column flex-3">
			<div class="section-title">Armory</div>
			<div class="armory-grid">
				{#each armory as slot, index (index)}
					<button
						class="gear-slot square"
						onclick={() => onRemoveItem(index)}
						title={slot ? `Remove ${slot.name}` : 'Empty'}
					>
						{#if slot}
							<img src="/items/{slot.image}" alt={slot.name} />
						{:else}
							<span class="placeholder">+</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Enchantments Layout -->
		<div class="gear-column flex-1">
			<div class="section-title">Enchantments</div>
			<div class="enchantment-layout">
				<div class="enchantment-row">
					{#each selectedEnchantments.slice(0, 3) as slot, index (index)}
						<button
							class="gear-slot circle"
							onclick={() => onRemoveEnchantment(index)}
							title={slot ? `Remove ${slot.name}` : 'Empty'}
						>
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
						<button
							class="gear-slot circle"
							onclick={() => onRemoveEnchantment(index + 3)}
							title={slot ? `Remove ${slot.name}` : 'Empty'}
						>
							{#if slot}
								<img src="/enchantments/{slot.image}" alt={slot.name} />
							{:else}
								<span class="placeholder">+</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Talent Section -->
		<div class="gear-column flex-1">
			<div class="section-title">Talent</div>
			<div class="talent-container">
				<div class="gear-slot square golden">
					{#if selectedTalent}
						<img
							src="/talents/{selectedTalent.image}"
							alt={selectedTalent.name}
							title={selectedTalent.name}
						/>
					{:else}
						<span class="placeholder">Empty</span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Arcana Config Panel (Clean, compact display optimized for screenshots) -->
	<div class="arcana-display-panel">
		<div class="section-title">Arcana ({allSelectedArcanas.length}/30)</div>

		<!-- Visual Picker Row (Red, Purple, Teal Columns side-by-side) -->
		<div class="arcana-columns-grid">
			<!-- Red Column -->
			<div class="arcana-column red-column">
				<div class="column-title">Red ({redArcana.length}/10)</div>
				<div class="arcana-row">
					{#each groupedRed as group (group.arcana.id)}
						<button
							class="arcana-card"
							onclick={() => onRemoveArcana('red', group.arcana.id)}
							title="Remove 1 {group.arcana.name}"
						>
							<div class="arcana-image-container">
								<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
								<span class="badge">x{group.count}</span>
							</div>
							<span class="arcana-subtext">{group.arcana.displayName}</span>
						</button>
					{:else}
						<span class="empty-text">Empty</span>
					{/each}
				</div>
			</div>

			<!-- Purple Column -->
			<div class="arcana-column purple-column">
				<div class="column-title">Purple ({purpleArcana.length}/10)</div>
				<div class="arcana-row">
					{#each groupedPurple as group (group.arcana.id)}
						<button
							class="arcana-card"
							onclick={() => onRemoveArcana('purple', group.arcana.id)}
							title="Remove 1 {group.arcana.name}"
						>
							<div class="arcana-image-container">
								<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
								<span class="badge">x{group.count}</span>
							</div>
							<span class="arcana-subtext">{group.arcana.displayName}</span>
						</button>
					{:else}
						<span class="empty-text">Empty</span>
					{/each}
				</div>
			</div>

			<!-- Teal Column -->
			<div class="arcana-column teal-column">
				<div class="column-title">Teal ({tealArcana.length}/10)</div>
				<div class="arcana-row">
					{#each groupedTeal as group (group.arcana.id)}
						<button
							class="arcana-card"
							onclick={() => onRemoveArcana('teal', group.arcana.id)}
							title="Remove 1 {group.arcana.name}"
						>
							<div class="arcana-image-container">
								<img src="/arcanas/{group.arcana.image}" alt={group.arcana.name} />
								<span class="badge">x{group.count}</span>
							</div>
							<span class="arcana-subtext">{group.arcana.displayName}</span>
						</button>
					{:else}
						<span class="empty-text">Empty</span>
					{/each}
				</div>
			</div>
		</div>

		<hr class="panel-divider" />

		<!-- Accumulated Stats Table -->
		<div class="stats-table-section">
			<div class="column-title">Accumulated Stats</div>
			{#if accumulatedStats.length > 0}
				<div class="stats-grid-table">
					{#each accumulatedStats as stat}
						<div class="stat-cell">
							<span class="stat-label">{stat.key}</span>
							<span class="stat-value">+{stat.value}</span>
						</div>
					{/each}
				</div>
			{:else}
				<span class="empty-text"
					>No active stats. Equipping arcanas will populate calculations here.</span
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.right-panel-container {
		background-color: #111;
		border: 1px solid #222;
		border-radius: 12px;
		padding: 1.25rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hero-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 1px solid #222;
		padding-bottom: 0.75rem;
	}

	.hero-image {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: 2px solid #3b82f6;
		object-fit: cover;
	}

	.placeholder-hero {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 1px solid #222;
		padding-bottom: 0.75rem;
		color: #555;
	}

	.hero-placeholder-icon {
		font-size: 1.75rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background-color: #1e1e1e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 1.25rem;
		margin: 0;
		font-weight: 700;
	}

	h2 {
		font-size: 1rem;
		margin: 0;
		color: #777;
	}

	/* Gear Layout & Synchronized Sizes */
	.gear-row {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		border-bottom: 1px solid #222;
		padding-bottom: 1rem;
	}

	.gear-column {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.flex-3 {
		flex: 3;
	}
	.flex-1 {
		flex: 1;
	}

	.section-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.armory-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.35rem;
	}

	/* Universal Gear Slot sizing */
	.gear-slot {
		width: 48px;
		height: 48px;
		background: #161616;
		border: 1px dashed #444;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.gear-slot:hover {
		border-color: #3b82f6;
	}

	.gear-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.square {
		border-radius: 6px;
	}

	.circle {
		border-radius: 50%;
	}

	.golden {
		border: 2px solid #eab308;
		cursor: default;
	}

	.placeholder {
		color: #444;
		font-size: 0.85rem;
	}

	.enchantment-layout {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.enchantment-row {
		display: flex;
		justify-content: center;
		gap: 0.35rem;
	}

	.talent-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	/* Arcana Section Grid Panel */
	.arcana-display-panel {
		background: #161616;
		border-radius: 8px;
		padding: 0.85rem;
		border: 1px solid #222;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.arcana-columns-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.arcana-column {
		background: #0d0d0d;
		border-radius: 6px;
		padding: 0.5rem;
		border-top: 3px solid #333;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.red-column {
		border-top-color: #ef4444;
	}
	.purple-column {
		border-top-color: #a855f7;
	}
	.teal-column {
		border-top-color: #14b8a6;
	}

	.column-title {
		font-size: 0.65rem;
		color: #777;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.arcana-row {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	/* Compact Arcana Card block design */
	.arcana-card {
		background: #141414;
		border: 1px solid #252525;
		border-radius: 6px;
		cursor: pointer;
		padding: 0.35rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.arcana-card:hover {
		border-color: #555;
		background-color: #1a1a1a;
	}

	.arcana-image-container {
		position: relative;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arcana-image-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.badge {
		position: absolute;
		bottom: -2px;
		right: -4px;
		background-color: #000;
		color: #fff;
		font-size: 0.6rem;
		padding: 0px 3px;
		border-radius: 3px;
		border: 1px solid #333;
		font-weight: bold;
	}

	.arcana-subtext {
		font-size: 0.6rem;
		color: #888;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.empty-text {
		font-size: 0.65rem;
		color: #444;
		font-style: italic;
	}

	.panel-divider {
		border: 0;
		height: 1px;
		background: #2a2a2a;
		margin: 0.25rem 0;
	}

	/* Accumulated Stats Grid Style Display */
	.stats-table-section {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stats-grid-table {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.25rem 0.5rem;
	}

	.stat-cell {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		background: #0d0d0d;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		border-left: 2px solid #222;
	}

	.stat-label {
		color: #888;
	}

	.stat-value {
		color: #10b981;
		font-weight: bold;
	}
</style>
