# Tarjetero NFC — Campus Ciudad de México

Página de accesos rápidos que abre al escanear un llavero NFC.

---

## Cómo probarlo en local

Doble clic en `index.html`. Se abre en el navegador y funciona completo, sin
instalar nada y sin servidor.

Si prefieres servirlo (recomendado si vas a probar desde el celular en la
misma red), desde esta carpeta:

```
python3 -m http.server 8000
```

Y abre `http://localhost:8000`. Para verlo desde el celular, sustituye
`localhost` por la IP de tu computadora en la red local.

---

## Estructura de archivos

```
tarjetero-nfc/
├── index.html              Estructura de la página. Se toca poco.
├── favicon.svg             Ícono de la pestaña. Reemplázalo por el logo.
├── LEEME.md                Este archivo.
│
├── css/
│   └── estilos.css         Todo el diseño. Los colores están arriba del todo.
│
├── js/
│   ├── datos.js            ← LO ÚNICO QUE EDITAS NORMALMENTE
│   └── app.js              Motor que dibuja la página. No requiere cambios.
│
└── img/
    ├── banner/             Imágenes del banner de eventos
    │   └── evento-destacado.jpg
    └── tarjetas/           Imágenes de las tarjetas
        ├── programacion.jpg
        ├── calificaciones.jpg
        └── directorio.jpg
```

La separación entre `datos.js` y `app.js` es a propósito: puedes agregar,
quitar y reordenar ligas sin abrir nunca el código que dibuja la página.

---

## Agregar o cambiar una liga

Abre `js/datos.js`, busca el arreglo `LIGAS` y copia el bloque de plantilla
que está comentado al final. Cada tarjeta se ve así:

```js
{
  titulo: "Calendario escolar 2026",
  descripcion: "Fechas oficiales de inicio, exámenes y cierre de periodo.",
  url: "https://...",
  categoria: "Escolares",
  publico: "Dirección de Campus",      // opcional
  imagen: "img/tarjetas/calendario.jpg" // opcional
}
```

Reglas que evitan el 90 % de los errores:

- Las tarjetas se separan entre sí con **coma**.
- La categoría debe escribirse **siempre igual**, con los mismos acentos.
  `"Biblioteca"` y `"biblioteca"` generan dos filtros distintos.
- La descripción, máximo unos 90 caracteres.
- Si la página se queda en blanco, es casi siempre una coma o una comilla.
  Abre la consola del navegador con **F12** y el error dice la línea exacta.

Las categorías del filtro no se dan de alta en ningún lado: se deducen solas
de las ligas, en el orden en que aparecen.

---

## Imágenes

| Uso | Medida recomendada | Proporción | Peso máximo |
|---|---|---|---|
| Banner de evento | 1600 × 600 px | 8:3, apaisada | 300 KB |
| Tarjeta | 800 × 450 px | 16:9 | 150 KB |

La página **recorta** para llenar el espacio, no deforma. En celular el banner
se recorta más alto que en computadora, así que deja el motivo principal al
centro y evita texto importante en los bordes.

Formatos: `.jpg` para fotos, `.png` para gráficos con fondo transparente,
`.webp` si quieres menor peso y no te preocupan navegadores antiguos.

Comprime antes de subir. Un llavero se escanea de pie y con datos móviles:
cada 100 KB de más se notan.

Si una imagen falla o la ruta está mal escrita, la tarjeta no se rompe:
muestra el monograma azul con las iniciales del título. El banner cae al
fondo azul con trama.

---

## Cambiar el banner de temporada

En `js/datos.js`, bloque `BANNER`. Sustituye la ruta de `imagen` y los textos.

Para dejar la página sin banner durante una temporada sin eventos, reemplaza
todo el bloque por:

```js
const BANNER = null;
```

---

## Cambiar colores

En `css/estilos.css`, sección 1. El azul institucional está en `--accent`.
Aparece dos veces: la primera para modo claro, la segunda para modo oscuro
(ahí se usa una versión aclarada porque el `#004D9D` puro no se lee sobre
fondo negro).

---

## Publicar

Sube la carpeta completa al hospedaje, respetando la estructura. La página es
estática: no necesita base de datos, backend ni compilación.

Las rutas son relativas, así que funciona igual en la raíz del dominio o en
un subdirectorio.

Antes de grabar los llaveros NFC, revisa:

- [ ] Todas las ligas abren desde un celular, con datos móviles y sin wifi
      institucional.
- [ ] Las ligas de SharePoint tienen el alcance correcto en "Copiar vínculo".
- [ ] Los recursos fuera del inquilino (Looker Studio, Drive) no están
      expuestos a "cualquiera con el vínculo" si contienen datos internos.
- [ ] La URL que se graba en el tag es corta, propia y redirige a esta página,
      para poder mover el sitio después sin reimprimir los llaveros.
