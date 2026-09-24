/* ==============================================================
   TARJETERO NFC — MOTOR DE LA PÁGINA
   --------------------------------------------------------------
   Este archivo lee CONFIG, BANNER y LIGAS (definidos en datos.js)
   y dibuja la página. En el uso normal NO necesitas tocarlo.

   Ábrelo solo si quieres cambiar comportamiento, por ejemplo:
     - Que las ligas abran en la misma pestaña en vez de una nueva
       → busca ABRIR_EN_PESTANA_NUEVA, abajo.
     - Que el filtro arranque en otra categoría
       → busca categoriaActiva.
   ============================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     OPCIONES RÁPIDAS
     ------------------------------------------------------------ */

  // true  = las ligas abren en una pestaña nueva (recomendado:
  //         el usuario no pierde el tarjetero al abrir un archivo)
  // false = abren en la misma pestaña
  const ABRIR_EN_PESTANA_NUEVA = true;

  // Texto del primer botón de filtro
  const ETIQUETA_TODO = "Todo";


  /* ------------------------------------------------------------
     ÍCONOS (SVG en línea, no requieren archivos externos)
     ------------------------------------------------------------ */

  const ICONO_PUBLICO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="9" cy="8" r="3.4"></circle>' +
    '<path d="M3 20c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6"></path>' +
    '<path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.1"></path>' +
    '<path d="M18 14.9c2 .8 3.4 2.6 3.4 5.1"></path></svg>';

  const ICONO_ABRIR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M6 18L18 6"></path><path d="M9 6h9v9"></path></svg>';


  /* ------------------------------------------------------------
     REFERENCIAS A LOS HUECOS DEL index.html
     ------------------------------------------------------------ */

  const elTitulo   = document.getElementById("page-title");
  const elLede     = document.getElementById("page-lede");
  const elBanner   = document.getElementById("banner-slot");
  const elFiltros  = document.getElementById("filters");
  const elGrid     = document.getElementById("grid");
  const elConteo   = document.getElementById("foot-count");
  const elFecha    = document.getElementById("foot-date");

  // Categoría seleccionada al abrir la página
  let categoriaActiva = ETIQUETA_TODO;


  /* ------------------------------------------------------------
     ENCABEZADO Y PIE
     ------------------------------------------------------------ */

  function pintarEncabezado() {
    elTitulo.textContent = CONFIG.titulo || "";
    elLede.textContent = CONFIG.descripcion || "";
    elFecha.textContent = CONFIG.actualizado
      ? "Actualizado: " + CONFIG.actualizado
      : "";
  }


  /* ------------------------------------------------------------
     BANNER DEL EVENTO
     ------------------------------------------------------------ */

  function pintarBanner() {
    // BANNER = null  →  no se dibuja nada
    if (typeof BANNER === "undefined" || !BANNER) return;

    // Si tiene url, el banner es un enlace; si no, un bloque simple
    const cont = document.createElement(BANNER.url ? "a" : "div");
    cont.className = "banner";

    if (BANNER.url) {
      cont.href = BANNER.url;
      if (ABRIR_EN_PESTANA_NUEVA) {
        cont.target = "_blank";
        cont.rel = "noopener";
      }
    }

    // Fondo azul de respaldo, siempre presente por debajo
    const fondo = document.createElement("div");
    fondo.className = "banner-fallback";
    cont.appendChild(fondo);

    // Imagen encima del fondo. Si la ruta está mal o el archivo
    // no existe, la imagen se retira y queda el fondo azul.
    if (BANNER.imagen) {
      const img = document.createElement("img");
      img.src = BANNER.imagen;
      img.alt = BANNER.titulo || "";
      img.addEventListener("error", function () { img.remove(); });
      cont.appendChild(img);
    }

    // Textos sobre el velo oscuro
    if (BANNER.etiqueta || BANNER.titulo || BANNER.texto) {
      const velo = document.createElement("div");
      velo.className = "banner-scrim";

      if (BANNER.etiqueta) {
        const t = document.createElement("span");
        t.className = "banner-tag";
        t.textContent = BANNER.etiqueta;
        velo.appendChild(t);
      }
      if (BANNER.titulo) {
        const h = document.createElement("h2");
        h.className = "banner-titulo";
        h.textContent = BANNER.titulo;
        velo.appendChild(h);
      }
      if (BANNER.texto) {
        const p = document.createElement("p");
        p.className = "banner-texto";
        p.textContent = BANNER.texto;
        velo.appendChild(p);
      }
      cont.appendChild(velo);
    }

    elBanner.appendChild(cont);
  }


  /* ------------------------------------------------------------
     TARJETAS
     ------------------------------------------------------------ */

  // Saca las iniciales del título para el monograma: dos letras
  function iniciales(texto) {
    return String(texto || "")
      .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (palabra) { return palabra[0].toUpperCase(); })
      .join("");
  }

  function crearMonograma(item) {
    const marca = document.createElement("div");
    marca.className = "mono-mark";
    const span = document.createElement("span");
    span.textContent = iniciales(item.titulo);
    marca.appendChild(span);
    return marca;
  }

  function crearTarjeta(item) {
    const enlace = document.createElement("a");
    enlace.className = "card";
    enlace.href = item.url || "#";
    if (ABRIR_EN_PESTANA_NUEVA) {
      enlace.target = "_blank";
      enlace.rel = "noopener";
    }

    /* --- Miniatura --- */
    const thumb = document.createElement("div");
    thumb.className = "thumb";

    if (item.imagen) {
      const img = document.createElement("img");
      img.src = item.imagen;
      img.alt = "";
      img.loading = "lazy";   // no descarga imágenes fuera de pantalla
      // Si la imagen falla, se sustituye por el monograma
      img.addEventListener("error", function () {
        img.remove();
        thumb.insertBefore(crearMonograma(item), thumb.firstChild);
      });
      thumb.appendChild(img);
    } else {
      thumb.appendChild(crearMonograma(item));
    }

    // Etiqueta de público objetivo
    if (item.publico) {
      const tag = document.createElement("div");
      tag.className = "publico";
      tag.innerHTML = ICONO_PUBLICO + "<span></span>";
      tag.querySelector("span").textContent = item.publico;
      thumb.appendChild(tag);
    }

    /* --- Texto --- */
    const cuerpo = document.createElement("div");
    cuerpo.className = "body";

    const titulo = document.createElement("h2");
    titulo.textContent = item.titulo || "";

    const desc = document.createElement("p");
    desc.textContent = item.descripcion || "";

    const meta = document.createElement("div");
    meta.className = "meta";

    const cat = document.createElement("span");
    cat.textContent = item.categoria || "";

    const abrir = document.createElement("span");
    abrir.className = "go";
    abrir.innerHTML = "Abrir" + ICONO_ABRIR;

    meta.appendChild(cat);
    meta.appendChild(abrir);

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(desc);
    cuerpo.appendChild(meta);

    enlace.appendChild(thumb);
    enlace.appendChild(cuerpo);
    return enlace;
  }


  /* ------------------------------------------------------------
     CUADRÍCULA Y FILTROS
     ------------------------------------------------------------ */

  function ligasVisibles() {
    if (categoriaActiva === ETIQUETA_TODO) return LIGAS;
    return LIGAS.filter(function (l) { return l.categoria === categoriaActiva; });
  }

  function pintarGrid() {
    const lista = ligasVisibles();
    elGrid.replaceChildren.apply(elGrid, lista.map(crearTarjeta));
    elConteo.textContent =
      lista.length + (lista.length === 1 ? " acceso visible" : " accesos visibles");
  }

  function pintarFiltros() {
    // Las categorías se deducen solas de LIGAS, en el orden en que
    // aparecen. No hay que darlas de alta en ningún lado.
    const categorias = [ETIQUETA_TODO];
    LIGAS.forEach(function (l) {
      if (l.categoria && categorias.indexOf(l.categoria) === -1) {
        categorias.push(l.categoria);
      }
    });

    const botones = categorias.map(function (c) {
      const b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.setAttribute("aria-pressed", String(c === categoriaActiva));
      b.textContent = c;

      const n = document.createElement("span");
      n.className = "n";
      n.textContent = (c === ETIQUETA_TODO)
        ? LIGAS.length
        : LIGAS.filter(function (l) { return l.categoria === c; }).length;
      b.appendChild(n);

      b.addEventListener("click", function () {
        categoriaActiva = c;
        pintarFiltros();
        pintarGrid();
      });

      return b;
    });

    elFiltros.replaceChildren.apply(elFiltros, botones);
  }


  /* ------------------------------------------------------------
     ARRANQUE
     ------------------------------------------------------------ */

  pintarEncabezado();
  pintarBanner();
  pintarFiltros();
  pintarGrid();

})();
