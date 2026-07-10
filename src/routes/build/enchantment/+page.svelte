<script lang="ts">
	import { resolve } from '$app/paths';
	import EnchantmentSelector from '$lib/components/EnchantmentSelector.svelte';
	import enchantmentListRaw from '$lib/data/enchantments.json';
	import type { Enchantment } from '$lib/types/entities';

	const enchantmentList = enchantmentListRaw as Enchantment[];
</script>

<div class="editor-wrapper">
	<!-- Sticky Editor Header -->
	<div class="editor-header">
		<a class="back-btn" href={resolve('/')}>← Done</a>
		<h1 class="editor-title">Configure Enchantments</h1>
	</div>

	<!-- Full-bleed horizontal split editor body -->
	<div class="editor-body">
		<EnchantmentSelector enchantments={enchantmentList} />
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
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: all 0.15s;
		outline: none;
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

	/* Full-screen horizontal split body */
	.editor-body {
		flex: 1;
		height: calc(100vh - 54px);
		width: 100%;
		padding: 1rem;
		box-sizing: border-box;
	}
</style>
