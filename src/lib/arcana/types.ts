import type { Arcana } from '../types/entities';

export interface GridSlot {
  index: number;
  arcana: Arcana | null;
}
