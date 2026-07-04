<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import ArcanaSelector from '$lib/components/ArcanaSelector.svelte';
	import arcanaListRaw from '$lib/data/arcanas.json';
	import { groupArcana } from '$lib/utils/arcana';
	import type { Arcana } from '$lib/types/entities';

	const arcanaList = arcanaListRaw as Arcana[];

	const groupedRed = $derived(groupArcana(buildState.redArcana));
	const groupedPurple = $derived(groupArcana(buildState.purpleArcana));
	const groupedTeal = $derived(groupArcana(buildState.tealArcana));
</script>

<div class="editor-wrapper">
	<div class="editor-header">
		<button class="back-btn" onclick={() => goto(resolve('/'))}>← Done</button>
		<h1 class="editor-title">Configure Arcana</h1>
	</div>

	<div class="editor-main-panel">
		<ArcanaSelector arcanas={arcanaList} onSelect={(arcana) => buildState.addArcana(arcana)} />
	</div>

	<div class="lightweight-preview">
		<div class="preview-info-col">
			<span class="preview-label">Equipped Arcana:</span>
			<span class="count-text">
				{buildState.redArcana.length +
					buildState.purpleArcana.length +
					buildState.tealArcana.length} / 30
			</span>
		</div>

		<div class="columns-grid">
			<!-- Red Section -->
			<div class="column red-col">
				<div class="col-title">Red ({buildState.redArcana.length}/10)</div>
				<div class="pills-row">
					{#each groupedRed as group (group.arcana.id)}
						<button
							class="arcana-pill"
							onclick={() => buildState.removeArcana('red', group.arcana.id)}
							title="Remove 1"
						>
							<img src="/arcanas/{group.arcana.image}" alt="" />
							<span class="badge">x{group.count}</span>
						</button>
					{:else}
						<span class="empty">Empty</span>
					{/each}
				</div>
			</div>

			<!-- Purple Section -->
			<div class="column purple-col">
				<div class="col-title">Purple ({buildState.purpleArcana.length}/10)</div>
				<div class="pills-row">
					{#each groupedPurple as group (group.arcana.id)}
						<button
							class="arcana-pill"
							onclick={() => buildState.removeArcana('purple', group.arcana.id)}
							title="Remove 1"
						>
							<img src="/arcanas/{group.arcana.image}" alt="" />
							<span class="badge">x{group.count}</span>
						</button>
					{:else}
						<span class="empty">Empty</span>
					{/each}
				</div>
			</div>

			<!-- Teal Section -->
			<div class="column teal-col">
				<div class="col-title">Teal ({buildState.tealArcana.length}/10)</div>
				<div class="pills-row">
					{#each groupedTeal as group (group.arcana.id)}
						<button
							class="arcana-pill"
							onclick={() => buildState.removeArcana('teal', group.arcana.id)}
							title="Remove 1"
						>
							<img src="/arcanas/{group.arcana.image}" alt="" />
							<span class="badge">x{group.count}</span>
						</button>
					{:else}
						<span class="empty">Empty</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #050505;
	}

	.editor-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		background-color: #0b0b0b;
		padding: 1rem 2rem;
		border-bottom: 1px solid #1a1a1a;
	}

	.back-btn {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #ccc;
		padding: 0.45rem 1rem;
		border-radius: 6px;
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.back-btn:hover {
		background-color: #2563eb;
		color: #fff;
		border-color: #3b82f6;
	}

	.editor-title {
		font-size: 1.15rem;
		font-weight: bold;
		color: #fff;
		margin: 0;
	}

	.editor-main-panel {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
	}

	.lightweight-preview {
		background-color: #0b0b0b;
		border-top: 1px solid #1a1a1a;
		padding: 1.25rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 900px) {
		.lightweight-preview {
			flex-direction: row;
			gap: 3rem;
		}
	}

	.preview-info-col {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.preview-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.count-text {
		font-size: 1.15rem;
		font-weight: bold;
		color: #fff;
	}

	.columns-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		flex: 1;
	}

	.column {
		background-color: #121212;
		border-radius: 8px;
		padding: 0.5rem;
		border-left: 3px solid #333;
	}

	.red-col {
		border-left-color: #ef4444;
	}
	.purple-col {
		border-left-color: #a855f7;
	}
	.teal-col {
		border-left-color: #14b8a6;
	}

	.col-title {
		font-size: 0.65rem;
		color: #777;
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 0.4rem;
	}

	.pills-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.arcana-pill {
		position: relative;
		width: 32px;
		height: 32px;
		background: #0d0d0d;
		border: 1px solid #222;
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arcana-pill:hover {
		border-color: #ef4444;
	}

	.arcana-pill img {
		width: 80%;
		height: 80%;
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

	.empty {
		font-size: 0.65rem;
		color: #444;
		font-style: italic;
	}
</style>
