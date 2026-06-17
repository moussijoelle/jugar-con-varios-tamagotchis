// Datos de los personajes (nombre, descripción, imagen + vídeos extra)
const personajes = [
  {
    nombre: 'Tayo-Tayo',
    descripcion:
      'Siempre alegre y lleno de sorpresas. Es un auténtico torbellino de energía positiva, ideal si buscas un compañero activo que siempre esté de buen humor.',
    imagen: 'assets/img/tayo-tayo.jpeg',
    videos: {
      saludo: 'assets/videos/tayo-saludo.webm',
      alimentar: 'assets/videos/tayo-comiendo.webm',
      jugar: 'assets/videos/tayo-jugar.webm',
      dormir: 'assets/videos/tayo-dormir.webm',
      duchar: 'assets/videos/tayo-duchar.webm',
      reprender: 'assets/videos/tayo-reprender.webm',
      acariciar: 'assets/videos/tayo-acariciar.webm',
      morir: 'assets/videos/tayo-terminado.webm',
    },
  },
  {
    nombre: 'Roki',
    descripcion:
      'El pequeño aventurero, un poco travieso. Es un explorador nato y muy curioso al que le fascina investigar todo a su alrededor y jugar sin parar.',
    imagen: 'assets/img/roki.jpg',
    videos: {
      saludo: 'assets/videos/roki-saluando.webm',
      alimentar: 'assets/videos/roki-comer.webm',
      jugar: 'assets/videos/roki-jugar.webm',
      dormir: 'assets/videos/roki-dormir.webm',
      duchar: 'assets/videos/roki-duchar.webm',
      reprender: 'assets/videos/roki-repender.webm',
      acariciar: 'assets/videos/roki-acarisiar.webm',
      morir: 'assets/videos/roki-terminado.webm',
    },
  },
  {
    nombre: 'Minomi',
    descripcion:
      'El más dulce y atento del grupo. Es la ternura personificada; un compañero muy tranquilo, sensible y cariñoso que adora recibir afecto.',
    imagen: 'assets/img/minomi.jpg',
    videos: {
      saludo: 'assets/videos/minomi-saludo.webm',
      alimentar: 'assets/videos/minomi-comer.webm',
      jugar: 'assets/videos/minomi-jugar.webm',
      dormir: 'assets/videos/minomi-dormir.webm',
      duchar: 'assets/videos/minomi-duchar.webm',
      reprender: 'assets/videos/minomi-reprender.webm',
      acariciar: 'assets/videos/minomi-acarisiar.webm',
      morir: 'assets/videos/minomi-terminado.webm',
    },
  },
];

// Array que usa el juego: si añades uno en personajes, el select lo recoge solo
const tamagotchis = personajes.map((personaje) => {                     // recorro personajes y creo un Tamagotchi por cada uno
  const tamagotchi = new Tamagotchi(                                    // instancia nueva (stats al azar en el constructor)
    personaje.nombre,                                                   // paso el nombre del objeto datos
    personaje.descripcion,                                              // paso la descripción
    personaje.imagen                                                    // paso la ruta de la imagen
  );

  tamagotchi.videos = personaje.videos;                                 // copio vídeos aquí, fuera de la clase
  return tamagotchi;                                                    // devuelvo el objeto al array tamagotchis
});
