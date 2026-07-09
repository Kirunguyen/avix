<script lang="ts">
	interface Props {
		currentPage: string;
		onPageChange: (page: string) => void;
	}

	let { currentPage, onPageChange }: Props = $props();

	const tabs = [
		{ id: 'hero', label: 'Hero' },
		{ id: 'armory', label: 'Armory' },
		{ id: 'enchantments', label: 'Enchantments' },
		{ id: 'talents', label: 'Talents' },
		{ id: 'arcana', label: 'Arcana' }
	];
</script>

<div class="tabs-outer-scroller">
	<div class="tabs">
		{#each tabs as tab (tab.id)}
			<button class:selected={currentPage === tab.id} onclick={() => onPageChange(tab.id)}>
				{tab.label}
			</button>
		{/each}
	</div>
</div>

<style>
	/* Horizontal scroller wrapper that hides scrollbars on mobile */
	.tabs-outer-scroller {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none; /* Firefox */
		border-bottom: 1px solid #1f1f1f;
		margin-bottom: 0.75rem;
	}

	.tabs-outer-scroller::-webkit-scrollbar {
		display: none; /* Safari & Chrome */
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
		padding-bottom: 0.5rem;
		min-width: max-content; /* Guarantees no column-wrapping */
	}

	button {
		background: none;
		border: none;
		color: #64748b;
		padding: 0.5rem 0.85rem;
		cursor: pointer;
		font-weight: 700;
		font-size: 0.85rem;
		transition:
			color 0.15s,
			border-bottom-color 0.15s;
		position: relative;
		outline: none;
	}

	button:hover {
		color: #f1f5f9;
	}

	button.selected {
		color: #3b82f6;
	}

	button.selected::after {
		content: '';
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		right: 0;
		height: 2px;
		background-color: #3b82f6;
	}
</style>
