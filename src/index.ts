import { CharacterStats, IAbility } from './types';
import { PowerStrike, DamageReduction, SecondWind, Vampirism } from './abilities';

class Character implements CharacterStats {
  name: string;
  health: number;
  maxHealth: number;
  armour: number;
  attack: number;
  defense: number;
  ability: IAbility;
  prevHealth: number; 

  constructor(name: string, ability: IAbility) {
    this.name = name;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.armour = 30; // base armor
    this.ability = ability;
    this.prevHealth = this.maxHealth;

    // random stats within range
    const attackMin = 15;
    const attackMax = 20;
    const defenseMin = 10;
    const defenseMax = 15;

    this.attack = Math.floor(Math.random() * (attackMax - attackMin + 1)) + attackMin;
    this.defense = Math.floor(Math.random() * (defenseMax - defenseMin + 1)) + defenseMin;
  }

  displayStats() {
    console.log(`${this.name}: attack = ${this.attack}, defense = ${this.defense}, armour = ${this.armour}, ability = ${this.ability.name}`);
  }

  calculateAttackPower(): { rawDamage: number, lifestealPct: number, activated: boolean } {
    // run the pre-attack hook if the ability has it
    if (this.ability.modifyAttack) {
      const result = this.ability.modifyAttack(this.attack);
      const rawDamage = Math.floor(this.attack * (result.damageMultiplier || 1));
      return { rawDamage, lifestealPct: result.lifestealPercentage || 0, activated: result.activated };
    }
    // default attack
    return { rawDamage: this.attack, lifestealPct: 0, activated: false };
  }

  receiveDamage(incomingDamage: number): { totalDamage: number, damageToHealth: number, drActive: boolean, swActive: boolean } {
    this.prevHealth = this.health;
    let effectiveAttack = incomingDamage;
    let drActive = false;
    let swActive = false;

    // pre-defense hook 
    if (this.ability.modifyDefense) {
      const result = this.ability.modifyDefense(effectiveAttack);
      effectiveAttack = Math.floor(effectiveAttack * (result.damageReduction || 1));
      drActive = result.activated;
    }

    // base damage calculation
    let potentialDamage = Math.max(0, effectiveAttack - this.defense);
    let totalDamage = 0;

    // armor overflow logic
    if (this.armour > 0) {
      if (this.armour >= potentialDamage) {
        // armor absorbs everything
        this.armour -= potentialDamage;
        totalDamage = potentialDamage;
        potentialDamage = 0; 
      } else {
        // armor breaks, rest goes to health
        totalDamage = this.armour; 
        potentialDamage -= this.armour;
        this.armour = 0; 
      }
    }

    // prevent negative hp and calculate actual health damage
    const healthDamage = Math.min(this.health, potentialDamage);
    this.health -= healthDamage;
    totalDamage += healthDamage;

    // post-damage hook 
    if (this.ability.onAfterDamage) {
      const result = this.ability.onAfterDamage(this.health, this.prevHealth);
      if (result.activated) {
        // apply heal but don't exceed max health
        this.health = Math.min(this.maxHealth, this.health + (result.heal || 0));
        swActive = true;
      }
    }

    // returning damageToHealth separately for vampirism
    return { totalDamage, damageToHealth: healthDamage, drActive, swActive };
  }
}

function startDuel(c1: Character, c2: Character) {
  console.log("--- Duel Starts! ---"); 
  
  let attacker = Math.random() > 0.5 ? c1 : c2;
  let defender = attacker === c1 ? c2 : c1;
  
  let round = 1;
  let stagnationCounter = 0;
  const maxStagnation = 10;

  while (c1.health > 0 && c2.health > 0) {
    console.log(`\nRound ${round}:`);
    console.log(`${attacker.name} attacks`);

    const attackRes = attacker.calculateAttackPower();
    if (attackRes.activated) {
      console.log(`${attacker.name} activates ${attacker.ability.name}`);
    }

    const defRes = defender.receiveDamage(attackRes.rawDamage);
    if (defRes.drActive) {
      console.log(`${defender.name} activates Damage Reduction`);
    }
    
    // apply vampirism based on actual health damage
    if (attackRes.lifestealPct > 0) {
      const stolenHP = Math.floor(defRes.damageToHealth * attackRes.lifestealPct);
      if (stolenHP > 0) {
        // prevent overheal
        attacker.health = Math.min(attacker.maxHealth, attacker.health + stolenHP);
        console.log(`${attacker.name} steals ${stolenHP} HP`);
      }
    }

    if (defRes.swActive) {
      console.log(`${defender.name} activates Second Wind and heals 5 HP`);
    }

    // only print if nothing happened
    if (!attackRes.activated && !defRes.drActive && !defRes.swActive && attackRes.lifestealPct === 0) {
      console.log("No ability activated");
    }

    console.log(`Damage dealt: ${defRes.totalDamage}`);
    console.log(`${defender.name} has ${defender.health} health and ${defender.armour} armour`);

    // check win condition
    if (defender.health <= 0) {
      console.log(`--- ${attacker.name} won! ---`);
      break;
    }

    // prevent infinite loops if no one takes damage
    const isActionInRound = defRes.totalDamage > 0 || defRes.swActive || defRes.drActive || attackRes.activated;          
    
    if (!isActionInRound) {
      stagnationCounter++;
    } else {
      stagnationCounter = 0; 
    }

    if (stagnationCounter >= maxStagnation) {
      console.log(`--- DRAW! No actions or HP changes for ${maxStagnation} consecutive rounds. ---`);
      break;
    }

    // swap roles for next round
    [attacker, defender] = [defender, attacker];
    round++;
    console.log("--------------------");
  }
}

// init game
console.clear();
const abilityPool = [new PowerStrike(), new DamageReduction(), new SecondWind(), new Vampirism()];

const char1 = new Character("Character 1", abilityPool[Math.floor(Math.random() * abilityPool.length)]);
const char2 = new Character("Character 2", abilityPool[Math.floor(Math.random() * abilityPool.length)]);

console.log("--- Initial Stats ---");
char1.displayStats();
char2.displayStats();

startDuel(char1, char2);