//VARIABLES
// TABLERO 


let tamañoJuego = 38;
let rows = 19;
let columns = 19;

let board;
let boardWidth = tamañoJuego * columns;
let boardHeight = tamañoJuego * rows;
let context;
let naveImg;

//NAVE PLAYER 

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



// INVADERS
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


let naveAlien = {
  x : aliensX,
  y : aliensY,
  width: alienWidth,
  height : alienHeight
}
//CARGAR PAGINA 

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
    document.addEventListener("keydown", movimientosNave);
    document.addEventListener("keyup", disparar);
}

//BALAS
let balas= [];
let balasVelocidad= -10;
let balasAlien = [];
let balasAlienVelocidad = +15
let puntos = 0
let finDelJuego = false;


//RENDERIZAR JUEGO

function recarga () {
    requestAnimationFrame(recarga);

    if (finDelJuego) {
      return;
    }

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

            if(balasAlien.y >= nave.y) {
              finDelJuego = true;
            }
        }
    }

    /// BALAS NAVE
    for ( let i = 0; i < balas.length; i++) {
      let bala = balas[i];
      bala.y += balasVelocidad;
      context.fillStyle = "white";
      context.fillRect (bala.x,bala.y, bala.width,bala.height)
      for (let i = 0; i < aliens.length; i++) {
        let alien = aliens[i];
        if (!bala.usada && alien.alive && colision (bala,alien)) {
          bala.usada = true;
          alien.alive = false;
          aliensContador --;
          puntos +=100
        }
      }
    }

  
    while (balas.length > 0 && (balas[0].usada || balas[0].y <0)) {
      balas.shift();
    }


    // BALAS ALIEN
    for (let i = 0; i < balasAlien.length; i++) {
      let balaAlien = balasAlien[i];
      balaAlien.y += balasAlienVelocidad;
      context.fillStyle = "red";
      context.fillRect(balaAlien.x, balaAlien.y, balaAlien.width, balaAlien.height);
  
      // Verificar colisión con la nave
      if (colisionNave(balaAlien, nave)) {
          finDelJuego = true;
          break; // Detener el bucle
      }
  }
  

  
    while (balas.length > 0 && (balas[0].usada || balas[0].y <0)) {
      balas.shift();
    }

    // PASAR DE NIVEL
  if (aliensContador == 0) {
  aliensColums = Math.min (aliensColums + 1, columns/2 -2);
  if (aliensRows < 6) { // Verifica si aún no tienes 9 filas de aliens
    aliensRows = Math.min(aliensRows + 1, rows - 4);
  } else { // Si ya alcanzaste el nivel máximo, reinicia las filas de aliens a 9
    aliensRows = 6;
  }
  alienVelocidad += 0.2;
  aliens = [];
  balas = [];
  crearAliens();
}

disparoAlien()

context.fillStyle = "white";
context.font = "16px courier";
context.fillText(puntos, 5, 20);


}

// MOVIMIENTO NAVE

function movimientosNave (e) {
    if(finDelJuego) {
      return;
    }
    if (e.code == "ArrowLeft" && nave.x - naveVelocidad >=0) {
        nave.x -= naveVelocidad;
    }
    else if (e.code == "ArrowRight" && nave.x + naveVelocidad + nave.width <= board.width) {
        nave.x += naveVelocidad;
    }
 
}


// CREAR ALIENS


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


//DISPARAR

function disparar (e) {
  if (finDelJuego){
    return;
  }
    if (e.code =="Space") {
        let bala = {
            x: nave.x + naveWidht*15/32,
            y : nave.y,
            width : tamañoJuego/8,
            height: tamañoJuego/2,
            usada: false 
        }
        balas.push (bala)
    }
}


// function disparoAlien () {
//   if (finDelJuego){
//     return;
//   }
//    if (Math.random() < 0.005) { // Probabilidad de disparo de cada alien, puedes ajustar este valor
//     // Seleccionar un alien aleatorio que esté vivo
//     let alienDisparador = aliens[Math.floor(Math.random() * aliens.length)];

//     let balaAlien = {
//         x: alienDisparador.x + alienDisparador.width * 15 / 32,
//         y: alienDisparador.y + alienDisparador.height,
//         width: tamañoJuego / 8,
//         height: tamañoJuego / 2,
//         usada: false
//     };
//     balasAlien.push(balaAlien);
// }

// }

let disparoEnProceso = false;

function disparoAlien() {
    if (finDelJuego) {
        return;
    }

    // Verifica si ya hay un disparo en proceso
    if (!disparoEnProceso) {
        // Selecciona un alien aleatorio que esté vivo
        let alienDisparador = aliens.filter(alien => alien.alive)[Math.floor(Math.random() * aliens.length)];

        // Verifica si hay un alien vivo para disparar
        if (alienDisparador) {
            // Crea la bala del alien con las coordenadas de este alien
            let balaAlien = {
                x: alienDisparador.x + alienDisparador.width * 15 / 32,
                y: alienDisparador.y + alienDisparador.height,
                width: tamañoJuego / 8,
                height: tamañoJuego / 2,
                usada: false
            };

            // Agrega la bala del alien a la lista de balas alien
            balasAlien.push(balaAlien);

            // Establece la bandera de disparo en true
            disparoEnProceso = true;

            // Restablece la bandera después de un tiempo aleatorio entre 1 y 3 segundos
            setTimeout(function() {
                disparoEnProceso = false;
            }, Math.random() * (2000 - 1000) + 1000);
        }
    }
}



function colision (a, b) {
  return a.x < b.x +b.width && a.x + a.width > b.x && a.y < b.y +b.height && a.y + a.height > b.y;
}

function colisionNave(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
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
  localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesGuardadas,));
  localStorage.setItem('puntajeplayer', JSON.stringify(puntos,));
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
