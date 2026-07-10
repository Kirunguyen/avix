<script lang="ts">
	import { buildState } from '$lib/state.svelte';
	import { groupArcana, calculateTotalArcanaStats } from '../utils/arcana';
	import { toPng } from 'html-to-image';
	import afataIcon from '$lib/assets/enchantments/Afata.webp';
	import humanIcon from '$lib/assets/enchantments/League-Of-Humans.webp';
	import lokheimIcon from '$lib/assets/enchantments/Lokheim.webp';
	import vedaIcon from '$lib/assets/enchantments/Veda.webp';
	interface Props {
		downloadTrigger?: () => Promise<void>;
	}

	let { downloadTrigger = $bindable() }: Props = $props();

	// Read-only calculations directly from global state
	const allSelectedArcanas = $derived([
		...buildState.redArcana,
		...buildState.purpleArcana,
		...buildState.tealArcana
	]);
	const accumulatedStats = $derived(calculateTotalArcanaStats(allSelectedArcanas));

	const uniqueArcanaGroups = $derived(groupArcana(allSelectedArcanas));
	const uniqueArcanaCount = $derived(uniqueArcanaGroups.length);

	const arcanaDisplayMode = $derived(
		uniqueArcanaCount <= 3 ? 'icon' : uniqueArcanaCount <= 6 ? 'compact' : 'text'
	);

	let exportElement = $state<HTMLElement | null>(null);

	// Defensive runtime image extension replacement
	function toWebp(path: string): string {
		if (!path) return '';
		return path.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
	}

	// Category configuration lookup helper using static local paths
	function getCategoryMeta(category?: string) {
		if (!category) return { icon: '', color: '#252525' };
		switch (category) {
			case 'Veda':
				return { icon: vedaIcon, color: '#F2D95E' };
			case 'Lokheim':
				return { icon: lokheimIcon, color: '#C12817' };
			case 'Afata':
				return { icon: afataIcon, color: '#B2D246' };
			case 'League of Humans':
				return { icon: humanIcon, color: '#4CA9E2' };
			default:
				return { icon: '', color: '#252525' };
		}
	}

	// Get the color for a group of enchantment slots
	function getGroupColor(groupIndex: number): string {
		const enchantmentIndex = groupIndex === 0 ? 2 : groupIndex === 1 ? 3 : 4;
		const enchantment = buildState.selectedEnchantments[enchantmentIndex];
		if (enchantment?.category) {
			return getCategoryMeta(enchantment.category).color;
		}
		return '#333';
	}

	async function downloadBuildCard() {
		if (!exportElement) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 150));
			// Exposes high-fidelity 1024 x 1024 px PNG card
			const dataUrl = await toPng(exportElement, {
				width: 1024,
				height: 1024,
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
			const heroSafe = buildState.selectedHero
				? buildState.selectedHero.name.replace(/\s+/g, '-').toLowerCase()
				: 'build';
			link.download = `avix-build-${heroSafe}.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Error generating image export:', error);
		}
	}

	$effect(() => {
		downloadTrigger = downloadBuildCard;
	});
</script>

<div class="build-preview-wrapper">
	<!-- READ-ONLY LIVE VISUAL PREVIEW WORKSPACE -->
	<div class="right-panel-container">
		<!-- Top Hero Banner -->
		<div class="export-top-banner relative-preview-banner">
			{#if buildState.selectedHero}
				<div
					class="banner-background"
					style="background-image: linear-gradient(to right, rgba(13, 13, 13, 1) 15%, rgba(13, 13, 13, 0.4) 60%, rgba(13, 13, 13, 0) 100%), url('/heroes/splashes/{toWebp(
						buildState.selectedHero.image
					)}');"
				></div>
				<div class="banner-text-details">
					<span class="card-hero-name">{buildState.selectedHero.name}</span>
					<span class="card-build-title">{buildState.buildName || 'Standard Loadout'}</span>
					{#if buildState.authorName}
						<span class="card-author-stamp">Created by {buildState.authorName}</span>
					{/if}
				</div>
			{:else}
				<div class="placeholder-hero">
					<div class="hero-placeholder-icon">👤</div>
					<h2>No Hero Selected</h2>
				</div>
			{/if}
		</div>

		<!-- Bottom Details Container -->
		<div class="export-bottom-summary relative-preview-summary">
			<!-- Segment 1: Equipment Grid Row -->
			<div class="card-row-section">
				<div class="card-section-label">Equipment Build Path</div>
				<div class="card-equipment-row">
					{#each buildState.armory as item, idx (item ? `preview-${item.id}-${idx}` : `preview-empty-${idx}`)}
						<div
							class="card-item-slot"
							style="width: {90 / buildState.armoryCapacity}%; aspect-ratio: 1;"
						>
							{#if item}
								<img src="/items/{toWebp(item.image)}" alt={item.name} />
							{:else}
								<div class="card-item-empty"></div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Segment 2: Runes & Spell (Enchantment & Talent unified row) -->
			<div class="card-row-section">
				<div class="card-section-label">Enchantment & Talent</div>
				<div class="card-runes-talent-row">
					<div class="enchantment-two-lines-grid">
						<!-- Row 1: Slots 1, 2, 3, 4 (Group 1) -->
						<div class="enchantment-row">
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot category-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[2]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[2]}
										<img
											src={getCategoryMeta(buildState.selectedEnchantments[2]?.category).icon}
											alt=""
											class="cat-img"
										/>
									{/if}
								</div>
							</div>
							<div
								class="enchantment-connector"
								style="background-color: {getGroupColor(0)};"
							></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[0]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[0]}
										<img
											src="/enchantments/{toWebp(buildState.selectedEnchantments[0].image)}"
											alt=""
										/>
									{/if}
								</div>
							</div>
							<div
								class="enchantment-connector"
								style="background-color: {getGroupColor(0)};"
							></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[1]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[1]}
										<img
											src="/enchantments/{toWebp(buildState.selectedEnchantments[1].image)}"
											alt=""
										/>
									{/if}
								</div>
							</div>
							<div
								class="enchantment-connector"
								style="background-color: {getGroupColor(0)};"
							></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[2]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[2]}
										<img
											src="/enchantments/{toWebp(buildState.selectedEnchantments[2].image)}"
											alt=""
										/>
									{/if}
								</div>
							</div>
						</div>

						<!-- Row 2: Slots 5-6 (Group 2), 7-8 (Group 3) -->
						<div class="enchantment-row">
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot category-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[3]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[3]}
										<img
											src={getCategoryMeta(buildState.selectedEnchantments[3]?.category).icon}
											alt=""
											class="cat-img"
										/>
									{/if}
								</div>
							</div>
							<div
								class="enchantment-connector"
								style="background-color: {getGroupColor(1)};"
							></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[3]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[3]}
										<img
											src="/enchantments/{toWebp(buildState.selectedEnchantments[3].image)}"
											alt=""
										/>
									{/if}
								</div>
							</div>
							<div class="enchantment-connector" style="background-color: transparent;"></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot category-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[4]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[4]}
										<img
											src={getCategoryMeta(buildState.selectedEnchantments[4]?.category).icon}
											alt=""
											class="cat-img"
										/>
									{/if}
								</div>
							</div>
							<div
								class="enchantment-connector"
								style="background-color: {getGroupColor(2)};"
							></div>
							<div class="enchantment-slot-wrapper">
								<div
									class="card-enchantment-slot"
									style="border-color: {getCategoryMeta(
										buildState.selectedEnchantments[4]?.category
									).color};"
								>
									{#if buildState.selectedEnchantments[4]}
										<img
											src="/enchantments/{toWebp(buildState.selectedEnchantments[4].image)}"
											alt=""
										/>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<div class="vertical-panel-divider"></div>

					<div class="card-talent-subgroup">
						<div class="card-talent-column">
							<div class="card-talent-slot">
								{#if buildState.selectedTalent}
									<img
										src="/talents/{toWebp(buildState.selectedTalent.image)}"
										alt={buildState.selectedTalent.name}
									/>
								{:else}
									<div class="card-talent-empty"></div>
								{/if}
							</div>
							{#if buildState.selectedTalent}
								<span class="card-talent-name">{buildState.selectedTalent.name}</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Segment 3: Arcana Section -->
			<div class="card-row-section">
				<div class="card-section-label">Active Arcana Layout</div>
				<div class="col-interior bg-arcana-row">
					{#if arcanaDisplayMode === 'icon'}
						<div class="export-arcana-icon-grid">
							{#each uniqueArcanaGroups as group (group.arcana.id)}
								<div class="icon-mode-card {group.arcana.color}">
									<img src="/arcanas/{toWebp(group.arcana.image)}" alt="" />
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

			<!-- Segment 4: Accumulated Stats Section -->
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
	</div>

	<!-- STATIC 1024 x 1024 PIXEL CARD CANVAS FOR OFFSCREEN RENDERS (PIXEL PERFECT 1:1) -->
	<div class="export-sandbox-container">
		<div class="export-card-canvas" bind:this={exportElement}>
			<!-- Top Hero Banner (~30%) -->
			<div class="export-top-banner">
				<div
					class="banner-background"
					style="background-image: linear-gradient(to right, rgba(13, 13, 13, 1) 15%, rgba(13, 13, 13, 0.4) 60%, rgba(13, 13, 13, 0) 100%), url('/heroes/splashes/{toWebp(
						buildState.selectedHero?.image || ''
					)}');"
				></div>
				<div class="banner-text-details">
					<span class="card-hero-name">{buildState.selectedHero?.name || 'Veda Champion'}</span>
					<span class="card-build-title">{buildState.buildName || 'Battlefield Configuration'}</span
					>
					{#if buildState.authorName}
						<span class="card-author-stamp">Created by {buildState.authorName}</span>
					{/if}
				</div>
			</div>

			<!-- Bottom Detailed Summary Section (~70%) -->
			<div class="export-bottom-summary">
				<!-- Segment 1: Equipment Grid Row -->
				<div class="card-row-section">
					<div class="card-section-label">Equipment Build Path</div>
					<div class="card-equipment-row">
						{#each buildState.armory as item, idx (item ? `export-${item.id}-${idx}` : `export-empty-${idx}`)}
							<div
								class="card-item-slot"
								style="width: {90 / buildState.armoryCapacity}%; aspect-ratio: 1;"
							>
								{#if item}
									<img src="/items/{toWebp(item.image)}" alt={item.name} />
								{:else}
									<div class="card-item-empty"></div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Segment 2: Runes & Spell (Enchantment + Talent scaled-up row) -->
				<div class="card-row-section">
					<div class="card-section-label">Enchantment & Talent</div>
					<div class="card-runes-talent-row">
						<div class="enchantment-two-lines-grid">
							<!-- Row 1: Slots 1, 2, 3, 4 (Group 1) -->
							<div class="enchantment-row">
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot category-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[2]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[2]}
											<img
												src={getCategoryMeta(buildState.selectedEnchantments[2]?.category).icon}
												alt=""
												class="cat-img"
											/>
										{/if}
									</div>
								</div>
								<div
									class="enchantment-connector"
									style="background-color: {getGroupColor(0)};"
								></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[0]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[0]}
											<img
												src="/enchantments/{toWebp(buildState.selectedEnchantments[0].image)}"
												alt=""
											/>
										{/if}
									</div>
								</div>
								<div
									class="enchantment-connector"
									style="background-color: {getGroupColor(0)};"
								></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[1]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[1]}
											<img
												src="/enchantments/{toWebp(buildState.selectedEnchantments[1].image)}"
												alt=""
											/>
										{/if}
									</div>
								</div>
								<div
									class="enchantment-connector"
									style="background-color: {getGroupColor(0)};"
								></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[2]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[2]}
											<img
												src="/enchantments/{toWebp(buildState.selectedEnchantments[2].image)}"
												alt=""
											/>
										{/if}
									</div>
								</div>
							</div>

							<!-- Row 2: Slots 5-6 (Group 2), 7-8 (Group 3) -->
							<div class="enchantment-row">
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot category-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[3]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[3]}
											<img
												src={getCategoryMeta(buildState.selectedEnchantments[3]?.category).icon}
												alt=""
												class="cat-img"
											/>
										{/if}
									</div>
								</div>
								<div
									class="enchantment-connector"
									style="background-color: {getGroupColor(1)};"
								></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[3]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[3]}
											<img
												src="/enchantments/{toWebp(buildState.selectedEnchantments[3].image)}"
												alt=""
											/>
										{/if}
									</div>
								</div>
								<div class="enchantment-connector" style="background-color: transparent;"></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot category-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[4]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[4]}
											<img
												src={getCategoryMeta(buildState.selectedEnchantments[4]?.category).icon}
												alt=""
												class="cat-img"
											/>
										{/if}
									</div>
								</div>
								<div
									class="enchantment-connector"
									style="background-color: {getGroupColor(2)};"
								></div>
								<div class="enchantment-slot-wrapper">
									<div
										class="card-enchantment-slot"
										style="border-color: {getCategoryMeta(
											buildState.selectedEnchantments[4]?.category
										).color};"
									>
										{#if buildState.selectedEnchantments[4]}
											<img
												src="/enchantments/{toWebp(buildState.selectedEnchantments[4].image)}"
												alt=""
											/>
										{/if}
									</div>
								</div>
							</div>
						</div>

						<div class="vertical-panel-divider"></div>

						<div class="card-talent-subgroup">
							<div class="card-talent-column">
								<div class="card-talent-slot">
									{#if buildState.selectedTalent}
										<img src="/talents/{toWebp(buildState.selectedTalent.image)}" alt="" />
									{:else}
										<div class="card-talent-empty"></div>
									{/if}
								</div>
								{#if buildState.selectedTalent}
									<span class="card-talent-name">{buildState.selectedTalent.name}</span>
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
										<img src="/arcanas/{toWebp(group.arcana.image)}" alt="" />
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
		height: 100%;
	}

	.right-panel-container {
		background-color: #111;
		border: none;
		border-radius: 0px;
		padding: 1rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
		height: 100%;
		box-sizing: border-box;
	}

	/* Responsive tweaks for web viewing */
	.relative-preview-banner {
		height: 200px !important;
		border-radius: 0px;
		padding: 1.25rem !important;
		border-bottom: 1px solid #1a1a1a !important;
	}

	.relative-preview-banner .card-build-title {
		font-size: 1.75rem !important;
	}

	.relative-preview-summary {
		padding: 0 !important;
		gap: 1rem;
	}

	.placeholder-hero {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #555;
		position: relative;
		z-index: 2;
	}

	.hero-placeholder-icon {
		font-size: 1.75rem;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: #1e1e1e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Standard layout card bindings */
	.card-row-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-section-label {
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		color: #64748b;
		letter-spacing: 0.1em;
	}

	/* Proportional spaced equipment row */
	.card-equipment-row {
		display: flex;
		justify-content: space-between;
		gap: 0.25rem;
		width: 100%;
	}

	.card-item-slot {
		background: #181818;
		border: 1px solid #333;
		border-radius: 6px;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
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
		border-radius: inherit;
	}

	/* Symmetrical 2-Line Enchantment Grid System with Connectors */
	.card-runes-talent-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 0.5rem;
		box-sizing: border-box;
	}

	.enchantment-two-lines-grid {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		width: 65%;
	}

	.enchantment-row {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.enchantment-slot-wrapper {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.enchantment-connector {
		height: 2px;
		flex: 0.3;
		min-width: 8px;
		background-color: #333;
		border-radius: 1px;
	}

	.card-enchantment-slot {
		width: 85%;
		aspect-ratio: 1;
		background: #181818;
		border-radius: 50%;
		border: 2px solid #333;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		flex-shrink: 0;
		min-width: 28px;
	}

	.card-enchantment-slot.category-slot {
		background: #0d0d0d;
		border-style: solid;
	}

	.card-enchantment-slot img {
		width: 80%;
		height: 85%;
		object-fit: contain;
	}

	.card-enchantment-slot .cat-img {
		width: 60%;
		height: 60%;
		filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.15));
	}

	.card-enchantment-empty {
		width: 100%;
		height: 100%;
		background: #121212;
		border: 1px dashed #333;
		border-radius: 50%;
	}

	.vertical-panel-divider {
		width: 2px;
		height: 70px;
		background-color: #334155;
		flex-shrink: 0;
	}

	/* Talent display - enlarged to match enchantment section height */
	.card-talent-subgroup {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30%;
		height: 100%;
	}

	.card-talent-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 100%;
		height: 100%;
		flex-shrink: 0;
	}

	.card-talent-slot {
		width: 100%;
		max-width: 100%;
		aspect-ratio: 1;
		background: #181818;
		border: 1px solid #333;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		flex-grow: 1;
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
		border-radius: 8px;
	}

	.card-talent-name {
		font-size: 0.65rem;
		color: #94a3b8;
		text-align: center;
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	/* Export Canvas High-Res sizing */
	.export-bottom-summary .card-item-slot {
		width: 15%;
		max-width: 90px;
		aspect-ratio: 1;
		border-radius: 10px;
		background: #181818;
		border: 2px solid #333;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.export-bottom-summary .card-item-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.export-bottom-summary .enchantment-two-lines-grid {
		gap: 0.65rem;
		width: 65%;
	}

	.export-bottom-summary .enchantment-row {
		gap: 0;
	}

	.export-bottom-summary .enchantment-connector {
		height: 3px;
		flex: 0.3;
		min-width: 10px;
		border-radius: 1.5px;
	}

	.export-bottom-summary .card-enchantment-slot {
		width: 85%;
		max-width: 76px;
		min-width: 54px;
		aspect-ratio: 1;
		border-width: 3px;
		flex-shrink: 0;
	}

	.export-bottom-summary .card-talent-subgroup {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30%;
		height: 100%;
	}

	.export-bottom-summary .card-talent-column {
		width: 100%;
		gap: 0.5rem;
		flex-shrink: 0;
		height: 100%;
		justify-content: center;
	}

	.export-bottom-summary .card-talent-slot {
		width: 100%;
		max-width: 140px;
		aspect-ratio: 1;
		border-radius: 16px;
		flex-shrink: 0;
		flex-grow: 1;
	}

	.export-bottom-summary .card-talent-name {
		font-size: 1rem;
		color: #bbb;
		margin-top: 0.5rem;
	}

	.export-bottom-summary .vertical-panel-divider {
		height: 180px;
		flex-shrink: 0;
		align-self: center;
	}

	.card-item-empty {
		width: 100%;
		height: 100%;
		background: #141414;
		border: 1px dashed #333;
		border-radius: inherit;
	}

	/* Arcana Section Row Styling */
	.bg-arcana-row {
		background: #141414;
		border: 1px solid #222;
		border-radius: 10px;
		padding: 0.5rem 0.75rem;
		box-sizing: border-box;
		min-height: 80px;
		display: flex;
		align-items: center;
	}

	.export-arcana-icon-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: 100%;
	}

	.icon-mode-card {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #1c1c1c;
		border: 1px solid #2a2a2a;
		border-radius: 6px;
		padding: 0.35rem 0.5rem;
		border-left: 3px solid #333;
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
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.icon-card-text {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.arcana-card-name {
		font-size: 0.65rem;
		font-weight: 700;
		color: #f1f5f9;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arcana-card-count {
		font-size: 0.75rem;
		font-weight: 800;
		color: #3b82f6;
	}

	.export-arcana-compact-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.4rem;
		width: 100%;
	}

	.compact-mode-card {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: #1c1c1c;
		border: 1px solid #2a2a2a;
		border-radius: 6px;
		padding: 0.3rem 0.5rem;
		min-width: 0;
	}

	.color-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.color-dot.red {
		background-color: #ef4444;
	}
	.color-dot.purple {
		background-color: #a855f7;
	}
	.color-dot.teal {
		background-color: #14b8a6;
	}

	.export-arcana-text-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
		width: 100%;
	}

	.text-mode-card {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: #1c1c1c;
		border: 1px solid #222;
		border-radius: 4px;
		padding: 0.25rem 0.4rem;
		min-width: 0;
	}

	.text-color-indicator {
		font-size: 0.55rem;
		font-weight: bold;
		width: 12px;
		height: 12px;
		border-radius: 2px;
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

	.card-stats-fullwidth-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
		width: 100%;
	}

	.card-stat-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #181818;
		border: 1px solid #222;
		border-radius: 6px;
		padding: 0.4rem 0.6rem;
		box-sizing: border-box;
	}

	.stat-name {
		color: #94a3b8;
		font-weight: 500;
		font-size: 0.65rem;
	}

	.stat-number {
		color: #10b981;
		font-weight: 700;
		font-size: 0.7rem;
	}

	.no-stats-placeholder {
		grid-column: 1 / -1;
		font-size: 0.7rem;
		color: #475569;
		font-style: italic;
		text-align: center;
	}

	.export-placeholder-text {
		font-size: 0.7rem;
		color: #475569;
		font-style: italic;
		text-align: center;
		width: 100%;
	}

	/* Headless rendering card canvas */
	.export-sandbox-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 1024px;
		height: 1024px;
		z-index: -1000;
		pointer-events: none;
		opacity: 0;
	}

	.export-card-canvas {
		width: 1024px;
		height: 1024px;
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

	.export-bottom-summary {
		height: 720px;
		background-color: #111111;
		padding: 2rem 2.5rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

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
