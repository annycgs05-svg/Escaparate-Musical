/* =========================================================================
   BANDAS — listado, filtros y orden
   -------------------------------------------------------------------------
   Los datos viven en data/bandas.json. Esta página NO contiene bandas
   escritas a mano: para agregar una, edita solo el JSON.
   ========================================================================= */

let TODAS_LAS_BANDAS = [];   // copia completa que llega del JSON
let ordenActual = 'az';

/* -------------------------------------------------------------------------
   Dibuja una tarjeta a partir de un objeto banda
   ------------------------------------------------------------------------- */
function crearTarjetaBanda(banda) {
    const ciudad = banda.ciudad || 'Ciudad por confirmar';
    const genero = banda.generoLabel || 'Por definir';

    /* Solo mostramos la etiqueta de estado cuando NO está activa: así la
       información que destaca es la excepción, no la norma. */
    const marca = banda.estadoValue !== 'activa'
        ? `<span class="marca-estado">${escaparHTML(banda.estadoLabel)}</span>`
        : '';

    return `
        <a href="banda.html?id=${encodeURIComponent(banda.id)}" class="tarjeta-artista">
            <div class="contenedor-foto">${bloqueImagen(banda.foto, banda.nombre)}</div>
            <h2 class="nombre-banda">${escaparHTML(banda.nombre)}</h2>
            <p class="detalles-banda">${escaparHTML(genero)}<br>${escaparHTML(ciudad)}</p>
            ${marca}
        </a>`;
}

/* -------------------------------------------------------------------------
   Pinta la cuadrícula completa
   ------------------------------------------------------------------------- */
function pintarGrid(lista) {
    const grid = document.getElementById('grid-artistas');
    const contador = document.getElementById('contador');

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="estado-vacio">
                <strong>Ninguna banda coincide</strong>
                Prueba quitando algún filtro o buscando otro nombre.
            </div>`;
        contador.textContent = '0 de ' + TODAS_LAS_BANDAS.length;
        return;
    }

    grid.innerHTML = lista.map(crearTarjetaBanda).join('');
    contador.textContent = `${lista.length} de ${TODAS_LAS_BANDAS.length} bandas`;
}

/* -------------------------------------------------------------------------
   Aplica búsqueda + filtros + orden
   ------------------------------------------------------------------------- */
function aplicarFiltros() {
    const texto   = document.getElementById('filtro-busqueda').value.trim().toLowerCase();
    const genero  = document.getElementById('filtro-genero').value;
    const ciudad  = document.getElementById('filtro-ciudad').value;
    const estados = Array.from(document.querySelectorAll('.filtro-estado'))
                         .filter(c => c.checked)
                         .map(c => c.value);

    const filtradas = TODAS_LAS_BANDAS.filter(banda => {
        const coincideTexto  = texto === '' || banda.nombre.toLowerCase().includes(texto);
        const coincideGenero = genero === '' || banda.generoValue === genero;
        const coincideCiudad = ciudad === '' || banda.ciudadValue === ciudad;
        const coincideEstado = estados.includes(banda.estadoValue);
        return coincideTexto && coincideGenero && coincideCiudad && coincideEstado;
    });

    /* localeCompare con 'es' ordena bien los acentos y la ñ */
    filtradas.sort((a, b) => {
        const cmp = a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
        return ordenActual === 'az' ? cmp : -cmp;
    });

    pintarGrid(filtradas);
}

/* -------------------------------------------------------------------------
   Llena el desplegable de ciudades con las que existan en el JSON
   ------------------------------------------------------------------------- */
function llenarCiudades() {
    const select = document.getElementById('filtro-ciudad');

    /* Mapa valor→etiqueta para no repetir "Quito - Madrid" y "Quito" */
    const ciudades = new Map();
    TODAS_LAS_BANDAS.forEach(b => {
        if (b.ciudadValue && !ciudades.has(b.ciudadValue)) {
            ciudades.set(b.ciudadValue, b.ciudad.split('-')[0].trim());
        }
    });

    [...ciudades.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'es'))
        .forEach(([valor, etiqueta]) => {
            const opcion = document.createElement('option');
            opcion.value = valor;
            opcion.textContent = etiqueta;
            select.appendChild(opcion);
        });
}

/* -------------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const datos = await cargarJSON('data/bandas.json');

    if (!datos) {
        document.getElementById('grid-artistas').innerHTML = mensajeErrorDatos('bandas.json');
        return;
    }

    TODAS_LAS_BANDAS = datos;
    llenarCiudades();
    aplicarFiltros();

    /* Escuchamos todos los controles */
    document.getElementById('filtro-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-genero').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-ciudad').addEventListener('change', aplicarFiltros);
    document.querySelectorAll('.filtro-estado').forEach(c => c.addEventListener('change', aplicarFiltros));

    const btnAZ = document.getElementById('btn-az');
    const btnZA = document.getElementById('btn-za');

    btnAZ.addEventListener('click', () => {
        ordenActual = 'az';
        btnAZ.classList.add('activo');
        btnZA.classList.remove('activo');
        aplicarFiltros();
    });

    btnZA.addEventListener('click', () => {
        ordenActual = 'za';
        btnZA.classList.add('activo');
        btnAZ.classList.remove('activo');
        aplicarFiltros();
    });
});
