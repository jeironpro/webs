import { caposDroga, organizaciones } from './data.js';

const cuadriculaCapos = document.getElementById('cuadricula-capos');
const cuadriculaOrganizaciones = document.getElementById('cuadricula-organizaciones');
const vistaInicio = document.getElementById('vista-inicio');
const vistaDetalle = document.getElementById('vista-detalle');
const contenidoDetalle = document.getElementById('contenido-detalle');
const botonVolver = document.getElementById('boton-volver');
const navCapos = document.getElementById('nav-capos');
const navOrganizaciones = document.getElementById('nav-organizaciones');
const subtitulo = document.querySelector('.subtitulo');

let seccionActual = 'capos'; // 'capos' o 'organizaciones'

const crearElemento = (etiqueta, clase = '', contenido = '') => {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (contenido) el.textContent = contenido;
    return el;
};

const limpiarApp = () => {
    cuadriculaCapos.style.display = 'none';
    cuadriculaOrganizaciones.style.display = 'none';
    navCapos.classList.remove('activo');
    navOrganizaciones.classList.remove('activo');
};

const renderizarCuadriculaCapos = () => {
    cuadriculaCapos.innerHTML = '';
    caposDroga.forEach(capo => {
        const tarjeta = crearTarjeta(capo, () => mostrarDetalleCapo(capo));
        cuadriculaCapos.appendChild(tarjeta);
    });
};

const renderizarCuadriculaOrganizaciones = () => {
    cuadriculaOrganizaciones.innerHTML = '';
    organizaciones.forEach(org => {
        const tarjeta = crearTarjeta(org, () => mostrarDetalleOrganizacion(org), true);
        cuadriculaOrganizaciones.appendChild(tarjeta);
    });
};

const crearTarjeta = (item, clickHandler, esOrg = false) => {
    const tarjeta = crearElemento('div', 'tarjeta-capo');
    
    const contenedorImagen = crearElemento('div', 'tarjeta-capo__contenedor-imagen');
    const imagen = document.createElement('img');
    imagen.src = item.imagen;
    imagen.alt = item.nombre;
    imagen.className = 'tarjeta-capo__imagen';
    imagen.loading = 'lazy';
    contenedorImagen.appendChild(imagen);

    const contenido = crearElemento('div', 'tarjeta-capo__contenido');
    const nombre = crearElemento('h3', 'tarjeta-capo__nombre', item.nombre);
    
    const subinfo = crearElemento('div', 'tarjeta-capo__subinfo');
    const origen = crearElemento('span', '', item.origen);
    const badge = crearElemento('span', '', esOrg ? item.estado : `${item.edad} Años`);
    subinfo.appendChild(origen);
    subinfo.appendChild(badge);

    const descripcion = crearElemento('p', 'tarjeta-capo__descripcion', esOrg ? item.historia.substring(0, 100) + '...' : item.descripcionCorta);

    contenido.appendChild(nombre);
    contenido.appendChild(subinfo);
    contenido.appendChild(descripcion);

    tarjeta.appendChild(contenedorImagen);
    tarjeta.appendChild(contenido);

    tarjeta.addEventListener('click', clickHandler);
    return tarjeta;
};

const mostrarDetalleCapo = (capo) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    contenidoDetalle.innerHTML = ''; 

    const cabecera = crearCabeceraDetalle(capo.imagen, capo.nombre, capo.rol);
    const cuadriculaInfo = crearElemento('div', 'cuadricula-info');
    
    const crearItemInfo = (labelStr, valorStr, colorPersonalizado = '') => {
        const item = crearElemento('div', 'item-info');
        item.appendChild(crearElemento('label', '', labelStr));
        const span = crearElemento('span', '', valorStr);
        if (colorPersonalizado) {
            span.style.color = colorPersonalizado;
            span.style.fontWeight = 'bold';
        }
        item.appendChild(span);
        return item;
    };

    cuadriculaInfo.appendChild(crearItemInfo('Nombre Completo', capo.nombreCompleto));
    cuadriculaInfo.appendChild(crearItemInfo('Nacionalidad', capo.origen));
    cuadriculaInfo.appendChild(crearItemInfo('Nacimiento', capo.fechaNacimiento));
    cuadriculaInfo.appendChild(crearItemInfo('Estado / Muerte', capo.fechaMuerte));
    cuadriculaInfo.appendChild(crearItemInfo('Organización', capo.organizacion, 'var(--acento-color)'));
    cuadriculaInfo.appendChild(crearItemInfo('Fortuna Estimada', capo.fortunaEstimada, 'var(--dorado-acento)'));

    cabecera.querySelector('.detalle-info').appendChild(cuadriculaInfo);
    contenidoDetalle.appendChild(cabecera);

    contenidoDetalle.appendChild(agregarSeccion('Historia', capo.historia));
    
    contenidoDetalle.appendChild(crearSeccionDoble(
        'Modus Operandi', capo.modusOperandi,
        'Territorio y Rutas', capo.territorio
    ));

    contenidoDetalle.appendChild(crearSeccionRelaciones(capo.aliados, capo.enemigos));

    contenidoDetalle.appendChild(agregarSeccion('Impacto y Sociedad', capo.impacto));
    
    const textoFin = capo.detallesMuerte || capo.detallesCaptura;
    const tituloFin = capo.detallesMuerte ? 'Final: Operativo de Muerte' : 'Final: Captura y Sentencia';
    contenidoDetalle.appendChild(agregarSeccion(tituloFin, textoFin));

    contenidoDetalle.appendChild(agregarSeccion('Legado y Cultura', capo.impactoCultural));

    if (capo.eventosNotables) {
        contenidoDetalle.appendChild(agregarSeccion('Eventos Notables', '', true, capo.eventosNotables));
    }

    alternarVistas(false);
};

const mostrarDetalleOrganizacion = (org) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    contenidoDetalle.innerHTML = ''; 

    const cabecera = crearCabeceraDetalle(org.imagen, org.nombre, `Organización Criminal - ${org.estado}`);
    const cuadriculaInfo = crearElemento('div', 'cuadricula-info');
    
    const crearItemInfo = (labelStr, valorStr, color = '') => {
        const item = crearElemento('div', 'item-info');
        item.appendChild(crearElemento('label', '', labelStr));
        const span = crearElemento('span', '', valorStr);
        if (color) { span.style.color = color; span.style.fontWeight = 'bold'; }
        item.appendChild(span);
        return item;
    };

    cuadriculaInfo.appendChild(crearItemInfo('Fundación', org.fundacion));
    cuadriculaInfo.appendChild(crearItemInfo('Disolución', org.disolucion));
    cuadriculaInfo.appendChild(crearItemInfo('Origen', org.origen, 'var(--acento-color)'));
    cuadriculaInfo.appendChild(crearItemInfo('Líderes', org.lideres.join(', ')));

    cabecera.querySelector('.detalle-info').appendChild(cuadriculaInfo);
    contenidoDetalle.appendChild(cabecera);

    contenidoDetalle.appendChild(agregarSeccion('Historia de la Organización', org.historia));
    
    contenidoDetalle.appendChild(crearSeccionDoble(
        'Modus Operandi', org.modusOperandi,
        'Control Territorial', org.territorio
    ));

    contenidoDetalle.appendChild(crearSeccionRelaciones(org.aliados, org.enemigos));

    alternarVistas(false);
};

// Helpers de UI
const crearCabeceraDetalle = (imgUrl, nombreTxt, taglineTxt) => {
    const cabecera = crearElemento('div', 'detalle-cabecera');
    
    const contenedorImagen = crearElemento('div', 'detalle-cabecera__contenedor-imagen');
    const imagen = document.createElement('img');
    imagen.src = imgUrl;
    imagen.alt = nombreTxt;
    imagen.className = 'detalle-cabecera__imagen';
    contenedorImagen.appendChild(imagen);

    const info = crearElemento('div', 'detalle-info');
    info.appendChild(crearElemento('h1', 'detalle-info__nombre', nombreTxt));
    info.appendChild(crearElemento('p', 'detalle-info__tagline', taglineTxt));
    
    cabecera.appendChild(contenedorImagen);
    cabecera.appendChild(info);
    return cabecera;
};

const agregarSeccion = (titulo, contenidoTxt, esLista = false, items = []) => {
    const seccion = crearElemento('div', 'detalle-seccion');
    seccion.appendChild(crearElemento('h2', '', titulo));
    
    if (esLista) {
        const lista = crearElemento('ul', 'lista-eventos');
        items.forEach(item => lista.appendChild(crearElemento('li', '', item)));
        seccion.appendChild(lista);
    } else {
        seccion.appendChild(crearElemento('p', '', contenidoTxt));
    }
    return seccion;
};

const crearSeccionDoble = (title1, content1, title2, content2) => {
    const seccion = crearElemento('div', 'detalle-seccion');
    const cuadricula = crearElemento('div', 'cuadricula-info');
    
    const item1 = crearElemento('div', 'item-info');
    item1.appendChild(crearElemento('h2', '', title1));
    item1.appendChild(crearElemento('p', '', content1));
    
    const item2 = crearElemento('div', 'item-info');
    item2.appendChild(crearElemento('h2', '', title2));
    item2.appendChild(crearElemento('p', '', content2));
    
    cuadricula.appendChild(item1);
    cuadricula.appendChild(item2);
    seccion.appendChild(cuadricula);
    return seccion;
};

const crearSeccionRelaciones = (aliados, enemigos) => {
    const seccion = crearElemento('div', 'detalle-seccion');
    const cuadricula = crearElemento('div', 'cuadricula-info');
    
    const divAliados = crearElemento('div', 'item-info');
    divAliados.appendChild(crearElemento('h2', '', 'Aliados Principales'));
    const listaA = crearElemento('ul', 'lista-eventos');
    aliados.forEach(a => listaA.appendChild(crearElemento('li', '', a)));
    divAliados.appendChild(listaA);

    const divEnemigos = crearElemento('div', 'item-info');
    divEnemigos.appendChild(crearElemento('h2', '', 'Enemigos Clave'));
    const listaE = crearElemento('ul', 'lista-eventos');
    enemigos.forEach(e => listaE.appendChild(crearElemento('li', '', e)));
    divEnemigos.appendChild(listaE);

    cuadricula.appendChild(divAliados);
    cuadricula.appendChild(divEnemigos);
    seccion.appendChild(cuadricula);
    return seccion;
};

const alternarVistas = (mostrarInicio) => {
    vistaInicio.style.display = mostrarInicio ? 'block' : 'none';
    vistaDetalle.style.display = mostrarInicio ? 'none' : 'block';
};

// Navegación
navCapos.addEventListener('click', () => {
    seccionActual = 'capos';
    limpiarApp();
    navCapos.classList.add('activo');
    cuadriculaCapos.style.display = 'grid';
    subtitulo.textContent = 'Los 10 señores de la droga más impactantes de la historia';
    renderizarCuadriculaCapos();
});

navOrganizaciones.addEventListener('click', () => {
    seccionActual = 'organizaciones';
    limpiarApp();
    navOrganizaciones.classList.add('activo');
    cuadriculaOrganizaciones.style.display = 'grid';
    subtitulo.textContent = 'Las 10 organizaciones de la droga más impactantes de la historia';
    renderizarCuadriculaOrganizaciones();
});

botonVolver.addEventListener('click', () => alternarVistas(true));

// Inicialización
renderizarCuadriculaCapos();
