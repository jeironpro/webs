// Clase de administrador de notificaciones
class GestorNotificaciones {
    constructor() {
        this.permisoNotificacion = 'default';
        this.verificacionInterval = null;
        this.tareasNotificadas = new Set();

        this.init();
    }

    async init() {
        // Solicitar permiso de notificaciones
        if ('Notification' in window) {
            await this.solicitarPermiso();
            this.iniciarVerificacionPeriodica();
        }
    }

    async solicitarPermiso() {
        if (Notification.permission === 'default') {
            const permiso = await Notification.requestPermission();
            this.permisoNotificacion = permiso;

            if (permiso === 'granted') {
                this.crearNotificacion('Sistema de notificaciones activado', 'Recibirás alertas un día antes de que venzan tus tareas.');
            }
        } else if (Notification.permission === 'granted') {
            this.permisoNotificacion = 'granted';
            this.iniciarVerificacionPeriodica();
        }
    }

    iniciarVerificacionPeriodica() {
        // Verificar cada 30 minutos
        this.verificacionInterval = setInterval(() => {
            this.verificarTareasProximas();
        }, 30 * 60 * 1000);

        // Verificación inicial
        this.verificarTareasProximas();
    }

    verificarTareasProximas() {
        if (this.permisoNotificacion !== 'granted') return;

        const ahora = new Date();
        const manana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const despuesDeManana = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);

        // Obtener tareas del tablero
        if (window.tableroKanban) {
            const tareas = window.tableroKanban.tareas;

            tareas.forEach(tarea => {
                if (tarea.fechaFin && !this.tareasNotificadas.has(tarea.id)) {
                    const fechaFin = new Date(tarea.fechaFin);

                    // Si la tarea vence mañana y no se ha notificado
                    if (fechaFin >= manana && fechaFin < despuesDeManana) {
                        this.programarNotificacion(tarea);
                    }
                }
            });
        }
    }

    programarNotificacion(tarea) {
        const fechaFin = new Date(tarea.fechaFin);
        const ahora = new Date();
        const tiempoHastaManana = new Date(fechaFin);
        tiempoHastaManana.setDate(tiempoHastaManana.getDate() - 1); // Un día antes
        tiempoHastaManana.setHours(9, 0, 0, 0); // A las 9 AM

        const tiempoNotificacion = tiempoHastaManana.getTime() - ahora.getTime();

        if (tiempoNotificacion > 0) {
            setTimeout(() => {
                this.enviarNotificacionVencimiento(tarea);
                this.tareasNotificadas.add(tarea.id);
            }, tiempoNotificacion);
        } else if (fechaFin > ahora && fechaFin < new Date(ahora.getTime() + 24 * 60 * 60 * 1000)) {
            // Si ya es mañana pero antes de las 9 AM
            this.enviarNotificacionVencimiento(tarea);
            this.tareasNotificadas.add(tarea.id);
        }
    }

    enviarNotificacionVencimiento(tarea) {
        const fechaFinFormateada = this.formatearFecha(tarea.fechaFin);
        const mensajeNotificacion = `"${tarea.titulo}"\nFecha límite: ${fechaFinFormateada}\n\nHaz clic para ver detalles`;
        const iconoNotificacion = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="a" x1="0" y1="0" x2="32" y2="32"><stop offset="0" stop-color="%23FFAB00"/><stop offset="1" stop-color="%23DE350B"/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(%23a)"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="20" font-weight="bold">!</text></svg>';

        const notificacion = new Notification('⏰ Tarea por vencer mañana', {
            body: mensajeNotificacion,
            icon: iconoNotificacion,
            tag: `tarea-${tarea.id}`,
            requireInteraction: true
        });

        // Al hacer clic en la notificación
        notificacion.onclick = () => {
            window.focus();
            notificacion.close();
            // Buscar y resaltar la tarea
            const tarjetaTarea = document.querySelector(`[data-id="${tarea.id}"]`);
            if (tarjetaTarea) {
                tarjetaTarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                tarjetaTarea.style.animation = 'pulse 2s ease-in-out';
            }
        };

        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            notificacion.close();
        }, 10000);
    }

    mostrarNotificacion(titulo, opciones = {}) {
        if (this.permisoNotificacion !== 'granted') return;

        this.crearNotificacion(titulo, opciones.body || '', opciones.icon);
    }

    crearNotificacion(titulo, mensaje, iconoCustom = null) {
        if (this.permisoNotificacion !== 'granted') return;

        const iconoPorDefecto = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%230052CC"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="20">ℹ</text></svg>';
        const iconoFinal = iconoCustom || iconoPorDefecto;

        const notificacion = new Notification(titulo, {
            body: mensaje,
            icon: iconoFinal
        });

        setTimeout(() => {
            notificacion.close();
        }, 5000);
    }

    formatearFecha(fechaISO) {
        if (!fechaISO) return '';

        const fecha = new Date(fechaISO);
        const opciones = {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };

        return fecha.toLocaleDateString('es-ES', opciones);
    }

    limpiarNotificaciones() {
        this.tareasNotificadas.clear();
    }
}

// Tablero Kanban JavaScript con almacenamiento local
class TableroKanban {
    constructor() {
        this.tareas = [];
        this.filtroActual = 'todas';
        this.elementoArrastrado = null;
        this.contadorIdTareas = 1;
        this.confirmacionCallback = null;

        this.init();
    }

    init() {
        this.cargarTareasDesdeAlmacenamiento();
        this.renderizarTodasTareas();
        this.configurarEventListeners();
        this.actualizarContadoresTareas();
    }

    // Métodos de almacenamiento local
    cargarTareasDesdeAlmacenamiento() {
        const tareasAlmacenadas = localStorage.getItem('tareasKanban');
        const contadorAlmacenado = localStorage.getItem('contadorTareasKanban');

        if (tareasAlmacenadas) {
            try {
                this.tareas = JSON.parse(tareasAlmacenadas);
            } catch (error) {
                console.error('Error al cargar tareas desde almacenamiento:', error);
                this.tareas = this.obtenerTareasPorDefecto();
                this.guardarTareasEnAlmacenamiento();
            }
        } else {
            this.tareas = this.obtenerTareasPorDefecto();
            this.guardarTareasEnAlmacenamiento();
        }

        if (contadorAlmacenado) {
            this.contadorIdTareas = parseInt(contadorAlmacenado, 10);
        } else {
            this.contadorIdTareas = this.tareas.length > 0 ?
                Math.max(...this.tareas.map(t => parseInt(t.id, 10))) + 1 : 1;
        }
    }

    guardarTareasEnAlmacenamiento() {
        try {
            localStorage.setItem('tareasKanban', JSON.stringify(this.tareas));
            localStorage.setItem('contadorTareasKanban', this.contadorIdTareas.toString());
        } catch (error) {
            console.error('Error al guardar tareas en almacenamiento:', error);
            this.mostrarNotificacion('Error al guardar las tareas');
        }
    }

    obtenerTareasPorDefecto() {
        return [];
    }

    renderizarTodasTareas() {
        // Borrar todas las tareas existentes del DOM
        document.querySelectorAll('.tarjeta-tarea').forEach(card => card.remove());

        // Representar tareas en sus respectivas columnas
        this.tareas.forEach(tarea => {
            this.renderizarTarea(tarea);
        });
    }

    configurarEventListeners() {
        // Controles modales
        const botonAgregarTarea = document.getElementById('boton-agregar-tarea');
        const modalTarea = document.getElementById('modal-tarea');
        const cerrarModal = document.getElementById('cerrar-modal');
        const botonCancelar = document.getElementById('boton-cancelar');
        const formularioTarea = document.querySelector('.formulario-tarea');

        // Controles modales de confirmación
        const modalConfirmacion = document.getElementById('modal-confirmacion');
        const cerrarModalConfirmacion = document.getElementById('cerrar-modal-confirmacion');
        const botonCancelarConfirmacion = document.getElementById('boton-cancelar-confirmacion');
        const botonConfirmarConfirmacion = document.getElementById('boton-confirmar-confirmacion');

        botonAgregarTarea.addEventListener('click', () => this.abrirModal());
        cerrarModal.addEventListener('click', () => this.cerrarModal());
        botonCancelar.addEventListener('click', () => this.cerrarModal());

        modalTarea.addEventListener('click', (e) => {
            if (e.target === modalTarea) {
                this.cerrarModal();
            }
        });

        // Escuchadores de eventos modales de confirmación
        cerrarModalConfirmacion.addEventListener('click', () => this.cerrarModalConfirmacion());
        botonCancelarConfirmacion.addEventListener('click', () => this.cerrarModalConfirmacion());

        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === modalConfirmacion) {
                this.cerrarModalConfirmacion();
            }
        });

        botonConfirmarConfirmacion.addEventListener('click', () => {
            if (this.confirmacionCallback) {
                this.confirmacionCallback();
                this.cerrarModalConfirmacion();
            }
        });

        formularioTarea.addEventListener('submit', (e) => {
            e.preventDefault();
            const idEdicion = formularioTarea.dataset.idEdicion;
            if (idEdicion) {
                this.actualizarTarea(idEdicion);
            } else {
                this.crearTarea();
            }
        });

        // Botones de filtro
        const botonesFiltro = document.querySelectorAll('.boton-filtro');
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach(b => b.classList.remove('activo'));
                boton.classList.add('activo');
                this.filtroActual = boton.dataset.filtro;
                this.aplicarFiltro();
            });
        });

        // Arrastrar y soltar
        this.configurarArrastrarSoltar();

        // Menús de columnas
        const menusColumna = document.querySelectorAll('.menu-columna');
        menusColumna.forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.mostrarMenuColumna(menu);
            });
        });

        // Interacciones de la tarjeta de tareas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tarjeta-tarea')) {
                const tarjetaTarea = e.target.closest('.tarjeta-tarea');
                // No abre el modo de edición si hace clic en el botón Eliminar, en el asignado o en las etiquetas
                if (!e.target.closest('.asignado-tarea') &&
                    !e.target.closest('.etiquetas-tarea') &&
                    !e.target.closest('.boton-eliminar-tarea')) {
                    this.editarTarea(tarjetaTarea);
                }
            }
        });
    }

    configurarArrastrarSoltar() {
        const columnas = document.querySelectorAll('.columna');

        columnas.forEach(columna => {
            const contenidoColumna = columna.querySelector('.contenido-columna');

            contenidoColumna.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                if (this.elementoArrastrado && !contenidoColumna.contains(this.elementoArrastrado)) {
                    columna.classList.add('arrastrar-sobre');
                }
            });

            contenidoColumna.addEventListener('dragleave', () => {
                columna.classList.remove('arrastrar-sobre');
            });

            contenidoColumna.addEventListener('drop', (e) => {
                e.preventDefault();
                columna.classList.remove('arrastrar-sobre');

                if (this.elementoArrastrado) {
                    const nuevoEstado = columna.dataset.estado;
                    this.moverTarea(this.elementoArrastrado, nuevoEstado);
                }
            });
        });
    }

    moverTarea(tarjetaTarea, nuevoEstado) {
        const viejaColumna = tarjetaTarea.closest('.columna');
        const nuevaColumna = document.querySelector(`[data-estado="${nuevoEstado}"] .contenido-columna`);

        if (nuevaColumna && !nuevaColumna.contains(tarjetaTarea)) {
            nuevaColumna.appendChild(tarjetaTarea);

            // Actualizar datos de la tarea
            const idTarea = tarjetaTarea.dataset.id;
            const tarea = this.tareas.find(t => t.id === idTarea);
            if (tarea) {
                tarea.estado = nuevoEstado;
                this.guardarTareasEnAlmacenamiento();
            }

            this.actualizarContadoresTareas();
            this.mostrarNotificacion('Tarea movida exitosamente');
        }
    }

    abrirModal(datosTarea = null) {
        const modalTarea = document.getElementById('modal-tarea');
        const tituloModal = modalTarea.querySelector('h3');
        const formulario = document.querySelector('.formulario-tarea');

        if (datosTarea) {
            tituloModal.textContent = 'Editar Tarea';
            document.getElementById('titulo-tarea').value = datosTarea.titulo;
            document.getElementById('descripcion-tarea').value = datosTarea.descripcion;
            document.getElementById('prioridad-tarea').value = datosTarea.prioridad;
            document.getElementById('estado-tarea').value = datosTarea.estado;
            document.getElementById('etiquetas-tarea').value = datosTarea.etiquetas.join(', ');
            document.getElementById('fecha-inicio-tarea').value = datosTarea.fechaInicio || '';
            document.getElementById('fecha-fin-tarea').value = datosTarea.fechaFin || '';
            formulario.dataset.idEdicion = datosTarea.id;

            // Cambiar texto del botón a "Actualizar Tarea"
            const botonSubmit = formulario.querySelector('button[type="submit"]');
            botonSubmit.textContent = 'Actualizar Tarea';
        } else {
            tituloModal.textContent = 'Crear Nueva Tarea';
            formulario.reset();
            delete formulario.dataset.idEdicion;

            // Cambiar texto del botón a "Crear Tarea"
            const botonSubmit = formulario.querySelector('button[type="submit"]');
            botonSubmit.textContent = 'Crear Tarea';
        }

        modalTarea.classList.add('activo');
    }

    cerrarModal() {
        const modalTarea = document.getElementById('modal-tarea');
        modalTarea.classList.remove('activo');
    }

    crearTarea() {
        const titulo = document.getElementById('titulo-tarea').value;
        const descripcion = document.getElementById('descripcion-tarea').value;
        const prioridad = document.getElementById('prioridad-tarea').value;
        const estado = document.getElementById('estado-tarea').value;
        const etiquetas = document.getElementById('etiquetas-tarea').value.split(',').map(etiqueta => etiqueta.trim()).filter(etiqueta => etiqueta);
        const fechaInicio = document.getElementById('fecha-inicio-tarea').value;
        const fechaFin = document.getElementById('fecha-fin-tarea').value;

        const datosTarea = {
            id: this.contadorIdTareas.toString(),
            titulo,
            descripcion,
            prioridad,
            estado,
            etiquetas,
            idTarea: `PROJ-${String(this.contadorIdTareas).padStart(3, '0')}`,
            fechaInicio,
            fechaFin
        };

        this.tareas.push(datosTarea);
        this.renderizarTarea(datosTarea);
        this.actualizarContadoresTareas();
        this.guardarTareasEnAlmacenamiento();
        this.cerrarModal();
        this.mostrarNotificacion('Tarea creada exitosamente');

        // Verificar si se necesita programar notificación
        if (window.gestorNotificaciones && datosTarea.fechaFin) {
            window.gestorNotificaciones.verificarTareasProximas();
        }

        this.contadorIdTareas++;
    }

    actualizarTarea(idTarea) {
        const tarea = this.tareas.find(t => t.id === idTarea);
        if (!tarea) return;

        const titulo = document.getElementById('titulo-tarea').value;
        const descripcion = document.getElementById('descripcion-tarea').value;
        const prioridad = document.getElementById('prioridad-tarea').value;
        const estado = document.getElementById('estado-tarea').value;
        const etiquetas = document.getElementById('etiquetas-tarea').value.split(',').map(etiqueta => etiqueta.trim()).filter(etiqueta => etiqueta);
        const fechaInicio = document.getElementById('fecha-inicio-tarea').value;
        const fechaFin = document.getElementById('fecha-fin-tarea').value;

        tarea.titulo = titulo;
        tarea.descripcion = descripcion;
        tarea.prioridad = prioridad;
        tarea.estado = estado;
        tarea.etiquetas = etiquetas;
        tarea.fechaInicio = fechaInicio;
        tarea.fechaFin = fechaFin;

        this.guardarTareasEnAlmacenamiento();
        this.renderizarTodasTareas();
        this.actualizarContadoresTareas();
        this.cerrarModal();
        this.mostrarNotificacion('Tarea actualizada exitosamente');

        // Verificar si se necesita programar notificación
        if (window.gestorNotificaciones && fechaFin) {
            window.gestorNotificaciones.verificarTareasProximas();
        }
    }

    editarTarea(tarjetaTarea) {
        const idTarea = tarjetaTarea.dataset.id;
        const tarea = this.tareas.find(t => t.id === idTarea);

        if (tarea) {
            this.abrirModal(tarea);
        }
    }

    eliminarTarea(idTarea) {
        const tarea = this.tareas.find(t => t.id === idTarea);

        if (tarea) {
            this.mostrarModalConfirmacion(
                'Eliminar Tarea',
                `¿Estás seguro de que quieres eliminar la tarea "${tarea.titulo}"?`,
                'Esta acción no se puede deshacer.',
                'danger',
                'Eliminar Tarea',
                () => {
                    this.tareas = this.tareas.filter(t => t.id !== idTarea);
                    this.reorganizarIdsTareas();
                    this.renderizarTodasTareas();
                    this.actualizarContadoresTareas();
                    this.mostrarNotificacion('Tarea eliminada exitosamente');
                }
            );
        }
    }

    reorganizarIdsTareas() {
        // Ordenar tareas por su ID numérico actual
        this.tareas.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        
        // Reasignar IDs continuos
        this.tareas.forEach((tarea, indice) => {
            const nuevoId = (indice + 1).toString();
            const nuevoIdTarea = `PROJ-${String(indice + 1).padStart(3, '0')}`;
            
            // Actualizar la tarea con los nuevos IDs
            tarea.id = nuevoId;
            tarea.idTarea = nuevoIdTarea;
        });
        
        // Actualizar el contador al siguiente ID disponible
        this.contadorIdTareas = this.tareas.length + 1;
        
        // Guardar cambios en localStorage
        this.guardarTareasEnAlmacenamiento();
    }

    mostrarModalConfirmacion(titulo, mensaje, descripcion, tipo = 'warning', textoBoton = 'Confirmar', callback) {
        const modalConfirmacion = document.getElementById('modal-confirmacion');
        const tituloConfirmacion = document.getElementById('titulo-confirmacion');
        const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
        const descripcionConfirmacion = document.getElementById('descripcion-confirmacion');
        const iconoConfirmacion = document.getElementById('icono-confirmacion');
        const textoBotonConfirmar = document.getElementById('texto-boton-confirmar');
        const botonConfirmar = document.getElementById('boton-confirmar-confirmacion');

        // Establecer contenido
        tituloConfirmacion.textContent = titulo;
        mensajeConfirmacion.textContent = mensaje;
        descripcionConfirmacion.textContent = descripcion;
        textoBotonConfirmar.textContent = textoBoton;

        // Establecer el estilo de icono y botón
        iconoConfirmacion.className = `icono-confirmacion ${tipo}`;
        botonConfirmar.className = `boton ${tipo === 'danger' ? 'boton-peligro' : 'boton-primario'}`;

        // Establecer devolución de llamada
        this.confirmacionCallback = callback;

        // Mostrar modal
        modalConfirmacion.classList.add('activo');
    }

    cerrarModalConfirmacion() {
        const modalConfirmacion = document.getElementById('modal-confirmacion');
        modalConfirmacion.classList.remove('activo');
        this.confirmacionCallback = null;
    }

    renderizarTarea(datosTarea) {
        const contenidoColumna = document.querySelector(`[data-estado="${datosTarea.estado}"] .contenido-columna`);

        const tarjetaTarea = document.createElement('div');
        tarjetaTarea.className = 'tarjeta-tarea';
        tarjetaTarea.draggable = true;
        tarjetaTarea.dataset.id = datosTarea.id;
        tarjetaTarea.dataset.prioridad = datosTarea.prioridad;

        const clasePrioridad = `prioridad-${datosTarea.prioridad}`;
        const elementosEtiqueta = datosTarea.etiquetas.map(etiqueta => {
            const claseEtiqueta = this.obtenerClaseEtiqueta(etiqueta);
            return `<span class="etiqueta etiqueta-${claseEtiqueta}">${etiqueta}</span>`;
        });

        // Crear estructura de la tarjeta usando createElement
        const encabezadoTarea = document.createElement('div');
        encabezadoTarea.className = 'encabezado-tarea';

        const idTareaSpan = document.createElement('span');
        idTareaSpan.className = 'id-tarea';
        idTareaSpan.textContent = datosTarea.idTarea;

        const prioridadTarea = document.createElement('div');
        prioridadTarea.className = `prioridad-tarea ${clasePrioridad}`;

        encabezadoTarea.appendChild(idTareaSpan);
        encabezadoTarea.appendChild(prioridadTarea);

        const tituloTarea = document.createElement('h4');
        tituloTarea.className = 'titulo-tarea';
        tituloTarea.textContent = datosTarea.titulo;

        const descripcionTarea = document.createElement('p');
        descripcionTarea.className = 'descripcion-tarea';
        descripcionTarea.textContent = datosTarea.descripcion;

        // Añadir fechas si existen
        const fechaInicioFormateada = datosTarea.fechaInicio ? this.formatearFecha(datosTarea.fechaInicio) : '';
        const fechaFinFormateada = datosTarea.fechaFin ? this.formatearFecha(datosTarea.fechaFin) : '';

        if (fechaInicioFormateada || fechaFinFormateada) {
            const estadoVencimiento = this.obtenerEstadoVencimiento(datosTarea.fechaFin);
            const claseVencimiento = estadoVencimiento.clase;
            const iconoVencimiento = estadoVencimiento.icono;

            const fechasTarea = document.createElement('div');
            fechasTarea.className = `fechas-tarea ${claseVencimiento}`;

            if (fechaInicioFormateada) {
                const fechaInicioItem = document.createElement('div');
                fechaInicioItem.className = 'fecha-item';

                const iconoInicio = document.createElement('i');
                iconoInicio.className = 'fas fa-calendar-alt';
                iconoInicio.textContent = ` ${fechaInicioFormateada}`;

                fechaInicioItem.appendChild(iconoInicio);
                fechasTarea.appendChild(fechaInicioItem);
            }

            if (fechaFinFormateada) {
                const fechaFinItem = document.createElement('div');
                fechaFinItem.className = `fecha-item fecha-fin ${claseVencimiento}`;

                const iconoFin = document.createElement('i');
                iconoFin.className = `fas ${iconoVencimiento}`;
                iconoFin.textContent = ` ${fechaFinFormateada}`;

                fechaFinItem.appendChild(iconoFin);
                fechasTarea.appendChild(fechaFinItem);
            }

            tarjetaTarea.appendChild(fechasTarea);
        }

        // Añadir títulos y descripción
        tarjetaTarea.appendChild(encabezadoTarea);
        tarjetaTarea.appendChild(tituloTarea);
        tarjetaTarea.appendChild(descripcionTarea);

        // Añadir pie con etiquetas y acciones
        const pieTarea = document.createElement('div');
        pieTarea.className = 'pie-tarea';

        const etiquetasTarea = document.createElement('div');
        etiquetasTarea.className = 'etiquetas-tarea';

        // Añadir etiquetas
        elementosEtiqueta.forEach(etiquetaHtml => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = etiquetaHtml;
            const etiquetaElement = tempDiv.firstChild;
            etiquetasTarea.appendChild(etiquetaElement);
        });

        const accionesTarea = document.createElement('div');
        accionesTarea.className = 'acciones-tarea';

        const asignadoTarea = document.createElement('div');
        asignadoTarea.className = 'asignado-tarea';

        const iconoUsuario = document.createElement('i');
        iconoUsuario.className = 'fas fa-user';
        asignadoTarea.appendChild(iconoUsuario);

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'boton-eliminar-tarea';
        botonEliminar.onclick = () => this.eliminarTarea(datosTarea.id);

        const iconoEliminar = document.createElement('i');
        iconoEliminar.className = 'fas fa-trash';

        botonEliminar.appendChild(iconoEliminar);

        accionesTarea.appendChild(asignadoTarea);
        accionesTarea.appendChild(botonEliminar);

        pieTarea.appendChild(etiquetasTarea);
        pieTarea.appendChild(accionesTarea);

        tarjetaTarea.appendChild(pieTarea);

        contenidoColumna.appendChild(tarjetaTarea);

        // Reconfigurar la función de arrastrar y soltar para la nueva tarjeta
        tarjetaTarea.addEventListener('dragstart', (e) => {
            this.elementoArrastrado = tarjetaTarea;
            tarjetaTarea.classList.add('arrastrando');
            e.dataTransfer.effectAllowed = 'move';
        });

        tarjetaTarea.addEventListener('dragend', () => {
            tarjetaTarea.classList.remove('arrastrando');
            this.elementoArrastrado = null;
        });
    }

    formatearFecha(fechaISO) {
        if (!fechaISO) return '';

        const fecha = new Date(fechaISO);
        const opciones = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        return fecha.toLocaleDateString('es-ES', opciones);
    }

    obtenerEstadoVencimiento(fechaFinISO) {
        if (!fechaFinISO) {
            return { clase: '', icono: 'fa-check-circle' };
        }

        const ahora = new Date();
        const fechaFin = new Date(fechaFinISO);
        const manana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const tresDias = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Vencida
        if (fechaFin < ahora) {
            return { clase: 'vencida', icono: 'fa-exclamation-circle' };
        }

        // Vence hoy
        if (fechaFin.toDateString() === ahora.toDateString()) {
            return { clase: 'vence-hoy', icono: 'fa-clock' };
        }

        // Vence mañana
        if (fechaFin <= manana) {
            return { clase: 'vence-manana', icono: 'fa-exclamation-triangle' };
        }

        // Vence en menos de 3 días
        if (fechaFin <= tresDias) {
            return { clase: 'vence-pronto', icono: 'fa-bell' };
        }

        // Normal
        return { clase: 'normal', icono: 'fa-check-circle' };
    }

    obtenerClaseEtiqueta(etiqueta) {
        const mapaEtiquetas = {
            'diseño': 'design',
            'frontend': 'frontend',
            'backend': 'backend',
            'docs': 'docs',
            'documentación': 'docs',
            'investigación': 'research',
            'seguridad': 'security',
            'performance': 'performance',
            'rendimiento': 'performance',
            'testing': 'testing',
            'review': 'review',
            'mantenimiento': 'maintenance',
            'devops': 'devops',
            'setup': 'setup',
            'arquitectura': 'architecture',
            'reunión': 'meeting'
        };

        return mapaEtiquetas[etiqueta.toLowerCase()] || 'design';
    }

    actualizarContadoresTareas() {
        const columnas = document.querySelectorAll('.columna');

        columnas.forEach(columna => {
            const contadorTareas = columna.querySelectorAll('.tarjeta-tarea').length;
            const elementoContador = columna.querySelector('.contador-tareas');
            elementoContador.textContent = contadorTareas;
        });

        // Actualizar las estadísticas del tablero
        const totalTareas = document.querySelectorAll('.tarjeta-tarea').length;
        const estadisticasTablero = document.querySelector('.estadisticas-tablero');
        estadisticasTablero.textContent = `${totalTareas} tareas`;
    }

    aplicarFiltro() {
        const tarjetasTarea = document.querySelectorAll('.tarjeta-tarea');

        tarjetasTarea.forEach(tarjeta => {
            const prioridad = tarjeta.dataset.prioridad;

            if (this.filtroActual === 'todas') {
                tarjeta.style.display = 'block';
            } else if (this.filtroActual === 'alta' && prioridad === 'alta') {
                tarjeta.style.display = 'block';
            } else if (this.filtroActual === 'media' && prioridad === 'media') {
                tarjeta.style.display = 'block';
            } else if (this.filtroActual === 'baja' && prioridad === 'baja') {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    mostrarMenuColumna(botonMenu) {
        const columna = botonMenu.closest('.columna');
        const tituloColumna = columna.querySelector('.titulo-columna h3').textContent;

        // Crear opciones modales
        const opcionesModal = document.createElement('div');
        opcionesModal.className = 'modal activo';

        // Crear contenido modal usando createElement
        const contenidoModal = document.createElement('div');
        contenidoModal.className = 'contenido-modal modal-opciones';

        // Encabezado modal
        const encabezadoModal = document.createElement('div');
        encabezadoModal.className = 'encabezado-modal';

        const tituloModal = document.createElement('h3');
        tituloModal.textContent = 'Acciones de Columna';

        const botonCerrar = document.createElement('button');
        botonCerrar.className = 'cerrar-modal';

        const iconoCerrar = document.createElement('i');
        iconoCerrar.className = 'fas fa-times';

        botonCerrar.appendChild(iconoCerrar);
        encabezadoModal.appendChild(tituloModal);
        encabezadoModal.appendChild(botonCerrar);

        // Cuerpo modal
        const cuerpoModal = document.createElement('div');
        cuerpoModal.className = 'cuerpo-modal';

        const tituloColumnaH4 = document.createElement('h4');
        tituloColumnaH4.textContent = `Columna: ${tituloColumna}`;

        const listaOpciones = document.createElement('div');
        listaOpciones.className = 'lista-opciones';

        // Opción: Limpiar columna
        const opcionLimpiar = document.createElement('button');
        opcionLimpiar.className = 'opcion-menu';
        opcionLimpiar.dataset.accion = 'limpiar';

        const iconoLimpiar = document.createElement('i');
        iconoLimpiar.className = 'fas fa-broom';

        const spanLimpiar = document.createElement('span');
        spanLimpiar.textContent = 'Limpiar columna';

        const smallLimpiar = document.createElement('small');
        smallLimpiar.textContent = 'Eliminar todas las tareas de esta columna';

        opcionLimpiar.appendChild(iconoLimpiar);
        opcionLimpiar.appendChild(spanLimpiar);
        opcionLimpiar.appendChild(smallLimpiar);

        // Opción: Exportar tareas
        const opcionExportar = document.createElement('button');
        opcionExportar.className = 'opcion-menu';
        opcionExportar.dataset.accion = 'exportar';

        const iconoExportar = document.createElement('i');
        iconoExportar.className = 'fas fa-download';

        const spanExportar = document.createElement('span');
        spanExportar.textContent = 'Exportar tareas';

        const smallExportar = document.createElement('small');
        smallExportar.textContent = 'Descargar todas las tareas en formato JSON';

        opcionExportar.appendChild(iconoExportar);
        opcionExportar.appendChild(spanExportar);
        opcionExportar.appendChild(smallExportar);

        // Opción: Cancelar
        const opcionCancelar = document.createElement('button');
        opcionCancelar.className = 'opcion-menu opcion-cancelar';
        opcionCancelar.dataset.accion = 'cancelar';

        const iconoCancelar = document.createElement('i');
        iconoCancelar.className = 'fas fa-times';

        const spanCancelar = document.createElement('span');
        spanCancelar.textContent = 'Cancelar';

        const smallCancelar = document.createElement('small');
        smallCancelar.textContent = 'Cerrar este menú';

        opcionCancelar.appendChild(iconoCancelar);
        opcionCancelar.appendChild(spanCancelar);
        opcionCancelar.appendChild(smallCancelar);

        // Ensamblar estructura
        listaOpciones.appendChild(opcionLimpiar);
        listaOpciones.appendChild(opcionExportar);
        listaOpciones.appendChild(opcionCancelar);

        cuerpoModal.appendChild(tituloColumnaH4);
        cuerpoModal.appendChild(listaOpciones);

        contenidoModal.appendChild(encabezadoModal);
        contenidoModal.appendChild(cuerpoModal);

        opcionesModal.appendChild(contenidoModal);

        document.body.appendChild(opcionesModal);

        // Agregar detectores de eventos
        const botonesOpcion = [opcionLimpiar, opcionExportar, opcionCancelar];

        botonCerrar.addEventListener('click', () => {
            opcionesModal.remove();
        });

        opcionesModal.addEventListener('click', (e) => {
            if (e.target === opcionesModal) {
                opcionesModal.remove();
            }
        });

        botonesOpcion.forEach(boton => {
            boton.addEventListener('click', () => {
                const accion = boton.dataset.accion;

                switch (accion) {
                    case 'limpiar':
                        this.limpiarColumna(columna);
                        break;
                    case 'exportar':
                        this.exportarTareas();
                        break;
                    case 'cancelar':
                    default:
                        break;
                }

                opcionesModal.remove();
            });
        });

        // Cerrar al escapar
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                opcionesModal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    limpiarColumna(columna) {
        const tituloColumna = columna.querySelector('.titulo-columna h3').textContent;

        this.mostrarModalConfirmacion(
            'Limpiar Columna',
            `¿Deseas limpiar la columna "${tituloColumna}"?`,
            'Esta acción eliminará todas las tareas de esta columna y no se puede deshacer.',
            'danger',
            'Limpiar Columna',
            () => {
                const contenidoColumna = columna.querySelector('.contenido-columna');
                const tareas = contenidoColumna.querySelectorAll('.tarjeta-tarea');
                const idsTareas = Array.from(tareas).map(tarea => tarea.dataset.id);

                // Eliminar tareas de los datos
                this.tareas = this.tareas.filter(tarea => !idsTareas.includes(tarea.id));

                // Reorganizar IDs para mantener continuidad
                this.reorganizarIdsTareas();

                // Eliminar del DOM
                tareas.forEach(tarea => tarea.remove());

                this.renderizarTodasTareas();
                this.actualizarContadoresTareas();
                this.mostrarNotificacion('Columna limpiada');
            }
        );
    }

    mostrarNotificacion(mensaje) {
        // Crear una notificación sencilla
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notificacion.textContent = mensaje;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }, 3000);
    }

    // Funciones adicionales
    exportarTareas() {
        const datosStr = JSON.stringify(this.tareas, null, 2);
        const datosUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(datosStr);

        const nombreArchivoPorDefecto = 'tareas-kanban.json';

        const elementoEnlace = document.createElement('a');
        elementoEnlace.setAttribute('href', datosUri);
        elementoEnlace.setAttribute('download', nombreArchivoPorDefecto);
        elementoEnlace.click();

        this.mostrarNotificacion('Tareas exportadas');
    }

    importarTareas(archivo) {
        const lector = new FileReader();
        lector.onload = (e) => {
            try {
                const tareasImportadas = JSON.parse(e.target.result);
                this.tareas = [...this.tareas, ...tareasImportadas];
                this.guardarTareasEnAlmacenamiento();
                this.renderizarTodasTareas();
                this.actualizarContadoresTareas();

                this.mostrarNotificacion('Tareas importadas exitosamente');
            } catch (error) {
                this.mostrarNotificacion('Error al importar tareas');
            }
        };
        lector.readAsText(archivo);
    }

    // Funcionalidad de búsqueda
    buscarTareas(consulta) {
        const tarjetasTarea = document.querySelectorAll('.tarjeta-tarea');

        tarjetasTarea.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('.titulo-tarea').textContent.toLowerCase();
            const descripcion = tarjeta.querySelector('.descripcion-tarea').textContent.toLowerCase();
            const idTarea = tarjeta.querySelector('.id-tarea').textContent.toLowerCase();

            const coincideBusqueda = titulo.includes(consulta.toLowerCase()) ||
                descripcion.includes(consulta.toLowerCase()) ||
                idTarea.includes(consulta.toLowerCase());

            tarjeta.style.display = coincideBusqueda ? 'block' : 'none';
        });
    }

    // Borrar todos los datos
    limpiarTodosDatos() {
        this.mostrarModalConfirmacion(
            'Eliminar Todas las Tareas',
            '¿Estás seguro de que quieres eliminar todas las tareas?',
            'Esta acción no se puede deshacer y eliminará permanentemente todos los datos del tablero.',
            'danger',
            'Eliminar Todo',
            () => {
                localStorage.removeItem('tareasKanban');
                localStorage.removeItem('contadorTareasKanban');
                this.tareas = [];
                this.contadorIdTareas = 1;
                this.renderizarTodasTareas();
                this.actualizarContadoresTareas();
                this.mostrarNotificacion('Todos los datos han sido eliminados');
            }
        );
    }
}

// Inicializar el tablero Kanban cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const tableroKanban = new TableroKanban();

    // Inicializar gestor de notificaciones
    window.gestorNotificaciones = new GestorNotificaciones();

    // Agregar atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N: Nueva tarea
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('boton-agregar-tarea').click();
        }

        // Escape: Cerrar modal
        if (e.key === 'Escape') {
            const modalTarea = document.getElementById('modal-tarea');
            const modalConfirmacion = document.getElementById('modal-confirmacion');
            if (modalTarea.classList.contains('activo')) {
                tableroKanban.cerrarModal();
            }
            if (modalConfirmacion.classList.contains('activo')) {
                tableroKanban.cerrarModalConfirmacion();
            }
        }

        // Ctrl/Cmd + E: Exportar tareas
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            tableroKanban.exportarTareas();
        }

        // Ctrl/Cmd + Shift + C: Borrar todos los datos
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            tableroKanban.limpiarTodosDatos();
        }

        // Ctrl/Cmd + R: Comprobar notificaciones manualmente
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            if (window.gestorNotificaciones) {
                window.gestorNotificaciones.verificarTareasProximas();
                tableroKanban.mostrarNotificacion('Verificación de notificaciones realizada');
            }
        }
    });

    // Añade un toque de elegancia con un desplazamiento suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Agregar un controlador de cambio de tamaño de ventana para un comportamiento responsivo
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            tableroKanban.actualizarContadoresTareas();
        }, 250);
    });

    // Hacer que tableroKanban sea accesible globalmente para la depuración
    window.tableroKanban = tableroKanban;
});

// Agregue algunos CSS adicionales dinámicamente
const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
    
    .tarjeta-tarea {
        transition: all 0.2s ease;
    }
    
    .tarjeta-tarea:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .columna.arrastrar-sobre {
        background-color: rgba(0, 82, 204, 0.05);
        border-color: var(--primary-color);
    }
    
    .modal.activo {
        animation: fadeIn 0.2s ease;
    }
`;
document.head.appendChild(estilo);