'use strict';
import Game from './Game'

class BuilderGame extends Game {

  constructor(rows=3, cols=3, variety=2, grid=[], resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']) {
    while (resetGrid.length > rows * cols) {
      resetGrid.pop();
    }
    while (grid.length > rows * cols) {
      grid.pop();
    }
    super(rows, cols, variety, grid, resetGrid, moves, colors);
    this.mode = 'builder';
    this.updateOutput();
  }

  modeFlip(bit) {
    this.flip(bit);
    this.resetGrid = this.grid.slice()
    this.updateOutput();
  }

  solved() {
    return false;
  }

  randomize() {
    for(let i = 0; i < this.resetGrid.length; i++) {
      this.resetGrid[i] = 0
      this.grid[i] = 0
    }
  }

  updateOutput() {
    let gridStr = this.grid.toString()
    let base = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n` +
    `<plist version="1.0">\n` +
    `<dict>\n` +
      `\t<key>variety</key>\n` +
      `\t<integer>${this.variety}</integer>\n` +
      `\t<key>cols</key>\n` +
      `\t<integer>${this.cols}</integer>\n` +
      `\t<key>rows</key>\n` +
      `\t<integer>${this.rows}</integer>\n` +
      `\t<key>resetGrid</key>\n` +
      `\t<string>${gridStr}</string>\n` +
      `\t<key>scrambleLen</key>\n` +
      `\t<integer>____</integer>\n` +
    `</dict>\n` +
    `</plist>`;
    $('#levelOutput').text(base);
  }
}

export default BuilderGame;