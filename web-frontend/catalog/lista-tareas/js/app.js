const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const errorMessage = "La tarea no puede estar vacía";

function addTask() {
    const task = taskInput.value;
    const taskItem = document.createElement("li");

    if (taskInput.value === "") {
        taskInput.value = errorMessage;
        taskInput.classList.add("is-invalid");
        setTimeout(() => {
            clearError();
        }, 2000);
    } else {
        taskItem.append(document.createTextNode(task));
        taskItem.append(createActionButton("edit-task", "edit", editTask));
        taskItem.append(createActionButton("delete-task", "delete", deleteTask));
        taskList.appendChild(taskItem);
        taskInput.value = "";
    }
}

function createActionButton(action, icon, handler) {
    const button = document.createElement("span");
    button.classList.add("material-symbols-outlined", action);
    button.textContent = icon;
    button.addEventListener("click", () => handler(button));
    return button;
}

function editTask(element) {
    const taskText = element.parentElement.firstChild;
    const selectedTask = taskText.textContent;
    taskInput.value = selectedTask;

    if (selectedTask) {
        element.parentElement.remove();
    }
}

function deleteTask(element) {
    element.parentElement.remove();
}

function clearError() {
    taskInput.value = "";
    taskInput.classList.remove("is-invalid");
}

document.getElementById("add-task").addEventListener("click", addTask);
