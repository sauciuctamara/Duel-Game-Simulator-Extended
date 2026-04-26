Character Duel Simulator - Extended Architecture

Project Overview

This is an advanced, refactored version of the original Node.js/TypeScript RPG battle simulator. The core logic was completely rewritten to implement Object-Oriented Programming (OOP) design patterns, specifically the Strategy Pattern and Event Hooks. This transforms the project from a rigid script into a highly scalable, decoupled combat system capable of handling complex mechanics like armor overflow and lifesteal.

Tech Stack

TypeScript: Used to enforce strict contracts (Interfaces) between characters and abilities.
Node.js: Runtime environment.
ts-node: Used for direct execution of TypeScript files without manual compilation steps.

How to Run

To run this project locally, ensure you have Node.js installed.
Clone the repository and navigate to the project folder.
Install dependencies:
npm install

Run the simulator directly from the source folder:
npx ts-node src/index.ts

Core Logic & Architecture

The combat system no longer relies on hardcoded if/else statements. Instead, abilities are isolated classes that implement an IAbility interface. The Character class simply calls event hooks (modifyAttack, modifyDefense, onAfterDamage) during specific combat phases.

Stats: Characters start with 100 Max HP, 30 Armour, Attack (15-20), and Defense (10-15).
Armor Overflow Logic: Incoming damage hits Armour first. Only when Armour reaches 0 does the remaining unabsorbed damage spill over to the character's HP.

Current Ability Pool (25% trigger chance):
1. Power Strike: Multiplies base attack by 1.5x.
2. Damage Reduction: Halves incoming damage before base defense is subtracted.
3. Second Wind: Heals 5 HP, triggering only when health drops to 30 or below.
4. Vampirism: Heals the attacker for 30% of the actual health damage dealt.

Edge Cases Handled (Resiliency)

To ensure mathematical accuracy and prevent game-breaking bugs, several edge cases were addressed:

Contextual Lifesteal: Vampirism calculates healing strictly based on damage applied to health (blood). Damage absorbed by armor yields no healing for the attacker.
Overkill & Health Clamping: Damage calculations ensure HP stops exactly at 0. This prevents negative values and stops lifesteal from calculating returns on "phantom" damage beyond the defender's remaining health.
Overheal Prevention: Healing from Second Wind or Vampirism is capped using the character's maxHealth property to prevent infinite scaling or invincibility.
Stagnation / Deadlock Detection: If combat loops for 10 rounds with no HP changes or ability triggers (e.g., both characters have high defense), the match is safely terminated and declared a DRAW.
Strict State Transitions: Second Wind checks prevHealth against currentHealth to trigger only once upon crossing the threshold, preventing constant healing loops.

Future Extensions & Scalability

Since adding new abilities is now extremely easy due to the Strategy Pattern (it only requires creating a new class without touching the core combat loop), here is how I would approach future extensions:
1. Character Classes: Implement specific classes (Tank, Assassin, Mage) that inherit from the base Character. Each class would have weighted stat distributions (e.g., Tanks start with 50 Armour but lower Attack) and exclusive ability pools.
2. Mass Simulation & Analytics: Wrap the startDuel function in a loop to run 10,000 automated matches with logging disabled. The output would simply display win rates for each ability, allowing for data-driven balance patches.
3. Combat Logging: Instead of just printing to the console, I would build a service to write the round-by-round combat data into a JSON file, creating a permanent history that could be read by a future frontend interface.

Developed by Tamara Sauciuc
