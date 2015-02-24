let bitWidth =0;
let bitHeight=0;
let bitMargin=0;
let miniBitWidth =0;
let miniBitHeight=0;
let colors = ['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f'];
let variety = 2;
let moveNum = 0;
let board;

$(document).ready(function() {
	init();
});

function test(){console.log("what now?");}

function init() {
	bitWidth  = $('#bit').width();
	bitHeight = $('#bit').height();
	bitMargin = parseInt($('#bit').css('margin-right'));

	miniBitWidth  = $('#miniBit').width();
	miniBitHeight = $('#miniBit').height();

	let loc = document.location.href;
	if(loc.substr(-5) === '.html' || loc.substr(-1) === '/') {
		//drawBoard(3,3);
    board = new Board(3,3);
	}
	else {
		let args = loc.split('?')[1].split('+');

		let mode = parseInt(args[0]);
		let variety = parseInt(args[1]);
		let boardRows = parseInt(args[2]);
		let boardCols = parseInt(args[3]);
		drawBoard(boardRows, boardCols);

		resetGrid = new Array();
		for(let i=0; i<args[4].length;i++) {
			resetGrid.push(parseInt(args[4][i]));
		}

		moves = new Array();
		args[5].split(',').forEach(el => moves.push( parseInt(el) ) );

		reset();
		setTimeout(replay, 1000);

		$('#status').html(`Replay of ${moves.length} moves.`);
	}
}

class Board{
  constructor(rows=3, cols=3, variety=2, colors=['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f']){
    this.rows = rows;
    this.cols = cols;
    this.variety = variety;
    this.colors = colors;
    
    this.grid      = [];
    this.resetGrid = [];
    this.moves     = [];

    this.draw();
  }

  draw() {
    let k=0;
    
    $('#status').empty();
    $('#board').empty();

    let width = `${bitWidth * this.cols + bitMargin * this.cols}px`;

    for(let i=0; i<this.rows; i++) {
      let cells = [];
      let inner = '';
      inner += `<div id="bitRow" style="width:${width};">`;
      for(let j = 0; j < this.cols; j++, k++){
        inner += `<div id="bit" class="${k}"` +
        `style="background-color:${this.colors[0]};"></div>`;
        cells.push(k);
      }
      $('#board').append(inner);
      cells.forEach(el => $(`.${el}`).bind('click', () => this.flip(el)) );
    }

    let miniWidth = `${miniBitWidth * this.variety + bitMargin * this.variety}px`;
    let pat = `<div id="bitRow" style="width:${miniWidth};">`;
    for(let i = 0; i < this.variety; i++) {
      pat += `<div id="miniBit" style="background-color:${this.colors[i]};"></div>`;
    }
    pat += '</div>';
    $('#pattern').html(pat);

    while (this.grid.length < this.cols*this.rows) {
      this.grid.push(0);
    }

    this.randomize();

    this.grid.forEach((el, index) => this.resetGrid[index] = el); 
  }

  randomize() {
    let boardSize = this.rows * this.cols;
    for(let i = 0; i < boardSize * 5; i++) {
      this.reverseFlip(this.rand(boardSize));
    }
  }

  rand(max) {
    return Math.floor(Math.random() * (max));
  }

  resetBoard() {
    this.resetGrid.forEach((el, index) => this.grid[index] = el);
    this.resetGrid.forEach((el, index) => $('.'+index).css('background-color', this.colors[el]) );
  }

  flip(theBit) {
    this.moves.push(theBit);

    this.grid[theBit] = (this.grid[theBit] + 1) % this.variety;
    $(`.${theBit}`).css('background-color', this.colors[this.grid[theBit] % this.variety]);

    if (this.solved()) {
     $('#status').html(`Solved in ${this.moves.length} moves! <br/>` +
     '<button onclick="replay()">Replay</button>' +
     '<button onclick="genPermalink();">Permalink</button>' +
     '<input type="text" id="pl" size="25"> </input>');

     moveNum = 0;
   }
  }

  reverseFlip(theBit) {
    this.grid[theBit] = (this.grid[theBit] - 1);

    if (this.grid[theBit] < 0) {
      this.grid[theBit] = this.variety - 1;
    }

    $(`.${theBit}`).css('background-color', this.colors[this.grid[theBit] % this.variety]);
  }

  solved(){
    return this.grid.every(bit => bit === 0);
  }
}

// function replay() {
// 	reset();
// 	let time = 0;
// 	let moveCount = moves.length;
// 	//play back in 10 seconds, or 1 move/750ms.
// 	let inc = Math.min(10000 / moveCount, 500);

// 	for (let i=0; i < moveCount; i++) {
// 		time += inc;
// 		if (mode === 0) {
// 			setTimeout(flipAdjacent, time, moves[i]);
// 		}
// 		else if (mode === 1) {
// 			setTimeout(flipStar, time, moves[i]);
// 		}
// 		else if (mode === 2) {
// 			setTimeout(flipDouble, time, moves[i]);
// 		}
// 	}
// }

// function flipBits(abit) {
// 	if (mode === 0) {
// 		flipAdjacent(abit);
// 	}
// 	else if (mode === 1) {
// 		flipStar(abit);
// 	}
// 	else if (mode === 2) {
// 		flipDouble(abit);
// 	}

// 	moveNum++;
// 	moves.push(abit);

// 	if (solved()) {
// 		$('#status').html(`Solved in ${moveNum} moves! <br/>` +
// 		'<button onclick="replay()">Replay</button>' +
// 		'<button onclick="genPermalink();">Permalink</button>' +
// 		'<input type="text" id="pl" size="25"> </input>');

// 		moveNum = 0;
// 	}
// }

// function flipAdjacent(theBit) {
// 	//flip adjacent tiles
// 	flip(theBit);
// 	//top
// 	if (grid[theBit-boardCols]+1) {
// 		flip(theBit-boardCols);
// 	}

// 	//bottom
// 	if (grid[theBit+boardCols]+1) {
// 		flip(theBit+boardCols);
// 	}

// 	//left
// 	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
// 		flip(theBit-1);
// 	}

// 	//right
// 	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
// 		flip(theBit+1);
// 	}
// }

// function flipStar(theBit) {
// 	flip(theBit);
// 	//above
// 	let i = 1;
// 	while (grid[theBit-boardCols*i]+1) {
// 		flip(theBit-boardCols*i);
// 		i++;
// 	}

// 	//below
// 	i = 1;
// 	while (grid[theBit+boardCols*i]+1) {
// 		flip(theBit+boardCols*i);
// 		i++;
// 	}

// 	//left
// 	i = 1;
// 	while (grid[theBit-i]+1 && getRow(theBit) === getRow(theBit-i)) {
// 		flip(theBit-i);
// 		i++;
// 	}

// 	//right
// 	i = 1;
// 	while (grid[theBit+i]+1 && getRow(theBit) === getRow(theBit+i)) {
// 		flip(theBit+i);
// 		i++;
// 	}
// }

// function flipDouble(theBit) {
// 	//flip adjacent tiles
// 	flip(theBit)
// 	//top
// 	if (grid[theBit-boardCols]+1) {
// 		flip(theBit-boardCols);
// 		flip(theBit-boardCols);
// 	}

// 	//bottom
// 	if (grid[theBit+boardCols]+1) {
// 		flip(theBit+boardCols);
// 		flip(theBit+boardCols);
// 	}

// 	//left
// 	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
// 		flip(theBit-1);
// 		flip(theBit-1);
// 	}

// 	//right
// 	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
// 		flip(theBit+1);
// 		flip(theBit+1);
// 	}
// }

// function flip(theBit) {
// 	grid[theBit] = (grid[theBit] + 1) % variety;
// 	$('.'+theBit).css('background-color', colors[grid[theBit]%variety]);
// }

// function reverseFlipAdjacent(theBit) {
// 	//flip adjacent tiles
// 	reverseFlip(theBit);
// 	//top
// 	if (grid[theBit-boardCols]+1) {
// 		reverseFlip(theBit-boardCols);
// 	}

// 	//bottom
// 	if (grid[theBit+boardCols]+1) {
// 		reverseFlip(theBit+boardCols);
// 	}

// 	//left
// 	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
// 		reverseFlip(theBit-1);
// 	}

// 	//right
// 	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
// 		reverseFlip(theBit+1);
// 	}
// }

// function reverseFlipStar(theBit) {
// 	reverseFlip(theBit);
// 	//above
// 	let i = 1;
// 	while (grid[theBit-boardCols*i]+1) {
// 		reverseFlip(theBit-boardCols*i);
// 		i++;
// 	}

// 	//below
// 	i = 1;
// 	while (grid[theBit+boardCols*i]+1) {
// 		reverseFlip(theBit+boardCols*i);
// 		i++;
// 	}

// 	//left
// 	i = 1;
// 	while (grid[theBit-i]+1 && getRow(theBit) === getRow(theBit-i)) {
// 		reverseFlip(theBit-i);
// 		i++;
// 	}

// 	//right
// 	i = 1;
// 	while (grid[theBit+i]+1 && getRow(theBit) === getRow(theBit+i)) {
// 		reverseFlip(theBit+i);
// 		i++;
// 	}
// }

// function reverseFlipDouble(theBit) {
// 	//flip adjacent tiles
// 	reverseFlip(theBit);
// 	//top
// 	if (grid[theBit-boardCols]+1) {
// 		reverseFlip(theBit-boardCols);
// 		reverseFlip(theBit-boardCols);
// 	}

// 	//bottom
// 	if (grid[theBit+boardCols]+1) {
// 		reverseFlip(theBit+boardCols);
// 		reverseFlip(theBit+boardCols);
// 	}

// 	//left
// 	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
// 		reverseFlip(theBit-1);
// 		reverseFlip(theBit-1);
// 	}

// 	//right
// 	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
// 		reverseFlip(theBit+1);
// 		reverseFlip(theBit+1);
// 	}
// }

// function reverseFlip(theBit) {
// 	grid[theBit] = (grid[theBit] - 1);

// 	if (grid[theBit] < 0) {
// 		grid[theBit] = variety - 1;
// 	}

// 	$('.'+theBit).css('background-color', colors[grid[theBit] % variety]);
// }

// function solved() {
// 	return grid.every(bit => bit === 0);
// }

// function getRow(bit) {
// 	for (let i = 0; i < boardRows; i++) {
// 		if (bit < i * boardCols) {
// 			return i-1;
// 		}
// 	}

// 	return i-1;
// }

// function randomize() {
// 	let boardSize = boardRows * boardCols;
// 	for(let i = 0; i < boardSize * 5; i++) {
// 		if(mode === 0) {
// 			reverseFlipAdjacent(rand(boardSize));
// 		}
// 		else if(mode === 1) {
// 			reverseFlipStar(rand(boardSize));
// 		}
// 		else if (mode === 2) {
// 			reverseFlipDouble(rand(boardSize));
// 		}
// 	}
// }

function genPermalink() {
	let link = `?${mode}+${variety}+${boardRows}+${boardCols}+`;

	//a few characters can be saved by compressing this string into a base [mode] number
	resetGrid.forEach(el => link += el);

	link += '+';

	moves.forEach((el, index) => {
		if (index === moves.length-1) {
			link += el;
		}
		else {
			link += el + ',';
		}
	});

	//return document.location.origin + document.location.pathname + link;
	$('#pl').val(document.location.origin + document.location.pathname + link);
	$('#pl').select();
} 