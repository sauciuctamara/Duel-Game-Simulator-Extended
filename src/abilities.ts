import { IAbility, AbilityResult, AbilityName } from './types';

const rollDice = (): boolean => Math.random() <= 0.25;

export class PowerStrike implements IAbility {
  readonly name: AbilityName = 'Power Strike';
  
  modifyAttack(baseAttack: number): AbilityResult {
    const activated = rollDice();
    return { activated, damageMultiplier: activated ? 1.5 : 1 };
  }
}

export class DamageReduction implements IAbility {
  readonly name: AbilityName = 'Damage Reduction';
  
  modifyDefense(incomingDamage: number): AbilityResult {
    const activated = rollDice();
    return { activated, damageReduction: activated ? 0.5 : 1 };
  }
}

export class SecondWind implements IAbility {
  readonly name: AbilityName = 'Second Wind';
  
  onAfterDamage(currentHealth: number, prevHealth: number): AbilityResult {
    const droppedBelowThreshold = prevHealth > 30 && currentHealth <= 30;
    const survived = currentHealth > 0;
    
    const activated = droppedBelowThreshold && survived && rollDice();
    return { activated, heal: activated ? 5 : 0 };
  }
}

export class Vampirism implements IAbility {
  readonly name: AbilityName = 'Vampirism';
  
  modifyAttack(): AbilityResult {
    const activated = rollDice();
    return { activated, lifestealPercentage: activated ? 0.3 : 0 };
  }
}