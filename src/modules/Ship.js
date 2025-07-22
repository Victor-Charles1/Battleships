// src/modules/Ship.js
const Ship = (name, length) => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Ship name must be a non-empty string');
  }
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error('Ship length must be a positive integer');
  }

  let hitCount = 0;
  
  const hit = () => {
    if (isSunk()) {return 'Ship is already sunk'};
    hitCount++;
    return true;
  };
  
  const isSunk = () => hitCount >= length;
  
  return {
    get name() { return name; },
    get length() { return length; },
    get hitCount() { return hitCount; },
    hit,
    isSunk
  };
};

export default Ship;