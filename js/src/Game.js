'use strict';

class Game {

  constructor(rows=3, cols=3, variety=2, grid=[], resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']) {
    this.rows = rows;
    this.cols = cols;
    this.variety = variety;
    this.colors  = colors;
    
    if ( grid.length == 0 && resetGrid.length > 0) {
      this.grid      = resetGrid.slice();
      this.resetGrid = resetGrid.slice();
    }
    else {
      this.grid      = grid.slice();
      this.resetGrid = resetGrid.slice();
    }
    this.moves     = moves.slice();

    this.bitWidth  = $('.bit').width();
    this.bitMargin = parseInt($('.bit').css('margin-right'));
    this.mode = "plain";

    this.draw();
  }

  newBoard() {
    this.resetGrid = [];
    this.moves = [];
    this.grid = [];
    this.draw();
  }

  saveGridAndMoves() {
    return false;
    //localStorage.setItem('grid', this.grid);
    //localStorage.setItem('moves', this.moves);
  }

  saveAll() { 
    return false;
    // localStorage.setItem('rows', this.rows);
    // localStorage.setItem('cols', this.cols);
    // localStorage.setItem('variety', this.variety);
    // localStorage.setItem('grid', this.grid);
    // localStorage.setItem('moves', this.moves);
    // localStorage.setItem('reset-grid', this.resetGrid);
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
      for(let j = 0; j < this.cols; j++, k++) {
        if (this.resetGrid.length == 0) {
          inner += `<div id="${k}" class="bit" style="background-color:${this.colors[0]};"></div>`;
        }
        else if (this.grid.length > 0){
          inner += `<div id="${k}" class="bit" style="background-color:${this.colors[this.grid[k]]};"></div>`;
        }
        else {
          inner += `<div id="${k}" class="bit" style="background-color:${this.colors[this.resetGrid[k]]};"></div>`;
        }
        cells.push(k);
      }
      $('#board').append(inner);
      cells.forEach(el => $(`#${el}`).bind('click', () => this.flipBits(el)) );
    }

    let pattern = '';
    for(let i = 0; i < this.variety; i++) {
      pattern += `<div class="miniBit" style="background-color:${this.colors[i]};"></div>`;
    }
    pattern += '</div>';
    $('#pattern').html(pattern);

    while (this.grid.length < this.cols*this.rows) {
      this.grid.push(0);
    }

    if (this.resetGrid.length == 0) {
      this.randomize();
      this.grid.forEach((el, index) => this.resetGrid[index] = el);
      this.saveAll();
    }
  }

  randomize() {
    let moves = this.rand(3) + 2;
    let movesOut = [];
    for(let i = 0; i < moves; i++) {
      let move = this.rand(this.rows * this.cols)
      movesOut.push(move);
      this.modeReverseFlip(move);
    }
    console.log(movesOut);
  }

  rand(max) {
    return Math.floor(Math.random() * (max));
  }

  resetBoard() {
    this.resetGrid.forEach((el, index) => this.grid[index] = el);
    this.resetGrid.forEach((el, index) => {
      $(`#${index}`).css('background-color', this.colors[el]) 
      //console.log(el, this.colors[el]);
    });
    this.saveGridAndMoves();
  }

  flipBits(bit) {
    this.modeFlip(bit);
    this.moves.push(bit);
    this.solved();
    this.saveGridAndMoves();
  }

  modeFlip(bit) {
    this.flip(bit);
  }

  modeReverseFlip(bit) {
    this.reverseFlip(bit);
  }

  flip(bit) {
    this.grid[bit] = (this.grid[bit] + 1) % this.variety;
    $(`#${bit}`).css('background-color', this.colors[this.grid[bit] % this.variety]);
  }

  reverseFlip(bit) {
    this.grid[bit] = (this.grid[bit] - 1);

    if (this.grid[bit] < 0) {
      this.grid[bit] = this.variety - 1;
    }

    $(`#${bit}`).css('background-color', this.colors[this.grid[bit] % this.variety]);
  }

  getRow(bit) {
    return Math.floor(bit / this.cols)
  }

  solved() {
    if (this.grid.every(bit => bit === 0)) {
      $('#status').html(`Solved in ${this.moves.length} moves! <br/>` +
      '<button id="replay-button">Replay</button>' +
      '<button id="pl-button">Permalink</button>' +
      '<input type="text" id="pl" size="25"> </input>');

      $('#pl-button').bind('click', () => {this.genPermalink()});
      $('#replay-button').bind('click', () => {this.replay()});
    }
  }

  replay() {
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

export default Game;