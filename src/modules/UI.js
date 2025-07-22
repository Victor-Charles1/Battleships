import Ship from "./Ship";
const UIController = (gameController) => {
  const renderBoard = (boardId, gameboard, isPlayerBoard) => {
    const board = document.getElementById(boardId);
    if (!board) return;
    
    board.innerHTML = '';
    
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        
        const cellContent = gameboard.grid[x][y];
        
        if (cellContent === 'hit') {
          cell.classList.add('hit');
        } else if (cellContent === 'miss') {
          cell.classList.add('miss');
        }else if (isPlayerBoard && cellContent instanceof Object) {
          cell.classList.add('ship');
        }
        
        if (isPlayerBoard && gameController.getGameState() === 'setup') {
          cell.addEventListener('click', () => {
            handlePlaceShip([x, y]);
          });
          
          // Show preview for current ship placement
          const currentShip = gameController.getCurrentShip();
          if (currentShip) {
            const direction = gameController.getPlacementDirection();
            if (direction === 'horizontal' && 
                y === 0 && 
                x <= 10 - currentShip.length) {
              cell.classList.add('ship-preview');
            }
          }
        } else if (!isPlayerBoard && gameController.getGameState() === 'playing') {
          cell.addEventListener('click', () => {
            handlePlayerAttack([x, y]);
          });
        }
        
        board.appendChild(cell);
      }
    }
  };
  
  const renderShipList = () => {
    const shipList = document.getElementById('ship-list');
    if (!shipList) return;
    
    shipList.innerHTML = '';
    
    const player = gameController.getPlayer();
    if (!player) return;
    
    for (const [type, ship] of Object.entries(player.fleet)) {
      const shipItem = document.createElement('div');
      shipItem.className = `ship-item ${ship.isSunk() ? 'ship-sunk' : ''}`;
      
      const status = document.createElement('div');
      status.className = `ship-status ${ship.isSunk() ? 'sunk' : ''}`;
      
      const text = document.createElement('span');
      text.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} (${ship.length}) - ${ship.hitCount} hits`;
      
      shipItem.appendChild(status);
      shipItem.appendChild(text);
      shipList.appendChild(shipItem);
    }
  };
  
  const updateMessage = (text) => {
    const messageElement = document.getElementById('message');
    if (messageElement) {
      messageElement.textContent = text;
    }
  };
  
  const handlePlaceShip = (position) => {
    if (gameController.placePlayerShip(position)) {
      render();
      
      if (gameController.getPlayerShipsPlaced() === 5) {
        updateMessage('All ships placed! Press Start Game.');
      } else {
        const currentShip = gameController.getCurrentShip();
        updateMessage(`Place your ${currentShip} (${currentShip.length} units)`);
      }
    }
  };
  
  const handlePlayerAttack = (position) => {
    const result = gameController.playerAttack(position);
    
    if (result && result.status === 'game-over') {
      updateMessage(result.winner === 'player' 
        ? 'You win! All enemy ships sunk!' 
        : 'Game over! Computer wins!');
    }
    
    render();
  };
  
  const render = () => {
    const player = gameController.getPlayer();
    const computer = gameController.getComputer();
    
    if (player && computer) {
      renderBoard('player-board', player.gameboard, true);
      renderBoard('opponent-board', computer.gameboard, false);
      renderShipList();
    }
  };
  
  const setupEventListeners = () => {
    const rotateBtn = document.getElementById('rotate-btn');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        gameController.rotateShip();
        updateMessage(`Ship orientation: ${gameController.getPlacementDirection()}`);
        renderPreview();
      });
    }
    
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (gameController.getPlayerShipsPlaced() < 5) {
          updateMessage('Place all your ships first!');
          return;
        }
        
        gameController.startGame();
        updateMessage('Game started! Attack the enemy board.');
        render();
      });
    }
    
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        gameController.init();
        render();
        updateMessage('Place your ships. Click to rotate ship orientation.');
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        gameController.rotateShip();
        updateMessage(`Ship orientation: ${gameController.getPlacementDirection()}`);
        renderPreview();
      }
    });
  };
  
  const renderPreview = () => {
    render();
  };
  
  return {
    render,
    updateMessage,
    setupEventListeners,
    handlePlaceShip
  };
};

export default UIController;