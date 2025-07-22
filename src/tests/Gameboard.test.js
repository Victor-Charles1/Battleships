import Gameboard from '../modules/Gameboard.js'

describe('Gameboard ', () => {
    let testBoard;
    let fleet;
    const size = 10
    
    
    beforeEach(() => {
        testBoard = Gameboard(size);
        fleet = testBoard.createFleet()
    });

    test('createFleet() returns correct ships', () => {
        expect(fleet.carrier.length).toBe(5);
        expect(fleet.battleship.length).toBe(4);
        expect(fleet.submarine.length).toBe(3);
        expect(fleet.destroyer.length).toBe(2);
    });
    test('hit() increments hitCount', () => {
        fleet.carrier.hit();
        expect(fleet.carrier.hitCount).toBe(1);
        fleet.carrier.hit();
        expect(fleet.carrier.hitCount).toBe(2);
    });

    describe('placeShip()', () => {
        test('places horizontal ship correctly', () => {
            //const ship = Ship(3);
            expect(testBoard.placeShip(fleet.submarine, [2, 3], 'horizontal')).toBe(true);
            expect(testBoard.grid[2][3]).toBe(fleet.submarine);
            expect(testBoard.grid[4][3]).toBe(fleet.submarine);
        });

        test('places vertical ship correctly', () => {
            expect(testBoard.placeShip(fleet.destroyer, [3, 0], 'vertical')).toBe(true);
            expect(testBoard.grid[3][0]).toBe(fleet.destroyer);
            expect(testBoard.grid[3][1]).toBe(fleet.destroyer);
           
            expect(testBoard.placeShip(fleet.carrier, [0, 0], 'vertical')).toBe(true);
            expect(testBoard.grid[0][0]).toBe(fleet.carrier);
            expect(testBoard.grid[0][4]).toBe(fleet.carrier);
            

        });

        test('rejects out-of-bounds placement', () => {
            expect(testBoard.placeShip(fleet.battleship, [8, 9], 'vertical')).toBe(false);
        });

        test('rejects overlapping ships', () => {
            //const ship1 = Ship(3);
            testBoard.placeShip(fleet.battleship, [2, 2], 'horizontal');
            //const ship2 = Ship(2);
            expect(testBoard.placeShip(fleet.destroyer, [3, 2], 'vertical')).toBe(false);
        });

    });

    describe('receiveAttack()', () => {
        test('registers hit on ship', () => {
            //place ship
            expect(testBoard.placeShip(fleet.carrier, [4, 0], 'vertical')).toBe(true);
            // Verify the board was marked
            expect(testBoard.grid[4][0]).toBe(fleet.carrier);         
            // Attack and verify return value
            expect(testBoard.receiveAttack([4, 0])).toBe(true);
            expect(fleet.carrier.hitCount).toBe(1)
            // Verify the ship hit counter
            testBoard.receiveAttack([4,1])
            expect(fleet.carrier.hitCount).toBe(2)
            testBoard.receiveAttack([4, 2])
            testBoard.receiveAttack([4, 3])
            expect(fleet.carrier.hitCount).toBe(4);
            //verify board
            expect(testBoard.grid[4][0]).toBe('hit');
            testBoard.receiveAttack([5, 0])   
            expect(testBoard.grid[5][0]).toBe('miss');
            
            
        });

        test('registers miss correctly', () => {
            expect(testBoard.receiveAttack([0, 0])).toBe(false);
            expect(testBoard.missedAttacks).toContainEqual([0,0]);
        });
    
        test('rejects duplicate attacks', () => {
            testBoard.receiveAttack([1, 1]);
            expect(testBoard.receiveAttack([1, 1])).toBeNull();
        });
    });
    describe('areAllSunk()', () => {
        test('returns true when all ships are sunk', () => {
            const fleet = testBoard.createFleet();
            Object.values(fleet).forEach(ship => {
                testBoard.placeShip(ship, [0, 0], 'horizontal');
                while (!ship.isSunk()) ship.hit();
            });
            expect(testBoard.areAllSunk()).toBe(true);
        });
    });
});

