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
//BALAS
let balas= [];
let balasVelocidad= -10;
console.log(balasVelocidad)
let balasAlien = [];
let balasAlienVelocidad = +15
console.log(balasAlienVelocidad)
let puntos = 0
let finDelJuego = false;

let nombreJugador = '';

window.onload = function() {
  fetch('./main.json')
      .then(response => response.json())
      .then(data => {
          // Mostrar las puntuaciones iniciales desde el JSON
          mostrarPuntuaciones(data);

          // Guardar las puntuaciones del JSON en el localStorage si no están ya presentes
          if (!localStorage.getItem('puntuaciones')) {
              localStorage.setItem('puntuaciones', JSON.stringify(data));
          }
      })
      .catch(error => {
          console.error('Se produjo un error al obtener las puntuaciones:', error);
      });
    

document.querySelector("#iniciar-juego").addEventListener("click", function() {
  nombreJugador = document.querySelector("#nombre-jugador").value;
  if (nombreJugador) {
      // Restablecer variables del juego
      finDelJuego = false;
      puntos = 0;
      nave = {
          x : naveEjeX,
          y : naveEjeY,
          width: naveWidht,
          height : naveHeight
      };
      aliens = [];
      balas = [];
      balasAlien = [];
      balasVelocidad= -10;
      balasAlienVelocidad = 15;
 
      
      // Mostrar el contenedor de nombre si es necesario
      document.querySelector("#nombre-jugador-container").style.display = 'none';
      
      // Eliminar listeners de eventos de teclado previos
      document.removeEventListener("keydown", movimientosNave);
      document.removeEventListener("keyup", disparar);

      // Iniciar el juego
      iniciarJuego();

      // Agregar listeners de eventos de teclado nuevamente
      document.addEventListener("keydown", movimientosNave);
      document.addEventListener("keyup", disparar);
  } else {
      alert("Por favor ingresa tu nombre");
  }
});
}
//CARGAR PAGINA 

// const jugar = document.querySelector("#jugar");
// jugar.addEventListener("click" ,  () => {
   function iniciarJuego() {
    finDelJuego = false;
    puntos = 0;
    nave = {
        x : naveEjeX,
        y : naveEjeY,
        width: naveWidht,
        height : naveHeight
    };
    aliens = [];
    balas = [];
    balasAlien = [];
    balasVelocidad= -10;
    balasAlienVelocidad = 15;

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




//RENDERIZAR JUEGO

function recarga () {
    requestAnimationFrame(recarga);

    if (finDelJuego) {
      marcarNuevaPuntuacion();
      document.querySelector("#nombre-jugador-container").style.display = 'block';
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
              marcarNuevaPuntuacion();
              return;
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

            setTimeout(function() {
                disparoEnProceso = false;
            }, Math.random() * (1500 - 1000) + 1000);
        }
    }
}



function colision (a, b) {
  return a.x < b.x +b.width && a.x + a.width > b.x && a.y < b.y +b.height && a.y + a.height > b.y;
}

function colisionNave(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}










fetch('./main.json')
  .then(response => response.json())
  .then(data => {
    mostrarPuntuaciones(data);
    actualizarLocalStorage(data);
  })
  .catch(error => {
    console.error('Se produjo un error al obtener las puntuaciones:', error);
  });


function marcarNuevaPuntuacion() {
  if (puntos > 0 && nombreJugador) {
      actualizarLocalStorage();
      mostrarPuntuaciones(JSON.parse(localStorage.getItem('puntuaciones')));
  }
}

document.querySelector("#reset-puntos").addEventListener("click", resetPuntuaciones);

function resetPuntuaciones() {
    localStorage.removeItem('puntuaciones');
    fetch('./main.json')
      .then(response => response.json())
      .then(data => {

        mostrarPuntuaciones(data);

        localStorage.setItem('puntuaciones', JSON.stringify(data));

        puntos = 0;
        nombreJugador = "";
      })
      .catch(error => {
        console.error('Se produjo un error al obtener las puntuaciones:', error);
      });
}

function actualizarLocalStorage() {
  let puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];
  let jugadorExistente = puntuacionesGuardadas.find(puntuacion => puntuacion.nombre === nombreJugador);
  if (jugadorExistente) {
      if (puntos > jugadorExistente.puntuacion) {
          jugadorExistente.puntuacion = puntos;
      }
  } else {
      if (nombreJugador) { 
          puntuacionesGuardadas.push({ nombre: nombreJugador, puntuacion: puntos });
      }
  }


  localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesGuardadas));

  mostrarPuntuaciones(puntuacionesGuardadas);
}

function mostrarPuntuaciones(puntuaciones) {
  const puntuacionesElemento = document.querySelector('.puntuaciones');
  puntuacionesElemento.innerHTML = '';

  puntuaciones
    .filter(puntuacion => puntuacion.nombre && puntuacion.puntuacion > 0) // Filtrar jugadores con nombre y puntuación válida
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .forEach(puntuacion => {
      const listItem = document.createElement('li');
      listItem.classList.add("puntuacionesItem");
      listItem.textContent = `${puntuacion.nombre}: ${puntuacion.puntuacion}`;
      puntuacionesElemento.appendChild(listItem);
    });
}
