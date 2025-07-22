//import Ship from './Ship.js';

import Ship from "./Ship";

const Gameboard = (size = 10) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(null));
  const missedAttacks = [];
  const ships = [];
  const shipPositions = new Map(); // Track ship positions separately
  
  const isValidPosition = (position) => {
    if (!Array.isArray(position) || position.length !== 2) return false;
    const [x, y] = position;
    return x >= 0 && x < size && y >= 0 && y < size;
  };
  
  const isPlacementValid = (ship, position, dir) => {
    const [x, y] = position;
    
    if (dir === 'horizontal') {
      if (x + ship.length > size) return false;
      for (let i = 0; i < ship.length; i++) {
        if (grid[x + i][y] !== null) return false;
      }
    } else if(dir === 'vertical') {
      if (y + ship.length > size) return false;
      for (let i = 0; i < ship.length; i++) {
        if (grid[x][y + i] !== null) return false;
      }
    }
    return true;
  };
  
  const placeShip = (ship, position, dir) => {
    const [x, y] = position;
    
    if (!isValidPosition(position) || !isPlacementValid(ship, position, dir)) {
      return false;
    }
    const temp =[];
    if (dir === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        grid[x + i][y] =  ship;
        temp.push([x + i, y]);
      }
    } else if (dir === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        grid[x][y + i] =  ship;
        temp.push([x , y+i]);
      }
    }
    ships.push(ship);
    shipPositions.set(ship, temp); // Store positions map
    return true;
  };
  
  const receiveAttack = (position) => {
    const [x, y] = position;
    
    if (!isValidPosition(position)) {
      return null;
    }
    
    // Check if already attacked
    if (grid[x][y] === 'hit' || grid[x][y] === 'miss') {
      return null;
    }
    if (grid[x][y]===null) {
        missedAttacks.push([x, y]);
        grid[x][y] = 'miss';
        return false ;
      }
      for (const [ship, temp] of shipPositions) {
        if (temp.some(([px, py]) => px === x && py === y)) {
          ship.hit()
          grid[x][y] = 'hit';
          return true;
        }
      }  
  };
  
  const areAllSunk = () => {
    return ships.every(ship => ship.isSunk());
  };
  
  const createFleet = () => {
    return {
      carrier: Ship('carrier',5),
      battleship: Ship('battleship',4),
      cruiser: Ship('cruiser',3),
      submarine: Ship('submarine',3),
      destroyer: Ship('destroyer',2)
    };
  };
  
  return {
    grid,
    missedAttacks,
    shipPositions,
    placeShip,
    receiveAttack,
    areAllSunk,
    createFleet
  };
};

export default Gameboard;