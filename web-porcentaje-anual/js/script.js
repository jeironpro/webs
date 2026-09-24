document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const anioActualTexto = document.getElementById('anio-actual-texto');
    const diasRestantesTexto = document.getElementById('dias-restantes');
    const gridDias = document.getElementById('grid-dias');
    const valorPorcentaje = document.getElementById('valor-porcentaje');
    const barraProgreso = document.getElementById('barra-progreso');

    /**
     * Calcula la información relevante sobre la fecha actual
     */
    const obtenerInformacionFecha = () => {
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        
        // Determinar si es bisiesto
        const esBisiesto = (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
        const totalDiasDelAnio = esBisiesto ? 366 : 365;

        // Calcular día del año (1-indexed)
        const inicioAnio = new Date(anio, 0, 1);
        const milisegundosPorDia = 1000 * 60 * 60 * 24;
        
        // Calcular diferencia y convertir a días
        const diferenciaMilisegundos = fechaActual - inicioAnio;
        const diaActualNumero = Math.floor(diferenciaMilisegundos / milisegundosPorDia) + 1;

        return {
            anio,
            diaActualNumero,
            totalDiasDelAnio
        };
    };

    /**
     * Genera la cuadrícula de puntos
     */
    const generarPuntos = (totalDias, diaActual) => {
        // Verificar si ya existen puntos para no regenerar todo (opcional, pero buena práctica)
        // En este caso simple, limpiamos y regeneramos.
        
        const fragmento = document.createDocumentFragment();

        for (let i = 1; i <= totalDias; i++) {
            const punto = document.createElement('div');
            punto.classList.add('punto-dia');
            
            // Estado completado
            if (i <= diaActual) {
                punto.classList.add('completado');
            }
            
            // Tooltip personalizado
            punto.setAttribute('data-tooltip', `Día ${i}`);
            
            fragmento.appendChild(punto);
        }
        
        // Limpiar y renderizar
        gridDias.innerHTML = ''; 
        gridDias.appendChild(fragmento);
    };

    /**
     * Actualiza toda la interfaz
     */
    const actualizarVista = () => {
        const { anio, diaActualNumero, totalDiasDelAnio } = obtenerInformacionFecha();
        
        // 1. Textos Generales
        anioActualTexto.textContent = anio;
        diasRestantesTexto.textContent = totalDiasDelAnio - diaActualNumero;

        // 2. Porcentaje
        const porcentajeExacto = (diaActualNumero / totalDiasDelAnio) * 100;
        const porcentajeRedondeado = Math.round(porcentajeExacto);
        
        valorPorcentaje.textContent = porcentajeRedondeado;

        // 3. Barra de Progreso
        // Pequeño delay para permitir que la transición CSS se vea al cargar
        setTimeout(() => {
            barraProgreso.style.width = `${porcentajeExacto}%`;
        }, 100);

        // 4. Grid
        generarPuntos(totalDiasDelAnio, diaActualNumero);
    };

    // Inicializar
    actualizarVista();
});