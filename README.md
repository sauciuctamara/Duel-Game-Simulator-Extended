# Character Duel Simulator - Extended Architecture

## Project Overview

This is an advanced, refactored version of the original Node.js/TypeScript RPG battle simulator. The core logic was rewritten to use Object-Oriented Programming (OOP) concepts, specifically the Strategy Pattern and Event Hooks. This changes the project from a basic script with if/else statements into a scalable system that handles complex rules like armor overflow and lifesteal safely.

## Tech Stack

* TypeScript: Used to ensure type safety and strict contracts (Interfaces) between characters and abilities.
* Node.js: Runtime environment.
* ts-node: Used to run the TypeScript files directly in the terminal.

## How to Run

To run this project locally, make sure you have Node.js installed.
Clone the repository and navigate to the project folder.

Install dependencies:
npm install

Run the simulator:
npx ts-node src/index.ts

## Core Logic & Architecture

The combat system is now decoupled. Abilities are isolated classes that implement an IAbility interface. The Character class simply triggers events (modifyAttack, modifyDefense, onAfterDamage) during the fight, and the abilities react to them.

* Base Stats: Characters start with 100 Max HP, 30 Armour, Attack (15-20), and Defense (10-15).
* Armor Overflow: Damage hits Armour first. If the armor breaks, only the remaining damage affects the character's HP.

Current Abilities (25% chance to trigger):
1. Power Strike: Multiplies base attack by 1.5x.
2. Damage Reduction: Cuts incoming damage in half before defense is applied.
3. Second Wind: Heals 5 HP, but only triggers exactly when health drops to 30 or below.
4. Vampirism: Heals the attacker for 30% of the actual HP damage dealt to the enemy.

## Edge Cases Handled

To make sure the game never crashes or does weird math, I handled these edge cases:
* Negative HP Prevention: The game stops HP exactly at 0. This also stops the Vampirism ability from stealing health from "overkill" damage.
* Overheal Prevention: Healing abilities use a maxHealth limit so characters can't go above 100 HP and become invincible.
* Armor Check for Lifesteal: Vampirism only heals if the attacker damages the actual HP of the enemy. Hitting armor gives no health back.
* Infinite Loop Prevention: If the combat goes on for 10 rounds with no HP changes (e.g. both block all damage), the game forces a DRAW.

## Future Extensions & Scalability

Because of the Strategy Pattern, adding new abilities is very easy. If I were to keep working on this project, here is what I would do next:

1. Run 1,000 matches to find win rates:
I would wrap the startDuel function in a loop that runs 1,000 times. To keep it fast and prevent the terminal from freezing, I would disable the console.log messages and just count the wins for each ability to see which one is the strongest.

2. Add different Character Classes:
Right now, everyone uses the exact same base stats. I would create new classes like Warrior or Mage that extend the base Character. A Warrior would start with 50 armor but lower attack, and would only have access to defense abilities.

3. Save the match history:
Instead of just printing the fight in the terminal, I would write a function to save the round-by-round data into a JSON file. This would be very useful if I ever decide to build a frontend in React to actually show the fight visually.

---
Developed by Tamara Sauciuc
