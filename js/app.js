/* ==============================================================
   TARJETERO NFC — MOTOR DE LA PÁGINA
   --------------------------------------------------------------
   Este archivo lee CONFIG, BANNER y LIGAS (definidos en datos.js)
   y dibuja la página. En el uso normal NO necesitas tocarlo.

   Ábrelo solo si quieres cambiar comportamiento, por ejemplo:
     - Que las ligas abran en la misma pestaña en vez de una nueva
       → busca ABRIR_EN_PESTANA_NUEVA, abajo.
     - Que el buscador aparezca con más o menos tarjetas
       → busca MINIMO_PARA_BUSCADOR.
     - El texto de ayuda dentro del buscador
       → busca TEXTO_BUSCADOR.
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

  // El buscador solo aparece a partir de este número de tarjetas.
  // Con pocas ligas estorba más de lo que ayuda.
  const MINIMO_PARA_BUSCADOR = 6;

  // Texto gris que se ve dentro del campo vacío
  const TEXTO_BUSCADOR = "Buscar por nombre, categoría o dirección…";


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

  const ICONO_LUPA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" ' +
    'stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="10.5" cy="10.5" r="6.5"></circle>' +
    '<path d="M15.4 15.4L21 21"></path></svg>';

  const ICONO_LIMPIAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" aria-hidden="true">' +
    '<path d="M6 6l12 12"></path><path d="M18 6L6 18"></path></svg>';


  /* ------------------------------------------------------------
     REFERENCIAS A LOS HUECOS DEL index.html
     ------------------------------------------------------------ */

  const elTitulo  = document.getElementById("page-title");
  const elLede    = document.getElementById("page-lede");
  const elBanner  = document.getElementById("banner-slot");
  const elFiltros = document.getElementById("filters");
  const elGrid    = document.getElementById("grid");
  const elConteo  = document.getElementById("foot-count");
  const elFecha   = document.getElementById("foot-date");

  // Estado actual de la página
  let categoriaActiva = ETIQUETA_TODO;
  let textoBusqueda = "";
  let campoBusqueda = null;
  let botonLimpiar = null;


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
     BUSCADOR
     ------------------------------------------------------------ */

  // Quita acentos y pasa a minúsculas, para que "programacion"
  // encuentre "Programación" y "DIRECCION" encuentre "Dirección".
  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  // Texto de una tarjeta contra el que se busca: título,
  // descripción, categoría y público objetivo.
  function textoBuscable(item) {
    return normalizar([
      item.titulo,
      item.descripcion,
      item.categoria,
      item.publico
    ].join(" "));
  }

  // Todas las palabras escritas deben aparecer, en cualquier orden.
  // Así "biblioteca salas" encuentra la tarjeta de reserva de salas.
  function coincide(item, palabras) {
    if (!palabras.length) return true;
    const heno = textoBuscable(item);
    return palabras.every(function (p) { return heno.indexOf(p) !== -1; });
  }

  function palabrasBuscadas() {
    return normalizar(textoBusqueda).split(/\s+/).filter(Boolean);
  }

  function construirBuscador() {
    // Con pocas tarjetas no se dibuja
    if (LIGAS.length < MINIMO_PARA_BUSCADOR) return;

    const cont = document.createElement("div");
    cont.className = "search";

    const lupa = document.createElement("span");
    lupa.className = "search-icon";
    lupa.innerHTML = ICONO_LUPA;

    campoBusqueda = document.createElement("input");
    campoBusqueda.type = "search";
    campoBusqueda.id = "buscador";
    campoBusqueda.placeholder = TEXTO_BUSCADOR;
    campoBusqueda.setAttribute("aria-label", "Buscar entre los accesos");
    campoBusqueda.setAttribute("autocomplete", "off");
    campoBusqueda.setAttribute("autocorrect", "off");
    campoBusqueda.setAttribute("autocapitalize", "off");
    campoBusqueda.setAttribute("spellcheck", "false");
    campoBusqueda.setAttribute("enterkeyhint", "search");
    // Sin autofocus a propósito: en celular abriría el teclado
    // encima de las tarjetas apenas se escanea el llavero.

    botonLimpiar = document.createElement("button");
    botonLimpiar.type = "button";
    botonLimpiar.className = "search-clear";
    botonLimpiar.setAttribute("aria-label", "Limpiar búsqueda");
    botonLimpiar.innerHTML = ICONO_LIMPIAR;
    botonLimpiar.hidden = true;

    campoBusqueda.addEventListener("input", function () {
      textoBusqueda = campoBusqueda.value;
      botonLimpiar.hidden = textoBusqueda.length === 0;
      pintarFiltros();
      pintarGrid();
    });

    // Enter cierra el teclado en celular en vez de recargar
    campoBusqueda.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        campoBusqueda.blur();
      }
      if (e.key === "Escape") limpiarBusqueda();
    });

    botonLimpiar.addEventListener("click", function () {
      limpiarBusqueda();
      campoBusqueda.focus();
    });

    cont.appendChild(lupa);
    cont.appendChild(campoBusqueda);
    cont.appendChild(botonLimpiar);

    elFiltros.parentNode.insertBefore(cont, elFiltros);
  }

  function limpiarBusqueda() {
    textoBusqueda = "";
    if (campoBusqueda) campoBusqueda.value = "";
    if (botonLimpiar) botonLimpiar.hidden = true;
    pintarFiltros();
    pintarGrid();
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
     FILTRADO
     ------------------------------------------------------------
     Son dos filtros que se aplican uno tras otro:
     primero la búsqueda, después la categoría.
     ------------------------------------------------------------ */

  function porBusqueda() {
    const palabras = palabrasBuscadas();
    return LIGAS.filter(function (l) { return coincide(l, palabras); });
  }

  function visibles() {
    const base = porBusqueda();
    if (categoriaActiva === ETIQUETA_TODO) return base;
    return base.filter(function (l) { return l.categoria === categoriaActiva; });
  }


  /* ------------------------------------------------------------
     CUADRÍCULA
     ------------------------------------------------------------ */

  function crearEstadoVacio(totalEnOtrasCategorias) {
    const caja = document.createElement("div");
    caja.className = "vacio";

    const p = document.createElement("p");
    if (categoriaActiva !== ETIQUETA_TODO && totalEnOtrasCategorias > 0) {
      p.append("No hay resultados para ");
      const fuerte = document.createElement("strong");
      fuerte.textContent = "“" + textoBusqueda.trim() + "”";
      p.append(fuerte, " dentro de " + categoriaActiva + ".");
    } else if (textoBusqueda.trim()) {
      p.append("No se encontró nada para ");
      const fuerte = document.createElement("strong");
      fuerte.textContent = "“" + textoBusqueda.trim() + "”";
      p.append(fuerte, ". Revisa la escritura o busca con una palabra más corta.");
    } else {
      p.textContent = "No hay accesos en esta categoría.";
    }
    caja.appendChild(p);

    if (categoriaActiva !== ETIQUETA_TODO && totalEnOtrasCategorias > 0) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = "Buscar en todas las categorías (" + totalEnOtrasCategorias + ")";
      boton.addEventListener("click", function () {
        categoriaActiva = ETIQUETA_TODO;
        pintarFiltros();
        pintarGrid();
      });
      caja.appendChild(boton);
    }

    return caja;
  }

  function pintarGrid() {
    const lista = visibles();

    if (lista.length === 0) {
      elGrid.replaceChildren(crearEstadoVacio(porBusqueda().length));
      elConteo.textContent = "Sin resultados";
      return;
    }

    elGrid.replaceChildren.apply(elGrid, lista.map(crearTarjeta));
    elConteo.textContent =
      lista.length + (lista.length === 1 ? " acceso visible" : " accesos visibles");
  }


  /* ------------------------------------------------------------
     FILTROS DE CATEGORÍA
     ------------------------------------------------------------ */

  function pintarFiltros() {
    // Las categorías se deducen solas de LIGAS, en el orden en que
    // aparecen. No hay que darlas de alta en ningún lado.
    const categorias = [ETIQUETA_TODO];
    LIGAS.forEach(function (l) {
      if (l.categoria && categorias.indexOf(l.categoria) === -1) {
        categorias.push(l.categoria);
      }
    });

    // Los números de cada botón cuentan solo lo que coincide con la
    // búsqueda activa, para que el filtro no prometa lo que no hay.
    const encontradas = porBusqueda();

    const botones = categorias.map(function (c) {
      const cuantas = (c === ETIQUETA_TODO)
        ? encontradas.length
        : encontradas.filter(function (l) { return l.categoria === c; }).length;

      const b = document.createElement("button");
      b.className = "chip" + (cuantas === 0 ? " vacia" : "");
      b.type = "button";
      b.setAttribute("aria-pressed", String(c === categoriaActiva));
      b.textContent = c;

      const n = document.createElement("span");
      n.className = "n";
      n.textContent = cuantas;
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
  construirBuscador();
  pintarFiltros();
  pintarGrid();

})();
