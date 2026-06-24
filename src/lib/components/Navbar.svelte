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

<div class="tabs">
	{#each tabs as tab}
		<button
			class:selected={currentPage === tab.id}
			onclick={() => onPageChange(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid #333;
		padding-bottom: 0.5rem;
	}

	button {
		background: none;
		border: none;
		color: #888;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.95rem;
		transition: color 0.2s, border-bottom-color 0.2s;
		position: relative;
	}

	button:hover {
		color: #fff;
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
