import type { Hero, Item, Enchantment, Talent, Arcana } from './types/entities';
import heroListRaw from './data/heroes.json';
import talentListRaw from '$lib/data/talents.json';

const heroList = heroListRaw as Hero[];
const talentList = talentListRaw as Talent[];

export class BuildState {
  selectedHero = $state<Hero | null>(heroList[0] || null);
  armoryCapacity = $state<number>(6);
  armory = $state<(Item | null)[]>([null, null, null, null, null, null]);
  selectedEnchantments = $state<(Enchantment | null)[]>([null, null, null, null, null]);
  selectedTalent = $state<Talent | null>(talentList[0] || null);
  redArcana = $state<Arcana[]>([]);
  purpleArcana = $state<Arcana[]>([]);
  tealArcana = $state<Arcana[]>([]);

  // Custom configuration fields moved to global state
  buildName = $state<string>('');
  authorName = $state<string>('');

  selectHero(hero: Hero) {
    this.selectedHero = hero;
  }

  addItem(item: Item) {
    const idx = this.armory.indexOf(null);
    if (idx !== -1) {
      this.armory[idx] = item;
    }
  }

  removeItem(index: number) {
    this.armory[index] = null;
  }

  changeArmoryCapacity(newCapacity: number) {
    if (newCapacity < 6 || newCapacity > 12) return;
    if (newCapacity > this.armory.length) {
      const diff = newCapacity - this.armory.length;
      this.armory = [...this.armory, ...Array(diff).fill(null)];
    } else {
      this.armory = this.armory.slice(0, newCapacity);
    }
    this.armoryCapacity = newCapacity;
  }

  addEnchantment(enchantment: Enchantment) {
    const idx = this.selectedEnchantments.indexOf(null);
    if (idx !== -1) {
      this.selectedEnchantments[idx] = enchantment;
    }
  }

  removeEnchantment(index: number) {
    this.selectedEnchantments[index] = null;
  }

  selectTalent(talent: Talent) {
    this.selectedTalent = talent;
  }

  addArcana(arcana: Arcana) {
    if (arcana.color === 'red' && this.redArcana.length < 10) {
      this.redArcana = [...this.redArcana, arcana];
    } else if (arcana.color === 'purple' && this.purpleArcana.length < 10) {
      this.purpleArcana = [...this.purpleArcana, arcana];
    } else if (arcana.color === 'teal' && this.tealArcana.length < 10) {
      this.tealArcana = [...this.tealArcana, arcana];
    }
  }

  removeArcana(color: 'red' | 'purple' | 'teal', arcanaId: string) {
    if (color === 'red') {
      const idx = this.redArcana.findIndex((a) => a.id === arcanaId);
      if (idx !== -1) this.redArcana = this.redArcana.filter((_, i) => i !== idx);
    } else if (color === 'purple') {
      const idx = this.purpleArcana.findIndex((a) => a.id === arcanaId);
      if (idx !== -1) this.purpleArcana = this.purpleArcana.filter((_, i) => i !== idx);
    } else if (color === 'teal') {
      const idx = this.tealArcana.findIndex((a) => a.id === arcanaId);
      if (idx !== -1) this.tealArcana = this.tealArcana.filter((_, i) => i !== idx);
    }
  }
}

export const buildState = new BuildState();
