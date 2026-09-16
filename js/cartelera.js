/* =========================================================================
   CARTELERA — portada editorial
   -------------------------------------------------------------------------
   TODO el contenido de esta página vive en data/cartelera.json.
   Para publicar algo nuevo edita ese archivo y actualiza el campo
   "ultimaActualizacion" con la fecha y hora del cambio.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Banner de "actualizado hace X"
   ------------------------------------------------------------------------- */
function mostrarUltimaActualizacion(iso) {
    const relativoEl = document.getElementById('texto-relativo');
    const exactaEl   = document.getElementById('texto-fecha-exacta');

    if (!iso) {
        relativoEl.textContent = 'Cartelera';
        return;
    }

    const fecha = new Date(iso);
    const minutos = Math.floor((new Date() - fecha) / 60000);
    const horas   = Math.floor(minutos / 60);
    const dias    = Math.floor(horas / 24);

    let relativo;
    if (minutos < 1)   relativo = 'justo ahora';
    else if (minutos < 60) relativo = `hace ${minutos} min`;
    else if (horas < 24)   relativo = `hace ${horas} h`;
    else relativo = `hace ${dias} día${dias !== 1 ? 's' : ''}`;

    relativoEl.textContent = `Actualizado ${relativo}`;
    exactaEl.textContent = fecha.toLocaleDateString('es-EC', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) + ' · ' + fecha.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
}

/* -------------------------------------------------------------------------
   Lanzamientos (carrusel)
   ------------------------------------------------------------------------- */
function cargarLanzamientos(lista) {
    const pista = document.getElementById('pista-lanzamientos');

    if (!lista || lista.length === 0) {
        pista.innerHTML = `
            <div class="estado-vacio" style="padding:34px 20px;">
                <strong>Sin lanzamientos esta semana</strong>
                ¿Sacaste algo nuevo? <a href="contactos.html">Avísanos</a>.
            </div>`;
        return;
    }

    pista.innerHTML = lista.map(l => {
        /* Si hay bandaId lleva a la ficha; si hay link externo, a ese link */
        const destino = l.bandaId
            ? `banda.html?id=${encodeURIComponent(l.bandaId)}`
            : (l.link || '#');
        const externo = (!l.bandaId && l.link) ? 'target="_blank" rel="noopener"' : '';

        const portada = l.portada
            ? `<img src="${escaparHTML(l.portada)}" alt="${escaparHTML(l.titulo)}">`
            : escaparHTML((l.titulo || '?').charAt(0).toUpperCase());

        return `
            <a href="${escaparHTML(destino)}" ${externo} class="tarjeta-lanzamiento">
                <div class="portada-lanzamiento">${portada}</div>
                <div class="info-lanzamiento">
                    <p class="tipo-lanzamiento">${escaparHTML(l.tipo || 'Lanzamiento')}</p>
                    <h3 class="titulo-lanzamiento">${escaparHTML(l.titulo)}</h3>
                    <p class="artista-lanzamiento">${escaparHTML(l.artista)}</p>
                </div>
            </a>`;
    }).join('');
}

function moverCarrusel(direccion) {
    const pista = document.getElementById('pista-lanzamientos');
    pista.scrollBy({ left: direccion * 240, behavior: 'smooth' });
}

/* -------------------------------------------------------------------------
   Recomendaciones
   ------------------------------------------------------------------------- */
function cargarRecomendaciones(lista) {
    const grid = document.getElementById('grid-recomendaciones');

    if (!lista || lista.length === 0) {
        grid.innerHTML = `
            <div class="estado-vacio">
                <strong>Sin recomendaciones publicadas</strong>
                Vuelve pronto: esta sección se renueva cada semana.
            </div>`;
        return;
    }

    grid.innerHTML = lista.map(r => {
        const etiqueta = `<div class="etiqueta-recomendacion">${escaparHTML(r.etiqueta)}</div>
                          <div class="nombre-recomendacion">${escaparHTML(r.nombre)}</div>
                          <p class="motivo-recomendacion">${escaparHTML(r.motivo)}</p>`;

        /* Si la banda está en el archivo, la tarjeta lleva a su ficha */
        return r.bandaId
            ? `<a href="banda.html?id=${encodeURIComponent(r.bandaId)}" class="tarjeta-recomendacion">${etiqueta}</a>`
            : `<div class="tarjeta-recomendacion">${etiqueta}</div>`;
    }).join('');
}

/* -------------------------------------------------------------------------
   Notas de prensa
   ------------------------------------------------------------------------- */
function cargarPrensa(lista) {
    const contenedor = document.getElementById('lista-prensa');

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <strong>Sin notas publicadas</strong>
                ¿Escribiste algo sobre la escena? <a href="contactos.html">Compártelo</a>.
            </div>`;
        return;
    }

    /* Las más recientes primero */
    const ordenadas = [...lista].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    contenedor.innerHTML = ordenadas.map(n => `
        <article class="nota-prensa">
            <div class="fecha-nota">${escaparHTML(formatearFecha(n.fecha))}</div>
            <div class="cuerpo-nota">
                <h3>${escaparHTML(n.titulo)}</h3>
                <p>${escaparHTML(n.resumen)}</p>
                ${n.link
                    ? `<a href="${escaparHTML(n.link)}" target="_blank" rel="noopener" class="link-nota">Leer la nota completa</a>`
                    : '<span class="link-nota" style="color:var(--apagado)">Enlace pendiente</span>'}
            </div>
        </article>`).join('');
}

/* -------------------------------------------------------------------------
   Festivales
   ------------------------------------------------------------------------- */
function cargarFestivales(lista) {
    const grid = document.getElementById('grid-festivales');

    if (!lista || lista.length === 0) {
        grid.innerHTML = `
            <div class="estado-vacio">
                <strong>Sin festivales en el radar</strong>
                Cuando se confirmen fechas, aparecen aquí.
            </div>`;
        return;
    }

    grid.innerHTML = lista.map(f => {
        const cuerpo = `
            <span class="badge-festival">${escaparHTML(f.estado || 'Por confirmar')}</span>
            <h3 class="nombre-festival">${escaparHTML(f.nombre)}</h3>
            ${f.nota ? `<p class="nota-festival">${escaparHTML(f.nota)}</p>` : ''}
            <p class="ciudad-festival">${escaparHTML(f.ciudad || '')}${f.fecha ? ' · ' + escaparHTML(formatearFecha(f.fecha)) : ''}</p>`;

        return f.link
            ? `<a href="${escaparHTML(f.link)}" target="_blank" rel="noopener" class="tarjeta-festival">${cuerpo}</a>`
            : `<div class="tarjeta-festival">${cuerpo}</div>`;
    }).join('');
}

/* -------------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const datos = await cargarJSON('data/cartelera.json');

    if (!datos) {
        document.querySelector('.contenido-cartelera').innerHTML = mensajeErrorDatos('cartelera.json');
        return;
    }

    mostrarUltimaActualizacion(datos.ultimaActualizacion);
    cargarLanzamientos(datos.lanzamientos);
    cargarRecomendaciones(datos.recomendaciones);
    cargarPrensa(datos.prensa);
    cargarFestivales(datos.festivales);
});
