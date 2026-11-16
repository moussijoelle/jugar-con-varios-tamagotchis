# Digipets — jugar con varios tamagotchis

Juego tipo Tamagotchi (examen): eliges una mascota, cuidas sus stats y ves animaciones según la acción.

## Qué hace

- Pantalla de inicio para elegir entre 3 personajes (Tayo-Tayo, Roki y Minomi)
- Pantalla de juego con acciones: alimentar, jugar, dormir, duchar, acariciar, reprender…
- Cada mascota tiene felicidad, salud, limpieza y energía (de 0 a 10)
- Si las stats caen demasiado, la mascota puede “morir”
- Hay vídeos/animación por acción y personaje
- También incluye una guía (`guia.html`)

## Cómo probarlo

No necesita build. Abre los HTML en el navegador o súbelos a GitHub Pages.

- Inicio: `index.html`
- Juego: `juego.html`
- Guía: `guia.html`

Demo: https://moussijoelle.github.io/jugar-con-varios-tamagotchis/

## Cómo lo construí

- HTML + JavaScript + Tailwind (CDN / browser)
- Lógica orientada a objetos en `js/clase-tamagotchi.js` (clase `Tamagotchi` con stats privadas)
- Datos de personajes en `js/datos-tamagotchi.js`
- Flujo de la app en `js/app.js`
- Imágenes y vídeos en `assets/`

## Cómo verificarlo

Sin tests automáticos. Abro la demo, elijo cada personaje, pruebo varias acciones y miro que las barras/stats y los vídeos respondan. También reviso qué pasa si dejo las stats bajas.

---

Moussi Joelle  
https://github.com/moussijoelle/jugar-con-varios-tamagotchis
