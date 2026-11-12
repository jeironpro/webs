// Clase de administrador de notificaciones
class NotificationManager {
    constructor() {
        this.notificationPermission = "default";
        this.verificationInterval = null;
        this.notifiedTasks = new Set();

        this.init();
    }

    async init() {
        // Solicitar permiso de notificaciones
        if ("Notification" in window) {
            await this.requestPermission();
            this.startPeriodicVerification();
        }
    }

    async requestPermission() {
        if (Notification.permission === "default") {
            const permiso = await Notification.requestPermission();
            this.notificationPermission = permiso;

            if (permiso === "granted") {
                this.createNotification(
                    "Sistema de notificaciones activado",
                    "Recibirás alertas un día antes de que venzan tus tareas."
                );
            }
        } else if (Notification.permission === "granted") {
            this.notificationPermission = "granted";
            this.startPeriodicVerification();
        }
    }

    startPeriodicVerification() {
        // Verificar cada 30 minutos
        this.verificationInterval = setInterval(
            () => {
                this.checkUpcomingTasks();
            },
            30 * 60 * 1000
        );

        // Verificación inicial
        this.checkUpcomingTasks();
    }

    checkUpcomingTasks() {
        if (this.notificationPermission !== "granted") return;

        const ahora = new Date();
        const tomorrow = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const dayAfterTomorrow = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);

        // Obtener tareas del tablero
        if (window.kanbanBoard) {
            const tasks = window.kanbanBoard.tasks;

            tasks.forEach((task) => {
                if (task.endDate && !this.notifiedTasks.has(task.id)) {
                    const endDate = new Date(task.endDate);

                    // Si la tarea vence mañana y no se ha notificado
                    if (endDate >= tomorrow && endDate < dayAfterTomorrow) {
                        this.scheduleNotification(task);
                    }
                }
            });
        }
    }

    scheduleNotification(task) {
        const endDate = new Date(task.endDate);
        const ahora = new Date();
        const timeUntilTomorrow = new Date(endDate);
        timeUntilTomorrow.setDate(timeUntilTomorrow.getDate() - 1); // Un día antes
        timeUntilTomorrow.setHours(9, 0, 0, 0); // A las 9 AM

        const notificationDelay = timeUntilTomorrow.getTime() - ahora.getTime();

        if (notificationDelay > 0) {
            setTimeout(() => {
                this.sendDueNotification(task);
                this.notifiedTasks.add(task.id);
            }, notificationDelay);
        } else if (endDate > ahora && endDate < new Date(ahora.getTime() + 24 * 60 * 60 * 1000)) {
            // Si ya es mañana pero antes de las 9 AM
            this.sendDueNotification(task);
            this.notifiedTasks.add(task.id);
        }
    }

    sendDueNotification(task) {
        const formattedEndDate = this.formatDate(task.endDate);
        const notificationMessage = `"${task.title}"\nFecha límite: ${formattedEndDate}\n\nHaz clic para ver detalles`;
        const notificationIcon =
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="a" x1="0" y1="0" x2="32" y2="32"><stop offset="0" stop-color="%23FFAB00"/><stop offset="1" stop-color="%23DE350B"/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(%23a)"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="20" font-weight="bold">!</text></svg>';

        const notification = new Notification("⏰ Tarea por vencer mañana", {
            body: notificationMessage,
            icon: notificationIcon,
            tag: `tarea-${task.id}`,
            requireInteraction: true,
        });

        // Al hacer clic en la notificación
        notification.onclick = () => {
            window.focus();
            notification.close();
            // Buscar y resaltar la tarea
            const taskCard = document.querySelector(`[data-id="${task.id}"]`);
            if (taskCard) {
                taskCard.scrollIntoView({ behavior: "smooth", block: "center" });
                taskCard.style.animation = "pulse 2s ease-in-out";
            }
        };

        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            notification.close();
        }, 10000);
    }

    showNotification(title, options = {}) {
        if (this.notificationPermission !== "granted") return;

        this.createNotification(title, options.body || "", options.icon);
    }

    createNotification(title, message, customIcon = null) {
        if (this.notificationPermission !== "granted") return;

        const defaultIcon =
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%230052CC"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="20">ℹ</text></svg>';
        const finalIcon = customIcon || defaultIcon;

        const notification = new Notification(title, {
            body: message,
            icon: finalIcon,
        });

        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    formatDate(dateISO) {
        if (!dateISO) return "";

        const date = new Date(dateISO);
        const options = {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        };

        return date.toLocaleDateString("es-ES", options);
    }

    clearNotifications() {
        this.notifiedTasks.clear();
    }
}

// Traduce las tareas guardadas con las claves y valores antiguos en español
// para que el tablero siga mostrando la información previa tras la migración.
const TASK_FIELD_MAP = {
    titulo: "title",
    descripcion: "description",
    prioridad: "priority",
    estado: "status",
    etiquetas: "tags",
    idTarea: "taskId",
    fechaInicio: "startDate",
    fechaFin: "endDate",
};

const TASK_VALUE_MAP = {
    priority: { alta: "high", media: "medium", baja: "low" },
    status: {
        hacer: "todo",
        progreso: "in-progress",
        revision: "review",
        completado: "done",
    },
};

function migrateTask(task) {
    const migrated = { ...task };

    for (const [oldField, newField] of Object.entries(TASK_FIELD_MAP)) {
        if (oldField in migrated && !(newField in migrated)) {
            migrated[newField] = migrated[oldField];
        }
        if (oldField !== newField) {
            delete migrated[oldField];
        }
    }

    for (const [field, values] of Object.entries(TASK_VALUE_MAP)) {
        if (typeof migrated[field] === "string" && values[migrated[field]]) {
            migrated[field] = values[migrated[field]];
        }
    }

    return migrated;
}

// Tablero Kanban JavaScript con almacenamiento local
class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.currentFilter = "all";
        this.draggedElement = null;
        this.taskIdCounter = 1;
        this.confirmationCallback = null;

        this.init();
    }

    init() {
        this.loadTasksFromStorage();
        this.renderAllTasks();
        this.setupEventListeners();
        this.updateTaskCounters();
    }

    // Métodos de almacenamiento local
    loadTasksFromStorage() {
        const storedTasks = localStorage.getItem("tareasKanban");
        const storedCounter = localStorage.getItem("contadorTareasKanban");

        if (storedTasks) {
            try {
                this.tasks = JSON.parse(storedTasks).map((task) => migrateTask(task));
            } catch (error) {
                console.error("Error al cargar tareas desde almacenamiento:", error);
                this.tasks = this.getDefaultTasks();
                this.saveTasksToStorage();
            }
        } else {
            this.tasks = this.getDefaultTasks();
            this.saveTasksToStorage();
        }

        if (storedCounter) {
            this.taskIdCounter = parseInt(storedCounter, 10);
        } else {
            this.taskIdCounter =
                this.tasks.length > 0
                    ? Math.max(...this.tasks.map((t) => parseInt(t.id, 10))) + 1
                    : 1;
        }
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem("tareasKanban", JSON.stringify(this.tasks));
            localStorage.setItem("contadorTareasKanban", this.taskIdCounter.toString());
        } catch (error) {
            console.error("Error al guardar tareas en almacenamiento:", error);
            this.showNotification("Error al guardar las tareas");
        }
    }

    getDefaultTasks() {
        return [];
    }

    renderAllTasks() {
        // Borrar todas las tareas existentes del DOM
        document.querySelectorAll(".task-card").forEach((card) => card.remove());

        // Representar tareas en sus respectivas columnas
        this.tasks.forEach((task) => {
            this.renderTask(task);
        });
    }

    setupEventListeners() {
        // Controles modales
        const addTaskButton = document.getElementById("add-task-button");
        const taskModal = document.getElementById("task-modal");
        const closeModal = document.getElementById("close-modal");
        const cancelButton = document.getElementById("cancel-button");
        const taskForm = document.querySelector(".task-form");

        // Controles modales de confirmación
        const confirmationModal = document.getElementById("confirmation-modal");
        const closeConfirmationModal = document.getElementById("close-confirmation-modal");
        const cancelConfirmationButton = document.getElementById("cancel-confirmation-button");
        const confirmConfirmationButton = document.getElementById("confirm-confirmation-button");

        addTaskButton.addEventListener("click", () => this.openModal());
        closeModal.addEventListener("click", () => this.closeModal());
        cancelButton.addEventListener("click", () => this.closeModal());

        taskModal.addEventListener("click", (e) => {
            if (e.target === taskModal) {
                this.closeModal();
            }
        });

        // Escuchadores de eventos modales de confirmación
        closeConfirmationModal.addEventListener("click", () => this.closeConfirmationModal());
        cancelConfirmationButton.addEventListener("click", () => this.closeConfirmationModal());

        confirmationModal.addEventListener("click", (e) => {
            if (e.target === confirmationModal) {
                this.closeConfirmationModal();
            }
        });

        confirmConfirmationButton.addEventListener("click", () => {
            if (this.confirmationCallback) {
                this.confirmationCallback();
                this.closeConfirmationModal();
            }
        });

        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const editId = taskForm.dataset.editId;
            if (editId) {
                this.updateTask(editId);
            } else {
                this.createTask();
            }
        });

        // Botones de filtro
        const filterButtons = document.querySelectorAll(".filter-button");
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                button.classList.add("active");
                this.currentFilter = button.dataset.filter;
                this.applyFilter();
            });
        });

        // Arrastrar y soltar
        this.setupDragAndDrop();

        // Menús de columnas
        const columnMenus = document.querySelectorAll(".column-menu");
        columnMenus.forEach((menu) => {
            menu.addEventListener("click", (e) => {
                e.stopPropagation();
                this.showColumnMenu(menu);
            });
        });

        // Interacciones de la tarjeta de tareas
        document.addEventListener("click", (e) => {
            if (e.target.closest(".task-card")) {
                const taskCard = e.target.closest(".task-card");
                // No abre el modo de edición si hace clic en el botón Eliminar, en el asignado o en las etiquetas
                if (
                    !e.target.closest(".task-assignee") &&
                    !e.target.closest(".task-tags") &&
                    !e.target.closest(".task-delete-button")
                ) {
                    this.editTask(taskCard);
                }
            }
        });
    }

    setupDragAndDrop() {
        const columns = document.querySelectorAll(".column");

        columns.forEach((column) => {
            const columnContent = column.querySelector(".column-content");

            columnContent.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";

                if (this.draggedElement && !columnContent.contains(this.draggedElement)) {
                    column.classList.add("drag-over");
                }
            });

            columnContent.addEventListener("dragleave", () => {
                column.classList.remove("drag-over");
            });

            columnContent.addEventListener("drop", (e) => {
                e.preventDefault();
                column.classList.remove("drag-over");

                if (this.draggedElement) {
                    const newStatus = column.dataset.status;
                    this.moveTask(this.draggedElement, newStatus);
                }
            });
        });
    }

    moveTask(taskCard, newStatus) {
        const newColumn = document.querySelector(`[data-estado="${newStatus}"] .contenido-columna`);

        if (newColumn && !newColumn.contains(taskCard)) {
            newColumn.appendChild(taskCard);

            // Actualizar datos de la tarea
            const taskId = taskCard.dataset.id;
            const task = this.tasks.find((t) => t.id === taskId);
            if (task) {
                task.status = newStatus;
                this.saveTasksToStorage();
            }

            this.updateTaskCounters();
            this.showNotification("Tarea movida exitosamente");
        }
    }

    openModal(taskData = null) {
        const taskModal = document.getElementById("task-modal");
        const modalTitle = taskModal.querySelector("h3");
        const form = document.querySelector(".task-form");

        if (taskData) {
            modalTitle.textContent = "Editar Tarea";
            document.getElementById("task-title").value = taskData.title;
            document.getElementById("task-description").value = taskData.description;
            document.getElementById("task-priority").value = taskData.priority;
            document.getElementById("task-status").value = taskData.status;
            document.getElementById("task-tags").value = taskData.tags.join(", ");
            document.getElementById("task-start-date").value = taskData.startDate || "";
            document.getElementById("task-end-date").value = taskData.endDate || "";
            form.dataset.editId = taskData.id;

            // Cambiar texto del botón a "Actualizar Tarea"
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = "Actualizar Tarea";
        } else {
            modalTitle.textContent = "Crear Nueva Tarea";
            form.reset();
            delete form.dataset.editId;

            // Cambiar texto del botón a "Crear Tarea"
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = "Crear Tarea";
        }

        taskModal.classList.add("active");
    }

    closeModal() {
        const taskModal = document.getElementById("task-modal");
        taskModal.classList.remove("active");
    }

    createTask() {
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const priority = document.getElementById("task-priority").value;
        const status = document.getElementById("task-status").value;
        const tags = document
            .getElementById("task-tags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        const startDate = document.getElementById("task-start-date").value;
        const endDate = document.getElementById("task-end-date").value;

        const taskData = {
            id: this.taskIdCounter.toString(),
            title,
            description,
            priority,
            status,
            tags,
            taskId: `PROJ-${String(this.taskIdCounter).padStart(3, "0")}`,
            startDate,
            endDate,
        };

        this.tasks.push(taskData);
        this.renderTask(taskData);
        this.updateTaskCounters();
        this.saveTasksToStorage();
        this.closeModal();
        this.showNotification("Tarea creada exitosamente");

        // Verificar si se necesita programar notificación
        if (window.notificationManager && taskData.endDate) {
            window.notificationManager.checkUpcomingTasks();
        }

        this.taskIdCounter++;
    }

    updateTask(taskId) {
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const priority = document.getElementById("task-priority").value;
        const status = document.getElementById("task-status").value;
        const tags = document
            .getElementById("task-tags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        const startDate = document.getElementById("task-start-date").value;
        const endDate = document.getElementById("task-end-date").value;

        task.title = title;
        task.description = description;
        task.priority = priority;
        task.status = status;
        task.tags = tags;
        task.startDate = startDate;
        task.endDate = endDate;

        this.saveTasksToStorage();
        this.renderAllTasks();
        this.updateTaskCounters();
        this.closeModal();
        this.showNotification("Tarea actualizada exitosamente");

        // Verificar si se necesita programar notificación
        if (window.notificationManager && endDate) {
            window.notificationManager.checkUpcomingTasks();
        }
    }

    editTask(taskCard) {
        const taskId = taskCard.dataset.id;
        const task = this.tasks.find((t) => t.id === taskId);

        if (task) {
            this.openModal(task);
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find((t) => t.id === taskId);

        if (task) {
            this.showConfirmationModal(
                "Eliminar Tarea",
                `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`,
                "Esta acción no se puede deshacer.",
                "danger",
                "Eliminar Tarea",
                () => {
                    this.tasks = this.tasks.filter((t) => t.id !== taskId);
                    this.reorganizeTaskIds();
                    this.renderAllTasks();
                    this.updateTaskCounters();
                    this.showNotification("Tarea eliminada exitosamente");
                }
            );
        }
    }

    reorganizeTaskIds() {
        // Ordenar tareas por su ID numérico actual
        this.tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        // Reasignar IDs continuos
        this.tasks.forEach((task, index) => {
            const newId = (index + 1).toString();
            const newTaskId = `PROJ-${String(index + 1).padStart(3, "0")}`;

            // Actualizar la tarea con los nuevos IDs
            task.id = newId;
            task.taskId = newTaskId;
        });

        // Actualizar el contador al siguiente ID disponible
        this.taskIdCounter = this.tasks.length + 1;

        // Guardar cambios en localStorage
        this.saveTasksToStorage();
    }

    showConfirmationModal(
        title,
        message,
        description,
        type = "warning",
        buttonText = "Confirmar",
        callback
    ) {
        const confirmationModal = document.getElementById("confirmation-modal");
        const confirmationTitle = document.getElementById("confirmation-title");
        const confirmationMessage = document.getElementById("confirmation-message");
        const confirmationDescription = document.getElementById("confirmation-description");
        const confirmationIcon = document.getElementById("confirmation-icon");
        const confirmButtonText = document.getElementById("confirm-button-text");
        const confirmButton = document.getElementById("confirm-confirmation-button");

        // Establecer contenido
        confirmationTitle.textContent = title;
        confirmationMessage.textContent = message;
        confirmationDescription.textContent = description;
        confirmButtonText.textContent = buttonText;

        // Establecer el estilo de icono y botón
        confirmationIcon.className = `confirmation-icon ${type}`;
        confirmButton.className = `button ${type === "danger" ? "button-danger" : "button-primary"}`;

        // Establecer devolución de llamada
        this.confirmationCallback = callback;

        // Mostrar modal
        confirmationModal.classList.add("active");
    }

    closeConfirmationModal() {
        const confirmationModal = document.getElementById("confirmation-modal");
        confirmationModal.classList.remove("active");
        this.confirmationCallback = null;
    }

    renderTask(taskData) {
        const columnContent = document.querySelector(
            `[data-estado="${taskData.status}"] .contenido-columna`
        );

        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.draggable = true;
        taskCard.dataset.id = taskData.id;
        taskCard.dataset.priority = taskData.priority;

        const priorityClass = `priority-${taskData.priority}`;
        const tagElements = taskData.tags.map((tag) => {
            const tagClass = this.getTagClass(tag);
            const tagElement = document.createElement("span");
            tagElement.className = `tag tag-${tagClass}`;
            tagElement.textContent = tag;
            return tagElement;
        });

        // Crear estructura de la tarjeta usando createElement
        const taskHeader = document.createElement("div");
        taskHeader.className = "task-header";

        const taskIdSpan = document.createElement("span");
        taskIdSpan.className = "task-id";
        taskIdSpan.textContent = taskData.taskId;

        const taskPriority = document.createElement("div");
        taskPriority.className = `task-priority ${priorityClass}`;

        taskHeader.appendChild(taskIdSpan);
        taskHeader.appendChild(taskPriority);

        const taskTitle = document.createElement("h4");
        taskTitle.className = "task-title";
        taskTitle.textContent = taskData.title;

        const taskDescription = document.createElement("p");
        taskDescription.className = "task-description";
        taskDescription.textContent = taskData.description;

        // Añadir fechas si existen
        const formattedStartDate = taskData.startDate ? this.formatDate(taskData.startDate) : "";
        const formattedEndDate = taskData.endDate ? this.formatDate(taskData.endDate) : "";

        if (formattedStartDate || formattedEndDate) {
            const dueStatus = this.getDueStatus(taskData.endDate);
            const dueClass = dueStatus.className;
            const dueIcon = dueStatus.icon;

            const taskDates = document.createElement("div");
            taskDates.className = `task-dates ${dueClass}`;

            if (formattedStartDate) {
                const startDateItem = document.createElement("div");
                startDateItem.className = "date-item";

                const startIcon = document.createElement("i");
                startIcon.className = "fas fa-calendar-alt";
                startIcon.textContent = ` ${formattedStartDate}`;

                startDateItem.appendChild(startIcon);
                taskDates.appendChild(startDateItem);
            }

            if (formattedEndDate) {
                const endDateItem = document.createElement("div");
                endDateItem.className = `date-item end-date ${dueClass}`;

                const endIcon = document.createElement("i");
                endIcon.className = `fas ${dueIcon}`;
                endIcon.textContent = ` ${formattedEndDate}`;

                endDateItem.appendChild(endIcon);
                taskDates.appendChild(endDateItem);
            }

            taskCard.appendChild(taskDates);
        }

        // Añadir títulos y descripción
        taskCard.appendChild(taskHeader);
        taskCard.appendChild(taskTitle);
        taskCard.appendChild(taskDescription);

        // Añadir pie con etiquetas y acciones
        const taskFooter = document.createElement("div");
        taskFooter.className = "task-footer";

        const taskTags = document.createElement("div");
        taskTags.className = "task-tags";

        // Añadir etiquetas
        tagElements.forEach((tagElement) => {
            taskTags.appendChild(tagElement);
        });

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const taskAssignee = document.createElement("div");
        taskAssignee.className = "task-assignee";

        const userIcon = document.createElement("i");
        userIcon.className = "fas fa-user";
        taskAssignee.appendChild(userIcon);

        const deleteButton = document.createElement("button");
        deleteButton.className = "task-delete-button";
        deleteButton.onclick = () => this.deleteTask(taskData.id);

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";

        deleteButton.appendChild(deleteIcon);

        taskActions.appendChild(taskAssignee);
        taskActions.appendChild(deleteButton);

        taskFooter.appendChild(taskTags);
        taskFooter.appendChild(taskActions);

        taskCard.appendChild(taskFooter);

        columnContent.appendChild(taskCard);

        // Reconfigurar la función de arrastrar y soltar para la nueva tarjeta
        taskCard.addEventListener("dragstart", (e) => {
            this.draggedElement = taskCard;
            taskCard.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
        });

        taskCard.addEventListener("dragend", () => {
            taskCard.classList.remove("dragging");
            this.draggedElement = null;
        });
    }

    formatDate(dateISO) {
        if (!dateISO) return "";

        const date = new Date(dateISO);
        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };

        return date.toLocaleDateString("es-ES", options);
    }

    getDueStatus(endDateISO) {
        if (!endDateISO) {
            return { className: "", icon: "fa-check-circle" };
        }

        const ahora = new Date();
        const endDate = new Date(endDateISO);
        const tomorrow = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const threeDays = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Vencida
        if (endDate < ahora) {
            return { className: "overdue", icon: "fa-exclamation-circle" };
        }

        // Vence hoy
        if (endDate.toDateString() === ahora.toDateString()) {
            return { className: "due-today", icon: "fa-clock" };
        }

        // Vence mañana
        if (endDate <= tomorrow) {
            return { className: "due-tomorrow", icon: "fa-exclamation-triangle" };
        }

        // Vence en menos de 3 días
        if (endDate <= threeDays) {
            return { className: "due-soon", icon: "fa-bell" };
        }

        // Normal
        return { className: "normal", icon: "fa-check-circle" };
    }

    getTagClass(tag) {
        const tagMap = {
            diseño: "design",
            frontend: "frontend",
            backend: "backend",
            docs: "docs",
            documentación: "docs",
            investigación: "research",
            seguridad: "security",
            performance: "performance",
            rendimiento: "performance",
            testing: "testing",
            review: "review",
            mantenimiento: "maintenance",
            devops: "devops",
            setup: "setup",
            arquitectura: "architecture",
            reunión: "meeting",
        };

        return tagMap[tag.toLowerCase()] || "design";
    }

    updateTaskCounters() {
        const columns = document.querySelectorAll(".column");

        columns.forEach((column) => {
            const taskCount = column.querySelectorAll(".task-card").length;
            const counterElement = column.querySelector(".task-counter");
            counterElement.textContent = taskCount;
        });

        // Actualizar las estadísticas del tablero
        const totalTasks = document.querySelectorAll(".task-card").length;
        const boardStats = document.querySelector(".board-stats");
        boardStats.textContent = `${totalTasks} tareas`;
    }

    applyFilter() {
        const taskCards = document.querySelectorAll(".task-card");

        taskCards.forEach((card) => {
            const priority = card.dataset.priority;

            if (this.currentFilter === "all") {
                card.style.display = "block";
            } else if (this.currentFilter === "high" && priority === "high") {
                card.style.display = "block";
            } else if (this.currentFilter === "medium" && priority === "medium") {
                card.style.display = "block";
            } else if (this.currentFilter === "low" && priority === "low") {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    showColumnMenu(menuButton) {
        const column = menuButton.closest(".column");
        const columnTitle = column.querySelector(".column-title h3").textContent;

        // Crear opciones modales
        const modalOptions = document.createElement("div");
        modalOptions.className = "modal active";

        // Crear contenido modal usando createElement
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content options-modal";

        // Encabezado modal
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";

        const modalTitle = document.createElement("h3");
        modalTitle.textContent = "Acciones de Columna";

        const closeButton = document.createElement("button");
        closeButton.className = "close-modal";

        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";

        closeButton.appendChild(closeIcon);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Cuerpo modal
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";

        const columnTitleHeading = document.createElement("h4");
        columnTitleHeading.textContent = `Columna: ${columnTitle}`;

        const optionsList = document.createElement("div");
        optionsList.className = "options-list";

        // Opción: Limpiar columna
        const clearOption = document.createElement("button");
        clearOption.className = "menu-option";
        clearOption.dataset.action = "clear";

        const clearIcon = document.createElement("i");
        clearIcon.className = "fas fa-broom";

        const clearSpan = document.createElement("span");
        clearSpan.textContent = "Limpiar columna";

        const clearSmall = document.createElement("small");
        clearSmall.textContent = "Eliminar todas las tareas de esta columna";

        clearOption.appendChild(clearIcon);
        clearOption.appendChild(clearSpan);
        clearOption.appendChild(clearSmall);

        // Opción: Exportar tareas
        const exportOption = document.createElement("button");
        exportOption.className = "menu-option";
        exportOption.dataset.action = "export";

        const exportIcon = document.createElement("i");
        exportIcon.className = "fas fa-download";

        const exportSpan = document.createElement("span");
        exportSpan.textContent = "Exportar tareas";

        const exportSmall = document.createElement("small");
        exportSmall.textContent = "Descargar todas las tareas en formato JSON";

        exportOption.appendChild(exportIcon);
        exportOption.appendChild(exportSpan);
        exportOption.appendChild(exportSmall);

        // Opción: Cancelar
        const cancelOption = document.createElement("button");
        cancelOption.className = "menu-option option-cancel";
        cancelOption.dataset.action = "cancel";

        const cancelIcon = document.createElement("i");
        cancelIcon.className = "fas fa-times";

        const cancelSpan = document.createElement("span");
        cancelSpan.textContent = "Cancelar";

        const cancelSmall = document.createElement("small");
        cancelSmall.textContent = "Cerrar este menú";

        cancelOption.appendChild(cancelIcon);
        cancelOption.appendChild(cancelSpan);
        cancelOption.appendChild(cancelSmall);

        // Ensamblar estructura
        optionsList.appendChild(clearOption);
        optionsList.appendChild(exportOption);
        optionsList.appendChild(cancelOption);

        modalBody.appendChild(columnTitleHeading);
        modalBody.appendChild(optionsList);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);

        modalOptions.appendChild(modalContent);

        document.body.appendChild(modalOptions);

        // Agregar detectores de eventos
        const optionButtons = [clearOption, exportOption, cancelOption];

        closeButton.addEventListener("click", () => {
            modalOptions.remove();
        });

        modalOptions.addEventListener("click", (e) => {
            if (e.target === modalOptions) {
                modalOptions.remove();
            }
        });

        optionButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const action = button.dataset.action;

                switch (action) {
                    case "clear":
                        this.clearColumn(column);
                        break;
                    case "export":
                        this.exportTasks();
                        break;
                    case "cancel":
                    default:
                        break;
                }

                modalOptions.remove();
            });
        });

        // Cerrar al escapar
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                modalOptions.remove();
                document.removeEventListener("keydown", handleEscape);
            }
        };
        document.addEventListener("keydown", handleEscape);
    }

    clearColumn(column) {
        const columnTitle = column.querySelector(".column-title h3").textContent;

        this.showConfirmationModal(
            "Limpiar Columna",
            `¿Deseas limpiar la columna "${columnTitle}"?`,
            "Esta acción eliminará todas las tareas de esta columna y no se puede deshacer.",
            "danger",
            "Limpiar Columna",
            () => {
                const columnContent = column.querySelector(".column-content");
                const tasks = columnContent.querySelectorAll(".task-card");
                const taskIds = Array.from(tasks).map((task) => task.dataset.id);

                // Eliminar tareas de los datos
                this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));

                // Reorganizar IDs para mantener continuidad
                this.reorganizeTaskIds();

                // Eliminar del DOM
                tasks.forEach((task) => task.remove());

                this.renderAllTasks();
                this.updateTaskCounters();
                this.showNotification("Columna limpiada");
            }
        );
    }

    showNotification(message) {
        // Crear una notificación sencilla
        const notification = document.createElement("div");
        notification.style.cssText = `
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
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = "fadeOut 0.3s ease";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Funciones adicionales
    exportTasks() {
        const dataString = JSON.stringify(this.tasks, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataString);

        const defaultFileName = "tareas-kanban.json";

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", defaultFileName);
        linkElement.click();

        this.showNotification("Tareas exportadas");
    }

    importTasks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                this.tasks = [...this.tasks, ...importedTasks];
                this.saveTasksToStorage();
                this.renderAllTasks();
                this.updateTaskCounters();

                this.showNotification("Tareas importadas exitosamente");
            } catch {
                this.showNotification("Error al importar tareas");
            }
        };
        reader.readAsText(file);
    }

    // Funcionalidad de búsqueda
    searchTasks(query) {
        const taskCards = document.querySelectorAll(".task-card");

        taskCards.forEach((card) => {
            const title = card.querySelector(".task-title").textContent.toLowerCase();
            const description = card.querySelector(".task-description").textContent.toLowerCase();
            const taskId = card.querySelector(".task-id").textContent.toLowerCase();

            const matchesSearch =
                title.includes(query.toLowerCase()) ||
                description.includes(query.toLowerCase()) ||
                taskId.includes(query.toLowerCase());

            card.style.display = matchesSearch ? "block" : "none";
        });
    }

    // Borrar todos los datos
    clearAllData() {
        this.showConfirmationModal(
            "Eliminar Todas las Tareas",
            "¿Estás seguro de que quieres eliminar todas las tareas?",
            "Esta acción no se puede deshacer y eliminará permanentemente todos los datos del tablero.",
            "danger",
            "Eliminar Todo",
            () => {
                localStorage.removeItem("tareasKanban");
                localStorage.removeItem("contadorTareasKanban");
                this.tasks = [];
                this.taskIdCounter = 1;
                this.renderAllTasks();
                this.updateTaskCounters();
                this.showNotification("Todos los datos han sido eliminados");
            }
        );
    }
}

// Inicializar el tablero Kanban cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
    const kanbanBoard = new KanbanBoard();

    // Inicializar gestor de notificaciones
    window.notificationManager = new NotificationManager();

    // Agregar atajos de teclado
    document.addEventListener("keydown", (e) => {
        // Ctrl/Cmd + N: Nueva tarea
        if ((e.ctrlKey || e.metaKey) && e.key === "n") {
            e.preventDefault();
            document.getElementById("add-task-button").click();
        }

        // Escape: Cerrar modal
        if (e.key === "Escape") {
            const taskModal = document.getElementById("task-modal");
            const confirmationModal = document.getElementById("confirmation-modal");
            if (taskModal.classList.contains("active")) {
                kanbanBoard.closeModal();
            }
            if (confirmationModal.classList.contains("active")) {
                kanbanBoard.closeConfirmationModal();
            }
        }

        // Ctrl/Cmd + E: Exportar tareas
        if ((e.ctrlKey || e.metaKey) && e.key === "e") {
            e.preventDefault();
            kanbanBoard.exportTasks();
        }

        // Ctrl/Cmd + Shift + C: Borrar todos los datos
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
            e.preventDefault();
            kanbanBoard.clearAllData();
        }

        // Ctrl/Cmd + R: Comprobar notificaciones manualmente
        if ((e.ctrlKey || e.metaKey) && e.key === "r") {
            e.preventDefault();
            if (window.notificationManager) {
                window.notificationManager.checkUpcomingTasks();
                kanbanBoard.showNotification("Verificación de notificaciones realizada");
            }
        }
    });

    // Añade un toque de elegancia con un desplazamiento suave
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Agregar un controlador de cambio de tamaño de ventana para un comportamiento responsivo
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            kanbanBoard.updateTaskCounters();
        }, 250);
    });

    // Hacer que tableroKanban sea accesible globalmente para la depuración
    window.kanbanBoard = kanbanBoard;
});

// Agregue algunos CSS adicionales dinámicamente
const style = document.createElement("style");
style.textContent = `
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
document.head.appendChild(style);
