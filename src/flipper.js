import AdjacentGame from './AdjacentGame'
import StarGame from './StarGame'
import DoubleGame from './DoubleGame'

function init() {

  const colors = ['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f'];
  let game = {};
  let gameMode = 'adjacent';
  const games = {
    0: AdjacentGame,
    adjacent: AdjacentGame,
    1: StarGame,
    star: StarGame,
    2: DoubleGame,
    double: DoubleGame
  };

  let rowsDrop = $('#rowsDropdown');
  let colsDrop = $('#colsDropdown');
  let varietyDrop = $('#varietyDropdown');

  function dropDownChange() {
    let [rows, cols, variety] = [rowsDrop, colsDrop, varietyDrop].map((el) => parseInt(el.val(), 10));
    game = new games[gameMode](rows, cols, variety);
    localStorage.setItem("mode", gameMode);
  }

  rowsDrop.bind('change', dropDownChange);
  colsDrop.bind('change', dropDownChange);
  varietyDrop.bind('change', dropDownChange);
  $('#modeDropdown').bind('change', (e) => {
    gameMode = e.target.value;
    dropDownChange();
  });

  $('#resetButton').bind('click', () => {
    game.resetBoard();
    this.moves = [];
  });
  $('#newButton').bind('click', () => {
    game.newBoard()
  });

  let loc = document.location.href;
  if(loc.substr(-5) === '.html' || loc.substr(-1) === '/') {
    console.log('restoring from localStorage');
    let localGame = restoreData();
    if (localGame != false){
      game = new games[localGame.mode](
        localGame.rows, localGame.cols, localGame.variety, 
        localGame.grid, localGame.resetGrid, localGame.moves);
    }
    else{
      game = new games[gameMode](3, 3, 2);
      localStorage.setItem('mode', gameMode);
    }
  }
  else {
    console.log('restoring from url');
    const args = loc.split('?')[1].split('+');
    let [mode, variety, rows, cols, resetGrid, moves] = args;
    variety = parseInt(variety, 10);
    rows = parseInt(rows, 10);
    cols = parseInt(cols, 10);
    resetGrid = resetGrid.split('').map((el) => parseInt(el, 10));
    moves = moves.split(',').map((el) => parseInt(el, 10));
    console.log(mode, variety, rows, cols, resetGrid, moves);
    game = new games[mode](rows, cols, variety, [], resetGrid, moves);
    setTimeout(() => { game.replay(); }, 1000);

    $('#status').html(`Replay of ${moves.length} moves.`);
  }
}

function restoreData() {
  let mode = localStorage.getItem('mode');
  if (!mode){
    return false;
  }
  
  let rows = parseInt(localStorage.getItem('rows'));
  let cols = parseInt(localStorage.getItem('cols'));
  let variety = parseInt(localStorage.getItem('variety'));
  let grid = localStorage.getItem('grid').split(',').map((el) => parseInt(el, 10));
  let resetGrid = localStorage.getItem('reset-grid').split(',').map((el) => parseInt(el, 10));
  let moves = localStorage.getItem('reset-grid').split(',').map((el) => parseInt(el, 10));

  if (mode && rows && cols && variety && grid && resetGrid && moves){
    return {mode: mode, rows:rows, cols:cols, variety: variety, 
      grid: grid, resetGrid: resetGrid, moves: moves
    };
  }
  else {
    return false;
  }
}

init();