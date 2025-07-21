/*Gameboards should be able to place ships at specific coordinates by calling the ship factory or class.

 should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
 should keep track of missed attacks so they can display them properly.
 should be able to report whether or not all of their ships have been sunk.
 */
 import { Ship } from './Ship.js';


 export function Gameboard(size = 10) {
     const grid = Array(size).fill(null).map(() => Array(size).fill(null));
     const missedAttacks = [];
     const fleet = []; // track ships on board
     //const fleet = [];
 
     function isValidPosition(position) {
             // Check if position exists and is an array
            if (!Array.isArray(position) || position.length !== 2) {
                return false;
            }
            
            const [x, y] = position;
            
            // Additional type checking for coordinates
            if (typeof x !== 'number' || typeof y !== 'number') {
                return false;
            }
         return x >= 0 && x < size && y >= 0 && y < size;
     }
 
     function isPlacementValid(ship, position, dir) {
         const [x, y] = position;
         //check if x and y are out of bounds
         if (dir === 'horizontal') {
             if (x + ship.length > size) return false;
             for (let i = 0; i < ship.length; i++) {
                 if (grid[x + i][y] !== null) return false;
             }
         } else {
             if (y + ship.length > size) return false;
             for (let i = 0; i < ship.length; i++) {
                 if (grid[x][y + i] !== null) return false;
             }
         }
         return true;
     }
 
     return {
         grid,
         missedAttacks,
         fleet,///store positon where ships are placed
         
 
         placeShip(ship, position, dir) {
             if (!isValidPosition(position) || !isPlacementValid(ship, position, dir)) {
                 return false;
             }
 
             const [x, y] = position;
             if (dir === 'horizontal') {
                 for (let i = 0; i < ship.length; i++) {
                    ship.coordinates.push([x+i,y])//stores in ship property coordinates
                     grid[x + i][y] = ship.name;
                     
                 }
             }else{
                 for (let i = 0; i < ship.length; i++) {
                     ship.coordinates.push([x,y+i])
                     grid[x][y + i] = ship.name;
                    
                 }
             }
             fleet.push(ship);
             return true;
         },
 
         receiveAttack(position) {
            if (!isValidPosition(position)) return null;

            const [x, y] = position;
            const target = grid[x][y];

            if (target === 'hit' || target === 'miss') return null;

            if (target === null) {missedAttacks.push([x, y]);
                grid[x][y] = 'miss';
                return false;
            }
                //grid[x][y] = 'hit';
            for(const ship of fleet){// for each ship in fleet,
            // if target [x,y] in ship coordinates call hit
                if(target===ship.name){
                    ship.hit();
                    grid[x][y] = 'hit';
                    return true;

                }
           
            
            }
        

         },
 
         areAllSunk(){
             return fleet.every(ship => ship.isSunk());
         },
 
         createFleet() {
             return {
                 carrier: Ship('carrier',5),
                 battleship: Ship('battleship',4),
                 cruiser: Ship('cruiser',3),
                 submarine: Ship('submarine',3),
                 destroyer: Ship('destroyer',2)
             };
         }
     };
 }

