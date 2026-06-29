export interface Hero {
	id: string;
	name: string;
	image: string;
}

export interface Item {
	id: string;
	image: string;
	category: 'Attack' | 'Magic' | 'Defense' | 'Movement' | 'Jungling' | 'Support';
	level: number;
	number: number;
	name: string;
}

export interface Enchantment {
	id: string;
	image: string;
	category: 'Veda' | 'Lokheim' | 'Afata' | 'League of Humans';
	level: number;
	number: number;
	name: string;
}

export interface Talent {
	id: string;
	name: string;
	image: string;
}

export interface ArcanaStats {
	abilityPower?: number;
	attackDamage?: number;
	armorPierce?: number;
	lifesteal?: number;
	criticalRate?: number;
	criticalDamage?: number;
	attackSpeed?: number;
	maxHp?: number;
	armor?: number;
	magicPierce?: number;
	magicLifesteal?: number;
	hp5s?: number;
	magicArmor?: number;
	movementSpeed?: number;
	cooldownReduction?: number;
}

export interface Arcana {
	id: string;
	name: string;
	image: string;
	color: 'red' | 'purple' | 'teal';
	stats: ArcanaStats;
	displayName: string;
}

export interface ArcanaGroup {
	arcana: Arcana;
	count: number;
}
