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
		armoryCapacity: number;
		onChangeArmoryCapacity: (capacity: number) => void;
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
		armoryCapacity,
		onChangeArmoryCapacity
	}: Props = $props();

	// Custom configuration fields
	let buildName = $state<string>('');
	let authorName = $state<string>('');

	// Derived calculations for arcana displays
	const groupedRed = $derived(groupArcana(redArcana));
	const groupedPurple = $derived(groupArcana(purpleArcana));
	const groupedTeal = $derived(groupArcana(tealArcana));

	const allSelectedArcanas = $derived([...redArcana, ...purpleArcana, ...tealArcana]);
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelectedArcanas));

	// Group unique Arcanas to evaluate threshold-based layout profiles
	const uniqueArcanaGroups = $derived(groupArcana(allSelectedArcanas));
	const uniqueArcanaCount = $derived(uniqueArcanaGroups.length);

	// Automatically resolve display rendering modes
	const arcanaDisplayMode = $derived(
		uniqueArcanaCount <= 3 ? 'icon' : uniqueArcanaCount <= 6 ? 'compact' : 'text'
	);

	let exportElement = $state<HTMLElement | null>(null);
	let isExporting = $state<boolean>(false);

	async function downloadBuildCard() {
		if (!exportElement) return;
		isExporting = true;

		try {
			await new Promise((resolve) => setTimeout(resolve, 150));

			const dataUrl = await toPng(exportElement, {
				width: 1028,
				height: 1028,
				style: {
					transform: 'scale(1)',
					left: '0',
					top: '0',
					visibility: 'visible',
					position: 'relative'
				},
				cacheBust: true
			});

			const link = document.createElement('a');
			const heroSafe = selectedHero
				? selectedHero.name.replace(/\s+/g, '-').toLowerCase()
				: 'build';
			link.download = `avix-build-${heroSafe}.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Error generating image export:', error);
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="build-preview-wrapper">
	<!-- Customization and Download Controls -->
	<div class="preview-card-controls">
		<div class="control-inputs">
			<input
				type="text"
				bind:value={buildName}
				placeholder="Enter build name (e.g. Full Burst Mage)"
				maxlength="28"
			/>
			<input type="text" bind:value={authorName} placeholder="Enter creator name" maxlength="20" />
		</div>
		<button class="export-btn" onclick={downloadBuildCard} disabled={isExporting}>
			{#if isExporting}
				<span class="spinner"></span> Generating Image...
			{:else}
				📥 Download Build Card (PNG)
			{/if}
		</button>
	</div>

	<!-- Standard Interactive Visual Preview Section -->
	<div class="right-panel-container">
		{#if selectedHero}
			<div class="hero-header">
				<img class="hero-image" src="/heroes/icons/{selectedHero.image}" alt={selectedHero.name} />
				<div class="hero-headline-group">
					<h1>{selectedHero.name}</h1>
					<p class="creator-stamp">
						{buildName || 'Custom Build'}
						{authorName ? `by ${authorName}` : ''}
					</p>
				</div>
			</div>
		{:else}
			<div class="placeholder-hero">
				<div class="hero-placeholder-icon">👤</div>
				<h2>No Hero Selected</h2>
			</div>
		{/if}

		<!-- Chronological Equipment Rows -->
		<div class="gear-row">
			<div class="gear-column flex-3">
				<div class="section-title-container">
					<div class="section-title">Armory</div>
					<div class="capacity-controls">
						<button
							disabled={armoryCapacity <= 6}
							onclick={() => onChangeArmoryCapacity(armoryCapacity - 1)}>−</button
						>
						<span class="capacity-indicator">{armoryCapacity} Slots</span>
						<button
							disabled={armoryCapacity >= 12}
							onclick={() => onChangeArmoryCapacity(armoryCapacity + 1)}>+</button
						>
					</div>
				</div>
				<div
					class="armory-grid"
					style="grid-template-columns: repeat({armoryCapacity > 9 ? 6 : 5}, 1fr)"
				>
					{#each armory as slot, index (slot ? `${slot.id}-${index}` : `empty-${index}`)}
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

			<!-- Unified 5 Enchantments + 1 Talent Row System -->
			<div class="gear-column flex-2">
				<div class="section-title">Enchantments & Talent</div>
				<div class="unified-runes-bar">
					{#each selectedEnchantments as slot, index (slot ? `${slot.id}-${index}` : `empty-ench-${index}`)}
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

					<div class="inline-divider"></div>

					<div
						class="gear-slot square golden"
						title={selectedTalent ? selectedTalent.name : 'Talent'}
					>
						{#if selectedTalent}
							<img src="/talents/{selectedTalent.image}" alt={selectedTalent.name} />
						{:else}
							<span class="placeholder">+</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Arcana Configurations Display block -->
		<div class="arcana-display-panel">
			<div class="section-title">Arcana Layout ({allSelectedArcanas.length}/30)</div>
			<div class="arcana-columns-grid">
				<!-- Red Groups -->
				<div class="arcana-column red-column">
					<div class="column-title">Red ({redArcana.length}/10)</div>
					<div class="arcana-row">
						{#each groupedRed as group (group.arcana.id)}
							<button class="arcana-card" onclick={() => onRemoveArcana('red', group.arcana.id)}>
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

				<!-- Purple Groups -->
				<div class="arcana-column purple-column">
					<div class="column-title">Purple ({purpleArcana.length}/10)</div>
					<div class="arcana-row">
						{#each groupedPurple as group (group.arcana.id)}
							<button class="arcana-card" onclick={() => onRemoveArcana('purple', group.arcana.id)}>
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

				<!-- Teal Groups -->
				<div class="arcana-column teal-column">
					<div class="column-title">Teal ({tealArcana.length}/10)</div>
					<div class="arcana-row">
						{#each groupedTeal as group (group.arcana.id)}
							<button class="arcana-card" onclick={() => onRemoveArcana('teal', group.arcana.id)}>
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
					<span class="empty-text">Empty</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- STATIC 1028 x 1028 PIXEL CARD CANVAS FOR OFFSCREEN RENDERS -->
	<div class="export-sandbox-container">
		<div class="export-card-canvas" bind:this={exportElement}>
			<!-- Top Hero Banner (~30%) -->
			<div class="export-top-banner">
				<div
					class="banner-background"
					style="background-image: linear-gradient(to right, rgba(13, 13, 13, 1) 15%, rgba(13, 13, 13, 0.4) 60%, rgba(13, 13, 13, 0) 100%), url('/heroes/splashes/{selectedHero?.image ||
						''}');"
				></div>
				<div class="banner-text-details">
					<span class="card-hero-name">{selectedHero?.name || 'Veda Champion'}</span>
					<span class="card-build-title">{buildName || 'Battlefield Configuration'}</span>
					{#if authorName}
						<span class="card-author-stamp">Created by {authorName}</span>
					{/if}
				</div>
			</div>

			<!-- Bottom Detailed Summary Section (~70%) -->
			<div class="export-bottom-summary">
				<!-- Segment 1: Equipment Grid Row -->
				<div class="card-row-section">
					<div class="card-section-label">Equipment Build Path</div>
					<div class="card-equipment-row">
						{#each armory as item, idx (item ? `export-${item.id}-${idx}` : `export-empty-${idx}`)}
							<div
								class="card-item-slot"
								style="width: {880 / armoryCapacity}px; height: {880 / armoryCapacity}px;"
							>
								{#if item}
									<img src="/items/{item.image}" alt={item.name} />
								{:else}
									<div class="card-item-empty"></div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Segment 2: Runes & Spell (Enchantment + Talent scaled-up row) -->
				<div class="card-row-section">
					<div class="card-section-label">Enchantments & Active Spell</div>
					<div class="card-runes-talent-row">
						<div class="card-enchantments-subgroup">
							{#each selectedEnchantments as ench, idx (ench ? `export-${ench.id}-${idx}` : `export-empty-${idx}`)}
								<div class="card-enchantment-slot">
									{#if ench}
										<img src="/enchantments/{ench.image}" alt={ench.name} />
									{:else}
										<div class="card-enchantment-empty"></div>
									{/if}
								</div>
							{/each}
						</div>

						<div class="vertical-panel-divider"></div>

						<div class="card-talent-subgroup">
							<div class="card-talent-slot">
								{#if selectedTalent}
									<img src="/talents/{selectedTalent.image}" alt={selectedTalent.name} />
								{:else}
									<div class="card-talent-empty"></div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Segment 3: Arcana Section (Stretches across full-width) -->
				<div class="card-row-section">
					<div class="card-section-label">Active Arcana Layout</div>
					<div class="col-interior bg-arcana-row">
						{#if arcanaDisplayMode === 'icon'}
							<!-- Standard Icon Mode Grid -->
							<div class="export-arcana-icon-grid">
								{#each uniqueArcanaGroups as group (group.arcana.id)}
									<div class="icon-mode-card {group.arcana.color}">
										<img src="/arcanas/{group.arcana.image}" alt="" />
										<div class="icon-card-text">
											<span class="arcana-card-name">{group.arcana.displayName}</span>
											<span class="arcana-card-count">×{group.count}</span>
										</div>
									</div>
								{:else}
									<span class="export-placeholder-text">No active Arcanas.</span>
								{/each}
							</div>
						{:else if arcanaDisplayMode === 'compact'}
							<!-- Compact Icon Mode Grid -->
							<div class="export-arcana-compact-grid">
								{#each uniqueArcanaGroups as group (group.arcana.id)}
									<div class="compact-mode-card">
										<span class="color-dot {group.arcana.color}"></span>
										<span class="arcana-card-name">{group.arcana.displayName}</span>
										<span class="arcana-card-count">×{group.count}</span>
									</div>
								{:else}
									<span class="export-placeholder-text">No active Arcanas.</span>
								{/each}
							</div>
						{:else}
							<!-- Text Mode Grid -->
							<div class="export-arcana-text-grid">
								{#each uniqueArcanaGroups as group (group.arcana.id)}
									<div class="text-mode-card">
										<span class="text-color-indicator {group.arcana.color}"
											>{group.arcana.color[0].toUpperCase()}</span
										>
										<span class="arcana-card-name">{group.arcana.displayName}</span>
										<span class="arcana-card-count">×{group.count}</span>
									</div>
								{:else}
									<span class="export-placeholder-text">No active Arcanas.</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Segment 4: Accumulated Stats Section (Stretches across full-width at the bottom) -->
				<div class="card-row-section">
					<div class="card-section-label">Accumulated Arcana Stats</div>
					<div class="card-stats-fullwidth-grid">
						{#each accumulatedStats as stat (stat.key)}
							<div class="card-stat-box">
								<span class="stat-name">{stat.key}</span>
								<span class="stat-number">+{stat.value}</span>
							</div>
						{:else}
							<div class="no-stats-placeholder">
								No active bonuses. Equipping arcanas will populate calculations here.
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Export Footer Watermark -->
			<div class="export-footer-watermark">
				<span>AVIX LOADOUT PLANNER — avix.kiruaaaa.io.vn</span>
			</div>
		</div>
	</div>
</div>

<style>
	.build-preview-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.preview-card-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: #0b0b0b;
		padding: 1rem;
		border: 1px solid #222;
		border-radius: 12px;
	}

	.control-inputs {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}

	@media (min-width: 600px) {
		.control-inputs {
			grid-template-columns: 1.3fr 0.7fr;
		}
	}

	.control-inputs input {
		background-color: #121212;
		border: 1px solid #333;
		border-radius: 6px;
		color: #fff;
		padding: 0.55rem 0.75rem;
		font-size: 0.85rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.control-inputs input:focus {
		border-color: #2563eb;
	}

	.export-btn {
		background-color: #2563eb;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.65rem 1rem;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
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
		padding: 1rem;
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

	.hero-headline-group {
		display: flex;
		flex-direction: column;
	}

	.creator-stamp {
		font-size: 0.7rem;
		color: #888;
		margin: 0.1rem 0 0 0;
	}

	.hero-image {
		width: 48px;
		height: 48px;
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
		font-size: 1.5rem;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: #1e1e1e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 1.15rem;
		margin: 0;
		font-weight: 700;
	}

	h2 {
		font-size: 0.95rem;
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
	.flex-2 {
		flex: 2;
	}

	.section-title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.capacity-controls {
		display: flex;
		align-items: center;
		background-color: #0d0d0d;
		border: 1px solid #2a2a2a;
		border-radius: 4px;
		overflow: hidden;
	}

	.capacity-controls button {
		background: none;
		border: none;
		color: #fff;
		padding: 0.15rem 0.45rem;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: bold;
		transition: background-color 0.15s;
	}

	.capacity-controls button:hover:not(:disabled) {
		background-color: #222;
	}

	.capacity-controls button:disabled {
		color: #444;
		cursor: not-allowed;
	}

	.capacity-indicator {
		font-size: 0.65rem;
		padding: 0 0.35rem;
		color: #aaa;
		font-weight: bold;
		border-left: 1px solid #2a2a2a;
		border-right: 1px solid #2a2a2a;
	}

	.armory-grid {
		display: grid;
		gap: 0.3rem;
	}

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

	/* Unified Runes Horizontal Bar */
	.unified-runes-bar {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background-color: #161616;
		padding: 0.4rem;
		border-radius: 8px;
		border: 1px solid #222;
		height: 48px;
		box-sizing: border-box;
		width: fit-content;
	}

	.unified-runes-bar .gear-slot {
		width: 36px;
		height: 36px;
		border: 1px solid #333;
		background-color: #0d0d0d;
	}

	.inline-divider {
		width: 1px;
		height: 30px;
		background-color: #333;
		margin: 0 0.25rem;
	}

	.arcana-display-panel {
		background: #161616;
		border-radius: 8px;
		padding: 0.75rem;
		border: 1px solid #222;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.arcana-columns-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
	}

	.arcana-column {
		background: #0d0d0d;
		border-radius: 6px;
		padding: 0.4rem;
		border-top: 3px solid #333;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
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
		font-size: 0.6rem;
		color: #777;
		font-weight: bold;
		text-transform: uppercase;
	}

	.arcana-row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.arcana-card {
		background: #141414;
		border: 1px solid #252525;
		border-radius: 6px;
		cursor: pointer;
		padding: 0.35rem 0.2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		min-height: 84px;
	}

	.arcana-image-container {
		position: relative;
		width: 32px;
		height: 32px;
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
		font-size: 0.55rem;
		padding: 0px 3px;
		border-radius: 3px;
		border: 1px solid #333;
		font-weight: bold;
	}

	.arcana-subtext {
		font-size: 0.55rem;
		color: #888;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		font-weight: 600;
	}

	.empty-text {
		font-size: 0.6rem;
		color: #444;
		font-style: italic;
	}

	.panel-divider {
		border: 0;
		height: 1px;
		background: #2a2a2a;
		margin: 0;
	}

	.stats-table-section {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stats-grid-table {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.25rem 0.4rem;
	}

	.stat-cell {
		display: flex;
		justify-content: space-between;
		font-size: 0.65rem;
		background: #0d0d0d;
		padding: 0.25rem 0.4rem;
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

	/* ABSOLUTE OFFSCREEN RENDERING CONTAINER */
	.export-sandbox-container {
		position: absolute;
		left: -9999px;
		top: -9999px;
		width: 1028px;
		height: 1028px;
		overflow: hidden;
	}

	.export-card-canvas {
		width: 1028px;
		height: 1028px;
		background-color: #0d0d0d;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		color: #fff;
		position: relative;
	}

	/* Top Portion (30% -> 308px) */
	.export-top-banner {
		height: 308px;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: flex-end;
		padding: 2.5rem;
		box-sizing: border-box;
		border-bottom: 2px solid #1a1a1a;
	}

	.banner-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-position: center 30%;
		background-size: cover;
		background-repeat: no-repeat;
		filter: blur(2px) brightness(0.65);
		z-index: 1;
	}

	.banner-text-details {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.card-hero-name {
		font-size: 1.5rem;
		font-weight: 800;
		color: #eab308;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.card-build-title {
		font-size: 2.5rem;
		font-weight: 900;
		color: #fff;
		line-height: 1.1;
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
	}

	.card-author-stamp {
		font-size: 1rem;
		color: #94a3b8;
		font-weight: 600;
	}

	/* Bottom Portion (70% -> 720px) */
	.export-bottom-summary {
		height: 720px;
		background-color: #111111;
		padding: 2rem 2.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-row-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-section-label {
		font-size: 0.8rem;
		font-weight: 800;
		text-transform: uppercase;
		color: #64748b;
		letter-spacing: 0.1em;
	}

	/* Section 1: Equipment horizontal alignment */
	.card-equipment-row {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
	}

	.card-item-slot {
		background: #181818;
		border: 1px solid #333;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.card-item-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-item-empty {
		width: 100%;
		height: 100%;
		background: #141414;
		border: 1px dashed #333;
		border-radius: 12px;
	}

	/* Section 2: Runes & Spell integration (Scaled to match Armory style) */
	.card-runes-talent-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
	}

	.card-enchantments-subgroup {
		display: flex;
		gap: 0.75rem;
	}

	.card-enchantment-slot {
		width: 110px;
		height: 110px;
		background: #181818;
		border-radius: 50%;
		border: 2px solid #333;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
	}

	.card-enchantment-slot img {
		width: 80%;
		height: 85%;
		object-fit: contain;
	}

	.card-enchantment-empty {
		width: 100%;
		height: 100%;
		background: #121212;
		border-radius: 50%;
		border: 1px dashed #333;
	}

	.vertical-panel-divider {
		width: 2px;
		height: 90px;
		background-color: #334155;
		margin: 0 auto;
	}

	.card-talent-subgroup {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-talent-slot {
		width: 110px;
		height: 110px;
		background: #181818;
		border: 3px solid #eab308;
		border-radius: 14px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
		box-sizing: border-box;
	}

	.card-talent-slot img {
		width: 90%;
		height: 90%;
		object-fit: contain;
	}

	.card-talent-empty {
		width: 100%;
		height: 100%;
		background: #121212;
		border: 1px dashed #444;
		border-radius: 12px;
	}

	/* Section 3: Full Width Arcana Grid Line styling */
	.bg-arcana-row {
		background: #141414;
		border: 1px solid #222;
		border-radius: 14px;
		padding: 0.75rem 1rem;
		box-sizing: border-box;
		min-height: 110px;
		display: flex;
		align-items: center;
	}

	.export-arcana-icon-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		width: 100%;
	}

	.icon-mode-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #1c1c1c;
		border: 1px solid #2a2a2a;
		border-radius: 10px;
		padding: 0.5rem 0.75rem;
		border-left: 4px solid #333;
	}

	.icon-mode-card.red {
		border-left-color: #ef4444;
	}
	.icon-mode-card.purple {
		border-left-color: #a855f7;
	}
	.icon-mode-card.teal {
		border-left-color: #14b8a6;
	}

	.icon-mode-card img {
		width: 38px;
		height: 38px;
		object-fit: contain;
	}

	.icon-card-text {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.arcana-card-name {
		font-size: 0.8rem;
		font-weight: 700;
		color: #f1f5f9;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arcana-card-count {
		font-size: 0.9rem;
		font-weight: 800;
		color: #3b82f6;
		margin-top: 0.1rem;
	}

	.export-arcana-compact-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.6rem;
		width: 100%;
	}

	.compact-mode-card {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #1c1c1c;
		border: 1px solid #2a2a2a;
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		min-width: 0;
	}

	.color-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.color-dot.red {
		background-color: #ef4444;
		box-shadow: 0 0 6px #ef4444;
	}
	.color-dot.purple {
		background-color: #a855f7;
		box-shadow: 0 0 6px #a855f7;
	}
	.color-dot.teal {
		background-color: #14b8a6;
		box-shadow: 0 0 6px #14b8a6;
	}

	.export-arcana-text-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	.text-mode-card {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: #1c1c1c;
		border: 1px solid #222;
		border-radius: 6px;
		padding: 0.35rem 0.5rem;
		min-width: 0;
	}

	.text-color-indicator {
		font-size: 0.6rem;
		font-weight: bold;
		width: 14px;
		height: 14px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
	}

	.text-color-indicator.red {
		background-color: #ef4444;
	}
	.text-color-indicator.purple {
		background-color: #a855f7;
	}
	.text-color-indicator.teal {
		background-color: #14b8a6;
	}

	/* Section 4: Accumulated Stats Horizontal Full-Width Grid */
	.card-stats-fullwidth-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	.card-stat-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #181818;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		box-sizing: border-box;
	}

	.stat-name {
		color: #94a3b8;
		font-weight: 500;
		font-size: 0.75rem;
	}

	.stat-number {
		color: #10b981;
		font-weight: 700;
		font-size: 0.8rem;
	}

	.no-stats-placeholder {
		grid-column: 1 / -1;
		font-size: 0.8rem;
		color: #475569;
		font-style: italic;
		text-align: center;
		padding: 1rem 0;
	}

	.export-placeholder-text {
		font-size: 0.8rem;
		color: #475569;
		font-style: italic;
		text-align: center;
		width: 100%;
	}

	/* Card Bottom Branding Watermark text */
	.export-footer-watermark {
		position: absolute;
		bottom: 0.75rem;
		width: 100%;
		text-align: center;
		font-size: 0.7rem;
		color: #334155;
		font-weight: 800;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		pointer-events: none;
	}
</style>
