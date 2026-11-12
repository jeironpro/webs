// Renderiza la colección de ejercicios (Python o Java) cargando el JSON indicado en window.CONFIG.jsonUrl.
// Se usa desde python.html y java.html; el bloque UML solo se muestra cuando el ejercicio lo define.

const PAGE_SIZE = 10;
const LEVEL_ORDER = ['easy', 'medium', 'hard'];
const LEVEL_LABELS = {
    easy: 'fácil',
    medium: 'medio',
    hard: 'difícil',
};
const TYPE_ORDER = ['basic', 'basic-cli', 'oop'];
const TYPE_LABELS = {
    basic: 'Elementos básicos',
    'basic-cli': 'Elementos básicos con sys.argv',
    oop: 'Programación orientada a objetos',
};

let currentPage = 1;

// ---------- Soluciones ----------
const SOLUTIONS_MANIFEST_URL = 'json/solutions.json';
let solutionsManifest = null;

const loadSolutionsManifest = async () => {
    if (!solutionsManifest) {
        const response = await fetch(SOLUTIONS_MANIFEST_URL);
        if (!response.ok) {
            throw new Error('No se pudo cargar el índice de soluciones');
        }
        solutionsManifest = await response.json();
    }
    return solutionsManifest;
};

const lineComment = (language) => (language === 'python' ? '#' : '//');

const loadSolution = async (language, exerciseId) => {
    const manifest = await loadSolutionsManifest();
    const paths = manifest[language] && manifest[language][exerciseId];
    if (!paths || paths.length === 0) {
        return null;
    }

    const contents = [];
    for (const path of paths) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`No se pudo descargar la solución (${path})`);
        }
        const text = await response.text();
        const filename = path.split('/').pop();
        contents.push(`${lineComment(language)} ===== ${filename} =====\n${text}`);
    }
    return contents.join('\n\n');
};

// ---------- Modal ----------
let currentModal = null;

const createModal = () => {
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');

    const panel = document.createElement('div');
    panel.classList.add('modal-panel');

    const header = document.createElement('div');
    header.classList.add('modal-header');

    const title = document.createElement('h3');
    title.classList.add('modal-title');

    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close');
    closeButton.setAttribute('aria-label', 'Cerrar');
    closeButton.textContent = '✕';

    const content = document.createElement('div');
    content.classList.add('modal-content');

    header.appendChild(title);
    header.appendChild(closeButton);
    panel.appendChild(header);
    panel.appendChild(content);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
        document.body.style.overflow = '';
        backdrop.remove();
        document.removeEventListener('keydown', onKeydown);
        currentModal = null;
    };

    const onKeydown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    document.addEventListener('keydown', onKeydown);
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeModal();
        }
    });
    closeButton.addEventListener('click', closeModal);

    return { content, title, closeModal };
};

const openModal = (titleText) => {
    if (currentModal) {
        currentModal.closeModal();
    }
    currentModal = createModal();
    currentModal.title.textContent = titleText;
    return currentModal;
};

const showSolutionNotice = (modal, message, isError) => {
    modal.content.replaceChildren();

    const notice = document.createElement('div');
    notice.classList.add('modal-notice');
    if (isError) {
        notice.classList.add('modal-notice-error');
    }

    const icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.textContent = isError ? 'cloud_off' : 'schedule';

    const text = document.createElement('p');
    text.textContent = message;

    notice.appendChild(icon);
    notice.appendChild(text);
    modal.content.appendChild(notice);
};

const showSolutionCode = (modal, code, language) => {
    modal.content.replaceChildren();

    const wrapper = document.createElement('div');
    wrapper.classList.add('code-with-lines');

    const lineNumbers = document.createElement('div');
    lineNumbers.classList.add('line-numbers');
    const totalLines = code.split('\n').length;
    lineNumbers.textContent = Array.from({ length: totalLines }, (_, i) => i + 1).join('\n');

    const pre = document.createElement('pre');
    pre.classList.add('solution-code');

    const codeElement = document.createElement('code');
    codeElement.append(window.highlightCode(code, language));
    pre.appendChild(codeElement);

    wrapper.appendChild(lineNumbers);
    wrapper.appendChild(pre);
    modal.content.appendChild(wrapper);
};

const openSolution = async (exercise, index) => {
    const language = window.CONFIG.language;
    const languageName = language === 'python' ? 'Python' : 'Java';
    const modal = openModal(`${index} - ${exercise.title} · Solución ${languageName}`);
    modal.content.textContent = 'Cargando solución…';

    try {
        const code = await loadSolution(language, exercise.id);
        if (!code) {
            showSolutionNotice(modal, 'Solución próximamente');
            return;
        }
        showSolutionCode(modal, code, language);
    } catch (error) {
        console.error('Error al cargar la solución:', error);
        showSolutionNotice(modal, 'No se pudo cargar la solución. Inténtalo de nuevo más tarde.', true);
    }
};

const formatExampleText = (text) => {
    if (Array.isArray(text)) {
        return text.join('\n');
    }
    return text;
};

const init = async () => {
    const response = await fetch(window.CONFIG.jsonUrl);
    if (!response.ok) {
        throw new Error('No se pudo cargar la colección de ejercicios');
    }
    const exercises = await response.json();

    const exercisesContainer = document.querySelector('#exercises-container');
    const levelOrder = new Map(LEVEL_ORDER.map((level, index) => [level, index]));
    const typeOrder = new Map(TYPE_ORDER.map((type, index) => [type, index]));

    exercises.sort((a, b) => {
        const typeDifference = typeOrder.get(a.type) - typeOrder.get(b.type);
        return typeDifference || levelOrder.get(a.level) - levelOrder.get(b.level);
    });

    const totalPages = Math.ceil(exercises.length / PAGE_SIZE);

    const renderExercise = (exercise, displayIndex) => {
        const article = document.createElement('article');
        article.classList.add('exercise');

        const title = document.createElement('h2');
        title.classList.add('exercise-title');
        title.textContent = `${displayIndex} - ${exercise.title}`;
        article.appendChild(title);

        const details = document.createElement('div');
        details.classList.add('exercise-details');

        const level = document.createElement('span');
        level.classList.add('difficulty', `level-${exercise.level}`);
        level.textContent = `Nivel ${LEVEL_LABELS[exercise.level] || exercise.level}`;
        details.appendChild(level);

        const type = document.createElement('span');
        type.classList.add('type', exercise.type);
        type.textContent = TYPE_LABELS[exercise.type] || exercise.type;
        details.appendChild(type);

        article.appendChild(details);

        const statement = document.createElement('p');
        statement.textContent = exercise.statement;
        article.appendChild(statement);

        if (exercise.tasks && exercise.tasks.length > 0) {
            const tasks = document.createElement('div');
            tasks.classList.add('program-tasks');

            const tasksTitle = document.createElement('p');
            const tasksStrong = document.createElement('strong');
            tasksStrong.textContent = 'El programa debe:';
            tasksTitle.appendChild(tasksStrong);
            tasks.appendChild(tasksTitle);

            const taskList = document.createElement('ul');
            exercise.tasks.forEach((task) => {
                const item = document.createElement('li');
                item.textContent = task;
                taskList.appendChild(item);
            });
            tasks.appendChild(taskList);
            article.appendChild(tasks);
        }

        if (exercise.hints && exercise.hints.length > 0) {
            const hints = document.createElement('div');
            hints.classList.add('hints');
            hints.appendChild(document.createTextNode('Pistas:'));

            const hintsList = document.createElement('ul');
            exercise.hints.forEach((hint) => {
                const item = document.createElement('li');
                item.textContent = hint;
                hintsList.appendChild(item);
            });
            hints.appendChild(hintsList);
            article.appendChild(hints);
        }

        if (exercise.example) {
            const example = document.createElement('div');
            example.classList.add('example-code');

            if (exercise.example.input) {
                const inputTitle = document.createElement('p');
                const inputStrong = document.createElement('strong');
                inputStrong.textContent = 'Entrada:';
                inputTitle.appendChild(inputStrong);
                example.appendChild(inputTitle);

                const input = document.createElement('pre');
                input.textContent = formatExampleText(exercise.example.input);
                example.appendChild(input);

                example.appendChild(document.createElement('br'));
            }

            if (exercise.example.output) {
                const outputTitle = document.createElement('p');
                const outputStrong = document.createElement('strong');
                outputStrong.textContent = 'Salida:';
                outputTitle.appendChild(outputStrong);
                example.appendChild(outputTitle);

                const output = document.createElement('pre');
                output.textContent = formatExampleText(exercise.example.output);
                example.appendChild(output);
            }

            article.appendChild(example);
        }

        if (exercise.uml) {
            const diagram = document.createElement('div');
            diagram.classList.add('uml-diagram');

            const image = document.createElement('img');
            image.src = exercise.uml;
            image.alt = 'Diagrama UML del ejercicio';
            diagram.appendChild(image);

            article.appendChild(diagram);
        }

        const solutionButton = document.createElement('button');
        solutionButton.classList.add('solution-button');
        solutionButton.type = 'button';
        solutionButton.textContent = 'Ver solución';
        solutionButton.addEventListener('click', () => openSolution(exercise, displayIndex));
        article.appendChild(solutionButton);

        return article;
    };

    let pagination = document.getElementById('pagination');
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        exercisesContainer.parentNode.appendChild(pagination);
    }

    const renderPagination = () => {
        pagination.replaceChildren();

        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.disabled = page === currentPage;
            pageButton.addEventListener('click', () => showPage(page));
            pagination.appendChild(pageButton);
        }
    };

    const showPage = (page) => {
        currentPage = ((page - 1 + totalPages) % totalPages) + 1;
        exercisesContainer.replaceChildren();

        const start = (currentPage - 1) * PAGE_SIZE;
        const pageExercises = exercises.slice(start, start + PAGE_SIZE);

        pageExercises.forEach((exercise, index) => {
            const displayIndex = String(start + index + 1).padStart(2, '0');
            exercisesContainer.appendChild(renderExercise(exercise, displayIndex));
        });

        renderPagination();
    };

    const previousButton = document.getElementById('previous-page');
    const nextButton = document.getElementById('next-page');

    if (previousButton) {
        previousButton.addEventListener('click', () => showPage(currentPage - 1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => showPage(currentPage + 1));
    }

    showPage(1);
};

init().catch((error) => console.error('Error al cargar ejercicios:', error));
