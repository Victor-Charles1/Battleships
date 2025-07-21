
import { Player } from '../modules/Player.js';
//import { Ship } from '../modules/Ship.js';
//import { Gameboard } from '../modules/Gameboard.js';

describe('Player Factory', () => {
    let humanPlayer;
    let computerPlayer;
    let mockEnemyGameboard;

    beforeEach(() => {
        // Create a mock enemy gameboard
        mockEnemyGameboard = {
            grid: Array(10).fill().map(() => Array(10).fill(null)),
            receiveAttack: jest.fn(),
            areAllSunk: jest.fn()
        };

        // Create players
        humanPlayer = Player();
        computerPlayer = Player('Computer', true);
    });

    test('creates human player with correct properties', () => {
        expect(humanPlayer.name).toBe('Human');
        expect(humanPlayer.isComputer).toBe(false);
        expect(humanPlayer.gameboard).toBeInstanceOf(Object);
        expect(humanPlayer.fleet).toBeInstanceOf(Object);
    });

    test('creates computer player with correct properties', () => {
        expect(computerPlayer.name).toBe('Computer');
        expect(computerPlayer.isComputer).toBe(true);
        expect(computerPlayer.gameboard).toBeInstanceOf(Object);
        expect(computerPlayer.fleet).toBeInstanceOf(Object);
    });

    test('creates a fleet with correct ships', () => {
        const fleet = humanPlayer.fleet;
        
        expect(fleet.carrier.length).toBe(5);
        expect(fleet.battleship.length).toBe(4);
        expect(fleet.cruiser.length).toBe(3);
        expect(fleet.submarine.length).toBe(3);
        expect(fleet.destroyer.length).toBe(2);
        
        // Verify all are Ship instances
        Object.values(fleet).forEach(ship => {
            expect(ship).toBeInstanceOf(Object);
            expect(typeof ship.hit).toBe('function');
            expect(typeof ship.isSunk).toBe('function');
        });
    });

    test('computer places all ships randomly during initialization', () => {
        // Count ships placed on computer's board
        let shipCount = 0;
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (computerPlayer.gameboard.grid[x][y] !== null) {
                    shipCount++;
                }
            }
        }
        
        // Total ship cells: 5+4+3+3+2 = 17
        expect(shipCount).toBe(17);
    });

    test('attack method calls receiveAttack on enemy gameboard', () => {
        const position = [3, 4];
        humanPlayer.attack(mockEnemyGameboard, position);
        
        expect(mockEnemyGameboard.receiveAttack).toHaveBeenCalledWith(position);
    });

    test('computerAttack generates valid attacks', () => {
        // Mock gameboard that always has valid cells
        const validGameboard = {
            grid: Array(10).fill().map(() => Array(10).fill(null)),
            receiveAttack: jest.fn().mockReturnValue({ hit: false })
        };
        
        // Test multiple attacks
        for (let i = 0; i < 50; i++) {
            const result = computerPlayer.computerAttack(validGameboard);
            const [x, y] = result.position;
            
            // Validate position
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(10);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThan(10);
            
            // Validate attack was called
            expect(validGameboard.receiveAttack).toHaveBeenCalledWith(result.position);
        }
    });

    test('computerAttack avoids previously attacked positions', () => {
        // Create a gameboard with some attacked positions
        const attackedGameboard = {
            grid: Array(10).fill().map((_, x) => 
                Array(10).fill().map((_, y) => 
                    (x < 5 && y < 5) ? 'hit' : null
                )
            ),
            receiveAttack: jest.fn()
        };
        
        // Test multiple attacks
        for (let i = 0; i < 25; i++) {
            const result = computerPlayer.computerAttack(attackedGameboard);
            const [x, y] = result.position;
            
            // Should never attack positions <5, <5
            expect(x >= 5 || y >= 5).toBe(true);
        }
    });
});