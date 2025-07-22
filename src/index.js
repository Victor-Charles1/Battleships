import GameController from './modules/gameLogic.js';
import UIController from './modules/UI.js';
import './styles.css'

const initGame = () => {
  const gameController = GameController();
  const uiController = UIController(gameController);
  
  gameController.init();
  uiController.setupEventListeners();
  uiController.render();
  uiController.updateMessage('Place your ships. Click to rotate ship orientation.');
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);