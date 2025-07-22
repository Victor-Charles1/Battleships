import Player from './Player.js';

const GameController = () => {
  let player;
  let computer;
  let gameState = 'setup'; // 'setup', 'playing', 'game-over'
  let currentShip = null;
  let currentShipType = null;
  let playerShipsPlaced = 0;
  let shipPlacementDirection = 'horizontal';
  
  const init = () => {
    player = Player('Player');
    computer = Player('Computer', true);
    gameState = 'setup';
    currentShip = null;
    currentShipType = null;
    playerShipsPlaced = 0;
    shipPlacementDirection = 'horizontal';
  };
  
  const startGame = () => {
    if (playerShipsPlaced < 5) return;
    gameState = 'playing';
  };
  
  const placePlayerShip = (position) => {
    if (gameState !== 'setup') return false;
    
    if (!currentShip) {
      // Get next ship to place
      const shipTypes = Object.keys(player.fleet);
      currentShipType = shipTypes[playerShipsPlaced];
      currentShip = player.fleet[currentShipType];
      return true
    }
    
    const placed = player.gameboard.placeShip(
      currentShip,
      position,
      shipPlacementDirection
    );
    
    if (placed) {
      playerShipsPlaced++;
      
      if (playerShipsPlaced === 5) {
        currentShip = null;
      } else {
        currentShipType = Object.keys(player.fleet)[playerShipsPlaced];
        currentShip = player.fleet[currentShipType];
      }
      
      return true;
    }
    
    return false;
  };
  
  const rotateShip = () => {
    shipPlacementDirection = shipPlacementDirection === 'horizontal' ? 'vertical' : 'horizontal';
  };
  
  const playerAttack = (position) => {
    if (gameState !== 'playing') return null;
    
    const result = player.attack(computer.gameboard, position);
    
    if (result === null) {
      return { status: 'invalid', message: 'You already attacked there!' };
    }
    
    if (computer.gameboard.areAllSunk()) {
      gameState = 'game-over';
      return { status: 'game-over', winner: 'player' };
    }
    
    // Computer's turn
    const computerResult = computer.computerAttack(player.gameboard);
    
    if (player.gameboard.areAllSunk()) {
      gameState = 'game-over';
      return { status: 'game-over', winner: 'computer' };
    }
    
    return { 
      playerAttack: result, 
      computerAttack: computerResult,
      status: 'continue'
    };
  };
  
  return {
    init,
    startGame,
    rotateShip,
    placePlayerShip,
    playerAttack,
    getGameState: () => gameState,
    getPlayer: () => player,
    getComputer: () => computer,
    getPlacementDirection: () => shipPlacementDirection,
    getCurrentShip: () => currentShip,
    getPlayerShipsPlaced: () => playerShipsPlaced
  };
};

export default GameController;