//VARIABLES
// TABLERO 


// let tamañoJuego = 38;

let rows = 19;
let columns = 19;
let tamañoJuego = Math.min(window.innerWidth / columns -2, window.innerHeight / rows -6);


let board;
let boardWidth = tamañoJuego * columns;
let boardHeight = tamañoJuego * rows;
let context;
let naveImg;

//NAVE PLAYER 

let naveWidht = tamañoJuego * 2;
let naveHeight = tamañoJuego;
let naveEjeX = tamañoJuego * columns / 2 - tamañoJuego;
let naveEjeY = tamañoJuego * rows - tamañoJuego * 2;
let naveVelocidad = tamañoJuego;

let nave = {
  x: naveEjeX,
  y: naveEjeY,
  width: naveWidht,
  height: naveHeight
}



// INVADERS
let aliens = [];
let alienWidth = tamañoJuego * 2;
let alienHeight = tamañoJuego;
let aliensX = tamañoJuego;
let aliensY = tamañoJuego;
let aliensImg;

let aliensRows = 2
let aliensColums = 3
let aliensContador = 0;
let alienVelocidad = 1


let naveAlien = {
  x: aliensX,
  y: aliensY,
  width: alienWidth,
  height: alienHeight
}
//BALAS
let balas = [];
let balasVelocidad = -10;
let balasAlien = [];
let balasAlienVelocidad = +15
let finDelJuego = false;


let animationFrameId;
let gameCurrent = false;
let contenedorDatos = document.querySelector("#nombre-jugador-container")
let contenedorPuntos = document.querySelector("#tabla-puntajes")
let juegoContenedor = document.querySelector("#juego-container")



window.onload = function () {
  fetch('./main.json')
    .then(response => response.json())
    .then(data => {
      mostrarPuntuaciones(data);
      if (!localStorage.getItem('puntuaciones')) {
        localStorage.setItem('puntuaciones', JSON.stringify(data));
      }
    })
    .catch(error => {
      console.error('Se produjo un error al obtener las puntuaciones:', error);
    });


  document.querySelector("#iniciar-juego").addEventListener("click", function () {
    nombreJugador = document.querySelector("#nombre-jugador").value;
    if (nombreJugador) {
      Toastify({
        text: "Buena suerte " + nombreJugador,
        duration: 1500,
        style: {
          padding: "0.5rem",
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          fontSize: "1.2rem",
          position: "absolute"
        },
      }).showToast();


      iniciarJuego();

      document.addEventListener("keydown", movimientosNave);
      document.addEventListener("keyup", disparar);
    } else {
      Swal.fire({
        icon: "error",
        text: "Lo sentimos, debes ingresar un nombre para jugar",
        backdrop: false
      });
    }
  });
}
//CARGAR PAGINA 

function iniciarJuego() {
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
}
  juegoContenedor.classList.add("mostrarJuego")
  board = document.querySelector("#board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d")


  naveImg = new Image();
  naveImg.src = "./img/nave.png";
  naveImg.onload = function () { context.drawImage(naveImg, nave.x, nave.y, nave.width, nave.height) }

  aliensImg = new Image();
  aliensImg.src = "./img/alien.png"
  gameCurrent = true

  if(gameCurrent) {
    contenedorDatos.classList.add("ocultarDatos")
    contenedorPuntos.classList.add("ocultarPuntos")
    juegoContenedor.classList.remove("ocultarJuego")
  }

  crearAliens();

  recarga();
  document.addEventListener("keydown", movimientosNave);
  document.addEventListener("keyup", disparar);
}




//RENDERIZAR JUEGO

function recarga() {
  animationFrameId = requestAnimationFrame(recarga);
  if (finDelJuego) {
    Swal.fire({
      icon: "success",
      text: "Buen intento " + nombreJugador + "!",
      backdrop: false
    });
   
    actualizarPuntuacion(nombreJugador, puntos);
    puntos = 0;
    nave = {
      x: naveEjeX,
      y: naveEjeY,
      width: naveWidht,
      height: naveHeight
    };
    aliens = [];
    balas = [];
    balasAlien = [];
    balasVelocidad = -10;
    balasAlienVelocidad = +15;
    aliensRows = 2;
    aliensColums = 3;
    finDelJuego = false;
    gameCurrent= false
    if(!gameCurrent) {
      contenedorDatos.classList.remove("ocultarDatos")
      contenedorPuntos.classList.remove("ocultarPuntos")
      juegoContenedor.classList.add("ocultarJuego")
    }
    cancelAnimationFrame(recarga);
 
    return;
  }

  context.clearRect(0, 0, board.width, board.height)

  context.drawImage(naveImg, nave.x, nave.y, nave.width, nave.height)

  for (let i = 0; i < aliens.length; i++) {
    let alien = aliens[i];
    if (alien.alive) {
      alien.x += alienVelocidad;

      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocidad *= -1
      }
      context.drawImage(aliensImg, alien.x, alien.y, alien.width, alien.height)

      if (balasAlien.y >= nave.y) {
        finDelJuego = true;
        marcarNuevaPuntuacion();
        return;
      }
    }
  }

  /// BALAS NAVE
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];
    bala.y += balasVelocidad;
    context.fillStyle = "white";
    context.fillRect(bala.x, bala.y, bala.width, bala.height)
    for (let i = 0; i < aliens.length; i++) {
      let alien = aliens[i];
      if (!bala.usada && alien.alive && colision(bala, alien)) {
        bala.usada = true;
        alien.alive = false;
        aliensContador--;
        puntos += 100
      }
    }
  }


  while (balas.length > 0 && (balas[0].usada || balas[0].y < 0)) {
    balas.shift();
  }


  // BALAS ALIEN
  for (let i = 0; i < balasAlien.length; i++) {
    let balaAlien = balasAlien[i];
    balaAlien.y += balasAlienVelocidad;
    context.fillStyle = "red";
    context.fillRect(balaAlien.x, balaAlien.y, balaAlien.width, balaAlien.height);

    if (colisionNave(balaAlien, nave)) {
      finDelJuego = true;
      break;
    }
  }



  while (balas.length > 0 && (balas[0].usada || balas[0].y < 0)) {
    balas.shift();
  }

  // PASAR DE NIVEL
  if (aliensContador == 0) {
    aliensColums = Math.min(aliensColums + 1, columns / 2 - 2);
    if (aliensRows < 6) {
      aliensRows = Math.min(aliensRows + 1, rows - 4);
    } else {
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

  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(nombreJugador, 600, 20);

}

// MOVIMIENTO NAVE

function movimientosNave(e) {
  if (finDelJuego) {
    return;
  }
  if (e.code == "ArrowLeft" && nave.x - naveVelocidad >= 0) {
    nave.x -= naveVelocidad;
  }
  else if (e.code == "ArrowRight" && nave.x + naveVelocidad + nave.width <= board.width) {
    nave.x += naveVelocidad;
  }

}


// CREAR ALIENS


function crearAliens() {
  for (let x = 0; x < aliensColums; x++) {
    for (let y = 0; y < aliensRows; y++) {
      let alien = {
        img: aliensImg,
        x: aliensX + x * alienWidth,
        y: aliensY + y * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true
      }
      aliens.push(alien)
    }
    aliensContador = aliens.length;
  }
}


//DISPARAR

function disparar(e) {
  if (finDelJuego) {
    return;
  }
  if (e.code == "Space") {
    let bala = {
      x: nave.x + naveWidht * 15 / 32,
      y: nave.y,
      width: tamañoJuego / 8,
      height: tamañoJuego / 2,
      usada: false
    }
    balas.push(bala)
  }
}


let disparoEnProceso = false;

function disparoAlien() {
  if (finDelJuego) {
    return;
  }

  if (!disparoEnProceso) {
    let alienDisparador = aliens.filter(alien => alien.alive)[Math.floor(Math.random() * aliens.length)];

    if (alienDisparador) {
      let balaAlien = {
        x: alienDisparador.x + alienDisparador.width * 15 / 32,
        y: alienDisparador.y + alienDisparador.height,
        width: tamañoJuego / 8,
        height: tamañoJuego / 2,
        usada: false
      };

      balasAlien.push(balaAlien);

      disparoEnProceso = true;

      setTimeout(function () {
        disparoEnProceso = false;
      }, Math.random() * (1500 - 1000) + 1000);
    }
  }
}



function colision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function colisionNave(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}





let puntos = 0
let nombreJugador = '';


fetch('./main.json')
  .then(response => response.json())
  .then(data => {
    mostrarPuntuaciones(data);
  })
  .catch(error => {
    console.error('Se produjo un error al obtener las puntuaciones:', error);
  });


document.querySelector("#reset-puntos").addEventListener("click", resetPuntuaciones);

function resetPuntuaciones() {
  localStorage.removeItem('puntuaciones');
  fetch('./main.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('puntuaciones', JSON.stringify(data));
      mostrarPuntuaciones(data);
      puntos = 0;
      nombreJugador = "";
    })
    .catch(error => {
      console.error('Se produjo un error al obtener las puntuaciones:', error);
    });
}


function mostrarPuntuaciones(puntuaciones) {
  const puntuacionesElemento = document.querySelector('.puntuaciones');
  puntuacionesElemento.innerHTML = '';
  puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || [];

  puntuaciones
    .filter(puntuacion => puntuacion.nombre && puntuacion.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .forEach(puntuacion => {
      const listItem = document.createElement('li');
      listItem.classList.add("puntuacionesItem");
      listItem.textContent = `${puntuacion.nombre}: ${puntuacion.puntuacion}`;
      puntuacionesElemento.appendChild(listItem);
    });
}

function actualizarPuntuacion(nombre, nuevaPuntuacion) {
  const puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || [];
  const jugadorExistente = puntuaciones.find(p => p.nombre === nombre);
  if (jugadorExistente) {
    jugadorExistente.puntuacion = nuevaPuntuacion;
  } else {
    puntuaciones.push({ nombre: nombre, puntuacion: nuevaPuntuacion });
  }

  localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
  mostrarPuntuaciones(puntuaciones);
}

