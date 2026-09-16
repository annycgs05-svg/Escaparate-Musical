/* =========================================================================
   LOCAL — ficha individual
   Lee local.html?id=teatro-sucre desde data/locales.json
   ========================================================================= */

function formatearAforo(n) {
    if (!n || n <= 0) return 'Por confirmar';
    return n.toLocaleString('es-EC') + ' personas';
}

/* Tabla de eventos (próximos o pasados) */
function armarTablaEventos(eventos, tipo) {
    if (!eventos || eventos.length === 0) {
        const texto = tipo === 'proximos'
            ? `<strong>Sin fechas anunciadas</strong>
               ¿Organizas algo aquí? <a href="contactos.html">Cuéntanos</a> y lo sumamos al calendario.`
            : `<strong>Sin historial registrado</strong>
               Si recuerdas conciertos memorables en este lugar,
               <a href="contactos.html">ayúdanos a documentarlos</a>.`;
        return `<div class="estado-vacio">${texto}</div>`;
    }

    const cabecera = tipo === 'proximos'
        ? '<tr><th>Fecha</th><th>Artista / Evento</th><th>Información</th></tr>'
        : '<tr><th>Fecha</th><th>Artista / Evento</th><th>Notas</th></tr>';

    const filas = eventos.map(e => `
        <tr>
            <td class="fecha-col">${escaparHTML(e.fecha)}</td>
            <td><strong>${escaparHTML(e.evento)}</strong></td>
            <td>${escaparHTML(e.info || e.notas || '—')}</td>
        </tr>`).join('');

    return `<table class="tabla"><thead>${cabecera}</thead><tbody>${filas}</tbody></table>`;
}

function pintarLocal(local) {
    document.title = `${local.nombre} — Escaparate Musical`;
    document.getElementById('nombre-local').textContent = local.nombre;

    const dato = v => (v && String(v).trim() !== '')
        ? escaparHTML(v)
        : '<span style="color:var(--apagado)">Por confirmar</span>';

    const direccionCompleta = [local.direccion, local.barrio].filter(Boolean).join(' · ');

    const equipamiento = (local.equipamiento && local.equipamiento.length)
        ? `<ul class="lista-equipo">${local.equipamiento.map(e => `<li>${escaparHTML(e)}</li>`).join('')}</ul>`
        : '';

    const botonMapa = local.mapaLink
        ? `<a href="${escaparHTML(local.mapaLink)}" target="_blank" rel="noopener" class="boton">Ver en el mapa</a>`
        : '';

    document.getElementById('contenido-local').innerHTML = `
        <section class="perfil-arriba">
            <div class="foto-local-grande">${bloqueImagen(local.foto, local.nombre)}</div>

            <div class="columna-info">
                <div class="caja caja-ficha">
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Ciudad</span>
                        <span class="valor-ficha">${dato(local.ciudad)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Aforo máximo</span>
                        <span class="valor-ficha valor-aforo">${escaparHTML(formatearAforo(local.aforo))}</span>
                    </div>
                    <div class="item-ficha item-ancho">
                        <span class="etiqueta-ficha">Dirección</span>
                        <span class="valor-ficha">${dato(direccionCompleta)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Tipo de espacio</span>
                        <span class="valor-ficha">${dato(local.tipoLabel)}</span>
                    </div>
                    <div class="item-ficha">
                        <span class="etiqueta-ficha">Contacto</span>
                        <span class="valor-ficha">${dato(local.contacto)}</span>
                    </div>
                </div>

                <div class="caja caja-descripcion">
                    <p>${local.descripcion ? escaparHTML(local.descripcion) : 'Descripción en construcción.'}</p>
                    ${equipamiento}
                    ${botonMapa}
                </div>
            </div>
        </section>

        <section class="contenedor-pestanas">
            <div class="barra-pestanas">
                <button class="btn-pestana activa" onclick="cambiarPestana('proximos', this)">Próximas fechas</button>
                <button class="btn-pestana" onclick="cambiarPestana('historial', this)">Historial</button>
            </div>

            <div id="pestana-proximos" class="contenido-pestana activo">
                ${armarTablaEventos(local.proximos, 'proximos')}
            </div>

            <div id="pestana-historial" class="contenido-pestana">
                ${armarTablaEventos(local.historial, 'historial')}
            </div>
        </section>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenido-local');
    const id = parametroURL('id');

    if (!id) {
        document.getElementById('nombre-local').textContent = 'Local no indicado';
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <strong>Falta el identificador</strong>
                Entra desde <a href="locales.html">el listado de locales</a>.
            </div>`;
        return;
    }

    const locales = await cargarJSON('data/locales.json');
    if (!locales) {
        contenedor.innerHTML = mensajeErrorDatos('locales.json');
        return;
    }

    const local = locales.find(l => l.id === id);
    if (!local) {
        document.getElementById('nombre-local').textContent = 'Local no encontrado';
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <strong>No existe un local con ese identificador</strong>
                Busca en <a href="locales.html">el listado completo</a>.
            </div>`;
        return;
    }

    pintarLocal(local);
});
