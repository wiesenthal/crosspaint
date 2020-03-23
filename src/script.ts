
var sz: number = 15;

var mouseX: number;
var mouseY: number;

var mouseZ: number = 15;
//let randomColor:string = Math.floor(Math.random()*16777215).toString(16);
//var currentColor:string = "#" + randomColor;
var currentColor:string = "#ffffff";

let mouseDown : boolean = false;

let confirmClear: boolean = false;
let ticks : number = 0;
let fps : number = 120;

interface Line {
	color : string;
	width : number;
	x1 : number;
	y1 : number;
	z1 : number;
	x2 : number;
	y2 : number;
	z2 : number;
}

let currentSpot: Line = {color:currentColor, width:sz,x1:0,y1:0,z1:0,x2:0,y2:0, z2:0};
let lines: Array<Line> = [];

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
	window.addEventListener('keydown', function(event){
		key(event);
	});

	ctxR.canvas.width = window.innerWidth/2;
	ctxR.canvas.height = window.innerHeight;

	let interval = setInterval(function (){draw(ctxL, ctxR)}, 1000 / fps)
}

function dist(x1:number, y1:number, x2:number, y2:number):number
{
	let a:number = Math.pow(x2 - x1, 2);
	let b:number = Math.pow(y2 - y1, 2);
	return (Math.sqrt(a + b))

}

function getMousePos(e){
	
	if (mouseDown){
		if (dist(mouseX, mouseY, e.clientX, e.clientY) < 2)
		{
			return;
		}
		let newline : Line = {color:currentColor, width:sz, x1:mouseX, y1:mouseY,z1:mouseZ, x2:e.clientX, y2:e.clientY, z2:mouseZ};
		lines.push(newline);
	}
	mouseX = e.clientX;
	mouseY = e.clientY;
}
function getWheel(e){
	var oldZ = mouseZ;
	mouseZ += e.deltaY * 0.05;
	if (mouseZ < -5) {
		mouseZ = -5;
	}
	if (mouseZ > 90) {
		mouseZ = 90;
	}
	if (mouseDown){
		let newline : Line = {color:currentColor, width:sz, x1:mouseX, y1:mouseY,z1:oldZ, x2:mouseX, y2:mouseY, z2:mouseZ};
		lines.push(newline);
	}
}

function down(e)
{
	mouseDown = true;
	confirmClear = false;
}

function click(e)
{
	mouseDown = false;

	lines.push(currentSpot);
	currentSpot = {color:currentColor, width:sz,x1:0,y1:0,z1:0,x2:0,y2:0,z2:0};
	
}

function key(e): void{
	let k:number = e.which || e.keyCode;
	let key:string = String.fromCharCode(k);
	
	if (key === "R") {
		if (confirmClear){
			lines = [];
			currentColor = "#ffffff";
			sz = 15;
			confirmClear = false;
		}
		else {
			confirmClear = true;
		}
	}
	else {
		confirmClear = false;
	}

	switch (key){
		case '1':
			currentColor = 	"#ff0000";
			break;
		case '2':
			currentColor = "#f9901c";
			break;
		case '3':
			currentColor = "#fffc00";
			break;
		case '4':
			currentColor = "#41a34d";
			break;
		case '5':
			currentColor = "#0059cf";
			break;
		case '6':
			currentColor = "#4B0082";
			break;
		case '7':
			currentColor = '#EE82EE';
			break;
		case '8':
			currentColor = '#000000';
			break;
		case '9':
			currentColor = '#FFFFFF';
			break;
		case 'W':
			if (sz < 120){
				sz += 1.5;
			}
			break;
		case 'S':
			if (sz > 1){
				sz -= 1.5;
			}
			break;
		default:
			//do nothing
	}
	currentSpot.color = currentColor;
	currentSpot.width = sz;
}

function draw(ctxL, ctxR):void {
	ctxL.clearRect(0, 0, ctxL.canvas.width, ctxL.canvas.height);
	ctxR.clearRect(0, 0, ctxR.canvas.width, ctxL.canvas.height);

	currentSpot.x1 = mouseX;
	currentSpot.y1 = mouseY;
	currentSpot.z1 = mouseZ;
	currentSpot.x2 = mouseX ;
	currentSpot.y2 = mouseY ;
	currentSpot.z2 = mouseZ;

	var arr : Array<Line> = [];
	arr.push(currentSpot);
	arr = arr.concat(lines);
	arr.sort((a, b) => (a.z1 > b.z1) ? 1 : (a.z1 === b.z1) ? ((a.color > b.color) ? 1 : -1) : -1);
	for (let line of arr){
		drawLine(ctxL, ctxR, line);
	}
	

	//BORDER
	ctxL.strokeStyle = "#000";
	var border: number = 50;
	ctxL.lineWidth = border;

	ctxL.strokeRect(border/2, border/2, ctxL.canvas.width - border, ctxL.canvas.height - border);
	ctxR.strokeStyle = "#000";
	ctxR.lineWidth = border;
	ctxR.strokeRect(border/2, border/2, ctxR.canvas.width - border, ctxR.canvas.height - border);

	if (mouseY < border || ticks/fps < 8) {
		//show controls
		let controls : Line = {color:"#000", width:border + 180, x1:0, y1:border, z1:0, x2:ctxL.canvas.width, y2:border, z2:0};
		drawLine(ctxL, ctxR, controls);
		drawText(ctxL, ctxR, "Left click and hold to draw. Press R twice to reset.", 30, border*2, border, 0);
		drawText(ctxL, ctxR, "Use the scroll wheel to change distance.", 30, border*2, border + 40, 0);
		drawText(ctxL, ctxR, "Press 1-9 to change color, W or S to change size.", 30, border*2, border + 80, 0);

		if (ticks/fps < 6) {
			//tell to crossview
			drawText(ctxL, ctxR, "CROSS", 100, 300, 300, 0);
			drawText(ctxL, ctxR, "YOUR", 100, 320, 420, 20);
			drawText(ctxL, ctxR, "EYES", 100, 330, 540, 20);
			drawText(ctxL, ctxR, "NOW", 100, 335, 660, 0);

		}
	}
	ticks++;

}

function drawLine(ctxL, ctxR, line: Line): void {
	ctxL.strokeStyle = line.color;
	ctxR.strokeStyle = line.color;

	let s: number = line.width * (1 + line.z2 * 0.003); //apparent stroke width
	ctxL.lineWidth = s;
	ctxR.lineWidth = s;
	ctxL.lineCap = "round";
	ctxR.lineCap = "round";

	ctxL.beginPath();
	ctxL.moveTo(line.x1 - line.z1/2, line.y1);
	ctxL.lineTo(line.x2 - line.z2/2, line.y2);
	ctxL.stroke();

	ctxR.beginPath();
	ctxR.moveTo(line.x1 + line.z1/2, line.y1);
	ctxR.lineTo(line.x2 + line.z2/2, line.y2);
	ctxR.stroke();
}
function drawText(ctxL, ctxR, text:string, size:number, x:number, y:number, z:number):void {
	ctxL.font = size.toString() + "px Arial";
	ctxR.font = size.toString() + "px Arial";
	ctxL.fillStyle = "#DDD";
	ctxR.fillStyle = '#DDD';

	ctxL.fillText(text, x - z/2, y);
	ctxR.fillText(text, x + z/2, y);

}