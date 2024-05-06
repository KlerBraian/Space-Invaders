let tamañoJuego = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tamañoJuego * columns;
let boardHeight = tamañoJuego * rows;
let context;
let naveImg;


let naveWidht = tamañoJuego*2;
let naveHeight = tamañoJuego;
let naveEjeX = tamañoJuego * columns/2 - tamañoJuego;
let naveEjeY = tamañoJuego * rows -tamañoJuego*2;
let naveVelocidad = tamañoJuego;

let nave = {
    x : naveEjeX,
    y : naveEjeY,
    width: naveWidht,
    height : naveHeight
}


// const jugar = document.querySelector("#jugar");
// jugar.addEventListener("click" ,  () => {
    window.onload = function () {
    board = document.querySelector("#board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext ("2d")


    naveImg =new Image ();
    naveImg.src = "./img/nave.png";
    naveImg.onload = function() { context.drawImage (naveImg, nave.x, nave.y, nave.width, nave.height)}
   
    requestAnimationFrame(recarga);
    document.addEventListener("keydown", movimientosNave)
}

function recarga () {
    requestAnimationFrame(recarga);
    context.clearRect (0,0, board.width, board.height)

    context.drawImage (naveImg, nave.x, nave.y, nave.width, nave.height)
}

function movimientosNave (e) {
    if (e.code == "ArrowLeft" && nave.x - naveVelocidad >=0) {
        nave.x -= naveVelocidad;
    }
    else if (e.code == "ArrowRight" && nave.x + naveVelocidad + nave.width <= board.width) {
        nave.x += naveVelocidad;
    }
 
}











