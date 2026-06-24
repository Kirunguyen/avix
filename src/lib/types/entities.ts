export interface Hero {
	id: string;
	name: string;
	image: string;
}

export interface Item {
	id: string;
	name: string;
	image: string;
}

export interface Enchantment {
	id: string;
	name: string;
	image: string;
}

export interface Talent {
	id: string;
	name: string;
	image: string;
}

export interface Arcana {
	id: string;
	name: string;
	image: string;
	color: 'red' | 'purple' | 'teal';
}

export interface ArcanaGroup {
	arcana: Arcana;
	count: number;
}
