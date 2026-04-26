// all possible abilities in the game
export type AbilityName = 'Damage Reduction' | 'Power Strike' | 'Second Wind' | 'Vampirism';

// what an ability should look like
export interface IAbility {
  readonly name: AbilityName;
  modifyAttack?(baseAttack: number): AbilityResult;
  modifyDefense?(incomingDamage: number): AbilityResult;
  onAfterDamage?(currentHealth: number, prevHealth: number): AbilityResult;
}

// data returned by an ability hook
export interface AbilityResult {
  activated: boolean;
  damageMultiplier?: number;
  damageReduction?: number;
  heal?: number;
  lifestealPercentage?: number; 
}

// character base stats structure
export interface CharacterStats {
  name: string;
  health: number;
  maxHealth: number;
  armour: number;
  attack: number;
  defense: number;
  ability: IAbility;
}