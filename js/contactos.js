/* =========================================================================
   CONTACTOS — arma un correo con lo que escribió la persona
   -------------------------------------------------------------------------
   Este formulario NO envía nada por sí solo: abre el programa de correo del
   usuario con el mensaje ya redactado. Es la única forma de recibir mensajes
   sin tener un servidor todavía.

   Cuando montes un backend, reemplaza la función enviar() por una llamada
   fetch() a tu endpoint. El resto del archivo no cambia.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-contacto');
    const error      = document.getElementById('error-formulario');
    if (!formulario) return;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const tipo     = document.getElementById('tipo').value;
        const nombre   = document.getElementById('nombre').value.trim();
        const correo   = document.getElementById('correo').value.trim();
        const proyecto = document.getElementById('proyecto').value.trim();
        const mensaje  = document.getElementById('mensaje').value.trim();

        /* Validación: decimos exactamente qué falta, no un "error" genérico */
        const faltantes = [];
        if (!tipo)   faltantes.push('el tipo de registro');
        if (!nombre) faltantes.push('tu nombre');
        if (!correo) faltantes.push('tu correo');

        if (faltantes.length) {
            error.textContent = `Falta ${faltantes.join(', ')}.`;
            error.hidden = false;
            return;
        }

        if (!correo.includes('@')) {
            error.textContent = 'Revisa tu correo: parece que le falta el @.';
            error.hidden = false;
            return;
        }

        error.hidden = true;

        /* Armamos el asunto y el cuerpo del correo */
        const asunto = `[${tipo}] ${proyecto || nombre}`;
        const cuerpo = [
            `Tipo: ${tipo}`,
            `Nombre de quien escribe: ${nombre}`,
            `Correo de contacto: ${correo}`,
            proyecto ? `Proyecto / local / persona: ${proyecto}` : '',
            '',
            'Detalles:',
            mensaje || '(sin detalles)'
        ].filter(Boolean).join('\n');

        window.location.href =
            `mailto:${SITIO.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    });
});
