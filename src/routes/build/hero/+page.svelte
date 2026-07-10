<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildState } from '$lib/state.svelte';
	import HeroSelector from '$lib/components/HeroSelector.svelte';
	import heroListRaw from '$lib/data/heroes.json';
	import type { Hero } from '$lib/types/entities';

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

	const heroList = heroListRaw as Hero[];

	// Filter states
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
		heroList.filter((hero) => {
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

<div class="editor-wrapper">
	<!-- Workspace header (Filters shifted up into the sticky block to save vertical content space) -->
	<div class="editor-header">
		<button class="back-btn" onclick={() => goto(resolve('/'))}>← Done</button>
		<h1 class="editor-title">Select Hero</h1>

		<div class="header-filters-row">
			<!-- Role Custom Select -->
			<div class="custom-select-box">
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
	</div>

	<!-- Workspace main selector body (Parallel 2-panel game client layout) -->
	<div class="editor-body">
		<div class="picker-panel">
			<HeroSelector
				heroes={filteredHeroes}
				selectedHero={buildState.selectedHero}
				onSelect={(hero) => buildState.selectHero(hero)}
			/>
		</div>

		<!-- Right Side: Lightweight Preview Drawer (Always visible in Landscape) -->
		<div class="lightweight-preview">
			<span class="preview-label">Active Hero</span>
			{#if buildState.selectedHero}
				<div class="hero-chip">
					<img src="/heroes/icons/{buildState.selectedHero.image}" alt="" />
					<span class="hero-chip-name">{buildState.selectedHero.name}</span>
				</div>
			{:else}
				<span class="none-text">None</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background-color: #050505;
		box-sizing: border-box;
		overflow: hidden;
	}

	.editor-header {
		display: flex;
		align-items: center;
		background-color: #0b0b0b;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid #1a1a1a;
		height: 54px;
		box-sizing: border-box;
	}

	.back-btn {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #ccc;
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.back-btn:hover {
		background-color: #2563eb;
		color: #fff;
		border-color: #3b82f6;
	}

	.editor-title {
		font-size: 1rem;
		font-weight: bold;
		color: #fff;
		margin: 0 0 0 1.25rem;
	}

	/* Sticky Header Filters positioning */
	.header-filters-row {
		display: flex;
		gap: 0.5rem;
		margin-left: auto; /* Pushes dropdown selectors to the right side */
	}

	.custom-select-box {
		position: relative;
	}

	.select-trigger {
		background-color: #121212;
		border: 1px solid #222;
		border-radius: 6px;
		color: #e2e8f0;
		padding: 0.35rem 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
		font-weight: 600;
		transition: all 0.15s;
		outline: none;
		gap: 0.5rem;
	}

	.select-trigger:hover,
	.select-trigger.active {
		border-color: #2563eb;
		background-color: #141414;
	}

	.trigger-meta {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.select-icon {
		width: 14px;
		height: 14px;
		object-fit: contain;
	}

	.chevron-arrow {
		font-size: 0.5rem;
		color: #555;
	}

	/* Options lists wrapper positioning */
	.options-container {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.25rem;
		background-color: #0d0d0d;
		border: 1px solid #333;
		border-radius: 6px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
		z-index: 100;
		max-height: 220px;
		overflow-y: auto;
		padding: 0.2rem;
		width: 130px;
	}

	.option-item {
		width: 100%;
		background: none;
		border: none;
		border-radius: 4px;
		color: #94a3b8;
		padding: 0.4rem 0.6rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: left;
		transition: all 0.1s;
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

	/* 2-panel horizontal split */
	.editor-body {
		display: grid;
		grid-template-columns: 75% 25%;
		height: calc(100vh - 54px);
		width: 100%;
	}

	.picker-panel {
		overflow-y: auto;
		padding: 1rem;
		box-sizing: border-box;
		border-right: 1px solid #141414;
	}

	.lightweight-preview {
		background-color: #0b0b0b;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.preview-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: #555;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.hero-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		background-color: #121212;
		border: 1px solid #222;
		padding: 1.25rem 1rem;
		border-radius: 8px;
		text-align: center;
	}

	.hero-chip img {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: 2px solid #3b82f6;
	}

	.hero-chip-name {
		font-size: 0.95rem;
		font-weight: bold;
		color: #fff;
	}

	.none-text {
		font-size: 0.85rem;
		color: #444;
		font-style: italic;
	}
</style>
