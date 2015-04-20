'use strict';
import Game from './Game'

class DoubleGame extends Game {
  
  constructor(rows=3, cols=3, variety=2, resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']) {
    super(rows, cols, variety, resetGrid, moves, colors);
    this.mode = 'double';
  }

  modeFlip(bit) {
    this.flipDouble(bit);
  }

  modeReverseFlip(bit) {
    this.reverseFlipDouble(bit);
  }

  flipDouble(bit) {
    //flip adjacent tiles
    this.flip(bit)
    //top
    if (bit - this.cols >= 0) {
      this.flip(bit-this.cols);
      this.flip(bit-this.cols);
    }

    //bottom
    if (bit + this.cols < this.grid.length) {
      this.flip(bit+this.cols);
      this.flip(bit+this.cols);
    }

    //left
    if (this.getRow(bit) === this.getRow(bit - 1)) {
      this.flip(bit - 1);
      this.flip(bit - 1);
    }

    //right
    if (this.getRow(bit) === this.getRow(bit + 1)) {
      this.flip(bit + 1);
      this.flip(bit + 1);
    }
  }

  reverseFlipDouble(bit) {
    //flip adjacent tiles
    this.reverseFlip(bit);
    //top
    if (bit - this.cols >= 0) {
      this.reverseFlip(bit-this.cols);
      this.reverseFlip(bit-this.cols);
    }

    //bottom
    if (bit + this.cols < this.grid.length) {
      this.reverseFlip(bit+this.cols);
      this.reverseFlip(bit+this.cols);
    }

    //left
    if (this.getRow(bit) === this.getRow(bit - 1)) {
      this.reverseFlip(bit-1);
      this.reverseFlip(bit-1);
    }

    //right
    if (this.getRow(bit) === this.getRow(bit + 1)) {
      this.reverseFlip(bit + 1);
      this.reverseFlip(bit + 1);
    }
  }
}

export default DoubleGame;