'use strict';
import Game from './Game'

class BuilderGame extends Game {

  constructor(rows=3, cols=3, variety=2, grid=[], resetGrid=[], moves=[], colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']) {
    super(rows, cols, variety, grid, resetGrid, moves, colors);
    this.mode = 'builder';
    this.updateOutput();
  }

  modeFlip(bit) {
    this.flip(bit);
    this.updateOutput();
  }

  solved() {
    return false;
  }

  updateOutput() {
    let gridStr = this.grid.toString()
    let base = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n` +
    `<plist version="1.0">\n` +
    `<dict>\n` +
      `<key>variety</key>\n` +
      `<integer>${this.variety}</integer>\n` +
      `<key>cols</key>\n` +
      `<integer>${this.cols}</integer>\n` +
      `<key>rows</key>\n` +
      `<integer>${this.rows}</integer>\n` +
      `<key>resetGrid</key>\n` +
      `<string>${gridStr}</string>\n` +
      `<key>scrambleLen</key>\n` +
      `<integer>____</integer>\n` +
    `</dict>\n` +
    `</plist>`;
    $('#levelOutput').text(base);
  }
}

export default BuilderGame;