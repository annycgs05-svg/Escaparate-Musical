/* =========================================================================
   BANDA — ficha individual
   -------------------------------------------------------------------------
   Lee el id de la URL (banda.html?id=da-pawn), lo busca en data/bandas.json
   y construye la ficha. Una sola plantilla sirve para las 54 bandas.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Discografía: EPs, álbumes y sencillos
   ------------------------------------------------------------------------- */
function armarDiscografia(disco) {
    if (!disco) return '<p class="mensaje-vacio">Discografía en construcción.</p>';

    let html = '';

    /* --- EPs (con lista de canciones si existe) --- */
    if (disco.eps && disco.eps.length) {
        html += `
        <div class="bloque-disco">
            <h3 class="subtitulo-disco">EP</h3>
            <table class="tabla">
                <thead><tr><th>Título</th><th>Año</th><th>Detalles</th></tr></thead>
                <tbody>${disco.eps.map(ep => `
                    <tr>
                        <td>
                            <strong>${escaparHTML(ep.titulo)}</strong>
                            ${ep.canciones && ep.canciones.length
                                ? `<ol class="lista-canciones">${ep.canciones.map(c => `<li>${escaparHTML(c)}</li>`).join('')}</ol>`
                                : ''}
                        </td>
                        <td>${escaparHTML(ep.anio)}</td>
                        <td>${escaparHTML(ep.detalle || '—')}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    /* --- Álbumes --- */
    if (disco.albumes && disco.albumes.length) {
        html += `
        <div class="bloque-disco">
            <h3 class="subtitulo-disco">Álbumes</h3>
            <table class="tabla">
                <thead><tr><th>Título</th><th>Año</th><th>Tipo</th></tr></thead>
                <tbody>${disco.albumes.map(a => `
                    <tr>
                        <td><strong>${escaparHTML(a.titulo)}</strong></td>
                        <td>${escaparHTML(a.anio)}</td>
                        <td>${escaparHTML(a.tipo || 'Álbum de estudio')}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    /* --- Sencillos --- */
    if (disco.sencillos && disco.sencillos.length) {
        html += `
        <div class="bloque-disco">
            <h3 class="subtitulo-disco">Sencillos</h3>
            <table class="tabla">
                <thead><tr><th>Título</th><th>Año</th></tr></thead>
                <tbody>${disco.sencillos.map(s => `
                    <tr><td><strong>${escaparHTML(s.titulo)}</strong></td><td>${escaparHTML(s.anio)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    /* Estado vacío: invita a colaborar en vez de solo avisar que falta algo */
    if (html === '') {
        return `
        <div class="estado-vacio">
            <strong>Sin discografía registrada</strong>
            ¿Conoces los lanzamientos de esta banda?
            <a href="contactos.html">Escríbenos</a> y los sumamos al archivo.
        </div>`;
    }

    return html;
}

/* -------------------------------------------------------------------------
   Integrantes
   ------------------------------------------------------------------------- */
function armarIntegrantes(integrantes) {
    if (!integrantes || integrantes.length === 0) {
        return `
        <div class="estado-vacio">
            <strong>Sin alineación registrada</strong>
            ¿Tienes los nombres? <a href="contactos.html">Cuéntanos</a> y completamos la ficha.
        </div>`;
    }

    const filas = integrantes.map(i => `
        <tr class="fila-integrante" data-categoria="${escaparHTML(i.categoria || 'actuales')}">
            <td><strong>${escaparHTML(i.nombre)}</strong></td>
            <td>${escaparHTML(i.rol || '—')}</td>
            <td>${escaparHTML(i.periodo || '—')}</td>
        </tr>`).join('');

    return `
        <table class="tabla" id="tabla-integrantes">
            <thead><tr><th>Nombre</th><th>Rol / Instrumento</th><th>Período</th></tr></thead>
            <tbody>${filas}</tbody>
        </table>
        <p class="mensaje-vacio" id="mensaje-integrantes-vacio" style="display:none;">
            No hay integrantes registrados en esta categoría.
        </p>`;
}

/* Filtra la tabla de integrantes por categoría */
function filtrarIntegrantes(categoria, boton) {
    document.querySelectorAll('.btn-sub').forEach(b => b.classList.remove('activo'));
    if (boton) boton.classList.add('activo');

    const tabla   = document.getElementById('tabla-integrantes');
    const vacio   = document.getElementById('mensaje-integrantes-vacio');
    let visibles  = 0;

    document.querySelectorAll('.fila-integrante').forEach(fila => {
        const coincide = categoria === 'todos' || fila.dataset.categoria === categoria;
        fila.style.display = coincide ? 'table-row' : 'none';
        if (coincide) visibles++;
    });

    if (tabla) tabla.style.display = visibles === 0 ? 'none' : 'table';
    if (vacio) vacio.style.display = visibles === 0 ? 'block' : 'none';
}

/* -------------------------------------------------------------------------
   Enlaces externos
   ------------------------------------------------------------------------- */
function armarLinks(links) {
    const NOMBRES = {
        spotify:   'Spotify',
        youtube:   'YouTube',
        instagram: 'Instagram',
        tiktok:    'TikTok',
        bandcamp:  'Bandcamp',
        web:       'Sitio web'
    };

    const items = Object.keys(NOMBRES)
        .filter(clave => links && links[clave])
        .map(clave => `
            <li><a href="${escaparHTML(links[clave])}" target="_blank" rel="noopener">
                ${NOMBRES[clave]}
            </a></li>`)
        .join('');

    if (!items) {
        return `
        <div class="estado-vacio">
            <strong>Sin enlaces registrados</strong>
            Si esta banda tiene Spotify, Bandcamp o redes,
            <a href="contactos.html">mándanos el enlace</a>.
        </div>`;
    }

    return `<ul class="lista-links">${items}</ul>`;
}

/* -------------------------------------------------------------------------
   Construye la ficha completa
   ------------------------------------------------------------------------- */
function pintarBanda(banda) {
    document.title = `${banda.nombre} — Escaparate Musical`;
    document.getElementById('nombre-banda').textContent = banda.nombre;

    /* Cada dato ausente se muestra como "Por confirmar", nunca vacío */
    const dato = v => (v && String(v).trim() !== '') ? escaparHTML(v) : '<span style="color:var(--apagado)">Por confirmar</span>';

    document.getElementById('contenido-banda').innerHTML = `
        <section class="perfil-arriba">
            <div class="contenedor-foto-perfil">${bloqueImagen(banda.foto, banda.nombre)}</div>

            <div class="columna-info">
                <div class="caja caja-ficha">
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Ciudad</span>
                        <span class="valor-ficha">${dato(banda.ciudad)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Estado</span>
                        <span class="valor-ficha estado-${escaparHTML(banda.estadoValue)}">${escaparHTML(banda.estadoLabel)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Años de actividad</span>
                        <span class="valor-ficha">${dato(banda.aniosActividad)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Género</span>
                        <span class="valor-ficha">${dato(banda.generoLabel)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Sello</span>
                        <span class="valor-ficha">${dato(banda.sello)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Contacto</span>
                        <span class="valor-ficha">${dato(banda.contacto)}</span>
                    </div>
                </div>

                <div class="caja caja-descripcion">
                    <h2>Descripción</h2>
                    <p>${banda.descripcion && banda.descripcion.trim()
                        ? escaparHTML(banda.descripcion)
                        : 'Todavía no escribimos la reseña de esta banda. Si la conoces bien, <a href="contactos.html" style="color:var(--rojo-brillo)">ayúdanos a completarla</a>.'}</p>
                </div>
            </div>
        </section>

        <section class="contenedor-pestanas">
            <div class="barra-pestanas" role="tablist">
                <button class="btn-pestana activa" onclick="cambiarPestana('discografia', this)">Discografía</button>
                <button class="btn-pestana" onclick="cambiarPestana('integrantes', this)">Integrantes</button>
                <button class="btn-pestana" onclick="cambiarPestana('links', this)">Enlaces</button>
            </div>

            <div id="pestana-discografia" class="contenido-pestana activo">
                ${armarDiscografia(banda.discografia)}
            </div>

            <div id="pestana-integrantes" class="contenido-pestana">
                <div class="sub-barra">
                    <button class="btn-sub activo" onclick="filtrarIntegrantes('actuales', this)">Actuales</button>
                    <button class="btn-sub" onclick="filtrarIntegrantes('anteriores', this)">Anteriores</button>
                    <button class="btn-sub" onclick="filtrarIntegrantes('envivo', this)">En vivo</button>
                    <button class="btn-sub" onclick="filtrarIntegrantes('todos', this)">Todos</button>
                </div>
                ${armarIntegrantes(banda.integrantes)}
            </div>

            <div id="pestana-links" class="contenido-pestana">
                ${armarLinks(banda.links)}
            </div>
        </section>`;

    /* Deja visible la categoría "Actuales" al abrir */
    filtrarIntegrantes('actuales', document.querySelector('.btn-sub'));
}

/* -------------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenido-banda');
    const id = parametroURL('id');

    if (!id) {
        document.getElementById('nombre-banda').textContent = 'Banda no indicada';
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <strong>Falta el identificador</strong>
                Entra desde <a href="bandas.html">el listado de bandas</a>.
            </div>`;
        return;
    }

    const bandas = await cargarJSON('data/bandas.json');
    if (!bandas) {
        contenedor.innerHTML = mensajeErrorDatos('bandas.json');
        return;
    }

    const banda = bandas.find(b => b.id === id);
    if (!banda) {
        document.getElementById('nombre-banda').textContent = 'Banda no encontrada';
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <strong>No existe una banda con ese identificador</strong>
                Busca en <a href="bandas.html">el listado completo</a>.
            </div>`;
        return;
    }

    pintarBanda(banda);
});
