/* =========================================================================
   CUENTA — Ingresar y Registrarse
   -------------------------------------------------------------------------
   ESTADO ACTUAL: solo interfaz. No hay servidor que guarde usuarios, así que
   los formularios validan los campos y muestran un aviso.

   CUANDO TENGAS BACKEND (Firebase, Supabase, servidor propio):
   reemplaza el contenido de ingresar() y registrar() por la llamada real.
   Toda la validación de arriba se queda igual.
   ========================================================================= */

/* Muestra un mensaje bajo el formulario */
function mostrarMensaje(texto, tipo = 'error') {
    const caja = document.getElementById('mensaje');
    if (!caja) return;
    caja.textContent = texto;
    caja.className = `mensaje-cuenta ${tipo}`;
    caja.hidden = false;
}

/* Validación compartida. Devuelve un texto de error, o null si todo está bien */
function validarCorreoYClave(correo, clave, minimoClave = 1) {
    if (!correo) return 'Escribe tu correo.';
    if (!correo.includes('@') || !correo.includes('.')) return 'Ese correo no parece válido.';
    if (!clave) return 'Escribe tu contraseña.';
    if (clave.length < minimoClave) return `La contraseña necesita al menos ${minimoClave} caracteres.`;
    return null;
}

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------- INGRESAR ----------------------------- */
    const formIngreso = document.getElementById('formulario-ingreso');
    if (formIngreso) {
        formIngreso.addEventListener('submit', (e) => {
            e.preventDefault();

            const correo = document.getElementById('correo').value.trim();
            const clave  = document.getElementById('clave').value;

            const error = validarCorreoYClave(correo, clave);
            if (error) { mostrarMensaje(error); return; }

            /* AQUÍ irá la llamada real cuando exista el backend */
            mostrarMensaje(
                'El ingreso todavía no está habilitado. Escríbenos desde Contactos y te ayudamos con tu ficha.',
                'error'
            );
        });
    }

    /* ---------------------------- REGISTRARSE ---------------------------- */
    const formRegistro = document.getElementById('formulario-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const tipo   = document.getElementById('tipo-cuenta').value;
            const correo = document.getElementById('correo').value.trim();
            const clave  = document.getElementById('clave').value;

            if (!nombre) { mostrarMensaje('Escribe tu nombre.'); return; }
            if (!tipo)   { mostrarMensaje('Elige qué tipo de cuenta quieres crear.'); return; }

            const error = validarCorreoYClave(correo, clave, 8);
            if (error) { mostrarMensaje(error); return; }

            /* AQUÍ irá la creación real de la cuenta */
            mostrarMensaje(
                'El registro todavía no está habilitado. Mándanos tus datos desde Contactos y creamos tu ficha.',
                'error'
            );
        });
    }
});
