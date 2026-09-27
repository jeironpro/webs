const inputTarea = document.getElementById("tarea")
const listadoTareas = document.getElementById("listadoTarea");
let mensajeError = 'La tarea no puede estar vacía';

function agregarTarea() {
    let tarea = inputTarea.value;
    let tareas = document.createElement("li");
    if (inputTarea.value == '') {
        inputTarea.value = mensajeError;
        inputTarea.style.color = 'red';
        setTimeout(() => {
            limpiarMensajeError();
        }, 2000)
    } else {
        tareas.innerHTML = tarea + '<span class="material-symbols-outlined editar" onclick="editarTarea(this)">edit</span>' + '<span class="material-symbols-outlined eliminar" onclick="eliminarTarea(this)">delete</span>';
        listadoTareas.appendChild(tareas);
        inputTarea.value = '';
    }
}

function editarTarea(elemento) {
    let tareaEditar = elemento.parentElement.firstChild;
    let tareaSeleccionada = tareaEditar.textContent;
    inputTarea.value = tareaSeleccionada;

    if (tareaSeleccionada) {
        elemento.parentElement.remove();
    }
}

function eliminarTarea(elemento) {
    elemento.parentElement.remove();
}

function limpiarMensajeError() {
    inputTarea.value = '';
    inputTarea.style.color = '';
}