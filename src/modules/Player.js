/* 
    There will be two types of players in the game, ‘real’ players and ‘computer’
    players.
    Each player object should contain its own gameboard.
 */

import Gameboard from './Gameboard.js'

    // Player factory function
        // --------------------------
export function Player(name, isComputer = false){
    
    const gameboard = Gameboard();
    
    const createFleet = gameboard.createFleet()
    
    const fleet = createFleet;
    
    // Computer places ships randomly
    const placeShipsRandomly = () => {
        const ships = Object.values(fleet);
        const directions = ['horizontal', 'vertical'];
        
        for (const ship of ships) {
            let placed = false;
            
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const dir = directions[Math.floor(Math.random() * 2)];
                
                placed = gameboard.placeShip(ship, [x, y], dir);
            }
        }
    };
    
    if (isComputer) {
        placeShipsRandomly();
    }
    
    const attack = (enemyGameboard, position) => {
        return enemyGameboard.receiveAttack(position);
    };
    
    const computerAttack = (enemyGameboard) => {
        let x, y;
        let validAttack = false;
        
        // Simple AI: random attack
        while (!validAttack) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            
            const cell = enemyGameboard.grid[x][y];
            if (cell !== 'hit' && cell !== 'miss') {
                validAttack = true;
            }
        }
        
        const attackResult = attack(enemyGameboard, [x, y]);
        return { ...attackResult, position: [x, y] };
    };
    
    return {
        name,
        isComputer,
        gameboard,
        fleet,
        attack,
        computerAttack
    };
};

export default Player;