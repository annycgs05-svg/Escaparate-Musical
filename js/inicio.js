/* =========================================================================
   INICIO — palabra del día rotativa
   -------------------------------------------------------------------------
   Para agregar una palabra nueva, añade un objeto al array de abajo.
   No hace falta tocar nada más.
   ========================================================================= */

const diccionario = [
    {
        palabra: "Metanoia",
        definicion: "Proceso de transformación que cambia la forma de pensar, sentir, de ser o de vivir de alguien."
    },
    {
        palabra: "Ataraxia",
        definicion: "Estado de serenidad y tranquilidad absoluta, caracterizado por la ausencia de temores o deseos que perturben el ánimo."
    },
    {
        palabra: "Serendipia",
        definicion: "Descubrimiento afortunado, valioso e inesperado que ocurre cuando se está buscando otra cosa."
    },
    {
        palabra: "Limerencia",
        definicion: "Estado mental involuntario en el que una persona siente una profunda necesidad de reciprocidad emocional y conexión con otra."
    },
    {
        palabra: "Inmarcesible",
        definicion: "Que no se puede marchitar; algo eterno que conserva su vigor, belleza o frescura para siempre."
    },
    {
        palabra: "Duende",
        definicion: "Fuerza misteriosa que atraviesa a un intérprete y hace que quien escucha sienta la música en el cuerpo antes de entenderla."
    }
];

/* Cada cuántos milisegundos cambia la palabra */
const INTERVALO_MS = 6000;
/* Cuánto dura el desvanecido entre una palabra y la siguiente */
const FUNDIDO_MS = 450;

document.addEventListener('DOMContentLoaded', () => {
    const cuadro     = document.getElementById('cuadro-palabra');
    const titulo     = document.getElementById('palabra-titulo');
    const definicion = document.getElementById('palabra-definicion');

    if (!cuadro || !titulo || !definicion) return;

    /* Arranca en una palabra al azar para que la portada no se sienta igual
       cada vez que alguien entra */
    let indice = Math.floor(Math.random() * diccionario.length);

    function mostrar(i) {
        titulo.textContent     = diccionario[i].palabra;
        definicion.textContent = diccionario[i].definicion;
    }

    mostrar(indice);

    setInterval(() => {
        cuadro.style.opacity = 0;
        setTimeout(() => {
            indice = (indice + 1) % diccionario.length;
            mostrar(indice);
            cuadro.style.opacity = 1;
        }, FUNDIDO_MS);
    }, INTERVALO_MS);
});
