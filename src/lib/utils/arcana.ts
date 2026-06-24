import type { Arcana, ArcanaGroup, ArcanaStats } from '../types/entities';

/**
 * Aggregates duplicate arcanas into groups with counts.
 */
export function groupArcana(arcanas: Arcana[]): ArcanaGroup[] {
	const groups: Record<string, ArcanaGroup> = {};
	for (const arcana of arcanas) {
		if (groups[arcana.id]) {
			groups[arcana.id].count++;
		} else {
			groups[arcana.id] = { arcana, count: 1 };
		}
	}
	return Object.values(groups);
}

/**
 * Aggregates and sums stats from all equipped arcanas.
 */
export function calculateTotalArcanaStats(arcanas: Arcana[]): { key: string; value: number }[] {
	const totals: Record<string, number> = {};

	for (const arcana of arcanas) {
		if (!arcana.stats) continue;
		for (const [statName, value] of Object.entries(arcana.stats)) {
			if (value !== undefined) {
				totals[statName] = (totals[statName] || 0) + value;
			}
		}
	}

	// Format keys into clean, human-readable display names
	return Object.entries(totals).map(([key, value]) => {
		const formattedKey = key
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (str) => str.toUpperCase());
		return {
			key: formattedKey,
			value: parseFloat(value.toFixed(2))
		};
	});
}
