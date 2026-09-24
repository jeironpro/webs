document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM (en español)
    const listaLenguajes = document.getElementById('lista-lenguajes');
    const listaParadigmas = document.getElementById('lista-paradigmas');
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const vistaDetalle = document.getElementById('vista-detalle');
    const contenedorPrincipal = document.querySelector('.contenido-principal');

    function renderizarMenu() {
        // Lenguajes
        datosContenido.lenguajes.forEach(item => {
            const enlace = document.createElement('div');
            enlace.className = 'item-nav';
            enlace.textContent = item.nombre;
            enlace.dataset.id = item.id;
            enlace.dataset.tipo = 'lenguaje';
            enlace.addEventListener('click', () => mostrarContenido(item));
            listaLenguajes.appendChild(enlace);
        });

        // Paradigmas
        datosContenido.paradigmas.forEach(item => {
            const enlace = document.createElement('div');
            enlace.className = 'item-nav';
            enlace.textContent = item.nombre;
            enlace.dataset.id = item.id;
            enlace.dataset.tipo = 'paradigma';
            enlace.addEventListener('click', () => mostrarContenido(item));
            listaParadigmas.appendChild(enlace);
        });
    }
    
    function mostrarContenido(datos) {
        // Gestionar estado activo del menú
        document.querySelectorAll('.item-nav').forEach(el => el.classList.remove('activo'));
        const itemActivo = document.querySelector(`.item-nav[data-id="${datos.id}"]`);
        if (itemActivo) itemActivo.classList.add('activo');

        // Transición de pantallas
        pantallaBienvenida.style.display = 'none';
        vistaDetalle.classList.remove('oculto');
        vistaDetalle.classList.add('seccion-activa');
        
        // Scroll al inicio
        contenedorPrincipal.scrollTop = 0;

        // Limpiar vista anterior
        vistaDetalle.innerHTML = '';

        // 1. Header
        const header = document.createElement('header');
        header.className = 'cabecera-detalle';

        const spanEtiqueta = document.createElement('span');
        spanEtiqueta.className = 'etiqueta-tipo';
        spanEtiqueta.textContent = datos.etiqueta;

        const h1Titulo = document.createElement('h1');
        h1Titulo.className = 'titulo-detalle';
        h1Titulo.textContent = datos.nombre;

        const pDescripcion = document.createElement('p');
        pDescripcion.className = 'descripcion-detalle';
        pDescripcion.textContent = datos.descripcion;

        header.appendChild(spanEtiqueta);
        header.appendChild(h1Titulo);
        header.appendChild(pDescripcion);
        vistaDetalle.appendChild(header);

        // 2. Historia
        const divHistoria = document.createElement('div');
        divHistoria.className = 'bloque-seccion';

        const h2Historia = document.createElement('h2');
        h2Historia.textContent = 'Historia y Origen';

        const pHistoria = document.createElement('p');
        pHistoria.textContent = datos.historia;

        divHistoria.appendChild(h2Historia);
        divHistoria.appendChild(pHistoria);
        vistaDetalle.appendChild(divHistoria);

        // 3. Usos Principales
        const divUsos = document.createElement('div');
        divUsos.className = 'bloque-seccion';

        const h2Usos = document.createElement('h2');
        h2Usos.textContent = 'Usos Principales';

        const ulUsos = document.createElement('ul');
        ulUsos.style.paddingLeft = '1.5rem';

        datos.usos.forEach(uso => {
            const li = document.createElement('li');
            li.textContent = uso;
            ulUsos.appendChild(li);
        });

        divUsos.appendChild(h2Usos);
        divUsos.appendChild(ulUsos);
        vistaDetalle.appendChild(divUsos);

        // 4. Análisis (Pros/Contras)
        const divAnalisis = document.createElement('div');
        divAnalisis.className = 'bloque-seccion';

        const h2Analisis = document.createElement('h2');
        h2Analisis.textContent = 'Análisis';

        const divProsContras = document.createElement('div');
        divProsContras.className = 'lista-pros-contras';

        // Columna Ventajas
        const divColPros = document.createElement('div');
        divColPros.className = 'lista-columna';

        const h4Pros = document.createElement('h4');
        h4Pros.textContent = 'Ventajas';

        const ulPros = document.createElement('ul');
        ulPros.className = 'lista-check';

        datos.pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            ulPros.appendChild(li);
        });

        divColPros.appendChild(h4Pros);
        divColPros.appendChild(ulPros);

        // Columna Desventajas
        const divColContras = document.createElement('div');
        divColContras.className = 'lista-columna';

        const h4Contras = document.createElement('h4');
        h4Contras.textContent = 'Desventajas';

        const ulContras = document.createElement('ul');
        ulContras.className = 'lista-cross';

        datos.contras.forEach(contra => {
            const li = document.createElement('li');
            li.textContent = contra;
            ulContras.appendChild(li);
        });

        divColContras.appendChild(h4Contras);
        divColContras.appendChild(ulContras);

        divProsContras.appendChild(divColPros);
        divProsContras.appendChild(divColContras);

        divAnalisis.appendChild(h2Analisis);
        divAnalisis.appendChild(divProsContras);
        vistaDetalle.appendChild(divAnalisis);

        // 5. Código de Ejemplo
        const divCodigo = document.createElement('div');
        divCodigo.className = 'bloque-seccion';

        const h2Codigo = document.createElement('h2');
        h2Codigo.textContent = 'Código de Ejemplo';

        const pre = document.createElement('pre');
        pre.className = 'bloque-codigo';

        const code = document.createElement('code');
        code.textContent = datos.ejemplo;

        pre.appendChild(code);
        divCodigo.appendChild(h2Codigo);
        divCodigo.appendChild(pre);
        vistaDetalle.appendChild(divCodigo);

        // Reiniciar animación
        vistaDetalle.style.animation = 'none';
        vistaDetalle.offsetHeight; /* trigger reflow */
        vistaDetalle.style.animation = 'fadeIn 0.5s ease forwards';
    }

    // Inicializar
    renderizarMenu();
});
