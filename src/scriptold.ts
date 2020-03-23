
var sz: number = 20;

var mouseX: number;
var mouseY: number;

var mouseZ: number = 15;
let randomColor:string = Math.floor(Math.random()*16777215).toString(16);
var currentColor:string = "#" + randomColor;

let mouseDown : boolean = false;

interface Square {
	color : string;
	size : number;
	x : number;
	y : number;
	z : number;
}

let currentSquare: Square = {color:currentColor, size:sz,x:0,y:0,z:0};
let squares: Array<Square> = [];

function start(): void {
	let canvasLeft = <HTMLCanvasElement> document.getElementById("left");
	let ctxL = canvasLeft.getContext("2d");
	let canvasRight = <HTMLCanvasElement> document.getElementById("right");
	let ctxR = canvasRight.getContext("2d");

	ctxL.canvas.width = window.innerWidth/2;
	ctxL.canvas.height = window.innerHeight;

	ctxL.canvas.addEventListener('mousemove', function(event){
		getMousePos(event);
	});
	ctxL.canvas.addEventListener('wheel', function(event){
		getWheel(event);
	});
	ctxL.canvas.addEventListener('mousedown', function(event){
		down(event);
	});
	ctxL.canvas.addEventListener('mouseup', function(event){
		click(event);
	});

	ctxR.canvas.width = window.innerWidth/2;
	ctxR.canvas.height = window.innerHeight;

	let fps : number = 120;

	let interval = setInterval(function (){draw(ctxL, ctxR)}, 1000 / fps)
}

function getMousePos(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
	if (mouseDown){
		squares.push(Object.assign({}, currentSquare));
	}
}
function getWheel(e){
	console.log(e.deltaY);
	mouseZ += e.deltaY * 0.05;
	if (mouseZ < -5) {
		mouseZ = -5;
	}
	if (mouseZ > 80) {
		mouseZ = 80;
	}
}

function down(e)
{
	mouseDown = true;
}

function click(e)
{
	mouseDown = false;
	squares.push(currentSquare);
	let randomColor:string = Math.floor(Math.random()*16777215).toString(16);
	currentColor = "#" + randomColor;

	currentSquare = {color:currentColor, size:sz,x:0,y:0,z:0};
}



function draw(ctxL, ctxR):void {

	ctxL.clearRect(0, 0, ctxL.canvas.width, ctxL.canvas.height);
	ctxR.clearRect(0, 0, ctxR.canvas.width, ctxL.canvas.height);

	currentSquare.x = mouseX;
	currentSquare.y = mouseY;
	currentSquare.z = mouseZ;

	var arr : Array<Square> = [];
	arr.push(currentSquare);
	arr = arr.concat(squares);
	arr.sort((a, b) => (a.z > b.z) ? 1 : (a.z === b.z) ? ((a.color > b.color) ? 1 : -1) : -1);
	for (let square of arr){
		drawSquare(ctxL, ctxR, square);
	}
	

	//BORDER
	ctxL.strokeStyle = "#000";
	var border: number = 50;
	ctxL.lineWidth = border;
	ctxL.strokeRect(border/2, border/2, ctxL.canvas.width - border, ctxL.canvas.height - border);
	ctxR.strokeStyle = "#000";
	ctxR.lineWidth = border;
	ctxR.strokeRect(border/2, border/2, ctxR.canvas.width - border, ctxR.canvas.height - border);

}

function drawSquare(ctxL, ctxR, sq: Square): void {
	ctxL.fillStyle = sq.color;
	ctxR.fillStyle = sq.color;

	let s: number = sq.size * (1 + sq.z * 0.003); //apparent size
	ctxL.beginPath();
	ctxL.arc(sq.x- s/2 - sq.z/2, sq.y - s/2, s, 0, 2 * Math.PI);
	ctxL.fill();
	ctxR.beginPath();
	ctxR.arc(sq.x- s/2 + sq.z/2, sq.y - s/2, s, 0, 2 * Math.PI);
	ctxR.fill();
	//ctxL.fillRect(sq.x- s/2 - sq.z/2, sq.y - s/2, s, s);
	//ctxR.fillRect(sq.x- s/2 + sq.z/2, sq.y - s/2, s, s);
}