/* ==============================================================
   TARJETERO NFC — DATOS
   --------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR EN EL DÍA A DÍA.

   Tiene tres bloques:
     1. CONFIG  → textos del encabezado
     2. BANNER  → la imagen grande del evento en turno
     3. LIGAS   → las tarjetas

   Reglas para no romper nada:
     - Cada valor va entre comillas dobles: "así"
     - Cada línea dentro de un bloque termina en coma, menos la última
     - Cada tarjeta va entre llaves { } y se separa de la siguiente
       con una coma
     - Si algo deja de verse, casi siempre es una coma o una comilla
       faltante. Abre la consola del navegador (F12) y el error dirá
       en qué línea está.
   ============================================================== */


/* ==============================================================
   1. CONFIG — textos del encabezado
   ============================================================== */

const CONFIG = {

  // Título grande en azul
  titulo: "Campus Ciudad de México",

  // Línea de instrucción debajo del título
  descripcion: "Toca una tarjeta para poder visualizar el contenido seleccionado.",

  // Se muestra en el pie. Actualízala cuando cambies las ligas.
  actualizado: "25 de septiembre de 2026"

};


/* ==============================================================
   2. BANNER — imagen del evento más importante del momento
   --------------------------------------------------------------
   imagen   : ruta al archivo dentro de img/banner/
              Déjala vacía ("") para usar el fondo azul con trama.
   etiqueta : texto chico de la pastilla. Opcional.
   titulo   : título grande sobre la imagen. Opcional.
   texto    : una o dos frases de apoyo. Opcional.
   url      : si la pones, todo el banner se vuelve clicable.
              Déjala vacía si el banner es solo visual.

   Para quitar el banner por completo durante una temporada sin
   eventos, cambia todo el bloque por:   const BANNER = null;
   ============================================================== */

const BANNER = {

  imagen: "img/banner/evento-destacado.jpg",

  etiqueta: "Evento destacado",
  titulo: "Semana de Innovación 2026",
  texto: "Del 5 al 9 de octubre en el Centro de Congresos. Registro abierto para toda la comunidad.",

  url: ""

};


/* ==============================================================
   3. LIGAS — las tarjetas de la cuadrícula
   --------------------------------------------------------------
   Campos de cada tarjeta:

     titulo       OBLIGATORIO  Texto grande de la tarjeta.
     descripcion  OBLIGATORIO  Una frase corta, máximo ~90
                               caracteres para que no crezca la
                               tarjeta de más.
     url          OBLIGATORIO  A dónde lleva el clic.
     categoria    OBLIGATORIO  Genera los botones de filtro de
                               arriba. ESCRÍBELA SIEMPRE IGUAL,
                               con los mismos acentos: "Biblioteca"
                               y "biblioteca" crean dos filtros
                               distintos.
     publico      opcional     Etiqueta azul sobre la imagen
                               ("Dirección de Escuela", etc.).
                               Si la omites, no aparece etiqueta.
     imagen       opcional     Ruta dentro de img/tarjetas/.
                               Si la omites, se dibuja un monograma
                               azul con las iniciales del título.

   El orden de este arreglo es el orden en que aparecen las
   tarjetas. Para mover una tarjeta de lugar, córtala y pégala
   donde quieras.
   ============================================================== */

const LIGAS = [

  /* ------------------------------------------------------------
     LIGAS REALES
     ------------------------------------------------------------ */

  {
    titulo: "Dirección de Servicios Académicos",
    descripcion: "Sito oficial de la DSA para CCM.",
    url: "https://tecmx.sharepoint.com/sites/EI2/SitePages/serviciosacademicos.aspx",
    categoria: "Servicios Académicos",
    publico: "Campus Ciudad de México",
    imagen: "img/tarjetas/sitio_DSA.jpeg"
  },

  {
    titulo: "Dirección de Servicios Escolares",
    descripcion: "Sito oficial de la DSE para CCM.",
    url: "https://tecmx.sharepoint.com/sites/CCM-ServiciosEscolares/SitePages/CollabHome.aspx?ovuser=c65a3ea6-0f7c-400b-8934-5a6dc1705645%2cvaleria.hernandezc%40tec.mx&OR=Teams-HL&CT=1727461507380&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNDA5MDEwMTQxNyIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3d%3d&CID=7d6e54a1-a0ee-6000-76e8-28800322fd5e&cidOR=SPO",
    categoria: "Servicios Escolares",
    publico: "Campus Ciudad de México",
    imagen: "img/tarjetas/sitio_escolares.jpeg"
  },

  {
    titulo: "202613 - ADN de Profesional",
    descripcion: "Seguimiento de alumnos activos en CCM.",
    url: "https://tec.rs/202613_ADN_CCM",
    categoria: "Analítica de Datos",
    publico: "Campus Ciudad de México",
    imagen: "img/tarjetas/ADN_Profesional.jpg"
  },
   
  {
    titulo: "202613 - Última programación",
    descripcion: "Archivo de programación de grupos del semestre actual.",
    url: "https://tecmx.sharepoint.com/:x:/s/CCM-ServiciosEscolares/IQCH6cOzfOBAT78Z3R5Z8Vp5AdQYXm-R7goQ6epirDZlr-Y?e=b9Lpeo",
    categoria: "Centro de Programación",
    publico: "Dirección de Departamento",
    imagen: "img/tarjetas/programacion.jpg"
  },

  {
    titulo: "Reportes de Calificaciones: Profesional",
    descripcion: "Reportes de calificaciones de nivel profesional de CCM",
    url: "https://tecmx-my.sharepoint.com/shared?listurl=https%3A%2F%2Ftecmx%2Dmy%2Esharepoint%2Ecom%2Fpersonal%2Fserviciosescolares%5Fservicios%5Ftec%5Fmx%2FDocuments&id=%2Fpersonal%2Fserviciosescolares%5Fservicios%5Ftec%5Fmx%2FDocuments%2FSitio%20DSA%2FAdministraci%C3%B3n%20Acad%C3%A9mica%2FReportes%20de%20Seguimiento%2FCALIFICACIONES%2F202613&viewid=b9d18317%2D3743%2D4f31%2D92da%2D08d07caa32af&shareLink=1&ga=1",
    categoria: "Administración Académica",
    publico: "Dirección de Escuela"
  },

  {
    titulo: "Reportes de Calificaciones: Preparatoria",
    descripcion: "Reportes de calificaciones de nivel preparatoria de CCM",
    url: "https://tecmx.sharepoint.com/sites/CCM-ServiciosEscolares/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fsites%2FCCM%2DServiciosEscolares%2FDocumentos%20compartidos%2FGeneral%2FPREPARATORIA%2FCalificaciones%20parciales%20y%20finales%2F202613&viewid=99e82701%2Db169%2D4373%2Dae15%2De013f45eeb9f&p=true&ga=1",
    categoria: "Administración Académica",
    publico: "Dirección de Escuela"
  },

  {
    titulo: "Tablero CAG FJ26",
    descripcion: "Seguimiento de alumnos candidatos a graduar en el periodo 202613 en CCM.",
    url: "https://tecmx-my.sharepoint.com/:x:/r/personal/diego_a_banq_tec_mx/Documents/Graduaciones/Documentos%20de%20Seguimiento%20periodos/Graduaci%C3%B3n%202613%20para%20compartir/CAG%20PROFE%20VALIDACI%C3%93N%202613-drive.xlsx?d=w575ae80128b44607bb6b2b4cd8ec8d33&csf=1&web=1&e=uiBOuA",
    categoria: "Certificación y Graduación",
    publico: "Campus Ciudad de México"
  },

  {
    titulo: "Formulario para solicitud de Materiales y Servicios para Semana Tec 12 AD26",
    descripcion: "Formulario para solicitar Materiales y Servicios para la Semana Tec 12 de AD26",
    url: "https://tecmx.sharepoint.com/:l:/s/ServiciosyProyectosAcadmicos-CCM/JAD-NictAjEZSY1m013ssgHDAUBHh1JDs2DTamM25d6bJkk?nav=MzZkMWNiZjctODE0ZC00NjM4LTgwZTgtOWU1NmI0ZjVhNzlm",
    categoria: "Servicios y Proyectos Académicos",
    publico: "Dirección de Departamento"
  },
 
  {
    titulo: "Formulario para solicitud de Espacios Macro para Semana Tec 12 AD26",
    descripcion: "Formulario para solicitar Espacios Macro para la Semana Tec 12 de AD26",
    url: "https://tecmx.sharepoint.com/:l:/s/ServiciosyProyectosAcadmicos-CCM/JADA5zMKHiBYQqqnxghB-QElAWi2jWjQGW04APQ_fSqvmAA?nav=NzA4ZjAyNTgtMGFjOS00OTdjLTkzZjAtMjlhMzM0OTdhODNk2", 
    categoria: "Servicios y Proyectos Académicos",
    publico: "Dirección de Departamento"
  },

  {
    titulo: "Directorio de Campus",
    descripcion: "Contactos del personal operativo del Campus Ciudad de México.",
    url: "https://datastudio.google.com/reporting/931f3a92-94e1-4779-9c86-3490f70d7c7c/page/MDhWF",
    categoria: "Analítica de Datos",
    imagen: "img/tarjetas/directorio_campus.jpg"
  },

  /* ------------------------------------------------------------
     PLANTILLA PARA COPIAR Y PEGAR UNA TARJETA NUEVA
     Acuérdate de poner una coma después de la llave } de la
     tarjeta anterior.

  ,{
    titulo: "",
    descripcion: "",
    url: "",
    categoria: "",
    publico: "",
    imagen: "img/tarjetas/.jpg"
  }

     ------------------------------------------------------------ */

];
