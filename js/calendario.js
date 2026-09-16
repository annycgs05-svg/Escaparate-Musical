/* =========================================================================
   CALENDARIO — agenda de conciertos
   -------------------------------------------------------------------------
   Los datos viven en data/eventos.json. Para agregar una fecha, añade un
   objeto a ese archivo con este formato:

   {
     "id": "identificador-unico",
     "fecha": "2026-10-15",          <- AÑO-MES-DÍA, siempre así
     "hora": "20:00",
     "titulo": "Nombre del evento",
     "artistas": ["Banda 1", "Banda 2"],
     "localId": "teatro-sucre",      <- debe existir en locales.json
     "local": "Teatro Nacional Sucre",
     "ciudadValue": "quito",
     "ciudad": "Quito",
     "tipoValue": "concierto",
     "tipoLabel": "Concierto",
     "precio": "Desde $15",
     "entradasLink": "",
     "notas": ""
   }
   ========================================================================= */

let TODOS_LOS_EVENTOS = [];
let vistaActual = 'proximos';   // 'proximos' o 'pasados'

const MESES = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];
const MESES_CORTOS = ['ene','feb','mar','abr','may','jun',
                      'jul','ago','sep','oct','nov','dic'];

/* Fecha de hoy a medianoche, para comparar sin que la hora estorbe */
function hoy() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function fechaDe(evento) {
    return new Date(evento.fecha + 'T00:00:00');
}

/* -------------------------------------------------------------------------
   Dibuja un evento
   ------------------------------------------------------------------------- */
function crearEvento(evento, esPasado) {
    const f = fechaDe(evento);
    const dia = f.getDate();
    const mes = MESES_CORTOS[f.getMonth()];

    /* Si el evento tiene link de entradas, la tarjeta es un enlace;
       si no, apunta a la ficha del local */
    const destino = evento.entradasLink
        ? evento.entradasLink
        : (evento.localId ? `local.html?id=${encodeURIComponent(evento.localId)}` : '#');
    const externo = evento.entradasLink ? 'target="_blank" rel="noopener"' : '';

    const artistas = (evento.artistas && evento.artistas.length)
        ? evento.artistas.join(' · ')
        : '';

    const lugar = [evento.local, evento.ciudad].filter(Boolean).join(', ');
    const hora  = evento.hora ? ` · ${escaparHTML(evento.hora)}` : '';

    return `
        <a href="${escaparHTML(destino)}" ${externo} class="evento ${esPasado ? 'pasado' : ''}">
            <div class="evento-fecha">
                <span class="evento-dia">${dia}</span>
                <span class="evento-mes">${mes}</span>
            </div>
            <div class="evento-cuerpo">
                <h2 class="evento-titulo">${escaparHTML(evento.titulo)}</h2>
                <p class="evento-meta">
                    ${artistas ? `<strong>${escaparHTML(artistas)}</strong> · ` : ''}${escaparHTML(lugar)}${hora}
                </p>
            </div>
            <div class="evento-lado">
                ${evento.precio ? `<span class="evento-precio">${escaparHTML(evento.precio)}</span>` : ''}
                ${evento.tipoLabel ? `<span class="evento-tipo">${escaparHTML(evento.tipoLabel)}</span>` : ''}
            </div>
        </a>`;
}

/* -------------------------------------------------------------------------
   Pinta la lista agrupando por mes
   ------------------------------------------------------------------------- */
function pintarEventos(lista, esPasado) {
    const contenedor = document.getElementById('lista-eventos');
    const contador   = document.getElementById('contador');

    if (lista.length === 0) {
        contenedor.innerHTML = vistaActual === 'proximos'
            ? `<div class="estado-vacio">
                   <strong>No hay fechas anunciadas</strong>
                   ¿Organizas un concierto? <a href="contactos.html">Escríbenos</a> y lo publicamos aquí.
               </div>`
            : `<div class="estado-vacio">
                   <strong>Sin eventos pasados registrados</strong>
                   El archivo histórico se construye de a poco.
               </div>`;
        contador.textContent = '0 eventos';
        return;
    }

    let html = '';
    let mesAnterior = '';

    lista.forEach(evento => {
        const f = fechaDe(evento);
        const claveMes = `${MESES[f.getMonth()]} ${f.getFullYear()}`;

        /* Encabezado nuevo cada vez que cambia el mes */
        if (claveMes !== mesAnterior) {
            html += `<h2 class="mes-separador">${claveMes}</h2>`;
            mesAnterior = claveMes;
        }

        html += crearEvento(evento, esPasado);
    });

    contenedor.innerHTML = html;
    contador.textContent = `${lista.length} evento${lista.length !== 1 ? 's' : ''}`;
}

/* -------------------------------------------------------------------------
   Filtros
   ------------------------------------------------------------------------- */
function aplicarFiltros() {
    const texto  = document.getElementById('filtro-busqueda').value.trim().toLowerCase();
    const ciudad = document.getElementById('filtro-ciudad').value;
    const tipo   = document.getElementById('filtro-tipo').value;
    const limite = hoy();

    let lista = TODOS_LOS_EVENTOS.filter(evento => {
        const f = fechaDe(evento);
        const esFuturo = f >= limite;

        /* Separamos próximos de pasados según la pestaña activa */
        if (vistaActual === 'proximos' && !esFuturo) return false;
        if (vistaActual === 'pasados'  &&  esFuturo) return false;

        /* Buscamos en título, artistas y local a la vez */
        const textoCompleto = [
            evento.titulo,
            (evento.artistas || []).join(' '),
            evento.local
        ].join(' ').toLowerCase();

        const coincideTexto  = texto === '' || textoCompleto.includes(texto);
        const coincideCiudad = ciudad === '' || evento.ciudadValue === ciudad;
        const coincideTipo   = tipo === '' || evento.tipoValue === tipo;

        return coincideTexto && coincideCiudad && coincideTipo;
    });

    /* Próximos: del más cercano al más lejano. Pasados: del más reciente hacia atrás */
    lista.sort((a, b) => vistaActual === 'proximos'
        ? fechaDe(a) - fechaDe(b)
        : fechaDe(b) - fechaDe(a));

    pintarEventos(lista, vistaActual === 'pasados');
}

function llenarCiudades() {
    const select = document.getElementById('filtro-ciudad');
    const ciudades = new Map();

    TODOS_LOS_EVENTOS.forEach(e => {
        if (e.ciudadValue && !ciudades.has(e.ciudadValue)) {
            ciudades.set(e.ciudadValue, e.ciudad);
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

/* -------------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const datos = await cargarJSON('data/eventos.json');

    if (!datos) {
        document.getElementById('lista-eventos').innerHTML = mensajeErrorDatos('eventos.json');
        return;
    }

    TODOS_LOS_EVENTOS = datos;
    llenarCiudades();
    aplicarFiltros();

    document.getElementById('filtro-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-ciudad').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-tipo').addEventListener('change', aplicarFiltros);

    const btnProximos = document.getElementById('btn-proximos');
    const btnPasados  = document.getElementById('btn-pasados');

    btnProximos.addEventListener('click', () => {
        vistaActual = 'proximos';
        btnProximos.classList.add('activo');
        btnPasados.classList.remove('activo');
        aplicarFiltros();
    });

    btnPasados.addEventListener('click', () => {
        vistaActual = 'pasados';
        btnPasados.classList.add('activo');
        btnProximos.classList.remove('activo');
        aplicarFiltros();
    });
});
