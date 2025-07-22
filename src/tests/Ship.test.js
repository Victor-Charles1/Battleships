import Ship  from "../modules/Ship.js";


describe('Ship', () => {
    let carrier;
  
    beforeEach(() => {
      carrier = Ship('carrier',5); // Fresh instance before each test
    });
  
    describe('hit() method', () => {
      test('hit carrier ship once', () => {
        carrier.hit();
        expect(carrier.hitCount).toBe(1);
      });
  
      test('hit carrier ship 4 more times', () => {
        for (let i = 0; i < 4; i++) carrier.hit();
        expect(carrier.hitCount).toBe(4);
      });
  
      test('hit sunk carrier ship again', () => {
        // Sink the ship first
        for (let i = 0; i < 5; i++) carrier.hit();
        expect(carrier.hit()).toBe('Ship is already sunk');
      });
    });
  
    describe('isSunk() method', () => {
      test('if carrier is sunk after 5 hits', () => {
        for (let i = 0; i < 5; i++) carrier.hit();
        expect(carrier.isSunk()).toBe(true);
      });
  
      test('if carrier is not sunk initially', () => {
        expect(carrier.isSunk()).toBe(false);
      });
    });
  });