class Tamagotchi {                                                      // la clase de la mascota
  nombre;                                                               // nombre visible en pantalla
  descripcion;                                                          // texto descriptivo del personaje
  imagen;                                                               // ruta de la foto
  #felicidad = 0;                                                       // stat privada, de 0 a 10
  #salud = 0;                                                           // stat privada, de 0 a 10
  #limpieza = 0;                                                        // stat privada, de 0 a 10
  #energia = 0;                                                         // stat privada, de 0 a 10
  #enVida = true;                                                       // false cuando muere

  constructor(nombre, descripcion, imagen) {                            // crea un tamagotchi nuevo
    this.nombre = nombre;                                               // guarda el nombre
    this.descripcion = descripcion;                                     // guarda la descripción
    this.imagen = imagen;                                               // guarda la imagen
    this.#felicidad = Math.ceil(Math.random() * 10);                    // valor inicial al azar 1-10
    this.#salud = Math.ceil(Math.random() * 10);                        // idem
    this.#limpieza = Math.ceil(Math.random() * 10);                     // idem
    this.#energia = Math.ceil(Math.random() * 10);                      // idem
  }

  // Limita cualquier stat al rango 0-10
  cambiaValor(valorActual, incremento) {
    const resultado = Math.max(0, Math.min(10, valorActual + incremento));
    return resultado;
  }

  getSalud() {
    return this.#salud;
  }

  getFelicidad() {
    return this.#felicidad;
  }

  getLimpieza() {
    return this.#limpieza;
  }

  getEnergia() {
    return this.#energia;
  }

  getEnVida() {
    return this.#enVida;
  }

  alimentar() {
    this.#energia = this.cambiaValor(this.#energia, 3);
    this.#felicidad = this.cambiaValor(this.#felicidad, 2);
    this.#limpieza = this.cambiaValor(this.#limpieza, -1);
    this.comprobarVida();
  }

  jugar() {
    this.#felicidad = this.cambiaValor(this.#felicidad, 2);
    this.#energia = this.cambiaValor(this.#energia, -2);
    this.#limpieza = this.cambiaValor(this.#limpieza, -2);
    this.comprobarVida();
  }

  dormir() {
    this.#energia = this.cambiaValor(this.#energia, 5);
    this.#salud = this.cambiaValor(this.#salud, 2);
    this.comprobarVida();
  }

  duchar() {
    this.#salud = this.cambiaValor(this.#salud, 3);
    this.#limpieza = this.cambiaValor(this.#limpieza, 10);
    this.comprobarVida();
  }

  reprender() {
    this.#felicidad = this.cambiaValor(this.#felicidad, -3);
    this.#salud = this.cambiaValor(this.#salud, -2);
    this.comprobarVida();
  }

  acariciar() {
    this.#felicidad = this.cambiaValor(this.#felicidad, 4);
    this.comprobarVida();
  }

  // Muere cuando salud y energía llegan a 0 a la vez
  comprobarVida() {
    if (this.#salud === 0 && this.#energia === 0) {
      this.#enVida = false;
    }
  }

  // Baja todos los stats en 1 (timer cada 5 s)
  restarVida() {
    this.#salud = this.cambiaValor(this.#salud, -1);
    this.#felicidad = this.cambiaValor(this.#felicidad, -1);
    this.#limpieza = this.cambiaValor(this.#limpieza, -1);
    this.#energia = this.cambiaValor(this.#energia, -1);
    this.comprobarVida();
  }
}
