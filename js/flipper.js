$(document).ready(function() {
  init();
});

function init() {

  let colors = ['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f'];
  let game = new Game();

  function dropDownChange(){
    let [rows, cols, variety] = [rowsDrop, colsDrop, varietyDrop].map((el) => parseInt(el.val(), 10));
    game = new games[gameMode](rows, cols, variety);
  }

  let rowsDrop = $('#rowsDropdown');
  let colsDrop = $('#colsDropdown');
  let varietyDrop = $('#varietyDropdown');

  let gameMode = 'adjacent';
  let games = {
    adjacent: AdjacentGame,
    star: StarGame,
    double: DoubleGame
  };

  rowsDrop.bind('change', dropDownChange);
  colsDrop.bind('change', dropDownChange);
  varietyDrop.bind('change', dropDownChange);
  $('#modeDropdown').bind('change', (e) => {
    gameMode = e.target.value;
    dropDownChange();
  });

  $('#resetButton').bind('click', () => game.resetBoard());
  $('#newButton').bind('click', () => game.newBoard());

  let loc = document.location.href;
  if(loc.substr(-5) === '.html' || loc.substr(-1) === '/') {
    game = new games[gameMode](3, 3, 2);
  }
  else {
    let args = loc.split('?')[1].split('+');
    let mode = args[0];
    let [ /* mode */, variety, rows, cols /* resetGrid, moves */] = args.map((el) => parseInt(el, 10));
    let resetGrid = args[4].split('').map((el) => parseInt(el, 10));
    let moves = args[5].split(',').map((el) => parseInt(el, 10));

    game = new games[mode](rows, cols, variety, resetGrid, moves);
    setTimeout(() => game.replay(), 1000);

    $('#status').html(`Replay of ${moves.length} moves.`);
  }
}

class Game {

  constructor(rows=3, cols=3, variety=2, resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']){
    this.rows = rows;
    this.cols = cols;
    this.variety = variety;
    this.colors  = colors;
    
    this.grid      = resetGrid.slice();
    this.resetGrid = resetGrid.slice();
    this.moves     = moves.slice();

    this.bitWidth  = $('#bit').width();
    this.bitMargin = parseInt($('#bit').css('margin-right'));
    this.mode = "plain";

    this.draw();
  }

  newBoard(){
    this.resetGrid = [];
    this.moves = [];
    this.draw();
  }

  draw() {
    let k=0;
    
    $('#status').empty();
    $('#board').empty();

    const width = `${this.bitWidth * this.cols + this.bitMargin * this.cols}px`;

    for(let i=0; i<this.rows; i++) {
      let cells = [];
      let inner = '';
      inner += `<div id="bitRow" style="width:${width};">`;
      for(let j = 0; j < this.cols; j++, k++){
        if (this.resetGrid.length == 0){
          inner += `<div id="bit" class="${k}" style="background-color:${this.colors[0]};"></div>`;
        }
        else {
          inner += `<div id="bit" class="${k}" style="background-color:${this.colors[this.resetGrid[k]]};"></div>`;
        }
        cells.push(k);
      }
      $('#board').append(inner);
      cells.forEach(el => $(`.${el}`).bind('click', () => this.flipBits(el)) );
    }

    let pattern = `<div id="bitRow">`;
    for(let i = 0; i < this.variety; i++) {
      pattern += `<div id="miniBit" style="background-color:${this.colors[i]};"></div>`;
    }
    pattern += '</div>';
    $('#pattern').html(pattern);

    while (this.grid.length < this.cols*this.rows) {
      this.grid.push(0);
    }

    if (this.resetGrid.length == 0){
      this.randomize();
      this.grid.forEach((el, index) => this.resetGrid[index] = el);
    }
    console.log(this.resetGrid);
  }

  randomize() {
    let boardSize = this.rows * this.cols;
    for(let i = 0; i < boardSize * 5; i++) {
      this.modeReverseFlip(this.rand(boardSize));
    }
  }

  rand(max) {
    return Math.floor(Math.random() * (max));
  }

  resetBoard() {
    this.resetGrid.forEach((el, index) => this.grid[index] = el);
    this.resetGrid.forEach((el, index) => $('.'+index).css('background-color', this.colors[el]) );
  }

  flipBits(bit) {
    this.modeFlip(bit);
    this.moves.push(bit);
    this.solved();
  }

  modeFlip(bit) {
    this.flip(bit);
  }

  modeReverseFlip(bit){
    this.reverseFlip(bit);
  }

  flip(bit) {
    this.grid[bit] = (this.grid[bit] + 1) % this.variety;
    $(`.${bit}`).css('background-color', this.colors[this.grid[bit] % this.variety]);
  }

  reverseFlip(bit) {
    this.grid[bit] = (this.grid[bit] - 1);

    if (this.grid[bit] < 0) {
      this.grid[bit] = this.variety - 1;
    }

    $(`.${bit}`).css('background-color', this.colors[this.grid[bit] % this.variety]);
  }

  getRow(bit) {
   for (let i = 0; i < this.rows; i++) {
      if (bit < i * this.cols) {
        return i-1;
      }
    }
    return this.rows - 1;
  }

  solved(){
    if (this.grid.every(bit => bit === 0)) {
      $('#status').html(`Solved in ${this.moves.length} moves! <br/>` +
      '<button id="replay-button">Replay</button>' +
      '<button id="pl-button">Permalink</button>' +
      '<input type="text" id="pl" size="25"> </input>');

      $('#pl-button').bind('click', () => {this.genPermalink()});
      $('#replay-button').bind('click', () => {this.replay()});
    }
  }

  replay(){
    this.resetBoard();
    let time = 0;
    let moveCount = this.moves.length;
    let inc = Math.min(10000 / moveCount, 500); //play back in 10 seconds, or 1 move/750ms.

    for (let i=0; i < moveCount; i++) {
      time += inc;
      setTimeout((bit) => {this.modeFlip(bit)}, time, this.moves[i]);
    }
  }

  genPermalink() {
    let link = `?${this.mode}+${this.variety}+${this.rows}+${this.cols}+`;

    //a few characters can be saved by compressing this string into a base [variety] number
    //eg variety=2, board = 110001111 => 399
    //.. variety=6, board = 013452123 => 457971 (prepend 0's when parsing)
    this.resetGrid.forEach(el => link += el);

    link += '+';

    this.moves.forEach((el, index) => {
      if (index === this.moves.length-1) {
        link += el;
      }
      else {
        link += `${el},`;
      }
    });

    //return document.location.origin + document.location.pathname + link;
    $('#pl').val(document.location.origin + document.location.pathname + link);
    $('#pl').select();
  } 
}

class AdjacentGame extends Game{
  constructor(rows=3, cols=3, variety=2, resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']){
    super(rows, cols, variety, resetGrid, moves, colors);
    this.mode = "adjacent";
  }

  modeFlip(bit){
    this.flipAdjacent(bit);
  }

  modeReverseFlip(bit){
    this.reverseAdjacentFlip(bit);
  }

  flipAdjacent(bit) {
    this.flip(bit);
    //top
    if (this.grid[bit-this.cols]+1) {
      this.flip(bit-this.cols);
    }

    //bottom
    if (this.grid[bit+this.cols]+1) {
      this.flip(bit+this.cols);
    }

    //left
    if (this.grid[bit-1]+1 && this.getRow(bit) === this.getRow(bit-1)) {
      this.flip(bit-1);
    }

    //right
    if (this.grid[bit+1]+1 && this.getRow(bit) === this.getRow(bit+1)) {
      this.flip(bit+1);
    }
  }

  reverseAdjacentFlip(bit){
    //flip adjacent tiles
    this.reverseFlip(bit);
    //top
    if (this.grid[bit-this.cols]+1) {
      this.reverseFlip(bit-this.cols);
    }

    //bottom
    if (this.grid[bit+this.cols]+1) {
      this.reverseFlip(bit+this.cols);
    }

    //left
    if (this.grid[bit-1]+1 && this.getRow(bit) === this.getRow(bit-1)) {
      this.reverseFlip(bit-1);
    }

    //right
    if (this.grid[bit+1]+1 && this.getRow(bit) === this.getRow(bit+1)) {
      this.reverseFlip(bit+1);
    }
  }
}

class StarGame extends Game {
  constructor(rows=3, cols=3, variety=2, resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']){
    super(rows, cols, variety, resetGrid, moves, colors);
    this.mode = 'star';
  }

  modeFlip(bit) {
    this.flipStar(bit);
  }

  modeReverseFlip(bit) {
    this.reverseFlipStar(bit);
  }

  flipStar(bit) {
    this.flip(bit);
    //above
    let i = 1;
    while (this.grid[bit-this.cols*i]+1) {
      this.flip(bit-this.cols*i);
      i++;
    }

    //below
    i = 1;
    while (this.grid[bit+this.cols*i]+1) {
      this.flip(bit+this.cols*i);
      i++;
    }

    //left
    i = 1;
    while (this.grid[bit-i]+1 && this.getRow(bit) === this.getRow(bit-i)) {
      this.flip(bit-i);
      i++;
    }

    //right
    i = 1;
    while (this.grid[bit+i]+1 && this.getRow(bit) === this.getRow(bit+i)) {
      this.flip(bit+i);
      i++;
    }
  }

  reverseFlipStar(bit) {
    this.reverseFlip(bit);
    //above
    let i = 1;
    while (this.grid[bit-this.cols*i]+1) {
      this.reverseFlip(bit-this.cols*i);
      i++;
    }

    //below
    i = 1;
    while (this.grid[bit+this.cols*i]+1) {
      this.reverseFlip(bit+this.cols*i);
      i++;
    }

    //left
    i = 1;
    while (this.grid[bit-i]+1 && this.getRow(bit) === this.getRow(bit-i)) {
      this.reverseFlip(bit-i);
      i++;
    }

    //right
    i = 1;
    while (this.grid[bit+i]+1 && this.getRow(bit) === this.getRow(bit+i)) {
      this.reverseFlip(bit+i);
      i++;
    }
  }
}

class DoubleGame extends Game {
  constructor(rows=3, cols=3, variety=2, resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']){
    super(rows, cols, variety, resetGrid, moves, colors);
    this.mode = 'double';
  }

  modeFlip(bit){
    this.flipDouble(bit);
  }

  modeReverseFlip(bit){
    this.reverseFlipDouble(bit);
  }

  flipDouble(bit) {
    //flip adjacent tiles
    this.flip(bit)
    //top
    if (this.grid[bit-this.cols]+1) {
      this.flip(bit-this.cols);
      this.flip(bit-this.cols);
    }

    //bottom
    if (this.grid[bit+this.cols]+1) {
      this.flip(bit+this.cols);
      this.flip(bit+this.cols);
    }

    //left
    if (this.grid[bit-1]+1 && this.getRow(bit) === this.getRow(bit-1)) {
      this.flip(bit-1);
      this.flip(bit-1);
    }

    //right
    if (this.grid[bit+1]+1 && this.getRow(bit) === this.getRow(bit+1)) {
      this.flip(bit+1);
      this.flip(bit+1);
    }
  }

  reverseFlipDouble(bit) {
    //flip adjacent tiles
    this.reverseFlip(bit);
    //top
    if (this.grid[bit-this.cols]+1) {
      this.reverseFlip(bit-this.cols);
      this.reverseFlip(bit-this.cols);
    }

    //bottom
    if (this.grid[bit+this.cols]+1) {
      this.reverseFlip(bit+this.cols);
      this.reverseFlip(bit+this.cols);
    }

    //left
    if (this.grid[bit-1]+1 && this.getRow(bit) === this.getRow(bit-1)) {
      this.reverseFlip(bit-1);
      this.reverseFlip(bit-1);
    }

    //right
    if (this.grid[bit+1]+1 && this.getRow(bit) === this.getRow(bit+1)) {
      this.reverseFlip(bit+1);
      this.reverseFlip(bit+1);
    }
  }
}