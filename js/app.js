// 1. IMPORTACIÓN DE MÓDULOS
// Los otros JS se cargan en juego.html antes que este:
//   clase-tamagotchi.js  →  Tamagotchi
//   datos-tamagotchi.js  →  tamagotchis

// 2. DECLARACIÓN DE VARIABLES

// MAPEO HTML
const SELECCIONAR = document.getElementById('seleccionar');
const CONTINUAR = document.getElementById('continuar');
const DETALLE_SELECCION = document.getElementById('detalle-seleccion-fase');
const JUEGO_ACTIVO = document.getElementById('juego-activo');
const VIDEO_PERSONAJE = document.getElementById('video-personaje');
const NOMBRE_ELEGIDO = document.getElementById('nombre-elegido');
const IMAGEN_ELEGIDA = document.getElementById('imagen-elegida');
const DESCRIPCION_ELEGIDA = document.getElementById('descripcion-elegida');
const DIALOGO_GAME_OVER = document.getElementById('dialogo-game-over');
const TEXTO_GAME_OVER = document.getElementById('texto-game-over');
const CERRAR_GAME_OVER = document.getElementById('cerrar-game-over');
const OPCIONES_FIN = document.getElementById('opciones-fin');
const SEGUIR_JUGANDO = document.getElementById('seguir-jugando');
const OTRO_JUGADOR = document.getElementById('otro-jugador');
const BARRA_ACCIONES = document.getElementById('barra-acciones');
const ICONOS_FELICIDAD = document.getElementById('iconos-felicidad');
const ICONOS_SALUD = document.getElementById('iconos-salud');
const ICONOS_LIMPIEZA = document.getElementById('iconos-limpieza');
const ICONOS_ENERGIA = document.getElementById('iconos-energia');

const BOTONES_ACCION = [                                                // config de los 6 botones de acción
  { id: 'btn-alimentar', metodo: 'alimentar', video: 'alimentar' },    // alimentar
  { id: 'btn-jugar', metodo: 'jugar', video: 'jugar' },                // jugar
  { id: 'btn-duchar', metodo: 'duchar', video: 'duchar' },             // duchar
  { id: 'btn-acariciar', metodo: 'acariciar', video: 'acariciar' },    // acariciar
  { id: 'btn-dormir', metodo: 'dormir', video: 'dormir' },             // dormir
  { id: 'btn-reprender', metodo: 'reprender', video: 'reprender' },   // reprender
];

const botonesAccion = [];                                               // aquí guarda botón DOM + método + vídeo

for (let i = 0; i < BOTONES_ACCION.length; i++) {
  const { id, metodo, video } = BOTONES_ACCION[i];
  botonesAccion.push({
    boton: document.getElementById(id),
    metodo,
    video,
  });
}

const estado = {                                                        // lo que cambia mientras juegas
  activo: null,                                                         // tamagotchi en juego; null si no hay partida
  temporizador: null,                                                   // id del intervalo que resta vida cada 5 s
  partidaTerminada: false,                                              // true cuando ya murió y salió el game over
  escuchas: [],                                                         // clicks enganchados; los quita al morir
  botonesAccion,                                                        // los 6 botones de acción ya enlazados al DOM
  manejadores: {},                                                      // funciones click; las crea main al arrancar
};

// 3. DECLARACIÓN DE FUNCIONES

const crearTamagotchiActivo = (plantilla) => {                          // nuevo tamagotchi al empezar (función independiente)
  const tamagotchi = new Tamagotchi(                                    // instancia la clase UF1844
    plantilla.nombre,                                                   // nombre del personaje elegido
    plantilla.descripcion,                                              // descripción para la pantalla
    plantilla.imagen                                                    // ruta de la imagen
  );
  tamagotchi.videos = plantilla.videos;                                 // copia los vídeos (extra, fuera de la clase)
  return tamagotchi;                                                    // devuelve el objeto listo para jugar
};

const prepararVistaJuego = (personaje) => {                             // junta lo que hay que pintar (función independiente)
  const datos = {                                                       // objeto con lo que necesita el HTML
    nombre: personaje.nombre,                                           // título en pantalla
    imagen: personaje.imagen,                                           // src del avatar
    descripcion: personaje.descripcion,                                 // texto bajo la foto
    videoSaludo: personaje.videos.saludo,                               // vídeo al empezar partida
  };
  return datos;                                                         // lo recoge quien llame y pinta
};

const crearMensajeGameOver = (nombre) => {                              // texto cuando muere (función independiente)
  const mensaje = `${nombre} se ha dormido para siempre... Game Over.`; // frase del diálogo
  return mensaje;                                                       // un solo return
};

const obtenerIndicePorNombre = (lista, nombre) => {                     // busca en el array (función independiente)
  let indice = -1;                                                      // -1 si no lo encuentra

  for (let i = 0; i < lista.length; i++) {                              // recorre tamagotchis
    if (lista[i].nombre === nombre) {                                   // ¿es este personaje?
      indice = i;                                                       // guarda la posición
      break;                                                            // ya no sigue buscando
    }
  }

  return indice;                                                        // índice encontrado o -1
};

const debeTerminarPartida = (tamagotchi) => {                           // ¿toca game over? (función independiente)
  const terminar = !tamagotchi.getEnVida();                             // true si enVida es false
  return terminar;                                                      // lo usa gestionarFinPartida
};

const obtenerBarrasEstado = (tamagotchi) => {                           // valores de los 4 stats (función independiente)
  const barras = [                                                      // array con icono + valor de cada stat
    { imagen: 'assets/img/star.svg', valor: tamagotchi.getFelicidad() }, // felicidad 0-10
    { imagen: 'assets/img/heart.svg', valor: tamagotchi.getSalud() },    // salud
    { imagen: 'assets/img/water.svg', valor: tamagotchi.getLimpieza() }, // limpieza
    { imagen: 'assets/img/energy.svg', valor: tamagotchi.getEnergia() }, // energía
  ];
  return barras;                                                        // lo pinta actualizarPantalla
};

const pintarIconos = (contenedor, imagen, cantidad) => {                // 10 iconos, los de arriba brillan (función independiente)
  if (!contenedor) {                                                     // sin contenedor no pinta
    return;
  }

  contenedor.replaceChildren();                                         // vacía el contenedor antes de pintar

  for (let i = 0; i < 10; i++) {                                        // siempre 10 iconos por stat
    const pieza = document.createElement('img');                        // crea cada iconito
    pieza.src = imagen;                                                 // estrella, corazón, etc.
    pieza.alt = '';                                                     // decorativo, sin texto alt
    let clase = '';                                                     // activo o apagado

    if (i < cantidad) {                                                 // los primeros 'cantidad' brillan
      clase = 'icono-stat icono-stat--activo';
    } else {
      clase = 'icono-stat icono-stat--apagado';
    }

    pieza.className = clase;                                            // aplica la clase CSS
    contenedor.append(pieza);                                             // lo mete en la fila
  }
};

const reproducirVideoSilenciado = (video) => {                          // reproduce sin sonido (función independiente)
  video.muted = true;                                                   // sin audio
  video.play();                                                         // intenta reproducir
};

const reproducirVideo = (video, ruta) => {                              // cambia el src y reproduce (función independiente)
  if (!ruta) {
    return;
  }

  video.pause();
  video.muted = false;
  video.src = ruta;
  video.load();

  const intento = video.play();

  if (intento) {
    const alFallarAutoplay = () => {
      reproducirVideoSilenciado(video);
    };

    intento.catch(alFallarAutoplay);
  }
};

const seleccionarPersonaje = (select, indice) => {                      // marca la opción del desplegable (función independiente)
  select.selectedIndex = indice;                                        // posición en el <select>
};

const llenarSelect = (select, lista) => {                               // nombres en el select (función independiente)
  for (let i = 0; i < lista.length; i++) {                              // escalable: usa lista.length
    select.innerHTML += `<option>${lista[i].nombre}</option>`;          // una opción por tamagotchi
  }
};

const mostrarVistaJuego = (datos) => {                                  // pone nombre, foto, texto y vídeo (función independiente)
  JUEGO_ACTIVO.classList.remove('hidden');                              // quita oculto de Tailwind
  NOMBRE_ELEGIDO.textContent = datos.nombre;                            // título
  IMAGEN_ELEGIDA.src = datos.imagen;                                    // foto
  IMAGEN_ELEGIDA.alt = datos.nombre;                                    // accesibilidad
  DESCRIPCION_ELEGIDA.textContent = datos.descripcion;                  // párrafo
  reproducirVideo(VIDEO_PERSONAJE, datos.videoSaludo);                  // vídeo de saludo
};

const actualizarPantalla = (tamagotchi) => {                            // refresca los 4 stats (función independiente)
  const barras = obtenerBarrasEstado(tamagotchi);                       // lee felicidad, salud, etc.
  const contenedores = [                                                // cada fila de iconos del HTML
    ICONOS_FELICIDAD,
    ICONOS_SALUD,
    ICONOS_LIMPIEZA,
    ICONOS_ENERGIA,
  ];

  for (let i = 0; i < barras.length; i++) {                             // las 4 barras
    pintarIconos(contenedores[i], barras[i].imagen, barras[i].valor);   // pinta iconos activos/apagados
  }
};

const quitarEscuchas = (estadoJuego) => {                               // al morir, quita los clicks (función independiente)
  for (let i = 0; i < estadoJuego.escuchas.length; i++) {               // cada listener guardado
    const escucha = estadoJuego.escuchas[i];                            // { boton, fn }
    escucha.boton.removeEventListener('click', escucha.fn);             // desengancha el click
  }

  estadoJuego.escuchas.length = 0;                                        // vacía el array de escuchas
};

const desactivarBotones = (listaBotones) => {                           // apaga los 6 botones de acción (función independiente)
  for (let i = 0; i < listaBotones.length; i++) {                       // los 6 botones
    listaBotones[i].boton.disabled = true;                              // no se puede pulsar
  }
};

const marcarMuerto = () => {                                            // se ve que ha muerto (función independiente)
  IMAGEN_ELEGIDA.classList.add('avatar--muerto');                       // estilo gris en la foto
  NOMBRE_ELEGIDO.classList.add('line-through', 'opacity-60');           // nombre tachado
};

const quitarMuerto = () => {                                            // al reiniciar partida (función independiente)
  IMAGEN_ELEGIDA.classList.remove('avatar--muerto');                    // quita estilo muerto
  NOMBRE_ELEGIDO.classList.remove('line-through', 'opacity-60');
};

const mostrarGameOver = (mensaje) => {                                  // abre el diálogo de muerte (función independiente)
  TEXTO_GAME_OVER.textContent = mensaje;                                // escribe el texto
  DIALOGO_GAME_OVER.showModal();                                        // abre el <dialog>
};

const mostrarOpcionesFin = () => {                                       // después del OK (función independiente)
  OPCIONES_FIN.classList.remove('hidden');                              // seguir / otro jugador
};

const finPartida = (estadoJuego) => {                                   // todo lo que pasa al morir (función independiente)
  if (!estadoJuego.partidaTerminada) {                                  // solo la primera vez
    estadoJuego.partidaTerminada = true;                                // marca que ya terminó
    clearInterval(estadoJuego.temporizador);                            // para el timer de 5 s
    estadoJuego.temporizador = null;                                    // limpia el id
    quitarEscuchas(estadoJuego);                                        // quita listeners de acción
    desactivarBotones(estadoJuego.botonesAccion);                       // desactiva botones
    marcarMuerto();                                                     // aspecto de muerto
    reproducirVideo(VIDEO_PERSONAJE, estadoJuego.activo.videos.morir);  // vídeo morir
    const mensaje = crearMensajeGameOver(estadoJuego.activo.nombre);    // texto game over
    mostrarGameOver(mensaje);                                           // muestra el modal
    BARRA_ACCIONES.classList.add('hidden');                             // oculta barra de acciones
  }
};

const cerrarGameOver = () => {                                          // pulsan OK (función independiente)
  DIALOGO_GAME_OVER.close();                                            // cierra el diálogo
  mostrarOpcionesFin();                                                 // enseña seguir u otro jugador
};

const volverASeleccion = (estadoJuego) => {                             // cambiar de personaje (función independiente)
  clearInterval(estadoJuego.temporizador);                              // por si quedaba timer
  estadoJuego.temporizador = null;
  estadoJuego.activo = null;                                            // ya no hay partida activa

  JUEGO_ACTIVO.classList.add('hidden');                                 // oculta juego
  BARRA_ACCIONES.classList.add('hidden');                               // oculta acciones
  OPCIONES_FIN.classList.add('hidden');                                 // oculta opciones fin
  DIALOGO_GAME_OVER.close();                                            // cierra modal si estaba abierto

  VIDEO_PERSONAJE.pause();                                              // para vídeo
  VIDEO_PERSONAJE.removeAttribute('src');                               // quita src del vídeo

  DETALLE_SELECCION.classList.remove('hidden');                         // vuelve a la fase selección
  DETALLE_SELECCION.open = true;                                        // abre el details
};

const gestionarFinPartida = (estadoJuego) => {                           // mira si murió y actúa (función independiente)
  const terminar = debeTerminarPartida(estadoJuego.activo);             // ¿enVida false?

  if (terminar) {                                                       // si murió
    finPartida(estadoJuego);                                            // hace todo el ritual de game over
  }
};

const ejecutarAccion = (metodo, videoClave, estadoJuego) => {           // un botón de acción (función independiente)
  if (estadoJuego.activo.getEnVida()) {                                 // solo si sigue vivo
    estadoJuego.activo[metodo]();                                       // alimentar(), jugar(), etc.
    reproducirVideo(VIDEO_PERSONAJE, estadoJuego.activo.videos[videoClave]); // vídeo de la acción
    actualizarPantalla(estadoJuego.activo);                             // refresca stats en pantalla
    gestionarFinPartida(estadoJuego);                                   // por si murió con la acción
  }
};

const obtenerManejadorAccion = (estadoJuego, metodo) => {               // devuelve la función del botón (función independiente)
  const manejador = estadoJuego.manejadores[metodo];                  // la creó main al arrancar
  return manejador;
};

const configurarBotones = (estadoJuego, listaBotones) => {              // engancha los 6 botones (función independiente)
  quitarEscuchas(estadoJuego);                                          // limpia listeners viejos

  for (let i = 0; i < listaBotones.length; i++) {                       // los 6 botones
    const boton = listaBotones[i].boton;                                // nodo HTML
    const metodo = listaBotones[i].metodo;                              // alimentar, jugar...
    const manejador = obtenerManejadorAccion(estadoJuego, metodo);      // función con nombre

    if (boton && manejador) {                                           // solo si existen los dos
      boton.disabled = false;                                             // activa el botón
      boton.addEventListener('click', manejador);                         // engancha click
      estadoJuego.escuchas.push({ boton, fn: manejador });                 // guarda para quitarEscuchas
    }
  }
};

const pasarTiempo = (estadoJuego) => {                                  // cada 5 segundos resta vida (función independiente)
  if (estadoJuego.activo.getEnVida()) {                                 // solo si vive
    estadoJuego.activo.restarVida();                                    // -1 en cada stat (clase)
    actualizarPantalla(estadoJuego.activo);                             // actualiza iconos
    gestionarFinPartida(estadoJuego);                                   // comprueba muerte
  }
};

const iniciarTimer = (estadoJuego) => {                                 // arranca el intervalo (función independiente)
  clearInterval(estadoJuego.temporizador);                              // por si había uno anterior

  const tickPartida = () => {                                           // cada tick del setInterval
    pasarTiempo(estadoJuego);                                           // resta vida
  };

  estadoJuego.temporizador = setInterval(tickPartida, 5000);            // cada 5 segundos UF1844
};

const iniciarPartidaConIndice = (indice, estadoJuego, lista) => {       // empieza con ese personaje (función independiente)
  clearInterval(estadoJuego.temporizador);                              // reinicia timer
  quitarEscuchas(estadoJuego);                                          // quita clicks viejos
  estadoJuego.partidaTerminada = false;                                 // nueva partida
  quitarMuerto();                                                       // quita estilos de muerte
  OPCIONES_FIN.classList.add('hidden');                                 // oculta opciones fin
  DIALOGO_GAME_OVER.close();                                            // cierra game over si estaba

  let indiceValido = indice;                                            // índice del personaje elegido
  if (indiceValido < 0 || indiceValido >= lista.length) {                // por si el select falla
    indiceValido = 0;
  }

  const plantilla = lista[indiceValido];                                // datos del elegido
  estadoJuego.activo = crearTamagotchiActivo(plantilla);                // tamagotchi nuevo con stats al azar

  const datos = prepararVistaJuego(estadoJuego.activo);                 // objeto para pintar pantalla
  seleccionarPersonaje(SELECCIONAR, indiceValido);                      // marca el select
  mostrarVistaJuego(datos);                                             // nombre, foto, vídeo saludo
  BARRA_ACCIONES.classList.remove('hidden');                            // enseña los 6 botones
  actualizarPantalla(estadoJuego.activo);                               // pinta los 4 stats
  configurarBotones(estadoJuego, estadoJuego.botonesAccion);            // engancha acciones
  iniciarTimer(estadoJuego);                                            // arranca timer 5 s
};

const iniciarPartida = (estadoJuego, lista) => {                        // Continuar (función independiente)
  const indice = SELECCIONAR.selectedIndex;                             // qué opción eligió
  iniciarPartidaConIndice(indice, estadoJuego, lista);                  // arranca partida y muestra juego
  DETALLE_SELECCION.open = false;                                       // cierra panel selección
  DETALLE_SELECCION.classList.add('hidden');                            // lo oculta
};

const seguirJugando = (estadoJuego, lista) => {                         // mismo personaje otra vez (función independiente)
  const indice = obtenerIndicePorNombre(lista, estadoJuego.activo.nombre); // busca su posición en el array
  iniciarPartidaConIndice(indice, estadoJuego, lista);                  // reinicia con ese índice
};

const main = (estadoJuego, lista) => {                                  // único sitio que engancha listeners al DOM
  const alPulsarAlimentar = () => {                                     // click Alimentar
    ejecutarAccion('alimentar', 'alimentar', estadoJuego);
  };

  const alPulsarJugar = () => {                                         // click Jugar
    ejecutarAccion('jugar', 'jugar', estadoJuego);
  };

  const alPulsarDuchar = () => {                                        // click Duchar
    ejecutarAccion('duchar', 'duchar', estadoJuego);
  };

  const alPulsarAcariciar = () => {                                     // click Acariciar
    ejecutarAccion('acariciar', 'acariciar', estadoJuego);
  };

  const alPulsarDormir = () => {                                        // click Dormir
    ejecutarAccion('dormir', 'dormir', estadoJuego);
  };

  const alPulsarReprender = () => {                                     // click Reprender
    ejecutarAccion('reprender', 'reprender', estadoJuego);
  };

  estadoJuego.manejadores = {                                           // mapa método → función click
    alimentar: alPulsarAlimentar,
    jugar: alPulsarJugar,
    duchar: alPulsarDuchar,
    acariciar: alPulsarAcariciar,
    dormir: alPulsarDormir,
    reprender: alPulsarReprender,
  };

  const alCambiarPersonaje = () => {                                    // cambian el desplegable
    const indice = SELECCIONAR.selectedIndex;                           // opción actual
    seleccionarPersonaje(SELECCIONAR, indice);                          // sincroniza selección
  };

  const alPulsarCerrarGameOver = () => {                                // pulsan OK en game over
    cerrarGameOver();
  };

  const alPulsarSeguirJugando = () => {                                 // mismo personaje otra vez
    seguirJugando(estadoJuego, lista);
  };

  const alPulsarOtroJugador = () => {                                   // cambiar de personaje
    volverASeleccion(estadoJuego);
  };

  llenarSelect(SELECCIONAR, lista);                                     // mete nombres en el select
  seleccionarPersonaje(SELECCIONAR, 0);                                 // el primero por defecto

  SELECCIONAR.addEventListener('change', alCambiarPersonaje);           // al cambiar opción
  CERRAR_GAME_OVER.addEventListener('click', alPulsarCerrarGameOver);
  SEGUIR_JUGANDO.addEventListener('click', alPulsarSeguirJugando);
  OTRO_JUGADOR.addEventListener('click', alPulsarOtroJugador);
};

const alPulsarContinuar = () => {                                       // pulsan Continuar (función independiente)
  iniciarPartida(estado, tamagotchis);
};

// 4. EJECUCIÓN DE CÓDIGO

main(estado, tamagotchis);
CONTINUAR.addEventListener('click', alPulsarContinuar);
