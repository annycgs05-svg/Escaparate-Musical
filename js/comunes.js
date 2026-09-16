/* =========================================================================
   ESCAPARATE MUSICAL — UTILIDADES COMPARTIDAS
   -------------------------------------------------------------------------
   Funciones que usan varias páginas. Cárgalo ANTES del JS propio de cada una:
     <script src="js/comunes.js"></script>
     <script src="js/bandas.js"></script>
   ========================================================================= */

/* -------------------------------------------------------------------------
   DATOS DEL SITIO — edita aquí tus redes y contacto una sola vez
   ------------------------------------------------------------------------- */
const SITIO = {
    nombre: "Escaparate Musical",
    hashtag: "#escaparatemusical",
    correo: "contacto@escaparatemusical.com",
    whatsapp: "593999937339",
    redes: {
        tiktok:    "https://tiktok.com",
        youtube:   "https://youtube.com",
        instagram: "https://instagram.com"
    }
};

/* -------------------------------------------------------------------------
   cargarJSON(ruta)
   Trae un archivo de la carpeta /data. Si falla, avisa en consola y
   devuelve null para que la página muestre su propio estado vacío.
   ------------------------------------------------------------------------- */
async function cargarJSON(ruta) {
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error(`No se pudo leer ${ruta}:`, error);
        return null;
    }
}

/* -------------------------------------------------------------------------
   mensajeErrorDatos(nombreArchivo)
   Texto que se muestra cuando el JSON no cargó. La causa más común es abrir
   el HTML con doble clic en vez de usar Live Server.
   ------------------------------------------------------------------------- */
function mensajeErrorDatos(nombreArchivo) {
    return `
        <div class="estado-vacio">
            <strong>No se pudieron cargar los datos</strong>
            No se encontró <code>data/${nombreArchivo}</code>.
            Si abriste el archivo con doble clic, ábrelo con Live Server en VS Code.
        </div>`;
}

/* -------------------------------------------------------------------------
   escaparHTML(texto)
   Evita que un dato del JSON con < o > rompa la página.
   Úsalo siempre que insertes texto dentro de plantillas con ${}.
   ------------------------------------------------------------------------- */
function escaparHTML(texto) {
    if (texto === null || texto === undefined) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* -------------------------------------------------------------------------
   bloqueImagen(rutaFoto, nombre, claseContenedor)
   Devuelve una <img> si hay foto; si no, un recuadro con la inicial.
   Así ninguna banda o local se ve "roto" por no tener imagen todavía.
   ------------------------------------------------------------------------- */
function bloqueImagen(rutaFoto, nombre) {
    const alt = escaparHTML(nombre);
    if (rutaFoto && rutaFoto.trim() !== '') {
        // onerror: si la ruta existe en el JSON pero el archivo no, cae al placeholder
        return `<img src="${escaparHTML(rutaFoto)}" alt="${alt}"
                     onerror="this.parentElement.innerHTML='${placeholderTexto(nombre)}'">`;
    }
    return placeholderHTML(nombre);
}

function inicialDe(nombre) {
    return (nombre || '?').trim().charAt(0).toUpperCase();
}

function placeholderHTML(nombre) {
    return `<div class="sin-foto">${inicialDe(nombre)}</div>`;
}

/* Versión escapada para meterla dentro del atributo onerror */
function placeholderTexto(nombre) {
    return `<div class=\\'sin-foto\\'>${inicialDe(nombre)}</div>`;
}

/* -------------------------------------------------------------------------
   pintarPie(contenedor)
   Dibuja el pie de página igual en todas las páginas.
   Uso en el HTML:  <footer class="pie" id="pie"></footer>
   ------------------------------------------------------------------------- */
function pintarPie() {
    const pie = document.getElementById('pie');
    if (!pie) return;

    pie.innerHTML = `
        <div class="pie-redes">
            <a href="${SITIO.redes.tiktok}" target="_blank" rel="noopener"
               class="icono-footer" title="TikTok"><img src="img/Tiktok.png" alt="TikTok"></a>
            <a href="${SITIO.redes.youtube}" target="_blank" rel="noopener"
               class="icono-footer" title="YouTube"><img src="img/YouTube.png" alt="YouTube"></a>
            <a href="${SITIO.redes.instagram}" target="_blank" rel="noopener"
               class="icono-footer" title="Instagram"><img src="img/Instagram.png" alt="Instagram"></a>
        </div>
        <p class="pie-texto">
            ${SITIO.nombre} · ${SITIO.hashtag} ·
            <a href="nosotros.html">Nosotros</a> ·
            <a href="contactos.html">Contacto</a>
        </p>`;
}

/* -------------------------------------------------------------------------
   cambiarPestana(id, boton)
   Navegación de pestañas. La usan banda.html y local.html.
   ------------------------------------------------------------------------- */
function cambiarPestana(idPestana, elementoBoton) {
    document.querySelectorAll('.contenido-pestana').forEach(c => c.classList.remove('activo'));
    document.querySelectorAll('.btn-pestana').forEach(b => b.classList.remove('activa'));

    const destino = document.getElementById('pestana-' + idPestana);
    if (destino) destino.classList.add('activo');
    if (elementoBoton) elementoBoton.classList.add('activa');
}

/* -------------------------------------------------------------------------
   parametroURL(clave)
   Lee un valor de la URL. Ej: banda.html?id=da-pawn  →  parametroURL('id')
   ------------------------------------------------------------------------- */
function parametroURL(clave) {
    return new URLSearchParams(window.location.search).get(clave);
}

/* -------------------------------------------------------------------------
   formatearFecha(iso)
   "2026-10-15" → "15 oct 2026"
   ------------------------------------------------------------------------- */
function formatearFecha(iso) {
    if (!iso) return '';
    const f = new Date(iso + 'T00:00:00');
    if (isNaN(f)) return iso;
    return f.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* El pie se dibuja solo en cuanto carga la página */
document.addEventListener('DOMContentLoaded', pintarPie);
