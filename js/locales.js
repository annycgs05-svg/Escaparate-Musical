/* =========================================================================
   LOCALES — listado, filtros y orden
   Los datos viven en data/locales.json
   ========================================================================= */

let TODOS_LOS_LOCALES = [];

/* Formatea 3000 → "3.000" para que se lea de un vistazo */
function formatearAforo(n) {
    if (!n || n <= 0) return 'Aforo por confirmar';
    return n.toLocaleString('es-EC') + ' personas';
}

function crearTarjetaLocal(local) {
    const zona = [local.barrio, local.ciudad].filter(Boolean).join(', ');

    return `
        <a href="local.html?id=${encodeURIComponent(local.id)}" class="tarjeta-local">
            <div class="foto-local">${bloqueImagen(local.foto, local.nombre)}</div>
            <div class="info-local">
                <h2 class="nombre-local">${escaparHTML(local.nombre)}</h2>
                <p class="fila-local">
                    <span>${escaparHTML(zona || 'Ubicación por confirmar')}</span>
                    <span class="aforo">${escaparHTML(formatearAforo(local.aforo))}</span>
                </p>
                <p class="tipo-local">${escaparHTML(local.tipoLabel || 'Tipo por definir')}</p>
            </div>
        </a>`;
}

function pintarGrid(lista) {
    const grid = document.getElementById('grid-locales');
    const contador = document.getElementById('contador');

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="estado-vacio">
                <strong>Ningún local coincide</strong>
                Prueba ampliando el aforo o quitando algún filtro.
            </div>`;
        contador.textContent = `0 de ${TODOS_LOS_LOCALES.length}`;
        return;
    }

    grid.innerHTML = lista.map(crearTarjetaLocal).join('');
    contador.textContent = `${lista.length} de ${TODOS_LOS_LOCALES.length} locales`;
}

function aplicarFiltros() {
    const texto  = document.getElementById('filtro-busqueda').value.trim().toLowerCase();
    const ciudad = document.getElementById('filtro-ciudad').value;
    const tipo   = document.getElementById('filtro-tipo').value;
    const aforo  = parseInt(document.getElementById('filtro-aforo').value, 10) || 0;

    const filtrados = TODOS_LOS_LOCALES.filter(local => {
        const coincideTexto  = texto === '' || local.nombre.toLowerCase().includes(texto);
        const coincideCiudad = ciudad === '' || local.ciudadValue === ciudad;
        const coincideTipo   = tipo === '' || local.tipoValue === tipo;
        const coincideAforo  = aforo === 0 || (local.aforo || 0) >= aforo;
        return coincideTexto && coincideCiudad && coincideTipo && coincideAforo;
    });

    /* Ordenados por aforo de mayor a menor: es el criterio más útil
       para alguien que busca dónde tocar */
    filtrados.sort((a, b) => (b.aforo || 0) - (a.aforo || 0));

    pintarGrid(filtrados);
}

function llenarCiudades() {
    const select = document.getElementById('filtro-ciudad');
    const ciudades = new Map();

    TODOS_LOS_LOCALES.forEach(l => {
        if (l.ciudadValue && !ciudades.has(l.ciudadValue)) {
            ciudades.set(l.ciudadValue, l.ciudad);
        }
    });

    [...ciudades.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'es'))
        .forEach(([valor, etiqueta]) => {
            const op = document.createElement('option');
            op.value = valor;
            op.textContent = etiqueta;
            select.appendChild(op);
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    const datos = await cargarJSON('data/locales.json');

    if (!datos) {
        document.getElementById('grid-locales').innerHTML = mensajeErrorDatos('locales.json');
        return;
    }

    TODOS_LOS_LOCALES = datos;
    llenarCiudades();
    aplicarFiltros();

    document.getElementById('filtro-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-ciudad').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-tipo').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-aforo').addEventListener('change', aplicarFiltros);
});
