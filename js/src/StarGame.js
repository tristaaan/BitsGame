'use strict';
import Game from './Game'

class StarGame extends Game {
  
  constructor(rows=3, cols=3, variety=2, grid=[], resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']) {
    super(rows, cols, variety, grid, resetGrid, moves, colors);
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
    for (let i = 1; bit - this.cols * i >= 0; i++) {
      this.flip(bit-this.cols*i);
    }
    
    //below
    for (let i = 1; bit + this.cols * i < this.grid.length; i++) {
      this.flip(bit+this.cols*i);
    }
    
    //left
    for (let i = 1; this.getRow(bit) === this.getRow(bit - i); i++) {
      this.flip(bit - i);
    }
    
    //right
    for (let i = 1; this.getRow(bit) === this.getRow(bit + i); i++) {
      this.flip(bit + i);
    }
  }
  
  reverseFlipStar(bit) {
    this.reverseFlip(bit);
    //above
    for (let i = 1; bit - this.cols * i >= 0; i++) {
      this.reverseFlip(bit - this.cols * i);
    }
    
    //below
    for (let i = 1; bit + this.cols * i < this.grid.length; i++) {
      this.reverseFlip(bit + this.cols * i);
    }
    
    //left
    for (let i = 1; this.getRow(bit) == this.getRow(bit - i); i++) {
      console.log(bit,i,bit-i);
      this.reverseFlip(bit - i);
    }
    
    //right
    for (let i = 1; this.getRow(bit) == this.getRow(bit + i); i++) {
      this.reverseFlip(bit + i);
    }
  }
}

export default StarGame;