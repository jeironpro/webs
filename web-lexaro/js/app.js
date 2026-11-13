class NotificationManager {
    constructor(board) {
        this.board = board;
        this.notificationPermission = "default";
        this.verificationInterval = null;
        this.notifiedTasks = new Set();

        this.init();
    }

    async init() {
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
        this.verificationInterval = setInterval(
            () => {
                this.checkUpcomingTasks();
            },
            30 * 60 * 1000
        );

        this.checkUpcomingTasks();
    }

    checkUpcomingTasks() {
        if (this.notificationPermission !== "granted") return;

        const ahora = new Date();
        const tomorrow = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const dayAfterTomorrow = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);

        if (this.board) {
            const tasks = this.board.tasks;

            tasks.forEach((task) => {
                if (task.endDate && !this.notifiedTasks.has(task.id)) {
                    const endDate = new Date(task.endDate);

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
        timeUntilTomorrow.setDate(timeUntilTomorrow.getDate() - 1);
        timeUntilTomorrow.setHours(9, 0, 0, 0);

        const notificationDelay = timeUntilTomorrow.getTime() - ahora.getTime();

        if (notificationDelay > 0) {
            setTimeout(() => {
                this.sendDueNotification(task);
                this.notifiedTasks.add(task.id);
            }, notificationDelay);
        } else if (endDate > ahora && endDate < new Date(ahora.getTime() + 24 * 60 * 60 * 1000)) {
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

        notification.onclick = () => {
            window.focus();
            notification.close();

            const taskCard = document.querySelector(`[data-id="${task.id}"]`);
            if (taskCard) {
                taskCard.scrollIntoView({ behavior: "smooth", block: "center" });
                taskCard.classList.add("is-highlighted");
                setTimeout(() => taskCard.classList.remove("is-highlighted"), 2000);
            }
        };

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

class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.currentFilter = "all";
        this.draggedElement = null;
        this.taskIdCounter = 1;
        this.confirmationCallback = null;
        this.notificationManager = null;

        this.init();
    }

    init() {
        this.loadTasksFromStorage();
        this.renderAllTasks();
        this.setupEventListeners();
        this.updateTaskCounters();
    }

    loadTasksFromStorage() {
        const storedTasks = localStorage.getItem("tareasKanban");
        const storedCounter = localStorage.getItem("contadorTareasKanban");

        if (storedTasks) {
            try {
                this.tasks = JSON.parse(storedTasks).map((task) => migrateTask(task));
            } catch {
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
        } catch {
            this.showNotification("Error al guardar las tareas");
        }
    }

    getDefaultTasks() {
        return [];
    }

    renderAllTasks() {
        document.querySelectorAll(".task").forEach((card) => card.remove());

        this.tasks.forEach((task) => {
            this.renderTask(task);
        });
    }

    setupEventListeners() {
        const addTaskButton = document.getElementById("add-task-button");
        const taskModal = document.getElementById("task-modal");
        const closeModal = document.getElementById("close-modal");
        const cancelButton = document.getElementById("cancel-button");
        const taskForm = document.querySelector(".task-form");

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

        const filterButtons = document.querySelectorAll(".filter");
        filterButtons.forEach((filterButton) => {
            filterButton.addEventListener("click", () => {
                filterButtons.forEach((item) => item.classList.remove("is-active"));
                filterButton.classList.add("is-active");
                filterButtons.forEach((item) => {
                    item.setAttribute("aria-pressed", String(item === filterButton));
                });
                this.currentFilter = filterButton.dataset.filter;
                this.applyFilter();
            });
        });

        this.setupDragAndDrop();

        const columnMenus = document.querySelectorAll(".column__menu");
        columnMenus.forEach((menu) => {
            menu.addEventListener("click", (e) => {
                e.stopPropagation();
                this.showColumnMenu(menu);
            });
        });

        document.addEventListener("click", (e) => {
            if (e.target.closest(".task")) {
                const taskCard = e.target.closest(".task");

                if (
                    !e.target.closest(".task__assignee") &&
                    !e.target.closest(".task__tags") &&
                    !e.target.closest(".task__delete")
                ) {
                    this.editTask(taskCard);
                }
            }
        });
    }

    setupDragAndDrop() {
        const columns = document.querySelectorAll(".column");

        columns.forEach((column) => {
            const columnContent = column.querySelector(".column__content");

            columnContent.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";

                if (this.draggedElement && !columnContent.contains(this.draggedElement)) {
                    column.classList.add("is-drag-over");
                }
            });

            columnContent.addEventListener("dragleave", () => {
                column.classList.remove("is-drag-over");
            });

            columnContent.addEventListener("drop", (e) => {
                e.preventDefault();
                column.classList.remove("is-drag-over");

                if (this.draggedElement) {
                    const newStatus = column.dataset.status;
                    this.moveTask(this.draggedElement, newStatus);
                }
            });
        });
    }

    moveTask(taskCard, newStatus) {
        const newColumn = document.querySelector(`[data-status="${newStatus}"] .column__content`);

        if (newColumn && !newColumn.contains(taskCard)) {
            newColumn.appendChild(taskCard);

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

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = "Actualizar Tarea";
        } else {
            modalTitle.textContent = "Crear Nueva Tarea";
            form.reset();
            delete form.dataset.editId;

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = "Crear Tarea";
        }

        taskModal.classList.add("is-active");
    }

    closeModal() {
        const taskModal = document.getElementById("task-modal");
        taskModal.classList.remove("is-active");
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

        if (this.notificationManager && taskData.endDate) {
            this.notificationManager.checkUpcomingTasks();
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

        if (this.notificationManager && endDate) {
            this.notificationManager.checkUpcomingTasks();
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
        this.tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        this.tasks.forEach((task, index) => {
            const newId = (index + 1).toString();
            const newTaskId = `PROJ-${String(index + 1).padStart(3, "0")}`;

            task.id = newId;
            task.taskId = newTaskId;
        });

        this.taskIdCounter = this.tasks.length + 1;

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

        confirmationTitle.textContent = title;
        confirmationMessage.textContent = message;
        confirmationDescription.textContent = description;
        confirmButtonText.textContent = buttonText;

        confirmationIcon.className = `confirm__icon confirm__icon--${type}`;
        confirmButton.className = `btn ${type === "danger" ? "btn--danger" : "btn--primary"}`;

        this.confirmationCallback = callback;

        confirmationModal.classList.add("is-active");
    }

    closeConfirmationModal() {
        const confirmationModal = document.getElementById("confirmation-modal");
        confirmationModal.classList.remove("is-active");
        this.confirmationCallback = null;
    }

    renderTask(taskData) {
        const columnContent = document.querySelector(
            `[data-status="${taskData.status}"] .column__content`
        );

        if (!columnContent) return;

        const taskCard = document.createElement("div");
        taskCard.className = "task";
        taskCard.draggable = true;
        taskCard.dataset.id = taskData.id;
        taskCard.dataset.priority = taskData.priority;

        const priorityClass = `task__priority--${taskData.priority}`;
        const tagElements = taskData.tags.map((tag) => {
            const tagClass = this.getTagClass(tag);
            const tagElement = document.createElement("span");
            tagElement.className = `tag tag--${tagClass}`;
            tagElement.textContent = tag;
            return tagElement;
        });

        const taskHeader = document.createElement("div");
        taskHeader.className = "task__header";

        const taskIdSpan = document.createElement("span");
        taskIdSpan.className = "task__id";
        taskIdSpan.textContent = taskData.taskId;

        const taskPriority = document.createElement("div");
        taskPriority.className = `task__priority ${priorityClass}`;

        taskHeader.appendChild(taskIdSpan);
        taskHeader.appendChild(taskPriority);

        const taskTitle = document.createElement("h4");
        taskTitle.className = "task__title";
        taskTitle.textContent = taskData.title;

        const taskDescription = document.createElement("p");
        taskDescription.className = "task__description";
        taskDescription.textContent = taskData.description;

        const formattedStartDate = taskData.startDate ? this.formatDate(taskData.startDate) : "";
        const formattedEndDate = taskData.endDate ? this.formatDate(taskData.endDate) : "";

        if (formattedStartDate || formattedEndDate) {
            const dueStatus = this.getDueStatus(taskData.endDate);
            const dueClass = dueStatus.className;
            const dueIcon = dueStatus.icon;

            const taskDates = document.createElement("div");
            taskDates.className = `task__dates ${dueClass}`;

            if (formattedStartDate) {
                const startDateItem = document.createElement("div");
                startDateItem.className = "task__date";

                const startIcon = document.createElement("i");
                startIcon.className = "fas fa-calendar-alt";
                startIcon.textContent = ` ${formattedStartDate}`;

                startDateItem.appendChild(startIcon);
                taskDates.appendChild(startDateItem);
            }

            if (formattedEndDate) {
                const endDateItem = document.createElement("div");
                endDateItem.className = `task__date task__date--end ${dueClass}`;

                const endIcon = document.createElement("i");
                endIcon.className = `fas ${dueIcon}`;
                endIcon.textContent = ` ${formattedEndDate}`;

                endDateItem.appendChild(endIcon);
                taskDates.appendChild(endDateItem);
            }

            taskCard.appendChild(taskDates);
        }

        taskCard.appendChild(taskHeader);
        taskCard.appendChild(taskTitle);
        taskCard.appendChild(taskDescription);

        const taskFooter = document.createElement("div");
        taskFooter.className = "task__footer";

        const taskTags = document.createElement("div");
        taskTags.className = "task__tags";

        tagElements.forEach((tagElement) => {
            taskTags.appendChild(tagElement);
        });

        const taskActions = document.createElement("div");
        taskActions.className = "task__actions";

        const taskAssignee = document.createElement("div");
        taskAssignee.className = "task__assignee";

        const userIcon = document.createElement("i");
        userIcon.className = "fas fa-user";
        taskAssignee.appendChild(userIcon);

        const deleteButton = document.createElement("button");
        deleteButton.className = "task__delete";
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

        taskCard.addEventListener("dragstart", (e) => {
            this.draggedElement = taskCard;
            taskCard.classList.add("is-dragging");
            e.dataTransfer.effectAllowed = "move";
        });

        taskCard.addEventListener("dragend", () => {
            taskCard.classList.remove("is-dragging");
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

        if (endDate < ahora) {
            return { className: "is-overdue", icon: "fa-exclamation-circle" };
        }

        if (endDate.toDateString() === ahora.toDateString()) {
            return { className: "is-due-today", icon: "fa-clock" };
        }

        if (endDate <= tomorrow) {
            return { className: "is-due-tomorrow", icon: "fa-exclamation-triangle" };
        }

        if (endDate <= threeDays) {
            return { className: "is-due-soon", icon: "fa-bell" };
        }

        return { className: "", icon: "fa-check-circle" };
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
            const taskCount = column.querySelectorAll(".task").length;
            const counterElement = column.querySelector(".column__counter");
            counterElement.textContent = taskCount;
        });

        const totalTasks = document.querySelectorAll(".task").length;
        const boardStats = document.querySelector(".board__stats");
        boardStats.textContent = `${totalTasks} tareas`;
    }

    applyFilter() {
        const taskCards = document.querySelectorAll(".task");

        taskCards.forEach((card) => {
            const priority = card.dataset.priority;

            const matchesPriority = this.currentFilter === "all" || priority === this.currentFilter;
            card.hidden = !matchesPriority;
        });
    }

    showColumnMenu(menuButton) {
        const column = menuButton.closest(".column");
        const columnTitle = column.querySelector(".column__title h3").textContent;

        const modalOptions = document.createElement("div");
        modalOptions.className = "modal is-active";

        const modalContent = document.createElement("div");
        modalContent.className = "modal__content modal--options";

        const modalHeader = document.createElement("div");
        modalHeader.className = "modal__header";

        const modalTitle = document.createElement("h3");
        modalTitle.textContent = "Acciones de Columna";

        const closeButton = document.createElement("button");
        closeButton.className = "modal__close";

        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";

        closeButton.appendChild(closeIcon);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        const modalBody = document.createElement("div");
        modalBody.className = "modal__body";

        const columnTitleHeading = document.createElement("h4");
        columnTitleHeading.textContent = `Columna: ${columnTitle}`;

        const optionsList = document.createElement("div");
        optionsList.className = "options__list";

        const clearOption = document.createElement("button");
        clearOption.className = "options__item";
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

        const exportOption = document.createElement("button");
        exportOption.className = "options__item";
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

        const cancelOption = document.createElement("button");
        cancelOption.className = "options__item options__item--cancel";
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

        optionsList.appendChild(clearOption);
        optionsList.appendChild(exportOption);
        optionsList.appendChild(cancelOption);

        modalBody.appendChild(columnTitleHeading);
        modalBody.appendChild(optionsList);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);

        modalOptions.appendChild(modalContent);

        document.body.appendChild(modalOptions);

        const optionButtons = [clearOption, exportOption, cancelOption];

        closeButton.addEventListener("click", () => {
            modalOptions.remove();
        });

        modalOptions.addEventListener("click", (e) => {
            if (e.target === modalOptions) {
                modalOptions.remove();
            }
        });

        optionButtons.forEach((optionButton) => {
            optionButton.addEventListener("click", () => {
                const action = optionButton.dataset.action;

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

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                modalOptions.remove();
                document.removeEventListener("keydown", handleEscape);
            }
        };
        document.addEventListener("keydown", handleEscape);
    }

    clearColumn(column) {
        const columnTitle = column.querySelector(".column__title h3").textContent;

        this.showConfirmationModal(
            "Limpiar Columna",
            `¿Deseas limpiar la columna "${columnTitle}"?`,
            "Esta acción eliminará todas las tareas de esta columna y no se puede deshacer.",
            "danger",
            "Limpiar Columna",
            () => {
                const columnContent = column.querySelector(".column__content");
                const tasks = columnContent.querySelectorAll(".task");
                const taskIds = Array.from(tasks).map((task) => task.dataset.id);

                this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));

                this.reorganizeTaskIds();

                tasks.forEach((task) => task.remove());

                this.renderAllTasks();
                this.updateTaskCounters();
                this.showNotification("Columna limpiada");
            }
        );
    }

    showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "toast";
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("toast--hiding");
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

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

    searchTasks(query) {
        const taskCards = document.querySelectorAll(".task");

        taskCards.forEach((card) => {
            const title = card.querySelector(".task__title").textContent.toLowerCase();
            const description = card.querySelector(".task__description").textContent.toLowerCase();
            const taskId = card.querySelector(".task__id").textContent.toLowerCase();

            const matchesSearch =
                title.includes(query.toLowerCase()) ||
                description.includes(query.toLowerCase()) ||
                taskId.includes(query.toLowerCase());

            card.hidden = !matchesSearch;
        });
    }

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

document.addEventListener("DOMContentLoaded", () => {
    const kanbanBoard = new KanbanBoard();

    kanbanBoard.notificationManager = new NotificationManager(kanbanBoard);

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "n") {
            e.preventDefault();
            document.getElementById("add-task-button").click();
        }

        if (e.key === "Escape") {
            const taskModal = document.getElementById("task-modal");
            const confirmationModal = document.getElementById("confirmation-modal");
            if (taskModal.classList.contains("is-active")) {
                kanbanBoard.closeModal();
            }
            if (confirmationModal.classList.contains("is-active")) {
                kanbanBoard.closeConfirmationModal();
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "e") {
            e.preventDefault();
            kanbanBoard.exportTasks();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
            e.preventDefault();
            kanbanBoard.clearAllData();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "r") {
            e.preventDefault();
            if (kanbanBoard.notificationManager) {
                kanbanBoard.notificationManager.checkUpcomingTasks();
                kanbanBoard.showNotification("Verificación de notificaciones realizada");
            }
        }
    });

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

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            kanbanBoard.updateTaskCounters();
        }, 250);
    });
});
