<script lang="ts">
	import type { Hero } from '../types/entities';

	// Import Vite-managed Role assets
	import rolesIcon from '$lib/assets/heroes/roles/roles.webp';
	import assassinIcon from '$lib/assets/heroes/roles/assassin.webp';
	import mageIcon from '$lib/assets/heroes/roles/mage.webp';
	import marksmanIcon from '$lib/assets/heroes/roles/marksman.webp';
	import supportIcon from '$lib/assets/heroes/roles/support.webp';
	import tankIcon from '$lib/assets/heroes/roles/tank.webp';
	import warriorIcon from '$lib/assets/heroes/roles/warrior.webp';

	// Import Vite-managed Lane assets
	import lanesIcon from '$lib/assets/heroes/lanes/lanes.webp';
	import dragonLaneIcon from '$lib/assets/heroes/lanes/dragon_lane.webp';
	import jungleIcon from '$lib/assets/heroes/lanes/jungle.webp';
	import midLaneIcon from '$lib/assets/heroes/lanes/mid_lane.webp';
	import roamIcon from '$lib/assets/heroes/lanes/roam.webp';
	import slayerLaneIcon from '$lib/assets/heroes/lanes/slayer_lane.webp';

	interface Props {
		heroes: Hero[];
		selectedHero: Hero | null;
		onSelect: (hero: Hero) => void;
	}

	let { heroes, selectedHero, onSelect }: Props = $props();

	// Active filter states
	let activeRole = $state<string>('All');
	let activeLane = $state<string>('All');

	// Toggle states for custom dropdown menus
	let roleMenuOpen = $state<boolean>(false);
	let laneMenuOpen = $state<boolean>(false);

	// Custom configuration collections
	const roles = [
		{ id: 'All', display: 'Any Role', icon: rolesIcon },
		{ id: 'Warrior', display: 'Warrior', icon: warriorIcon },
		{ id: 'Mage', display: 'Mage', icon: mageIcon },
		{ id: 'Tank', display: 'Tank', icon: tankIcon },
		{ id: 'Assassin', display: 'Assassin', icon: assassinIcon },
		{ id: 'Support', display: 'Support', icon: supportIcon },
		{ id: 'Marksman', display: 'Marksman', icon: marksmanIcon }
	] as const;

	const lanes = [
		{ id: 'All', display: 'All Lanes', icon: lanesIcon },
		{ id: 'Mid', display: 'Mid Lane', icon: midLaneIcon },
		{ id: 'Dragon', display: 'Dragon Lane', icon: dragonLaneIcon },
		{ id: 'Slayer', display: 'Slayer Lane', icon: slayerLaneIcon },
		{ id: 'Jungle', display: 'Jungle', icon: jungleIcon },
		{ id: 'Roam', display: 'Roam', icon: roamIcon }
	] as const;

	// Svelte 5 derived selections for trigger button displays
	const currentRoleObj = $derived(roles.find((r) => r.id === activeRole) || roles[0]);
	const currentLaneObj = $derived(lanes.find((l) => l.id === activeLane) || lanes[0]);

	// Filter evaluations
	const filteredHeroes = $derived(
		heroes.filter((hero) => {
			const matchesRole = activeRole === 'All' || (hero.roles && hero.roles.includes(activeRole));
			const matchesLane = activeLane === 'All' || (hero.lanes && hero.lanes.includes(activeLane));
			return matchesRole && matchesLane;
		})
	);

	// Action methods to close other menus on toggle
	function toggleRoleMenu() {
		roleMenuOpen = !roleMenuOpen;
		if (roleMenuOpen) laneMenuOpen = false;
	}

	function toggleLaneMenu() {
		laneMenuOpen = !laneMenuOpen;
		if (laneMenuOpen) roleMenuOpen = false;
	}

	function selectRole(roleId: string) {
		activeRole = roleId;
		roleMenuOpen = false;
	}

	function selectLane(laneId: string) {
		activeLane = laneId;
		laneMenuOpen = false;
	}
</script>

<div class="hero-selector-wrapper">
	<!-- Workspace Dropdowns Header -->
	<div class="dropdowns-panel">
		<!-- Role Custom Select -->
		<div class="custom-select-box">
			<span class="dropdown-label">Role Category</span>
			<button class="select-trigger" onclick={toggleRoleMenu} class:active={roleMenuOpen}>
				<div class="trigger-meta">
					<img src={currentRoleObj.icon} alt="" class="select-icon" />
					<span>{currentRoleObj.display}</span>
				</div>
				<span class="chevron-arrow">{roleMenuOpen ? '▲' : '▼'}</span>
			</button>

			{#if roleMenuOpen}
				<div class="options-container">
					{#each roles as role (role.id)}
						<button
							class="option-item"
							class:selected={activeRole === role.id}
							onclick={() => selectRole(role.id)}
						>
							<img src={role.icon} alt="" class="select-icon" />
							<span>{role.display}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Lane Custom Select -->
		<div class="custom-select-box">
			<span class="dropdown-label">Lane Selection</span>
			<button class="select-trigger" onclick={toggleLaneMenu} class:active={laneMenuOpen}>
				<div class="trigger-meta">
					<img src={currentLaneObj.icon} alt="" class="select-icon" />
					<span>{currentLaneObj.display}</span>
				</div>
				<span class="chevron-arrow">{laneMenuOpen ? '▲' : '▼'}</span>
			</button>

			{#if laneMenuOpen}
				<div class="options-container">
					{#each lanes as lane (lane.id)}
						<button
							class="option-item"
							class:selected={activeLane === lane.id}
							onclick={() => selectLane(lane.id)}
						>
							<img src={lane.icon} alt="" class="select-icon" />
							<span>{lane.display}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Hero Grid Section -->
	<div class="icon-grid">
		{#each filteredHeroes as hero (hero.id)}
			<button
				class="hero-btn"
				class:selected={selectedHero?.id === hero.id}
				onclick={() => onSelect(hero)}
				title={hero.name}
			>
				<div class="image-wrapper">
					<img src="/heroes/icons/{hero.image}" alt={hero.name} loading="lazy" />
				</div>
				<span class="hero-name">{hero.name}</span>
			</button>
		{:else}
			<div class="empty-results-state">No heroes match the selected filters.</div>
		{/each}
	</div>
</div>

<style>
	.hero-selector-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Side-by-Side Custom Select Header */
	.dropdowns-panel {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		background-color: #0b0b0b;
		border: 1px solid #1f1f1f;
		border-radius: 12px;
		padding: 1rem;
	}

	@media (min-width: 600px) {
		.dropdowns-panel {
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
		}
	}

	.custom-select-box {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		position: relative;
	}

	.dropdown-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: 800;
		letter-spacing: 0.05em;
	}

	/* Trigger and Option button bindings */
	.select-trigger {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 8px;
		color: #e2e8f0;
		padding: 0.6rem 1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.85rem;
		font-weight: 600;
		transition: all 0.15s;
		outline: none;
		width: 100%;
	}

	.select-trigger:hover,
	.select-trigger.active {
		border-color: #2563eb;
		background-color: #141414;
	}

	.trigger-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.select-icon {
		width: 18px;
		height: 18px;
		object-fit: contain;
	}

	.chevron-arrow {
		font-size: 0.6rem;
		color: #555;
		transition: color 0.15s;
	}

	.select-trigger:hover .chevron-arrow,
	.select-trigger.active .chevron-arrow {
		color: #2563eb;
	}

	/* Absolute Options Menu Wrapper */
	.options-container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.25rem;
		background-color: #0d0d0d;
		border: 1px solid #333;
		border-radius: 8px;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.5),
			0 4px 6px -2px rgba(0, 0, 0, 0.5);
		z-index: 100;
		max-height: 250px;
		overflow-y: auto;
		padding: 0.25rem;
	}

	.option-item {
		width: 100%;
		background: none;
		border: none;
		border-radius: 6px;
		color: #94a3b8;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-align: left;
		transition: all 0.15s;
		outline: none;
	}

	.option-item:hover {
		background-color: #1e293b;
		color: #fff;
	}

	.option-item.selected {
		background-color: rgba(37, 99, 235, 0.15);
		color: #3b82f6;
		border: 1px solid rgba(37, 99, 235, 0.3);
	}

	/* Grid Layout Styling */
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
		gap: 0.65rem;
		padding: 0.25rem;
	}

	.hero-btn {
		background: #141414;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 0.35rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			transform 0.1s;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		box-sizing: border-box;
	}

	.hero-btn:hover {
		border-color: #444;
		transform: translateY(-2px);
	}

	.hero-btn.selected {
		border-color: #3b82f6;
		background: #1e293b;
	}

	.image-wrapper {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 4px;
		overflow: hidden;
		background-color: #090909;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-name {
		font-size: 0.7rem;
		color: #bbb;
		margin-top: 0.35rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		font-weight: 600;
	}

	.hero-btn.selected .hero-name {
		color: #60a5fa;
		font-weight: bold;
	}

	.empty-results-state {
		grid-column: 1 / -1;
		text-align: center;
		color: #444;
		font-style: italic;
		font-size: 0.8rem;
		padding: 3rem 0;
	}
</style>
