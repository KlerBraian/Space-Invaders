let tamañoJuego = 38;
let rows = 19;
let columns = 19;

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


let aliens = [];
let alienWidth = tamañoJuego*2;
let alienHeight= tamañoJuego;
let aliensX = tamañoJuego;
let aliensY = tamañoJuego;
let aliensImg;

let aliensRows = 2
let aliensColums = 3
let aliensContador = 0;
let alienVelocidad = 1 



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
   
    alienImg = new Image();
    alienImg.src = "./img/alien.png"

    crearAliens();

    requestAnimationFrame(recarga);
    document.addEventListener("keydown", movimientosNave)
}

function recarga () {
    requestAnimationFrame(recarga);
    context.clearRect (0,0, board.width, board.height)

    context.drawImage (naveImg, nave.x, nave.y, nave.width, nave.height)

    for (let i =0; i <aliens.length;i++) {
        let alien = aliens[i];
        if (alien.alive) {
            alien.x += alienVelocidad;

            if(alien.x + alien.width >= board.width || alien.x <=0) {
                alienVelocidad *= -1
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width , alien.height)
        }
    }
}

function movimientosNave (e) {
    if (e.code == "ArrowLeft" && nave.x - naveVelocidad >=0) {
        nave.x -= naveVelocidad;
    }
    else if (e.code == "ArrowRight" && nave.x + naveVelocidad + nave.width <= board.width) {
        nave.x += naveVelocidad;
    }
 
}


function crearAliens () {
 for (let x=0; x<aliensColums; x++){
    for(let y=0; y<aliensRows; y++){
        let alien = {
            img : aliensImg,
            x : aliensX + x*alienWidth,
            y : aliensY + y*alienHeight,
            width : alienWidth,
            height : alienHeight,
            alive : true
        }
        aliens.push (alien)
    }
    aliensContador = aliens.length;
 }
}









// Obtener las puntuaciones de los jugadores utilizando fetch
fetch('./main.json')
  .then(response => response.json())
  .then(data => {
    // Manipular los datos obtenidos
    mostrarPuntuaciones(data);

    // Actualizar las puntuaciones en el localStorage
    actualizarLocalStorage(data);
  })
  .catch(error => {
    console.error('Se produjo un error al obtener las puntuaciones:', error);
  });

// Función para mostrar las puntuaciones en el juego
function mostrarPuntuaciones(puntuaciones) {
  // Supongamos que tienes un elemento HTML con el id "puntuaciones"
  const puntuacionesElemento = document.querySelector('.puntuaciones');

  // Limpiar el contenido anterior
  puntuacionesElemento.innerHTML = '';

  // Crear elementos de lista para cada puntuación y agregarlos al elemento HTML
  puntuaciones.forEach(puntuacion => {
    const listItem = document.createElement('li');
    listItem.classList.add ("puntuacionesItem")
    listItem.textContent = `${puntuacion.nombre}: ${puntuacion.puntuacion}`;
    puntuacionesElemento.appendChild(listItem);
  });
}

// Función para actualizar las puntuaciones en el localStorage
function actualizarLocalStorage(puntuaciones) {
  // Obtener las puntuaciones almacenadas en el localStorage
  let puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];

  // Actualizar las puntuaciones almacenadas con las nuevas puntuaciones obtenidas
  puntuacionesGuardadas = puntuaciones;

  // Guardar las puntuaciones actualizadas en el localStorage
  localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesGuardadas));
}

// Llamada a esta función cuando el usuario marque una nueva marca
function marcarNuevaPuntuacion() {
  // Lógica para marcar una nueva puntuación...

  // Una vez que se ha marcado la nueva puntuación, volver a cargar las puntuaciones
  fetch('./main.json')
    .then(response => response.json())
    .then(data => {
      // Actualizar las puntuaciones en el localStorage
      actualizarLocalStorage(data);
    })
    .catch(error => {
      console.error('Se produjo un error al obtener las puntuaciones:', error);
    });
}
