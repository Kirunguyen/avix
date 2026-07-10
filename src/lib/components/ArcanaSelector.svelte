<script lang="ts">
	import type { Arcana } from '../types/entities';
	import { buildState } from '$lib/state.svelte';
	import ArcanaSection from '../arcana/ArcanaSection.svelte';

	interface Props {
		arcanas: Arcana[];
		onSelect: (arcana: Arcana) => void;
	}

	let { arcanas, onSelect }: Props = $props();

	// Defensive runtime image extension replacement helper
	function toWebp(path: string): string {
		if (!path) return '';
		return path.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
	}

	// Helper to count equipped arcanas of a specific type
	function getEquippedCount(arcanaId: string, color: 'red' | 'purple' | 'teal'): number {
		if (color === 'red') {
			return buildState.redArcana.filter((a) => a.id === arcanaId).length;
		} else if (color === 'purple') {
			return buildState.purpleArcana.filter((a) => a.id === arcanaId).length;
		} else {
			return buildState.tealArcana.filter((a) => a.id === arcanaId).length;
		}
	}
</script>

<div class="arcana-split-workspace">
	<!-- Part 1: Symmetrical Vertical Snake Columns (60% width) -->
	<div class="pyramid-map-panel flex-column-blocks">
		<ArcanaSection
			color="red"
			equipped={buildState.redArcana}
			onRemove={() => (buildState.redArcana = buildState.redArcana.slice(0, -1))}
		/>
		<ArcanaSection
			color="purple"
			equipped={buildState.purpleArcana}
			onRemove={() => (buildState.purpleArcana = buildState.purpleArcana.slice(0, -1))}
		/>
		<ArcanaSection
			color="teal"
			equipped={buildState.tealArcana}
			onRemove={() => (buildState.tealArcana = buildState.tealArcana.slice(0, -1))}
		/>
	</div>

	<!-- Part 2: Selection Catalog Panel with Dynamic Count badges (40% width) -->
	<div class="selections-catalog-panel">
		<span class="panel-section-label">Active Selections</span>
		<div class="catalog-scroll-view">
			{#each arcanas as arcana (arcana.id)}
				<button
					class="arcana-choice-card {arcana.color}"
					onclick={() => onSelect(arcana)}
					title={arcana.name}
				>
					<div class="arcana-img-container">
						<img src="/arcanas/{toWebp(arcana.image)}" alt={arcana.name} loading="lazy" />
						{#if getEquippedCount(arcana.id, arcana.color) > 0}
							<span class="equipped-badge">x{getEquippedCount(arcana.id, arcana.color)}</span>
						{/if}
					</div>
					<div class="arcana-meta">
						<span class="arcana-choice-name">{arcana.name}</span>
						<span class="arcana-choice-displayName">{arcana.displayName}</span>
					</div>
				</button>
			{:else}
				<div class="empty-state">No matching arcanas.</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.arcana-split-workspace {
		display: grid;
		grid-template-columns: 5.8fr 4.2fr;
		gap: 1.25rem;
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

	/* Part 1: Symmetrical Vertical Snake columns container */
	.pyramid-map-panel.flex-column-blocks {
		background-color: #0c0d0d;
		border: 1px solid #1a1a1a;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: space-between;
		box-sizing: border-box;
		height: 100%;
	}

	/* Part 2: Selection Catalog Panel */
	.selections-catalog-panel {
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

	.catalog-scroll-view {
		flex: 1;
		overflow-y: auto;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.arcana-choice-card {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.35rem 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		transition: all 0.12s ease-in-out;
		text-align: left;
	}

	.arcana-choice-card:hover {
		background-color: #161616;
	}

	.arcana-choice-card.red:hover {
		border-color: #ef4444;
	}
	.arcana-choice-card.purple:hover {
		border-color: #a855f7;
	}
	.arcana-choice-card.teal:hover {
		border-color: #14b8a6;
	}

	.arcana-img-container {
		position: relative;
		width: 32px;
		height: 32px;
		flex-shrink: 0;
	}

	.arcana-img-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* Dynamic equipped counter badge */
	.equipped-badge {
		position: absolute;
		bottom: -2px;
		right: -4px;
		background-color: #2563eb;
		color: #fff;
		font-size: 0.55rem;
		padding: 0px 3px;
		border-radius: 3px;
		border: 1px solid #000;
		font-weight: bold;
	}

	.arcana-meta {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.arcana-choice-name {
		font-size: 0.75rem;
		font-weight: 700;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.arcana-choice-displayName {
		font-size: 0.6rem;
		color: #64748b;
		margin-top: 0.1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty-state {
		font-size: 0.75rem;
		color: #444;
		font-style: italic;
		text-align: center;
		margin-top: 4rem;
	}
</style>
