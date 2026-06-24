import type { Arcana, ArcanaGroup } from '../types/entities';

/**
 * Aggregates duplicate arcanas into groups with a dynamic quantity count.
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
