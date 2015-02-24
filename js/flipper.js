var bitWidth =0;
var bitHeight=0;
var bitMargin=0;
var miniBitWidth =0;
var miniBitHeight=0;
var colors = ['#000', '#00f', '#0f0', '#0ff', '#f00', '#f0f'];
var variety = 2;
var grid      = [];
var resetGrid = [];
var moves     = [];
var moveNum = 0;
var mode    = 0;
var boardRows;
var boardCols;

$(document).ready(function() {
	init();
});

function init() {
	bitWidth  = $('#bit').width();
	bitHeight = $('#bit').height();
	bitMargin = parseInt($('#bit').css('margin-right'));

	miniBitWidth  = $('#miniBit').width();
	miniBitHeight = $('#miniBit').height();

	var loc = document.location.href;
	if(loc.substr(-5) === '.html' || loc.substr(-1) === '/') {
		drawBoard(3,3);
	}
	else {
		var args = loc.split('?')[1].split('+');

		mode = parseInt(args[0]);
		variety = parseInt(args[1]);
		boardRows = parseInt(args[2]);
		boardCols = parseInt(args[3]);
		drawBoard(boardRows, boardCols);

		resetGrid = new Array();
		for(var i=0; i<args[4].length;i++) {
			resetGrid.push(parseInt(args[4][i]));
		}

		moves = new Array();
		args[5].split(',').forEach(el => moves.push( parseInt(el) ) );

		reset();
		setTimeout(replay, 1000);

		$('#status').html(`Replay of ${moves.length} moves.`);
	}
}

function drawBoard(rows, cols) {
	var k=0;

	$('#status').empty();
	$('#board').empty();

	moveNum = 0;
	boardRows = rows;
	boardCols = cols;

	for(var i=0; i<rows; i++) {
		var width = `${bitWidth * cols + bitMargin * cols}px`;
		var inner = '';
		inner += `<div id="bitRow" style="width:${width};">`;
		for(var j=0; j<cols; j++, k++){
			inner += `<div id="bit" class="${k}"` +
			`style="background-color:${colors[0]};"` + 
			`onclick="flipBits(${k})"></div>`;
		}
		$('#board').append(inner);
	}

	width = (miniBitWidth * variety + bitMargin * variety)+'px';
	var pat = `<div id="bitRow" style="width:${width};">`;
	for(var i=0; i<variety; i++) {
		pat += `<div id="miniBit" style="background-color:${colors[i]};"></div>`;
	}
	pat += '</div>';
	$('#pattern').html(pat);

	moves     = [];
	resetGrid = [];
	grid      = [];

	while (grid.length < cols*rows) {
		grid.push(0);
	}

	randomize();

	grid.forEach((el, index) => resetGrid[index] = el);
}

function reset() {
	resetGrid.forEach((el, index) => grid[index] = el);
	resetGrid.forEach((el, index) => $('.'+index).css('background-color', colors[el]) );
}

function replay() {
	reset();
	var time = 0;
	var moveCount = moves.length;
	//play back in 10 seconds, or 1 move/750ms.
	var inc = Math.min(10000 / moveCount, 500);

	for (var i=0; i < moveCount; i++) {
		time += inc;
		if (mode === 0) {
			setTimeout(flipAdjacent, time, moves[i]);
		}
		else if (mode === 1) {
			setTimeout(flipStar, time, moves[i]);
		}
		else if (mode === 2) {
			setTimeout(flipDouble, time, moves[i]);
		}
	}
}

function flipBits(abit) {
	if (mode === 0) {
		flipAdjacent(abit);
	}
	else if (mode === 1) {
		flipStar(abit);
	}
	else if (mode === 2) {
		flipDouble(abit);
	}

	moveNum++;
	moves.push(abit);

	if (solved()) {
		$('#status').html(`Solved in ${moveNum} moves! <br/>` +
		'<button onclick="replay()">Replay</button>' +
		'<button onclick="genPermalink();">Permalink</button>' +
		'<input type="text" id="pl" size="25"> </input>');

		moveNum = 0;
	}
}

function flipAdjacent(theBit) {
	//flip adjacent tiles
	flip(theBit);
	//top
	if (grid[theBit-boardCols]+1) {
		flip(theBit-boardCols);
	}

	//bottom
	if (grid[theBit+boardCols]+1) {
		flip(theBit+boardCols);
	}

	//left
	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
		flip(theBit-1);
	}

	//right
	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
		flip(theBit+1);
	}
}

function flipStar(theBit) {
	flip(theBit);
	//above
	var i = 1;
	while (grid[theBit-boardCols*i]+1) {
		flip(theBit-boardCols*i);
		i++;
	}

	//below
	i = 1;
	while (grid[theBit+boardCols*i]+1) {
		flip(theBit+boardCols*i);
		i++;
	}

	//left
	i = 1;
	while (grid[theBit-i]+1 && getRow(theBit) === getRow(theBit-i)) {
		flip(theBit-i);
		i++;
	}

	//right
	i = 1;
	while (grid[theBit+i]+1 && getRow(theBit) === getRow(theBit+i)) {
		flip(theBit+i);
		i++;
	}
}

function flipDouble(theBit) {
	//flip adjacent tiles
	flip(theBit)
	//top
	if (grid[theBit-boardCols]+1) {
		flip(theBit-boardCols);
		flip(theBit-boardCols);
	}

	//bottom
	if (grid[theBit+boardCols]+1) {
		flip(theBit+boardCols);
		flip(theBit+boardCols);
	}

	//left
	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
		flip(theBit-1);
		flip(theBit-1);
	}

	//right
	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
		flip(theBit+1);
		flip(theBit+1);
	}
}

function flip(theBit) {
	grid[theBit] = (grid[theBit] + 1) % variety;
	$('.'+theBit).css('background-color', colors[grid[theBit]%variety]);
}

function reverseFlipAdjacent(theBit) {
	//flip adjacent tiles
	reverseFlip(theBit);
	//top
	if (grid[theBit-boardCols]+1) {
		reverseFlip(theBit-boardCols);
	}

	//bottom
	if (grid[theBit+boardCols]+1) {
		reverseFlip(theBit+boardCols);
	}

	//left
	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
		reverseFlip(theBit-1);
	}

	//right
	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
		reverseFlip(theBit+1);
	}
}

function reverseFlipStar(theBit) {
	reverseFlip(theBit);
	//above
	var i = 1;
	while (grid[theBit-boardCols*i]+1) {
		reverseFlip(theBit-boardCols*i);
		i++;
	}

	//below
	i = 1;
	while (grid[theBit+boardCols*i]+1) {
		reverseFlip(theBit+boardCols*i);
		i++;
	}

	//left
	i = 1;
	while (grid[theBit-i]+1 && getRow(theBit) === getRow(theBit-i)) {
		reverseFlip(theBit-i);
		i++;
	}

	//right
	i = 1;
	while (grid[theBit+i]+1 && getRow(theBit) === getRow(theBit+i)) {
		reverseFlip(theBit+i);
		i++;
	}
}

function reverseFlipDouble(theBit) {
	//flip adjacent tiles
	reverseFlip(theBit);
	//top
	if (grid[theBit-boardCols]+1) {
		reverseFlip(theBit-boardCols);
		reverseFlip(theBit-boardCols);
	}

	//bottom
	if (grid[theBit+boardCols]+1) {
		reverseFlip(theBit+boardCols);
		reverseFlip(theBit+boardCols);
	}

	//left
	if (grid[theBit-1]+1 && getRow(theBit) === getRow(theBit-1)) {
		reverseFlip(theBit-1);
		reverseFlip(theBit-1);
	}

	//right
	if (grid[theBit+1]+1 && getRow(theBit) === getRow(theBit+1)) {
		reverseFlip(theBit+1);
		reverseFlip(theBit+1);
	}
}

function reverseFlip(theBit) {
	grid[theBit] = (grid[theBit] - 1);

	if (grid[theBit] < 0) {
		grid[theBit] = variety - 1;
	}

	$('.'+theBit).css('background-color', colors[grid[theBit] % variety]);
}

function solved() {
	return grid.every(bit => bit === 0);
}

function getRow(bit) {
	for (var i = 0; i < boardRows; i++) {
		if (bit < i * boardCols) {
			return i-1;
		}
	}

	return i-1;
}

function randomize() {
	var boardSize = boardRows * boardCols;
	for(var i = 0; i < boardSize * 5; i++) {
		if(mode === 0) {
			reverseFlipAdjacent(rand(boardSize));
		}
		else if(mode === 1) {
			reverseFlipStar(rand(boardSize));
		}
		else if (mode === 2) {
			reverseFlipDouble(rand(boardSize));
		}
	}
}

function rand(max) {
	return Math.floor(Math.random() * (max));
}

function genPermalink() {
	var link = `?${mode}+${variety}+${boardRows}+${boardCols}+`;

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