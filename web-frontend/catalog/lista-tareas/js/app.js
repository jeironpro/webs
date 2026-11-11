const inputTarea = document.getElementById("tarea")
const listadoTareas = document.getElementById("listadoTarea");
let mensajeError = 'La tarea no puede estar vacía';

function agregarTarea() {
    let tarea = inputTarea.value;
    const tareaElemento = document.createElement("li");
    if (inputTarea.value === '') {
        inputTarea.value = mensajeError;
        inputTarea.style.color = 'red';
        setTimeout(() => {
            limpiarMensajeError();
        }, 2000)
    } else {
        tareaElemento.append(document.createTextNode(tarea));
        tareaElemento.append(crearBoton("editar", "edit", editarTarea));
        tareaElemento.append(crearBoton("eliminar", "delete", eliminarTarea));
        listadoTareas.appendChild(tareaElemento);
        inputTarea.value = '';
    }
}

function crearBoton(accion, icono, manejador) {
    const boton = document.createElement("span");
    boton.classList.add("material-symbols-outlined", accion);
    boton.textContent = icono;
    boton.addEventListener("click", () => manejador(boton));
    return boton;
}

function editarTarea(elemento) {
    const tareaEditar = elemento.parentElement.firstChild;
    const tareaSeleccionada = tareaEditar.textContent;
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