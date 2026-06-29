<script lang="ts">
	import type { Hero, Item, Enchantment, Talent, Arcana } from '../types/entities';
	import { groupArcana, calculateTotalArcanaStats } from '../utils/arcana';
	import { toPng } from 'html-to-image';

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
		// Prop interfaces to allow parent to manage armory scaling
		isExpandedArmory: boolean;
		onToggleArmoryExpansion: () => void;
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
		onRemoveArcana,
		isExpandedArmory,
		onToggleArmoryExpansion
	}: Props = $props();

	// Derived grouped and accumulated stats
	const groupedRed = $derived(groupArcana(redArcana));
	const groupedPurple = $derived(groupArcana(purpleArcana));
	const groupedTeal = $derived(groupArcana(tealArcana));

	const allSelectedArcanas = $derived([...redArcana, ...purpleArcana, ...tealArcana]);
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelectedArcanas));

	let exportElement = $state<HTMLElement | null>(null);
	let isExporting = $state<boolean>(false);

	async function exportBuildAsImage() {
		if (!exportElement) return;
		isExporting = true;

		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			const dataUrl = await toPng(exportElement, {
				backgroundColor: '#111111',
				style: {
					borderRadius: '0px',
					transform: 'scale(1)'
				},
				cacheBust: true
			});

			const link = document.createElement('a');
			const heroName = selectedHero ? selectedHero.name.toLowerCase() : 'build';
			link.download = `avix-${heroName}-build.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Failed to export image:', error);
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="build-preview-wrapper">
	<div class="preview-actions">
		<button class="export-btn" onclick={exportBuildAsImage} disabled={isExporting}>
			{#if isExporting}
				<span class="spinner"></span> Generating...
			{:else}
				📥 Download Build Image
			{/if}
		</button>
	</div>

	<!-- Capture Container Target -->
	<div class="right-panel-container" bind:this={exportElement} class:exporting={isExporting}>
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
		<div class="gear-row" class:compact-armory-view={isExpandedArmory}>
			<!-- Armory Bar -->
			<div class="gear-column flex-3">
				<div class="section-title-container">
					<div class="section-title">Armory</div>
					<button
						class="expand-armory-btn"
						class:expanded={isExpandedArmory}
						onclick={onToggleArmoryExpansion}
						title={isExpandedArmory ? 'Reduce to 6 slots' : 'Expand to 10 slots'}
					>
						{isExpandedArmory ? '− 6 Slots' : '+ 10 Slots'}
					</button>
				</div>
				<div class="armory-grid" class:expanded-slots={isExpandedArmory}>
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

		<!-- Arcana Display Section -->
		<div class="arcana-display-panel">
			<div class="section-title">Arcana ({allSelectedArcanas.length}/30)</div>

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

			<!-- Accumulated Stats Grid Table -->
			<div class="stats-table-section">
				<div class="column-title">Accumulated Stats</div>
				{#if accumulatedStats.length > 0}
					<div class="stats-grid-table">
						{#each accumulatedStats as stat (stat.key)}
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

		<!-- Watermarked Indicator only visible on generated PNG -->
		<div class="brand-watermark">
			<span>AVIX Build Planner</span>
		</div>
	</div>
</div>

<style>
	.build-preview-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.preview-actions {
		display: flex;
		justify-content: flex-end;
	}

	.export-btn {
		background-color: #2563eb;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background-color 0.2s;
	}

	.export-btn:hover:not(:disabled) {
		background-color: #1d4ed8;
	}

	.export-btn:disabled {
		background-color: #1e3a8a;
		color: #93c5fd;
		cursor: not-allowed;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.right-panel-container {
		background-color: #111;
		border: 1px solid #222;
		border-radius: 12px;
		padding: 1.25rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		position: relative;
	}

	.right-panel-container.exporting {
		border: none;
		border-radius: 0px;
		box-shadow: none;
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

	.section-title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.section-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		font-weight: bold;
	}

	.expand-armory-btn {
		background: #111;
		border: 1px solid #059669;
		color: #34d399;
		font-size: 0.6rem;
		padding: 0.15rem 0.35rem;
		border-radius: 4px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.15s;
	}

	.expand-armory-btn:hover {
		background: #065f46;
		color: #fff;
	}

	.expand-armory-btn.expanded {
		border-color: #ef4444;
		color: #f87171;
	}

	.expand-armory-btn.expanded:hover {
		background: #991b1b;
		color: #fff;
	}

	.armory-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.35rem;
	}

	/* Compact grid view for 10 items */
	.armory-grid.expanded-slots {
		grid-template-columns: repeat(5, 1fr);
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

	/* Scale slot sizes down to maintain layout sync when expanded */
	.compact-armory-view .gear-slot {
		width: 36px;
		height: 36px;
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

	.compact-armory-view .placeholder {
		font-size: 0.7rem;
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

	.brand-watermark {
		display: none;
		text-align: center;
		font-size: 0.65rem;
		color: #444;
		margin-top: 0.25rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.right-panel-container.exporting .brand-watermark {
		display: block;
	}
</style>
