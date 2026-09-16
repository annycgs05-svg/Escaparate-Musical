/* =========================================================================
   CLASES E INTÉRPRETES
   Los datos viven en data/clases.json
   ========================================================================= */

let TODAS_LAS_CLASES = [];

function crearTarjetaClase(p) {
    /* Los datos opcionales solo se muestran si existen: nada de "—" vacíos */
    const datos = [
        p.ciudad,
        p.modalidadLabel,
        p.nivel,
        p.precio
    ].filter(Boolean)
     .map(d => `<span class="clase-dato">${escaparHTML(d)}</span>`)
     .join('');

    const contacto = p.contacto
        ? `<a href="mailto:${escaparHTML(p.contacto)}" class="boton" style="align-self:flex-start;">Contactar</a>`
        : '';

    return `
        <article class="tarjeta-clase">
            <div class="clase-cabecera">
                <div class="clase-foto">${bloqueImagen(p.foto, p.nombre)}</div>
                <div>
                    <h2 class="clase-nombre">${escaparHTML(p.nombre)}</h2>
                    <p class="clase-instrumento">${escaparHTML(p.instrumentoLabel || 'Instrumento por definir')}</p>
                </div>
            </div>
            ${p.descripcion ? `<p class="clase-descripcion">${escaparHTML(p.descripcion)}</p>` : ''}
            <div class="clase-datos">${datos}</div>
            ${contacto}
        </article>`;
}

function pintarGrid(lista) {
    const grid = document.getElementById('grid-clases');
    const contador = document.getElementById('contador');

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="estado-vacio">
                <strong>Nadie coincide con estos filtros</strong>
                ¿Das clases o tocas como sesionista?
                <a href="contactos.html">Regístrate</a> y aparece aquí.
            </div>`;
        contador.textContent = `0 de ${TODAS_LAS_CLASES.length}`;
        return;
    }

    grid.innerHTML = lista.map(crearTarjetaClase).join('');
    contador.textContent = `${lista.length} de ${TODAS_LAS_CLASES.length}`;
}

function aplicarFiltros() {
    const texto       = document.getElementById('filtro-busqueda').value.trim().toLowerCase();
    const instrumento = document.getElementById('filtro-instrumento').value;
    const ciudad      = document.getElementById('filtro-ciudad').value;
    const modalidades = Array.from(document.querySelectorAll('.filtro-modalidad'))
                             .filter(c => c.checked)
                             .map(c => c.value);

    const filtradas = TODAS_LAS_CLASES.filter(p => {
        const coincideTexto       = texto === '' || p.nombre.toLowerCase().includes(texto);
        const coincideInstrumento = instrumento === '' || p.instrumentoValue === instrumento;
        const coincideCiudad      = ciudad === '' || p.ciudadValue === ciudad;
        const coincideModalidad   = modalidades.includes(p.modalidadValue);
        return coincideTexto && coincideInstrumento && coincideCiudad && coincideModalidad;
    });

    filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    pintarGrid(filtradas);
}

function llenarCiudades() {
    const select = document.getElementById('filtro-ciudad');
    const ciudades = new Map();

    TODAS_LAS_CLASES.forEach(p => {
        if (p.ciudadValue && !ciudades.has(p.ciudadValue)) {
            ciudades.set(p.ciudadValue, p.ciudad);
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
    const datos = await cargarJSON('data/clases.json');

    if (!datos) {
        document.getElementById('grid-clases').innerHTML = mensajeErrorDatos('clases.json');
        return;
    }

    TODAS_LAS_CLASES = datos;
    llenarCiudades();
    aplicarFiltros();

    document.getElementById('filtro-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-instrumento').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-ciudad').addEventListener('change', aplicarFiltros);
    document.querySelectorAll('.filtro-modalidad').forEach(c => c.addEventListener('change', aplicarFiltros));
});
